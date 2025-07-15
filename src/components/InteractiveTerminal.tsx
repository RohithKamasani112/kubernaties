import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Copy, Check, X, RotateCcw } from 'lucide-react';
import { InteractiveExample } from '../data/k8sComponentDocs';

interface InteractiveTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  example: InteractiveExample | null;
}

const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  isOpen,
  onClose,
  example
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const simulateExecution = async () => {
    if (!example) return;
    
    setIsExecuting(true);
    setShowOutput(true);
    setOutput('');

    // Simulate typing the command
    const command = `$ ${example.command}`;
    for (let i = 0; i <= command.length; i++) {
      setOutput(command.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Add newline and simulate processing
    setOutput(prev => prev + '\n');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate output appearing
    const lines = example.expectedOutput.split('\n');
    for (const line of lines) {
      setOutput(prev => prev + line + '\n');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsExecuting(false);
  };

  const copyCommand = () => {
    if (example) {
      navigator.clipboard.writeText(example.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetTerminal = () => {
    setOutput('');
    setShowOutput(false);
    setIsExecuting(false);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  if (!example) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{example.title}</h3>
                    <p className="text-gray-300 text-sm">{example.description}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Command Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Command to Execute:</h4>
                <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code className="text-gray-800">{example.command}</code>
                    <button
                      onClick={copyCommand}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terminal Simulation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Interactive Terminal:</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={resetTerminal}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={simulateExecution}
                      disabled={isExecuting}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg text-sm transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      {isExecuting ? 'Executing...' : 'Try It'}
                    </button>
                  </div>
                </div>

                <div 
                  ref={terminalRef}
                  className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto"
                >
                  {showOutput ? (
                    <pre className="whitespace-pre-wrap">{output}</pre>
                  ) : (
                    <div className="text-gray-500 italic">
                      Click "Try It" to execute the command and see the output...
                    </div>
                  )}
                  {isExecuting && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-400">Executing command...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What This Does:</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 leading-relaxed">{example.explanation}</p>
                </div>
              </div>

              {/* Expected Output */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Expected Output:</h4>
                <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-gray-800 whitespace-pre-wrap">{example.expectedOutput}</pre>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractiveTerminal;
