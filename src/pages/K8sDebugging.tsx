import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug,
  Terminal,
  Activity,
  Eye,
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Server,
  Network,
  Database,
  Shield,
  Layers,
  Target,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Monitor,
  Code,
  GitBranch,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi
} from 'lucide-react';
import ClusterExplorer from '../components/debugging/ClusterExplorer';
import SimulatedTerminal from '../components/debugging/SimulatedTerminal';
import LogViewer from '../components/debugging/LogViewer';
import YamlEditor from '../components/debugging/YamlEditor';
import MetricsDashboard from '../components/debugging/MetricsDashboard';
import QuickActionButtons from '../components/debugging/QuickActionButtons';
import InlineFixSuggestions from '../components/debugging/InlineFixSuggestions';
import PodRestartTimeline from '../components/debugging/PodRestartTimeline';
import AutoDiagnosisPanel from '../components/debugging/AutoDiagnosisPanel';
import ProgressTracker from '../components/debugging/ProgressTracker';
import YamlAutoFix from '../components/debugging/YamlAutoFix';
import ScenarioPanel from '../components/debugging/ScenarioPanel';
import HintsPanel from '../components/debugging/HintsPanel';
import { useDebuggingStore } from '../store/debuggingStore';

const K8sDebugging: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string>('terminal');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>('crashloop-1');
  const [showHints, setShowHints] = useState(false);
  const [showScenarioPanel, setShowScenarioPanel] = useState(false);
  
  const {
    currentScenario,
    clusterState,
    simulationStatus,
    startScenario,
    pauseSimulation,
    resetScenario,
    isLoading
  } = useDebuggingStore();

  // Auto-start simulation when scenario is selected
  useEffect(() => {
    if (selectedScenario) {
      setIsSimulationRunning(true);
      startScenario(selectedScenario);
    }
  }, [selectedScenario, startScenario]);

  const panels = [
    { id: 'cluster', label: 'Cluster Explorer', icon: Server, color: 'text-blue-600' },
    { id: 'terminal', label: 'kubectl Terminal', icon: Terminal, color: 'text-green-600' },
    { id: 'logs', label: 'Logs & Events', icon: FileText, color: 'text-orange-600' },
    { id: 'yaml', label: 'YAML Editor', icon: Code, color: 'text-purple-600' },
    { id: 'metrics', label: 'Metrics', icon: Activity, color: 'text-red-600' },
  ];

  const scenarioCategories = [
    { id: 'pod-issues-1', name: 'Pod-Level Issues', icon: Layers, count: 3, color: 'bg-red-500' },
    { id: 'networking-1', name: 'Networking', icon: Network, count: 3, color: 'bg-blue-500' },
    { id: 'scheduling-1', name: 'Node & Scheduling', icon: Server, count: 3, color: 'bg-green-500' },
    { id: 'storage-1', name: 'Storage & Security', icon: Database, count: 3, color: 'bg-purple-500' },
    { id: 'ingress-1', name: 'Ingress & Controllers', icon: Shield, count: 3, color: 'bg-orange-500' },
    { id: 'advanced-1', name: 'Advanced Scenarios', icon: Target, count: 31, color: 'bg-indigo-500' },
  ];

  const handlePanelChange = (panelId: string) => {
    setActivePanel(panelId);
  };

  const handleSimulationToggle = () => {
    if (isSimulationRunning) {
      pauseSimulation();
      setIsSimulationRunning(false);
    } else {
      if (selectedScenario) {
        startScenario(selectedScenario);
        setIsSimulationRunning(true);
      }
    }
  };

  const handleReset = () => {
    resetScenario();
    setIsSimulationRunning(false);
    setSelectedScenario(null);
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'cluster':
        return <ClusterExplorer />;
      case 'terminal':
        return <SimulatedTerminal />;
      case 'logs':
        return <LogViewer />;
      case 'yaml':
        return <YamlEditor />;
      case 'metrics':
        return <MetricsDashboard />;
      case 'diagnosis':
        return <AutoDiagnosisPanel />;
      case 'progress':
        return <ProgressTracker />;
      case 'timeline':
        return <PodRestartTimeline />;
      case 'autofix':
        return <YamlAutoFix />;
      case 'suggestions':
        return (
          <div className="space-y-6">
            <InlineFixSuggestions
              logs={clusterState.logs}
              events={clusterState.events}
              selectedResource={selectedResource}
            />
            <QuickActionButtons
              selectedResource={selectedResource}
              onCommandExecute={executeCommand}
            />
          </div>
        );
      default:
        return <ClusterExplorer />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-8 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex items-center space-x-4">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Loading Scenario</h3>
                  <p className="text-sm text-slate-600">Preparing your debugging environment...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Optimized for 100% zoom */}
      <motion.div
        className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Bug className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">K8s Debugging Lab</h1>
                <p className="text-xs text-slate-600">Production-grade debugging simulation</p>
              </div>
            </div>

            {currentScenario && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700">{currentScenario.name}</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                  {currentScenario.difficulty}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 rounded-md border border-green-200">
              <span className="text-xs font-medium text-green-700">43 Scenarios Available</span>
              <span className="text-xs text-green-600">🎯</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Simulation Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleSimulationToggle}
                disabled={!selectedScenario}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isSimulationRunning
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-slate-300 disabled:text-slate-500'
                }`}
              >
                {isSimulationRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isSimulationRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Scenario Selector */}
            <button
              onClick={() => setShowScenarioPanel(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-sm font-medium transition-all"
            >
              <Target className="w-3 h-3" />
              <span>Scenarios</span>
            </button>

            {/* Hints Toggle */}
            <button
              onClick={() => setShowHints(!showHints)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                showHints
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Hints</span>
            </button>

            {/* Status Indicator */}
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                simulationStatus === 'running' ? 'bg-green-500 animate-pulse' :
                simulationStatus === 'error' ? 'bg-red-500' : 'bg-slate-400'
              }`}></div>
              <span className="text-xs text-slate-600 capitalize">{simulationStatus}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex min-h-[600px]">
        {/* Scenario Selector Sidebar */}
        {false && (
          <motion.div
            className="w-80 bg-white border-r border-slate-200 overflow-y-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Choose Debug Scenario</h2>
              
              <div className="space-y-3">
                {scenarioCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedScenario(category.id)}
                    className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-slate-900">{category.name}</h3>
                          <p className="text-sm text-slate-600">{category.count} scenarios</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedScenario && (
            <>
              {/* Panel Navigation - Compact */}
              <div className="bg-white border-b border-slate-200 px-4 py-2">
                <div className="flex items-center space-x-1">
                  {panels.map((panel) => {
                    const Icon = panel.icon;
                    return (
                      <button
                        key={panel.id}
                        onClick={() => handlePanelChange(panel.id)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                          activePanel === panel.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-3 h-3 ${activePanel === panel.id ? panel.color : ''}`} />
                        <span>{panel.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel Content */}
              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  {renderActivePanel()}
                </div>

                {/* Hints Panel - Compact */}
                <AnimatePresence>
                  {showHints && (
                    <motion.div
                      className="w-72 border-l border-slate-200"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HintsPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scenario Panel */}
      {showScenarioPanel && (
        <ScenarioPanel
          onClose={() => setShowScenarioPanel(false)}
          onScenarioChange={(scenarioId) => {
            setSelectedScenario(scenarioId);
            setShowScenarioPanel(false);
            setIsSimulationRunning(false); // Reset simulation state
          }}
        />
      )}
    </div>
  );
};

export default K8sDebugging;
