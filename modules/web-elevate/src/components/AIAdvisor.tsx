import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Lightbulb,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Code,
  Settings,
  TrendingUp,
  Lock
} from 'lucide-react';

interface CodeAnalysis {
  id: string;
  type: 'performance' | 'security' | 'architecture' | 'best-practice';
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  suggestion: string;
  line?: number;
  column?: number;
  code?: string;
  fix?: string;
}

interface AIAdvisorProps {
  code: string;
  language: string;
  filename: string;
  isVisible: boolean;
  onToggle: () => void;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ 
  code, 
  language, 
  filename, 
  isVisible, 
  onToggle 
}) => {
  const [analyses, setAnalyses] = useState<CodeAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'performance' | 'security' | 'architecture' | 'best-practice'>('all');

  // Simulate AI analysis
  useEffect(() => {
    if (!code || !isVisible) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    const timer = setTimeout(() => {
      const mockAnalyses = generateMockAnalyses(code, language, filename);
      setAnalyses(mockAnalyses);
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [code, language, filename, isVisible]);

  const generateMockAnalyses = (code: string, language: string, filename: string): CodeAnalysis[] => {
    const analyses: CodeAnalysis[] = [];

    // Performance analysis
    if (code.includes('console.log')) {
      analyses.push({
        id: 'perf-1',
        type: 'performance',
        severity: 'warning',
        title: 'Console statements in production',
        description: 'Console.log statements can impact performance in production environments.',
        suggestion: 'Consider using a proper logging library or removing console statements for production builds.',
        line: code.split('\n').findIndex(line => line.includes('console.log')) + 1,
        code: 'console.log(...)',
        fix: '// Use a logging library like winston or remove for production'
      });
    }

    // Security analysis
    if (code.includes('innerHTML') || code.includes('dangerouslySetInnerHTML')) {
      analyses.push({
        id: 'sec-1',
        type: 'security',
        severity: 'error',
        title: 'Potential XSS vulnerability',
        description: 'Direct HTML injection can lead to Cross-Site Scripting (XSS) attacks.',
        suggestion: 'Use textContent instead of innerHTML, or properly sanitize the HTML content.',
        line: code.split('\n').findIndex(line => line.includes('innerHTML')) + 1,
        code: 'element.innerHTML = userInput',
        fix: 'element.textContent = userInput // or use DOMPurify.sanitize()'
      });
    }

    // Architecture analysis
    if (language === 'javascript' && code.includes('var ')) {
      analyses.push({
        id: 'arch-1',
        type: 'architecture',
        severity: 'info',
        title: 'Use modern variable declarations',
        description: 'Using var can lead to unexpected behavior due to function scoping.',
        suggestion: 'Use const for constants and let for variables that need to be reassigned.',
        line: code.split('\n').findIndex(line => line.includes('var ')) + 1,
        code: 'var myVariable = value',
        fix: 'const myVariable = value // or let if reassignment is needed'
      });
    }

    // Best practices
    if (language === 'javascript' && !code.includes('use strict') && code.length > 100) {
      analyses.push({
        id: 'bp-1',
        type: 'best-practice',
        severity: 'info',
        title: 'Consider using strict mode',
        description: 'Strict mode helps catch common coding mistakes and prevents unsafe actions.',
        suggestion: 'Add "use strict"; at the beginning of your JavaScript files.',
        code: '// Missing strict mode',
        fix: '"use strict";\n\n// Your code here'
      });
    }

    // React-specific analysis
    if (language === 'javascript' && code.includes('useState') && !code.includes('useCallback')) {
      analyses.push({
        id: 'react-1',
        type: 'performance',
        severity: 'info',
        title: 'Consider memoization for event handlers',
        description: 'Event handlers recreated on every render can cause unnecessary re-renders.',
        suggestion: 'Use useCallback to memoize event handlers that are passed to child components.',
        code: 'const handleClick = () => { ... }',
        fix: 'const handleClick = useCallback(() => { ... }, [dependencies])'
      });
    }

    return analyses;
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return TrendingUp;
      case 'security': return Shield;
      case 'architecture': return Code;
      case 'best-practice': return Lightbulb;
      default: return Bot;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'text-blue-600 bg-blue-100';
      case 'security': return 'text-red-600 bg-red-100';
      case 'architecture': return 'text-purple-600 bg-purple-100';
      case 'best-practice': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const filteredAnalyses = filter === 'all' 
    ? analyses 
    : analyses.filter(analysis => analysis.type === filter);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">AI Code Advisor</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-indigo-700 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['all', 'performance', 'security', 'architecture', 'best-practice'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                filter === filterType
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Analyzing your code...</p>
            </div>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No issues found!</p>
              <p className="text-xs text-gray-500">Your code looks good.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredAnalyses.map((analysis) => {
              const TypeIcon = getTypeIcon(analysis.type);
              const SeverityIcon = getSeverityIcon(analysis.severity);
              const isExpanded = expandedItems.has(analysis.id);

              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(analysis.id)}
                    className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(analysis.type)}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {analysis.title}
                          </h4>
                          <SeverityIcon className={`w-4 h-4 ${getSeverityColor(analysis.severity)}`} />
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {analysis.description}
                        </p>
                        {analysis.line && (
                          <p className="text-xs text-gray-500 mt-1">
                            Line {analysis.line}
                          </p>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="border-t border-gray-200 bg-gray-50"
                      >
                        <div className="p-3 space-y-3">
                          <div>
                            <h5 className="text-xs font-medium text-gray-900 mb-1">Suggestion</h5>
                            <p className="text-xs text-gray-700">{analysis.suggestion}</p>
                          </div>

                          {analysis.code && (
                            <div>
                              <h5 className="text-xs font-medium text-gray-900 mb-1">Current Code</h5>
                              <div className="bg-gray-800 text-gray-100 p-2 rounded text-xs font-mono">
                                {analysis.code}
                              </div>
                            </div>
                          )}

                          {analysis.fix && (
                            <div>
                              <h5 className="text-xs font-medium text-gray-900 mb-1">Suggested Fix</h5>
                              <div className="bg-green-800 text-green-100 p-2 rounded text-xs font-mono">
                                {analysis.fix}
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
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {filteredAnalyses.length} issue{filteredAnalyses.length !== 1 ? 's' : ''} found
          </span>
          <div className="flex items-center space-x-1">
            <Bot className="w-3 h-3" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAdvisor;
