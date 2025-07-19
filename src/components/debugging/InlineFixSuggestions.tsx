import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Terminal,
  FileText,
  Settings,
  Zap,
  X,
  ChevronRight,
  Play,
  Book,
  Code
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface FixSuggestion {
  id: string;
  type: 'command' | 'yaml' | 'config' | 'documentation';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  solution: {
    command?: string;
    yaml?: string;
    steps?: string[];
    explanation?: string;
  };
  learnMore?: string;
  estimatedTime?: string;
}

interface InlineFixSuggestionsProps {
  logs?: any[];
  events?: any[];
  selectedResource?: any;
}

const InlineFixSuggestions: React.FC<InlineFixSuggestionsProps> = ({
  logs = [],
  events = [],
  selectedResource
}) => {
  const [suggestions, setSuggestions] = useState<FixSuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const { executeCommand, clusterState } = useDebuggingStore();

  // Enhanced error pattern detection
  const errorPatterns = [
    {
      pattern: /panic.*missing.*environment.*variable.*(\w+)/i,
      type: 'env-missing',
      severity: 'critical' as const,
      title: 'Missing Environment Variable',
      category: 'Configuration',
      getFixSuggestion: (match: RegExpMatchArray) => ({
        command: `kubectl set env deployment/<deployment-name> ${match[1] || 'VARIABLE_NAME'}=<value>`,
        yaml: `env:
  - name: ${match[1] || 'VARIABLE_NAME'}
    value: "<your-value>"`,
        steps: [
          'Identify the missing environment variable',
          'Add it to your deployment configuration',
          'Apply the changes and restart pods'
        ],
        explanation: 'The application is crashing because a required environment variable is not set. This is a common configuration issue.'
      })
    },
    {
      pattern: /imagepullbackoff|failed.*pull.*image/i,
      type: 'image-pull',
      severity: 'high' as const,
      title: 'Image Pull Error',
      category: 'Container',
      getFixSuggestion: () => ({
        command: 'kubectl describe pod <pod-name>',
        steps: [
          'Check if the image name and tag are correct',
          'Verify image registry credentials',
          'Ensure the image exists in the registry',
          'Check network connectivity to registry'
        ],
        explanation: 'Kubernetes cannot pull the container image. This could be due to incorrect image name, missing credentials, or network issues.'
      })
    },
    {
      pattern: /crashloopbackoff/i,
      type: 'crash-loop',
      severity: 'critical' as const,
      title: 'Pod Crash Loop',
      category: 'Application',
      getFixSuggestion: () => ({
        command: 'kubectl logs <pod-name> --previous',
        steps: [
          'Check previous container logs for crash reason',
          'Review application startup configuration',
          'Verify resource limits and requests',
          'Check liveness and readiness probes'
        ],
        explanation: 'The pod is repeatedly crashing and restarting. This indicates an application or configuration issue.'
      })
    },
    {
      pattern: /insufficient.*cpu|insufficient.*memory|insufficient.*storage/i,
      type: 'resource-shortage',
      severity: 'high' as const,
      title: 'Insufficient Resources',
      category: 'Resources',
      getFixSuggestion: () => ({
        command: 'kubectl describe nodes',
        steps: [
          'Check node resource availability',
          'Review pod resource requests',
          'Consider scaling cluster or optimizing requests',
          'Check for resource quotas'
        ],
        explanation: 'Pods cannot be scheduled due to insufficient cluster resources.'
      })
    },
    {
      pattern: /liveness.*probe.*failed|readiness.*probe.*failed/i,
      type: 'probe-failure',
      severity: 'medium' as const,
      title: 'Health Probe Failure',
      category: 'Health Checks',
      getFixSuggestion: () => ({
        command: 'kubectl describe pod <pod-name>',
        steps: [
          'Check probe endpoint configuration',
          'Verify application startup time',
          'Adjust probe timing parameters',
          'Test probe endpoint manually'
        ],
        explanation: 'Health probes are failing, which may cause service disruption or prevent pod startup.'
      })
    }
  ];

  // Analyze logs and events to generate fix suggestions
  useEffect(() => {
    const newSuggestions: FixSuggestion[] = [];

    // Analyze recent logs for common issues
    const recentLogs = logs.slice(-20); // Last 20 logs for better analysis

    recentLogs.forEach(log => {
      const message = log.message;
      
      // Missing environment variable
      if (message.includes('missing environment variable') || message.includes('env') && message.includes('not found')) {
        const envVarMatch = log.message.match(/environment variable (\w+)/i);
        const envVar = envVarMatch ? envVarMatch[1] : 'DATABASE_URL';
        
        newSuggestions.push({
          id: `env-var-${log.id}`,
          type: 'command',
          title: `Missing Environment Variable: ${envVar}`,
          description: `The application is failing because the environment variable "${envVar}" is not set.`,
          severity: 'high',
          category: 'Configuration',
          solution: {
            command: `kubectl set env deployment/${selectedResource?.name || 'your-deployment'} ${envVar}=your-value`,
            steps: [
              `Set the environment variable: kubectl set env deployment/${selectedResource?.name || 'your-deployment'} ${envVar}=your-value`,
              'Verify the deployment updated: kubectl rollout status deployment/' + (selectedResource?.name || 'your-deployment'),
              'Check pod logs: kubectl logs -l app=' + (selectedResource?.name || 'your-app')
            ],
            explanation: `Environment variables can be set directly on deployments using kubectl set env command, or by updating the deployment YAML with the env section.`
          },
          learnMore: 'https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/',
          estimatedTime: '2-3 minutes'
        });
      }

      // Image pull errors
      if (message.includes('imagepullbackoff') || message.includes('pull') && message.includes('failed')) {
        newSuggestions.push({
          id: `image-pull-${log.id}`,
          type: 'command',
          title: 'Container Image Pull Failed',
          description: 'The container image cannot be pulled. This could be due to incorrect image name, tag, or registry access issues.',
          severity: 'critical',
          category: 'Container',
          solution: {
            command: `kubectl describe pod ${log.source}`,
            steps: [
              'Check the exact error: kubectl describe pod ' + log.source,
              'Verify image name and tag in deployment',
              'Check if image exists: docker pull <image-name>',
              'Verify registry credentials if using private registry'
            ],
            explanation: 'Image pull errors are often caused by typos in image names, incorrect tags, or missing registry credentials.'
          },
          learnMore: 'https://kubernetes.io/docs/concepts/containers/images/',
          estimatedTime: '5-10 minutes'
        });
      }

      // Memory/OOM issues
      if (message.includes('out of memory') || message.includes('oom') || message.includes('killed')) {
        newSuggestions.push({
          id: `memory-${log.id}`,
          type: 'yaml',
          title: 'Out of Memory Error',
          description: 'The container was killed due to memory limits. Consider increasing memory limits or optimizing the application.',
          severity: 'critical',
          category: 'Resources',
          solution: {
            yaml: `resources:
  limits:
    memory: "512Mi"
    cpu: "500m"
  requests:
    memory: "256Mi"
    cpu: "250m"`,
            steps: [
              'Edit the deployment: kubectl edit deployment ' + (selectedResource?.name || 'your-deployment'),
              'Add or update the resources section in the container spec',
              'Apply the changes and monitor: kubectl top pods'
            ],
            explanation: 'Memory limits prevent containers from consuming too much memory, but they need to be set appropriately for your application needs.'
          },
          learnMore: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
          estimatedTime: '3-5 minutes'
        });
      }

      // Connection refused/network issues
      if (message.includes('connection refused') || message.includes('network unreachable')) {
        newSuggestions.push({
          id: `network-${log.id}`,
          type: 'command',
          title: 'Network Connectivity Issue',
          description: 'The application cannot connect to a required service. Check service endpoints and network policies.',
          severity: 'high',
          category: 'Networking',
          solution: {
            command: 'kubectl get endpoints',
            steps: [
              'Check service endpoints: kubectl get endpoints',
              'Verify service selectors match pod labels',
              'Test connectivity: kubectl exec -it <pod> -- nc -zv <service> <port>',
              'Check network policies if any'
            ],
            explanation: 'Network connectivity issues often stem from incorrect service configurations or network policies blocking traffic.'
          },
          learnMore: 'https://kubernetes.io/docs/concepts/services-networking/service/',
          estimatedTime: '5-15 minutes'
        });
      }
    });

    // Analyze events for additional suggestions
    events.forEach(event => {
      if (event.reason === 'FailedScheduling') {
        newSuggestions.push({
          id: `scheduling-${event.id}`,
          type: 'command',
          title: 'Pod Scheduling Failed',
          description: 'The pod cannot be scheduled on any node. This could be due to resource constraints or node selectors.',
          severity: 'high',
          category: 'Scheduling',
          solution: {
            command: 'kubectl describe nodes',
            steps: [
              'Check node resources: kubectl describe nodes',
              'Check pod resource requests: kubectl describe pod ' + event.involvedObject?.name,
              'Look for taints and tolerations',
              'Consider scaling cluster or reducing resource requests'
            ],
            explanation: 'Scheduling failures occur when no nodes have sufficient resources or meet the pod requirements.'
          },
          learnMore: 'https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/',
          estimatedTime: '10-20 minutes'
        });
      }
    });

    // Remove duplicates and dismissed suggestions
    const uniqueSuggestions = newSuggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.title === suggestion.title) &&
      !dismissedSuggestions.has(suggestion.id)
    );

    setSuggestions(uniqueSuggestions);
  }, [logs, events, selectedResource, dismissedSuggestions]);

  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const handleExecuteCommand = async (command: string) => {
    try {
      await executeCommand(command);
    } catch (error) {
      console.error('Failed to execute command:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };



  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'high':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="text-lg animate-pulse">🚨</span>;
      case 'high':
        return <span className="text-lg">⚠️</span>;
      case 'medium':
        return <span className="text-lg">🟡</span>;
      case 'low':
        return <span className="text-lg">ℹ️</span>;
      default:
        return <span className="text-lg">❓</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'command':
        return <Terminal className="w-4 h-4" />;
      case 'yaml':
        return <FileText className="w-4 h-4" />;
      case 'config':
        return <Settings className="w-4 h-4" />;
      case 'documentation':
        return <Book className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">🔧 Intelligent Fix Suggestions</h3>
              <p className="text-sm text-slate-600">AI-powered recommendations based on log analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full font-medium border border-yellow-300">
              {suggestions.length} suggestions
            </span>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-medium border border-green-300">
              {suggestions.filter(s => s.severity === 'critical').length} critical
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`border rounded-lg ${getSeverityColor(suggestion.severity)}`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(suggestion.severity)}
                    {getTypeIcon(suggestion.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-slate-900">{suggestion.title}</h4>
                      <span className="px-2 py-0.5 text-xs bg-white bg-opacity-60 rounded">
                        {suggestion.category}
                      </span>
                      {suggestion.estimatedTime && (
                        <span className="px-2 py-0.5 text-xs bg-white bg-opacity-60 rounded">
                          {suggestion.estimatedTime}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{suggestion.description}</p>
                    
                    {/* Quick action buttons */}
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      {suggestion.solution.command && (
                        <button
                          onClick={() => handleExecuteCommand(suggestion.solution.command!)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <span>🚀</span>
                          <span>Apply Fix</span>
                        </button>
                      )}

                      {suggestion.solution.yaml && (
                        <button
                          onClick={() => copyToClipboard(suggestion.solution.yaml!)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <span>📋</span>
                          <span>Copy YAML</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedSuggestion(
                          expandedSuggestion === suggestion.id ? null : suggestion.id
                        )}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm rounded-lg hover:from-slate-200 hover:to-slate-300 transition-all shadow-sm hover:shadow-md border border-slate-300"
                      >
                        <span>📖</span>
                        <span>Details</span>
                        <ChevronRight className={`w-3 h-3 transition-transform ${
                          expandedSuggestion === suggestion.id ? 'rotate-90' : ''
                        }`} />
                      </button>

                      {suggestion.learnMore && (
                        <a
                          href={suggestion.learnMore}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-sm rounded-lg hover:from-green-200 hover:to-green-300 transition-all shadow-sm hover:shadow-md border border-green-300"
                        >
                          <span>📚</span>
                          <span>Learn More</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDismiss(suggestion.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Dismiss suggestion"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Expanded details */}
              <AnimatePresence>
                {expandedSuggestion === suggestion.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white border-opacity-30"
                  >
                    {suggestion.solution.explanation && (
                      <div className="mb-4">
                        <h5 className="font-medium text-slate-900 mb-2">Explanation</h5>
                        <p className="text-sm text-slate-700">{suggestion.solution.explanation}</p>
                      </div>
                    )}
                    
                    {suggestion.solution.steps && (
                      <div className="mb-4">
                        <h5 className="font-medium text-slate-900 mb-2">Step-by-step Solution</h5>
                        <ol className="list-decimal list-inside space-y-1">
                          {suggestion.solution.steps.map((step, index) => (
                            <li key={index} className="text-sm text-slate-700">{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    {suggestion.solution.yaml && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-slate-900">YAML Configuration</h5>
                          <button
                            onClick={() => copyToClipboard(suggestion.solution.yaml!)}
                            className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-800"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="bg-slate-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                          <code>{suggestion.solution.yaml}</code>
                        </pre>
                      </div>
                    )}
                    
                    {suggestion.solution.command && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-slate-900">Command</h5>
                          <button
                            onClick={() => copyToClipboard(suggestion.solution.command!)}
                            className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-800"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <pre className="bg-slate-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                          <code>{suggestion.solution.command}</code>
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default InlineFixSuggestions;
