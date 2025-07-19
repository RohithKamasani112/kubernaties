import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit3,
  Copy,
  GitCompare,
  Play,
  FileText,
  Layers
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

const YamlEditor: React.FC = () => {
  const [yamlContent, setYamlContent] = useState(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        env:
        - name: DATABASE_URL
          value: "postgresql://db:5432/myapp"
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5`);
  
  const [originalYaml, setOriginalYaml] = useState(yamlContent);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'diff'>('editor');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { executeCommand, selectedResource } = useDebuggingStore();

  // Validate YAML content
  const validateYaml = (content: string) => {
    const errors: string[] = [];
    
    try {
      // Basic YAML structure validation
      const lines = content.split('\n');
      let indentLevel = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;
        
        // Check for required fields
        if (line.includes('apiVersion:') && !line.includes('apps/v1')) {
          if (!line.includes('v1') && !line.includes('batch/v1')) {
            errors.push(`Line ${i + 1}: Invalid apiVersion`);
          }
        }
        
        if (line.includes('kind:') && !['Deployment', 'Service', 'Pod', 'ConfigMap', 'Secret'].some(k => line.includes(k))) {
          errors.push(`Line ${i + 1}: Unsupported resource kind`);
        }
        
        // Check indentation
        const currentIndent = line.length - line.trimStart().length;
        if (currentIndent % 2 !== 0) {
          errors.push(`Line ${i + 1}: Invalid indentation (should be multiples of 2)`);
        }
      }
      
      // Check for required fields
      if (!content.includes('apiVersion:')) {
        errors.push('Missing required field: apiVersion');
      }
      if (!content.includes('kind:')) {
        errors.push('Missing required field: kind');
      }
      if (!content.includes('metadata:')) {
        errors.push('Missing required field: metadata');
      }
      
    } catch (error) {
      errors.push('Invalid YAML syntax');
    }
    
    setValidationErrors(errors);
    setIsValid(errors.length === 0);
    return errors.length === 0;
  };

  const handleYamlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setYamlContent(content);
    validateYaml(content);
  };

  const handleApply = async () => {
    if (!isValid) return;
    
    setIsApplying(true);
    
    try {
      // Simulate applying the YAML
      await executeCommand('kubectl apply -f -');
      
      // Update original YAML to current content
      setOriginalYaml(yamlContent);
      
      // Show success message
      console.log('YAML applied successfully');
      
    } catch (error) {
      console.error('Failed to apply YAML:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setYamlContent(originalYaml);
    validateYaml(originalYaml);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kubernetes-resource.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setYamlContent(content);
        validateYaml(content);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlContent);
  };

  const generateDiff = () => {
    const originalLines = originalYaml.split('\n');
    const currentLines = yamlContent.split('\n');
    const maxLines = Math.max(originalLines.length, currentLines.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const currentLine = currentLines[i] || '';
      
      if (originalLine !== currentLine) {
        if (originalLine && !currentLine) {
          diff.push({ type: 'removed', line: originalLine, lineNumber: i + 1 });
        } else if (!originalLine && currentLine) {
          diff.push({ type: 'added', line: currentLine, lineNumber: i + 1 });
        } else {
          diff.push({ type: 'modified', oldLine: originalLine, newLine: currentLine, lineNumber: i + 1 });
        }
      } else if (originalLine) {
        diff.push({ type: 'unchanged', line: originalLine, lineNumber: i + 1 });
      }
    }
    
    return diff;
  };

  const renderPreview = () => {
    try {
      // Parse and format the YAML for preview
      const lines = yamlContent.split('\n');
      return (
        <div className="font-mono text-sm space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-slate-400 w-8 text-right mr-4">{index + 1}</span>
              <span className="text-slate-800">{line}</span>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <div className="text-red-500">Invalid YAML syntax</div>;
    }
  };

  const renderDiff = () => {
    const diff = generateDiff();
    
    return (
      <div className="font-mono text-sm space-y-1">
        {diff.map((item, index) => (
          <div key={index} className={`flex ${
            item.type === 'added' ? 'bg-green-50' :
            item.type === 'removed' ? 'bg-red-50' :
            item.type === 'modified' ? 'bg-yellow-50' : ''
          }`}>
            <span className="text-slate-400 w-8 text-right mr-4">{item.lineNumber}</span>
            {item.type === 'modified' ? (
              <div className="flex-1">
                <div className="text-red-600 line-through">{item.oldLine}</div>
                <div className="text-green-600">{item.newLine}</div>
              </div>
            ) : (
              <span className={`flex-1 ${
                item.type === 'added' ? 'text-green-600' :
                item.type === 'removed' ? 'text-red-600' : 'text-slate-800'
              }`}>
                {item.line}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const hasChanges = yamlContent !== originalYaml;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-slate-900">YAML Editor</h2>
            
            {selectedResource && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-50 rounded-lg">
                <Layers className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {selectedResource.kind}/{selectedResource.metadata.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Validation Status */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
              isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {isValid ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isValid ? 'Valid' : `${validationErrors.length} errors`}
              </span>
            </div>
            
            {/* File Operations */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
              title="Upload YAML file"
            >
              <Upload className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
              title="Download YAML file"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={copyToClipboard}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            {/* Actions */}
            {hasChanges && (
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
            
            <button
              onClick={handleApply}
              disabled={!isValid || isApplying}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isValid && !isApplying
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isApplying ? (
                <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full"></div>
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isApplying ? 'Applying...' : 'Apply'}</span>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          {[
            { id: 'editor', label: 'Editor', icon: Edit3 },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'diff', label: 'Diff', icon: GitCompare }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'diff' && hasChanges && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full flex overflow-hidden">
            <div className="flex-1 relative overflow-hidden">
              <textarea
                value={yamlContent}
                onChange={handleYamlChange}
                className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none overflow-y-auto"
                placeholder="Enter your Kubernetes YAML configuration..."
                spellCheck={false}
              />
            </div>

            {/* Validation Errors Sidebar */}
            {validationErrors.length > 0 && (
              <div className="w-80 border-l border-slate-200 bg-red-50 p-4 overflow-y-auto flex-shrink-0">
                <h3 className="font-medium text-red-900 mb-3">Validation Errors</h3>
                <div className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-800">{error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="h-full overflow-y-auto p-4">
            {renderPreview()}
          </div>
        )}
        
        {activeTab === 'diff' && (
          <div className="h-full overflow-y-auto p-4">
            {hasChanges ? renderDiff() : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <GitCompare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>No changes to show</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};

export default YamlEditor;
