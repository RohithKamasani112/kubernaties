import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Activity,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Server,
  Box,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Zap,
  Bug,
  Shield,
  Lightbulb,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';
import ErrorExplanationModal from './ErrorExplanationModal';

interface LogFilter {
  level: string[];
  source: string[];
  timeRange: string;
  searchQuery: string;
  showCriticalOnly: boolean;
}

interface CriticalPattern {
  pattern: RegExp;
  type: 'error' | 'warning' | 'critical';
  description: string;
  suggestion?: string;
}

const LogViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'events'>('logs');
  const [isStreaming, setIsStreaming] = useState(true);
  const [selectedPod, setSelectedPod] = useState<string>('all');
  const [filter, setFilter] = useState<LogFilter>({
    level: ['INFO', 'WARN', 'ERROR'],
    source: [],
    timeRange: '1h',
    searchQuery: '',
    showCriticalOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showErrorExplanation, setShowErrorExplanation] = useState(false);
  const [selectedErrorText, setSelectedErrorText] = useState('');

  const logsRef = useRef<HTMLDivElement>(null);
  const { clusterState, executeCommand } = useDebuggingStore();

  // Critical error patterns for highlighting
  const criticalPatterns: CriticalPattern[] = [
    {
      pattern: /panic:|fatal:|segfault|segmentation fault/i,
      type: 'critical',
      description: 'Application crash detected',
      suggestion: 'Check application code and resource limits'
    },
    {
      pattern: /missing environment variable|env.*not found|undefined.*variable/i,
      type: 'error',
      description: 'Missing environment variable',
      suggestion: 'Add missing environment variables to deployment'
    },
    {
      pattern: /connection refused|connection timeout|network unreachable/i,
      type: 'error',
      description: 'Network connectivity issue',
      suggestion: 'Check service endpoints and network policies'
    },
    {
      pattern: /out of memory|oom|memory limit exceeded/i,
      type: 'critical',
      description: 'Memory limit exceeded',
      suggestion: 'Increase memory limits or optimize application'
    },
    {
      pattern: /permission denied|access denied|forbidden/i,
      type: 'error',
      description: 'Permission issue',
      suggestion: 'Check RBAC permissions and service accounts'
    },
    {
      pattern: /image.*not found|pull.*failed|imagepullbackoff/i,
      type: 'error',
      description: 'Container image issue',
      suggestion: 'Verify image name, tag, and registry access'
    },
    {
      pattern: /liveness probe failed|readiness probe failed/i,
      type: 'warning',
      description: 'Health check failure',
      suggestion: 'Check probe configuration and application health'
    }
  ];

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [clusterState.logs, autoScroll]);

  // Enhanced log level detection
  const detectLogLevel = (message: string): string => {
    const upperMessage = message.toUpperCase();
    if (upperMessage.includes('ERROR') || upperMessage.includes('FATAL') || upperMessage.includes('PANIC')) return 'ERROR';
    if (upperMessage.includes('WARN') || upperMessage.includes('WARNING')) return 'WARN';
    if (upperMessage.includes('INFO') || upperMessage.includes('INFORMATION')) return 'INFO';
    if (upperMessage.includes('DEBUG') || upperMessage.includes('TRACE')) return 'DEBUG';
    return 'INFO';
  };

  // Check if log matches critical patterns
  const getCriticalPattern = (message: string): CriticalPattern | null => {
    return criticalPatterns.find(pattern => pattern.pattern.test(message)) || null;
  };

  // Enhanced log level styling
  const getLogLevelColor = (level: string, isCritical: boolean = false) => {
    if (isCritical) {
      return 'bg-red-100 border-red-300 text-red-800';
    }

    switch (level) {
      case 'ERROR':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'WARN':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'INFO':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'DEBUG':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getLogLevelIcon = (level: string, isCritical: boolean = false) => {
    if (isCritical) {
      return <span className="text-lg animate-pulse">⚡</span>;
    }

    switch (level) {
      case 'ERROR':
        return <span className="text-lg">🔴</span>;
      case 'WARN':
        return <span className="text-lg">🟡</span>;
      case 'INFO':
        return <span className="text-lg">🟢</span>;
      case 'DEBUG':
        return <span className="text-lg">🔵</span>;
      case 'TRACE':
        return <span className="text-lg">⚪</span>;
      default:
        return <span className="text-lg">⚫</span>;
    }
  };

  const getLogLevelBadge = (level: string, isCritical: boolean = false) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-bold border shadow-sm';

    if (isCritical) {
      return `${baseClasses} bg-red-100 border-red-300 text-red-800 animate-pulse`;
    }

    switch (level) {
      case 'ERROR':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case 'WARN':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'INFO':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      case 'DEBUG':
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800`;
      case 'TRACE':
        return `${baseClasses} bg-purple-50 border-purple-200 text-purple-800`;
      default:
        return `${baseClasses} bg-slate-50 border-slate-200 text-slate-800`;
    }
  };

  // Simulate real-time log streaming based on current scenario
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Generate scenario-specific log entries
      const { currentScenario, addLogEntry } = useDebuggingStore.getState();

      if (currentScenario) {
        const baseTime = new Date();
        let newLogEntry;

        switch (currentScenario.id) {
          case 'crashloop-1':
            const crashMessages = [
              'Attempting to restart application...',
              'ERROR: Environment variable DATABASE_URL not found',
              'Failed to initialize database connection',
              'Container exiting with code 1',
              'Back-off restarting failed container'
            ];
            const crashMessage = crashMessages[Math.floor(Math.random() * crashMessages.length)];
            newLogEntry = {
              id: `log-${Date.now()}`,
              timestamp: baseTime,
              level: crashMessage.includes('ERROR') ? 'ERROR' as const :
                     crashMessage.includes('Failed') ? 'WARN' as const : 'INFO' as const,
              message: crashMessage,
              source: 'nginx-deployment-abc123',
              container: 'nginx'
            };
            break;

          case 'imagepull-1':
            const pullMessages = [
              'Attempting to pull image: private-registry.com/myapp:latest',
              'ERROR: Failed to pull image - access denied',
              'Back-off pulling image',
              'Waiting for image pull to retry'
            ];
            const pullMessage = pullMessages[Math.floor(Math.random() * pullMessages.length)];
            newLogEntry = {
              id: `log-${Date.now()}`,
              timestamp: baseTime,
              level: pullMessage.includes('ERROR') ? 'ERROR' as const :
                     pullMessage.includes('Back-off') ? 'WARN' as const : 'INFO' as const,
              message: pullMessage,
              source: 'frontend-deployment-ghi789',
              container: 'frontend'
            };
            break;

          default:
            // Generic log messages for other scenarios
            const genericMessages = [
              'System health check passed',
              'Processing incoming requests',
              'Memory usage: 45%',
              'CPU usage: 23%'
            ];
            const genericMessage = genericMessages[Math.floor(Math.random() * genericMessages.length)];
            newLogEntry = {
              id: `log-${Date.now()}`,
              timestamp: baseTime,
              level: 'INFO' as const,
              message: genericMessage,
              source: 'default-pod',
              container: 'app'
            };
        }

        addLogEntry(newLogEntry);

        // Also generate scenario-specific events occasionally
        if (Math.random() < 0.3) { // 30% chance to generate an event
          const { addEvent } = useDebuggingStore.getState();
          let newEvent;

          switch (currentScenario.id) {
            case 'crashloop-1':
              const crashEventMessages = [
                { reason: 'BackOff', message: 'Back-off restarting failed container nginx in pod nginx-deployment-abc123', type: 'Warning' as const },
                { reason: 'Unhealthy', message: 'Liveness probe failed: container not responding', type: 'Warning' as const },
                { reason: 'Killing', message: 'Stopping container nginx', type: 'Normal' as const }
              ];
              const crashEvent = crashEventMessages[Math.floor(Math.random() * crashEventMessages.length)];
              newEvent = {
                id: `event-${Date.now()}`,
                type: crashEvent.type,
                reason: crashEvent.reason,
                message: crashEvent.message,
                source: 'kubelet',
                firstTime: baseTime,
                lastTime: baseTime,
                count: 1,
                involvedObject: { kind: 'Pod', name: 'nginx-deployment-abc123', namespace: 'default' }
              };
              break;

            case 'imagepull-1':
              const pullEventMessages = [
                { reason: 'BackOff', message: 'Back-off pulling image "private-registry.com/myapp:latest"', type: 'Warning' as const },
                { reason: 'Failed', message: 'Failed to pull image: access denied', type: 'Warning' as const },
                { reason: 'Pulling', message: 'Pulling image "private-registry.com/myapp:latest"', type: 'Normal' as const }
              ];
              const pullEvent = pullEventMessages[Math.floor(Math.random() * pullEventMessages.length)];
              newEvent = {
                id: `event-${Date.now()}`,
                type: pullEvent.type,
                reason: pullEvent.reason,
                message: pullEvent.message,
                source: 'kubelet',
                firstTime: baseTime,
                lastTime: baseTime,
                count: 1,
                involvedObject: { kind: 'Pod', name: 'frontend-deployment-ghi789', namespace: 'default' }
              };
              break;

            default:
              // Generic events for other scenarios
              newEvent = {
                id: `event-${Date.now()}`,
                type: 'Normal' as const,
                reason: 'Heartbeat',
                message: 'Node heartbeat received',
                source: 'kubelet',
                firstTime: baseTime,
                lastTime: baseTime,
                count: 1,
                involvedObject: { kind: 'Node', name: 'worker-node-1', namespace: undefined }
              };
          }

          addEvent(newEvent);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = clusterState.logs.filter(log => {
    // Critical filter - if enabled, only show critical logs
    const criticalPattern = getCriticalPattern(log.message);
    if (filter.showCriticalOnly && !criticalPattern) return false;

    // Level filter
    if (!filter.level.includes(log.level)) return false;

    // Source filter
    if (filter.source.length > 0 && !filter.source.includes(log.source)) return false;

    // Pod filter
    if (selectedPod !== 'all' && log.source !== selectedPod) return false;

    // Search filter
    if (filter.searchQuery && !log.message.toLowerCase().includes(filter.searchQuery.toLowerCase())) {
      return false;
    }

    // Time range filter
    const now = new Date();
    const logTime = new Date(log.timestamp);
    const timeDiff = now.getTime() - logTime.getTime();

    switch (filter.timeRange) {
      case '5m':
        return timeDiff <= 5 * 60 * 1000;
      case '1h':
        return timeDiff <= 60 * 60 * 1000;
      case '24h':
        return timeDiff <= 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  }).map(log => ({
    ...log,
    criticalPattern: getCriticalPattern(log.message),
    detectedLevel: detectLogLevel(log.message)
  }));

  const filteredEvents = clusterState.events.filter(event => {
    // Search filter
    if (filter.searchQuery && !event.message.toLowerCase().includes(filter.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'WARN':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'DEBUG':
        return <CheckCircle className="w-4 h-4 text-slate-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventIcon = (type: string) => {
    return type === 'Warning' ? 
      <AlertTriangle className="w-4 h-4 text-yellow-500" /> :
      <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'WARN':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'INFO':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'DEBUG':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const downloadLogs = () => {
    const content = filteredLogs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.level} ${log.source}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `k8s-logs-${new Date().toISOString().split('T')[0]}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniquePods = Array.from(new Set(clusterState.logs.map(log => log.source)));

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-slate-900">Logs & Events</h2>
            
            {/* Tab Navigation */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'logs' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Logs</span>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                    {filteredLogs.length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('events')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'events' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Events</span>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                    {filteredEvents.length}
                  </span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                isStreaming 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStreaming ? 'Streaming' : 'Paused'}</span>
            </button>
            
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`p-2 rounded-lg transition-all ${
                autoScroll 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
            >
              {autoScroll ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={downloadLogs}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
              title="Download logs"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-all ${
                showFilters 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Toggle filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pt-4 border-t border-slate-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={filter.searchQuery}
                      onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                      placeholder="Search logs..."
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Pod Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pod</label>
                  <select
                    value={selectedPod}
                    onChange={(e) => setSelectedPod(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Pods</option>
                    {uniquePods.map(pod => (
                      <option key={pod} value={pod}>{pod}</option>
                    ))}
                  </select>
                </div>
                
                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Range</label>
                  <select
                    value={filter.timeRange}
                    onChange={(e) => setFilter(prev => ({ ...prev, timeRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5m">Last 5 minutes</option>
                    <option value="1h">Last hour</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="all">All time</option>
                  </select>
                </div>
                
                {/* Log Levels */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">🏷️ Log Levels</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { level: 'ERROR', emoji: '🔴', count: filteredLogs.filter(log => (log.detectedLevel || log.level) === 'ERROR').length },
                      { level: 'WARN', emoji: '🟡', count: filteredLogs.filter(log => (log.detectedLevel || log.level) === 'WARN').length },
                      { level: 'INFO', emoji: '🟢', count: filteredLogs.filter(log => (log.detectedLevel || log.level) === 'INFO').length },
                      { level: 'DEBUG', emoji: '🔵', count: filteredLogs.filter(log => (log.detectedLevel || log.level) === 'DEBUG').length }
                    ].map(({ level, emoji, count }) => (
                      <button
                        key={level}
                        onClick={() => {
                          const newLevels = filter.level.includes(level)
                            ? filter.level.filter(l => l !== level)
                            : [...filter.level, level];
                          setFilter(prev => ({ ...prev, level: newLevels }));
                        }}
                        className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-lg border transition-all shadow-sm hover:shadow-md ${
                          filter.level.includes(level)
                            ? getLogLevelBadge(level).replace('px-2 py-1 rounded-full text-xs font-bold', 'px-3 py-2 rounded-lg text-sm font-medium')
                            : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={`${level} logs (${count})`}
                      >
                        <span className="text-base">{emoji}</span>
                        <span className="font-medium">{level}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                          filter.level.includes(level) ? 'bg-white bg-opacity-30' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Quick filter buttons */}
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, level: ['ERROR'] }))}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      🔴 Errors Only
                    </button>
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, level: ['ERROR', 'WARN'] }))}
                      className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                    >
                      ⚠️ Errors & Warnings
                    </button>
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, level: ['ERROR', 'WARN', 'INFO', 'DEBUG'] }))}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      📋 All Levels
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center space-x-4">
                  {/* Critical Only Filter */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.showCriticalOnly}
                      onChange={(e) => setFilter(prev => ({ ...prev, showCriticalOnly: e.target.checked }))}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-red-600" />
                      <span>Critical Only</span>
                    </span>
                  </label>

                  {/* Auto Scroll Toggle */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Auto Scroll</span>
                  </label>
                </div>

                {/* Filter Summary */}
                <div className="text-sm text-slate-500">
                  {filteredLogs.length} logs • {filteredLogs.filter(log => log.criticalPattern).length} critical
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'logs' ? (
          <div 
            ref={logsRef}
            className="h-full overflow-y-auto p-4 space-y-2 font-mono text-sm"
          >
            {filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No logs found matching the current filters</p>
                </div>
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isCritical = !!log.criticalPattern;
                const effectiveLevel = log.detectedLevel || log.level;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-all border-l-4 ${
                      isCritical
                        ? 'bg-red-50 border-l-red-500 shadow-md'
                        : 'bg-slate-50 border-l-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {getLogLevelIcon(effectiveLevel, isCritical)}
                      <span className="text-xs text-slate-500">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1 flex-wrap">
                        <span className={getLogLevelBadge(effectiveLevel, isCritical)}>
                          {getLogLevelIcon(effectiveLevel, isCritical)}
                          <span className="ml-1">{effectiveLevel}</span>
                        </span>
                        {isCritical && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 border border-red-300 flex items-center space-x-1 font-bold animate-pulse">
                            <span>⚡</span>
                            <span>CRITICAL</span>
                          </span>
                        )}
                        <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full border border-slate-200 font-medium">
                          📦 {log.source}
                        </span>
                        {log.container && (
                          <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            🐳 {log.container}
                          </span>
                        )}
                      </div>

                      <p className={`break-words ${isCritical ? 'text-red-800 font-medium' : 'text-slate-800'}`}>
                        {log.message}
                      </p>

                      {/* Critical pattern suggestion */}
                      {log.criticalPattern && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg shadow-sm"
                        >
                          <div className="flex items-start space-x-2 mb-2">
                            <span className="text-lg">💡</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-800 text-sm">{log.criticalPattern.description}</h4>
                              {log.criticalPattern.suggestion && (
                                <p className="text-red-700 text-sm mt-1">{log.criticalPattern.suggestion}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => executeCommand('kubectl describe pod ' + log.source)}
                              className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 transition-colors"
                            >
                              <span>🔍</span>
                              <span>Investigate</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedErrorText(log.message);
                                setShowErrorExplanation(true);
                              }}
                              className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200 transition-colors"
                            >
                              <span>📚</span>
                              <span>Learn More</span>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Explain Error Button for error logs */}
                      {(effectiveLevel === 'ERROR' || effectiveLevel === 'WARN') && !isCritical && (
                        <div className="mt-2 flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedErrorText(log.message);
                              setShowErrorExplanation(true);
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-xs hover:from-blue-100 hover:to-indigo-100 transition-all shadow-sm border border-blue-200"
                          >
                            <span>🔍</span>
                            <span>Explain this Error</span>
                          </button>
                          {effectiveLevel === 'ERROR' && (
                            <button
                              onClick={() => executeCommand(`kubectl logs ${log.source} --previous`)}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 rounded-lg text-xs hover:from-orange-100 hover:to-yellow-100 transition-all shadow-sm border border-orange-200"
                            >
                              <span>⏮️</span>
                              <span>Previous Logs</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {filteredEvents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No events found</p>
                </div>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {getEventIcon(event.type)}
                    <span className="text-xs text-slate-500">
                      {event.lastTime.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-md ${
                        event.type === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {event.reason}
                      </span>
                      <span className="text-xs text-slate-600">
                        {event.involvedObject.kind}/{event.involvedObject.name}
                      </span>
                      {event.count > 1 && (
                        <span className="text-xs text-slate-500">({event.count}x)</span>
                      )}
                    </div>
                    <p className="text-slate-800 break-words">{event.message}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error Explanation Modal */}
      <ErrorExplanationModal
        isOpen={showErrorExplanation}
        onClose={() => setShowErrorExplanation(false)}
        errorText={selectedErrorText}
        onExecuteCommand={executeCommand}
      />
    </div>
  );
};

export default LogViewer;
