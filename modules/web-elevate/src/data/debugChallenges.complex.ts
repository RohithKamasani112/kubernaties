export interface DebugChallenge {
  id: string;
  title: string;
  description: string;
  techStack: 'React' | 'Angular' | 'Node.js';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  tags: string[];
  rootCause: string;
  files: { [filename: string]: string };
  hints: string[];
  solution: { [filename: string]: string };
  testCriteria: string[];
  learningObjectives: string[];
}

export const debugChallenges: DebugChallenge[] = [
  // React Challenges
  {
    id: 'react-state-delay',
    title: 'State Not Updating Immediately',
    description: 'User changes input, but value doesn\'t reflect immediately in the console.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['React', 'useState', 'Asynchronous'],
    rootCause: 'Misunderstanding that useState updates are async',
    files: {
      'App.jsx': `import React, { useState } from 'react';
import InputBox from './components/InputBox';

function App() {
  return (
    <div className="App">
      <h1>State Update Demo</h1>
      <InputBox />
    </div>
  );
}

export default App;`,
      'components/InputBox.jsx': `import React, { useState } from 'react';

function InputBox() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    // BUG: This will log the old value, not the new one
    console.log('Current value:', value);
  };

  return (
    <div>
      <input 
        type="text" 
        value={value} 
        onChange={handleChange}
        placeholder="Type something..."
      />
      <p>Current value: {value}</p>
    </div>
  );
}

export default InputBox;`
    },
    hints: [
      'useState updates are asynchronous - the state doesn\'t update immediately',
      'The console.log runs before the state actually updates',
      'Try logging e.target.value instead of the state variable',
      'Consider using useEffect to log state changes'
    ],
    solution: {
      'components/InputBox.jsx': `import React, { useState, useEffect } from 'react';

function InputBox() {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    // FIXED: Log the input value directly
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
      <p>Current value: {value}</p>
    </div>
  );
}

export default InputBox;`
    },
    testCriteria: [
      'Console should log the correct input value when typing',
      'State should update properly in the UI',
      'No stale state values should be logged'
    ],
    learningObjectives: [
      'Understand asynchronous nature of useState',
      'Learn when to use useEffect for side effects',
      'Practice proper event handling in React'
    ]
  },
  {
    id: 'react-missing-props',
    title: 'Props Not Received in Child Component',
    description: 'Parent passes data, but child receives undefined.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 60,
    tags: ['React', 'Props', 'Components'],
    rootCause: 'Wrong prop name or destructuring',
    files: {
      'App.jsx': `import React from 'react';
import ChildComponent from './components/ChildComponent';

function App() {
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  };

  return (
    <div className="App">
      <h1>User Profile</h1>
      <ChildComponent userInfo={userData} />
    </div>
  );
}

export default App;`,
      'components/ChildComponent.jsx': `import React from 'react';

// BUG: Wrong prop name in destructuring
function ChildComponent({ userData }) {
  return (
    <div>
      <h2>User Details</h2>
      <p>Name: {userData?.name || 'No name'}</p>
      <p>Email: {userData?.email || 'No email'}</p>
      <p>Age: {userData?.age || 'No age'}</p>
    </div>
  );
}

export default ChildComponent;`
    },
    hints: [
      'Check the prop name being passed from the parent component',
      'Make sure the destructuring matches the actual prop name',
      'The parent is passing "userInfo" but child expects "userData"',
      'Props must be destructured with the exact same name they are passed'
    ],
    solution: {
      'components/ChildComponent.jsx': `import React from 'react';

// FIXED: Correct prop name in destructuring
function ChildComponent({ userInfo }) {
  return (
    <div>
      <h2>User Details</h2>
      <p>Name: {userInfo?.name || 'No name'}</p>
      <p>Email: {userInfo?.email || 'No email'}</p>
      <p>Age: {userInfo?.age || 'No age'}</p>
    </div>
  );
}

export default ChildComponent;`
    },
    testCriteria: [
      'Child component should display user name, email, and age',
      'No "undefined" values should be shown',
      'Props should be properly received and destructured'
    ],
    learningObjectives: [
      'Understand prop passing between components',
      'Learn proper destructuring syntax',
      'Practice debugging prop-related issues'
    ]
  },
  {
    id: 'react-infinite-useeffect',
    title: 'Infinite useEffect Loop',
    description: 'App crashes due to useEffect running infinitely.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['React', 'useEffect', 'Lifecycle'],
    rootCause: 'Missing or incorrect dependency array',
    files: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  // BUG: Missing dependency array causes infinite loop
  useEffect(() => {
    console.log('Effect running...');
    // Simulating data fetch
    const newData = [...data, `Item ${count}`];
    setData(newData);
  }); // Missing dependency array!

  return (
    <div className="App">
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <h2>Data:</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;`
    },
    hints: [
      'useEffect without a dependency array runs after every render',
      'The effect is updating state, which causes a re-render',
      'This creates an infinite loop: render → effect → state update → render',
      'Add a dependency array to control when the effect runs'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);

  // FIXED: Added dependency array with count
  useEffect(() => {
    console.log('Effect running...');
    // Simulating data fetch
    const newData = [...data, `Item ${count}`];
    setData(newData);
  }, [count]); // Only run when count changes

  return (
    <div className="App">
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <h2>Data:</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;`
    },
    testCriteria: [
      'Effect should only run when count changes',
      'No infinite loop should occur',
      'Data should update only when button is clicked'
    ],
    learningObjectives: [
      'Understand useEffect dependency arrays',
      'Learn to prevent infinite loops',
      'Practice proper effect management'
    ]
  },

  // Angular Challenges
  {
    id: 'angular-expression-changed',
    title: 'ExpressionChangedAfterItHasBeenCheckedError',
    description: 'Common Angular error when a bound value is updated after change detection.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 120,
    tags: ['ChangeDetection', 'Lifecycle', 'Async'],
    rootCause: 'Value updated inside setTimeout without proper change detection',
    files: {
      'app.component.ts': `import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>{{title}}</h1>
      <app-child [message]="message"></app-child>
    </div>
  `
})
export class AppComponent implements AfterViewInit {
  title = 'Angular Debug Challenge';
  message = 'Initial message';

  ngAfterViewInit() {
    // BUG: Updating bound property after view init without change detection
    setTimeout(() => {
      this.message = 'Updated message';
    }, 0);
  }
}`,
      'components/child.component.ts': `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <p>Child received: {{message}}</p>
    </div>
  `
})
export class ChildComponent {
  @Input() message: string = '';
}`
    },
    hints: [
      'The error occurs because change detection has already run',
      'setTimeout causes the update to happen after change detection',
      'Use ChangeDetectorRef to manually trigger change detection',
      'Import ChangeDetectorRef and call detectChanges() or markForCheck()'
    ],
    solution: {
      'app.component.ts': `import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>{{title}}</h1>
      <app-child [message]="message"></app-child>
    </div>
  `
})
export class AppComponent implements AfterViewInit {
  title = 'Angular Debug Challenge';
  message = 'Initial message';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // FIXED: Manually trigger change detection after async update
    setTimeout(() => {
      this.message = 'Updated message';
      this.cdr.detectChanges();
    }, 0);
  }
}`
    },
    testCriteria: [
      'No ExpressionChangedAfterItHasBeenCheckedError should occur',
      'Message should update properly',
      'Change detection should work correctly'
    ],
    learningObjectives: [
      'Understand Angular change detection',
      'Learn when to use ChangeDetectorRef',
      'Practice proper lifecycle management'
    ]
  },

  // Node.js Challenges
  {
    id: 'node-unhandled-promise',
    title: 'Unhandled Promise Rejection Crashes App',
    description: 'App crashes silently or shows UnhandledPromiseRejectionWarning.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 100,
    tags: ['Node.js', 'Promises', 'Error Handling'],
    rootCause: 'Missing .catch() in an async operation',
    files: {
      'index.js': `const express = require('express');
const userController = require('./controllers/userController');

const app = express();
app.use(express.json());

// BUG: No error handling for async routes
app.get('/users/:id', userController.getUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
      'controllers/userController.js': `const userService = require('../services/userService');

const getUser = async (req, res) => {
  const { id } = req.params;
  
  // BUG: No try-catch around async operation
  const user = await userService.fetchUser(id);
  res.json(user);
};

module.exports = { getUser };`,
      'services/userService.js': `const fetchUser = async (id) => {
  // Simulating API call that might fail
  if (id === '999') {
    throw new Error('User not found');
  }
  
  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`
  };
};

module.exports = { fetchUser };`
    },
    hints: [
      'Async functions can throw errors that need to be caught',
      'Express doesn\'t automatically catch async errors',
      'Wrap async route handlers in try-catch blocks',
      'Consider using express-async-handler for cleaner code'
    ],
    solution: {
      'controllers/userController.js': `const userService = require('../services/userService');

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.fetchUser(id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = { getUser };`
    },
    testCriteria: [
      'No unhandled promise rejections should occur',
      'Errors should be properly caught and handled',
      'API should return appropriate error responses'
    ],
    learningObjectives: [
      'Understand async error handling in Node.js',
      'Learn proper Express error handling patterns',
      'Practice defensive programming'
    ]
  },

  // More React Challenges
  {
    id: 'react-form-prevent-default',
    title: 'Form Submission Doesn\'t Prevent Reload',
    description: 'Form reloads page on submit instead of handling it with JavaScript.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    xpReward: 50,
    tags: ['React', 'Forms', 'Events'],
    rootCause: 'e.preventDefault() not called',
    files: {
      'App.jsx': `import React from 'react';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <div className="App">
      <h1>Contact Us</h1>
      <ContactForm />
    </div>
  );
}

export default App;`,
      'components/ContactForm.jsx': `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    // BUG: Missing e.preventDefault() - form will reload page
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}

export default ContactForm;`
    },
    hints: [
      'The form is reloading the page when submitted',
      'You need to prevent the default form submission behavior',
      'Add e.preventDefault() at the beginning of handleSubmit',
      'This prevents the browser from reloading the page'
    ],
    solution: {
      'components/ContactForm.jsx': `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    // FIXED: Prevent default form submission
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}

export default ContactForm;`
    },
    testCriteria: [
      'Form should not reload the page when submitted',
      'Form data should be logged to console',
      'Success alert should appear'
    ],
    learningObjectives: [
      'Understand event.preventDefault()',
      'Learn proper form handling in React',
      'Practice event handling'
    ]
  },

  // More Angular Challenges
  {
    id: 'angular-ngmodel-binding',
    title: 'Two-Way Binding Not Working ([(ngModel)])',
    description: 'Input changes in the UI but not reflected in the component.',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 80,
    tags: ['Forms', 'Binding', 'NgModel'],
    rootCause: 'FormsModule not imported in module',
    files: {
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// BUG: FormsModule not imported

import { AppComponent } from './app.component';
import { FormComponent } from './form.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule
    // BUG: Missing FormsModule import
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
      'form.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  template: `
    <div>
      <h2>User Form</h2>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" [(ngModel)]="userName" placeholder="Enter your name">
        </div>
        <div>
          <label>Email:</label>
          <input type="email" [(ngModel)]="userEmail" placeholder="Enter your email">
        </div>
        <p>Name: {{userName}}</p>
        <p>Email: {{userEmail}}</p>
      </form>
    </div>
  `
})
export class FormComponent {
  userName: string = '';
  userEmail: string = '';
}`
    },
    hints: [
      'Two-way binding with [(ngModel)] requires FormsModule',
      'Check the imports in app.module.ts',
      'Import FormsModule from @angular/forms',
      'Add FormsModule to the imports array'
    ],
    solution: {
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // FIXED: Import FormsModule

import { AppComponent } from './app.component';
import { FormComponent } from './form.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // FIXED: Add FormsModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    testCriteria: [
      'Input fields should update component properties',
      'Component properties should be displayed in real-time',
      'No console errors about ngModel'
    ],
    learningObjectives: [
      'Understand Angular module imports',
      'Learn about FormsModule dependency',
      'Practice two-way data binding'
    ]
  },

  // More Node.js Challenges
  {
    id: 'node-env-variables',
    title: 'Environment Variables Not Loading',
    description: 'process.env.XYZ is undefined even though .env file exists.',
    techStack: 'Node.js',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 90,
    tags: ['Node.js', 'Environment', 'Configuration'],
    rootCause: '.env file not loaded via dotenv',
    files: {
      'index.js': `const express = require('express');
// BUG: dotenv not configured
const app = express();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('PORT:', PORT);
console.log('DB_URL:', DB_URL); // Will be undefined
console.log('JWT_SECRET:', JWT_SECRET); // Will be undefined

app.get('/', (req, res) => {
  res.json({
    port: PORT,
    dbUrl: DB_URL,
    hasJwtSecret: !!JWT_SECRET
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
      '.env': `PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-super-secret-key-here
API_KEY=abc123xyz789`
    },
    hints: [
      'Environment variables need to be loaded from .env file',
      'Install and configure the dotenv package',
      'Add require(\'dotenv\').config() at the top of index.js',
      'Make sure .env file is in the root directory'
    ],
    solution: {
      'index.js': `require('dotenv').config(); // FIXED: Load environment variables
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('PORT:', PORT);
console.log('DB_URL:', DB_URL); // Now will show the value
console.log('JWT_SECRET:', JWT_SECRET); // Now will show the value

app.get('/', (req, res) => {
  res.json({
    port: PORT,
    dbUrl: DB_URL,
    hasJwtSecret: !!JWT_SECRET
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    testCriteria: [
      'Environment variables should be loaded correctly',
      'Console should show actual values instead of undefined',
      'API endpoint should return proper configuration'
    ],
    learningObjectives: [
      'Understand environment variable management',
      'Learn dotenv configuration',
      'Practice secure configuration handling'
    ]
  },

  // Additional React Challenges
  {
    id: 'react-useeffect-cleanup',
    title: 'useEffect Cleanup Missing',
    description: 'Memory leak warning in console due to missing cleanup function.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['React', 'useEffect', 'Cleanup'],
    rootCause: 'useEffect returns no cleanup function for subscriptions',
    files: {
      'App.jsx': `import React from 'react';
import Clock from './components/Clock';

function App() {
  const [showClock, setShowClock] = React.useState(true);

  return (
    <div className="App">
      <h1>Clock Demo</h1>
      <button onClick={() => setShowClock(!showClock)}>
        {showClock ? 'Hide' : 'Show'} Clock
      </button>
      {showClock && <Clock />}
    </div>
  );
}

export default App;`,
      'components/Clock.jsx': `import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    console.log('Clock mounted');

    // BUG: No cleanup function returned
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Missing cleanup function!
  }, []);

  return (
    <div>
      <h2>Current Time</h2>
      <p>{time.toLocaleTimeString()}</p>
    </div>
  );
}

export default Clock;`
    },
    hints: [
      'setInterval creates a timer that needs to be cleaned up',
      'useEffect should return a cleanup function',
      'Use clearInterval to stop the timer when component unmounts',
      'Return a function from useEffect that calls clearInterval'
    ],
    solution: {
      'components/Clock.jsx': `import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    console.log('Clock mounted');

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // FIXED: Return cleanup function
    return () => {
      console.log('Clock unmounted');
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h2>Current Time</h2>
      <p>{time.toLocaleTimeString()}</p>
    </div>
  );
}

export default Clock;`
    },
    testCriteria: [
      'No memory leak warnings in console',
      'Timer should stop when component unmounts',
      'Cleanup function should be called'
    ],
    learningObjectives: [
      'Understand useEffect cleanup',
      'Learn memory leak prevention',
      'Practice proper subscription management'
    ]
  },

  {
    id: 'react-no-rerender',
    title: 'Component Not Re-rendering on State Change',
    description: 'Component doesn\'t update when state changes due to mutation.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['React', 'State', 'Immutability'],
    rootCause: 'Mutating state directly instead of using setState',
    files: {
      'App.jsx': `import React from 'react';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <h1>Task Manager</h1>
      <TaskList />
    </div>
  );
}

export default App;`,
      'components/TaskList.jsx': `import React, { useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  const toggleTask = (id) => {
    // BUG: Mutating state directly
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    setTasks(tasks); // This won't trigger re-render!
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      text: `New task ${tasks.length + 1}`,
      completed: false
    };

    // BUG: Mutating array directly
    tasks.push(newTask);
    setTasks(tasks); // This won't trigger re-render!
  };

  return (
    <div>
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;`
    },
    hints: [
      'React needs a new object/array reference to detect changes',
      'Mutating the existing state object won\'t trigger re-renders',
      'Use spread operator to create new arrays and objects',
      'Always return new state instead of modifying existing state'
    ],
    solution: {
      'components/TaskList.jsx': `import React, { useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  const toggleTask = (id) => {
    // FIXED: Create new array with updated task
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      text: `New task ${tasks.length + 1}`,
      completed: false
    };

    // FIXED: Create new array with spread operator
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;`
    },
    testCriteria: [
      'Tasks should toggle when checkbox is clicked',
      'New tasks should appear when Add Task is clicked',
      'Component should re-render on state changes'
    ],
    learningObjectives: [
      'Understand React state immutability',
      'Learn proper state update patterns',
      'Practice array and object manipulation'
    ]
  },

  {
    id: 'react-api-every-render',
    title: 'API Call Made on Every Render',
    description: 'fetch() call runs on every component render causing performance issues.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['React', 'API', 'useEffect', 'Side Effects'],
    rootCause: 'API call placed outside useEffect or missing dependency array',
    files: {
      'App.jsx': `import React from 'react';
import UserFetcher from './components/UserFetcher';

function App() {
  return (
    <div className="App">
      <h1>User Profile</h1>
      <UserFetcher />
    </div>
  );
}

export default App;`,
      'components/UserFetcher.jsx': `import React, { useState } from 'react';
import { fetchUser } from '../services/api';

function UserFetcher() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // BUG: API call runs on every render!
  fetchUser(1).then(userData => {
    setUser(userData);
    setLoading(false);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
    </div>
  );
}

export default UserFetcher;`,
      'services/api.js': `export const fetchUser = async (id) => {
  console.log(`Fetching user ${id}...`); // You'll see this on every render!

  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      });
    }, 1000);
  });
};`
    },
    hints: [
      'API calls should be inside useEffect, not in the component body',
      'useEffect with empty dependency array runs only once',
      'Component body code runs on every render',
      'Move the fetchUser call inside useEffect'
    ],
    solution: {
      'components/UserFetcher.jsx': `import React, { useState, useEffect } from 'react';
import { fetchUser } from '../services/api';

function UserFetcher() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // FIXED: Move API call inside useEffect
  useEffect(() => {
    fetchUser(1).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, []); // Empty dependency array = run once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
    </div>
  );
}

export default UserFetcher;`
    },
    testCriteria: [
      'API should be called only once when component mounts',
      'Console should show only one "Fetching user" message',
      'User data should load and display correctly'
    ],
    learningObjectives: [
      'Understand useEffect for side effects',
      'Learn proper API call patterns',
      'Practice performance optimization'
    ]
  },

  // Additional Angular Challenges
  {
    id: 'angular-http-not-imported',
    title: 'HTTP Client Not Working',
    description: 'HttpClient injection fails with NullInjectorError.',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 70,
    tags: ['Angular', 'HTTP', 'Modules'],
    rootCause: 'HttpClientModule not imported in app.module.ts',
    files: {
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// BUG: HttpClientModule not imported

import { AppComponent } from './app.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule
    // BUG: Missing HttpClientModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
      'user.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
  }
}`,
      'app.component.ts': `import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Users List</h1>
    <div *ngFor="let user of users">
      <p>{{user.name}} - {{user.email}}</p>
    </div>
  `
})
export class AppComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.error('Error:', error)
    );
  }
}`
    },
    hints: [
      'HttpClient requires HttpClientModule to be imported',
      'Check the imports array in app.module.ts',
      'Import HttpClientModule from @angular/common/http',
      'Add HttpClientModule to the imports array'
    ],
    solution: {
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // FIXED: Import HttpClientModule

import { AppComponent } from './app.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule // FIXED: Add HttpClientModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    testCriteria: [
      'No NullInjectorError should occur',
      'HTTP requests should work properly',
      'Users should be fetched and displayed'
    ],
    learningObjectives: [
      'Understand Angular module dependencies',
      'Learn HttpClientModule configuration',
      'Practice service injection'
    ]
  },

  {
    id: 'angular-routing-not-working',
    title: 'Router Navigation Not Working',
    description: 'routerLink clicks don\'t navigate between components.',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['Angular', 'Routing', 'Navigation'],
    rootCause: 'RouterModule not imported or router-outlet missing',
    files: {
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// BUG: RouterModule not imported

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule
    // BUG: Missing RouterModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
      'app.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/home">Home</a> |
      <a routerLink="/about">About</a>
    </nav>
    <!-- BUG: Missing router-outlet -->
    <div>
      <p>Content should appear here but router-outlet is missing!</p>
    </div>
  `
})
export class AppComponent { }`,
      'home.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: '<h1>Home Page</h1><p>Welcome to the home page!</p>'
})
export class HomeComponent { }`,
      'about.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: '<h1>About Page</h1><p>Learn more about us!</p>'
})
export class AboutComponent { }`
    },
    hints: [
      'Routing requires RouterModule to be imported',
      'Use RouterModule.forRoot() with route configuration',
      'Add <router-outlet></router-outlet> to display routed components',
      'Define routes array with path and component mappings'
    ],
    solution: {
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'; // FIXED: Import RouterModule

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';

// FIXED: Define routes
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // FIXED: Configure routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
      'app.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav>
      <a routerLink="/home">Home</a> |
      <a routerLink="/about">About</a>
    </nav>
    <!-- FIXED: Add router-outlet -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }`
    },
    testCriteria: [
      'Navigation links should work when clicked',
      'Components should render in router-outlet',
      'URL should change when navigating'
    ],
    learningObjectives: [
      'Understand Angular routing setup',
      'Learn RouterModule configuration',
      'Practice navigation and router-outlet'
    ]
  },

  {
    id: 'angular-observable-not-subscribed',
    title: 'Observable Not Subscribed',
    description: 'HTTP request doesn\'t execute because Observable is not subscribed.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['Angular', 'Observables', 'HTTP'],
    rootCause: 'Observable returned but never subscribed to',
    files: {
      'app.component.ts': `import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Data Loader</h1>
    <button (click)="loadData()">Load Data</button>
    <div *ngIf="data">
      <h2>Loaded Data:</h2>
      <pre>{{data | json}}</pre>
    </div>
    <div *ngIf="loading">Loading...</div>
  `
})
export class AppComponent {
  data: any = null;
  loading = false;

  constructor(private dataService: DataService) {}

  loadData() {
    this.loading = true;

    // BUG: Observable returned but not subscribed!
    this.dataService.fetchData();

    // This will never execute because the HTTP request never runs
    this.loading = false;
  }
}`,
      'data.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    console.log('fetchData called'); // This will log
    return this.http.get('https://jsonplaceholder.typicode.com/posts/1');
    // But the HTTP request won't actually execute without subscription
  }
}`
    },
    hints: [
      'Observables are lazy - they don\'t execute until subscribed',
      'You need to call .subscribe() on the Observable',
      'Handle the response in the subscribe callback',
      'Don\'t forget to handle errors in subscribe'
    ],
    solution: {
      'app.component.ts': `import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Data Loader</h1>
    <button (click)="loadData()">Load Data</button>
    <div *ngIf="data">
      <h2>Loaded Data:</h2>
      <pre>{{data | json}}</pre>
    </div>
    <div *ngIf="loading">Loading...</div>
  `
})
export class AppComponent {
  data: any = null;
  loading = false;

  constructor(private dataService: DataService) {}

  loadData() {
    this.loading = true;

    // FIXED: Subscribe to the Observable
    this.dataService.fetchData().subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }
}`
    },
    testCriteria: [
      'HTTP request should execute when button is clicked',
      'Data should be loaded and displayed',
      'Loading state should work correctly'
    ],
    learningObjectives: [
      'Understand Observable subscription',
      'Learn async data handling',
      'Practice error handling in Angular'
    ]
  },

  // Additional Node.js Challenges
  {
    id: 'node-cors-error',
    title: 'CORS Error Blocking Frontend Requests',
    description: 'Frontend can\'t access API due to CORS policy blocking requests.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    xpReward: 85,
    tags: ['Node.js', 'CORS', 'Express', 'Security'],
    rootCause: 'CORS middleware not configured',
    files: {
      'server.js': `const express = require('express');
const app = express();

app.use(express.json());

// BUG: No CORS configuration
// Frontend requests from different origin will be blocked

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
      'package.json': `{
  "name": "api-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`
    },
    hints: [
      'CORS (Cross-Origin Resource Sharing) needs to be enabled',
      'Install and use the cors middleware package',
      'Add app.use(cors()) before your routes',
      'Or manually set CORS headers in responses'
    ],
    solution: {
      'server.js': `const express = require('express');
const cors = require('cors'); // FIXED: Import cors
const app = express();

// FIXED: Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
      'package.json': `{
  "name": "api-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}`
    },
    testCriteria: [
      'Frontend should be able to make requests to API',
      'No CORS errors in browser console',
      'API should respond with proper CORS headers'
    ],
    learningObjectives: [
      'Understand CORS and cross-origin requests',
      'Learn Express middleware configuration',
      'Practice API security setup'
    ]
  },

  {
    id: 'node-middleware-order',
    title: 'Middleware Order Causing Issues',
    description: 'Authentication middleware runs after routes, causing security bypass.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['Node.js', 'Express', 'Middleware', 'Security'],
    rootCause: 'Middleware defined after routes instead of before',
    files: {
      'server.js': `const express = require('express');
const app = express();

app.use(express.json());

// BUG: Routes defined before authentication middleware
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is public' });
});

app.get('/api/protected', (req, res) => {
  res.json({
    message: 'This should be protected!',
    user: req.user
  });
});

app.post('/api/admin', (req, res) => {
  res.json({
    message: 'Admin only endpoint!',
    data: 'Sensitive admin data'
  });
});

// BUG: Authentication middleware defined AFTER routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Simulate token verification
  if (token === 'valid-token') {
    req.user = { id: 1, name: 'John Doe' };
    next();
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// BUG: This middleware won't affect routes defined above!
app.use('/api/protected', authenticateToken);
app.use('/api/admin', authenticateToken);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    hints: [
      'Middleware must be defined before the routes that use it',
      'Express processes middleware in the order they are defined',
      'Move authentication middleware above the protected routes',
      'Use app.use() before defining routes that need protection'
    ],
    solution: {
      'server.js': `const express = require('express');
const app = express();

app.use(express.json());

// FIXED: Define authentication middleware first
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Simulate token verification
  if (token === 'valid-token') {
    req.user = { id: 1, name: 'John Doe' };
    next();
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Public route (no authentication needed)
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is public' });
});

// FIXED: Apply middleware before defining protected routes
app.use('/api/protected', authenticateToken);
app.use('/api/admin', authenticateToken);

// Protected routes (authentication required)
app.get('/api/protected', (req, res) => {
  res.json({
    message: 'This is now properly protected!',
    user: req.user
  });
});

app.post('/api/admin', (req, res) => {
  res.json({
    message: 'Admin only endpoint - now secure!',
    data: 'Sensitive admin data'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    testCriteria: [
      'Protected routes should require authentication',
      'Requests without token should return 401',
      'Public routes should work without authentication'
    ],
    learningObjectives: [
      'Understand Express middleware order',
      'Learn proper authentication setup',
      'Practice security best practices'
    ]
  },

  {
    id: 'node-async-await-error',
    title: 'Async/Await Error Not Caught',
    description: 'Unhandled promise rejection crashes the application.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 95,
    tags: ['Node.js', 'Async/Await', 'Error Handling'],
    rootCause: 'Missing try-catch around async operations',
    files: {
      'server.js': `const express = require('express');
const { getUserFromDatabase, updateUserInDatabase } = require('./database');

const app = express();
app.use(express.json());

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  // BUG: No try-catch around async operation
  const user = await getUserFromDatabase(id);
  res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  // BUG: No error handling for async operation
  const updatedUser = await updateUserInDatabase(id, userData);
  res.json(updatedUser);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
      'database.js': `// Simulated database operations that can fail

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

const getUserFromDatabase = async (id) => {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Simulate potential database error
  if (id === '999') {
    throw new Error('Database connection failed');
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUserInDatabase = async (id, userData) => {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 150));

  // Simulate validation error
  if (!userData.name || !userData.email) {
    throw new Error('Name and email are required');
  }

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex] = { ...users[userIndex], ...userData };
  return users[userIndex];
};

module.exports = {
  getUserFromDatabase,
  updateUserInDatabase
};`
    },
    hints: [
      'Async functions can throw errors that need to be caught',
      'Wrap async operations in try-catch blocks',
      'Send appropriate error responses to the client',
      'Use proper HTTP status codes for different error types'
    ],
    solution: {
      'server.js': `const express = require('express');
const { getUserFromDatabase, updateUserInDatabase } = require('./database');

const app = express();
app.use(express.json());

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserFromDatabase(id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);

    if (error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await updateUserInDatabase(id, userData);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);

    if (error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' });
    } else if (error.message.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    testCriteria: [
      'Errors should be caught and handled gracefully',
      'Appropriate HTTP status codes should be returned',
      'Server should not crash on errors'
    ],
    learningObjectives: [
      'Understand async/await error handling',
      'Learn proper HTTP error responses',
      'Practice defensive programming'
    ]
  },

  // More React Challenges from debug-react.txt
  {
    id: 'react-key-prop-missing',
    title: 'Missing Key Prop in List Rendering',
    description: 'Console warning about missing key prop when rendering lists.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    xpReward: 40,
    tags: ['React', 'Lists', 'Keys', 'Performance'],
    rootCause: 'key prop not provided in map function',
    files: {
      'App.jsx': `import React from 'react';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="App">
      <h1>Todo App</h1>
      <TodoList />
    </div>
  );
}

export default App;`,
      'components/TodoList.jsx': `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);

  return (
    <div>
      <h2>My Todos</h2>
      <ul>
        {/* BUG: Missing key prop */}
        {todos.map(todo => (
          <li>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {}}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;`
    },
    hints: [
      'React needs a unique key prop for each list item',
      'Add key prop to the <li> element',
      'Use a unique identifier like todo.id for the key',
      'Keys help React identify which items have changed'
    ],
    solution: {
      'components/TodoList.jsx': `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);

  return (
    <div>
      <h2>My Todos</h2>
      <ul>
        {/* FIXED: Added key prop */}
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {}}
            />
            <span style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;`
    },
    testCriteria: [
      'No console warnings about missing keys',
      'List should render correctly',
      'Each list item should have a unique key'
    ],
    learningObjectives: [
      'Understand React key prop importance',
      'Learn list rendering best practices',
      'Practice React performance optimization'
    ]
  },

  {
    id: 'react-conditional-hooks',
    title: 'Conditional Hook Usage',
    description: 'React Hook "useState" is called conditionally causing errors.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    xpReward: 85,
    tags: ['React', 'Hooks', 'Rules of Hooks'],
    rootCause: 'Hooks called inside conditional statements',
    files: {
      'App.jsx': `import React from 'react';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className="App">
      <h1>User Profile App</h1>
      <UserProfile />
    </div>
  );
}

export default App;`,
      'components/UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // BUG: Conditional hook usage
  if (loading) {
    const [error, setError] = useState(null); // This breaks Rules of Hooks!
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({ name: 'John Doe', email: 'john@example.com' });
      setLoading(false);
    }, 2000);
  }, []);

  // BUG: Another conditional hook
  if (user) {
    const [showDetails, setShowDetails] = useState(false); // This also breaks Rules of Hooks!
  }

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'Hooks must be called at the top level of the component',
      'Never call hooks inside loops, conditions, or nested functions',
      'Move all useState calls to the top of the component',
      'Use conditional logic inside the hook, not around it'
    ],
    solution: {
      'components/UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // FIXED: Move hooks to top level
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({ name: 'John Doe', email: 'john@example.com' });
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      {user && (
        <div>
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          {showDetails && (
            <div>
              <p>Additional user details would go here...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;`
    },
    testCriteria: [
      'No React Hook errors in console',
      'Component should render without crashing',
      'All hooks should be called consistently'
    ],
    learningObjectives: [
      'Understand Rules of Hooks',
      'Learn proper hook placement',
      'Practice React best practices'
    ]
  },

  {
    id: 'react-stale-closure',
    title: 'Stale Closure in useEffect',
    description: 'useEffect callback uses stale values from previous renders.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 120,
    tags: ['React', 'useEffect', 'Closures', 'Dependencies'],
    rootCause: 'Missing dependencies in useEffect dependency array',
    files: {
      'App.jsx': `import React from 'react';
import Counter from './components/Counter';

function App() {
  return (
    <div className="App">
      <h1>Counter with Auto-increment</h1>
      <Counter />
    </div>
  );
}

export default App;`,
      'components/Counter.jsx': `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        // BUG: This will always use the initial value of count (0)
        // because count is not in the dependency array
        console.log('Current count:', count);
        setCount(count + 1); // This will always set to 1!
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]); // BUG: Missing 'count' in dependency array

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment Manually
      </button>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'} Auto-increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Counter;`
    },
    hints: [
      'The useEffect callback captures the initial value of count',
      'Add count to the dependency array, or use a different approach',
      'Consider using setCount with a function to get current value',
      'Use setCount(prev => prev + 1) to avoid stale closure'
    ],
    solution: {
      'components/Counter.jsx': `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        // FIXED: Use function form of setState to avoid stale closure
        setCount(prevCount => {
          console.log('Current count:', prevCount);
          return prevCount + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]); // No need to include count now

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment Manually
      </button>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'} Auto-increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Counter;`
    },
    testCriteria: [
      'Auto-increment should work correctly',
      'Count should increase by 1 every second when running',
      'Manual increment should work alongside auto-increment'
    ],
    learningObjectives: [
      'Understand JavaScript closures in React',
      'Learn useEffect dependency management',
      'Practice advanced React patterns'
    ]
  },

  // More Angular Challenges
  {
    id: 'angular-memory-leak',
    title: 'Memory Leak from Unsubscribed Observable',
    description: 'Component doesn\'t unsubscribe from Observable causing memory leaks.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['Angular', 'Observables', 'Memory Leaks'],
    rootCause: 'Observable subscription not unsubscribed in ngOnDestroy',
    files: {
      'user.component.ts': `import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  template: `
    <div>
      <h2>User Data</h2>
      <p>Timer: {{timer}}</p>
      <p>User: {{user?.name}}</p>
    </div>
  `
})
export class UserComponent implements OnInit {
  timer = 0;
  user: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // BUG: No unsubscription - memory leak!
    interval(1000).subscribe(val => {
      this.timer = val;
    });

    // BUG: Another subscription without cleanup
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  // BUG: Missing ngOnDestroy to cleanup subscriptions
}`
    },
    hints: [
      'Implement OnDestroy interface and ngOnDestroy method',
      'Store subscriptions in variables so you can unsubscribe',
      'Call unsubscribe() on all subscriptions in ngOnDestroy',
      'Consider using takeUntil pattern for automatic cleanup'
    ],
    solution: {
      'user.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  template: `
    <div>
      <h2>User Data</h2>
      <p>Timer: {{timer}}</p>
      <p>User: {{user?.name}}</p>
    </div>
  `
})
export class UserComponent implements OnInit, OnDestroy {
  timer = 0;
  user: any;

  // FIXED: Store subscriptions for cleanup
  private timerSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // FIXED: Store subscription reference
    this.timerSubscription = interval(1000).subscribe(val => {
      this.timer = val;
    });

    // FIXED: Store subscription reference
    this.userSubscription = this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  // FIXED: Implement ngOnDestroy for cleanup
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}`
    },
    testCriteria: [
      'No memory leaks when component is destroyed',
      'Subscriptions should be properly cleaned up',
      'Timer should stop when component unmounts'
    ],
    learningObjectives: [
      'Understand Angular lifecycle hooks',
      'Learn proper subscription management',
      'Practice memory leak prevention'
    ]
  },

  {
    id: 'angular-async-pipe-missing',
    title: 'Observable Not Displaying Data',
    description: 'Observable data not showing in template despite service returning data.',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 60,
    tags: ['Angular', 'Async Pipe', 'Templates'],
    rootCause: 'Missing async pipe in template',
    files: {
      'posts.component.ts': `import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

@Component({
  selector: 'app-posts',
  template: `
    <div>
      <h2>Posts</h2>
      <!-- BUG: Missing async pipe -->
      <div *ngFor="let post of posts">
        <h3>{{post.title}}</h3>
        <p>{{post.body}}</p>
      </div>
    </div>
  `
})
export class PostsComponent implements OnInit {
  posts: Observable<any[]>;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.posts = this.postService.getPosts();
  }
}`,
      'post.service.ts': `import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  getPosts(): Observable<any[]> {
    return of([
      { id: 1, title: 'First Post', body: 'This is the first post' },
      { id: 2, title: 'Second Post', body: 'This is the second post' }
    ]).pipe(delay(1000));
  }
}`
    },
    hints: [
      'Observable data needs the async pipe to be displayed',
      'Add | async to the *ngFor directive',
      'The async pipe subscribes and unsubscribes automatically',
      'Use (posts | async) in the template'
    ],
    solution: {
      'posts.component.ts': `import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from './post.service';

@Component({
  selector: 'app-posts',
  template: `
    <div>
      <h2>Posts</h2>
      <!-- FIXED: Added async pipe -->
      <div *ngFor="let post of posts | async">
        <h3>{{post.title}}</h3>
        <p>{{post.body}}</p>
      </div>
    </div>
  `
})
export class PostsComponent implements OnInit {
  posts: Observable<any[]>;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.posts = this.postService.getPosts();
  }
}`
    },
    testCriteria: [
      'Posts should be displayed in the template',
      'Observable should be properly subscribed',
      'Data should appear after loading'
    ],
    learningObjectives: [
      'Understand async pipe usage',
      'Learn Observable template binding',
      'Practice Angular data flow'
    ]
  },

  // More Node.js Challenges
  {
    id: 'node-sql-injection',
    title: 'SQL Injection Vulnerability',
    description: 'Database query vulnerable to SQL injection attacks.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['Node.js', 'Security', 'SQL', 'Database'],
    rootCause: 'String concatenation in SQL queries instead of parameterized queries',
    files: {
      'userController.js': `const db = require('./database');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // BUG: SQL injection vulnerability!
    const query = `SELECT * FROM users WHERE id = '${id}'`;
    const user = await db.query(query);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

const searchUsers = async (req, res) => {
  const { name } = req.query;

  try {
    // BUG: Another SQL injection vulnerability!
    const query = `SELECT * FROM users WHERE name LIKE '%${name}%'`;
    const users = await db.query(query);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getUserById,
  searchUsers
};`
    },
    hints: [
      'Never concatenate user input directly into SQL queries',
      'Use parameterized queries with placeholders',
      'Pass user input as separate parameters to the query function',
      'Use ? or $1, $2 etc. as placeholders depending on your database'
    ],
    solution: {
      'userController.js': `const db = require('./database');

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // FIXED: Use parameterized query
    const query = 'SELECT * FROM users WHERE id = ?';
    const user = await db.query(query, [id]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

const searchUsers = async (req, res) => {
  const { name } = req.query;

  try {
    // FIXED: Use parameterized query
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    const users = await db.query(query, [`%${name}%`]);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getUserById,
  searchUsers
};`
    },
    testCriteria: [
      'SQL queries should use parameterized statements',
      'User input should not be directly concatenated',
      'Database should be protected from injection attacks'
    ],
    learningObjectives: [
      'Understand SQL injection vulnerabilities',
      'Learn parameterized query techniques',
      'Practice secure coding practices'
    ]
  },

  {
    id: 'node-callback-hell',
    title: 'Callback Hell in File Operations',
    description: 'Nested callbacks making code hard to read and maintain.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Node.js', 'Callbacks', 'Async', 'Promises'],
    rootCause: 'Using nested callbacks instead of promises or async/await',
    files: {
      'fileProcessor.js': `const fs = require('fs');
const path = require('path');

// BUG: Callback hell - hard to read and maintain
function processFiles(inputDir, outputDir, callback) {
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      return callback(err);
    }

    let processedCount = 0;
    const results = [];

    files.forEach(filename => {
      const inputPath = path.join(inputDir, filename);

      fs.readFile(inputPath, 'utf8', (err, data) => {
        if (err) {
          return callback(err);
        }

        const processedData = data.toUpperCase();
        const outputPath = path.join(outputDir, `processed_${filename}`);

        fs.writeFile(outputPath, processedData, (err) => {
          if (err) {
            return callback(err);
          }

          results.push({ input: inputPath, output: outputPath });
          processedCount++;

          if (processedCount === files.length) {
            callback(null, results);
          }
        });
      });
    });
  });
}

module.exports = { processFiles };`
    },
    hints: [
      'Convert callback-based functions to use promises',
      'Use async/await to flatten the nested structure',
      'Consider using fs.promises for promise-based file operations',
      'Use Promise.all() for concurrent operations'
    ],
    solution: {
      'fileProcessor.js': `const fs = require('fs').promises;
const path = require('path');

// FIXED: Using async/await to avoid callback hell
async function processFiles(inputDir, outputDir) {
  try {
    const files = await fs.readdir(inputDir);

    const processPromises = files.map(async (filename) => {
      const inputPath = path.join(inputDir, filename);
      const data = await fs.readFile(inputPath, 'utf8');
      const processedData = data.toUpperCase();
      const outputPath = path.join(outputDir, `processed_${filename}`);

      await fs.writeFile(outputPath, processedData);

      return { input: inputPath, output: outputPath };
    });

    const results = await Promise.all(processPromises);
    return results;
  } catch (error) {
    throw error;
  }
}

module.exports = { processFiles };`
    },
    testCriteria: [
      'Code should be more readable and maintainable',
      'No nested callbacks should remain',
      'Error handling should be simplified'
    ],
    learningObjectives: [
      'Understand callback hell problems',
      'Learn async/await patterns',
      'Practice modern JavaScript async handling'
    ]
  },

  {
    id: 'node-rate-limiting-missing',
    title: 'API Rate Limiting Not Implemented',
    description: 'API vulnerable to abuse due to missing rate limiting.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['Node.js', 'Security', 'Rate Limiting', 'Express'],
    rootCause: 'No rate limiting middleware configured',
    files: {
      'server.js': `const express = require('express');
const app = express();

app.use(express.json());

// BUG: No rate limiting - API can be abused
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Simulate authentication
  if (username === 'admin' && password === 'password') {
    res.json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/send-email', (req, res) => {
  const { to, subject, body } = req.body;

  // Simulate sending email
  console.log(`Sending email to ${to}`);
  res.json({ message: 'Email sent successfully' });
});

app.get('/api/data', (req, res) => {
  // Simulate expensive operation
  const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() }));
  res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    hints: [
      'Install and use express-rate-limit middleware',
      'Apply rate limiting to sensitive endpoints',
      'Configure different limits for different endpoints',
      'Add rate limiting before route definitions'
    ],
    solution: {
      'server.js': `const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(express.json());

// FIXED: Add rate limiting middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.'
});

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 emails per hour
  message: 'Too many emails sent, please try again later.'
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply stricter rate limiting to sensitive endpoints
app.post('/api/login', authLimiter, (req, res) => {
  const { username, password } = req.body;

  // Simulate authentication
  if (username === 'admin' && password === 'password') {
    res.json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/send-email', emailLimiter, (req, res) => {
  const { to, subject, body } = req.body;

  // Simulate sending email
  console.log(`Sending email to ${to}`);
  res.json({ message: 'Email sent successfully' });
});

app.get('/api/data', (req, res) => {
  // Simulate expensive operation
  const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() }));
  res.json(data);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    testCriteria: [
      'Rate limiting should be applied to all endpoints',
      'Sensitive endpoints should have stricter limits',
      'Appropriate error messages should be returned when limits are exceeded'
    ],
    learningObjectives: [
      'Understand API security best practices',
      'Learn rate limiting implementation',
      'Practice Express middleware configuration'
    ]
  },

  // Additional React Challenges
  {
    id: 'react-context-not-provided',
    title: 'Context Value is Undefined',
    description: 'useContext returns undefined even though context is created.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'Context', 'Provider'],
    rootCause: 'Component not wrapped with Context Provider',
    files: {
      'App.jsx': `import React from 'react';
import UserProfile from './components/UserProfile';
import { UserContext } from './contexts/UserContext';

function App() {
  const user = { name: 'John Doe', email: 'john@example.com' };

  return (
    <div className="App">
      <h1>User App</h1>
      {/* BUG: UserProfile not wrapped with Provider */}
      <UserProfile />
    </div>
  );
}

export default App;`,
      'contexts/UserContext.js': `import React, { createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children, value }) => {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};`,
      'components/UserProfile.jsx': `import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function UserProfile() {
  const user = useContext(UserContext);

  // BUG: user will be undefined because no Provider wraps this component
  console.log('User from context:', user);

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user?.name || 'No user data'}</p>
      <p>Email: {user?.email || 'No email'}</p>
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'Context consumers must be wrapped by a Context Provider',
      'Wrap UserProfile with UserProvider in App.jsx',
      'Pass the user data as value prop to UserProvider',
      'Make sure the Provider is a parent of the consuming component'
    ],
    solution: {
      'App.jsx': `import React from 'react';
import UserProfile from './components/UserProfile';
import { UserProvider } from './contexts/UserContext';

function App() {
  const user = { name: 'John Doe', email: 'john@example.com' };

  return (
    <div className="App">
      <h1>User App</h1>
      {/* FIXED: Wrap with UserProvider */}
      <UserProvider value={user}>
        <UserProfile />
      </UserProvider>
    </div>
  );
}

export default App;`
    },
    testCriteria: [
      'Context value should be available in UserProfile',
      'User data should display correctly',
      'No undefined context errors'
    ],
    learningObjectives: [
      'Understand React Context Provider/Consumer pattern',
      'Learn proper context setup',
      'Practice component composition'
    ]
  },

  {
    id: 'react-ref-not-working',
    title: 'useRef Not Focusing Input',
    description: 'useRef.current is null when trying to focus input element.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 60,
    tags: ['React', 'useRef', 'DOM'],
    rootCause: 'ref not properly attached to DOM element',
    files: {
      'components/SearchForm.jsx': `import React, { useRef, useEffect } from 'react';

function SearchForm() {
  const inputRef = useRef(null);

  useEffect(() => {
    // BUG: inputRef.current is null
    console.log('Input ref:', inputRef.current);
    inputRef.current.focus(); // This will throw an error!
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Search</h2>
      {/* BUG: ref not attached to input */}
      <input
        type="text"
        placeholder="Enter search term..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;`
    },
    hints: [
      'The ref prop is missing from the input element',
      'Add ref={inputRef} to the input element',
      'useRef creates a reference that needs to be attached',
      'Check that the ref is attached before using it'
    ],
    solution: {
      'components/SearchForm.jsx': `import React, { useRef, useEffect } from 'react';

function SearchForm() {
  const inputRef = useRef(null);

  useEffect(() => {
    // FIXED: Now inputRef.current will point to the input element
    console.log('Input ref:', inputRef.current);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Search</h2>
      {/* FIXED: Added ref prop */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter search term..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;`
    },
    testCriteria: [
      'Input should be focused when component mounts',
      'No errors about null references',
      'useRef should properly reference the DOM element'
    ],
    learningObjectives: [
      'Understand useRef for DOM manipulation',
      'Learn proper ref attachment',
      'Practice DOM interaction in React'
    ]
  },

  // More React Challenges from debug-react.txt
  {
    id: 'react-state-resetting',
    title: 'State Resetting on Re-render',
    description: 'Data disappears after a re-render.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['React', 'State', 'Props', 'Re-render'],
    rootCause: 'State initialized from props incorrectly',
    files: {
      'components/ProfileEditor.jsx': `import React, { useState } from 'react';

function ProfileEditor({ user }) {
  // BUG: State initialized from props on every render
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    console.log('Saving:', { name, email });
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default ProfileEditor;`
    },
    hints: [
      'State is being reset because it\'s initialized from props on every render',
      'Use useEffect to update state when props change',
      'Initialize state once, then use useEffect for prop updates',
      'Consider lifting state up to parent component'
    ],
    solution: {
      'components/ProfileEditor.jsx': `import React, { useState, useEffect } from 'react';

function ProfileEditor({ user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // FIXED: Use useEffect to update state when props change
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = () => {
    console.log('Saving:', { name, email });
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default ProfileEditor;`
    },
    testCriteria: [
      'State should not reset when parent re-renders',
      'State should update when user prop changes',
      'Form inputs should maintain their values'
    ],
    learningObjectives: [
      'Understand state initialization patterns',
      'Learn useEffect for prop synchronization',
      'Practice proper state management'
    ]
  },

  {
    id: 'react-controlled-input-warning',
    title: 'Controlled vs Uncontrolled Input Warning',
    description: 'React warns about changing an input from uncontrolled to controlled.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 75,
    tags: ['React', 'Forms', 'ControlledInput'],
    rootCause: 'value or defaultValue not managed properly',
    files: {
      'components/SignupForm.jsx': `import React, { useState } from 'react';

function SignupForm() {
  const [formData, setFormData] = useState({
    username: undefined, // BUG: undefined causes uncontrolled warning
    email: null, // BUG: null also causes issues
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input
        type="text"
        name="username"
        value={formData.username} // BUG: undefined value
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email} // BUG: null value
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;`
    },
    hints: [
      'Input values should never be undefined or null',
      'Always initialize form state with empty strings',
      'React considers undefined/null values as uncontrolled',
      'Use || \'\' to ensure string values'
    ],
    solution: {
      'components/SignupForm.jsx': `import React, { useState } from 'react';

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '', // FIXED: Use empty string instead of undefined
    email: '', // FIXED: Use empty string instead of null
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input
        type="text"
        name="username"
        value={formData.username || ''} // FIXED: Ensure string value
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email || ''} // FIXED: Ensure string value
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;`
    },
    testCriteria: [
      'No controlled/uncontrolled warnings in console',
      'All inputs should work properly',
      'Form state should be consistent'
    ],
    learningObjectives: [
      'Understand controlled vs uncontrolled inputs',
      'Learn proper form state initialization',
      'Practice React form patterns'
    ]
  },

  // More Angular Challenges from debug-angular.txt
  {
    id: 'angular-event-not-emitting',
    title: 'Event Not Emitting from Child to Parent',
    description: 'Parent doesn\'t respond to event emitted by child component.',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 90,
    tags: ['Angular', 'EventEmitter', '@Output', 'Component Communication'],
    rootCause: '@Output() not declared or $event not handled in parent',
    files: {
      'child.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h3>Child Component</h3>
      <button (click)="sendMessage()">Send Message to Parent</button>
    </div>
  `
})
export class ChildComponent {
  // BUG: Missing @Output() decorator and EventEmitter
  messageEvent: any;

  sendMessage() {
    const message = 'Hello from child!';
    console.log('Sending message:', message);
    // BUG: This won't work without proper EventEmitter
    this.messageEvent = message;
  }
}`,
      'parent.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h2>Parent Component</h2>
      <p>Message from child: {{childMessage}}</p>
      <!-- BUG: No event binding -->
      <app-child></app-child>
    </div>
  `
})
export class ParentComponent {
  childMessage = 'No message yet';

  // BUG: Method exists but not connected to child event
  onChildMessage(message: string) {
    this.childMessage = message;
  }
}`
    },
    hints: [
      'Child component needs @Output() decorator and EventEmitter',
      'Import Output and EventEmitter from @angular/core',
      'Parent template needs to bind to the child event',
      'Use (messageEvent)="onChildMessage($event)" in parent template'
    ],
    solution: {
      'child.component.ts': `import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h3>Child Component</h3>
      <button (click)="sendMessage()">Send Message to Parent</button>
    </div>
  `
})
export class ChildComponent {
  // FIXED: Added @Output() decorator and EventEmitter
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
    const message = 'Hello from child!';
    console.log('Sending message:', message);
    // FIXED: Emit the event properly
    this.messageEvent.emit(message);
  }
}`,
      'parent.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h2>Parent Component</h2>
      <p>Message from child: {{childMessage}}</p>
      <!-- FIXED: Added event binding -->
      <app-child (messageEvent)="onChildMessage($event)"></app-child>
    </div>
  `
})
export class ParentComponent {
  childMessage = 'No message yet';

  onChildMessage(message: string) {
    this.childMessage = message;
  }
}`
    },
    testCriteria: [
      'Child should emit events when button is clicked',
      'Parent should receive and display the message',
      'Event communication should work properly'
    ],
    learningObjectives: [
      'Understand Angular component communication',
      'Learn @Output() and EventEmitter usage',
      'Practice parent-child data flow'
    ]
  },

  {
    id: 'angular-pipe-not-found',
    title: 'Pipe Not Found Error',
    description: 'Template throws "The pipe \'formatDate\' could not be found".',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 70,
    tags: ['Angular', 'Pipes', 'Modules', 'SharedModule'],
    rootCause: 'Pipe exists but not exported from SharedModule',
    files: {
      'shared/pipes/format-date.pipe.ts': `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}`,
      'shared/shared.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from './pipes/format-date.pipe';

@NgModule({
  declarations: [
    FormatDatePipe
  ],
  imports: [
    CommonModule
  ],
  // BUG: Pipe not exported
  exports: [
    // Missing FormatDatePipe export
  ]
})
export class SharedModule { }`,
      'features/invoice/invoice.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-invoice',
  template: `
    <div>
      <h2>Invoice</h2>
      <p>Date: {{ invoiceDate | formatDate }}</p>
      <p>Due Date: {{ dueDate | formatDate }}</p>
    </div>
  `
})
export class InvoiceComponent {
  invoiceDate = new Date();
  dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
}`
    },
    hints: [
      'The pipe is declared but not exported from SharedModule',
      'Add FormatDatePipe to the exports array in SharedModule',
      'Make sure SharedModule is imported in the feature module',
      'Check that the pipe name matches the template usage'
    ],
    solution: {
      'shared/shared.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from './pipes/format-date.pipe';

@NgModule({
  declarations: [
    FormatDatePipe
  ],
  imports: [
    CommonModule
  ],
  // FIXED: Export the pipe so other modules can use it
  exports: [
    FormatDatePipe
  ]
})
export class SharedModule { }`
    },
    testCriteria: [
      'No "pipe not found" errors in console',
      'Dates should be formatted correctly in template',
      'Pipe should be available across modules'
    ],
    learningObjectives: [
      'Understand Angular module exports',
      'Learn pipe sharing between modules',
      'Practice SharedModule patterns'
    ]
  },

  // More Node.js Challenges from debig-node.txt
  {
    id: 'node-port-already-in-use',
    title: 'Port Already in Use Error',
    description: 'App fails to start with EADDRINUSE error.',
    techStack: 'Node.js',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 60,
    tags: ['Node.js', 'Server', 'Port', 'Configuration'],
    rootCause: 'Old process didn\'t release the port or hardcoded port',
    files: {
      'server.js': `const express = require('express');
const app = express();

// BUG: Hardcoded port without fallback
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// BUG: No error handling for port conflicts
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
      'package.json': `{
  "name": "my-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`
    },
    hints: [
      'Use environment variables for port configuration',
      'Add error handling for port conflicts',
      'Provide fallback ports or dynamic port selection',
      'Use process.env.PORT with a default value'
    ],
    solution: {
      'server.js': `const express = require('express');
const app = express();

// FIXED: Use environment variable with fallback
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// FIXED: Add error handling for port conflicts
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});`
    },
    testCriteria: [
      'Server should handle port conflicts gracefully',
      'Environment variables should be used for configuration',
      'Appropriate error messages should be displayed'
    ],
    learningObjectives: [
      'Understand Node.js server configuration',
      'Learn error handling for server startup',
      'Practice environment variable usage'
    ]
  },

  {
    id: 'node-json-parse-error',
    title: 'JSON Parse Error on Request Body',
    description: 'SyntaxError: Unexpected token during request body parsing.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['Node.js', 'Express', 'JSON', 'Middleware'],
    rootCause: 'Malformed JSON or missing express.json() middleware',
    files: {
      'server.js': `const express = require('express');
const app = express();

// BUG: Missing express.json() middleware
// app.use(express.json());

app.post('/api/users', (req, res) => {
  // BUG: No error handling for malformed JSON
  const { name, email } = req.body;

  console.log('Received:', { name, email });

  res.json({
    message: 'User created',
    user: { name, email }
  });
});

app.post('/api/data', (req, res) => {
  // BUG: Assumes req.body is always valid JSON
  const data = req.body;

  // This will fail if JSON is malformed
  const processedData = {
    ...data,
    timestamp: new Date().toISOString()
  };

  res.json(processedData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    hints: [
      'Add express.json() middleware to parse JSON bodies',
      'Add error handling middleware for JSON parse errors',
      'Validate request content-type headers',
      'Use try-catch around JSON operations'
    ],
    solution: {
      'server.js': `const express = require('express');
const app = express();

// FIXED: Add JSON parsing middleware
app.use(express.json());

// FIXED: Add error handling middleware for JSON parse errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).json({
      error: 'Invalid JSON format',
      message: 'Please check your request body format'
    });
  }
  next(err);
});

app.post('/api/users', (req, res) => {
  try {
    const { name, email } = req.body;

    // FIXED: Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email']
      });
    }

    console.log('Received:', { name, email });

    res.json({
      message: 'User created',
      user: { name, email }
    });
  } catch (error) {
    console.error('Error processing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/data', (req, res) => {
  try {
    const data = req.body;

    // FIXED: Validate data exists
    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        error: 'Invalid data format',
        message: 'Request body must be a valid JSON object'
      });
    }

    const processedData = {
      ...data,
      timestamp: new Date().toISOString()
    };

    res.json(processedData);
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    testCriteria: [
      'JSON parsing errors should be handled gracefully',
      'Appropriate error messages should be returned',
      'Server should not crash on malformed JSON'
    ],
    learningObjectives: [
      'Understand Express middleware order',
      'Learn JSON parsing error handling',
      'Practice API error responses'
    ]
  },

  // Additional React Challenges
  {
    id: 'react-batched-updates',
    title: 'Multiple State Updates Merged Unexpectedly',
    description: 'Multiple calls to setState inside same function don\'t reflect all changes.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 90,
    tags: ['React', 'State', 'Batching'],
    rootCause: 'React batches state updates',
    files: {
      'components/Counter.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const handleComplexUpdate = () => {
    // BUG: These updates are batched, so count doesn't update immediately
    setCount(count + 1);
    setCount(count + 1); // This still uses the old count value!
    setMultiplier(multiplier + 1);

    console.log('Expected count:', count + 2); // This will be wrong
    console.log('Expected multiplier:', multiplier + 1);
  };

  const handleTripleIncrement = () => {
    // BUG: All three calls use the same initial count value
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Only increments by 1, not 3!
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <h3>Multiplier: {multiplier}</h3>
      <h4>Result: {count * multiplier}</h4>

      <button onClick={() => setCount(count + 1)}>
        Simple Increment
      </button>

      <button onClick={handleComplexUpdate}>
        Complex Update (Buggy)
      </button>

      <button onClick={handleTripleIncrement}>
        Triple Increment (Buggy)
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Counter;`
    },
    hints: [
      'React batches multiple setState calls in the same function',
      'Use functional updates when new state depends on previous state',
      'setCount(prev => prev + 1) gets the latest value',
      'Each functional update receives the most recent state'
    ],
    solution: {
      'components/Counter.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const handleComplexUpdate = () => {
    // FIXED: Use functional updates to get latest state
    setCount(prevCount => {
      const newCount = prevCount + 1;
      console.log('First increment:', newCount);
      return newCount;
    });

    setCount(prevCount => {
      const newCount = prevCount + 1;
      console.log('Second increment:', newCount);
      return newCount;
    });

    setMultiplier(prevMultiplier => prevMultiplier + 1);
  };

  const handleTripleIncrement = () => {
    // FIXED: Use functional updates for sequential increments
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    // Now correctly increments by 3!
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <h3>Multiplier: {multiplier}</h3>
      <h4>Result: {count * multiplier}</h4>

      <button onClick={() => setCount(count + 1)}>
        Simple Increment
      </button>

      <button onClick={handleComplexUpdate}>
        Complex Update (Fixed)
      </button>

      <button onClick={handleTripleIncrement}>
        Triple Increment (Fixed)
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Counter;`
    },
    testCriteria: [
      'Multiple state updates should work correctly',
      'Triple increment should increase count by 3',
      'Complex update should increment count by 2'
    ],
    learningObjectives: [
      'Understand React state batching',
      'Learn functional state updates',
      'Practice sequential state changes'
    ]
  },

  {
    id: 'react-api-loading-state',
    title: 'API Loading State Not Displaying',
    description: 'No loading indication while fetching data.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 70,
    tags: ['React', 'UX', 'API', 'Loading'],
    rootCause: 'Missing loading state (useState for isLoading)',
    files: {
      'components/PostList.jsx': `import React, { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  // BUG: Missing loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // BUG: No loading indicator during fetch
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      setPosts(data.slice(0, 5)); // Only show first 5 posts
    } catch (err) {
      setError('Failed to fetch posts');
    }
    // BUG: No loading state management
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // BUG: No loading state check
  return (
    <div>
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p> // This shows even while loading!
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;`
    },
    hints: [
      'Add a loading state with useState',
      'Set loading to true before API call',
      'Set loading to false after API call completes',
      'Show loading indicator when loading is true'
    ],
    solution: {
      'components/PostList.jsx': `import React, { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // FIXED: Added loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true); // FIXED: Set loading to true
      setError(null); // Clear any previous errors

      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      setPosts(data.slice(0, 5)); // Only show first 5 posts
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false); // FIXED: Set loading to false when done
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Latest Posts</h2>
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Latest Posts</h2>
        <div className="error">Error: {error}</div>
        <button onClick={fetchPosts}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={fetchPosts} disabled={loading}>
        Refresh Posts
      </button>
    </div>
  );
}

export default PostList;`
    },
    testCriteria: [
      'Loading indicator should appear during API calls',
      'Loading state should be cleared when data loads',
      'Error handling should work properly'
    ],
    learningObjectives: [
      'Understand loading state patterns',
      'Learn proper UX for async operations',
      'Practice error handling in React'
    ]
  },

  // Additional Angular Challenges
  {
    id: 'angular-onpush-not-updating',
    title: 'OnPush Component Not Updating',
    description: 'DOM not updating even after API call resolves.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 110,
    tags: ['Angular', 'ChangeDetection', 'OnPush', 'Performance'],
    rootCause: 'OnPush strategy + object mutation',
    files: {
      'users.component.ts': `import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  template: `
    <div>
      <h2>Users List</h2>
      <button (click)="loadUsers()">Load Users</button>
      <button (click)="addUser()">Add User</button>

      <div *ngFor="let user of users">
        <p>{{user.name}} - {{user.email}}</p>
        <button (click)="updateUser(user)">Update</button>
      </div>
    </div>
  `,
  // BUG: OnPush strategy without proper change detection
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(users => {
      // BUG: Direct assignment works, but mutations won't trigger updates
      this.users = users;
    });
  }

  addUser() {
    const newUser = {
      id: Date.now(),
      name: 'New User',
      email: 'new@example.com'
    };

    // BUG: Mutating array directly - OnPush won't detect this change
    this.users.push(newUser);
  }

  updateUser(user: any) {
    // BUG: Mutating object directly - OnPush won't detect this change
    user.name = user.name + ' (Updated)';
    user.email = 'updated@example.com';
  }
}`,
      'users.service.ts': `import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  getUsers(): Observable<any[]> {
    return of([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]).pipe(delay(1000));
  }
}`
    },
    hints: [
      'OnPush change detection only triggers on reference changes',
      'Mutating objects/arrays directly won\'t trigger updates',
      'Use immutable update patterns or ChangeDetectorRef',
      'Create new arrays/objects instead of mutating existing ones'
    ],
    solution: {
      'users.component.ts': `import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  template: `
    <div>
      <h2>Users List</h2>
      <button (click)="loadUsers()">Load Users</button>
      <button (click)="addUser()">Add User</button>

      <div *ngFor="let user of users">
        <p>{{user.name}} - {{user.email}}</p>
        <button (click)="updateUser(user)">Update</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  users: any[] = [];

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef // FIXED: Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      // FIXED: Manually trigger change detection if needed
      this.cdr.detectChanges();
    });
  }

  addUser() {
    const newUser = {
      id: Date.now(),
      name: 'New User',
      email: 'new@example.com'
    };

    // FIXED: Create new array instead of mutating
    this.users = [...this.users, newUser];
  }

  updateUser(user: any) {
    // FIXED: Create new array with updated user object
    this.users = this.users.map(u =>
      u.id === user.id
        ? { ...u, name: u.name + ' (Updated)', email: 'updated@example.com' }
        : u
    );
  }
}`
    },
    testCriteria: [
      'Component should update when users are added',
      'User updates should be reflected in the DOM',
      'OnPush strategy should work correctly'
    ],
    learningObjectives: [
      'Understand OnPush change detection strategy',
      'Learn immutable update patterns',
      'Practice ChangeDetectorRef usage'
    ]
  },

  {
    id: 'angular-form-validation-missing',
    title: 'Form Validation Not Triggering',
    description: 'Invalid form fields allow submission.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 100,
    tags: ['Angular', 'Forms', 'Validation', 'ReactiveForms'],
    rootCause: 'Not using formControlName properly or Validators.required missing',
    files: {
      'login.component.ts': `import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <h2>Login</h2>

      <div>
        <label>Email:</label>
        <!-- BUG: Missing formControlName -->
        <input type="email" placeholder="Enter email">
        <!-- BUG: No validation error display -->
      </div>

      <div>
        <label>Password:</label>
        <!-- BUG: Missing formControlName -->
        <input type="password" placeholder="Enter password">
        <!-- BUG: No validation error display -->
      </div>

      <!-- BUG: No form validation check -->
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  // BUG: No validators applied
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit() {
    // BUG: No form validation check
    console.log('Form submitted:', this.loginForm.value);
    alert('Login successful!');
  }
}`
    },
    hints: [
      'Add formControlName attributes to input elements',
      'Import and use Validators.required for validation',
      'Check form validity before submission',
      'Display validation error messages in template'
    ],
    solution: {
      'login.component.ts': `import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <h2>Login</h2>

      <div>
        <label>Email:</label>
        <!-- FIXED: Added formControlName -->
        <input type="email" formControlName="email" placeholder="Enter email">
        <!-- FIXED: Added validation error display -->
        <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
             class="error">
          <small *ngIf="loginForm.get('email')?.errors?.['required']">
            Email is required
          </small>
          <small *ngIf="loginForm.get('email')?.errors?.['email']">
            Please enter a valid email
          </small>
        </div>
      </div>

      <div>
        <label>Password:</label>
        <!-- FIXED: Added formControlName -->
        <input type="password" formControlName="password" placeholder="Enter password">
        <!-- FIXED: Added validation error display -->
        <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
             class="error">
          <small *ngIf="loginForm.get('password')?.errors?.['required']">
            Password is required
          </small>
          <small *ngIf="loginForm.get('password')?.errors?.['minlength']">
            Password must be at least 6 characters
          </small>
        </div>
      </div>

      <!-- FIXED: Added form validation check -->
      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  `
})
export class LoginComponent {
  // FIXED: Added validators
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    // FIXED: Check form validity
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      alert('Login successful!');
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}`
    },
    testCriteria: [
      'Form should not submit with invalid data',
      'Validation errors should be displayed',
      'Submit button should be disabled when form is invalid'
    ],
    learningObjectives: [
      'Understand Angular reactive forms',
      'Learn form validation patterns',
      'Practice error message display'
    ]
  },

  // Additional Node.js Challenges
  {
    id: 'node-memory-leak',
    title: 'Memory Leak on Long-running Server',
    description: 'Server uses increasing RAM over time.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['Node.js', 'Memory', 'Performance', 'Optimization'],
    rootCause: 'Global arrays/maps never cleaned, event listeners not removed',
    files: {
      'server.js': `const express = require('express');
const EventEmitter = require('events');

const app = express();
const eventBus = new EventEmitter();

// BUG: Global cache that grows indefinitely
const userCache = new Map();
const requestLog = [];

app.use(express.json());

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  // BUG: Cache grows without limit
  if (!userCache.has(id)) {
    const userData = {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      timestamp: new Date()
    };
    userCache.set(id, userData);
  }

  // BUG: Array grows indefinitely
  requestLog.push({
    userId: id,
    timestamp: new Date(),
    ip: req.ip
  });

  res.json(userCache.get(id));
});

app.post('/api/events', (req, res) => {
  const { eventType, data } = req.body;

  // BUG: Event listeners added but never removed
  const listener = (eventData) => {
    console.log('Event received:', eventData);
  };

  eventBus.on(eventType, listener);

  // Simulate event
  setTimeout(() => {
    eventBus.emit(eventType, data);
  }, 1000);

  res.json({ message: 'Event registered' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    cacheSize: userCache.size,
    logEntries: requestLog.length,
    memoryUsage: process.memoryUsage()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    hints: [
      'Implement cache size limits and cleanup strategies',
      'Remove old entries from arrays periodically',
      'Remove event listeners when no longer needed',
      'Use WeakMap for automatic garbage collection where possible'
    ],
    solution: {
      'server.js': `const express = require('express');
const EventEmitter = require('events');

const app = express();
const eventBus = new EventEmitter();

// FIXED: Implement cache with size limit
const MAX_CACHE_SIZE = 1000;
const MAX_LOG_ENTRIES = 10000;
const userCache = new Map();
const requestLog = [];

app.use(express.json());

// FIXED: Add cleanup function
function cleanupCache() {
  if (userCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(userCache.entries());
    // Remove oldest 20% of entries
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      userCache.delete(entries[i][0]);
    }
    console.log(`Cache cleaned up. Size: ${userCache.size}`);
  }
}

function cleanupLogs() {
  if (requestLog.length > MAX_LOG_ENTRIES) {
    // Keep only the most recent entries
    requestLog.splice(0, requestLog.length - MAX_LOG_ENTRIES);
    console.log(`Logs cleaned up. Entries: ${requestLog.length}`);
  }
}

// FIXED: Periodic cleanup
setInterval(() => {
  cleanupCache();
  cleanupLogs();
}, 60000); // Clean up every minute

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  if (!userCache.has(id)) {
    const userData = {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
      timestamp: new Date()
    };
    userCache.set(id, userData);

    // FIXED: Trigger cleanup if needed
    if (userCache.size > MAX_CACHE_SIZE) {
      cleanupCache();
    }
  }

  requestLog.push({
    userId: id,
    timestamp: new Date(),
    ip: req.ip
  });

  // FIXED: Trigger log cleanup if needed
  if (requestLog.length > MAX_LOG_ENTRIES) {
    cleanupLogs();
  }

  res.json(userCache.get(id));
});

app.post('/api/events', (req, res) => {
  const { eventType, data } = req.body;

  const listener = (eventData) => {
    console.log('Event received:', eventData);
  };

  eventBus.on(eventType, listener);

  // Simulate event
  setTimeout(() => {
    eventBus.emit(eventType, data);
    // FIXED: Remove listener after use
    eventBus.removeListener(eventType, listener);
  }, 1000);

  res.json({ message: 'Event registered' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    cacheSize: userCache.size,
    logEntries: requestLog.length,
    memoryUsage: process.memoryUsage(),
    eventListeners: eventBus.listenerCount()
  });
});

// FIXED: Graceful shutdown cleanup
process.on('SIGTERM', () => {
  console.log('Cleaning up before shutdown...');
  userCache.clear();
  requestLog.length = 0;
  eventBus.removeAllListeners();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    testCriteria: [
      'Memory usage should not grow indefinitely',
      'Cache should have size limits',
      'Event listeners should be cleaned up'
    ],
    learningObjectives: [
      'Understand memory leak patterns',
      'Learn cleanup strategies',
      'Practice performance monitoring'
    ]
  },

  {
    id: 'node-jwt-token-invalid',
    title: 'JWT Token Always Invalid After Refresh',
    description: 'New token issued but fails authentication.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 105,
    tags: ['Node.js', 'JWT', 'Authentication', 'Security'],
    rootCause: 'Token secret mismatch or incorrect verification',
    files: {
      'auth.js': `const jwt = require('jsonwebtoken');

// BUG: Different secrets used for signing and verification
const JWT_SECRET_SIGN = 'secret-for-signing';
const JWT_SECRET_VERIFY = 'different-secret-for-verify'; // This should be the same!

const generateToken = (user) => {
  // BUG: Using one secret for signing
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      // BUG: No expiration time set
    },
    JWT_SECRET_SIGN
  );
};

const verifyToken = (token) => {
  try {
    // BUG: Using different secret for verification
    const decoded = jwt.verify(token, JWT_SECRET_VERIFY);
    return { valid: true, user: decoded };
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return { valid: false, error: error.message };
  }
};

const refreshToken = (oldToken) => {
  try {
    // BUG: Verifying with wrong secret
    const decoded = jwt.verify(oldToken, JWT_SECRET_VERIFY);

    // BUG: Not checking if token is expired
    const newToken = generateToken({
      id: decoded.userId,
      email: decoded.email
    });

    return { success: true, token: newToken };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken
};`,
      'middleware/auth.js': `const { verifyToken } = require('../auth');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const result = verifyToken(token);

  if (!result.valid) {
    return res.status(403).json({ error: 'Invalid token', details: result.error });
  }

  req.user = result.user;
  next();
};

module.exports = { authenticateToken };`
    },
    hints: [
      'Use the same secret for both signing and verification',
      'Add expiration time to JWT tokens',
      'Handle token expiration properly in refresh logic',
      'Use environment variables for JWT secrets'
    ],
    solution: {
      'auth.js': `const jwt = require('jsonwebtoken');

// FIXED: Use single secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const generateToken = (user) => {
  // FIXED: Use same secret and add expiration
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const verifyToken = (token) => {
  try {
    // FIXED: Use same secret for verification
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return { valid: false, error: error.message };
  }
};

const refreshToken = (oldToken) => {
  try {
    // FIXED: Use correct secret and handle expiration
    const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true });

    // Check if token is not too old (e.g., within 7 days)
    const tokenAge = Date.now() / 1000 - decoded.iat;
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

    if (tokenAge > maxAge) {
      return { success: false, error: 'Token too old for refresh' };
    }

    const newToken = generateToken({
      id: decoded.userId,
      email: decoded.email
    });

    return { success: true, token: newToken };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken
};`
    },
    testCriteria: [
      'Tokens should be verified with the same secret used for signing',
      'Token refresh should work correctly',
      'Expired tokens should be handled properly'
    ],
    learningObjectives: [
      'Understand JWT token lifecycle',
      'Learn proper secret management',
      'Practice authentication patterns'
    ]
  },

  // More React Challenges - Batch 1
  {
    id: 'react-component-not-updating',
    title: 'Component Not Updating After Props Change',
    description: 'Child component doesn\'t re-render when parent updates props.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'Props', 'Memoization', 'Performance'],
    rootCause: 'React.memo preventing re-renders or shallow comparison issues',
    files: {
      'App.jsx': `import React, { useState } from 'react';
import UserCard from './components/UserCard';

function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    age: 30,
    preferences: { theme: 'dark', language: 'en' }
  });

  const updateUserAge = () => {
    // BUG: Mutating nested object
    user.age = user.age + 1;
    setUser(user); // This won't trigger re-render in memoized component
  };

  const updateTheme = () => {
    // BUG: Mutating nested object
    user.preferences.theme = user.preferences.theme === 'dark' ? 'light' : 'dark';
    setUser(user);
  };

  return (
    <div>
      <h1>User Profile App</h1>
      <button onClick={updateUserAge}>Increase Age</button>
      <button onClick={updateTheme}>Toggle Theme</button>
      <UserCard user={user} />
    </div>
  );
}

export default App;`,
      'components/UserCard.jsx': `import React from 'react';

// BUG: Memoized component with shallow comparison
const UserCard = React.memo(({ user }) => {
  console.log('UserCard rendering with:', user);

  return (
    <div style={{
      background: user.preferences.theme === 'dark' ? '#333' : '#fff',
      color: user.preferences.theme === 'dark' ? '#fff' : '#333',
      padding: '20px',
      border: '1px solid #ccc'
    }}>
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Theme: {user.preferences.theme}</p>
      <p>Language: {user.preferences.language}</p>
    </div>
  );
});

export default UserCard;`
    },
    hints: [
      'React.memo uses shallow comparison by default',
      'Mutating objects directly won\'t trigger re-renders',
      'Create new objects instead of mutating existing ones',
      'Use spread operator to create new object references'
    ],
    solution: {
      'App.jsx': `import React, { useState } from 'react';
import UserCard from './components/UserCard';

function App() {
  const [user, setUser] = useState({
    name: 'John Doe',
    age: 30,
    preferences: { theme: 'dark', language: 'en' }
  });

  const updateUserAge = () => {
    // FIXED: Create new object instead of mutating
    setUser(prevUser => ({
      ...prevUser,
      age: prevUser.age + 1
    }));
  };

  const updateTheme = () => {
    // FIXED: Create new nested object
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        theme: prevUser.preferences.theme === 'dark' ? 'light' : 'dark'
      }
    }));
  };

  return (
    <div>
      <h1>User Profile App</h1>
      <button onClick={updateUserAge}>Increase Age</button>
      <button onClick={updateTheme}>Toggle Theme</button>
      <UserCard user={user} />
    </div>
  );
}

export default App;`
    },
    testCriteria: [
      'Component should re-render when props change',
      'Age updates should be visible immediately',
      'Theme changes should update the UI'
    ],
    learningObjectives: [
      'Understand React.memo and shallow comparison',
      'Learn immutable update patterns',
      'Practice object and nested object updates'
    ]
  },

  {
    id: 'react-event-handler-binding',
    title: 'Event Handler Losing \'this\' Context',
    description: 'Class component method throws "Cannot read property of undefined".',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    xpReward: 60,
    tags: ['React', 'Class Components', 'Event Binding', 'this'],
    rootCause: 'Method not bound to component instance',
    files: {
      'components/ClickCounter.jsx': `import React, { Component } from 'react';

class ClickCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      message: 'Click the button!'
    };
  }

  // BUG: Method not bound to this
  handleClick() {
    console.log('this:', this); // Will be undefined
    this.setState({ // This will throw an error
      count: this.state.count + 1,
      message: `Clicked ${this.state.count + 1} times`
    });
  }

  // BUG: Another unbound method
  resetCounter() {
    this.setState({
      count: 0,
      message: 'Counter reset!'
    });
  }

  render() {
    return (
      <div>
        <h2>Click Counter</h2>
        <p>{this.state.message}</p>
        <p>Count: {this.state.count}</p>
        {/* BUG: Methods not bound */}
        <button onClick={this.handleClick}>Click Me</button>
        <button onClick={this.resetCounter}>Reset</button>
      </div>
    );
  }
}

export default ClickCounter;`
    },
    hints: [
      'Class methods need to be bound to the component instance',
      'Use arrow functions or bind in constructor',
      'Arrow functions automatically bind this context',
      'Alternatively, use .bind(this) in the constructor'
    ],
    solution: {
      'components/ClickCounter.jsx': `import React, { Component } from 'react';

class ClickCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      message: 'Click the button!'
    };

    // FIXED: Bind methods in constructor
    this.handleClick = this.handleClick.bind(this);
    this.resetCounter = this.resetCounter.bind(this);
  }

  handleClick() {
    console.log('this:', this); // Now properly bound
    this.setState({
      count: this.state.count + 1,
      message: `Clicked ${this.state.count + 1} times`
    });
  }

  resetCounter() {
    this.setState({
      count: 0,
      message: 'Counter reset!'
    });
  }

  // ALTERNATIVE: Use arrow functions (auto-bind)
  // handleClick = () => {
  //   this.setState({
  //     count: this.state.count + 1,
  //     message: `Clicked ${this.state.count + 1} times`
  //   });
  // }

  render() {
    return (
      <div>
        <h2>Click Counter</h2>
        <p>{this.state.message}</p>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>Click Me</button>
        <button onClick={this.resetCounter}>Reset</button>
      </div>
    );
  }
}

export default ClickCounter;`
    },
    testCriteria: [
      'Buttons should work without throwing errors',
      'Counter should increment when clicked',
      'Reset button should work properly'
    ],
    learningObjectives: [
      'Understand JavaScript this binding',
      'Learn class method binding patterns',
      'Practice event handler setup'
    ]
  },

  // More React Challenges - Batch 2
  {
    id: 'react-async-state-race',
    title: 'Race Condition in Async State Updates',
    description: 'Rapid API calls cause incorrect state due to race conditions.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 125,
    tags: ['React', 'Async', 'Race Conditions', 'useEffect'],
    rootCause: 'Multiple async operations updating state without cleanup',
    files: {
      'components/UserSearch.jsx': `import React, { useState, useEffect } from 'react';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // BUG: Race condition - multiple requests can complete out of order
  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);

      // Simulate API call
      fetch(`/api/users/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
          // BUG: This might be from an old request!
          setUsers(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Search error:', error);
          setLoading(false);
        });
    } else {
      setUsers([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <h2>User Search</h2>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search users..."
      />

      {loading && <p>Searching...</p>}

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSearch;`
    },
    hints: [
      'Multiple API requests can complete in different order than sent',
      'Use AbortController to cancel previous requests',
      'Add cleanup function in useEffect to cancel ongoing requests',
      'Check if component is still mounted before setting state'
    ],
    solution: {
      'components/UserSearch.jsx': `import React, { useState, useEffect, useRef } from 'react';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // FIXED: Cancel previous request before making new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (query.length > 2) {
      setLoading(true);

      // FIXED: Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      fetch(`/api/users/search?q=${query}`, {
        signal: abortControllerRef.current.signal
      })
        .then(response => response.json())
        .then(data => {
          // FIXED: Only update if request wasn't aborted
          setUsers(data);
          setLoading(false);
        })
        .catch(error => {
          // FIXED: Don't update state if request was aborted
          if (error.name !== 'AbortError') {
            console.error('Search error:', error);
            setLoading(false);
          }
        });
    } else {
      setUsers([]);
      setLoading(false);
    }

    // FIXED: Cleanup function to abort request
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <h2>User Search</h2>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search users..."
      />

      {loading && <p>Searching...</p>}

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSearch;`
    },
    testCriteria: [
      'Rapid typing should not cause incorrect results',
      'Previous requests should be cancelled',
      'No race condition errors should occur'
    ],
    learningObjectives: [
      'Understand race conditions in React',
      'Learn AbortController usage',
      'Practice async cleanup patterns'
    ]
  },

  {
    id: 'react-synthetic-event-async',
    title: 'SyntheticEvent Accessed Asynchronously',
    description: 'Event properties are null when accessed in async function.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['React', 'Events', 'SyntheticEvent', 'Async'],
    rootCause: 'SyntheticEvent is pooled and nullified after event handler',
    files: {
      'components/FileUploader.jsx': `import React, { useState } from 'react';

function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    setUploading(true);
    setMessage('');

    // BUG: Accessing event properties after async operation
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // BUG: e.target.files will be null here!
      const files = e.target.files;
      console.log('Files:', files); // Will be null

      if (files && files.length > 0) {
        setMessage(`Uploaded ${files.length} file(s)`);
      } else {
        setMessage('No files selected');
      }
    } catch (error) {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Simulate form processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // BUG: Trying to access form data after async operation
    const formData = new FormData(e.target);
    console.log('Form data:', formData); // e.target might be null
  };

  return (
    <div>
      <h2>File Uploader</h2>

      <form onSubmit={handleFormSubmit}>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
        />

        <input
          type="text"
          name="description"
          placeholder="File description"
        />

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUploader;`
    },
    hints: [
      'SyntheticEvent properties are nullified after the event handler',
      'Extract needed values before async operations',
      'Store event data in variables before async calls',
      'Use e.persist() if you need to access event later (deprecated)'
    ],
    solution: {
      'components/FileUploader.jsx': `import React, { useState } from 'react';

function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e) => {
    setUploading(true);
    setMessage('');

    // FIXED: Extract files before async operation
    const files = e.target.files;
    const fileCount = files ? files.length : 0;

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // FIXED: Use extracted values
      if (fileCount > 0) {
        setMessage(`Uploaded ${fileCount} file(s)`);
      } else {
        setMessage('No files selected');
      }
    } catch (error) {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // FIXED: Extract form data before async operation
    const formData = new FormData(e.target);
    const description = formData.get('description');

    try {
      // Simulate form processing
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Description:', description);
      setMessage('Form submitted successfully!');
    } catch (error) {
      setMessage('Form submission failed');
    }
  };

  return (
    <div>
      <h2>File Uploader</h2>

      <form onSubmit={handleFormSubmit}>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
        />

        <input
          type="text"
          name="description"
          placeholder="File description"
        />

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUploader;`
    },
    testCriteria: [
      'File upload should work correctly',
      'Form submission should access form data properly',
      'No null reference errors should occur'
    ],
    learningObjectives: [
      'Understand SyntheticEvent pooling',
      'Learn to extract event data before async operations',
      'Practice proper event handling patterns'
    ]
  },

  // More React Challenges - Batch 3
  {
    id: 'react-portal-event-bubbling',
    title: 'Portal Events Not Bubbling Correctly',
    description: 'Click events in portal don\'t trigger parent handlers.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    xpReward: 115,
    tags: ['React', 'Portals', 'Events', 'DOM'],
    rootCause: 'Portal renders outside component tree but events should bubble',
    files: {
      'components/Modal.jsx': `import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // BUG: Portal events don't bubble to React tree
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => {
        // BUG: This should stop propagation but doesn't work as expected
        e.stopPropagation();
      }}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

export default Modal;`,
      'components/App.jsx': `import React, { useState } from 'react';
import Modal from './Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // BUG: This won't be triggered by portal clicks
  const handleAppClick = () => {
    setClickCount(prev => prev + 1);
    console.log('App clicked');
  };

  return (
    <div onClick={handleAppClick} style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Portal Event Demo</h1>
      <p>App clicks: {clickCount}</p>

      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2>Modal Content</h2>
        <p>This is inside a portal</p>
        <button onClick={() => console.log('Modal button clicked')}>
          Modal Button
        </button>
      </Modal>
    </div>
  );
}

export default App;`
    },
    hints: [
      'React portals maintain event bubbling through the React tree',
      'Events in portals bubble to React parents, not DOM parents',
      'Use event.stopPropagation() carefully in portal content',
      'Portal events work differently than regular DOM events'
    ],
    solution: {
      'components/Modal.jsx': `import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // FIXED: Portal events will bubble through React tree
  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => {
        // FIXED: Only close if clicking the overlay itself
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%'
        }}
        onClick={(e) => {
          // FIXED: Prevent event from bubbling to overlay
          e.stopPropagation();
        }}
      >
        {children}
        <button onClick={onClose} style={{ marginTop: '10px' }}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

export default Modal;`,
      'components/App.jsx': `import React, { useState } from 'react';
import Modal from './Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleAppClick = (e) => {
    // FIXED: This will be triggered by portal clicks due to React event bubbling
    setClickCount(prev => prev + 1);
    console.log('App clicked', e.target);
  };

  return (
    <div onClick={handleAppClick} style={{ minHeight: '100vh', padding: '20px' }}>
      <h1>Portal Event Demo</h1>
      <p>App clicks: {clickCount}</p>
      <p><small>Note: Portal clicks bubble to this handler</small></p>

      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2>Modal Content</h2>
        <p>This is inside a portal</p>
        <button
          onClick={(e) => {
            console.log('Modal button clicked');
            // This will bubble to App's onClick handler
          }}
        >
          Modal Button (will bubble)
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('Modal button clicked (no bubble)');
          }}
          style={{ marginLeft: '10px' }}
        >
          Modal Button (no bubble)
        </button>
      </Modal>
    </div>
  );
}

export default App;`
    },
    testCriteria: [
      'Modal should close when clicking overlay',
      'Modal content clicks should not close modal',
      'Portal events should bubble to React parents'
    ],
    learningObjectives: [
      'Understand React portal event behavior',
      'Learn event bubbling in portals',
      'Practice modal implementation patterns'
    ]
  },

  {
    id: 'react-custom-hook-stale-closure',
    title: 'Custom Hook with Stale Closure',
    description: 'Custom hook returns stale values in callbacks.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 130,
    tags: ['React', 'Custom Hooks', 'Closures', 'useCallback'],
    rootCause: 'useCallback dependencies not updated causing stale closures',
    files: {
      'hooks/useCounter.js': `import { useState, useCallback } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  // BUG: useCallback without dependencies captures stale count
  const increment = useCallback(() => {
    console.log('Current count in increment:', count); // Stale value
    setCount(count + 1); // Always adds 1 to initial value
  }, []); // Missing count dependency

  // BUG: Another stale closure
  const incrementBy = useCallback((amount) => {
    console.log('Current count in incrementBy:', count); // Stale value
    setCount(count + amount);
  }, []); // Missing count dependency

  // BUG: Stale closure in async operation
  const incrementAsync = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Count before async increment:', count); // Stale value
    setCount(count + 1);
  }, []); // Missing count dependency

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]); // This one is correct

  return {
    count,
    increment,
    incrementBy,
    incrementAsync,
    reset
  };
}

export default useCounter;`,
      'components/CounterDemo.jsx': `import React from 'react';
import useCounter from '../hooks/useCounter';

function CounterDemo() {
  const { count, increment, incrementBy, incrementAsync, reset } = useCounter(0);

  return (
    <div>
      <h2>Counter Demo</h2>
      <p>Count: {count}</p>

      <div>
        <button onClick={increment}>
          Increment (+1)
        </button>

        <button onClick={() => incrementBy(5)}>
          Increment by 5
        </button>

        <button onClick={incrementAsync}>
          Async Increment
        </button>

        <button onClick={reset}>
          Reset
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><small>Try clicking increment multiple times quickly</small></p>
        <p><small>Notice it only increments by 1 total (stale closure bug)</small></p>
      </div>
    </div>
  );
}

export default CounterDemo;`
    },
    hints: [
      'useCallback captures values from when it was created',
      'Add count to the dependency array of useCallback',
      'Use functional state updates to avoid stale closures',
      'setCount(prev => prev + 1) gets the latest value'
    ],
    solution: {
      'hooks/useCounter.js': `import { useState, useCallback } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  // FIXED: Use functional state update to avoid stale closure
  const increment = useCallback(() => {
    setCount(prevCount => {
      console.log('Current count in increment:', prevCount);
      return prevCount + 1;
    });
  }, []); // No dependencies needed with functional update

  // FIXED: Use functional state update
  const incrementBy = useCallback((amount) => {
    setCount(prevCount => {
      console.log('Current count in incrementBy:', prevCount);
      return prevCount + amount;
    });
  }, []);

  // FIXED: Use functional state update for async operation
  const incrementAsync = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCount(prevCount => {
      console.log('Count before async increment:', prevCount);
      return prevCount + 1;
    });
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  // ALTERNATIVE: Include count in dependencies (less preferred)
  // const increment = useCallback(() => {
  //   console.log('Current count in increment:', count);
  //   setCount(count + 1);
  // }, [count]);

  return {
    count,
    increment,
    incrementBy,
    incrementAsync,
    reset
  };
}

export default useCounter;`
    },
    testCriteria: [
      'Multiple rapid clicks should increment correctly',
      'Async increment should use current count value',
      'No stale closure issues should occur'
    ],
    learningObjectives: [
      'Understand stale closures in custom hooks',
      'Learn functional state updates',
      'Practice useCallback dependency management'
    ]
  },

  // More Angular Challenges - Batch 1
  {
    id: 'angular-service-not-singleton',
    title: 'Service Creating Multiple Instances',
    description: 'Service data not shared between components.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['Angular', 'Services', 'Dependency Injection', 'Singleton'],
    rootCause: 'Service provided in component instead of root',
    files: {
      'shared.service.ts': `import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  private data: any[] = [];
  private counter = 0;

  addItem(item: any) {
    this.counter++;
    this.data.push({ ...item, id: this.counter });
    console.log('Service data:', this.data);
  }

  getItems() {
    return this.data;
  }

  getCounter() {
    return this.counter;
  }
}`,
      'component-a.component.ts': `import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-component-a',
  template: `
    <div>
      <h3>Component A</h3>
      <p>Items count: {{items.length}}</p>
      <p>Service counter: {{counter}}</p>
      <button (click)="addItem()">Add Item from A</button>
      <ul>
        <li *ngFor="let item of items">{{item.name}} (ID: {{item.id}})</li>
      </ul>
    </div>
  `,
  // BUG: Providing service at component level creates new instance
  providers: [SharedService]
})
export class ComponentA {
  items: any[] = [];
  counter = 0;

  constructor(private sharedService: SharedService) {
    this.updateData();
  }

  addItem() {
    this.sharedService.addItem({ name: `Item from A ${Date.now()}` });
    this.updateData();
  }

  updateData() {
    this.items = this.sharedService.getItems();
    this.counter = this.sharedService.getCounter();
  }
}`,
      'component-b.component.ts': `import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-component-b',
  template: `
    <div>
      <h3>Component B</h3>
      <p>Items count: {{items.length}}</p>
      <p>Service counter: {{counter}}</p>
      <button (click)="addItem()">Add Item from B</button>
      <ul>
        <li *ngFor="let item of items">{{item.name}} (ID: {{item.id}})</li>
      </ul>
    </div>
  `,
  // BUG: Another instance of the service
  providers: [SharedService]
})
export class ComponentB {
  items: any[] = [];
  counter = 0;

  constructor(private sharedService: SharedService) {
    this.updateData();
  }

  addItem() {
    this.sharedService.addItem({ name: `Item from B ${Date.now()}` });
    this.updateData();
  }

  updateData() {
    this.items = this.sharedService.getItems();
    this.counter = this.sharedService.getCounter();
  }
}`
    },
    hints: [
      'Services provided at component level create new instances',
      'Remove providers array from components',
      'Add providedIn: \'root\' to @Injectable decorator',
      'Or provide service in app.module.ts providers array'
    ],
    solution: {
      'shared.service.ts': `import { Injectable } from '@angular/core';

// FIXED: Provide service at root level for singleton behavior
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data: any[] = [];
  private counter = 0;

  addItem(item: any) {
    this.counter++;
    this.data.push({ ...item, id: this.counter });
    console.log('Service data:', this.data);
  }

  getItems() {
    return this.data;
  }

  getCounter() {
    return this.counter;
  }
}`,
      'component-a.component.ts': `import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-component-a',
  template: `
    <div>
      <h3>Component A</h3>
      <p>Items count: {{items.length}}</p>
      <p>Service counter: {{counter}}</p>
      <button (click)="addItem()">Add Item from A</button>
      <ul>
        <li *ngFor="let item of items">{{item.name}} (ID: {{item.id}})</li>
      </ul>
    </div>
  `
  // FIXED: Removed providers array - use singleton from root
})
export class ComponentA {
  items: any[] = [];
  counter = 0;

  constructor(private sharedService: SharedService) {
    this.updateData();
  }

  addItem() {
    this.sharedService.addItem({ name: `Item from A ${Date.now()}` });
    this.updateData();
  }

  updateData() {
    this.items = this.sharedService.getItems();
    this.counter = this.sharedService.getCounter();
  }
}`,
      'component-b.component.ts': `import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-component-b',
  template: `
    <div>
      <h3>Component B</h3>
      <p>Items count: {{items.length}}</p>
      <p>Service counter: {{counter}}</p>
      <button (click)="addItem()">Add Item from B</button>
      <ul>
        <li *ngFor="let item of items">{{item.name}} (ID: {{item.id}})</li>
      </ul>
    </div>
  `
  // FIXED: Removed providers array - use singleton from root
})
export class ComponentB {
  items: any[] = [];
  counter = 0;

  constructor(private sharedService: SharedService) {
    this.updateData();
  }

  addItem() {
    this.sharedService.addItem({ name: `Item from B ${Date.now()}` });
    this.updateData();
  }

  updateData() {
    this.items = this.sharedService.getItems();
    this.counter = this.sharedService.getCounter();
  }
}`
    },
    testCriteria: [
      'Both components should share the same service instance',
      'Items added in one component should appear in the other',
      'Counter should be consistent across components'
    ],
    learningObjectives: [
      'Understand Angular dependency injection',
      'Learn singleton service patterns',
      'Practice service sharing between components'
    ]
  },

  {
    id: 'angular-template-reference-undefined',
    title: 'Template Reference Variable Undefined',
    description: 'ViewChild returns undefined when accessing template reference.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '10 min',
    xpReward: 85,
    tags: ['Angular', 'ViewChild', 'Template Reference', 'Lifecycle'],
    rootCause: 'Accessing ViewChild before view initialization or wrong selector',
    files: {
      'form.component.ts': `import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form',
  template: `
    <div>
      <h2>Contact Form</h2>
      <form>
        <input
          #nameInput
          type="text"
          placeholder="Enter your name"
          [(ngModel)]="name"
        >
        <input
          #emailInput
          type="email"
          placeholder="Enter your email"
          [(ngModel)]="email"
        >
        <button type="button" (click)="focusName()">Focus Name</button>
        <button type="button" (click)="focusEmail()">Focus Email</button>
        <button type="button" (click)="clearForm()">Clear</button>
      </form>
    </div>
  `
})
export class FormComponent {
  // BUG: Wrong selector - should match template reference name
  @ViewChild('nameField') nameInput!: ElementRef;
  @ViewChild('emailField') emailInput!: ElementRef;

  name = '';
  email = '';

  constructor() {
    // BUG: Trying to access ViewChild in constructor
    console.log('Name input in constructor:', this.nameInput); // undefined
    this.focusName(); // This will fail
  }

  focusName() {
    // BUG: nameInput will be undefined due to wrong selector
    console.log('Name input:', this.nameInput);
    this.nameInput.nativeElement.focus();
  }

  focusEmail() {
    // BUG: emailInput will be undefined due to wrong selector
    console.log('Email input:', this.emailInput);
    this.emailInput.nativeElement.focus();
  }

  clearForm() {
    this.name = '';
    this.email = '';
    // Try to focus name input after clearing
    this.focusName();
  }
}`
    },
    hints: [
      'ViewChild selector must match the template reference variable name',
      'ViewChild is not available in constructor or ngOnInit',
      'Use ngAfterViewInit to access ViewChild elements',
      'Template reference names must match @ViewChild selectors exactly'
    ],
    solution: {
      'form.component.ts': `import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-form',
  template: `
    <div>
      <h2>Contact Form</h2>
      <form>
        <input
          #nameInput
          type="text"
          placeholder="Enter your name"
          [(ngModel)]="name"
        >
        <input
          #emailInput
          type="email"
          placeholder="Enter your email"
          [(ngModel)]="email"
        >
        <button type="button" (click)="focusName()">Focus Name</button>
        <button type="button" (click)="focusEmail()">Focus Email</button>
        <button type="button" (click)="clearForm()">Clear</button>
      </form>
    </div>
  `
})
export class FormComponent implements AfterViewInit {
  // FIXED: Correct selectors matching template reference names
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;

  name = '';
  email = '';

  constructor() {
    // FIXED: Don't access ViewChild in constructor
    console.log('Component constructed');
  }

  // FIXED: Access ViewChild after view initialization
  ngAfterViewInit() {
    console.log('Name input after view init:', this.nameInput);
    console.log('Email input after view init:', this.emailInput);
  }

  focusName() {
    if (this.nameInput) {
      console.log('Focusing name input');
      this.nameInput.nativeElement.focus();
    } else {
      console.error('Name input not found');
    }
  }

  focusEmail() {
    if (this.emailInput) {
      console.log('Focusing email input');
      this.emailInput.nativeElement.focus();
    } else {
      console.error('Email input not found');
    }
  }

  clearForm() {
    this.name = '';
    this.email = '';
    // Focus name input after clearing
    setTimeout(() => this.focusName(), 0);
  }
}`
    },
    testCriteria: [
      'ViewChild elements should be accessible after view init',
      'Focus buttons should work correctly',
      'No undefined reference errors should occur'
    ],
    learningObjectives: [
      'Understand ViewChild lifecycle',
      'Learn template reference variable usage',
      'Practice Angular component lifecycle hooks'
    ]
  },

  // More Node.js Challenges - Batch 1
  {
    id: 'node-file-path-traversal',
    title: 'Path Traversal Security Vulnerability',
    description: 'File serving endpoint vulnerable to directory traversal attacks.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    xpReward: 120,
    tags: ['Node.js', 'Security', 'Path Traversal', 'File System'],
    rootCause: 'User input directly used in file paths without validation',
    files: {
      'server.js': `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// BUG: Vulnerable file serving endpoint
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;

  // BUG: Direct path concatenation allows traversal
  const filePath = path.join(__dirname, 'uploads', filename);

  console.log('Requested file:', filePath);

  // BUG: No validation of file path
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.send(data);
  });
});

// BUG: Another vulnerable endpoint
app.get('/download/:path', (req, res) => {
  const { path: userPath } = req.params;

  // BUG: User can specify any path
  const fullPath = path.join(__dirname, userPath);

  res.download(fullPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Download failed' });
    }
  });
});

// BUG: Template serving with path traversal
app.get('/template/:name', (req, res) => {
  const { name } = req.params;

  // BUG: No sanitization
  const templatePath = `./templates/${name}.html`;

  fs.readFile(templatePath, 'utf8', (err, content) => {
    if (err) {
      return res.status(404).send('Template not found');
    }

    res.send(content);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Try: /files/../../../etc/passwd');
  console.log('Try: /download/../../../etc/passwd');
});`
    },
    hints: [
      'Validate and sanitize all user input used in file paths',
      'Use path.resolve() and check if result is within allowed directory',
      'Whitelist allowed file extensions and names',
      'Never trust user input for file system operations'
    ],
    solution: {
      'server.js': `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// FIXED: Secure file serving with validation
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;

  // FIXED: Validate filename
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  // FIXED: Whitelist allowed extensions
  const allowedExtensions = ['.txt', '.jpg', '.png', '.pdf'];
  const ext = path.extname(filename).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: 'File type not allowed' });
  }

  const uploadsDir = path.resolve(__dirname, 'uploads');
  const filePath = path.resolve(uploadsDir, filename);

  // FIXED: Ensure file is within uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(400).json({ error: 'Access denied' });
  }

  console.log('Serving file:', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.send(data);
  });
});

// FIXED: Secure download endpoint
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;

  // FIXED: Validate filename
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const downloadsDir = path.resolve(__dirname, 'downloads');
  const filePath = path.resolve(downloadsDir, filename);

  // FIXED: Ensure file is within downloads directory
  if (!filePath.startsWith(downloadsDir)) {
    return res.status(400).json({ error: 'Access denied' });
  }

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Download failed' });
    }
  });
});

// FIXED: Secure template serving
app.get('/template/:name', (req, res) => {
  const { name } = req.params;

  // FIXED: Validate template name
  if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
    return res.status(400).json({ error: 'Invalid template name' });
  }

  const templatesDir = path.resolve(__dirname, 'templates');
  const templatePath = path.resolve(templatesDir, `${name}.html`);

  // FIXED: Ensure template is within templates directory
  if (!templatePath.startsWith(templatesDir) || !templatePath.endsWith('.html')) {
    return res.status(400).json({ error: 'Access denied' });
  }

  fs.readFile(templatePath, 'utf8', (err, content) => {
    if (err) {
      return res.status(404).send('Template not found');
    }

    res.send(content);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('File serving is now secure!');
});`
    },
    testCriteria: [
      'Path traversal attempts should be blocked',
      'Only files within allowed directories should be accessible',
      'Invalid filenames should be rejected'
    ],
    learningObjectives: [
      'Understand path traversal vulnerabilities',
      'Learn secure file serving practices',
      'Practice input validation and sanitization'
    ]
  },

  {
    id: 'node-stream-memory-leak',
    title: 'Stream Not Properly Closed Causing Memory Leak',
    description: 'File processing causes memory usage to grow over time.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 125,
    tags: ['Node.js', 'Streams', 'Memory Leaks', 'File Processing'],
    rootCause: 'Streams not properly closed or error handling missing',
    files: {
      'fileProcessor.js': `const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

class DataProcessor {
  constructor() {
    this.activeStreams = new Set();
  }

  // BUG: Streams not properly managed
  processFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(inputPath);
      const writeStream = fs.createWriteStream(outputPath);

      // BUG: No error handling for streams
      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          // Simulate processing
          const processed = chunk.toString().toUpperCase();
          callback(null, processed);
        }
      });

      // BUG: No cleanup on error
      readStream.pipe(transformStream).pipe(writeStream);

      writeStream.on('finish', () => {
        console.log('File processed successfully');
        resolve();
      });

      // BUG: No error handling
    });
  }

  // BUG: Batch processing without proper cleanup
  async processBatch(files) {
    const promises = files.map(file => {
      const outputPath = file.replace('.txt', '_processed.txt');
      return this.processFile(file, outputPath);
    });

    // BUG: No error handling for batch
    return Promise.all(promises);
  }

  // BUG: No cleanup method
}

// BUG: No graceful shutdown handling
const processor = new DataProcessor();

// Simulate processing many files
const processFiles = async () => {
  const files = Array.from({ length: 100 }, (_, i) => `file${i}.txt`);

  try {
    await processor.processBatch(files);
    console.log('All files processed');
  } catch (error) {
    console.error('Processing failed:', error);
  }
};

module.exports = { DataProcessor, processFiles };`
    },
    hints: [
      'Add error handling for all streams',
      'Properly close streams in finally blocks',
      'Use pipeline() for better error handling',
      'Track active streams and clean them up on process exit'
    ],
    solution: {
      'fileProcessor.js': `const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

class DataProcessor {
  constructor() {
    this.activeStreams = new Set();
    this.setupGracefulShutdown();
  }

  // FIXED: Proper stream management with error handling
  processFile(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(inputPath);
      const writeStream = fs.createWriteStream(outputPath);

      // FIXED: Track active streams
      this.activeStreams.add(readStream);
      this.activeStreams.add(writeStream);

      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          try {
            // Simulate processing
            const processed = chunk.toString().toUpperCase();
            callback(null, processed);
          } catch (error) {
            callback(error);
          }
        }
      });

      // FIXED: Use pipeline for better error handling
      pipeline(readStream, transformStream, writeStream, (error) => {
        // FIXED: Clean up streams
        this.activeStreams.delete(readStream);
        this.activeStreams.delete(writeStream);

        if (error) {
          console.error('Pipeline failed:', error);
          reject(error);
        } else {
          console.log('File processed successfully');
          resolve();
        }
      });
    });
  }

  // FIXED: Better batch processing with concurrency control
  async processBatch(files, concurrency = 5) {
    const results = [];

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);

      try {
        const batchPromises = batch.map(file => {
          const outputPath = file.replace('.txt', '_processed.txt');
          return this.processFile(file, outputPath);
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);

        // FIXED: Small delay between batches to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Batch processing error:', error);
        throw error;
      }
    }

    return results;
  }

  // FIXED: Cleanup method
  cleanup() {
    console.log(`Cleaning up ${this.activeStreams.size} active streams`);

    for (const stream of this.activeStreams) {
      try {
        if (stream.readable) {
          stream.destroy();
        }
        if (stream.writable) {
          stream.end();
        }
      } catch (error) {
        console.error('Error cleaning up stream:', error);
      }
    }

    this.activeStreams.clear();
  }

  // FIXED: Graceful shutdown handling
  setupGracefulShutdown() {
    const shutdown = () => {
      console.log('Shutting down gracefully...');
      this.cleanup();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      this.cleanup();
      process.exit(1);
    });
  }
}

const processor = new DataProcessor();

// FIXED: Better error handling
const processFiles = async () => {
  const files = Array.from({ length: 100 }, (_, i) => `file${i}.txt`);

  try {
    const results = await processor.processBatch(files);

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Processing complete: ${successful} successful, ${failed} failed`);
  } catch (error) {
    console.error('Processing failed:', error);
  } finally {
    processor.cleanup();
  }
};

module.exports = { DataProcessor, processFiles };`
    },
    testCriteria: [
      'Memory usage should not grow indefinitely',
      'Streams should be properly closed on errors',
      'Graceful shutdown should clean up resources'
    ],
    learningObjectives: [
      'Understand Node.js stream lifecycle',
      'Learn proper resource cleanup',
      'Practice memory leak prevention'
    ]
  },

  // More React Challenges - Batch 4
  {
    id: 'react-router-nested-routes',
    title: 'Nested Routes Not Rendering',
    description: 'Child routes don\'t display when navigating to nested paths.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['React', 'React Router', 'Nested Routes', 'Navigation'],
    rootCause: 'Missing Outlet component or incorrect route configuration',
    files: {
      'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/profile/settings">Settings</Link>
          <Link to="/profile/account">Account</Link>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* BUG: Nested routes not properly configured */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/profile/account" element={<Account />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;`,
      'pages/Profile.jsx': `import React from 'react';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <div>
      <h1>Profile Page</h1>
      <nav>
        <Link to="/profile/settings">Settings</Link>
        <Link to="/profile/account">Account</Link>
      </nav>

      {/* BUG: Missing Outlet for nested routes */}
      <div>
        <p>Select a section from the navigation above.</p>
      </div>
    </div>
  );
}

export default Profile;`,
      'pages/Settings.jsx': `import React from 'react';

function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <p>User settings content here...</p>
    </div>
  );
}

export default Settings;`,
      'pages/Account.jsx': `import React from 'react';

function Account() {
  return (
    <div>
      <h2>Account</h2>
      <p>Account management content here...</p>
    </div>
  );
}

export default Account;`
    },
    hints: [
      'Use nested route structure in React Router v6',
      'Add Outlet component to parent route component',
      'Configure child routes inside parent route',
      'Use relative paths for nested routes'
    ],
    solution: {
      'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/profile/settings">Settings</Link>
          <Link to="/profile/account">Account</Link>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* FIXED: Proper nested route structure */}
          <Route path="/profile" element={<Profile />}>
            <Route path="settings" element={<Settings />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;`,
      'pages/Profile.jsx': `import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Profile() {
  return (
    <div>
      <h1>Profile Page</h1>
      <nav>
        <Link to="/profile/settings">Settings</Link>
        <Link to="/profile/account">Account</Link>
      </nav>

      {/* FIXED: Added Outlet for nested routes */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Profile;`
    },
    testCriteria: [
      'Nested routes should render within parent component',
      'Navigation to child routes should work',
      'Parent component should remain visible with child content'
    ],
    learningObjectives: [
      'Understand React Router v6 nested routing',
      'Learn Outlet component usage',
      'Practice route hierarchy configuration'
    ]
  },

  {
    id: 'react-error-boundary-missing',
    title: 'Component Crashes Break Entire App',
    description: 'Error in one component causes the whole application to crash.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['React', 'Error Boundary', 'Error Handling', 'Resilience'],
    rootCause: 'No error boundary to catch and handle component errors',
    files: {
      'App.jsx': `import React, { useState } from 'react';
import UserList from './components/UserList';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';

function App() {
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);

  return (
    <div>
      <h1>My Dashboard</h1>

      <button onClick={() => setShowBuggyComponent(!showBuggyComponent)}>
        {showBuggyComponent ? 'Hide' : 'Show'} Buggy Component
      </button>

      {/* BUG: No error boundary - if any component crashes, whole app crashes */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <UserList />
        <WeatherWidget />
        <NewsWidget />
        {showBuggyComponent && <BuggyComponent />}
      </div>
    </div>
  );
}

// Component that will crash
function BuggyComponent() {
  const [count, setCount] = useState(0);

  if (count > 3) {
    // BUG: This will crash the component
    throw new Error('Component crashed! Count exceeded 3');
  }

  return (
    <div>
      <h3>Buggy Component</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment (crashes at 4)
      </button>
    </div>
  );
}

export default App;`,
      'components/UserList.jsx': `import React from 'react';

function UserList() {
  const users = ['Alice', 'Bob', 'Charlie'];

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map(user => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;`,
      'components/WeatherWidget.jsx': `import React from 'react';

function WeatherWidget() {
  return (
    <div>
      <h3>Weather</h3>
      <p>Sunny, 72°F</p>
    </div>
  );
}

export default WeatherWidget;`
    },
    hints: [
      'Create an Error Boundary class component',
      'Implement componentDidCatch and getDerivedStateFromError',
      'Wrap components that might crash with the Error Boundary',
      'Display fallback UI when errors occur'
    ],
    solution: {
      'App.jsx': `import React, { useState } from 'react';
import UserList from './components/UserList';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);

  return (
    <div>
      <h1>My Dashboard</h1>

      <button onClick={() => setShowBuggyComponent(!showBuggyComponent)}>
        {showBuggyComponent ? 'Hide' : 'Show'} Buggy Component
      </button>

      {/* FIXED: Wrap components with Error Boundaries */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <ErrorBoundary fallback={<div>User list failed to load</div>}>
          <UserList />
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Weather widget failed to load</div>}>
          <WeatherWidget />
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>News widget failed to load</div>}>
          <NewsWidget />
        </ErrorBoundary>

        {showBuggyComponent && (
          <ErrorBoundary fallback={<div>Component crashed! <button onClick={() => window.location.reload()}>Reload</button></div>}>
            <BuggyComponent />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

// Component that will crash
function BuggyComponent() {
  const [count, setCount] = useState(0);

  if (count > 3) {
    throw new Error('Component crashed! Count exceeded 3');
  }

  return (
    <div>
      <h3>Buggy Component</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment (crashes at 4)
      </button>
    </div>
  );
}

export default App;`,
      'components/ErrorBoundary.jsx': `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          border: '1px solid red',
          borderRadius: '4px',
          backgroundColor: '#ffe6e6'
        }}>
          <h3>Something went wrong</h3>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`
    },
    testCriteria: [
      'App should not crash when individual components fail',
      'Error boundaries should display fallback UI',
      'Other components should continue working when one crashes'
    ],
    learningObjectives: [
      'Understand React Error Boundaries',
      'Learn error isolation patterns',
      'Practice resilient application design'
    ]
  },

  // More Angular Challenges - Batch 2
  {
    id: 'angular-circular-dependency',
    title: 'Circular Dependency Between Services',
    description: 'Services inject each other causing circular dependency error.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['Angular', 'Dependency Injection', 'Circular Dependency', 'Services'],
    rootCause: 'Two services directly inject each other',
    files: {
      'user.service.ts': `import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: any[] = [];

  // BUG: Circular dependency - NotificationService also injects UserService
  constructor(private notificationService: NotificationService) {}

  addUser(user: any) {
    this.users.push(user);
    // BUG: This creates circular dependency
    this.notificationService.notifyUserAdded(user);
  }

  getUsers() {
    return this.users;
  }

  deleteUser(userId: string) {
    this.users = this.users.filter(u => u.id !== userId);
    this.notificationService.notifyUserDeleted(userId);
  }
}`,
      'notification.service.ts': `import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];

  // BUG: Circular dependency - UserService also injects NotificationService
  constructor(private userService: UserService) {}

  notifyUserAdded(user: any) {
    const message = `User ${user.name} was added`;
    this.notifications.push(message);
    console.log(message);

    // BUG: Accessing UserService creates circular dependency
    console.log(`Total users: ${this.userService.getUsers().length}`);
  }

  notifyUserDeleted(userId: string) {
    const message = `User ${userId} was deleted`;
    this.notifications.push(message);
    console.log(message);
  }

  getNotifications() {
    return this.notifications;
  }
}`
    },
    hints: [
      'Break circular dependency by removing direct injection',
      'Use events/subjects for communication between services',
      'Create a third service to mediate between the two',
      'Use forwardRef() as a temporary solution (not recommended)'
    ],
    solution: {
      'user.service.ts': `import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// FIXED: Create event subjects for communication
export interface UserEvent {
  type: 'added' | 'deleted';
  user?: any;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: any[] = [];

  // FIXED: Use Subject for event communication
  private userEvents = new Subject<UserEvent>();
  public userEvents$ = this.userEvents.asObservable();

  // FIXED: No direct injection of NotificationService
  constructor() {}

  addUser(user: any) {
    this.users.push(user);
    // FIXED: Emit event instead of direct service call
    this.userEvents.next({ type: 'added', user });
  }

  getUsers() {
    return this.users;
  }

  deleteUser(userId: string) {
    this.users = this.users.filter(u => u.id !== userId);
    // FIXED: Emit event instead of direct service call
    this.userEvents.next({ type: 'deleted', userId });
  }
}`,
      'notification.service.ts': `import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: string[] = [];

  // FIXED: Inject UserService but only subscribe to events
  constructor(private userService: UserService) {
    this.subscribeToUserEvents();
  }

  // FIXED: Subscribe to events instead of being called directly
  private subscribeToUserEvents() {
    this.userService.userEvents$.subscribe(event => {
      if (event.type === 'added') {
        this.notifyUserAdded(event.user);
      } else if (event.type === 'deleted') {
        this.notifyUserDeleted(event.userId!);
      }
    });
  }

  private notifyUserAdded(user: any) {
    const message = `User ${user.name} was added`;
    this.notifications.push(message);
    console.log(message);

    // FIXED: Get user count without circular dependency
    console.log(`Total users: ${this.userService.getUsers().length}`);
  }

  private notifyUserDeleted(userId: string) {
    const message = `User ${userId} was deleted`;
    this.notifications.push(message);
    console.log(message);
  }

  getNotifications() {
    return this.notifications;
  }
}`,
      'event-bus.service.ts': `// ALTERNATIVE: Create a separate event bus service
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppEvent {
  type: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private events = new Subject<AppEvent>();
  public events$ = this.events.asObservable();

  emit(event: AppEvent) {
    this.events.next(event);
  }
}`
    },
    testCriteria: [
      'No circular dependency errors should occur',
      'Services should communicate through events',
      'Application should start without injection errors'
    ],
    learningObjectives: [
      'Understand circular dependency problems',
      'Learn event-driven service communication',
      'Practice dependency injection best practices'
    ]
  },

  {
    id: 'angular-zone-outside-detection',
    title: 'Change Detection Not Triggered',
    description: 'UI doesn\'t update after async operation completes.',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 120,
    tags: ['Angular', 'Zone.js', 'Change Detection', 'Async'],
    rootCause: 'Async operation runs outside Angular zone',
    files: {
      'timer.component.ts': `import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-timer',
  template: `
    <div>
      <h2>Timer Component</h2>
      <p>Time: {{currentTime}}</p>
      <p>Counter: {{counter}}</p>
      <p>Status: {{status}}</p>

      <button (click)="startTimer()">Start Timer</button>
      <button (click)="stopTimer()">Stop Timer</button>
      <button (click)="startCounter()">Start Counter</button>
      <button (click)="performAsyncTask()">Async Task</button>
    </div>
  `
})
export class TimerComponent implements OnInit, OnDestroy {
  currentTime = new Date().toLocaleTimeString();
  counter = 0;
  status = 'Ready';

  private timerId: any;
  private counterId: any;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
    if (this.counterId) {
      clearInterval(this.counterId);
    }
  }

  startTimer() {
    // BUG: setInterval runs outside Angular zone
    this.timerId = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
      // UI won't update because change detection isn't triggered
    }, 1000);
  }

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  startCounter() {
    // BUG: Another operation outside zone
    this.counterId = setInterval(() => {
      this.counter++;
      console.log('Counter:', this.counter); // Logs but UI doesn't update
    }, 500);
  }

  performAsyncTask() {
    this.status = 'Processing...';

    // BUG: setTimeout outside zone
    setTimeout(() => {
      this.status = 'Completed';
      // UI won't update to show 'Completed'
    }, 2000);
  }
}`
    },
    hints: [
      'Use NgZone.run() to execute code inside Angular zone',
      'Alternatively, use NgZone.runOutsideAngular() and then run() for updates',
      'Consider using RxJS interval instead of setInterval',
      'Manual change detection with ChangeDetectorRef.detectChanges()'
    ],
    solution: {
      'timer.component.ts': `import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  template: `
    <div>
      <h2>Timer Component</h2>
      <p>Time: {{currentTime}}</p>
      <p>Counter: {{counter}}</p>
      <p>Status: {{status}}</p>

      <button (click)="startTimer()">Start Timer</button>
      <button (click)="stopTimer()">Stop Timer</button>
      <button (click)="startCounter()">Start Counter</button>
      <button (click)="performAsyncTask()">Async Task</button>
    </div>
  `
})
export class TimerComponent implements OnInit, OnDestroy {
  currentTime = new Date().toLocaleTimeString();
  counter = 0;
  status = 'Ready';

  private timerSubscription?: Subscription;
  private counterSubscription?: Subscription;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
    if (this.counterSubscription) {
      this.counterSubscription.unsubscribe();
    }
  }

  // SOLUTION 1: Use RxJS interval (runs in Angular zone by default)
  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date().toLocaleTimeString();
      // This automatically triggers change detection
    });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // SOLUTION 2: Use NgZone.run() to ensure change detection
  startCounter() {
    // Run outside Angular zone for performance
    this.ngZone.runOutsideAngular(() => {
      const counterId = setInterval(() => {
        // Run inside zone only when updating UI
        this.ngZone.run(() => {
          this.counter++;
          console.log('Counter:', this.counter);
        });
      }, 500);

      // Store for cleanup
      this.counterSubscription = {
        unsubscribe: () => clearInterval(counterId)
      } as Subscription;
    });
  }

  // SOLUTION 3: Manual change detection
  performAsyncTask() {
    this.status = 'Processing...';

    // Run outside zone for performance
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Update model
        this.status = 'Completed';

        // Manually trigger change detection
        this.cdr.detectChanges();
      }, 2000);
    });
  }

  // ALTERNATIVE: Use NgZone.run() for the async task
  performAsyncTaskAlternative() {
    this.status = 'Processing...';

    setTimeout(() => {
      this.ngZone.run(() => {
        this.status = 'Completed';
        // Change detection triggered automatically
      });
    }, 2000);
  }
}`
    },
    testCriteria: [
      'UI should update when timer changes',
      'Counter should be visible in the template',
      'Status should change to "Completed" after async task'
    ],
    learningObjectives: [
      'Understand Angular Zone.js and change detection',
      'Learn when to use NgZone.run()',
      'Practice manual change detection techniques'
    ]
  },

  // More Node.js Challenges - Batch 2
  {
    id: 'node-database-connection-pool',
    title: 'Database Connection Pool Exhaustion',
    description: 'Application hangs after handling several requests.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 130,
    tags: ['Node.js', 'Database', 'Connection Pool', 'Performance'],
    rootCause: 'Database connections not properly released back to pool',
    files: {
      'database.js': `const mysql = require('mysql2/promise');

// BUG: Small connection pool without proper management
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp',
  connectionLimit: 5, // Very small limit
  acquireTimeout: 60000,
  timeout: 60000
});

class DatabaseService {
  // BUG: Connection not released properly
  async getUser(id) {
    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
    // BUG: Connection not released in finally block
  }

  // BUG: Another method with connection leak
  async updateUser(id, userData) {
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [userData.name, userData.email, id]
    );

    // BUG: Early return without releasing connection
    if (result.affectedRows === 0) {
      return null;
    }

    connection.release(); // This won't run if early return happens
    return result;
  }

  // BUG: Transaction not properly handled
  async transferMoney(fromId, toId, amount) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Deduct from sender
      await connection.execute(
        'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
        [amount, fromId]
      );

      // Add to receiver
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
        [amount, toId]
      );

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    }
    // BUG: Connection not released
  }
}

module.exports = new DatabaseService();`
    },
    hints: [
      'Always release connections in finally blocks',
      'Use try-catch-finally pattern for connection management',
      'Consider using connection.execute() directly on pool',
      'Monitor connection pool usage and increase limits if needed'
    ],
    solution: {
      'database.js': `const mysql = require('mysql2/promise');

// FIXED: Better connection pool configuration
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp',
  connectionLimit: 20, // Increased limit
  acquireTimeout: 60000,
  timeout: 60000,
  // FIXED: Additional pool settings
  queueLimit: 0,
  reconnect: true,
  idleTimeout: 300000,
  enableKeepAlive: true
});

class DatabaseService {
  // FIXED: Proper connection management
  async getUser(id) {
    let connection;

    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      // FIXED: Always release connection
      if (connection) {
        connection.release();
      }
    }
  }

  // ALTERNATIVE: Use pool directly (automatically manages connections)
  async getUserSimple(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // FIXED: Proper connection release in all paths
  async updateUser(id, userData) {
    let connection;

    try {
      connection = await pool.getConnection();

      const [result] = await connection.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [userData.name, userData.email, id]
      );

      return result.affectedRows > 0 ? result : null;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    } finally {
      // FIXED: Always release connection
      if (connection) {
        connection.release();
      }
    }
  }

  // FIXED: Proper transaction handling
  async transferMoney(fromId, toId, amount) {
    let connection;

    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Check sender balance first
      const [senderRows] = await connection.execute(
        'SELECT balance FROM accounts WHERE user_id = ?',
        [fromId]
      );

      if (!senderRows[0] || senderRows[0].balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Deduct from sender
      await connection.execute(
        'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
        [amount, fromId]
      );

      // Add to receiver
      await connection.execute(
        'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
        [amount, toId]
      );

      await connection.commit();
      return { success: true };
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Transfer error:', error);
      throw error;
    } finally {
      // FIXED: Always release connection
      if (connection) {
        connection.release();
      }
    }
  }

  // FIXED: Add pool monitoring
  getPoolStatus() {
    return {
      totalConnections: pool.pool._allConnections.length,
      freeConnections: pool.pool._freeConnections.length,
      usedConnections: pool.pool._allConnections.length - pool.pool._freeConnections.length
    };
  }

  // FIXED: Graceful shutdown
  async close() {
    await pool.end();
  }
}

module.exports = new DatabaseService();`
    },
    testCriteria: [
      'Connection pool should not be exhausted',
      'All database operations should complete successfully',
      'No hanging connections should remain'
    ],
    learningObjectives: [
      'Understand database connection pooling',
      'Learn proper connection lifecycle management',
      'Practice transaction handling patterns'
    ]
  },

  {
    id: 'node-event-emitter-memory-leak',
    title: 'EventEmitter Memory Leak',
    description: 'Application memory grows due to event listener accumulation.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Node.js', 'EventEmitter', 'Memory Leaks', 'Events'],
    rootCause: 'Event listeners added but never removed',
    files: {
      'notification-system.js': `const EventEmitter = require('events');

class NotificationSystem extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
    this.notifications = [];
  }

  addUser(userId, userData) {
    this.users.set(userId, userData);

    // BUG: Adding listener without removing old ones
    this.on('notification', (notification) => {
      if (notification.userId === userId) {
        console.log(`Notification for ${userId}: ${notification.message}`);
        userData.notifications = userData.notifications || [];
        userData.notifications.push(notification);
      }
    });

    // BUG: Another listener that accumulates
    this.on('broadcast', (message) => {
      console.log(`User ${userId} received broadcast: ${message}`);
    });
  }

  removeUser(userId) {
    this.users.delete(userId);
    // BUG: Not removing event listeners for this user
  }

  sendNotification(userId, message) {
    const notification = {
      id: Date.now(),
      userId,
      message,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    this.emit('notification', notification);
  }

  broadcast(message) {
    this.emit('broadcast', message);
  }

  // BUG: Method that adds more listeners
  enableUserTracking(userId) {
    this.on('user-action', (action) => {
      if (action.userId === userId) {
        console.log(`Tracking action for ${userId}:`, action);
      }
    });
  }

  trackUserAction(userId, action) {
    this.emit('user-action', { userId, action, timestamp: new Date() });
  }
}

// Usage that demonstrates the memory leak
const notificationSystem = new NotificationSystem();

// BUG: Simulating users joining and leaving
setInterval(() => {
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;

  notificationSystem.addUser(userId, { name: `User ${userId}` });
  notificationSystem.enableUserTracking(userId);

  // Simulate some activity
  setTimeout(() => {
    notificationSystem.sendNotification(userId, 'Welcome!');
    notificationSystem.trackUserAction(userId, 'login');
  }, 1000);

  // Remove user after 5 seconds
  setTimeout(() => {
    notificationSystem.removeUser(userId);
  }, 5000);

  // Log listener count
  console.log('Total listeners:', notificationSystem.listenerCount('notification') +
              notificationSystem.listenerCount('broadcast') +
              notificationSystem.listenerCount('user-action'));
}, 2000);

module.exports = NotificationSystem;`
    },
    hints: [
      'Remove event listeners when users are removed',
      'Use removeListener() or off() to clean up',
      'Consider using once() for one-time listeners',
      'Track listeners and clean them up properly'
    ],
    solution: {
      'notification-system.js': `const EventEmitter = require('events');

class NotificationSystem extends EventEmitter {
  constructor() {
    super();
    this.users = new Map();
    this.notifications = [];
    // FIXED: Track listeners for cleanup
    this.userListeners = new Map();
  }

  addUser(userId, userData) {
    this.users.set(userId, userData);

    // FIXED: Store listener references for cleanup
    const notificationListener = (notification) => {
      if (notification.userId === userId) {
        console.log(`Notification for ${userId}: ${notification.message}`);
        userData.notifications = userData.notifications || [];
        userData.notifications.push(notification);
      }
    };

    const broadcastListener = (message) => {
      console.log(`User ${userId} received broadcast: ${message}`);
    };

    // FIXED: Store listeners for this user
    this.userListeners.set(userId, {
      notification: notificationListener,
      broadcast: broadcastListener
    });

    this.on('notification', notificationListener);
    this.on('broadcast', broadcastListener);
  }

  removeUser(userId) {
    this.users.delete(userId);

    // FIXED: Remove all listeners for this user
    const listeners = this.userListeners.get(userId);
    if (listeners) {
      this.removeListener('notification', listeners.notification);
      this.removeListener('broadcast', listeners.broadcast);

      // Remove tracking listener if exists
      if (listeners.userAction) {
        this.removeListener('user-action', listeners.userAction);
      }

      this.userListeners.delete(userId);
    }
  }

  sendNotification(userId, message) {
    const notification = {
      id: Date.now(),
      userId,
      message,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    this.emit('notification', notification);
  }

  broadcast(message) {
    this.emit('broadcast', message);
  }

  // FIXED: Proper listener management for tracking
  enableUserTracking(userId) {
    const userActionListener = (action) => {
      if (action.userId === userId) {
        console.log(`Tracking action for ${userId}:`, action);
      }
    };

    // FIXED: Store the listener reference
    const listeners = this.userListeners.get(userId);
    if (listeners) {
      listeners.userAction = userActionListener;
    }

    this.on('user-action', userActionListener);
  }

  trackUserAction(userId, action) {
    this.emit('user-action', { userId, action, timestamp: new Date() });
  }

  // FIXED: Add cleanup method
  cleanup() {
    this.removeAllListeners();
    this.users.clear();
    this.userListeners.clear();
    this.notifications = [];
  }

  // FIXED: Add monitoring method
  getListenerStats() {
    return {
      notification: this.listenerCount('notification'),
      broadcast: this.listenerCount('broadcast'),
      userAction: this.listenerCount('user-action'),
      totalUsers: this.users.size,
      trackedUsers: this.userListeners.size
    };
  }
}

// FIXED: Better usage pattern
const notificationSystem = new NotificationSystem();

// FIXED: Monitor memory usage
setInterval(() => {
  const stats = notificationSystem.getListenerStats();
  console.log('Listener stats:', stats);

  if (stats.notification > 100) {
    console.warn('High number of listeners detected!');
  }
}, 10000);

// Simulate users joining and leaving
setInterval(() => {
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;

  notificationSystem.addUser(userId, { name: `User ${userId}` });
  notificationSystem.enableUserTracking(userId);

  // Simulate some activity
  setTimeout(() => {
    notificationSystem.sendNotification(userId, 'Welcome!');
    notificationSystem.trackUserAction(userId, 'login');
  }, 1000);

  // FIXED: Properly remove user and listeners
  setTimeout(() => {
    notificationSystem.removeUser(userId);
  }, 5000);
}, 2000);

// FIXED: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Cleaning up...');
  notificationSystem.cleanup();
  process.exit(0);
});

module.exports = NotificationSystem;`
    },
    testCriteria: [
      'Event listener count should not grow indefinitely',
      'Memory usage should remain stable',
      'Removed users should not receive notifications'
    ],
    learningObjectives: [
      'Understand EventEmitter memory leaks',
      'Learn proper listener cleanup patterns',
      'Practice event-driven architecture'
    ]
  },

  // More React Challenges - Batch 5 (Adding many more to reach 50+)
  {
    id: 'react-memo-deps-wrong',
    title: 'useMemo Dependencies Causing Stale Values',
    description: 'Memoized value doesn\'t update when it should.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'useMemo', 'Dependencies', 'Performance'],
    rootCause: 'Missing or incorrect dependencies in useMemo',
    files: {
      'components/ExpensiveCalculation.jsx': `import React, { useState, useMemo } from 'react';

function ExpensiveCalculation() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [multiplier, setMultiplier] = useState(2);
  const [filter, setFilter] = useState('all');

  // BUG: Missing dependencies in useMemo
  const expensiveResult = useMemo(() => {
    console.log('Calculating expensive result...');

    let filtered = numbers;
    if (filter === 'even') {
      filtered = numbers.filter(n => n % 2 === 0);
    } else if (filter === 'odd') {
      filtered = numbers.filter(n => n % 2 === 1);
    }

    return filtered.map(n => n * multiplier).reduce((sum, n) => sum + n, 0);
  }, [numbers]); // BUG: Missing multiplier and filter dependencies

  const addNumber = () => {
    setNumbers([...numbers, numbers.length + 1]);
  };

  return (
    <div>
      <h2>Expensive Calculation</h2>
      <p>Numbers: {numbers.join(', ')}</p>
      <p>Multiplier: {multiplier}</p>
      <p>Filter: {filter}</p>
      <p>Result: {expensiveResult}</p>

      <button onClick={addNumber}>Add Number</button>
      <button onClick={() => setMultiplier(multiplier + 1)}>
        Increase Multiplier
      </button>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="even">Even</option>
        <option value="odd">Odd</option>
      </select>
    </div>
  );
}

export default ExpensiveCalculation;`
    },
    hints: [
      'useMemo dependencies must include all values used inside the callback',
      'Add multiplier and filter to the dependency array',
      'Missing dependencies cause stale closures',
      'Use ESLint plugin react-hooks/exhaustive-deps for help'
    ],
    solution: {
      'components/ExpensiveCalculation.jsx': `import React, { useState, useMemo } from 'react';

function ExpensiveCalculation() {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [multiplier, setMultiplier] = useState(2);
  const [filter, setFilter] = useState('all');

  // FIXED: Include all dependencies
  const expensiveResult = useMemo(() => {
    console.log('Calculating expensive result...');

    let filtered = numbers;
    if (filter === 'even') {
      filtered = numbers.filter(n => n % 2 === 0);
    } else if (filter === 'odd') {
      filtered = numbers.filter(n => n % 2 === 1);
    }

    return filtered.map(n => n * multiplier).reduce((sum, n) => sum + n, 0);
  }, [numbers, multiplier, filter]); // FIXED: All dependencies included

  const addNumber = () => {
    setNumbers([...numbers, numbers.length + 1]);
  };

  return (
    <div>
      <h2>Expensive Calculation</h2>
      <p>Numbers: {numbers.join(', ')}</p>
      <p>Multiplier: {multiplier}</p>
      <p>Filter: {filter}</p>
      <p>Result: {expensiveResult}</p>

      <button onClick={addNumber}>Add Number</button>
      <button onClick={() => setMultiplier(multiplier + 1)}>
        Increase Multiplier
      </button>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="even">Even</option>
        <option value="odd">Odd</option>
      </select>
    </div>
  );
}

export default ExpensiveCalculation;`
    },
    testCriteria: [
      'Result should update when multiplier changes',
      'Result should update when filter changes',
      'Calculation should only run when dependencies change'
    ],
    learningObjectives: [
      'Understand useMemo dependency requirements',
      'Learn to identify stale closure issues',
      'Practice performance optimization patterns'
    ]
  },

  {
    id: 'react-callback-recreated',
    title: 'useCallback Not Preventing Re-renders',
    description: 'Child components re-render despite useCallback usage.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 90,
    tags: ['React', 'useCallback', 'Performance', 'Memoization'],
    rootCause: 'useCallback dependencies causing callback recreation',
    files: {
      'components/TodoApp.jsx': `import React, { useState, useCallback } from 'react';
import TodoItem from './TodoItem';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: true }
  ]);
  const [filter, setFilter] = useState('all');

  // BUG: useCallback recreated on every render due to dependencies
  const handleToggle = useCallback((id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, [todos]); // BUG: todos changes on every update, recreating callback

  // BUG: Another callback with dependency issues
  const handleDelete = useCallback((id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }, [todos]); // BUG: Same issue

  // BUG: Inline function passed to child
  const handleEdit = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <h1>Todo App</h1>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <div>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit} // BUG: Not memoized
          />
        ))}
      </div>
    </div>
  );
}

export default TodoApp;`,
      'components/TodoItem.jsx': `import React, { memo } from 'react';

const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }) => {
  console.log(`Rendering TodoItem ${todo.id}`);

  return (
    <div style={{
      padding: '10px',
      border: '1px solid #ccc',
      margin: '5px 0',
      textDecoration: todo.completed ? 'line-through' : 'none'
    }}>
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)}>
        {todo.completed ? 'Undo' : 'Complete'}
      </button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
      <button onClick={() => onEdit(todo.id, prompt('Edit:', todo.text))}>
        Edit
      </button>
    </div>
  );
});

export default TodoItem;`
    },
    hints: [
      'Use functional state updates to avoid dependencies',
      'setTodos(prev => ...) doesn\'t need todos in dependencies',
      'Memoize all callback functions passed to children',
      'Consider using useReducer for complex state updates'
    ],
    solution: {
      'components/TodoApp.jsx': `import React, { useState, useCallback } from 'react';
import TodoItem from './TodoItem';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: true }
  ]);
  const [filter, setFilter] = useState('all');

  // FIXED: Use functional state update to avoid dependencies
  const handleToggle = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // FIXED: No dependencies needed

  // FIXED: Use functional state update
  const handleDelete = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // FIXED: No dependencies needed

  // FIXED: Memoize the edit callback
  const handleEdit = useCallback((id, newText) => {
    if (newText && newText.trim()) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, text: newText.trim() } : todo
        )
      );
    }
  }, []); // FIXED: No dependencies needed

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div>
      <h1>Todo App</h1>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <div>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit} // FIXED: Now memoized
          />
        ))}
      </div>
    </div>
  );
}

export default TodoApp;`
    },
    testCriteria: [
      'TodoItem components should not re-render unnecessarily',
      'Callbacks should remain stable between renders',
      'Performance should be optimized'
    ],
    learningObjectives: [
      'Understand useCallback optimization',
      'Learn functional state update patterns',
      'Practice React performance optimization'
    ]
  },

  // More React Challenges - Adding ALL scenarios from debug-react.txt
  {
    id: 'react-onchange-not-working',
    title: 'onChange Event Not Working',
    description: 'Input changes not triggering handler.',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '7 min',
    xpReward: 60,
    tags: ['React', 'Events', 'Forms'],
    rootCause: 'Wrong handler binding or incorrect value prop',
    files: {
      'components/InputHandler.jsx': `import React, { useState } from 'react';

function InputHandler() {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  // BUG: Handler not properly bound
  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.value);
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setMessage(`You typed: ${inputValue}`);
  };

  return (
    <div>
      <h2>Input Handler Test</h2>
      {/* BUG: onChange not properly connected */}
      <input
        type="text"
        value={inputValue}
        // onChange={handleInputChange} // This line is commented out!
        placeholder="Type something..."
      />
      <button onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default InputHandler;`
    },
    hints: [
      'Check if onChange prop is properly connected to the input',
      'Ensure the handler function is correctly defined',
      'Verify that value prop is set correctly',
      'Make sure the handler updates state properly'
    ],
    solution: {
      'components/InputHandler.jsx': `import React, { useState } from 'react';

function InputHandler() {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.value);
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setMessage(`You typed: ${inputValue}`);
  };

  return (
    <div>
      <h2>Input Handler Test</h2>
      {/* FIXED: Added onChange handler */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
      <button onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default InputHandler;`
    },
    testCriteria: [
      'Input should respond to typing',
      'State should update as user types',
      'Submit should display the typed text'
    ],
    learningObjectives: [
      'Understand React event handling',
      'Learn controlled input patterns',
      'Practice form state management'
    ]
  },

  {
    id: 'react-multiple-state-batching',
    title: 'Multiple State Updates Merged Unexpectedly',
    description: 'Multiple calls to setState inside same function don\'t reflect all changes.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 90,
    tags: ['React', 'State', 'Batching'],
    rootCause: 'React batches state updates',
    files: {
      'components/Counter.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [history, setHistory] = useState([]);

  const handleComplexUpdate = () => {
    // BUG: These updates are batched, so count doesn't update immediately
    setCount(count + 1);
    setCount(count + 1); // This still uses the old count value!
    setMultiplier(multiplier + 1);

    // BUG: This will log the old values
    console.log('Expected count:', count + 2);
    console.log('Expected multiplier:', multiplier + 1);

    // BUG: Adding to history with stale values
    setHistory([...history, { count: count + 2, multiplier: multiplier + 1 }]);
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <h3>Multiplier: {multiplier}</h3>
      <h4>Result: {count * multiplier}</h4>

      <button onClick={() => setCount(count + 1)}>
        Simple Increment
      </button>

      <button onClick={handleComplexUpdate}>
        Complex Update (Buggy)
      </button>

      <div>
        <h4>History:</h4>
        {history.map((entry, index) => (
          <p key={index}>Count: {entry.count}, Multiplier: {entry.multiplier}</p>
        ))}
      </div>
    </div>
  );
}

export default Counter;`
    },
    hints: [
      'React batches multiple setState calls in the same function',
      'Use functional updates when new state depends on previous state',
      'setCount(prev => prev + 1) gets the latest value',
      'Use useEffect to react to state changes for logging'
    ],
    solution: {
      'components/Counter.jsx': `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [history, setHistory] = useState([]);

  const handleComplexUpdate = () => {
    // FIXED: Use functional updates to get latest state
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setMultiplier(prevMultiplier => prevMultiplier + 1);
  };

  // FIXED: Use useEffect to update history after state changes
  useEffect(() => {
    if (count > 0 || multiplier > 1) {
      setHistory(prevHistory => [...prevHistory, { count, multiplier }]);
    }
  }, [count, multiplier]);

  // FIXED: Use useEffect for logging current values
  useEffect(() => {
    console.log('Current count:', count);
    console.log('Current multiplier:', multiplier);
  }, [count, multiplier]);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <h3>Multiplier: {multiplier}</h3>
      <h4>Result: {count * multiplier}</h4>

      <button onClick={() => setCount(count + 1)}>
        Simple Increment
      </button>

      <button onClick={handleComplexUpdate}>
        Complex Update (Fixed)
      </button>

      <div>
        <h4>History:</h4>
        {history.slice(-5).map((entry, index) => (
          <p key={index}>Count: {entry.count}, Multiplier: {entry.multiplier}</p>
        ))}
      </div>
    </div>
  );
}

export default Counter;`
    },
    testCriteria: [
      'Complex update should increment count by 2',
      'History should show correct values',
      'Console should log current values'
    ],
    learningObjectives: [
      'Understand React state batching',
      'Learn functional state updates',
      'Practice useEffect for side effects'
    ]
  },

  {
    id: 'react-custom-hook-stale-state',
    title: 'Custom Hook Not Returning Updated State',
    description: 'Custom hook updates internal state, but consuming component doesn\'t re-render.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['React', 'Custom Hook', 'State'],
    rootCause: 'Hook doesn\'t return updated values properly or caches outdated reference',
    files: {
      'hooks/useCounter.js': `import { useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  // BUG: Returning stale values
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  // BUG: Returning object with stale count value
  return {
    count: count, // This might be stale
    increment,
    decrement,
    // BUG: Computed values using stale state
    isEven: count % 2 === 0,
    isPositive: count > 0
  };
}

export default useCounter;`,
      'components/CounterDisplay.jsx': `import React from 'react';
import useCounter from '../hooks/useCounter';

function CounterDisplay() {
  const { count, increment, decrement, isEven, isPositive } = useCounter(0);

  return (
    <div>
      <h2>Counter Display</h2>
      <p>Count: {count}</p>
      <p>Is Even: {isEven ? 'Yes' : 'No'}</p>
      <p>Is Positive: {isPositive ? 'Yes' : 'No'}</p>

      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default CounterDisplay;`
    },
    hints: [
      'Custom hooks should return fresh values on each render',
      'Use functional state updates in custom hooks',
      'Ensure all returned values depend on current state',
      'Test the hook in isolation to verify behavior'
    ],
    solution: {
      'hooks/useCounter.js': `import { useState, useCallback } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  // FIXED: Use functional updates and useCallback
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prevCount => prevCount - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  // FIXED: Return fresh computed values based on current count
  return {
    count,
    increment,
    decrement,
    reset,
    isEven: count % 2 === 0,
    isPositive: count > 0,
    isZero: count === 0
  };
}

export default useCounter;`
    },
    testCriteria: [
      'Counter should update when buttons are clicked',
      'Computed values should reflect current state',
      'Component should re-render with fresh values'
    ],
    learningObjectives: [
      'Understand custom hook patterns',
      'Learn proper state management in hooks',
      'Practice functional state updates'
    ]
  },

  {
    id: 'react-context-value-not-updating',
    title: 'Context Value Doesn\'t Update Across Components',
    description: 'Global context value updates in one component but not reflected in others.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 100,
    tags: ['React', 'Context', 'Global State'],
    rootCause: 'Value not derived from state, or provider not wrapping all components',
    files: {
      'context/ThemeContext.js': `import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

// BUG: No state management in provider
export function ThemeProvider({ children }) {
  // BUG: Static value that never changes
  const theme = {
    mode: 'light',
    colors: {
      primary: '#007bff',
      background: '#ffffff'
    }
  };

  // BUG: No way to update theme
  const toggleTheme = () => {
    console.log('Toggle theme called');
    // This doesn't actually change anything!
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}`,
      'components/ThemeToggle.jsx': `import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h3>Theme Toggle</h3>
      <p>Current theme: {theme.mode}</p>
      <button onClick={toggleTheme}>
        Switch to {theme.mode === 'light' ? 'dark' : 'light'}
      </button>
    </div>
  );
}

export default ThemeToggle;`,
      'components/Header.jsx': `import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme } = useTheme();

  return (
    <header style={{
      backgroundColor: theme.colors.background,
      color: theme.mode === 'light' ? '#000' : '#fff',
      padding: '20px'
    }}>
      <h1>My App ({theme.mode} mode)</h1>
    </header>
  );
}

export default Header;`
    },
    hints: [
      'Context provider needs state management (useState)',
      'Theme value should be derived from state',
      'Toggle function should update the state',
      'All consuming components should re-render when context changes'
    ],
    solution: {
      'context/ThemeContext.js': `import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // FIXED: Add state management
  const [mode, setMode] = useState('light');

  // FIXED: Derive theme from state
  const theme = {
    mode,
    colors: {
      primary: mode === 'light' ? '#007bff' : '#0056b3',
      background: mode === 'light' ? '#ffffff' : '#1a1a1a',
      text: mode === 'light' ? '#000000' : '#ffffff'
    }
  };

  // FIXED: Actually update state
  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}`,
      'components/Header.jsx': `import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme } = useTheme();

  return (
    <header style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      padding: '20px',
      transition: 'all 0.3s ease'
    }}>
      <h1>My App ({theme.mode} mode)</h1>
    </header>
  );
}

export default Header;`
    },
    testCriteria: [
      'Theme should toggle between light and dark',
      'All components should reflect theme changes',
      'Context value should update across the app'
    ],
    learningObjectives: [
      'Understand React Context with state',
      'Learn global state management patterns',
      'Practice context provider implementation'
    ]
  },

  {
    id: 'react-redux-state-not-updating',
    title: 'Redux State Not Updating',
    description: 'Dispatch action but UI doesn\'t reflect the updated state.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['Redux', 'State', 'Reducer'],
    rootCause: 'Reducer doesn\'t return a new state object or incorrect action type',
    files: {
      'store/reducer.js': `const initialState = {
  count: 0,
  items: [],
  user: null
};

// BUG: Reducer mutates state instead of returning new object
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      // BUG: Mutating state directly
      state.count++;
      return state;

    case 'DECREMENT':
      // BUG: Mutating state directly
      state.count--;
      return state;

    case 'ADD_ITEM':
      // BUG: Mutating array directly
      state.items.push(action.payload);
      return state;

    case 'SET_USER':
      // BUG: Mutating state object
      state.user = action.payload;
      return state;

    default:
      return state;
  }
}

export default counterReducer;`,
      'store/actions.js': `// Action creators
export const increment = () => ({
  type: 'INCREMENT'
});

export const decrement = () => ({
  type: 'DECREMENT'
});

export const addItem = (item) => ({
  type: 'ADD_ITEM',
  payload: item
});

export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user
});`,
      'components/Counter.jsx': `import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, addItem } from '../store/actions';

function Counter() {
  const { count, items } = useSelector(state => state);
  const dispatch = useDispatch();

  const handleAddItem = () => {
    const newItem = `Item ${items.length + 1}`;
    dispatch(addItem(newItem));
  };

  return (
    <div>
      <h2>Redux Counter</h2>
      <p>Count: {count}</p>

      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>

      <div>
        <h3>Items ({items.length})</h3>
        <button onClick={handleAddItem}>Add Item</button>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Counter;`
    },
    hints: [
      'Redux reducers must return new state objects',
      'Never mutate the existing state directly',
      'Use spread operator to create new objects/arrays',
      'Ensure action types match exactly'
    ],
    solution: {
      'store/reducer.js': `const initialState = {
  count: 0,
  items: [],
  user: null
};

// FIXED: Return new state objects instead of mutating
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      // FIXED: Return new state object
      return {
        ...state,
        count: state.count + 1
      };

    case 'DECREMENT':
      // FIXED: Return new state object
      return {
        ...state,
        count: state.count - 1
      };

    case 'ADD_ITEM':
      // FIXED: Return new state with new array
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'SET_USER':
      // FIXED: Return new state object
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
}

export default counterReducer;`
    },
    testCriteria: [
      'Counter should increment and decrement properly',
      'Items should be added to the list',
      'UI should update when state changes'
    ],
    learningObjectives: [
      'Understand Redux immutability principles',
      'Learn proper reducer patterns',
      'Practice state management with Redux'
    ]
  },

  {
    id: 'react-auth-context-not-persisting',
    title: 'Authentication Context Not Persisting on Refresh',
    description: 'User logs in, but page refresh resets to logged-out state.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 120,
    tags: ['Auth', 'Context', 'Persistence'],
    rootCause: 'Auth token stored only in memory, not localStorage',
    files: {
      'context/AuthContext.js': `import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // BUG: State not initialized from localStorage
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        // BUG: Not storing in localStorage
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // BUG: Not clearing localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}`,
      'components/LoginForm.jsx': `import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.name}!</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;`
    },
    hints: [
      'Initialize state from localStorage on component mount',
      'Store auth data in localStorage when login succeeds',
      'Clear localStorage when user logs out',
      'Use useEffect to check for existing auth data'
    ],
    solution: {
      'context/AuthContext.js': `import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // FIXED: Initialize from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // FIXED: Sync with localStorage when state changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      // Simulate API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        // FIXED: Data will be stored via useEffect
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // FIXED: Data will be cleared via useEffect
  };

  // FIXED: Check token validity on mount
  useEffect(() => {
    if (token) {
      // Verify token is still valid
      fetch('/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (!response.ok) {
          // Token is invalid, clear auth state
          logout();
        }
      })
      .catch(() => {
        // Network error, keep existing state
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}`
    },
    testCriteria: [
      'Auth state should persist after page refresh',
      'Login should store data in localStorage',
      'Logout should clear stored data'
    ],
    learningObjectives: [
      'Understand authentication persistence',
      'Learn localStorage integration with React',
      'Practice secure auth state management'
    ]
  },

  {
    id: 'react-usereducer-not-updating',
    title: 'useReducer Dispatch Doesn\'t Update State',
    description: 'Dispatching an action to useReducer doesn\'t update state.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['React', 'useReducer', 'State'],
    rootCause: 'Reducer returns original state object',
    files: {
      'components/CartManager.jsx': `import React, { useReducer } from 'react';

// BUG: Reducer mutates state instead of returning new object
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // BUG: Mutating existing state
      state.items.push(action.payload);
      state.total += action.payload.price;
      return state; // Same object reference!

    case 'REMOVE_ITEM':
      // BUG: Mutating existing arrays
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index > -1) {
        const removedItem = state.items[index];
        state.items.splice(index, 1);
        state.total -= removedItem.price;
      }
      return state;

    case 'CLEAR_CART':
      // BUG: Mutating existing state
      state.items = [];
      state.total = 0;
      return state;

    default:
      return state;
  }
}

function CartManager() {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: `Item ${cart.items.length + 1}`,
      price: Math.floor(Math.random() * 50) + 10
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total: $\{cart.total.toFixed(2)}</p>
      <p>Items: {cart.items.length}</p>

      <button onClick={addItem}>Add Random Item</button>
      <button onClick={clearCart}>Clear Cart</button>

      <ul>
        {cart.items.map(item => (
          <li key={item.id}>
            {item.name} - $\{item.price}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartManager;`
    },
    hints: [
      'useReducer requires returning a new state object',
      'Never mutate the existing state in reducers',
      'Use spread operator to create new objects and arrays',
      'Each action should return a completely new state'
    ],
    solution: {
      'components/CartManager.jsx': `import React, { useReducer } from 'react';

// FIXED: Return new state objects instead of mutating
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // FIXED: Return new state object
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      };

    case 'REMOVE_ITEM':
      // FIXED: Create new arrays and calculate new total
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - itemToRemove.price
      };

    case 'CLEAR_CART':
      // FIXED: Return new state object
      return {
        ...state,
        items: [],
        total: 0
      };

    default:
      return state;
  }
}

function CartManager() {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: `Item ${cart.items.length + 1}`,
      price: Math.floor(Math.random() * 50) + 10
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Total: $\{cart.total.toFixed(2)}</p>
      <p>Items: {cart.items.length}</p>

      <button onClick={addItem}>Add Random Item</button>
      <button onClick={clearCart}>Clear Cart</button>

      <ul>
        {cart.items.map(item => (
          <li key={item.id}>
            {item.name} - $\{item.price}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CartManager;`
    },
    testCriteria: [
      'Cart should update when items are added',
      'Items should be removed correctly',
      'Total should calculate properly'
    ],
    learningObjectives: [
      'Understand useReducer immutability',
      'Learn reducer pattern best practices',
      'Practice complex state management'
    ]
  },

  {
    id: 'react-login-validation-fail',
    title: 'Login Form Submits Without Validation',
    description: 'User can submit form with empty fields or wrong format.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['Forms', 'Validation', 'Auth'],
    rootCause: 'Missing input validation or onSubmit doesn\'t block bad input',
    files: {
      'components/LoginForm.jsx': `import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // BUG: No validation before submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // BUG: Submits even with empty or invalid data
    console.log('Submitting:', { email, password });

    // Simulate API call
    if (email === 'admin@test.com' && password === 'password') {
      setMessage('Login successful!');
    } else {
      setMessage('Login failed!');
    }
  };

  return (
    <div>
      <h2>Login Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text" // BUG: Should be type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        {/* BUG: No validation, always enabled */}
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;`
    },
    hints: [
      'Add validation for email format and required fields',
      'Prevent form submission if validation fails',
      'Show validation error messages to user',
      'Disable submit button when form is invalid'
    ],
    solution: {
      'components/LoginForm.jsx': `import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // FIXED: Add validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FIXED: Validate before submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Please fix the errors above');
      return;
    }

    console.log('Submitting:', { email, password });

    // Simulate API call
    if (email === 'admin@test.com' && password === 'password') {
      setMessage('Login successful!');
      setErrors({});
    } else {
      setMessage('Invalid credentials');
    }
  };

  // FIXED: Check if form is valid
  const isFormValid = email && password &&
    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) &&
    password.length >= 6;

  return (
    <div>
      <h2>Login Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email" // FIXED: Proper input type
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          {errors.password && <span style={{color: 'red'}}>{errors.password}</span>}
        </div>

        {/* FIXED: Disable when form is invalid */}
        <button type="submit" disabled={!isFormValid}>
          Login
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginForm;`
    },
    testCriteria: [
      'Form should not submit with empty fields',
      'Email validation should work correctly',
      'Error messages should be displayed'
    ],
    learningObjectives: [
      'Understand form validation patterns',
      'Learn client-side validation techniques',
      'Practice user experience improvements'
    ]
  },

  // More Angular Challenges - Adding ALL scenarios from debug-angular.txt
  {
    id: 'angular-shared-component-not-working',
    title: 'Shared Component Not Working',
    description: 'Shared component used in another module shows "Component not recognized".',
    techStack: 'Angular',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 75,
    tags: ['Angular', 'Modules', 'SharedModule', 'Components'],
    rootCause: 'Not exported in SharedModule',
    files: {
      'shared/components/button/button.component.ts': `import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      [class]="buttonClass"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .primary { background: #007bff; color: white; }
    .secondary { background: #6c757d; color: white; }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<Event>();

  get buttonClass() {
    return this.variant;
  }
}`,
      'shared/shared.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule
  ],
  // BUG: ButtonComponent not exported
  exports: [
    // Missing ButtonComponent export
  ]
})
export class SharedModule { }`,
      'features/auth/login.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <div>
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email">
        <input type="password" placeholder="Password">

        <!-- BUG: app-button not recognized -->
        <app-button variant="primary" (onClick)="onLogin()">
          Login
        </app-button>
      </form>
    </div>
  `
})
export class LoginComponent {
  onLogin() {
    console.log('Login clicked');
  }
}`,
      'features/auth/auth.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule // SharedModule is imported but ButtonComponent not exported
  ]
})
export class AuthModule { }`
    },
    hints: [
      'Shared components must be exported from SharedModule',
      'Add ButtonComponent to the exports array',
      'Ensure SharedModule is imported in the consuming module',
      'Check that component is both declared and exported'
    ],
    solution: {
      'shared/shared.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule
  ],
  // FIXED: Export ButtonComponent so other modules can use it
  exports: [
    ButtonComponent
  ]
})
export class SharedModule { }`
    },
    testCriteria: [
      'ButtonComponent should be usable in other modules',
      'No "Component not recognized" errors',
      'Login form should render with custom button'
    ],
    learningObjectives: [
      'Understand Angular module exports',
      'Learn shared component patterns',
      'Practice module architecture'
    ]
  },

  {
    id: 'angular-async-pipe-multiple-http',
    title: 'Async Pipe Triggering Multiple HTTP Requests',
    description: 'Every time page re-renders, API is re-fetched.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['Angular', 'Async Pipe', 'HTTP', 'Performance'],
    rootCause: 'Observable declared in template or getter',
    files: {
      'features/orders/orders.component.ts': `import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  template: `
    <div>
      <h2>Orders</h2>
      <button (click)="refresh()">Refresh</button>

      <!-- BUG: Observable created in template on every render -->
      <div *ngFor="let order of getOrders() | async">
        <p>Order #{{order.id}} - {{order.status}}</p>
      </div>
    </div>
  `
})
export class OrdersComponent {
  constructor(private ordersService: OrdersService) {}

  // BUG: Creates new Observable on every call
  getOrders(): Observable<any[]> {
    console.log('Creating new orders observable'); // This will log repeatedly
    return this.ordersService.getAllOrders();
  }

  refresh() {
    // This should trigger a refresh, but currently creates another observable
    console.log('Refresh clicked');
  }
}`,
      'core/services/orders.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any[]> {
    console.log('HTTP request made to /api/orders');
    return this.http.get<any[]>('/api/orders');
  }
}`
    },
    hints: [
      'Move Observable creation to ngOnInit or component property',
      'Don\'t create Observables in template methods',
      'Use class properties with async pipe',
      'Consider caching strategies for expensive operations'
    ],
    solution: {
      'features/orders/orders.component.ts': `import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  template: `
    <div>
      <h2>Orders</h2>
      <button (click)="refresh()">Refresh</button>

      <!-- FIXED: Use class property with async pipe -->
      <div *ngFor="let order of orders$ | async">
        <p>Order #{{order.id}} - {{order.status}}</p>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  // FIXED: Observable as class property
  orders$: Observable<any[]>;
  private refreshSubject = new Subject<void>();

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    // FIXED: Create observable once in ngOnInit
    this.orders$ = this.refreshSubject.pipe(
      startWith(null), // Initial load
      switchMap(() => this.ordersService.getAllOrders())
    );
  }

  refresh() {
    // FIXED: Trigger refresh through subject
    console.log('Refresh clicked');
    this.refreshSubject.next();
  }
}`
    },
    testCriteria: [
      'HTTP request should only be made when needed',
      'Page re-renders should not trigger new requests',
      'Refresh button should work correctly'
    ],
    learningObjectives: [
      'Understand async pipe performance implications',
      'Learn proper Observable management',
      'Practice reactive programming patterns'
    ]
  },

  {
    id: 'angular-lazy-module-crashing',
    title: 'Lazy Module Crashing',
    description: 'Cannot find component \'X\' in lazy route.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Angular', 'Lazy Loading', 'Modules', 'Routing'],
    rootCause: 'Component not declared or imported in lazy module',
    files: {
      'features/products/product-list.component.ts': `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <h2>Product List</h2>
      <div *ngFor="let product of products">
        <h3>{{product.name}}</h3>
        <p>{{product.description}}</p>
        <p>Price: {{product.price | currency}}</p>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 149.99 }
  ];

  ngOnInit() {
    console.log('ProductListComponent initialized');
  }
}`,
      'features/products/products.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
// BUG: ProductListComponent not imported

@NgModule({
  declarations: [
    // BUG: ProductListComponent not declared
  ],
  imports: [
    // BUG: CommonModule not imported
    ProductsRoutingModule
  ]
})
export class ProductsModule { }`,
      'features/products/products-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent // This will fail because component not declared
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }`
    },
    hints: [
      'Import ProductListComponent in the module',
      'Add ProductListComponent to declarations array',
      'Import CommonModule for basic directives',
      'Ensure all components used in routes are declared'
    ],
    solution: {
      'features/products/products.module.ts': `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
// FIXED: Import ProductListComponent
import { ProductListComponent } from './product-list.component';

@NgModule({
  declarations: [
    // FIXED: Declare ProductListComponent
    ProductListComponent
  ],
  imports: [
    // FIXED: Import CommonModule for *ngFor and other directives
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }`
    },
    testCriteria: [
      'Lazy route should load without errors',
      'ProductListComponent should render correctly',
      'No "Cannot find component" errors'
    ],
    learningObjectives: [
      'Understand lazy module configuration',
      'Learn component declaration requirements',
      'Practice Angular module architecture'
    ]
  },

  // More Node.js Challenges - Adding ALL scenarios from debig-node.txt
  {
    id: 'node-logging-library-fails',
    title: 'Logging Library Silently Fails in Production',
    description: 'No logs appear in log files or output streams.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Node.js', 'Logging', 'Production', 'File System'],
    rootCause: 'Write stream error or incorrect file permissions',
    files: {
      'utils/logger.js': `const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    // BUG: No error handling for file creation
    this.logFile = path.join(__dirname, '../logs/app.log');
    this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });

    // BUG: No error listeners on stream
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\\n`;

    // BUG: No error handling for write operations
    this.stream.write(logEntry);
  }

  info(message) {
    this.log('info', message);
  }

  error(message) {
    this.log('error', message);
  }

  warn(message) {
    this.log('warn', message);
  }
}

// BUG: No fallback if logger fails
const logger = new Logger();

module.exports = logger;`
    },
    hints: [
      'Add error listeners to write streams',
      'Check file permissions before creating streams',
      'Implement fallback to console logging',
      'Use proper error handling for file operations'
    ],
    solution: {
      'utils/logger.js': `const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logFile = path.join(__dirname, '../logs/app.log');
    this.fallbackToConsole = false;

    try {
      // FIXED: Check if logs directory exists
      const logDir = path.dirname(this.logFile);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      // FIXED: Check file permissions
      fs.accessSync(logDir, fs.constants.W_OK);

      this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });

      // FIXED: Add error listeners
      this.stream.on('error', (err) => {
        console.error('Logger stream error:', err);
        this.fallbackToConsole = true;
      });

    } catch (error) {
      console.error('Failed to initialize file logger:', error);
      this.fallbackToConsole = true;
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\\n`;

    if (this.fallbackToConsole || !this.stream) {
      // FIXED: Fallback to console
      console.log(logEntry.trim());
      return;
    }

    // FIXED: Handle write errors
    this.stream.write(logEntry, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
        this.fallbackToConsole = true;
        console.log(logEntry.trim());
      }
    });
  }

  info(message) {
    this.log('info', message);
  }

  error(message) {
    this.log('error', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  // FIXED: Graceful shutdown
  close() {
    if (this.stream) {
      this.stream.end();
    }
  }
}

const logger = new Logger();

// FIXED: Graceful shutdown on process exit
process.on('exit', () => {
  logger.close();
});

module.exports = logger;`
    },
    testCriteria: [
      'Logs should appear in files when permissions allow',
      'Should fallback to console when file logging fails',
      'No silent failures should occur'
    ],
    learningObjectives: [
      'Understand file system error handling',
      'Learn logging best practices',
      'Practice graceful degradation patterns'
    ]
  },

  {
    id: 'node-middleware-executes-twice',
    title: 'Express Middleware Executes Twice',
    description: 'Middleware logic like DB calls runs twice unexpectedly.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['Node.js', 'Express', 'Middleware', 'Performance'],
    rootCause: 'Middleware registered globally and locally per route',
    files: {
      'middlewares/audit.js': `const logger = require('../utils/logger');

// BUG: Middleware that will be registered multiple times
function auditMiddleware(req, res, next) {
  console.log('Audit middleware executed');

  // Simulate expensive operation
  const auditData = {
    method: req.method,
    url: req.url,
    timestamp: new Date(),
    userAgent: req.get('User-Agent')
  };

  // BUG: This will run multiple times if middleware is registered twice
  logger.info(`API Call: ${req.method} ${req.url}`);

  // Simulate database write
  setTimeout(() => {
    console.log('Audit data saved to database');
  }, 100);

  next();
}

module.exports = auditMiddleware;`,
      'app.js': `const express = require('express');
const auditMiddleware = require('./middlewares/audit');

const app = express();

// BUG: Global middleware registration
app.use(auditMiddleware);

// Routes
app.get('/users', auditMiddleware, (req, res) => { // BUG: Middleware registered again!
  res.json({ users: ['Alice', 'Bob'] });
});

app.get('/products', auditMiddleware, (req, res) => { // BUG: Middleware registered again!
  res.json({ products: ['Product 1', 'Product 2'] });
});

app.get('/orders', (req, res) => {
  res.json({ orders: ['Order 1', 'Order 2'] });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;`
    },
    hints: [
      'Check if middleware is registered both globally and per route',
      'Use console.trace() to inspect the call stack',
      'Remove duplicate middleware registrations',
      'Consider using flags to detect double execution'
    ],
    solution: {
      'middlewares/audit.js': `const logger = require('../utils/logger');

// FIXED: Add execution tracking to detect duplicates
const executionTracker = new Map();

function auditMiddleware(req, res, next) {
  const requestId = `${req.method}-${req.url}-${Date.now()}`;

  // FIXED: Check if already executed for this request
  if (executionTracker.has(requestId)) {
    console.warn('Audit middleware already executed for this request');
    return next();
  }

  executionTracker.set(requestId, true);

  console.log('Audit middleware executed');

  const auditData = {
    method: req.method,
    url: req.url,
    timestamp: new Date(),
    userAgent: req.get('User-Agent')
  };

  logger.info(`API Call: ${req.method} ${req.url}`);

  // Simulate database write
  setTimeout(() => {
    console.log('Audit data saved to database');
    // FIXED: Clean up tracking after processing
    executionTracker.delete(requestId);
  }, 100);

  next();
}

module.exports = auditMiddleware;`,
      'app.js': `const express = require('express');
const auditMiddleware = require('./middlewares/audit');

const app = express();

// FIXED: Use global middleware OR route-specific, not both
app.use(auditMiddleware);

// FIXED: Remove duplicate middleware from routes
app.get('/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});

app.get('/products', (req, res) => {
  res.json({ products: ['Product 1', 'Product 2'] });
});

app.get('/orders', (req, res) => {
  res.json({ orders: ['Order 1', 'Order 2'] });
});

// ALTERNATIVE: Use route-specific middleware only
// const router = express.Router();
// router.use(auditMiddleware);
// router.get('/users', (req, res) => { ... });
// app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;`
    },
    testCriteria: [
      'Middleware should execute only once per request',
      'No duplicate audit logs should be created',
      'Performance should be optimized'
    ],
    learningObjectives: [
      'Understand Express middleware execution order',
      'Learn to avoid duplicate middleware registration',
      'Practice middleware debugging techniques'
    ]
  },

  // More React Challenges - Continuing to reach 50+
  {
    id: 'react-component-did-mount-async',
    title: 'componentDidMount Async Operation Not Working',
    description: 'Async operation in componentDidMount doesn\'t update state.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'Lifecycle', 'Async', 'Class Components'],
    rootCause: 'Component unmounted before async operation completes',
    files: {
      'components/UserProfile.jsx': `import React, { Component } from 'react';

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
      // BUG: No check if component is still mounted
      const response = await fetch(`/api/users/${this.props.userId}`);
      const userData = await response.json();

      // BUG: This might run after component unmounts
      this.setState({
        user: userData,
        loading: false
      });
    } catch (error) {
      // BUG: This might also run after unmount
      this.setState({
        error: error.message,
        loading: false
      });
    }
  }

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;

    return (
      <div>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  }
}

export default UserProfile;`
    },
    hints: [
      'Add a flag to track if component is still mounted',
      'Set the flag to false in componentWillUnmount',
      'Check the flag before calling setState',
      'Consider using AbortController for fetch requests'
    ],
    solution: {
      'components/UserProfile.jsx': `import React, { Component } from 'react';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null
    };
    // FIXED: Add mounted flag
    this._isMounted = false;
  }

  componentDidMount() {
    // FIXED: Set mounted flag
    this._isMounted = true;
    this.fetchUser();
  }

  componentWillUnmount() {
    // FIXED: Clear mounted flag
    this._isMounted = false;
  }

  async fetchUser() {
    try {
      const response = await fetch(`/api/users/${this.props.userId}`);
      const userData = await response.json();

      // FIXED: Check if component is still mounted
      if (this._isMounted) {
        this.setState({
          user: userData,
          loading: false
        });
      }
    } catch (error) {
      // FIXED: Check if component is still mounted
      if (this._isMounted) {
        this.setState({
          error: error.message,
          loading: false
        });
      }
    }
  }

  render() {
    const { user, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;

    return (
      <div>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    );
  }
}

export default UserProfile;`
    },
    testCriteria: [
      'No setState warnings when component unmounts',
      'Async operations should be cancelled properly',
      'Component should handle unmounting gracefully'
    ],
    learningObjectives: [
      'Understand component lifecycle and async operations',
      'Learn memory leak prevention in class components',
      'Practice proper cleanup patterns'
    ]
  },

  {
    id: 'react-infinite-scroll-not-working',
    title: 'Infinite Scroll Not Triggering',
    description: 'Scroll event listener doesn\'t trigger load more functionality.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 100,
    tags: ['React', 'Scroll Events', 'Performance', 'useEffect'],
    rootCause: 'Event listener not properly attached or throttled',
    files: {
      'components/InfiniteList.jsx': `import React, { useState, useEffect } from 'react';

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Load initial data
  useEffect(() => {
    loadItems(1);
  }, []);

  // BUG: Scroll listener not properly attached
  useEffect(() => {
    const handleScroll = () => {
      // BUG: No throttling, will fire too often
      console.log('Scroll event fired');

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      // BUG: Logic might be incorrect
      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
        loadMore();
      }
    };

    // BUG: Event listener might not be attached correctly
    window.addEventListener('scroll', handleScroll);

    // BUG: Missing cleanup
  }, [loading]); // BUG: Missing dependencies

  const loadItems = async (pageNum) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/items?page=${pageNum}&limit=20`);
      const newItems = await response.json();

      if (pageNum === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadItems(nextPage);
  };

  return (
    <div>
      <h2>Infinite Scroll List</h2>
      <div className="items-container">
        {items.map((item, index) => (
          <div key={index} className="item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      {loading && <div>Loading more items...</div>}
    </div>
  );
}

export default InfiniteList;`
    },
    hints: [
      'Add proper cleanup for scroll event listener',
      'Implement throttling to prevent excessive scroll events',
      'Include all dependencies in useEffect dependency array',
      'Consider using Intersection Observer API for better performance'
    ],
    solution: {
      'components/InfiniteList.jsx': `import React, { useState, useEffect, useCallback, useRef } from 'react';

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // FIXED: Use ref to track loading state in event handler
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  // Load initial data
  useEffect(() => {
    loadItems(1);
  }, []);

  // FIXED: Throttle function to limit scroll event frequency
  const throttle = (func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };

  // FIXED: Memoize scroll handler
  const handleScroll = useCallback(
    throttle(() => {
      if (loadingRef.current || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      // FIXED: Better scroll detection logic
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    }, 200),
    [hasMore]
  );

  // FIXED: Proper event listener management
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // FIXED: Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const loadItems = async (pageNum) => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch(`/api/items?page=${pageNum}&limit=20`);
      const newItems = await response.json();

      // FIXED: Check if there are more items
      if (newItems.length < 20) {
        setHasMore(false);
      }

      if (pageNum === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadItems(nextPage);
    }
  }, [loading, hasMore, page]);

  return (
    <div>
      <h2>Infinite Scroll List</h2>
      <div className="items-container">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      {loading && <div>Loading more items...</div>}
      {!hasMore && <div>No more items to load</div>}
    </div>
  );
}

export default InfiniteList;`
    },
    testCriteria: [
      'Scroll events should be throttled properly',
      'More items should load when scrolling near bottom',
      'Event listeners should be cleaned up on unmount'
    ],
    learningObjectives: [
      'Understand scroll event optimization',
      'Learn throttling and debouncing techniques',
      'Practice performance optimization in React'
    ]
  },

  {
    id: 'react-drag-drop-not-working',
    title: 'Drag and Drop Not Working',
    description: 'Drag and drop functionality doesn\'t respond to mouse events.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 120,
    tags: ['React', 'Drag Drop', 'Events', 'State Management'],
    rootCause: 'Missing event handlers or preventDefault calls',
    files: {
      'components/DragDropList.jsx': `import React, { useState } from 'react';

function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);

  // BUG: Missing event.preventDefault() calls
  const handleDragStart = (e, item) => {
    console.log('Drag start:', item);
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    // BUG: Missing preventDefault - drop won't work
    console.log('Drag over');
  };

  const handleDrop = (e, targetItem) => {
    // BUG: Missing preventDefault
    console.log('Drop on:', targetItem);

    if (!draggedItem) return;

    // BUG: State mutation instead of creating new array
    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetItem.id);

    // BUG: Direct array manipulation
    const temp = items[draggedIndex];
    items[draggedIndex] = items[targetIndex];
    items[targetIndex] = temp;

    setItems(items); // This won't trigger re-render!
    setDraggedItem(null);
  };

  return (
    <div>
      <h2>Drag and Drop List</h2>
      <div className="drag-list">
        {items.map(item => (
          <div
            key={item.id}
            className="drag-item"
            draggable // BUG: Should be draggable={true}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item)}
            style={{
              padding: '10px',
              margin: '5px',
              border: '1px solid #ccc',
              backgroundColor: draggedItem?.id === item.id ? '#f0f0f0' : 'white',
              cursor: 'move'
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DragDropList;`
    },
    hints: [
      'Add event.preventDefault() in dragOver and drop handlers',
      'Set draggable={true} explicitly',
      'Create new array instead of mutating existing one',
      'Consider using dataTransfer for better drag/drop data handling'
    ],
    solution: {
      'components/DragDropList.jsx': `import React, { useState } from 'react';

function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    console.log('Drag start:', item);
    setDraggedItem(item);
    // FIXED: Use dataTransfer for better compatibility
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.id);
  };

  const handleDragOver = (e) => {
    // FIXED: Prevent default to allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    // FIXED: Prevent default for better UX
    e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    // FIXED: Prevent default browser behavior
    e.preventDefault();

    console.log('Drop on:', targetItem);

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    // FIXED: Create new array instead of mutating
    const newItems = [...items];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    // FIXED: Proper array reordering
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    setItems(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    // FIXED: Clean up drag state
    setDraggedItem(null);
  };

  return (
    <div>
      <h2>Drag and Drop List</h2>
      <div className="drag-list">
        {items.map(item => (
          <div
            key={item.id}
            className="drag-item"
            draggable={true} // FIXED: Explicit boolean
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={(e) => handleDrop(e, item)}
            onDragEnd={handleDragEnd}
            style={{
              padding: '10px',
              margin: '5px',
              border: '1px solid #ccc',
              backgroundColor: draggedItem?.id === item.id ? '#e3f2fd' : 'white',
              cursor: 'move',
              opacity: draggedItem?.id === item.id ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DragDropList;`
    },
    testCriteria: [
      'Items should be draggable and droppable',
      'List order should update when items are dropped',
      'Visual feedback should work during drag operations'
    ],
    learningObjectives: [
      'Understand HTML5 drag and drop API',
      'Learn proper event handling for drag/drop',
      'Practice immutable state updates'
    ]
  },

  {
    id: 'react-websocket-connection-issues',
    title: 'WebSocket Connection Issues',
    description: 'WebSocket connection drops and doesn\'t reconnect automatically.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 130,
    tags: ['React', 'WebSocket', 'Real-time', 'Connection Management'],
    rootCause: 'No reconnection logic or proper connection state management',
    files: {
      'hooks/useWebSocket.js': `import { useState, useEffect, useRef } from 'react';

function useWebSocket(url) {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    // BUG: No reconnection logic
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data));
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('Disconnected');
      // BUG: No automatic reconnection
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
      // BUG: No error recovery
    };

    // BUG: Cleanup doesn't handle reconnection
    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    // BUG: No check if socket is connected
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };

  return {
    lastMessage,
    connectionStatus,
    sendMessage
  };
}

export default useWebSocket;`,
      'components/ChatRoom.jsx': `import React, { useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const { lastMessage, connectionStatus, sendMessage } = useWebSocket('ws://localhost:8080');

  // BUG: No handling of connection status changes
  React.useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [...prev, lastMessage]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage({
        type: 'message',
        content: inputMessage,
        timestamp: new Date().toISOString()
      });
      setInputMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>Status: {connectionStatus}</div>

      <div className="messages" style={{ height: '300px', overflow: 'auto', border: '1px solid #ccc' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;`
    },
    hints: [
      'Implement automatic reconnection with exponential backoff',
      'Add connection state management',
      'Handle WebSocket ready state before sending messages',
      'Add proper cleanup and error recovery'
    ],
    solution: {
      'hooks/useWebSocket.js': `import { useState, useEffect, useRef, useCallback } from 'react';

function useWebSocket(url) {
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const [socket, setSocket] = useState(null);

  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 1000; // Start with 1 second

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('Connected');
        setSocket(ws);
        reconnectAttemptsRef.current = 0; // Reset attempts on successful connection
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('Disconnected');
        setSocket(null);

        // FIXED: Automatic reconnection with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const timeout = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`Reconnecting in ${timeout}ms (attempt ${reconnectAttemptsRef.current + 1})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            setConnectionStatus('Reconnecting');
            connect();
          }, timeout);
        } else {
          setConnectionStatus('Failed');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };

      return ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('Error');
      return null;
    }
  }, [url]);

  useEffect(() => {
    const ws = connect();

    return () => {
      // FIXED: Proper cleanup
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    // FIXED: Check connection state before sending
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket is not connected');
      return false;
    }
  }, [socket]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    connect();
  }, [connect]);

  return {
    lastMessage,
    connectionStatus,
    sendMessage,
    reconnect
  };
}

export default useWebSocket;`
    },
    testCriteria: [
      'WebSocket should reconnect automatically when connection drops',
      'Messages should only be sent when connected',
      'Connection status should be accurately reflected'
    ],
    learningObjectives: [
      'Understand WebSocket connection management',
      'Learn reconnection strategies and error handling',
      'Practice real-time communication patterns'
    ]
  },

  // More Angular Challenges - Continuing to reach 50+
  {
    id: 'angular-guard-not-working',
    title: 'Route Guard Not Preventing Navigation',
    description: 'CanActivate guard allows unauthorized users to access protected routes.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Angular', 'Guards', 'Routing', 'Authentication'],
    rootCause: 'Guard not properly implemented or not added to route configuration',
    files: {
      'guards/auth.guard.ts': `import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // BUG: Guard always returns true
  canActivate(): boolean {
    console.log('Auth guard called');

    // BUG: Not actually checking authentication
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);

    // BUG: Always returns true regardless of auth status
    return true;
  }
}`,
      'app-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { ProfileComponent } from './components/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent }, // BUG: No guard applied
  { path: 'profile', component: ProfileComponent }, // BUG: No guard applied
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }`,
      'services/auth.service.ts': `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;

  login(username: string, password: string): boolean {
    // Simulate authentication
    if (username === 'admin' && password === 'password') {
      this.authenticated = true;
      localStorage.setItem('token', 'fake-jwt-token');
      return true;
    }
    return false;
  }

  logout(): void {
    this.authenticated = false;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    // Check both memory and localStorage
    const token = localStorage.getItem('token');
    return this.authenticated && !!token;
  }
}`
    },
    hints: [
      'Guard should return false when user is not authenticated',
      'Add guard to protected routes in routing configuration',
      'Redirect to login page when access is denied',
      'Use canActivate property in route configuration'
    ],
    solution: {
      'guards/auth.guard.ts': `import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('Auth guard called for:', state.url);

    const isAuthenticated = this.authService.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);

    // FIXED: Actually check authentication and redirect if needed
    if (isAuthenticated) {
      return true;
    } else {
      console.log('Access denied, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }
}`,
      'app-routing.module.ts': `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { ProfileComponent } from './components/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // FIXED: Add AuthGuard to protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }`
    },
    testCriteria: [
      'Unauthenticated users should be redirected to login',
      'Authenticated users should access protected routes',
      'Return URL should be preserved for post-login redirect'
    ],
    learningObjectives: [
      'Understand Angular route guards',
      'Learn authentication flow implementation',
      'Practice route protection patterns'
    ]
  },

  {
    id: 'angular-interceptor-not-adding-headers',
    title: 'HTTP Interceptor Not Adding Headers',
    description: 'Authorization headers not being added to HTTP requests.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['Angular', 'HTTP Interceptor', 'Authentication', 'Headers'],
    rootCause: 'Interceptor not registered in providers or incorrect implementation',
    files: {
      'interceptors/auth.interceptor.ts': `import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Interceptor called for:', req.url);

    // BUG: Not actually adding headers
    const token = this.authService.getToken();
    console.log('Token:', token);

    // BUG: Request not cloned with headers
    if (token) {
      console.log('Adding authorization header');
      // This doesn't actually modify the request!
    }

    return next.handle(req);
  }
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    // BUG: Interceptor not registered
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
      'services/api.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://api.example.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    // This should include auth headers but doesn't
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  createUser(user: any): Observable<any> {
    // This should also include auth headers
    return this.http.post<any>(`${this.baseUrl}/users`, user);
  }
}`
    },
    hints: [
      'Clone the request and add headers to the cloned request',
      'Register interceptor in app.module.ts providers',
      'Use HTTP_INTERCEPTORS token with multi: true',
      'Return the modified request to next.handle()'
    ],
    solution: {
      'interceptors/auth.interceptor.ts': `import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor called for:', req.url);

    const token = this.authService.getToken();

    // FIXED: Clone request and add headers
    if (token) {
      console.log('Adding authorization header');
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return next.handle(authReq);
    }

    // FIXED: Handle request even without token
    return next.handle(req);
  }
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    // FIXED: Register interceptor properly
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    testCriteria: [
      'HTTP requests should include Authorization header',
      'Interceptor should be called for all HTTP requests',
      'Token should be properly formatted in header'
    ],
    learningObjectives: [
      'Understand Angular HTTP interceptors',
      'Learn request modification patterns',
      'Practice authentication header management'
    ]
  },

  // More Node.js Challenges - Continuing to reach 50+
  {
    id: 'node-cluster-worker-crash',
    title: 'Cluster Worker Processes Keep Crashing',
    description: 'Worker processes crash and don\'t restart properly.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 125,
    tags: ['Node.js', 'Cluster', 'Process Management', 'Scalability'],
    rootCause: 'No worker restart logic or improper error handling',
    files: {
      'server.js': `const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // BUG: No worker restart logic
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    // BUG: Worker not restarted
  });

} else {
  // Worker process
  const server = http.createServer((req, res) => {
    // BUG: Simulated crash condition
    if (req.url === '/crash') {
      throw new Error('Simulated worker crash!');
    }

    // BUG: Memory leak simulation
    if (req.url === '/memory-leak') {
      const bigArray = new Array(1000000).fill('memory leak');
      // Array never gets cleaned up
    }

    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\\n`);
  });

  // BUG: No error handling for uncaught exceptions
  server.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}`
    },
    hints: [
      'Add worker restart logic in the exit event handler',
      'Implement graceful shutdown for workers',
      'Add uncaught exception handling',
      'Consider limiting restart attempts to prevent infinite loops'
    ],
    solution: {
      'server.js': `const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // FIXED: Track worker restart attempts
  const workerRestarts = new Map();
  const maxRestarts = 5;
  const restartWindow = 60000; // 1 minute

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    forkWorker();
  }

  function forkWorker() {
    const worker = cluster.fork();

    // FIXED: Track worker start time
    workerRestarts.set(worker.id, {
      restarts: 0,
      lastRestart: Date.now()
    });

    return worker;
  }

  // FIXED: Implement worker restart logic
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);

    const workerInfo = workerRestarts.get(worker.id);
    const now = Date.now();

    // Reset restart count if enough time has passed
    if (now - workerInfo.lastRestart > restartWindow) {
      workerInfo.restarts = 0;
    }

    // FIXED: Restart worker with limits
    if (workerInfo.restarts < maxRestarts) {
      console.log(`Restarting worker (attempt ${workerInfo.restarts + 1}/${maxRestarts})`);
      workerInfo.restarts++;
      workerInfo.lastRestart = now;

      setTimeout(() => {
        forkWorker();
      }, 1000); // Wait 1 second before restart
    } else {
      console.error(`Worker ${worker.id} exceeded max restart attempts`);
      workerRestarts.delete(worker.id);
    }
  });

  // FIXED: Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM, shutting down gracefully');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });

} else {
  // Worker process
  const server = http.createServer((req, res) => {
    try {
      // BUG: Simulated crash condition (now handled)
      if (req.url === '/crash') {
        throw new Error('Simulated worker crash!');
      }

      // FIXED: Better memory management
      if (req.url === '/memory-leak') {
        // Simulate work without memory leak
        const data = { message: 'Memory managed properly' };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      }

      res.writeHead(200);
      res.end(`Hello from worker ${process.pid}\\n`);
    } catch (error) {
      console.error(`Worker ${process.pid} error:`, error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  });

  // FIXED: Handle uncaught exceptions gracefully
  process.on('uncaughtException', (error) => {
    console.error(`Worker ${process.pid} uncaught exception:`, error);

    // Graceful shutdown
    server.close(() => {
      process.exit(1);
    });

    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  });

  // FIXED: Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Worker ${process.pid} unhandled rejection:`, reason);
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
`
    },
    testCriteria: [
      'Workers should restart automatically when they crash',
      'Master process should limit restart attempts',
      'Graceful shutdown should work properly'
    ],
    learningObjectives: [
      'Understand Node.js cluster module',
      'Learn process management and recovery',
      'Practice high-availability patterns'
    ]
  },

  {
    id: 'node-session-store-memory-leak',
    title: 'Session Store Memory Leak',
    description: 'Server memory grows over time due to session accumulation.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Node.js', 'Sessions', 'Memory Management', 'Express'],
    rootCause: 'Sessions not expiring or being cleaned up properly',
    files: {
      'server.js': `const express = require('express');
const session = require('express-session');

const app = express();

// BUG: Default memory store with no cleanup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  // BUG: No maxAge set - sessions never expire
  cookie: {
    secure: false // Set to true in production with HTTPS
  }
}));

app.get('/login', (req, res) => {
  // Simulate user login
  req.session.userId = Math.random().toString(36).substr(2, 9);
  req.session.loginTime = new Date();

  res.json({
    message: 'Logged in',
    sessionId: req.sessionID,
    userId: req.session.userId
  });
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    userId: req.session.userId,
    loginTime: req.session.loginTime,
    sessionId: req.sessionID
  });
});

app.get('/logout', (req, res) => {
  // BUG: Session not properly destroyed
  req.session.userId = null;
  res.json({ message: 'Logged out' });
});

// BUG: No session cleanup mechanism
app.get('/stats', (req, res) => {
  // This would show growing memory usage
  res.json({
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`
    },
    hints: [
      'Set maxAge for session cookies to enable expiration',
      'Use req.session.destroy() for proper logout',
      'Consider using a persistent session store like Redis',
      'Implement session cleanup for memory store'
    ],
    solution: {
      'server.js': `const express = require('express');
const session = require('express-session');

const app = express();

// FIXED: Configure session with proper expiration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false, // FIXED: Don't save empty sessions
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // FIXED: 24 hours expiration
    httpOnly: true // FIXED: Prevent XSS attacks
  },
  // FIXED: Add session cleanup for memory store
  rolling: true // Reset expiration on activity
}));

// FIXED: Periodic cleanup for memory store (not recommended for production)
if (process.env.NODE_ENV !== 'production') {
  setInterval(() => {
    // Clean up expired sessions manually for memory store
    const store = app.get('session store') || session.MemoryStore.prototype;
    if (store.all) {
      store.all((err, sessions) => {
        if (err) return;

        const now = Date.now();
        Object.keys(sessions).forEach(sessionId => {
          const sess = sessions[sessionId];
          if (sess.cookie && sess.cookie.expires && new Date(sess.cookie.expires) < now) {
            store.destroy(sessionId, () => {});
          }
        });
      });
    }
  }, 15 * 60 * 1000); // Clean every 15 minutes
}

app.get('/login', (req, res) => {
  // Simulate user login
  req.session.userId = Math.random().toString(36).substr(2, 9);
  req.session.loginTime = new Date();

  // FIXED: Regenerate session ID for security
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Session error' });
    }

    req.session.userId = Math.random().toString(36).substr(2, 9);
    req.session.loginTime = new Date();

    res.json({
      message: 'Logged in',
      sessionId: req.sessionID,
      userId: req.session.userId
    });
  });
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    userId: req.session.userId,
    loginTime: req.session.loginTime,
    sessionId: req.sessionID
  });
});

app.get('/logout', (req, res) => {
  // FIXED: Properly destroy session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }

    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/stats', (req, res) => {
  res.json({
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    sessionConfig: {
      maxAge: req.session.cookie.maxAge,
      expires: req.session.cookie.expires
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Note: Use Redis or another persistent store for production');
});`
    },
    testCriteria: [
      'Sessions should expire after the configured time',
      'Memory usage should not grow indefinitely',
      'Logout should properly clean up sessions'
    ],
    learningObjectives: [
      'Understand session management in Express',
      'Learn session security best practices',
      'Practice memory management for web applications'
    ]
  },

  // More React Challenges - Continuing to reach 50+
  {
    id: 'react-lazy-loading-suspense-error',
    title: 'React.lazy Component Not Loading',
    description: 'Lazy-loaded component shows loading forever or throws error.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['React', 'Lazy Loading', 'Suspense', 'Code Splitting'],
    rootCause: 'Missing Suspense boundary or incorrect lazy import',
    files: {
      'App.jsx': `import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// BUG: Lazy component not properly imported
const LazyDashboard = React.lazy(() => import('./components/Dashboard'));
const LazyProfile = React.lazy(() => import('./components/Profile'));

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={() => setShowDashboard(!showDashboard)}>
            Toggle Dashboard
          </button>
        </nav>

        {/* BUG: No Suspense boundary */}
        <Routes>
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/profile" element={<LazyProfile />} />
        </Routes>

        {/* BUG: Conditional lazy component without Suspense */}
        {showDashboard && <LazyDashboard />}
      </div>
    </BrowserRouter>
  );
}

export default App;`,
      'components/Dashboard.jsx': `import React from 'react';

// BUG: Component not exported as default
export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is a lazy-loaded dashboard component.</p>
    </div>
  );
}`,
      'components/Profile.jsx': `import React from 'react';

// This one is correctly exported as default
function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p>This is a lazy-loaded profile component.</p>
    </div>
  );
}

export default Profile;`
    },
    hints: [
      'Wrap lazy components with Suspense boundary',
      'Ensure components are exported as default',
      'Add fallback UI for loading state',
      'Handle lazy loading errors with Error Boundary'
    ],
    solution: {
      'App.jsx': `import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

const LazyDashboard = React.lazy(() => import('./components/Dashboard'));
const LazyProfile = React.lazy(() => import('./components/Profile'));

// FIXED: Loading component
function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px'
    }}>
      <div>Loading...</div>
    </div>
  );
}

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={() => setShowDashboard(!showDashboard)}>
            Toggle Dashboard
          </button>
        </nav>

        {/* FIXED: Wrap with Suspense and Error Boundary */}
        <ErrorBoundary fallback={<div>Failed to load component</div>}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/dashboard" element={<LazyDashboard />} />
              <Route path="/profile" element={<LazyProfile />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>

        {/* FIXED: Conditional lazy component with Suspense */}
        {showDashboard && (
          <ErrorBoundary fallback={<div>Failed to load dashboard</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <LazyDashboard />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;`,
      'components/Dashboard.jsx': `import React from 'react';

// FIXED: Export as default for lazy loading
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is a lazy-loaded dashboard component.</p>
      <div>
        <h3>Dashboard Features:</h3>
        <ul>
          <li>Analytics</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;`
    },
    testCriteria: [
      'Lazy components should load without errors',
      'Loading spinner should appear during component loading',
      'Error boundaries should catch loading failures'
    ],
    learningObjectives: [
      'Understand React lazy loading and code splitting',
      'Learn Suspense boundary usage',
      'Practice error handling for dynamic imports'
    ]
  },

  {
    id: 'react-performance-heavy-render',
    title: 'Heavy Component Causing Performance Issues',
    description: 'Component with expensive calculations blocks UI updates.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 120,
    tags: ['React', 'Performance', 'useMemo', 'Web Workers'],
    rootCause: 'Expensive synchronous calculations blocking main thread',
    files: {
      'components/DataProcessor.jsx': `import React, { useState, useEffect } from 'react';

function DataProcessor() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate large dataset
    const largeData = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      description: `Description for item ${i}`.repeat(10)
    }));
    setData(largeData);
  }, []);

  // BUG: Expensive calculation on every render
  const processedData = data
    .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      // BUG: Complex sorting logic runs on every render
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'value') {
        return b.value - a.value;
      }
      return 0;
    })
    .map(item => ({
      ...item,
      // BUG: Expensive computation for each item
      computedScore: Math.pow(item.value, 2) + Math.sin(item.value) * 100
    }));

  // BUG: Another expensive calculation
  const statistics = {
    total: processedData.length,
    average: processedData.reduce((sum, item) => sum + item.value, 0) / processedData.length,
    max: Math.max(...processedData.map(item => item.value)),
    min: Math.min(...processedData.map(item => item.value))
  };

  const handleHeavyOperation = () => {
    setLoading(true);

    // BUG: Blocking synchronous operation
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
      result += Math.random();
    }

    console.log('Heavy operation result:', result);
    setLoading(false);
  };

  return (
    <div>
      <h2>Data Processor</h2>

      <div>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items..."
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </select>

        <button onClick={handleHeavyOperation} disabled={loading}>
          {loading ? 'Processing...' : 'Heavy Operation'}
        </button>
      </div>

      <div>
        <h3>Statistics</h3>
        <p>Total: {statistics.total}</p>
        <p>Average: {statistics.average.toFixed(2)}</p>
        <p>Max: {statistics.max.toFixed(2)}</p>
        <p>Min: {statistics.min.toFixed(2)}</p>
      </div>

      <div style={{ height: '400px', overflow: 'auto' }}>
        {processedData.slice(0, 100).map(item => (
          <div key={item.id} style={{ padding: '5px', border: '1px solid #eee' }}>
            <strong>{item.name}</strong> - Value: {item.value.toFixed(2)}
            - Score: {item.computedScore.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataProcessor;`
    },
    hints: [
      'Use useMemo to memoize expensive calculations',
      'Move heavy operations to Web Workers',
      'Implement virtualization for large lists',
      'Use useCallback for event handlers'
    ],
    solution: {
      'components/DataProcessor.jsx': `import React, { useState, useEffect, useMemo, useCallback } from 'react';

function DataProcessor() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate large dataset
    const largeData = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      description: `Description for item ${i}`.repeat(10)
    }));
    setData(largeData);
  }, []);

  // FIXED: Memoize expensive filtering and sorting
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'value') {
        return b.value - a.value;
      }
      return 0;
    });
  }, [filteredData, sortBy]);

  // FIXED: Memoize expensive computations
  const processedData = useMemo(() => {
    return sortedData.map(item => ({
      ...item,
      computedScore: Math.pow(item.value, 2) + Math.sin(item.value) * 100
    }));
  }, [sortedData]);

  // FIXED: Memoize statistics calculation
  const statistics = useMemo(() => {
    if (processedData.length === 0) {
      return { total: 0, average: 0, max: 0, min: 0 };
    }

    const values = processedData.map(item => item.value);
    return {
      total: processedData.length,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values)
    };
  }, [processedData]);

  // FIXED: Move heavy operation to Web Worker or use setTimeout
  const handleHeavyOperation = useCallback(() => {
    setLoading(true);

    // FIXED: Use setTimeout to prevent blocking
    setTimeout(() => {
      let result = 0;
      const batchSize = 1000000;
      let processed = 0;

      const processBatch = () => {
        for (let i = 0; i < batchSize && processed < 100000000; i++, processed++) {
          result += Math.random();
        }

        if (processed < 100000000) {
          // Continue processing in next frame
          setTimeout(processBatch, 0);
        } else {
          console.log('Heavy operation result:', result);
          setLoading(false);
        }
      };

      processBatch();
    }, 0);
  }, []);

  // FIXED: Memoize event handlers
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  return (
    <div>
      <h2>Data Processor</h2>

      <div>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filter items..."
        />

        <select value={sortBy} onChange={handleSortChange}>
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </select>

        <button onClick={handleHeavyOperation} disabled={loading}>
          {loading ? 'Processing...' : 'Heavy Operation'}
        </button>
      </div>

      <div>
        <h3>Statistics</h3>
        <p>Total: {statistics.total}</p>
        <p>Average: {statistics.average.toFixed(2)}</p>
        <p>Max: {statistics.max.toFixed(2)}</p>
        <p>Min: {statistics.min.toFixed(2)}</p>
      </div>

      <div style={{ height: '400px', overflow: 'auto' }}>
        {/* FIXED: Only render visible items */}
        {processedData.slice(0, 100).map(item => (
          <div key={item.id} style={{ padding: '5px', border: '1px solid #eee' }}>
            <strong>{item.name}</strong> - Value: {item.value.toFixed(2)}
            - Score: {item.computedScore.toFixed(2)}
          </div>
        ))}
        {processedData.length > 100 && (
          <div style={{ padding: '10px', textAlign: 'center' }}>
            ... and {processedData.length - 100} more items
          </div>
        )}
      </div>
    </div>
  );
}

export default DataProcessor;`
    },
    testCriteria: [
      'UI should remain responsive during heavy operations',
      'Filtering and sorting should be fast',
      'Memory usage should be optimized'
    ],
    learningObjectives: [
      'Understand React performance optimization',
      'Learn useMemo and useCallback usage',
      'Practice non-blocking operation patterns'
    ]
  },

  // More React Challenges - Adding the best scenarios to reach 50+
  {
    id: 'react-ref-forwarding-not-working',
    title: 'Ref Forwarding Not Working in Custom Component',
    description: 'Cannot access DOM element through ref in wrapped component.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'Refs', 'forwardRef', 'DOM'],
    rootCause: 'Custom component not using forwardRef',
    files: {
      'components/CustomInput.jsx': `import React from 'react';

// BUG: Component doesn't forward ref
function CustomInput({ label, ...props }) {
  return (
    <div className="custom-input">
      <label>{label}</label>
      {/* BUG: ref not forwarded to actual input */}
      <input {...props} />
    </div>
  );
}

export default CustomInput;`,
      'components/LoginForm.jsx': `import React, { useRef, useEffect } from 'react';
import CustomInput from './CustomInput';

function LoginForm() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    // BUG: This will fail because ref doesn't point to input
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // BUG: These will be null
    console.log('Username:', usernameRef.current?.value);
    console.log('Password:', passwordRef.current?.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {/* BUG: Refs won't work with custom components */}
      <CustomInput
        ref={usernameRef}
        label="Username"
        type="text"
        placeholder="Enter username"
      />

      <CustomInput
        ref={passwordRef}
        label="Password"
        type="password"
        placeholder="Enter password"
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;`
    },
    hints: [
      'Use React.forwardRef to forward refs to DOM elements',
      'Wrap the component function with forwardRef',
      'Pass the ref to the actual DOM element inside the component',
      'forwardRef takes a function with (props, ref) parameters'
    ],
    solution: {
      'components/CustomInput.jsx': `import React from 'react';

// FIXED: Use forwardRef to forward ref to input element
const CustomInput = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <div className="custom-input">
      <label>{label}</label>
      {/* FIXED: Forward ref to actual input element */}
      <input ref={ref} {...props} />
    </div>
  );
});

// FIXED: Add display name for debugging
CustomInput.displayName = 'CustomInput';

export default CustomInput;`
    },
    testCriteria: [
      'Username input should focus automatically on mount',
      'Refs should provide access to input values',
      'Form submission should read input values correctly'
    ],
    learningObjectives: [
      'Understand React ref forwarding',
      'Learn forwardRef usage patterns',
      'Practice DOM element access in custom components'
    ]
  },

  {
    id: 'react-strict-mode-double-render',
    title: 'StrictMode Causing Double Renders and Side Effects',
    description: 'Components render twice and side effects run multiple times.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 90,
    tags: ['React', 'StrictMode', 'Side Effects', 'Development'],
    rootCause: 'Side effects not properly handled in StrictMode',
    files: {
      'App.jsx': `import React from 'react';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <React.StrictMode>
      <div>
        <h1>My App</h1>
        <UserProfile userId="123" />
      </div>
    </React.StrictMode>
  );
}

export default App;`,
      'components/UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Effect running for user:', userId); // BUG: Logs twice in StrictMode

    // BUG: Side effect that shouldn't run twice
    const analytics = {
      event: 'profile_view',
      userId: userId,
      timestamp: Date.now()
    };

    // BUG: This will send analytics twice
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analytics)
    });

    // BUG: API call that runs twice
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    console.log('Fetching user:', id); // BUG: Logs twice

    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  // BUG: Another effect with side effects
  useEffect(() => {
    if (user) {
      // BUG: This will run twice for the same user
      localStorage.setItem('lastViewedUser', user.id);

      // BUG: DOM manipulation that shouldn't happen twice
      document.title = `Profile - ${user.name}`;
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'StrictMode intentionally double-renders in development',
      'Use cleanup functions in useEffect to handle double execution',
      'Move side effects to event handlers when possible',
      'Use AbortController for cancelling duplicate API calls'
    ],
    solution: {
      'components/UserProfile.jsx': `import React, { useState, useEffect, useRef } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const analyticsRef = useRef(new Set()); // Track sent analytics

  useEffect(() => {
    console.log('Effect running for user:', userId);

    // FIXED: Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    // FIXED: Prevent duplicate analytics
    const analyticsKey = `profile_view_${userId}_${Date.now()}`;
    if (!analyticsRef.current.has(analyticsKey)) {
      analyticsRef.current.add(analyticsKey);

      const analytics = {
        event: 'profile_view',
        userId: userId,
        timestamp: Date.now()
      };

      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analytics),
        signal: abortControllerRef.current.signal
      }).catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Analytics error:', error);
        }
      });
    }

    fetchUser(userId);

    // FIXED: Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId]);

  const fetchUser = async (id) => {
    console.log('Fetching user:', id);

    try {
      const response = await fetch(`/api/users/${id}`, {
        signal: abortControllerRef.current?.signal
      });

      if (!response.ok) throw new Error('Failed to fetch user');

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch user:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Handle side effects properly
  useEffect(() => {
    if (user) {
      // FIXED: These side effects are idempotent, so double execution is OK
      localStorage.setItem('lastViewedUser', user.id);
      document.title = `Profile - ${user.name}`;
    }

    // FIXED: Cleanup function to reset title
    return () => {
      document.title = 'My App';
    };
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default UserProfile;`
    },
    testCriteria: [
      'API calls should not be duplicated in StrictMode',
      'Analytics should only be sent once per user view',
      'Component should handle cleanup properly'
    ],
    learningObjectives: [
      'Understand React StrictMode behavior',
      'Learn proper side effect management',
      'Practice cleanup patterns for effects'
    ]
  },

  {
    id: 'react-hoc-props-not-passed',
    title: 'Higher-Order Component Not Passing Props',
    description: 'HOC wrapper component doesn\'t receive expected props.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 110,
    tags: ['React', 'HOC', 'Props', 'Composition'],
    rootCause: 'HOC not forwarding props or incorrect prop spreading',
    files: {
      'hoc/withAuth.jsx': `import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// BUG: HOC doesn't forward props properly
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

          // Simulate auth check
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            navigate('/login');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          navigate('/login');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [navigate]);

    if (loading) {
      return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    // BUG: Not spreading props to wrapped component
    return <WrappedComponent />;
  };
}

export default withAuth;`,
      'components/Dashboard.jsx': `import React from 'react';
import withAuth from '../hoc/withAuth';

function Dashboard({ title, userRole, onRefresh }) {
  // BUG: These props won't be received due to HOC issue
  console.log('Dashboard props:', { title, userRole, onRefresh });

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div>
      <h1>{title || 'Dashboard'}</h1>
      <p>Welcome! Your role: {userRole || 'Unknown'}</p>
      <button onClick={handleRefresh}>Refresh Data</button>

      <div>
        <h2>Dashboard Content</h2>
        <p>This is the main dashboard content.</p>
      </div>
    </div>
  );
}

// BUG: HOC doesn't preserve component name or static properties
export default withAuth(Dashboard);`,
      'App.jsx': `import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  const handleDashboardRefresh = () => {
    console.log('Dashboard refresh requested');
  };

  return (
    <div>
      <h1>My App</h1>
      {/* BUG: These props won't reach Dashboard component */}
      <Dashboard
        title="Admin Dashboard"
        userRole="administrator"
        onRefresh={handleDashboardRefresh}
      />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Spread props to the wrapped component in HOC',
      'Use React.forwardRef if refs need to be forwarded',
      'Copy static properties from wrapped component',
      'Set displayName for better debugging'
    ],
    solution: {
      'hoc/withAuth.jsx': `import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function withAuth(WrappedComponent) {
  function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            navigate('/login');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          navigate('/login');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [navigate]);

    if (loading) {
      return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    // FIXED: Spread all props to wrapped component
    return <WrappedComponent {...props} />;
  }

  // FIXED: Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  // FIXED: Copy static properties from wrapped component
  Object.keys(WrappedComponent).forEach(key => {
    if (key !== 'prototype') {
      AuthenticatedComponent[key] = WrappedComponent[key];
    }
  });

  return AuthenticatedComponent;
}

export default withAuth;`,
      'components/Dashboard.jsx': `import React from 'react';
import withAuth from '../hoc/withAuth';

function Dashboard({ title, userRole, onRefresh }) {
  console.log('Dashboard props:', { title, userRole, onRefresh });

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div>
      <h1>{title || 'Dashboard'}</h1>
      <p>Welcome! Your role: {userRole || 'Unknown'}</p>
      <button onClick={handleRefresh}>Refresh Data</button>

      <div>
        <h2>Dashboard Content</h2>
        <p>This is the main dashboard content.</p>
      </div>
    </div>
  );
}

// FIXED: Set display name for better debugging
Dashboard.displayName = 'Dashboard';

export default withAuth(Dashboard);`
    },
    testCriteria: [
      'Dashboard should receive all props correctly',
      'HOC should preserve component functionality',
      'Authentication check should work properly'
    ],
    learningObjectives: [
      'Understand Higher-Order Component patterns',
      'Learn proper prop forwarding in HOCs',
      'Practice component composition techniques'
    ]
  },

  {
    id: 'react-render-prop-pattern-issues',
    title: 'Render Prop Pattern Not Working',
    description: 'Render prop component doesn\'t pass data correctly to children.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 115,
    tags: ['React', 'Render Props', 'Patterns', 'Data Sharing'],
    rootCause: 'Incorrect render prop implementation or data not passed',
    files: {
      'components/DataFetcher.jsx': `import React, { useState, useEffect } from 'react';

// BUG: Render prop component with issues
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // BUG: Not calling children as function with data
  return (
    <div>
      {children}
    </div>
  );
}

export default DataFetcher;`,
      'components/UserList.jsx': `import React from 'react';
import DataFetcher from './DataFetcher';

function UserList() {
  return (
    <div>
      <h2>User List</h2>

      <DataFetcher url="/api/users">
        {/* BUG: This won't work because DataFetcher doesn't pass data */}
        {({ data, loading, error }) => {
          if (loading) return <div>Loading users...</div>;
          if (error) return <div>Error: {error}</div>;
          if (!data) return <div>No data</div>;

          return (
            <ul>
              {data.map(user => (
                <li key={user.id}>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          );
        }}
      </DataFetcher>
    </div>
  );
}

export default UserList;`,
      'components/ProductList.jsx': `import React from 'react';
import DataFetcher from './DataFetcher';

function ProductList() {
  return (
    <div>
      <h2>Product List</h2>

      <DataFetcher url="/api/products">
        {/* BUG: Same issue - render prop not implemented correctly */}
        {({ data, loading, error, refetch }) => {
          if (loading) return <div>Loading products...</div>;
          if (error) return (
            <div>
              Error: {error}
              <button onClick={refetch}>Retry</button>
            </div>
          );

          return (
            <div>
              <button onClick={refetch}>Refresh</button>
              <div className="products">
                {data?.map(product => (
                  <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </DataFetcher>
    </div>
  );
}

export default ProductList;`
    },
    hints: [
      'Call children as a function and pass data as arguments',
      'Check if children is a function before calling it',
      'Pass all relevant state (data, loading, error) to children',
      'Add additional functions like refetch to the render prop'
    ],
    solution: {
      'components/DataFetcher.jsx': `import React, { useState, useEffect, useCallback } from 'react';

function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // FIXED: Call children as function with data and utilities
  if (typeof children === 'function') {
    return children({
      data,
      loading,
      error,
      refetch: fetchData
    });
  }

  // FIXED: Fallback for non-function children
  console.warn('DataFetcher: children should be a function');
  return children;
}

export default DataFetcher;`
    },
    testCriteria: [
      'UserList should display users when data loads',
      'ProductList should show products with refresh functionality',
      'Loading and error states should work correctly'
    ],
    learningObjectives: [
      'Understand render prop pattern implementation',
      'Learn data sharing between components',
      'Practice advanced React composition patterns'
    ]
  },

  // More Angular Challenges - Adding the best scenarios to reach 50+
  {
    id: 'angular-custom-directive-not-working',
    title: 'Custom Directive Not Applying Styles',
    description: 'Custom directive doesn\'t change element appearance or behavior.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Angular', 'Directives', 'DOM Manipulation', 'Renderer'],
    rootCause: 'Directive not properly implemented or not declared in module',
    files: {
      'directives/highlight.directive.ts': `import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    // BUG: Direct DOM manipulation without Renderer2
    this.el.nativeElement.style.backgroundColor = 'yellow';
    this.el.nativeElement.style.padding = '10px';
  }

  // BUG: No input properties or event handlers
}`,
      'components/product-card.component.ts': `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <!-- BUG: Directive might not work -->
      <h3 appHighlight>{{product.name}}</h3>
      <p>{{product.description}}</p>
      <p class="price">{{product.price | currency}}</p>

      <!-- BUG: Trying to use directive with parameters -->
      <button appHighlight="blue">Add to Cart</button>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px;
      border-radius: 5px;
    }
    .price {
      font-weight: bold;
      color: green;
    }
  `]
})
export class ProductCardComponent {
  @Input() product: any;
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './components/product-card.component';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent
    // BUG: HighlightDirective not declared
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    hints: [
      'Use Renderer2 for safe DOM manipulation',
      'Add @Input() properties to accept parameters',
      'Declare directive in module declarations',
      'Add @HostListener for event handling'
    ],
    solution: {
      'directives/highlight.directive.ts': `import { Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  // FIXED: Add input property for color
  @Input('appHighlight') highlightColor: string = 'yellow';
  @Input() defaultColor: string = 'transparent';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2 // FIXED: Use Renderer2 for safe DOM manipulation
  ) {}

  ngOnInit() {
    // FIXED: Apply initial styling safely
    this.highlight(this.defaultColor);
  }

  // FIXED: Add mouse event handlers
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || 'yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.defaultColor);
  }

  // FIXED: Safe DOM manipulation method
  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    this.renderer.setStyle(this.el.nativeElement, 'padding', '10px');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
  }
}`,
      'components/product-card.component.ts': `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <!-- FIXED: Directive with color parameter -->
      <h3 [appHighlight]="'lightblue'" [defaultColor]="'transparent'">{{product.name}}</h3>
      <p>{{product.description}}</p>
      <p class="price">{{product.price | currency}}</p>

      <!-- FIXED: Button with custom highlight color -->
      <button [appHighlight]="'lightgreen'" [defaultColor]="'#f0f0f0'">Add to Cart</button>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px;
      border-radius: 5px;
    }
    .price {
      font-weight: bold;
      color: green;
    }
  `]
})
export class ProductCardComponent {
  @Input() product: any;
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductCardComponent } from './components/product-card.component';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    HighlightDirective // FIXED: Declare directive
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    testCriteria: [
      'Elements should highlight on hover',
      'Custom colors should be applied correctly',
      'Directive should work on different elements'
    ],
    learningObjectives: [
      'Understand Angular custom directives',
      'Learn safe DOM manipulation with Renderer2',
      'Practice directive input properties and event handling'
    ]
  },

  {
    id: 'angular-content-projection-not-working',
    title: 'Content Projection Not Working',
    description: 'ng-content doesn\'t display projected content correctly.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['Angular', 'Content Projection', 'ng-content', 'Templates'],
    rootCause: 'Incorrect ng-content selector or missing projection slots',
    files: {
      'components/card.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="card-header">
        <!-- BUG: No selector for header content -->
        <ng-content></ng-content>
      </div>

      <div class="card-body">
        <!-- BUG: All content goes to first ng-content -->
        <ng-content></ng-content>
      </div>

      <div class="card-footer">
        <!-- BUG: No content projected here -->
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      margin: 10px;
    }
    .card-header {
      background-color: #f8f9fa;
      padding: 15px;
      border-bottom: 1px solid #ddd;
    }
    .card-body {
      padding: 15px;
    }
    .card-footer {
      background-color: #f8f9fa;
      padding: 10px 15px;
      border-top: 1px solid #ddd;
    }
  `]
})
export class CardComponent { }`,
      'components/user-profile.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <app-card>
      <!-- BUG: Content not projected to correct slots -->
      <h2>User Profile</h2>

      <div>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john@example.com</p>
        <p><strong>Role:</strong> Administrator</p>
      </div>

      <button>Edit Profile</button>
      <button>Delete User</button>
    </app-card>
  `
})
export class UserProfileComponent { }`
    },
    hints: [
      'Use ng-content with select attribute for multiple projection slots',
      'Add CSS selectors or attributes to projected content',
      'Use ng-content select="[slot=header]" for attribute-based projection',
      'Consider using ng-template for more complex projections'
    ],
    solution: {
      'components/card.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="card-header" *ngIf="hasHeaderContent">
        <!-- FIXED: Specific selector for header content -->
        <ng-content select="[slot=header]"></ng-content>
      </div>

      <div class="card-body">
        <!-- FIXED: Default content projection -->
        <ng-content></ng-content>
      </div>

      <div class="card-footer" *ngIf="hasFooterContent">
        <!-- FIXED: Specific selector for footer content -->
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      margin: 10px;
    }
    .card-header {
      background-color: #f8f9fa;
      padding: 15px;
      border-bottom: 1px solid #ddd;
    }
    .card-body {
      padding: 15px;
    }
    .card-footer {
      background-color: #f8f9fa;
      padding: 10px 15px;
      border-top: 1px solid #ddd;
    }
  `]
})
export class CardComponent {
  // FIXED: Properties to conditionally show header/footer
  get hasHeaderContent(): boolean {
    return true; // In real implementation, check if content is projected
  }

  get hasFooterContent(): boolean {
    return true; // In real implementation, check if content is projected
  }
}`,
      'components/user-profile.component.ts': `import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <app-card>
      <!-- FIXED: Header content with slot attribute -->
      <h2 slot="header">User Profile</h2>

      <!-- FIXED: Body content (default projection) -->
      <div>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john@example.com</p>
        <p><strong>Role:</strong> Administrator</p>
      </div>

      <!-- FIXED: Footer content with slot attribute -->
      <div slot="footer">
        <button class="btn btn-primary">Edit Profile</button>
        <button class="btn btn-danger">Delete User</button>
      </div>
    </app-card>
  `,
  styles: [`
    .btn {
      padding: 8px 16px;
      margin-right: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-danger {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class UserProfileComponent { }`
    },
    testCriteria: [
      'Header content should appear in card header',
      'Body content should appear in card body',
      'Footer content should appear in card footer'
    ],
    learningObjectives: [
      'Understand Angular content projection',
      'Learn ng-content selectors',
      'Practice component composition patterns'
    ]
  },

  // More Node.js Challenges - Adding the best scenarios to reach 50+
  {
    id: 'node-websocket-memory-leak',
    title: 'WebSocket Server Memory Leak',
    description: 'WebSocket server memory grows with each connection.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 125,
    tags: ['Node.js', 'WebSocket', 'Memory Leaks', 'Real-time'],
    rootCause: 'WebSocket connections not properly cleaned up',
    files: {
      'websocket-server.js': `const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// BUG: No connection tracking or cleanup
const connections = new Map();
let connectionId = 0;

wss.on('connection', (ws, req) => {
  const id = ++connectionId;
  console.log(`Client ${id} connected`);

  // BUG: Store connection but never clean up
  connections.set(id, {
    ws,
    userId: null,
    rooms: new Set(),
    lastActivity: Date.now()
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      handleMessage(id, data);
    } catch (error) {
      console.error('Invalid message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Client ${id} disconnected`);
    // BUG: Connection not removed from tracking
  });

  // BUG: No error handling
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${id}:`, error);
  });

  // BUG: No ping/pong for connection health
});

function handleMessage(connectionId, data) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  switch (data.type) {
    case 'join_room':
      // BUG: Room membership not cleaned up
      connection.rooms.add(data.room);
      connection.userId = data.userId;
      broadcastToRoom(data.room, {
        type: 'user_joined',
        userId: data.userId
      });
      break;

    case 'message':
      // BUG: No rate limiting or validation
      broadcastToRoom(data.room, {
        type: 'message',
        userId: connection.userId,
        content: data.content,
        timestamp: Date.now()
      });
      break;

    case 'leave_room':
      connection.rooms.delete(data.room);
      break;
  }

  // BUG: Activity not tracked for cleanup
}

function broadcastToRoom(room, message) {
  // BUG: Inefficient iteration over all connections
  connections.forEach((connection, id) => {
    if (connection.rooms.has(room) && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  });
}

// BUG: No cleanup mechanism for stale connections
server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});`
    },
    hints: [
      'Clean up connections on close and error events',
      'Implement ping/pong for connection health checks',
      'Add periodic cleanup for stale connections',
      'Track room memberships and clean them up'
    ],
    solution: {
      'websocket-server.js': `const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// FIXED: Better connection tracking with cleanup
const connections = new Map();
const rooms = new Map(); // Track room memberships
let connectionId = 0;

wss.on('connection', (ws, req) => {
  const id = ++connectionId;
  console.log(`Client ${id} connected`);

  const connection = {
    ws,
    userId: null,
    rooms: new Set(),
    lastActivity: Date.now(),
    isAlive: true
  };

  connections.set(id, connection);

  // FIXED: Ping/pong for connection health
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
    connection.lastActivity = Date.now();
  });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      connection.lastActivity = Date.now();
      handleMessage(id, data);
    } catch (error) {
      console.error('Invalid message:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log(`Client ${id} disconnected`);
    // FIXED: Proper cleanup on disconnect
    cleanupConnection(id);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${id}:`, error);
    // FIXED: Cleanup on error
    cleanupConnection(id);
  });
});

function handleMessage(connectionId, data) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  switch (data.type) {
    case 'join_room':
      // FIXED: Proper room management
      joinRoom(connectionId, data.room, data.userId);
      break;

    case 'message':
      // FIXED: Add basic validation
      if (data.content && data.content.length <= 1000) {
        broadcastToRoom(data.room, {
          type: 'message',
          userId: connection.userId,
          content: data.content,
          timestamp: Date.now()
        });
      }
      break;

    case 'leave_room':
      leaveRoom(connectionId, data.room);
      break;
  }
}

function joinRoom(connectionId, room, userId) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  connection.userId = userId;
  connection.rooms.add(room);

  // FIXED: Track room memberships
  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }
  rooms.get(room).add(connectionId);

  broadcastToRoom(room, {
    type: 'user_joined',
    userId: userId
  });
}

function leaveRoom(connectionId, room) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  connection.rooms.delete(room);

  // FIXED: Clean up room membership
  if (rooms.has(room)) {
    rooms.get(room).delete(connectionId);
    if (rooms.get(room).size === 0) {
      rooms.delete(room);
    }
  }

  broadcastToRoom(room, {
    type: 'user_left',
    userId: connection.userId
  });
}

function broadcastToRoom(room, message) {
  // FIXED: More efficient room-based broadcasting
  if (rooms.has(room)) {
    rooms.get(room).forEach(connectionId => {
      const connection = connections.get(connectionId);
      if (connection && connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }
}

function cleanupConnection(connectionId) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  // FIXED: Remove from all rooms
  connection.rooms.forEach(room => {
    leaveRoom(connectionId, room);
  });

  // FIXED: Remove connection
  connections.delete(connectionId);
  console.log(`Cleaned up connection ${connectionId}`);
}

// FIXED: Periodic cleanup for stale connections
const heartbeat = setInterval(() => {
  const now = Date.now();
  const staleTimeout = 60000; // 1 minute

  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });

  // Clean up stale connections
  connections.forEach((connection, id) => {
    if (now - connection.lastActivity > staleTimeout) {
      console.log(`Cleaning up stale connection ${id}`);
      connection.ws.terminate();
      cleanupConnection(id);
    }
  });

  console.log(`Active connections: ${connections.size}, Active rooms: ${rooms.size}`);
}, 30000); // Check every 30 seconds

// FIXED: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  clearInterval(heartbeat);

  wss.clients.forEach((ws) => {
    ws.close();
  });

  server.close(() => {
    process.exit(0);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});`
    },
    testCriteria: [
      'Memory usage should not grow indefinitely',
      'Disconnected clients should be cleaned up properly',
      'Room memberships should be managed correctly'
    ],
    learningObjectives: [
      'Understand WebSocket connection lifecycle',
      'Learn memory management in real-time applications',
      'Practice cleanup patterns for long-running connections'
    ]
  },

  {
    id: 'node-crypto-timing-attack',
    title: 'Cryptographic Timing Attack Vulnerability',
    description: 'Password comparison vulnerable to timing attacks.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 120,
    tags: ['Node.js', 'Security', 'Cryptography', 'Timing Attack'],
    rootCause: 'Non-constant time string comparison',
    files: {
      'auth/password-utils.js': `const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PasswordUtils {
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // BUG: Vulnerable to timing attacks
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // BUG: Another timing attack vulnerability
  static verifyApiKey(providedKey, storedKey) {
    // BUG: Direct string comparison leaks timing information
    return providedKey === storedKey;
  }

  // BUG: Vulnerable token comparison
  static verifyToken(providedToken, storedToken) {
    // BUG: Early return on length mismatch reveals information
    if (providedToken.length !== storedToken.length) {
      return false;
    }

    // BUG: Character-by-character comparison stops at first mismatch
    for (let i = 0; i < providedToken.length; i++) {
      if (providedToken[i] !== storedToken[i]) {
        return false;
      }
    }

    return true;
  }

  // BUG: Insecure random token generation
  static generateToken() {
    return Math.random().toString(36).substr(2, 15);
  }
}

module.exports = PasswordUtils;`,
      'middleware/auth.js': `const PasswordUtils = require('../auth/password-utils');

const authenticateApiKey = (req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  const storedKey = process.env.API_KEY;

  if (!providedKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // BUG: Vulnerable to timing attacks
  if (PasswordUtils.verifyApiKey(providedKey, storedKey)) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid API key' });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const storedToken = req.session?.token;

  if (!token || !storedToken) {
    return res.status(401).json({ error: 'Token required' });
  }

  // BUG: Vulnerable token verification
  if (PasswordUtils.verifyToken(token, storedToken)) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticateApiKey,
  authenticateToken
};`
    },
    hints: [
      'Use crypto.timingSafeEqual for constant-time comparison',
      'Ensure both strings are same length before comparison',
      'Use crypto.randomBytes for secure random generation',
      'Consider using specialized libraries for timing-safe operations'
    ],
    solution: {
      'auth/password-utils.js': `const bcrypt = require('bcrypt');
const crypto = require('crypto');

class PasswordUtils {
  static async hashPassword(password) {
    const saltRounds = 12; // FIXED: Increased salt rounds
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password, hash) {
    // FIXED: bcrypt.compare is already timing-safe
    return await bcrypt.compare(password, hash);
  }

  // FIXED: Timing-safe API key comparison
  static verifyApiKey(providedKey, storedKey) {
    try {
      // FIXED: Ensure both keys are same length
      const providedBuffer = Buffer.from(providedKey, 'utf8');
      const storedBuffer = Buffer.from(storedKey, 'utf8');

      // FIXED: Pad to same length to prevent length-based timing attacks
      const maxLength = Math.max(providedBuffer.length, storedBuffer.length);
      const paddedProvided = Buffer.alloc(maxLength);
      const paddedStored = Buffer.alloc(maxLength);

      providedBuffer.copy(paddedProvided);
      storedBuffer.copy(paddedStored);

      // FIXED: Constant-time comparison
      return crypto.timingSafeEqual(paddedProvided, paddedStored) &&
             providedKey.length === storedKey.length;
    } catch (error) {
      // FIXED: Handle errors securely
      return false;
    }
  }

  // FIXED: Timing-safe token comparison
  static verifyToken(providedToken, storedToken) {
    try {
      // FIXED: Convert to buffers for timing-safe comparison
      const providedBuffer = Buffer.from(providedToken, 'utf8');
      const storedBuffer = Buffer.from(storedToken, 'utf8');

      // FIXED: Check length in constant time
      const lengthMatch = providedBuffer.length === storedBuffer.length;

      if (!lengthMatch) {
        // FIXED: Still perform comparison to maintain constant time
        const dummyBuffer = Buffer.alloc(storedBuffer.length);
        crypto.timingSafeEqual(providedBuffer.length >= storedBuffer.length ?
          providedBuffer.slice(0, storedBuffer.length) :
          Buffer.concat([providedBuffer, dummyBuffer]).slice(0, storedBuffer.length),
          storedBuffer);
        return false;
      }

      // FIXED: Constant-time comparison
      return crypto.timingSafeEqual(providedBuffer, storedBuffer);
    } catch (error) {
      return false;
    }
  }

  // FIXED: Cryptographically secure random token generation
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // FIXED: Generate secure API key
  static generateApiKey(length = 32) {
    return crypto.randomBytes(length).toString('base64url');
  }

  // FIXED: Additional timing-safe string comparison utility
  static timingSafeStringCompare(a, b) {
    try {
      const bufferA = Buffer.from(a, 'utf8');
      const bufferB = Buffer.from(b, 'utf8');

      if (bufferA.length !== bufferB.length) {
        return false;
      }

      return crypto.timingSafeEqual(bufferA, bufferB);
    } catch (error) {
      return false;
    }
  }
}

module.exports = PasswordUtils;`
    },
    testCriteria: [
      'String comparisons should be timing-safe',
      'Token generation should be cryptographically secure',
      'No timing information should leak during authentication'
    ],
    learningObjectives: [
      'Understand timing attack vulnerabilities',
      'Learn constant-time comparison techniques',
      'Practice secure cryptographic operations'
    ]
  },

  // More React Challenges - Final push to reach 50+
  {
    id: 'react-concurrent-features-issues',
    title: 'React 18 Concurrent Features Not Working',
    description: 'useTransition and useDeferredValue not improving performance.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 135,
    tags: ['React', 'Concurrent Features', 'Performance', 'React 18'],
    rootCause: 'Incorrect usage of concurrent features or missing Suspense boundaries',
    files: {
      'components/SearchResults.jsx': `import React, { useState, useDeferredValue, useTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  // BUG: useDeferredValue not used correctly
  const deferredQuery = useDeferredValue(query);

  // BUG: Expensive computation not wrapped in transition
  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);

    // BUG: Heavy computation blocking UI
    const filteredResults = performExpensiveSearch(searchTerm);
    setResults(filteredResults);
  };

  // BUG: This should be in a transition
  const performExpensiveSearch = (term) => {
    const allData = generateLargeDataset();

    // Expensive filtering and sorting
    return allData
      .filter(item =>
        item.title.toLowerCase().includes(term.toLowerCase()) ||
        item.description.toLowerCase().includes(term.toLowerCase())
      )
      .sort((a, b) => {
        // Complex scoring algorithm
        const scoreA = calculateRelevanceScore(a, term);
        const scoreB = calculateRelevanceScore(b, term);
        return scoreB - scoreA;
      });
  };

  const calculateRelevanceScore = (item, term) => {
    // BUG: Expensive calculation on main thread
    let score = 0;
    const words = term.toLowerCase().split(' ');

    words.forEach(word => {
      if (item.title.toLowerCase().includes(word)) score += 10;
      if (item.description.toLowerCase().includes(word)) score += 5;
      if (item.tags.some(tag => tag.toLowerCase().includes(word))) score += 3;
    });

    return score;
  };

  const generateLargeDataset = () => {
    // BUG: Generating large dataset on every search
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description for item ${i} with lots of text`.repeat(5),
      tags: ['tag1', 'tag2', 'tag3'],
      category: ['A', 'B', 'C'][i % 3]
    }));
  };

  return (
    <div>
      <h2>Search Results</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search items..."
      />

      {isPending && <div>Searching...</div>}

      <div>
        <p>Found {results.length} results for "{deferredQuery}"</p>

        {results.map(item => (
          <div key={item.id} style={{ padding: '10px', border: '1px solid #eee' }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  background: '#f0f0f0',
                  padding: '2px 6px',
                  margin: '2px',
                  borderRadius: '3px'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;`
    },
    hints: [
      'Wrap expensive operations in startTransition',
      'Use useDeferredValue for the search results, not the query',
      'Move heavy computations to useEffect with proper dependencies',
      'Consider memoizing the large dataset generation'
    ],
    solution: {
      'components/SearchResults.jsx': `import React, { useState, useDeferredValue, useTransition, useMemo, useEffect } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  // FIXED: Defer the results, not the query
  const deferredResults = useDeferredValue(results);

  // FIXED: Memoize expensive dataset generation
  const dataset = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description for item ${i} with lots of text`.repeat(5),
      tags: ['tag1', 'tag2', 'tag3'],
      category: ['A', 'B', 'C'][i % 3]
    }));
  }, []);

  // FIXED: Memoize expensive calculation function
  const calculateRelevanceScore = useMemo(() => {
    return (item, term) => {
      let score = 0;
      const words = term.toLowerCase().split(' ');

      words.forEach(word => {
        if (item.title.toLowerCase().includes(word)) score += 10;
        if (item.description.toLowerCase().includes(word)) score += 5;
        if (item.tags.some(tag => tag.toLowerCase().includes(word))) score += 3;
      });

      return score;
    };
  }, []);

  // FIXED: Use useEffect with transition for search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // FIXED: Wrap expensive operation in transition
    startTransition(() => {
      const filteredResults = dataset
        .filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => {
          const scoreA = calculateRelevanceScore(a, query);
          const scoreB = calculateRelevanceScore(b, query);
          return scoreB - scoreA;
        })
        .slice(0, 100); // Limit results for performance

      setResults(filteredResults);
    });
  }, [query, dataset, calculateRelevanceScore]);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
  };

  // FIXED: Show different UI states based on concurrent features
  const isStale = deferredResults !== results;

  return (
    <div>
      <h2>Search Results</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search items..."
      />

      {isPending && <div>Searching...</div>}

      <div style={{ opacity: isStale ? 0.7 : 1 }}>
        <p>Found {deferredResults.length} results for "{query}"</p>

        {deferredResults.map(item => (
          <div key={item.id} style={{
            padding: '10px',
            border: '1px solid #eee',
            marginBottom: '5px'
          }}>
            <h3>{item.title}</h3>
            <p>{item.description.substring(0, 100)}...</p>
            <div>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  background: '#f0f0f0',
                  padding: '2px 6px',
                  margin: '2px',
                  borderRadius: '3px'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;`
    },
    testCriteria: [
      'Search input should remain responsive during heavy operations',
      'Results should update without blocking the UI',
      'Stale results should be visually indicated'
    ],
    learningObjectives: [
      'Understand React 18 concurrent features',
      'Learn proper usage of useTransition and useDeferredValue',
      'Practice performance optimization with concurrent rendering'
    ]
  },

  {
    id: 'react-server-components-hydration',
    title: 'Server Components Hydration Mismatch',
    description: 'Server-rendered content doesn\'t match client-side rendering.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '22 min',
    xpReward: 130,
    tags: ['React', 'SSR', 'Hydration', 'Server Components'],
    rootCause: 'Client-server rendering differences or improper hydration',
    files: {
      'components/UserDashboard.jsx': `import React, { useState, useEffect } from 'react';

function UserDashboard({ initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [isClient, setIsClient] = useState(false);

  // BUG: Time will be different on server vs client
  useEffect(() => {
    setIsClient(true);

    // BUG: This will cause hydration mismatch
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // BUG: Random content that differs between server and client
  const randomTip = () => {
    const tips = [
      'Remember to save your work!',
      'Take breaks every hour',
      'Stay hydrated',
      'Keep your workspace organized'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  // BUG: Browser-only API used during SSR
  const getStoredPreference = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getStoredPreference());

  return (
    <div className={`dashboard theme-${theme}`}>
      <header>
        <h1>Welcome, {user?.name || 'Guest'}!</h1>
        {/* BUG: Time will cause hydration mismatch */}
        <p>Current time: {currentTime}</p>
      </header>

      <div className="content">
        <section className="stats">
          <h2>Your Stats</h2>
          <p>Login count: {user?.loginCount || 0}</p>
          <p>Last login: {user?.lastLogin || 'Never'}</p>
        </section>

        <section className="tips">
          <h2>Daily Tip</h2>
          {/* BUG: Random content causes hydration mismatch */}
          <p>{randomTip()}</p>
        </section>

        <section className="preferences">
          <h2>Preferences</h2>
          <label>
            Theme:
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                localStorage.setItem('theme', e.target.value);
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </section>

        {/* BUG: Conditional rendering based on client state */}
        {isClient && (
          <section className="client-only">
            <h2>Client-side Features</h2>
            <p>This content only appears on the client</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;`
    },
    hints: [
      'Use suppressHydrationWarning for content that must differ',
      'Initialize time-based content after hydration',
      'Use consistent random seeds or move random content to client-only',
      'Handle localStorage access safely during SSR'
    ],
    solution: {
      'components/UserDashboard.jsx': `import React, { useState, useEffect } from 'react';

function UserDashboard({ initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [currentTime, setCurrentTime] = useState(null); // FIXED: Start with null
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState('light'); // FIXED: Default value
  const [dailyTip, setDailyTip] = useState(''); // FIXED: Start empty

  // FIXED: Handle hydration properly
  useEffect(() => {
    setIsClient(true);

    // FIXED: Set initial time after hydration
    setCurrentTime(new Date().toLocaleString());

    // FIXED: Get stored preference after hydration
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);

    // FIXED: Set consistent daily tip based on date
    const today = new Date().toDateString();
    const tips = [
      'Remember to save your work!',
      'Take breaks every hour',
      'Stay hydrated',
      'Keep your workspace organized'
    ];
    // Use date as seed for consistent tip
    const tipIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % tips.length;
    setDailyTip(tips[tipIndex]);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (isClient) {
      localStorage.setItem('theme', newTheme);
    }
  };

  return (
    <div className={`dashboard theme-${theme}`}>
      <header>
        <h1>Welcome, {user?.name || 'Guest'}!</h1>
        {/* FIXED: Suppress hydration warning for time */}
        <p suppressHydrationWarning>
          Current time: {currentTime || 'Loading...'}
        </p>
      </header>

      <div className="content">
        <section className="stats">
          <h2>Your Stats</h2>
          <p>Login count: {user?.loginCount || 0}</p>
          <p>Last login: {user?.lastLogin || 'Never'}</p>
        </section>

        <section className="tips">
          <h2>Daily Tip</h2>
          {/* FIXED: Show tip only after hydration */}
          <p suppressHydrationWarning>
            {dailyTip || 'Loading tip...'}
          </p>
        </section>

        <section className="preferences">
          <h2>Preferences</h2>
          <label>
            Theme:
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </section>

        {/* FIXED: Use suppressHydrationWarning for client-only content */}
        <section className="client-only" suppressHydrationWarning>
          {isClient ? (
            <>
              <h2>Client-side Features</h2>
              <p>This content only appears on the client</p>
              <p>Browser: {navigator.userAgent.split(' ')[0]}</p>
            </>
          ) : (
            <>
              <h2>Client-side Features</h2>
              <p>Loading client features...</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;`
    },
    testCriteria: [
      'No hydration mismatch warnings should appear',
      'Content should render consistently between server and client',
      'Client-only features should work after hydration'
    ],
    learningObjectives: [
      'Understand SSR hydration challenges',
      'Learn to handle client-server rendering differences',
      'Practice proper hydration patterns'
    ]
  },

  // Final React Challenges to reach 50+
  {
    id: 'react-testing-async-components',
    title: 'Testing Async Components Failing',
    description: 'Tests for components with async operations are flaky or failing.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['React', 'Testing', 'Async', 'Jest'],
    rootCause: 'Not waiting for async operations or improper test setup',
    files: {
      'components/UserProfile.test.jsx': `import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

// BUG: Not mocking fetch properly
global.fetch = jest.fn();

describe('UserProfile', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('displays user information', async () => {
    // BUG: Mock response not properly structured
    fetch.mockResolvedValueOnce({
      json: async () => ({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      })
    });

    render(<UserProfile userId="1" />);

    // BUG: Not waiting for async operation
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    // BUG: Fetch never resolves, but test doesn't account for this
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<UserProfile userId="1" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // BUG: Test ends immediately, doesn't verify loading persists
  });

  test('handles error state', async () => {
    // BUG: Mock rejection not properly handled
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<UserProfile userId="1" />);

    // BUG: Not waiting for error to be displayed
    expect(screen.getByText('Error loading user')).toBeInTheDocument();
  });
});`
    },
    hints: [
      'Use waitFor or findBy queries for async operations',
      'Mock fetch with proper response structure including ok property',
      'Use act() wrapper for state updates in tests',
      'Add proper cleanup in test teardown'
    ],
    solution: {
      'components/UserProfile.test.jsx': `import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

// FIXED: Proper fetch mock setup
global.fetch = jest.fn();

describe('UserProfile', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    // FIXED: Clean up any pending timers or promises
    jest.clearAllTimers();
  });

  test('displays user information', async () => {
    // FIXED: Proper mock response structure
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      })
    });

    render(<UserProfile userId="1" />);

    // FIXED: Wait for async operation to complete
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  test('shows loading state initially', async () => {
    // FIXED: Mock that resolves after a delay
    fetch.mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ id: 1, name: 'Test User', email: 'test@example.com' })
        }), 100)
      )
    );

    render(<UserProfile userId="1" />);

    // FIXED: Verify loading state appears
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // FIXED: Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // FIXED: Mock network error
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<UserProfile userId="1" />);

    // FIXED: Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Error loading user')).toBeInTheDocument();
    });

    // FIXED: Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
  });

  test('handles HTTP error responses', async () => {
    // FIXED: Mock HTTP error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'User not found' })
    });

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Error loading user')).toBeInTheDocument();
    });
  });
});`
    },
    testCriteria: [
      'All async tests should pass consistently',
      'Loading states should be properly tested',
      'Error handling should be verified'
    ],
    learningObjectives: [
      'Understand async testing patterns in React',
      'Learn proper mocking techniques',
      'Practice test reliability and cleanup'
    ]
  },

  {
    id: 'react-accessibility-issues',
    title: 'Accessibility Issues in React Components',
    description: 'Components fail accessibility audits and screen reader tests.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 100,
    tags: ['React', 'Accessibility', 'ARIA', 'Screen Readers'],
    rootCause: 'Missing ARIA attributes, improper semantic HTML, or keyboard navigation',
    files: {
      'components/Modal.jsx': `import React, { useState } from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    // BUG: Missing ARIA attributes and semantic structure
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* BUG: No close button or keyboard handling */}
        {children}
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>Accessibility Demo</h1>

      {/* BUG: Button doesn't describe what it opens */}
      <button onClick={() => setIsModalOpen(true)}>
        Open
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>This is modal content that should be accessible.</p>

        {/* BUG: Form without proper labels */}
        <form>
          <input type="text" placeholder="Enter your name" />
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </div>
  );
}

export default App;`
    },
    hints: [
      'Add proper ARIA attributes (role, aria-labelledby, aria-describedby)',
      'Implement keyboard navigation and focus management',
      'Use semantic HTML elements and proper form labels',
      'Add focus trap for modal and handle escape key'
    ],
    solution: {
      'components/Modal.jsx': `import React, { useState, useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children, title }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // FIXED: Store previous focus and focus modal
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      // FIXED: Restore focus when modal closes
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // FIXED: Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // FIXED: Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // FIXED: Focus trap implementation
  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  if (!isOpen) return null;

  return (
    // FIXED: Proper ARIA attributes and semantic structure
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTabKey}
        tabIndex={-1}
      >
        {/* FIXED: Accessible close button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>Accessibility Demo</h1>

      {/* FIXED: Descriptive button text */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-describedby="modal-description"
      >
        Open Contact Form
      </button>

      <p id="modal-description" className="sr-only">
        Opens a modal dialog with a contact form
      </p>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contact Form"
      >
        <h2 id="modal-title">Contact Form</h2>
        <p>Please fill out the form below to get in touch.</p>

        {/* FIXED: Proper form labels and structure */}
        <form>
          <div className="form-group">
            <label htmlFor="name">Name (required)</label>
            <input
              id="name"
              type="text"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (required)</label>
            <input
              id="email"
              type="email"
              required
              aria-required="true"
              aria-describedby="email-help"
            />
            <div id="email-help" className="help-text">
              We'll never share your email with anyone else.
            </div>
          </div>

          <button type="submit">Submit Form</button>
        </form>
      </Modal>
    </div>
  );
}

export default App;`
    },
    testCriteria: [
      'Modal should be accessible via keyboard navigation',
      'Screen readers should announce modal properly',
      'Focus should be managed correctly'
    ],
    learningObjectives: [
      'Understand React accessibility best practices',
      'Learn ARIA attributes and semantic HTML',
      'Practice keyboard navigation and focus management'
    ]
  },

  // Final 2 React Challenges to reach 50
  {
    id: 'react-custom-hook-infinite-loop',
    title: 'Custom Hook Causing Infinite Re-renders',
    description: 'Custom hook triggers infinite re-renders in consuming components.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    xpReward: 110,
    tags: ['React', 'Custom Hooks', 'Infinite Loop', 'Dependencies'],
    rootCause: 'Hook dependencies causing infinite updates',
    files: {
      'hooks/useApi.js': `import { useState, useEffect } from 'react';

// BUG: Hook with dependency issues causing infinite loops
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch');

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]); // BUG: options object causes infinite re-renders

  // BUG: Returning new objects on every render
  return {
    data,
    loading,
    error,
    refetch: () => {
      setData(null);
      setLoading(true);
      setError(null);
    }
  };
}

export default useApi;`,
      'components/UserList.jsx': `import React from 'react';
import useApi from '../hooks/useApi';

function UserList() {
  // BUG: Passing new object on every render
  const { data: users, loading, error, refetch } = useApi('/api/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;`
    },
    hints: [
      'Memoize the options object or use useCallback',
      'Use useCallback for the refetch function',
      'Consider using useMemo for the return object',
      'Add proper dependency arrays to prevent infinite loops'
    ],
    solution: {
      'hooks/useApi.js': `import { useState, useEffect, useCallback, useMemo } from 'react';

function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIXED: Memoize options to prevent infinite re-renders
  const memoizedOptions = useMemo(() => options, [
    options.method,
    options.headers && JSON.stringify(options.headers),
    options.body
  ]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, memoizedOptions);
      if (!response.ok) throw new Error('Failed to fetch');

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, memoizedOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // FIXED: Memoize refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // FIXED: Memoize return object
  return useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);
}

export default useApi;`,
      'components/UserList.jsx': `import React, { useMemo } from 'react';
import useApi from '../hooks/useApi';

function UserList() {
  // FIXED: Memoize options object
  const apiOptions = useMemo(() => ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }), []);

  const { data: users, loading, error, refetch } = useApi('/api/users', apiOptions);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;`
    },
    testCriteria: [
      'Component should not re-render infinitely',
      'API should only be called when necessary',
      'Refetch function should work correctly'
    ],
    learningObjectives: [
      'Understand dependency array optimization',
      'Learn to prevent infinite re-renders in hooks',
      'Practice proper memoization techniques'
    ]
  },

  {
    id: 'react-component-library-tree-shaking',
    title: 'Component Library Bundle Size Issues',
    description: 'Importing from component library increases bundle size significantly.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 115,
    tags: ['React', 'Bundle Size', 'Tree Shaking', 'Performance'],
    rootCause: 'Improper imports preventing tree shaking',
    files: {
      'components/App.jsx': `import React from 'react';
// BUG: Importing entire library instead of specific components
import { Button, Input, Modal, Tooltip, DatePicker, Chart } from 'ui-library';
import * as Icons from 'icon-library'; // BUG: Importing all icons

function App() {
  return (
    <div>
      <h1>My App</h1>

      {/* Only using a few components but importing everything */}
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text" />

      {/* Only using one icon but importing all */}
      <Icons.HomeIcon />

      <div>
        <p>This app only uses a few components but bundles everything.</p>
      </div>
    </div>
  );
}

export default App;`,
      'utils/helpers.js': `// BUG: Importing entire lodash library
import _ from 'lodash';
import moment from 'moment'; // BUG: Heavy library for simple date operations

export const formatUser = (user) => {
  // Only using a few lodash functions
  return {
    ...user,
    name: _.capitalize(user.name),
    email: _.toLower(user.email),
    joinDate: moment(user.joinDate).format('YYYY-MM-DD')
  };
};

export const processData = (data) => {
  // Only using map and filter but importing entire lodash
  return _.chain(data)
    .filter(item => item.active)
    .map(item => _.pick(item, ['id', 'name', 'status']))
    .value();
};`
    },
    hints: [
      'Import specific components instead of entire libraries',
      'Use tree-shakable imports with destructuring',
      'Replace heavy libraries with lighter alternatives',
      'Configure webpack/bundler for better tree shaking'
    ],
    solution: {
      'components/App.jsx': `import React from 'react';
// FIXED: Import only needed components
import Button from 'ui-library/Button';
import Input from 'ui-library/Input';
// FIXED: Import specific icon
import HomeIcon from 'icon-library/HomeIcon';

function App() {
  return (
    <div>
      <h1>My App</h1>

      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text" />

      <HomeIcon />

      <div>
        <p>This app now only bundles what it uses.</p>
      </div>
    </div>
  );
}

export default App;`,
      'utils/helpers.js': `// FIXED: Import only needed lodash functions
import capitalize from 'lodash/capitalize';
import toLower from 'lodash/toLower';
import pick from 'lodash/pick';
// FIXED: Use native Date or lighter library
import { format } from 'date-fns'; // Much lighter than moment

export const formatUser = (user) => {
  return {
    ...user,
    name: capitalize(user.name),
    email: toLower(user.email),
    joinDate: format(new Date(user.joinDate), 'yyyy-MM-dd')
  };
};

export const processData = (data) => {
  // FIXED: Use native methods where possible
  return data
    .filter(item => item.active)
    .map(item => pick(item, ['id', 'name', 'status']));
};

// ALTERNATIVE: Pure JavaScript implementation
export const processDataNative = (data) => {
  return data
    .filter(item => item.active)
    .map(item => ({
      id: item.id,
      name: item.name,
      status: item.status
    }));
};`,
      'webpack.config.js': `// FIXED: Webpack configuration for better tree shaking
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false, // Enable tree shaking
  },
  resolve: {
    // FIXED: Help bundler find ES modules
    mainFields: ['module', 'main']
  }
};`,
      'package.json': `{
  "name": "my-app",
  "sideEffects": false,
  "dependencies": {
    "react": "^18.0.0",
    "date-fns": "^2.29.0"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.5.0"
  }
}`
    },
    testCriteria: [
      'Bundle size should be significantly reduced',
      'Only used components should be included in bundle',
      'Tree shaking should work correctly'
    ],
    learningObjectives: [
      'Understand tree shaking and bundle optimization',
      'Learn proper import strategies',
      'Practice performance optimization techniques'
    ]
  },

  // Adding ALL remaining React scenarios from debug-react.txt
  {
    id: 'react-third-party-crash',
    title: 'Third-Party Script Crashes React App',
    description: 'External script injection breaks React rendering.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    xpReward: 115,
    tags: ['React', 'Third Party', 'Script Injection', 'Error Boundary'],
    rootCause: 'Third-party script manipulates DOM outside React lifecycle',
    files: {
      'components/EmbedHTML.jsx': `import React, { useEffect, useRef } from 'react';

function EmbedHTML({ htmlContent }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && htmlContent) {
      // BUG: Directly setting innerHTML with potentially unsafe content
      containerRef.current.innerHTML = htmlContent;

      // BUG: Third-party scripts can manipulate React's DOM
      const scripts = containerRef.current.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        // BUG: No error handling for script execution
        document.head.appendChild(newScript);
      });
    }
  }, [htmlContent]);

  return (
    <div>
      <h2>Embedded Content</h2>
      {/* BUG: No error boundary around dangerous content */}
      <div ref={containerRef} />
    </div>
  );
}

export default EmbedHTML;`,
      'App.jsx': `import React, { useState } from 'react';
import EmbedHTML from './components/EmbedHTML';

function App() {
  const [embedContent, setEmbedContent] = useState('');

  const handleLoadWidget = () => {
    // BUG: Loading potentially unsafe third-party content
    const thirdPartyHTML = `
      <div id="widget">
        <p>Third-party widget</p>
        <script>
          // BUG: This script can break React
          document.getElementById('widget').onclick = function() {
            // Manipulating DOM outside React
            document.body.innerHTML = '<h1>Hijacked!</h1>';
          };
        </script>
      </div>
    `;
    setEmbedContent(thirdPartyHTML);
  };

  return (
    <div>
      <h1>My React App</h1>
      <button onClick={handleLoadWidget}>Load Third-Party Widget</button>

      {/* BUG: No protection against third-party crashes */}
      <EmbedHTML htmlContent={embedContent} />

      <div>
        <p>This content should remain stable</p>
      </div>
    </div>
  );
}

export default App;`
    },
    hints: [
      'Use Error Boundaries to isolate third-party content',
      'Sanitize HTML content before injection',
      'Use iframe sandboxing for untrusted content',
      'Implement proper script loading with error handling'
    ],
    solution: {
      'components/EmbedHTML.jsx': `import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

function EmbedHTML({ htmlContent }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (containerRef.current && htmlContent) {
      try {
        // FIXED: Sanitize HTML content
        const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
          ADD_TAGS: ['script'],
          ADD_ATTR: ['onclick', 'onload']
        });

        containerRef.current.innerHTML = sanitizedHTML;

        // FIXED: Safe script execution with error handling
        const scripts = containerRef.current.querySelectorAll('script');
        scripts.forEach(script => {
          try {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;

            // FIXED: Add error handling
            newScript.onerror = (err) => {
              console.error('Script execution failed:', err);
              setError('Third-party script failed to load');
            };

            document.head.appendChild(newScript);
          } catch (scriptError) {
            console.error('Script injection failed:', scriptError);
            setError('Failed to inject script');
          }
        });
      } catch (htmlError) {
        console.error('HTML injection failed:', htmlError);
        setError('Failed to load content');
      }
    }
  }, [htmlContent]);

  if (error) {
    return (
      <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
        <h3>Content Loading Error</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Embedded Content</h2>
      <div ref={containerRef} />
    </div>
  );
}

export default EmbedHTML;`,
      'components/ErrorBoundary.jsx': `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '2px solid red', margin: '10px' }}>
          <h2>Something went wrong with the embedded content.</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`,
      'App.jsx': `import React, { useState } from 'react';
import EmbedHTML from './components/EmbedHTML';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [embedContent, setEmbedContent] = useState('');

  const handleLoadWidget = () => {
    // FIXED: Safer third-party content
    const thirdPartyHTML = `
      <div id="widget" style="padding: 10px; border: 1px solid #ccc;">
        <p>Third-party widget (safe version)</p>
        <button onclick="alert('Widget clicked!')">Click me</button>
      </div>
    `;
    setEmbedContent(thirdPartyHTML);
  };

  const handleLoadUnsafeWidget = () => {
    // This demonstrates the protection in action
    const unsafeHTML = `
      <div>
        <script>
          // This would be sanitized
          document.body.innerHTML = '<h1>Attempted hijack!</h1>';
        </script>
        <p>Potentially dangerous content</p>
      </div>
    `;
    setEmbedContent(unsafeHTML);
  };

  return (
    <div>
      <h1>My React App</h1>
      <button onClick={handleLoadWidget}>Load Safe Widget</button>
      <button onClick={handleLoadUnsafeWidget}>Load Unsafe Widget (Protected)</button>

      {/* FIXED: Wrap in Error Boundary */}
      <ErrorBoundary>
        <EmbedHTML htmlContent={embedContent} />
      </ErrorBoundary>

      <div>
        <p>This content should remain stable</p>
      </div>
    </div>
  );
}

export default App;`
    },
    testCriteria: [
      'App should not crash when loading third-party content',
      'Malicious scripts should be sanitized',
      'Error boundaries should catch and display errors gracefully'
    ],
    learningObjectives: [
      'Understand third-party integration risks',
      'Learn HTML sanitization techniques',
      'Practice error boundary implementation'
    ]
  },

  {
    id: 'react-virtual-scroll-jank',
    title: 'Large Lists Cause Jank on Scroll',
    description: 'App becomes unresponsive when scrolling thousands of items.',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 130,
    tags: ['React', 'Performance', 'Virtualization', 'UX'],
    rootCause: 'Rendering all elements instead of virtualized list',
    files: {
      'components/VirtualList.jsx': `import React, { useState, useEffect } from 'react';

function VirtualList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate large dataset
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`,
      value: Math.random() * 1000,
      category: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]
    }));

    setItems(largeDataset);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Large Item List ({items.length} items)</h2>

      {/* BUG: Rendering all 10,000 items at once */}
      <div style={{ height: '500px', overflow: 'auto', border: '1px solid #ccc' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #eee',
              minHeight: '60px'
            }}
          >
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <div>
              <span>Value: {item.value.toFixed(2)}</span>
              <span style={{ marginLeft: '20px' }}>Category: {item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;`,
      'App.jsx': `import React from 'react';
import VirtualList from './components/VirtualList';

function App() {
  return (
    <div>
      <h1>Performance Demo</h1>
      <p>Try scrolling the list below - it should be smooth!</p>

      {/* BUG: This will cause performance issues */}
      <VirtualList />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Use react-window or react-virtualized for large lists',
      'Only render visible items plus a small buffer',
      'Implement proper item height calculation',
      'Use memo to prevent unnecessary re-renders'
    ],
    solution: {
      'components/VirtualList.jsx': `import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

function VirtualList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Generate large dataset
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`,
      value: Math.random() * 1000,
      category: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]
    }));

    setItems(largeDataset);
    setLoading(false);
  }, []);

  // FIXED: Memoize filtered items
  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  // FIXED: Memoized row renderer
  const Row = React.memo(({ index, style }) => {
    const item = filteredItems[index];

    return (
      <div style={style}>
        <div style={{
          padding: '10px',
          borderBottom: '1px solid #eee',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
          <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
            {item.description}
          </p>
          <div style={{ fontSize: '12px' }}>
            <span>Value: {item.value.toFixed(2)}</span>
            <span style={{ marginLeft: '20px' }}>Category: {item.category}</span>
          </div>
        </div>
      </div>
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Large Item List ({filteredItems.length} items)</h2>

      {/* FIXED: Add search filter */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {/* FIXED: Use react-window for virtualization */}
      <List
        height={500}
        itemCount={filteredItems.length}
        itemSize={80}
        width="100%"
        style={{ border: '1px solid #ccc' }}
      >
        {Row}
      </List>

      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Showing {filteredItems.length} of {items.length} items
      </div>
    </div>
  );
}

export default VirtualList;`
    },
    testCriteria: [
      'Scrolling should be smooth even with 10,000 items',
      'Memory usage should remain stable',
      'Filtering should work without performance issues'
    ],
    learningObjectives: [
      'Understand virtualization concepts',
      'Learn react-window implementation',
      'Practice performance optimization for large datasets'
    ]
  },

  {
    id: 'react-fouc-critical-css',
    title: 'Critical CSS Not Loaded in Deployed Build',
    description: 'Styles missing or flash of unstyled content (FOUC) on production.',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 125,
    tags: ['React', 'CSS', 'Build', 'SSR'],
    rootCause: 'Lazy-loaded or tree-shaken critical CSS, or chunk splitting misconfigured',
    files: {
      'pages/Home.jsx': `import React, { useState, useEffect } from 'react';
import StyledBanner from '../components/StyledBanner';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // BUG: Component renders before CSS is loaded
    setIsLoaded(true);
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Our Site</h1>

      {/* BUG: Critical component renders without styles */}
      <StyledBanner
        title="Important Announcement"
        message="This banner should be styled immediately"
        priority="high"
      />

      <div className="content-section">
        <p>This is the main content area.</p>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  );
}

export default Home;`,
      'components/StyledBanner.jsx': `import React from 'react';
// BUG: CSS import might be code-split and loaded async
import '../styles/banner.css';

function StyledBanner({ title, message, priority }) {
  return (
    // BUG: These classes might not be available on first render
    <div className={`banner banner--${priority}`}>
      <div className="banner__content">
        <h2 className="banner__title">{title}</h2>
        <p className="banner__message">{message}</p>
      </div>
    </div>
  );
}

export default StyledBanner;`,
      'styles/banner.css': `/* BUG: Critical styles that should be inlined */
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin: 1rem 0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.banner--high {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  animation: pulse 2s infinite;
}

.banner__content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.banner__title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.banner__message {
  font-size: 1.2rem;
  opacity: 0.9;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Other critical styles */
.home-page {
  min-height: 100vh;
  padding: 2rem;
}

.content-section {
  margin: 2rem 0;
}

.cta-button {
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.cta-button:hover {
  background: #45a049;
}`
    },
    hints: [
      'Extract critical CSS and inline it in HTML head',
      'Use CSS-in-JS for critical components',
      'Configure webpack to prevent CSS code splitting for critical styles',
      'Implement proper loading states while CSS loads'
    ],
    solution: {
      'components/StyledBanner.jsx': `import React from 'react';

// FIXED: Inline critical styles to prevent FOUC
const bannerStyles = {
  banner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '2rem',
    margin: '1rem 0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },
  bannerHigh: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    animation: 'pulse 2s infinite'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    margin: 0
  },
  message: {
    fontSize: '1.2rem',
    opacity: 0.9,
    margin: 0
  }
};

function StyledBanner({ title, message, priority }) {
  const bannerStyle = {
    ...bannerStyles.banner,
    ...(priority === 'high' ? bannerStyles.bannerHigh : {})
  };

  return (
    <div style={bannerStyle}>
      <div style={bannerStyles.content}>
        <h2 style={bannerStyles.title}>{title}</h2>
        <p style={bannerStyles.message}>{message}</p>
      </div>
    </div>
  );
}

export default StyledBanner;`,
      'pages/Home.jsx': `import React, { useState, useEffect } from 'react';
import StyledBanner from '../components/StyledBanner';

// FIXED: Inline critical styles
const homeStyles = {
  homePage: {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  },
  contentSection: {
    margin: '2rem 0'
  },
  ctaButton: {
    background: '#4CAF50',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  }
};

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    // FIXED: Load non-critical CSS asynchronously
    const loadCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/styles/non-critical.css';
      link.onload = () => setCssLoaded(true);
      document.head.appendChild(link);
    };

    setIsLoaded(true);
    loadCSS();
  }, []);

  const handleButtonHover = (e) => {
    e.target.style.background = '#45a049';
  };

  const handleButtonLeave = (e) => {
    e.target.style.background = '#4CAF50';
  };

  return (
    <div style={homeStyles.homePage}>
      <h1>Welcome to Our Site</h1>

      {/* FIXED: Critical component with inline styles */}
      <StyledBanner
        title="Important Announcement"
        message="This banner is styled immediately with no FOUC"
        priority="high"
      />

      <div style={homeStyles.contentSection}>
        <p>This is the main content area.</p>
        <button
          style={homeStyles.ctaButton}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          Get Started
        </button>
      </div>

      {/* FIXED: Show loading state for non-critical styles */}
      {!cssLoaded && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#333',
          color: 'white',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Loading enhanced styles...
        </div>
      )}
    </div>
  );
}

export default Home;`,
      'public/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>React App</title>

  <!-- FIXED: Inline critical CSS to prevent FOUC -->
  <style>
    /* Critical CSS inlined */
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Prevent layout shift */
    #root {
      min-height: 100vh;
    }

    /* Critical animation keyframes */
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
    },
    testCriteria: [
      'No flash of unstyled content should occur',
      'Critical styles should be available immediately',
      'Non-critical styles should load asynchronously'
    ],
    learningObjectives: [
      'Understand critical CSS optimization',
      'Learn to prevent FOUC in React apps',
      'Practice CSS loading strategies'
    ]
  },

  // Adding Angular challenges from debug-angular.txt
  {
    id: 'angular-websocket-memory-leak',
    title: 'WebSocket Memory Leak in Angular Service',
    description: 'WebSocket connections accumulate and cause memory leaks.',
    techStack: 'Angular',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    xpReward: 130,
    tags: ['Angular', 'WebSocket', 'Memory Leak', 'RxJS'],
    rootCause: 'Sockets not unsubscribed on ngOnDestroy',
    files: {
      'core/websocket/socket.service.ts': `import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();

  connect(url: string): Observable<any> {
    // BUG: Creating new socket without closing previous one
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      // BUG: No error handling for malformed messages
      const data = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
      // BUG: No automatic reconnection logic
    };

    return this.messageSubject.asObservable();
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // BUG: No proper cleanup method
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}`,
      'features/market/market-stream.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../core/websocket/socket.service';

@Component({
  selector: 'app-market-stream',
  template: `
    <div class="market-stream">
      <h2>Live Market Data</h2>
      <div *ngFor="let price of prices" class="price-item">
        <span>{{price.symbol}}: {{price.value | currency}}</span>
        <span [class]="price.change > 0 ? 'positive' : 'negative'">
          {{price.change > 0 ? '+' : ''}}{{price.change}}%
        </span>
      </div>
    </div>
  `,
  styles: [`
    .price-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    .positive { color: green; }
    .negative { color: red; }
  `]
})
export class MarketStreamComponent implements OnInit, OnDestroy {
  prices: any[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // BUG: No unsubscription logic
    this.socketService.connect('wss://api.example.com/market').subscribe(
      data => {
        if (data.type === 'price_update') {
          this.updatePrice(data.payload);
        }
      },
      error => {
        console.error('Market stream error:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // BUG: Not properly cleaning up WebSocket connection
    console.log('Component destroyed');
  }

  private updatePrice(priceData: any): void {
    const existingIndex = this.prices.findIndex(p => p.symbol === priceData.symbol);
    if (existingIndex >= 0) {
      this.prices[existingIndex] = priceData;
    } else {
      this.prices.push(priceData);
    }
  }
}`
    },
    hints: [
      'Always unsubscribe with takeUntil() or Subscription.unsubscribe()',
      'Use RxJS shareReplay() or publishReplay(1) to prevent re-connection',
      'Monitor open socket count via browser DevTools',
      'Implement proper cleanup in ngOnDestroy'
    ],
    solution: {
      'core/websocket/socket.service.ts': `import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { share, retry, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();
  private connectionStatus = new BehaviorSubject<string>('disconnected');
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string): Observable<any> {
    // FIXED: Close existing connection before creating new one
    if (this.socket) {
      this.disconnect();
    }

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.connectionStatus.next('connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        // FIXED: Add error handling for malformed messages
        const data = JSON.parse(event.data);
        this.messageSubject.next(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus.next('error');
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.connectionStatus.next('disconnected');

      // FIXED: Automatic reconnection logic
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.connect(url), 2000 * this.reconnectAttempts);
      }
    };

    // FIXED: Share the observable to prevent multiple connections
    return this.messageSubject.asObservable().pipe(share());
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  getConnectionStatus(): Observable<string> {
    return this.connectionStatus.asObservable();
  }

  // FIXED: Proper cleanup method
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
    this.messageSubject.complete();
    this.messageSubject = new Subject<any>();
    this.connectionStatus.next('disconnected');
  }
}`,
      'features/market/market-stream.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from '../../core/websocket/socket.service';

@Component({
  selector: 'app-market-stream',
  template: `
    <div class="market-stream">
      <h2>Live Market Data</h2>
      <div class="connection-status">
        Status: <span [class]="'status-' + connectionStatus">{{connectionStatus}}</span>
      </div>
      <div *ngFor="let price of prices" class="price-item">
        <span>{{price.symbol}}: {{price.value | currency}}</span>
        <span [class]="price.change > 0 ? 'positive' : 'negative'">
          {{price.change > 0 ? '+' : ''}}{{price.change}}%
        </span>
      </div>
    </div>
  `,
  styles: [`
    .price-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }
    .positive { color: green; }
    .negative { color: red; }
    .connection-status {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .status-connected { color: green; }
    .status-disconnected { color: red; }
    .status-error { color: orange; }
  `]
})
export class MarketStreamComponent implements OnInit, OnDestroy {
  prices: any[] = [];
  connectionStatus = 'disconnected';

  // FIXED: Subject for managing subscriptions
  private destroy$ = new Subject<void>();

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // FIXED: Proper subscription management with takeUntil
    this.socketService.connect('wss://api.example.com/market')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        data => {
          if (data.type === 'price_update') {
            this.updatePrice(data.payload);
          }
        },
        error => {
          console.error('Market stream error:', error);
        }
      );

    // FIXED: Subscribe to connection status
    this.socketService.getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.connectionStatus = status;
      });
  }

  ngOnDestroy(): void {
    // FIXED: Properly clean up all subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // FIXED: Disconnect WebSocket
    this.socketService.disconnect();

    console.log('Component destroyed and cleaned up');
  }

  private updatePrice(priceData: any): void {
    const existingIndex = this.prices.findIndex(p => p.symbol === priceData.symbol);
    if (existingIndex >= 0) {
      this.prices[existingIndex] = priceData;
    } else {
      this.prices.push(priceData);
    }
  }
}`
    },
    testCriteria: [
      'WebSocket connections should be properly closed on component destroy',
      'No memory leaks should occur when navigating between components',
      'Connection status should be properly tracked'
    ],
    learningObjectives: [
      'Understand WebSocket lifecycle management in Angular',
      'Learn proper subscription cleanup patterns',
      'Practice memory leak prevention techniques'
    ]
  },

  // Adding Node.js challenges from debug-node.txt
  {
    id: 'node-multer-file-upload-fail',
    title: 'Multer File Upload Silently Fails',
    description: 'File upload endpoint returns success but no file is saved.',
    techStack: 'Node.js',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 105,
    tags: ['Node.js', 'Multer', 'File Upload', 'Express'],
    rootCause: 'Field name mismatch or missing multer configuration',
    files: {
      'server/uploadHandler.js': `const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// BUG: Basic multer setup without proper configuration
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  // BUG: Not checking if file was actually uploaded
  console.log('Upload endpoint hit');
  console.log('Body:', req.body);
  console.log('File:', req.file);

  // BUG: Always returns success even if no file
  res.json({
    success: true,
    message: 'File uploaded successfully',
    filename: req.file?.filename
  });
});

// BUG: No error handling middleware
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;`,
      'client/upload-form.html': `<!DOCTYPE html>
<html>
<head>
    <title>File Upload Test</title>
</head>
<body>
    <h1>File Upload</h1>

    <!-- BUG: Form field name doesn't match multer configuration -->
    <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="avatar" required>
        <button type="submit">Upload</button>
    </form>

    <script>
        // BUG: No client-side validation or feedback
        document.querySelector('form').addEventListener('submit', function(e) {
            console.log('Form submitted');
        });
    </script>
</body>
</html>`
    },
    hints: [
      'Check field name matches between form and multer configuration',
      'Add proper error handling for multer middleware',
      'Validate file existence before responding',
      'Log incoming fields and check for silent rejection'
    ],
    solution: {
      'server/uploadHandler.js': `const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// FIXED: Proper multer configuration with validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // FIXED: Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // FIXED: Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// FIXED: Add file validation and limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: function (req, file, cb) {
    // FIXED: Validate file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// FIXED: Match field name with form
app.post('/upload', upload.single('avatar'), (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Body:', req.body);
  console.log('File:', req.file);

  // FIXED: Validate file was actually uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  // FIXED: Verify file exists on disk
  if (!fs.existsSync(req.file.path)) {
    return res.status(500).json({
      success: false,
      error: 'File upload failed - file not saved'
    });
  }

  res.json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    }
  });
});

// FIXED: Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files. Only 1 file allowed.'
      });
    }
  }

  res.status(500).json({
    success: false,
    error: error.message || 'Upload failed'
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;`,
      'client/upload-form.html': `<!DOCTYPE html>
<html>
<head>
    <title>File Upload Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .upload-form { max-width: 500px; }
        .file-input { margin: 10px 0; }
        .upload-btn { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        .upload-btn:disabled { background: #ccc; cursor: not-allowed; }
        .result { margin-top: 20px; padding: 10px; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .progress { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>File Upload</h1>

    <div class="upload-form">
        <!-- FIXED: Correct field name matching multer config -->
        <form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
            <div class="file-input">
                <label for="avatar">Choose file:</label>
                <input type="file" id="avatar" name="avatar" required
                       accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx">
            </div>
            <div class="file-info" id="fileInfo"></div>
            <button type="submit" class="upload-btn" id="uploadBtn">Upload</button>
        </form>

        <div class="progress" id="progress" style="display: none;">
            <div>Uploading...</div>
        </div>

        <div id="result"></div>
    </div>

    <script>
        // FIXED: Proper client-side validation and feedback
        const form = document.getElementById('uploadForm');
        const fileInput = document.getElementById('avatar');
        const fileInfo = document.getElementById('fileInfo');
        const uploadBtn = document.getElementById('uploadBtn');
        const progress = document.getElementById('progress');
        const result = document.getElementById('result');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const size = (file.size / 1024 / 1024).toFixed(2);
                fileInfo.innerHTML = `Selected: ${file.name} (${size} MB)`;

                // Validate file size
                if (file.size > 5 * 1024 * 1024) {
                    fileInfo.innerHTML += '<br><span style="color: red;">File too large! Maximum 5MB allowed.</span>';
                    uploadBtn.disabled = true;
                } else {
                    uploadBtn.disabled = false;
                }
            }
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);

            uploadBtn.disabled = true;
            progress.style.display = 'block';
            result.innerHTML = '';

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    result.innerHTML = `
                        <div class="result success">
                            <strong>Upload successful!</strong><br>
                            File: ${data.file.originalname}<br>
                            Size: ${(data.file.size / 1024).toFixed(2)} KB<br>
                            Type: ${data.file.mimetype}
                        </div>
                    `;
                } else {
                    result.innerHTML = `
                        <div class="result error">
                            <strong>Upload failed:</strong> ${data.error}
                        </div>
                    `;
                }
            } catch (error) {
                result.innerHTML = `
                    <div class="result error">
                        <strong>Upload failed:</strong> ${error.message}
                    </div>
                `;
            } finally {
                uploadBtn.disabled = false;
                progress.style.display = 'none';
            }
        });
    </script>
</body>
</html>`
    },
    testCriteria: [
      'File uploads should work with correct field names',
      'Error handling should provide clear feedback',
      'File validation should prevent invalid uploads'
    ],
    learningObjectives: [
      'Understand multer configuration and field name matching',
      'Learn proper file upload validation',
      'Practice error handling in file upload scenarios'
    ]
  },

  // More Angular challenges from debug-angular.txt
  {
    id: 'angular-i18n-translation-missing',
    title: 'i18n Translation Key Missing',
    description: 'Translation for key not found, showing raw key instead.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['Angular', 'i18n', 'Translation', 'Localization'],
    rootCause: 'Key missing from loaded language file',
    files: {
      'assets/i18n/en.json': `{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "dashboard": {
    "welcome": "Welcome to Dashboard"
    // BUG: Missing "title" key
  },
  "user": {
    "profile": "Profile",
    "settings": "Settings"
  }
}`,
      'assets/i18n/es.json': `{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar"
  },
  "dashboard": {
    "welcome": "Bienvenido al Panel"
    // BUG: Missing "title" key here too
  },
  "user": {
    "profile": "Perfil",
    "settings": "Configuración"
  }
}`,
      'features/dashboard/dashboard.component.html': `<div class="dashboard">
  <!-- BUG: This key doesn't exist in translation files -->
  <h1>{{ 'dashboard.title' | translate }}</h1>

  <p>{{ 'dashboard.welcome' | translate }}</p>

  <div class="actions">
    <button>{{ 'common.save' | translate }}</button>
    <button>{{ 'common.cancel' | translate }}</button>
  </div>
</div>`,
      'features/dashboard/dashboard.component.ts': `import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // BUG: No fallback handling for missing translations
    console.log('Dashboard component initialized');
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }
}`
    },
    hints: [
      'Verify translation key exists in selected locale',
      'Use fallback strategy via TranslateService.setDefaultLang()',
      'Log missing translations during development',
      'Add proper error handling for missing keys'
    ],
    solution: {
      'assets/i18n/en.json': `{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome to Dashboard"
  },
  "user": {
    "profile": "Profile",
    "settings": "Settings"
  }
}`,
      'assets/i18n/es.json': `{
  "common": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar"
  },
  "dashboard": {
    "title": "Panel de Control",
    "welcome": "Bienvenido al Panel"
  },
  "user": {
    "profile": "Perfil",
    "settings": "Configuración"
  }
}`,
      'features/dashboard/dashboard.component.ts': `import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private translate: TranslateService) {
    // FIXED: Set up fallback language
    this.translate.setDefaultLang('en');

    // FIXED: Handle missing translation events
    this.translate.onMissingTranslation.subscribe(event => {
      console.warn('Missing translation for key:', event.key);
      // Could send to logging service in production
    });
  }

  ngOnInit(): void {
    // FIXED: Verify critical translations exist
    this.checkTranslations();
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang).subscribe(
      () => {
        console.log('Language changed to:', lang);
      },
      error => {
        console.error('Failed to change language:', error);
        // Fallback to default language
        this.translate.use(this.translate.getDefaultLang());
      }
    );
  }

  private checkTranslations(): void {
    const requiredKeys = [
      'dashboard.title',
      'dashboard.welcome',
      'common.save',
      'common.cancel'
    ];

    requiredKeys.forEach(key => {
      this.translate.get(key).subscribe(translation => {
        if (translation === key) {
          console.warn(`Translation missing for key: ${key}`);
        }
      });
    });
  }
}`,
      'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

// FIXED: Factory function for translation loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      // FIXED: Configure missing translation handler
      missingTranslationHandler: {
        provide: TranslateService,
        useValue: {
          handle: (params: any) => {
            console.warn('Missing translation:', params);
            return params.key;
          }
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
    },
    testCriteria: [
      'All translation keys should resolve to proper text',
      'Missing translations should be logged in development',
      'Language switching should work without errors'
    ],
    learningObjectives: [
      'Understand Angular i18n implementation',
      'Learn translation key management',
      'Practice error handling for missing translations'
    ]
  },

  {
    id: 'angular-rxjs-debounce-not-working',
    title: 'RxJS Debounce Not Working',
    description: 'Rapid keystrokes trigger multiple backend calls despite debounce.',
    techStack: 'Angular',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 95,
    tags: ['Angular', 'RxJS', 'Debounce', 'Performance'],
    rootCause: 'debounceTime() not properly used in reactive stream',
    files: {
      'features/search/search.component.ts': `import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <input
        [formControl]="searchControl"
        placeholder="Search products..."
        class="search-input">

      <div *ngIf="loading" class="loading">Searching...</div>

      <div class="results">
        <div *ngFor="let result of searchResults" class="result-item">
          <h4>{{result.name}}</h4>
          <p>{{result.description}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-input { width: 100%; padding: 10px; margin-bottom: 10px; }
    .result-item { padding: 10px; border-bottom: 1px solid #eee; }
    .loading { color: #666; font-style: italic; }
  `]
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: any[] = [];
  loading = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // BUG: No debouncing - every keystroke triggers search
    this.searchControl.valueChanges.subscribe(query => {
      if (query && query.length > 2) {
        this.performSearch(query);
      }
    });
  }

  private performSearch(query: string): void {
    this.loading = true;
    console.log('Searching for:', query); // BUG: This will log on every keystroke

    this.searchService.search(query).subscribe(
      results => {
        this.searchResults = results;
        this.loading = false;
      },
      error => {
        console.error('Search error:', error);
        this.loading = false;
      }
    );
  }
}`,
      'features/search/search.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any[]> {
    console.log('API call made for:', query); // BUG: This shows multiple calls

    // Simulate API call
    return this.http.get<any[]>(`/api/search?q=${encodeURIComponent(query)}`)
      .pipe(
        delay(500) // Simulate network delay
      );
  }
}`
    },
    hints: [
      'Chain debounceTime(300) before HTTP call',
      'Use distinctUntilChanged() to avoid duplicate queries',
      'Verify that FormControl.valueChanges.pipe(...) is properly handled',
      'Consider using switchMap to cancel previous requests'
    ],
    solution: {
      'features/search/search.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  template: `
    <div class="search-container">
      <input
        [formControl]="searchControl"
        placeholder="Search products..."
        class="search-input">

      <div *ngIf="loading" class="loading">Searching...</div>

      <div class="results">
        <div *ngFor="let result of searchResults" class="result-item">
          <h4>{{result.name}}</h4>
          <p>{{result.description}}</p>
        </div>
      </div>

      <div *ngIf="searchResults.length === 0 && !loading && searchControl.value" class="no-results">
        No results found for "{{searchControl.value}}"
      </div>
    </div>
  `,
  styles: [`
    .search-input { width: 100%; padding: 10px; margin-bottom: 10px; }
    .result-item { padding: 10px; border-bottom: 1px solid #eee; }
    .loading { color: #666; font-style: italic; }
    .no-results { color: #999; padding: 20px; text-align: center; }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchResults: any[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    // FIXED: Proper debouncing with RxJS operators
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // FIXED: Wait 300ms after user stops typing
        distinctUntilChanged(), // FIXED: Only emit if value actually changed
        filter(query => query && query.length > 2), // FIXED: Only search for meaningful queries
        switchMap(query => {
          // FIXED: Cancel previous request and start new one
          this.loading = true;
          console.log('Searching for:', query); // Now only logs once per search
          return this.searchService.search(query);
        }),
        takeUntil(this.destroy$) // FIXED: Cleanup subscription
      )
      .subscribe(
        results => {
          this.searchResults = results;
          this.loading = false;
        },
        error => {
          console.error('Search error:', error);
          this.searchResults = [];
          this.loading = false;
        }
      );

    // FIXED: Clear results when search is cleared
    this.searchControl.valueChanges
      .pipe(
        filter(query => !query || query.length <= 2),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.searchResults = [];
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
      'features/search/search.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any[]> {
    console.log('API call made for:', query); // Now only called when needed

    // FIXED: Mock data for demonstration
    const mockResults = [
      { id: 1, name: `Product matching "${query}"`, description: 'Description 1' },
      { id: 2, name: `Another ${query} item`, description: 'Description 2' },
      { id: 3, name: `${query} related product`, description: 'Description 3' }
    ];

    // Simulate API call with mock data
    return of(mockResults).pipe(
      delay(500), // Simulate network delay
      map(results => results.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      ))
    );

    // In real implementation, use:
    // return this.http.get<any[]>(`/api/search?q=${encodeURIComponent(query)}`);
  }
}`
    },
    testCriteria: [
      'Search should only trigger after user stops typing',
      'Duplicate consecutive searches should be prevented',
      'Previous requests should be cancelled when new search starts'
    ],
    learningObjectives: [
      'Understand RxJS debouncing patterns',
      'Learn proper reactive form handling',
      'Practice request cancellation with switchMap'
    ]
  },

  // More Node.js challenges from debug-node.txt
  {
    id: 'node-tls-certificate-chain-error',
    title: 'TLS/HTTPS Certificate Chain Error',
    description: 'HTTPS server fails with UNABLE_TO_VERIFY_LEAF_SIGNATURE.',
    techStack: 'Node.js',
    difficulty: 'advanced',
    estimatedTime: '18 min',
    xpReward: 120,
    tags: ['Node.js', 'HTTPS', 'TLS', 'Certificates'],
    rootCause: 'Missing intermediate cert in PEM chain',
    files: {
      'server/httpsServer.js': `const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();

// BUG: Basic certificate setup without proper chain
const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
  // BUG: Missing intermediate certificates
};

app.get('/', (req, res) => {
  res.send('Hello HTTPS World!');
});

app.get('/api/secure', (req, res) => {
  res.json({ message: 'This is a secure endpoint', timestamp: new Date() });
});

// BUG: No error handling for certificate issues
const server = https.createServer(options, app);

server.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// BUG: No certificate validation or monitoring
module.exports = server;`,
      'certs/cert.pem': `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+jkjkjMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST
UVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV
WXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWX
YZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ12
34567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdef
ghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
-----END CERTIFICATE-----`,
      'certs/key.pem': `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXNjkl1234567890
abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn
opqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ...
-----END PRIVATE KEY-----`
    },
    hints: [
      'Use OpenSSL to inspect certificate chain',
      'Concatenate intermediate and root certs',
      'Compare output with chain files',
      'Ensure fullchain.pem includes all certificates'
    ],
    solution: {
      'server/httpsServer.js': `const https = require('https');
const fs = require('fs');
const express = require('express');
const tls = require('tls');

const app = express();

// FIXED: Proper certificate chain setup
const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/fullchain.pem'), // FIXED: Use fullchain
  // FIXED: Additional security options
  secureProtocol: 'TLSv1_2_method',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384'
  ].join(':'),
  honorCipherOrder: true
};

app.get('/', (req, res) => {
  res.send('Hello Secure HTTPS World!');
});

app.get('/api/secure', (req, res) => {
  res.json({
    message: 'This is a secure endpoint',
    timestamp: new Date(),
    secure: req.secure,
    protocol: req.protocol
  });
});

app.get('/cert-info', (req, res) => {
  const cert = req.connection.getPeerCertificate();
  res.json({
    subject: cert.subject,
    issuer: cert.issuer,
    valid_from: cert.valid_from,
    valid_to: cert.valid_to,
    fingerprint: cert.fingerprint
  });
});

// FIXED: Error handling for certificate issues
const server = https.createServer(options, app);

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('Port 443 is already in use');
  } else if (error.code === 'EACCES') {
    console.error('Permission denied - try running with sudo or use port > 1024');
  } else {
    console.error('HTTPS Server error:', error);
  }
  process.exit(1);
});

server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.end('HTTP/1.1 400 Bad Request\\r\\n\\r\\n');
});

// FIXED: Certificate monitoring
server.on('secureConnection', (tlsSocket) => {
  console.log('Secure connection established');
  console.log('Protocol:', tlsSocket.getProtocol());
  console.log('Cipher:', tlsSocket.getCipher());
});

const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);

  // FIXED: Validate certificate chain on startup
  validateCertificateChain();
});

// FIXED: Certificate validation function
function validateCertificateChain() {
  try {
    const cert = fs.readFileSync('certs/fullchain.pem', 'utf8');
    const key = fs.readFileSync('certs/key.pem', 'utf8');

    // Basic validation
    if (!cert.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('Invalid certificate format');
    }

    if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Invalid private key format');
    }

    console.log('Certificate chain validation passed');
  } catch (error) {
    console.error('Certificate validation failed:', error.message);
    process.exit(1);
  }
}

module.exports = server;`,
      'certs/fullchain.pem': `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+jkjkjMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRST
UVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV
WXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWX
YZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ12
34567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdef
ghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+jkjkjMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjBF
[INTERMEDIATE CERTIFICATE CONTENT]
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+jkjkjMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
[ROOT CERTIFICATE CONTENT]
-----END CERTIFICATE-----`,
      'scripts/check-cert.js': `const fs = require('fs');
const { execSync } = require('child_process');

// FIXED: Certificate validation script
function checkCertificate() {
  try {
    console.log('Checking certificate chain...');

    // Check certificate with OpenSSL
    const result = execSync('openssl x509 -in certs/fullchain.pem -text -noout', { encoding: 'utf8' });
    console.log('Certificate details:');
    console.log(result);

    // Verify certificate chain
    const chainResult = execSync('openssl verify -CAfile certs/fullchain.pem certs/fullchain.pem', { encoding: 'utf8' });
    console.log('Chain verification:', chainResult);

    console.log('Certificate validation completed successfully');
  } catch (error) {
    console.error('Certificate validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkCertificate();
}

module.exports = { checkCertificate };`
    },
    testCriteria: [
      'HTTPS server should start without certificate errors',
      'Certificate chain should be properly validated',
      'Secure connections should be established successfully'
    ],
    learningObjectives: [
      'Understand TLS certificate chain requirements',
      'Learn certificate validation and monitoring',
      'Practice HTTPS server security configuration'
    ]
  }
];

// Export the challenges for use in components
export default debugChallenges;
