import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Terminal,
  FileText,
  Eye,
  Trophy,
  Zap,
  Clock,
  Target,
  Bug,
  Code,
  Globe,
  Server
} from 'lucide-react';
import { debugChallenges } from '../data/debugChallenges';
import { useWebElevateStore } from '../store/webElevateStore';

const DebugChallengeEditor: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { completeDebugProject, awardPoints } = useWebElevateStore();

  const challenge = debugChallenges.find(c => c.id === challengeId);
  
  const [currentFiles, setCurrentFiles] = useState<{ [filename: string]: string }>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (challenge) {
      setCurrentFiles(challenge.files);
      setActiveFile(Object.keys(challenge.files)[0]);
    }
  }, [challenge]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge Not Found</h2>
          <p className="text-gray-600 mb-4">The debug challenge you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/web-elevate/debug-projects')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const getTechStackIcon = (techStack: string) => {
    switch (techStack) {
      case 'React': return <Code className="w-5 h-5 text-blue-600" />;
      case 'Angular': return <Globe className="w-5 h-5 text-red-600" />;
      case 'Node.js': return <Server className="w-5 h-5 text-green-600" />;
      default: return <Code className="w-5 h-5 text-gray-600" />;
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setConsoleOutput(['Running code...']);
    
    // Simulate code execution
    setTimeout(() => {
      const output = [
        '> Starting execution...',
        '> Checking for bugs...',
        '> Code analysis complete',
      ];
      
      // Simple check if the code has been fixed (basic heuristic)
      const hasFixedCode = Object.values(currentFiles).some(content => 
        content.includes('try') || 
        content.includes('catch') || 
        content.includes('useEffect') ||
        content.includes('detectChanges') ||
        content.includes('e.target.value')
      );
      
      if (hasFixedCode) {
        output.push('✅ Great! The bug appears to be fixed!');
        output.push('🎉 Challenge completed successfully!');
        setIsCompleted(true);
        
        // Award points and mark as complete
        const timeSpent = Math.round((Date.now() - startTime) / 60000); // minutes
        completeDebugProject(challenge.id, timeSpent, 100, currentHintIndex);
        awardPoints(challenge.xpReward, `Completed ${challenge.title}`);
      } else {
        output.push('❌ Bug still exists. Keep debugging!');
        output.push('💡 Try using the hints if you need help.');
      }
      
      setConsoleOutput(output);
      setIsRunning(false);
    }, 2000);
  };

  const resetCode = () => {
    setCurrentFiles(challenge.files);
    setConsoleOutput([]);
    setIsCompleted(false);
    setShowSolution(false);
    setCurrentHintIndex(0);
  };

  const nextHint = () => {
    if (challenge.hints && currentHintIndex < challenge.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const showSolutionCode = () => {
    setCurrentFiles(challenge.solution);
    setShowSolution(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/web-elevate/debug-projects')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Challenges</span>
            </button>
            
            <div className="flex items-center space-x-3">
              {getTechStackIcon(challenge.techStack)}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{challenge.title}</h1>
                <p className="text-sm text-gray-600">{challenge.techStack} • {challenge.difficulty} • {challenge.estimatedTime}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4" />
              <span>{challenge.xpReward} XP</span>
            </div>
            
            {isCompleted && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Completed!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Instructions & Hints */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Challenge Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">🐛 Challenge Description</h2>
              <p className="text-gray-700 mb-4">{challenge.description}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-red-800 mb-2">Root Cause:</h3>
                <p className="text-sm text-red-700">{challenge.rootCause}</p>
              </div>

              {challenge.learningObjectives && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Learning Objectives:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {challenge.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="w-3 h-3 mt-1 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {challenge.preventionTips && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Prevention Tips:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    {challenge.preventionTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="w-3 h-3 mt-1 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Hints Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">💡 Hints</h2>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
              </div>
              
              {showHints && challenge.hints && (
                <div className="space-y-3">
                  {challenge.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                    >
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">{hint}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {challenge.hints && currentHintIndex < challenge.hints.length - 1 && (
                    <button
                      onClick={nextHint}
                      className="w-full px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Show Next Hint ({currentHintIndex + 2}/{challenge.hints.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Test Criteria */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">✅ Success Criteria</h2>
              <ul className="space-y-2">
                {(challenge.testCriteria || challenge.testCases || []).map((criteria, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={showSolutionCode}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Show Solution
              </button>
              
              <button
                onClick={resetCode}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2">
            <div className="flex space-x-2">
              {Object.keys(currentFiles || {}).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`px-3 py-1 text-sm rounded-t-lg transition-colors ${
                    activeFile === filename
                      ? 'bg-white text-gray-900 border-t border-l border-r border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  {filename}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={
                activeFile.endsWith('.tsx') || activeFile.endsWith('.jsx') ? 'typescript' :
                activeFile.endsWith('.ts') ? 'typescript' :
                activeFile.endsWith('.js') ? 'javascript' :
                activeFile.endsWith('.html') ? 'html' :
                'javascript'
              }
              value={currentFiles[activeFile] || ''}
              onChange={(value) => {
                setCurrentFiles(prev => ({
                  ...prev,
                  [activeFile]: value || ''
                }));
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on'
              }}
            />
          </div>

          {/* Action Bar */}
          <div className="bg-gray-100 border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? 'Running...' : 'Run & Test'}</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Press Ctrl+S to save • Use hints if you're stuck
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Console/Output */}
        <div className="w-1/3 bg-gray-900 text-white overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Console Output</h2>
            </div>
            
            <div className="space-y-2 font-mono text-sm">
              {consoleOutput.length === 0 ? (
                <p className="text-gray-400">Click "Run & Test" to see output...</p>
              ) : (
                consoleOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.includes('✅') ? 'text-green-400' :
                      line.includes('❌') ? 'text-red-400' :
                      line.includes('💡') ? 'text-yellow-400' :
                      line.includes('🎉') ? 'text-purple-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
            
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-green-900 border border-green-700 rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-green-400">Challenge Completed!</h3>
                </div>
                <p className="text-green-300 text-sm mb-3">
                  Congratulations! You've successfully fixed the bug and earned {challenge.xpReward} XP.
                </p>
                <button
                  onClick={() => navigate('/web-elevate/debug-projects')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Next Challenge
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugChallengeEditor;
