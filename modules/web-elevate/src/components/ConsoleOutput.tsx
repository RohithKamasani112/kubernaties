import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  TestTube,
  Monitor,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Copy,
  Download,
  Play,
  Clock
} from 'lucide-react';
import { DebugChallenge } from '../data/debugPlatformComplete';

interface ConsoleOutputProps {
  activeTab: 'console' | 'tests' | 'preview' | 'logbook';
  onTabChange: (tab: 'console' | 'tests' | 'preview' | 'logbook') => void;
  consoleOutput: string[];
  testResults: any[];
  challenge: DebugChallenge;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  activeTab,
  onTabChange,
  consoleOutput,
  testResults,
  challenge
}) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleRef.current && activeTab === 'console') {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput, activeTab]);

  const tabs = [
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'tests', label: 'Tests', icon: TestTube, badge: testResults.length },
    { id: 'preview', label: 'Preview', icon: Monitor },
    { id: 'logbook', label: 'Logbook', icon: BookOpen }
  ] as const;

  const clearConsole = () => {
    // This would be handled by parent component
  };

  const copyConsoleOutput = async () => {
    try {
      await navigator.clipboard.writeText(consoleOutput.join('\n'));
    } catch (err) {
      console.error('Failed to copy console output:', err);
    }
  };

  const renderConsoleTab = () => (
    <div className="h-full flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Console Output</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={copyConsoleOutput}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Copy output"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={clearConsole}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
            title="Clear console"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div
        ref={consoleRef}
        className="flex-1 p-3 bg-gray-900 text-green-400 font-mono text-sm overflow-y-auto"
      >
        {consoleOutput.length === 0 ? (
          <div className="text-gray-400 italic">
            Console output will appear here when you run your code...
          </div>
        ) : (
          <div className="space-y-1">
            {consoleOutput.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`leading-relaxed ${
                  line.startsWith('❌') ? 'text-red-400' :
                  line.startsWith('✅') ? 'text-green-400' :
                  line.startsWith('⚠️') ? 'text-yellow-400' :
                  line.startsWith('>') ? 'text-blue-400' :
                  line.includes('Error') || line.includes('error') ? 'text-red-300' :
                  line.includes('Warning') || line.includes('warning') ? 'text-yellow-300' :
                  line.includes('Info') || line.includes('info') ? 'text-blue-300' :
                  'text-gray-100'
                }`}
              >
                <span className="text-gray-500 mr-2 select-none">
                  {String(index + 1).padStart(3, '0')}
                </span>
                {line}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderTestsTab = () => (
    <div className="h-full flex flex-col">
      {/* Tests Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <TestTube className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Test Results</span>
          {testResults.length > 0 && (
            <span className="text-xs text-gray-500">
              ({testResults.filter(r => r.passed).length}/{testResults.length} passed)
            </span>
          )}
        </div>
        
        <button className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          <Play className="w-3 h-3" />
          <span>Run Tests</span>
        </button>
      </div>

      {/* Test Results */}
      <div className="flex-1 overflow-y-auto p-3">
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No test results yet</p>
            <p className="text-xs text-gray-400 mt-1">Run your code to see test results</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <motion.div
                key={result.id || index}
                className={`p-3 rounded-lg border ${
                  result.passed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      result.passed ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {result.name}
                    </h4>
                    
                    {result.message && (
                      <p className={`text-xs mt-1 ${
                        result.passed ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                    )}
                    
                    {result.duration && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{result.duration}ms</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Monitor className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Live Preview</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors">
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white">
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Live preview will appear here</p>
            <p className="text-xs text-gray-400 mt-1">
              Run your code to see the output
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogbookTab = () => (
    <div className="h-full flex flex-col">
      {/* Logbook Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Debug Logbook</span>
        </div>
      </div>

      {/* Logbook Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {/* Challenge Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">Challenge Overview</h4>
            <p className="text-sm text-blue-800">{challenge.description}</p>
          </div>

          {/* Key Learning Points */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-900 mb-2">Key Learning Points</h4>
            <ul className="space-y-1">
              {challenge.tags.slice(0, 3).map((tag, index) => (
                <li key={index} className="text-sm text-green-800">
                  • Understanding {tag} concepts
                </li>
              ))}
            </ul>
          </div>

          {/* Common Issues */}
          {challenge.commonMistakes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium text-yellow-900 mb-2">Common Issues to Watch For</h4>
              <ul className="space-y-1">
                {challenge.commonMistakes.slice(0, 3).map((mistake, index) => (
                  <li key={index} className="text-sm text-yellow-800">
                    • {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Notes */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Your Progress</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Challenge started</span>
              </div>
              {testResults.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">First test run completed</span>
                </div>
              )}
              {testResults.some(r => r.passed) && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Some tests passing</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex space-x-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'console' && renderConsoleTab()}
            {activeTab === 'tests' && renderTestsTab()}
            {activeTab === 'preview' && renderPreviewTab()}
            {activeTab === 'logbook' && renderLogbookTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConsoleOutput;
