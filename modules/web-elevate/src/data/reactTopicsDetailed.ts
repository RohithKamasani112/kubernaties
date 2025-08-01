// Detailed React Learning Topics - Extracted from react-learning-info.txt
// This file contains the comprehensive topic data with explanations, code examples, and challenges

export interface DetailedLearningTopic {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'fundamentals' | 'intermediate' | 'advanced' | 'expert';
  
  // Rich content from the detailed file
  conceptExplanation: string;
  keyPoints: string[];
  codeExamples: {
    title: string;
    code: string;
    language: string;
    explanation?: string;
  }[];
  
  // Interactive challenges
  playgroundChallenge?: {
    objective: string;
    starterCode: string;
    solution: string;
    hints: string[];
    testCriteria: string[];
  };
  
  mainChallenge?: {
    objective: string;
    requirements: string[];
    starterCode: string;
    solution: string;
    testCases: {
      feature: string;
      description: string;
      passCriteria: string;
    }[];
  };
  
  prerequisites: string[];
  learningOutcomes: string[];
}

// Topic 1: What is React?
export const topic1WhatIsReact: DetailedLearningTopic = {
  id: 'what-is-react',
  title: 'What is React?',
  description: 'Understanding React\'s declarative approach and Virtual DOM',
  estimatedTime: '50 min',
  xpReward: 125,
  difficulty: 'beginner',
  category: 'fundamentals',
  
  conceptExplanation: `React is a free and open-source JavaScript library for building user interfaces (UIs). Maintained by Meta (formerly Facebook) and a vast developer community, React helps you build component-based UIs for web and mobile apps.

While commonly called a "framework," React is technically a library focused on the View (V) in MVC (Model-View-Controller) architecture. It can be extended with libraries for routing, state management, and more.`,

  keyPoints: [
    'Declarative Approach - You describe what the UI should look like for a given application state',
    'Virtual DOM (VDOM) - React creates a virtual representation of the DOM for efficient updates',
    'Component-Based Architecture - Build encapsulated components that manage their own state',
    'Learn Once, Write Anywhere - Use React for web, mobile (React Native), and desktop apps'
  ],

  codeExamples: [
    {
      title: 'Imperative vs Declarative Example',
      language: 'javascript',
      code: `// Imperative (Vanilla JS) - HOW to do it
const button = document.createElement('button');
button.textContent = 'Click me';
button.addEventListener('click', () => {
  const p = document.createElement('p');
  p.textContent = 'Hello, World!';
  document.body.appendChild(p);
});
document.body.appendChild(button);

// Declarative (React) - WHAT you want
function App() {
  const [showMessage, setShowMessage] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowMessage(true)}>
        Click me
      </button>
      {showMessage && <p>Hello, World!</p>}
    </div>
  );
}`,
      explanation: 'React lets you describe what the UI should look like, while vanilla JS requires you to manually manipulate the DOM.'
    }
  ],

  playgroundChallenge: {
    objective: 'Convert vanilla JavaScript DOM manipulation to React',
    starterCode: `// Convert this vanilla JS to React
// Original: document.getElementById('output').innerText = 'Hello!';

import React from 'react';

function App() {
  return (
    <div>
      <button>Click</button>
      <p id="output"></p>
    </div>
  );
}

export default App;`,
    solution: `import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  
  const handleClick = () => {
    setMessage('Hello!');
  };
  
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <p>{message}</p>
    </div>
  );
}

export default App;`,
    hints: [
      'Use useState hook to manage the message state',
      'Use onClick event handler instead of vanilla JS events',
      'Use JSX interpolation {} to display the message'
    ],
    testCriteria: [
      'Button click updates the message',
      'Uses React hooks instead of DOM manipulation',
      'No direct DOM access (getElementById, etc.)'
    ]
  },

  mainChallenge: {
    objective: 'Build a GreetingApp that demonstrates React\'s power',
    requirements: [
      'Display "Hello, welcome to React!" initially',
      'Add a button that changes greeting to "You clicked me!"',
      'Add a reset button to restore original greeting',
      'Use React state management'
    ],
    starterCode: `import React from 'react';

function GreetingApp() {
  return (
    <div>
      <h1>Greeting App</h1>
      {/* Your implementation here */}
    </div>
  );
}

export default GreetingApp;`,
    solution: `import React, { useState } from 'react';

function GreetingApp() {
  const [greeting, setGreeting] = useState('Hello, welcome to React!');
  
  const handleClick = () => {
    setGreeting('You clicked me!');
  };
  
  const handleReset = () => {
    setGreeting('Hello, welcome to React!');
  };
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Greeting App</h1>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>{greeting}</p>
      <button 
        onClick={handleClick}
        style={{ margin: '0 10px', padding: '10px 20px' }}
      >
        Click Me
      </button>
      <button 
        onClick={handleReset}
        style={{ margin: '0 10px', padding: '10px 20px' }}
      >
        Reset
      </button>
    </div>
  );
}

export default GreetingApp;`,
    testCases: [
      {
        feature: 'Initial State',
        description: 'Shows welcome message on load',
        passCriteria: 'Displays "Hello, welcome to React!" initially'
      },
      {
        feature: 'Click Interaction',
        description: 'Button changes the greeting',
        passCriteria: 'Clicking button shows "You clicked me!"'
      },
      {
        feature: 'Reset Functionality',
        description: 'Reset button restores original greeting',
        passCriteria: 'Reset button works and shows original message'
      }
    ]
  },

  prerequisites: [],
  learningOutcomes: [
    'Understand React\'s declarative approach',
    'Know the difference between imperative and declarative programming',
    'Recognize React\'s component-based architecture',
    'Understand the Virtual DOM concept'
  ]
};

// Topic 2: JSX - JavaScript + HTML Syntax
export const topic2JSXSyntax: DetailedLearningTopic = {
  id: 'jsx-syntax',
  title: 'JSX - JavaScript + HTML Syntax',
  description: 'Master JSX syntax and learn to embed HTML in JavaScript',
  estimatedTime: '55 min',
  xpReward: 140,
  difficulty: 'beginner',
  category: 'fundamentals',
  
  conceptExplanation: `JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML inside JavaScript. React components use JSX to describe UI in a declarative way.

JSX is not valid JavaScript, but it's compiled to React.createElement(...) calls by Babel.`,

  keyPoints: [
    'JSX looks like HTML but is actually JavaScript',
    'Must return a single parent element (or use React.Fragment)',
    'Use className instead of class (JavaScript reserved word)',
    'JavaScript expressions go inside curly braces {}',
    'Self-closing tags must end with /> (like <img />)'
  ],

  codeExamples: [
    {
      title: 'Basic JSX Example',
      language: 'jsx',
      code: `import React from 'react';

const Greeting = () => {
  const name = "React Learner";
  const today = new Date().toDateString();

  return (
    <div className="greeting-box">
      <h1>Hello, {name}!</h1>
      <p>Today is {today}</p>
    </div>
  );
};

export default Greeting;`,
      explanation: 'JSX allows you to embed JavaScript expressions using curly braces and write HTML-like syntax.'
    }
  ],

  prerequisites: ['what-is-react'],
  learningOutcomes: [
    'Write valid JSX syntax',
    'Embed JavaScript expressions in JSX',
    'Understand JSX compilation process',
    'Use proper JSX attributes and naming conventions'
  ]
};

// Export all detailed topics (will be expanded)
export const detailedReactTopics: DetailedLearningTopic[] = [
  topic1WhatIsReact,
  topic2JSXSyntax
  // More topics will be added...
];
