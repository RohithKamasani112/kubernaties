import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import {
  Box,
  Layers,
  Network,
  Route,
  FileText,
  Lock,
  HardDrive,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit3,
  Check,
  X,
  Trash2
} from 'lucide-react';
import { useKubernetesStore } from '../../../store/kubernetesStore';
import toast from 'react-hot-toast';

interface NodeData {
  label: string;
  componentType: string;
  config: any;
  status?: 'running' | 'pending' | 'error' | 'warning';
}

const KubernetesNode: React.FC<NodeProps<NodeData>> = ({ data, selected, id }) => {
  const [isEditingReplicas, setIsEditingReplicas] = useState(false);
  const [replicaValue, setReplicaValue] = useState(data.config?.replicas || 3);
  const { updateNodeConfig, removeNode } = useKubernetesStore();
  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      pod: Box,
      deployment: Layers,
      service: Network,
      ingress: Route,
      configmap: FileText,
      secret: Lock,
      pvc: HardDrive,
    };
    return icons[type] || Box;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getColor = (type: string) => {
    // Check if this is an orphaned pod
    if (data.orphaned && type === 'pod') {
      return 'text-red-600 bg-red-100 border-red-300 border-dashed';
    }

    const colors: Record<string, string> = {
      pod: 'text-blue-600 bg-blue-50 border-blue-200',
      deployment: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      service: 'text-purple-600 bg-purple-50 border-purple-200',
      ingress: 'text-orange-600 bg-orange-50 border-orange-200',
      configmap: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      secret: 'text-red-600 bg-red-50 border-red-200',
      pvc: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    };
    return colors[type] || 'text-slate-600 bg-slate-50 border-slate-200';
  };

  // Removed status icon to prevent re-render issues

  const handleReplicaEdit = () => {
    setIsEditingReplicas(true);
    setReplicaValue(data.config?.replicas || 3);
  };

  const handleReplicaSave = () => {
    const newReplicas = Math.max(1, Math.min(10, replicaValue)); // Limit between 1-10
    updateNodeConfig(id!, { replicas: newReplicas });
    setIsEditingReplicas(false);
    setReplicaValue(newReplicas);
  };

  const handleReplicaCancel = () => {
    setIsEditingReplicas(false);
    setReplicaValue(data.config?.replicas || 3);
  };

  const handleDelete = () => {
    const componentName = data.config?.name || data.label || data.componentType;
    removeNode(id!);
    toast.success(`Deleted ${data.componentType}: ${componentName}`, {
      icon: '🗑️',
      duration: 3000,
    });
  };

  const Icon = getIcon(data.componentType);
  const colorClasses = getColor(data.componentType);

  return (
    <motion.div
      className={`group px-4 py-3 border-2 rounded-xl bg-white shadow-sm min-w-[140px] relative ${colorClasses} ${
        selected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-slate-400 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-slate-400 !border-2 !border-white"
      />

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg z-10"
        title="Delete component"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* Node Content */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium truncate">
              {data.config.name || data.label}
            </h3>
            {getStatusIcon(data.status)}
          </div>
          <p className="text-xs opacity-75 truncate">
            {data.componentType}
            {data.orphaned && (
              <span className="ml-1 text-red-600 font-semibold">⚠️ Orphaned</span>
            )}
          </p>
        </div>
      </div>

      {/* Configuration Preview */}
      {data.config && (
        <div className="mt-2 pt-2 border-t border-current border-opacity-20">
          <div className="text-xs space-y-1 opacity-75">
            {data.componentType === 'pod' && (
              <div>Image: {data.config.image}</div>
            )}
            {data.componentType === 'deployment' && (
              <div className="flex items-center space-x-2">
                <span>Replicas:</span>
                {isEditingReplicas ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={replicaValue}
                      onChange={(e) => setReplicaValue(parseInt(e.target.value) || 1)}
                      className="w-12 h-5 text-xs border border-current border-opacity-30 rounded px-1 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleReplicaSave();
                        if (e.key === 'Escape') handleReplicaCancel();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleReplicaSave}
                      className="w-4 h-4 flex items-center justify-center hover:bg-current hover:bg-opacity-20 rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleReplicaCancel}
                      className="w-4 h-4 flex items-center justify-center hover:bg-current hover:bg-opacity-20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <span>{data.config.replicas}</span>
                    <button
                      onClick={handleReplicaEdit}
                      className="w-4 h-4 flex items-center justify-center hover:bg-current hover:bg-opacity-20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
            {data.componentType === 'service' && (
              <div>Port: {data.config.port}</div>
            )}
            {data.componentType === 'ingress' && (
              <div>Host: {data.config.host}</div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default KubernetesNode;