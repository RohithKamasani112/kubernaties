export interface TestResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  message: string;
  score: number;
  category: 'functionality' | 'implementation' | 'best-practice' | 'performance';
}

export interface TestSuite {
  projectId: string;
  tests: DebugTest[];
  runAllTests: (files: { [key: string]: string }) => TestResult[];
  getScore: (results: TestResult[]) => number;
}

export interface DebugTest {
  id: string;
  name: string;
  description: string;
  category: 'functionality' | 'implementation' | 'best-practice' | 'performance';
  weight: number;
  testFunction: (files: { [key: string]: string }) => { passed: boolean; message: string; score: number };
}

// Test utilities
export class TestFramework {
  static checkCodeContains(code: string, patterns: string[]): boolean {
    return patterns.every(pattern => code.includes(pattern));
  }

  static checkCodePattern(code: string, regex: RegExp): boolean {
    return regex.test(code);
  }

  static checkFunctionExists(code: string, functionName: string): boolean {
    const functionRegex = new RegExp(`function\\s+${functionName}|const\\s+${functionName}\\s*=|let\\s+${functionName}\\s*=|var\\s+${functionName}\\s*=`, 'g');
    return functionRegex.test(code);
  }

  static checkEventListener(code: string, event: string, element?: string): boolean {
    const patterns = [
      `addEventListener('${event}'`,
      `addEventListener("${event}"`,
      `on${event}=`
    ];
    
    if (element) {
      patterns.push(`${element}.addEventListener('${event}'`);
      patterns.push(`${element}.addEventListener("${event}"`);
    }
    
    return patterns.some(pattern => code.includes(pattern));
  }

  static checkLocalStorageUsage(code: string): { save: boolean; load: boolean } {
    const hasSave = code.includes('localStorage.setItem') && code.includes('JSON.stringify');
    const hasLoad = code.includes('localStorage.getItem') && code.includes('JSON.parse');
    return { save: hasSave, load: hasLoad };
  }

  static checkFormValidation(code: string): { preventDefault: boolean; validation: boolean } {
    const hasPreventDefault = code.includes('preventDefault()');
    const hasValidation = code.includes('validateEmail') || code.includes('validatePassword') || 
                         code.includes('value.trim()') || code.includes('value === ""');
    return { preventDefault: hasPreventDefault, validation: hasValidation };
  }

  static checkCSSClassToggle(code: string, className: string): boolean {
    const patterns = [
      `classList.toggle('${className}')`,
      `classList.toggle("${className}")`,
      `classList.add('${className}')`,
      `classList.add("${className}")`,
      `classList.remove('${className}')`,
      `classList.remove("${className}")`
    ];
    return patterns.some(pattern => code.includes(pattern));
  }
}

// Test suites for different projects
export const testSuites: { [key: string]: TestSuite } = {
  'todo-localstorage': {
    projectId: 'todo-localstorage',
    tests: [
      {
        id: 'localStorage-save',
        name: 'Tasks are saved to localStorage',
        description: 'Check if tasks are being saved to localStorage when added or deleted',
        category: 'functionality',
        weight: 40,
        testFunction: (files) => {
          const jsCode = files['app.js'] || '';
          const storage = TestFramework.checkLocalStorageUsage(jsCode);
          
          if (storage.save) {
            return {
              passed: true,
              message: '✅ Tasks are being saved to localStorage correctly',
              score: 40
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing localStorage.setItem() or JSON.stringify() calls',
              score: 0
            };
          }
        }
      },
      {
        id: 'localStorage-load',
        name: 'Tasks are loaded from localStorage',
        description: 'Check if tasks are being loaded from localStorage on page load',
        category: 'functionality',
        weight: 40,
        testFunction: (files) => {
          const jsCode = files['app.js'] || '';
          const storage = TestFramework.checkLocalStorageUsage(jsCode);
          
          if (storage.load) {
            return {
              passed: true,
              message: '✅ Tasks are being loaded from localStorage correctly',
              score: 40
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing localStorage.getItem() or JSON.parse() calls',
              score: 0
            };
          }
        }
      },
      {
        id: 'error-handling',
        name: 'Error handling for localStorage',
        description: 'Check if there is proper error handling for localStorage operations',
        category: 'best-practice',
        weight: 20,
        testFunction: (files) => {
          const jsCode = files['app.js'] || '';
          const hasErrorHandling = jsCode.includes('try') && jsCode.includes('catch') ||
                                  jsCode.includes('if (savedTasks)') ||
                                  jsCode.includes('if (localStorage.getItem');
          
          if (hasErrorHandling) {
            return {
              passed: true,
              message: '✅ Good error handling for localStorage operations',
              score: 20
            };
          } else {
            return {
              passed: false,
              message: '⚠️ Consider adding error handling for localStorage operations',
              score: 10
            };
          }
        }
      }
    ],
    runAllTests: function(files) {
      return this.tests.map(test => {
        const result = test.testFunction(files);
        return {
          id: test.id,
          name: test.name,
          description: test.description,
          passed: result.passed,
          message: result.message,
          score: result.score,
          category: test.category
        };
      });
    },
    getScore: function(results) {
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const maxScore = this.tests.reduce((sum, test) => sum + test.weight, 0);
      return Math.round((totalScore / maxScore) * 100);
    }
  },

  'login-validation': {
    projectId: 'login-validation',
    tests: [
      {
        id: 'form-prevention',
        name: 'Form submission is prevented',
        description: 'Check if preventDefault() is called to stop default form submission',
        category: 'functionality',
        weight: 30,
        testFunction: (files) => {
          const jsCode = files['login.js'] || '';
          const validation = TestFramework.checkFormValidation(jsCode);
          
          if (validation.preventDefault) {
            return {
              passed: true,
              message: '✅ Form submission is properly prevented',
              score: 30
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing e.preventDefault() to stop form submission',
              score: 0
            };
          }
        }
      },
      {
        id: 'input-validation',
        name: 'Input validation is implemented',
        description: 'Check if email and password fields are validated',
        category: 'functionality',
        weight: 40,
        testFunction: (files) => {
          const jsCode = files['login.js'] || '';
          const validation = TestFramework.checkFormValidation(jsCode);
          
          if (validation.validation) {
            return {
              passed: true,
              message: '✅ Input validation is properly implemented',
              score: 40
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing input validation for email and password',
              score: 0
            };
          }
        }
      },
      {
        id: 'error-display',
        name: 'Error messages are displayed',
        description: 'Check if error messages are shown to users',
        category: 'functionality',
        weight: 30,
        testFunction: (files) => {
          const jsCode = files['login.js'] || '';
          const hasErrorDisplay = TestFramework.checkCodeContains(jsCode, [
            'textContent',
            'innerHTML'
          ]) && (jsCode.includes('Error') || jsCode.includes('error'));
          
          if (hasErrorDisplay) {
            return {
              passed: true,
              message: '✅ Error messages are properly displayed',
              score: 30
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing error message display functionality',
              score: 0
            };
          }
        }
      }
    ],
    runAllTests: function(files) {
      return this.tests.map(test => {
        const result = test.testFunction(files);
        return {
          id: test.id,
          name: test.name,
          description: test.description,
          passed: result.passed,
          message: result.message,
          score: result.score,
          category: test.category
        };
      });
    },
    getScore: function(results) {
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const maxScore = this.tests.reduce((sum, test) => sum + test.weight, 0);
      return Math.round((totalScore / maxScore) * 100);
    }
  },

  'dark-mode-toggle': {
    projectId: 'dark-mode-toggle',
    tests: [
      {
        id: 'class-toggle',
        name: 'Dark class is toggled',
        description: 'Check if the dark class is being toggled on the body element',
        category: 'functionality',
        weight: 50,
        testFunction: (files) => {
          const jsCode = files['darkmode.js'] || '';
          const hasClassToggle = TestFramework.checkCSSClassToggle(jsCode, 'dark');
          
          if (hasClassToggle) {
            return {
              passed: true,
              message: '✅ Dark class toggle is properly implemented',
              score: 50
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing classList.toggle() or add/remove methods for dark class',
              score: 0
            };
          }
        }
      },
      {
        id: 'button-text-update',
        name: 'Button text updates',
        description: 'Check if button text changes based on current theme',
        category: 'functionality',
        weight: 30,
        testFunction: (files) => {
          const jsCode = files['darkmode.js'] || '';
          const hasTextUpdate = TestFramework.checkCodeContains(jsCode, [
            'textContent',
            'Light Mode',
            'Dark Mode'
          ]);
          
          if (hasTextUpdate) {
            return {
              passed: true,
              message: '✅ Button text updates correctly',
              score: 30
            };
          } else {
            return {
              passed: false,
              message: '❌ Button text is not being updated',
              score: 0
            };
          }
        }
      },
      {
        id: 'event-listener',
        name: 'Click event listener is attached',
        description: 'Check if click event listener is properly attached',
        category: 'implementation',
        weight: 20,
        testFunction: (files) => {
          const jsCode = files['darkmode.js'] || '';
          const hasEventListener = TestFramework.checkEventListener(jsCode, 'click');
          
          if (hasEventListener) {
            return {
              passed: true,
              message: '✅ Click event listener is properly attached',
              score: 20
            };
          } else {
            return {
              passed: false,
              message: '❌ Missing click event listener',
              score: 10
            };
          }
        }
      }
    ],
    runAllTests: function(files) {
      return this.tests.map(test => {
        const result = test.testFunction(files);
        return {
          id: test.id,
          name: test.name,
          description: test.description,
          passed: result.passed,
          message: result.message,
          score: result.score,
          category: test.category
        };
      });
    },
    getScore: function(results) {
      const totalScore = results.reduce((sum, result) => sum + result.score, 0);
      const maxScore = this.tests.reduce((sum, test) => sum + test.weight, 0);
      return Math.round((totalScore / maxScore) * 100);
    }
  }
};

// Main test runner
export class DebugTestRunner {
  static runTests(projectId: string, files: { [key: string]: string }): TestResult[] {
    const testSuite = testSuites[projectId];
    if (!testSuite) {
      return [];
    }
    
    return testSuite.runAllTests(files);
  }

  static getProjectScore(projectId: string, results: TestResult[]): number {
    const testSuite = testSuites[projectId];
    if (!testSuite) {
      return 0;
    }
    
    return testSuite.getScore(results);
  }

  static getAllTestSuites(): string[] {
    return Object.keys(testSuites);
  }

  static getTestSuite(projectId: string): TestSuite | null {
    return testSuites[projectId] || null;
  }
}
