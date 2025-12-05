// Complete React Learning Path - All 43 Topics from Basic to Advanced
// Each topic includes: explanation, code examples, playground challenges, and mini-projects

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
}

export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'playground' | 'challenge' | 'mini-project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  code: {
    initial: string;
    solution: string;
  };
  hints?: string[];
}

export const completeReactTopics: LearningTopic[] = [
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
- Unidirectional data flow`,
    animationScript: `Split screen showing:
Left: Vanilla JS → document.getElementById() → DOM → slow UI update
Right: React → <Component /> → Virtual DOM → diff → fast UI update
Highlight "Virtual DOM" and "Component" with popups
Gears rotate as the Virtual DOM syncs with real DOM
User clicks button → React shows re-render with minimal updates`,
    scenario: `🧩 You're given vanilla JS code that manipulates the DOM directly. Your mission is to convert it to React using modern patterns.`,
    challenges: [
      {
        id: 'vanilla-to-react',
        title: 'Convert Vanilla JS to React',
        description: 'Transform imperative DOM manipulation to declarative React',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 50,
        code: {
          initial: `// Convert this vanilla JS to React
<!DOCTYPE html>
<html>
<body>
  <button onclick="changeText()">Click</button>
  <p id="output">Initial text</p>

  <script>
    function changeText() {
      document.getElementById('output').innerText = 'Hello React!';
    }
  </script>
</body>
</html>

// Your React component here:
import React, { useState } from 'react';

function App() {
  // Add your code here
  return (
    <div>
      {/* Convert the HTML above to React */}
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

function App() {
  const [text, setText] = useState('Initial text');

  const changeText = () => {
    setText('Hello React!');
  };

  return (
    <div>
      <button onClick={changeText}>Click</button>
      <p>{text}</p>
    </div>
  );
}

export default App;`
        },
        hints: [
          'Use useState hook to manage the text state',
          'Replace onclick with onClick (camelCase)',
          'Use JSX instead of innerHTML',
          'State updates trigger re-renders automatically'
        ]
      },
      {
        id: 'greeting-app-challenge',
        title: 'Build a Greeting App',
        description: 'Create an interactive greeting application',
        type: 'mini-project',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 75,
        code: {
          initial: `// Build a GreetingApp with the following features:
// 1. Display "Hello, welcome to React!"
// 2. Add a button that changes greeting to "You clicked me!"
// 3. BONUS: Add a reset button

import React from 'react';

function GreetingApp() {
  // Add your state and logic here
  
  return (
    <div>
      {/* Add your JSX here */}
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
      <h1>{greeting}</h1>
      <button 
        onClick={handleClick}
        style={{ margin: '10px', padding: '10px 20px' }}
      >
        Click Me
      </button>
      <button 
        onClick={handleReset}
        style={{ margin: '10px', padding: '10px 20px' }}
      >
        Reset
      </button>
    </div>
  );
}

export default GreetingApp;`
        }
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: [],
    nextTopics: ['jsx-basics']
  },

  // 2. JSX - HTML in JavaScript
  {
    id: 'jsx-basics',
    title: 'JSX - HTML in JavaScript',
    description: 'Master JSX and learn to embed HTML in JavaScript like a pro!',
    explanation: `JSX (JavaScript XML) is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code directly in your JavaScript files.

Key JSX rules:
- Must return a single parent element (or Fragment)
- Use className instead of class
- Use camelCase for attributes (onClick, not onclick)
- Self-closing tags must end with />
- JavaScript expressions go inside curly braces {}

JSX gets compiled to React.createElement() calls by Babel.`,
    animationScript: `Show JSX code transforming:
<div className="container">Hello {name}</div>
↓ (Babel compilation)
React.createElement('div', {className: 'container'}, 'Hello ', name)
Highlight the transformation with smooth animation`,
    scenario: `🧩 You need to fix broken JSX code that has common syntax errors. Your mission is to make it compile and render correctly.`,
    challenges: [
      {
        id: 'fix-jsx-errors',
        title: 'Fix JSX Syntax Errors',
        description: 'Identify and fix common JSX mistakes',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 60,
        code: {
          initial: `// Fix the JSX errors in this component
import React from 'react';

function BrokenComponent() {
  const name = 'React Developer';
  const isLoggedIn = true;
  
  return (
    // Multiple root elements (error!)
    <h1>Welcome {name}</h1>
    <div class="container">
      <img src="avatar.jpg" alt="Avatar">
      <p>Status: {isLoggedIn ? 'Online' : 'Offline'}</p>
      <button onclick="handleClick()">Click me</button>
    </div>
  );
}

export default BrokenComponent;`,
          solution: `import React from 'react';

function FixedComponent() {
  const name = 'React Developer';
  const isLoggedIn = true;
  
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return (
    <div>
      <h1>Welcome {name}</h1>
      <div className="container">
        <img src="avatar.jpg" alt="Avatar" />
        <p>Status: {isLoggedIn ? 'Online' : 'Offline'}</p>
        <button onClick={handleClick}>Click me</button>
      </div>
    </div>
  );
}

export default FixedComponent;`
        },
        hints: [
          'Wrap multiple elements in a single parent div or Fragment',
          'Use className instead of class',
          'Self-closing tags need />',
          'Use onClick instead of onclick',
          'Define functions inside the component'
        ]
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['what-is-react'],
    nextTopics: ['components-basics']
  },

  // 3. Components - The Building Blocks
  {
    id: 'components-basics',
    title: 'Components - The Building Blocks',
    description: 'Create reusable components and learn the art of component composition!',
    explanation: `Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

Types of components:
- Functional Components (modern, preferred)
- Class Components (legacy, still used)

Component best practices:
- Keep components small and focused
- Use descriptive names (PascalCase)
- Extract reusable logic
- Follow single responsibility principle`,
    animationScript: `Show LEGO blocks assembling:
Individual blocks (components) → combine → complete structure (app)
Highlight reusability by showing same block used multiple times
Show component tree structure with parent-child relationships`,
    scenario: `🧩 You have a messy single component with too much responsibility. Your mission is to break it down into smaller, reusable components.`,
    challenges: [
      {
        id: 'extract-components',
        title: 'Extract Reusable Components',
        description: 'Break down a monolithic component into smaller pieces',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 80,
        code: {
          initial: `// Extract components from this monolithic component
import React from 'react';

function MonolithicApp() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'avatar1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'avatar2.jpg' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: 'avatar3.jpg' }
  ];

  return (
    <div>
      <h1>User Directory</h1>
      <div>
        {users.map(user => (
          <div key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <img src={user.avatar} alt={user.name} style={{ width: '50px', height: '50px' }} />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button>View Profile</button>
            <button>Send Message</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Extract: Header, UserCard, UserList components
// Your extracted components here:

export default MonolithicApp;`,
          solution: `import React from 'react';

// Header Component
function Header({ title }) {
  return <h1>{title}</h1>;
}

// UserCard Component
function UserCard({ user }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <img
        src={user.avatar}
        alt={user.name}
        style={{ width: '50px', height: '50px' }}
      />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button>View Profile</button>
      <button>Send Message</button>
    </div>
  );
}

// UserList Component
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Main App Component
function App() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'avatar1.jpg' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'avatar2.jpg' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatar: 'avatar3.jpg' }
  ];

  return (
    <div>
      <Header title="User Directory" />
      <UserList users={users} />
    </div>
  );
}

export default App;`
        },
        hints: [
          'Extract Header as a separate component that accepts title as prop',
          'Create UserCard component for individual user display',
          'Create UserList component to map over users',
          'Pass data down through props'
        ]
      },
      {
        id: 'layout-components',
        title: 'Build Layout Components',
        description: 'Create reusable layout components for consistent UI',
        type: 'mini-project',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 100,
        code: {
          initial: `// Create layout components: Container, Card, Button
// Build a product showcase using these components

import React from 'react';

// Create these components:
// 1. Container - centers content with max width
// 2. Card - displays content with shadow and padding
// 3. Button - reusable button with variants (primary, secondary)

function ProductShowcase() {
  const products = [
    { id: 1, name: 'Laptop', price: '$999', image: 'laptop.jpg' },
    { id: 2, name: 'Phone', price: '$699', image: 'phone.jpg' },
    { id: 3, name: 'Tablet', price: '$499', image: 'tablet.jpg' }
  ];

  return (
    <div>
      {/* Use your layout components here */}
    </div>
  );
}

export default ProductShowcase;`,
          solution: `import React from 'react';

// Container Component
function Container({ children, className = '' }) {
  return (
    <div className={\`max-w-6xl mx-auto px-4 \${className}\`}>
      {children}
    </div>
  );
}

// Card Component
function Card({ children, className = '' }) {
  return (
    <div className={\`bg-white rounded-lg shadow-md p-6 \${className}\`}>
      {children}
    </div>
  );
}

// Button Component
function Button({ children, variant = 'primary', onClick, className = '' }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${className}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Product Card Component
function ProductCard({ product }) {
  return (
    <Card className="text-center">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-2xl font-bold text-blue-600 mb-4">{product.price}</p>
      <div className="space-x-2">
        <Button variant="primary">Buy Now</Button>
        <Button variant="secondary">Add to Cart</Button>
      </div>
    </Card>
  );
}

// Main Component
function ProductShowcase() {
  const products = [
    { id: 1, name: 'Laptop', price: '$999', image: 'laptop.jpg' },
    { id: 2, name: 'Phone', price: '$699', image: 'phone.jpg' },
    { id: 3, name: 'Tablet', price: '$499', image: 'tablet.jpg' }
  ];

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}

export default ProductShowcase;`
        }
      }
    ],
    estimatedTime: '50 min',
    difficulty: 'beginner',
    prerequisites: ['jsx-basics'],
    nextTopics: ['props-basics']
  },

  // 4. Props - Passing Data
  {
    id: 'props-basics',
    title: 'Props - Passing Data Like Gifts',
    description: 'Learn how to pass data between components using props!',
    explanation: `Props (properties) are how you pass data from parent components to child components. They make components reusable and dynamic.

Key concepts:
- Props are read-only (immutable)
- Pass data down the component tree
- Can pass any JavaScript value (strings, numbers, objects, functions)
- Use destructuring for cleaner code
- Default props for fallback values`,
    animationScript: `Show gift boxes (props) being passed down a family tree:
Parent component → wraps data in gift box → passes to child
Child component → unwraps gift box → uses the data
Show different types of gifts (string, number, object, function)`,
    scenario: `🧩 You need to make components dynamic by passing different data to them. Your mission is to master props and component communication.`,
    challenges: [
      {
        id: 'add-props-to-component',
        title: 'Add Props to Components',
        description: 'Make static components dynamic with props',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 70,
        code: {
          initial: `// Make these static components dynamic with props
import React from 'react';

// Static components - make them accept props
function UserProfile() {
  return (
    <div className="profile">
      <img src="default-avatar.jpg" alt="User" />
      <h2>John Doe</h2>
      <p>Software Developer</p>
      <p>john@example.com</p>
    </div>
  );
}

function WelcomeMessage() {
  return <h1>Welcome, Guest!</h1>;
}

function App() {
  const user = {
    name: 'Alice Johnson',
    role: 'UX Designer',
    email: 'alice@example.com',
    avatar: 'alice-avatar.jpg'
  };

  return (
    <div>
      <WelcomeMessage />
      <UserProfile />
    </div>
  );
}

export default App;`,
          solution: `import React from 'react';

// Dynamic UserProfile component with props
function UserProfile({ user }) {
  return (
    <div className="profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.role}</p>
      <p>{user.email}</p>
    </div>
  );
}

// Dynamic WelcomeMessage component with props
function WelcomeMessage({ name = 'Guest' }) {
  return <h1>Welcome, {name}!</h1>;
}

function App() {
  const user = {
    name: 'Alice Johnson',
    role: 'UX Designer',
    email: 'alice@example.com',
    avatar: 'alice-avatar.jpg'
  };

  return (
    <div>
      <WelcomeMessage name={user.name} />
      <UserProfile user={user} />
    </div>
  );
}

export default App;`
        },
        hints: [
          'Add parameters to component functions to receive props',
          'Use destructuring for cleaner prop access',
          'Replace static values with prop values',
          'Add default values for optional props'
        ]
      }
    ],
    estimatedTime: '35 min',
    difficulty: 'beginner',
    prerequisites: ['components-basics'],
    nextTopics: ['usestate-basics']
  },

  // 5. useState - Managing State in Components
  {
    id: 'usestate-basics',
    title: 'useState - Managing State in Components',
    description: 'Bring your components to life with state and user interactions!',
    explanation: `useState is a React Hook that lets you add state to functional components. State represents data that can change over time and triggers re-renders when updated.

Key concepts:
- State is local to each component instance
- useState returns [value, setter] array
- State updates are asynchronous
- Never mutate state directly
- Use functional updates for complex state`,
    animationScript: `Show a light switch being flipped:
Initial state: OFF → user clicks → setState(ON) → component re-renders → light turns ON
Show state flowing through component with glowing effect when state changes`,
    scenario: `🧩 You need to add interactivity to static components. Your mission is to manage component state and handle user interactions.`,
    challenges: [
      {
        id: 'fix-counter-state',
        title: 'Fix Counter State Management',
        description: 'Debug and fix state management issues in a counter',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 80,
        code: {
          initial: `// Fix the state management issues in this counter
import React, { useState } from 'react';

function BrokenCounter() {
  let count = 0; // Issue 1: Not using state

  const increment = () => {
    count = count + 1; // Issue 2: Direct mutation
    console.log('Count:', count);
  };

  const decrement = () => {
    count--; // Issue 3: Direct mutation
  };

  const reset = () => {
    count = 0; // Issue 4: Direct mutation
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default BrokenCounter;`,
          solution: `import React, { useState } from 'react';

function FixedCounter() {
  const [count, setCount] = useState(0); // Fix 1: Use useState

  const increment = () => {
    setCount(count + 1); // Fix 2: Use setter function
    console.log('Count will be:', count + 1);
  };

  const decrement = () => {
    setCount(count - 1); // Fix 3: Use setter function
  };

  const reset = () => {
    setCount(0); // Fix 4: Use setter function
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter: {count}</h2>
      <div style={{ gap: '10px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={increment} style={{ padding: '10px 20px' }}>+</button>
        <button onClick={decrement} style={{ padding: '10px 20px' }}>-</button>
        <button onClick={reset} style={{ padding: '10px 20px' }}>Reset</button>
      </div>
    </div>
  );
}

export default FixedCounter;`
        },
        hints: [
          'Replace regular variable with useState hook',
          'Use the setter function to update state',
          'Never mutate state directly',
          'State updates trigger re-renders automatically'
        ]
      },
      {
        id: 'like-button-challenge',
        title: 'Build Interactive Like Button',
        description: 'Create a like button with count and animation',
        type: 'mini-project',
        difficulty: 'beginner',
        estimatedTime: '25 min',
        xpReward: 100,
        code: {
          initial: `// Build an interactive like button with:
// 1. Like count that increases/decreases
// 2. Heart icon that changes color when liked
// 3. Prevent multiple likes (toggle behavior)
// 4. Show "You liked this!" message

import React, { useState } from 'react';

function LikeButton() {
  // Add your state here

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        Amazing React Post! 🚀
      </div>

      {/* Add your like button and count here */}

    </div>
  );
}

export default LikeButton;`,
          solution: `import React, { useState } from 'react';

function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42); // Starting with some likes

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        Amazing React Post! 🚀
      </div>

      <button
        onClick={handleLike}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '50%',
          transition: 'transform 0.2s',
          transform: isLiked ? 'scale(1.2)' : 'scale(1)'
        }}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>

      <div style={{ marginTop: '10px' }}>
        <strong>{likeCount} likes</strong>
      </div>

      {isLiked && (
        <div style={{
          color: 'red',
          marginTop: '10px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          You liked this! ❤️
        </div>
      )}
    </div>
  );
}

export default LikeButton;`
        }
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: ['props-basics'],
    nextTopics: ['event-handling']
  },

  // 6. Event Handling
  {
    id: 'event-handling',
    title: 'Event Handling',
    description: 'Handle user interactions and SyntheticEvents like a pro!',
    explanation: `React uses SyntheticEvents to provide consistent event handling across different browsers. Events in React are wrapped to provide a unified API.

Key concepts:
- SyntheticEvent wrapper for cross-browser compatibility
- Event handlers receive event object as parameter
- Use camelCase for event names (onClick, onChange)
- Prevent default behavior with event.preventDefault()
- Access form data through event.target.value`,
    animationScript: `Show user interactions flowing through React:
User clicks button → SyntheticEvent created → Event handler called → State updated → Component re-renders
Highlight the event object being passed to handlers`,
    scenario: `🧩 You need to handle various user interactions in a form. Your mission is to master event handling and form data management.`,
    challenges: [
      {
        id: 'fix-event-handlers',
        title: 'Fix Event Handler Issues',
        description: 'Debug and fix common event handling problems',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 90,
        code: {
          initial: `// Fix the event handling issues in this component
import React, { useState } from 'react';

function BrokenForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Issue 1: Missing event parameter
  const handleNameChange = () => {
    setName(event.target.value); // event is undefined
  };

  // Issue 2: Incorrect event handling
  const handleEmailChange = (value) => {
    setEmail(value);
  };

  // Issue 3: Form submission not prevented
  const handleSubmit = () => {
    console.log('Form submitted:', { name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange} // Wrong parameter
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default BrokenForm;`,
          solution: `import React, { useState } from 'react';

function FixedForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fix 1: Add event parameter
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // Fix 2: Use event object correctly
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Fix 3: Prevent default form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', { name, email });
    // Reset form
    setName('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <button type="submit" style={{ padding: '10px 20px' }}>
        Submit
      </button>
    </form>
  );
}

export default FixedForm;`
        },
        hints: [
          'Event handlers must accept event parameter',
          'Use event.target.value to get input values',
          'Call event.preventDefault() to prevent form submission',
          'Always handle events properly in React'
        ]
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['usestate-basics'],
    nextTopics: ['conditional-rendering']
  },

  // 7. Conditional Rendering
  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    description: 'Show and hide UI elements based on conditions dynamically!',
    explanation: `Conditional rendering in React allows you to render different components or elements based on certain conditions. This makes your UI dynamic and responsive to state changes.

Common patterns:
- if/else statements
- Ternary operator (condition ? true : false)
- Logical AND operator (condition && <Component />)
- Switch statements for multiple conditions`,
    animationScript: `Show a traffic light changing colors:
State: 'red' → Red light shows, others hidden
State: 'yellow' → Yellow light shows, others hidden
State: 'green' → Green light shows, others hidden
Highlight conditional rendering with smooth transitions`,
    scenario: `🧩 You need to show different UI based on user state and conditions. Your mission is to master conditional rendering patterns.`,
    challenges: [
      {
        id: 'toggle-visibility',
        title: 'Toggle Component Visibility',
        description: 'Show/hide components based on state conditions',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        code: {
          initial: `// Implement conditional rendering for these scenarios
import React, { useState } from 'react';

function ConditionalApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userRole, setUserRole] = useState('guest'); // 'guest', 'user', 'admin'

  return (
    <div style={{ padding: '20px' }}>
      <h1>Conditional Rendering Demo</h1>

      {/* Task 1: Show login/logout button based on isLoggedIn */}
      <div>
        {/* Add conditional rendering here */}
      </div>

      {/* Task 2: Show user details only when showDetails is true */}
      <div>
        <button onClick={() => setShowDetails(!showDetails)}>
          Toggle Details
        </button>
        {/* Add conditional rendering here */}
      </div>

      {/* Task 3: Show different content based on userRole */}
      <div>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {/* Add conditional rendering here */}
      </div>
    </div>
  );
}

export default ConditionalApp;`,
          solution: `import React, { useState } from 'react';

function ConditionalApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Conditional Rendering Demo</h1>

      {/* Task 1: Login/Logout button */}
      <div style={{ marginBottom: '20px' }}>
        {isLoggedIn ? (
          <button onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        ) : (
          <button onClick={() => setIsLoggedIn(true)}>
            Login
          </button>
        )}
        <span style={{ marginLeft: '10px' }}>
          Status: {isLoggedIn ? 'Logged In' : 'Logged Out'}
        </span>
      </div>

      {/* Task 2: Toggle details */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        {showDetails && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}>
            <h3>User Details</h3>
            <p>Name: John Doe</p>
            <p>Email: john@example.com</p>
            <p>Member since: 2023</p>
          </div>
        )}
      </div>

      {/* Task 3: Role-based content */}
      <div>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div style={{ marginTop: '10px' }}>
          {userRole === 'guest' && (
            <p>Welcome! Please sign up to access more features.</p>
          )}
          {userRole === 'user' && (
            <p>Welcome back! You have access to user features.</p>
          )}
          {userRole === 'admin' && (
            <p>Admin Dashboard: You have full access to all features.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConditionalApp;`
        },
        hints: [
          'Use ternary operator for simple if/else conditions',
          'Use logical AND (&&) for show/hide patterns',
          'Use multiple conditions for role-based rendering',
          'Consider using switch statements for complex conditions'
        ]
      }
    ],
    estimatedTime: '35 min',
    difficulty: 'beginner',
    prerequisites: ['event-handling'],
    nextTopics: ['lists-and-keys']
  },

  // 8. Lists and Keys
  {
    id: 'lists-and-keys',
    title: 'Lists and Keys',
    description: 'Render dynamic lists efficiently with proper key management!',
    explanation: `Rendering lists is a common pattern in React. Keys help React identify which items have changed, been added, or removed, enabling efficient updates.

Key concepts:
- Use map() to render arrays of data
- Each list item needs a unique key prop
- Keys should be stable and unique
- Avoid using array index as key when list can change
- Keys help React optimize re-renders`,
    animationScript: `Show a list of items being updated:
Initial list → item added → React uses keys to identify changes → efficient update
Show comparison: with keys (fast) vs without keys (slow re-render)
Highlight key prop with glowing effect`,
    scenario: `🧩 You need to render dynamic lists of data efficiently. Your mission is to master list rendering and key management.`,
    challenges: [
      {
        id: 'fix-list-keys',
        title: 'Fix List Key Issues',
        description: 'Add proper keys to list items and fix rendering issues',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 85,
        code: {
          initial: `// Fix the key issues in these list components
import React, { useState } from 'react';

function BrokenLists() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: true }
  ]);

  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Todo List</h2>

      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Issue 1: Missing keys */}
      <ul>
        {todos.map(todo => (
          <li>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Issue 2: Using index as key (problematic) */}
      <h3>Recent Items:</h3>
      <ul>
        {todos.slice(-3).map((todo, index) => (
          <li key={index}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BrokenLists;`,
          solution: `import React, { useState } from 'react';

function FixedLists() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: true }
  ]);

  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Todo List</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Fix 1: Added proper keys using unique IDs */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '10px' }}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              marginRight: '10px'
            }}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ fontSize: '12px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Fix 2: Using stable unique keys instead of index */}
      <h3>Recent Items:</h3>
      <ul>
        {todos.slice(-3).map(todo => (
          <li key={\`recent-\${todo.id}\`}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FixedLists;`
        },
        hints: [
          'Always add key prop to list items',
          'Use unique, stable identifiers as keys',
          'Avoid using array index as key for dynamic lists',
          'Keys help React optimize re-renders'
        ]
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['conditional-rendering'],
    nextTopics: ['forms-controlled-inputs']
  },

  // 9. Forms & Controlled Inputs
  {
    id: 'forms-controlled-inputs',
    title: 'Forms & Controlled Inputs',
    description: 'Master form handling and input validation in React!',
    explanation: `Controlled components are form inputs whose value is controlled by React state. This gives you full control over form data and enables real-time validation.

Key concepts:
- Controlled vs uncontrolled components
- Single source of truth (state)
- Real-time validation
- Form submission handling
- Input types and validation patterns`,
    animationScript: `Show data flow in controlled inputs:
User types → onChange event → setState → value prop updates → input shows new value
Highlight the circular data flow with arrows`,
    scenario: `🧩 You need to build a registration form with validation. Your mission is to master controlled inputs and form handling.`,
    challenges: [
      {
        id: 'make-input-controlled',
        title: 'Convert to Controlled Inputs',
        description: 'Convert uncontrolled inputs to controlled components',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 95,
        code: {
          initial: `// Convert these uncontrolled inputs to controlled components
import React, { useState } from 'react';

function UncontrolledForm() {
  // Add state for form data

  const handleSubmit = (event) => {
    event.preventDefault();
    // How do we get the form data?
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" />
      </div>

      <div>
        <label>Email:</label>
        <input type="email" name="email" />
      </div>

      <div>
        <label>Age:</label>
        <input type="number" name="age" />
      </div>

      <div>
        <label>Bio:</label>
        <textarea name="bio" rows="4"></textarea>
      </div>

      <div>
        <label>Country:</label>
        <select name="country">
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;`,
          solution: `import React, { useState } from 'react';

function ControlledForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    bio: '',
    country: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);

    // Reset form
    setFormData({
      name: '',
      email: '',
      age: '',
      bio: '',
      country: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="4"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Country:</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="uk">United Kingdom</option>
          <option value="ca">Canada</option>
        </select>
      </div>

      <button type="submit" style={{ padding: '10px 20px' }}>
        Submit
      </button>

      {/* Show current form data */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h4>Current Form Data:</h4>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </form>
  );
}

export default ControlledForm;`
        },
        hints: [
          'Add state to store all form field values',
          'Use value prop to control input values',
          'Handle onChange events to update state',
          'Use computed property names for dynamic updates'
        ]
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    prerequisites: ['lists-and-keys'],
    nextTopics: ['useeffect-basics']
  },

  // 10. useEffect - Side Effects & Lifecycle
  {
    id: 'useeffect-basics',
    title: 'useEffect - Side Effects & Lifecycle',
    description: 'Master side effects and component lifecycle with useEffect!',
    explanation: `useEffect is a React Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

Key concepts:
- Side effects (API calls, subscriptions, timers)
- Effect dependencies array
- Cleanup functions
- Effect timing (after render)
- Common patterns and pitfalls`,
    animationScript: `Show component lifecycle with useEffect:
Component mounts → useEffect runs → side effect executes
State changes → component re-renders → useEffect runs again (if dependencies changed)
Component unmounts → cleanup function runs`,
    scenario: `🧩 You need to fetch data when component mounts and clean up resources. Your mission is to master useEffect patterns.`,
    challenges: [
      {
        id: 'fix-useeffect-dependencies',
        title: 'Fix useEffect Dependencies',
        description: 'Fix dependency array issues and infinite loops',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 110,
        code: {
          initial: `// Fix the useEffect dependency issues
import React, { useState, useEffect } from 'react';

function BrokenEffects() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Issue 1: Missing dependencies
  useEffect(() => {
    console.log('Count changed:', count);
    document.title = \`Count: \${count}\`;
  }); // Missing dependency array

  // Issue 2: Infinite loop
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/user');
      const userData = await response.json();
      setUser(userData);
    };

    fetchUser();
    setPosts([]); // This causes infinite loop
  }, [posts]); // posts in dependency causes loop

  // Issue 3: Missing cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Missing cleanup function
  }, []);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>

      {user && <p>Welcome, {user.name}!</p>}
      <p>Posts: {posts.length}</p>
    </div>
  );
}

export default BrokenEffects;`,
          solution: `import React, { useState, useEffect } from 'react';

function FixedEffects() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fix 1: Add proper dependencies
  useEffect(() => {
    console.log('Count changed:', count);
    document.title = \`Count: \${count}\`;
  }, [count]); // Add count as dependency

  // Fix 2: Remove posts from dependencies to prevent loop
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulate API call
        const userData = { name: 'John Doe', id: 1 };
        setUser(userData);

        // Fetch posts separately
        const userPosts = [
          { id: 1, title: 'First Post' },
          { id: 2, title: 'Second Post' }
        ];
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []); // Empty dependency array - run only on mount

  // Fix 3: Add cleanup function
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array

  // Additional effect for demonstration
  useEffect(() => {
    console.log('Component mounted');

    return () => {
      console.log('Component will unmount');
      document.title = 'React App'; // Reset title
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>

      {user && (
        <div style={{ marginTop: '20px' }}>
          <p>Welcome, {user.name}!</p>
          <p>Posts: {posts.length}</p>
          <ul>
            {posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FixedEffects;`
        },
        hints: [
          'Add dependency arrays to control when effects run',
          'Include all values from component scope used inside effect',
          'Return cleanup functions for subscriptions and timers',
          'Use empty dependency array for mount-only effects'
        ]
      }
    ],
    estimatedTime: '50 min',
    difficulty: 'intermediate',
    prerequisites: ['forms-controlled-inputs'],
    nextTopics: ['useref-basics']
  },

  // 11. useRef - Accessing DOM and Persistent Values
  {
    id: 'useref-basics',
    title: 'useRef - Accessing DOM and Persistent Values',
    description: 'Master direct DOM access and persistent values with useRef!',
    explanation: `useRef is a React Hook that lets you reference a value that's not needed for rendering. It's commonly used for accessing DOM elements directly and storing mutable values that persist across renders.

Key concepts:
- Direct DOM access
- Persistent values across renders
- Doesn't trigger re-renders when changed
- Common use cases: focus management, scroll position, timers
- Difference between useRef and useState`,
    animationScript: `Show useRef in action:
Component renders → useRef creates reference → ref.current points to DOM element
User interaction → direct DOM manipulation → no re-render triggered
Highlight the direct connection between ref and DOM element`,
    scenario: `🧩 You need to focus an input field and manage scroll position. Your mission is to master useRef for DOM manipulation.`,
    challenges: [
      {
        id: 'focus-input-ref',
        title: 'Focus Management with useRef',
        description: 'Use useRef to manage focus and DOM interactions',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 100,
        code: {
          initial: `// Implement focus management using useRef
import React, { useState, useRef } from 'react';

function FocusDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Add useRef for input elements

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate and focus on empty fields
    if (!name) {
      // Focus name input
      return;
    }

    if (!email) {
      // Focus email input
      return;
    }

    console.log('Form submitted:', { name, email });
    setName('');
    setEmail('');
    // Focus back to name input for next entry
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Focus Management Demo</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button>Focus Name Input</button>
        <button style={{ marginLeft: '10px' }}>Focus Email Input</button>
      </div>
    </div>
  );
}

export default FocusDemo;`,
          solution: `import React, { useState, useRef } from 'react';

function FocusDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Create refs for input elements
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate and focus on empty fields
    if (!name) {
      nameInputRef.current.focus();
      return;
    }

    if (!email) {
      emailInputRef.current.focus();
      return;
    }

    console.log('Form submitted:', { name, email });
    setName('');
    setEmail('');
    // Focus back to name input for next entry
    nameInputRef.current.focus();
  };

  const focusName = () => {
    nameInputRef.current.focus();
  };

  const focusEmail = () => {
    emailInputRef.current.focus();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Focus Management Demo</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button onClick={focusName}>Focus Name Input</button>
        <button onClick={focusEmail} style={{ marginLeft: '10px' }}>
          Focus Email Input
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Try submitting with empty fields to see focus management in action!</p>
      </div>
    </div>
  );
}

export default FocusDemo;`
        },
        hints: [
          'Create refs using useRef(null)',
          'Attach refs to input elements with ref prop',
          'Use ref.current.focus() to focus elements',
          'Refs persist across re-renders without causing them'
        ]
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'intermediate',
    prerequisites: ['useeffect-basics'],
    nextTopics: ['custom-hooks']
  },

  // 12. Custom Hooks
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    description: 'Create reusable stateful logic with custom hooks!',
    explanation: `Custom hooks are JavaScript functions that start with "use" and can call other hooks. They let you extract component logic into reusable functions.

Key concepts:
- Extract and reuse stateful logic
- Follow hook naming convention (useXxx)
- Can use other hooks inside
- Share logic between components
- Keep components clean and focused`,
    animationScript: `Show custom hook extraction:
Component with complex logic → extract to custom hook → multiple components use same hook
Highlight code reuse and cleaner components`,
    scenario: `🧩 You have duplicate logic across components. Your mission is to extract it into reusable custom hooks.`,
    challenges: [
      {
        id: 'create-use-counter',
        title: 'Create useCounter Hook',
        description: 'Extract counter logic into a reusable custom hook',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `// Create a custom useCounter hook and use it in components
import React, { useState } from 'react';

// Create custom hook here
function useCounter() {
  // Implement counter logic with:
  // - count state
  // - increment function
  // - decrement function
  // - reset function
  // - set function (to set specific value)
}

// Component 1: Simple Counter
function SimpleCounter() {
  // Use your custom hook here

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Simple Counter</h3>
      <p>Count: {/* show count */}</p>
      <button>+</button>
      <button>-</button>
      <button>Reset</button>
    </div>
  );
}

// Component 2: Step Counter
function StepCounter() {
  // Use your custom hook here
  const [step, setStep] = useState(1);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Step Counter</h3>
      <p>Count: {/* show count */}</p>
      <p>Step: {step}</p>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
      />
      <button>+ Step</button>
      <button>- Step</button>
      <button>Reset</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Custom Hook Demo</h1>
      <SimpleCounter />
      <StepCounter />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

// Custom useCounter hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = (step = 1) => {
    setCount(prev => prev + step);
  };

  const decrement = (step = 1) => {
    setCount(prev => prev - step);
  };

  const reset = () => {
    setCount(initialValue);
  };

  const set = (value) => {
    setCount(value);
  };

  return {
    count,
    increment,
    decrement,
    reset,
    set
  };
}

// Component 1: Simple Counter
function SimpleCounter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Simple Counter</h3>
      <p>Count: {count}</p>
      <button onClick={() => increment()}>+</button>
      <button onClick={() => decrement()} style={{ margin: '0 10px' }}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Component 2: Step Counter
function StepCounter() {
  const { count, increment, decrement, reset } = useCounter(10);
  const [step, setStep] = useState(1);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Step Counter</h3>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
        style={{ width: '60px', marginRight: '10px' }}
      />
      <button onClick={() => increment(step)}>+ Step</button>
      <button onClick={() => decrement(step)} style={{ margin: '0 10px' }}>- Step</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Component 3: Bonus - Limit Counter
function LimitCounter() {
  const { count, increment, decrement, reset, set } = useCounter(5);
  const max = 10;
  const min = 0;

  const safeIncrement = () => {
    if (count < max) increment();
  };

  const safeDecrement = () => {
    if (count > min) decrement();
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Limited Counter ({min}-{max})</h3>
      <p>Count: {count}</p>
      <button onClick={safeIncrement} disabled={count >= max}>+</button>
      <button onClick={safeDecrement} disabled={count <= min} style={{ margin: '0 10px' }}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => set(max)} style={{ marginLeft: '10px' }}>Max</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Custom Hook Demo</h1>
      <SimpleCounter />
      <StepCounter />
      <LimitCounter />
    </div>
  );
}

export default App;`
        },
        hints: [
          'Custom hooks are functions that start with "use"',
          'Return an object with values and functions',
          'Use other hooks inside custom hooks',
          'Make hooks flexible with parameters'
        ]
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    prerequisites: ['useref-basics'],
    nextTopics: ['context-api']
  },

  // 13. Context API - Global State Management
  {
    id: 'context-api',
    title: 'Context API - Global State Management',
    description: 'Share state across components without prop drilling!',
    explanation: `React Context provides a way to pass data through the component tree without having to pass props down manually at every level. It's designed to share data that can be considered "global" for a tree of React components.

Key concepts:
- Avoid prop drilling
- Global state management
- Provider and Consumer pattern
- useContext hook
- When to use Context vs props`,
    animationScript: `Show prop drilling problem:
Parent → Child → Grandchild → Great-grandchild (props passed through each level)
Then show Context solution:
Provider wraps tree → any component can access context directly`,
    scenario: `🧩 You have deeply nested components that need shared state. Your mission is to implement Context API for global state management.`,
    challenges: [
      {
        id: 'theme-context',
        title: 'Create Theme Context',
        description: 'Implement a theme system using Context API',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '30 min',
        xpReward: 130,
        code: {
          initial: `// Create a theme context system
import React, { createContext, useContext, useState } from 'react';

// 1. Create Theme Context
const ThemeContext = createContext();

// 2. Create Theme Provider Component
function ThemeProvider({ children }) {
  // Add theme state and toggle function

  return (
    <ThemeContext.Provider value={/* provide theme data */}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Create custom hook to use theme
function useTheme() {
  // Return theme context
}

// 4. Header Component
function Header() {
  // Use theme context

  return (
    <header style={{ /* apply theme styles */ }}>
      <h1>My App</h1>
      <button>Toggle Theme</button>
    </header>
  );
}

// 5. Content Component
function Content() {
  // Use theme context

  return (
    <main style={{ /* apply theme styles */ }}>
      <h2>Welcome to the app!</h2>
      <p>This content adapts to the current theme.</p>
    </main>
  );
}

// 6. Footer Component
function Footer() {
  // Use theme context

  return (
    <footer style={{ /* apply theme styles */ }}>
      <p>© 2024 My App. Current theme: {/* show current theme */}</p>
    </footer>
  );
}

// 7. Main App
function App() {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;`,
          solution: `import React, { createContext, useContext, useState } from 'react';

// 1. Create Theme Context
const ThemeContext = createContext();

// 2. Theme Provider Component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const themes = {
    light: {
      background: '#ffffff',
      color: '#000000',
      headerBg: '#f8f9fa',
      footerBg: '#e9ecef'
    },
    dark: {
      background: '#121212',
      color: '#ffffff',
      headerBg: '#1e1e1e',
      footerBg: '#2d2d2d'
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    themes: themes[theme],
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook to use theme
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4. Header Component
function Header() {
  const { themes, toggleTheme, theme } = useTheme();

  return (
    <header style={{
      backgroundColor: themes.headerBg,
      color: themes.color,
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1>My App</h1>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: themes.color,
          color: themes.background,
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>
    </header>
  );
}

// 5. Content Component
function Content() {
  const { themes } = useTheme();

  return (
    <main style={{
      backgroundColor: themes.background,
      color: themes.color,
      padding: '40px',
      minHeight: '400px'
    }}>
      <h2>Welcome to the app!</h2>
      <p>This content adapts to the current theme.</p>
      <div style={{
        marginTop: '20px',
        padding: '20px',
        border: \`1px solid \${themes.color}\`,
        borderRadius: '5px'
      }}>
        <h3>Theme Demo</h3>
        <p>Notice how all components automatically update when you change the theme!</p>
        <p>This is the power of React Context - no prop drilling needed.</p>
      </div>
    </main>
  );
}

// 6. Footer Component
function Footer() {
  const { themes, theme } = useTheme();

  return (
    <footer style={{
      backgroundColor: themes.footerBg,
      color: themes.color,
      padding: '20px',
      textAlign: 'center'
    }}>
      <p>© 2024 My App. Current theme: <strong>{theme}</strong></p>
    </footer>
  );
}

// 7. Main App
function App() {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <Content />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;`
        },
        hints: [
          'Create context with createContext()',
          'Wrap components with Provider',
          'Use useContext hook to consume context',
          'Create custom hooks for better API'
        ]
      }
    ],
    estimatedTime: '55 min',
    difficulty: 'intermediate',
    prerequisites: ['custom-hooks'],
    nextTopics: ['performance-optimization']
  },

  // 14. Performance Optimization
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Optimize React apps with React.memo, useMemo, and useCallback!',
    explanation: `React provides several tools to optimize performance by preventing unnecessary re-renders and expensive calculations.

Key concepts:
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for function memoization
- When and when not to optimize
- Profiling and measuring performance`,
    animationScript: `Show performance optimization in action:
Without optimization: Parent re-renders → all children re-render (slow)
With optimization: Parent re-renders → only changed children re-render (fast)
Highlight memoization preventing unnecessary work`,
    scenario: `🧩 Your app has performance issues with unnecessary re-renders. Your mission is to optimize it using React's performance tools.`,
    challenges: [
      {
        id: 'memo-optimization',
        title: 'Optimize with React.memo',
        description: 'Prevent unnecessary re-renders using React.memo',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        xpReward: 140,
        code: {
          initial: `// Optimize this component to prevent unnecessary re-renders
import React, { useState, memo, useMemo, useCallback } from 'react';

// Expensive component that re-renders too often
function ExpensiveChild({ name, count, onIncrement }) {
  console.log(\`ExpensiveChild (\${name}) rendered\`);

  // Simulate expensive calculation
  const expensiveValue = (() => {
    console.log(\`Calculating expensive value for \${name}\`);
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  })();

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      margin: '10px'
    }}>
      <h3>{name}</h3>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(0);

  // These functions are recreated on every render
  const increment1 = () => setCount1(c => c + 1);
  const increment2 = () => setCount2(c => c + 1);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Performance Optimization Demo</h1>

      <button onClick={() => setUnrelatedState(s => s + 1)}>
        Unrelated State: {unrelatedState}
      </button>

      {/* Both children re-render when unrelated state changes */}
      <ExpensiveChild
        name="Child 1"
        count={count1}
        onIncrement={increment1}
      />
      <ExpensiveChild
        name="Child 2"
        count={count2}
        onIncrement={increment2}
      />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, memo, useMemo, useCallback } from 'react';

// Optimized component with React.memo and useMemo
const ExpensiveChild = memo(function ExpensiveChild({ name, count, onIncrement }) {
  console.log(\`ExpensiveChild (\${name}) rendered\`);

  // Memoize expensive calculation
  const expensiveValue = useMemo(() => {
    console.log(\`Calculating expensive value for \${name}\`);
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  }, [name]); // Only recalculate if name changes

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      margin: '10px'
    }}>
      <h3>{name}</h3>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
});

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(0);

  // Memoize callback functions to prevent unnecessary re-renders
  const increment1 = useCallback(() => {
    setCount1(c => c + 1);
  }, []);

  const increment2 = useCallback(() => {
    setCount2(c => c + 1);
  }, []);

  // Memoize some derived state
  const totalCount = useMemo(() => {
    console.log('Calculating total count');
    return count1 + count2;
  }, [count1, count2]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Performance Optimization Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setUnrelatedState(s => s + 1)}>
          Unrelated State: {unrelatedState}
        </button>
        <p>Total Count: {totalCount}</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Open console to see render logs. Notice how children don't re-render
          when unrelated state changes!
        </p>
      </div>

      {/* Now children only re-render when their props actually change */}
      <ExpensiveChild
        name="Child 1"
        count={count1}
        onIncrement={increment1}
      />
      <ExpensiveChild
        name="Child 2"
        count={count2}
        onIncrement={increment2}
      />
    </div>
  );
}

export default App;`
        },
        hints: [
          'Wrap components with React.memo to prevent unnecessary re-renders',
          'Use useMemo for expensive calculations',
          'Use useCallback to memoize function references',
          'Only optimize when you have actual performance problems'
        ]
      }
    ],
    estimatedTime: '50 min',
    difficulty: 'advanced',
    prerequisites: ['context-api'],
    nextTopics: ['testing-react']
  },

  // 15. Testing React Components
  {
    id: 'testing-react',
    title: 'Testing React Components',
    description: 'Write comprehensive tests with Jest and React Testing Library!',
    explanation: `Testing ensures your React components work correctly and helps prevent bugs. React Testing Library focuses on testing components the way users interact with them.

Key concepts:
- Unit testing vs integration testing
- React Testing Library philosophy
- Testing user interactions
- Mocking and test utilities
- Test-driven development (TDD)`,
    animationScript: `Show testing workflow:
Write test → Run test (fails) → Write component code → Test passes → Refactor
Highlight the red-green-refactor cycle`,
    scenario: `🧩 You need to ensure your components work reliably. Your mission is to write comprehensive tests for React components.`,
    challenges: [
      {
        id: 'test-counter-component',
        title: 'Test Counter Component',
        description: 'Write comprehensive tests for a counter component',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 150,
        code: {
          initial: `// Write tests for this Counter component
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Counter Component to test
function Counter({ initialValue = 0, step = 1 }) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + step);
  const decrement = () => setCount(c => c - step);
  const reset = () => setCount(initialValue);

  return (
    <div>
      <h2 data-testid="count-display">Count: {count}</h2>
      <button data-testid="increment-btn" onClick={increment}>
        +{step}
      </button>
      <button data-testid="decrement-btn" onClick={decrement}>
        -{step}
      </button>
      <button data-testid="reset-btn" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

// Write your tests here
describe('Counter Component', () => {
  test('renders with initial value', () => {
    // Test that component renders with correct initial value
  });

  test('increments count when increment button is clicked', () => {
    // Test increment functionality
  });

  test('decrements count when decrement button is clicked', () => {
    // Test decrement functionality
  });

  test('resets count when reset button is clicked', () => {
    // Test reset functionality
  });

  test('works with custom initial value and step', () => {
    // Test with custom props
  });
});

export default Counter;`,
          solution: `import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Counter Component
function Counter({ initialValue = 0, step = 1 }) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + step);
  const decrement = () => setCount(c => c - step);
  const reset = () => setCount(initialValue);

  return (
    <div>
      <h2 data-testid="count-display">Count: {count}</h2>
      <button data-testid="increment-btn" onClick={increment}>
        +{step}
      </button>
      <button data-testid="decrement-btn" onClick={decrement}>
        -{step}
      </button>
      <button data-testid="reset-btn" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

// Comprehensive tests
describe('Counter Component', () => {
  test('renders with initial value', () => {
    render(<Counter />);

    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
    expect(screen.getByTestId('increment-btn')).toHaveTextContent('+1');
    expect(screen.getByTestId('decrement-btn')).toHaveTextContent('-1');
    expect(screen.getByTestId('reset-btn')).toHaveTextContent('Reset');
  });

  test('increments count when increment button is clicked', () => {
    render(<Counter />);

    const incrementBtn = screen.getByTestId('increment-btn');
    const countDisplay = screen.getByTestId('count-display');

    fireEvent.click(incrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 1');

    fireEvent.click(incrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 2');
  });

  test('decrements count when decrement button is clicked', () => {
    render(<Counter initialValue={5} />);

    const decrementBtn = screen.getByTestId('decrement-btn');
    const countDisplay = screen.getByTestId('count-display');

    fireEvent.click(decrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 4');

    fireEvent.click(decrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 3');
  });

  test('resets count when reset button is clicked', () => {
    render(<Counter initialValue={10} />);

    const incrementBtn = screen.getByTestId('increment-btn');
    const resetBtn = screen.getByTestId('reset-btn');
    const countDisplay = screen.getByTestId('count-display');

    // Change the count
    fireEvent.click(incrementBtn);
    fireEvent.click(incrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 12');

    // Reset should go back to initial value
    fireEvent.click(resetBtn);
    expect(countDisplay).toHaveTextContent('Count: 10');
  });

  test('works with custom initial value and step', () => {
    render(<Counter initialValue={100} step={5} />);

    const incrementBtn = screen.getByTestId('increment-btn');
    const decrementBtn = screen.getByTestId('decrement-btn');
    const countDisplay = screen.getByTestId('count-display');

    // Check initial state
    expect(countDisplay).toHaveTextContent('Count: 100');
    expect(incrementBtn).toHaveTextContent('+5');
    expect(decrementBtn).toHaveTextContent('-5');

    // Test custom step increment
    fireEvent.click(incrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 105');

    // Test custom step decrement
    fireEvent.click(decrementBtn);
    fireEvent.click(decrementBtn);
    expect(countDisplay).toHaveTextContent('Count: 95');
  });

  test('handles multiple rapid clicks correctly', () => {
    render(<Counter />);

    const incrementBtn = screen.getByTestId('increment-btn');
    const countDisplay = screen.getByTestId('count-display');

    // Rapid clicks
    for (let i = 0; i < 10; i++) {
      fireEvent.click(incrementBtn);
    }

    expect(countDisplay).toHaveTextContent('Count: 10');
  });
});

export default Counter;`
        },
        hints: [
          'Use render() to render components in tests',
          'Use screen.getByTestId() to find elements',
          'Use fireEvent.click() to simulate user interactions',
          'Use expect().toHaveTextContent() for assertions'
        ]
      }
    ],
    estimatedTime: '60 min',
    difficulty: 'advanced',
    prerequisites: ['performance-optimization'],
    nextTopics: ['react-router']
  },

  // 16. React Router - Navigation & Routing
  {
    id: 'react-router',
    title: 'React Router - Navigation & Routing',
    description: 'Build single-page applications with client-side routing!',
    explanation: `React Router enables navigation among views of various components in a React Application, allows changing the browser URL, and keeps the UI in sync with the URL.

Key concepts:
- BrowserRouter and routing setup
- Route components and path matching
- Navigation with Link and NavLink
- Dynamic routes with parameters
- Programmatic navigation with useNavigate`,
    animationScript: `Show SPA navigation:
User clicks link → URL changes → Router matches route → Component renders
No page refresh, smooth transitions between views`,
    scenario: `🧩 You need to create a multi-page application with navigation. Your mission is to implement routing with React Router.`,
    challenges: [
      {
        id: 'basic-routing',
        title: 'Implement Basic Routing',
        description: 'Create a multi-page app with React Router',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        xpReward: 140,
        code: {
          initial: `// Implement routing for this app
import React from 'react';
// Import React Router components here

function App() {
  return (
    <div>
      <nav>
        {/* Add navigation links here */}
      </nav>

      <main>
        {/* Add routes here */}
      </main>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our React Router demo!</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>Learn more about our company.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h1>Contact Page</h1>
      <p>Get in touch with us!</p>
    </div>
  );
}

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default App;`,
          solution: `import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6'
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#007bff' : '#333',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#007bff' : '#333',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#007bff' : '#333',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              Contact
            </NavLink>
          </div>
        </nav>

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our React Router demo!</p>
      <p>Navigate using the links above to see routing in action.</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>Learn more about our company.</p>
      <p>We specialize in React development and training.</p>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h1>Contact Page</h1>
      <p>Get in touch with us!</p>
      <div style={{ marginTop: '20px' }}>
        <p>Email: contact@example.com</p>
        <p>Phone: (555) 123-4567</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default App;`
        },
        hints: [
          'Wrap app with BrowserRouter',
          'Use Routes and Route components to define routes',
          'Use NavLink for navigation with active states',
          'Use "*" path for catch-all 404 routes'
        ]
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'advanced',
    prerequisites: ['testing-react'],
    nextTopics: ['deployment']
  },

  // 17. Deployment & Production
  {
    id: 'deployment',
    title: 'Deployment & Production',
    description: 'Deploy your React apps to production with modern hosting!',
    explanation: `Deploying React applications involves building optimized production bundles and hosting them on various platforms. Modern deployment platforms make this process seamless.

Key concepts:
- Production builds with npm run build
- Static site hosting (Vercel, Netlify, GitHub Pages)
- Environment variables
- Performance optimization for production
- Continuous deployment with Git`,
    animationScript: `Show deployment pipeline:
Code changes → Git push → Build process → Deploy to hosting → Live website
Highlight the automated deployment workflow`,
    scenario: `🧩 You've built an amazing React app and need to share it with the world. Your mission is to deploy it to production.`,
    challenges: [
      {
        id: 'production-build',
        title: 'Create Production Build',
        description: 'Optimize your app for production deployment',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        xpReward: 120,
        code: {
          initial: `// Optimize this app for production deployment
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This should use environment variables for API URL
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Production App</h1>
      {data ? (
        <div>
          <h2>Data from API:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>No data available</p>
      )}

      {/* Add production-ready features */}
      <footer>
        <p>Version: 1.0.0</p>
        <p>Environment: Development</p>
      </footer>
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use environment variable for API URL
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    fetch(\`\${apiUrl}/api/data\`)
      .then(res => {
        if (!res.ok) {
          throw new Error(\`HTTP error! status: \${res.status}\`);
        }
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Oops! Something went wrong</h1>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header>
        <h1>My Production App</h1>
        <p>A production-ready React application</p>
      </header>

      <main>
        {data ? (
          <div>
            <h2>Data from API:</h2>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '5px',
              overflow: 'auto'
            }}>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No data available at the moment.</p>
            <button onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        )}
      </main>

      <footer style={{
        marginTop: '40px',
        padding: '20px',
        borderTop: '1px solid #dee2e6',
        textAlign: 'center',
        color: '#6c757d'
      }}>
        <p>Version: {process.env.REACT_APP_VERSION || '1.0.0'}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Build Date: {process.env.REACT_APP_BUILD_DATE || new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}

// Production deployment checklist:
// 1. Create .env file with REACT_APP_API_URL
// 2. Run 'npm run build' to create optimized build
// 3. Test the build locally with 'npx serve -s build'
// 4. Deploy build folder to hosting platform
// 5. Set up environment variables on hosting platform

export default App;`
        },
        hints: [
          'Use environment variables for configuration',
          'Add proper error handling for production',
          'Include loading states and error boundaries',
          'Test your production build before deploying'
        ]
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'advanced',
    prerequisites: ['react-router'],
    nextTopics: ['state-management-advanced']
  },

  // 18. Advanced State Management
  {
    id: 'state-management-advanced',
    title: 'Advanced State Management',
    description: 'Master useReducer, Redux Toolkit, and complex state patterns!',
    explanation: `Advanced state management techniques for complex applications including useReducer for complex state logic and Redux Toolkit for global state management.

Key concepts:
- useReducer for complex state logic
- Redux Toolkit for global state
- State management patterns
- Middleware and async actions
- State normalization`,
    animationScript: `Show complex state flow:
Multiple components → actions → reducer → state updates → UI updates
Highlight centralized state management benefits`,
    scenario: `🧩 You have a complex app with intricate state logic. Your mission is to implement proper state management using useReducer and global state solutions.`,
    challenges: [
      {
        id: 'use-reducer-todo',
        title: 'Todo App with useReducer',
        description: 'Build a todo application using useReducer for state management',
        type: 'mini-project',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 160,
        code: {
          initial: `// Implement todo app with useReducer
import React, { useReducer, useState } from 'react';

// Define initial state and reducer here
const initialState = {
  todos: [],
  filter: 'all' // all, active, completed
};

function todoReducer(state, action) {
  // Implement reducer logic
  switch (action.type) {
    default:
      return state;
  }
}

function TodoApp() {
  // Use useReducer here
  const [inputValue, setInputValue] = useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Advanced Todo App</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
          style={{ padding: '10px', width: '300px' }}
        />
        <button style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Add Todo
        </button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button>All</button>
        <button>Active</button>
        <button>Completed</button>
      </div>

      <div>
        {/* Render todos here */}
      </div>
    </div>
  );
}

export default TodoApp;`,
          solution: `import React, { useReducer, useState } from 'react';

const initialState = {
  todos: [],
  filter: 'all',
  nextId: 1
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            text: action.payload,
            completed: false,
            createdAt: new Date().toISOString()
          }
        ],
        nextId: state.nextId + 1
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue.trim() });
      setInputValue('');
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = () => {
    if (editValue.trim()) {
      dispatch({
        type: 'EDIT_TODO',
        payload: { id: editingId, text: editValue.trim() }
      });
    }
    setEditingId(null);
    setEditValue('');
  };

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: state.todos.length,
    active: state.todos.filter(t => !t.completed).length,
    completed: state.todos.filter(t => t.completed).length
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Advanced Todo App</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo"
          style={{ padding: '10px', width: '300px' }}
        />
        <button
          onClick={addTodo}
          style={{ padding: '10px 20px', marginLeft: '10px' }}
        >
          Add Todo
        </button>
      </div>

      <div style={{ margin: '20px 0' }}>
        {['all', 'active', 'completed'].map(filter => (
          <button
            key={filter}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: filter })}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              backgroundColor: state.filter === filter ? '#007bff' : '#f8f9fa',
              color: state.filter === filter ? 'white' : '#333',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} ({
              filter === 'all' ? stats.total :
              filter === 'active' ? stats.active : stats.completed
            })
          </button>
        ))}

        {stats.completed > 0 && (
          <button
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            style={{
              padding: '8px 16px',
              marginLeft: '10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Completed
          </button>
        )}
      </div>

      <div>
        {filteredTodos.map(todo => (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              marginBottom: '5px',
              backgroundColor: todo.completed ? '#f8f9fa' : 'white'
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              style={{ marginRight: '10px' }}
            />

            {editingId === todo.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                onBlur={saveEdit}
                style={{ flex: 1, padding: '5px' }}
                autoFocus
              />
            ) : (
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#6c757d' : '#333'
                }}
                onDoubleClick={() => startEdit(todo)}
              >
                {todo.text}
              </span>
            )}

            <button
              onClick={() => startEdit(todo)}
              style={{
                padding: '5px 10px',
                marginLeft: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Edit
            </button>

            <button
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
              style={{
                padding: '5px 10px',
                marginLeft: '5px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '40px' }}>
            {state.filter === 'all' ? 'No todos yet. Add one above!' :
             state.filter === 'active' ? 'No active todos!' :
             'No completed todos!'}
          </p>
        )}
      </div>
    </div>
  );
}

export default TodoApp;`
        }
      }
    ],
    estimatedTime: '60 min',
    difficulty: 'advanced',
    prerequisites: ['deployment'],
    nextTopics: ['error-boundaries']
  },

  // 19. Error Boundaries & Error Handling
  {
    id: 'error-boundaries',
    title: 'Error Boundaries & Error Handling',
    description: 'Handle errors gracefully with Error Boundaries and error handling patterns!',
    explanation: `Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.

Key concepts:
- Error boundaries with class components
- Error handling patterns
- Graceful error recovery
- Error logging and monitoring
- User-friendly error messages`,
    animationScript: `Show error boundary in action:
Component throws error → Error boundary catches → Fallback UI displays → User sees friendly message
Highlight error containment preventing app crash`,
    scenario: `🧩 Your app needs to handle errors gracefully without crashing. Your mission is to implement error boundaries and proper error handling.`,
    challenges: [
      {
        id: 'create-error-boundary',
        title: 'Create Error Boundary',
        description: 'Implement error boundaries to catch and handle component errors',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        xpReward: 140,
        code: {
          initial: `// Create an Error Boundary component
import React, { Component, useState } from 'react';

// Create Error Boundary class component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Add error state
  }

  // Add error boundary methods

  render() {
    // Return fallback UI if error, otherwise children
  }
}

// Buggy component that might throw errors
function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Something went wrong in BuggyComponent!');
  }

  return (
    <div style={{ padding: '20px', border: '2px solid green' }}>
      <h3>✅ Working Component</h3>
      <p>This component is working fine!</p>
    </div>
  );
}

// Another component that might have errors
function AnotherBuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    // Simulate a runtime error
    const obj = null;
    return <div>{obj.nonExistentProperty}</div>;
  }

  return (
    <div style={{ padding: '20px', border: '2px solid blue' }}>
      <h3>🔵 Another Working Component</h3>
      <p>This component is also working!</p>
    </div>
  );
}

function App() {
  const [throwError1, setThrowError1] = useState(false);
  const [throwError2, setThrowError2] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Error Boundary Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setThrowError1(!throwError1)}>
          {throwError1 ? 'Fix' : 'Break'} Component 1
        </button>
        <button
          onClick={() => setThrowError2(!throwError2)}
          style={{ marginLeft: '10px' }}
        >
          {throwError2 ? 'Fix' : 'Break'} Component 2
        </button>
      </div>

      {/* Wrap components with Error Boundary */}
      <BuggyComponent shouldThrow={throwError1} />
      <AnotherBuggyComponent shouldThrow={throwError2} />
    </div>
  );
}

export default App;`,
          solution: `import React, { Component, useState } from 'react';

// Error Boundary class component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          padding: '20px',
          border: '2px solid red',
          borderRadius: '8px',
          backgroundColor: '#fee',
          margin: '10px 0'
        }}>
          <h3>🚨 Oops! Something went wrong</h3>
          <p>We're sorry, but something unexpected happened.</p>

          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Try Again
          </button>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Buggy component that might throw errors
function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Something went wrong in BuggyComponent!');
  }

  return (
    <div style={{ padding: '20px', border: '2px solid green', margin: '10px 0' }}>
      <h3>✅ Working Component</h3>
      <p>This component is working fine!</p>
    </div>
  );
}

// Another component that might have errors
function AnotherBuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    // Simulate a runtime error
    const obj = null;
    return <div>{obj.nonExistentProperty}</div>;
  }

  return (
    <div style={{ padding: '20px', border: '2px solid blue', margin: '10px 0' }}>
      <h3>🔵 Another Working Component</h3>
      <p>This component is also working!</p>
    </div>
  );
}

function App() {
  const [throwError1, setThrowError1] = useState(false);
  const [throwError2, setThrowError2] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Error Boundary Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setThrowError1(!throwError1)}
          style={{
            padding: '10px 20px',
            backgroundColor: throwError1 ? '#28a745' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {throwError1 ? 'Fix' : 'Break'} Component 1
        </button>
        <button
          onClick={() => setThrowError2(!throwError2)}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: throwError2 ? '#28a745' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {throwError2 ? 'Fix' : 'Break'} Component 2
        </button>
      </div>

      <p style={{ marginBottom: '20px', color: '#666' }}>
        Click the buttons above to simulate errors. Notice how error boundaries
        catch errors and show fallback UI instead of crashing the entire app.
      </p>

      {/* Separate error boundaries for each component */}
      <ErrorBoundary>
        <BuggyComponent shouldThrow={throwError1} />
      </ErrorBoundary>

      <ErrorBoundary>
        <AnotherBuggyComponent shouldThrow={throwError2} />
      </ErrorBoundary>
    </div>
  );
}

export default App;`
        }
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'advanced',
    prerequisites: ['state-management-advanced'],
    nextTopics: []
  }
];
