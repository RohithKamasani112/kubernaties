import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  TestTube,
  Eye,
  Play,
  Square,
  RotateCcw,
  Download,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react';
import { ValidationResult } from '../data/blueprintTypes';

interface BlueprintConsoleProps {
  activeTab: 'console' | 'tests' | 'preview';
  onTabChange: (tab: 'console' | 'tests' | 'preview') => void;
  consoleOutput: string[];
  testResults: ValidationResult[];
  previewUrl?: string;
  buildStatus: 'idle' | 'building' | 'success' | 'error';
}

const BlueprintConsole: React.FC<BlueprintConsoleProps> = ({
  activeTab,
  onTabChange,
  consoleOutput,
  testResults,
  previewUrl,
  buildStatus
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput, autoScroll]);

  const clearConsole = () => {
    // This would trigger a callback to clear console output
  };

  const copyConsoleOutput = () => {
    navigator.clipboard.writeText(consoleOutput.join('\n'));
  };

  const downloadConsoleLog = () => {
    const blob = new Blob([consoleOutput.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'console-log.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getTestStatusColor = (passed: boolean) => {
    return passed ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50';
  };

  const renderConsoleTab = () => (
    <div className="h-full flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Console Output</span>
          {buildStatus === 'building' && (
            <div className="flex items-center space-x-1 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-xs">Running...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1.5 rounded text-xs ${
              autoScroll ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Auto-scroll"
          >
            Auto
          </button>
          <button
            onClick={copyConsoleOutput}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
            title="Copy output"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={downloadConsoleLog}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
            title="Download log"
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={clearConsole}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
            title="Clear console"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto bg-gray-900 text-green-400 font-mono text-sm p-4"
      >
        {consoleOutput.length === 0 ? (
          <div className="text-gray-500 italic">
            Console output will appear here...
          </div>
        ) : (
          consoleOutput.map((line, index) => (
            <div key={index} className="mb-1 leading-relaxed">
              <span className="text-gray-500 mr-2">
                {String(index + 1).padStart(3, '0')}
              </span>
              <span className={
                line.includes('error') || line.includes('Error') ? 'text-red-400' :
                line.includes('warning') || line.includes('Warning') ? 'text-yellow-400' :
                line.includes('success') || line.includes('Success') ? 'text-green-400' :
                'text-gray-300'
              }>
                {line}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTestsTab = () => (
    <div className="h-full flex flex-col">
      {/* Tests Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <TestTube className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Test Results</span>
          {testResults.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
              {testResults.filter(t => t.passed).length}/{testResults.length} passed
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
            <Play className="w-3 h-3" />
            <span>Run Tests</span>
          </button>
        </div>
      </div>

      {/* Tests Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {testResults.length === 0 ? (
          <div className="text-center py-8">
            <TestTube className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests run yet</h3>
            <p className="text-gray-600">Run your tests to see results here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 ${
                  result.passed ? 'border-green-200' : 'border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTestStatusIcon(result.passed)}
                    <h4 className="font-medium text-gray-900">Test #{index + 1}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded ${getTestStatusColor(result.passed)}`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{result.executionTime}ms</span>
                    </div>
                    <span>{result.score}/100</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{result.feedback}</p>

                {/* Test Details */}
                <div className="space-y-2">
                  {result.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className={`flex items-start space-x-2 p-2 rounded text-sm ${
                        detail.passed ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      {detail.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{detail.criterion}</div>
                        <div className="text-gray-600">{detail.message}</div>
                      </div>
                    </div>
                  ))}
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
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Live Preview</span>
          {previewUrl && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
              Running
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {previewUrl && (
            <>
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-gray-900 rounded text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open</span>
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 text-gray-600 hover:text-gray-900 rounded"
              >
                {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Live Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No preview available</h3>
              <p className="text-gray-600 mb-4">
                Run your project to see a live preview
              </p>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto">
                <Play className="w-4 h-4" />
                <span>Start Preview</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`bg-white border-gray-200 ${isMaximized ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex space-x-8 px-4">
          {[
            { id: 'console', label: 'Console', icon: Terminal, count: consoleOutput.length },
            { id: 'tests', label: 'Tests', icon: TestTube, count: testResults.length },
            { id: 'preview', label: 'Preview', icon: Eye, status: previewUrl ? 'active' : 'inactive' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
                {tab.status === 'active' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'console' && renderConsoleTab()}
        {activeTab === 'tests' && renderTestsTab()}
        {activeTab === 'preview' && renderPreviewTab()}
      </div>
    </div>
  );
};

export default BlueprintConsole;
