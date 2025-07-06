import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X, Shield } from 'lucide-react';
import { useKubernetesStore } from '../../store/kubernetesStore';
import { Node, Edge } from 'reactflow';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
}

const ArchitectureValidator: React.FC = () => {
  const { nodes, edges } = useKubernetesStore();
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const validateArchitecture = (nodes: Node[], edges: Edge[]): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    // Check for isolated workloads
    const workloads = nodes.filter(n => ['pod', 'deployment', 'statefulset'].includes(n.data.componentType));
    const services = nodes.filter(n => n.data.componentType === 'service');
    
    workloads.forEach(workload => {
      const hasServiceConnection = edges.some(edge => 
        (edge.source === workload.id && services.some(s => s.id === edge.target)) ||
        (edge.target === workload.id && services.some(s => s.id === edge.source))
      );
      
      if (!hasServiceConnection && services.length > 0) {
        issues.push({
          id: `isolated-workload-${workload.id}`,
          type: 'warning',
          title: 'Isolated Workload',
          description: `${workload.data.componentType} "${workload.data.label || workload.id}" is not connected to any Service.`,
          suggestion: 'Connect your workload to a Service to make it accessible within the cluster.'
        });
      }
    });

    // Check for services without workloads
    services.forEach(service => {
      const hasWorkloadConnection = edges.some(edge => 
        (edge.source === service.id && workloads.some(w => w.id === edge.target)) ||
        (edge.target === service.id && workloads.some(w => w.id === edge.source))
      );
      
      if (!hasWorkloadConnection && workloads.length > 0) {
        issues.push({
          id: `orphaned-service-${service.id}`,
          type: 'error',
          title: 'Orphaned Service',
          description: `Service "${service.data.label || service.id}" is not connected to any workload.`,
          suggestion: 'Connect your Service to a Deployment, Pod, or StatefulSet to route traffic properly.'
        });
      }
    });

    // Check for ingress without services
    const ingresses = nodes.filter(n => n.data.componentType === 'ingress');
    ingresses.forEach(ingress => {
      const hasServiceConnection = edges.some(edge => 
        (edge.source === ingress.id && services.some(s => s.id === edge.target)) ||
        (edge.target === ingress.id && services.some(s => s.id === edge.source))
      );
      
      if (!hasServiceConnection && services.length > 0) {
        issues.push({
          id: `orphaned-ingress-${ingress.id}`,
          type: 'error',
          title: 'Orphaned Ingress',
          description: `Ingress "${ingress.data.label || ingress.id}" is not connected to any Service.`,
          suggestion: 'Connect your Ingress to a Service to enable external access to your application.'
        });
      }
    });

    // Check for missing security configurations
    if (workloads.length > 0) {
      const hasSecrets = nodes.some(n => n.data.componentType === 'secret');
      const hasNetworkPolicies = nodes.some(n => n.data.componentType === 'networkpolicy');
      
      if (!hasSecrets) {
        issues.push({
          id: 'missing-secrets',
          type: 'info',
          title: 'Consider Adding Secrets',
          description: 'Your application might benefit from using Secrets for sensitive data.',
          suggestion: 'Add Secret components to securely store passwords, API keys, and certificates.'
        });
      }
      
      if (!hasNetworkPolicies && workloads.length > 1) {
        issues.push({
          id: 'missing-network-policies',
          type: 'info',
          title: 'Consider Network Security',
          description: 'Multiple workloads detected without network policies.',
          suggestion: 'Add NetworkPolicy components to control traffic between your Pods for better security.'
        });
      }
    }

    // Check for missing persistent storage
    const statefulSets = nodes.filter(n => n.data.componentType === 'statefulset');
    if (statefulSets.length > 0) {
      const hasPVC = nodes.some(n => n.data.componentType === 'pvc');
      if (!hasPVC) {
        issues.push({
          id: 'missing-storage',
          type: 'warning',
          title: 'StatefulSet Without Storage',
          description: 'StatefulSets typically require persistent storage.',
          suggestion: 'Add PersistentVolumeClaim (PVC) components for data persistence.'
        });
      }
    }

    // Check for best practices
    if (nodes.filter(n => n.data.componentType === 'pod').length > 0 && 
        nodes.filter(n => n.data.componentType === 'deployment').length === 0) {
      issues.push({
        id: 'prefer-deployments',
        type: 'info',
        title: 'Consider Using Deployments',
        description: 'Raw Pods are not recommended for production workloads.',
        suggestion: 'Use Deployments instead of Pods for better scaling, rolling updates, and self-healing.'
      });
    }

    return issues;
  };

  useEffect(() => {
    const newIssues = validateArchitecture(nodes, edges);
    setIssues(newIssues);
    
    // Auto-show if there are errors
    if (newIssues.some(issue => issue.type === 'error')) {
      setIsVisible(true);
    }
  }, [nodes, edges]);

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;

  if (issues.length === 0) {
    return (
      <motion.div
        className="fixed top-20 right-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-sm z-40"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
      >
        <div className="flex items-center space-x-2 text-emerald-700">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Architecture looks good!</span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Floating indicator */}
      {!isVisible && (
        <motion.button
          onClick={() => setIsVisible(true)}
          className={`fixed top-20 right-4 p-3 rounded-lg shadow-lg z-40 ${
            errorCount > 0 ? 'bg-red-500 text-white' : 
            warningCount > 0 ? 'bg-yellow-500 text-white' : 
            'bg-blue-500 text-white'
          }`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">
              {errorCount > 0 ? `${errorCount} Error${errorCount > 1 ? 's' : ''}` :
               warningCount > 0 ? `${warningCount} Warning${warningCount > 1 ? 's' : ''}` :
               `${issues.length} Suggestion${issues.length > 1 ? 's' : ''}`}
            </span>
          </div>
        </motion.button>
      )}

      {/* Full panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-20 right-4 w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-40 max-h-96 overflow-hidden"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Architecture Validation</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Issues list */}
            <div className="max-h-80 overflow-y-auto">
              {issues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  className={`p-4 border-b border-slate-100 last:border-b-0 ${getIssueColor(issue.type)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {issue.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 italic">
                        💡 {issue.suggestion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArchitectureValidator;
