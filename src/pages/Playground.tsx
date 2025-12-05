import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Save, Play, Pause, BookOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useKubernetesStore } from '../store/kubernetesStore';
import KubernetesCanvas from '../components/playground/KubernetesCanvas';
import YamlEditor from '../components/playground/YamlEditor';
import StatusPanel from '../components/playground/StatusPanel';
import ComponentPalette from '../components/playground/ComponentPalette';

import ArchitectureValidator from '../components/playground/ArchitectureValidator';
import ExamplesGallery from '../components/playground/ExamplesGallery';
import toast from 'react-hot-toast';

const Playground: React.FC = () => {
  const { nodes, edges, clearCanvas, simulationStatus, setSimulationStatus, updateFromYaml } = useKubernetesStore();
  const [showExamplesGallery, setShowExamplesGallery] = React.useState(false);
  const [yamlEditorHeight, setYamlEditorHeight] = React.useState(window.innerWidth < 640 ? 180 : 224);
  const [initialYaml, setInitialYaml] = React.useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showStatusPanel, setShowStatusPanel] = React.useState(false); // Hidden by default

  // Handle YAML parameter from URL (from documentation "Try It" button)
  useEffect(() => {
    const yamlParam = searchParams.get('yaml');
    if (yamlParam) {
      try {
        const decodedYaml = decodeURIComponent(yamlParam);
        // Set the initial YAML for the editor
        setInitialYaml(decodedYaml);
        // Apply the YAML to the playground
        updateFromYaml(decodedYaml);

        // Show consolidated notification after loading is complete
        setTimeout(() => {
          toast.success('✅ YAML from documentation loaded successfully!', {
            icon: '📄',
            duration: 4000,
          });
        }, 800);
        // Clear the URL parameter after processing
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.delete('yaml');
          return newParams;
        });
      } catch (error) {
        console.error('Error processing YAML from URL:', error);
        toast.error('Failed to load YAML from documentation. Please check the format.', {
          duration: 4000,
        });
      }
    }
  }, [searchParams, setSearchParams, updateFromYaml]);

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
        className="bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 truncate">Kubernetes Playground</h1>
            <p className="text-slate-600 mt-0.5 sm:mt-1 text-xs sm:text-sm lg:text-base hidden sm:block">
              Drag and drop components to build your Kubernetes application
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                simulationStatus === 'running'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-slate-400'
              }`}></div>
              <span className="text-xs sm:text-sm text-slate-600">
                Simulation {simulationStatus === 'running' ? 'Running' : 'Stopped'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
              <button
                onClick={toggleSimulation}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[36px] touch-manipulation ${
                  simulationStatus === 'running'
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
                title={simulationStatus === 'running' ? 'Pause Simulation' : 'Start Simulation'}
              >
                {simulationStatus === 'running' ? (
                  <>
                    <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Start</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowExamplesGallery(true)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[36px] touch-manipulation"
                title="Browse Examples"
              >
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Examples</span>
              </button>

              <button
                onClick={handleSaveFlow}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[36px] touch-manipulation"
                title="Save Flow"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                onClick={handleResetFlow}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[36px] touch-manipulation"
                title="Reset Flow"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              {/* Status Panel Toggle */}
              <button
                onClick={() => setShowStatusPanel(!showStatusPanel)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  showStatusPanel
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={showStatusPanel ? "Hide Status Panel" : "Show Status Panel"}
              >
                {showStatusPanel ? (
                  <PanelRightClose className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <PanelRightOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span className="hidden sm:inline">
                  {showStatusPanel ? 'Hide Panel' : 'Show Panel'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
        {/* Component Palette - Hidden on mobile and tablet, visible on large screens */}
        <div className="hidden xl:block w-64 flex-shrink-0 overflow-hidden border-r border-slate-200">
          <ComponentPalette />
        </div>

        {/* Canvas and YAML Area - Flexible Layout */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Section: Canvas and Status Panel */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Canvas - Flexible width */}
            <div className="flex-1 bg-slate-50 overflow-hidden min-w-0 relative min-h-[300px] sm:min-h-[400px] lg:min-h-0">
              <KubernetesCanvas />
            </div>

            {/* Status Panel - Conditional visibility */}
            <AnimatePresence>
              {showStatusPanel && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full lg:w-64 xl:w-72 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white max-h-48 lg:max-h-none overflow-y-auto"
                >
                  <StatusPanel />
                </motion.div>
              )}
            </AnimatePresence>
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
              initialYaml={initialYaml}
            />
          </motion.div>
        </div>
      </div>

      {/* Component Palette Floating Button - Show when palette is hidden on smaller screens */}
      <div className="xl:hidden fixed bottom-16 sm:bottom-20 right-3 sm:right-4 z-50">
        <button
          onClick={() => setShowExamplesGallery(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center touch-manipulation"
          title="Components & Examples"
        >
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

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