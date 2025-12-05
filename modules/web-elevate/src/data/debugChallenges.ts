// Import comprehensive debugging challenges
import { reactDebugChallenges } from './reactDebugChallenges';
import { angularDebugChallenges } from './angularDebugChallenges';
import { nodeDebugChallenges } from './nodeDebugChallenges';

// Combine all debugging challenges for the Web Elevate platform
export const debugChallenges = [
  // React Debugging Challenges (8+ scenarios)
  ...reactDebugChallenges,

  // Angular Debugging Challenges (3+ scenarios)
  ...angularDebugChallenges,

  // Node.js Debugging Challenges (3+ scenarios)
  ...nodeDebugChallenges,

  // Additional Web Development Challenges
  {
    id: 'react-state-delay',
    title: 'State Not Updating Immediately',
    description: "A React input component logs the wrong value to console. When typing, the console shows the previous value instead of the current one. This is a common React state management issue.",
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['React', 'useState', 'Asynchronous'],
    rootCause: 'useState updates are asynchronous and batched - state doesn\'t update immediately',
    category: 'State Management',
    files: {
      'App.jsx': `import React, { useState } from 'react';

// PROBLEM: This component has a state logging issue
function InputBox() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    // BUG: This logs the OLD value, not the new one!
    console.log('Current value:', value);
  };

  return (
    <div className="input-container">
      <h2>🐛 Debug Challenge: State Logging Issue</h2>
      <p>Type in the input below and check the console:</p>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something and watch the console..."
        className="debug-input"
      />

      <div className="display-section">
        <p><strong>UI shows:</strong> "{value}"</p>
        <p><strong>Console shows:</strong> Previous value (check DevTools)</p>
      </div>

      <div className="problem-explanation">
        <h3>🤔 What's Wrong?</h3>
        <p>The console.log shows the previous state value, not the current input value!</p>
      </div>
    </div>
  );
}

export default InputBox;`,
      'styles.css': `/* Styles for the debug challenge */
.input-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.debug-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #cbd5e0;
  border-radius: 8px;
  margin: 10px 0;
}

.display-section {
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.problem-explanation {
  background: #fed7d7;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #f56565;
}`
    },
    hints: [
      '🔍 useState updates are asynchronous - state doesn\'t change immediately',
      '⏰ The console.log runs BEFORE the state actually updates',
      '💡 Try logging e.target.value instead of the state variable',
      '🎯 Consider using useEffect to observe state changes after they happen'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

// FIXED: Multiple solutions to the state logging issue
function InputBox() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);

    // FIXED Solution 1: Log the input value directly
    console.log('Current value (from input):', e.target.value);
  };

  // FIXED Solution 2: Use useEffect to log state changes
  useEffect(() => {
    console.log('State updated to:', value);
  }, [value]);

  return (
    <div className="input-container">
      <h2>✅ Fixed: State Logging Issue</h2>
      <p>Now the console shows the correct values!</p>

      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something and watch the console..."
        className="debug-input"
      />

      <div className="display-section">
        <p><strong>UI shows:</strong> "{value}"</p>
        <p><strong>Console shows:</strong> Correct current value ✅</p>
      </div>

      <div className="solution-explanation">
        <h3>🎉 How It's Fixed:</h3>
        <ul>
          <li><strong>Method 1:</strong> Log <code>e.target.value</code> directly</li>
          <li><strong>Method 2:</strong> Use <code>useEffect</code> to observe state changes</li>
          <li><strong>Why:</strong> useState updates are asynchronous and batched</li>
        </ul>
      </div>
    </div>
  );
}

export default InputBox;`,
      'styles.css': `/* Enhanced styles for the fixed version */
.input-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 2px solid #48bb78;
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.debug-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #48bb78;
  border-radius: 8px;
  margin: 10px 0;
}

.display-section {
  background: #f0fff4;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.solution-explanation {
  background: #c6f6d5;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
}

.solution-explanation code {
  background: #2d3748;
  color: #68d391;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}`
    },
    testCases: [
      'Type in the input and verify console shows correct current value',
      'Check that UI updates immediately when typing',
      'Verify useEffect logs state changes after they occur',
      'Confirm no delay between typing and state update'
    ],
    debuggingSteps: [
      '1. Open browser DevTools console',
      '2. Type in the input field',
      '3. Notice console shows previous value (the bug)',
      '4. Compare console output with UI display',
      '5. Apply the fix by logging e.target.value instead',
      '6. Test the fix and verify console shows correct values'
    ],
    commonMistakes: [
      'Expecting useState to update synchronously',
      'Using stale state values in event handlers',
      'Not understanding React\'s batching behavior',
      'Forgetting that state updates are asynchronous'
    ],
    productionImpact: 'Can lead to incorrect calculations, race conditions, and confusing user experiences in real applications',
    preventionTips: [
      'Always use the event value directly when available',
      'Use useEffect to perform actions after state updates',
      'Understand React\'s batching and async nature',
      'Use functional state updates when new state depends on previous state'
    ],
    learningObjectives: [
      'Understand React state update timing',
      'Learn the difference between synchronous and asynchronous operations',
      'Master proper event handling in React',
      'Practice debugging state-related issues'
    ]
  },
  {
    id: 'missing-key-prop',
    title: 'Missing Key Prop Warning',
    description: 'React shows warning about missing key prop in list items.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 60,
    tags: ['React', 'Lists', 'Keys'],
    rootCause: 'Missing key prop in mapped list items',
    category: 'Performance',
    files: {
      'TodoList.jsx': `import React from 'react';

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li>{todo.text}</li>
      ))}
    </ul>
  );
}

export default TodoList;`
    },
    hints: [
      'Each list item needs a unique key prop',
      'Keys help React identify which items have changed',
      'Use a unique identifier from your data',
      'Avoid using array index as key when possible'
    ],
    solution: {
      'TodoList.jsx': `import React from 'react';

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

export default TodoList;`
    },
    testCases: [
      'No React warnings in console',
      'List renders correctly',
      'Each item has unique key'
    ],
    debuggingSteps: [
      'Open browser console to see React warnings',
      'Identify which list items are missing keys',
      'Add unique key prop to each list item',
      'Verify warnings are resolved'
    ],
    commonMistakes: [
      'Using array index as key for dynamic lists',
      'Using non-unique values as keys',
      'Not providing keys at all'
    ],
    productionImpact: 'Poor performance and incorrect UI updates when list items change',
    preventionTips: [
      'Always use unique, stable identifiers as keys',
      'Avoid using array index for dynamic lists',
      'Use proper ID generation for list items'
    ]
  },
  {
    id: 'css-typo',
    title: 'CSS Property Typo',
    description: 'Styles not applying due to typo in CSS property name.',
    techStack: 'CSS',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    xpReward: 40,
    tags: ['CSS', 'Styling', 'Typos'],
    rootCause: 'Typo in CSS property name',
    category: 'Styling',
    files: {
      'styles.css': `.button {
  backgrond-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}`
    },
    hints: [
      'Check spelling of CSS properties',
      'Use browser dev tools to see which styles are applied',
      'Look for red underlines in your editor',
      'Common typo: background vs backgrond'
    ],
    solution: {
      'styles.css': `.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}`
    },
    testCases: [
      'Button has blue background',
      'All styles apply correctly',
      'No CSS errors in dev tools'
    ],
    debuggingSteps: [
      'Open browser DevTools and check Elements tab',
      'Look for crossed-out CSS properties',
      'Check Console for CSS syntax errors',
      'Verify property names are spelled correctly'
    ],
    commonMistakes: [
      'Misspelling CSS property names',
      'Not using browser DevTools to debug styles',
      'Ignoring CSS validation warnings'
    ],
    productionImpact: 'Styles may not apply correctly, leading to broken UI appearance',
    preventionTips: [
      'Use CSS linting tools to catch typos',
      'Enable CSS validation in your editor',
      'Regularly check browser DevTools for style issues'
    ]
  }
];

// Export comprehensive debugging challenges count
export const totalDebugChallenges = debugChallenges.length;

// Export challenges by technology
export const debugChallengesByTech = {
  React: debugChallenges.filter(challenge => challenge.techStack === 'React'),
  Angular: debugChallenges.filter(challenge => challenge.techStack === 'Angular'),
  'Node.js': debugChallenges.filter(challenge => challenge.techStack === 'Node.js'),
  CSS: debugChallenges.filter(challenge => challenge.techStack === 'CSS')
};

// Export challenges by difficulty
export const debugChallengesByDifficulty = {
  beginner: debugChallenges.filter(challenge => challenge.difficulty === 'beginner'),
  intermediate: debugChallenges.filter(challenge => challenge.difficulty === 'intermediate'),
  advanced: debugChallenges.filter(challenge => challenge.difficulty === 'advanced')
};

export default debugChallenges;
