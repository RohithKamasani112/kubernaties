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
    description: "User changes input, but value does not reflect immediately in the console.",
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['React', 'useState', 'Asynchronous'],
    rootCause: 'Misunderstanding that useState updates are async',
    category: 'State Management',
    files: {
      'App.jsx': `import React, { useState } from 'react';

function InputBox() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    console.log('Current value:', value); // BUG: This logs the previous value!
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <p>You typed: {value}</p>
    </div>
  );
}

export default InputBox;`
    },
    hints: [
      'useState updates are asynchronous - the state does not update immediately',
      'The console.log runs before the state actually updates',
      'Try logging e.target.value instead of the state variable',
      'Consider using useEffect to log state changes'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function InputBox() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    // FIXED: Log the actual input value, not the state
    console.log('Current value:', e.target.value);
  };

  // ALTERNATIVE: Use useEffect to log state changes
  useEffect(() => {
    console.log('State updated to:', value);
  }, [value]);

  return (
    <div>
      <input 
        type="text" 
        value={value} 
        onChange={handleChange} 
        placeholder="Type something..."
      />
      <p>You typed: {value}</p>
    </div>
  );
}

export default InputBox;`
    },
    testCases: [
      'Console should log the correct current value when typing',
      'State should update and display correctly in the UI',
      'No delay between typing and state update'
    ],
    debuggingSteps: [
      'Check console output when typing in input',
      'Compare logged value with displayed value',
      'Use React DevTools to inspect state changes'
    ],
    commonMistakes: [
      'Expecting synchronous state updates',
      'Using stale state values in calculations',
      'Not understanding React batching behavior'
    ],
    productionImpact: 'Can lead to incorrect calculations and race conditions in real applications',
    preventionTips: [
      'Use functional updates when new state depends on previous state',
      'Use useEffect to perform side effects after state updates',
      'Log event values instead of state for immediate feedback'
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
