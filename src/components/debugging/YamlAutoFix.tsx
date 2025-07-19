import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Zap,
  Copy,
  Download,
  Play,
  Eye,
  EyeOff,
  Settings,
  Lightbulb,
  Target,
  Code,
  RefreshCw,
  X,
  Plus
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface YamlIssue {
  id: string;
  type: 'missing-field' | 'incorrect-value' | 'deprecated' | 'security' | 'performance' | 'best-practice';
  severity: 'critical' | 'high' | 'medium' | 'low';
  line?: number;
  field: string;
  message: string;
  description: string;
  currentValue?: string;
  suggestedValue?: string;
  suggestedYaml?: string;
  autoFixable: boolean;
  reason: string;
}

interface YamlAutoFixProps {
  yamlContent?: string;
  resourceType?: string;
  resourceName?: string;
  onApplyFix?: (fixedYaml: string) => void;
}

const YamlAutoFix: React.FC<YamlAutoFixProps> = ({
  yamlContent = '',
  resourceType = 'deployment',
  resourceName = 'example-app',
  onApplyFix
}) => {
  const [issues, setIssues] = useState<YamlIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fixedYaml, setFixedYaml] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  
  const { executeCommand } = useDebuggingStore();

  // Sample YAML for demonstration
  const sampleYaml = yamlContent || `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${resourceName}
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${resourceName}
  template:
    metadata:
      labels:
        app: ${resourceName}
    spec:
      containers:
      - name: app
        image: nginx:latest
        ports:
        - containerPort: 80
        # Missing resource limits
        # Missing liveness/readiness probes
        # Using latest tag (not recommended)
        env:
        - name: ENV
          value: "production"`;

  // Analyze YAML for common issues
  const analyzeYaml = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const detectedIssues: YamlIssue[] = [];

    // Check for missing resource limits
    if (!sampleYaml.includes('resources:')) {
      detectedIssues.push({
        id: 'missing-resources',
        type: 'missing-field',
        severity: 'high',
        field: 'spec.template.spec.containers[].resources',
        message: 'Missing resource limits and requests',
        description: 'Containers should have resource limits and requests defined to prevent resource starvation and ensure proper scheduling.',
        suggestedYaml: `        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"`,
        autoFixable: true,
        reason: 'Resource limits prevent containers from consuming excessive resources and help the scheduler make better placement decisions.'
      });
    }

    // Check for missing health checks
    if (!sampleYaml.includes('livenessProbe:')) {
      detectedIssues.push({
        id: 'missing-liveness-probe',
        type: 'missing-field',
        severity: 'medium',
        field: 'spec.template.spec.containers[].livenessProbe',
        message: 'Missing liveness probe',
        description: 'Liveness probes help Kubernetes determine when to restart a container if it becomes unresponsive.',
        suggestedYaml: `        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10`,
        autoFixable: true,
        reason: 'Liveness probes ensure that unhealthy containers are automatically restarted, improving application reliability.'
      });
    }

    if (!sampleYaml.includes('readinessProbe:')) {
      detectedIssues.push({
        id: 'missing-readiness-probe',
        type: 'missing-field',
        severity: 'medium',
        field: 'spec.template.spec.containers[].readinessProbe',
        message: 'Missing readiness probe',
        description: 'Readiness probes help Kubernetes determine when a container is ready to accept traffic.',
        suggestedYaml: `        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5`,
        autoFixable: true,
        reason: 'Readiness probes prevent traffic from being sent to containers that are not yet ready to handle requests.'
      });
    }

    // Check for latest tag usage
    if (sampleYaml.includes(':latest')) {
      detectedIssues.push({
        id: 'latest-tag-usage',
        type: 'best-practice',
        severity: 'medium',
        field: 'spec.template.spec.containers[].image',
        message: 'Using "latest" tag is not recommended',
        description: 'Using specific version tags instead of "latest" ensures reproducible deployments and prevents unexpected updates.',
        currentValue: 'nginx:latest',
        suggestedValue: 'nginx:1.21.6',
        autoFixable: true,
        reason: 'Specific tags ensure that deployments are reproducible and prevent unexpected behavior from image updates.'
      });
    }

    // Check for missing security context
    if (!sampleYaml.includes('securityContext:')) {
      detectedIssues.push({
        id: 'missing-security-context',
        type: 'security',
        severity: 'high',
        field: 'spec.template.spec.securityContext',
        message: 'Missing security context',
        description: 'Security contexts define privilege and access control settings for pods and containers.',
        suggestedYaml: `      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000`,
        autoFixable: true,
        reason: 'Security contexts help enforce security policies and reduce the attack surface of your applications.'
      });
    }

    // Check for missing labels
    const hasRecommendedLabels = sampleYaml.includes('version:') && sampleYaml.includes('component:');
    if (!hasRecommendedLabels) {
      detectedIssues.push({
        id: 'missing-recommended-labels',
        type: 'best-practice',
        severity: 'low',
        field: 'metadata.labels',
        message: 'Missing recommended labels',
        description: 'Adding standard labels helps with resource organization, monitoring, and management.',
        suggestedYaml: `  labels:
    app: ${resourceName}
    version: "1.0.0"
    component: "web"
    part-of: "myapp"
    managed-by: "kubectl"`,
        autoFixable: true,
        reason: 'Standard labels improve resource discoverability and enable better monitoring and management practices.'
      });
    }

    // Check for missing node selector or affinity
    if (!sampleYaml.includes('nodeSelector:') && !sampleYaml.includes('affinity:')) {
      detectedIssues.push({
        id: 'missing-scheduling-constraints',
        type: 'performance',
        severity: 'low',
        field: 'spec.template.spec.nodeSelector',
        message: 'Consider adding scheduling constraints',
        description: 'Node selectors or affinity rules can help ensure pods are scheduled on appropriate nodes.',
        suggestedYaml: `      nodeSelector:
        kubernetes.io/os: linux
        # Or use affinity for more complex rules`,
        autoFixable: true,
        reason: 'Scheduling constraints help ensure workloads run on nodes that meet their specific requirements.'
      });
    }

    setIssues(detectedIssues);
    setIsAnalyzing(false);
  };

  // Generate fixed YAML
  const generateFixedYaml = () => {
    let fixed = sampleYaml;
    
    selectedIssues.forEach(issueId => {
      const issue = issues.find(i => i.id === issueId);
      if (!issue || !issue.autoFixable) return;

      switch (issue.id) {
        case 'missing-resources':
          fixed = fixed.replace(
            /(\s+)ports:\s*\n(\s+- containerPort: \d+)/,
            `$1ports:\n$2\n$1resources:\n$1  limits:\n$1    memory: "512Mi"\n$1    cpu: "500m"\n$1  requests:\n$1    memory: "256Mi"\n$1    cpu: "250m"`
          );
          break;
        case 'missing-liveness-probe':
          fixed = fixed.replace(
            /(\s+)(env:|$)/,
            `$1livenessProbe:\n$1  httpGet:\n$1    path: /health\n$1    port: 80\n$1  initialDelaySeconds: 30\n$1  periodSeconds: 10\n$1$2`
          );
          break;
        case 'missing-readiness-probe':
          fixed = fixed.replace(
            /(\s+)(env:|$)/,
            `$1readinessProbe:\n$1  httpGet:\n$1    path: /ready\n$1    port: 80\n$1  initialDelaySeconds: 5\n$1  periodSeconds: 5\n$1$2`
          );
          break;
        case 'latest-tag-usage':
          fixed = fixed.replace(/nginx:latest/g, 'nginx:1.21.6');
          break;
        case 'missing-security-context':
          fixed = fixed.replace(
            /(\s+)containers:/,
            `$1securityContext:\n$1  runAsNonRoot: true\n$1  runAsUser: 1000\n$1  fsGroup: 2000\n$1containers:`
          );
          break;
        case 'missing-recommended-labels':
          fixed = fixed.replace(
            /(metadata:\s*\n\s+name: [^\n]+\n\s+namespace: [^\n]+)/,
            `$1\n  labels:\n    app: ${resourceName}\n    version: "1.0.0"\n    component: "web"\n    part-of: "myapp"\n    managed-by: "kubectl"`
          );
          break;
        case 'missing-scheduling-constraints':
          fixed = fixed.replace(
            /(\s+)containers:/,
            `$1nodeSelector:\n$1  kubernetes.io/os: linux\n$1containers:`
          );
          break;
      }
    });

    setFixedYaml(fixed);
  };

  useEffect(() => {
    analyzeYaml();
  }, [sampleYaml]);

  useEffect(() => {
    if (selectedIssues.size > 0) {
      generateFixedYaml();
    }
  }, [selectedIssues, issues]);

  const toggleIssueSelection = (issueId: string) => {
    setSelectedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
      } else {
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  const selectAllIssues = () => {
    setSelectedIssues(new Set(issues.filter(i => i.autoFixable).map(i => i.id)));
  };

  const clearSelection = () => {
    setSelectedIssues(new Set());
  };

  const applyFixes = () => {
    if (onApplyFix && fixedYaml) {
      onApplyFix(fixedYaml);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50 text-red-800';
      case 'high': return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-slate-200 bg-slate-50 text-slate-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'missing-field': return <Plus className="w-4 h-4" />;
      case 'incorrect-value': return <Settings className="w-4 h-4" />;
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'best-practice': return <Lightbulb className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-slate-900">YAML Auto-Fix</h3>
          {isAnalyzing && (
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
              showPreview ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>Preview</span>
          </button>
          
          <button
            onClick={analyzeYaml}
            disabled={isAnalyzing}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Re-analyze</span>
          </button>
        </div>
      </div>

      {/* Issues Summary */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-900">
            Found {issues.length} potential improvements
          </h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={selectAllIssues}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={clearSelection}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          {['critical', 'high', 'medium', 'low'].map(severity => {
            const count = issues.filter(i => i.severity === severity).length;
            return (
              <div key={severity} className="p-2 bg-white rounded border">
                <div className={`text-lg font-bold ${
                  severity === 'critical' ? 'text-red-600' :
                  severity === 'high' ? 'text-orange-600' :
                  severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`}>
                  {count}
                </div>
                <div className="text-xs text-slate-600 capitalize">{severity}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3 mb-6">
        {issues.map(issue => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={selectedIssues.has(issue.id)}
                onChange={() => toggleIssueSelection(issue.id)}
                disabled={!issue.autoFixable}
                className="mt-1 w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getTypeIcon(issue.type)}
                  <h4 className="font-medium text-slate-900">{issue.message}</h4>
                  <span className="px-2 py-0.5 text-xs bg-white bg-opacity-60 rounded capitalize">
                    {issue.severity}
                  </span>
                  {issue.autoFixable && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                      Auto-fixable
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-slate-700 mb-2">{issue.description}</p>
                <p className="text-sm text-slate-600 mb-3">
                  <strong>Field:</strong> {issue.field}
                </p>
                
                {issue.suggestedYaml && (
                  <div className="bg-slate-900 text-green-400 p-3 rounded text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Suggested addition:</span>
                      <button
                        onClick={() => copyToClipboard(issue.suggestedYaml!)}
                        className="p-1 text-slate-400 hover:text-green-400"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap">{issue.suggestedYaml}</pre>
                  </div>
                )}
                
                <div className="mt-2 text-xs text-slate-600">
                  <strong>Why:</strong> {issue.reason}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      {selectedIssues.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            {selectedIssues.size} fix{selectedIssues.size > 1 ? 'es' : ''} selected
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Changes</span>
            </button>
            <button
              onClick={applyFixes}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Play className="w-4 h-4" />
              <span>Apply Fixes</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && fixedYaml && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Fixed YAML Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="bg-slate-900 text-green-400 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Fixed YAML:</span>
                    <button
                      onClick={() => copyToClipboard(fixedYaml)}
                      className="flex items-center space-x-1 px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm">{fixedYaml}</pre>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 p-4 border-t border-slate-200">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    applyFixes();
                    setShowPreview(false);
                  }}
                  className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Play className="w-4 h-4" />
                  <span>Apply Fixes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YamlAutoFix;
