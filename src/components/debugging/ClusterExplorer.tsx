import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Layers,
  Box,
  Network,
  Database,
  Shield,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Terminal,
  FileText,
  Settings,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  Activity
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface TreeNode {
  id: string;
  name: string;
  type: 'namespace' | 'node' | 'pod' | 'service' | 'deployment' | 'configmap' | 'secret';
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  children?: TreeNode[];
  metadata?: any;
}

const ClusterExplorer: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['namespace-default', 'namespace-kube-system']));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  
  const { clusterState, selectResource } = useDebuggingStore();

  // Build tree structure from cluster state
  const buildClusterTree = (): TreeNode[] => {
    const tree: TreeNode[] = [];

    // Add namespaces
    clusterState.namespaces.forEach(namespace => {
      const namespaceNode: TreeNode = {
        id: `namespace-${namespace}`,
        name: namespace,
        type: 'namespace',
        status: 'healthy',
        children: []
      };

      // Add pods in this namespace
      const namespacePods = clusterState.pods.filter(pod => pod.namespace === namespace);
      namespacePods.forEach(pod => {
        const podStatus = pod.status === 'Running' ? 'healthy' : 
                         pod.status === 'Pending' ? 'warning' : 'error';
        
        namespaceNode.children!.push({
          id: `pod-${pod.id}`,
          name: pod.name,
          type: 'pod',
          status: podStatus,
          metadata: pod
        });
      });

      // Add services in this namespace
      const namespaceServices = clusterState.services.filter(
        service => service.metadata.namespace === namespace
      );
      namespaceServices.forEach(service => {
        namespaceNode.children!.push({
          id: `service-${service.metadata.name}`,
          name: service.metadata.name,
          type: 'service',
          status: 'healthy',
          metadata: service
        });
      });

      // Add deployments in this namespace
      const namespaceDeployments = clusterState.deployments.filter(
        deployment => deployment.metadata.namespace === namespace
      );
      namespaceDeployments.forEach(deployment => {
        namespaceNode.children!.push({
          id: `deployment-${deployment.metadata.name}`,
          name: deployment.metadata.name,
          type: 'deployment',
          status: 'healthy',
          metadata: deployment
        });
      });

      tree.push(namespaceNode);
    });

    // Add nodes section
    if (clusterState.nodes.length > 0) {
      const nodesSection: TreeNode = {
        id: 'nodes-section',
        name: 'Nodes',
        type: 'node',
        status: 'healthy',
        children: clusterState.nodes.map(node => ({
          id: `node-${node.id}`,
          name: node.name,
          type: 'node',
          status: node.status === 'Ready' ? 'healthy' : 'error',
          metadata: node
        }))
      };
      tree.push(nodesSection);
    }

    return tree;
  };

  const getIcon = (type: string, status: string) => {
    const iconClass = status === 'healthy' ? 'text-green-500' :
                     status === 'warning' ? 'text-yellow-500' :
                     status === 'error' ? 'text-red-500' : 'text-slate-400';

    switch (type) {
      case 'namespace':
        return <Layers className={`w-4 h-4 ${iconClass}`} />;
      case 'node':
        return <Server className={`w-4 h-4 ${iconClass}`} />;
      case 'pod':
        return <Box className={`w-4 h-4 ${iconClass}`} />;
      case 'service':
        return <Network className={`w-4 h-4 ${iconClass}`} />;
      case 'deployment':
        return <Layers className={`w-4 h-4 ${iconClass}`} />;
      case 'configmap':
        return <FileText className={`w-4 h-4 ${iconClass}`} />;
      case 'secret':
        return <Shield className={`w-4 h-4 ${iconClass}`} />;
      default:
        return <Box className={`w-4 h-4 ${iconClass}`} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'warning':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default:
        return <div className="w-3 h-3 bg-slate-300 rounded-full" />;
    }
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
    if (node.metadata) {
      selectResource(node.metadata);
    }
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id}>
        <motion.div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
            isSelected ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm' : 'hover:bg-slate-50 hover:shadow-sm'
          }`}
          style={{ marginLeft: depth * 20 }}
          onClick={() => handleNodeSelect(node)}
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: depth * 0.05 }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-1 hover:bg-slate-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-slate-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-600" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-5" />}
          
          {getIcon(node.type, node.status)}
          
          <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
            {node.name}
          </span>
          
          {getStatusBadge(node.status)}
          
          {node.type === 'pod' && node.metadata && (
            <span className="text-xs text-slate-500 ml-auto">
              Restarts: {node.metadata.restartCount}
            </span>
          )}
        </motion.div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {node.children!.map(child => renderTreeNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderResourceDetails = () => {
    if (!selectedNode || !selectedNode.metadata) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Select a resource to view details</p>
          </div>
        </div>
      );
    }

    const resource = selectedNode.metadata;

    return (
      <div className="p-6 space-y-6">
        {/* Resource Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon(selectedNode.type, selectedNode.status)}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{selectedNode.name}</h3>
              <p className="text-sm text-slate-600 capitalize">{selectedNode.type}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(selectedNode.status)}
            <span className="text-sm font-medium capitalize">{selectedNode.status}</span>
          </div>
        </div>

        {/* Resource Metrics (for pods and nodes) */}
        {(selectedNode.type === 'pod' || selectedNode.type === 'node') && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">CPU</span>
              </div>
              <p className="text-lg font-semibold text-blue-700">
                {selectedNode.type === 'node' ? '45%' : '120m'}
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MemoryStick className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Memory</span>
              </div>
              <p className="text-lg font-semibold text-green-700">
                {selectedNode.type === 'node' ? '67%' : '256Mi'}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <HardDrive className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Disk</span>
              </div>
              <p className="text-lg font-semibold text-purple-700">
                {selectedNode.type === 'node' ? '23%' : '1Gi'}
              </p>
            </div>
          </div>
        )}

        {/* Resource Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900">Resource Details</h4>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap">
              {JSON.stringify(resource, null, 2)}
            </pre>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Terminal className="w-4 h-4" />
            <span>Describe</span>
          </button>
          
          {selectedNode.type === 'pod' && (
            <button className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <FileText className="w-4 h-4" />
              <span>Logs</span>
            </button>
          )}
          
          <button className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    );
  };

  const clusterTree = buildClusterTree();

  return (
    <div className="h-full flex bg-white overflow-hidden">
      {/* Tree View */}
      <div className="w-1/2 border-r border-slate-200 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Cluster Resources</h2>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('tree')}
                className={`p-2 rounded-lg ${viewMode === 'tree' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Activity className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cluster Status Summary */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">
                {clusterTree.reduce((acc, ns) => acc + (ns.children?.filter(c => c.status === 'healthy').length || 0), 0)} Healthy
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-600">
                {clusterTree.reduce((acc, ns) => acc + (ns.children?.filter(c => c.status === 'warning').length || 0), 0)} Warning
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-slate-600">
                {clusterTree.reduce((acc, ns) => acc + (ns.children?.filter(c => c.status === 'error').length || 0), 0)} Error
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {clusterTree.map(node => renderTreeNode(node))}
        </div>
      </div>

      {/* Details View */}
      <div className="w-1/2 overflow-y-auto">
        {renderResourceDetails()}
      </div>
    </div>
  );
};

export default ClusterExplorer;
