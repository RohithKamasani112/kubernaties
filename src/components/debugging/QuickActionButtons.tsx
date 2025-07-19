import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  FileText,
  RotateCcw,
  Terminal,
  Download,
  Edit,
  Play,
  Pause,
  Trash2,
  Copy,
  ExternalLink,
  Zap,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Search,
  RefreshCw,
  Database,
  Network,
  Shield,
  Layers,
  Monitor,
  HelpCircle,
  Target,
  TrendingUp,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  GitBranch,
  Code
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface QuickActionButtonsProps {
  selectedResource?: {
    type: string;
    name: string;
    namespace?: string;
  };
  onCommandExecute?: (command: string) => void;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  selectedResource,
  onCommandExecute
}) => {
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const { executeCommand, clusterState } = useDebuggingStore();

  const handleQuickAction = async (action: string, command: string) => {
    setIsExecuting(action);
    
    try {
      if (onCommandExecute) {
        onCommandExecute(command);
      } else {
        await executeCommand(command);
      }
    } catch (error) {
      console.error('Failed to execute command:', error);
    } finally {
      setTimeout(() => setIsExecuting(null), 1000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getResourceCommands = () => {
    if (!selectedResource) return [];

    const { type, name, namespace } = selectedResource;
    const nsFlag = namespace && namespace !== 'default' ? ` -n ${namespace}` : '';

    const baseCommands = [
      {
        id: 'describe',
        label: '🔍 Describe',
        icon: Eye,
        command: `kubectl describe ${type} ${name}${nsFlag}`,
        color: 'blue',
        description: 'Get detailed information about the resource',
        category: 'inspection',
        priority: 1
      },
      {
        id: 'yaml',
        label: '📄 View YAML',
        icon: FileText,
        command: `kubectl get ${type} ${name}${nsFlag} -o yaml`,
        color: 'purple',
        description: 'Export resource configuration as YAML',
        category: 'inspection',
        priority: 2
      },
      {
        id: 'edit',
        label: '✏️ Edit Live',
        icon: Edit,
        command: `kubectl edit ${type} ${name}${nsFlag}`,
        color: 'green',
        description: 'Edit resource configuration live',
        category: 'modification',
        priority: 3
      },
      {
        id: 'events',
        label: '📋 Events',
        icon: Activity,
        command: `kubectl get events --field-selector involvedObject.name=${name}${nsFlag}`,
        color: 'orange',
        description: 'Show events related to this resource',
        category: 'inspection',
        priority: 4
      }
    ];

    // Add type-specific commands
    if (type === 'pod') {
      baseCommands.push(
        {
          id: 'logs',
          label: '📜 Logs',
          icon: Terminal,
          command: `kubectl logs ${name}${nsFlag}`,
          color: 'orange',
          description: 'View container logs',
          category: 'debugging',
          priority: 1
        },
        {
          id: 'logs-previous',
          label: '⏮️ Previous Logs',
          icon: Clock,
          command: `kubectl logs ${name}${nsFlag} --previous`,
          color: 'orange',
          description: 'View logs from previous container instance',
          category: 'debugging',
          priority: 2
        },
        {
          id: 'logs-follow',
          label: '📡 Follow Logs',
          icon: Activity,
          command: `kubectl logs -f ${name}${nsFlag}`,
          color: 'orange',
          description: 'Stream logs in real-time',
          category: 'debugging',
          priority: 3
        },
        {
          id: 'exec',
          label: '🖥️ Shell',
          icon: Terminal,
          command: `kubectl exec -it ${name}${nsFlag} -- /bin/bash`,
          color: 'slate',
          description: 'Open interactive shell in container',
          category: 'debugging',
          priority: 4
        },
        {
          id: 'exec-sh',
          label: '🐚 Shell (sh)',
          icon: Terminal,
          command: `kubectl exec -it ${name}${nsFlag} -- /bin/sh`,
          color: 'slate',
          description: 'Open shell (fallback for minimal containers)',
          category: 'debugging',
          priority: 5
        },
        {
          id: 'restart',
          label: '🔄 Restart Pod',
          icon: RotateCcw,
          command: `kubectl delete pod ${name}${nsFlag}`,
          color: 'yellow',
          description: 'Force restart pod (delete and recreate)',
          category: 'modification',
          priority: 1
        },
        {
          id: 'port-forward',
          label: '🔗 Port Forward',
          icon: Network,
          command: `kubectl port-forward ${name}${nsFlag} 8080:80`,
          color: 'cyan',
          description: 'Forward local port to pod',
          category: 'networking',
          priority: 1
        },
        {
          id: 'top',
          label: '📊 Resource Usage',
          icon: TrendingUp,
          command: `kubectl top pod ${name}${nsFlag}`,
          color: 'green',
          description: 'Show CPU and memory usage',
          category: 'monitoring',
          priority: 1
        }
      );
    }

    if (type === 'deployment') {
      baseCommands.push(
        {
          id: 'rollout-status',
          label: '📈 Rollout Status',
          icon: TrendingUp,
          command: `kubectl rollout status deployment/${name}${nsFlag}`,
          color: 'blue',
          description: 'Check deployment rollout status',
          category: 'monitoring',
          priority: 1
        },
        {
          id: 'rollout-history',
          label: '📚 Rollout History',
          icon: Clock,
          command: `kubectl rollout history deployment/${name}${nsFlag}`,
          color: 'purple',
          description: 'View deployment rollout history',
          category: 'inspection',
          priority: 2
        },
        {
          id: 'rollout-undo',
          label: '⏪ Rollback',
          icon: RotateCcw,
          command: `kubectl rollout undo deployment/${name}${nsFlag}`,
          color: 'red',
          description: 'Rollback to previous version',
          category: 'modification',
          priority: 1
        },
        {
          id: 'scale-up',
          label: '⬆️ Scale Up',
          icon: TrendingUp,
          command: `kubectl scale deployment ${name}${nsFlag} --replicas=3`,
          color: 'green',
          description: 'Scale deployment to 3 replicas',
          category: 'modification',
          priority: 2
        },
        {
          id: 'scale-down',
          label: '⬇️ Scale Down',
          icon: TrendingUp,
          command: `kubectl scale deployment ${name}${nsFlag} --replicas=1`,
          color: 'yellow',
          description: 'Scale deployment to 1 replica',
          category: 'modification',
          priority: 3
        },
        {
          id: 'restart-deployment',
          label: '🔄 Restart Deployment',
          icon: RefreshCw,
          command: `kubectl rollout restart deployment/${name}${nsFlag}`,
          color: 'orange',
          description: 'Restart all pods in deployment',
          category: 'modification',
          priority: 4
        }
      );
    }

    if (type === 'service') {
      baseCommands.push(
        {
          id: 'endpoints',
          label: '🎯 Endpoints',
          icon: Target,
          command: `kubectl get endpoints ${name}${nsFlag}`,
          color: 'blue',
          description: 'Show service endpoints',
          category: 'networking',
          priority: 1
        },
        {
          id: 'port-forward-svc',
          label: '🔗 Port Forward',
          icon: Network,
          command: `kubectl port-forward service/${name}${nsFlag} 8080:80`,
          color: 'cyan',
          description: 'Forward local port to service',
          category: 'networking',
          priority: 2
        }
      );
    }

    if (type === 'node') {
      baseCommands.push(
        {
          id: 'node-top',
          label: '📊 Resource Usage',
          icon: TrendingUp,
          command: `kubectl top node ${name}`,
          color: 'green',
          description: 'Show node resource usage',
          category: 'monitoring',
          priority: 1
        },
        {
          id: 'node-pods',
          label: '📦 Pods on Node',
          icon: Layers,
          command: `kubectl get pods --all-namespaces --field-selector spec.nodeName=${name}`,
          color: 'blue',
          description: 'List all pods running on this node',
          category: 'inspection',
          priority: 2
        },
        {
          id: 'node-capacity',
          label: '💾 Node Capacity',
          icon: HardDrive,
          command: `kubectl describe node ${name} | grep -A 5 "Capacity:"`,
          color: 'purple',
          description: 'Show node capacity and allocatable resources',
          category: 'inspection',
          priority: 3
        },
        {
          id: 'cordon-node',
          label: '🚫 Cordon Node',
          icon: Shield,
          command: `kubectl cordon ${name}`,
          color: 'red',
          description: 'Mark node as unschedulable',
          category: 'modification',
          priority: 1
        },
        {
          id: 'uncordon-node',
          label: '✅ Uncordon Node',
          icon: CheckCircle,
          command: `kubectl uncordon ${name}`,
          color: 'green',
          description: 'Mark node as schedulable',
          category: 'modification',
          priority: 2
        }
      );
    }

    if (type === 'service') {
      baseCommands.push(
        {
          id: 'endpoints',
          label: '🎯 Endpoints',
          icon: Target,
          command: `kubectl get endpoints ${name}${nsFlag}`,
          color: 'blue',
          description: 'Show service endpoints',
          category: 'networking',
          priority: 1
        },
        {
          id: 'port-forward-svc',
          label: '🔗 Port Forward',
          icon: Network,
          command: `kubectl port-forward service/${name}${nsFlag} 8080:80`,
          color: 'cyan',
          description: 'Forward local port to service',
          category: 'networking',
          priority: 2
        },
        {
          id: 'test-connectivity',
          label: '🧪 Test Connection',
          icon: Wifi,
          command: `kubectl run test-pod --image=busybox --rm -it -- wget -qO- http://${name}:80`,
          color: 'green',
          description: 'Test service connectivity',
          category: 'debugging',
          priority: 1
        }
      );
    }

    if (type === 'configmap' || type === 'secret') {
      baseCommands.push(
        {
          id: 'data-view',
          label: '📋 View Data',
          icon: Database,
          command: `kubectl get ${type} ${name}${nsFlag} -o yaml`,
          color: 'blue',
          description: `View ${type} data`,
          category: 'inspection',
          priority: 1
        },
        {
          id: 'pods-using',
          label: '📦 Pods Using',
          icon: Search,
          command: `kubectl get pods ${nsFlag} -o jsonpath='{range .items[*]}{.metadata.name}{": "}{.spec.volumes[*].${type}}{"\n"}{end}' | grep ${name}`,
          color: 'purple',
          description: `Find pods using this ${type}`,
          category: 'inspection',
          priority: 2
        }
      );
    }

    return baseCommands;
  };

  const getColorClasses = (color: string, isExecuting: boolean) => {
    const baseClasses = 'transition-all duration-200 shadow-sm hover:shadow-md';

    if (isExecuting) {
      return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200`;
    }

    switch (color) {
      case 'blue':
        return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-blue-200/50`;
      case 'green':
        return `${baseClasses} bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-green-200/50`;
      case 'purple':
        return `${baseClasses} bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300 hover:shadow-purple-200/50`;
      case 'orange':
        return `${baseClasses} bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300 hover:shadow-orange-200/50`;
      case 'red':
        return `${baseClasses} bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-red-200/50`;
      case 'yellow':
        return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 hover:shadow-yellow-200/50`;
      case 'cyan':
        return `${baseClasses} bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 hover:shadow-cyan-200/50`;
      default:
        return `${baseClasses} bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:shadow-slate-200/50`;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inspection': return <Eye className="w-4 h-4" />;
      case 'debugging': return <Search className="w-4 h-4" />;
      case 'modification': return <Settings className="w-4 h-4" />;
      case 'monitoring': return <Monitor className="w-4 h-4" />;
      case 'networking': return <Network className="w-4 h-4" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  const groupCommandsByCategory = (commands: any[]) => {
    const grouped = commands.reduce((acc, cmd) => {
      const category = cmd.category || 'general';
      if (!acc[category]) acc[category] = [];
      acc[category].push(cmd);
      return acc;
    }, {} as Record<string, any[]>);

    // Sort commands within each category by priority
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.priority || 999) - (b.priority || 999));
    });

    return grouped;
  };

  const commands = getResourceCommands();
  const groupedCommands = groupCommandsByCategory(commands);

  if (!selectedResource || commands.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-700 mb-2">No Resource Selected</h3>
        <p className="text-slate-500 text-sm">Select a resource from the cluster explorer to see quick actions</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-lg shadow-sm"
    >
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 p-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
              <p className="text-xs text-slate-600">Production-grade debugging commands</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-slate-700">{selectedResource.type}</div>
            <div className="text-xs text-slate-500">{selectedResource.name}</div>
          </div>
        </div>
      </div>

      {/* Categorized Commands - Compact */}
      <div className="p-3 space-y-4">
        {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
          <div key={category}>
            <div className="flex items-center space-x-1 mb-2">
              {getCategoryIcon(category)}
              <h4 className="text-sm font-medium text-slate-700 capitalize">
                {category === 'inspection' ? '🔍 Inspection' :
                 category === 'debugging' ? '🐛 Debugging' :
                 category === 'modification' ? '⚙️ Modification' :
                 category === 'monitoring' ? '📊 Monitoring' :
                 category === 'networking' ? '🌐 Networking' :
                 category}
              </h4>
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400">{categoryCommands.length} commands</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categoryCommands.map((cmd) => {
                const Icon = cmd.icon;
                const executing = isExecuting === cmd.id;

                return (
                  <motion.div
                    key={cmd.id}
                    whileHover={{ scale: executing ? 1 : 1.01 }}
                    whileTap={{ scale: executing ? 1 : 0.99 }}
                    className="relative"
                  >
                    <button
                      onClick={() => handleQuickAction(cmd.id, cmd.command)}
                      disabled={executing}
                      className={`w-full p-2 border rounded-md text-left group relative overflow-hidden ${getColorClasses(cmd.color, executing)}`}
                      title={cmd.description}
                    >
                      <div className="flex items-center space-x-1 mb-1">
                        {executing ? (
                          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        ) : (
                          <Icon className="w-3 h-3" />
                        )}
                        <span className="font-medium text-xs">{cmd.label}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-black bg-opacity-10 px-1.5 py-0.5 rounded font-mono truncate flex-1 mr-1">
                          {cmd.command.length > 25 ? `${cmd.command.substring(0, 25)}...` : cmd.command}
                        </code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(cmd.command);
                          }}
                          className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:bg-opacity-10 rounded"
                          title="Copy command"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Priority indicator */}
                      {cmd.priority === 1 && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Common debugging commands */}
      <div className="border-t border-slate-200 p-4 bg-slate-50 rounded-b-lg">
        <div className="flex items-center space-x-2 mb-3">
          <HelpCircle className="w-4 h-4 text-slate-600" />
          <h4 className="font-medium text-slate-700">🚀 Essential Debug Commands</h4>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              label: '📋 Recent Events',
              command: 'kubectl get events --sort-by=.metadata.creationTimestamp --field-selector type!=Normal',
              icon: Activity,
              description: 'Show recent warning and error events'
            },
            {
              label: '📦 All Pods Status',
              command: 'kubectl get pods --all-namespaces -o wide',
              icon: Layers,
              description: 'List all pods with detailed information'
            },
            {
              label: '🖥️ Node Health',
              command: 'kubectl get nodes -o wide',
              icon: Monitor,
              description: 'Check cluster node status and health'
            },
            {
              label: '📊 Resource Usage',
              command: 'kubectl top pods --all-namespaces --sort-by=memory',
              icon: TrendingUp,
              description: 'Show resource consumption by pods'
            },
            {
              label: '🔍 Failed Pods',
              command: 'kubectl get pods --all-namespaces --field-selector=status.phase=Failed',
              icon: AlertTriangle,
              description: 'Find all failed pods across namespaces'
            },
            {
              label: '⏳ Pending Pods',
              command: 'kubectl get pods --all-namespaces --field-selector=status.phase=Pending',
              icon: Clock,
              description: 'Find pods stuck in pending state'
            }
          ].map((cmd, index) => {
            const Icon = cmd.icon;
            return (
              <motion.button
                key={index}
                onClick={() => handleQuickAction(`common-${index}`, cmd.command)}
                className="flex items-center justify-between p-3 text-sm bg-white hover:bg-blue-50 rounded-lg border border-slate-200 hover:border-blue-200 text-left group transition-all duration-200 shadow-sm hover:shadow-md"
                title={cmd.description}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                  <span className="font-medium text-slate-700 group-hover:text-blue-700">{cmd.label}</span>
                </div>
                <Copy
                  className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(cmd.command);
                  }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Quick tips */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">💡 Pro Tips:</p>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• Use <code className="bg-blue-100 px-1 rounded">--watch</code> flag to monitor changes in real-time</li>
                <li>• Add <code className="bg-blue-100 px-1 rounded">--previous</code> to logs command for crashed containers</li>
                <li>• Use <code className="bg-blue-100 px-1 rounded">-o yaml</code> to see full resource configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActionButtons;
