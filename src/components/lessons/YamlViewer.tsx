import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { Copy, Check, Code, BookOpen, Maximize2, Minimize2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface YamlViewerProps {
  title: string;
  code: string;
  explanation: string;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
}

const YamlViewer: React.FC<YamlViewerProps> = ({ 
  title, 
  code, 
  explanation, 
  editable = false,
  onCodeChange 
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      toast.success('YAML copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy YAML');
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentCode(value);
      onCodeChange?.(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">Kubernetes YAML Configuration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className={`transition-all duration-300 ${isExpanded ? 'h-96' : 'h-64'}`}>
        <Editor
          height="100%"
          defaultLanguage="yaml"
          value={currentCode}
          onChange={handleCodeChange}
          options={{
            readOnly: !editable,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            folding: true,
            wordWrap: 'on',
            theme: 'vs-light',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'none',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
          theme="vs-light"
        />
      </div>

      {/* Explanation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Understanding this YAML</h4>
            <p className="text-gray-600 leading-relaxed">{explanation}</p>
          </div>
        </div>
      </div>

      {/* YAML Structure Hints */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-4">
        <h5 className="font-medium text-blue-800 mb-3">YAML Structure Tips</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-700">Use spaces for indentation (no tabs)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700">Lists start with hyphens (-)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-700">Key-value pairs use colons (:)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-orange-700">Strings can be quoted or unquoted</span>
          </div>
        </div>
      </div>

      {/* Key Sections Breakdown */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <h5 className="font-medium text-gray-800 mb-3">Key Sections</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="font-medium text-blue-600 mb-1">apiVersion</div>
            <div className="text-gray-600">API version to use</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="font-medium text-green-600 mb-1">kind</div>
            <div className="text-gray-600">Type of resource</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="font-medium text-purple-600 mb-1">metadata</div>
            <div className="text-gray-600">Resource information</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="font-medium text-orange-600 mb-1">spec</div>
            <div className="text-gray-600">Desired state</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default YamlViewer;
