import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Terminal,
  FileText,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Target,
  Award,
  Zap,
  AlertTriangle,
  Info,
  Copy
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';
import { getScenarioHints } from '../../utils/scenarioHints';

interface Hint {
  id: string;
  title: string;
  description: string;
  explanation: string;
  type: 'command' | 'concept' | 'warning' | 'tip' | 'analysis';
  priority: number;
  command?: string;
  exactCommand?: string; // The exact command with real pod names
  expectedOutput?: string;
  revealed: boolean;
  timeToReveal?: number; // seconds
  category: 'discovery' | 'investigation' | 'diagnosis' | 'fix' | 'verification';
}

const HintsPanel: React.FC = () => {
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set());
  const [autoReveal, setAutoReveal] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const { currentScenario, hintsUsed } = useDebuggingStore();

  // Get scenario-specific hints with 10-second intervals
  const scenarioHints = getScenarioHints(currentScenario || 'crashloop-1');
  const hints: Hint[] = scenarioHints.map(hint => ({
    ...hint,
    revealed: false
  }));


  // Timer for auto-revealing hints
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-reveal hints based on time
  useEffect(() => {
    if (!autoReveal) return;

    hints.forEach(hint => {
      if (hint.timeToReveal && timeElapsed >= hint.timeToReveal && !revealedHints.has(hint.id)) {
        setRevealedHints(prev => new Set([...prev, hint.id]));
      }
    });
  }, [timeElapsed, autoReveal, hints, revealedHints]);

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'command':
        return <Terminal className="w-4 h-4 text-blue-600" />;
      case 'concept':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-green-600" />;
      case 'analysis':
        return <Target className="w-4 h-4 text-orange-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discovery':
        return <span className="text-blue-500">🔍</span>;
      case 'investigation':
        return <span className="text-purple-500">🔬</span>;
      case 'diagnosis':
        return <span className="text-orange-500">🩺</span>;
      case 'fix':
        return <span className="text-green-500">🔧</span>;
      case 'verification':
        return <span className="text-teal-500">✅</span>;
      default:
        return <span className="text-slate-500">📋</span>;
    }
  };

  const getHintColor = (type: string) => {
    switch (type) {
      case 'command':
        return 'border-blue-200 bg-blue-50';
      case 'concept':
        return 'border-purple-200 bg-purple-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'tip':
        return 'border-green-200 bg-green-50';
      case 'analysis':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'discovery':
        return 'bg-blue-100 text-blue-700';
      case 'investigation':
        return 'bg-purple-100 text-purple-700';
      case 'diagnosis':
        return 'bg-orange-100 text-orange-700';
      case 'fix':
        return 'bg-green-100 text-green-700';
      case 'verification':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const revealHint = (hintId: string) => {
    setRevealedHints(prev => new Set([...prev, hintId]));
  };

  const toggleHintExpansion = (hintId: string) => {
    setExpandedHints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hintId)) {
        newSet.delete(hintId);
      } else {
        newSet.add(hintId);
      }
      return newSet;
    });
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const availableHints = hints.filter(hint => revealedHints.has(hint.id));
  const nextHint = hints.find(hint => !revealedHints.has(hint.id));

  return (
    <motion.div
      className="h-full bg-white border-l border-slate-200 flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Compact */}
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-semibold text-slate-900">Hints & Tips</h3>
          </div>

          <button
            onClick={() => setAutoReveal(!autoReveal)}
            className={`p-1.5 rounded-md transition-all ${
              autoReveal
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title={autoReveal ? 'Disable auto-reveal' : 'Enable auto-reveal'}
          >
            {autoReveal ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>
        
        {/* Progress - Compact */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium">{availableHints.length}/{hints.length} hints</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(availableHints.length / hints.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            <span>Hints used: {hintsUsed}</span>
          </div>
        </div>
      </div>

      {/* Hints List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {availableHints.map((hint, index) => {
            const isExpanded = expandedHints.has(hint.id);
            
            return (
              <motion.div
                key={hint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`border rounded-lg ${getHintColor(hint.type)}`}
              >
                <button
                  onClick={() => toggleHintExpansion(hint.id)}
                  className="w-full p-3 text-left flex items-center justify-between hover:bg-opacity-80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getHintIcon(hint.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{hint.title}</h4>
                        {getCategoryIcon(hint.category)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(hint.category)}`}>
                          {hint.category}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">{hint.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-3 pb-3"
                    >
                      <div className="pl-6 space-y-3">
                        {/* Quick Description */}
                        <p className="text-xs text-slate-700 font-medium">{hint.description}</p>

                        {/* Detailed Explanation */}
                        <div className="bg-slate-50 border border-slate-200 rounded-md p-2">
                          <h5 className="text-xs font-semibold text-slate-800 mb-1 flex items-center space-x-1">
                            <span>💡</span>
                            <span>Detailed Explanation</span>
                          </h5>
                          <p className="text-xs text-slate-700 leading-relaxed">{hint.explanation}</p>
                        </div>

                        {/* Generic Command */}
                        {hint.command && (
                          <div className="space-y-1">
                            <h5 className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                              <span>📝</span>
                              <span>Generic Command</span>
                            </h5>
                            <div className="bg-slate-900 text-green-400 p-2 rounded-md font-mono text-xs">
                              <div className="flex items-center justify-between">
                                <code>{hint.command}</code>
                                <button
                                  onClick={() => copyCommand(hint.command!)}
                                  className="p-1 text-slate-400 hover:text-green-400 transition-colors"
                                  title="Copy generic command"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Exact Command for this scenario */}
                        {hint.exactCommand && (
                          <div className="space-y-1">
                            <h5 className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                              <span>🎯</span>
                              <span>Exact Command for This Scenario</span>
                            </h5>
                            <div className="bg-blue-900 text-cyan-400 p-2 rounded-md font-mono text-xs border-2 border-blue-600">
                              <div className="flex items-center justify-between">
                                <code>{hint.exactCommand}</code>
                                <button
                                  onClick={() => copyCommand(hint.exactCommand!)}
                                  className="p-1 text-cyan-300 hover:text-cyan-100 transition-colors"
                                  title="Copy exact command"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expected Output */}
                        {hint.expectedOutput && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-slate-800 flex items-center space-x-1">
                              <span>📊</span>
                              <span>Expected Output</span>
                            </h5>
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg font-mono text-sm">
                              <pre className="text-green-800 whitespace-pre-wrap">{hint.expectedOutput}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Next Hint Preview */}
        {nextHint && (
          <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-slate-600 font-medium">Next hint in</span>
              </div>

              {nextHint.timeToReveal && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-bold text-blue-600">
                    {Math.max(0, nextHint.timeToReveal - timeElapsed)}s
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-slate-800">{nextHint.title}</h4>
                {getCategoryIcon(nextHint.category)}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(nextHint.category)}`}>
                  {nextHint.category}
                </span>
                <span className="text-xs text-slate-500 capitalize">{nextHint.type} hint</span>
              </div>
              <p className="text-xs text-slate-600 italic">{nextHint.description}</p>
            </div>

            {!autoReveal && (
              <button
                onClick={() => revealHint(nextHint.id)}
                className="mt-3 w-full px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
              >
                🚀 Reveal Hint Now
              </button>
            )}
          </div>
        )}

        {/* No more hints */}
        {availableHints.length === hints.length && (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">All hints revealed!</p>
            <p className="text-xs text-slate-500 mt-1">
              You're ready to solve this scenario
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Scenario Progress</span>
            <span className="font-medium">45%</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-[45%] transition-all duration-300"></div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Keep going!</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>Expert level</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HintsPanel;
