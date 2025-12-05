// Ultimate React Learning Path - All 43 Topics from Beginner to Expert
// Complete with code examples, playground challenges, and mini-projects

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

export const ultimateReactTopics: LearningTopic[] = [
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
- JSX syntax extension`,
    animationScript: `Split screen showing:
Left: Vanilla JS → document.getElementById() → DOM → slow UI update
Right: React → <Component /> → Virtual DOM → diff → fast UI update
Highlight "Virtual DOM" and "Component" with popups
Gears rotate as the Virtual DOM syncs with real DOM
User clicks button → React shows re-render with minimal updates`,
    scenario: `🧩 You're given vanilla JS code that manipulates the DOM directly. Your mission is to convert it to React using modern patterns and understand the React way of thinking.`,
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
  <div id="app">
    <h1 id="title">Welcome!</h1>
    <button onclick="changeTitle()">Change Title</button>
    <p id="counter">Count: 0</p>
    <button onclick="increment()">+</button>
    <button onclick="decrement()">-</button>
  </div>

  <script>
    let count = 0;
    
    function changeTitle() {
      document.getElementById('title').innerText = 'Hello React!';
    }
    
    function increment() {
      count++;
      document.getElementById('counter').innerText = 'Count: ' + count;
    }
    
    function decrement() {
      count--;
      document.getElementById('counter').innerText = 'Count: ' + count;
    }
  </script>
</body>
</html>

// Your React component here:
import React, { useState } from 'react';

function App() {
  // Convert the vanilla JS logic to React
  return (
    <div>
      {/* Your React JSX here */}
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('Welcome!');
  const [count, setCount] = useState(0);

  const changeTitle = () => {
    setTitle('Hello React!');
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{title}</h1>
      <button onClick={changeTitle} style={{ margin: '10px', padding: '10px 20px' }}>
        Change Title
      </button>
      <p>Count: {count}</p>
      <button onClick={increment} style={{ margin: '5px', padding: '10px 20px' }}>
        +
      </button>
      <button onClick={decrement} style={{ margin: '5px', padding: '10px 20px' }}>
        -
      </button>
    </div>
  );
}

export default App;`
        },
        hints: [
          'Use useState hook to manage title and count state',
          'Replace onclick with onClick (camelCase)',
          'Use JSX instead of innerHTML',
          'State updates trigger re-renders automatically'
        ]
      },
      {
        id: 'react-benefits-demo',
        title: 'React Benefits Demo',
        description: 'Build a demo showing React\'s key benefits',
        type: 'mini-project',
        difficulty: 'beginner',
        estimatedTime: '25 min',
        xpReward: 75,
        code: {
          initial: `// Build a demo showcasing React's benefits:
// 1. Component reusability
// 2. State management
// 3. Virtual DOM efficiency
// 4. Declarative UI

import React, { useState } from 'react';

function App() {
  // Create a demo that shows:
  // - Reusable components
  // - Efficient updates
  // - Clean state management
  
  return (
    <div>
      <h1>React Benefits Demo</h1>
      {/* Build your demo here */}
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

// Reusable Card Component
function Card({ title, content, color = '#f8f9fa' }) {
  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px',
      backgroundColor: color,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

// Reusable Counter Component
function Counter({ label, initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);
  
  return (
    <div style={{ margin: '10px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h4>{label}</h4>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '5px' }}>-</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: '5px' }}>Reset</button>
    </div>
  );
}

function App() {
  const [showDemo, setShowDemo] = useState(true);
  const [theme, setTheme] = useState('light');
  
  const benefits = [
    {
      title: '🧩 Component Reusability',
      content: 'Build once, use everywhere! Notice how Card and Counter components are reused.',
      color: theme === 'light' ? '#e3f2fd' : '#1e3a8a'
    },
    {
      title: '⚡ Virtual DOM',
      content: 'Efficient updates! Only changed elements re-render, not the entire page.',
      color: theme === 'light' ? '#f3e5f5' : '#7c2d12'
    },
    {
      title: '🎯 Declarative UI',
      content: 'Describe what you want, React handles how to achieve it.',
      color: theme === 'light' ? '#e8f5e8' : '#14532d'
    }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      color: theme === 'light' ? '#000000' : '#ffffff',
      minHeight: '100vh'
    }}>
      <h1>🚀 React Benefits Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: theme === 'light' ? '#007bff' : '#fbbf24',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Toggle Theme ({theme})
        </button>
        <button 
          onClick={() => setShowDemo(!showDemo)}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {showDemo ? 'Hide' : 'Show'} Demo
        </button>
      </div>

      {showDemo && (
        <>
          <div>
            <h2>📋 React Benefits</h2>
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                title={benefit.title}
                content={benefit.content}
                color={benefit.color}
              />
            ))}
          </div>

          <div>
            <h2>🔢 Component Reusability Demo</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Counter label="Likes" initialValue={42} />
              <Counter label="Views" initialValue={1337} />
              <Counter label="Shares" initialValue={7} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;`
        }
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: [],
    nextTopics: ['jsx-basics'],
    category: 'fundamentals'
  },

  // 2. JSX - JavaScript + HTML Syntax
  {
    id: 'jsx-basics',
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

JSX gets compiled to React.createElement() calls by Babel.`,
    animationScript: `Show JSX code transforming:
<div className="container">Hello {name}</div>
↓ (Babel compilation)
React.createElement('div', {className: 'container'}, 'Hello ', name)
Highlight the transformation with smooth animation
Show JSX rules being applied with visual indicators`,
    scenario: `🧩 You need to fix broken JSX code that has common syntax errors and learn advanced JSX patterns. Your mission is to make it compile and render correctly.`,
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
  const skills = ['JavaScript', 'React', 'CSS'];
  
  return (
    // Multiple root elements (error!)
    <h1>Welcome {name}</h1>
    <div class="container">
      <img src="avatar.jpg" alt="Avatar">
      <p>Status: {isLoggedIn ? 'Online' : 'Offline'}</p>
      <button onclick="handleClick()">Click me</button>
      
      <!-- HTML comment (error!) -->
      <ul>
        {skills.map(skill => 
          <li>{skill}</li>  // Missing key prop
        )}
      </ul>
      
      <input type="text" value="test">
      <br>
    </div>
  );
}

export default BrokenComponent;`,
          solution: `import React from 'react';

function FixedComponent() {
  const name = 'React Developer';
  const isLoggedIn = true;
  const skills = ['JavaScript', 'React', 'CSS'];
  
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
        
        {/* JSX comment */}
        <ul>
          {skills.map((skill, index) => 
            <li key={index}>{skill}</li>
          )}
        </ul>
        
        <input type="text" defaultValue="test" />
        <br />
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
          'Add key prop to list items',
          'Use JSX comments {/* */} instead of HTML comments'
        ]
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['what-is-react'],
    nextTopics: ['components-functional-vs-class'],
    category: 'fundamentals'
  },

  // 3. Components - Functional vs Class Components
  {
    id: 'components-functional-vs-class',
    title: 'Components - Functional vs Class Components',
    description: 'Master component creation with focus on modern functional components!',
    explanation: `Components are the building blocks of React applications. There are two main types:

**Functional Components (Modern, Preferred):**
- Simple JavaScript functions that return JSX
- Use hooks for state and lifecycle
- Cleaner syntax and easier to test
- Better performance with React optimizations

**Class Components (Legacy):**
- ES6 classes that extend React.Component
- Use this.state and lifecycle methods
- Still used in legacy codebases
- Being phased out in favor of functional components

Best practices:
- Always use functional components for new code
- Convert class components to functional when possible
- Use PascalCase for component names
- Keep components small and focused`,
    animationScript: `Show component evolution:
Class Component → complex syntax → lifecycle methods
↓ (React Hooks introduced)
Functional Component → simple syntax → hooks
Highlight the simplification and modern approach`,
    scenario: `🧩 You need to understand both component types and convert legacy class components to modern functional components. Your mission is to master component patterns.`,
    challenges: [
      {
        id: 'convert-class-to-functional',
        title: 'Convert Class to Functional Component',
        description: 'Transform class components to modern functional components',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 80,
        code: {
          initial: `// Convert these class components to functional components
import React, { Component, useState } from 'react';

// Class Component 1: Simple Counter
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h3>Count: {this.state.count}</h3>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

// Class Component 2: User Profile
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      name: this.props.initialName || 'Anonymous'
    };
  }

  toggleEdit = () => {
    this.setState({ isEditing: !this.state.isEditing });
  }

  updateName = (newName) => {
    this.setState({ name: newName, isEditing: false });
  }

  render() {
    const { isEditing, name } = this.state;

    return (
      <div>
        {isEditing ? (
          <input
            type="text"
            defaultValue={name}
            onBlur={(e) => this.updateName(e.target.value)}
          />
        ) : (
          <h3>User: {name}</h3>
        )}
        <button onClick={this.toggleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    );
  }
}

// Convert to functional components:
function CounterFunctional() {
  // Your functional component here
}

function UserProfileFunctional({ initialName = 'Anonymous' }) {
  // Your functional component here
}

function App() {
  return (
    <div>
      <h1>Component Conversion Demo</h1>
      <h2>Class Components:</h2>
      <Counter />
      <UserProfile initialName="John Doe" />

      <h2>Functional Components:</h2>
      <CounterFunctional />
      <UserProfileFunctional initialName="Jane Smith" />
    </div>
  );
}

export default App;`,
          solution: `import React, { Component, useState } from 'react';

// Original Class Components (for comparison)
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px' }}>
        <h3>Count: {this.state.count}</h3>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      name: this.props.initialName || 'Anonymous'
    };
  }

  toggleEdit = () => {
    this.setState({ isEditing: !this.state.isEditing });
  }

  updateName = (newName) => {
    this.setState({ name: newName, isEditing: false });
  }

  render() {
    const { isEditing, name } = this.state;

    return (
      <div style={{ padding: '10px', border: '1px solid #ccc', margin: '10px' }}>
        {isEditing ? (
          <input
            type="text"
            defaultValue={name}
            onBlur={(e) => this.updateName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && this.updateName(e.target.value)}
          />
        ) : (
          <h3>User: {name}</h3>
        )}
        <button onClick={this.toggleEdit}>
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    );
  }
}

// Converted Functional Components
function CounterFunctional() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #28a745', margin: '10px' }}>
      <h3>Count: {count}</h3>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

function UserProfileFunctional({ initialName = 'Anonymous' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const updateName = (newName) => {
    setName(newName);
    setIsEditing(false);
  };

  return (
    <div style={{ padding: '10px', border: '1px solid #28a745', margin: '10px' }}>
      {isEditing ? (
        <input
          type="text"
          defaultValue={name}
          onBlur={(e) => updateName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && updateName(e.target.value)}
          autoFocus
        />
      ) : (
        <h3>User: {name}</h3>
      )}
      <button onClick={toggleEdit}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Component Conversion Demo</h1>

      <h2>🔴 Class Components (Legacy):</h2>
      <Counter />
      <UserProfile initialName="John Doe" />

      <h2>🟢 Functional Components (Modern):</h2>
      <CounterFunctional />
      <UserProfileFunctional initialName="Jane Smith" />

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa' }}>
        <h3>Key Differences:</h3>
        <ul>
          <li>✅ Functional: Simpler syntax with hooks</li>
          <li>✅ Functional: Better performance optimizations</li>
          <li>✅ Functional: Easier to test and debug</li>
          <li>❌ Class: More verbose with lifecycle methods</li>
          <li>❌ Class: Harder to optimize and reuse logic</li>
        </ul>
      </div>
    </div>
  );
}

export default App;`
        },
        hints: [
          'Replace class with function declaration',
          'Use useState hook instead of this.state',
          'Convert methods to regular functions',
          'Remove constructor and use function parameters for props'
        ]
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: ['jsx-basics'],
    nextTopics: ['props-basics'],
    category: 'fundamentals'
  },

  // 4. Props - Passing Data Between Components
  {
    id: 'props-basics',
    title: 'Props - Passing Data Between Components',
    description: 'Learn how to pass data between components using props!',
    explanation: `Props (properties) are how you pass data from parent components to child components. They make components reusable and dynamic.

Key concepts:
- Props are read-only (immutable)
- Pass data down the component tree
- Can pass any JavaScript value (strings, numbers, objects, functions)
- Use destructuring for cleaner code
- Default props for fallback values
- PropTypes for type checking (optional)

Props flow:
Parent Component → passes props → Child Component → receives props → renders UI`,
    animationScript: `Show data flow with props:
Parent component → wraps data in props → passes to child
Child component → receives props → uses data to render
Show different types of props (string, number, object, function)
Highlight one-way data flow with arrows`,
    scenario: `🧩 You need to make components dynamic by passing different data to them. Your mission is to master props and component communication.`,
    challenges: [
      {
        id: 'props-data-flow',
        title: 'Master Props Data Flow',
        description: 'Create a component system with proper props flow',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 90,
        code: {
          initial: `// Create a component system with proper props flow
import React, { useState } from 'react';

// Product Card Component - make it accept props
function ProductCard() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px' }}>
      <h3>Product Name</h3>
      <p>$99.99</p>
      <p>Category: Electronics</p>
      <button>Add to Cart</button>
    </div>
  );
}

// User Profile Component - make it accept props
function UserProfile() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px' }}>
      <img src="avatar.jpg" alt="User" style={{ width: '50px', height: '50px' }} />
      <h3>John Doe</h3>
      <p>john@example.com</p>
      <p>Member since: 2023</p>
    </div>
  );
}

// Shopping Cart Component - make it accept props and functions
function ShoppingCart() {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px' }}>
      <h3>Shopping Cart</h3>
      <p>Items: 0</p>
      <p>Total: $0.00</p>
      <button>Checkout</button>
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);

  const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Book', price: 19.99, category: 'Education' },
    { id: 3, name: 'Headphones', price: 79.99, category: 'Electronics' }
  ];

  const user = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'alice-avatar.jpg',
    memberSince: '2023'
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Props Demo - E-commerce App</h1>

      <UserProfile />

      <h2>Products</h2>
      {products.map(product => (
        <ProductCard key={product.id} />
      ))}

      <ShoppingCart />
    </div>
  );
}

export default App;`,
          solution: `import React, { useState } from 'react';

// Product Card Component with props
function ProductCard({ product, onAddToCart }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '15px',
      margin: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>{product.name}</h3>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
        ${product.price}
      </p>
      <p style={{ color: '#6c757d' }}>Category: {product.category}</p>
      <button
        onClick={() => onAddToCart(product)}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

// User Profile Component with props and default values
function UserProfile({ user = {} }) {
  const {
    name = 'Anonymous',
    email = 'No email',
    avatar = 'default-avatar.jpg',
    memberSince = 'Unknown'
  } = user;

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '15px',
      margin: '10px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <img
        src={avatar}
        alt={name}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          marginRight: '15px'
        }}
      />
      <div>
        <h3 style={{ margin: '0 0 5px 0' }}>{name}</h3>
        <p style={{ margin: '0 0 5px 0', color: '#6c757d' }}>{email}</p>
        <p style={{ margin: '0', fontSize: '14px', color: '#6c757d' }}>
          Member since: {memberSince}
        </p>
      </div>
    </div>
  );
}

// Shopping Cart Component with props and computed values
function ShoppingCart({ items = [], onCheckout }) {
  const totalPrice = items.reduce((total, item) => total + item.price, 0).toFixed(2);
  const itemCount = items.length;

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '15px',
      margin: '10px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3>🛒 Shopping Cart</h3>
      <p>Items: {itemCount}</p>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
        Total: ${totalPrice}
      </p>

      {items.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <h4>Cart Items:</h4>
          {items.map((item, index) => (
            <div key={index} style={{ fontSize: '14px', color: '#6c757d' }}>
              • {item.name} - ${item.price}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        style={{
          backgroundColor: items.length > 0 ? '#28a745' : '#6c757d',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: items.length > 0 ? 'pointer' : 'not-allowed'
        }}
      >
        Checkout
      </button>
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);

  const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Book', price: 19.99, category: 'Education' },
    { id: 3, name: 'Headphones', price: 79.99, category: 'Electronics' }
  ];

  const user = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'alice-avatar.jpg',
    memberSince: '2023'
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    console.log(\`Added \${product.name} to cart\`);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      alert(\`Checkout successful! Total: $\${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}\`);
      setCartItems([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Props Demo - E-commerce App</h1>

      <UserProfile user={user} />

      <h2>Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <ShoppingCart
        items={cartItems}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;`
        },
        hints: [
          'Add parameters to component functions to receive props',
          'Use destructuring for cleaner prop access',
          'Pass functions as props for child-to-parent communication',
          'Use default values for optional props'
        ]
      }
    ],
    estimatedTime: '50 min',
    difficulty: 'beginner',
    prerequisites: ['components-functional-vs-class'],
    nextTopics: ['state-usestate'],
    category: 'fundamentals'
  },

  // 5. State (using useState)
  {
    id: 'state-usestate',
    title: 'State Management with useState',
    description: 'Master component state management with the useState hook!',
    explanation: `useState is a React Hook that lets you add state to functional components. State represents data that can change over time and triggers re-renders when updated.

Key concepts:
- State is local to each component instance
- useState returns [value, setter] array
- State updates are asynchronous
- Never mutate state directly
- Use functional updates for complex state
- State updates trigger component re-renders

useState patterns:
- Simple values: useState(0)
- Objects: useState({name: '', email: ''})
- Arrays: useState([])
- Functions: useState(() => expensiveCalculation())`,
    animationScript: `Show state lifecycle:
Initial state: useState(0) → component renders with 0
User interaction → setState(1) → component re-renders with 1
Show state flowing through component with glowing effect when state changes
Highlight re-render cycle and Virtual DOM updates`,
    scenario: `🧩 You need to add interactivity to static components and manage complex state. Your mission is to master useState patterns and state management.`,
    challenges: [
      {
        id: 'state-management-patterns',
        title: 'Master useState Patterns',
        description: 'Implement various state management patterns with useState',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '25 min',
        xpReward: 100,
        code: {
          initial: `// Implement various useState patterns
import React, { useState } from 'react';

function StatePatterns() {
  // 1. Simple counter state

  // 2. Object state for user form

  // 3. Array state for todo list

  // 4. Boolean state for toggles

  return (
    <div style={{ padding: '20px' }}>
      <h1>useState Patterns Demo</h1>

      {/* 1. Counter Section */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>1. Simple State (Counter)</h2>
        {/* Implement counter with increment, decrement, reset */}
      </section>

      {/* 2. Object State Section */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>2. Object State (User Form)</h2>
        {/* Implement form with name, email, age fields */}
      </section>

      {/* 3. Array State Section */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>3. Array State (Todo List)</h2>
        {/* Implement todo list with add, remove, toggle */}
      </section>

      {/* 4. Boolean State Section */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h2>4. Boolean State (Toggles)</h2>
        {/* Implement various toggles and visibility controls */}
      </section>
    </div>
  );
}

export default StatePatterns;`,
          solution: `import React, { useState } from 'react';

function StatePatterns() {
  // 1. Simple counter state
  const [count, setCount] = useState(0);

  // 2. Object state for user form
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: ''
  });

  // 3. Array state for todo list
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // 4. Boolean states for toggles
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Counter functions
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  // User form functions
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  const clearUser = () => {
    setUser({ name: '', email: '', age: '' });
  };

  // Todo functions
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prevTodos => [
        ...prevTodos,
        { id: Date.now(), text: newTodo, completed: false }
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const themeStyle = {
    backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '20px'
  };

  return (
    <div style={themeStyle}>
      <h1>useState Patterns Demo</h1>

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: isDarkMode ? '#4a5568' : '#e2e8f0',
          color: isDarkMode ? '#ffffff' : '#000000',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        {isDarkMode ? '☀️' : '🌙'} Toggle Theme
      </button>

      {/* 1. Counter Section */}
      <section style={{
        marginBottom: '30px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc'
      }}>
        <h2>1. Simple State (Counter)</h2>
        <p>Count: <strong>{count}</strong></p>
        <button onClick={increment} style={{ margin: '5px', padding: '8px 16px' }}>
          +1
        </button>
        <button onClick={decrement} style={{ margin: '5px', padding: '8px 16px' }}>
          -1
        </button>
        <button onClick={reset} style={{ margin: '5px', padding: '8px 16px' }}>
          Reset
        </button>
      </section>

      {/* 2. Object State Section */}
      <section style={{
        marginBottom: '30px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc'
      }}>
        <h2>2. Object State (User Form)</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => updateUser('name', e.target.value)}
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => updateUser('email', e.target.value)}
            style={{ margin: '5px', padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Age"
            value={user.age}
            onChange={(e) => updateUser('age', e.target.value)}
            style={{ margin: '5px', padding: '8px' }}
          />
          <button onClick={clearUser} style={{ margin: '5px', padding: '8px 16px' }}>
            Clear
          </button>
        </div>
        <div style={{ padding: '10px', backgroundColor: isDarkMode ? '#2d3748' : '#e2e8f0', borderRadius: '5px' }}>
          <strong>User Data:</strong> {JSON.stringify(user, null, 2)}
        </div>
      </section>

      {/* 3. Array State Section */}
      <section style={{
        marginBottom: '30px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc'
      }}>
        <h2>3. Array State (Todo List)</h2>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Add new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            style={{ margin: '5px', padding: '8px', width: '200px' }}
          />
          <button onClick={addTodo} style={{ margin: '5px', padding: '8px 16px' }}>
            Add Todo
          </button>
        </div>
        <div>
          {todos.map(todo => (
            <div key={todo.id} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px',
              padding: '5px',
              backgroundColor: isDarkMode ? '#2d3748' : '#e2e8f0',
              borderRadius: '3px'
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              <span style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1
              }}>
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                style={{
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <p style={{ fontStyle: 'italic', color: '#a0aec0' }}>No todos yet. Add one above!</p>
          )}
        </div>
      </section>

      {/* 4. Boolean State Section */}
      <section style={{
        marginBottom: '30px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: isDarkMode ? '#4a5568' : '#f7fafc'
      }}>
        <h2>4. Boolean State (Toggles)</h2>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setIsVisible(!isVisible)}
            style={{ margin: '5px', padding: '8px 16px' }}
          >
            {isVisible ? 'Hide' : 'Show'} Content
          </button>
          {isVisible && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: isDarkMode ? '#2d3748' : '#e2e8f0',
              borderRadius: '5px'
            }}>
              🎉 This content is conditionally rendered based on boolean state!
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ margin: '5px', padding: '8px 16px' }}
          >
            {isExpanded ? 'Collapse' : 'Expand'} Details
          </button>
          {isExpanded && (
            <div style={{
              marginTop: '10px',
              padding: '15px',
              backgroundColor: isDarkMode ? '#2d3748' : '#e2e8f0',
              borderRadius: '5px'
            }}>
              <h4>Expanded Details</h4>
              <p>This section shows how boolean state can control UI visibility and user interactions.</p>
              <ul>
                <li>✅ Simple toggle functionality</li>
                <li>✅ Conditional rendering</li>
                <li>✅ Dynamic button text</li>
                <li>✅ State-driven UI changes</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StatePatterns;`
        }
      }
    ],
    estimatedTime: '60 min',
    difficulty: 'beginner',
    prerequisites: ['props-basics'],
    nextTopics: ['event-handling'],
    category: 'fundamentals'
  }
];
