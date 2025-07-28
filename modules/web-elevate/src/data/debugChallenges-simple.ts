export const debugChallenges = [
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
    testCriteria: [
      'Console should log the correct current value when typing',
      'State should update and display correctly in the UI',
      'No delay between typing and state update'
    ],
    learningObjectives: [
      'Understand asynchronous nature of useState',
      'Learn when state updates are applied',
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
    testCriteria: [
      'No React warnings in console',
      'List renders correctly',
      'Each item has unique key'
    ],
    learningObjectives: [
      'Understand importance of keys in React lists',
      'Learn how to choose appropriate keys',
      'Practice fixing React warnings'
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
    testCriteria: [
      'Button has blue background',
      'All styles apply correctly',
      'No CSS errors in dev tools'
    ],
    learningObjectives: [
      'Practice careful CSS syntax',
      'Learn to use dev tools for debugging',
      'Understand common CSS mistakes'
    ]
  }
];

export default debugChallenges;
