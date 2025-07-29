import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Play, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Lock, 
  Unlock,
  Terminal,
  TestTube,
  Monitor,
  BookOpen,
  Search,
  FolderOpen,
  Folder,
  File,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { DebugChallenge } from '../data/debugPlatformComplete';
import CodeEditor from './CodeEditor';
import FileExplorer from './FileExplorer';
import ProblemPanel from './ProblemPanel';
import ConsoleOutput from './ConsoleOutput';

interface DebugChallengeInterfaceProps {
  challenge: DebugChallenge;
  onBack: () => void;
  onComplete?: (challengeId: string, xpEarned: number) => void;
}

const DebugChallengeInterface: React.FC<DebugChallengeInterfaceProps> = ({
  challenge,
  onBack,
  onComplete
}) => {
  // State management
  const [selectedFile, setSelectedFile] = useState<string>(Object.keys(challenge.files)[0]);
  const [userCode, setUserCode] = useState<Record<string, string>>(challenge.files);
  const [activeTab, setActiveTab] = useState<'problem' | 'criteria' | 'hints' | 'solution'>('problem');
  const [consoleTab, setConsoleTab] = useState<'console' | 'tests' | 'preview' | 'logbook'>('console');
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [panelSizes, setPanelSizes] = useState({
    explorer: 20,
    editor: 50,
    problem: 30,
    console: 25
  });

  // Panel visibility states
  const [showExplorer, setShowExplorer] = useState(true);
  const [showProblem, setShowProblem] = useState(true);
  const [showConsole, setShowConsole] = useState(true);

  // File modification tracking
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Track file modifications
    const modified = new Set<string>();
    Object.keys(userCode).forEach(filename => {
      if (userCode[filename] !== challenge.files[filename]) {
        modified.add(filename);
      }
    });
    setModifiedFiles(modified);
  }, [userCode, challenge.files]);

  const handleCodeChange = (filename: string, code: string) => {
    setUserCode(prev => ({
      ...prev,
      [filename]: code
    }));
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, '> Starting execution...']);
    setConsoleTab('console');

    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConsoleOutput(prev => [...prev, '> Checking for bugs...']);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConsoleOutput(prev => [...prev, '> Code analysis complete']);
      
      // Mock test results based on challenge criteria
      const testCases = challenge.testCases || challenge.testCriteria || [];
      const mockResults = testCases.map((testCase, index) => ({
        id: index,
        name: testCase,
        passed: Math.random() > 0.3, // Random for demo
        message: Math.random() > 0.3 ? 'Test passed successfully' : 'Test failed - check implementation'
      }));
      
      setTestResults(mockResults);
      
      const passedTests = mockResults.filter(r => r.passed).length;
      const totalTests = mockResults.length;
      
      if (passedTests === totalTests) {
        setConsoleOutput(prev => [...prev, `✅ All tests passed! (${passedTests}/${totalTests})`]);
        if (onComplete) {
          onComplete(challenge.id, challenge.xpReward);
        }
      } else {
        setConsoleOutput(prev => [...prev, `❌ ${passedTests}/${totalTests} tests passed`]);
      }
      
    } catch (error) {
      setConsoleOutput(prev => [...prev, `❌ Error: ${error}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setUserCode(challenge.files);
    setConsoleOutput([]);
    setTestResults([]);
    setHintsRevealed(0);
    setSolutionUnlocked(false);
  };

  const revealHint = () => {
    if (hintsRevealed < challenge.hints.length) {
      setHintsRevealed(prev => prev + 1);
      setActiveTab('hints');
    }
  };

  const unlockSolution = () => {
    setSolutionUnlocked(true);
    setActiveTab('solution');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTechStackColor = (techStack: string) => {
    switch (techStack) {
      case 'React': return 'bg-blue-100 text-blue-800';
      case 'Angular': return 'bg-red-100 text-red-800';
      case 'Node.js': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Challenges</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTechStackColor(challenge.techStack)}`}>
              {challenge.techStack}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="text-sm text-gray-500">• {challenge.estimatedTime}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{challenge.xpReward} XP</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Debug Challenge</span>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="font-medium text-gray-900">{challenge.title}</span>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Explorer */}
        <AnimatePresence>
          {showExplorer && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${panelSizes.explorer}%` }}
              exit={{ width: 0 }}
              className="bg-white border-r border-gray-200 flex flex-col"
            >
              <FileExplorer
                files={Object.keys(challenge.files)}
                selectedFile={selectedFile}
                modifiedFiles={modifiedFiles}
                onFileSelect={setSelectedFile}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Panel - Code Editor */}
        <div 
          className="flex-1 flex flex-col"
          style={{ width: showExplorer && showProblem ? `${panelSizes.editor}%` : 'auto' }}
        >
          <CodeEditor
            filename={selectedFile}
            code={userCode[selectedFile] || ''}
            onChange={(code) => handleCodeChange(selectedFile, code)}
            language={selectedFile.endsWith('.tsx') || selectedFile.endsWith('.jsx') ? 'typescript' : 'javascript'}
          />
        </div>

        {/* Right Panel - Problem Details */}
        <AnimatePresence>
          {showProblem && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${panelSizes.problem}%` }}
              exit={{ width: 0 }}
              className="bg-white border-l border-gray-200 flex flex-col"
            >
              <ProblemPanel
                challenge={challenge}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                hintsRevealed={hintsRevealed}
                solutionUnlocked={solutionUnlocked}
                onRevealHint={revealHint}
                onUnlockSolution={unlockSolution}
                testResults={testResults}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Panel - Console Output */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${panelSizes.console}%` }}
            exit={{ height: 0 }}
            className="bg-white border-t border-gray-200"
          >
            <ConsoleOutput
              activeTab={consoleTab}
              onTabChange={setConsoleTab}
              consoleOutput={consoleOutput}
              testResults={testResults}
              challenge={challenge}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExplorer(!showExplorer)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Toggle Explorer"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowProblem(!showProblem)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Toggle Problem Panel"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Toggle Console"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Code</span>
          </button>
          
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'Running...' : 'Run & Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugChallengeInterface;
