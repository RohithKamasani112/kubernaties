import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { useKubernetesStore } from '../../store/kubernetesStore';
import { generateYamlFromNodes } from '../../utils/yamlGenerator';
import { Copy, Download, Upload, FileText, RefreshCw, Maximize2, Minimize2, Eye, EyeOff, CheckCircle, AlertTriangle, GripHorizontal, X } from 'lucide-react';
import toast from 'react-hot-toast';
import * as yaml from 'js-yaml';

interface YamlEditorProps {
  height?: number;
  onHeightChange?: (height: number) => void;
  initialYaml?: string;
}

const YamlEditor: React.FC<YamlEditorProps> = ({ height = 224, onHeightChange, initialYaml }) => {
  const { nodes, edges, updateFromYaml } = useKubernetesStore();
  const [yamlContent, setYamlContent] = useState(initialYaml || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(height);
  const [isManualEdit, setIsManualEdit] = useState(false); // Track if user is manually editing
  const dragRef = useRef<HTMLDivElement>(null);

  // Handle initial YAML content
  useEffect(() => {
    if (initialYaml && initialYaml !== yamlContent) {
      setYamlContent(initialYaml);
      validateYaml(initialYaml);
    }
  }, [initialYaml]);
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);

  // Handle drag resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = currentHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY.current - e.clientY; // Inverted for intuitive dragging
      const newHeight = Math.max(150, Math.min(600, startHeight.current + deltaY));
      setCurrentHeight(newHeight);
      onHeightChange?.(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [currentHeight, onHeightChange]);

  // Generate YAML when nodes change (only if not manually editing)
  useEffect(() => {
    // Don't auto-generate if user is manually editing YAML
    if (isManualEdit) {
      return;
    }

    setIsGenerating(true);

    // Add a small delay to show the loading effect
    const timer = setTimeout(() => {
      const newYaml = generateYamlFromNodes(nodes, edges);
      setYamlContent(newYaml);
      if (newYaml && newYaml.trim() !== '' && !newYaml.startsWith('#')) {
        validateYaml(newYaml);
      } else {
        setValidationErrors([]);
        setValidationWarnings([]);
        setIsValid(true);
      }
      setIsGenerating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [nodes, edges, isManualEdit]);

  const validateYaml = (yamlText: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const docs = yaml.loadAll(yamlText);

      docs.forEach((doc: any, index: number) => {
        if (!doc) return;

        // Check required fields
        if (!doc.apiVersion) {
          errors.push(`Document ${index + 1}: Missing 'apiVersion' field`);
        }
        if (!doc.kind) {
          errors.push(`Document ${index + 1}: Missing 'kind' field`);
        }
        if (!doc.metadata || !doc.metadata.name) {
          errors.push(`Document ${index + 1}: Missing 'metadata.name' field`);
        }

        // Validate specific resource types
        if (doc.kind === 'Service' && doc.spec) {
          if (!doc.spec.selector) {
            errors.push(`Document ${index + 1}: Service missing 'spec.selector'`);
          }
          if (!doc.spec.ports || doc.spec.ports.length === 0) {
            errors.push(`Document ${index + 1}: Service missing 'spec.ports'`);
          }
        }

        if (doc.kind === 'Deployment' && doc.spec) {
          if (!doc.spec.selector || !doc.spec.selector.matchLabels) {
            errors.push(`Document ${index + 1}: Deployment missing 'spec.selector.matchLabels'`);
          }
          if (!doc.spec.template || !doc.spec.template.metadata || !doc.spec.template.metadata.labels) {
            errors.push(`Document ${index + 1}: Deployment missing 'spec.template.metadata.labels'`);
          }

          // Check for best practices
          const containers = doc.spec.template?.spec?.containers || [];
          containers.forEach((container: any, containerIndex: number) => {
            if (!container.resources) {
              warnings.push(`Document ${index + 1}, Container ${containerIndex + 1}: Consider adding resource limits and requests`);
            }
            if (!container.livenessProbe && !container.readinessProbe) {
              warnings.push(`Document ${index + 1}, Container ${containerIndex + 1}: Consider adding health probes`);
            }
            if (container.image && container.image.includes(':latest')) {
              warnings.push(`Document ${index + 1}, Container ${containerIndex + 1}: Avoid using 'latest' tag in production`);
            }
          });
        }

        // Security best practices
        if (doc.kind === 'Pod' || doc.kind === 'Deployment') {
          const podSpec = doc.spec?.template?.spec || doc.spec;
          if (podSpec && !podSpec.securityContext?.runAsNonRoot) {
            warnings.push(`Document ${index + 1}: Consider setting securityContext.runAsNonRoot: true`);
          }
        }
      });

    } catch (error) {
      errors.push(`YAML syntax error: ${error instanceof Error ? error.message : 'Invalid YAML'}`);
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);
    setIsValid(errors.length === 0);
    return errors.length === 0;
  };

  const handleYamlChange = (value: string | undefined) => {
    if (value !== undefined) {
      setYamlContent(value);
      setIsManualEdit(true); // Mark as manual edit when user types
      validateYaml(value);
    }
  };

  const handleApplyYaml = async () => {
    setIsUpdating(true);
    try {
      // Validate YAML first
      if (!validateYaml(yamlContent)) {
        toast.error('Please fix YAML validation errors before applying.');
        setIsUpdating(false);
        return;
      }

      // Apply the YAML changes to update the canvas
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief processing delay
      updateFromYaml(yamlContent);
      setIsManualEdit(false); // Reset manual edit flag after successful application

      // Show consolidated success notification after a brief delay
      setTimeout(() => {
        toast.success('✅ YAML applied successfully! Canvas updated.', {
          icon: '✅',
          duration: 3000,
        });
      }, 800);
    } catch (error) {
      console.error('Error applying YAML:', error);
      toast.error('Error applying YAML. Please check syntax and try again.', {
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent);
    toast.success('YAML copied to clipboard!');
  };

  const handleDownloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kubernetes-manifest.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('YAML file downloaded!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setYamlContent(content);
        setIsManualEdit(true); // Mark as manual edit when file is uploaded
        validateYaml(content);
        toast.success('YAML file loaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const yamlFile = files.find(file =>
      file.name.endsWith('.yaml') ||
      file.name.endsWith('.yml') ||
      file.type === 'text/yaml' ||
      file.type === 'application/x-yaml'
    );

    if (yamlFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setYamlContent(content);
        setIsManualEdit(true); // Mark as manual edit when file is uploaded
        validateYaml(content);
        toast.success(`YAML file "${yamlFile.name}" loaded successfully!`, {
          icon: '📁',
          duration: 3000,
        });
      };
      reader.readAsText(yamlFile);
    } else {
      toast.error('Please drop a valid YAML file (.yaml or .yml)', {
        duration: 3000,
      });
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
    },
    theme: 'vs-light',
    wordWrap: 'on' as const,
    automaticLayout: true,
    readOnly: false,
    folding: true,
    foldingStrategy: 'indentation' as const,
    showFoldingControls: 'always' as const,
  };

  if (!isVisible) {
    return (
      <motion.div 
        className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-900">YAML Manifest</span>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
            {yamlContent.split('\n').length} lines
          </span>
        </div>
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Show YAML</span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-white border-t border-slate-200 flex flex-col relative ${
        isExpanded ? 'fixed inset-0 z-50' : ''
      }`}
      style={{ height: isExpanded ? '100vh' : `${currentHeight}px` }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Drag Handle */}
      {!isExpanded && (
        <div
          ref={dragRef}
          onMouseDown={handleMouseDown}
          className={`absolute -top-1 left-0 right-0 h-2 cursor-ns-resize group hover:bg-blue-200 transition-colors duration-200 ${
            isDragging ? 'bg-blue-300' : 'bg-transparent hover:bg-blue-100'
          }`}
          title="Drag to resize YAML editor"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <GripHorizontal className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      )}
      {/* Header - Enhanced with gradient and highlighting */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isManualEdit ? '✏️ Custom YAML Manifest' : '🚀 Generated YAML Manifest'}
            </h3>
            <p className="text-xs text-slate-600">
              {isManualEdit ? 'Manually edited - click Apply to visualize' : 'Live-generated from your architecture'}
            </p>
          </div>
          {isGenerating ? (
            <motion.span
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-semibold shadow-sm flex items-center space-x-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Generating YAML...</span>
            </motion.span>
          ) : (
            <motion.span
              className={`px-3 py-1 text-white text-xs rounded-full font-semibold shadow-sm ${
                isManualEdit
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
              }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {yamlContent.split('\n').length} lines • {isManualEdit ? 'Manual Edit' : 'Auto-sync'}
            </motion.span>
          )}
          {yamlContent && yamlContent.trim() !== '' && !yamlContent.startsWith('#') && (
            <>
              <div className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${
                isValid
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {isValid ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Valid</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </div>
              {validationWarnings.length > 0 && (
                <div className="flex items-center space-x-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{validationWarnings.length} warning{validationWarnings.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            title="Hide YAML"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopyYaml}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            title="Copy YAML"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadYaml}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
            title="Download YAML"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer" title="Upload YAML file">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".yaml,.yml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {isManualEdit && (
            <button
              onClick={() => setIsManualEdit(false)}
              className="flex items-center space-x-2 px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
              title="Switch back to auto-generation mode"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Auto-Sync</span>
            </button>
          )}
          <button
            onClick={handleApplyYaml}
            disabled={isUpdating}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Apply Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        className="flex-1 min-h-0 overflow-hidden relative"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/90 to-indigo-100/90 backdrop-blur-sm z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Generating YAML...</h3>
              <p className="text-sm text-slate-600">Converting your architecture to Kubernetes manifests</p>
            </div>
          </motion.div>
        )}

        {yamlContent ? (
          <Editor
            height="100%"
            defaultLanguage="yaml"
            value={yamlContent}
            onChange={handleYamlChange}
            options={editorOptions}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            <div className="text-center max-w-md">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm mb-3">
                Add components to the canvas to see generated YAML
              </p>
              <p className="text-xs text-slate-400 mb-4">
                Drag components from the left panel to get started
              </p>
              <div className="bg-slate-100 rounded-lg p-4 text-left">
                <p className="text-xs text-slate-600 mb-2 font-mono">
                  # YAML will be generated here...
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  # Example:
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  # apiVersion: v1
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  # kind: Pod
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  # metadata:
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  #   name: my-pod
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200 flex-shrink-0">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">Validation Errors</h4>
              <ul className="text-xs text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
              title="Close validation errors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-200 flex-shrink-0">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Best Practice Suggestions</h4>
              <ul className="text-xs text-yellow-700 space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-1">
                    <span className="text-yellow-500">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setValidationWarnings([])}
              className="w-6 h-6 flex items-center justify-center text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100 rounded-full transition-colors"
              title="Close validation warnings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer with YAML Stats */}
      {yamlContent && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span>
              {nodes.length} components • {yamlContent.split('---').length - 1} resources
            </span>
            <span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default YamlEditor;