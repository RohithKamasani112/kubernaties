import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Copy,
  Download,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  FileText,
  Activity,
  Server,
  Network,
  Settings,
  Zap,
  Search,
  BarChart3,
  Shield,
  Database,
  Layers
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const SimulatedTerminal: React.FC = () => {
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: '🚀 Welcome to the Kubernetes Debugging Terminal!\n\n📋 Current Scenario: CrashLoopBackOff Mystery\n💡 A pod is stuck in CrashLoopBackOff state. Your mission: find and fix the issue!\n\n🔧 Quick Start Commands:\n  • kubectl get pods          - List all pods\n  • kubectl describe pod <name> - Get detailed pod info\n  • kubectl logs <name>       - View pod logs\n  • help                      - Show all available commands\n\n🎯 Start by checking the pod status...',
      timestamp: new Date()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { executeCommand, clusterState, commandHistory: storeCommandHistory } = useDebuggingStore();

  // Sync terminal lines with store command history
  useEffect(() => {
    const newTerminalLines: TerminalLine[] = [];

    storeCommandHistory.forEach((result, index) => {
      if (result.command === 'system') {
        // System messages (like welcome messages)
        newTerminalLines.push({
          id: `system-${index}`,
          type: 'output',
          content: result.output,
          timestamp: result.timestamp
        });
      } else {
        // User commands
        newTerminalLines.push({
          id: `command-${index}`,
          type: 'command',
          content: `$ ${result.command}`,
          timestamp: result.timestamp
        });

        // Command output
        newTerminalLines.push({
          id: `output-${index}`,
          type: result.exitCode === 0 ? 'output' : 'error',
          content: result.output,
          timestamp: new Date(result.timestamp.getTime() + 1) // Slightly after command
        });
      }
    });

    setTerminalLines(newTerminalLines);
  }, [storeCommandHistory]);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      // Smooth scroll to bottom
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalLines]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Common kubectl commands for autocompletion
  const kubectlCommands = [
    'kubectl get pods',
    'kubectl get nodes',
    'kubectl get services',
    'kubectl get deployments',
    'kubectl get events',
    'kubectl describe pod',
    'kubectl describe node',
    'kubectl describe service',
    'kubectl logs',
    'kubectl exec',
    'kubectl apply -f',
    'kubectl delete',
    'kubectl edit',
    'kubectl top pods',
    'kubectl top nodes',
    'kubectl get namespaces',
    'kubectl get configmaps',
    'kubectl get secrets',
    'kubectl get ingress',
    'kubectl get pv',
    'kubectl get pvc',
    'kubectl rollout status',
    'kubectl rollout restart',
    'kubectl scale',
    'kubectl port-forward',
    'kubectl proxy',
    'kubectl cluster-info',
    'kubectl version',
    'kubectl api-resources',
    'kubectl explain',
    'kubectl get pods -A',
    'kubectl get pods -n kube-system',
    'kubectl get endpoints',
    'kubectl get ep',
    'kubectl logs -f',
    'kubectl logs --previous',
    'kubectl logs -n kube-system',
    'kubectl exec -it',
    'kubectl get events --sort-by=.metadata.creationTimestamp',
    'kubectl get pods --field-selector=status.phase=Failed',
    'kubectl get pods --field-selector=status.phase=Pending',
    'kubectl top pods -A',
    'kubectl get svc',
    'kubectl get deploy',
    'kubectl get ns',
    'kubectl get cm'
  ];

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim() || isExecuting) return;

    setIsExecuting(true);

    // Add to history
    setCommandHistory(prev => [...prev, currentCommand]);
    setHistoryIndex(-1);

    try {
      let output = '';

      // Handle special commands
      if (currentCommand === 'help') {
        output = `🔧 Kubernetes Debugging Commands:

📋 Resource Inspection:
  kubectl get pods                    - List all pods
  kubectl get pods -o wide           - List pods with more details
  kubectl get nodes                  - List cluster nodes
  kubectl get events                 - Show cluster events
  kubectl get services               - List services
  kubectl get deployments           - List deployments

🔍 Detailed Information:
  kubectl describe pod <name>        - Show detailed pod information
  kubectl describe node <name>       - Show node details
  kubectl describe service <name>    - Show service details

📜 Logs & Debugging:
  kubectl logs <pod-name>            - Show pod logs
  kubectl logs <pod-name> --previous - Show logs from previous container
  kubectl logs <pod-name> -f         - Follow log output
  kubectl exec <pod-name> -- <cmd>   - Execute command in pod

⚙️  Configuration:
  kubectl apply -f <file>            - Apply YAML configuration
  kubectl edit <resource> <name>     - Edit resource configuration
  kubectl delete <resource> <name>   - Delete resource

📊 Resource Usage:
  kubectl top pods                   - Show pod resource usage
  kubectl top nodes                  - Show node resource usage

🛠️  Terminal Commands:
  clear                              - Clear terminal
  help                               - Show this help message

💡 Tip: Start with 'kubectl get pods' to see the current pod status!`;
      } else if (currentCommand === 'clear') {
        // Clear is handled locally, not through store
        setTerminalLines([]);
        setCurrentCommand('');
        setIsExecuting(false);
        return;
      } else if (currentCommand.startsWith('kubectl')) {
        // Execute kubectl command through the store - this will update the store's commandHistory
        await executeCommand(currentCommand);
      } else {
        // For non-kubectl commands, create a manual result and add to store
        const manualResult = {
          command: currentCommand,
          output: `Command not found: ${currentCommand}\nType "help" for available commands.`,
          exitCode: 1,
          timestamp: new Date()
        };
        // Note: We would need to add this to store's commandHistory manually
        // For now, let's handle it locally for non-kubectl commands
        const outputLine: TerminalLine = {
          id: (Date.now() + 1).toString(),
          type: 'error',
          content: manualResult.output,
          timestamp: new Date()
        };
        setTerminalLines(prev => [...prev, outputLine]);
      }
      
    } catch (error) {
      const errorLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      
      setTerminalLines(prev => [...prev, errorLine]);
    }
    
    setCurrentCommand('');
    setIsExecuting(false);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentCommand(value);

    // Show suggestions with better filtering
    if (value.length > 0) {
      const filtered = kubectlCommands.filter(cmd =>
        cmd.toLowerCase().startsWith(value.toLowerCase()) ||
        cmd.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setCurrentCommand(suggestions[0]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setCurrentCommand('');
      setShowSuggestions(false);
      setHistoryIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentCommand(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const copyToClipboard = () => {
    const terminalContent = terminalLines.map(line => line.content).join('\n');
    navigator.clipboard.writeText(terminalContent);
  };

  const downloadLogs = () => {
    const terminalContent = terminalLines.map(line => 
      `[${line.timestamp.toISOString()}] ${line.content}`
    ).join('\n');
    
    const blob = new Blob([terminalContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kubectl-session.log';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearTerminal = () => {
    setTerminalLines([]);
  };

  const getLineIcon = (type: string) => {
    switch (type) {
      case 'command':
        return <ChevronRight className="w-3 h-3 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'output':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  // Enhanced contextual command suggestions with better categorization
  const getContextualSuggestions = () => {
    const { currentScenario } = useDebuggingStore.getState();
    const recentCommands = commandHistory.slice(-3).map(cmd => cmd.toLowerCase());

    const baseSuggestions = [
      {
        label: '📦 Get Pods',
        command: 'kubectl get pods --all-namespaces',
        icon: Eye,
        description: 'List all pods across namespaces',
        category: 'discovery',
        priority: 1
      },
      {
        label: '📋 Get Events',
        command: 'kubectl get events --sort-by=.metadata.creationTimestamp --field-selector type!=Normal',
        icon: Activity,
        description: 'Show recent warning and error events',
        category: 'discovery',
        priority: 2
      },
      {
        label: '🖥️ Get Nodes',
        command: 'kubectl get nodes -o wide',
        icon: Server,
        description: 'List cluster nodes with detailed info',
        category: 'infrastructure',
        priority: 3
      },
      {
        label: '🌐 Get Services',
        command: 'kubectl get services --all-namespaces',
        icon: Network,
        description: 'List all services across namespaces',
        category: 'networking',
        priority: 4
      }
    ];

    // Enhanced scenario-specific suggestions
    const scenarioSuggestions = [];

    if (currentScenario) {
      switch (currentScenario.id) {
        case 'crashloop-1':
          scenarioSuggestions.push(
            {
              label: '📜 Pod Logs',
              command: 'kubectl logs nginx-deployment-abc123 --previous',
              icon: FileText,
              description: 'Check logs from crashed container',
              category: 'debugging',
              priority: 1
            },
            {
              label: '🔬 Describe Pod',
              command: 'kubectl describe pod nginx-deployment-abc123',
              icon: Search,
              description: 'Get detailed pod information and events',
              category: 'debugging',
              priority: 2
            },
            {
              label: '⚙️ Set Env Var',
              command: 'kubectl set env deployment/nginx-deployment DATABASE_URL=postgresql://localhost:5432/mydb',
              icon: Settings,
              description: 'Fix missing environment variable',
              category: 'fix',
              priority: 3
            },
            {
              label: '🔄 Restart Deployment',
              command: 'kubectl rollout restart deployment/nginx-deployment',
              icon: RotateCcw,
              description: 'Restart deployment after fix',
              category: 'fix',
              priority: 4
            }
          );
          break;
        case 'imagepull-1':
          scenarioSuggestions.push(
            {
              label: '🔬 Describe Pod',
              command: 'kubectl describe pod frontend-deployment-ghi789',
              icon: Search,
              description: 'Check image pull status and errors',
              category: 'debugging',
              priority: 1
            },
            {
              label: '🖼️ Fix Image',
              command: 'kubectl set image deployment/frontend-deployment frontend=nginx:latest',
              icon: Settings,
              description: 'Update to working image',
              category: 'fix',
              priority: 2
            },
            {
              label: '📋 Check Events',
              command: 'kubectl get events --field-selector involvedObject.name=frontend-deployment-ghi789',
              icon: Activity,
              description: 'View pod-specific events',
              category: 'debugging',
              priority: 3
            }
          );
          break;
        case 'pod-pending-1':
          scenarioSuggestions.push(
            {
              label: '📊 Node Resources',
              command: 'kubectl top nodes',
              icon: BarChart3,
              description: 'Check node resource usage',
              category: 'monitoring',
              priority: 1
            },
            {
              label: '🖥️ Describe Nodes',
              command: 'kubectl describe nodes',
              icon: Server,
              description: 'Check node conditions and capacity',
              category: 'infrastructure',
              priority: 2
            },
            {
              label: '📦 Pending Pods',
              command: 'kubectl get pods --field-selector=status.phase=Pending',
              icon: Clock,
              description: 'List all pending pods',
              category: 'debugging',
              priority: 3
            }
          );
          break;
        case 'service-unreachable-1':
          scenarioSuggestions.push(
            {
              label: '🎯 Get Endpoints',
              command: 'kubectl get endpoints',
              icon: Network,
              description: 'Check service endpoints',
              category: 'networking',
              priority: 1
            },
            {
              label: '🧪 Test Connection',
              command: 'kubectl run test-pod --image=busybox --rm -it -- wget -qO- http://service-name:port',
              icon: Zap,
              description: 'Test network connectivity',
              category: 'debugging',
              priority: 2
            },
            {
              label: '🌐 Network Policies',
              command: 'kubectl get networkpolicies',
              icon: Shield,
              description: 'Check network policies',
              category: 'networking',
              priority: 3
            }
          );
          break;
      }
    }

    // Add context-aware suggestions based on recent commands
    const contextSuggestions = [];

    if (recentCommands.some(cmd => cmd.includes('get pods'))) {
      contextSuggestions.push(
        { label: 'Pod Details', command: 'kubectl describe pod <pod-name>', icon: Search, description: 'Get detailed pod information' },
        { label: 'Pod Logs', command: 'kubectl logs <pod-name>', icon: FileText, description: 'View pod logs' }
      );
    }

    if (recentCommands.some(cmd => cmd.includes('logs'))) {
      contextSuggestions.push(
        { label: 'Previous Logs', command: 'kubectl logs <pod-name> --previous', icon: Clock, description: 'View logs from previous container' },
        { label: 'Follow Logs', command: 'kubectl logs -f <pod-name>', icon: Activity, description: 'Stream logs in real-time' }
      );
    }

    if (recentCommands.some(cmd => cmd.includes('describe'))) {
      contextSuggestions.push(
        { label: 'Edit Resource', command: 'kubectl edit <resource> <name>', icon: Settings, description: 'Edit resource configuration' },
        { label: 'Get YAML', command: 'kubectl get <resource> <name> -o yaml', icon: FileText, description: 'Export resource as YAML' }
      );
    }

    // Advanced debugging suggestions
    const advancedSuggestions = [
      { label: 'Resource Usage', command: 'kubectl top pods', icon: BarChart3, description: 'Check pod resource usage' },
      { label: 'Network Policies', command: 'kubectl get networkpolicies', icon: Shield, description: 'List network policies' },
      { label: 'ConfigMaps', command: 'kubectl get configmaps', icon: Database, description: 'List configuration maps' },
      { label: 'Secrets', command: 'kubectl get secrets', icon: Shield, description: 'List secrets' },
      { label: 'Ingress', command: 'kubectl get ingress', icon: Network, description: 'List ingress resources' },
      { label: 'Namespaces', command: 'kubectl get namespaces', icon: Layers, description: 'List all namespaces' }
    ];

    // Combine and limit suggestions
    const allSuggestions = [
      ...baseSuggestions,
      ...scenarioSuggestions,
      ...contextSuggestions,
      ...advancedSuggestions
    ];

    // Remove duplicates and limit to 8 suggestions
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) =>
      index === self.findIndex(s => s.command === suggestion.command)
    );

    return uniqueSuggestions.slice(0, 8);
  };

  return (
    <motion.div
      className={`bg-slate-900 text-green-400 font-mono ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} flex flex-col overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        height: isFullscreen ? '100vh' : '100%',
        maxHeight: isFullscreen ? '100vh' : '100%'
      }}
    >
      {/* Terminal Header - Mobile Responsive */}
      <div className="flex-shrink-0 bg-slate-800 px-2 sm:px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <span className="text-xs sm:text-sm font-medium text-slate-300">kubectl Terminal</span>
          </div>

          <div className="flex items-center space-x-1 hidden sm:flex">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation"
            title="Copy terminal content"
          >
            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={downloadLogs}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation hidden sm:block"
            title="Download session log"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={clearTerminal}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation"
            title="Clear terminal"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-200 transition-colors touch-manipulation"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Content - Scrollable Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div
          ref={terminalRef}
          className="h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
        >
          <div className="space-y-1">
            {terminalLines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start space-x-2"
              >
                <div className="flex items-center space-x-1 mt-0.5">
                  {getLineIcon(line.type)}
                  <span className="text-xs text-slate-500">
                    {line.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <pre className={`flex-1 whitespace-pre-wrap text-sm ${
                  line.type === 'command' ? 'text-blue-400 font-semibold' :
                  line.type === 'error' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {line.content}
                </pre>
              </motion.div>
            ))}

            {isExecuting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-yellow-400"
              >
                <div className="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full"></div>
                <span className="text-sm">Executing command...</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Command Input - Always Fixed at Bottom */}
      <div className="flex-shrink-0 relative z-20">
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Compact input area - always at bottom - Mobile Responsive */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-750 to-slate-800 border-t border-slate-600 shadow-xl">
          <form onSubmit={handleCommandSubmit} className="px-2 sm:px-4 py-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-green-400 font-mono text-sm font-bold">$</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={isExecuting}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-2 sm:px-3 py-2 text-green-400 font-mono text-xs sm:text-sm outline-none placeholder-slate-500 focus:border-green-400 focus:ring-1 focus:ring-green-400/20 transition-all duration-200"
                  placeholder="Enter kubectl command..."
                  autoComplete="off"
                />
                {isExecuting && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={isExecuting || !currentCommand.trim()}
                className="bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded font-medium text-sm transition-all duration-200 flex items-center space-x-1"
              >
                {isExecuting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Send</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Compact Command Suggestions */}
          <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium flex items-center space-x-1">
                <span>🚀</span>
                <span>Quick Commands</span>
              </span>
              <span className="text-xs text-slate-500">
                {getContextualSuggestions().length} available
              </span>
            </div>

            {/* Compact suggestions - single row */}
            <div className="flex flex-wrap gap-1">
              {getContextualSuggestions().slice(0, 6).map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentCommand(suggestion.command)}
                  className="flex items-center space-x-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded text-xs transition-all border border-slate-600 hover:border-slate-500"
                  title={suggestion.description}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <suggestion.icon className="w-3 h-3" />
                  <span className="font-medium">{suggestion.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Compact Command info bar */}
          <div className="px-4 py-1.5 flex items-center justify-between text-xs border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-slate-400">
                <span>💡</span>
                <span>Click suggestions above</span>
              </span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span>⬆️⬇️</span>
                <span>History</span>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Connected</span>
              </div>
              <span className="text-slate-400 text-xs">{commandHistory.length} commands</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SimulatedTerminal;
