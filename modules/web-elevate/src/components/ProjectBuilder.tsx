import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  FolderOpen,
  FileText,
  Terminal,
  Play,
  RotateCcw,
  Settings,
  Maximize2,
  Minimize2,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  BookOpen,
  Lightbulb,
  Target,
  Code,
  Eye,
  TestTube
} from 'lucide-react';
import { Blueprint, BlueprintMilestone, ProjectWorkspace } from '../data/blueprintTypes';
import { allBlueprints } from '../data/blueprintData';
import BlueprintFileExplorer from './BlueprintFileExplorer';
import BlueprintCodeEditor from './BlueprintCodeEditor';
import BlueprintMilestonePanel from './BlueprintMilestonePanel';
import BlueprintConsole from './BlueprintConsole';

interface ProjectBuilderProps {
  blueprintId: string;
  onBack: () => void;
}

const ProjectBuilder: React.FC<ProjectBuilderProps> = ({ blueprintId, onBack }) => {
  const blueprint = allBlueprints.find(b => b.id === blueprintId);
  
  // Workspace state
  const [workspace, setWorkspace] = useState<ProjectWorkspace>({
    blueprintId,
    files: {},
    currentMilestone: '',
    activeFile: '',
    consoleOutput: [],
    testResults: [],
    buildStatus: 'idle',
    previewUrl: undefined
  });

  // Panel visibility and sizes
  const [panelSizes, setPanelSizes] = useState({
    explorer: 20,
    editor: 50,
    context: 30,
    console: 25
  });

  const [showExplorer, setShowExplorer] = useState(true);
  const [showContext, setShowContext] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [activeContextTab, setActiveContextTab] = useState<'milestone' | 'docs' | 'architecture'>('milestone');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'console' | 'tests' | 'preview'>('console');

  // Initialize workspace
  useEffect(() => {
    if (blueprint) {
      const initialFiles: Record<string, any> = {};
      
      // Initialize files from blueprint
      Object.entries(blueprint.initialFiles).forEach(([path, content]) => {
        initialFiles[path] = {
          path,
          content,
          language: getLanguageFromPath(path),
          modified: false,
          lastModified: new Date()
        };
      });

      setWorkspace(prev => ({
        ...prev,
        files: initialFiles,
        currentMilestone: blueprint.milestones[0]?.id || '',
        activeFile: Object.keys(initialFiles)[0] || ''
      }));
    }
  }, [blueprint]);

  const getLanguageFromPath = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': case 'tsx': return 'typescript';
      case 'js': case 'jsx': return 'javascript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'text';
    }
  };

  const handleFileSelect = (filePath: string) => {
    setWorkspace(prev => ({ ...prev, activeFile: filePath }));
  };

  const handleFileChange = (filePath: string, content: string) => {
    setWorkspace(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [filePath]: {
          ...prev.files[filePath],
          content,
          modified: true,
          lastModified: new Date()
        }
      }
    }));
  };

  const handleRunProject = async () => {
    setWorkspace(prev => ({ ...prev, buildStatus: 'building' }));
    
    // Simulate build process
    const buildOutput = [
      '> Starting build process...',
      '> Installing dependencies...',
      '> Compiling TypeScript...',
      '> Building React application...',
      '> Build completed successfully!'
    ];

    for (const output of buildOutput) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkspace(prev => ({
        ...prev,
        consoleOutput: [...prev.consoleOutput, output]
      }));
    }

    setWorkspace(prev => ({ 
      ...prev, 
      buildStatus: 'success',
      previewUrl: 'http://localhost:3000'
    }));
  };

  const handleResetProject = () => {
    if (blueprint && window.confirm('Are you sure you want to reset all changes?')) {
      const initialFiles: Record<string, any> = {};
      
      Object.entries(blueprint.initialFiles).forEach(([path, content]) => {
        initialFiles[path] = {
          path,
          content,
          language: getLanguageFromPath(path),
          modified: false,
          lastModified: new Date()
        };
      });

      setWorkspace(prev => ({
        ...prev,
        files: initialFiles,
        consoleOutput: ['> Project reset to initial state'],
        buildStatus: 'idle'
      }));
    }
  };

  const getCurrentMilestone = (): BlueprintMilestone | undefined => {
    return blueprint?.milestones.find(m => m.id === workspace.currentMilestone);
  };

  const getCompletedTasksCount = (): number => {
    const milestone = getCurrentMilestone();
    if (!milestone) return 0;
    return milestone.tasks.filter(task => task.completed).length;
  };

  const getTotalTasksCount = (): number => {
    const milestone = getCurrentMilestone();
    return milestone?.tasks.length || 0;
  };

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blueprint Not Found</h2>
          <p className="text-gray-600 mb-6">The requested blueprint could not be found.</p>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Blueprints</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div>
            <h1 className="font-semibold text-gray-900">{blueprint.title}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Milestone: {getCurrentMilestone()?.title}</span>
              <span>•</span>
              <span>{getCompletedTasksCount()}/{getTotalTasksCount()} tasks completed</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{blueprint.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-purple-600">
            <Zap className="w-4 h-4" />
            <span>{blueprint.totalXP} XP</span>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Explorer */}
        <AnimatePresence>
          {showExplorer && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${panelSizes.explorer}%` }}
              exit={{ width: 0 }}
              className="bg-white border-r border-gray-200 flex flex-col"
            >
              <BlueprintFileExplorer
                files={workspace.files}
                activeFile={workspace.activeFile}
                onFileSelect={handleFileSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel - Code Editor */}
        <div 
          className="flex-1 flex flex-col"
          style={{ 
            width: showExplorer && showContext 
              ? `${panelSizes.editor}%` 
              : showExplorer || showContext 
                ? '70%' 
                : '100%' 
          }}
        >
          <BlueprintCodeEditor
            file={workspace.files[workspace.activeFile]}
            onChange={(content) => handleFileChange(workspace.activeFile, content)}
            buildStatus={workspace.buildStatus}
          />
        </div>

        {/* Right Panel - Context Panel */}
        <AnimatePresence>
          {showContext && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${panelSizes.context}%` }}
              exit={{ width: 0 }}
              className="bg-white border-l border-gray-200 flex flex-col"
            >
              <BlueprintMilestonePanel
                blueprint={blueprint}
                currentMilestone={workspace.currentMilestone}
                activeTab={activeContextTab}
                onTabChange={setActiveContextTab}
                onMilestoneChange={(milestoneId) => 
                  setWorkspace(prev => ({ ...prev, currentMilestone: milestoneId }))
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Panel - Console */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${panelSizes.console}%` }}
            exit={{ height: 0 }}
            className="bg-white border-t border-gray-200"
          >
            <BlueprintConsole
              activeTab={activeConsoleTab}
              onTabChange={setActiveConsoleTab}
              consoleOutput={workspace.consoleOutput}
              testResults={workspace.testResults}
              previewUrl={workspace.previewUrl}
              buildStatus={workspace.buildStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExplorer(!showExplorer)}
            className={`p-2 rounded transition-colors ${
              showExplorer ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle Explorer"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowContext(!showContext)}
            className={`p-2 rounded transition-colors ${
              showContext ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle Context Panel"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-2 rounded transition-colors ${
              showConsole ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle Console"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetProject}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          
          <button
            onClick={handleRunProject}
            disabled={workspace.buildStatus === 'building'}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{workspace.buildStatus === 'building' ? 'Building...' : 'Run Project'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectBuilder;
