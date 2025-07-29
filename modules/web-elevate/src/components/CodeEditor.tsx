import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Download, 
  Maximize2, 
  Minimize2, 
  MoreHorizontal,
  X,
  Plus,
  Code,
  FileText
} from 'lucide-react';

interface CodeEditorProps {
  filename: string;
  code: string;
  onChange: (code: string) => void;
  language?: string;
  readOnly?: boolean;
  highlightedLines?: number[];
}

interface Tab {
  filename: string;
  modified: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  filename,
  code,
  onChange,
  language = 'javascript',
  readOnly = false,
  highlightedLines = []
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ filename, modified: false }]);
  const [activeTab, setActiveTab] = useState(filename);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  }, [code]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts':
        return <Code className="w-3 h-3 text-blue-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileText className="w-3 h-3 text-pink-500" />;
      case 'html':
        return <FileText className="w-3 h-3 text-orange-500" />;
      case 'json':
        return <FileText className="w-3 h-3 text-yellow-500" />;
      default:
        return <FileText className="w-3 h-3 text-gray-500" />;
    }
  };

  const getSyntaxHighlighting = (code: string, language: string) => {
    // Basic syntax highlighting for demo purposes
    // In a real implementation, you'd use a library like Prism.js or Monaco Editor
    let highlightedCode = code;
    
    if (language === 'javascript' || language === 'typescript') {
      // Keywords
      highlightedCode = highlightedCode.replace(
        /\b(const|let|var|function|return|if|else|for|while|import|export|from|default|class|extends|interface|type)\b/g,
        '<span class="text-purple-600 font-medium">$1</span>'
      );
      
      // Strings
      highlightedCode = highlightedCode.replace(
        /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
        '<span class="text-green-600">$1$2$1</span>'
      );
      
      // Comments
      highlightedCode = highlightedCode.replace(
        /\/\/.*$/gm,
        '<span class="text-gray-500 italic">$&</span>'
      );
      
      // JSX tags
      highlightedCode = highlightedCode.replace(
        /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?\/?>/g,
        '<span class="text-blue-600">$&</span>'
      );
    }
    
    return highlightedCode;
  };

  return (
    <div className={`flex flex-col h-full bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <motion.div
              key={tab.filename}
              className={`flex items-center space-x-2 px-3 py-1 rounded-t-lg cursor-pointer transition-colors ${
                activeTab === tab.filename
                  ? 'bg-white border-t border-l border-r border-gray-200 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.filename)}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.1 }}
            >
              {getFileIcon(tab.filename)}
              <span className="text-sm">{tab.filename}</span>
              {tab.modified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle tab close
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
          
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-gray-50 border-r border-gray-200 px-2 py-4 text-right select-none">
          {lineNumbers.map((lineNum) => (
            <div
              key={lineNum}
              className={`text-xs leading-6 text-gray-400 ${
                highlightedLines.includes(lineNum) ? 'bg-yellow-200 text-yellow-800' : ''
              }`}
              style={{ minHeight: '24px' }}
            >
              {lineNum}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          {/* Syntax Highlighted Background (for display) */}
          <div
            className="absolute inset-0 p-4 text-sm font-mono leading-6 pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: getSyntaxHighlighting(code, language)
            }}
          />
          
          {/* Actual Textarea (for editing) */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="absolute inset-0 w-full h-full p-4 text-sm font-mono leading-6 bg-transparent border-none outline-none resize-none text-transparent caret-gray-900"
            style={{
              caretColor: '#111827',
              color: 'transparent'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={readOnly ? '' : 'Start typing your code...'}
          />
          
          {/* Highlighted Lines Overlay */}
          {highlightedLines.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {highlightedLines.map((lineNum) => (
                <div
                  key={lineNum}
                  className="absolute left-0 right-0 bg-yellow-100 border-l-2 border-yellow-400"
                  style={{
                    top: `${(lineNum - 1) * 24 + 16}px`,
                    height: '24px'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-1 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Line {code.split('\n').length}</span>
          <span>Length {code.length}</span>
          <span className="capitalize">{language}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>LF</span>
          {readOnly && <span className="text-orange-600">Read Only</span>}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
