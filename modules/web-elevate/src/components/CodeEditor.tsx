import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Copy,
  Download,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  X,
  Plus,
  Code,
  FileText,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Wand2
} from 'lucide-react';
import './CodeEditor.css';

interface CodeEditorProps {
  filename: string;
  code: string;
  onChange: (code: string) => void;
  language?: string;
  readOnly?: boolean;
  highlightedLines?: number[];
  showErrors?: boolean;
  errors?: Array<{line: number, message: string}>;
  isConsoleOpen?: boolean;
}

interface Tab {
  filename: string;
  modified: boolean;
}



const CodeEditor: React.FC<CodeEditorProps> = ({
  filename,
  code,
  onChange,
  language = 'javascript',
  readOnly = false,
  highlightedLines = [],
  showErrors = true,
  errors = [],
  isConsoleOpen = false
}) => {
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([{ filename, modified: false }]);
  const [activeTab, setActiveTab] = useState(filename);
  const [syntaxErrors, setSyntaxErrors] = useState<Array<{line: number, message: string}>>([]);
  const [originalCode, setOriginalCode] = useState(code);
  const [showErrorBanner, setShowErrorBanner] = useState(false); // Start closed for cleaner UI
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Store original code for reset functionality
  useEffect(() => {
    if (!originalCode) {
      setOriginalCode(code);
    }
  }, [code, originalCode]);

  // Auto-collapse error banner when console is open
  useEffect(() => {
    if (isConsoleOpen && syntaxErrors.length > 0) {
      setShowErrorBanner(false);
    } else if (!isConsoleOpen) {
      setShowErrorBanner(true);
    }
  }, [isConsoleOpen, syntaxErrors.length]);

  // Format code function
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  // Reset code function
  const resetCode = () => {
    onChange(originalCode);
  };

  // Fix brackets function
  const fixBrackets = () => {
    let fixedCode = code;

    // Simple bracket fixing logic
    const lines = code.split('\n');
    let openBraces = 0;
    let openParens = 0;
    let openBrackets = 0;

    lines.forEach(line => {
      openBraces += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      openParens += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      openBrackets += (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length;
    });

    // Add missing closing brackets
    if (openBraces > 0) fixedCode += '\n' + '}'.repeat(openBraces);
    if (openParens > 0) fixedCode += ')'.repeat(openParens);
    if (openBrackets > 0) fixedCode += ']'.repeat(openBrackets);

    onChange(fixedCode);
  };

  // Get fix suggestion for an error
  const getFixSuggestion = (error: {line: number, message: string}) => {
    const line = code.split('\n')[error.line - 1] || '';

    if (error.message.includes('Missing closing brace')) {
      return {
        suggestion: 'Add closing brace }',
        fix: () => {
          const lines = code.split('\n');
          lines[error.line - 1] = lines[error.line - 1] + '}';
          onChange(lines.join('\n'));
        }
      };
    }

    if (error.message.includes('Missing closing parenthesis')) {
      return {
        suggestion: 'Add closing parenthesis )',
        fix: () => {
          const lines = code.split('\n');
          lines[error.line - 1] = lines[error.line - 1] + ')';
          onChange(lines.join('\n'));
        }
      };
    }

    if (error.message.includes('Missing closing bracket')) {
      return {
        suggestion: 'Add closing bracket ]',
        fix: () => {
          const lines = code.split('\n');
          lines[error.line - 1] = lines[error.line - 1] + ']';
          onChange(lines.join('\n'));
        }
      };
    }

    return null;
  };

  // Monaco editor error detection
  useEffect(() => {
    const detectErrors = () => {
      const newErrors: Array<{line: number, message: string}> = [];
      const lines = code.split('\n');

      lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Check for unmatched brackets
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        const openBrackets = (line.match(/\[/g) || []).length;
        const closeBrackets = (line.match(/\]/g) || []).length;

        if (openBraces > closeBraces) {
          newErrors.push({ line: lineNumber, message: 'Missing closing brace }' });
        }
        if (openParens > closeParens) {
          newErrors.push({ line: lineNumber, message: 'Missing closing parenthesis )' });
        }
        if (openBrackets > closeBrackets) {
          newErrors.push({ line: lineNumber, message: 'Missing closing bracket ]' });
        }
      });

      const allErrors = [...newErrors, ...errors];
      setSyntaxErrors(allErrors);

      // Keep Monaco markers disabled to prevent red bars
      if (editorRef.current) {
        const monaco = (window as any).monaco;
        if (monaco) {
          // Always clear markers to prevent red bars
          monaco.editor.setModelMarkers(editorRef.current.getModel(), 'syntax-errors', []);
        }
      }
    };

    const timeoutId = setTimeout(detectErrors, 500);
    return () => clearTimeout(timeoutId);
  }, [code, language, errors]);



  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jsx':
      case 'tsx':
      case 'js':
      case 'ts':
        return <Code className="w-3 h-3 text-blue-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileText className="w-3 h-3 text-pink-500" />;
      case 'html':
        return <FileText className="w-3 h-3 text-orange-500" />;
      case 'json':
        return <FileText className="w-3 h-3 text-yellow-500" />;
      default:
        return <FileText className="w-3 h-3 text-gray-500" />;
    }
  };



  return (
    <div className={`flex flex-col h-full bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Tab Bar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <motion.div
              key={tab.filename}
              className={`flex items-center space-x-2 px-3 py-1 rounded-t-lg cursor-pointer transition-colors ${
                activeTab === tab.filename
                  ? 'bg-white border-t border-l border-r border-gray-200 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.filename)}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.1 }}
            >
              {getFileIcon(tab.filename)}
              <span className="text-sm">{tab.filename}</span>
              {tab.modified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle tab close
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
          
          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={formatCode}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="Format Document (Ctrl+Shift+F)"
          >
            <Wand2 className="w-4 h-4" />
          </button>

          <button
            onClick={fixBrackets}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Fix Brackets"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            onClick={resetCode}
            className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded transition-colors"
            title="Reset to Original"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300"></div>

          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Monaco Editor */}
        <div className="flex-1 relative monaco-editor-container">
          <Editor
            height="100%"
            language={language === 'typescript' ? 'typescript' : language}
            value={code}
            onChange={(value) => onChange(value || '')}
            onMount={(editor) => {
              editorRef.current = editor;

              // Track cursor position
              editor.onDidChangeCursorPosition((e) => {
                setCursorPosition({
                  line: e.position.lineNumber,
                  column: e.position.column
                });
              });

              // AGGRESSIVELY disable ALL Monaco error highlighting
              const monaco = (window as any).monaco;
              if (monaco) {
                // Clear ALL possible markers
                monaco.editor.setModelMarkers(editor.getModel(), 'syntax-errors', []);
                monaco.editor.setModelMarkers(editor.getModel(), 'typescript', []);
                monaco.editor.setModelMarkers(editor.getModel(), 'javascript', []);
                monaco.editor.setModelMarkers(editor.getModel(), 'json', []);

                // Disable ALL validation
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: true,
                  noSuggestionDiagnostics: true
                });

                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSyntaxValidation: true,
                  noSuggestionDiagnostics: true
                });

                // Disable JSON validation
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                  validate: false,
                  allowComments: true,
                  schemas: []
                });

                // Remove all decorations
                editor.deltaDecorations(editor.getModel().getAllDecorations().map(d => d.id), []);

                // Periodically clean up any decorations that might appear
                const cleanupInterval = setInterval(() => {
                  try {
                    const decorations = editor.getModel()?.getAllDecorations() || [];
                    if (decorations.length > 0) {
                      editor.deltaDecorations(decorations.map(d => d.id), []);
                    }
                    // Clear any markers that might have been added
                    monaco.editor.setModelMarkers(editor.getModel(), 'typescript', []);
                    monaco.editor.setModelMarkers(editor.getModel(), 'javascript', []);
                  } catch (e) {
                    // Ignore errors
                  }
                }, 1000);

                // NUCLEAR OPTION: MutationObserver to remove red backgrounds
                const editorElement = editor.getDomNode();
                if (editorElement) {
                  const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                      if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Find and remove any elements with red backgrounds
                        const redElements = editorElement.querySelectorAll(
                          '[style*="background-color: rgb(255"], [style*="background: rgb(255"], [class*="squiggly-error"], [class*="error-decoration"]'
                        );
                        redElements.forEach((el: any) => {
                          el.style.background = 'none';
                          el.style.backgroundColor = 'transparent';
                          if (el.classList.contains('squiggly-error')) {
                            el.style.display = 'none';
                          }
                        });
                      }
                    });
                  });

                  observer.observe(editorElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                  });

                  // Clean up observer when editor is unmounted
                  editor.onDidDispose(() => {
                    clearInterval(cleanupInterval);
                    observer.disconnect();
                  });
                } else {
                  // Clean up interval when editor is unmounted
                  editor.onDidDispose(() => {
                    clearInterval(cleanupInterval);
                  });
                }
              }
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontWeight: '400',
              lineNumbers: 'on',
              lineNumbersMinChars: 3,
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontLigatures: true,
              renderLineHighlight: 'gutter', // Only highlight in gutter, not full line
              cursorBlinking: 'blink',
              cursorStyle: 'line',
              cursorWidth: 2,
              readOnly: readOnly,
              formatOnPaste: true,
              formatOnType: true,
              autoIndent: 'full',
              bracketPairColorization: { enabled: true },
              matchBrackets: 'always',
              showFoldingControls: 'always',
              foldingStrategy: 'indentation',
              smoothScrolling: true,
              mouseWheelZoom: true,
              contextmenu: true,
              quickSuggestions: {
                other: true,
                comments: false,
                strings: false
              },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              snippetSuggestions: 'top',
              wordBasedSuggestions: true,
              parameterHints: { enabled: true },
              hover: { enabled: true },
              colorDecorators: true,
              codeLens: false,
              folding: true,
              foldingHighlight: true,
              unfoldOnClickAfterEndOfLine: true,
              showUnused: true,
              occurrencesHighlight: true,
              selectionHighlight: true,
              renderWhitespace: 'selection',
              renderControlCharacters: false,
              lineHeight: 22,
              letterSpacing: 0.5,
              guides: {
                bracketPairs: true,
                bracketPairsHorizontal: true,
                highlightActiveBracketPair: true,
                indentation: true,
                highlightActiveIndentation: true
              },
              // Consistent theme colors
              theme: 'vs-dark',
              semanticHighlighting: { enabled: true },
              // AGGRESSIVELY prevent ALL error visual elements
              glyphMargin: false, // Disable glyph margin to prevent error icons
              lineDecorationsWidth: 0, // No space for line decorations
              renderValidationDecorations: 'off', // Completely disable validation decorations
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              overviewRulerLanes: 0, // Disable overview ruler to prevent red bars
              rulers: [], // No rulers
              renderIndentGuides: false, // No indent guides
              highlightActiveIndentGuide: false, // No active indent highlighting
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
              }
            }}
          />
          
          {/* Error Indicators - REMOVED: Red bars are too distracting */}

          {/* Highlighted Lines Overlay */}
          {highlightedLines.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {highlightedLines.map((lineNum) => (
                <div
                  key={lineNum}
                  className="absolute left-0 right-0 bg-yellow-100 border-l-2 border-yellow-400"
                  style={{
                    top: `${(lineNum - 1) * 24 + 16}px`,
                    height: '24px'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span className="font-medium">{filename}</span>
          <span>Length {code.length}</span>
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          {syntaxErrors.length === 0 && code.length > 10 && (
            <span className="text-green-600 text-xs flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>No errors</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {syntaxErrors.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowErrorBanner(!showErrorBanner)}
                className="flex items-center space-x-1 px-2 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded transition-colors"
                title="Click to view error details and get help fixing them"
              >
                <AlertCircle className="w-3 h-3" />
                <span className="text-xs">{syntaxErrors.length} issue{syntaxErrors.length !== 1 ? 's' : ''}</span>
              </button>
            </div>
          )}
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>
      </div>

      {/* Error Details Modal/Tooltip */}
      {syntaxErrors.length > 0 && showErrorBanner && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-8 right-4 bg-white border-2 border-red-300 rounded-lg shadow-xl max-w-lg z-50"
        >
          <div className="px-4 py-3 border-b border-red-200 bg-gradient-to-r from-red-50 to-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <span className="text-sm font-semibold text-red-800">
                    {syntaxErrors.length} error{syntaxErrors.length !== 1 ? 's' : ''} found
                  </span>
                  <p className="text-xs text-red-600 mt-1">Don't worry! These are easy to fix 🛠️</p>
                </div>
              </div>
              <button
                onClick={() => setShowErrorBanner(false)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-200 rounded transition-colors"
                title="Close error details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto space-y-3">
            {syntaxErrors.map((error, index) => {
              const fixSuggestion = getFixSuggestion(error);
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-mono">
                          Line {error.line}
                        </span>
                        <span className="text-sm text-gray-700">{error.message}</span>
                      </div>
                      {fixSuggestion && (
                        <p className="text-xs text-gray-600 mb-2">
                          💡 <strong>Quick fix:</strong> {fixSuggestion.suggestion}
                        </p>
                      )}
                    </div>
                    {fixSuggestion && (
                      <button
                        onClick={() => {
                          fixSuggestion.fix();
                          setShowErrorBanner(false);
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors ml-3 font-medium"
                        title={`Click to ${fixSuggestion.suggestion.toLowerCase()}`}
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Auto Fix</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 <strong>Tip:</strong> Red squiggly lines in the editor show exactly where errors are
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-1 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Line {code.split('\n').length}</span>
          <span>Length {code.length}</span>
          <span className="capitalize">{language}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>LF</span>
          {readOnly && <span className="text-orange-600">Read Only</span>}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
