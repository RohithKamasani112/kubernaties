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
  }
];

export default debugChallenges;
