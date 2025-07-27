import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Code,
  Terminal,
  Play,
  Bug,
  FileText,
  Folder,
  FolderOpen,
  Save,
  RotateCcw,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap,
  Lightbulb,
  Target,
  Award,
  Clock,
  User,
  BookOpen,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import { debugProjects, DebugProject, DebugTest } from '../data/debugProjects';
import AIDebugHelper from '../components/AIDebugHelper';
import { DebugTestRunner, TestResult } from '../utils/testFramework';



const DebugPlayground: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const { awardPoints, updateStreak, completeDebugProject, getDebugProjectProgress } = useWebElevateStore();
  
  const [selectedProject, setSelectedProject] = useState<DebugProject | null>(null);
  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '🐛 Welcome to Debug Playground!',
    'Find and fix the bugs to complete the challenge.',
    ''
  ]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showAIHelper, setShowAIHelper] = useState<boolean>(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (projectId) {
      const project = debugProjects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        setFiles(project.files);
        setActiveFile(Object.keys(project.files)[0]);
        setStartTime(new Date());
      }
    }
  }, [projectId]);

  const runTests = () => {
    if (!selectedProject) return;

    setIsRunning(true);

    // Use the new testing framework
    const results = DebugTestRunner.runTests(selectedProject.id, files);
    setTestResults(results);

    // Calculate score
    const score = DebugTestRunner.getProjectScore(selectedProject.id, results);
    const allPassed = results.every(r => r.passed);

    setTimeout(() => {
      setIsRunning(false);

      if (allPassed && !isCompleted) {
        setIsCompleted(true);
        const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60);
        const basePoints = selectedProject.points || 100;
        const timeBonus = Math.max(0, 50 - timeSpent * 2); // Bonus for speed
        const hintPenalty = hintsUsed * 10; // Penalty for using hints
        const scoreBonus = Math.floor((score / 100) * 50); // Bonus for code quality
        const totalPoints = Math.max(50, basePoints + timeBonus + scoreBonus - hintPenalty);

        // Track completion in store
        completeDebugProject(selectedProject.id, timeSpent, score, hintsUsed);

        awardPoints(totalPoints, `Completed ${selectedProject.title}`);
        updateStreak();

        setTerminalOutput(prev => [...prev,
          '🎉 Congratulations! All tests passed!',
          `⏱️ Time: ${timeSpent} minutes`,
          `💡 Hints used: ${hintsUsed}`,
          `📊 Code quality score: ${score}%`,
          `🏆 Points earned: ${totalPoints}`,
          ''
        ]);
      } else {
        setTerminalOutput(prev => [...prev,
          `📊 Test Results: ${results.filter(r => r.passed).length}/${results.length} passed`,
          `📈 Code quality score: ${score}%`,
          results.filter(r => !r.passed).length > 0 ? '🔍 Check the failed tests for guidance!' : '',
          ''
        ]);
      }
    }, 1000);
  };

  const updateFileContent = (filename: string, content: string) => {
    setFiles(prev => ({ ...prev, [filename]: content }));
  };

  const showHint = () => {
    if (!selectedProject || hintsUsed >= selectedProject.hints.length) return;
    
    const hint = selectedProject.hints[hintsUsed];
    setHintsUsed(prev => prev + 1);
    setTerminalOutput(prev => [...prev, `💡 Hint ${hintsUsed + 1}: ${hint}`, '']);
  };

  const resetProject = () => {
    if (!selectedProject) return;
    
    setFiles(selectedProject.files);
    setHintsUsed(0);
    setTestResults([]);
    setIsCompleted(false);
    setShowSolution(false);
    setStartTime(new Date());
    setTerminalOutput([
      '🔄 Project reset!',
      'Find and fix the bugs to complete the challenge.',
      ''
    ]);
  };

  if (!selectedProject) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Bug className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project not found</h2>
          <Link 
            to="/web-elevate/debug-projects" 
            className="text-indigo-600 hover:text-indigo-700"
          >
            Browse debugging projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/web-elevate/debug-projects"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Projects</span>
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{selectedProject.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedProject.estimatedTime}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span className="capitalize">{selectedProject.difficulty}</span>
                </span>
                {isCompleted && (
                  <span className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>Run Tests</span>
            </button>
            <button
              onClick={showHint}
              disabled={hintsUsed >= selectedProject.hints.length}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Hint ({hintsUsed}/{selectedProject.hints.length})</span>
            </button>
            <button
              onClick={() => setShowAIHelper(true)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>AI Helper</span>
            </button>
            <button
              onClick={resetProject}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Instructions Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 Challenge Brief</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">User Story</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedProject.userStory}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">The Bug</h4>
                <p className="text-sm text-red-600 mt-1">{selectedProject.defect}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Your Mission</h4>
                <p className="text-sm text-gray-600 mt-1">Find and fix the bug to make the feature work as expected!</p>
              </div>
            </div>
          </div>
          
          {/* File Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-3">Project Files</h4>
            <div className="space-y-1">
              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`w-full text-left flex items-center space-x-2 px-2 py-1 rounded text-sm transition-colors ${
                    activeFile === filename
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{filename}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">{activeFile}</span>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={getLanguageFromFile(activeFile)}
              theme="vs-dark"
              value={files[activeFile] || ''}
              onChange={(value) => value && updateFileContent(activeFile, value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        {/* Preview and Tests Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Preview */}
          <div className="h-1/2 border-b border-gray-200">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
            </div>
            <div className="h-full bg-white">
              <iframe
                srcDoc={files['index.html'] || ''}
                className="w-full h-full border-none"
                title="Live Preview"
              />
            </div>
          </div>

          {/* Tests and Terminal */}
          <div className="h-1/2 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Tests & Output</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Test Results</h4>
                    <div className="text-xs text-gray-500">
                      Score: {DebugTestRunner.getProjectScore(selectedProject?.id || '', testResults)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    {testResults.map((test, index) => (
                      <div key={index} className={`p-2 rounded border text-xs ${
                        test.passed
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {test.passed ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              test.category === 'functionality' ? 'bg-blue-100 text-blue-700' :
                              test.category === 'implementation' ? 'bg-purple-100 text-purple-700' :
                              test.category === 'best-practice' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {test.category}
                            </span>
                            <span className="text-xs font-medium">{test.score}pts</span>
                          </div>
                        </div>
                        <p className="mt-1 opacity-80">{test.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terminal Output */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Console</h4>
                <div className="bg-black text-green-400 p-3 rounded font-mono text-xs space-y-1 max-h-32 overflow-y-auto">
                  {terminalOutput.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Debug Helper */}
      <AIDebugHelper
        isOpen={showAIHelper}
        onClose={() => setShowAIHelper(false)}
        projectId={selectedProject.id}
        currentCode={files}
        testResults={testResults}
        onHintUsed={() => setHintsUsed(prev => prev + 1)}
      />
    </div>
  );
};

// Helper function to get language from file extension
const getLanguageFromFile = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    default: return 'plaintext';
  }
};

export default DebugPlayground;
