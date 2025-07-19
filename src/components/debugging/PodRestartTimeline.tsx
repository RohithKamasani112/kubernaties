import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  RotateCcw,
  Zap,
  Eye,
  EyeOff,
  Calendar,
  BarChart3,
  Filter,
  Download,
  RefreshCw,
  Target,
  TrendingDown,
  Pause,
  Play,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface RestartEvent {
  id: string;
  podName: string;
  timestamp: Date;
  reason: string;
  exitCode?: number;
  restartCount: number;
  duration?: number; // Time between restarts in seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'oom' | 'crash' | 'probe' | 'config' | 'resource' | 'unknown';
}

interface TimelineData {
  podName: string;
  restarts: RestartEvent[];
  totalRestarts: number;
  lastRestart: Date | null;
  pattern: 'stable' | 'occasional' | 'frequent' | 'crashloop';
  color: string;
  health: 'healthy' | 'warning' | 'critical';
  avgRestartInterval: number; // Average time between restarts in minutes
  trend: 'improving' | 'stable' | 'degrading';
}

interface PatternAnalysis {
  type: 'crashloop' | 'memory-leak' | 'config-issue' | 'probe-failure' | 'resource-contention';
  confidence: number;
  description: string;
  recommendations: string[];
  affectedPods: string[];
}

const PodRestartTimeline: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('6h');
  const [selectedPods, setSelectedPods] = useState<Set<string>>(new Set());
  const [showPatternAnalysis, setShowPatternAnalysis] = useState(true);
  const { clusterState } = useDebuggingStore();

  // Generate mock restart data based on current scenario
  const generateRestartData = (): TimelineData[] => {
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }[timeRange];

    const startTime = new Date(now.getTime() - timeRangeMs);
    
    // Enhanced mock data with realistic restart patterns
    const mockPods = [
      {
        name: 'nginx-deployment-abc123',
        pattern: 'crashloop' as const,
        baseRestartCount: 15,
        color: '#ef4444',
        health: 'critical' as const,
        reasons: ['OOMKilled', 'Error', 'CrashLoopBackOff'],
        exitCodes: [137, 1, 0],
        categories: ['oom', 'crash', 'crash'] as const
      },
      {
        name: 'frontend-deployment-def456',
        pattern: 'occasional' as const,
        baseRestartCount: 3,
        color: '#f59e0b',
        health: 'warning' as const,
        reasons: ['Liveness probe failed', 'Readiness probe failed'],
        exitCodes: [1, 1],
        categories: ['probe', 'probe'] as const
      },
      {
        name: 'backend-deployment-ghi789',
        pattern: 'stable' as const,
        baseRestartCount: 1,
        color: '#10b981',
        health: 'healthy' as const,
        reasons: ['Completed'],
        exitCodes: [0],
        categories: ['config'] as const
      },
      {
        name: 'worker-deployment-jkl012',
        pattern: 'frequent' as const,
        baseRestartCount: 8,
        color: '#f97316',
        health: 'warning' as const,
        reasons: ['Resource limits exceeded', 'OOMKilled', 'Error'],
        exitCodes: [137, 137, 1],
        categories: ['resource', 'oom', 'crash'] as const
      }
    ];

    return mockPods.map(pod => {
      const restarts: RestartEvent[] = [];
      let currentTime = new Date(startTime);
      let restartCount = 0;
      let lastRestartTime: Date | null = null;

      // Generate restart events based on pattern
      while (currentTime < now) {
        let shouldRestart = false;
        let nextInterval = 0;

        switch (pod.pattern) {
          case 'crashloop':
            // Frequent restarts with exponential backoff
            shouldRestart = Math.random() < 0.8;
            nextInterval = Math.min(5 + restartCount * 2, 30) * 60 * 1000; // 5-30 minutes
            break;
          case 'frequent':
            shouldRestart = Math.random() < 0.3;
            nextInterval = 2 * 60 * 60 * 1000; // 2 hours
            break;
          case 'occasional':
            shouldRestart = Math.random() < 0.1;
            nextInterval = 8 * 60 * 60 * 1000; // 8 hours
            break;
          case 'stable':
            shouldRestart = Math.random() < 0.02;
            nextInterval = 24 * 60 * 60 * 1000; // 24 hours
            break;
        }

        if (shouldRestart) {
          const reasonIndex = restartCount % pod.reasons.length;
          const duration = lastRestartTime ?
            (currentTime.getTime() - lastRestartTime.getTime()) / 1000 : undefined;

          restartCount++;
          restarts.push({
            id: `${pod.name}-restart-${restartCount}`,
            podName: pod.name,
            timestamp: new Date(currentTime),
            reason: pod.reasons[reasonIndex],
            exitCode: pod.exitCodes[reasonIndex],
            restartCount: restartCount,
            duration,
            severity: pod.pattern === 'crashloop' ? 'critical' :
                     pod.pattern === 'frequent' ? 'high' :
                     pod.pattern === 'occasional' ? 'medium' : 'low',
            category: pod.categories[reasonIndex]
          });

          lastRestartTime = new Date(currentTime);
        }

        currentTime = new Date(currentTime.getTime() + nextInterval);
      }

      // Calculate metrics
      const avgInterval = restarts.length > 1 ?
        restarts.reduce((sum, restart, index) => {
          if (index === 0) return sum;
          return sum + (restart.timestamp.getTime() - restarts[index - 1].timestamp.getTime());
        }, 0) / (restarts.length - 1) / (60 * 1000) : 0; // in minutes

      const trend = restarts.length >= 3 ?
        (restarts[restarts.length - 1].timestamp.getTime() - restarts[restarts.length - 2].timestamp.getTime()) >
        (restarts[1].timestamp.getTime() - restarts[0].timestamp.getTime()) ? 'improving' : 'degrading' : 'stable';

      return {
        podName: pod.name,
        restarts,
        totalRestarts: restartCount,
        lastRestart: restarts.length > 0 ? restarts[restarts.length - 1].timestamp : null,
        pattern: pod.pattern,
        color: pod.color,
        health: pod.health,
        avgRestartInterval: avgInterval,
        trend
      };
    });
  };

  const timelineData = useMemo(() => generateRestartData(), [timeRange]);

  // Pattern analysis
  const analyzePatterns = (): PatternAnalysis[] => {
    const analyses: PatternAnalysis[] = [];

    // Detect CrashLoopBackOff pattern
    const crashLoopPods = timelineData.filter(pod =>
      pod.pattern === 'crashloop' && pod.totalRestarts > 5
    );
    if (crashLoopPods.length > 0) {
      analyses.push({
        type: 'crashloop',
        confidence: 0.95,
        description: 'Multiple pods are experiencing CrashLoopBackOff with frequent restarts',
        recommendations: [
          'Check application logs for startup errors',
          'Verify environment variables and configuration',
          'Review resource limits and requests',
          'Check liveness and readiness probe configuration'
        ],
        affectedPods: crashLoopPods.map(p => p.podName)
      });
    }

    // Detect memory leak pattern
    const memoryLeakPods = timelineData.filter(pod =>
      pod.restarts.some(r => r.reason === 'OOMKilled') && pod.trend === 'degrading'
    );
    if (memoryLeakPods.length > 0) {
      analyses.push({
        type: 'memory-leak',
        confidence: 0.8,
        description: 'Pods are being killed due to memory limits with increasing frequency',
        recommendations: [
          'Monitor memory usage patterns',
          'Increase memory limits if appropriate',
          'Profile application for memory leaks',
          'Implement memory monitoring and alerting'
        ],
        affectedPods: memoryLeakPods.map(p => p.podName)
      });
    }

    // Detect probe failure pattern
    const probeFailurePods = timelineData.filter(pod =>
      pod.restarts.some(r => r.reason.includes('probe'))
    );
    if (probeFailurePods.length > 0) {
      analyses.push({
        type: 'probe-failure',
        confidence: 0.85,
        description: 'Health probes are failing, causing unnecessary restarts',
        recommendations: [
          'Review liveness and readiness probe configuration',
          'Increase probe timeout and failure thresholds',
          'Verify probe endpoints are responding correctly',
          'Check application startup time vs probe initial delay'
        ],
        affectedPods: probeFailurePods.map(p => p.podName)
      });
    }

    return analyses;
  };

  const patternAnalyses = useMemo(() => analyzePatterns(), [timelineData]);

  // Filter data based on selected pods
  const filteredData = timelineData.filter(data =>
    selectedPods.size === 0 || selectedPods.has(data.podName)
  );

  const togglePodSelection = (podName: string) => {
    setSelectedPods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(podName)) {
        newSet.delete(podName);
      } else {
        newSet.add(podName);
      }
      return newSet;
    });
  };

  const getPatternDescription = (pattern: string) => {
    switch (pattern) {
      case 'crashloop':
        return 'Frequent restarts indicating application crashes';
      case 'frequent':
        return 'Regular restarts, may indicate resource issues';
      case 'occasional':
        return 'Infrequent restarts, likely normal behavior';
      case 'stable':
        return 'Very stable, minimal restarts';
      default:
        return 'Unknown pattern';
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'crashloop':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'frequent':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'occasional':
        return <Activity className="w-4 h-4 text-yellow-600" />;
      case 'stable':
        return <Clock className="w-4 h-4 text-green-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatTimeRange = () => {
    const now = new Date();
    const ranges = {
      '1h': new Date(now.getTime() - 60 * 60 * 1000),
      '6h': new Date(now.getTime() - 6 * 60 * 60 * 1000),
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    };
    return ranges[timeRange];
  };

  const getTimelinePosition = (timestamp: Date) => {
    const now = new Date();
    const startTime = formatTimeRange();
    const totalRange = now.getTime() - startTime.getTime();
    const eventTime = timestamp.getTime() - startTime.getTime();
    return Math.max(0, Math.min(100, (eventTime / totalRange) * 100));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">🔄 Pod Restart Timeline</h3>
              <p className="text-sm text-slate-600">Visualize restart patterns and detect issues</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Summary Stats */}
            <div className="flex items-center space-x-4 mr-4">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">
                  {timelineData.reduce((sum, pod) => sum + pod.totalRestarts, 0)}
                </div>
                <div className="text-xs text-slate-600">Total Restarts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {timelineData.filter(pod => pod.health === 'critical').length}
                </div>
                <div className="text-xs text-slate-600">Critical Pods</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {patternAnalyses.length}
                </div>
                <div className="text-xs text-slate-600">Issues Found</div>
              </div>
            </div>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="1h">⏰ Last Hour</option>
              <option value="6h">🕕 Last 6 Hours</option>
              <option value="24h">📅 Last 24 Hours</option>
              <option value="7d">📊 Last 7 Days</option>
            </select>

            {/* Pattern Analysis Toggle */}
            <button
              onClick={() => setShowPatternAnalysis(!showPatternAnalysis)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all shadow-sm ${
                showPatternAnalysis
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              {showPatternAnalysis ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>🔍 Analysis</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Pattern Analysis */}
        {showPatternAnalysis && patternAnalyses.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
              <span>🔍 Pattern Analysis</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                {patternAnalyses.length} issues detected
              </span>
            </h4>
            <div className="space-y-3">
              {patternAnalyses.map((analysis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {analysis.type === 'crashloop' && <span className="text-2xl">🚨</span>}
                      {analysis.type === 'memory-leak' && <span className="text-2xl">💾</span>}
                      {analysis.type === 'probe-failure' && <span className="text-2xl">🩺</span>}
                      {analysis.type === 'config-issue' && <span className="text-2xl">⚙️</span>}
                      {analysis.type === 'resource-contention' && <span className="text-2xl">⚡</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-semibold text-red-800 capitalize">
                          {analysis.type.replace('-', ' ')}
                        </h5>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          {Math.round(analysis.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-red-700 text-sm mb-3">{analysis.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium text-red-800 text-sm mb-1">Affected Pods:</h6>
                          <div className="flex flex-wrap gap-1">
                            {analysis.affectedPods.map(pod => (
                              <span key={pod} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                {pod.split('-')[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium text-red-800 text-sm mb-1">Recommendations:</h6>
                          <ul className="text-xs text-red-700 space-y-1">
                            {analysis.recommendations.slice(0, 2).map((rec, i) => (
                              <li key={i} className="flex items-start space-x-1">
                                <span>•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pod Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
            <span>📦 Pod Health Overview</span>
            <span className="text-xs text-slate-500">({timelineData.length} pods)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timelineData.map(data => (
              <motion.button
                key={data.podName}
                onClick={() => togglePodSelection(data.podName)}
                className={`p-3 rounded-lg border text-left transition-all shadow-sm hover:shadow-md ${
                  selectedPods.has(data.podName) || selectedPods.size === 0
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="font-medium text-sm text-slate-900">
                      {data.podName.split('-')[0]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {data.health === 'critical' && <span>🚨</span>}
                    {data.health === 'warning' && <span>⚠️</span>}
                    {data.health === 'healthy' && <span>✅</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    {data.totalRestarts} restarts
                  </span>
                  <span className={`px-2 py-1 rounded-full font-medium ${
                    data.pattern === 'crashloop' ? 'bg-red-100 text-red-700' :
                    data.pattern === 'frequent' ? 'bg-orange-100 text-orange-700' :
                    data.pattern === 'occasional' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {data.pattern}
                  </span>
                </div>

                {data.avgRestartInterval > 0 && (
                  <div className="mt-2 text-xs text-slate-500">
                    Avg interval: {Math.round(data.avgRestartInterval)}min
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Enhanced Timeline Visualization */}
        <div className="mb-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-700 flex items-center space-x-2">
                <span>📈 Restart Timeline</span>
                <span className="text-xs text-slate-500">({timeRange})</span>
              </h4>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>

            {/* Time axis */}
            <div className="flex justify-between text-xs text-slate-500 mb-4 px-2">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatTimeRange().toLocaleString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>Now</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </span>
            </div>

            {/* Timeline tracks */}
            <div className="space-y-6">
              {filteredData.map((data, index) => (
                <motion.div
                  key={data.podName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Pod header with enhanced info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="text-sm font-semibold text-slate-800">
                          {data.podName.split('-')[0]}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {data.health === 'critical' && <span className="text-lg">🚨</span>}
                        {data.health === 'warning' && <span className="text-lg">⚠️</span>}
                        {data.health === 'healthy' && <span className="text-lg">✅</span>}

                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          data.pattern === 'crashloop' ? 'bg-red-100 text-red-700' :
                          data.pattern === 'frequent' ? 'bg-orange-100 text-orange-700' :
                          data.pattern === 'occasional' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {data.pattern}
                        </span>

                        {data.trend === 'degrading' && <TrendingDown className="w-4 h-4 text-red-500" />}
                        {data.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-slate-600">
                      <span className="flex items-center space-x-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>{data.totalRestarts} restarts</span>
                      </span>
                      {data.avgRestartInterval > 0 && (
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>~{Math.round(data.avgRestartInterval)}min avg</span>
                        </span>
                      )}
                      {data.lastRestart && (
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{data.lastRestart.toLocaleTimeString()}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enhanced timeline track */}
                  <div className="relative h-12 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border border-slate-200 overflow-hidden shadow-inner">
                    {/* Grid lines for better time reference */}
                    <div className="absolute inset-0 flex">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-200 border-opacity-50 last:border-r-0" />
                      ))}
                    </div>

                    {/* Restart events with enhanced visualization */}
                    {data.restarts.map((restart, restartIndex) => {
                      const position = getTimelinePosition(restart.timestamp);
                      const severityColor = restart.severity === 'critical' ? 'bg-red-500' :
                                           restart.severity === 'high' ? 'bg-orange-500' :
                                           restart.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500';

                      return (
                        <motion.div
                          key={restart.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: restartIndex * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }}
                          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 group cursor-pointer"
                          style={{ left: `${position}%` }}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${severityColor} ${
                            restart.severity === 'critical' ? 'animate-pulse' : ''
                          } hover:scale-125 transition-transform`}>
                            {/* Ripple effect for critical events */}
                            {restart.severity === 'critical' && (
                              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                            )}
                          </div>

                          {/* Enhanced tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                            <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg min-w-max">
                              <div className="font-semibold text-yellow-300 mb-1">
                                🔄 Restart #{restart.restartCount}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-3 h-3" />
                                  <span>{restart.timestamp.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{restart.reason}</span>
                                </div>
                                {restart.exitCode !== undefined && (
                                  <div className="flex items-center space-x-2">
                                    <XCircle className="w-3 h-3" />
                                    <span>Exit code: {restart.exitCode}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-2">
                                  <Target className="w-3 h-3" />
                                  <span className="capitalize">{restart.category}</span>
                                </div>
                                {restart.duration && (
                                  <div className="flex items-center space-x-2">
                                    <Activity className="w-3 h-3" />
                                    <span>After {Math.round(restart.duration / 60)}min</span>
                                  </div>
                                )}
                              </div>
                              {/* Tooltip arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Current time indicator */}
                    <div className="absolute top-0 right-0 w-0.5 h-full bg-blue-500">
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodRestartTimeline;
