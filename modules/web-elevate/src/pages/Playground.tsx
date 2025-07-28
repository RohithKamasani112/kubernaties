import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Code,
  Terminal,
  Play,
  Settings,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  X,
  Save,
  RotateCcw,
  Eye,
  Globe,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import AIAdvisor from '../components/AIAdvisor';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

const Playground: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { currentPlaygroundSession, updatePlaygroundSession } = useWebElevateStore();

  const [files, setFiles] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        { name: 'index.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Web Elevate Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello, Web Elevate!</h1>\n  <script src="script.js"></script>\n</body>\n</html>' },
        { name: 'style.css', type: 'file', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n\nh1 {\n  text-align: center;\n  margin-top: 50px;\n}' },
        { name: 'script.js', type: 'file', content: 'console.log("Welcome to Web Elevate Playground!");\n\n// Your code here\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Developer"));' }
      ]
    },
    { name: 'package.json', type: 'file', content: '{\n  "name": "web-elevate-project",\n  "version": "1.0.0",\n  "description": "A Web Elevate playground project",\n  "main": "src/script.js",\n  "scripts": {\n    "start": "node src/script.js"\n  }\n}' },
    { name: 'README.md', type: 'file', content: '# Web Elevate Project\n\nWelcome to your Web Elevate playground!\n\n## Getting Started\n\n1. Edit the files in the `src` folder\n2. Click "Run" to see your changes\n3. Use the terminal for additional commands\n\nHappy coding! 🚀' }
  ]);

  const [activeFile, setActiveFile] = useState<string>('src/index.html');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to Web Elevate Playground Terminal!',
    'Type commands to interact with your project.',
    ''
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'tests'>('preview');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isAIAdvisorVisible, setIsAIAdvisorVisible] = useState<boolean>(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  const getFileContent = (path: string): string => {
    const pathParts = path.split('/');
    let current: FileNode[] = files;

    for (const part of pathParts) {
      const found = current.find(item => item.name === part);
      if (!found) return '';

      if (found.type === 'file') {
        return found.content || '';
      } else if (found.children) {
        current = found.children;
      }
    }
    return '';
  };

  const updateFileContent = (path: string, content: string) => {
    const updateFiles = (items: FileNode[], pathParts: string[]): FileNode[] => {
      return items.map(item => {
        if (item.name === pathParts[0]) {
          if (pathParts.length === 1 && item.type === 'file') {
            return { ...item, content };
          } else if (item.children && pathParts.length > 1) {
            return { ...item, children: updateFiles(item.children, pathParts.slice(1)) };
          }
        }
        return item;
      });
    };

    setFiles(updateFiles(files, path.split('/')));
  };

  const runCode = async () => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, '$ Running project...', '']);

    // Simulate code execution
    setTimeout(() => {
      const jsContent = getFileContent('src/script.js');
      const output = ['Project executed successfully!'];

      // Simple console.log extraction (for demo purposes)
      const consoleMatches = jsContent.match(/console\.log\([^)]+\)/g);
      if (consoleMatches) {
        consoleMatches.forEach(match => {
          const content = match.match(/console\.log\((.+)\)/)?.[1];
          if (content) {
            try {
              // Simple evaluation for demo (in real app, use sandboxed execution)
              const result = content.replace(/['"]/g, '').replace(/`([^`]+)`/, '$1');
              output.push(`> ${result}`);
            } catch (e) {
              output.push(`> ${content}`);
            }
          }
        });
      }

      setTerminalOutput(prev => [...prev, ...output, '']);
      setIsRunning(false);

      // Run tests
      runTests();
    }, 1000);
  };

  const runTests = () => {
    // Mock test results
    const mockTests = [
      { name: 'HTML structure is valid', passed: true, message: 'All HTML elements are properly structured' },
      { name: 'CSS styles are applied', passed: true, message: 'Styles are correctly linked and applied' },
      { name: 'JavaScript functions work', passed: true, message: 'All functions execute without errors' },
      { name: 'Console output is correct', passed: Math.random() > 0.3, message: 'Expected output matches actual output' }
    ];

    setTestResults(mockTests);
  };

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`]);

    switch (command.toLowerCase().trim()) {
      case 'clear':
        setTerminalOutput(['']);
        break;
      case 'ls':
        setTerminalOutput(prev => [...prev, 'src/', 'package.json', 'README.md', '']);
        break;
      case 'help':
        setTerminalOutput(prev => [...prev,
          'Available commands:',
          '  clear - Clear terminal',
          '  ls - List files',
          '  run - Execute project',
          '  test - Run tests',
          '  help - Show this help',
          ''
        ]);
        break;
      case 'run':
        runCode();
        return;
      case 'test':
        runTests();
        setTerminalOutput(prev => [...prev, 'Running tests...', '']);
        break;
      default:
        setTerminalOutput(prev => [...prev, `Command not found: ${command}`, '']);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {sessionId && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Session: {sessionId}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsAIAdvisorVisible(!isAIAdvisorVisible)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isAIAdvisorVisible
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>AI Advisor</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* File Tree */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Files</h3>
              <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <FileTree
              files={files}
              activeFile={activeFile}
              onFileSelect={setActiveFile}
              onToggleFolder={(path) => {
                // Toggle folder open/closed state
                const toggleFolder = (items: FileNode[], pathParts: string[]): FileNode[] => {
                  return items.map(item => {
                    if (item.name === pathParts[0]) {
                      if (pathParts.length === 1 && item.type === 'folder') {
                        return { ...item, isOpen: !item.isOpen };
                      } else if (item.children && pathParts.length > 1) {
                        return { ...item, children: toggleFolder(item.children, pathParts.slice(1)) };
                      }
                    }
                    return item;
                  });
                };
                setFiles(toggleFolder(files, path.split('/')));
              }}
            />
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">{activeFile}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Monaco Editor</span>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageFromFile(activeFile)}
                theme="vs-dark"
                value={getFileContent(activeFile)}
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

          {/* Terminal/Output */}
          <div className="h-48 bg-black text-green-400 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium text-white">Terminal</span>
              </div>
              <button
                onClick={() => setTerminalOutput([''])}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4" ref={terminalRef}>
              <div className="font-mono text-sm space-y-1">
                {terminalOutput.map((line, index) => (
                  <div key={index} className={line.startsWith('$') ? 'text-yellow-400' : 'text-green-400'}>
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-yellow-400">$ </span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTerminalCommand(terminalInput);
                        setTerminalInput('');
                      }
                    }}
                    className="bg-transparent border-none outline-none text-green-400 flex-1 ml-1"
                    placeholder="Type a command..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview/Tests Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'console', label: 'Console', icon: Terminal },
              { id: 'tests', label: 'Tests', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
                    <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                      <Globe className="w-3 h-3" />
                      <span>Open in new tab</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-white">
                  <iframe
                    srcDoc={getFileContent('src/index.html')}
                    className="w-full h-full border-none"
                    title="Live Preview"
                  />
                </div>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Console Output</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="font-mono text-sm space-y-1">
                    {terminalOutput.filter(line => line.includes('>')).map((line, index) => (
                      <div key={index} className="text-gray-700">
                        {line}
                      </div>
                    ))}
                    {terminalOutput.filter(line => line.includes('>')).length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No console output yet</p>
                        <p className="text-xs">Run your code to see console.log output</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Test Results</h3>
                    <button
                      onClick={runTests}
                      className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Run Tests</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {testResults.length > 0 ? (
                    <div className="space-y-3">
                      {testResults.map((test, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          test.passed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {test.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                test.passed ? 'text-green-900' : 'text-red-900'
                              }`}>
                                {test.name}
                              </h4>
                              <p className={`text-xs mt-1 ${
                                test.passed ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {test.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tests run yet</p>
                      <p className="text-xs">Click "Run Tests" to check your code</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Advisor */}
      <AIAdvisor
        code={getFileContent(activeFile)}
        language={getLanguageFromFile(activeFile)}
        filename={activeFile}
        isVisible={isAIAdvisorVisible}
        onToggle={() => setIsAIAdvisorVisible(!isAIAdvisorVisible)}
      />
    </div>
  );
};

// Helper function to get language from file extension
const getLanguageFromFile = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'plaintext';
  }
};

// File Tree Component
interface FileTreeProps {
  files: FileNode[];
  activeFile: string;
  onFileSelect: (path: string) => void;
  onToggleFolder: (path: string) => void;
  level?: number;
  parentPath?: string;
}

const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFile,
  onFileSelect,
  onToggleFolder,
  level = 0,
  parentPath = ''
}) => {
  return (
    <div className="space-y-1">
      {files.map((file) => {
        const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
        const isActive = activeFile === fullPath;

        return (
          <div key={file.name}>
            <div
              className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ paddingLeft: `${8 + level * 16}px` }}
              onClick={() => {
                if (file.type === 'file') {
                  onFileSelect(fullPath);
                } else {
                  onToggleFolder(fullPath);
                }
              }}
            >
              {file.type === 'folder' ? (
                file.isOpen ? (
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-500" />
                )
              ) : (
                <FileText className="w-4 h-4 text-gray-500" />
              )}
              <span className="flex-1 truncate">{file.name}</span>
            </div>

            {file.type === 'folder' && file.isOpen && file.children && (
              <FileTree
                files={file.children}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                onToggleFolder={onToggleFolder}
                level={level + 1}
                parentPath={fullPath}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Playground;
