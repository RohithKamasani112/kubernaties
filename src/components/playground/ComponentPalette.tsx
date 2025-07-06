import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Layers, 
  Network, 
  Route, 
  FileText, 
  Lock, 
  HardDrive,
  Users,
  Shield,
  Settings,
  Zap,
  Database,
  Globe,
  Activity,
  GitBranch,
  Cpu,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Cloud,
  Server,
  Monitor,
  Key,
  Webhook,
  AlertTriangle,
  Plus,
  Minus,
  Timer,
  Layers3,
  Container,
  Workflow,
  HelpCircle,
  Info,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

const ComponentPalette: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['workloads', 'networking']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLearningTips, setShowLearningTips] = useState(false);
  const [componentCounts, setComponentCounts] = useState<Record<string, number>>({
    pod: 1,
    deployment: 1,
    statefulset: 1,
    daemonset: 1,
    job: 1,
    cronjob: 1,
    replicaset: 1
  });

  const showComponentHelp = (componentType: string) => {
    const helpTexts: Record<string, string> = {
      'pod': 'Pods are the smallest deployable units. Start here to run a single container. Best for testing and simple applications.',
      'deployment': 'Deployments manage multiple Pod replicas. Use this for scalable applications that need high availability.',
      'service': 'Services expose your Pods to network traffic. Connect this to Deployments or Pods to make them accessible.',
      'ingress': 'Ingress manages external access to services. Connect this to Services to expose your app to the internet.',
      'configmap': 'ConfigMaps store configuration data. Connect to Pods/Deployments to inject config without rebuilding images.',
      'secret': 'Secrets store sensitive data like passwords. Connect to Pods/Deployments for secure credential management.',
    };

    const helpText = helpTexts[componentType] || 'This component helps manage your Kubernetes resources.';

    toast.success(helpText, {
      duration: 6000,
      icon: '💡',
      style: {
        maxWidth: '400px',
      },
    });
  };

  const showLearningTip = () => {
    const tips = [
      'Start with a Pod, then add a Service to expose it, and finally an Ingress for external access.',
      'Deployments are better than Pods for production - they provide scaling and self-healing.',
      'Always connect Services to Deployments/Pods using matching labels.',
      'Use ConfigMaps for configuration and Secrets for sensitive data like passwords.',
      'StatefulSets are for databases and apps that need persistent storage.',
      'NetworkPolicies control traffic between Pods - use them for security.',
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    toast.success(`💡 Learning Tip: ${randomTip}`, {
      duration: 8000,
      style: {
        maxWidth: '450px',
      },
    });
  };

  const incrementCount = (componentId: string) => {
    setComponentCounts(prev => ({
      ...prev,
      [componentId]: Math.min((prev[componentId] || 1) + 1, 10) // Max 10
    }));
  };

  const decrementCount = (componentId: string) => {
    setComponentCounts(prev => ({
      ...prev,
      [componentId]: Math.max((prev[componentId] || 1) - 1, 1) // Min 1
    }));
  };

  const componentCategories = [
    {
      name: 'Workloads',
      id: 'workloads',
      components: [
        { id: 'pod', name: 'Pod', icon: Box, color: 'text-blue-600 bg-blue-50', description: 'Basic execution unit', tooltip: 'Smallest deployable unit that can contain one or more containers' },
        { id: 'deployment', name: 'Deployment', icon: Layers, color: 'text-emerald-600 bg-emerald-50', description: 'Manage pod replicas', tooltip: 'Manages ReplicaSets and provides declarative updates to Pods' },
        { id: 'statefulset', name: 'StatefulSet', icon: Database, color: 'text-purple-600 bg-purple-50', description: 'Stateful applications', tooltip: 'Manages stateful applications with stable network identities' },
        { id: 'daemonset', name: 'DaemonSet', icon: Activity, color: 'text-indigo-600 bg-indigo-50', description: 'Node-wide services', tooltip: 'Ensures all nodes run a copy of a Pod' },
        { id: 'job', name: 'Job', icon: Zap, color: 'text-yellow-600 bg-yellow-50', description: 'Run-to-completion tasks', tooltip: 'Runs pods to completion for batch processing' },
        { id: 'cronjob', name: 'CronJob', icon: Timer, color: 'text-teal-600 bg-teal-50', description: 'Scheduled jobs', tooltip: 'Creates Jobs on a repeating schedule' },
        { id: 'replicaset', name: 'ReplicaSet', icon: Layers3, color: 'text-cyan-600 bg-cyan-50', description: 'Pod replica management', tooltip: 'Maintains a stable set of replica Pods running' },
      ]
    },
    {
      name: 'Networking',
      id: 'networking',
      components: [
        { id: 'service', name: 'Service', icon: Network, color: 'text-purple-600 bg-purple-50', description: 'Expose applications', tooltip: 'Exposes a logical set of Pods as a network service' },
        { id: 'ingress', name: 'Ingress', icon: Route, color: 'text-orange-600 bg-orange-50', description: 'External access', tooltip: 'Manages external access to services via HTTP/HTTPS' },
        { id: 'networkpolicy', name: 'NetworkPolicy', icon: Shield, color: 'text-red-600 bg-red-50', description: 'Network security', tooltip: 'Controls traffic flow between pods and namespaces' },
        { id: 'endpoint', name: 'Endpoint', icon: Globe, color: 'text-cyan-600 bg-cyan-50', description: 'Service endpoints', tooltip: 'Defines the network endpoints for a Service' },
        { id: 'endpointslice', name: 'EndpointSlice', icon: Globe, color: 'text-blue-600 bg-blue-50', description: 'Scalable endpoints', tooltip: 'Scalable and extensible alternative to Endpoints' },
        { id: 'ingressclass', name: 'IngressClass', icon: Route, color: 'text-violet-600 bg-violet-50', description: 'Ingress controller', tooltip: 'References the controller that implements the Ingress' },
      ]
    },
    {
      name: 'Configuration & Storage',
      id: 'config-storage',
      components: [
        { id: 'configmap', name: 'ConfigMap', icon: FileText, color: 'text-cyan-600 bg-cyan-50', description: 'Configuration data', tooltip: 'Stores non-confidential data in key-value pairs' },
        { id: 'secret', name: 'Secret', icon: Lock, color: 'text-red-600 bg-red-50', description: 'Sensitive data', tooltip: 'Stores and manages sensitive information like passwords' },
        { id: 'pvc', name: 'PVC', icon: HardDrive, color: 'text-indigo-600 bg-indigo-50', description: 'Persistent storage claim', tooltip: 'Request for storage by a user' },
        { id: 'pv', name: 'PV', icon: Database, color: 'text-purple-600 bg-purple-50', description: 'Persistent volume', tooltip: 'Piece of storage in the cluster provisioned by admin' },
        { id: 'storageclass', name: 'StorageClass', icon: Settings, color: 'text-slate-600 bg-slate-50', description: 'Storage provisioner', tooltip: 'Describes classes of storage offered by admin' },
        { id: 'volumesnapshot', name: 'VolumeSnapshot', icon: Database, color: 'text-emerald-600 bg-emerald-50', description: 'Volume backup', tooltip: 'Snapshot of a volume at a particular point in time' },
      ]
    },
    {
      name: 'Security & RBAC',
      id: 'security',
      components: [
        { id: 'serviceaccount', name: 'ServiceAccount', icon: Users, color: 'text-slate-600 bg-slate-50', description: 'Pod identity', tooltip: 'Provides an identity for processes running in a Pod' },
        { id: 'role', name: 'Role', icon: Shield, color: 'text-red-600 bg-red-50', description: 'Namespace permissions', tooltip: 'Sets permissions within a particular namespace' },
        { id: 'clusterrole', name: 'ClusterRole', icon: Lock, color: 'text-pink-600 bg-pink-50', description: 'Cluster permissions', tooltip: 'Sets permissions cluster-wide' },
        { id: 'rolebinding', name: 'RoleBinding', icon: Users, color: 'text-orange-600 bg-orange-50', description: 'Bind roles to users', tooltip: 'Grants permissions defined in a Role to users' },
        { id: 'clusterrolebinding', name: 'ClusterRoleBinding', icon: Globe, color: 'text-violet-600 bg-violet-50', description: 'Cluster role binding', tooltip: 'Grants permissions defined in ClusterRole cluster-wide' },
        { id: 'podsecuritypolicy', name: 'PodSecurityPolicy', icon: Shield, color: 'text-red-700 bg-red-100', description: 'Pod security rules', tooltip: 'Controls security-sensitive aspects of pod specification' },
        { id: 'securitycontextconstraints', name: 'SecurityContextConstraints', icon: Lock, color: 'text-pink-700 bg-pink-100', description: 'Security constraints', tooltip: 'Controls the actions that a pod can perform' },
      ]
    },
    {
      name: 'Autoscaling & Monitoring',
      id: 'autoscaling',
      components: [
        { id: 'hpa', name: 'HPA', icon: BarChart3, color: 'text-emerald-600 bg-emerald-50', description: 'Horizontal autoscaler', tooltip: 'Automatically scales number of pods based on metrics' },
        { id: 'vpa', name: 'VPA', icon: Cpu, color: 'text-blue-600 bg-blue-50', description: 'Vertical autoscaler', tooltip: 'Automatically adjusts CPU and memory requests' },
        { id: 'podmonitor', name: 'PodMonitor', icon: Activity, color: 'text-teal-600 bg-teal-50', description: 'Pod monitoring', tooltip: 'Defines monitoring for a set of pods' },
        { id: 'servicemonitor', name: 'ServiceMonitor', icon: BarChart3, color: 'text-green-600 bg-green-50', description: 'Service monitoring', tooltip: 'Defines monitoring for a service' },
        { id: 'prometheusrule', name: 'PrometheusRule', icon: Activity, color: 'text-orange-600 bg-orange-50', description: 'Alerting rules', tooltip: 'Defines Prometheus alerting and recording rules' },
      ]
    },
    {
      name: 'Advanced Resources',
      id: 'advanced',
      components: [
        { id: 'namespace', name: 'Namespace', icon: Container, color: 'text-slate-600 bg-slate-50', description: 'Resource isolation', tooltip: 'Virtual cluster backed by the same physical cluster' },
        { id: 'limitrange', name: 'LimitRange', icon: Settings, color: 'text-yellow-600 bg-yellow-50', description: 'Resource limits', tooltip: 'Constrains resource allocations per object in namespace' },
        { id: 'resourcequota', name: 'ResourceQuota', icon: BarChart3, color: 'text-red-600 bg-red-50', description: 'Resource quotas', tooltip: 'Provides constraints that limit aggregate resource consumption' },
        { id: 'priorityclass', name: 'PriorityClass', icon: Zap, color: 'text-purple-600 bg-purple-50', description: 'Pod priority', tooltip: 'Defines mapping from priority class name to priority integer' },
        { id: 'poddisruptionbudget', name: 'PodDisruptionBudget', icon: Shield, color: 'text-indigo-600 bg-indigo-50', description: 'Disruption protection', tooltip: 'Limits number of pods that are down simultaneously' },
        { id: 'mutatingwebhook', name: 'MutatingWebhook', icon: Webhook, color: 'text-cyan-600 bg-cyan-50', description: 'Admission controller', tooltip: 'Intercepts requests to modify objects before persistence' },
        { id: 'validatingwebhook', name: 'ValidatingWebhook', icon: Shield, color: 'text-emerald-600 bg-emerald-50', description: 'Validation webhook', tooltip: 'Intercepts requests to validate objects before persistence' },
        { id: 'customresourcedefinition', name: 'CRD', icon: Settings, color: 'text-purple-600 bg-purple-50', description: 'Custom resources', tooltip: 'Extends Kubernetes API with custom resource types' },
      ]
    },
    {
      name: 'Cluster Management',
      id: 'cluster',
      components: [
        { id: 'node', name: 'Node', icon: Server, color: 'text-gray-600 bg-gray-50', description: 'Worker node', tooltip: 'Worker machine in Kubernetes cluster' },
        { id: 'persistentvolume', name: 'PersistentVolume', icon: HardDrive, color: 'text-blue-600 bg-blue-50', description: 'Cluster storage', tooltip: 'Piece of storage in cluster provisioned by administrator' },
        { id: 'clusterissuer', name: 'ClusterIssuer', icon: Key, color: 'text-green-600 bg-green-50', description: 'Certificate issuer', tooltip: 'Represents certificate authority that can generate certificates' },
        { id: 'lease', name: 'Lease', icon: Timer, color: 'text-orange-600 bg-orange-50', description: 'Leader election', tooltip: 'Provides a locking mechanism for leader election' },
        { id: 'event', name: 'Event', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50', description: 'Cluster events', tooltip: 'Report on cluster events and state changes' },
      ]
    },
    {
      name: 'Operators & Extensions',
      id: 'operators',
      components: [
        { id: 'operator', name: 'Operator', icon: Workflow, color: 'text-purple-600 bg-purple-50', description: 'Custom controller', tooltip: 'Method of packaging, deploying and managing Kubernetes application' },
        { id: 'helmrelease', name: 'HelmRelease', icon: GitBranch, color: 'text-blue-600 bg-blue-50', description: 'Helm deployment', tooltip: 'Declarative configuration for Helm chart deployment' },
        { id: 'application', name: 'Application', icon: Box, color: 'text-green-600 bg-green-50', description: 'ArgoCD app', tooltip: 'ArgoCD application for GitOps deployment' },
        { id: 'certificate', name: 'Certificate', icon: Key, color: 'text-orange-600 bg-orange-50', description: 'TLS certificate', tooltip: 'Represents X.509 certificate managed by cert-manager' },
        { id: 'issuer', name: 'Issuer', icon: Shield, color: 'text-red-600 bg-red-50', description: 'Cert issuer', tooltip: 'Represents certificate authority that can generate certificates' },
      ]
    }
  ];

  const handleDragStart = (event: React.DragEvent, componentType: string) => {
    event.dataTransfer.setData('application/reactflow', componentType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredCategories = componentCategories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  return (
    <motion.div
      className="w-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col h-full shadow-sm"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <Box className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Components</h2>
          </div>
          <button
            onClick={showLearningTip}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
            title="Get a learning tip"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-600 mb-4 font-medium">Drag & drop to build your architecture</p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Scrollable Categories */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 component-palette-scroll" style={{ minHeight: '300px' }}>
        {filteredCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
            >
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 bg-gradient-to-r from-slate-100 to-slate-200 px-2 py-1 rounded-full border border-slate-200">
                  {category.components.length}
                </span>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                )}
              </div>
            </button>

            {/* Category Components */}
            <AnimatePresence>
              {expandedCategories.includes(category.id) && (
                <motion.div
                  className="space-y-1.5 px-3 pb-3 max-h-96 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white component-palette-scroll"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.components.map((component, componentIndex) => {
                    const Icon = component.icon;
                    return (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: componentIndex * 0.05 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component.id)}
                        className="p-3 border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-200 group bg-white relative hover:scale-[1.01] component-card"
                        title={component.tooltip}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${component.color} group-hover:scale-105 transition-transform duration-200 shadow-sm`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {component.name}
                            </h4>
                            <p className="text-xs text-slate-600 truncate">
                              {component.description}
                            </p>
                          </div>

                          {/* Counter controls for workload components */}
                          {category.id === 'workloads' && (
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  decrementCount(component.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Decrease count"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md min-w-[24px] text-center">
                                {componentCounts[component.id] || 1}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  incrementCount(component.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                title="Increase count"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              showComponentHelp(component.id);
                            }}
                            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Get help about this component"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Enhanced Tooltip */}
                        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white text-xs rounded-xl px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none whitespace-nowrap shadow-xl max-w-xs">
                          <div className="font-semibold mb-1">{component.name}</div>
                          <div className="text-slate-300">{component.tooltip}</div>
                          <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                        </div>

                        {/* Drag indicator */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Compact Tips */}
      <motion.div
        className="px-4 py-3 border-t border-slate-200 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 flex-shrink-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <Lightbulb className="w-3 h-3 text-white" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Quick Tips</h4>
          </div>
          <button
            onClick={() => setShowLearningTips(!showLearningTips)}
            className="text-xs text-slate-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-white/50"
          >
            {showLearningTips ? 'Hide' : 'Show'}
          </button>
        </div>

        <AnimatePresence>
          {showLearningTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-1.5"
            >
              {[
                { icon: "🎯", text: "Drag to canvas" },
                { icon: "🔗", text: "Connect with lines" },
                { icon: "⚙️", text: "Click to configure" }
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center space-x-2 text-xs text-slate-700 bg-white/70 rounded-lg px-3 py-1.5 border border-white/50"
                >
                  <span className="text-sm">{tip.icon}</span>
                  <span className="font-medium">{tip.text}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ComponentPalette;