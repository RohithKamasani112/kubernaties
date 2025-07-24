import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Download,
  Upload,
  Trash2,
  Clock,
  FileText,
  Edit,
  Copy,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Database,
  Code,
  Image,
  File
} from 'lucide-react';
import { ExportSystem, ProjectData, ExportOptions, VersionHistory } from '../../utils/exportSystem';
import { CloudScenario } from '../../data/cloudScenarios';
import { DeployedResource } from './InteractiveLearningPath';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: {
    name: string;
    description: string;
    scenario: CloudScenario;
    deployedResources: DeployedResource[];
    currentStep: number;
    completedSteps: number[];
    code: string;
  };
  onLoadProject: (project: ProjectData) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  isOpen,
  onClose,
  currentProject,
  onLoadProject
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load' | 'export'>('save');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectName, setProjectName] = useState(currentProject.name || 'My Architecture');
  const [projectDescription, setProjectDescription] = useState(currentProject.description || 'Created with KubeQuest Arch Learning');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeCode: true,
    includeDocumentation: true,
    includeSecurityAnalysis: false,
    includeBestPractices: true,
    theme: 'light',
    quality: 'high'
  });
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  const exportSystem = ExportSystem.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      setStorageUsage(exportSystem.getStorageUsage());
    }
  }, [isOpen]);

  useEffect(() => {
    setProjectName(currentProject.name || 'My Architecture');
    setProjectDescription(currentProject.description || 'Created with KubeQuest Arch Learning');
  }, [currentProject]);

  const loadProjects = () => {
    const allProjects = exportSystem.getAllProjects();
    setProjects(allProjects);
  };

  const handleSaveProject = async () => {
    try {
      setSaveStatus('saving');
      
      // Check if we're updating an existing project
      const existingProject = selectedProject 
        ? exportSystem.loadProject(selectedProject)
        : null;
      
      const projectId = existingProject?.id || exportSystem.generateProjectId();
      
      const projectData: ProjectData = {
        id: projectId,
        name: projectName,
        description: projectDescription,
        scenario: currentProject.scenario,
        deployedResources: currentProject.deployedResources,
        currentStep: currentProject.currentStep,
        completedSteps: currentProject.completedSteps,
        code: currentProject.code,
        createdAt: existingProject?.createdAt || new Date(),
        updatedAt: new Date(),
        version: existingProject?.version || 1,
        tags: existingProject?.tags || []
      };
      
      exportSystem.saveProject(projectData);
      loadProjects();
      setStorageUsage(exportSystem.getStorageUsage());
      setSaveStatus('success');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to save project:', error);
      setSaveStatus('error');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }
  };

  const handleLoadProject = (projectId: string) => {
    const project = exportSystem.loadProject(projectId);
    if (project) {
      onLoadProject(project);
      onClose();
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      exportSystem.deleteProject(projectId);
      loadProjects();
      setStorageUsage(exportSystem.getStorageUsage());
      if (selectedProject === projectId) {
        setSelectedProject(null);
      }
    }
  };

  const handleExportProject = async () => {
    try {
      setExportStatus('exporting');
      
      // Create a temporary project data object for export
      const projectData: ProjectData = {
        id: exportSystem.generateProjectId(),
        name: projectName,
        description: projectDescription,
        scenario: currentProject.scenario,
        deployedResources: currentProject.deployedResources,
        currentStep: currentProject.currentStep,
        completedSteps: currentProject.completedSteps,
        code: currentProject.code,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: []
      };
      
      const blob = await exportSystem.exportProject(projectData, exportOptions);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
      
      setTimeout(() => {
        setExportStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to export project:', error);
      setExportStatus('error');
      
      setTimeout(() => {
        setExportStatus('idle');
      }, 2000);
    }
  };

  const handleViewVersionHistory = (projectId: string) => {
    const history = exportSystem.getVersionHistory(projectId);
    setVersionHistory(history);
    setShowVersionHistory(true);
  };

  const handleRestoreVersion = (version: VersionHistory) => {
    if (confirm(`Are you sure you want to restore version ${version.version}? Current changes will be lost.`)) {
      onLoadProject(version.snapshot);
      onClose();
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json': return <Code className="w-4 h-4" />;
      case 'terraform': return <FileText className="w-4 h-4" />;
      case 'yaml': return <FileText className="w-4 h-4" />;
      case 'cloudformation': return <FileText className="w-4 h-4" />;
      case 'png': return <Image className="w-4 h-4" />;
      case 'svg': return <Image className="w-4 h-4" />;
      case 'pdf': return <File className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Project Manager</h2>
              <p className="text-sm text-slate-600">Save, load, and export your architecture projects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('save')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'save' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Project</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('load')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'load' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Load Project</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'export' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Save Project Tab */}
            {activeTab === 'save' && (
              <motion.div
                key="save"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="My Architecture Project"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                      placeholder="Describe your architecture project..."
                    />
                  </div>
                  
                  {projects.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Update Existing Project (Optional)</label>
                      <select
                        value={selectedProject || ''}
                        onChange={(e) => setSelectedProject(e.target.value || null)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Create New Project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name} (v{project.version})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProject}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'success' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved!</span>
                      </>
                    ) : saveStatus === 'error' ? (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Error</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{selectedProject ? 'Update Project' : 'Save Project'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Load Project Tab */}
            {activeTab === 'load' && (
              <motion.div
                key="load"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Database className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Saved Projects</h3>
                    <p className="text-slate-600 mb-6">
                      You haven't saved any projects yet. Create and save a project to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{project.name}</h3>
                            <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>Version: {project.version}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewVersionHistory(project.id)}
                              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              title="Version History"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleLoadProject(project.id)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="Load Project"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Storage Usage */}
                <div className="mt-6 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-700">Storage Usage</h4>
                    <span className="text-xs text-slate-500">
                      {(storageUsage.used / 1024).toFixed(2)} KB / {(storageUsage.total / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && (
              <motion.div
                key="export"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Export Format</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['json', 'terraform', 'yaml', 'cloudformation', 'png', 'svg', 'pdf'].map((format) => (
                        <button
                          key={format}
                          onClick={() => setExportOptions({ ...exportOptions, format: format as any })}
                          className={`p-3 border rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${
                            exportOptions.format === format
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {getFormatIcon(format)}
                          <span className="text-sm font-medium">{format.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Export Options</h4>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeCode"
                        checked={exportOptions.includeCode}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeCode: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="includeCode" className="text-sm text-slate-700">Include Code</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeDocumentation"
                        checked={exportOptions.includeDocumentation}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeDocumentation: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="includeDocumentation" className="text-sm text-slate-700">Include Documentation</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="includeBestPractices"
                        checked={exportOptions.includeBestPractices}
                        onChange={(e) => setExportOptions({ ...exportOptions, includeBestPractices: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="includeBestPractices" className="text-sm text-slate-700">Include Best Practices</label>
                    </div>
                    
                    {(exportOptions.format === 'png' || exportOptions.format === 'svg' || exportOptions.format === 'pdf') && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setExportOptions({ ...exportOptions, theme: 'light' })}
                            className={`px-4 py-2 rounded-lg border ${
                              exportOptions.theme === 'light'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 text-slate-700'
                            }`}
                          >
                            Light
                          </button>
                          <button
                            onClick={() => setExportOptions({ ...exportOptions, theme: 'dark' })}
                            className={`px-4 py-2 rounded-lg border ${
                              exportOptions.theme === 'dark'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 text-slate-700'
                            }`}
                          >
                            Dark
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleExportProject}
                    disabled={exportStatus === 'exporting'}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exportStatus === 'exporting' ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Exporting...</span>
                      </>
                    ) : exportStatus === 'success' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Exported!</span>
                      </>
                    ) : exportStatus === 'error' ? (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>Error</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export as {exportOptions.format.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Version History Modal */}
        {showVersionHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Version History</h3>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                {versionHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No version history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {versionHistory.map((version) => (
                      <div
                        key={version.version}
                        className="border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-slate-900">Version {version.version}</h4>
                              <span className="text-xs text-slate-500">
                                {new Date(version.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <ul className="mt-1 space-y-1">
                              {version.changes.map((change, index) => (
                                <li key={index} className="text-sm text-slate-600 flex items-start space-x-1">
                                  <span className="text-blue-500">•</span>
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            onClick={() => handleRestoreVersion(version)}
                            className="text-xs px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectManager;
