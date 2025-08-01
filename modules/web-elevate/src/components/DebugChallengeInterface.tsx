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
    console: 25  // Restored to 25% for better visibility
  });

  // Panel visibility states
  const [showExplorer, setShowExplorer] = useState(true);
  const [showProblem, setShowProblem] = useState(true);
  const [showConsole, setShowConsole] = useState(false);  // Hidden by default
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);

  // File modification tracking
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set());

  const [previewContent, setPreviewContent] = useState<string>('');

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



  // Generate live preview
  useEffect(() => {
    const generatePreview = () => {
      if (challenge.category === 'react') {
        // Generate React preview
        const jsCode = userCode['App.js'] || userCode['index.js'] || '';
        const cssCode = userCode['App.css'] || userCode['styles.css'] || '';

        const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .preview-container {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    ${cssCode}
  </style>
</head>
<body>
  <div class="preview-container">
    <div id="root">
      <div class="App">
        <h2>Live Preview</h2>
        <p>This is a simulated preview of your React component.</p>
        <div class="code-preview">
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto;">
            <code>${jsCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
          </pre>
        </div>
      </div>
    </div>
  </div>
  <script>
    console.log('Preview loaded with code:', ${JSON.stringify(jsCode.substring(0, 100) + '...')});
  </script>
</body>
</html>`;
        setPreviewContent(previewHTML);
      } else {
        // Generate HTML/JS preview
        const htmlCode = userCode['index.html'] || '';
        const jsCode = userCode['script.js'] || userCode['main.js'] || '';
        const cssCode = userCode['style.css'] || userCode['styles.css'] || '';

        let preview = htmlCode;
        if (cssCode) {
          preview = preview.replace('</head>', `<style>${cssCode}</style></head>`);
        }
        if (jsCode) {
          preview = preview.replace('</body>', `<script>${jsCode}</script></body>`);
        }

        setPreviewContent(preview || '<html><body><h2>No preview available</h2><p>Add some HTML code to see the preview.</p></body></html>');
      }
    };

    generatePreview();
  }, [userCode, challenge.category]);

  const handleCodeChange = (filename: string, code: string) => {
    setUserCode(prev => ({
      ...prev,
      [filename]: code
    }));

    // Auto-open console if there are syntax errors
    const hasErrors = code.includes('Error') ||
                     code.includes('undefined') ||
                     (code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length ||
                     (code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length;

    if (hasErrors && !showConsole) {
      // Delay to avoid opening console on every keystroke
      setTimeout(() => {
        const stillHasErrors = userCode[filename] && (
          userCode[filename].includes('Error') ||
          (userCode[filename].match(/\{/g) || []).length !== (userCode[filename].match(/\}/g) || []).length
        );

        if (stillHasErrors) {
          setShowConsole(true);
          setPanelSizes(prev => ({
            ...prev,
            console: Math.max(prev.console, 30)
          }));
        }
      }, 2000); // Wait 2 seconds before auto-opening
    }
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    setConsoleOutput(['> Starting execution...']);  // Clear previous output
    setConsoleTab('console');

    // Always show and expand console when running tests
    setShowConsole(true);
    setIsConsoleExpanded(true);
    setPanelSizes(prev => ({
      ...prev,
      console: Math.max(prev.console, 35)  // Expand to at least 35%
    }));

    try {
      // Simulate code execution and capture console output
      await new Promise(resolve => setTimeout(resolve, 800));

      setConsoleOutput(prev => [...prev, '> Executing code...']);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Simulate detecting console.log statements in user code
      const hasConsoleLogs = Object.values(userCode).some(code =>
        code.includes('console.log') || code.includes('console.error') || code.includes('console.warn')
      );

      if (hasConsoleLogs) {
        setConsoleOutput(prev => [...prev, '> Console output detected']);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate actual console output
        setConsoleOutput(prev => [...prev,
          '📝 Hello from your code!',
          '🔍 Debug: Variable value = 42',
          '⚠️ Warning: This is a test warning'
        ]);

        // Auto-expand more for console output
        setPanelSizes(prev => ({
          ...prev,
          console: Math.max(prev.console, 40)
        }));
      }

      setConsoleOutput(prev => [...prev, '> Running tests...']);
      await new Promise(resolve => setTimeout(resolve, 500));

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
        setConsoleOutput(prev => [...prev, '💡 Check the errors above and try fixing them']);

        // Auto-expand console more for test failures
        setPanelSizes(prev => ({
          ...prev,
          console: Math.max(prev.console, 45)  // Expand to 45% for test failures
        }));
      }

    } catch (error) {
      setConsoleOutput(prev => [...prev, `❌ Runtime Error: ${error}`]);
      setConsoleOutput(prev => [...prev, '🔧 Fix the error and try again']);

      // Auto-expand console for runtime errors
      setPanelSizes(prev => ({
        ...prev,
        console: Math.max(prev.console, 45)
      }));
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
    setShowConsole(false);  // Hide console on reset
  };

  const clearConsole = () => {
    setConsoleOutput([]);
    setTestResults([]);
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
              animate={{ width: showExplorer ? `${panelSizes.explorer}%` : '0%' }}
              exit={{ width: 0 }}
              className="bg-white border-r border-gray-200 flex flex-col min-w-0"
              style={{ flexShrink: 0 }}
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
          className="flex-1 flex flex-col min-w-0 overflow-hidden"
          style={{
            width: showExplorer && showProblem
              ? `${100 - panelSizes.explorer - panelSizes.problem}%`
              : showExplorer
                ? `${100 - panelSizes.explorer}%`
                : showProblem
                  ? `${100 - panelSizes.problem}%`
                  : '100%'
          }}
        >
          <CodeEditor
            filename={selectedFile}
            code={userCode[selectedFile] || ''}
            onChange={(code) => handleCodeChange(selectedFile, code)}
            language={selectedFile.endsWith('.tsx') || selectedFile.endsWith('.jsx') ? 'typescript' : 'javascript'}
            isConsoleOpen={showConsole}
          />
        </div>

        {/* Right Panel - Problem Details */}
        <AnimatePresence>
          {showProblem && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: showProblem ? `${panelSizes.problem}%` : '0%' }}
              exit={{ width: 0 }}
              className="bg-white border-l border-gray-200 flex flex-col min-w-0"
              style={{ flexShrink: 0 }}
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
            className="bg-white border-t border-gray-200 relative"
          >
            {/* Resize Handle */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gray-200 hover:bg-blue-400 cursor-row-resize transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startHeight = panelSizes.console;

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaY = startY - e.clientY;
                  const containerHeight = window.innerHeight;
                  const newHeight = Math.max(15, Math.min(60, startHeight + (deltaY / containerHeight) * 100));

                  setPanelSizes(prev => ({
                    ...prev,
                    console: newHeight
                  }));
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              title="Drag to resize console"
            />

            <ConsoleOutput
              activeTab={consoleTab}
              onTabChange={setConsoleTab}
              consoleOutput={consoleOutput}
              testResults={testResults}
              challenge={challenge}
              previewContent={previewContent}
              onClearConsole={clearConsole}
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
            className={`p-2 rounded transition-colors ${
              showConsole
                ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title={showConsole ? "Hide Console" : "Show Console"}
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
