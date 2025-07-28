export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'playground' | 'challenge' | 'mini-project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  code?: {
    initial: string;
    solution: string;
    language: string;
  };
  instructions: string[];
  hints: string[];
  testCriteria: string[];
}

export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  explanation: string;
  animationScript?: string;
  scenario?: string;
  challenges: LearningChallenge[];
  learningOutcomes: string[];
  prerequisites?: string[];
  nextTopics?: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalTopics: number;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: LearningTopic[];
  prerequisites: string[];
  learningOutcomes: string[];
}

// React Learning Path Data
export const reactLearningPath: LearningPath = {
  id: 'react-fundamentals',
  title: 'React Fundamentals to Advanced',
  description: 'Master React from basics to advanced concepts through hands-on scenarios and real-world challenges',
  totalTopics: 43,
  estimatedHours: 120,
  difficulty: 'beginner',
  prerequisites: [
    'Basic JavaScript (ES6+)',
    'HTML & CSS fundamentals',
    'Understanding of DOM manipulation'
  ],
  learningOutcomes: [
    'Build complete React applications from scratch',
    'Master component architecture and state management',
    'Implement advanced patterns and performance optimizations',
    'Deploy production-ready React applications',
    'Debug and test React applications effectively'
  ],
  topics: [
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
}

// Usage should be:
// <ProfileCard name="John" age={25} location="New York" />`,
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

// Usage:
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
      title: 'useState – Managing State',
      description: 'Learn to manage component state with the useState hook',
      explanation: `useState is React's most fundamental hook for managing state in functional components. It returns an array with two elements:
1. The current state value
2. A function to update the state

When state changes, React re-renders the component with the new state.`,
      animationScript: `Visual: Component box with state variable inside
Click button → setState function called → state updates → component re-renders
Show before/after state values
Highlight: "State change triggers re-render"`,
      scenario: `🧩 You have a static counter that always shows 0. Your mission is to make it interactive using useState so users can increment and decrement the count.`,
      challenges: [
        {
          id: 'interactive-counter',
          title: 'Build an Interactive Counter',
          description: 'Create a counter that users can increment and decrement',
          type: 'playground',
          difficulty: 'beginner',
          estimatedTime: '12 min',
          xpReward: 60,
          code: {
            initial: `// Static counter - make it interactive
function Counter() {
  const count = 0; // This should be state

  return (
    <div>
      <h2>Count: {count}</h2>
      <button>+</button>
      <button>-</button>
    </div>
  );
}`,
            solution: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export default Counter;`,
            language: 'javascript'
          },
          instructions: [
            'Import useState from React',
            'Replace the static count with useState',
            'Create increment and decrement functions',
            'Add onClick handlers to the buttons'
          ],
          hints: [
            'useState returns [value, setter]',
            'Use array destructuring to get count and setCount',
            'Call setCount with the new value',
            'Remember to import useState from React'
          ],
          testCriteria: [
            'Counter displays current count',
            'Plus button increments the count',
            'Minus button decrements the count',
            'Component re-renders when state changes'
          ]
        },
        {
          id: 'todo-list-basic',
          title: 'Simple Todo List',
          description: 'Build a todo list with add and remove functionality',
          type: 'challenge',
          difficulty: 'beginner',
          estimatedTime: '20 min',
          xpReward: 85,
          instructions: [
            'Create a state for storing todo items (array)',
            'Add an input field for new todos',
            'Add a button to add new todos to the list',
            'Display all todos with a delete button for each',
            'Implement delete functionality'
          ],
          hints: [
            'Use useState with an empty array initially',
            'Use the spread operator to add new items',
            'Use filter() to remove items by index or id',
            'Consider using a unique id for each todo item'
          ],
          testCriteria: [
            'Can add new todos to the list',
            'All todos are displayed',
            'Can delete individual todos',
            'Input clears after adding a todo'
          ]
        }
      ],
      learningOutcomes: [
        'Understand how useState works',
        'Learn state updates and re-rendering',
        'Practice building interactive components'
      ],
      estimatedTime: '50 min',
      difficulty: 'beginner',
      prerequisites: ['props-basics'],
      nextTopics: ['event-handling']
    },
    {
      id: 'event-handling',
      title: 'Event Handling in React',
      description: 'Learn to handle user interactions and events',
      explanation: `React uses SyntheticEvents, which wrap native DOM events to provide consistent behavior across browsers. Event handlers are passed as props and typically named with "on" prefix.

Common events: onClick, onChange, onSubmit, onFocus, onBlur, etc.`,
      animationScript: `User clicks button → onClick event fires → event handler function runs → state updates → UI re-renders
Show event object properties: event.target, event.preventDefault()`,
      scenario: `🧩 You have a form that doesn't respond to user input. Your task is to add proper event handling to make it interactive and functional.`,
      challenges: [
        {
          id: 'form-handling',
          title: 'Interactive Form Handling',
          description: 'Create a form that handles user input and submission',
          type: 'playground',
          difficulty: 'beginner',
          estimatedTime: '15 min',
          xpReward: 70,
          code: {
            initial: `// Non-interactive form - add event handling
function ContactForm() {
  return (
    <form>
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      <textarea placeholder="Message"></textarea>
      <button type="submit">Send</button>
    </form>
  );
}`,
            solution: `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default ContactForm;`,
            language: 'javascript'
          },
          instructions: [
            'Add state to track form data',
            'Create a handleChange function for input changes',
            'Create a handleSubmit function for form submission',
            'Add event handlers to form elements',
            'Prevent default form submission behavior'
          ],
          hints: [
            'Use a single state object for all form fields',
            'Use computed property names in setState',
            'Remember to call e.preventDefault() in onSubmit',
            'Use the name attribute to identify form fields'
          ],
          testCriteria: [
            'Form inputs update state on change',
            'Form submission prevents page reload',
            'Form data is logged on submission',
            'Form resets after submission'
          ]
        }
      ],
      learningOutcomes: [
        'Handle user interactions with event handlers',
        'Understand SyntheticEvents in React',
        'Build interactive forms and controls'
      ],
      estimatedTime: '40 min',
      difficulty: 'beginner',
      prerequisites: ['usestate-basics'],
      nextTopics: ['conditional-rendering']
    }
  ]
};

// Angular Learning Path Data
export const angularLearningPath: LearningPath = {
  id: 'angular-fundamentals',
  title: 'Angular Fundamentals to Advanced',
  description: 'Master Angular from basics to advanced concepts through hands-on scenarios and real-world applications',
  totalTopics: 25,
  estimatedHours: 80,
  difficulty: 'beginner',
  prerequisites: [
    'TypeScript fundamentals',
    'HTML & CSS fundamentals',
    'Basic JavaScript knowledge',
    'Understanding of MVC architecture'
  ],
  learningOutcomes: [
    'Build complete Angular applications from scratch',
    'Master component architecture and dependency injection',
    'Implement routing, forms, and HTTP services',
    'Use Angular CLI effectively for development',
    'Deploy production-ready Angular applications'
  ],
  topics: [
    {
      id: 'what-is-angular',
      title: 'What is Angular? Why Angular?',
      description: 'Understanding Angular as a full-featured framework and its advantages',
      explanation: `Angular is a TypeScript-based, open-source front-end framework developed by Google for building scalable web applications. Unlike React (library), Angular is a full-fledged framework with its own opinionated architecture.

Why Angular?
- Full-featured: Routing, HTTP, Forms, CLI, Testing — all built-in
- TypeScript support by default
- Strong tooling (CLI, RxJS, AOT compilation)
- Backed by Google (used in Gmail, Google Cloud Console)`,
      animationScript: `Show MVC flow → Replace with Angular Component Architecture → Real-time app reactivity`,
      scenario: `Try Angular online using StackBlitz and create your first component to see live updates with Angular LiveReload`,
      challenges: [
        {
          id: 'angular-vs-react',
          title: 'Angular vs React Comparison',
          description: 'Understand the key differences between Angular and React',
          type: 'challenge',
          difficulty: 'beginner',
          estimatedTime: '15 min',
          xpReward: 50,
          instructions: [
            'Explain the differences between Angular and React in your own words',
            'List 3 advantages of Angular over React',
            'List 3 advantages of React over Angular',
            'Decide which framework to choose for a large enterprise application and justify your choice'
          ],
          hints: [
            'Consider Angular as a framework vs React as a library',
            'Think about TypeScript support and tooling',
            'Consider learning curve and community support',
            'Think about project requirements and team expertise'
          ],
          testCriteria: [
            'Clearly explains framework vs library concept',
            'Identifies key strengths of each technology',
            'Provides justified recommendation based on use case'
          ]
        }
      ],
      learningOutcomes: [
        'Understand Angular\'s full framework nature',
        'Compare Angular to React and Vue confidently',
        'Make informed decisions about framework choice'
      ],
      estimatedTime: '30 min',
      difficulty: 'beginner'
    },
    {
      id: 'angular-cli-setup',
      title: 'Setting Up Angular with Angular CLI',
      description: 'Learn to use Angular CLI for project setup and development workflow',
      explanation: `Angular CLI simplifies setup, testing, building, and running Angular apps.

Installation and setup:
npm install -g @angular/cli
ng new my-app
cd my-app
ng serve

Folder structure:
/src/app → Main app folder
/main.ts → Entry point
/app.module.ts → Root module declaration`,
      animationScript: `CLI runs → app scaffolded → live server reloads browser`,
      scenario: `Scaffold a new app with CLI and run ng serve to edit a component and see HMR (Hot Module Replacement)`,
      challenges: [
        {
          id: 'first-angular-app',
          title: 'Create Your First Angular App',
          description: 'Use Angular CLI to create and customize your first Angular application',
          type: 'playground',
          difficulty: 'beginner',
          estimatedTime: '20 min',
          xpReward: 75,
          code: {
            initial: `// Install Angular CLI globally
npm install -g @angular/cli

// Create new app
ng new my-first-app

// Navigate to app directory
cd my-first-app

// Start development server
ng serve`,
            solution: `// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First Angular App';
  message = 'Welcome to Angular development!';
}

// app.component.html
<div class="app-container">
  <h1>{{title}}</h1>
  <p>{{message}}</p>
  <button (click)="updateMessage()">Click me!</button>
</div>

// Add updateMessage method to component
updateMessage() {
  this.message = 'You clicked the button!';
}`,
            language: 'typescript'
          },
          instructions: [
            'Install Angular CLI globally using npm',
            'Create a new Angular app named "my-first-app"',
            'Modify the title in app.component.ts',
            'Add a message property and display it in the template',
            'Add a button that updates the message when clicked'
          ],
          hints: [
            'Use ng new command to create the app',
            'Edit app.component.ts to add properties',
            'Use interpolation {{}} to display data',
            'Use event binding (click) for button interactions'
          ],
          testCriteria: [
            'App runs successfully with ng serve',
            'Custom title and message are displayed',
            'Button click updates the message',
            'No compilation errors'
          ]
        }
      ],
      learningOutcomes: [
        'Learn Angular CLI usage',
        'Understand basic Angular project structure',
        'Set up development environment'
      ],
      estimatedTime: '45 min',
      difficulty: 'beginner'
    }
  ]
};

export const learningPaths: LearningPath[] = [reactLearningPath, angularLearningPath];

export default learningPaths;
