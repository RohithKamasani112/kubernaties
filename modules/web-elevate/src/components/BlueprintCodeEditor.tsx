import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Copy,
  Search,
  Replace,
  Maximize2,
  Minimize2,
  Settings,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader,
  FileText,
  Code,
  Eye,
  Download
} from 'lucide-react';
import { ProjectFile } from '../data/blueprintTypes';

interface BlueprintCodeEditorProps {
  file?: ProjectFile;
  onChange: (content: string) => void;
  buildStatus: 'idle' | 'building' | 'success' | 'error';
}

const BlueprintCodeEditor: React.FC<BlueprintCodeEditorProps> = ({
  file,
  onChange,
  buildStatus
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'diff'>('code');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Update cursor position
  const updateCursorPosition = () => {
    if (textareaRef.current && file) {
      const textarea = textareaRef.current;
      const text = textarea.value;
      const cursorPos = textarea.selectionStart;
      
      const textBeforeCursor = text.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      setCursorPosition({ line, column });
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            // Save file logic would go here
            break;
          case 'f':
            e.preventDefault();
            setShowSearch(true);
            break;
          case '=':
            e.preventDefault();
            setFontSize(prev => Math.min(prev + 2, 24));
            break;
          case '-':
            e.preventDefault();
            setFontSize(prev => Math.max(prev - 2, 10));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    updateCursorPosition();
  };

  const handleSearch = () => {
    if (textareaRef.current && searchTerm) {
      const textarea = textareaRef.current;
      const content = textarea.value;
      const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
      
      if (index !== -1) {
        textarea.focus();
        textarea.setSelectionRange(index, index + searchTerm.length);
      }
    }
  };

  const handleReplace = () => {
    if (textareaRef.current && searchTerm && file) {
      const content = file.content;
      const newContent = content.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
      onChange(newContent);
    }
  };

  const copyToClipboard = () => {
    if (file) {
      navigator.clipboard.writeText(file.content);
    }
  };

  const downloadFile = () => {
    if (file) {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.path.split('/').pop() || 'file.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'typescript': return 'TypeScript';
      case 'javascript': return 'JavaScript';
      case 'css': return 'CSS';
      case 'html': return 'HTML';
      case 'json': return 'JSON';
      case 'markdown': return 'Markdown';
      default: return 'Text';
    }
  };

  const getBuildStatusIcon = () => {
    switch (buildStatus) {
      case 'building':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Code className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBuildStatusText = () => {
    switch (buildStatus) {
      case 'building': return 'Building...';
      case 'success': return 'Build successful';
      case 'error': return 'Build failed';
      default: return 'Ready';
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No file selected</h3>
          <p className="text-gray-600">Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {file.path.split('/').pop()}
            </span>
            {file.modified && (
              <span className="w-2 h-2 bg-orange-500 rounded-full" title="Modified" />
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <span>{getLanguageLabel(file.language)}</span>
            <span>•</span>
            <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mr-4">
            {[
              { id: 'code', label: 'Code', icon: Code },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'diff', label: 'Diff', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs rounded ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Build Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-white rounded border">
            {getBuildStatusIcon()}
            <span className="text-xs text-gray-600">{getBuildStatusText()}</span>
          </div>

          {/* Actions */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={downloadFile}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 border-b border-gray-200 bg-yellow-50"
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <input
              type="text"
              placeholder="Replace..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Find
            </button>
            <button
              onClick={handleReplace}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Replace
            </button>
            <button
              onClick={() => setShowSearch(false)}
              className="p-1 text-gray-600 hover:text-gray-900"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Editor Content */}
      <div className="flex-1 relative">
        {activeTab === 'code' && (
          <div className="h-full flex">
            {/* Line Numbers */}
            {showLineNumbers && (
              <div className="w-12 bg-gray-50 border-r border-gray-200 py-4 text-right text-xs text-gray-500 font-mono select-none">
                {file.content.split('\n').map((_, index) => (
                  <div key={index} className="px-2 leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
            )}

            {/* Code Editor */}
            <textarea
              ref={textareaRef}
              value={file.content}
              onChange={handleContentChange}
              onSelect={updateCursorPosition}
              onKeyUp={updateCursorPosition}
              className="flex-1 p-4 font-mono resize-none focus:outline-none leading-6"
              style={{ fontSize: `${fontSize}px` }}
              spellCheck={false}
              wrap={wordWrap ? 'soft' : 'off'}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full p-4 bg-gray-50">
            <div className="bg-white rounded border p-4 h-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <p className="text-gray-600">
                Preview functionality would be implemented based on file type.
                For React components, this could show a live preview.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="h-full p-4 bg-gray-50">
            <div className="bg-white rounded border p-4 h-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Changes</h3>
              <p className="text-gray-600">
                Diff view would show changes compared to the original file.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>
              {file.content.split('\n').length} lines, {file.content.length} characters
            </span>
            <span>UTF-8</span>
            <span>{getLanguageLabel(file.language)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFontSize(prev => Math.max(prev - 2, 10))}
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              A-
            </button>
            <span>{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
              className="px-2 py-1 hover:bg-gray-200 rounded"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintCodeEditor;
