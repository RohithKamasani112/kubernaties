import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Save, Play, Pause, BookOpen } from 'lucide-react';
import { useKubernetesStore } from '../store/kubernetesStore';
import KubernetesCanvas from '../components/playground/KubernetesCanvas';
import YamlEditor from '../components/playground/YamlEditor';
import StatusPanel from '../components/playground/StatusPanel';
import ComponentPalette from '../components/playground/ComponentPalette';
import LearningGuide from '../components/playground/LearningGuide';
import ArchitectureValidator from '../components/playground/ArchitectureValidator';
import ExamplesGallery from '../components/playground/ExamplesGallery';
import toast from 'react-hot-toast';

const Playground: React.FC = () => {
  const { nodes, edges, clearCanvas, simulationStatus, setSimulationStatus } = useKubernetesStore();
  const [showExamplesGallery, setShowExamplesGallery] = React.useState(false);
  const [yamlEditorHeight, setYamlEditorHeight] = React.useState(224);

  const handleResetFlow = () => {
    if (nodes.length === 0) {
      toast.error('Canvas is already empty');
      return;
    }

    if (window.confirm('Are you sure you want to reset the entire flow? This action cannot be undone.')) {
      clearCanvas();
      toast.success('Flow reset successfully', {
        icon: '🔄',
        duration: 3000,
      });
    }
  };

  const handleSaveFlow = () => {
    const flowData = { nodes, edges, timestamp: new Date().toISOString() };
    localStorage.setItem('kubelab-flow', JSON.stringify(flowData));
    toast.success('Flow saved to local storage', {
      icon: '💾',
      duration: 2000,
    });
  };

  const toggleSimulation = () => {
    const newStatus = simulationStatus === 'running' ? 'stopped' : 'running';
    setSimulationStatus(newStatus);
    toast.success(`Simulation ${newStatus}`, {
      icon: newStatus === 'running' ? '▶️' : '⏸️',
      duration: 2000,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div 
        className="bg-white border-b border-slate-200 px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kubernetes Playground</h1>
            <p className="text-slate-600 mt-1">
              Drag and drop components to build your Kubernetes application
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                simulationStatus === 'running'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-slate-400'
              }`}></div>
              <span className="text-sm text-slate-600">
                Simulation {simulationStatus === 'running' ? 'Running' : 'Stopped'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSimulation}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  simulationStatus === 'running'
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
                title={simulationStatus === 'running' ? 'Pause Simulation' : 'Start Simulation'}
              >
                {simulationStatus === 'running' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowExamplesGallery(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-medium transition-colors"
                title="Browse Examples"
              >
                <BookOpen className="w-4 h-4" />
                <span>Examples</span>
              </button>

              <button
                onClick={handleSaveFlow}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
                title="Save Flow"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>

              <button
                onClick={handleResetFlow}
                className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                title="Reset Flow"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Compact Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette - Increased width to fix clumsy layout */}
        <div className="w-64 flex-shrink-0 overflow-hidden">
          <ComponentPalette />
        </div>

        {/* Canvas and YAML Area - Flexible Layout */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Section: Canvas and Status Panel */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Canvas - Flexible width */}
            <div className="flex-1 bg-slate-50 overflow-hidden min-w-0">
              <KubernetesCanvas />
            </div>

            {/* Status Panel - Increased width to match palette */}
            <div className="w-64 flex-shrink-0 overflow-hidden">
              <StatusPanel />
            </div>
          </div>

          {/* YAML Editor - Resizable Height, Always Visible */}
          <motion.div
            className="border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0"
            style={{ height: `${yamlEditorHeight}px` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <YamlEditor
              height={yamlEditorHeight}
              onHeightChange={setYamlEditorHeight}
            />
          </motion.div>
        </div>
      </div>

      {/* Learning Guide */}
      <LearningGuide />

      {/* Architecture Validator */}
      <ArchitectureValidator />

      {/* Examples Gallery */}
      <ExamplesGallery
        isVisible={showExamplesGallery}
        onClose={() => setShowExamplesGallery(false)}
      />
    </div>
  );
};

export default Playground;