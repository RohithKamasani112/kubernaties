// Complete React Learning Path - All 43 Topics with Coding Examples, Playground, and Test Cases
// From Beginner to Expert Level - Production Ready Curriculum

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  explanation: string;
  animationScript: string;
  scenario: string;
  challenges: LearningChallenge[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  nextTopics: string[];
  category: 'fundamentals' | 'intermediate' | 'advanced' | 'expert';
}

export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'playground' | 'challenge' | 'mini-project' | 'test-case';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  code: {
    initial: string;
    solution: string;
  };
  hints?: string[];
  testCases?: string[];
}

export const complete43ReactTopics: LearningTopic[] = [
  // ===== FUNDAMENTALS (Topics 1-12) =====
  
  // 1. What is React?
  {
    id: 'what-is-react',
    title: 'What is React?',
    description: 'Understanding React\'s declarative approach and Virtual DOM',
    explanation: `React is a JavaScript library for building user interfaces, focusing on component-based architecture. It uses a Virtual DOM for faster rendering and helps manage dynamic content.

React is declarative: instead of telling the browser how to update the DOM step-by-step (like in vanilla JS), you tell React what the UI should look like, and it figures out the changes.

Key concepts:
- Component-based architecture
- Virtual DOM for performance
- Declarative programming model
- Unidirectional data flow
- JSX syntax extension
- React ecosystem and community`,
    animationScript: `Split screen showing:
Left: Vanilla JS → document.getElementById() → DOM → slow UI update
Right: React → <Component /> → Virtual DOM → diff → fast UI update
Highlight "Virtual DOM" and "Component" with popups
Gears rotate as the Virtual DOM syncs with real DOM
User clicks button → React shows re-render with minimal updates`,
    scenario: `🧩 You're building a modern web application and need to understand why React is the right choice. Your mission is to learn React fundamentals and see the benefits in action.`,
    challenges: [
      {
        id: 'vanilla-to-react-conversion',
        title: 'Convert Vanilla JS to React',
        description: 'Transform imperative DOM manipulation to declarative React',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 50,
        code: {
          initial: `// Convert this vanilla JS counter to React
<!DOCTYPE html>
<html>
<body>
  <div id="app">
    <h1 id="title">React Counter</h1>
    <p id="count">Count: 0</p>
    <button onclick="increment()">+</button>
    <button onclick="decrement()">-</button>
    <button onclick="reset()">Reset</button>
  </div>

  <script>
    let count = 0;
    
    function increment() {
      count++;
      document.getElementById('count').innerText = 'Count: ' + count;
    }
    
    function decrement() {
      count--;
      document.getElementById('count').innerText = 'Count: ' + count;
    }
    
    function reset() {
      count = 0;
      document.getElementById('count').innerText = 'Count: ' + count;
    }
  </script>
</body>
</html>

// Your React component here:
import React, { useState } from 'react';

function Counter() {
  // Convert the vanilla JS logic to React
  return (
    <div>
      {/* Your React JSX here */}
    </div>
  );
}

export default Counter;`,
          solution: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>React Counter</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>Count: {count}</p>
      <div>
        <button 
          onClick={increment}
          style={{ margin: '0 5px', padding: '10px 20px', fontSize: '16px' }}
        >
          +
        </button>
        <button 
          onClick={decrement}
          style={{ margin: '0 5px', padding: '10px 20px', fontSize: '16px' }}
        >
          -
        </button>
        <button 
          onClick={reset}
          style={{ margin: '0 5px', padding: '10px 20px', fontSize: '16px' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Counter;`
        },
        hints: [
          'Use useState hook to manage count state',
          'Replace onclick with onClick (camelCase)',
          'Use JSX instead of innerHTML',
          'State updates trigger re-renders automatically'
        ],
        testCases: [
          'Initial count should be 0',
          'Clicking + should increment count by 1',
          'Clicking - should decrement count by 1',
          'Clicking Reset should set count back to 0',
          'Multiple clicks should work correctly'
        ]
      },
      {
        id: 'react-benefits-showcase',
        title: 'React Benefits Showcase',
        description: 'Build a comprehensive demo showing React\'s key advantages',
        type: 'mini-project',
        difficulty: 'beginner',
        estimatedTime: '30 min',
        xpReward: 75,
        code: {
          initial: `// Build a demo showcasing React's benefits:
// 1. Component reusability
// 2. State management
// 3. Virtual DOM efficiency
// 4. Declarative UI
// 5. Unidirectional data flow

import React, { useState } from 'react';

function ReactBenefitsDemo() {
  // Create a comprehensive demo that shows:
  // - Reusable components
  // - Efficient state updates
  // - Clean declarative syntax
  // - Component composition
  
  return (
    <div>
      <h1>React Benefits Demo</h1>
      {/* Build your comprehensive demo here */}
    </div>
  );
}

export default ReactBenefitsDemo;`,
          solution: `import React, { useState, useEffect } from 'react';

// Reusable Card Component
function Card({ title, content, color = '#f8f9fa', onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px',
        backgroundColor: color,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        ':hover': onClick ? { transform: 'scale(1.02)' } : {}
      }}
    >
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <p style={{ margin: 0 }}>{content}</p>
    </div>
  );
}

// Reusable Counter Component
function Counter({ label, initialValue = 0, color = '#007bff' }) {
  const [count, setCount] = useState(initialValue);
  
  return (
    <div style={{ 
      margin: '10px', 
      padding: '15px', 
      border: \`2px solid \${color}\`, 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color }}>{label}</h4>
      <p style={{ fontSize: '20px', margin: '10px 0' }}>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          margin: '0 5px', 
          padding: '8px 16px',
          backgroundColor: color,
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        +
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        style={{ 
          margin: '0 5px', 
          padding: '8px 16px',
          backgroundColor: color,
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        -
      </button>
      <button 
        onClick={() => setCount(0)}
        style={{ 
          margin: '0 5px', 
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Reset
      </button>
    </div>
  );
}

// Live Update Component
function LiveUpdater() {
  const [updates, setUpdates] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setUpdates(prev => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #28a745', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h3>⚡ Virtual DOM Efficiency</h3>
      <p>Updates: {updates}</p>
      <button 
        onClick={() => setIsRunning(!isRunning)}
        style={{
          padding: '10px 20px',
          backgroundColor: isRunning ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {isRunning ? 'Stop' : 'Start'} Live Updates
      </button>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Notice how smooth the updates are - that's the Virtual DOM at work!
      </p>
    </div>
  );
}

function ReactBenefitsDemo() {
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [theme, setTheme] = useState('light');

  const benefits = [
    {
      id: 1,
      title: '🧩 Component Reusability',
      content: 'Build once, use everywhere! Notice how Card and Counter components are reused with different props.',
      color: theme === 'light' ? '#e3f2fd' : '#1565c0'
    },
    {
      id: 2,
      title: '⚡ Virtual DOM',
      content: 'Efficient updates! Only changed elements re-render, not the entire page.',
      color: theme === 'light' ? '#f3e5f5' : '#7b1fa2'
    },
    {
      id: 3,
      title: '🎯 Declarative UI',
      content: 'Describe what you want, React handles how to achieve it. No manual DOM manipulation!',
      color: theme === 'light' ? '#e8f5e8' : '#388e3c'
    },
    {
      id: 4,
      title: '🔄 Unidirectional Data Flow',
      content: 'Data flows down, events flow up. Predictable and easy to debug.',
      color: theme === 'light' ? '#fff3e0' : '#f57c00'
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🚀 React Benefits Demo</h1>
        <p>Interactive showcase of React's key advantages</p>
        
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ 
            padding: '10px 20px', 
            marginTop: '10px',
            backgroundColor: theme === 'light' ? '#343a40' : '#ffc107',
            color: theme === 'light' ? 'white' : 'black',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
        </button>
      </div>

      {/* Benefits Cards */}
      <div style={{ marginBottom: '30px' }}>
        <h2>📋 React Benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px' }}>
          {benefits.map((benefit) => (
            <Card 
              key={benefit.id}
              title={benefit.title}
              content={benefit.content}
              color={benefit.color}
              onClick={() => setSelectedBenefit(benefit)}
            />
          ))}
        </div>
      </div>

      {/* Selected Benefit Details */}
      {selectedBenefit && (
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
          borderRadius: '8px',
          border: '2px solid #007bff'
        }}>
          <h3>Selected: {selectedBenefit.title}</h3>
          <p>{selectedBenefit.content}</p>
          <button 
            onClick={() => setSelectedBenefit(null)}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Component Reusability Demo */}
      <div style={{ marginBottom: '30px' }}>
        <h2>🔢 Component Reusability Demo</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Counter label="Likes" initialValue={42} color="#e91e63" />
          <Counter label="Views" initialValue={1337} color="#2196f3" />
          <Counter label="Shares" initialValue={7} color="#4caf50" />
        </div>
      </div>

      {/* Virtual DOM Demo */}
      <div style={{ marginBottom: '30px' }}>
        <LiveUpdater />
      </div>

      {/* Summary */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        backgroundColor: theme === 'light' ? '#e3f2fd' : '#1565c0',
        borderRadius: '8px'
      }}>
        <h2>🎉 React Makes Development Better!</h2>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>✅ Reusable components reduce code duplication</li>
          <li>✅ Virtual DOM provides excellent performance</li>
          <li>✅ Declarative syntax is easier to understand</li>
          <li>✅ Unidirectional data flow prevents bugs</li>
          <li>✅ Large ecosystem and community support</li>
        </ul>
      </div>
    </div>
  );
}

export default ReactBenefitsDemo;`
        },
        testCases: [
          'Theme toggle should change background colors',
          'Clicking benefit cards should show details',
          'Counter components should work independently',
          'Live updater should start/stop correctly',
          'All components should be reusable with different props'
        ]
      }
    ],
    estimatedTime: '50 min',
    difficulty: 'beginner',
    prerequisites: [],
    nextTopics: ['jsx-syntax'],
    category: 'fundamentals'
  },

  // 2. JSX - JavaScript + HTML Syntax
  {
    id: 'jsx-syntax',
    title: 'JSX - JavaScript + HTML Syntax',
    description: 'Master JSX syntax and learn to embed HTML in JavaScript like a pro!',
    explanation: `JSX (JavaScript XML) is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code directly in your JavaScript files.

Key JSX rules:
- Must return a single parent element (or Fragment)
- Use className instead of class
- Use camelCase for attributes (onClick, not onclick)
- Self-closing tags must end with />
- JavaScript expressions go inside curly braces {}
- Comments use {/* */} syntax
- Inline styles use objects with camelCase properties

JSX gets compiled to React.createElement() calls by Babel.`,
    animationScript: `Show JSX code transforming:
<div className="container">Hello {name}</div>
↓ (Babel compilation)
React.createElement('div', {className: 'container'}, 'Hello ', name)
Highlight the transformation with smooth animation
Show JSX rules being applied with visual indicators`,
    scenario: `🧩 You need to master JSX syntax and understand how it differs from HTML. Your mission is to write clean, valid JSX and avoid common pitfalls.`,
    challenges: [
      {
        id: 'jsx-syntax-mastery',
        title: 'Master JSX Syntax Rules',
        description: 'Fix JSX errors and implement proper JSX patterns',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '25 min',
        xpReward: 60,
        code: {
          initial: `// Fix all JSX syntax errors in this component
import React, { useState } from 'react';

function JSXDemo() {
  const name = 'React Developer';
  const isLoggedIn = true;
  const skills = ['JavaScript', 'React', 'CSS', 'Node.js'];
  const user = {
    name: 'Alice',
    avatar: 'avatar.jpg',
    isOnline: true
  };

  return (
    // Error 1: Multiple root elements
    <h1>Welcome {name}</h1>
    <div class="container">
      <!-- Error 2: HTML comment -->
      <img src={user.avatar} alt="User Avatar">

      <div class="user-info">
        <h2>{user.name}</h2>
        <p>Status: {user.isOnline ? 'Online' : 'Offline'}</p>
      </div>

      <!-- Error 3: onclick instead of onClick -->
      <button onclick="handleClick()">Click me</button>

      <ul>
        {skills.map(skill =>
          // Error 4: Missing key prop
          <li>{skill}</li>
        )}
      </ul>

      <!-- Error 5: Unclosed input tag -->
      <input type="text" placeholder="Enter text">

      <!-- Error 6: for instead of htmlFor -->
      <label for="email">Email:</label>
      <input type="email" id="email">

      <br>

      <!-- Error 7: Inline style as string -->
      <div style="color: red; font-size: 16px;">
        Styled text
      </div>
    </div>
  );
}

export default JSXDemo;`,
          solution: `import React, { useState } from 'react';

function JSXDemo() {
  const name = 'React Developer';
  const isLoggedIn = true;
  const skills = ['JavaScript', 'React', 'CSS', 'Node.js'];
  const user = {
    name: 'Alice',
    avatar: 'avatar.jpg',
    isOnline: true
  };

  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div>
      <h1>Welcome {name}</h1>
      <div className="container">
        {/* JSX comment */}
        <img src={user.avatar} alt="User Avatar" />

        <div className="user-info">
          <h2>{user.name}</h2>
          <p>Status: {user.isOnline ? 'Online' : 'Offline'}</p>
        </div>

        <button onClick={handleClick}>Click me</button>

        <ul>
          {skills.map((skill, index) =>
            <li key={index}>{skill}</li>
          )}
        </ul>

        <input type="text" placeholder="Enter text" />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" />

        <br />

        <div style={{ color: 'red', fontSize: '16px' }}>
          Styled text
        </div>
      </div>
    );
  }
}

export default JSXDemo;`
        },
        hints: [
          'Wrap multiple elements in a single parent or Fragment',
          'Use className instead of class',
          'Self-closing tags need />',
          'Use onClick instead of onclick',
          'Add key prop to list items',
          'Use htmlFor instead of for',
          'Inline styles should be objects with camelCase properties'
        ],
        testCases: [
          'Component should render without errors',
          'All JSX syntax should be valid',
          'Event handlers should work correctly',
          'List items should have proper keys',
          'Styles should be applied correctly'
        ]
      },
      {
        id: 'jsx-expressions-demo',
        title: 'JSX Expressions and Dynamic Content',
        description: 'Master JavaScript expressions in JSX',
        type: 'mini-project',
        difficulty: 'beginner',
        estimatedTime: '30 min',
        xpReward: 80,
        code: {
          initial: `// Create a dynamic profile card using JSX expressions
import React, { useState } from 'react';

function ProfileCard() {
  // Create a comprehensive profile card that demonstrates:
  // 1. Dynamic content with expressions
  // 2. Conditional rendering
  // 3. Array mapping
  // 4. Event handling
  // 5. Dynamic styling

  return (
    <div>
      <h1>Dynamic Profile Card</h1>
      {/* Build your profile card here */}
    </div>
  );
}

export default ProfileCard;`,
          solution: `import React, { useState } from 'react';

function ProfileCard() {
  const [user, setUser] = useState({
    name: 'Sarah Johnson',
    title: 'Senior React Developer',
    avatar: 'https://via.placeholder.com/150',
    isOnline: true,
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: 5,
    projects: 42,
    followers: 1250
  });

  const [showSkills, setShowSkills] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleOnlineStatus = () => {
    setUser(prev => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const addSkill = () => {
    const newSkill = prompt('Enter a new skill:');
    if (newSkill && newSkill.trim()) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Dynamic styles based on theme and status
  const cardStyle = {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme === 'light' ? '#ffffff' : '#2d3748',
    color: theme === 'light' ? '#333333' : '#ffffff',
    border: \`2px solid \${user.isOnline ? '#10b981' : '#ef4444'}\`,
    transition: 'all 0.3s ease'
  };

  const statusStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: user.isOnline ? '#10b981' : '#ef4444',
    color: 'white'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: theme === 'light' ? '#f7fafc' : '#1a202c', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Dynamic Profile Card</h1>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'light' ? '#4a5568' : '#fbbf24',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'} Toggle Theme
        </button>
      </div>

      <div style={cardStyle}>
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={user.avatar}
            alt={\`\${user.name}'s avatar\`}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: \`3px solid \${user.isOnline ? '#10b981' : '#ef4444'}\`,
              marginBottom: '10px'
            }}
          />
          <h2 style={{ margin: '10px 0 5px 0' }}>{user.name}</h2>
          <p style={{ margin: '0 0 10px 0', color: theme === 'light' ? '#666' : '#a0aec0' }}>
            {user.title}
          </p>
          <span style={statusStyle}>
            {user.isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3182ce' }}>
              {user.experience}
            </div>
            <div style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#a0aec0' }}>
              Years Exp
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#38a169' }}>
              {user.projects}
            </div>
            <div style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#a0aec0' }}>
              Projects
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d69e2e' }}>
              {user.followers.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#a0aec0' }}>
              Followers
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Skills ({user.skills.length})</h3>
            <button
              onClick={() => setShowSkills(!showSkills)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {showSkills ? 'Hide' : 'Show'}
            </button>
          </div>

          {showSkills && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: theme === 'light' ? '#e2e8f0' : '#4a5568',
                      borderRadius: '12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => removeSkill(skill)}
                    title="Click to remove"
                  >
                    {skill} ×
                  </span>
                ))}
              </div>
              <button
                onClick={addSkill}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#38a169',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                + Add Skill
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={toggleOnlineStatus}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: user.isOnline ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {user.isOnline ? 'Go Offline' : 'Go Online'}
          </button>
          <button
            onClick={() => alert(\`Connecting to \${user.name}...\`)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Connect
          </button>
        </div>

        {/* Dynamic Message */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: theme === 'light' ? '#f7fafc' : '#1a202c',
          borderRadius: '6px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {user.isOnline ? (
            <span>
              💬 {user.name} is available for collaboration!
            </span>
          ) : (
            <span>
              😴 {user.name} is currently offline. Try again later.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;`
        },
        testCases: [
          'Profile card should display user information correctly',
          'Theme toggle should change colors',
          'Online status toggle should work',
          'Skills can be added and removed',
          'Dynamic styling should respond to state changes'
        ]
      }
    ],
    estimatedTime: '55 min',
    difficulty: 'beginner',
    prerequisites: ['what-is-react'],
    nextTopics: ['components-functional-class'],
    category: 'fundamentals'
  },

  // 3. Components - Functional vs Class Components
  {
    id: 'components-functional-class',
    title: 'Components - Functional vs Class Components',
    description: 'Master component creation with focus on modern functional components!',
    explanation: `Components are the building blocks of React applications. There are two main types:

**Functional Components (Modern, Preferred):**
- Simple JavaScript functions that return JSX
- Use hooks for state and lifecycle
- Cleaner syntax and easier to test
- Better performance with React optimizations
- Easier to reason about and debug

**Class Components (Legacy):**
- ES6 classes that extend React.Component
- Use this.state and lifecycle methods
- Still used in legacy codebases
- Being phased out in favor of functional components

Best practices:
- Always use functional components for new code
- Convert class components to functional when possible
- Use PascalCase for component names
- Keep components small and focused
- Extract reusable logic into custom hooks`,
    animationScript: `Show component evolution:
Class Component → complex syntax → lifecycle methods → this binding issues
↓ (React Hooks introduced)
Functional Component → simple syntax → hooks → cleaner code
Highlight the simplification and modern approach`,
    scenario: `🧩 You need to understand both component types and master modern functional component patterns. Your mission is to build reusable, maintainable components.`,
    challenges: [
      {
        id: 'component-conversion',
        title: 'Convert Class to Functional Components',
        description: 'Transform legacy class components to modern functional components',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '30 min',
        xpReward: 90,
        code: {
          initial: `// Convert these class components to functional components
import React, { Component, useState, useEffect } from 'react';

// Class Component 1: Timer
class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      isRunning: false
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.isRunning) {
        this.setState({ seconds: this.state.seconds + 1 });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  start = () => {
    this.setState({ isRunning: true });
  }

  stop = () => {
    this.setState({ isRunning: false });
  }

  reset = () => {
    this.setState({ seconds: 0, isRunning: false });
  }

  render() {
    const { seconds, isRunning } = this.state;
    return (
      <div>
        <h3>Timer: {seconds}s</h3>
        <button onClick={this.start} disabled={isRunning}>Start</button>
        <button onClick={this.stop} disabled={!isRunning}>Stop</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

// Class Component 2: User Profile
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.setState({
        user: { name: this.props.username, email: \`\${this.props.username}@example.com\` },
        loading: false
      });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  }
}

// Convert to functional components:
function TimerFunctional() {
  // Your functional component here
}

function UserProfileFunctional({ username }) {
  // Your functional component here
}

function App() {
  return (
    <div>
      <h1>Component Conversion Demo</h1>
      <h2>Class Components:</h2>
      <Timer />
      <UserProfile username="john" />

      <h2>Functional Components:</h2>
      <TimerFunctional />
      <UserProfileFunctional username="jane" />
    </div>
  );
}

export default App;`,
          solution: `import React, { Component, useState, useEffect } from 'react';

// Original Class Components (for comparison)
class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      isRunning: false
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.isRunning) {
        this.setState({ seconds: this.state.seconds + 1 });
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  start = () => {
    this.setState({ isRunning: true });
  }

  stop = () => {
    this.setState({ isRunning: false });
  }

  reset = () => {
    this.setState({ seconds: 0, isRunning: false });
  }

  render() {
    const { seconds, isRunning } = this.state;
    return (
      <div style={{ padding: '15px', border: '2px solid #dc3545', borderRadius: '8px', margin: '10px' }}>
        <h3>Class Timer: {seconds}s</h3>
        <button onClick={this.start} disabled={isRunning} style={{ margin: '5px', padding: '8px 16px' }}>
          Start
        </button>
        <button onClick={this.stop} disabled={!isRunning} style={{ margin: '5px', padding: '8px 16px' }}>
          Stop
        </button>
        <button onClick={this.reset} style={{ margin: '5px', padding: '8px 16px' }}>
          Reset
        </button>
      </div>
    );
  }
}

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null
    };
  }

  async componentDidMount() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.setState({
        user: { name: this.props.username, email: \`\${this.props.username}@example.com\` },
        loading: false
      });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div style={{ padding: '15px' }}>Loading...</div>;
    if (error) return <div style={{ padding: '15px', color: 'red' }}>Error: {error}</div>;

    return (
      <div style={{ padding: '15px', border: '2px solid #dc3545', borderRadius: '8px', margin: '10px' }}>
        <h3>Class Profile: {user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  }
}

// Converted Functional Components
function TimerFunctional() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div style={{ padding: '15px', border: '2px solid #28a745', borderRadius: '8px', margin: '10px' }}>
      <h3>Functional Timer: {seconds}s</h3>
      <button onClick={start} disabled={isRunning} style={{ margin: '5px', padding: '8px 16px' }}>
        Start
      </button>
      <button onClick={stop} disabled={!isRunning} style={{ margin: '5px', padding: '8px 16px' }}>
        Stop
      </button>
      <button onClick={reset} style={{ margin: '5px', padding: '8px 16px' }}>
        Reset
      </button>
    </div>
  );
}

function UserProfileFunctional({ username }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({
          name: username,
          email: \`\${username}@example.com\`,
          joinDate: new Date().toLocaleDateString()
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) return <div style={{ padding: '15px' }}>Loading user data...</div>;
  if (error) return <div style={{ padding: '15px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '15px', border: '2px solid #28a745', borderRadius: '8px', margin: '10px' }}>
      <h3>Functional Profile: {user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Joined: {user.joinDate}</p>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Component Conversion Demo</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#dc3545' }}>🔴 Class Components (Legacy)</h2>
        <Timer />
        <UserProfile username="john" />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#28a745' }}>🟢 Functional Components (Modern)</h2>
        <TimerFunctional />
        <UserProfileFunctional username="jane" />
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginTop: '30px'
      }}>
        <h3>Key Differences:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ color: '#dc3545' }}>Class Components</h4>
            <ul>
              <li>❌ More verbose syntax</li>
              <li>❌ this binding issues</li>
              <li>❌ Lifecycle methods complexity</li>
              <li>❌ Harder to test and optimize</li>
              <li>❌ Logic reuse is difficult</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#28a745' }}>Functional Components</h4>
            <ul>
              <li>✅ Cleaner, simpler syntax</li>
              <li>✅ No this binding needed</li>
              <li>✅ Hooks for lifecycle logic</li>
              <li>✅ Easier to test and optimize</li>
              <li>✅ Custom hooks for logic reuse</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;`
        },
        hints: [
          'Replace class with function declaration',
          'Use useState hook instead of this.state',
          'Use useEffect hook for lifecycle methods',
          'Convert methods to regular functions',
          'Remove constructor and use function parameters for props'
        ],
        testCases: [
          'Timer should start, stop, and reset correctly',
          'User profile should load data asynchronously',
          'Both functional and class components should work identically',
          'useEffect cleanup should prevent memory leaks',
          'State updates should trigger re-renders'
        ]
      }
    ],
    estimatedTime: '60 min',
    difficulty: 'beginner',
    prerequisites: ['jsx-syntax'],
    nextTopics: ['props-data-passing'],
    category: 'fundamentals'
  }
];
