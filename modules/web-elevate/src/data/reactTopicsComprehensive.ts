// Comprehensive React Topics from learning-react.txt
// This file contains all 43 React topics to be integrated into the learning path
// Each topic includes: explanation, code examples, playground challenges, and mini-projects

export const comprehensiveReactTopics = [
  {
    id: 'what-is-react',
    title: 'What is React?',
    description: 'Understanding React\'s declarative approach and Virtual DOM',
    explanation: `React is a JavaScript library for building user interfaces, focusing on component-based architecture. It uses a Virtual DOM for faster rendering and helps manage dynamic content.

React is declarative: instead of telling the browser how to update the DOM step-by-step (like in vanilla JS), you tell React what the UI should look like, and it figures out the changes.`,
    animationScript: `A split screen:
Left: Vanilla JS → document.getElementById() → DOM → slow UI update
Right: React → <Component /> → Virtual DOM → diff → fast UI update
Highlight "Virtual DOM" and "Component" with popups
Gears rotate as the Virtual DOM syncs with real DOM
A user clicks a button → React shows the re-render with minimal updates`,
    scenario: `🧩 You're given vanilla JS code that manipulates the DOM directly. Your task is to convert this imperative approach to React's declarative style using components and state.`,
    challenges: [
      {
        id: 'vanilla-to-react',
        title: 'Convert Vanilla JS to React',
        description: 'Transform imperative DOM manipulation to declarative React components',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        code: {
          initial: `// Vanilla JS Code
<button onclick="changeText()">Click</button>
<p id="output"></p>

<script>
  function changeText() {
    document.getElementById('output').innerText = 'Hello!';
  }
</script>`,
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

export default GreetingApp;`,
          language: 'javascript'
        },
        instructions: [
          'Convert the vanilla JS code to React using a functional component',
          'Use useState hook to manage the message state',
          'Replace onclick with onClick event handler',
          'Use JSX instead of direct DOM manipulation'
        ],
        hints: [
          'Import useState from React',
          'Create a state variable for the message',
          'Use the state setter function in the click handler',
          'Display the state value in JSX'
        ],
        testCriteria: [
          'Component renders without errors',
          'Button click updates the displayed message',
          'Uses React hooks instead of direct DOM manipulation'
        ]
      },
      {
        id: 'greeting-app-challenge',
        title: 'Build a GreetingApp',
        description: 'Create an interactive greeting application with multiple states',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        instructions: [
          'Display "Hello, welcome to React!" initially',
          'Add a button that changes the greeting to "You clicked me!"',
          'Add a reset button to return to the original message',
          'Style the buttons and text appropriately'
        ],
        hints: [
          'Use useState to manage the current greeting',
          'Create separate functions for each button action',
          'Consider using conditional rendering or state values',
          'Add basic CSS classes for styling'
        ],
        testCriteria: [
          'Initial greeting displays correctly',
          'Click button changes the message',
          'Reset button restores original message',
          'Components are properly styled'
        ]
      }
    ],
    learningOutcomes: [
      'Understand React\'s declarative approach',
      'Know how it\'s different from imperative DOM manipulation',
      'Get your first taste of React state and components'
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    nextTopics: ['jsx-basics']
  },
  {
    id: 'jsx-basics',
    title: 'JSX – HTML in JavaScript',
    description: 'Learn JSX syntax and how it compiles to JavaScript',
    explanation: `JSX stands for JavaScript XML. It allows you to write HTML-like syntax inside JavaScript functions. While not required, JSX is the standard for writing React components today.

Behind the scenes, JSX compiles into React.createElement() calls.`,
    animationScript: `JSX is typed like:
const heading = <h1>Hello World</h1>;

Transition animation:
JSX transforms into:
React.createElement('h1', null, 'Hello World');

Popup: "JSX → JavaScript → DOM"
Interactive part: Typing JSX updates a live preview box on the side
Show live DOM rendering`,
    scenario: `🧩 You're working with broken JSX code that has syntax errors. Your mission is to fix the JSX and learn the rules of writing valid JSX syntax.`,
    challenges: [
      {
        id: 'fix-jsx-errors',
        title: 'Fix JSX Syntax Errors',
        description: 'Identify and fix common JSX syntax issues',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '8 min',
        xpReward: 40,
        code: {
          initial: `// Broken JSX - Fix the errors
const title = <h1>Hello
const content = <div>
  <p>Welcome to JSX
  <span>Learn React</span>
</div>`,
          solution: `// Fixed JSX
const title = <h1>Hello</h1>;
const content = (
  <div>
    <p>Welcome to JSX</p>
    <span>Learn React</span>
  </div>
);`,
          language: 'javascript'
        },
        instructions: [
          'Close all JSX tags properly',
          'Wrap multiple elements in a parent element or fragment',
          'Ensure proper JSX syntax throughout'
        ],
        hints: [
          'Every JSX element must be closed',
          'Use parentheses for multi-line JSX',
          'Check for missing closing tags',
          'Consider using React fragments (<> </>) for grouping'
        ],
        testCriteria: [
          'All JSX elements are properly closed',
          'No syntax errors in the code',
          'JSX follows React conventions'
        ]
      },
      {
        id: 'jsx-card-challenge',
        title: 'Build a JSXCard',
        description: 'Create a card component using only JSX',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 60,
        instructions: [
          'Render an image element',
          'Add a heading',
          'Include a paragraph of text',
          'Add a button',
          'Use JSX only — no HTML file'
        ],
        hints: [
          'Use JSX syntax for all elements',
          'Remember to close all tags',
          'Use className instead of class',
          'Consider using fragments for grouping'
        ],
        testCriteria: [
          'Card contains all required elements',
          'Valid JSX syntax throughout',
          'Proper element structure and nesting'
        ]
      }
    ],
    learningOutcomes: [
      'Understand the syntax and rules of JSX',
      'Know how JSX compiles to JS',
      'Learn about fragments, nesting, and attributes in JSX'
    ],
    estimatedTime: '30 min',
    difficulty: 'beginner',
    prerequisites: ['what-is-react'],
    nextTopics: ['components-basics']
  },
  {
    id: 'components-basics',
    title: 'Components – The Building Blocks',
    description: 'Learn to create reusable UI components',
    explanation: `React Components are independent pieces of UI built using functions (or classes). Each component:
- Accepts props
- Returns JSX
- Can be reused throughout the app

React apps = tree of components`,
    animationScript: `Visual: App = Tree
Root Component → Header, Sidebar, Footer
Each component block zooms in:
function Header() {
  return <h1>Site Title</h1>;
}
Plug-and-play feel like LEGO blocks snapping into layout`,
    scenario: `🧩 You're given one huge component with repeating markup. Your task is to break it down into smaller, reusable components that follow the DRY principle.`,
    challenges: [
      {
        id: 'extract-components',
        title: 'Extract Reusable Components',
        description: 'Break down repetitive markup into reusable components',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        xpReward: 60,
        code: {
          initial: `// Repetitive markup - extract into components
function App() {
  return (
    <div>
      <h2>User A</h2>
      <p>Email: usera@example.com</p>
      <button>View Profile</button>

      <h2>User B</h2>
      <p>Email: userb@example.com</p>
      <button>View Profile</button>

      <h2>User C</h2>
      <p>Email: userc@example.com</p>
      <button>View Profile</button>
    </div>
  );
}`,
          solution: `// Extracted into reusable components
function UserCard({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <button>View Profile</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <UserCard name="User A" email="usera@example.com" />
      <UserCard name="User B" email="userb@example.com" />
      <UserCard name="User C" email="userc@example.com" />
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Create a UserCard component that accepts name and email as props',
          'Replace the repetitive markup with UserCard components',
          'Pass the appropriate props to each UserCard instance'
        ],
        hints: [
          'Extract the common structure into a separate function',
          'Use props to make the component dynamic',
          'Replace hardcoded values with prop variables',
          'Use destructuring for cleaner prop access'
        ],
        testCriteria: [
          'UserCard component is properly defined',
          'All user data is displayed correctly',
          'No repetitive markup remains',
          'Props are passed correctly to components'
        ]
      },
      {
        id: 'layout-components',
        title: 'Create Layout Components',
        description: 'Build a complete layout using multiple components',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 80,
        instructions: [
          'Create a Header component with a title prop',
          'Create a Content component that displays paragraph text',
          'Create a Footer component with a year prop',
          'Compose them into a complete page layout'
        ],
        hints: [
          'Each component should be a separate function',
          'Use props to make components configurable',
          'Consider adding basic styling with className',
          'Think about component composition and hierarchy'
        ],
        testCriteria: [
          'All three components render correctly',
          'Props are used to customize content',
          'Components are properly composed in the main App',
          'Layout looks structured and organized'
        ]
      }
    ],
    learningOutcomes: [
      'Build reusable UI using components',
      'Learn to organize large UIs into modular blocks',
      'Practice the component tree model'
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: ['jsx-basics'],
    nextTopics: ['props-basics']
  },
  {
    id: 'props-basics',
    title: 'Props – Passing Data',
    description: 'Learn how to pass data between components',
    explanation: `Props (short for properties) let you send data from parent to child components.
They're read-only and help you make components dynamic and reusable.`,
    animationScript: `Parent → child → passing data packets labeled "name", "age"
Inside the child component, they're unpacked into JSX
Show reusability:
<Profile name="Alice" />
<Profile name="Bob" />`,
    scenario: `🧩 You have a static ProfileCard component that always shows the same information. Your mission is to make it dynamic by accepting props and displaying different user data.`,
    challenges: [
      {
        id: 'add-props-to-component',
        title: 'Make Component Dynamic with Props',
        description: 'Convert a static component to use props',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        code: {
          initial: `// Static component - make it dynamic
function ProfileCard() {
  return (
    <div>
      <h1>Hello, ???</h1>
      <p>Age: ???</p>
      <p>Location: ???</p>
    </div>
  );
}`,
          solution: `// Dynamic component with props
function ProfileCard({ name, age, location }) {
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Age: {age}</p>
      <p>Location: {location}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <ProfileCard name="John" age={25} location="New York" />
      <ProfileCard name="Sarah" age={30} location="London" />
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Add props parameter to the ProfileCard function',
          'Use destructuring to extract name, age, and location',
          'Replace the ??? placeholders with prop values',
          'Create multiple ProfileCard instances with different data'
        ],
        hints: [
          'Use curly braces {} to embed JavaScript in JSX',
          'Destructure props in the function parameter',
          'Remember that props are read-only',
          'Test with different prop values'
        ],
        testCriteria: [
          'Component accepts and uses props correctly',
          'All prop values are displayed in the UI',
          'Multiple instances show different data',
          'No hardcoded values remain'
        ]
      },
      {
        id: 'product-card-challenge',
        title: 'Create a ProductCard',
        description: 'Build a product card with conditional rendering',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        instructions: [
          'Create a ProductCard that takes title, price, and inStock props',
          'Display them properly',
          'Use conditionals for "In Stock" or "Out of Stock"',
          'Style the card appropriately'
        ],
        hints: [
          'Use conditional rendering with ternary operator',
          'Style in-stock and out-of-stock differently',
          'Consider using CSS classes for styling',
          'Test with both in-stock and out-of-stock products'
        ],
        testCriteria: [
          'Product information displays correctly',
          'Stock status shows conditionally',
          'Different styling for stock status',
          'Props are used effectively'
        ]
      }
    ],
    learningOutcomes: [
      'Understand how props work',
      'Pass and use data inside components',
      'Practice prop-based customization of UIs'
    ],
    estimatedTime: '35 min',
    difficulty: 'beginner',
    prerequisites: ['components-basics'],
    nextTopics: ['usestate-basics']
  },
  {
    id: 'usestate-basics',
    title: 'useState – Managing State in Components',
    description: 'Learn to manage component state with the useState hook',
    explanation: `useState is a React Hook that allows function components to track and update stateful data.

It returns:
const [state, setState] = useState(initialValue);

State is what makes a component dynamic — e.g., toggling a menu, tracking user input, counting clicks, etc.`,
    animationScript: `Show a counter on screen
Button is clicked → value sent into a "state box"
Updated value pops back into the UI
setState causes the component to re-render → the new value animates`,
    scenario: `🧩 You're given a broken counter that doesn't update properly. Your task is to fix the state management and make it interactive.`,
    challenges: [
      {
        id: 'fix-counter-state',
        title: 'Fix the Counter State',
        description: 'Fix broken state management in a counter component',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        code: {
          initial: `// Broken counter - fix the state
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function increase() {
    count++; // This won't work!
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increase}>Increase</button>
    </div>
  );
}`,
          solution: `// Fixed counter with proper state management
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increase}>Increase</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Fix the increase function to use setCount properly',
          'Add a reset button that sets count back to 0',
          'Ensure the component re-renders when state changes'
        ],
        hints: [
          'Use setCount(count + 1) instead of count++',
          'State should never be mutated directly',
          'Create a separate reset function',
          'Test both buttons to ensure they work'
        ],
        testCriteria: [
          'Counter increases when button is clicked',
          'Reset button sets count back to 0',
          'Component re-renders with new state',
          'No direct state mutation'
        ]
      },
      {
        id: 'like-button-challenge',
        title: 'Create a LikeButton',
        description: 'Build an interactive like button with state',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        instructions: [
          'Button shows "👍 Like" initially',
          'When clicked → text changes to "Liked"',
          'Button becomes disabled after clicking',
          'Bonus: Add a counter for likes'
        ],
        hints: [
          'Use useState for liked state',
          'Use conditional rendering for button text',
          'Use disabled prop to disable button',
          'Consider adding a like count state'
        ],
        testCriteria: [
          'Button text changes when clicked',
          'Button becomes disabled after clicking',
          'State manages the liked status',
          'Bonus: Like counter works correctly'
        ]
      }
    ],
    learningOutcomes: [
      'Understand how to manage internal state',
      'Learn how React triggers re-renders',
      'Use state to drive interactive behavior'
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['props-basics'],
    nextTopics: ['event-handling']
  },
  {
    id: 'event-handling',
    title: 'Event Handling',
    description: 'Learn to handle user interactions in React',
    explanation: `React handles DOM events using SyntheticEvent, which wraps the native events.

You can handle events using props like:
onClick, onChange, onSubmit

Event handlers are passed functions:
<button onClick={handleClick}>Click</button>`,
    animationScript: `Button is clicked → spark flies to function block
Function block glows → message displays
Input field: text typed in → string animates into a state box`,
    scenario: `🧩 You have a button with broken event handling that runs immediately instead of on click. Your mission is to fix the event handlers.`,
    challenges: [
      {
        id: 'fix-event-handlers',
        title: 'Fix Event Handler Issues',
        description: 'Fix common event handling mistakes',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '8 min',
        xpReward: 40,
        code: {
          initial: `// Broken event handler - fix it
function App() {
  function showMessage() {
    alert('Button clicked!');
  }

  return (
    <div>
      <button onClick={showMessage()}>Click Me</button>
    </div>
  );
}`,
          solution: `// Fixed event handler
function App() {
  function showMessage() {
    alert('Button clicked!');
  }

  return (
    <div>
      <button onClick={showMessage}>Click Me</button>
      {/* Alternative: <button onClick={() => showMessage()}>Click Me</button> */}
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Fix the onClick handler so it doesn\'t run immediately',
          'Ensure the function only runs when button is clicked',
          'Test both ways to pass event handlers'
        ],
        hints: [
          'Remove the parentheses from showMessage()',
          'Pass the function reference, not the function call',
          'Alternative: use arrow function',
          'Test to ensure alert only shows on click'
        ],
        testCriteria: [
          'Alert only shows when button is clicked',
          'No immediate function execution',
          'Event handler is properly attached'
        ]
      },
      {
        id: 'interactive-form-challenge',
        title: 'Build an Interactive Form',
        description: 'Create a form with input handling and submission',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 80,
        instructions: [
          'Create an input field for name',
          'Add a submit button that shows alert: "Hello, [name]!"',
          'Add a clear/reset button',
          'Handle form submission properly'
        ],
        hints: [
          'Use useState to track input value',
          'Use onChange to update state',
          'Use onSubmit or onClick for submission',
          'Consider preventing default form behavior'
        ],
        testCriteria: [
          'Input updates state on change',
          'Submit shows personalized alert',
          'Clear button resets the input',
          'Form handles submission correctly'
        ]
      }
    ],
    learningOutcomes: [
      'Learn how to attach handlers to buttons, inputs, etc.',
      'Understand event objects and e.preventDefault()',
      'Handle real-time interactivity'
    ],
    estimatedTime: '35 min',
    difficulty: 'beginner',
    prerequisites: ['usestate-basics'],
    nextTopics: ['conditional-rendering']
  },
  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    description: 'Learn to render content based on conditions',
    explanation: `React lets you render content based on conditions using:
- if...else statements
- Ternary operator (condition ? A : B)
- Short-circuiting (condition && JSX)

Used for login/logout views, showing/hiding UI, etc.`,
    animationScript: `"UserLoggedIn" state toggles
Component branches to show either:
- Logged-in UI
- Login form
Visual: toggle switch flips and content cross-fades`,
    scenario: `🧩 You have a component that should show different content based on user login status. Your mission is to implement conditional rendering.`,
    challenges: [
      {
        id: 'toggle-visibility',
        title: 'Toggle Content Visibility',
        description: 'Use conditional rendering to show/hide content',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        code: {
          initial: `// Add conditional rendering
import React, { useState } from 'react';

function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle
      </button>
      {/* Add conditional rendering here */}
      <h1>Hello World</h1>
    </div>
  );
}`,
          solution: `// Conditional rendering implemented
import React, { useState } from 'react';

function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {isVisible && <h1>Hello World</h1>}
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Use conditional rendering to show/hide the h1 element',
          'Update button text based on visibility state',
          'Use the && operator for conditional rendering'
        ],
        hints: [
          'Use {isVisible && <h1>Hello World</h1>}',
          'Use ternary operator for button text',
          'Test the toggle functionality',
          'Consider using different conditional patterns'
        ],
        testCriteria: [
          'Content shows/hides based on state',
          'Button text updates appropriately',
          'Toggle functionality works correctly'
        ]
      },
      {
        id: 'login-toggle-challenge',
        title: 'Create a Login Toggle',
        description: 'Build a login/logout system with conditional rendering',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '15 min',
        xpReward: 75,
        instructions: [
          'Button toggles between "Login" / "Logout"',
          'Show either "Welcome, user" or "Please log in"',
          'Bonus: Change background color based on state'
        ],
        hints: [
          'Use useState for login status',
          'Use ternary operators for conditional content',
          'Consider using CSS classes for styling',
          'Test both logged in and logged out states'
        ],
        testCriteria: [
          'Button text changes based on login state',
          'Welcome message shows conditionally',
          'Login state toggles correctly',
          'Bonus: Background color changes'
        ]
      }
    ],
    learningOutcomes: [
      'Understand JSX-based conditionals',
      'Build dynamic UI flows',
      'Learn best practices to avoid cluttered logic'
    ],
    estimatedTime: '35 min',
    difficulty: 'beginner',
    prerequisites: ['event-handling'],
    nextTopics: ['lists-and-keys']
  },
  {
    id: 'lists-and-keys',
    title: 'Rendering Lists & Using Keys',
    description: 'Learn to render dynamic lists with proper keys',
    explanation: `To render multiple elements from an array, use:
array.map(item => <Component key={item.id} />)

The key helps React track items for updates, additions, or removal. It must be unique and stable.`,
    animationScript: `Items in an array → mapped into UI boxes
Show array changes → React uses "key tags" to efficiently update only what changed`,
    scenario: `🧩 You have a list component with missing keys causing React warnings. Your mission is to fix the keys and implement dynamic list rendering.`,
    challenges: [
      {
        id: 'fix-list-keys',
        title: 'Fix Missing Keys Warning',
        description: 'Add proper keys to list items',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '8 min',
        xpReward: 40,
        code: {
          initial: `// Missing keys - fix the warning
function UserList() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  return (
    <ul>
      {users.map(user => <li>{user.name}</li>)}
    </ul>
  );
}`,
          solution: `// Fixed with proper keys
function UserList() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  // Sort alphabetically
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ul>
      {sortedUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Add key prop to each li element',
          'Use user.id as the key value',
          'Sort the list alphabetically',
          'Ensure no React warnings'
        ],
        hints: [
          'Add key={user.id} to the li element',
          'Use array.sort() for alphabetical sorting',
          'Keys should be unique and stable',
          'Check console for warnings'
        ],
        testCriteria: [
          'No "missing key" warnings in console',
          'List items have proper keys',
          'List is sorted alphabetically',
          'All users display correctly'
        ]
      },
      {
        id: 'task-list-challenge',
        title: 'Create a TaskList',
        description: 'Build a task list with completion status',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 80,
        instructions: [
          'Take an array of task objects (id, title, completed)',
          'Render them in a list',
          'Completed tasks appear with ✅',
          'Bonus: Add a "Mark Complete" button'
        ],
        hints: [
          'Use map() to render task items',
          'Use conditional rendering for checkmarks',
          'Add keys using task.id',
          'Consider using buttons for interaction'
        ],
        testCriteria: [
          'All tasks render correctly',
          'Completed tasks show checkmark',
          'Proper keys are used',
          'Bonus: Mark complete functionality works'
        ]
      }
    ],
    learningOutcomes: [
      'Understand .map() rendering pattern',
      'Know the importance of keys for efficient rendering',
      'Learn to dynamically render components from data'
    ],
    estimatedTime: '35 min',
    difficulty: 'beginner',
    prerequisites: ['conditional-rendering'],
    nextTopics: ['forms-controlled-inputs']
  },
  {
    id: 'forms-controlled-inputs',
    title: 'Forms & Controlled Inputs',
    description: 'Learn to handle forms with controlled components',
    explanation: `React uses controlled components, meaning form inputs are linked to state.

Example:
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />

This keeps the input value always in sync with React state.`,
    animationScript: `Input field → characters typed fly into the state box
State updates → text appears in live preview`,
    scenario: `🧩 You have an uncontrolled input that doesn't sync with React state. Your mission is to make it controlled and handle form submission.`,
    challenges: [
      {
        id: 'make-input-controlled',
        title: 'Make Input Controlled',
        description: 'Convert uncontrolled input to controlled component',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '10 min',
        xpReward: 50,
        code: {
          initial: `// Uncontrolled input - make it controlled
import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input type="text" placeholder="Enter your name" />
      <p>Hello, {name}!</p>
    </div>
  );
}`,
          solution: `// Controlled input
import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Hello, {name}!</p>
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Add value prop to the input',
          'Add onChange handler to update state',
          'Use useState to manage the input value',
          'Test that typing updates the greeting'
        ],
        hints: [
          'Set value={name} on the input',
          'Use onChange={(e) => setName(e.target.value)}',
          'The input value should always match state',
          'Test by typing in the input'
        ],
        testCriteria: [
          'Input value is controlled by state',
          'Typing updates the state immediately',
          'Greeting updates as you type',
          'Input and state stay in sync'
        ]
      },
      {
        id: 'feedback-form-challenge',
        title: 'Create a FeedbackForm',
        description: 'Build a complete form with multiple controlled inputs',
        type: 'challenge',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 80,
        instructions: [
          'Create inputs for: name, email, message',
          'Submit button shows the form data in a preview box',
          'Bonus: Disable button until all fields are filled'
        ],
        hints: [
          'Use separate useState for each field',
          'Create handleSubmit function',
          'Use conditional rendering for preview',
          'Check if all fields have values for button state'
        ],
        testCriteria: [
          'All inputs are controlled',
          'Form submission shows data preview',
          'All fields update state correctly',
          'Bonus: Button disabled when fields empty'
        ]
      }
    ],
    learningOutcomes: [
      'Understand controlled vs uncontrolled inputs',
      'Link input fields to state',
      'Handle form submission and validation'
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['lists-and-keys'],
    nextTopics: ['useeffect-basics']
  },
  {
    id: 'useeffect-basics',
    title: 'useEffect – Side Effects & Lifecycle',
    description: 'Learn to handle side effects and component lifecycle',
    explanation: `useEffect() lets you perform side effects (like API calls, subscriptions, timers) in React components.

It's a lifecycle hook replacing componentDidMount, componentDidUpdate, and componentWillUnmount.

Syntax:
useEffect(() => {
  // effect
  return () => {
    // cleanup
  }
}, [dependencies]);`,
    animationScript: `Timeline:
Mount (📥 API fetch) → Update (📊 DOM change) → Unmount (🧹 cleanup)
Hook icon wraps component with behavior
State change triggers re-run of effect`,
    scenario: `🧩 You have a component that fetches data but causes infinite re-renders. Your mission is to fix the useEffect dependencies and add proper cleanup.`,
    challenges: [
      {
        id: 'fix-useeffect-dependencies',
        title: 'Fix useEffect Dependencies',
        description: 'Fix infinite re-render issue with useEffect',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '12 min',
        xpReward: 60,
        code: {
          initial: `// Infinite re-render issue - fix it
import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulated API call
    setTimeout(() => {
      setUser({ name: 'John Doe', email: 'john@example.com' });
    }, 1000);
  }); // Missing dependency array!

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}`,
          solution: `// Fixed with proper dependencies
import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulated API call
    const timer = setTimeout(() => {
      setUser({ name: 'John Doe', email: 'john@example.com' });
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - run only on mount

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Add empty dependency array [] to useEffect',
          'Add cleanup function to clear the timer',
          'Ensure effect only runs on component mount',
          'Test that loading works correctly'
        ],
        hints: [
          'Add [] as second parameter to useEffect',
          'Return cleanup function from useEffect',
          'Use clearTimeout in cleanup',
          'Check that component doesn\'t re-render infinitely'
        ],
        testCriteria: [
          'No infinite re-renders',
          'Effect runs only on mount',
          'Timer is cleaned up properly',
          'Loading state works correctly'
        ]
      },
      {
        id: 'user-loader-challenge',
        title: 'Create a UserLoader',
        description: 'Build a component that fetches and displays user data',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 100,
        instructions: [
          'On mount, fetch users from a simulated API',
          'Show loading and error states',
          'Cancel fetch on unmount',
          'Display users in a list'
        ],
        hints: [
          'Use useState for users, loading, and error states',
          'Use useEffect with empty dependency array',
          'Simulate API with setTimeout and Promise',
          'Add cleanup to cancel ongoing requests'
        ],
        testCriteria: [
          'Shows loading state initially',
          'Fetches and displays user data',
          'Handles error states appropriately',
          'Cleans up on unmount'
        ]
      }
    ],
    learningOutcomes: [
      'Use useEffect for data fetching, subscriptions, timers',
      'Manage cleanup to prevent memory leaks',
      'Control execution with dependencies'
    ],
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    prerequisites: ['forms-controlled-inputs'],
    nextTopics: ['useref-basics']
  },
  {
    id: 'useref-basics',
    title: 'useRef – Direct DOM Access',
    description: 'Learn to access DOM elements and persist values with useRef',
    explanation: `useRef creates a mutable reference that persists across re-renders without causing re-renders when changed.

Common uses:
- Accessing DOM elements directly
- Storing mutable values that don't trigger re-renders
- Keeping references to timers or intervals`,
    animationScript: `Show component re-rendering → useRef value stays constant
DOM element highlighted → ref.current points to it
Timer example → ref stores timer ID across renders`,
    scenario: `🧩 You need to focus an input field when a button is clicked, but useState causes unnecessary re-renders. Your mission is to use useRef for direct DOM access.`,
    challenges: [
      {
        id: 'focus-input-ref',
        title: 'Focus Input with useRef',
        description: 'Use useRef to focus an input field on button click',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '10 min',
        xpReward: 60,
        code: {
          initial: `// Add useRef to focus the input
import React from 'react';

function FocusInput() {
  const handleFocus = () => {
    // Focus the input here
  };

  return (
    <div>
      <input type="text" placeholder="Click button to focus me" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}`,
          solution: `// useRef for DOM access
import React, { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Click button to focus me"
      />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Import useRef from React',
          'Create a ref using useRef(null)',
          'Attach the ref to the input element',
          'Use ref.current.focus() in the button handler'
        ],
        hints: [
          'useRef returns an object with a current property',
          'Attach ref using the ref prop',
          'Access DOM methods via ref.current',
          'No need to add ref to dependency arrays'
        ],
        testCriteria: [
          'Input gets focused when button is clicked',
          'No unnecessary re-renders occur',
          'useRef is used correctly',
          'DOM element is accessed directly'
        ]
      },
      {
        id: 'timer-ref-challenge',
        title: 'Timer with useRef',
        description: 'Create a timer that can be started, stopped, and reset using useRef',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 90,
        instructions: [
          'Create a timer that counts seconds',
          'Add start, stop, and reset buttons',
          'Use useRef to store the interval ID',
          'Prevent memory leaks by clearing intervals'
        ],
        hints: [
          'Use setInterval for the timer',
          'Store interval ID in useRef',
          'Clear interval in stop function',
          'Use useEffect for cleanup on unmount'
        ],
        testCriteria: [
          'Timer counts seconds correctly',
          'Start/stop buttons work properly',
          'Reset button resets to 0',
          'No memory leaks from intervals'
        ]
      }
    ],
    learningOutcomes: [
      'Access DOM elements directly without re-renders',
      'Store mutable values that persist across renders',
      'Understand when to use useRef vs useState'
    ],
    estimatedTime: '40 min',
    difficulty: 'intermediate',
    prerequisites: ['useeffect-basics'],
    nextTopics: ['component-lifecycle']
  },
  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle with Hooks',
    description: 'Understand component lifecycle using useEffect patterns',
    explanation: `React functional components use useEffect to handle lifecycle events:

- Mount: useEffect(() => {}, [])
- Update: useEffect(() => {})
- Unmount: useEffect(() => { return () => {} }, [])
- Specific updates: useEffect(() => {}, [dependency])`,
    animationScript: `Component timeline: Mount → Update → Update → Unmount
Each phase shows corresponding useEffect patterns
Cleanup functions highlighted during unmount`,
    scenario: `🧩 You have a component that fetches data, subscribes to events, and needs cleanup. Your mission is to implement proper lifecycle management.`,
    challenges: [
      {
        id: 'lifecycle-data-fetcher',
        title: 'Data Fetcher with Lifecycle',
        description: 'Create a component that properly handles data fetching lifecycle',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '15 min',
        xpReward: 80,
        code: {
          initial: `// Add proper lifecycle management
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add lifecycle effects here

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}`,
          solution: `// Complete lifecycle management
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mount and userId change effect
    let cancelled = false;

    const fetchUser = async () => {
      setLoading(true);
      try {
        // Simulated API call
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();

        if (!cancelled) {
          setUser(userData);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch user:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (userId) {
      fetchUser();
    }

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [userId]); // Re-run when userId changes

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Add useEffect to fetch user data when userId changes',
          'Implement loading state management',
          'Add cleanup to prevent state updates on unmounted components',
          'Handle the case when userId is null/undefined'
        ],
        hints: [
          'Use userId in the dependency array',
          'Set loading to true before fetching',
          'Use a cancelled flag for cleanup',
          'Handle both success and error cases'
        ],
        testCriteria: [
          'Fetches data when userId changes',
          'Shows loading state during fetch',
          'Prevents state updates after unmount',
          'Handles error cases gracefully'
        ]
      }
    ],
    learningOutcomes: [
      'Understand component lifecycle phases',
      'Implement proper cleanup to prevent memory leaks',
      'Handle data fetching with lifecycle awareness'
    ],
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    prerequisites: ['useref-basics'],
    nextTopics: ['custom-hooks']
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks – Reusable Logic',
    description: 'Learn to create custom hooks for reusable stateful logic',
    explanation: `Custom hooks are JavaScript functions that:
- Start with "use" (naming convention)
- Can call other hooks
- Allow sharing stateful logic between components
- Return values that components can use

Example: useCounter, useFetch, useLocalStorage`,
    animationScript: `Show duplicate logic in multiple components → extract into custom hook → components become cleaner
Hook icon moves between components sharing the same logic`,
    scenario: `🧩 You have multiple components with similar counter logic. Your mission is to extract this into a reusable custom hook.`,
    challenges: [
      {
        id: 'create-use-counter',
        title: 'Create useCounter Hook',
        description: 'Extract counter logic into a reusable custom hook',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '15 min',
        xpReward: 80,
        code: {
          initial: `// Extract counter logic into custom hook
import React, { useState } from 'react';

// Create useCounter custom hook here

function Counter1() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Counter 1: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function Counter2() {
  const [count, setCount] = useState(10);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(10);

  return (
    <div>
      <h2>Counter 2: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
          solution: `// Custom hook implementation
import React, { useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

function Counter1() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <h2>Counter 1: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function Counter2() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <h2>Counter 2: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Create a useCounter function that accepts initialValue',
          'Return an object with count, increment, decrement, and reset',
          'Use the custom hook in both Counter components',
          'Ensure each counter maintains its own state'
        ],
        hints: [
          'Custom hooks are just functions that use other hooks',
          'Use functional updates for state setters',
          'Return an object for easier destructuring',
          'Each component gets its own hook instance'
        ],
        testCriteria: [
          'useCounter hook is properly implemented',
          'Both counters work independently',
          'Code duplication is eliminated',
          'Hook follows naming convention'
        ]
      },
      {
        id: 'use-fetch-hook',
        title: 'Create useFetch Hook',
        description: 'Build a custom hook for data fetching with loading and error states',
        type: 'challenge',
        difficulty: 'intermediate',
        estimatedTime: '25 min',
        xpReward: 100,
        instructions: [
          'Create useFetch hook that takes a URL',
          'Return data, loading, and error states',
          'Handle fetch lifecycle and cleanup',
          'Use the hook in a component to display user data'
        ],
        hints: [
          'Use useState for data, loading, and error',
          'Use useEffect for the fetch operation',
          'Handle cleanup with AbortController',
          'Consider dependency array for URL changes'
        ],
        testCriteria: [
          'useFetch hook handles all fetch states',
          'Loading state shows during fetch',
          'Error state handles fetch failures',
          'Data displays when fetch succeeds'
        ]
      }
    ],
    learningOutcomes: [
      'Create reusable custom hooks',
      'Share stateful logic between components',
      'Follow React hooks conventions and best practices'
    ],
    estimatedTime: '50 min',
    difficulty: 'intermediate',
    prerequisites: ['component-lifecycle'],
    nextTopics: ['context-api']
  },
  {
    id: 'context-api',
    title: 'Context API – Global State',
    description: 'Learn to manage global state with React Context',
    explanation: `React Context provides a way to share data between components without prop drilling.

Steps:
1. Create context: createContext()
2. Provide context: <Context.Provider value={data}>
3. Consume context: useContext(Context)

Use for: themes, user auth, language settings`,
    animationScript: `Show prop drilling → components passing props down multiple levels
Context wraps app → data flows directly to any component that needs it`,
    scenario: `🧩 You have a theme that needs to be shared across many components. Your mission is to use Context API to avoid prop drilling.`,
    challenges: [
      {
        id: 'theme-context',
        title: 'Create Theme Context',
        description: 'Implement a theme system using Context API',
        type: 'playground',
        difficulty: 'intermediate',
        estimatedTime: '20 min',
        xpReward: 90,
        code: {
          initial: `// Create theme context system
import React, { createContext, useContext, useState } from 'react';

// Create ThemeContext here

function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header style={{ padding: '1rem' }}>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}

function Main() {
  return (
    <main style={{ padding: '2rem' }}>
      <p>This is the main content area.</p>
    </main>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '1rem' }}>
      <p>© 2024 My App</p>
    </footer>
  );
}

function ThemeToggle() {
  return (
    <button>Toggle Theme</button>
  );
}`,
          solution: `// Complete theme context implementation
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const themeStyles = {
    light: {
      backgroundColor: '#ffffff',
      color: '#000000'
    },
    dark: {
      backgroundColor: '#333333',
      color: '#ffffff'
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      styles: themeStyles[theme]
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

function App() {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function Header() {
  const { styles } = useTheme();

  return (
    <header style={{ ...styles, padding: '1rem' }}>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}

function Main() {
  const { styles } = useTheme();

  return (
    <main style={{ ...styles, padding: '2rem' }}>
      <p>This is the main content area.</p>
    </main>
  );
}

function Footer() {
  const { styles } = useTheme();

  return (
    <footer style={{ ...styles, padding: '1rem' }}>
      <p>© 2024 My App</p>
    </footer>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Create ThemeContext using createContext',
          'Create ThemeProvider component with theme state',
          'Create useTheme custom hook for consuming context',
          'Apply theme styles to all components'
        ],
        hints: [
          'Provider should wrap the entire app',
          'Use useContext to consume the context',
          'Create a custom hook for better error handling',
          'Include both theme state and toggle function'
        ],
        testCriteria: [
          'Theme context is properly created',
          'All components receive theme data',
          'Theme toggle works across all components',
          'No prop drilling is used'
        ]
      }
    ],
    learningOutcomes: [
      'Understand when and how to use Context API',
      'Avoid prop drilling for global state',
      'Create provider components and custom context hooks'
    ],
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    prerequisites: ['custom-hooks'],
    nextTopics: ['performance-optimization']
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Learn React performance optimization techniques',
    explanation: `React performance optimization techniques:

1. React.memo() - Prevent unnecessary re-renders
2. useMemo() - Memoize expensive calculations
3. useCallback() - Memoize function references
4. Code splitting with React.lazy()
5. Profiler for performance monitoring`,
    animationScript: `Show slow component → apply React.memo → re-renders reduced
Expensive calculation → useMemo → calculation cached
Function recreation → useCallback → function reference stable`,
    scenario: `🧩 You have a slow app with unnecessary re-renders and expensive calculations. Your mission is to optimize it using React performance tools.`,
    challenges: [
      {
        id: 'memo-optimization',
        title: 'Optimize with React.memo',
        description: 'Use React.memo to prevent unnecessary re-renders',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '15 min',
        xpReward: 100,
        code: {
          initial: `// Optimize this slow component
import React, { useState } from 'react';

function ExpensiveChild({ name, count }) {
  console.log('ExpensiveChild rendered for:', name);

  // Simulate expensive operation
  const expensiveValue = Array.from({ length: 1000000 }, (_, i) => i).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h3>{name}</h3>
      <p>Count: {count}</p>
      <p>Expensive calculation: {expensiveValue}</p>
    </div>
  );
}

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <div>
      <button onClick={() => setCount1(count1 + 1)}>
        Increment Count 1: {count1}
      </button>
      <button onClick={() => setCount2(count2 + 1)}>
        Increment Count 2: {count2}
      </button>

      <ExpensiveChild name="Child 1" count={count1} />
      <ExpensiveChild name="Child 2" count={count2} />
    </div>
  );
}`,
          solution: `// Optimized with React.memo and useMemo
import React, { useState, memo, useMemo } from 'react';

const ExpensiveChild = memo(function ExpensiveChild({ name, count }) {
  console.log('ExpensiveChild rendered for:', name);

  // Memoize expensive calculation
  const expensiveValue = useMemo(() => {
    console.log('Calculating expensive value for:', name);
    return Array.from({ length: 1000000 }, (_, i) => i).reduce((a, b) => a + b, 0);
  }, []); // Empty dependency array since calculation doesn't depend on props

  return (
    <div>
      <h3>{name}</h3>
      <p>Count: {count}</p>
      <p>Expensive calculation: {expensiveValue}</p>
    </div>
  );
});

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <div>
      <button onClick={() => setCount1(count1 + 1)}>
        Increment Count 1: {count1}
      </button>
      <button onClick={() => setCount2(count2 + 1)}>
        Increment Count 2: {count2}
      </button>

      <ExpensiveChild name="Child 1" count={count1} />
      <ExpensiveChild name="Child 2" count={count2} />
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Wrap ExpensiveChild with React.memo',
          'Use useMemo for the expensive calculation',
          'Test that only the relevant child re-renders',
          'Check console logs to verify optimization'
        ],
        hints: [
          'React.memo prevents re-renders when props haven\'t changed',
          'useMemo caches expensive calculations',
          'Check the dependency array for useMemo',
          'Use React DevTools Profiler to measure performance'
        ],
        testCriteria: [
          'Only the relevant child re-renders when count changes',
          'Expensive calculation is memoized',
          'Console logs show reduced renders',
          'App performance is improved'
        ]
      },
      {
        id: 'callback-optimization',
        title: 'Optimize with useCallback',
        description: 'Use useCallback to prevent function recreation',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        xpReward: 120,
        instructions: [
          'Create a TodoList with add, remove, and toggle functions',
          'Use useCallback to memoize event handlers',
          'Use React.memo for TodoItem components',
          'Verify that only affected items re-render'
        ],
        hints: [
          'useCallback memoizes function references',
          'Include dependencies in useCallback array',
          'Combine with React.memo for maximum benefit',
          'Use functional state updates when possible'
        ],
        testCriteria: [
          'Event handlers are memoized with useCallback',
          'TodoItem components use React.memo',
          'Only affected items re-render on changes',
          'Performance is measurably improved'
        ]
      }
    ],
    learningOutcomes: [
      'Identify and fix performance bottlenecks',
      'Use React.memo, useMemo, and useCallback effectively',
      'Measure performance improvements with React DevTools'
    ],
    estimatedTime: '60 min',
    difficulty: 'advanced',
    prerequisites: ['context-api'],
    nextTopics: ['testing-react']
  },
  {
    id: 'testing-react',
    title: 'Testing React Components',
    description: 'Learn to test React components with Jest and React Testing Library',
    explanation: `React testing focuses on testing behavior, not implementation:

1. Render components in tests
2. Find elements by accessible queries
3. Interact with elements (click, type, etc.)
4. Assert expected behavior

Tools: Jest, React Testing Library, user-event`,
    animationScript: `Component renders in test → user interactions simulated → assertions verify behavior
Show test passing/failing with green/red indicators`,
    scenario: `🧩 You have components without tests that need to be reliable. Your mission is to write comprehensive tests for component behavior.`,
    challenges: [
      {
        id: 'test-counter-component',
        title: 'Test Counter Component',
        description: 'Write comprehensive tests for a counter component',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        xpReward: 120,
        code: {
          initial: `// Write tests for this Counter component
import React, { useState } from 'react';

function Counter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <h2 data-testid="count-display">Count: {count}</h2>
      <button
        data-testid="increment-btn"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <button
        data-testid="decrement-btn"
        onClick={() => setCount(count - 1)}
      >
        Decrement
      </button>
      <button
        data-testid="reset-btn"
        onClick={() => setCount(initialValue)}
      >
        Reset
      </button>
    </div>
  );
}

// Write tests here
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Counter Component', () => {
  // Add your tests here
});`,
          solution: `// Complete test suite for Counter component
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Counter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <h2 data-testid="count-display">Count: {count}</h2>
      <button
        data-testid="increment-btn"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
      <button
        data-testid="decrement-btn"
        onClick={() => setCount(count - 1)}
      >
        Decrement
      </button>
      <button
        data-testid="reset-btn"
        onClick={() => setCount(initialValue)}
      >
        Reset
      </button>
    </div>
  );
}

describe('Counter Component', () => {
  test('renders with initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 5');
  });

  test('increments count when increment button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementBtn = screen.getByTestId('increment-btn');
    await user.click(incrementBtn);

    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1');
  });

  test('decrements count when decrement button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={5} />);

    const decrementBtn = screen.getByTestId('decrement-btn');
    await user.click(decrementBtn);

    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 4');
  });

  test('resets count to initial value when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={10} />);

    // Change the count first
    await user.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 11');

    // Then reset
    await user.click(screen.getByTestId('reset-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 10');
  });

  test('handles multiple interactions correctly', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    // Multiple increments
    await user.click(screen.getByTestId('increment-btn'));
    await user.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 2');

    // Decrement
    await user.click(screen.getByTestId('decrement-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1');

    // Reset
    await user.click(screen.getByTestId('reset-btn'));
    expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
  });
});`,
          language: 'javascript'
        },
        instructions: [
          'Test initial rendering with different initial values',
          'Test increment button functionality',
          'Test decrement button functionality',
          'Test reset button functionality',
          'Test multiple interactions in sequence'
        ],
        hints: [
          'Use data-testid for reliable element selection',
          'Use userEvent for realistic user interactions',
          'Test behavior, not implementation details',
          'Group related tests in describe blocks'
        ],
        testCriteria: [
          'All tests pass and cover main functionality',
          'Tests use appropriate queries and assertions',
          'User interactions are properly simulated',
          'Edge cases are considered'
        ]
      }
    ],
    learningOutcomes: [
      'Write effective tests for React components',
      'Use React Testing Library best practices',
      'Test user interactions and component behavior'
    ],
    estimatedTime: '50 min',
    difficulty: 'advanced',
    prerequisites: ['performance-optimization'],
    nextTopics: ['react-router']
  },
  {
    id: 'react-router',
    title: 'React Router – Navigation & Routing',
    description: 'Learn client-side routing with React Router',
    explanation: `React Router enables navigation between different views in a single-page application:

Key concepts:
- BrowserRouter: Enables routing
- Routes & Route: Define route mappings
- Link & NavLink: Navigation components
- useNavigate: Programmatic navigation
- useParams: Access URL parameters`,
    animationScript: `URL changes → Router matches route → Component renders
Show navigation between different pages without page refresh`,
    scenario: `🧩 You need to create a multi-page application with navigation. Your mission is to implement routing with React Router.`,
    challenges: [
      {
        id: 'basic-routing',
        title: 'Implement Basic Routing',
        description: 'Create a multi-page app with React Router',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        xpReward: 100,
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
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  return <h1>Contact Page</h1>;
}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}`,
          solution: `// Complete routing implementation
import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              marginRight: '1rem',
              color: isActive ? 'blue' : 'black',
              textDecoration: 'none'
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => ({
              marginRight: '1rem',
              color: isActive ? 'blue' : 'black',
              textDecoration: 'none'
            })}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              color: isActive ? 'blue' : 'black',
              textDecoration: 'none'
            })}
          >
            Contact
          </NavLink>
        </nav>

        <main style={{ padding: '2rem' }}>
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
      <p>Welcome to our website!</p>
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
      <Link to="/">Go back to Home</Link>
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Wrap the app with BrowserRouter',
          'Create navigation with NavLink components',
          'Set up Routes and Route components',
          'Add a catch-all route for 404 pages',
          'Style active navigation links'
        ],
        hints: [
          'BrowserRouter should wrap the entire app',
          'Use NavLink for navigation with active states',
          'Routes component contains all Route definitions',
          'Use path="*" for catch-all routes'
        ],
        testCriteria: [
          'Navigation works between all pages',
          'Active navigation links are highlighted',
          '404 page shows for invalid routes',
          'URL updates correctly on navigation'
        ]
      },
      {
        id: 'dynamic-routing',
        title: 'Dynamic Routes with Parameters',
        description: 'Implement dynamic routes with URL parameters',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '25 min',
        xpReward: 120,
        instructions: [
          'Create a user profile route: /users/:id',
          'Use useParams to access the user ID',
          'Implement programmatic navigation with useNavigate',
          'Add nested routes for user details'
        ],
        hints: [
          'Use :id syntax for dynamic route parameters',
          'useParams hook returns an object with parameters',
          'useNavigate returns a function for navigation',
          'Nested routes can be defined within parent routes'
        ],
        testCriteria: [
          'Dynamic routes work with different user IDs',
          'useParams correctly extracts URL parameters',
          'Programmatic navigation functions properly',
          'Nested routes render correctly'
        ]
      }
    ],
    learningOutcomes: [
      'Implement client-side routing in React applications',
      'Handle dynamic routes and URL parameters',
      'Create navigation with active states and programmatic routing'
    ],
    estimatedTime: '60 min',
    difficulty: 'advanced',
    prerequisites: ['testing-react'],
    nextTopics: ['state-management']
  },
  {
    id: 'state-management',
    title: 'Advanced State Management',
    description: 'Learn advanced state management patterns and libraries',
    explanation: `Advanced state management solutions for complex applications:

1. useReducer for complex state logic
2. Zustand for simple global state
3. Redux Toolkit for enterprise applications
4. State management patterns and best practices`,
    animationScript: `Show complex state updates → useReducer manages state transitions
Multiple components → global state store → synchronized updates`,
    scenario: `🧩 You have a complex application with intricate state logic. Your mission is to implement proper state management using useReducer and global state solutions.`,
    challenges: [
      {
        id: 'use-reducer-todo',
        title: 'Todo App with useReducer',
        description: 'Build a todo application using useReducer for state management',
        type: 'playground',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 140,
        code: {
          initial: `// Implement todo app with useReducer
import React, { useReducer, useState } from 'react';

// Define initial state and reducer here

function TodoApp() {
  // Use useReducer here
  const [inputValue, setInputValue] = useState('');

  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
        />
        <button>Add Todo</button>
      </div>

      <div>
        {/* Render todos here */}
      </div>
    </div>
  );
}`,
          solution: `// Complete useReducer todo implementation
import React, { useReducer, useState } from 'react';

const initialState = {
  todos: [],
  filter: 'all' // all, active, completed
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
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

  const addTodo = () => {
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue.trim() });
      setInputValue('');
    }
  };

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <div>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
          style={{ fontWeight: state.filter === 'all' ? 'bold' : 'normal' }}
        >
          All
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
          style={{ fontWeight: state.filter === 'active' ? 'bold' : 'normal' }}
        >
          Active
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
          style={{ fontWeight: state.filter === 'completed' ? 'bold' : 'normal' }}
        >
          Completed
        </button>
        <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>
          Clear Completed
        </button>
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              marginLeft: '8px',
              marginRight: '8px'
            }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p>
        {state.todos.filter(t => !t.completed).length} items left
      </p>
    </div>
  );
}`,
          language: 'javascript'
        },
        instructions: [
          'Define initial state with todos array and filter',
          'Create todoReducer with actions for add, toggle, delete, filter',
          'Use useReducer to manage complex state',
          'Implement filtering and clearing completed todos'
        ],
        hints: [
          'useReducer is better for complex state logic',
          'Actions should have type and payload properties',
          'Use spread operator for immutable updates',
          'Filter todos based on current filter state'
        ],
        testCriteria: [
          'All CRUD operations work correctly',
          'Filtering shows appropriate todos',
          'State updates are immutable',
          'Complex state logic is well organized'
        ]
      }
    ],
    learningOutcomes: [
      'Use useReducer for complex state management',
      'Understand when to choose different state management solutions',
      'Implement scalable state architecture patterns'
    ],
    estimatedTime: '70 min',
    difficulty: 'advanced',
    prerequisites: ['react-router'],
    nextTopics: ['deployment']
  },
  {
    id: 'deployment',
    title: 'Deployment & Production',
    description: 'Learn to deploy React applications to production',
    explanation: `Deploying React applications involves:

1. Build optimization (npm run build)
2. Static hosting (Netlify, Vercel, GitHub Pages)
3. Environment variables and configuration
4. Performance optimization for production
5. CI/CD pipelines for automated deployment`,
    animationScript: `Development code → build process → optimized bundle → deployment platform → live website
Show build artifacts and deployment pipeline`,
    scenario: `🧩 You have a completed React application that needs to go live. Your mission is to deploy it to production with proper optimization.`,
    challenges: [
      {
        id: 'production-build',
        title: 'Prepare for Production',
        description: 'Optimize and prepare a React app for production deployment',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '30 min',
        xpReward: 150,
        instructions: [
          'Create a production build of your React app',
          'Analyze bundle size and optimize if needed',
          'Set up environment variables for different environments',
          'Configure deployment settings for a hosting platform',
          'Test the production build locally'
        ],
        hints: [
          'Use npm run build to create production build',
          'Check build folder for optimized files',
          'Use .env files for environment variables',
          'Test production build with serve package'
        ],
        testCriteria: [
          'Production build creates optimized bundle',
          'Environment variables work correctly',
          'App runs properly in production mode',
          'Bundle size is optimized'
        ]
      },
      {
        id: 'deploy-to-vercel',
        title: 'Deploy to Vercel',
        description: 'Deploy your React application to Vercel',
        type: 'challenge',
        difficulty: 'advanced',
        estimatedTime: '20 min',
        xpReward: 120,
        instructions: [
          'Connect your GitHub repository to Vercel',
          'Configure build settings and environment variables',
          'Deploy the application',
          'Set up custom domain (optional)',
          'Configure automatic deployments on git push'
        ],
        hints: [
          'Vercel automatically detects React projects',
          'Environment variables can be set in Vercel dashboard',
          'Preview deployments are created for pull requests',
          'Custom domains can be added in project settings'
        ],
        testCriteria: [
          'Application is successfully deployed',
          'Environment variables work in production',
          'Automatic deployments trigger on code changes',
          'Application is accessible via public URL'
        ]
      }
    ],
    learningOutcomes: [
      'Deploy React applications to production',
      'Optimize applications for production performance',
      'Set up CI/CD pipelines for automated deployment',
      'Configure environment variables and production settings'
    ],
    estimatedTime: '60 min',
    difficulty: 'advanced',
    prerequisites: ['state-management'],
    nextTopics: []
  }
];
