import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Code, 
  CheckCircle, 
  XCircle, 
  Copy, 
  RotateCcw,
  Loader
} from 'lucide-react';

interface LiveCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onApply: () => void;
  isValidating: boolean;
  validationResult: { isValid: boolean; message: string } | null;
  language: string;
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({
  code,
  onChange,
  onApply,
  isValidating,
  validationResult,
  language
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    // Reset to original template - this would need to be passed as a prop in real implementation
    onChange(code.replace(/[^_]+(?=___FILL_IN___)/g, '').replace(/(?<=___FILL_IN___)[^_]+/g, ''));
  };

  const getLanguageIcon = () => {
    switch (language) {
      case 'hcl': return '🏗️';
      case 'yaml': return '📄';
      case 'json': return '📋';
      default: return '💻';
    }
  };

  const highlightCode = (code: string) => {
    // Simple syntax highlighting for demo purposes
    return code
      .replace(/___FILL_IN___/g, '<span class="bg-yellow-200 text-yellow-800 px-1 rounded font-bold">___FILL_IN___</span>')
      .replace(/(resource|provider|variable|output)/g, '<span class="text-blue-600 font-semibold">$1</span>')
      .replace(/"([^"]+)"/g, '<span class="text-green-600">"$1"</span>')
      .replace(/(#.*)/g, '<span class="text-gray-500 italic">$1</span>')
      .replace(/(\w+)(\s*=)/g, '<span class="text-purple-600">$1</span>$2');
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Live Code Editor</span>
            <span className="text-slate-400 text-sm">{getLanguageIcon()} {language.toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 bg-slate-900 text-green-400 font-mono text-sm resize-none outline-none leading-6"
          placeholder="Your infrastructure code will appear here..."
          spellCheck={false}
        />
        
        {/* Syntax Highlighting Overlay */}
        <div 
          className="absolute inset-0 p-4 pointer-events-none font-mono text-sm leading-6 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          style={{ color: 'transparent' }}
        />

        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 p-4 text-slate-500 text-sm font-mono leading-6 select-none">
          {code.split('\n').map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-4 mb-4 p-3 rounded-lg border ${
            validationResult.isValid
              ? 'bg-green-900/50 border-green-500 text-green-300'
              : 'bg-red-900/50 border-red-500 text-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-medium">{validationResult.message}</span>
          </div>
        </motion.div>
      )}

      {/* Apply Button */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <motion.button
          onClick={onApply}
          disabled={isValidating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          whileHover={{ scale: isValidating ? 1 : 1.02 }}
          whileTap={{ scale: isValidating ? 1 : 0.98 }}
        >
          {isValidating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Validating & Deploying...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Apply Configuration</span>
            </>
          )}
        </motion.button>

        {/* Help Text */}
        <div className="mt-3 text-center">
          <p className="text-slate-400 text-xs">
            💡 Replace <code className="bg-slate-700 px-1 rounded">___FILL_IN___</code> with the correct values and click Apply
          </p>
        </div>
      </div>

      {/* Code Hints Panel */}
      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <div className="text-slate-300 text-xs space-y-1">
          <div className="font-semibold text-slate-200 mb-2">💡 Quick Reference:</div>
          {language === 'hcl' && (
            <>
              <div><code className="text-blue-400">resource</code> - Defines infrastructure components</div>
              <div><code className="text-green-400">"string"</code> - Text values in quotes</div>
              <div><code className="text-purple-400">variable</code> - Input parameters</div>
            </>
          )}
          {language === 'yaml' && (
            <>
              <div><code className="text-blue-400">apiVersion</code> - Kubernetes API version</div>
              <div><code className="text-green-400">kind</code> - Resource type</div>
              <div><code className="text-purple-400">metadata</code> - Resource information</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCodeEditor;
