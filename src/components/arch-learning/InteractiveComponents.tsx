import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Copy, 
  Download, 
  CheckCircle, 
  XCircle, 
  Terminal as TerminalIcon,
  Code,
  Zap,
  Eye,
  Settings,
  Monitor
} from 'lucide-react';
import { CloudScenario } from '../../data/cloudScenarios';

// Visual Architecture Demo Component
export const VisualArchitectureDemo: React.FC<{
  scenario: CloudScenario;
  isPlaying: boolean;
}> = ({ scenario, isPlaying }) => {
  const [activeService, setActiveService] = useState<number>(-1);
  const [dataFlow, setDataFlow] = useState<number[]>([]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveService(prev => (prev + 1) % scenario.services.length);
        setDataFlow(prev => {
          const newFlow = [...prev, Math.random()];
          return newFlow.slice(-5); // Keep last 5 flow indicators
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, scenario.services.length]);

  const getServicePosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 120;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle)
    };
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Eye className="w-6 h-6" />
          <span>Live Architecture Visualization</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-sm">{isPlaying ? 'Live Demo' : 'Paused'}</span>
        </div>
      </div>

      <div className="relative bg-black/30 rounded-xl p-6 h-80 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="demo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#demo-grid)" />
          </svg>
        </div>

        {/* Central Hub */}
        <motion.div
          className="absolute w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          style={{ left: 184, top: 134 }}
          animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
        >
          <span className="text-2xl">🎯</span>
        </motion.div>

        {/* Service Nodes */}
        {scenario.services.slice(0, 6).map((service, index) => {
          const position = getServicePosition(index, scenario.services.length);
          const isActive = activeService === index;

          return (
            <motion.div
              key={index}
              className={`absolute w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${
                isActive 
                  ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50' 
                  : 'bg-blue-600 border-blue-400'
              }`}
              style={{ left: position.x - 24, top: position.y - 24 }}
              animate={{ 
                scale: isActive ? 1.2 : 1,
                rotate: isActive ? 360 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-lg">
                {['⚡', '🗄️', '🌐', '🔒', '📊', '🚀'][index % 6]}
              </span>
            </motion.div>
          );
        })}

        {/* Data Flow Lines */}
        {isPlaying && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {scenario.services.slice(0, 6).map((_, index) => {
              const nextIndex = (index + 1) % scenario.services.length;
              const pos1 = getServicePosition(index, scenario.services.length);
              const pos2 = getServicePosition(nextIndex, scenario.services.length);

              return (
                <motion.line
                  key={index}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              );
            })}
          </svg>
        )}

        {/* Data Flow Particles */}
        <AnimatePresence>
          {dataFlow.map((flow, index) => (
            <motion.div
              key={flow}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              initial={{ x: 200, y: 150, opacity: 1 }}
              animate={{ 
                x: 200 + 120 * Math.cos(flow * 2 * Math.PI),
                y: 150 + 120 * Math.sin(flow * 2 * Math.PI),
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            />
          ))}
        </AnimatePresence>

        {/* Service Labels */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 rounded-lg p-3">
            <div className="text-sm font-medium mb-2">Active Services:</div>
            <div className="flex flex-wrap gap-2">
              {scenario.services.slice(0, 6).map((service, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs ${
                    activeService === index 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Code Editor Component
export const InteractiveCodeEditor: React.FC<{
  code: string;
  onChange: (code: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}> = ({ code, onChange, onExecute, isExecuting }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-code.tf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Interactive Code Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
          <button
            onClick={onExecute}
            disabled={isExecuting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            {isExecuting ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-64 bg-transparent text-green-400 font-mono text-sm resize-none outline-none"
          placeholder="Enter your code here..."
          spellCheck={false}
        />
      </div>

      {/* Syntax Highlighting Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <pre className="p-4 text-sm font-mono text-transparent">
          {code.split('\n').map((line, index) => (
            <div key={index} className="leading-6">
              {line.split(' ').map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className={
                    word.startsWith('#') ? 'text-slate-500' :
                    ['resource', 'provider', 'variable', 'output'].includes(word) ? 'text-blue-400' :
                    word.startsWith('"') && word.endsWith('"') ? 'text-yellow-400' :
                    'text-green-400'
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

// Terminal Output Component
export const TerminalOutput: React.FC<{ output: string[] }> = ({ output }) => {
  return (
    <div className="bg-black rounded-2xl overflow-hidden border border-slate-700">
      <div className="flex items-center bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-5 h-5 text-green-400" />
          <span className="text-white font-medium">Terminal Output</span>
        </div>
        <div className="flex space-x-2 ml-auto">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <div className="p-4 h-48 overflow-y-auto">
        <div className="font-mono text-sm space-y-1">
          {output.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={
                line.includes('✅') ? 'text-green-400' :
                line.includes('❌') ? 'text-red-400' :
                line.startsWith('$') ? 'text-blue-400' :
                line.includes('Plan:') || line.includes('Apply complete!') ? 'text-yellow-400' :
                'text-slate-300'
              }
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Interactive Quiz Component
export const InteractiveQuiz: React.FC<{
  quiz: {
    question: string;
    options: string[];
    correct: number;
  };
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
}> = ({ quiz, selectedAnswer, onAnswerSelect }) => {
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  const isCorrect = selectedAnswer === quiz.correct;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">?</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Knowledge Check</h3>
      </div>

      <div className="mb-6">
        <p className="text-slate-800 font-medium">{quiz.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {quiz.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => !showResult && onAnswerSelect(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              showResult
                ? index === quiz.correct
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : selectedAnswer === index
                  ? 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
                : selectedAnswer === index
                ? 'bg-purple-100 border-purple-300 text-purple-800'
                : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50'
            }`}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                showResult && index === quiz.correct
                  ? 'bg-green-500 border-green-500'
                  : showResult && selectedAnswer === index && index !== quiz.correct
                  ? 'bg-red-500 border-red-500'
                  : selectedAnswer === index
                  ? 'bg-purple-500 border-purple-500'
                  : 'border-slate-300'
              }`}>
                {showResult && index === quiz.correct && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
                {showResult && selectedAnswer === index && index !== quiz.correct && (
                  <XCircle className="w-4 h-4 text-white" />
                )}
                {!showResult && selectedAnswer === index && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {!showResult && selectedAnswer !== null && (
        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Submit Answer
        </button>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!'}
            </span>
          </div>
          {!isCorrect && (
            <p className="text-red-700 text-sm mt-2">
              The correct answer is: {quiz.options[quiz.correct]}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
