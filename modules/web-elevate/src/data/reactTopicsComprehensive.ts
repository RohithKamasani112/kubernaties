// Comprehensive React Topics from react-learning-info.txt
// This file contains all 46 React topics to be integrated into the learning path
// Each topic includes: explanation, code examples, playground challenges, and mini-projects

export const comprehensiveReactTopics = [
  {
    id: 'what-is-react',
    title: 'What is React?',
    description: 'Understanding React\'s declarative approach and Virtual DOM',
    explanation: `React is a free and open-source JavaScript library for building user interfaces (UIs). Maintained by Meta (formerly Facebook) and a vast developer community, React helps you build component-based UIs for web and mobile apps.

While commonly called a "framework," React is technically a library focused on the View (V) in MVC (Model-View-Controller) architecture. It can be extended with libraries for routing, state management, and more.

Key Concepts:

1. Declarative Approach:
You describe what the UI should look like for a given application state. React takes care of updating the DOM efficiently when that state changes.

Imperative (Vanilla JS): "You manually tell the browser what to do."
Declarative (React): "You describe what you want, and React handles the DOM updates."

Analogy: Imagine ordering a pizza.
- Imperative: "Take dough, roll it, add sauce, then cheese, then bake…"
- Declarative: "Give me a pepperoni pizza." (Let React do the steps.)

2. Virtual DOM (VDOM):
Problem: Direct DOM manipulation is slow and inefficient.
Solution: React uses a Virtual DOM—an in-memory representation of the real DOM.

How it Works:
- On state change, React builds a new Virtual DOM tree.
- It compares (diffs) this tree with the previous one.
- It applies only the necessary changes to the real DOM.
Result: Efficient UI updates without full page reloads.`,

    bestPractices: [
      'Think in reusable components',
      'Embrace the declarative paradigm',
      'Avoid direct DOM manipulation (document.querySelector is a red flag)',
      'Keep components small and focused'
    ],

    realWorldUseCases: [
      '🖥️ Single Page Apps (SPAs): Facebook, Instagram, Airbnb',
      '📊 Complex Dashboards: Analytics tools, CRM systems',
      '📱 Mobile Apps: With React Native for iOS and Android'
    ],

    animationScript: `A split screen:
Left: Vanilla JS → document.getElementById() → DOM → slow UI update
Right: React → <Component /> → Virtual DOM → diff → fast UI update
Highlight "Virtual DOM" and "Component" with popups
Gears rotate as the Virtual DOM syncs with real DOM
A user clicks a button → React shows the re-render with minimal updates`,

    challenges: [
      {
        id: 'vanilla-to-react',
        title: 'Convert Vanilla JS to React',
        description: 'Transform imperative DOM manipulation to declarative React components',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        instructions: [
          'Convert the vanilla JavaScript counter to React',
          'Use useState hook for state management',
          'Replace DOM manipulation with declarative JSX',
          'Ensure the component re-renders on state change'
        ],
        hints: [
          'Import React and useState from react',
          'Create a functional component',
          'Use useState to manage the counter state',
          'Use onClick event handler instead of addEventListener'
        ],
        testCriteria: [
          'Component renders without errors',
          'Counter increments when button is clicked',
          'Uses React hooks instead of DOM manipulation',
          'Follows React naming conventions'
        ],
        code: {
          initial: `// Vanilla JS Code - Convert this to React
// <button onclick="changeText()">Click</button>
// <p id="output"></p>

// <script>
//   function changeText() {
//     document.getElementById('output').innerText = 'Hello!';
//   }
// </script>

import React, { useState } from 'react';

function GreetingApp() {
  // TODO: Add state for message

  // TODO: Add click handler function

  return (
    <div>
      {/* TODO: Add button and paragraph */}
    </div>
  );
}

export default GreetingApp;`,
          solution: `import React, { useState } from 'react';

function GreetingApp() {
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

export default GreetingApp;`
        }
      },
      {
        id: 'build-greeting-app',
        title: 'Build a GreetingApp',
        description: 'Create a complete greeting application with multiple interactions',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 100,
        instructions: [
          'Create a greeting app that shows different messages',
          'Add buttons for different greetings (Hello, Goodbye, Welcome)',
          'Display the current greeting in a styled paragraph',
          'Add a reset button to clear the message'
        ],
        hints: [
          'Use multiple event handlers for different greetings',
          'Consider using conditional rendering for the reset button',
          'Add some basic styling with className',
          'Think about the user experience flow'
        ],
        testCriteria: [
          'App renders without errors',
          'All greeting buttons work correctly',
          'Reset functionality clears the message',
          'UI is user-friendly and intuitive'
        ],
        code: {
          initial: `import React, { useState } from 'react';

function GreetingApp() {
  // TODO: Add state for current greeting

  // TODO: Add handler functions for different greetings

  // TODO: Add reset handler

  return (
    <div className="greeting-app">
      <h1>Greeting App</h1>
      {/* TODO: Add greeting buttons */}
      {/* TODO: Add message display */}
      {/* TODO: Add reset button (conditional) */}
    </div>
  );
}

export default GreetingApp;`,
          solution: `import React, { useState } from 'react';

function GreetingApp() {
  const [greeting, setGreeting] = useState('');

  const handleHello = () => setGreeting('Hello! Nice to meet you! 👋');
  const handleGoodbye = () => setGreeting('Goodbye! See you later! 👋');
  const handleWelcome = () => setGreeting('Welcome! We\'re glad you\'re here! 🎉');
  const handleReset = () => setGreeting('');

  return (
    <div className="greeting-app" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Greeting App</h1>

      <div style={{ margin: '20px 0' }}>
        <button onClick={handleHello} style={{ margin: '5px', padding: '10px 20px' }}>
          Say Hello
        </button>
        <button onClick={handleGoodbye} style={{ margin: '5px', padding: '10px 20px' }}>
          Say Goodbye
        </button>
        <button onClick={handleWelcome} style={{ margin: '5px', padding: '10px 20px' }}>
          Say Welcome
        </button>
      </div>

      {greeting && (
        <div>
          <p style={{
            fontSize: '18px',
            color: '#2563eb',
            margin: '20px 0',
            padding: '15px',
            backgroundColor: '#eff6ff',
            borderRadius: '8px'
          }}>
            {greeting}
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default GreetingApp;`
        }
      }
    ]
  },

  {
    id: 'jsx-basics',
    title: 'JSX – HTML in JavaScript',
    description: 'Learn JSX syntax and how it compiles to JavaScript',
    explanation: `JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML inside JavaScript. React components use JSX to describe UI in a declarative way.

What is JSX?
JSX looks like HTML but is actually JavaScript. It gets compiled (transpiled) into React.createElement() calls.

Example:
JSX: <h1>Hello World</h1>
Compiles to: React.createElement('h1', null, 'Hello World')

Key Rules of JSX:
1. Return a single parent element (or use React.Fragment)
2. Close all tags (including self-closing ones like <img />)
3. Use camelCase for attributes (className instead of class)
4. Use curly braces {} for JavaScript expressions
5. Comments use {/* */} syntax

Why JSX?
- More readable than React.createElement()
- Familiar HTML-like syntax
- Better developer experience with syntax highlighting
- Easier to visualize component structure`,

    bestPractices: [
      'Always close self-closing tags with />',
      'Use className instead of class',
      'Wrap multi-line JSX in parentheses',
      'Use fragments to avoid unnecessary div wrappers',
      'Keep JSX expressions simple and readable'
    ],

    realWorldUseCases: [
      '🎨 Building UI components with familiar HTML syntax',
      '🔄 Mixing JavaScript logic with markup',
      '📱 Creating reusable component templates',
      '🎯 Conditional rendering based on state'
    ],

    challenges: [
      {
        id: 'fix-jsx-syntax',
        title: 'Fix JSX Syntax Errors',
        description: 'Identify and fix common JSX syntax errors',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        instructions: [
          'Fix all JSX syntax errors in the provided code',
          'Ensure all tags are properly closed',
          'Use correct attribute names',
          'Wrap the JSX in a single parent element'
        ],
        hints: [
          'Look for unclosed tags',
          'Check for class vs className',
          'Make sure img tags are self-closing',
          'Wrap multiple elements in a div or Fragment'
        ],
        testCriteria: [
          'Code compiles without JSX errors',
          'All HTML attributes use correct JSX syntax',
          'All tags are properly closed',
          'Component renders successfully'
        ],
        code: {
          initial: `import React from 'react';

function BrokenComponent() {
  const name = "React Developer";
  const isLoggedIn = true;

  return (
    // Fix the JSX errors below
    <h1>Welcome to JSX!</h1>
    <img src="logo.png" alt="Logo">
    <p class="greeting">Hello, {name}!</p>
    <div>
      {isLoggedIn && <span>You are logged in</span>}
    </div>
    <input type="text" placeholder="Enter your name">
    <!-- This is a comment -->
  );
}

export default BrokenComponent;`,
          solution: `import React from 'react';

function FixedComponent() {
  const name = "React Developer";
  const isLoggedIn = true;

  return (
    <div>
      <h1>Welcome to JSX!</h1>
      <img src="logo.png" alt="Logo" />
      <p className="greeting">Hello, {name}!</p>
      <div>
        {isLoggedIn && <span>You are logged in</span>}
      </div>
      <input type="text" placeholder="Enter your name" />
      {/* This is a JSX comment */}
    </div>
  );
}

export default FixedComponent;`
        }
      },
      {
        id: 'build-jsx-card',
        title: 'Build a JSXCard',
        description: 'Create a user profile card using JSX with dynamic content',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 100,
        instructions: [
          'Create a user profile card component',
          'Include user avatar, name, title, and bio',
          'Use JSX expressions for dynamic content',
          'Add conditional rendering for optional fields',
          'Style the card with inline styles or className'
        ],
        hints: [
          'Use curly braces for JavaScript expressions',
          'Consider using conditional rendering with &&',
          'Remember to use className for CSS classes',
          'You can use template literals in JSX expressions'
        ],
        testCriteria: [
          'Card displays all user information correctly',
          'Uses JSX expressions for dynamic content',
          'Implements conditional rendering properly',
          'Follows JSX syntax rules correctly'
        ],
        code: {
          initial: `import React from 'react';

function UserCard() {
  const user = {
    name: "Sarah Johnson",
    title: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    bio: "Passionate about creating beautiful user experiences with React",
    location: "San Francisco, CA",
    isOnline: true,
    website: "https://sarahjohnson.dev"
  };

  return (
    <div className="user-card">
      {/* TODO: Build the user card JSX */}
      {/* Include: avatar, name, title, bio, location, online status */}
      {/* Use conditional rendering for optional fields */}
    </div>
  );
}

export default UserCard;`,
          solution: `import React from 'react';

function UserCard() {
  const user = {
    name: "Sarah Johnson",
    title: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    bio: "Passionate about creating beautiful user experiences with React",
    location: "San Francisco, CA",
    isOnline: true,
    website: "https://sarahjohnson.dev"
  };

  return (
    <div className="user-card" style={{
      maxWidth: '300px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        {user.isOnline && (
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            marginLeft: '8px'
          }} />
        )}
      </div>

      <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', textAlign: 'center' }}>
        {user.name}
      </h2>

      <p style={{ margin: '0 0 12px 0', color: '#6b7280', textAlign: 'center' }}>
        {user.title}
      </p>

      {user.bio && (
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.5' }}>
          {user.bio}
        </p>
      )}

      {user.location && (
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>
          📍 {user.location}
        </p>
      )}

      {user.website && (
        <a
          href={user.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          Visit Website
        </a>
      )}
    </div>
  );
}

export default UserCard;`
        }
      }
    ]
  },

  {
    id: 'components-basics',
    title: 'Components – The Building Blocks',
    description: 'Learn to create reusable UI components',
    explanation: `A component is a reusable, self-contained unit of UI. React apps are made by composing components.

Two Types of Components:

1. Functional Components (Recommended):
- Written as JavaScript functions
- Use hooks for state and lifecycle
- Simpler and more modern approach

2. Class Components (Legacy):
- Written as ES6 classes
- Use this.state and lifecycle methods
- Still supported but not recommended for new code

Component Rules:
- Component names must start with a capital letter
- Components must return JSX (or null)
- Components should be pure (same input = same output)
- Keep components small and focused on one responsibility

Best Practices:
- One component per file
- Use descriptive names
- Extract reusable logic into custom hooks
- Compose complex UIs from simple components`,

    bestPractices: [
      'Start component names with capital letters',
      'Keep components small and focused',
      'Use functional components with hooks',
      'Extract reusable components',
      'Follow single responsibility principle'
    ],

    realWorldUseCases: [
      '🧩 Reusable UI elements (buttons, cards, modals)',
      '📄 Page layouts and sections',
      '🔄 Interactive widgets and controls',
      '📊 Data visualization components'
    ],

    challenges: [
      {
        id: 'extract-reusable-components',
        title: 'Extract Reusable Components',
        description: 'Break down a monolithic component into smaller, reusable pieces',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        instructions: [
          'Extract the Button component from the monolithic code',
          'Extract the UserInfo component',
          'Make components reusable with props',
          'Compose the main component using the extracted components'
        ],
        hints: [
          'Look for repeated patterns in the JSX',
          'Identify logical groupings of elements',
          'Think about what data each component needs',
          'Use props to make components flexible'
        ],
        testCriteria: [
          'Button component is extracted and reusable',
          'UserInfo component is extracted properly',
          'Main component uses the extracted components',
          'All components follow naming conventions'
        ],
        code: {
          initial: `import React from 'react';

// Monolithic component - break this down into smaller components
function UserDashboard() {
  const user = {
    name: "Alex Chen",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  };

  const handleEdit = () => alert('Edit clicked');
  const handleDelete = () => alert('Delete clicked');
  const handleSave = () => alert('Save clicked');

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h1>User Dashboard</h1>

      {/* User Info Section - Extract this */}
      <div style={{
        border: '1px solid #ccc',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>

      {/* Buttons Section - Extract these */}
      <div>
        <button
          onClick={handleEdit}
          style={{
            padding: '8px 16px',
            margin: '4px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          style={{
            padding: '8px 16px',
            margin: '4px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Delete
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            margin: '4px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// TODO: Extract Button component here

// TODO: Extract UserInfo component here

export default UserDashboard;`,
          solution: `import React from 'react';

// Extracted Button component
function Button({ children, onClick, variant = 'primary' }) {
  const getButtonStyle = (variant) => {
    const baseStyle = {
      padding: '8px 16px',
      margin: '4px',
      border: 'none',
      borderRadius: '4px',
      color: 'white',
      cursor: 'pointer'
    };

    const variants = {
      primary: { backgroundColor: '#3b82f6' },
      danger: { backgroundColor: '#ef4444' },
      success: { backgroundColor: '#10b981' }
    };

    return { ...baseStyle, ...variants[variant] };
  };

  return (
    <button onClick={onClick} style={getButtonStyle(variant)}>
      {children}
    </button>
  );
}

// Extracted UserInfo component
function UserInfo({ user }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    }}>
      <img
        src={user.avatar}
        alt={user.name}
        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      />
      <h3 style={{ margin: '8px 0 4px 0' }}>{user.name}</h3>
      <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
    </div>
  );
}

// Main component using extracted components
function UserDashboard() {
  const user = {
    name: "Alex Chen",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  };

  const handleEdit = () => alert('Edit clicked');
  const handleDelete = () => alert('Delete clicked');
  const handleSave = () => alert('Save clicked');

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h1>User Dashboard</h1>

      <UserInfo user={user} />

      <div>
        <Button onClick={handleEdit} variant="primary">
          Edit
        </Button>
        <Button onClick={handleDelete} variant="danger">
          Delete
        </Button>
        <Button onClick={handleSave} variant="success">
          Save
        </Button>
      </div>
    </div>
  );
}

export default UserDashboard;`
        }
      }
    ]
  },

  {
    id: 'props-basics',
    title: 'Props – Passing Data',
    description: 'Learn how to pass data between components',
    explanation: `Props (short for "properties") are a way to pass data from parent to child components in React. They are read-only, and help make components reusable and dynamic.

Key Rules:
1. Props are read-only (immutable)
2. Data flows down from parent to child
3. Props can be any JavaScript value (strings, numbers, objects, functions)
4. Use destructuring for cleaner code
5. Provide default values when needed

Example:
// Parent component
<UserCard name="John" age={25} isActive={true} />

// Child component
function UserCard({ name, age, isActive }) {
  return <div>{name} is {age} years old</div>;
}

Best Practices:
- Use descriptive prop names
- Validate props with PropTypes or TypeScript
- Provide default values for optional props
- Keep prop interfaces simple and focused`,

    bestPractices: [
      'Use descriptive and consistent prop names',
      'Destructure props for cleaner code',
      'Provide default values for optional props',
      'Validate props with PropTypes or TypeScript',
      'Keep prop interfaces simple and focused'
    ],

    realWorldUseCases: [
      '📊 Passing data to chart components',
      '🎨 Configuring UI component appearance',
      '🔧 Passing event handlers to child components',
      '📝 Sharing form data between components'
    ],

    challenges: [
      {
        id: 'make-component-dynamic',
        title: 'Make Component Dynamic with Props',
        description: 'Transform a static component to accept props and become reusable',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        xpReward: 60,
        instructions: [
          'Convert the static ProductCard to accept props',
          'Add props for title, price, image, and description',
          'Use destructuring to extract props',
          'Add default values for optional props'
        ],
        hints: [
          'Replace hardcoded values with prop variables',
          'Use destructuring in function parameters',
          'Consider which props should be required vs optional',
          'Test with different prop values'
        ],
        testCriteria: [
          'Component accepts and uses props correctly',
          'Uses destructuring for props',
          'Handles missing props gracefully',
          'Component is reusable with different data'
        ],
        code: {
          initial: `import React from 'react';

// Static component - make this dynamic with props
function ProductCard() {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '300px',
      margin: '16px'
    }}>
      <img
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
        alt="Product"
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <h3 style={{ margin: '12px 0 8px 0' }}>Wireless Headphones</h3>
      <p style={{ color: '#666', fontSize: '14px', margin: '0 0 12px 0' }}>
        High-quality wireless headphones with noise cancellation
      </p>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
        $99.99
      </div>
      <button style={{
        marginTop: '12px',
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Add to Cart
      </button>
    </div>
  );
}

// TODO: Update component to accept props
// TODO: Use the component with different props

function App() {
  return (
    <div>
      <ProductCard />
      {/* TODO: Add more ProductCard instances with different props */}
    </div>
  );
}

export default App;`,
          solution: `import React from 'react';

// Dynamic component with props
function ProductCard({
  title,
  price,
  image,
  description,
  onAddToCart,
  currency = '$'
}) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '300px',
      margin: '16px'
    }}>
      <img
        src={image}
        alt={title}
        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <h3 style={{ margin: '12px 0 8px 0' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '14px', margin: '0 0 12px 0' }}>
        {description}
      </p>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
        {currency}{price}
      </div>
      <button
        onClick={() => onAddToCart && onAddToCart(title)}
        style={{
          marginTop: '12px',
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

function App() {
  const handleAddToCart = (productName) => {
    alert(\`Added \${productName} to cart!\`);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <ProductCard
        title="Wireless Headphones"
        price="99.99"
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"
        description="High-quality wireless headphones with noise cancellation"
        onAddToCart={handleAddToCart}
      />
      <ProductCard
        title="Smart Watch"
        price="199.99"
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
        description="Feature-rich smartwatch with health tracking"
        onAddToCart={handleAddToCart}
      />
      <ProductCard
        title="Laptop Stand"
        price="49.99"
        image="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300"
        description="Ergonomic aluminum laptop stand for better posture"
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'usestate-basics',
    title: 'useState – Managing State in Components',
    description: 'Learn to manage component state with the useState hook',
    explanation: `State is data that a component can manage internally. It changes over time and triggers a re-render when updated.

useState Hook:
The useState hook allows functional components to have state. It returns an array with two elements:
1. Current state value
2. Function to update the state

Syntax:
const [state, setState] = useState(initialValue);

Rules of State:
1. State is immutable - always create new objects/arrays
2. State updates are asynchronous
3. State updates trigger re-renders
4. Use functional updates for state that depends on previous state
5. Don't mutate state directly

Example:
const [count, setCount] = useState(0);
const increment = () => setCount(count + 1);
const incrementByAmount = (amount) => setCount(prev => prev + amount);

Best Practices:
- Initialize state with appropriate default values
- Use multiple useState calls for unrelated state
- Use functional updates when new state depends on previous state
- Keep state minimal and derive other values when possible`,

    bestPractices: [
      'Initialize state with appropriate default values',
      'Use multiple useState calls for unrelated state',
      'Use functional updates when depending on previous state',
      'Keep state minimal and derive computed values',
      'Never mutate state directly'
    ],

    realWorldUseCases: [
      '🔢 Counters and numeric inputs',
      '🔄 Toggle switches and checkboxes',
      '📝 Form inputs and validation',
      '🎮 Interactive games and animations'
    ],

    challenges: [
      {
        id: 'fix-counter-state',
        title: 'Fix the Counter State',
        description: 'Fix common useState mistakes in a counter component',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        instructions: [
          'Fix the state mutation issues',
          'Implement proper state updates',
          'Add functional updates where needed',
          'Ensure the counter works correctly'
        ],
        hints: [
          'Never mutate state directly',
          'Use the setter function to update state',
          'Use functional updates for dependent state changes',
          'Check for proper useState import'
        ],
        testCriteria: [
          'Counter increments and decrements correctly',
          'No direct state mutations',
          'Uses proper useState patterns',
          'All buttons work as expected'
        ],
        code: {
          initial: `import React, { useState } from 'react';

function BrokenCounter() {
  let [count, setCount] = useState(0);

  // Fix these broken functions
  const increment = () => {
    count++; // This is wrong!
  };

  const decrement = () => {
    count = count - 1; // This is wrong!
  };

  const incrementByFive = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1); // This won't work as expected!
  };

  const reset = () => {
    count = 0; // This is wrong!
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Counter: {count}</h2>
      <div>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <button onClick={incrementByFive}>+5</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default BrokenCounter;`,
          solution: `import React, { useState } from 'react';

function FixedCounter() {
  const [count, setCount] = useState(0);

  // Fixed functions with proper state updates
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const incrementByFive = () => {
    setCount(prevCount => prevCount + 5);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Counter: {count}</h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
        <button
          onClick={increment}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +1
        </button>
        <button
          onClick={decrement}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -1
        </button>
        <button
          onClick={incrementByFive}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +5
        </button>
        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FixedCounter;`
        }
      }
    ]
  },

  {
    id: 'event-handling',
    title: 'Event Handling',
    description: 'Learn to handle user interactions in React',
    explanation: `React uses SyntheticEvents, which normalize native DOM events across browsers.

How Events Work in React:
- React wraps native events in SyntheticEvent objects
- Event handlers receive the event object as a parameter
- Use camelCase for event names (onClick, onChange, onSubmit)
- Event handlers are functions, not strings

Supported Events:
- Mouse: onClick, onDoubleClick, onMouseOver, onMouseOut
- Keyboard: onKeyDown, onKeyUp, onKeyPress
- Form: onChange, onSubmit, onFocus, onBlur
- Touch: onTouchStart, onTouchMove, onTouchEnd

Best Practices:
- Use arrow functions or bind methods properly
- Prevent default behavior when needed
- Use event delegation for performance
- Extract event handlers to separate functions for readability`,

    bestPractices: [
      'Use camelCase for event names',
      'Extract complex event handlers to separate functions',
      'Use event.preventDefault() when needed',
      'Avoid inline arrow functions for performance',
      'Use event delegation for lists'
    ],

    realWorldUseCases: [
      '🖱️ Button clicks and user interactions',
      '⌨️ Form input handling and validation',
      '📱 Touch gestures and mobile interactions',
      '🎮 Game controls and interactive elements'
    ],

    challenges: [
      {
        id: 'fix-event-handlers',
        title: 'Fix Event Handler Issues',
        description: 'Fix common event handling mistakes in React',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        xpReward: 60,
        instructions: [
          'Fix the broken event handlers',
          'Implement proper form submission',
          'Add keyboard event handling',
          'Prevent default behaviors where needed'
        ],
        hints: [
          'Use arrow functions or proper binding',
          'Check event handler syntax',
          'Use event.preventDefault() for forms',
          'Make sure event handlers are functions'
        ],
        testCriteria: [
          'All buttons respond to clicks',
          'Form submission works correctly',
          'Keyboard events are handled properly',
          'No console errors from event handlers'
        ],
        code: {
          initial: `import React, { useState } from 'react';

function EventHandlingDemo() {
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Fix these broken event handlers
  const handleClick = {
    // This should be a function!
    setMessage('Button clicked!');
  };

  const handleSubmit = (event) => {
    // Missing preventDefault
    setMessage(\`Form submitted with: \${inputValue}\`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // This will cause form submission
      setMessage('Enter key pressed!');
    }
  };

  const handleChange = (event) => {
    // This is correct
    setInputValue(event.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Event Handling Demo</h2>

      <button onClick={handleClick}>
        Click Me
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type something and press Enter"
        />
        <button type="submit">Submit</button>
      </form>

      <p>Message: {message}</p>
    </div>
  );
}

export default EventHandlingDemo;`,
          solution: `import React, { useState } from 'react';

function EventHandlingDemo() {
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  // Fixed event handlers
  const handleClick = () => {
    setMessage('Button clicked!');
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    setMessage(\`Form submitted with: \${inputValue}\`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent form submission
      setMessage('Enter key pressed!');
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleReset = () => {
    setMessage('');
    setInputValue('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Event Handling Demo</h2>

      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          Click Me
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type something and press Enter"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              marginBottom: '8px'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>

      <div style={{
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        minHeight: '40px'
      }}>
        <strong>Message:</strong> {message || 'No message yet'}
      </div>
    </div>
  );
}

export default EventHandlingDemo;`
        }
      }
    ]
  },

  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    description: 'Learn to render content based on conditions',
    explanation: `In React, conditional rendering means showing different content or components based on conditions (like state or props) — just like using if or switch in JavaScript.

Common Patterns:

1. Ternary Operator:
{condition ? <ComponentA /> : <ComponentB />}

2. Logical AND (&&):
{condition && <Component />}

3. If/Else Statements:
if (condition) return <ComponentA />;
return <ComponentB />;

4. Switch Statements:
switch(status) {
  case 'loading': return <Spinner />;
  case 'error': return <Error />;
  default: return <Content />;
}

Best Practices:
- Keep conditions simple and readable
- Extract complex logic to variables or functions
- Use meaningful variable names for conditions
- Consider using early returns for cleaner code`,

    bestPractices: [
      'Keep conditional logic simple and readable',
      'Extract complex conditions to variables',
      'Use meaningful names for boolean variables',
      'Consider early returns for cleaner code',
      'Avoid deeply nested ternary operators'
    ],

    realWorldUseCases: [
      '🔐 Showing login/logout states',
      '📊 Displaying loading spinners',
      '⚠️ Error message handling',
      '🎯 Feature flags and A/B testing'
    ],

    challenges: [
      {
        id: 'toggle-content-visibility',
        title: 'Toggle Content Visibility',
        description: 'Implement various conditional rendering patterns',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 70,
        instructions: [
          'Implement show/hide functionality for different sections',
          'Add loading state simulation',
          'Create error handling with conditional rendering',
          'Use different conditional rendering patterns'
        ],
        hints: [
          'Use useState for managing visibility states',
          'Try both ternary operators and logical AND',
          'Consider using early returns',
          'Think about user experience during state changes'
        ],
        testCriteria: [
          'All toggle buttons work correctly',
          'Loading simulation displays properly',
          'Error states are handled gracefully',
          'Uses multiple conditional rendering patterns'
        ],
        code: {
          initial: `import React, { useState } from 'react';

function ConditionalRenderingDemo() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  const simulateLoading = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
      // Randomly show error or success
      if (Math.random() > 0.7) {
        setHasError(true);
      }
    }, 2000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Conditional Rendering Demo</h2>

      {/* TODO: Add conditional rendering for welcome message */}

      {/* TODO: Add loading state with conditional rendering */}

      {/* TODO: Add error handling with conditional rendering */}

      {/* TODO: Add role-based content rendering */}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setShowWelcome(!showWelcome)}>
          Toggle Welcome
        </button>
        <button onClick={simulateLoading}>
          Simulate API Call
        </button>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
}

export default ConditionalRenderingDemo;`,
          solution: `import React, { useState } from 'react';

function ConditionalRenderingDemo() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  const simulateLoading = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
      // Randomly show error or success
      if (Math.random() > 0.7) {
        setHasError(true);
      }
    }, 2000);
  };

  const resetError = () => setHasError(false);

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Conditional Rendering Demo</h2>

      {/* Conditional rendering with logical AND */}
      {showWelcome && (
        <div style={{
          padding: '16px',
          backgroundColor: '#dbeafe',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h3>Welcome! 👋</h3>
          <p>This message is conditionally rendered.</p>
        </div>
      )}

      {/* Loading state with ternary operator */}
      <div style={{ marginBottom: '16px' }}>
        {isLoading ? (
          <div style={{
            padding: '16px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div>🔄 Loading...</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Please wait while we fetch your data
            </div>
          </div>
        ) : (
          <div style={{
            padding: '16px',
            backgroundColor: '#dcfce7',
            border: '1px solid #16a34a',
            borderRadius: '8px'
          }}>
            ✅ Ready! Click "Simulate API Call" to test loading.
          </div>
        )}
      </div>

      {/* Error handling with conditional rendering */}
      {hasError && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fee2e2',
          border: '1px solid #dc2626',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>❌ Error occurred!</strong>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                Something went wrong. Please try again.
              </div>
            </div>
            <button
              onClick={resetError}
              style={{
                padding: '4px 8px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Role-based content rendering */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <h4>Role-based Content:</h4>
        {userRole === 'guest' && (
          <p>👤 Welcome, Guest! Please log in to access more features.</p>
        )}
        {userRole === 'user' && (
          <p>🙋‍♂️ Hello, User! You have access to basic features.</p>
        )}
        {userRole === 'admin' && (
          <p>👑 Welcome, Admin! You have full access to all features.</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowWelcome(!showWelcome)}
          style={{
            padding: '8px 16px',
            backgroundColor: showWelcome ? '#dc2626' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showWelcome ? 'Hide' : 'Show'} Welcome
        </button>

        <button
          onClick={simulateLoading}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: isLoading ? '#6b7280' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Simulate API Call
        </button>

        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
}

export default ConditionalRenderingDemo;`
        }
      }
    ]
  },

  {
    id: 'lists-and-keys',
    title: 'Lists and Keys',
    description: 'Learn to render dynamic lists efficiently with keys',
    explanation: `Rendering lists is common in React apps. When rendering lists, React needs a way to track which items have changed, been added, or removed.

The map() Method:
Use JavaScript's map() method to transform arrays into JSX elements.

Example:
const items = ['apple', 'banana', 'orange'];
const listItems = items.map(item => <li key={item}>{item}</li>);

Keys in React:
Keys help React identify which list items have changed. They should be:
- Unique among siblings
- Stable (don't change between renders)
- Predictable (same input = same key)

Good Keys: IDs from your data, stable unique identifiers
Bad Keys: Array indexes (when list can change), Math.random()

Why Keys Matter:
- Performance: React can efficiently update only changed items
- State preservation: Component state is maintained correctly
- Avoiding bugs: Prevents rendering issues with dynamic lists`,

    bestPractices: [
      'Always provide keys when rendering lists',
      'Use stable, unique identifiers as keys',
      'Avoid using array indexes as keys for dynamic lists',
      'Extract list items to separate components for better performance',
      'Keep keys consistent between renders'
    ],

    realWorldUseCases: [
      '📋 Todo lists and task management',
      '🛒 Shopping carts and product catalogs',
      '💬 Chat messages and comments',
      '📊 Data tables and dashboards'
    ],

    challenges: [
      {
        id: 'build-dynamic-list',
        title: 'Build a Dynamic Todo List',
        description: 'Create a todo list with proper key usage and list operations',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 100,
        instructions: [
          'Create a todo list with add, remove, and toggle functionality',
          'Use proper keys for list items',
          'Implement filtering (all, active, completed)',
          'Add item editing capability'
        ],
        hints: [
          'Use unique IDs for each todo item',
          'Use the filter method for removing items',
          'Consider using object spread for updates',
          'Think about the data structure for todos'
        ],
        testCriteria: [
          'Can add new todos',
          'Can remove todos',
          'Can toggle todo completion',
          'Uses proper keys for list items',
          'Filtering works correctly'
        ],
        code: {
          initial: `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  // TODO: Implement addTodo function
  const addTodo = () => {
    // Add logic here
  };

  // TODO: Implement removeTodo function
  const removeTodo = (id) => {
    // Add logic here
  };

  // TODO: Implement toggleTodo function
  const toggleTodo = (id) => {
    // Add logic here
  };

  // TODO: Implement filtering logic
  const filteredTodos = todos; // Replace with actual filtering

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Todo List</h2>

      {/* Add todo form */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          style={{ padding: '8px', marginRight: '8px', width: '300px' }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Filter buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      {/* Todo list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* TODO: Render filteredTodos with proper keys */}
      </ul>
    </div>
  );
}

export default TodoList;`,
          solution: `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false },
    { id: 3, text: 'Deploy to production', completed: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(), // Simple ID generation
        text: inputValue.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Todo List</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          style={{
            padding: '8px',
            marginRight: '8px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {['all', 'active', 'completed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '6px 12px',
              marginRight: '8px',
              backgroundColor: filter === filterType ? '#3b82f6' : '#f3f4f6',
              color: filter === filterType ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px'
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '12px' }}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#6b7280' : '#111827'
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
          No todos found for "{filter}" filter.
        </p>
      )}
    </div>
  );
}

export default TodoList;`
        }
      }
    ]
  },

  {
    id: 'forms-and-inputs',
    title: 'Forms and Controlled Inputs',
    description: 'Learn to handle forms and user input in React',
    explanation: `Forms in React work differently than in HTML. React uses "controlled components" where form data is handled by React state.

Controlled vs Uncontrolled Components:

Controlled Components:
- Form data is handled by React state
- Input value is controlled by state
- Changes are handled via onChange events
- Single source of truth

Uncontrolled Components:
- Form data is handled by the DOM
- Use refs to access form values
- Less React-like, but sometimes useful

Form Handling Best Practices:
- Use controlled components for most cases
- Validate input as the user types
- Provide clear error messages
- Handle form submission properly
- Consider using form libraries for complex forms`,

    bestPractices: [
      'Use controlled components for form inputs',
      'Validate input in real-time when possible',
      'Provide clear, helpful error messages',
      'Handle form submission with preventDefault',
      'Consider accessibility for form elements'
    ],

    realWorldUseCases: [
      '📝 User registration and login forms',
      '🔍 Search and filter interfaces',
      '💳 Payment and checkout forms',
      '📊 Data entry and survey forms'
    ],

    challenges: [
      {
        id: 'build-contact-form',
        title: 'Build a Contact Form',
        description: 'Create a contact form with validation and error handling',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        instructions: [
          'Create a contact form with name, email, and message fields',
          'Add real-time validation for each field',
          'Display error messages for invalid inputs',
          'Handle form submission with success/error states'
        ],
        hints: [
          'Use separate state for each form field',
          'Create validation functions for each field type',
          'Use conditional rendering for error messages',
          'Consider using a loading state during submission'
        ],
        testCriteria: [
          'All form fields are controlled components',
          'Validation works in real-time',
          'Error messages display correctly',
          'Form submission is handled properly',
          'Success state is shown after submission'
        ],
        code: {
          initial: `import React, { useState } from 'react';

function ContactForm() {
  // TODO: Add state for form fields
  // TODO: Add state for validation errors
  // TODO: Add state for submission status

  // TODO: Add validation functions
  const validateEmail = (email) => {
    // Add email validation logic
  };

  const validateName = (name) => {
    // Add name validation logic
  };

  const validateMessage = (message) => {
    // Add message validation logic
  };

  // TODO: Add form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submission logic
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Contact Form</h2>

      <form onSubmit={handleSubmit}>
        {/* TODO: Add form fields with validation */}
      </form>
    </div>
  );
}

export default ContactForm;`,
          solution: `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validateName = (name) => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateMessage = (message) => {
    if (!message.trim()) return 'Message is required';
    if (message.trim().length < 10) return 'Message must be at least 10 characters';
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'message':
        error = validateMessage(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);

    const newErrors = {
      name: nameError,
      email: emailError,
      message: messageError
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (nameError || emailError || messageError) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>✅ Message Sent!</h2>
          <p>Thank you for your message. We'll get back to you soon.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Contact Form</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: \`1px solid \${errors.name ? '#ef4444' : '#ccc'}\`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: \`1px solid \${errors.email ? '#ef4444' : '#ccc'}\`,
              borderRadius: '4px',
              fontSize: '14px'
            }}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              border: \`1px solid \${errors.message ? '#ef4444' : '#ccc'}\`,
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
            placeholder="Enter your message (minimum 10 characters)"
          />
          {errors.message && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.message}
            </div>
          )}
        </div>

        {errors.submit && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#ef4444'
          }}>
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#6b7280' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;`
        }
      }
    ]
  },

  {
    id: 'useeffect-basics',
    title: 'useEffect – Side Effects and Lifecycle',
    description: 'Learn to handle side effects and component lifecycle with useEffect',
    explanation: `useEffect is a React Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.

What are Side Effects?
Side effects are operations that affect something outside the component:
- Data fetching (API calls)
- Setting up subscriptions
- Manually changing the DOM
- Timers and intervals

useEffect Syntax:
useEffect(() => {
  // Side effect code
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]); // Dependency array

Dependency Array:
- No array: Runs after every render
- Empty array []: Runs only once (mount/unmount)
- With dependencies [dep1, dep2]: Runs when dependencies change

Common Patterns:
1. Component Mount: useEffect(() => {}, [])
2. Component Update: useEffect(() => {})
3. Cleanup: useEffect(() => { return () => {} }, [])`,

    bestPractices: [
      'Always include dependencies in the dependency array',
      'Use multiple useEffect hooks for different concerns',
      'Clean up subscriptions and timers to prevent memory leaks',
      'Use the ESLint plugin for exhaustive-deps',
      'Keep effects focused on a single responsibility'
    ],

    realWorldUseCases: [
      '🌐 Fetching data from APIs',
      '⏰ Setting up timers and intervals',
      '📡 WebSocket connections and subscriptions',
      '📊 Tracking user interactions and analytics'
    ],

    challenges: [
      {
        id: 'data-fetching-with-useeffect',
        title: 'Data Fetching with useEffect',
        description: 'Implement data fetching with loading states and error handling',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 100,
        instructions: [
          'Fetch user data from a mock API on component mount',
          'Implement loading and error states',
          'Add a refresh functionality',
          'Handle component cleanup properly'
        ],
        hints: [
          'Use useState for loading, data, and error states',
          'Use useEffect with empty dependency array for initial fetch',
          'Consider using async/await or .then() for promises',
          'Don\'t forget to handle the cleanup'
        ],
        testCriteria: [
          'Data fetches on component mount',
          'Loading state displays during fetch',
          'Error handling works correctly',
          'Refresh functionality works',
          'No memory leaks or warnings'
        ],
        code: {
          initial: `import React, { useState, useEffect } from 'react';

// Mock API function
const fetchUserData = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate random success/failure
  if (Math.random() > 0.8) {
    throw new Error('Failed to fetch user data');
  }

  return {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Software developer passionate about React',
    joinDate: '2023-01-15'
  };
};

function UserProfile({ userId = 1 }) {
  // TODO: Add state for user data, loading, and error

  // TODO: Add useEffect for data fetching

  // TODO: Add refresh function

  // TODO: Add loading state JSX

  // TODO: Add error state JSX

  // TODO: Add user data display JSX

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>User Profile</h2>
      {/* TODO: Implement conditional rendering */}
    </div>
  );
}

export default UserProfile;`,
          solution: `import React, { useState, useEffect } from 'react';

// Mock API function
const fetchUserData = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (Math.random() > 0.8) {
    throw new Error('Failed to fetch user data');
  }

  return {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Software developer passionate about React',
    joinDate: '2023-01-15'
  };
};

function UserProfile({ userId = 1 }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserData(userId);
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Cleanup function (optional for this example)
    return () => {
      // Cancel any ongoing requests if needed
      console.log('Component cleanup');
    };
  }, [userId]); // Re-fetch when userId changes

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <h2>User Profile</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ marginLeft: '12px' }}>Loading user data...</span>
        </div>
        <style>
          {\`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          \`}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <h2>User Profile</h2>
        <div style={{
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>Error</h3>
          <p style={{ margin: '0 0 16px 0', color: '#7f1d1d' }}>{error}</p>
          <button
            onClick={handleRefresh}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>User Profile</h2>
        <button
          onClick={handleRefresh}
          style={{
            padding: '6px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src={userData.avatar}
            alt={userData.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #e5e7eb'
            }}
          />
        </div>

        <h3 style={{ margin: '0 0 4px 0', textAlign: 'center', fontSize: '20px' }}>
          {userData.name}
        </h3>

        <p style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#6b7280' }}>
          {userData.email}
        </p>

        <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.5' }}>
          {userData.bio}
        </p>

        <div style={{
          padding: '12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Member since:</strong> {new Date(userData.joinDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;`
        }
      }
    ]
  },

  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle',
    description: 'Understanding React component lifecycle phases',
    explanation: `React components go through different phases during their lifetime: mounting, updating, and unmounting.

Lifecycle Phases:

1. Mounting (Birth):
- Component is being created and inserted into the DOM
- useEffect with empty dependency array []
- Perfect for: Initial data fetching, setting up subscriptions

2. Updating (Growth):
- Component is being re-rendered due to changes in props or state
- useEffect with dependencies or no dependency array
- Perfect for: Responding to prop/state changes, updating DOM

3. Unmounting (Death):
- Component is being removed from the DOM
- useEffect cleanup function
- Perfect for: Cleaning up subscriptions, canceling network requests

useEffect Lifecycle Mapping:
- componentDidMount: useEffect(() => {}, [])
- componentDidUpdate: useEffect(() => {})
- componentWillUnmount: useEffect(() => { return () => {} }, [])

Common Lifecycle Patterns:
- Data fetching on mount
- Subscribing to external data sources
- Cleaning up to prevent memory leaks`,

    bestPractices: [
      'Clean up subscriptions and timers in useEffect cleanup',
      'Use appropriate dependency arrays for different lifecycle needs',
      'Separate concerns into different useEffect hooks',
      'Handle component unmounting gracefully',
      'Avoid memory leaks with proper cleanup'
    ],

    realWorldUseCases: [
      '🔄 Setting up and cleaning up subscriptions',
      '⏰ Managing timers and intervals',
      '📡 WebSocket connection management',
      '🎯 Event listener setup and cleanup'
    ],

    challenges: [
      {
        id: 'lifecycle-timer-app',
        title: 'Build a Lifecycle Timer App',
        description: 'Create a timer app that demonstrates all lifecycle phases',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '18 min',
        xpReward: 90,
        instructions: [
          'Create a timer that counts up every second',
          'Start the timer when component mounts',
          'Pause/resume functionality',
          'Clean up the timer when component unmounts',
          'Show lifecycle events in a log'
        ],
        hints: [
          'Use setInterval for the timer',
          'Store interval ID in a ref or state',
          'Clear interval in cleanup function',
          'Use multiple useEffect hooks for different concerns'
        ],
        testCriteria: [
          'Timer starts automatically on mount',
          'Timer updates every second',
          'Pause/resume functionality works',
          'Timer cleans up properly on unmount',
          'Lifecycle events are logged correctly'
        ],
        code: {
          initial: `import React, { useState, useEffect } from 'react';

function LifecycleTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState([]);

  // TODO: Add useEffect for component mount

  // TODO: Add useEffect for timer logic

  // TODO: Add useEffect for component unmount cleanup

  // TODO: Add function to add logs
  const addLog = (message) => {
    // Add logging logic
  };

  // TODO: Add pause/resume functionality
  const toggleTimer = () => {
    // Add toggle logic
  };

  const resetTimer = () => {
    setSeconds(0);
    addLog('Timer reset');
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return \`\${minutes.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Lifecycle Timer</h2>

      {/* TODO: Add timer display */}

      {/* TODO: Add control buttons */}

      {/* TODO: Add lifecycle logs */}
    </div>
  );
}

export default LifecycleTimer;`,
          solution: `import React, { useState, useEffect, useRef } from 'react';

function LifecycleTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [logs, setLogs] = useState([]);
  const intervalRef = useRef(null);

  // Component mount effect
  useEffect(() => {
    addLog('🎯 Component mounted');

    return () => {
      addLog('💀 Component will unmount');
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
      addLog('▶️ Timer started');
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      addLog('⏸️ Timer paused');
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Seconds update effect
  useEffect(() => {
    if (seconds > 0) {
      addLog(\`⏱️ Timer updated: \${formatTime(seconds)}\`);
    }
  }, [seconds]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, timestamp, id: Date.now() }]);
  };

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setSeconds(0);
    addLog('🔄 Timer reset');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return \`\${minutes.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Lifecycle Timer</h2>

      <div style={{
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#f3f4f6',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          fontFamily: 'monospace'
        }}>
          {formatTime(seconds)}
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={toggleTimer}
            style={{
              padding: '10px 20px',
              backgroundColor: isRunning ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isRunning ? '⏸️ Pause' : '▶️ Resume'}
          </button>

          <button
            onClick={resetTimer}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Lifecycle Logs</h3>
          <button
            onClick={clearLogs}
            style={{
              padding: '4px 8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Clear
          </button>
        </div>

        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '8px'
        }}>
          {logs.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: '#6b7280',
              fontStyle: 'italic',
              margin: '20px 0'
            }}>
              No logs yet...
            </p>
          ) : (
            logs.slice(-10).map(log => (
              <div
                key={log.id}
                style={{
                  padding: '6px 8px',
                  fontSize: '12px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{log.message}</span>
                <span style={{ color: '#6b7280' }}>{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default LifecycleTimer;`
        }
      }
    ]
  },

  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    description: 'Learn to create reusable logic with custom hooks',
    explanation: `Custom Hooks are JavaScript functions that start with "use" and can call other Hooks. They let you extract component logic into reusable functions.

Why Custom Hooks?
- Share stateful logic between components
- Keep components clean and focused
- Create reusable abstractions
- Follow the DRY (Don't Repeat Yourself) principle

Rules for Custom Hooks:
1. Must start with "use" (useCounter, useLocalStorage)
2. Can call other Hooks inside them
3. Are just JavaScript functions
4. Each call gets independent state

Common Custom Hook Patterns:
- Data fetching: useFetch, useApi
- Local storage: useLocalStorage
- Form handling: useForm
- Timers: useTimer, useInterval
- Window events: useWindowSize, useKeyPress

Example:
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  return { count, increment, decrement, reset };
}`,

    bestPractices: [
      'Start custom hook names with "use"',
      'Return objects for multiple values instead of arrays',
      'Keep custom hooks focused on a single responsibility',
      'Document your custom hooks well',
      'Test custom hooks independently'
    ],

    realWorldUseCases: [
      '🔄 Data fetching and caching logic',
      '💾 Local storage and persistence',
      '📝 Form validation and handling',
      '🎮 Game state and animation logic'
    ],

    challenges: [
      {
        id: 'build-custom-hooks',
        title: 'Build Useful Custom Hooks',
        description: 'Create custom hooks for common functionality',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        instructions: [
          'Create a useLocalStorage hook for persistent state',
          'Create a useToggle hook for boolean state',
          'Create a useFetch hook for API calls',
          'Use all custom hooks in a demo component'
        ],
        hints: [
          'useLocalStorage should sync with localStorage',
          'useToggle should provide toggle, setTrue, setFalse functions',
          'useFetch should handle loading, data, and error states',
          'Remember to handle edge cases and cleanup'
        ],
        testCriteria: [
          'useLocalStorage persists data correctly',
          'useToggle provides all toggle functions',
          'useFetch handles all states properly',
          'All hooks follow naming conventions',
          'Demo component uses all hooks effectively'
        ],
        code: {
          initial: `import React, { useState, useEffect } from 'react';

// TODO: Create useLocalStorage custom hook
function useLocalStorage(key, initialValue) {
  // Implement localStorage hook
}

// TODO: Create useToggle custom hook
function useToggle(initialValue = false) {
  // Implement toggle hook
}

// TODO: Create useFetch custom hook
function useFetch(url) {
  // Implement fetch hook
}

// Demo component using all custom hooks
function CustomHooksDemo() {
  // TODO: Use useLocalStorage for user preferences
  // TODO: Use useToggle for dark mode
  // TODO: Use useFetch for loading user data

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Custom Hooks Demo</h2>

      {/* TODO: Add demo UI */}
    </div>
  );
}

export default CustomHooksDemo;`,
          solution: `import React, { useState, useEffect } from 'react';

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":, error\`);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":, error\`);
    }
  };

  return [storedValue, setValue];
}

// Custom hook for toggle functionality
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue(prev => !prev);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
}

// Custom hook for data fetching
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on URL
        let mockData;
        if (url.includes('users')) {
          mockData = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          };
        } else {
          mockData = { message: 'Data fetched successfully' };
        }

        setData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = () => {
    if (url) {
      setLoading(true);
      setError(null);
      // Trigger useEffect by updating a dependency or call fetchData directly
    }
  };

  return { data, loading, error, refetch };
}

// Demo component using all custom hooks
function CustomHooksDemo() {
  // Using useLocalStorage for user preferences
  const [userName, setUserName] = useLocalStorage('userName', '');
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // Using useToggle for UI state
  const darkMode = useToggle(theme === 'dark');
  const showUserData = useToggle(false);

  // Using useFetch for API data
  const { data: userData, loading, error, refetch } = useFetch(
    showUserData.value ? '/api/users/1' : null
  );

  // Sync theme with darkMode toggle
  useEffect(() => {
    setTheme(darkMode.value ? 'dark' : 'light');
  }, [darkMode.value, setTheme]);

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    backgroundColor: darkMode.value ? '#1f2937' : '#ffffff',
    color: darkMode.value ? '#f9fafb' : '#111827',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  };

  const cardStyle = {
    padding: '16px',
    margin: '16px 0',
    backgroundColor: darkMode.value ? '#374151' : '#f3f4f6',
    borderRadius: '8px',
    border: \`1px solid \${darkMode.value ? '#4b5563' : '#e5e7eb'}\`
  };

  return (
    <div style={containerStyle}>
      <h2>Custom Hooks Demo</h2>

      {/* useLocalStorage Demo */}
      <div style={cardStyle}>
        <h3>📦 useLocalStorage Hook</h3>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            Your Name (persisted in localStorage):
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '200px'
            }}
          />
        </div>
        {userName && (
          <p>Hello, <strong>{userName}</strong>! Your name is saved locally.</p>
        )}
      </div>

      {/* useToggle Demo */}
      <div style={cardStyle}>
        <h3>🔄 useToggle Hook</h3>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={darkMode.toggle}
            style={{
              padding: '8px 16px',
              backgroundColor: darkMode.value ? '#fbbf24' : '#1f2937',
              color: darkMode.value ? '#000' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {darkMode.value ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <button
            onClick={showUserData.toggle}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showUserData.value ? 'Hide' : 'Show'} User Data
          </button>
        </div>

        <p>
          Dark Mode: <strong>{darkMode.value ? 'ON' : 'OFF'}</strong> |
          Show User Data: <strong>{showUserData.value ? 'ON' : 'OFF'}</strong>
        </p>
      </div>

      {/* useFetch Demo */}
      {showUserData.value && (
        <div style={cardStyle}>
          <h3>🌐 useFetch Hook</h3>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div>🔄 Loading user data...</div>
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '4px',
              marginBottom: '12px'
            }}>
              ❌ Error: {error}
            </div>
          )}

          {userData && !loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: darkMode.value ? '#065f46' : '#dcfce7',
              borderRadius: '4px',
              marginBottom: '12px'
            }}>
              <img
                src={userData.avatar}
                alt={userData.name}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>{userData.name}</h4>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                  {userData.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={refetch}
            disabled={loading}
            style={{
              padding: '6px 12px',
              backgroundColor: loading ? '#6b7280' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            🔄 Refetch Data
          </button>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '12px',
        backgroundColor: darkMode.value ? '#065f46' : '#dbeafe',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>💡 Custom Hooks in Action:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>useLocalStorage: Persisting your name and theme preference</li>
          <li>useToggle: Managing dark mode and user data visibility</li>
          <li>useFetch: Loading user data with proper state management</li>
        </ul>
      </div>
    </div>
  );
}

export default CustomHooksDemo;`
        }
      }
    ]
  },

  {
    id: 'context-api',
    title: 'Context API – Global State Management',
    description: 'Learn to share state across components without prop drilling',
    explanation: `React Context provides a way to pass data through the component tree without having to pass props down manually at every level.

The Problem: Prop Drilling
When you need to pass data through many levels of components, you end up passing props through components that don't even use them.

The Solution: Context API
Context creates a "global" state that can be accessed by any component in the tree.

Key Concepts:
1. createContext(): Creates a context object
2. Provider: Provides the context value to child components
3. useContext(): Hook to consume context in functional components

Context Pattern:
1. Create context with createContext()
2. Wrap components with Provider
3. Consume context with useContext()

When to Use Context:
- Theme data (dark/light mode)
- User authentication state
- Language/locale settings
- Shopping cart data
- Any data needed by many components

When NOT to Use Context:
- For component-specific state
- When props would work fine
- For performance-critical updates (consider state management libraries)`,

    bestPractices: [
      'Use Context for truly global state',
      'Create separate contexts for different concerns',
      'Provide default values for contexts',
      'Use custom hooks to consume context',
      'Consider performance implications of context updates'
    ],

    realWorldUseCases: [
      '🎨 Theme and styling preferences',
      '👤 User authentication and profile data',
      '🛒 Shopping cart and e-commerce state',
      '🌍 Language and internationalization'
    ],

    challenges: [
      {
        id: 'build-theme-context',
        title: 'Build a Theme Context System',
        description: 'Create a complete theme system using Context API',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 110,
        instructions: [
          'Create a ThemeContext with light/dark themes',
          'Build a ThemeProvider component',
          'Create a custom useTheme hook',
          'Build components that consume the theme context',
          'Add theme persistence with localStorage'
        ],
        hints: [
          'Define theme objects with colors and styles',
          'Use useContext to consume the theme',
          'Combine with useLocalStorage for persistence',
          'Create a toggle function in the context'
        ],
        testCriteria: [
          'ThemeContext provides theme data correctly',
          'Theme toggle functionality works',
          'All components respond to theme changes',
          'Theme preference persists across page reloads',
          'Custom useTheme hook works properly'
        ],
        code: {
          initial: `import React, { createContext, useContext, useState } from 'react';

// TODO: Define theme objects
const themes = {
  // Define light and dark themes
};

// TODO: Create ThemeContext

// TODO: Create ThemeProvider component

// TODO: Create custom useTheme hook

// Example components that will use the theme
function Header() {
  // TODO: Use theme context
  return (
    <header>
      <h1>My App</h1>
      <button>Toggle Theme</button>
    </header>
  );
}

function Card({ title, content }) {
  // TODO: Use theme context
  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      {/* TODO: Wrap with ThemeProvider */}
      <Header />
      <main>
        <Card
          title="Welcome"
          content="This is a themed application using React Context API."
        />
        <Card
          title="Features"
          content="Toggle between light and dark themes seamlessly."
        />
      </main>
    </div>
  );
}

export default App;`,
          solution: `import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme objects
const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb'
    },
    shadows: {
      card: '0 1px 3px rgba(0, 0, 0, 0.1)',
      button: '0 1px 2px rgba(0, 0, 0, 0.05)'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151'
    },
    shadows: {
      card: '0 1px 3px rgba(0, 0, 0, 0.3)',
      button: '0 1px 2px rgba(0, 0, 0, 0.2)'
    }
  }
};

// Create ThemeContext
const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {},
  themeName: 'light'
});

// ThemeProvider component
function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => {
    // Get theme from localStorage or default to light
    return localStorage.getItem('theme') || 'light';
  });

  const theme = themes[themeName];

  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme to document body
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [theme]);

  const contextValue = {
    theme,
    toggleTheme,
    themeName
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Header component using theme context
function Header() {
  const { theme, toggleTheme, themeName } = useTheme();

  const headerStyle = {
    padding: '20px',
    backgroundColor: theme.colors.surface,
    borderBottom: \`1px solid \${theme.colors.border}\`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: theme.shadows.card
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: theme.shadows.button,
    transition: 'all 0.2s ease'
  };

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0, color: theme.colors.text }}>
        🎨 Theme Context Demo
      </h1>
      <button
        style={buttonStyle}
        onClick={toggleTheme}
        onMouseOver={(e) => {
          e.target.style.opacity = '0.9';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        {themeName === 'light' ? '🌙' : '☀️'}
        {themeName === 'light' ? ' Dark Mode' : ' Light Mode'}
      </button>
    </header>
  );
}

// Card component using theme context
function Card({ title, content, icon }) {
  const { theme } = useTheme();

  const cardStyle = {
    padding: '20px',
    margin: '16px',
    backgroundColor: theme.colors.surface,
    border: \`1px solid \${theme.colors.border}\`,
    borderRadius: '8px',
    boxShadow: theme.shadows.card,
    transition: 'all 0.3s ease'
  };

  const titleStyle = {
    margin: '0 0 12px 0',
    color: theme.colors.text,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const contentStyle = {
    margin: 0,
    color: theme.colors.textSecondary,
    lineHeight: '1.6'
  };

  return (
    <div
      style={cardStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = theme.name === 'light'
          ? '0 4px 12px rgba(0, 0, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadows.card;
      }}
    >
      <h3 style={titleStyle}>
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      <p style={contentStyle}>{content}</p>
    </div>
  );
}

// Status component showing theme info
function ThemeStatus() {
  const { theme, themeName } = useTheme();

  const statusStyle = {
    padding: '12px 16px',
    margin: '16px',
    backgroundColor: theme.colors.primary,
    color: theme.colors.background,
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '14px'
  };

  return (
    <div style={statusStyle}>
      <strong>Current Theme:</strong> {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Mode
      <br />
      <small>Background: {theme.colors.background} | Text: {theme.colors.text}</small>
    </div>
  );
}

// Main App component
function App() {
  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', transition: 'all 0.3s ease' }}>
        <Header />

        <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <Card
            icon="🚀"
            title="Welcome to Context API"
            content="This application demonstrates the React Context API for theme management. The theme state is shared across all components without prop drilling."
          />

          <Card
            icon="🎨"
            title="Dynamic Theming"
            content="Toggle between light and dark themes using the button in the header. The theme preference is automatically saved to localStorage."
          />

          <Card
            icon="⚡"
            title="Performance Benefits"
            content="Context API provides an efficient way to share state across components. Only components that consume the context will re-render when the context value changes."
          />

          <ThemeStatus />

          <div style={{
            margin: '20px 16px',
            padding: '16px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <strong>💡 Context API Benefits:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Eliminates prop drilling</li>
              <li>Provides global state management</li>
              <li>Easy to implement and understand</li>
              <li>Built into React (no external dependencies)</li>
              <li>Perfect for theme, auth, and settings data</li>
            </ul>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'useref-basics',
    title: 'useRef – Accessing DOM Elements',
    description: 'Learn to access DOM elements and persist values with useRef',
    explanation: `useRef is a React Hook that returns a mutable ref object whose .current property is initialized to the passed argument. The returned object will persist for the full lifetime of the component.

Common Use Cases:
1. Accessing DOM elements directly
2. Storing mutable values that don't trigger re-renders
3. Keeping references to previous values
4. Managing focus, text selection, or media playback

Key Differences from useState:
- Changing a ref doesn't trigger a re-render
- You can mutate the .current property directly
- Refs are useful for imperative actions`,

    bestPractices: [
      '🎯 Use refs for DOM manipulation, not state management',
      '⚡ Access refs in useEffect or event handlers, not during render',
      '🔄 Don\'t read or write refs during rendering',
      '📝 Use refs to store previous values or timers'
    ],

    realWorldUseCases: [
      '🎯 Managing focus for accessibility',
      '📹 Controlling video/audio playback',
      '📊 Integrating with third-party DOM libraries',
      '⏱️ Storing timer IDs and intervals'
    ],

    challenges: [
      {
        id: 'focus-management',
        title: 'Focus Management with useRef',
        description: 'Build a form with automatic focus management using refs',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        code: {
          initial: `import React, { useRef } from 'react';

function FocusForm() {
  // Add refs for input elements

  const handleSubmit = (e) => {
    e.preventDefault();
    // Focus on first input after submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" />
      </div>
      <button type="submit">Submit</button>
      <button type="button">Focus Name</button>
    </form>
  );
}

export default FocusForm;`,
          solution: `import React, { useRef } from 'react';

function FocusForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    nameRef.current.focus();
  };

  const focusName = () => {
    nameRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input ref={nameRef} type="text" />
      </div>
      <div>
        <label>Email:</label>
        <input ref={emailRef} type="email" />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={focusName}>Focus Name</button>
    </form>
  );
}

export default FocusForm;`
        }
      },
      {
        id: 'timer-with-useref',
        title: 'Timer with useRef',
        description: 'Create a timer that uses useRef to store the interval ID',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 100,
        code: {
          initial: `import React, { useState, useRef, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // Add ref for interval ID

  // Add useEffect for timer logic

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;`,
          solution: `import React, { useState, useRef, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;`
        }
      }
    ]
  },

  {
    id: 'usereducer-basics',
    title: 'useReducer – Complex State Management',
    description: 'Learn to manage complex state with useReducer hook',
    explanation: `useReducer is a React Hook that's usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.

How useReducer Works:
1. Define a reducer function that takes (state, action) and returns new state
2. Call useReducer with the reducer and initial state
3. Dispatch actions to update state

When to Use useReducer:
- Complex state objects with multiple properties
- State transitions that depend on previous state
- When you want to optimize performance for components that trigger deep updates`,

    bestPractices: [
      '🎯 Use for complex state logic, not simple values',
      '⚡ Keep reducer functions pure (no side effects)',
      '🔄 Use action types as constants to avoid typos',
      '📝 Structure actions with type and payload properties'
    ],

    realWorldUseCases: [
      '🛒 Shopping cart state management',
      '📝 Form state with validation',
      '🎮 Game state management',
      '📊 Data table filtering and sorting'
    ],

    challenges: [
      {
        id: 'counter-with-usereducer',
        title: 'Counter with useReducer',
        description: 'Convert a useState counter to use useReducer',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        code: {
          initial: `import React, { useReducer } from 'react';

// Define reducer function
function counterReducer(state, action) {
  // Handle different action types
}

function Counter() {
  // Initialize useReducer

  return (
    <div>
      <h2>Count: {/* display count */}</h2>
      <button>Increment</button>
      <button>Decrement</button>
      <button>Reset</button>
    </div>
  );
}

export default Counter;`,
          solution: `import React, { useReducer } from 'react';

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      throw new Error(\`Unknown action type: \${action.type}\`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h2>Count: {state.count}</h2>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        Decrement
      </button>
      <button onClick={() => dispatch({ type: 'RESET' })}>
        Reset
      </button>
    </div>
  );
}

export default Counter;`
        }
      }
    ]
  },

  {
    id: 'react-router',
    title: 'React Router – Client-Side Routing',
    description: 'Learn to implement navigation and routing in React applications',
    explanation: `React Router is the standard routing library for React applications. It enables navigation between different components/pages without full page refreshes.

Key Concepts:
1. BrowserRouter - Provides routing context
2. Routes & Route - Define route mappings
3. Link & NavLink - Navigation components
4. useNavigate - Programmatic navigation
5. useParams - Access URL parameters

Single Page Application (SPA):
React Router enables SPAs where the URL changes but the page doesn't reload, providing a smooth user experience.`,

    bestPractices: [
      '🎯 Use BrowserRouter at the root of your app',
      '⚡ Use NavLink for navigation with active states',
      '🔄 Handle 404 pages with catch-all routes',
      '📝 Use nested routes for complex layouts'
    ],

    realWorldUseCases: [
      '🏠 Multi-page websites and web apps',
      '📱 Dashboard applications with different sections',
      '🛒 E-commerce sites with product pages',
      '📊 Admin panels with various views'
    ],

    challenges: [
      {
        id: 'basic-routing-setup',
        title: 'Basic Routing Setup',
        description: 'Set up basic routing with multiple pages',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 100,
        code: {
          initial: `import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        {/* Add navigation links */}
      </nav>

      {/* Add Routes */}
    </BrowserRouter>
  );
}

export default App;`,
          solution: `import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/about">About</Link> |
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'error-boundaries',
    title: 'Error Boundaries – Handling Errors Gracefully',
    description: 'Learn to catch and handle errors in React component trees',
    explanation: `Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

How Error Boundaries Work:
1. Use componentDidCatch() or static getDerivedStateFromError()
2. Only catch errors in child components, not in themselves
3. Only catch errors during rendering, lifecycle methods, and constructors

Note: Error boundaries do NOT catch errors in:
- Event handlers
- Asynchronous code (setTimeout, promises)
- Server-side rendering
- Errors thrown in the error boundary itself`,

    bestPractices: [
      '🎯 Place error boundaries strategically in your component tree',
      '⚡ Log errors to error reporting services',
      '🔄 Provide meaningful fallback UIs',
      '📝 Don\'t use error boundaries for control flow'
    ],

    realWorldUseCases: [
      '🚨 Preventing entire app crashes from component errors',
      '📊 Graceful degradation of dashboard widgets',
      '🔌 Handling third-party component failures',
      '📱 Maintaining app stability in production'
    ],

    challenges: [
      {
        id: 'create-error-boundary',
        title: 'Create an Error Boundary',
        description: 'Build an error boundary component with fallback UI',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state
  }

  // Add error boundary methods

  render() {
    // Render fallback UI or children
  }
}

// Component that might throw an error
function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  if (shouldThrow) {
    throw new Error('Something went wrong!');
  }

  return (
    <div>
      <h2>This component works fine</h2>
      <button onClick={() => setShouldThrow(true)}>
        Throw Error
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Error Boundary Demo</h1>
      {/* Wrap BuggyComponent with ErrorBoundary */}
      <BuggyComponent />
    </div>
  );
}

export default App;`,
          solution: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '1px solid red' }}>
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function BuggyComponent() {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  if (shouldThrow) {
    throw new Error('Something went wrong!');
  }

  return (
    <div>
      <h2>This component works fine</h2>
      <button onClick={() => setShouldThrow(true)}>
        Throw Error
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Error Boundary Demo</h1>
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'react-memo',
    title: 'React.memo – Component Memoization',
    description: 'Learn to optimize component performance with React.memo',
    explanation: `React.memo is a higher-order component that memoizes the result of a component. If the component renders the same result given the same props, React will skip rendering and reuse the last rendered result.

How React.memo Works:
1. Wraps a functional component
2. Performs shallow comparison of props
3. Skips re-render if props haven't changed
4. Can accept custom comparison function

When to Use React.memo:
- Component renders frequently with same props
- Component is expensive to render
- Parent component re-renders often
- Props are primitive values or stable references`,

    bestPractices: [
      '🎯 Use for expensive components that render frequently',
      '⚡ Ensure props are stable (avoid inline objects/functions)',
      '🔄 Use custom comparison for complex props',
      '📝 Don\'t overuse - measure performance impact'
    ],

    realWorldUseCases: [
      '📊 Data visualization components',
      '📝 Large lists with complex items',
      '🎮 Game components with frequent updates',
      '📱 Dashboard widgets that update independently'
    ],

    challenges: [
      {
        id: 'optimize-with-memo',
        title: 'Optimize with React.memo',
        description: 'Use React.memo to prevent unnecessary re-renders',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 100,
        code: {
          initial: `import React, { useState } from 'react';

// Expensive component that should be memoized
function ExpensiveComponent({ name, count }) {
  console.log('ExpensiveComponent rendered');

  // Simulate expensive calculation
  const expensiveValue = React.useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  }, [count]);

  return (
    <div>
      <h3>Hello {name}!</h3>
      <p>Count: {count}</p>
      <p>Expensive calculation: {expensiveValue}</p>
    </div>
  );
}

function App() {
  const [name, setName] = useState('John');
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  return (
    <div>
      <h1>React.memo Demo</h1>

      <div>
        <button onClick={() => setName(name === 'John' ? 'Jane' : 'John')}>
          Toggle Name
        </button>
        <button onClick={() => setCount(count + 1)}>
          Increment Count
        </button>
        <button onClick={() => setOtherState(otherState + 1)}>
          Update Other State: {otherState}
        </button>
      </div>

      <ExpensiveComponent name={name} count={count} />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

// Memoized expensive component
const ExpensiveComponent = React.memo(function ExpensiveComponent({ name, count }) {
  console.log('ExpensiveComponent rendered');

  // Simulate expensive calculation
  const expensiveValue = React.useMemo(() => {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  }, [count]);

  return (
    <div>
      <h3>Hello {name}!</h3>
      <p>Count: {count}</p>
      <p>Expensive calculation: {expensiveValue}</p>
    </div>
  );
});

function App() {
  const [name, setName] = useState('John');
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  return (
    <div>
      <h1>React.memo Demo</h1>

      <div>
        <button onClick={() => setName(name === 'John' ? 'Jane' : 'John')}>
          Toggle Name
        </button>
        <button onClick={() => setCount(count + 1)}>
          Increment Count
        </button>
        <button onClick={() => setOtherState(otherState + 1)}>
          Update Other State: {otherState}
        </button>
      </div>

      <ExpensiveComponent name={name} count={count} />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'usememo-usecallback',
    title: 'useMemo & useCallback – Performance Optimization',
    description: 'Learn to optimize expensive calculations and function references',
    explanation: `useMemo and useCallback are React Hooks that help optimize performance by memoizing values and functions.

useMemo:
- Memoizes the result of expensive calculations
- Only recalculates when dependencies change
- Returns a memoized value

useCallback:
- Memoizes function references
- Prevents unnecessary re-creation of functions
- Returns a memoized callback

When to Use:
- Expensive calculations that don't need to run on every render
- Passing callbacks to optimized child components
- Breaking referential equality issues`,

    bestPractices: [
      '🎯 Use useMemo for expensive calculations',
      '⚡ Use useCallback for stable function references',
      '🔄 Include all dependencies in dependency array',
      '📝 Don\'t overuse - measure performance impact'
    ],

    realWorldUseCases: [
      '📊 Complex data transformations and filtering',
      '🎮 Game calculations and physics',
      '📱 Real-time data processing',
      '🔍 Search and sorting algorithms'
    ],

    challenges: [
      {
        id: 'optimize-calculations',
        title: 'Optimize Expensive Calculations',
        description: 'Use useMemo and useCallback to optimize performance',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `import React, { useState, useMemo, useCallback } from 'react';

function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendered');

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item)}>
          {item.name} - {item.value}
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [items] = useState([
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 },
    { id: 4, name: 'Another Item', value: 400 },
  ]);

  // Expensive filtering operation
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  // Function passed to child component
  const handleItemClick = (item) => {
    alert(\`Clicked: \${item.name}\`);
  };

  return (
    <div>
      <h1>Performance Optimization Demo</h1>

      <div>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>

        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <ExpensiveList items={filteredItems} onItemClick={handleItemClick} />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useMemo, useCallback } from 'react';

const ExpensiveList = React.memo(function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendered');

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item)}>
          {item.name} - {item.value}
        </li>
      ))}
    </ul>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [items] = useState([
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 },
    { id: 4, name: 'Another Item', value: 400 },
  ]);

  // Memoized expensive filtering operation
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // Memoized function to prevent unnecessary re-renders
  const handleItemClick = useCallback((item) => {
    alert(\`Clicked: \${item.name}\`);
  }, []);

  return (
    <div>
      <h1>Performance Optimization Demo</h1>

      <div>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>

        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <ExpensiveList items={filteredItems} onItemClick={handleItemClick} />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'higher-order-components',
    title: 'Higher-Order Components (HOCs)',
    description: 'Learn to create reusable component logic with HOCs',
    explanation: `A Higher-Order Component (HOC) is a function that takes a component and returns a new component with additional props or behavior. HOCs are a pattern for reusing component logic.

HOC Pattern:
\`\`\`javascript
const withSomething = (WrappedComponent) => {
  return function WithSomethingComponent(props) {
    // Add logic here
    return <WrappedComponent {...props} additionalProp={value} />;
  };
};
\`\`\`

Common Use Cases:
- Authentication checks
- Loading states
- Error handling
- Data fetching
- Analytics tracking`,

    bestPractices: [
      '🎯 Use HOCs for cross-cutting concerns',
      '⚡ Don\'t mutate the original component',
      '🔄 Copy static methods to the wrapped component',
      '📝 Use display names for debugging'
    ],

    realWorldUseCases: [
      '🔐 Authentication and authorization wrappers',
      '📊 Analytics and tracking components',
      '🎨 Theme and styling providers',
      '🔄 Data fetching and caching logic'
    ],

    challenges: [
      {
        id: 'create-with-loading-hoc',
        title: 'Create withLoading HOC',
        description: 'Build a HOC that adds loading functionality to any component',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 150,
        code: {
          initial: `import React, { useState, useEffect } from 'react';

// Create a HOC that adds loading functionality
function withLoading(WrappedComponent) {
  // Return a new component that handles loading
}

// Example component to wrap
function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

// Apply the HOC
const UserProfileWithLoading = withLoading(UserProfile);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer'
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      <h1>HOC Demo</h1>
      <UserProfileWithLoading
        user={user}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useEffect } from 'react';

function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    const { isLoading, ...otherProps } = props;

    if (isLoading) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <div>Loading...</div>
          <div style={{ marginTop: '10px' }}>⏳</div>
        </div>
      );
    }

    return <WrappedComponent {...otherProps} />;
  };
}

function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

const UserProfileWithLoading = withLoading(UserProfile);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer'
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div>
      <h1>HOC Demo</h1>
      <UserProfileWithLoading
        user={user}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'render-props',
    title: 'Render Props Pattern',
    description: 'Learn to share code between components using render props',
    explanation: `Render Props is a technique for sharing code between React components using a prop whose value is a function. A component with a render prop takes a function that returns a React element and calls it instead of implementing its own render logic.

How Render Props Work:
1. Component accepts a function as a prop
2. Component calls this function with data/state
3. Function returns JSX to render
4. Enables flexible, reusable logic sharing

Benefits:
- More flexible than HOCs
- Explicit data flow
- Easy to compose
- No naming collisions`,

    bestPractices: [
      '🎯 Use for sharing stateful logic between components',
      '⚡ Name the prop descriptively (render, children, etc.)',
      '🔄 Consider performance implications',
      '📝 Provide good TypeScript types'
    ],

    realWorldUseCases: [
      '🖱️ Mouse tracking and gesture handling',
      '📊 Data fetching and state management',
      '🎨 Animation and transition logic',
      '📱 Responsive design utilities'
    ],

    challenges: [
      {
        id: 'mouse-tracker-render-prop',
        title: 'Mouse Tracker with Render Props',
        description: 'Create a mouse tracker component using render props pattern',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `import React, { useState, useEffect } from 'react';

// Create a MouseTracker component using render props
function MouseTracker({ render }) {
  // Track mouse position
  // Call render prop with mouse data
}

// Example usage components
function MouseDisplay({ x, y }) {
  return (
    <div>
      <h3>Mouse Position</h3>
      <p>X: {x}, Y: {y}</p>
    </div>
  );
}

function MouseFollower({ x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
}

function App() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <h1>Render Props Demo</h1>

      {/* Use MouseTracker with different render functions */}
      <MouseTracker render={({ x, y }) => (
        <MouseDisplay x={x} y={y} />
      )} />

      <MouseTracker render={({ x, y }) => (
        <MouseFollower x={x} y={y} />
      )} />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useEffect } from 'react';

function MouseTracker({ render }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return render(mousePosition);
}

function MouseDisplay({ x, y }) {
  return (
    <div>
      <h3>Mouse Position</h3>
      <p>X: {x}, Y: {y}</p>
    </div>
  );
}

function MouseFollower({ x, y }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: '20px',
        height: '20px',
        backgroundColor: 'red',
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
}

function App() {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <h1>Render Props Demo</h1>

      <MouseTracker render={({ x, y }) => (
        <MouseDisplay x={x} y={y} />
      )} />

      <MouseTracker render={({ x, y }) => (
        <MouseFollower x={x} y={y} />
      )} />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'nextjs-introduction',
    title: 'Next.js – React Framework for Production',
    description: 'Learn Next.js for server-side rendering and static site generation',
    explanation: `Next.js is a React framework that provides infrastructure and simple development experience for server-side rendered applications.

Key Features:
1. **Server-Side Rendering (SSR)** - Pages are rendered on the server
2. **Static Site Generation (SSG)** - Pre-build pages at build time
3. **File-based Routing** - Pages are created based on file structure
4. **API Routes** - Build API endpoints within your Next.js app
5. **Automatic Code Splitting** - Only load necessary code
6. **Built-in CSS Support** - CSS and Sass support out of the box

Benefits:
- Better SEO and performance
- Faster initial page loads
- Automatic optimization
- Great developer experience`,

    bestPractices: [
      '🎯 Use SSG for static content, SSR for dynamic content',
      '⚡ Optimize images with next/image component',
      '🔄 Use getStaticProps for build-time data fetching',
      '📝 Implement proper error pages (404, 500)'
    ],

    realWorldUseCases: [
      '🌐 E-commerce websites with product catalogs',
      '📰 Blogs and content management systems',
      '📊 Marketing websites and landing pages',
      '🏢 Corporate websites with dynamic content'
    ],

    challenges: [
      {
        id: 'nextjs-basic-setup',
        title: 'Next.js Basic Setup',
        description: 'Create a basic Next.js application with multiple pages',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 100,
        code: {
          initial: `// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      {/* Add navigation links */}
    </div>
  );
}

// pages/about.js
export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      {/* Add content and navigation */}
    </div>
  );
}

// pages/blog/[slug].js - Dynamic route
export default function BlogPost() {
  // Get the slug from router
  return (
    <div>
      <h1>Blog Post</h1>
      {/* Display blog post content */}
    </div>
  );
}`,
          solution: `// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <nav>
        <Link href="/about">About</Link> |
        <Link href="/blog/my-first-post">Blog Post</Link>
      </nav>
      <p>This is the home page built with Next.js!</p>
    </div>
  );
}

// pages/about.js
import Link from 'next/link';

export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <nav>
        <Link href="/">Home</Link>
      </nav>
      <p>This is the about page with file-based routing.</p>
    </div>
  );
}

// pages/blog/[slug].js
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
      <nav>
        <Link href="/">Home</Link>
      </nav>
      <p>This is a dynamic route for blog post: {slug}</p>
    </div>
  );
}`
        }
      }
    ]
  },

  {
    id: 'data-fetching-nextjs',
    title: 'Data Fetching in Next.js',
    description: 'Learn different data fetching methods in Next.js',
    explanation: `Next.js provides several methods for fetching data, each optimized for different use cases:

**getStaticProps** (SSG):
- Runs at build time
- Pre-renders page with fetched data
- Great for content that doesn't change often

**getServerSideProps** (SSR):
- Runs on each request
- Server-side rendering with fresh data
- Use for frequently changing data

**getStaticPaths**:
- Used with dynamic routes and getStaticProps
- Defines which paths should be pre-rendered

**Client-side Fetching**:
- Use useEffect or SWR/React Query
- For user-specific or real-time data`,

    bestPractices: [
      '🎯 Use getStaticProps for static content',
      '⚡ Use getServerSideProps sparingly for dynamic data',
      '🔄 Implement proper error handling',
      '📝 Use TypeScript for better data type safety'
    ],

    realWorldUseCases: [
      '📰 Blog posts and articles',
      '🛒 Product catalogs and inventory',
      '👤 User profiles and dashboards',
      '📊 Analytics and reporting pages'
    ],

    challenges: [
      {
        id: 'implement-data-fetching',
        title: 'Implement Data Fetching Methods',
        description: 'Use different Next.js data fetching methods',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '30 min',
        xpReward: 150,
        code: {
          initial: `// pages/posts/index.js - Static Generation
export default function Posts({ posts }) {
  return (
    <div>
      <h1>All Posts</h1>
      {/* Render posts list */}
    </div>
  );
}

// Add getStaticProps to fetch posts at build time
export async function getStaticProps() {
  // Fetch posts data
}

// pages/posts/[id].js - Dynamic Static Generation
export default function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      {/* Render post content */}
    </div>
  );
}

// Add getStaticPaths and getStaticProps
export async function getStaticPaths() {
  // Define which paths to pre-render
}

export async function getStaticProps({ params }) {
  // Fetch post data based on params.id
}

// pages/dashboard.js - Server-side Rendering
export default function Dashboard({ userData }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render user-specific data */}
    </div>
  );
}

// Add getServerSideProps for dynamic data
export async function getServerSideProps(context) {
  // Fetch user-specific data on each request
}`,
          solution: `// pages/posts/index.js
export default function Posts({ posts }) {
  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={\`/posts/\${post.id}\`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  // Simulate API call
  const posts = [
    { id: 1, title: 'First Post', content: 'Content 1' },
    { id: 2, title: 'Second Post', content: 'Content 2' },
    { id: 3, title: 'Third Post', content: 'Content 3' }
  ];

  return {
    props: {
      posts
    },
    revalidate: 60 // Revalidate every 60 seconds
  };
}

// pages/posts/[id].js
export default function Post({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = [
    { id: 1, title: 'First Post', content: 'Content 1' },
    { id: 2, title: 'Second Post', content: 'Content 2' },
    { id: 3, title: 'Third Post', content: 'Content 3' }
  ];

  const paths = posts.map(post => ({
    params: { id: post.id.toString() }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const posts = [
    { id: 1, title: 'First Post', content: 'Content 1' },
    { id: 2, title: 'Second Post', content: 'Content 2' },
    { id: 3, title: 'Third Post', content: 'Content 3' }
  ];

  const post = posts.find(p => p.id.toString() === params.id);

  return {
    props: {
      post
    }
  };
}

// pages/dashboard.js
export default function Dashboard({ userData, timestamp }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {userData.name}!</p>
      <p>Last updated: {timestamp}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  // Simulate fetching user-specific data
  const userData = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  return {
    props: {
      userData,
      timestamp: new Date().toISOString()
    }
  };
}`
        }
      }
    ]
  },

  {
    id: 'react-testing',
    title: 'Testing React Components',
    description: 'Learn to test React components with Jest and React Testing Library',
    explanation: `Testing is crucial for maintaining reliable React applications. React Testing Library encourages testing components the way users interact with them.

Key Testing Concepts:
1. **Unit Tests** - Test individual components in isolation
2. **Integration Tests** - Test component interactions
3. **User-Centric Testing** - Test behavior, not implementation
4. **Accessibility Testing** - Ensure components are accessible

React Testing Library Philosophy:
- Test what users see and do
- Avoid testing implementation details
- Use semantic queries (getByRole, getByLabelText)
- Focus on user interactions`,

    bestPractices: [
      '🎯 Test user behavior, not implementation details',
      '⚡ Use semantic queries for better accessibility',
      '🔄 Mock external dependencies and APIs',
      '📝 Write descriptive test names and organize tests well'
    ],

    realWorldUseCases: [
      '🔍 Form validation and submission testing',
      '🎮 Interactive component behavior testing',
      '📊 Data display and filtering testing',
      '🔐 Authentication flow testing'
    ],

    challenges: [
      {
        id: 'test-react-components',
        title: 'Test React Components',
        description: 'Write comprehensive tests for React components',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '35 min',
        xpReward: 150,
        code: {
          initial: `// Counter.js
import React, { useState } from 'react';

export default function Counter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// Counter.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

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
});`,
          solution: `// Counter.js
import React, { useState } from 'react';

export default function Counter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// Counter.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter Component', () => {
  test('renders with initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  test('increments count when increment button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('Increment');

    fireEvent.click(incrementButton);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    fireEvent.click(incrementButton);
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });

  test('decrements count when decrement button is clicked', () => {
    render(<Counter initialValue={5} />);
    const decrementButton = screen.getByText('Decrement');

    fireEvent.click(decrementButton);
    expect(screen.getByText('Count: 4')).toBeInTheDocument();
  });

  test('resets count when reset button is clicked', () => {
    render(<Counter initialValue={10} />);
    const resetButton = screen.getByText('Reset');

    fireEvent.click(resetButton);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});`
        }
      }
    ]
  },

  {
    id: 'react-typescript',
    title: 'React with TypeScript',
    description: 'Learn to use TypeScript with React for better type safety',
    explanation: `TypeScript adds static type checking to React, helping catch errors early and improving developer experience with better IntelliSense and refactoring support.

Key TypeScript Concepts in React:
1. **Component Props Types** - Define prop interfaces
2. **State Types** - Type useState and useReducer
3. **Event Types** - Type event handlers properly
4. **Ref Types** - Type useRef correctly
5. **Generic Components** - Create reusable typed components

Benefits:
- Catch errors at compile time
- Better IDE support and autocomplete
- Improved refactoring capabilities
- Self-documenting code
- Better team collaboration`,

    bestPractices: [
      '🎯 Define interfaces for all props and state',
      '⚡ Use generic types for reusable components',
      '🔄 Leverage TypeScript strict mode',
      '📝 Use proper event types for handlers'
    ],

    realWorldUseCases: [
      '🏢 Large-scale enterprise applications',
      '👥 Team-based development projects',
      '📚 Component libraries and design systems',
      '🔧 Complex state management scenarios'
    ],

    challenges: [
      {
        id: 'typescript-react-components',
        title: 'TypeScript React Components',
        description: 'Create properly typed React components with TypeScript',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '30 min',
        xpReward: 140,
        code: {
          initial: `// Define proper TypeScript interfaces and types

// User interface
interface User {
  // Define user properties
}

// Props interface for UserCard component
interface UserCardProps {
  // Define props
}

// UserCard component with proper typing
function UserCard(/* add proper props typing */) {
  return (
    <div>
      {/* Implement component */}
    </div>
  );
}

// Props interface for UserList component
interface UserListProps {
  // Define props including event handlers
}

// UserList component with proper typing
function UserList(/* add proper props typing */) {
  return (
    <div>
      {/* Implement component */}
    </div>
  );
}

// Main App component
function App() {
  // Add proper state typing
  const [users, setUsers] = useState(/* initial state */);
  const [selectedUser, setSelectedUser] = useState(/* initial state */);

  // Add proper event handler typing
  const handleUserSelect = (/* parameters */) => {
    // Implementation
  };

  return (
    <div>
      <h1>TypeScript React Demo</h1>
      {/* Use components */}
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
}

function UserCard({ user, isSelected, onSelect }: UserCardProps) {
  return (
    <div
      style={{
        border: isSelected ? '2px solid blue' : '1px solid gray',
        padding: '10px',
        margin: '5px',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(user)}
    >
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
}

function UserList({ users, selectedUser, onUserSelect }: UserListProps) {
  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          isSelected={selectedUser?.id === user.id}
          onSelect={onUserSelect}
        />
      ))}
    </div>
  );
}

function App() {
  const [users] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator' }
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelect = (user: User): void => {
    setSelectedUser(user);
  };

  return (
    <div>
      <h1>TypeScript React Demo</h1>
      <UserList
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
      />
      {selectedUser && (
        <div>
          <h2>Selected User</h2>
          <p>{selectedUser.name} ({selectedUser.role})</p>
        </div>
      )}
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'code-splitting',
    title: 'Code Splitting and Lazy Loading',
    description: 'Learn to optimize bundle size with code splitting and lazy loading',
    explanation: `Code splitting allows you to split your code into various bundles which can then be loaded on demand or in parallel. This helps reduce the initial bundle size and improves performance.

React provides built-in support for code splitting through:
1. **React.lazy()** - Dynamically import components
2. **Suspense** - Handle loading states for lazy components
3. **Dynamic imports** - Split code at the module level

Benefits:
- Smaller initial bundle size
- Faster initial page load
- Better user experience
- Efficient resource utilization`,

    bestPractices: [
      '🎯 Split code at route level for maximum impact',
      '⚡ Use Suspense with meaningful loading states',
      '🔄 Preload critical components when possible',
      '📝 Monitor bundle sizes and loading performance'
    ],

    realWorldUseCases: [
      '🌐 Large applications with multiple routes',
      '📱 Mobile apps with limited bandwidth',
      '🎮 Feature-rich applications with optional modules',
      '📊 Dashboard applications with heavy components'
    ],

    challenges: [
      {
        id: 'implement-code-splitting',
        title: 'Implement Code Splitting',
        description: 'Add code splitting to a React application with lazy loading',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Convert these to lazy-loaded components
import Home from './components/Home';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div>Loading...</div>
      <div style={{ marginTop: '10px' }}>⏳</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Home</Link> |
        <Link to="/about">About</Link> |
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/profile">Profile</Link>
      </nav>

      {/* Add Suspense wrapper and convert to lazy routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
          solution: `import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Lazy load components
const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Profile = React.lazy(() => import('./components/Profile'));

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div>Loading...</div>
      <div style={{ marginTop: '10px' }}>⏳</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Home</Link> |
        <Link to="/about">About</Link> |
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/profile">Profile</Link>
      </nav>

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'portals',
    title: 'React Portals',
    description: 'Learn to render components outside the normal DOM hierarchy',
    explanation: `React Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. This is useful for modals, tooltips, and overlays.

How Portals Work:
1. **ReactDOM.createPortal()** - Creates a portal
2. **Target DOM node** - Where the portal content will render
3. **Event bubbling** - Events still bubble up through React tree

Common Use Cases:
- Modal dialogs
- Tooltips and popovers
- Dropdown menus
- Notifications and toasts
- Full-screen overlays`,

    bestPractices: [
      '🎯 Use portals for UI that needs to break out of container',
      '⚡ Handle focus management properly in modals',
      '🔄 Clean up portal containers when unmounting',
      '📝 Consider accessibility implications'
    ],

    realWorldUseCases: [
      '🪟 Modal dialogs and overlays',
      '💬 Tooltips and help text',
      '📋 Dropdown menus and select components',
      '🔔 Notification systems'
    ],

    challenges: [
      {
        id: 'create-modal-portal',
        title: 'Create Modal with Portal',
        description: 'Build a modal component using React portals',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 100,
        code: {
          initial: `import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// Create a Modal component using portals
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // Use createPortal to render modal outside component tree
  return ReactDOM.createPortal(
    // Modal content goes here
    null,
    document.body // or document.getElementById('modal-root')
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Portal Demo</h1>
      <p>This content is in the normal React tree.</p>

      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2>Modal Content</h2>
        <p>This modal is rendered using a portal!</p>
        <button onClick={() => setIsModalOpen(false)}>
          Close Modal
        </button>
      </Modal>
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80%',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Portal Demo</h1>
      <p>This content is in the normal React tree.</p>

      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2>Modal Content</h2>
        <p>This modal is rendered using a portal!</p>
        <p>Press Escape or click outside to close.</p>
        <button onClick={() => setIsModalOpen(false)}>
          Close Modal
        </button>
      </Modal>
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'styled-components',
    title: 'Styled Components – CSS-in-JS',
    description: 'Learn to style React components with CSS-in-JS using styled-components',
    explanation: `Styled Components is a CSS-in-JS library that allows you to write CSS directly in your JavaScript files. It creates actual CSS classes and provides dynamic styling based on props.

Key Features:
1. **Component-based styling** - Styles are scoped to components
2. **Dynamic styling** - Change styles based on props
3. **Automatic vendor prefixing** - No need for autoprefixer
4. **Dead code elimination** - Unused styles are removed
5. **Theme support** - Global theming system

Benefits:
- No class name conflicts
- Dynamic styling capabilities
- Better developer experience
- Automatic critical CSS`,

    bestPractices: [
      '🎯 Use semantic component names for better readability',
      '⚡ Leverage props for dynamic styling',
      '🔄 Create reusable styled components',
      '📝 Use themes for consistent design systems'
    ],

    realWorldUseCases: [
      '🎨 Design systems and component libraries',
      '🌙 Dark/light theme implementations',
      '📱 Responsive design with breakpoints',
      '🎮 Interactive UI components'
    ],

    challenges: [
      {
        id: 'create-styled-components',
        title: 'Create Styled Components',
        description: 'Build a card component using styled-components with dynamic styling',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `import React, { useState } from 'react';
import styled from 'styled-components';

// Create styled components for a card
const Card = styled.div\`
  // Add card styles
\`;

const CardHeader = styled.div\`
  // Add header styles
\`;

const CardBody = styled.div\`
  // Add body styles
\`;

const Button = styled.button\`
  // Add button styles with dynamic colors based on props
\`;

function App() {
  const [selectedCard, setSelectedCard] = useState(null);

  const cards = [
    { id: 1, title: 'Card 1', content: 'This is the first card', type: 'primary' },
    { id: 2, title: 'Card 2', content: 'This is the second card', type: 'secondary' },
    { id: 3, title: 'Card 3', content: 'This is the third card', type: 'success' }
  ];

  return (
    <div>
      <h1>Styled Components Demo</h1>
      {cards.map(card => (
        <Card key={card.id} selected={selectedCard === card.id}>
          <CardHeader>
            <h3>{card.title}</h3>
          </CardHeader>
          <CardBody>
            <p>{card.content}</p>
            <Button
              variant={card.type}
              onClick={() => setSelectedCard(card.id)}
            >
              Select Card
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';
import styled from 'styled-components';

const Card = styled.div\`
  border: 2px solid \${props => props.selected ? '#007bff' : '#e0e0e0'};
  border-radius: 8px;
  margin: 16px 0;
  padding: 0;
  background: white;
  box-shadow: \${props => props.selected ? '0 4px 12px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
  transition: all 0.3s ease;
  transform: \${props => props.selected ? 'translateY(-2px)' : 'translateY(0)'};

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }
\`;

const CardHeader = styled.div\`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 6px 6px 0 0;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
\`;

const CardBody = styled.div\`
  padding: 16px;

  p {
    margin: 0 0 16px 0;
    color: #666;
    line-height: 1.5;
  }
\`;

const Button = styled.button\`
  background: \${props => {
    switch(props.variant) {
      case 'primary': return '#007bff';
      case 'secondary': return '#6c757d';
      case 'success': return '#28a745';
      default: return '#007bff';
    }
  }};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
\`;

function App() {
  const [selectedCard, setSelectedCard] = useState(null);

  const cards = [
    { id: 1, title: 'Card 1', content: 'This is the first card', type: 'primary' },
    { id: 2, title: 'Card 2', content: 'This is the second card', type: 'secondary' },
    { id: 3, title: 'Card 3', content: 'This is the third card', type: 'success' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Styled Components Demo</h1>
      {cards.map(card => (
        <Card key={card.id} selected={selectedCard === card.id}>
          <CardHeader>
            <h3>{card.title}</h3>
          </CardHeader>
          <CardBody>
            <p>{card.content}</p>
            <Button
              variant={card.type}
              onClick={() => setSelectedCard(card.id)}
            >
              Select Card
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'react-query',
    title: 'React Query – Server State Management',
    description: 'Learn to manage server state with React Query (TanStack Query)',
    explanation: `React Query is a powerful library for fetching, caching, and updating server state in React applications. It provides hooks for data fetching with built-in caching, background updates, and error handling.

Key Features:
1. **Automatic caching** - Smart caching with stale-while-revalidate
2. **Background updates** - Keep data fresh automatically
3. **Optimistic updates** - Update UI before server response
4. **Error handling** - Built-in error states and retry logic
5. **Pagination support** - Easy pagination and infinite queries

Benefits:
- Reduces boilerplate code
- Better user experience with caching
- Automatic loading and error states
- Background synchronization`,

    bestPractices: [
      '🎯 Use query keys consistently for proper caching',
      '⚡ Implement optimistic updates for better UX',
      '🔄 Configure stale time based on data freshness needs',
      '📝 Handle loading and error states properly'
    ],

    realWorldUseCases: [
      '📊 Dashboard applications with real-time data',
      '🛒 E-commerce product catalogs',
      '👥 Social media feeds and timelines',
      '📱 Mobile apps with offline support'
    ],

    challenges: [
      {
        id: 'implement-react-query',
        title: 'Implement React Query',
        description: 'Build a data fetching system using React Query',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '30 min',
        xpReward: 150,
        code: {
          initial: `import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API functions
const fetchUsers = async () => {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
};

function UserList() {
  // Implement useQuery for fetching users
  const { data: users, isLoading, error } = useQuery({
    // Add query configuration
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreateUserForm() {
  const queryClient = useQueryClient();

  // Implement useMutation for creating users
  const createUserMutation = useMutation({
    // Add mutation configuration
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email')
    };

    createUserMutation.mutate(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {createUserMutation.error && (
        <div>Error: {createUserMutation.error.message}</div>
      )}
    </form>
  );
}

function App() {
  return (
    <div>
      <h1>React Query Demo</h1>
      <CreateUserForm />
      <UserList />
    </div>
  );
}

export default App;`,
          solution: `import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock API functions
const fetchUsers = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock data
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
};

const createUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock creation
  return {
    id: Date.now(),
    ...userData
  };
};

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreateUserForm() {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['users'] });

      // Or optimistically update the cache
      queryClient.setQueryData(['users'], (oldUsers) => [
        ...(oldUsers || []),
        newUser
      ]);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email')
    };

    createUserMutation.mutate(userData);
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2>Create User</h2>
      <div style={{ marginBottom: '10px' }}>
        <input name="name" placeholder="Name" required style={{ marginRight: '10px' }} />
        <input name="email" type="email" placeholder="Email" required />
      </div>
      <button type="submit" disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {createUserMutation.error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {createUserMutation.error.message}
        </div>
      )}
      {createUserMutation.isSuccess && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          User created successfully!
        </div>
      )}
    </form>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Query Demo</h1>
      <CreateUserForm />
      <UserList />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'redux-toolkit',
    title: 'Redux Toolkit – Modern Redux',
    description: 'Learn modern Redux with Redux Toolkit for state management',
    explanation: `Redux Toolkit (RTK) is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies Redux usage and includes utilities to simplify common use cases.

Key Features:
1. **configureStore()** - Simplified store setup
2. **createSlice()** - Reduces boilerplate for actions and reducers
3. **createAsyncThunk()** - Handles async logic
4. **RTK Query** - Data fetching and caching solution
5. **Immer integration** - Write "mutative" logic safely

Benefits:
- Less boilerplate code
- Built-in best practices
- Better developer experience
- TypeScript support out of the box`,

    bestPractices: [
      '🎯 Use createSlice for most Redux logic',
      '⚡ Leverage createAsyncThunk for async operations',
      '🔄 Structure state by feature, not by type',
      '📝 Use RTK Query for server state when possible'
    ],

    realWorldUseCases: [
      '🏢 Large applications with complex state',
      '👥 Multi-user applications with shared state',
      '📊 Applications with heavy data manipulation',
      '🎮 Games with complex state interactions'
    ],

    challenges: [
      {
        id: 'build-redux-counter',
        title: 'Build Redux Counter with RTK',
        description: 'Create a counter application using Redux Toolkit',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 130,
        code: {
          initial: `import React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Create a counter slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    history: []
  },
  reducers: {
    // Add reducer functions
    increment: (state) => {
      // Implement increment logic
    },
    decrement: (state) => {
      // Implement decrement logic
    },
    incrementByAmount: (state, action) => {
      // Implement increment by amount logic
    },
    reset: (state) => {
      // Implement reset logic
    }
  }
});

// Export actions
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const history = useSelector((state) => state.counter.history);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Count: {count}</h2>

      <div>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>

      <div>
        <h3>History:</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>Redux Toolkit Counter</h1>
        <Counter />
      </div>
    </Provider>
  );
}

export default App;`,
          solution: `import React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    history: []
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
      state.history.push(\`Incremented to \${state.value}\`);
    },
    decrement: (state) => {
      state.value -= 1;
      state.history.push(\`Decremented to \${state.value}\`);
    },
    incrementByAmount: (state, action) => {
      const amount = action.payload;
      state.value += amount;
      state.history.push(\`Incremented by \${amount} to \${state.value}\`);
    },
    reset: (state) => {
      state.value = 0;
      state.history.push('Reset to 0');
    }
  }
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const history = useSelector((state) => state.counter.history);
  const dispatch = useDispatch();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Count: {count}</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => dispatch(increment())}
          style={{ margin: '0 5px', padding: '8px 16px' }}
        >
          +1
        </button>
        <button
          onClick={() => dispatch(decrement())}
          style={{ margin: '0 5px', padding: '8px 16px' }}
        >
          -1
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          style={{ margin: '0 5px', padding: '8px 16px' }}
        >
          +5
        </button>
        <button
          onClick={() => dispatch(reset())}
          style={{ margin: '0 5px', padding: '8px 16px' }}
        >
          Reset
        </button>
      </div>

      <div>
        <h3>History:</h3>
        <ul style={{ maxHeight: '200px', overflow: 'auto' }}>
          {history.slice(-10).map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <div>
        <h1>Redux Toolkit Counter</h1>
        <Counter />
      </div>
    </Provider>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'react-suspense',
    title: 'React Suspense – Declarative Loading',
    description: 'Learn to handle loading states declaratively with Suspense',
    explanation: `React Suspense lets you declaratively specify the loading state for a part of the component tree if it's not yet ready to be displayed. It works with lazy loading, data fetching, and other asynchronous operations.

How Suspense Works:
1. **Suspense boundary** - Wraps components that might suspend
2. **Fallback UI** - Shows while waiting for suspended components
3. **Error boundaries** - Handle errors in suspended components
4. **Concurrent features** - Works with React's concurrent mode

Use Cases:
- Code splitting with React.lazy()
- Data fetching with libraries like Relay
- Image loading and other async resources
- Progressive enhancement`,

    bestPractices: [
      '🎯 Place Suspense boundaries at appropriate levels',
      '⚡ Provide meaningful fallback UIs',
      '🔄 Combine with Error Boundaries for robust error handling',
      '📝 Use multiple Suspense boundaries for granular loading'
    ],

    realWorldUseCases: [
      '📱 Progressive web apps with lazy loading',
      '🖼️ Image galleries with lazy loading',
      '📊 Dashboard components that load independently',
      '🎮 Game assets and resources loading'
    ],

    challenges: [
      {
        id: 'implement-suspense-loading',
        title: 'Implement Suspense Loading',
        description: 'Create a component tree with multiple Suspense boundaries',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 110,
        code: {
          initial: `import React, { Suspense, lazy, useState } from 'react';

// Lazy load components
const HeavyComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div>
            <h3>Heavy Component Loaded!</h3>
            <p>This component took time to load.</p>
          </div>
        )
      });
    }, 2000);
  });
});

const AnotherComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div>
            <h3>Another Component</h3>
            <p>This is another lazy-loaded component.</p>
          </div>
        )
      });
    }, 1000);
  });
});

// Loading components
function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div>Loading...</div>
      <div style={{ marginTop: '10px' }}>⏳</div>
    </div>
  );
}

function QuickLoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <div>Loading quickly...</div>
    </div>
  );
}

function App() {
  const [showHeavy, setShowHeavy] = useState(false);
  const [showAnother, setShowAnother] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Suspense Demo</h1>

      <div>
        <button onClick={() => setShowHeavy(!showHeavy)}>
          {showHeavy ? 'Hide' : 'Load'} Heavy Component
        </button>
        <button onClick={() => setShowAnother(!showAnother)}>
          {showAnother ? 'Hide' : 'Load'} Another Component
        </button>
      </div>

      {/* Add Suspense boundaries with appropriate fallbacks */}
      {showHeavy && (
        // Wrap HeavyComponent with Suspense
        <HeavyComponent />
      )}

      {showAnother && (
        // Wrap AnotherComponent with Suspense
        <AnotherComponent />
      )}
    </div>
  );
}

export default App;`,
          solution: `import React, { Suspense, lazy, useState } from 'react';

const HeavyComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div style={{
            border: '2px solid #007bff',
            padding: '20px',
            margin: '10px 0',
            borderRadius: '8px'
          }}>
            <h3>Heavy Component Loaded!</h3>
            <p>This component took 2 seconds to load.</p>
          </div>
        )
      });
    }, 2000);
  });
});

const AnotherComponent = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div style={{
            border: '2px solid #28a745',
            padding: '20px',
            margin: '10px 0',
            borderRadius: '8px'
          }}>
            <h3>Another Component</h3>
            <p>This component took 1 second to load.</p>
          </div>
        )
      });
    }, 1000);
  });
});

function LoadingSpinner() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      border: '2px dashed #ccc',
      margin: '10px 0',
      borderRadius: '8px'
    }}>
      <div>Loading heavy component...</div>
      <div style={{ marginTop: '10px' }}>⏳</div>
    </div>
  );
}

function QuickLoadingSpinner() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '10px',
      border: '2px dashed #28a745',
      margin: '10px 0',
      borderRadius: '8px'
    }}>
      <div>Loading quickly...</div>
      <div style={{ marginTop: '5px' }}>⚡</div>
    </div>
  );
}

function App() {
  const [showHeavy, setShowHeavy] = useState(false);
  const [showAnother, setShowAnother] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Suspense Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowHeavy(!showHeavy)}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          {showHeavy ? 'Hide' : 'Load'} Heavy Component
        </button>
        <button
          onClick={() => setShowAnother(!showAnother)}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          {showAnother ? 'Hide' : 'Load'} Another Component
        </button>
      </div>

      {showHeavy && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyComponent />
        </Suspense>
      )}

      {showAnother && (
        <Suspense fallback={<QuickLoadingSpinner />}>
          <AnotherComponent />
        </Suspense>
      )}
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'react-helmet',
    title: 'React Helmet – Managing Document Head',
    description: 'Learn to manage document head elements with React Helmet',
    explanation: `React Helmet is a library that allows you to manage changes to the document head from within your React components. It's essential for SEO, social media sharing, and dynamic page metadata.

Key Features:
1. **Dynamic title and meta tags** - Change based on component state
2. **SEO optimization** - Proper meta tags for search engines
3. **Social media tags** - Open Graph and Twitter Card support
4. **Server-side rendering** - Works with SSR frameworks
5. **Nested components** - Child components can override parent head elements

Benefits:
- Better SEO performance
- Dynamic social media previews
- Improved accessibility
- Professional web app behavior`,

    bestPractices: [
      '🎯 Set unique titles for each page/route',
      '⚡ Include relevant meta descriptions',
      '🔄 Use Open Graph tags for social sharing',
      '📝 Implement structured data when appropriate'
    ],

    realWorldUseCases: [
      '🌐 Multi-page applications with dynamic content',
      '📰 Blog and content management systems',
      '🛒 E-commerce product pages',
      '📱 Progressive web applications'
    ],

    challenges: [
      {
        id: 'implement-react-helmet',
        title: 'Implement React Helmet',
        description: 'Add dynamic head management to a React application',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 80,
        code: {
          initial: `import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

function BlogPost({ post }) {
  return (
    <article>
      {/* Add Helmet to manage head elements */}

      <h1>{post.title}</h1>
      <p className="meta">By {post.author} on {post.date}</p>
      <div className="content">
        {post.content}
      </div>
    </article>
  );
}

function ProductPage({ product }) {
  return (
    <div>
      {/* Add Helmet for product page SEO */}

      <h1>{product.name}</h1>
      <p>Price: \${product.price}</p>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} />
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('blog');

  const blogPost = {
    title: 'Getting Started with React Helmet',
    author: 'John Doe',
    date: '2024-01-15',
    content: 'React Helmet is a powerful tool for managing document head...',
    image: 'https://example.com/blog-image.jpg'
  };

  const product = {
    name: 'Awesome React Course',
    price: 99.99,
    description: 'Learn React from beginner to advanced level',
    image: 'https://example.com/course-image.jpg'
  };

  return (
    <div>
      {/* Add default Helmet for the app */}

      <nav>
        <button onClick={() => setCurrentPage('blog')}>Blog Post</button>
        <button onClick={() => setCurrentPage('product')}>Product</button>
      </nav>

      {currentPage === 'blog' && <BlogPost post={blogPost} />}
      {currentPage === 'product' && <ProductPage product={product} />}
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

function BlogPost({ post }) {
  return (
    <article>
      <Helmet>
        <title>{post.title} | My Blog</title>
        <meta name="description" content={post.content.substring(0, 160)} />
        <meta name="author" content={post.author} />

        {/* Open Graph tags for social media */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content.substring(0, 160)} />
        <meta name="twitter:image" content={post.image} />

        {/* Structured data */}
        <script type="application/ld+json">
          {\`{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "\${post.title}",
            "author": {
              "@type": "Person",
              "name": "\${post.author}"
            },
            "datePublished": "\${post.date}"
          }\`}
        </script>
      </Helmet>

      <h1>{post.title}</h1>
      <p className="meta">By {post.author} on {post.date}</p>
      <div className="content">
        {post.content}
      </div>
    </article>
  );
}

function ProductPage({ product }) {
  return (
    <div>
      <Helmet>
        <title>{product.name} - \${product.price} | My Store</title>
        <meta name="description" content={product.description} />

        {/* Open Graph tags for products */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="USD" />

        {/* Product structured data */}
        <script type="application/ld+json">
          {\`{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "\${product.name}",
            "description": "\${product.description}",
            "image": "\${product.image}",
            "offers": {
              "@type": "Offer",
              "price": "\${product.price}",
              "priceCurrency": "USD"
            }
          }\`}
        </script>
      </Helmet>

      <h1>{product.name}</h1>
      <p>Price: \${product.price}</p>
      <p>{product.description}</p>
      <img src={product.image} alt={product.name} style={{ maxWidth: '300px' }} />
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('blog');

  const blogPost = {
    title: 'Getting Started with React Helmet',
    author: 'John Doe',
    date: '2024-01-15',
    content: 'React Helmet is a powerful tool for managing document head elements dynamically. It allows you to set titles, meta tags, and other head elements based on your component state.',
    image: 'https://example.com/blog-image.jpg'
  };

  const product = {
    name: 'Awesome React Course',
    price: 99.99,
    description: 'Learn React from beginner to advanced level with hands-on projects and real-world examples.',
    image: 'https://example.com/course-image.jpg'
  };

  return (
    <div style={{ padding: '20px' }}>
      <Helmet>
        <title>My React App</title>
        <meta name="description" content="A demo application showcasing React Helmet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <nav style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentPage('blog')}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          Blog Post
        </button>
        <button
          onClick={() => setCurrentPage('product')}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          Product
        </button>
      </nav>

      {currentPage === 'blog' && <BlogPost post={blogPost} />}
      {currentPage === 'product' && <ProductPage product={product} />}
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'react-spring',
    title: 'React Spring – Animations',
    description: 'Learn to create smooth animations with React Spring',
    explanation: `React Spring is a spring-physics based animation library for React. It provides a more natural way to animate components compared to traditional CSS transitions.

Key Features:
1. **Spring physics** - Natural, realistic animations
2. **Hooks-based API** - Modern React patterns
3. **Performance optimized** - Uses requestAnimationFrame
4. **Flexible** - Works with any CSS property
5. **Gesture support** - Integration with touch and mouse events

Animation Types:
- useSpring - Single spring animation
- useSprings - Multiple springs
- useTransition - Enter/exit animations
- useChain - Sequence animations`,

    bestPractices: [
      '🎯 Use spring physics for natural motion',
      '⚡ Optimize performance with native animations',
      '🔄 Chain animations for complex sequences',
      '📝 Consider accessibility and reduced motion preferences'
    ],

    realWorldUseCases: [
      '🎮 Interactive UI elements and micro-interactions',
      '📱 Mobile app transitions and gestures',
      '🎨 Creative websites and portfolios',
      '📊 Data visualization animations'
    ],

    challenges: [
      {
        id: 'create-spring-animations',
        title: 'Create Spring Animations',
        description: 'Build animated components using React Spring',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `import React, { useState } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';

function AnimatedBox() {
  const [isToggled, setIsToggled] = useState(false);

  // Create a spring animation for the box
  const springProps = useSpring({
    // Add spring configuration
  });

  return (
    <div>
      <h3>Animated Box</h3>
      <button onClick={() => setIsToggled(!isToggled)}>
        Toggle Animation
      </button>

      <animated.div
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'blue',
          margin: '20px 0',
          ...springProps
        }}
      />
    </div>
  );
}

function AnimatedList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  // Create transition animations for list items
  const transitions = useTransition(items, {
    // Add transition configuration
  });

  const addItem = () => {
    setItems([...items, \`Item \${items.length + 1}\`]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3>Animated List</h3>
      <button onClick={addItem}>Add Item</button>

      <div>
        {transitions((style, item, t, index) => (
          <animated.div
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              cursor: 'pointer',
              ...style
            }}
            onClick={() => removeItem(index)}
          >
            {item} (click to remove)
          </animated.div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Spring Animations</h1>
      <AnimatedBox />
      <AnimatedList />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';
import { useSpring, animated, useTransition } from '@react-spring/web';

function AnimatedBox() {
  const [isToggled, setIsToggled] = useState(false);

  const springProps = useSpring({
    transform: isToggled ? 'scale(1.5) rotate(45deg)' : 'scale(1) rotate(0deg)',
    backgroundColor: isToggled ? '#ff6b6b' : '#4ecdc4',
    borderRadius: isToggled ? '50%' : '10%',
    config: { tension: 300, friction: 10 }
  });

  return (
    <div>
      <h3>Animated Box</h3>
      <button onClick={() => setIsToggled(!isToggled)}>
        Toggle Animation
      </button>

      <animated.div
        style={{
          width: 100,
          height: 100,
          margin: '20px 0',
          cursor: 'pointer',
          ...springProps
        }}
        onClick={() => setIsToggled(!isToggled)}
      />
    </div>
  );
}

function AnimatedList() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const transitions = useTransition(items, {
    from: { opacity: 0, transform: 'translateX(-100px)' },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0, transform: 'translateX(100px)' },
    config: { tension: 200, friction: 20 }
  });

  const addItem = () => {
    setItems([...items, \`Item \${items.length + 1}\`]);
  };

  const removeItem = (itemToRemove) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  return (
    <div>
      <h3>Animated List</h3>
      <button onClick={addItem} style={{ marginBottom: '20px' }}>
        Add Item
      </button>

      <div>
        {transitions((style, item) => (
          <animated.div
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              cursor: 'pointer',
              border: '1px solid #ddd',
              ...style
            }}
            onClick={() => removeItem(item)}
          >
            {item} (click to remove)
          </animated.div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>React Spring Animations</h1>
      <AnimatedBox />
      <AnimatedList />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  // Advanced React Router
  {
    id: 'react-router-advanced',
    title: 'Advanced React Router',
    description: 'Learn advanced routing concepts including nested routes and route guards',
    explanation: `Advanced React Router features enable complex navigation patterns in single-page applications. This includes nested routing, route protection, and dynamic route handling.

Advanced Features:
1. **Nested Routes** - Routes within routes for complex layouts
2. **Route Guards** - Protect routes based on authentication
3. **Dynamic Routes** - Routes with parameters and query strings
4. **Programmatic Navigation** - Navigate using code instead of links

Common patterns include dashboard layouts with sidebar navigation, protected admin areas, and multi-step forms with route-based steps.`,
    animationScript: 'Show nested route structure with protected routes and dynamic navigation',
    scenario: '🛣️ Build a complex routing system with nested routes, authentication guards, and dynamic navigation.',

    challenges: [
      {
        id: 'nested-routes-dashboard',
        title: 'Build Nested Routes Dashboard',
        description: 'Create a dashboard with nested routes for different sections',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 140,
        code: {
          initial: `import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>
              Overview
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            {/* TODO: Add link to users section */}
          </li>
          <li style={{ marginBottom: '10px' }}>
            {/* TODO: Add link to settings section */}
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px' }}>
        {/* TODO: Add Outlet for nested routes */}
      </main>
    </div>
  );
}

// Dashboard Overview Component
function Overview() {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}

// Users Section Component
function Users() {
  return (
    <div>
      <h2>Users Management</h2>
      <p>Manage your users here.</p>
    </div>
  );
}

// Settings Section Component
function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your application settings.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: Set up nested routes structure */}
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
          solution: `import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>
              Overview
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard/users" style={{ textDecoration: 'none', color: '#007bff' }}>
              Users
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard/settings" style={{ textDecoration: 'none', color: '#007bff' }}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

// Dashboard Overview Component
function Overview() {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}

// Users Section Component
function Users() {
  return (
    <div>
      <h2>Users Management</h2>
      <p>Manage your users here.</p>
    </div>
  );
}

// Settings Section Component
function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your application settings.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page - <Link to="/dashboard">Go to Dashboard</Link></div>} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;`
        },
        hints: [
          'Use nested Route components with the parent route containing an Outlet',
          'The parent route should render the layout component',
          'Child routes are defined inside the parent Route component',
          'Use the index prop for the default child route'
        ]
      }
    ],
    estimatedTime: '75 min',
    difficulty: 'advanced',
    prerequisites: ['react-router', 'custom-hooks'],
    nextTopics: ['accessibility'],
    category: 'advanced'
  },

  // React Accessibility (a11y)
  {
    id: 'accessibility',
    title: 'React Accessibility (a11y)',
    description: 'Learn to build accessible React applications for all users',
    explanation: `Accessibility (a11y) ensures your React applications can be used by everyone, including people with disabilities. Learn to implement proper ARIA attributes, keyboard navigation, and screen reader support.

🔹 **Why Accessibility Matters:**
- **Inclusive Design**: Make your app usable by everyone
- **Legal Compliance**: Meet accessibility standards and regulations
- **Better UX**: Improved usability benefits all users
- **SEO Benefits**: Better semantic HTML improves search rankings

🔸 **Key Accessibility Features:**
- **ARIA Attributes**: Provide context for screen readers
- **Keyboard Navigation**: Full functionality without a mouse
- **Focus Management**: Proper focus indicators and flow
- **Semantic HTML**: Use appropriate HTML elements

🧠 **Analogy:** Think of accessibility like building ramps alongside stairs - it provides alternative ways for everyone to access the same content and functionality.`,
    animationScript: 'Show screen reader navigation and keyboard-only interaction with React components',
    scenario: '♿ Build fully accessible React components with proper ARIA attributes and keyboard navigation.',
    challenges: [
      {
        id: 'accessible-form-component',
        title: 'Build Accessible Form Component',
        description: 'Create a form with proper accessibility features including ARIA labels and keyboard navigation',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 160,
        code: {
          initial: `import React, { useState, useRef } from 'react';

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Contact Form</h1>

      <form onSubmit={handleSubmit}>
        {/* TODO: Add proper accessibility features */}
        <div style={{ marginBottom: '20px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.name ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.name && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.email ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.message ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.message && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AccessibleForm;`,
          solution: `import React, { useState, useRef } from 'react';

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    } else {
      // Focus first error field for better accessibility
      if (newErrors.name) nameInputRef.current?.focus();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Contact Form</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name">Name: *</label>
          <input
            id="name"
            ref={nameInputRef}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.name ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.name && (
            <div
              id="name-error"
              role="alert"
              aria-live="polite"
              style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email: *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.email ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && (
            <div
              id="email-error"
              role="alert"
              aria-live="polite"
              style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="message">Message: *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
            aria-required="true"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.message ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.message && (
            <div
              id="message-error"
              role="alert"
              aria-live="polite"
              style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}
            >
              {errors.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.outline = '2px solid #0056b3'}
          onBlur={(e) => e.target.style.outline = 'none'}
        >
          Submit Form
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        * Required fields
      </p>
    </div>
  );
}

export default AccessibleForm;`
        },
        hints: [
          'Use htmlFor attribute on labels to associate them with inputs',
          'Add aria-required, aria-invalid, and aria-describedby attributes',
          'Use role="alert" and aria-live="polite" for error messages',
          'Implement focus management to help users navigate errors',
          'Add proper focus indicators for keyboard navigation'
        ]
      }
    ],
    estimatedTime: '55 min',
    difficulty: 'advanced',
    prerequisites: ['forms-and-inputs', 'useref-basics'],
    nextTopics: ['react-testing'],
    category: 'advanced'
  },

      <div style={fieldStyle}>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          style={inputStyle}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />
        {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword.message}</span>}
      </div>

      <div style={fieldStyle}>
        <label htmlFor="name">Full Name:</label>
        <input
          id="name"
          type="text"
          style={inputStyle}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
        />
        {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
      </div>

      <div style={fieldStyle}>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          style={inputStyle}
          {...register('age', {
            required: 'Age is required',
            min: {
              value: 18,
              message: 'Must be at least 18 years old'
            },
            max: {
              value: 120,
              message: 'Age must be realistic'
            }
          })}
        />
        {errors.age && <span style={errorStyle}>{errors.age.message}</span>}
      </div>

      <button
        type="submit"
        style={{
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Register
      </button>
    </form>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <RegistrationForm />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'react-router-advanced',
    title: 'Advanced React Router',
    description: 'Learn advanced routing concepts including nested routes and route guards',
    explanation: `Advanced React Router features enable complex navigation patterns in single-page applications. This includes nested routing, route protection, and dynamic route handling.

Advanced Features:
1. **Nested Routes** - Routes within routes for complex layouts
2. **Route Guards** - Protect routes based on authentication
3. **Dynamic Routes** - Routes with parameters and wildcards
4. **Programmatic Navigation** - Navigate using code
5. **Route Data Loading** - Load data before rendering routes

Benefits:
- Better code organization
- Improved user experience
- Security through route protection
- SEO-friendly URLs`,

    bestPractices: [
      '🎯 Use nested routes for complex layouts',
      '⚡ Implement route guards for protected content',
      '🔄 Handle loading states during navigation',
      '📝 Use proper error boundaries for route errors'
    ],

    realWorldUseCases: [
      '🏢 Admin dashboards with nested sections',
      '🔐 Applications with authentication requirements',
      '📱 Multi-step forms and wizards',
      '🛒 E-commerce with product categories'
    ],

    challenges: [
      {
        id: 'build-nested-routes',
        title: 'Build Nested Routes with Guards',
        description: 'Create a routing system with nested routes and authentication guards',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 160,
        code: {
          initial: `import React, { useState, createContext, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useNavigate
} from 'react-router-dom';

// Auth Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username) => {
    setUser({ username, role: username === 'admin' ? 'admin' : 'user' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);

  // Implement route protection logic

  return children;
}

// Layout Components
function Layout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Home</Link> |
        <Link to="/about">About</Link> |
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link> |
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout ({user.username})</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

// Page Components
function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (username) => {
    login(username);
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => handleLogin('user')}>Login as User</button>
      <button onClick={() => handleLogin('admin')}>Login as Admin</button>
    </div>
  );
}

// Dashboard with nested routes
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/dashboard/profile">Profile</Link> |
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <div style={{ marginTop: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}

function Profile() {
  const { user } = useContext(AuthContext);
  return <h2>Profile: {user?.username}</h2>;
}

function Settings() {
  return <h2>Settings Page</h2>;
}

function Admin() {
  return <h1>Admin Panel</h1>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />

            {/* Add protected routes */}
            <Route
              path="dashboard"
              element={
                // Wrap with ProtectedRoute
                <Dashboard />
              }
            >
              {/* Add nested routes */}
            </Route>

            {/* Add admin route with role protection */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;`,
          solution: `import React, { useState, createContext, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useNavigate
} from 'react-router-dom';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username) => {
    setUser({ username, role: username === 'admin' ? 'admin' : 'user' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function Layout() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <nav style={{
        padding: '20px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f8f9fa'
      }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/about" style={{ marginRight: '10px' }}>About</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ marginRight: '10px' }}>Admin</Link>
            )}
            <button onClick={logout} style={{ marginLeft: '10px' }}>
              Logout ({user.username})
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a demo of advanced React Router features.</p>
    </div>
  );
}

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (username) => {
    login(username);
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => handleLogin('user')}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          Login as User
        </button>
        <button
          onClick={() => handleLogin('admin')}
          style={{ margin: '0 10px', padding: '8px 16px' }}
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav style={{
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <Link to="/dashboard/profile" style={{ marginRight: '10px' }}>Profile</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

function Profile() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user?.username}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your application settings here.</p>
    </div>
  );
}

function Admin() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Admin-only content goes here.</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'performance-optimization',
    title: 'React Performance Optimization',
    description: 'Learn advanced techniques to optimize React application performance',
    explanation: `Performance optimization in React involves various techniques to make your applications faster and more responsive. Understanding when and how to optimize is crucial for building scalable applications.

Key Optimization Techniques:
1. **Profiling** - Use React DevTools Profiler to identify bottlenecks
2. **Bundle Analysis** - Analyze and optimize bundle size
3. **Lazy Loading** - Load components and resources on demand
4. **Memoization** - Prevent unnecessary re-renders and calculations
5. **Virtual Scrolling** - Handle large lists efficiently

Performance Metrics:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size and loading time`,

    bestPractices: [
      '🎯 Profile before optimizing - measure actual performance issues',
      '⚡ Use React.memo, useMemo, and useCallback strategically',
      '🔄 Implement virtual scrolling for large datasets',
      '📝 Optimize images and assets for web delivery'
    ],

    realWorldUseCases: [
      '📊 Data-heavy dashboards and analytics',
      '📱 Mobile applications with limited resources',
      '🎮 Real-time applications and games',
      '🛒 E-commerce sites with large product catalogs'
    ],

    challenges: [
      {
        id: 'optimize-large-list',
        title: 'Optimize Large List Performance',
        description: 'Implement virtual scrolling and optimization for a large list',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '40 min',
        xpReward: 180,
        code: {
          initial: `import React, { useState, useMemo, useCallback } from 'react';

// Generate large dataset
const generateLargeDataset = (size) => {
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    name: \`Item \${index + 1}\`,
    description: \`Description for item \${index + 1}\`,
    value: Math.floor(Math.random() * 1000),
    category: ['A', 'B', 'C'][index % 3]
  }));
};

// Unoptimized list item component
function ListItem({ item, onSelect, isSelected }) {
  console.log(\`Rendering item \${item.id}\`);

  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        margin: '2px 0',
        backgroundColor: isSelected ? '#e3f2fd' : 'white',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(item.id)}
    >
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p>Value: {item.value} | Category: {item.category}</p>
    </div>
  );
}

function App() {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Generate large dataset (this will cause performance issues)
  const data = generateLargeDataset(10000);

  // Unoptimized filtering and sorting
  const filteredAndSortedData = data
    .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'value') return b.value - a.value;
      return 0;
    });

  const handleSelect = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Large List Performance Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </select>

        <p>Showing {filteredAndSortedData.length} items | Selected: {selectedItems.size}</p>
      </div>

      {/* This will render all items at once - performance issue! */}
      <div style={{ height: '400px', overflow: 'auto', border: '1px solid #ccc' }}>
        {filteredAndSortedData.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onSelect={handleSelect}
            isSelected={selectedItems.has(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useMemo, useCallback, memo } from 'react';

const generateLargeDataset = (size) => {
  return Array.from({ length: size }, (_, index) => ({
    id: index,
    name: \`Item \${index + 1}\`,
    description: \`Description for item \${index + 1}\`,
    value: Math.floor(Math.random() * 1000),
    category: ['A', 'B', 'C'][index % 3]
  }));
};

// Optimized list item component with React.memo
const ListItem = memo(function ListItem({ item, onSelect, isSelected }) {
  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        margin: '2px 0',
        backgroundColor: isSelected ? '#e3f2fd' : 'white',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(item.id)}
    >
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p>Value: {item.value} | Category: {item.category}</p>
    </div>
  );
});

// Virtual scrolling component
function VirtualizedList({ items, itemHeight = 80, containerHeight = 400, onSelect, selectedItems }) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map(item => (
            <ListItem
              key={item.id}
              item={item}
              onSelect={onSelect}
              isSelected={selectedItems.has(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Memoize the large dataset generation
  const data = useMemo(() => generateLargeDataset(10000), []);

  // Memoize expensive filtering and sorting operations
  const filteredAndSortedData = useMemo(() => {
    return data
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'value') return b.value - a.value;
        return 0;
      });
  }, [data, filter, sortBy]);

  // Memoize the select handler to prevent unnecessary re-renders
  const handleSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Optimized Large List Performance</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </select>

        <p>Showing {filteredAndSortedData.length} items | Selected: {selectedItems.size}</p>
      </div>

      {/* Virtualized list for better performance */}
      <VirtualizedList
        items={filteredAndSortedData}
        onSelect={handleSelect}
        selectedItems={selectedItems}
      />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },

  {
    id: 'accessibility',
    title: 'React Accessibility (a11y)',
    description: 'Learn to build accessible React applications for all users',
    explanation: `Accessibility (a11y) ensures that your React applications can be used by people with disabilities. This includes proper semantic HTML, keyboard navigation, screen reader support, and ARIA attributes.

Key Accessibility Principles:
1. **Semantic HTML** - Use proper HTML elements for their intended purpose
2. **Keyboard Navigation** - Ensure all interactive elements are keyboard accessible
3. **Screen Reader Support** - Provide proper labels and descriptions
4. **Color and Contrast** - Ensure sufficient color contrast ratios
5. **Focus Management** - Handle focus properly in dynamic content

ARIA Attributes:
- aria-label, aria-labelledby
- aria-describedby
- aria-expanded, aria-hidden
- role attributes`,

    bestPractices: [
      '🎯 Use semantic HTML elements whenever possible',
      '⚡ Implement proper focus management',
      '🔄 Test with screen readers and keyboard navigation',
      '📝 Provide alternative text for images and icons'
    ],

    realWorldUseCases: [
      '🏢 Government and public sector websites',
      '🏥 Healthcare and medical applications',
      '🎓 Educational platforms and e-learning',
      '🛒 E-commerce sites serving diverse users'
    ],

    challenges: [
      {
        id: 'build-accessible-form',
        title: 'Build Accessible Form',
        description: 'Create a fully accessible form with proper ARIA attributes and keyboard navigation',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '30 min',
        xpReward: 140,
        code: {
          initial: `import React, { useState, useRef } from 'react';

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div>
      <h1>Accessible Registration Form</h1>

      {/* Add proper form structure with accessibility features */}
      <form onSubmit={handleSubmit}>

        {/* Name field - add proper labels and error handling */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {errors.name && <span>{errors.name}</span>}
        </div>

        {/* Email field - add accessibility attributes */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        {/* Password field with show/hide toggle */}
        <div>
          <label>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <span>{errors.password}</span>}
        </div>

        {/* Confirm password field */}
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>

        {/* Newsletter checkbox */}
        <div>
          <input
            type="checkbox"
            checked={formData.newsletter}
            onChange={(e) => handleChange('newsletter', e.target.checked)}
          />
          <label>Subscribe to newsletter</label>
        </div>

        {/* Country select */}
        <div>
          <label>Country:</label>
          <select
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
          >
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="au">Australia</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <AccessibleForm />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState, useRef, useId } from 'react';

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Generate unique IDs for form fields
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const newsletterId = useId();
  const countryId = useId();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fieldStyle = {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    padding: '8px',
    border: '2px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const errorStyle = {
    color: '#d32f2f',
    fontSize: '14px',
    marginTop: '5px'
  };

  return (
    <div>
      <h1>Accessible Registration Form</h1>

      <form onSubmit={handleSubmit} noValidate>

        {/* Name field with proper accessibility */}
        <div style={fieldStyle}>
          <label htmlFor={nameId} style={labelStyle}>
            Name: <span aria-label="required">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.name ? '#d32f2f' : '#ccc'
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? \`\${nameId}-error\` : undefined}
            required
          />
          {errors.name && (
            <span
              id={\`\${nameId}-error\`}
              style={errorStyle}
              role="alert"
              aria-live="polite"
            >
              {errors.name}
            </span>
          )}
        </div>

        {/* Email field */}
        <div style={fieldStyle}>
          <label htmlFor={emailId} style={labelStyle}>
            Email: <span aria-label="required">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.email ? '#d32f2f' : '#ccc'
            }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? \`\${emailId}-error\` : undefined}
            required
          />
          {errors.email && (
            <span
              id={\`\${emailId}-error\`}
              style={errorStyle}
              role="alert"
              aria-live="polite"
            >
              {errors.email}
            </span>
          )}
        </div>

        {/* Password field with show/hide toggle */}
        <div style={fieldStyle}>
          <label htmlFor={passwordId} style={labelStyle}>
            Password: <span aria-label="required">*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: errors.password ? '#d32f2f' : '#ccc',
                paddingRight: '80px'
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? \`\${passwordId}-error\` : undefined}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#007bff'
              }}
              aria-label={\`\${showPassword ? 'Hide' : 'Show'} password\`}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <span
              id={\`\${passwordId}-error\`}
              style={errorStyle}
              role="alert"
              aria-live="polite"
            >
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm password field */}
        <div style={fieldStyle}>
          <label htmlFor={confirmPasswordId} style={labelStyle}>
            Confirm Password: <span aria-label="required">*</span>
          </label>
          <input
            id={confirmPasswordId}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.confirmPassword ? '#d32f2f' : '#ccc'
            }}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? \`\${confirmPasswordId}-error\` : undefined}
            required
          />
          {errors.confirmPassword && (
            <span
              id={\`\${confirmPasswordId}-error\`}
              style={errorStyle}
              role="alert"
              aria-live="polite"
            >
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* Newsletter checkbox */}
        <div style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center' }}>
          <input
            id={newsletterId}
            type="checkbox"
            checked={formData.newsletter}
            onChange={(e) => handleChange('newsletter', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor={newsletterId}>
            Subscribe to newsletter (optional)
          </label>
        </div>

        {/* Country select */}
        <div style={fieldStyle}>
          <label htmlFor={countryId} style={labelStyle}>
            Country:
          </label>
          <select
            id={countryId}
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            style={inputStyle}
          >
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="au">Australia</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <AccessibleForm />
    </div>
  );
}

export default App;`
        }
      }
    ]
  },
          solution: `import React, { useState, useMemo } from 'react';

// Expensive Fibonacci calculation
const calculateFibonacci = (n) => {
  console.log('Calculating Fibonacci for:', n);
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
};

function FibonacciCalculator() {
  const [number, setNumber] = useState(5);
  const [count, setCount] = useState(0);

  // Optimized with useMemo - only recalculates when number changes
  const fibResult = useMemo(() => {
    return calculateFibonacci(number);
  }, [number]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Fibonacci Calculator</h2>
      <div>
        <label>
          Number:
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
            min="0"
            max="35"
          />
        </label>
      </div>
      <div>
        <p>Fibonacci({number}) = {fibResult}</p>
      </div>
      <div>
        <button onClick={() => setCount(count + 1)}>
          Counter: {count}
        </button>
      </div>
      <p>✅ Optimized! Calculation only runs when number changes!</p>
    </div>
  );
}

export default FibonacciCalculator;`
        },
        hints: [
          'Use useMemo to cache the expensive Fibonacci calculation',
          'The dependency array should only include the number that changes',
          'Check the console to see when calculations actually run',
          'The counter button should not trigger recalculation'
        ]
      },
      {
        id: 'react-memo-optimization',
        title: 'React.memo Child Component Optimization',
        description: 'Compare memoized vs non-memoized child components to see performance differences',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '30 min',
        xpReward: 150,
        code: {
          initial: `import React, { useState } from 'react';

// Child component WITHOUT React.memo
const RegularChild = ({ name }) => {
  console.log('RegularChild rendered for:', name);
  return (
    <div style={{ padding: '10px', border: '1px solid red', margin: '5px' }}>
      <h3>Regular Child</h3>
      <p>Name: {name}</p>
    </div>
  );
};

// Child component WITH React.memo - TODO: Implement this
const MemoizedChild = ({ name }) => {
  console.log('MemoizedChild rendered for:', name);
  return (
    <div style={{ padding: '10px', border: '1px solid green', margin: '5px' }}>
      <h3>Memoized Child</h3>
      <p>Name: {name}</p>
    </div>
  );
};

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name] = useState('Alice');

  return (
    <div style={{ padding: '20px' }}>
      <h2>React.memo Performance Test</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <RegularChild name={name} />
      <MemoizedChild name={name} />

      <p>Check console: Regular child re-renders on every count change, memoized child doesn't!</p>
    </div>
  );
}

export default ParentComponent;`,
          solution: `import React, { useState } from 'react';

// Child component WITHOUT React.memo
const RegularChild = ({ name }) => {
  console.log('RegularChild rendered for:', name);
  return (
    <div style={{ padding: '10px', border: '1px solid red', margin: '5px' }}>
      <h3>Regular Child</h3>
      <p>Name: {name}</p>
    </div>
  );
};

// Child component WITH React.memo - optimized!
const MemoizedChild = React.memo(({ name }) => {
  console.log('MemoizedChild rendered for:', name);
  return (
    <div style={{ padding: '10px', border: '1px solid green', margin: '5px' }}>
      <h3>Memoized Child</h3>
      <p>Name: {name}</p>
    </div>
  );
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name] = useState('Alice');

  return (
    <div style={{ padding: '20px' }}>
      <h2>React.memo Performance Test</h2>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <RegularChild name={name} />
      <MemoizedChild name={name} />

      <p>✅ Check console: Regular child re-renders on every count change, memoized child doesn't!</p>
    </div>
  );
}

export default ParentComponent;`
        },
        hints: [
          'Wrap the MemoizedChild component with React.memo()',
          'React.memo prevents re-renders when props haven\'t changed',
          'Check the console to see the difference in render frequency',
          'The memoized child should only render once since name never changes'
        ]
      }
    ],
    estimatedTime: '60 min',
    difficulty: 'intermediate',
    prerequisites: ['usememo-usecallback', 'react-memo'],
    nextTopics: ['accessibility'],
    category: 'intermediate'
  },

  // React Hook Form
  {
    id: 'react-hook-form',
    title: 'React Hook Form – Efficient Form Handling',
    description: 'Learn to build performant forms with React Hook Form',
    explanation: `React Hook Form is a library that helps you build forms with easy validation and great performance. Unlike traditional controlled components, it minimizes re-renders and provides a simple API for form handling.

🔹 **Why React Hook Form?**
- **Better Performance**: Minimal re-renders compared to controlled components
- **Less Code**: Simpler syntax with built-in validation
- **Better UX**: Easy error handling and form state management
- **TypeScript Support**: Excellent type safety out of the box

🔸 **Key Features:**
- **useForm Hook**: Main hook for form management
- **register**: Register input fields with validation
- **handleSubmit**: Handle form submission with validation
- **formState**: Access form state (errors, isValid, etc.)

🧠 **Analogy:** Think of React Hook Form as a smart assistant that watches your form inputs and only bothers you when something important happens, rather than constantly checking every keystroke.`,
    animationScript: 'Show form with traditional controlled inputs vs React Hook Form - highlight performance differences',
    scenario: '📝 Build efficient, validated forms using React Hook Form with minimal re-renders and excellent user experience.',
    challenges: [
      {
        id: 'basic-registration-form',
        title: 'Build Registration Form with Validation',
        description: 'Create a registration form using React Hook Form with validation rules',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 130,
        code: {
          initial: `import React from 'react';
import { useForm } from 'react-hook-form';

function RegistrationForm() {
  // TODO: Set up useForm hook
  // const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    alert('Registration successful! Check console for data.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* TODO: Add form fields with validation */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            // TODO: Add register with validation
          />
          {/* TODO: Show email errors */}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            // TODO: Add register with validation
          />
          {/* TODO: Show password errors */}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            // TODO: Add register with validation
          />
          {/* TODO: Show confirm password errors */}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;`,
          solution: `import React from 'react';
import { useForm } from 'react-hook-form';

function RegistrationForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    alert('Registration successful! Check console for data.');
  };

  const password = watch('password');

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          {errors.password && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && (
            <p style={{ color: 'red', fontSize: '14px', margin: '5px 0' }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;`
        },
        hints: [
          'Use the useForm hook to get register, handleSubmit, and formState',
          'Use the register function with validation rules for each input',
          'Access errors from formState.errors to display validation messages',
          'Use watch() to get the password value for confirmation validation'
        ]
      }
    ],
    estimatedTime: '50 min',
    difficulty: 'intermediate',
    prerequisites: ['forms-and-inputs', 'custom-hooks'],
    nextTopics: ['react-router-advanced'],
    category: 'intermediate'
  },

  // Advanced React Router
  {
    id: 'react-router-advanced',
    title: 'Advanced React Router',
    description: 'Learn advanced routing concepts including nested routes and route guards',
    explanation: `Advanced React Router techniques help you build complex navigation systems with nested routes, route protection, and dynamic routing patterns. Master these concepts to create professional single-page applications.

🔹 **Advanced Concepts:**
- **Nested Routes**: Routes within routes for complex layouts
- **Route Guards**: Protect routes based on authentication or permissions
- **Dynamic Routes**: Routes with parameters and query strings
- **Programmatic Navigation**: Navigate using code instead of links

🔸 **Key Features:**
- **Outlet**: Render child routes in nested routing
- **useNavigate**: Programmatically navigate between routes
- **useParams**: Access route parameters
- **useLocation**: Get current location information

🧠 **Analogy:** Think of advanced routing like a building with multiple floors and security checkpoints - you need proper access to reach certain areas, and some areas contain sub-areas within them.`,
    animationScript: 'Show nested route structure with protected routes and dynamic navigation',
    scenario: '🛣️ Build a complex routing system with nested routes, authentication guards, and dynamic navigation.',
    challenges: [
      {
        id: 'nested-routes-dashboard',
        title: 'Build Nested Routes Dashboard',
        description: 'Create a dashboard with nested routes for different sections',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 140,
        code: {
          initial: `import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>
              Overview
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            {/* TODO: Add link to users section */}
          </li>
          <li style={{ marginBottom: '10px' }}>
            {/* TODO: Add link to settings section */}
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px' }}>
        {/* TODO: Add Outlet for nested routes */}
      </main>
    </div>
  );
}

// Dashboard Overview Component
function Overview() {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}

// Users Section Component
function Users() {
  return (
    <div>
      <h2>Users Management</h2>
      <p>Manage your users here.</p>
    </div>
  );
}

// Settings Section Component
function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your application settings.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: Set up nested routes structure */}
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
          solution: `import React from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

// Dashboard Layout Component
function DashboardLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>
              Overview
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard/users" style={{ textDecoration: 'none', color: '#007bff' }}>
              Users
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/dashboard/settings" style={{ textDecoration: 'none', color: '#007bff' }}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

// Dashboard Overview Component
function Overview() {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}

// Users Section Component
function Users() {
  return (
    <div>
      <h2>Users Management</h2>
      <p>Manage your users here.</p>
    </div>
  );
}

// Settings Section Component
function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your application settings.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page - <Link to="/dashboard">Go to Dashboard</Link></div>} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;`
        },
        hints: [
          'Use nested Route components with the parent route containing an Outlet',
          'The parent route should render the layout component',
          'Child routes are defined inside the parent Route component',
          'Use the index prop for the default child route'
        ]
      }
    ],
    estimatedTime: '75 min',
    difficulty: 'advanced',
    prerequisites: ['react-router', 'custom-hooks'],
    nextTopics: ['accessibility'],
    category: 'advanced'
  },

  // React Accessibility
  {
    id: 'accessibility',
    title: 'React Accessibility (a11y)',
    description: 'Learn to build accessible React applications for all users',
    explanation: `Accessibility (a11y) ensures your React applications can be used by everyone, including people with disabilities. Learn to implement proper ARIA attributes, keyboard navigation, and screen reader support.

🔹 **Why Accessibility Matters:**
- **Inclusive Design**: Make your app usable by everyone
- **Legal Compliance**: Meet accessibility standards and regulations
- **Better UX**: Improved usability benefits all users
- **SEO Benefits**: Better semantic HTML improves search rankings

🔸 **Key Accessibility Features:**
- **ARIA Attributes**: Provide context for screen readers
- **Keyboard Navigation**: Full functionality without a mouse
- **Focus Management**: Proper focus indicators and flow
- **Semantic HTML**: Use appropriate HTML elements

🧠 **Analogy:** Think of accessibility like building ramps alongside stairs - it provides alternative ways for everyone to access the same content and functionality.`,
    animationScript: 'Show screen reader navigation and keyboard-only interaction with React components',
    scenario: '♿ Build fully accessible React components with proper ARIA attributes and keyboard navigation.',
    challenges: [
      {
        id: 'accessible-form-component',
        title: 'Build Accessible Form Component',
        description: 'Create a form with proper accessibility features including ARIA labels and keyboard navigation',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 160,
        code: {
          initial: `import React, { useState } from 'react';

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Contact Form</h1>

      <form onSubmit={handleSubmit}>
        {/* TODO: Add proper accessibility features */}
        <div style={{ marginBottom: '20px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.name ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.name && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.email ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.message ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.message && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AccessibleForm;`,
          solution: `import React, { useState, useRef } from 'react';

function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    } else {
      // Focus first error field for better accessibility
      if (newErrors.name) nameInputRef.current?.focus();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Contact Form</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name">Name: *</label>
          <input
            id="name"
            ref={nameInputRef}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.name ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.name && (
            <div
              id="name-error"
              role="alert"
              aria-live="polite"
              style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email: *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.email ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && (
            <div
              id="email-error"
              role="alert"
              aria-live="polite"
              style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="message">Message: *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
            aria-required="true"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              border: errors.message ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.message && (
            <div
              id="message-error"
              role="alert"
              aria-live="polite"
              style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}
            >
              {errors.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onFocus={(e) => e.target.style.outline = '2px solid #0056b3'}
          onBlur={(e) => e.target.style.outline = 'none'}
        >
          Submit Form
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        * Required fields
      </p>
    </div>
  );
}

export default AccessibleForm;`
        },
        hints: [
          'Use htmlFor attribute on labels to associate them with inputs',
          'Add aria-required, aria-invalid, and aria-describedby attributes',
          'Use role="alert" and aria-live="polite" for error messages',
          'Implement focus management to help users navigate errors',
          'Add proper focus indicators for keyboard navigation'
        ]
      }
    ],
    estimatedTime: '55 min',
    difficulty: 'advanced',
    prerequisites: ['forms-and-inputs', 'useref-basics'],
    nextTopics: ['react-testing'],
    category: 'advanced'
  },

  // Zustand State Management
  {
    id: 'zustand-state',
    title: 'Zustand - Lightweight State Management',
    description: 'Advanced state management with Zustand including middleware and persistence',
    explanation: `Zustand is a small, fast, and scalable state management solution for React. It provides a simple API without boilerplate code, making it perfect for projects that need global state without the complexity of Redux.

🔹 **Why Zustand?**
- **Minimal Boilerplate**: No providers, actions, or reducers required
- **TypeScript First**: Excellent TypeScript support out of the box
- **Small Bundle Size**: Only 2.9kb gzipped
- **Middleware Support**: Persist, devtools, and custom middleware

🔸 **Advanced Features:**
- **Persistence**: Save state to localStorage automatically
- **DevTools**: Debug with Redux DevTools extension
- **Middleware**: Extend functionality with custom middleware
- **Subscriptions**: Fine-grained reactivity and performance

🧠 **Analogy:** Think of Zustand as a lightweight backpack for your state - it carries what you need without the bulk of a full suitcase (Redux), and comes with useful pockets (middleware) for extra functionality.`,
    animationScript: 'Show advanced Zustand features including persistence and middleware',
    scenario: '🎒 Build advanced state management with Zustand using middleware, persistence, and TypeScript.',
    challenges: [
      {
        id: 'zustand-advanced-store',
        title: 'Build Advanced Store with Middleware',
        description: 'Create a Zustand store with persistence and devtools middleware',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        xpReward: 140,
        code: {
          initial: `import React from 'react';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// TODO: Define TypeScript types
// type BearState = {
//   bears: number
//   increase: () => void
//   reset: () => void
// }

// TODO: Create store with middleware
// export const useBearStore = create<BearState>()(
//   devtools(
//     persist(
//       (set) => ({
//         bears: 0,
//         increase: () => set((state) => ({ bears: state.bears + 1 })),
//         reset: () => set({ bears: 0 }),
//       }),
//       {
//         name: 'bear-storage',
//       }
//     )
//   )
// )

function BearCounter() {
  // TODO: Use the store
  // const { bears, increase, reset } = useBearStore();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>🐻 Bear Counter with Persistence</h2>
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        Bears: {/* TODO: Display bears count */}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => {/* TODO: Call increase */}}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Bear 🐻
        </button>
        <button
          onClick={() => {/* TODO: Call reset */}}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Reset
        </button>
      </div>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        💾 State persists across page reloads!<br/>
        🔧 Open Redux DevTools to see state changes
      </p>
    </div>
  );
}

export default BearCounter;`,
          solution: `import React from 'react';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type BearState = {
  bears: number
  increase: () => void
  reset: () => void
}

export const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: () => set((state) => ({ bears: state.bears + 1 })),
        reset: () => set({ bears: 0 }),
      }),
      {
        name: 'bear-storage',
      }
    )
  )
)

function BearCounter() {
  const { bears, increase, reset } = useBearStore();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>🐻 Bear Counter with Persistence</h2>
      <div style={{ fontSize: '2rem', margin: '20px 0' }}>
        Bears: {bears}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={increase}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Bear 🐻
        </button>
        <button
          onClick={reset}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Reset
        </button>
      </div>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        ✅ State persists across page reloads!<br/>
        🔧 Open Redux DevTools to see state changes<br/>
        💾 Check localStorage for 'bear-storage' key
      </p>
    </div>
  );
}

export default BearCounter;`
        },
        hints: [
          'Use zustand\'s create() to define your global store',
          'persist middleware saves your state in localStorage',
          'devtools helps with debugging using Redux DevTools',
          'Keep functions pure inside the store; avoid side effects directly'
        ]
      },
      {
        id: 'zustand-theme-switcher',
        title: 'Building a Persistent Theme Switcher',
        description: 'Create a theme toggle component using Zustand with persistent state',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 160,
        code: {
          initial: `import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TODO: Define Theme type and ThemeStore interface
// type Theme = 'light' | 'dark'
// type ThemeStore = {
//   theme: Theme
//   toggleTheme: () => void
// }

// TODO: Create theme store with persistence
// export const useThemeStore = create<ThemeStore>()(
//   persist(
//     (set, get) => ({
//       theme: 'light',
//       toggleTheme: () =>
//         set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
//     }),
//     {
//       name: 'theme-storage',
//     }
//   )
// )

function ThemeToggle() {
  // TODO: Use the theme store
  // const { theme, toggleTheme } = useThemeStore();

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: 'white', // TODO: Make this dynamic based on theme
      color: 'black', // TODO: Make this dynamic based on theme
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1>🎨 Theme Switcher</h1>
      <p>Current theme: {/* TODO: Display current theme */}</p>

      <button
        onClick={() => {/* TODO: Call toggleTheme */}}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Toggle Theme
      </button>

      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Theme Features:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
          <li>✅ Persistent across reloads</li>
          <li>✅ Smooth transitions</li>
          <li>✅ TypeScript support</li>
          <li>✅ Minimal bundle size</li>
        </ul>
      </div>
    </div>
  );
}

export default ThemeToggle;`,
          solution: `import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark'

type ThemeStore = {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () =>
        set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    {
      name: 'theme-storage',
    }
  )
)

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#333333',
      border: '1px solid #e0e0e0'
    },
    dark: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      border: '1px solid #404040'
    }
  };

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: themeStyles[theme].backgroundColor,
      color: themeStyles[theme].color,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1>🎨 Theme Switcher</h1>
      <p>Current theme: <strong>{theme}</strong> {theme === 'light' ? '☀️' : '🌙'}</p>

      <button
        onClick={toggleTheme}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: theme === 'light' ? '#007bff' : '#ffc107',
          color: theme === 'light' ? 'white' : 'black',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px',
          transition: 'all 0.3s ease'
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        border: themeStyles[theme].border,
        borderRadius: '8px',
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d2d2d'
      }}>
        <h3>✅ Theme Features:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
          <li>💾 Persistent across reloads</li>
          <li>🎨 Smooth transitions</li>
          <li>📝 TypeScript support</li>
          <li>📦 Minimal bundle size</li>
          <li>🔄 Instant state updates</li>
        </ul>
      </div>
    </div>
  );
}

export default ThemeToggle;`
        },
        hints: [
          'Use persist() to keep the theme across reloads',
          'Store the theme as a string type (\'light\' | \'dark\')',
          'Use get() inside the store to read the current value before updating',
          'Call toggleTheme from your UI component to switch themes'
        ]
      }
    ],
    estimatedTime: '55 min',
    difficulty: 'advanced',
    prerequisites: ['usestate-basics', 'custom-hooks'],
    nextTopics: ['jotai-recoil'],
    category: 'advanced'
  },

  // Jotai & Recoil - Atomic State Management
  {
    id: 'jotai-recoil',
    title: 'Jotai & Recoil - Atomic State Management',
    description: 'Atomic state management patterns',
    explanation: `Atomic state management breaks down global state into small, independent atoms that can be composed together. Jotai and Recoil are libraries that implement this pattern, providing fine-grained reactivity and better performance.

🔹 **Atomic State Concept:**
- **Atoms**: Small pieces of state that can be read and written
- **Selectors**: Derived state based on atoms or other selectors
- **Bottom-up**: Build complex state from simple atoms
- **Fine-grained Updates**: Only components using specific atoms re-render

🔸 **Benefits:**
- **Better Performance**: Minimal re-renders
- **Composable**: Combine atoms to create complex state
- **Testable**: Easy to test individual atoms
- **TypeScript Friendly**: Excellent type inference

🧠 **Analogy:** Think of atoms like LEGO blocks - each piece is simple and independent, but you can combine them to build complex structures.`,
    animationScript: 'Show atomic state updates affecting only specific components',
    scenario: '⚛️ Build atomic state management using Jotai for fine-grained reactivity and performance.',
    challenges: [
      {
        id: 'jotai-todo-atoms',
        title: 'Build Todo App with Jotai Atoms',
        description: 'Create a todo application using Jotai atoms for state management',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 150,
        code: {
          initial: `import React from 'react';
import { atom, useAtom } from 'jotai';

// TODO: Create atoms for todo state
// const todosAtom = atom([]);
// const filterAtom = atom('all'); // 'all', 'active', 'completed'

function TodoApp() {
  // TODO: Use atoms
  // const [todos, setTodos] = useAtom(todosAtom);
  // const [filter, setFilter] = useAtom(filterAtom);

  const addTodo = (text) => {
    // TODO: Add new todo
  };

  const toggleTodo = (id) => {
    // TODO: Toggle todo completion
  };

  const deleteTodo = (id) => {
    // TODO: Delete todo
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Jotai Todo App</h1>

      <TodoInput onAdd={addTodo} />
      <TodoFilters />
      <TodoList />
    </div>
  );
}

function TodoInput({ onAdd }) {
  const [text, setText] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo..."
        style={{ padding: '8px', marginRight: '10px', width: '300px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        Add
      </button>
    </form>
  );
}

function TodoFilters() {
  // TODO: Implement filter buttons
  return (
    <div style={{ marginBottom: '20px' }}>
      <button>All</button>
      <button>Active</button>
      <button>Completed</button>
    </div>
  );
}

function TodoList() {
  // TODO: Display filtered todos
  return (
    <div>
      <p>Todo list will appear here...</p>
    </div>
  );
}

export default TodoApp;`,
          solution: `import React from 'react';
import { atom, useAtom } from 'jotai';

// Create atoms for todo state
const todosAtom = atom([]);
const filterAtom = atom('all'); // 'all', 'active', 'completed'

// Derived atom for filtered todos
const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
});

function TodoApp() {
  const [todos, setTodos] = useAtom(todosAtom);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Jotai Todo App</h1>

      <TodoInput onAdd={addTodo} />
      <TodoFilters />
      <TodoList onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

function TodoInput({ onAdd }) {
  const [text, setText] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo..."
        style={{ padding: '8px', marginRight: '10px', width: '300px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        Add
      </button>
    </form>
  );
}

function TodoFilters() {
  const [filter, setFilter] = useAtom(filterAtom);

  return (
    <div style={{ marginBottom: '20px' }}>
      {['all', 'active', 'completed'].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: filter === f ? '#007bff' : '#f8f9fa',
            color: filter === f ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

function TodoList({ onToggle, onDelete }) {
  const [filteredTodos] = useAtom(filteredTodosAtom);

  if (filteredTodos.length === 0) {
    return <p>No todos found!</p>;
  }

  return (
    <div>
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #eee',
            marginBottom: '5px',
            borderRadius: '4px'
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            style={{ marginRight: '10px' }}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#666' : 'black'
            }}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TodoApp;`
        },
        hints: [
          'Create separate atoms for todos and filter state',
          'Use derived atoms to compute filtered todos',
          'Use useAtom hook to read and write atom values',
          'Atoms automatically trigger re-renders when their values change'
        ]
      },
      {
        id: 'recoil-counter-selector',
        title: 'Build Recoil Counter with Selectors',
        description: 'Create a counter app using Recoil atoms and selectors for derived state',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 170,
        code: {
          initial: `import React from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// TODO: Create count atom
// const countAtom = atom({
//   key: 'countAtom',
//   default: 0,
// });

// TODO: Create selector for double count
// const doubleCountSelector = selector({
//   key: 'doubleCountSelector',
//   get: ({ get }) => get(countAtom) * 2,
// });

function Counter() {
  // TODO: Use Recoil hooks
  // const [count, setCount] = useRecoilState(countAtom);
  // const doubleCount = useRecoilValue(doubleCountSelector);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Recoil Counter with Selectors</h2>

      <div style={{ margin: '20px 0' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
          Count: {/* TODO: Display count */}
        </div>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>
          Double: {/* TODO: Display double count */}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => {/* TODO: Decrement count */}}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          -1
        </button>
        <button
          onClick={() => {/* TODO: Reset count */}}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Reset
        </button>
        <button
          onClick={() => {/* TODO: Increment count */}}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          +1
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>🔬 Recoil Features:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
          <li>⚛️ Atomic state management</li>
          <li>🔄 Derived state with selectors</li>
          <li>🎯 Fine-grained reactivity</li>
          <li>🔧 DevTools integration</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    // TODO: Wrap with RecoilRoot
    <div>
      <Counter />
    </div>
  );
}

export default App;`,
          solution: `import React from 'react';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Create count atom
const countAtom = atom({
  key: 'countAtom',
  default: 0,
});

// Create selector for double count
const doubleCountSelector = selector({
  key: 'doubleCountSelector',
  get: ({ get }) => get(countAtom) * 2,
});

// Create selector for count status
const countStatusSelector = selector({
  key: 'countStatusSelector',
  get: ({ get }) => {
    const count = get(countAtom);
    if (count === 0) return 'Zero';
    if (count > 0) return 'Positive';
    return 'Negative';
  },
});

function Counter() {
  const [count, setCount] = useRecoilState(countAtom);
  const doubleCount = useRecoilValue(doubleCountSelector);
  const countStatus = useRecoilValue(countStatusSelector);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Recoil Counter with Selectors</h2>

      <div style={{ margin: '20px 0' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
          Count: {count}
        </div>
        <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '10px' }}>
          Double: {doubleCount}
        </div>
        <div style={{ fontSize: '1rem', color: '#007bff' }}>
          Status: {countStatus}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          -1
        </button>
        <button
          onClick={() => setCount(0)}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          +1
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>✅ Recoil Features Demonstrated:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
          <li>⚛️ <strong>Atoms:</strong> Global state pieces (countAtom)</li>
          <li>🔄 <strong>Selectors:</strong> Derived state (doubleCount, status)</li>
          <li>🎯 <strong>Reactivity:</strong> Auto-updates when atoms change</li>
          <li>🔧 <strong>Hooks:</strong> useRecoilState, useRecoilValue</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Counter />
    </RecoilRoot>
  );
}

export default App;`
        },
        hints: [
          'Recoil atoms need a unique key and default value',
          'Selectors derive state from atoms using the get function',
          'useRecoilState works like useState but for atoms',
          'Wrap your app with RecoilRoot to enable Recoil functionality'
        ]
      }
    ],
    estimatedTime: '60 min',
    difficulty: 'advanced',
    prerequisites: ['zustand-state', 'context-api'],
    nextTopics: ['gatsby-ssg'],
    category: 'advanced'
  },

  // Gatsby SSG
  {
    id: 'gatsby-ssg',
    title: 'Gatsby - Static Site Generation',
    description: 'Build static sites with Gatsby',
    explanation: `Gatsby is a React-based framework for building fast, static websites and applications. It combines the power of React with GraphQL and generates optimized static files for incredible performance.

🔹 **Why Gatsby?**
- **Blazing Fast**: Pre-built static files served from CDN
- **SEO Optimized**: Server-side rendering for better search rankings
- **Rich Ecosystem**: Thousands of plugins for any functionality
- **GraphQL Data Layer**: Unified data access from any source

🔸 **Key Features:**
- **Static Generation**: Build-time rendering for maximum performance
- **Image Optimization**: Automatic image processing and lazy loading
- **Code Splitting**: Automatic bundle optimization
- **Progressive Web App**: Built-in PWA capabilities

🧠 **Analogy:** Think of Gatsby as a master chef who prepares all the meals (pages) in advance, so when customers (users) arrive, everything is ready to serve instantly.`,
    animationScript: 'Show build process generating static files and deployment to CDN',
    scenario: '🚀 Build a lightning-fast static website using Gatsby with GraphQL data layer.',
    challenges: [
      {
        id: 'gatsby-node-pages',
        title: 'Generate Pages with gatsby-node.js',
        description: 'Use createPages API to dynamically generate static pages from data',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 150,
        code: {
          initial: `// gatsby-node.js - TODO: Complete the createPages function
const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // TODO: Query for all markdown files
  // const result = await graphql(\`
  //   query {
  //     allMarkdownRemark {
  //       edges {
  //         node {
  //           fields {
  //             slug
  //           }
  //         }
  //       }
  //     }
  //   }
  // \`);

  // TODO: Create pages for each markdown file
  // result.data.allMarkdownRemark.edges.forEach(({ node }) => {
  //   createPage({
  //     path: node.fields.slug,
  //     component: path.resolve('./src/templates/blog-post.js'),
  //     context: {
  //       slug: node.fields.slug,
  //     },
  //   });
  // });
};

// TODO: Create slug field for each markdown file
// exports.onCreateNode = ({ node, actions, getNode }) => {
//   const { createNodeField } = actions;
//
//   if (node.internal.type === 'MarkdownRemark') {
//     const value = createFilePath({ node, getNode });
//     createNodeField({
//       name: 'slug',
//       node,
//       value,
//     });
//   }
// };

// Blog post template (src/templates/blog-post.js)
import React from 'react';
import { graphql, Link } from 'gatsby';

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        ← Back to Home
      </Link>

      <article style={{ marginTop: '20px' }}>
        <h1>{post.frontmatter.title}</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Published on {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </div>
  );
};

// TODO: Add GraphQL query for blog post template
// export const query = graphql\`
//   query($slug: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       html
//       frontmatter {
//         title
//         date(formatString: "MMMM DD, YYYY")
//       }
//     }
//   }
// \`;

export default BlogPostTemplate;`,
          solution: `// gatsby-node.js - Complete implementation
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query for all markdown files
  const result = await graphql(\`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  \`);

  // Create pages for each markdown file
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/templates/blog-post.js'),
      context: {
        slug: node.fields.slug,
      },
    });
  });
};

// Create slug field for each markdown file
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
};

// Blog post template (src/templates/blog-post.js)
import React from 'react';
import { graphql, Link } from 'gatsby';

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        ← Back to Home
      </Link>

      <article style={{ marginTop: '20px' }}>
        <h1>{post.frontmatter.title}</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Published on {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>✅ Gatsby Features Demonstrated:</h3>
        <ul>
          <li>🔄 Dynamic page generation from markdown</li>
          <li>📊 GraphQL data layer integration</li>
          <li>🚀 Static site generation at build time</li>
          <li>🔗 Automatic slug creation and routing</li>
        </ul>
      </div>
    </div>
  );
};

// GraphQL query for blog post template
export const query = graphql\`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
\`;

export default BlogPostTemplate;`
        },
        hints: [
          'Use createPages API in gatsby-node.js to generate pages programmatically',
          'createFilePath generates URL-friendly slugs from file paths',
          'onCreateNode runs for every node created during build',
          'Pass context data to page templates via the context object'
        ]
      },
      {
        id: 'gatsby-plugin-integration',
        title: 'Integrate Gatsby Plugins for Enhanced Functionality',
        description: 'Add image optimization and SEO plugins to a Gatsby site',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '40 min',
        xpReward: 180,
        code: {
          initial: `// gatsby-config.js - TODO: Configure plugins
module.exports = {
  siteMetadata: {
    title: 'My Gatsby Site',
    description: 'A blazing fast static site built with Gatsby',
    author: '@yourname',
  },
  plugins: [
    // TODO: Add gatsby-plugin-react-helmet for SEO
    // TODO: Add gatsby-plugin-image for optimized images
    // TODO: Add gatsby-source-filesystem for local files
    // TODO: Add gatsby-transformer-remark for markdown
  ],
};

// src/components/seo.js - TODO: Create SEO component
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const SEO = ({ description, title, children }) => {
  // TODO: Query site metadata
  // const { site } = useStaticQuery(
  //   graphql\`
  //     query {
  //       site {
  //         siteMetadata {
  //           title
  //           description
  //           author
  //         }
  //       }
  //     }
  //   \`
  // );

  // TODO: Set up meta tags
  return (
    <Helmet>
      <title>TODO: Set page title</title>
      <meta name="description" content="TODO: Set description" />
      <meta name="author" content="TODO: Set author" />
    </Helmet>
  );
};

export default SEO;

// src/pages/index.js - TODO: Use SEO and optimized images
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import SEO from '../components/seo';

const IndexPage = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {/* TODO: Add SEO component */}

      <h1>Welcome to My Gatsby Site</h1>

      {/* TODO: Add optimized image */}
      <div style={{ margin: '40px 0' }}>
        <p>Hero image will appear here</p>
      </div>

      <p>This site demonstrates Gatsby's powerful plugin ecosystem.</p>
    </div>
  );
};

export default IndexPage;`,
          solution: `// gatsby-config.js - Complete plugin configuration
module.exports = {
  siteMetadata: {
    title: 'My Gatsby Site',
    description: 'A blazing fast static site built with Gatsby',
    author: '@yourname',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
  ],
};

// src/components/seo.js - Complete SEO component
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const SEO = ({ description, title, children }) => {
  const { site } = useStaticQuery(
    graphql\`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    \`
  );

  const metaDescription = description || site.siteMetadata.description;
  const defaultTitle = site.siteMetadata?.title;

  return (
    <Helmet
      htmlAttributes={{
        lang: 'en',
      }}
      title={title}
      titleTemplate={defaultTitle ? \`%s | \${defaultTitle}\` : null}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: site.siteMetadata?.author || '',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
      ]}
    >
      {children}
    </Helmet>
  );
};

export default SEO;

// src/pages/index.js - Complete page with SEO and images
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import SEO from '../components/seo';

const IndexPage = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <SEO title="Home" description="Welcome to my Gatsby site with optimized images and SEO" />

      <h1>Welcome to My Gatsby Site</h1>

      <div style={{ margin: '40px 0' }}>
        <StaticImage
          src="../images/hero.jpg"
          alt="Hero image"
          placeholder="blurred"
          layout="fixed"
          width={600}
          height={400}
        />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        <h2>✅ Gatsby Features Implemented:</h2>
        <ul>
          <li>🔍 <strong>SEO Optimization:</strong> Meta tags, Open Graph, Twitter Cards</li>
          <li>🖼️ <strong>Image Optimization:</strong> WebP conversion, lazy loading, responsive images</li>
          <li>📊 <strong>GraphQL Integration:</strong> Static queries for site metadata</li>
          <li>🚀 <strong>Performance:</strong> Automatic code splitting and prefetching</li>
          <li>📝 <strong>Markdown Support:</strong> Transform markdown files to pages</li>
        </ul>
      </div>
    </div>
  );
};

export default IndexPage;`
        },
        hints: [
          'Configure plugins in gatsby-config.js to extend Gatsby functionality',
          'Use useStaticQuery to fetch data at build time in components',
          'gatsby-plugin-image provides optimized images with lazy loading',
          'React Helmet manages document head for SEO optimization'
        ]
      }
    ],
    estimatedTime: '65 min',
    difficulty: 'advanced',
    prerequisites: ['nextjs-introduction', 'graphql-react'],
    nextTopics: ['react-native-basics'],
    category: 'advanced'
  },

  // GraphQL with React
  {
    id: 'graphql-react',
    title: 'GraphQL with React',
    description: 'Integrate GraphQL APIs with React applications',
    explanation: `GraphQL is a query language and runtime for APIs that allows clients to request exactly the data they need. When combined with React, it provides a powerful and efficient way to manage data fetching and state.

🔹 **Why GraphQL with React?**
- **Precise Data Fetching**: Request only the data you need
- **Single Endpoint**: One URL for all your data needs
- **Type Safety**: Strong typing with automatic code generation
- **Real-time Updates**: Built-in subscription support

🔸 **Key Tools:**
- **Apollo Client**: Popular GraphQL client for React
- **urql**: Lightweight alternative to Apollo
- **GraphQL Code Generator**: Generate TypeScript types
- **GraphQL Playground**: Interactive query explorer

🧠 **Analogy:** Think of GraphQL like ordering at a restaurant where you can customize exactly what you want on your plate, rather than choosing from fixed combo meals (REST APIs).`,
    animationScript: 'Show GraphQL query fetching specific data vs REST multiple endpoints',
    scenario: '🔍 Build efficient data-driven React apps using GraphQL for precise data fetching.',
    challenges: [
      {
        id: 'apollo-client-setup',
        title: 'Setup Apollo Client with React',
        description: 'Configure Apollo Client and create components that fetch data with GraphQL',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '35 min',
        xpReward: 160,
        code: {
          initial: `import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// TODO: Configure Apollo Client
// const client = new ApolloClient({
//   uri: 'https://api.spacex.land/graphql/',
//   cache: new InMemoryCache()
// });

// TODO: Define GraphQL query
// const GET_LAUNCHES = gql\`
//   query GetLaunches($limit: Int) {
//     launches(limit: $limit) {
//       id
//       mission_name
//       launch_date_local
//       launch_success
//       rocket {
//         rocket_name
//       }
//     }
//   }
// \`;

function LaunchList() {
  // TODO: Use useQuery hook to fetch data
  // const { loading, error, data } = useQuery(GET_LAUNCHES, {
  //   variables: { limit: 10 }
  // });

  // Placeholder data for demo
  const loading = false;
  const error = null;
  const data = {
    launches: [
      {
        id: '1',
        mission_name: 'Demo Mission',
        launch_date_local: '2023-01-01',
        launch_success: true,
        rocket: { rocket_name: 'Falcon 9' }
      }
    ]
  };

  if (loading) return <p>Loading launches...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>SpaceX Launches</h2>
      <div>
        {data.launches.map(launch => (
          <div
            key={launch.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              margin: '10px 0',
              backgroundColor: launch.launch_success ? '#f0f8f0' : '#fff0f0'
            }}
          >
            <h3>{launch.mission_name}</h3>
            <p><strong>Rocket:</strong> {launch.rocket.rocket_name}</p>
            <p><strong>Date:</strong> {new Date(launch.launch_date_local).toLocaleDateString()}</p>
            <p><strong>Status:</strong>
              <span style={{
                color: launch.launch_success ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {launch.launch_success ? ' ✅ Success' : ' ❌ Failed'}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    // TODO: Wrap with ApolloProvider
    // <ApolloProvider client={client}>
      <div>
        <h1>GraphQL with React Demo</h1>
        <LaunchList />
      </div>
    // </ApolloProvider>
  );
}

export default App;`,
          solution: `import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// Configure Apollo Client
const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
  cache: new InMemoryCache()
});

// Define GraphQL query
const GET_LAUNCHES = gql\`
  query GetLaunches($limit: Int) {
    launches(limit: $limit) {
      id
      mission_name
      launch_date_local
      launch_success
      rocket {
        rocket_name
      }
    }
  }
\`;

function LaunchList() {
  const { loading, error, data } = useQuery(GET_LAUNCHES, {
    variables: { limit: 10 }
  });

  if (loading) return <p>Loading launches...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>SpaceX Launches</h2>
      <div>
        {data.launches.map(launch => (
          <div
            key={launch.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              margin: '10px 0',
              backgroundColor: launch.launch_success ? '#f0f8f0' : '#fff0f0'
            }}
          >
            <h3>{launch.mission_name}</h3>
            <p><strong>Rocket:</strong> {launch.rocket.rocket_name}</p>
            <p><strong>Date:</strong> {new Date(launch.launch_date_local).toLocaleDateString()}</p>
            <p><strong>Status:</strong>
              <span style={{
                color: launch.launch_success ? 'green' : 'red',
                fontWeight: 'bold'
              }}>
                {launch.launch_success ? ' ✅ Success' : ' ❌ Failed'}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>GraphQL with React Demo</h1>
        <LaunchList />
        <p style={{ padding: '20px', color: '#666', fontSize: '14px' }}>
          ✅ Data fetched from SpaceX GraphQL API using Apollo Client
        </p>
      </div>
    </ApolloProvider>
  );
}

export default App;`
        },
        hints: [
          'Create ApolloClient instance with GraphQL endpoint URI',
          'Wrap your app with ApolloProvider and pass the client',
          'Use gql template literal to define GraphQL queries',
          'Use useQuery hook to fetch data and handle loading/error states'
        ]
      }
    ],
    estimatedTime: '70 min',
    difficulty: 'advanced',
    prerequisites: ['custom-hooks', 'react-query'],
    nextTopics: ['gatsby-ssg'],
    category: 'advanced'
  },

  // React Native Basics
  {
    id: 'react-native-basics',
    title: 'React Native Basics',
    description: 'Build mobile apps with React Native',
    explanation: `React Native allows you to build native mobile applications using React. Write once in JavaScript and deploy to both iOS and Android platforms with native performance and look-and-feel.

🔹 **Why React Native?**
- **Cross-Platform**: One codebase for iOS and Android
- **Native Performance**: Compiles to native components
- **Hot Reloading**: Instant feedback during development
- **Large Ecosystem**: Extensive library and community support

🔸 **Key Differences from React Web:**
- **Native Components**: View, Text, ScrollView instead of div, p, etc.
- **Styling**: StyleSheet API instead of CSS
- **Navigation**: React Navigation for screen transitions
- **Platform APIs**: Access to camera, GPS, notifications, etc.

🧠 **Analogy:** Think of React Native as a translator that takes your React knowledge and converts it into native mobile language that iOS and Android understand.`,
    animationScript: 'Show React code transforming into native iOS and Android components',
    scenario: '📱 Build cross-platform mobile applications using React Native with native performance.',
    challenges: [
      {
        id: 'react-native-todo-app',
        title: 'Build Mobile Todo App',
        description: 'Create a mobile todo application using React Native components',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '45 min',
        xpReward: 180,
        code: {
          initial: `import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    // TODO: Add new todo item
    if (inputText.trim()) {
      // Add logic here
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    // TODO: Toggle todo completion status
  };

  const deleteTodo = (id) => {
    // TODO: Delete todo item
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Add delete logic here
        }}
      ]
    );
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoText}
        onPress={() => toggleTodo(item.id)}
      >
        <Text style={[
          styles.todoTextContent,
          item.completed && styles.completedText
        ]}>
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Todo</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a new todo..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.todoList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoList: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
  },
  todoTextContent: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});

export default TodoApp;`,
          solution: `import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        }}
      ]
    );
  };

  const renderTodoItem = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoText}
        onPress={() => toggleTodo(item.id)}
      >
        <Text style={[
          styles.todoTextContent,
          item.completed && styles.completedText
        ]}>
          {item.completed ? '✅ ' : '⭕ '}{item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Todo</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a new todo..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.todoList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No todos yet. Add one above!</Text>
        }
      />

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoList: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
  },
  todoTextContent: {
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  stats: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 10,
  },
  statsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default TodoApp;`
        },
        hints: [
          'Use View instead of div, Text instead of p, TouchableOpacity instead of button',
          'Create StyleSheet objects for styling instead of CSS',
          'Use FlatList for efficient rendering of large lists',
          'Handle user interactions with onPress instead of onClick'
        ]
      },
      {
        id: 'react-navigation-stack',
        title: 'Build Navigation with React Navigation',
        description: 'Create a multi-screen app using React Navigation stack navigator',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '40 min',
        xpReward: 190,
        code: {
          initial: `import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// TODO: Create Stack Navigator
// const Stack = createNativeStackNavigator();

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏠 Home Screen</Text>
        <Text style={styles.subtitle}>Welcome to React Navigation!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {/* TODO: Navigate to Profile */}}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {/* TODO: Navigate to Settings */}}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Profile Screen Component
function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>👤 Profile Screen</Text>
        <Text style={styles.subtitle}>User profile information</Text>

        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Name: John Doe</Text>
          <Text style={styles.profileText}>Email: john@example.com</Text>
          <Text style={styles.profileText}>Member since: 2024</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {/* TODO: Go back to Home */}}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Settings Screen Component
function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚙️ Settings Screen</Text>
        <Text style={styles.subtitle}>App configuration</Text>

        <View style={styles.settingsList}>
          <Text style={styles.settingItem}>🔔 Notifications: On</Text>
          <Text style={styles.settingItem}>🌙 Dark Mode: Off</Text>
          <Text style={styles.settingItem}>🔒 Privacy: Enabled</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {/* TODO: Go back */}}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Main App Component
export default function App() {
  return (
    // TODO: Set up NavigationContainer and Stack Navigator
    <View style={styles.container}>
      <Text>Navigation setup needed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  secondaryButtonText: {
    color: '#007bff',
  },
  profileInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  settingsList: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  settingItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    paddingVertical: 5,
  },
});`,
          solution: `import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏠 Home Screen</Text>
        <Text style={styles.subtitle}>Welcome to React Navigation!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Profile Screen Component
function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>👤 Profile Screen</Text>
        <Text style={styles.subtitle}>User profile information</Text>

        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Name: John Doe</Text>
          <Text style={styles.profileText}>Email: john@example.com</Text>
          <Text style={styles.profileText}>Member since: 2024</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Settings Screen Component
function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚙️ Settings Screen</Text>
        <Text style={styles.subtitle}>App configuration</Text>

        <View style={styles.settingsList}>
          <Text style={styles.settingItem}>🔔 Notifications: On</Text>
          <Text style={styles.settingItem}>🌙 Dark Mode: Off</Text>
          <Text style={styles.settingItem}>🔒 Privacy: Enabled</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'User Profile' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'App Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  secondaryButtonText: {
    color: '#007bff',
  },
  profileInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  settingsList: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  settingItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    paddingVertical: 5,
  },
});`
        },
        hints: [
          'Wrap your app with NavigationContainer to enable navigation',
          'Use createNativeStackNavigator to create a stack navigator',
          'Define screens using Stack.Screen components',
          'Use navigation.navigate() to go to specific screens and navigation.goBack() to return'
        ]
      }
    ],
    estimatedTime: '80 min',
    difficulty: 'advanced',
    prerequisites: ['components-basics', 'usestate-basics', 'lists-and-keys'],
    nextTopics: ['micro-frontends'],
    category: 'advanced'
  },

  // Micro-frontends with React
  {
    id: 'micro-frontends',
    title: 'Micro-frontends with React',
    description: 'Build scalable applications with micro-frontend architecture',
    explanation: `Micro-frontends extend the microservices concept to frontend development. Break large applications into smaller, independent pieces that can be developed, deployed, and maintained by different teams.

🔹 **Why Micro-frontends?**
- **Team Independence**: Different teams can work on different parts
- **Technology Diversity**: Mix different frameworks and versions
- **Independent Deployment**: Deploy parts of the app separately
- **Scalable Development**: Scale teams and codebases independently

🔸 **Implementation Approaches:**
- **Module Federation**: Webpack 5 feature for sharing modules
- **Single-SPA**: Framework for orchestrating micro-frontends
- **Web Components**: Standard-based approach
- **Server-Side Composition**: Compose at the server level

🧠 **Analogy:** Think of micro-frontends like a shopping mall - each store (micro-frontend) is independent, but they all work together to create a unified experience for customers.`,
    animationScript: 'Show multiple React apps being composed into a single application',
    scenario: '🏗️ Build scalable micro-frontend architecture using Module Federation and React.',
    challenges: [
      {
        id: 'module-federation-setup',
        title: 'Setup Module Federation',
        description: 'Create a host application that consumes remote micro-frontends',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '50 min',
        xpReward: 200,
        code: {
          initial: `// Host Application (Shell)
import React, { Suspense } from 'react';

// TODO: Import remote components using Module Federation
// const RemoteHeader = React.lazy(() => import('headerApp/Header'));
// const RemoteFooter = React.lazy(() => import('footerApp/Footer'));
// const RemoteUserProfile = React.lazy(() => import('userApp/UserProfile'));

function App() {
  const [currentUser, setCurrentUser] = React.useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👤'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TODO: Use remote header component */}
      <header style={{ backgroundColor: '#007bff', color: 'white', padding: '1rem' }}>
        <h1>Micro-frontend Demo (Local Header)</h1>
      </header>

      <main style={{ flex: 1, padding: '2rem' }}>
        <h2>Welcome to Micro-frontends</h2>
        <p>This demonstrates a host application consuming remote micro-frontends.</p>

        <div style={{ marginTop: '2rem' }}>
          {/* TODO: Use remote user profile component */}
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>User Profile (Local Component)</h3>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Avatar:</strong> {currentUser.avatar}</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Micro-frontend Benefits:</h3>
          <ul>
            <li>✅ Independent development and deployment</li>
            <li>✅ Technology diversity (different React versions, frameworks)</li>
            <li>✅ Team autonomy and scalability</li>
            <li>✅ Fault isolation (one app failure doesn't break others)</li>
          </ul>
        </div>
      </main>

      {/* TODO: Use remote footer component */}
      <footer style={{ backgroundColor: '#6c757d', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <p>© 2024 Micro-frontend Demo (Local Footer)</p>
      </footer>
    </div>
  );
}

export default App;

// Webpack Configuration for Module Federation (webpack.config.js)
/*
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        headerApp: 'headerApp@http://localhost:3001/remoteEntry.js',
        footerApp: 'footerApp@http://localhost:3002/remoteEntry.js',
        userApp: 'userApp@http://localhost:3003/remoteEntry.js',
      },
    }),
  ],
};
*/`,
          solution: `// Host Application (Shell)
import React, { Suspense } from 'react';

// Import remote components using Module Federation
const RemoteHeader = React.lazy(() => import('headerApp/Header'));
const RemoteFooter = React.lazy(() => import('footerApp/Footer'));
const RemoteUserProfile = React.lazy(() => import('userApp/UserProfile'));

// Fallback components for when remotes are unavailable
const HeaderFallback = () => (
  <header style={{ backgroundColor: '#007bff', color: 'white', padding: '1rem' }}>
    <h1>🏠 Host Application (Fallback Header)</h1>
  </header>
);

const FooterFallback = () => (
  <footer style={{ backgroundColor: '#6c757d', color: 'white', padding: '1rem', textAlign: 'center' }}>
    <p>© 2024 Host Application (Fallback Footer)</p>
  </footer>
);

const UserProfileFallback = ({ user }) => (
  <div style={{
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#f8f9fa'
  }}>
    <h3>👤 User Profile (Fallback)</h3>
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Status:</strong> Remote component unavailable</p>
  </div>
);

function App() {
  const [currentUser, setCurrentUser] = React.useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👤',
    role: 'Developer'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Remote Header with Fallback */}
      <Suspense fallback={<HeaderFallback />}>
        <RemoteHeader
          title="Micro-frontend Architecture Demo"
          user={currentUser}
        />
      </Suspense>

      <main style={{ flex: 1, padding: '2rem' }}>
        <h2>🏗️ Welcome to Micro-frontends</h2>
        <p>This demonstrates a host application consuming remote micro-frontends using Module Federation.</p>

        <div style={{ marginTop: '2rem' }}>
          {/* Remote User Profile with Fallback */}
          <Suspense fallback={<UserProfileFallback user={currentUser} />}>
            <RemoteUserProfile
              user={currentUser}
              onUserUpdate={setCurrentUser}
            />
          </Suspense>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
          <h3>🎯 Micro-frontend Architecture:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4>🏠 Host App (Port 3000)</h4>
              <p>Orchestrates and composes remote apps</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4>📋 Header App (Port 3001)</h4>
              <p>Navigation and branding</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4>👤 User App (Port 3003)</h4>
              <p>User management features</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '6px' }}>
              <h4>🦶 Footer App (Port 3002)</h4>
              <p>Footer content and links</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>✅ Benefits Demonstrated:</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Independent Deployment:</strong> Each micro-frontend can be deployed separately</li>
            <li><strong>Technology Diversity:</strong> Different teams can use different React versions</li>
            <li><strong>Fault Tolerance:</strong> Fallback components when remotes are unavailable</li>
            <li><strong>Team Autonomy:</strong> Teams can develop and maintain their own micro-frontends</li>
            <li><strong>Shared State:</strong> Data can be passed between micro-frontends</li>
          </ul>
        </div>
      </main>

      {/* Remote Footer with Fallback */}
      <Suspense fallback={<FooterFallback />}>
        <RemoteFooter />
      </Suspense>
    </div>
  );
}

export default App;

/*
Complete Webpack Configuration for Module Federation:

// webpack.config.js (Host Application)
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        headerApp: 'headerApp@http://localhost:3001/remoteEntry.js',
        footerApp: 'footerApp@http://localhost:3002/remoteEntry.js',
        userApp: 'userApp@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};

// Remote applications would have similar configs but expose components instead of consuming them
*/`
        },
        hints: [
          'Use React.lazy() to dynamically import remote components',
          'Wrap remote components with Suspense for loading states',
          'Provide fallback components for when remotes are unavailable',
          'Configure Module Federation in webpack.config.js with remotes and shared dependencies'
        ]
      },
      {
        id: 'micro-frontend-dashboard',
        title: 'Build Micro-Frontend Dashboard with Multiple Remotes',
        description: 'Create a dashboard that loads multiple independent micro-frontend widgets',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '60 min',
        xpReward: 220,
        code: {
          initial: `// Host App - Dashboard Container
import React, { Suspense } from 'react';

// TODO: Import remote components
// const UserWidget = React.lazy(() => import('userApp/UserWidget'));
// const NotificationWidget = React.lazy(() => import('notificationApp/NotificationWidget'));
// const StatsWidget = React.lazy(() => import('statsApp/StatsWidget'));

// Fallback components for when remotes are unavailable
const WidgetFallback = ({ title }) => (
  <div style={{
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa'
  }}>
    <h3>⚠️ {title} Unavailable</h3>
    <p>Remote micro-frontend could not be loaded</p>
  </div>
);

function Dashboard() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🏗️ Micro-Frontend Dashboard</h1>
        <p style={{ color: '#666' }}>Composed from independent micro-frontends</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* User Widget */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>👤 User Information</h2>
          {/* TODO: Add Suspense wrapper with UserWidget */}
          <WidgetFallback title="User Widget" />
        </div>

        {/* Notifications Widget */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>🔔 Notifications</h2>
          {/* TODO: Add Suspense wrapper with NotificationWidget */}
          <WidgetFallback title="Notification Widget" />
        </div>

        {/* Stats Widget */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>📊 Statistics</h2>
          {/* TODO: Add Suspense wrapper with StatsWidget */}
          <WidgetFallback title="Stats Widget" />
        </div>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
        <h3>🎯 Micro-Frontend Benefits:</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
          <div>✅ Independent Development</div>
          <div>✅ Technology Diversity</div>
          <div>✅ Fault Isolation</div>
          <div>✅ Team Autonomy</div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

/*
TODO: Webpack Configuration for Host App

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      remotes: {
        userApp: 'userApp@http://localhost:3001/remoteEntry.js',
        notificationApp: 'notificationApp@http://localhost:3002/remoteEntry.js',
        statsApp: 'statsApp@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
*/`,
          solution: `// Host App - Dashboard Container
import React, { Suspense } from 'react';

// Import remote components
const UserWidget = React.lazy(() => import('userApp/UserWidget'));
const NotificationWidget = React.lazy(() => import('notificationApp/NotificationWidget'));
const StatsWidget = React.lazy(() => import('statsApp/StatsWidget'));

// Fallback components for when remotes are unavailable
const WidgetFallback = ({ title }) => (
  <div style={{
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa'
  }}>
    <h3>⚠️ {title} Unavailable</h3>
    <p>Remote micro-frontend could not be loaded</p>
  </div>
);

const LoadingWidget = ({ title }) => (
  <div style={{
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff'
  }}>
    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
    <p>Loading {title}...</p>
  </div>
);

function Dashboard() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🏗️ Micro-Frontend Dashboard</h1>
        <p style={{ color: '#666' }}>Composed from independent micro-frontends</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* User Widget */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>👤 User Information</h2>
          <Suspense fallback={<LoadingWidget title="User Widget" />}>
            <UserWidget />
          </Suspense>
        </div>

        {/* Notifications Widget */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>🔔 Notifications</h2>
          <Suspense fallback={<LoadingWidget title="Notification Widget" />}>
            <NotificationWidget />
          </Suspense>
        </div>

        {/* Stats Widget */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#333' }}>📊 Statistics</h2>
          <Suspense fallback={<LoadingWidget title="Stats Widget" />}>
            <StatsWidget />
          </Suspense>
        </div>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
        <h3>✅ Micro-Frontend Architecture Demonstrated:</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px',
          maxWidth: '800px',
          margin: '20px auto 0'
        }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>🏠 Host App (Port 3000)</strong><br/>
            Orchestrates and composes widgets
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>👤 User App (Port 3001)</strong><br/>
            Independent user management
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>🔔 Notification App (Port 3002)</strong><br/>
            Standalone notification system
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '6px' }}>
            <strong>📊 Stats App (Port 3003)</strong><br/>
            Independent analytics widget
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

/*
Complete Webpack Configuration for Host App:

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      remotes: {
        userApp: 'userApp@http://localhost:3001/remoteEntry.js',
        notificationApp: 'notificationApp@http://localhost:3002/remoteEntry.js',
        statsApp: 'statsApp@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
    }),
  ],
};

// Example Remote App (userApp/webpack.config.js):
module.exports = {
  mode: 'development',
  devServer: {
    port: 3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'userApp',
      filename: 'remoteEntry.js',
      exposes: {
        './UserWidget': './src/UserWidget',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
*/`
        },
        hints: [
          'Each remote app must expose its components via the exposes configuration',
          'Use different ports for each micro-frontend (3000, 3001, 3002, 3003)',
          'Share React dependencies to avoid version conflicts',
          'Implement proper error boundaries and fallback components for resilience'
        ]
      }
    ],
    estimatedTime: '90 min',
    difficulty: 'advanced',
    prerequisites: ['code-splitting', 'react-suspense', 'custom-hooks'],
    nextTopics: [],
    category: 'advanced'
  }
];
