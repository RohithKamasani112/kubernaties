import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Bug,
  Shield,
  Network,
  Database,
  Cpu,
  MemoryStick,
  HardDrive,
  Settings,
  Terminal,
  FileText,
  TrendingUp,
  Activity,
  RefreshCw,
  Lightbulb,
  Target
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface DiagnosisResult {
  id: string;
  category: 'resource' | 'network' | 'configuration' | 'application' | 'security' | 'storage';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  rootCause: string;
  confidence: number; // 0-100
  evidence: string[];
  recommendations: {
    immediate: string[];
    longTerm: string[];
    commands: string[];
  };
  affectedResources: string[];
  estimatedImpact: string;
  timeToResolve: string;
  priority: number; // 1-10, higher is more urgent
  relatedIssues: string[];
  preventionTips: string[];
}

interface AnalysisMetrics {
  totalIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
  avgConfidence: number;
  mostAffectedCategory: string;
  analysisTime: number;
}

const AutoDiagnosisPanel: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDiagnosis, setExpandedDiagnosis] = useState<string | null>(null);
  
  const { clusterState, executeCommand } = useDebuggingStore();

  // Perform automated diagnosis
  const performDiagnosis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDiagnoses: DiagnosisResult[] = [];

    // Analyze pods for issues
    const failedPods = clusterState.pods.filter(pod => 
      pod.status === 'CrashLoopBackOff' || pod.status === 'Error' || pod.status === 'Pending'
    );

    if (failedPods.length > 0) {
      // CrashLoopBackOff diagnosis
      const crashLoopPods = failedPods.filter(pod => pod.status === 'CrashLoopBackOff');
      if (crashLoopPods.length > 0) {
        newDiagnoses.push({
          id: 'crashloop-diagnosis',
          category: 'application',
          severity: 'critical',
          title: '🚨 CrashLoopBackOff Detected',
          description: `${crashLoopPods.length} pod(s) are stuck in CrashLoopBackOff state, indicating repeated application crashes.`,
          rootCause: 'Application startup failure or runtime errors causing container to exit repeatedly',
          confidence: 95,
          evidence: [
            `🔍 Pods affected: ${crashLoopPods.map(p => p.name).join(', ')}`,
            '📈 High restart count observed (>5 restarts)',
            '❌ Container exit codes indicate failure (non-zero)',
            '📋 Recent error logs show application crashes',
            '⏱️ Restart backoff pattern detected'
          ],
          recommendations: {
            immediate: [
              '🔍 Check container logs for error messages',
              '⚙️ Verify environment variables are set correctly',
              '🌐 Check if required services are available',
              '💾 Review resource limits and requests',
              '🩺 Validate health check endpoints'
            ],
            longTerm: [
              '🛡️ Implement proper health checks and startup probes',
              '📊 Add application monitoring and alerting',
              '🔧 Review application error handling and logging',
              '🔄 Consider implementing graceful shutdown',
              '📚 Add comprehensive testing for edge cases'
            ],
            commands: [
              `kubectl logs ${crashLoopPods[0]?.name} --previous`,
              `kubectl describe pod ${crashLoopPods[0]?.name}`,
              'kubectl get events --sort-by=.metadata.creationTimestamp',
              `kubectl exec -it ${crashLoopPods[0]?.name} -- /bin/sh`
            ]
          },
          affectedResources: crashLoopPods.map(p => p.name),
          estimatedImpact: 'High - Service unavailable, user experience degraded',
          timeToResolve: '15-30 minutes',
          priority: 9,
          relatedIssues: ['pod-restart-frequency', 'application-errors'],
          preventionTips: [
            'Implement comprehensive health checks',
            'Use init containers for dependencies',
            'Set appropriate resource limits',
            'Add proper error handling and logging'
          ]
        });
      }

      // Pending pods diagnosis
      const pendingPods = failedPods.filter(pod => pod.status === 'Pending');
      if (pendingPods.length > 0) {
        newDiagnoses.push({
          id: 'pending-diagnosis',
          category: 'resource',
          severity: 'high',
          title: '⏳ Pod Scheduling Issues',
          description: `${pendingPods.length} pod(s) cannot be scheduled on any node due to resource or constraint issues.`,
          rootCause: 'Insufficient cluster resources or scheduling constraints preventing pod placement',
          confidence: 88,
          evidence: [
            `📦 Pending pods: ${pendingPods.map(p => p.name).join(', ')}`,
            '🚫 No suitable nodes found for scheduling',
            '💾 Possible resource constraints (CPU/Memory)',
            '🏷️ Node selectors or affinity rules may be too restrictive',
            '📋 Events show FailedScheduling messages'
          ],
          recommendations: {
            immediate: [
              '🖥️ Check node resource availability and capacity',
              '📊 Review pod resource requests and limits',
              '🏷️ Verify node selectors and affinity rules',
              '🚫 Check for node taints and tolerations',
              '📈 Monitor cluster resource utilization'
            ],
            longTerm: [
              '🔄 Implement cluster autoscaling',
              '📊 Monitor resource utilization trends',
              '⚖️ Optimize resource requests and limits',
              '📋 Set up resource quotas and limits',
              '🎯 Implement pod disruption budgets',
              '📈 Plan capacity based on workload patterns'
            ],
            commands: [
              'kubectl describe nodes',
              `kubectl describe pod ${pendingPods[0]?.name}`,
              'kubectl top nodes',
              'kubectl get events --field-selector reason=FailedScheduling'
            ]
          },
          affectedResources: pendingPods.map(p => p.name),
          estimatedImpact: 'Medium - New deployments delayed, scaling issues',
          timeToResolve: '10-20 minutes',
          priority: 7,
          relatedIssues: ['resource-shortage', 'node-capacity'],
          preventionTips: [
            'Monitor cluster resource usage',
            'Set up cluster autoscaling',
            'Use resource quotas appropriately',
            'Plan capacity based on usage patterns'
          ]
        });
      }
    }

    // Analyze logs for patterns
    const errorLogs = clusterState.logs.filter(log => 
      log.level === 'ERROR' || log.message.toLowerCase().includes('error')
    );

    if (errorLogs.length > 5) {
      // High error rate diagnosis
      newDiagnoses.push({
        id: 'high-error-rate',
        category: 'application',
        severity: 'high',
        title: '📈 High Error Rate Detected',
        description: `Unusually high number of error logs (${errorLogs.length}) detected in recent timeframe, indicating potential systemic issues.`,
        rootCause: 'Application errors, external service failures, or configuration issues causing elevated error rates',
        confidence: 82,
        evidence: [
          `🔍 ${errorLogs.length} error logs in recent period (threshold: 5)`,
          '📊 Error rate above normal baseline',
          '🔄 Multiple components reporting errors simultaneously',
          '⚠️ Pattern suggests systemic rather than isolated issue',
          '📋 Error distribution across multiple services'
        ],
        recommendations: {
          immediate: [
            '🔍 Review recent error logs for common patterns',
            '🌐 Check external service dependencies and health',
            '⚙️ Verify recent configuration changes',
            '📊 Monitor application metrics and dashboards',
            '🚨 Check if alerts have been triggered'
          ],
          longTerm: [
            '📊 Implement error rate alerting and thresholds',
            '🔄 Add circuit breakers for external services',
            '🛠️ Improve error handling and logging practices',
            '🔍 Set up distributed tracing and monitoring',
            '📈 Establish error rate baselines and SLIs'
          ],
          commands: [
            'kubectl logs -l app=your-app --since=1h | grep -i error',
            'kubectl get events --field-selector type=Warning',
            'kubectl top pods --sort-by=cpu',
            'kubectl get pods --field-selector=status.phase=Failed'
          ]
        },
        affectedResources: [...new Set(errorLogs.map(log => log.source))],
        estimatedImpact: 'Medium - Potential service degradation, user experience issues',
        timeToResolve: '20-45 minutes',
        priority: 6,
        relatedIssues: ['application-stability', 'external-dependencies'],
        preventionTips: [
          'Implement comprehensive error monitoring',
          'Set up proactive alerting on error rates',
          'Use circuit breakers for external calls',
          'Regular dependency health checks'
        ]
      });
    }

    // Network connectivity analysis
    const networkErrors = clusterState.logs.filter(log =>
      log.message.toLowerCase().includes('connection refused') ||
      log.message.toLowerCase().includes('timeout') ||
      log.message.toLowerCase().includes('network unreachable')
    );

    if (networkErrors.length > 0) {
      newDiagnoses.push({
        id: 'network-connectivity',
        category: 'network',
        severity: 'high',
        title: '🌐 Network Connectivity Issues',
        description: `Multiple network connectivity errors detected across ${networkErrors.length} instances, indicating service communication problems.`,
        rootCause: 'Service discovery issues, network policies, DNS resolution problems, or external service unavailability',
        confidence: 78,
        evidence: [
          `🔍 ${networkErrors.length} network-related errors detected`,
          '⏱️ Connection timeouts and refused connections',
          '🔄 Multiple services affected simultaneously',
          '🌐 Pattern suggests network infrastructure issue',
          '📋 DNS resolution or service discovery problems'
        ],
        recommendations: {
          immediate: [
            '🎯 Check service endpoints and selectors',
            '🛡️ Verify network policies and security groups',
            '🔗 Test connectivity between services manually',
            '🌐 Check external service status and health',
            '🔍 Verify DNS resolution within cluster'
          ],
          longTerm: [
            '🕸️ Implement service mesh for better observability',
            '📊 Add network monitoring and alerting',
            '📋 Review network policy configurations',
            '🔄 Implement retry mechanisms with exponential backoff',
            '🛡️ Set up network security monitoring'
          ],
          commands: [
            'kubectl get endpoints',
            'kubectl get networkpolicies',
            'kubectl exec -it <pod> -- nc -zv <service> <port>',
            'kubectl get services -o wide',
            'kubectl exec -it <pod> -- nslookup <service>'
          ]
        },
        affectedResources: [...new Set(networkErrors.map(log => log.source))],
        estimatedImpact: 'High - Service communication failures, potential cascading failures',
        timeToResolve: '15-30 minutes',
        priority: 8,
        relatedIssues: ['service-discovery', 'dns-resolution', 'network-policies'],
        preventionTips: [
          'Implement comprehensive network monitoring',
          'Use service mesh for traffic management',
          'Regular network policy audits',
          'Monitor external service dependencies'
        ]
      });
    }

    // Memory and OOM analysis
    const oomLogs = clusterState.logs.filter(log =>
      log.message.toLowerCase().includes('oomkilled') ||
      log.message.toLowerCase().includes('out of memory') ||
      log.message.toLowerCase().includes('memory limit exceeded')
    );

    if (oomLogs.length > 0) {
      newDiagnoses.push({
        id: 'memory-issues',
        category: 'resource',
        severity: 'critical',
        title: '💾 Memory Issues Detected',
        description: `${oomLogs.length} instances of memory-related issues including OOMKilled events detected.`,
        rootCause: 'Insufficient memory limits, memory leaks, or inefficient memory usage patterns',
        confidence: 92,
        evidence: [
          `🔍 ${oomLogs.length} OOMKilled or memory-related events`,
          '💾 Containers exceeding memory limits',
          '📈 Potential memory leak patterns',
          '🔄 Repeated memory-related restarts',
          '⚠️ Impact on application stability'
        ],
        recommendations: {
          immediate: [
            '📊 Check current memory usage across pods',
            '📈 Review memory limits and requests',
            '🔍 Analyze memory usage patterns',
            '🔄 Consider increasing memory limits temporarily',
            '📋 Check for memory leaks in application logs'
          ],
          longTerm: [
            '🔧 Profile application for memory leaks',
            '📊 Implement memory monitoring and alerting',
            '⚖️ Optimize memory usage in application code',
            '📈 Set appropriate memory limits based on usage',
            '🛡️ Implement memory-aware autoscaling'
          ],
          commands: [
            'kubectl top pods --sort-by=memory',
            'kubectl describe pod <oom-pod>',
            'kubectl logs <pod> --previous | grep -i oom',
            'kubectl get events --field-selector reason=OOMKilling'
          ]
        },
        affectedResources: [...new Set(oomLogs.map(log => log.source))],
        estimatedImpact: 'Critical - Application crashes, data loss, service unavailability',
        timeToResolve: '30-60 minutes',
        priority: 9,
        relatedIssues: ['resource-limits', 'memory-leaks', 'application-stability'],
        preventionTips: [
          'Set appropriate memory limits and requests',
          'Regular memory profiling and optimization',
          'Implement memory usage monitoring',
          'Use memory-efficient coding practices'
        ]
      });
    }

    // Resource utilization analysis
    const highCpuPods = clusterState.pods.filter(pod => 
      pod.metadata?.cpuUsage && parseFloat(pod.metadata.cpuUsage) > 80
    );

    if (highCpuPods.length > 0) {
      newDiagnoses.push({
        id: 'high-resource-usage',
        category: 'resource',
        severity: 'medium',
        title: 'High Resource Utilization',
        description: `${highCpuPods.length} pod(s) showing high CPU utilization (>80%).`,
        rootCause: 'Insufficient resource allocation or inefficient application code',
        confidence: 85,
        evidence: [
          `High CPU pods: ${highCpuPods.map(p => p.name).join(', ')}`,
          'CPU utilization above 80% threshold',
          'Potential performance degradation',
          'May lead to throttling or OOM kills'
        ],
        recommendations: {
          immediate: [
            'Monitor resource usage trends',
            'Check for CPU throttling',
            'Review application performance',
            'Consider scaling horizontally'
          ],
          longTerm: [
            'Optimize application performance',
            'Implement proper resource limits',
            'Set up horizontal pod autoscaling',
            'Monitor and alert on resource usage'
          ],
          commands: [
            'kubectl top pods --sort-by=cpu',
            'kubectl describe pod <high-cpu-pod>',
            'kubectl get hpa',
            'kubectl top nodes'
          ]
        },
        affectedResources: highCpuPods.map(p => p.name),
        estimatedImpact: 'Medium - Performance degradation, potential service slowdown'
      });
    }

    // Configuration drift analysis
    if (Math.random() > 0.7) { // Simulate occasional config issues
      newDiagnoses.push({
        id: 'config-drift',
        category: 'configuration',
        severity: 'low',
        title: 'Configuration Drift Detected',
        description: 'Some configurations may have drifted from desired state.',
        rootCause: 'Manual changes or incomplete deployments causing configuration inconsistencies',
        confidence: 65,
        evidence: [
          'ConfigMap versions inconsistent across pods',
          'Some pods using outdated configurations',
          'Recent manual changes detected',
          'Deployment rollout may be incomplete'
        ],
        recommendations: {
          immediate: [
            'Verify ConfigMap and Secret versions',
            'Check deployment rollout status',
            'Restart pods with outdated configs',
            'Review recent configuration changes'
          ],
          longTerm: [
            'Implement GitOps for configuration management',
            'Add configuration validation',
            'Monitor configuration drift',
            'Automate configuration updates'
          ],
          commands: [
            'kubectl get configmaps -o wide',
            'kubectl rollout status deployment/<name>',
            'kubectl get pods -o jsonpath="{.items[*].spec.containers[*].env}"',
            'kubectl rollout restart deployment/<name>'
          ]
        },
        affectedResources: ['configmaps', 'deployments'],
        estimatedImpact: 'Low - Potential inconsistent behavior, configuration mismatches'
      });
    }

    setDiagnoses(newDiagnoses);
    setLastAnalysis(new Date());
    setIsAnalyzing(false);
  };

  // Auto-run diagnosis on component mount and cluster state changes
  useEffect(() => {
    performDiagnosis();
  }, [clusterState.pods, clusterState.logs]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'resource': return <Cpu className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'configuration': return <Settings className="w-4 h-4" />;
      case 'application': return <Bug className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50 text-red-800';
      case 'high': return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'info': return 'border-green-200 bg-green-50 text-green-800';
      default: return 'border-slate-200 bg-slate-50 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <span className="text-lg animate-pulse">🚨</span>;
      case 'high': return <span className="text-lg">⚠️</span>;
      case 'medium': return <span className="text-lg">🟡</span>;
      case 'low': return <span className="text-lg">ℹ️</span>;
      case 'info': return <span className="text-lg">✅</span>;
      default: return <span className="text-lg">❓</span>;
    }
  };

  const getAnalysisMetrics = (): AnalysisMetrics => {
    const totalIssues = diagnoses.length;
    const criticalIssues = diagnoses.filter(d => d.severity === 'critical').length;
    const resolvedIssues = 0; // Would track resolved issues in real implementation
    const avgConfidence = diagnoses.length > 0
      ? Math.round(diagnoses.reduce((sum, d) => sum + d.confidence, 0) / diagnoses.length)
      : 0;

    const categoryCount = diagnoses.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostAffectedCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    return {
      totalIssues,
      criticalIssues,
      resolvedIssues,
      avgConfidence,
      mostAffectedCategory,
      analysisTime: 2.3 // Mock analysis time
    };
  };

  const filteredDiagnoses = selectedCategory === 'all'
    ? diagnoses
    : diagnoses.filter(d => d.category === selectedCategory);

  const categories = ['all', ...new Set(diagnoses.map(d => d.category))];
  const metrics = getAnalysisMetrics();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-slate-200 p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">🔍 AI-Powered Auto Diagnosis</h3>
              <p className="text-sm text-slate-600">Intelligent cluster health analysis and recommendations</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Analysis Metrics */}
            <div className="flex items-center space-x-6 mr-4">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">{metrics.totalIssues}</div>
                <div className="text-xs text-slate-600">Issues Found</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{metrics.criticalIssues}</div>
                <div className="text-xs text-slate-600">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{metrics.avgConfidence}%</div>
                <div className="text-xs text-slate-600">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{metrics.analysisTime}s</div>
                <div className="text-xs text-slate-600">Analysis Time</div>
              </div>
            </div>

            {lastAnalysis && (
              <div className="text-right text-sm text-slate-500">
                <div>Last analysis:</div>
                <div className="font-medium">{lastAnalysis.toLocaleTimeString()}</div>
              </div>
            )}

            <button
              onClick={performDiagnosis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
            </button>
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="mt-4 flex items-center space-x-3">
            <div className="flex-1 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm text-purple-700 font-medium">Analyzing cluster state...</span>
          </div>
        )}
      </div>

      <div className="p-6">

      {/* Category Filter */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm font-medium text-slate-700">Category:</span>
        <div className="flex space-x-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category !== 'all' && getCategoryIcon(category)}
              <span className="capitalize">{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Diagnosis Results */}
      <div className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Analyzing cluster state...</p>
              <p className="text-sm text-slate-500">This may take a few moments</p>
            </div>
          </div>
        ) : filteredDiagnoses.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">All Clear!</h4>
            <p className="text-slate-600">No critical issues detected in your cluster.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredDiagnoses.map((diagnosis, index) => (
              <motion.div
                key={diagnosis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg ${getSeverityColor(diagnosis.severity)}`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(diagnosis.severity)}
                        {getCategoryIcon(diagnosis.category)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-slate-900">{diagnosis.title}</h4>
                          <span className="px-2 py-0.5 text-xs bg-white bg-opacity-60 rounded">
                            {diagnosis.confidence}% confidence
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-white bg-opacity-60 rounded capitalize">
                            {diagnosis.category}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-700 mb-2">{diagnosis.description}</p>
                        <p className="text-sm text-slate-600 mb-3">
                          <strong>Root Cause:</strong> {diagnosis.rootCause}
                        </p>
                        
                        {/* Quick Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setExpandedDiagnosis(
                              expandedDiagnosis === diagnosis.id ? null : diagnosis.id
                            )}
                            className="flex items-center space-x-1 px-3 py-1 bg-white bg-opacity-60 text-slate-700 text-sm rounded hover:bg-opacity-80 transition-colors"
                          >
                            <Target className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                          
                          {diagnosis.recommendations.commands.length > 0 && (
                            <button
                              onClick={() => executeCommand(diagnosis.recommendations.commands[0])}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              <Terminal className="w-3 h-3" />
                              <span>Run Diagnostic</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedDiagnosis === diagnosis.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white border-opacity-30"
                      >
                        {/* Evidence */}
                        <div className="mb-4">
                          <h5 className="font-medium text-slate-900 mb-2">Evidence</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {diagnosis.evidence.map((evidence, idx) => (
                              <li key={idx} className="text-sm text-slate-700">{evidence}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Immediate Recommendations */}
                        <div className="mb-4">
                          <h5 className="font-medium text-slate-900 mb-2">Immediate Actions</h5>
                          <ol className="list-decimal list-inside space-y-1">
                            {diagnosis.recommendations.immediate.map((action, idx) => (
                              <li key={idx} className="text-sm text-slate-700">{action}</li>
                            ))}
                          </ol>
                        </div>
                        
                        {/* Commands */}
                        <div className="mb-4">
                          <h5 className="font-medium text-slate-900 mb-2">Diagnostic Commands</h5>
                          <div className="space-y-2">
                            {diagnosis.recommendations.commands.map((command, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-900 text-green-400 p-2 rounded text-sm">
                                <code>{command}</code>
                                <button
                                  onClick={() => executeCommand(command)}
                                  className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                >
                                  Run
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Impact and Affected Resources */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Estimated Impact</h5>
                            <p className="text-sm text-slate-700">{diagnosis.estimatedImpact}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-slate-900 mb-2">Affected Resources</h5>
                            <div className="flex flex-wrap gap-1">
                              {diagnosis.affectedResources.map((resource, idx) => (
                                <span key={idx} className="px-2 py-1 bg-white bg-opacity-60 text-xs rounded">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      </div>
    </div>
  );
};

export default AutoDiagnosisPanel;
