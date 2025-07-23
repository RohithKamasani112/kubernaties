import React from 'react';
import { motion } from 'framer-motion';
import { useKubernetesStore } from '../../store/kubernetesStore';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Activity,
  Network,
  Zap,
  Info,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

const StatusPanel: React.FC = () => {
  const { nodes, edges, simulationStatus } = useKubernetesStore();

  // Enhanced status calculation based on actual connections
  const calculateAppStatus = () => {
    if (nodes.length === 0) return { overall: 'stopped', components: 0, connections: 0, errors: 0, warnings: 0 };

    const deployments = nodes.filter(n => n.data.componentType === 'deployment');
    const services = nodes.filter(n => n.data.componentType === 'service');
    const pods = nodes.filter(n => n.data.componentType === 'pod');
    
    let errors = 0;
    let warnings = 0;

    // Check for service-deployment connections
    const serviceConnections = edges.filter(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      const targetNode = nodes.find(n => n.id === e.target);
      return (sourceNode?.data.componentType === 'service' && targetNode?.data.componentType === 'deployment') ||
             (sourceNode?.data.componentType === 'deployment' && targetNode?.data.componentType === 'service');
    });

    // If we have services but no connections to deployments/pods, that's an error
    if (services.length > 0 && serviceConnections.length === 0 && (deployments.length > 0 || pods.length > 0)) {
      errors++;
    }

    // If we have disconnected components, that's a warning
    const connectedNodeIds = new Set([...edges.map(e => e.source), ...edges.map(e => e.target)]);
    const disconnectedNodes = nodes.filter(n => !connectedNodeIds.has(n.id) && nodes.length > 1);
    if (disconnectedNodes.length > 0) {
      warnings += disconnectedNodes.length;
    }

    return {
      overall: errors > 0 ? 'error' : warnings > 0 ? 'warning' : nodes.length > 0 ? 'running' : 'stopped',
      components: nodes.length,
      connections: edges.length,
      errors,
      warnings
    };
  };

  const appStatus = calculateAppStatus();

  // Enhanced traffic logs with connection awareness
  const generateTrafficLogs = () => {
    const logs = [];
    const timestamp = new Date().toLocaleTimeString();

    if (appStatus.overall === 'running' && appStatus.connections > 0) {
      logs.push(
        { id: 1, time: timestamp, type: 'success', message: 'GET /api/health → Service → Pod (200 OK)', latency: '12ms' },
        { id: 2, time: timestamp, type: 'success', message: 'GET /api/users → Service → Pod (200 OK)', latency: '23ms' },
        { id: 3, time: timestamp, type: 'success', message: 'GET / → Ingress → Service → Pod (200 OK)', latency: '45ms' }
      );
    } else if (appStatus.errors > 0) {
      logs.push(
        { id: 1, time: timestamp, type: 'error', message: 'GET /api/health → Service (503 Service Unavailable)', latency: '1ms' },
        { id: 2, time: timestamp, type: 'error', message: 'Service has no endpoints - check selectors', latency: '-' }
      );
    } else if (appStatus.warnings > 0) {
      logs.push(
        { id: 1, time: timestamp, type: 'warning', message: 'Components deployed but not connected', latency: '-' },
        { id: 2, time: timestamp, type: 'warning', message: 'Traffic flow may be interrupted', latency: '-' }
      );
    } else {
      logs.push(
        { id: 1, time: timestamp, type: 'info', message: 'No active traffic - add components to start simulation', latency: '-' }
      );
    }

    return logs;
  };

  const trafficLogs = generateTrafficLogs();

  // Enhanced issues detection
  const detectIssues = () => {
    const issues = [];

    // Check for unconnected services
    const services = nodes.filter(n => n.data.componentType === 'service');
    const deployments = nodes.filter(n => n.data.componentType === 'deployment');
    
    if (services.length > 0 && deployments.length > 0) {
      const serviceConnections = edges.filter(e => {
        const sourceNode = nodes.find(n => n.id === e.source);
        const targetNode = nodes.find(n => n.id === e.target);
        return (sourceNode?.data.componentType === 'service' && targetNode?.data.componentType === 'deployment') ||
               (sourceNode?.data.componentType === 'deployment' && targetNode?.data.componentType === 'service');
      });

      if (serviceConnections.length === 0) {
        issues.push({
          type: 'error',
          title: 'Service not connected to deployment',
          description: 'Services need to be connected to deployments to route traffic',
          component: 'service-deployment',
          suggestion: 'Draw a connection line between your service and deployment'
        });
      }
    }

    // Check for isolated components
    const connectedNodeIds = new Set([...edges.map(e => e.source), ...edges.map(e => e.target)]);
    const isolatedNodes = nodes.filter(n => !connectedNodeIds.has(n.id) && nodes.length > 1);
    
    if (isolatedNodes.length > 0) {
      issues.push({
        type: 'warning',
        title: `${isolatedNodes.length} isolated component(s)`,
        description: 'These components are not connected to the rest of your application',
        component: 'isolated-components',
        suggestion: 'Connect components to enable traffic flow and communication'
      });
    }

    return issues;
  };

  const issues = detectIssues();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-emerald-600 bg-emerald-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'stopped': return 'text-slate-600 bg-slate-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'stopped': return <Clock className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'error': return <XCircle className="w-3 h-3 text-red-500" />;
      case 'info': return <Info className="w-3 h-3 text-blue-500" />;
      default: return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (appStatus.overall) {
      case 'running': return 'Application Running';
      case 'warning': return 'Application Warning';
      case 'error': return 'Application Error';
      case 'stopped': return 'No Application';
      default: return 'Unknown Status';
    }
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">App Status</h3>
          <div className="flex items-center space-x-2">
            {appStatus.connections > 0 && appStatus.errors === 0 && appStatus.warnings === 0 ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-slate-400" />
            )}
            <div className={`w-2 h-2 rounded-full ${
              appStatus.overall === 'running' && appStatus.connections > 0 && appStatus.errors === 0 && appStatus.warnings === 0
                ? 'bg-emerald-500 animate-pulse'
                : appStatus.errors > 0
                ? 'bg-red-500 animate-pulse'
                : appStatus.warnings > 0
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-slate-400'
            }`}></div>
            <span className="text-sm font-medium text-slate-800">
              {appStatus.errors > 0
                ? 'Error'
                : appStatus.warnings > 0
                ? 'Warning'
                : appStatus.overall === 'running' && appStatus.connections > 0
                ? 'Live'
                : appStatus.components > 0
                ? 'Deployed'
                : 'Offline'
              }
            </span>
          </div>
        </div>

        {/* Overall Status */}
        <div className={`p-3 rounded-xl ${
          appStatus.errors > 0
            ? 'bg-red-50 text-red-800 border border-red-200'
            : appStatus.warnings > 0
            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            : appStatus.overall === 'running' && appStatus.connections > 0
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-slate-50 text-slate-800 border border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {appStatus.errors > 0 ? (
                <XCircle className="w-4 h-4 text-red-600" />
              ) : appStatus.warnings > 0 ? (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              ) : appStatus.overall === 'running' && appStatus.connections > 0 ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-slate-600" />
              )}
              <span className="font-medium">
                {appStatus.errors > 0
                  ? 'Application Error'
                  : appStatus.warnings > 0
                  ? 'Application Warning'
                  : appStatus.overall === 'running' && appStatus.connections > 0
                  ? 'Application Running'
                  : appStatus.components > 0
                  ? 'Application Deployed'
                  : 'No Application'
                }
              </span>
            </div>
            {appStatus.overall === 'running' && appStatus.connections > 0 && appStatus.errors === 0 && appStatus.warnings === 0 && (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            )}
          </div>
          {appStatus.errors > 0 && (
            <p className="text-sm mt-1 opacity-90">
              {appStatus.errors} error{appStatus.errors !== 1 ? 's' : ''} detected
            </p>
          )}
          {appStatus.warnings > 0 && appStatus.errors === 0 && (
            <p className="text-sm mt-1 opacity-90">
              {appStatus.warnings} warning{appStatus.warnings !== 1 ? 's' : ''} detected
            </p>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 border-b border-slate-200">
        <h4 className="text-sm font-medium text-slate-900 mb-3">Quick Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Components</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-blue-900">{appStatus.components}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700">Connections</span>
              <Network className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-purple-900">{appStatus.connections}</div>
          </div>
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="p-4 border-b border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Issues & Suggestions</h4>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {issues.map((issue, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                issue.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start space-x-2">
                  {issue.type === 'error' ? (
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-sm font-medium mb-1 ${
                      issue.type === 'error' ? 'text-red-900' : 'text-yellow-900'
                    }`}>
                      {issue.title}
                    </h5>
                    <p className={`text-xs mb-2 ${
                      issue.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {issue.description}
                    </p>
                    <p className={`text-xs px-2 py-1 rounded ${
                      issue.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      💡 {issue.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Logs */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-900">Traffic Simulation</h4>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {trafficLogs.length > 0 ? (
            <div className="space-y-3">
              {trafficLogs.map((log) => (
                <motion.div
                  key={log.id}
                  className="p-3 bg-slate-50 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start space-x-2">
                    {getLogTypeIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">{log.time}</span>
                        <span className="text-xs text-slate-500">{log.latency}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-mono">
                        {log.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 mt-8">
              <Network className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No traffic simulation running</p>
              <p className="text-xs mt-1">Add and connect components to see traffic flow</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection Guide */}
      {appStatus.components > 1 && appStatus.connections === 0 && (
        <div className="p-4 border-t border-slate-200 bg-blue-50">
          <div className="text-center">
            <Network className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">Connect Your Components</p>
            <p className="text-xs text-blue-600 mt-1">
              Draw lines between components to enable traffic flow
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatusPanel;