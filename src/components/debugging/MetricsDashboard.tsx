import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Server,
  Box,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Thermometer,
  Gauge
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface MetricData {
  timestamp: Date;
  value: number;
}

interface ResourceMetrics {
  cpu: {
    usage: number;
    limit: number;
    history: MetricData[];
  };
  memory: {
    usage: number;
    limit: number;
    history: MetricData[];
  };
  disk: {
    usage: number;
    limit: number;
    history: MetricData[];
  };
  network: {
    rx: number;
    tx: number;
    history: MetricData[];
  };
}

const MetricsDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'5m' | '1h' | '6h' | '24h'>('1h');
  const [selectedResource, setSelectedResource] = useState<'cluster' | 'nodes' | 'pods'>('cluster');
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    cpu: { usage: 45, limit: 100, history: [] },
    memory: { usage: 67, limit: 100, history: [] },
    disk: { usage: 23, limit: 100, history: [] },
    network: { rx: 1.2, tx: 0.8, history: [] }
  });
  
  const { clusterState } = useDebuggingStore();

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: {
          ...prev.cpu,
          usage: Math.max(0, Math.min(100, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          history: [
            ...prev.cpu.history.slice(-29),
            { timestamp: new Date(), value: prev.cpu.usage }
          ]
        },
        memory: {
          ...prev.memory,
          usage: Math.max(0, Math.min(100, prev.memory.usage + (Math.random() - 0.5) * 5)),
          history: [
            ...prev.memory.history.slice(-29),
            { timestamp: new Date(), value: prev.memory.usage }
          ]
        },
        disk: {
          ...prev.disk,
          usage: Math.max(0, Math.min(100, prev.disk.usage + (Math.random() - 0.5) * 2)),
          history: [
            ...prev.disk.history.slice(-29),
            { timestamp: new Date(), value: prev.disk.usage }
          ]
        },
        network: {
          ...prev.network,
          rx: Math.max(0, prev.network.rx + (Math.random() - 0.5) * 0.5),
          tx: Math.max(0, prev.network.tx + (Math.random() - 0.5) * 0.3),
          history: [
            ...prev.network.history.slice(-29),
            { timestamp: new Date(), value: prev.network.rx + prev.network.tx }
          ]
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (usage: number, threshold: { warning: number; critical: number }) => {
    if (usage >= threshold.critical) return 'text-red-600 bg-red-50 border-red-200';
    if (usage >= threshold.warning) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStatusIcon = (usage: number, threshold: { warning: number; critical: number }) => {
    if (usage >= threshold.critical) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (usage >= threshold.warning) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const renderMetricCard = (
    title: string,
    icon: React.ReactNode,
    value: number,
    unit: string,
    limit?: number,
    history?: MetricData[]
  ) => {
    const percentage = limit ? (value / limit) * 100 : value;
    const threshold = { warning: 70, critical: 90 };
    
    return (
      <motion.div
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon}
            <h3 className="font-medium text-slate-900">{title}</h3>
          </div>
          {getStatusIcon(percentage, threshold)}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-slate-900">
              {value.toFixed(1)}
            </span>
            <span className="text-sm text-slate-600 mb-1">{unit}</span>
            {limit && (
              <span className="text-sm text-slate-500 mb-1">/ {limit}{unit}</span>
            )}
          </div>
          
          {limit && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Usage</span>
                <span className={`font-medium ${
                  percentage >= threshold.critical ? 'text-red-600' :
                  percentage >= threshold.warning ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    percentage >= threshold.critical ? 'bg-red-500' :
                    percentage >= threshold.warning ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {history && history.length > 0 && (
            <div className="mt-4">
              <div className="h-16 flex items-end space-x-1">
                {history.slice(-20).map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-200 rounded-t"
                    style={{
                      height: `${(point.value / (limit || 100)) * 100}%`,
                      minHeight: '2px'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderNodeMetrics = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Node Metrics</h3>
        
        {clusterState.nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Server className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-slate-900">{node.name}</h4>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${
                node.status === 'Ready' 
                  ? 'text-green-600 bg-green-50 border-green-200'
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {node.status === 'Ready' ? 
                  <CheckCircle className="w-4 h-4" /> : 
                  <AlertTriangle className="w-4 h-4" />
                }
                <span className="text-sm font-medium">{node.status}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">CPU</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {node.metrics.cpu.usage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  {node.metrics.cpu.capacity} cores
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MemoryStick className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Memory</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {node.metrics.memory.usage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  {node.metrics.memory.capacity} GB
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Disk</span>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {node.metrics.disk.usage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  {node.metrics.disk.capacity} GB
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Pods: {node.pods.length}</span>
                <span className="text-slate-600">
                  Uptime: {Math.floor(Math.random() * 30) + 1} days
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPodMetrics = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-900">Pod Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusterState.pods.slice(0, 9).map((pod, index) => (
            <motion.div
              key={pod.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-slate-900 truncate">{pod.name}</h4>
                </div>
                
                <div className={`w-3 h-3 rounded-full ${
                  pod.status === 'Running' ? 'bg-green-500' :
                  pod.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">CPU</span>
                  <span className="font-medium">{(Math.random() * 200).toFixed(0)}m</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Memory</span>
                  <span className="font-medium">{(Math.random() * 512).toFixed(0)}Mi</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Restarts</span>
                  <span className="font-medium">{pod.restartCount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">Metrics Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Resource Type Selector */}
            <div className="flex bg-white rounded-lg p-1 border border-slate-200">
              {[
                { id: 'cluster', label: 'Cluster', icon: Gauge },
                { id: 'nodes', label: 'Nodes', icon: Server },
                { id: 'pods', label: 'Pods', icon: Box }
              ].map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedResource(option.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedResource === option.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Time Range Selector */}
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="5m">Last 5 minutes</option>
              <option value="1h">Last hour</option>
              <option value="6h">Last 6 hours</option>
              <option value="24h">Last 24 hours</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {selectedResource === 'cluster' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderMetricCard(
              'CPU Usage',
              <Cpu className="w-5 h-5 text-blue-600" />,
              metrics.cpu.usage,
              '%',
              metrics.cpu.limit,
              metrics.cpu.history
            )}
            
            {renderMetricCard(
              'Memory Usage',
              <MemoryStick className="w-5 h-5 text-green-600" />,
              metrics.memory.usage,
              '%',
              metrics.memory.limit,
              metrics.memory.history
            )}
            
            {renderMetricCard(
              'Disk Usage',
              <HardDrive className="w-5 h-5 text-purple-600" />,
              metrics.disk.usage,
              '%',
              metrics.disk.limit,
              metrics.disk.history
            )}
            
            {renderMetricCard(
              'Network I/O',
              <Network className="w-5 h-5 text-orange-600" />,
              metrics.network.rx + metrics.network.tx,
              'MB/s',
              undefined,
              metrics.network.history
            )}
          </div>
        )}
        
        {selectedResource === 'nodes' && renderNodeMetrics()}
        {selectedResource === 'pods' && renderPodMetrics()}
      </div>
    </div>
  );
};

export default MetricsDashboard;
