// React Debugging Challenges - 55 Comprehensive Scenarios
// Production-Ready Debugging Skills for React Developers

import { DebugChallenge } from './debugPlatformComplete';

export const reactDebugChallenges: DebugChallenge[] = [
  // ===== STATE MANAGEMENT ISSUES (12 challenges) =====
  
  // 1. State Not Updating Immediately
  {
    id: 'react-state-async-update',
    title: 'State Not Updating Immediately',
    description: 'Console.log shows old state value even after setState call',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 80,
    tags: ['React', 'useState', 'Asynchronous', 'State Management'],
    rootCause: 'useState updates are asynchronous and batched',
    category: 'State Management',
    files: {
      'App.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
    console.log('Count after increment:', count); // BUG: Shows old value!
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default Counter;`
    },
    hints: [
      'useState updates are asynchronous and batched',
      'The console.log runs before the state actually updates',
      'Use useEffect to observe state changes',
      'Consider using the functional update pattern'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      console.log('Count will be:', newCount); // Correct approach
      return newCount;
    });
  };

  // Alternative: Use useEffect to observe state changes
  useEffect(() => {
    console.log('Count updated to:', count);
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default Counter;`
    },
    testCases: [
      'Click increment button and check console output',
      'Verify state updates correctly in UI',
      'Test multiple rapid clicks',
      'Confirm useEffect logs the correct value'
    ],
    debuggingSteps: [
      'Add console.log in different places to understand execution order',
      'Use React DevTools to inspect state changes',
      'Add useEffect to observe state updates',
      'Test with functional state updates'
    ],
    commonMistakes: [
      'Expecting synchronous state updates',
      'Using stale state values in calculations',
      'Not understanding React batching behavior'
    ],
    productionImpact: 'Can lead to incorrect calculations and race conditions in real applications',
    preventionTips: [
      'Always use functional updates when new state depends on previous state',
      'Use useEffect to perform side effects after state updates',
      'Understand React\'s batching behavior'
    ]
  },

  // 2. Infinite useEffect Loop
  {
    id: 'react-infinite-useeffect',
    title: 'Infinite useEffect Loop',
    description: 'useEffect runs continuously causing performance issues and crashes',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '12 min',
    xpReward: 90,
    tags: ['React', 'useEffect', 'Infinite Loop', 'Dependencies'],
    rootCause: 'Missing or incorrect dependency array in useEffect',
    category: 'Lifecycle & Hooks',
    files: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BUG: Missing dependency array causes infinite loop!
    fetchUserData();
  });

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'useEffect without dependency array runs after every render',
      'Each state update triggers a re-render',
      'Add an empty dependency array for mount-only effects',
      'Be careful with function dependencies'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect, useCallback } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Option 1: Memoize the function with useCallback
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since function doesn't depend on props/state

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Now safe to include in dependencies

  // Option 2: Define function inside useEffect
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch('/api/user');
  //       const userData = await response.json();
  //       setUser(userData);
  //     } catch (error) {
  //       console.error('Failed to fetch user:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchUserData();
  // }, []); // Empty dependency array for mount-only effect

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}

export default UserProfile;`
    },
    testCases: [
      'Component should fetch data only once on mount',
      'No infinite network requests in browser DevTools',
      'Loading state should work correctly',
      'Error handling should work properly'
    ],
    debuggingSteps: [
      'Open browser DevTools Network tab',
      'Check for repeated API calls',
      'Add console.log in useEffect to see execution count',
      'Use React DevTools Profiler to see re-renders'
    ],
    commonMistakes: [
      'Forgetting dependency array entirely',
      'Including functions in dependencies without useCallback',
      'Mutating objects/arrays in dependencies'
    ],
    productionImpact: 'Causes excessive API calls, poor performance, and potential server overload',
    preventionTips: [
      'Always include dependency array in useEffect',
      'Use useCallback for function dependencies',
      'Consider moving functions inside useEffect when possible'
    ]
  },

  // 3. Stale Closure in useEffect
  {
    id: 'react-stale-closure',
    title: 'Stale Closure in useEffect',
    description: 'Timer shows wrong count value due to stale closure',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 120,
    tags: ['React', 'useEffect', 'Closure', 'Timer'],
    rootCause: 'useEffect captures stale values from initial render',
    category: 'Lifecycle & Hooks',
    files: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        // BUG: This always uses the initial count value (0)!
        setCount(count + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]); // Missing 'count' in dependencies

  return (
    <div>
      <h1>Timer: {count}</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Timer;`
    },
    hints: [
      'The setInterval callback captures the initial count value',
      'Use functional state updates to avoid stale closures',
      'Consider using useRef for mutable values',
      'Be careful with dependencies in useEffect'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect, useRef } from 'react';

function Timer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        // Solution 1: Use functional update to avoid stale closure
        setCount(prevCount => prevCount + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Alternative solution using useRef for count
  // const countRef = useRef(count);
  // 
  // useEffect(() => {
  //   countRef.current = count;
  // });
  // 
  // useEffect(() => {
  //   if (isRunning) {
  //     intervalRef.current = setInterval(() => {
  //       const newCount = countRef.current + 1;
  //       setCount(newCount);
  //     }, 1000);
  //   } else {
  //     clearInterval(intervalRef.current);
  //   }
  //   
  //   return () => clearInterval(intervalRef.current);
  // }, [isRunning]);

  return (
    <div>
      <h1>Timer: {count}</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Timer;`
    },
    testCases: [
      'Start timer and verify it increments correctly',
      'Stop and restart timer multiple times',
      'Reset timer while running',
      'Check that timer continues from correct value after restart'
    ],
    debuggingSteps: [
      'Add console.log inside setInterval to see captured values',
      'Use React DevTools to inspect state changes',
      'Test timer behavior with different start/stop sequences',
      'Verify cleanup function is called properly'
    ],
    commonMistakes: [
      'Not using functional state updates in async callbacks',
      'Including all state variables in useEffect dependencies',
      'Not understanding closure behavior in JavaScript'
    ],
    productionImpact: 'Timers, counters, and async operations may not work correctly',
    preventionTips: [
      'Use functional state updates when state depends on previous value',
      'Use useRef for mutable values that don\'t trigger re-renders',
      'Understand JavaScript closures and their behavior in React'
    ]
  },

  // 4. Object State Mutation
  {
    id: 'react-object-mutation',
    title: 'Direct Object State Mutation',
    description: 'Component doesn\'t re-render when object properties are changed directly',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'State', 'Mutation', 'Objects'],
    rootCause: 'Directly mutating state objects instead of creating new ones',
    category: 'State Management',
    files: {
      'App.jsx': `import React, { useState } from 'react';

function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateName = (newName) => {
    // BUG: Direct mutation doesn't trigger re-render!
    user.name = newName;
    setUser(user);
  };

  const updateEmail = (newEmail) => {
    // BUG: Same issue here
    user.email = newEmail;
    setUser(user);
  };

  const updateAge = (newAge) => {
    // BUG: And here too
    user.age = parseInt(newAge);
    setUser(user);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <label>Name:</label>
        <input 
          value={user.name}
          onChange={(e) => updateName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          value={user.email}
          onChange={(e) => updateEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Age:</label>
        <input 
          type="number"
          value={user.age}
          onChange={(e) => updateAge(e.target.value)}
        />
      </div>
      <div>
        <h3>Current User:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
      </div>
    </div>
  );
}

export default UserForm;`
    },
    hints: [
      'React uses Object.is() to compare state values',
      'Mutating objects directly doesn\'t create a new reference',
      'Use spread operator to create new objects',
      'Consider using useReducer for complex state updates'
    ],
    solution: {
      'App.jsx': `import React, { useState } from 'react';

function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateName = (newName) => {
    // Solution: Create new object with spread operator
    setUser(prevUser => ({
      ...prevUser,
      name: newName
    }));
  };

  const updateEmail = (newEmail) => {
    setUser(prevUser => ({
      ...prevUser,
      email: newEmail
    }));
  };

  const updateAge = (newAge) => {
    setUser(prevUser => ({
      ...prevUser,
      age: parseInt(newAge) || 0
    }));
  };

  // Alternative: Generic update function
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <label>Name:</label>
        <input 
          value={user.name}
          onChange={(e) => updateName(e.target.value)}
          // Alternative: onChange={(e) => updateUser('name', e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input 
          value={user.email}
          onChange={(e) => updateEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Age:</label>
        <input 
          type="number"
          value={user.age}
          onChange={(e) => updateAge(e.target.value)}
        />
      </div>
      <div>
        <h3>Current User:</h3>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Age: {user.age}</p>
      </div>
    </div>
  );
}

export default UserForm;`
    },
    testCases: [
      'Type in each input field and verify UI updates',
      'Check that all form fields work independently',
      'Verify state updates are reflected immediately',
      'Test with empty and invalid values'
    ],
    debuggingSteps: [
      'Add console.log to see if state update functions are called',
      'Use React DevTools to inspect state changes',
      'Check if the same object reference is being used',
      'Test with React.StrictMode to catch mutations'
    ],
    commonMistakes: [
      'Directly modifying state objects',
      'Forgetting to create new object references',
      'Not understanding React\'s shallow comparison'
    ],
    productionImpact: 'Forms and user interfaces may not respond to user input correctly',
    preventionTips: [
      'Always create new objects/arrays when updating state',
      'Use spread operator or Object.assign for object updates',
      'Consider using Immer library for complex state updates'
    ]
  },

  // 5. Memory Leak with Event Listeners
  {
    id: 'react-memory-leak-events',
    title: 'Memory Leak with Event Listeners',
    description: 'Component adds event listeners but never removes them, causing memory leaks',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'Memory Leak', 'Event Listeners', 'Cleanup'],
    rootCause: 'Event listeners not removed in useEffect cleanup function',
    category: 'Performance',
    files: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // BUG: Adding event listener but never removing it!
    window.addEventListener('resize', handleResize);

    // Missing cleanup function causes memory leak
  }, []);

  return (
    <div>
      <h2>Window Size Tracker</h2>
      <p>Width: {windowSize.width}px</p>
      <p>Height: {windowSize.height}px</p>
      <p>Resize the window to see updates</p>
    </div>
  );
}

export default WindowSizeTracker;`
    },
    hints: [
      'Event listeners persist even after component unmounts',
      'Always clean up event listeners in useEffect return function',
      'Memory leaks accumulate with each component mount/unmount',
      'Use browser DevTools to monitor memory usage'
    ],
    solution: {
      'App.jsx': `import React, { useState, useEffect } from 'react';

function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <h2>Window Size Tracker</h2>
      <p>Width: {windowSize.width}px</p>
      <p>Height: {windowSize.height}px</p>
      <p>Resize the window to see updates</p>
    </div>
  );
}

export default WindowSizeTracker;`
    },
    testCases: [
      'Mount and unmount component multiple times',
      'Check browser DevTools for memory usage',
      'Verify resize events work correctly',
      'Confirm no duplicate event listeners are added'
    ],
    debuggingSteps: [
      'Use browser DevTools Memory tab to check for leaks',
      'Add console.log in event handler to see if it\'s called multiple times',
      'Mount/unmount component repeatedly and monitor memory',
      'Use React DevTools Profiler to check component lifecycle'
    ],
    commonMistakes: [
      'Forgetting cleanup functions in useEffect',
      'Not removing all types of event listeners',
      'Adding listeners in wrong lifecycle phase'
    ],
    productionImpact: 'Memory leaks can cause browser slowdown and crashes in long-running applications',
    preventionTips: [
      'Always return cleanup function from useEffect when adding listeners',
      'Use AbortController for modern event listener management',
      'Monitor memory usage during development'
    ]
  },

  // 6. Key Prop Missing in Lists
  {
    id: 'react-missing-keys',
    title: 'Missing Key Props in Lists',
    description: 'List items don\'t update correctly and show console warnings',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    xpReward: 75,
    tags: ['React', 'Keys', 'Lists', 'Performance'],
    rootCause: 'Missing or incorrect key props in list items',
    category: 'Performance',
    files: {
      'App.jsx': `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
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
    <div>
      <h2>Todo List</h2>
      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          // BUG: Using index as key causes issues!
          <li key={index}>
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
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;`
    },
    hints: [
      'Using array index as key can cause rendering issues',
      'Keys should be stable and unique identifiers',
      'React uses keys to track which items have changed',
      'Missing keys cause React to re-render entire list'
    ],
    solution: {
      'App.jsx': `import React, { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(), // Better: use uuid or proper ID generation
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
    <div>
      <h2>Todo List</h2>
      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          // Solution: Use unique, stable ID as key
          <li key={todo.id}>
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
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && (
        <p>No todos yet. Add one above!</p>
      )}
    </div>
  );
}

export default TodoList;`
    },
    testCases: [
      'Add multiple todos and verify they appear correctly',
      'Delete todos from middle of list and check order',
      'Toggle completion status and verify correct items update',
      'Check console for key-related warnings'
    ],
    debuggingSteps: [
      'Open browser console to see React warnings',
      'Add/remove items and observe rendering behavior',
      'Use React DevTools to inspect component tree',
      'Test with duplicate keys to see the issues'
    ],
    commonMistakes: [
      'Using array index as key for dynamic lists',
      'Using non-unique values as keys',
      'Not providing keys at all'
    ],
    productionImpact: 'Poor performance, incorrect UI updates, and form state issues in lists',
    preventionTips: [
      'Always use unique, stable identifiers as keys',
      'Avoid using array index for dynamic lists',
      'Use proper ID generation (uuid, database IDs, etc.)'
    ]
  },

  // 7. React Router Navigation Issues
  {
    id: 'react-router-navigation-bug',
    title: 'React Router Navigation Not Working',
    description: 'Navigation between routes fails and browser URL doesn\'t update correctly',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 110,
    tags: ['React', 'React Router', 'Navigation', 'SPA'],
    rootCause: 'Incorrect router setup or missing Router wrapper',
    category: 'Routing & Navigation',
    files: {
      'App.jsx': `import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

// BUG: Missing Router wrapper!
function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;`,
      'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// BUG: App not wrapped in Router!
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    hints: [
      'React Router components need to be wrapped in a Router',
      'BrowserRouter or HashRouter should wrap the entire app',
      'Check the main.jsx file for proper Router setup',
      'Routes and Route components need Router context'
    ],
    solution: {
      'App.jsx': `import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <div>
      <nav style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
        <Link to="/" style={{ margin: '0 10px', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/about" style={{ margin: '0 10px', textDecoration: 'none' }}>
          About
        </Link>
        <Link to="/contact" style={{ margin: '0 10px', textDecoration: 'none' }}>
          Contact
        </Link>
      </nav>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;`,
      'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Solution: Wrap App in BrowserRouter
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);`
    },
    testCases: [
      'Click navigation links and verify URL changes',
      'Test browser back/forward buttons',
      'Verify components render correctly for each route',
      'Check that page refreshes work on each route'
    ],
    debuggingSteps: [
      'Check browser console for Router-related errors',
      'Verify Router wrapper is present in main.jsx',
      'Test navigation links functionality',
      'Check browser DevTools for route changes'
    ],
    commonMistakes: [
      'Forgetting to wrap app in Router component',
      'Using wrong Router type (BrowserRouter vs HashRouter)',
      'Missing Router import statements'
    ],
    productionImpact: 'Single-page application navigation completely broken, poor user experience',
    preventionTips: [
      'Always wrap React Router apps in BrowserRouter or HashRouter',
      'Set up routing at the root level of your application',
      'Test navigation thoroughly during development'
    ]
  },

  // 8. Form Input Controlled vs Uncontrolled Issue
  {
    id: 'react-controlled-uncontrolled-input',
    title: 'Controlled vs Uncontrolled Input Warning',
    description: 'React warns about switching between controlled and uncontrolled inputs',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '12 min',
    xpReward: 85,
    tags: ['React', 'Forms', 'Controlled', 'Uncontrolled', 'Input'],
    rootCause: 'Input value switches between undefined/null and string values',
    category: 'Forms & Validation',
    files: {
      'ContactForm.jsx': `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: undefined, // BUG: undefined causes controlled/uncontrolled warning!
    email: null,     // BUG: null also causes the warning!
    message: ''      // This is correct
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name} // BUG: undefined value causes warning
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email} // BUG: null value causes warning
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message} // This works correctly
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ContactForm;`
    },
    hints: [
      'Input value prop should never be undefined or null',
      'Use empty string as default value for controlled inputs',
      'React considers undefined/null values as uncontrolled',
      'Initialize all form fields with string values'
    ],
    solution: {
      'ContactForm.jsx': `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',    // Solution: Use empty string instead of undefined
    email: '',   // Solution: Use empty string instead of null
    message: ''  // Already correct
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

    // Validation
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }

    if (!formData.message.trim()) {
      alert('Message is required');
      return;
    }

    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');

    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            required
          />
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

export default ContactForm;`
    },
    testCases: [
      'Check browser console for controlled/uncontrolled warnings',
      'Type in each input field and verify values update',
      'Submit form with empty fields and verify validation',
      'Submit form with valid data and verify success'
    ],
    debuggingSteps: [
      'Open browser console to see React warnings',
      'Check initial state values for undefined/null',
      'Verify all input value props are strings',
      'Test form functionality after fixes'
    ],
    commonMistakes: [
      'Using undefined or null as initial input values',
      'Not handling empty state properly',
      'Mixing controlled and uncontrolled patterns'
    ],
    productionImpact: 'Console warnings in development, potential form behavior issues',
    preventionTips: [
      'Always initialize form fields with empty strings',
      'Use consistent controlled input patterns',
      'Validate form state initialization'
    ]
  },

  // 9. useEffect Dependency Array Issues
  {
    id: 'react-useeffect-dependencies',
    title: 'Missing useEffect Dependencies',
    description: 'useEffect not running when expected due to missing dependencies',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 120,
    tags: ['React', 'useEffect', 'Dependencies', 'Hooks'],
    rootCause: 'Missing dependencies in useEffect dependency array',
    category: 'Hooks & Lifecycle',
    files: {
      'UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // BUG: Missing userId in dependency array!
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    });
  }, []); // BUG: Should include [userId]

  const fetchUser = async (id) => {
    const response = await fetch(\`/api/users/\${id}\`);
    return response.json();
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'Check what variables are used inside useEffect',
      'All external variables used in useEffect should be in dependencies',
      'Props and state used in useEffect need to be dependencies',
      'ESLint exhaustive-deps rule can help catch this'
    ],
    solution: {
      'UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Solution: Include userId in dependency array
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchUser(userId).then(userData => {
      setUser(userData);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to fetch user:', error);
      setLoading(false);
    });
  }, [userId]); // Fixed: Added userId dependency

  const fetchUser = async (id) => {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 10px 0' }}>{user.name}</h2>
      <p style={{ margin: '0', color: '#666' }}>{user.email}</p>
    </div>
  );
}

export default UserProfile;`
    },
    testCases: [
      'Component should re-fetch user when userId prop changes',
      'Loading state should show during fetch',
      'User data should display correctly after fetch',
      'Error handling should work for failed requests'
    ],
    debuggingSteps: [
      'Check React DevTools for useEffect calls',
      'Verify dependency array includes all used variables',
      'Test component with different userId props',
      'Use ESLint exhaustive-deps rule'
    ],
    commonMistakes: [
      'Forgetting to include props in dependency array',
      'Missing state variables in dependencies',
      'Using empty dependency array when variables are used'
    ],
    productionImpact: 'Stale data, components not updating when props change, memory leaks',
    preventionTips: [
      'Use ESLint exhaustive-deps rule',
      'Always include external variables in dependency array',
      'Consider using useCallback for functions used in useEffect'
    ]
  },

  // 10. Component Re-rendering Issues
  {
    id: 'react-unnecessary-rerenders',
    title: 'Unnecessary Component Re-renders',
    description: 'Component re-renders too frequently causing performance issues',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'Performance', 'Memoization', 'Re-renders'],
    rootCause: 'Missing memoization and creating new objects in render',
    category: 'Performance',
    files: {
      'ExpensiveList.jsx': `import React, { useState } from 'react';

function ExpensiveList({ items }) {
  const [filter, setFilter] = useState('');

  // BUG: Creating new object on every render!
  const listStyle = {
    padding: '20px',
    backgroundColor: '#f5f5f5'
  };

  // BUG: Creating new function on every render!
  const handleItemClick = (item) => {
    console.log('Clicked:', item.name);
  };

  // BUG: Expensive calculation on every render!
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={listStyle}>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />

      <ul>
        {filteredItems.map(item => (
          <ExpensiveItem
            key={item.id}
            item={item}
            onClick={handleItemClick} // BUG: New function every render!
          />
        ))}
      </ul>
    </div>
  );
}

function ExpensiveItem({ item, onClick }) {
  console.log('ExpensiveItem rendered:', item.name); // Shows re-renders

  return (
    <li onClick={() => onClick(item)}>
      {item.name} - {item.category}
    </li>
  );
}

export default ExpensiveList;`
    },
    hints: [
      'Objects and functions created in render cause child re-renders',
      'Use useMemo for expensive calculations',
      'Use useCallback for functions passed to children',
      'Move static objects outside component or use useMemo'
    ],
    solution: {
      'ExpensiveList.jsx': `import React, { useState, useMemo, useCallback } from 'react';

// Solution: Move static objects outside component
const LIST_STYLE = {
  padding: '20px',
  backgroundColor: '#f5f5f5'
};

function ExpensiveList({ items }) {
  const [filter, setFilter] = useState('');

  // Solution: Memoize expensive calculation
  const filteredItems = useMemo(() => {
    return items
      .filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, filter]);

  // Solution: Memoize callback function
  const handleItemClick = useCallback((item) => {
    console.log('Clicked:', item.name);
  }, []);

  return (
    <div style={LIST_STYLE}>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '16px',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredItems.map(item => (
          <ExpensiveItem
            key={item.id}
            item={item}
            onClick={handleItemClick}
          />
        ))}
      </ul>
    </div>
  );
}

// Solution: Memoize child component
const ExpensiveItem = React.memo(function ExpensiveItem({ item, onClick }) {
  console.log('ExpensiveItem rendered:', item.name);

  return (
    <li
      onClick={() => onClick(item)}
      style={{
        padding: '8px',
        margin: '4px 0',
        backgroundColor: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        border: '1px solid #eee'
      }}
    >
      {item.name} - {item.category}
    </li>
  );
});

export default ExpensiveList;`
    },
    testCases: [
      'Child components should not re-render unnecessarily',
      'Filtering should work correctly',
      'Performance should be improved with large lists',
      'Console logs should show fewer re-renders'
    ],
    debuggingSteps: [
      'Use React DevTools Profiler to identify re-renders',
      'Add console.logs to track component renders',
      'Check if objects/functions are created in render',
      'Verify memoization is working correctly'
    ],
    commonMistakes: [
      'Creating objects and functions in render',
      'Not memoizing expensive calculations',
      'Forgetting to memoize callback functions',
      'Not using React.memo for pure components'
    ],
    productionImpact: 'Poor performance, slow UI, high CPU usage, bad user experience',
    preventionTips: [
      'Use React DevTools Profiler regularly',
      'Memoize expensive calculations with useMemo',
      'Memoize callbacks with useCallback',
      'Move static objects outside components'
    ]
  },

  // 11. Context API Performance Issues
  {
    id: 'react-context-performance',
    title: 'Context API Causing Unnecessary Re-renders',
    description: 'All components re-render when any context value changes',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 160,
    tags: ['React', 'Context', 'Performance', 'Re-renders'],
    rootCause: 'Single context with multiple values causing widespread re-renders',
    category: 'State Management',
    files: {
      'AppContext.jsx': `import React, { createContext, useContext, useState } from 'react';

// BUG: Single context with multiple unrelated values!
const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});

  // BUG: Creating new object on every render!
  const value = {
    user,
    setUser,
    theme,
    setTheme,
    notifications,
    setNotifications,
    settings,
    setSettings
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};`
    },
    hints: [
      'Single context with multiple values causes all consumers to re-render',
      'Split contexts by concern (user, theme, notifications)',
      'Memoize context value object to prevent unnecessary re-renders',
      'Consider using multiple contexts or state management library'
    ],
    solution: {
      'AppContext.jsx': `import React, { createContext, useContext, useState, useMemo } from 'react';

// Solution: Split contexts by concern
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({
    user,
    setUser
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const value = useMemo(() => ({
    notifications,
    setNotifications
  }), [notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Combined provider for convenience
export function AppProvider({ children }) {
  return (
    <UserProvider>
      <ThemeProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

// Specific hooks for each context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};`
    },
    testCases: [
      'Components should only re-render when their specific context changes',
      'User context changes should not affect theme components',
      'Theme changes should not affect notification components',
      'Context values should be properly memoized'
    ],
    debuggingSteps: [
      'Use React DevTools to track re-renders',
      'Add console.logs to components using different contexts',
      'Verify context value memoization',
      'Test performance with React Profiler'
    ],
    commonMistakes: [
      'Using single context for unrelated data',
      'Not memoizing context values',
      'Creating new objects in context provider',
      'Not splitting contexts by concern'
    ],
    productionImpact: 'Poor performance, unnecessary re-renders, slow UI updates',
    preventionTips: [
      'Split contexts by logical concern',
      'Always memoize context values',
      'Use React DevTools to monitor re-renders',
      'Consider state management libraries for complex state'
    ]
  },

  // 12. Custom Hook Dependencies
  {
    id: 'react-custom-hook-deps',
    title: 'Custom Hook Dependency Issues',
    description: 'Custom hook not updating when dependencies change',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'Custom Hooks', 'Dependencies', 'useEffect'],
    rootCause: 'Missing dependencies in custom hook useEffect',
    category: 'Hooks & Lifecycle',
    files: {
      'useApi.js': `import { useState, useEffect } from 'react';

// BUG: Missing dependencies in custom hook!
function useApi(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(url, options) // BUG: url and options not in dependencies!
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // BUG: Empty dependency array!

  return { data, loading, error };
}

export default useApi;`,
      'UserList.jsx': `import React from 'react';
import useApi from './useApi';

function UserList() {
  const { data: users, loading, error } = useApi('/api/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;`
    },
    hints: [
      'Custom hooks should include all external dependencies',
      'URL and options parameters should be in dependency array',
      'Consider using useCallback for options object',
      'Test hook with different parameters'
    ],
    solution: {
      'useApi.js': `import { useState, useEffect } from 'react';

function useApi(url, options) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    fetch(url, {
      ...options,
      signal: controller.signal
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [url, options]); // Fixed: Added url and options dependencies

  return { data, loading, error };
}

export default useApi;`,
      'UserList.jsx': `import React, { useMemo } from 'react';
import useApi from './useApi';

function UserList() {
  // Solution: Memoize options to prevent unnecessary re-fetches
  const apiOptions = useMemo(() => ({
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }), []);

  const { data: users, loading, error } = useApi('/api/users', apiOptions);

  if (loading) return <div style={{ padding: '20px' }}>Loading users...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Users</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users?.map(user => (
          <li
            key={user.id}
            style={{
              padding: '8px',
              margin: '4px 0',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;`
    },
    testCases: [
      'Hook should re-fetch when URL changes',
      'Hook should re-fetch when options change',
      'Loading states should work correctly',
      'Error handling should work properly'
    ],
    debuggingSteps: [
      'Check if hook re-runs when parameters change',
      'Verify dependency array includes all external values',
      'Test with different URLs and options',
      'Use React DevTools to monitor hook calls'
    ],
    commonMistakes: [
      'Missing dependencies in custom hook useEffect',
      'Not memoizing options object in component',
      'Forgetting to handle cleanup in custom hooks',
      'Not handling edge cases like empty URL'
    ],
    productionImpact: 'Stale data, hooks not updating, memory leaks from unaborted requests',
    preventionTips: [
      'Always include external dependencies in useEffect',
      'Memoize objects passed to custom hooks',
      'Add cleanup functions for async operations',
      'Test custom hooks with different parameters'
    ]
  },

  // 13. Form Validation Issues
  {
    id: 'react-form-validation',
    title: 'Form Validation Not Working',
    description: 'Form validation logic has bugs and allows invalid submissions',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'Forms', 'Validation', 'State Management'],
    rootCause: 'Incorrect validation logic and state management',
    category: 'Forms & Validation',
    files: {
      'RegistrationForm.jsx': `import React, { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // BUG: Weak email validation!
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }

    // BUG: No password strength check!
    if (formData.password.length < 6) {
      newErrors.password = 'Password too short';
    }

    // BUG: Not checking if passwords match!
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // BUG: This logic is wrong!
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) { // BUG: validateForm always returns false!
      console.log('Form submitted:', formData);
    } else {
      console.log('Form has errors');
    }
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
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegistrationForm;`
    },
    hints: [
      'Check the validation logic return statement',
      'Improve email validation with proper regex',
      'Add password strength requirements',
      'Ensure validation runs before form submission'
    ],
    solution: {
      'RegistrationForm.jsx': `import React, { useState } from 'react';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Solution: Proper email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Solution: Strong password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Solution: Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Fixed: Correct logic
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration successful:', formData);
      alert('Registration successful!');

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px' }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: errors.email ? '1px solid red' : '1px solid #ddd'
            }}
            required
          />
          {errors.email && (
            <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: errors.password ? '1px solid red' : '1px solid #ddd'
            }}
            required
          />
          {errors.password && (
            <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: errors.confirmPassword ? '1px solid red' : '1px solid #ddd'
            }}
            required
          />
          {errors.confirmPassword && (
            <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;`
    },
    testCases: [
      'Form should validate email format correctly',
      'Password strength requirements should be enforced',
      'Password confirmation should work properly',
      'Form should submit only when validation passes'
    ],
    debuggingSteps: [
      'Test form with invalid email formats',
      'Try weak passwords and verify rejection',
      'Test password mismatch scenarios',
      'Check form submission with valid data'
    ],
    commonMistakes: [
      'Weak validation logic',
      'Incorrect return values from validation functions',
      'Not clearing errors when user corrects input',
      'Missing loading states during submission'
    ],
    productionImpact: 'Security vulnerabilities, poor user experience, invalid data in database',
    preventionTips: [
      'Use proper regex for email validation',
      'Implement strong password requirements',
      'Provide real-time validation feedback',
      'Test all validation scenarios thoroughly'
    ]
  },

  // 14. Async State Updates Race Condition
  {
    id: 'react-async-race-condition',
    title: 'Async State Updates Race Condition',
    description: 'Multiple async operations cause state updates to overwrite each other',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'Async', 'Race Condition', 'State Management'],
    rootCause: 'Multiple async operations updating state without proper coordination',
    category: 'State Management',
    files: {
      'SearchResults.jsx': `import React, { useState, useEffect } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    // BUG: Race condition! Fast typing can cause old results to overwrite new ones
    searchAPI(query).then(data => {
      setResults(data); // BUG: No check if this is still the current query!
      setLoading(false);
    });
  }, [query]);

  const searchAPI = async (searchQuery) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    return [
      { id: 1, title: \`Result for "\${searchQuery}" - 1\` },
      { id: 2, title: \`Result for "\${searchQuery}" - 2\` }
    ];
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {loading && <div>Loading...</div>}

      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;`
    },
    hints: [
      'Fast typing can cause race conditions with async operations',
      'Use cleanup function to cancel outdated requests',
      'Consider using AbortController for request cancellation',
      'Track request IDs to ignore outdated responses'
    ],
    solution: {
      'SearchResults.jsx': `import React, { useState, useEffect, useRef } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    setLoading(true);

    searchAPI(query, currentController.signal)
      .then(data => {
        // Only update if this request wasn't aborted
        if (!currentController.signal.aborted) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
          setResults([]);
          setLoading(false);
        }
      });

    // Cleanup function
    return () => {
      if (currentController) {
        currentController.abort();
      }
    };
  }, [query]);

  const searchAPI = async (searchQuery, signal) => {
    // Simulate API delay
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, Math.random() * 1000);

      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('AbortError'));
      });
    });

    // Check if aborted before returning results
    if (signal.aborted) {
      throw new Error('AbortError');
    }

    return [
      { id: 1, title: \`Result for "\${searchQuery}" - 1\` },
      { id: 2, title: \`Result for "\${searchQuery}" - 2\` },
      { id: 3, title: \`Result for "\${searchQuery}" - 3\` }
    ];
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>Search Results</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}
      />

      {loading && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>Loading...</div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map(result => (
          <li
            key={result.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}
          >
            {result.title}
          </li>
        ))}
      </ul>

      {query && !loading && results.length === 0 && (
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

export default SearchResults;`
    },
    testCases: [
      'Fast typing should not cause race conditions',
      'Only latest search results should be displayed',
      'Previous requests should be cancelled properly',
      'Loading state should work correctly'
    ],
    debuggingSteps: [
      'Type quickly and observe if old results appear',
      'Check network tab for cancelled requests',
      'Verify AbortController is working',
      'Test with slow network conditions'
    ],
    commonMistakes: [
      'Not cancelling previous async operations',
      'Ignoring component unmount cleanup',
      'Not handling AbortError properly',
      'Missing request deduplication'
    ],
    productionImpact: 'Incorrect search results, poor user experience, wasted API calls',
    preventionTips: [
      'Always cancel previous async operations',
      'Use AbortController for request cancellation',
      'Implement proper cleanup in useEffect',
      'Consider debouncing for search inputs'
    ]
  },

  // 15. Component Lifecycle Cleanup Issues
  {
    id: 'react-lifecycle-cleanup',
    title: 'Component Lifecycle Cleanup Issues',
    description: 'Component not cleaning up properly causing memory leaks',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 150,
    tags: ['React', 'Lifecycle', 'Cleanup', 'Memory Leaks'],
    rootCause: 'Missing cleanup in useEffect causing memory leaks',
    category: 'Hooks & Lifecycle',
    files: {
      'Timer.jsx': `import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      // BUG: No cleanup for interval!
      const interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);

      // BUG: Missing return statement for cleanup!
    }
  }, [isRunning]);

  useEffect(() => {
    // BUG: Event listener not cleaned up!
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // BUG: No cleanup function!
  }, []);

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}

export default Timer;`
    },
    hints: [
      'setInterval needs to be cleared when component unmounts',
      'Event listeners should be removed in cleanup',
      'useEffect should return cleanup function',
      'Check for memory leaks in browser DevTools'
    ],
    solution: {
      'Timer.jsx': `import React, { useState, useEffect, useRef } from 'react';

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsRunning(false);
      }
    };

    const handleBeforeUnload = () => {
      setIsRunning(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxWidth: '300px',
      margin: '20px auto'
    }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
        Timer: {seconds}s
      </h2>

      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: isRunning ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ fontSize: '12px', color: '#666' }}>
        Status: {isRunning ? 'Running' : 'Stopped'}
      </div>
    </div>
  );
}

export default Timer;`
    },
    testCases: [
      'Timer should stop when component unmounts',
      'No memory leaks should occur',
      'Event listeners should be properly removed',
      'Interval should be cleared correctly'
    ],
    debuggingSteps: [
      'Check browser DevTools Memory tab for leaks',
      'Verify intervals are cleared in Network tab',
      'Test component mounting/unmounting',
      'Check console for cleanup warnings'
    ],
    commonMistakes: [
      'Forgetting to clear intervals and timeouts',
      'Not removing event listeners',
      'Missing cleanup functions in useEffect',
      'Not handling component unmount properly'
    ],
    productionImpact: 'Memory leaks, performance degradation, browser crashes',
    preventionTips: [
      'Always return cleanup functions from useEffect',
      'Clear all intervals and timeouts',
      'Remove all event listeners',
      'Use browser DevTools to check for memory leaks'
    ]
  },

  // 16. React Router Nested Routes Issue
  {
    id: 'react-router-nested-routes',
    title: 'React Router Nested Routes Not Working',
    description: 'Nested routes not rendering correctly in React Router',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'React Router', 'Nested Routes', 'Navigation'],
    rootCause: 'Missing Outlet component and incorrect route configuration',
    category: 'Routing & Navigation',
    files: {
      'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Settings from './Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* BUG: Nested routes not configured properly! */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/account" element={<div>Account Settings</div>} />
        <Route path="/settings/privacy" element={<div>Privacy Settings</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
      'Settings.jsx': `import React from 'react';
import { Link } from 'react-router-dom';

function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <nav>
        <Link to="/settings/account">Account</Link>
        <Link to="/settings/privacy">Privacy</Link>
      </nav>

      {/* BUG: Missing Outlet component! */}
      <div>
        <p>Select a settings category from above.</p>
      </div>
    </div>
  );
}

export default Settings;`
    },
    hints: [
      'Nested routes need proper parent-child relationship',
      'Parent route component needs Outlet component',
      'Use relative paths in nested routes',
      'Check React Router documentation for nested routing'
    ],
    solution: {
      'App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Settings from './Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* Solution: Proper nested route structure */}
        <Route path="/settings" element={<Settings />}>
          <Route path="account" element={<AccountSettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route index element={<DefaultSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AccountSettings() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
      <h3>Account Settings</h3>
      <p>Manage your account preferences here.</p>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
      <h3>Privacy Settings</h3>
      <p>Control your privacy settings here.</p>
    </div>
  );
}

function DefaultSettings() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
      <p>Select a settings category from the navigation above.</p>
    </div>
  );
}

export default App;`,
      'Settings.jsx': `import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function Settings() {
  const location = useLocation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>

      <nav style={{ marginBottom: '20px' }}>
        <Link
          to="/settings/account"
          style={{
            marginRight: '15px',
            padding: '8px 16px',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/settings/account' ? '#007bff' : '#e9ecef',
            color: location.pathname === '/settings/account' ? 'white' : '#333',
            borderRadius: '4px'
          }}
        >
          Account
        </Link>
        <Link
          to="/settings/privacy"
          style={{
            padding: '8px 16px',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/settings/privacy' ? '#007bff' : '#e9ecef',
            color: location.pathname === '/settings/privacy' ? 'white' : '#333',
            borderRadius: '4px'
          }}
        >
          Privacy
        </Link>
      </nav>

      {/* Solution: Added Outlet component for nested routes */}
      <Outlet />
    </div>
  );
}

export default Settings;`
    },
    testCases: [
      'Nested routes should render within parent component',
      'Navigation between nested routes should work',
      'Parent component should remain visible',
      'Default route should show when no nested route is selected'
    ],
    debuggingSteps: [
      'Check if Outlet component is imported and used',
      'Verify nested route structure in App component',
      'Test navigation to nested routes',
      'Check React Router DevTools if available'
    ],
    commonMistakes: [
      'Missing Outlet component in parent route',
      'Incorrect nested route configuration',
      'Using absolute paths instead of relative paths',
      'Not understanding parent-child route relationship'
    ],
    productionImpact: 'Broken navigation, poor user experience, SEO issues',
    preventionTips: [
      'Always use Outlet in components with nested routes',
      'Plan route hierarchy before implementation',
      'Test all navigation paths thoroughly',
      'Use React Router DevTools for debugging'
    ]
  },

  // 17. Props Drilling Issue
  {
    id: 'react-props-drilling',
    title: 'Props Drilling Performance Issue',
    description: 'Passing props through multiple component levels causing re-renders',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '22 min',
    xpReward: 150,
    tags: ['React', 'Props Drilling', 'Context', 'Performance'],
    rootCause: 'Excessive props drilling causing unnecessary re-renders',
    category: 'State Management',
    files: {
      'App.jsx': `import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <div>
      {/* BUG: Props drilling through multiple levels! */}
      <Header
        user={user}
        theme={theme}
        setTheme={setTheme}
        notifications={notifications}
      />
      <MainContent
        user={user}
        theme={theme}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
}

function Header({ user, theme, setTheme, notifications }) {
  return (
    <header>
      <Navigation user={user} theme={theme} />
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <NotificationBell notifications={notifications} />
    </header>
  );
}

function Navigation({ user, theme }) {
  return (
    <nav>
      <UserInfo user={user} theme={theme} />
    </nav>
  );
}

function UserInfo({ user, theme }) {
  console.log('UserInfo re-rendered'); // Shows unnecessary re-renders
  return (
    <div className={theme}>
      Welcome, {user.name}!
    </div>
  );
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}

function NotificationBell({ notifications }) {
  return (
    <div>
      Notifications: {notifications.length}
    </div>
  );
}

function MainContent({ user, theme, notifications, setNotifications }) {
  return (
    <main>
      <ContentArea user={user} theme={theme} />
      <Sidebar notifications={notifications} setNotifications={setNotifications} />
    </main>
  );
}

function ContentArea({ user, theme }) {
  console.log('ContentArea re-rendered'); // Shows unnecessary re-renders
  return (
    <div className={theme}>
      Content for {user.name}
    </div>
  );
}

function Sidebar({ notifications, setNotifications }) {
  return (
    <aside>
      <NotificationList notifications={notifications} setNotifications={setNotifications} />
    </aside>
  );
}

function NotificationList({ notifications, setNotifications }) {
  return (
    <ul>
      {notifications.map(notification => (
        <li key={notification.id}>{notification.message}</li>
      ))}
    </ul>
  );
}

export default App;`
    },
    hints: [
      'Props drilling causes unnecessary re-renders',
      'Use React Context to avoid passing props through multiple levels',
      'Split contexts by concern to minimize re-renders',
      'Consider component composition patterns'
    ],
    solution: {
      'App.jsx': `import React, { useState, createContext, useContext, useMemo } from 'react';

// Solution: Create separate contexts for different concerns
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'John', role: 'admin' });
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  const userValue = useMemo(() => ({ user, setUser }), [user]);
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  const notificationValue = useMemo(() => ({
    notifications,
    setNotifications
  }), [notifications]);

  return (
    <UserContext.Provider value={userValue}>
      <ThemeContext.Provider value={themeValue}>
        <NotificationContext.Provider value={notificationValue}>
          <div>
            <Header />
            <MainContent />
          </div>
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// Custom hooks for context consumption
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

function Header() {
  return (
    <header style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <Navigation />
      <ThemeToggle />
      <NotificationBell />
    </header>
  );
}

function Navigation() {
  return (
    <nav style={{ display: 'inline-block', marginRight: '20px' }}>
      <UserInfo />
    </nav>
  );
}

// Solution: Components only consume the context they need
const UserInfo = React.memo(function UserInfo() {
  const { user } = useUser();
  const { theme } = useTheme();

  console.log('UserInfo re-rendered'); // Should re-render less frequently

  return (
    <div style={{
      color: theme === 'dark' ? 'white' : 'black',
      backgroundColor: theme === 'dark' ? '#333' : 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      display: 'inline-block'
    }}>
      Welcome, {user.name}!
    </div>
  );
});

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{
        marginRight: '20px',
        padding: '8px 12px',
        backgroundColor: theme === 'dark' ? '#6c757d' : '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Toggle Theme ({theme})
    </button>
  );
}

function NotificationBell() {
  const { notifications } = useNotifications();

  return (
    <div style={{
      display: 'inline-block',
      padding: '8px 12px',
      backgroundColor: '#28a745',
      color: 'white',
      borderRadius: '4px'
    }}>
      Notifications: {notifications.length}
    </div>
  );
}

function MainContent() {
  return (
    <main style={{ display: 'flex', padding: '20px' }}>
      <ContentArea />
      <Sidebar />
    </main>
  );
}

const ContentArea = React.memo(function ContentArea() {
  const { user } = useUser();
  const { theme } = useTheme();

  console.log('ContentArea re-rendered'); // Should re-render less frequently

  return (
    <div style={{
      flex: 1,
      marginRight: '20px',
      padding: '20px',
      backgroundColor: theme === 'dark' ? '#333' : '#f8f9fa',
      color: theme === 'dark' ? 'white' : 'black',
      borderRadius: '4px'
    }}>
      <h2>Content for {user.name}</h2>
      <p>This is the main content area.</p>
    </div>
  );
});

function Sidebar() {
  return (
    <aside style={{ width: '300px' }}>
      <NotificationList />
    </aside>
  );
}

function NotificationList() {
  const { notifications, setNotifications } = useNotifications();

  const addNotification = () => {
    const newNotification = {
      id: Date.now(),
      message: \`Notification \${notifications.length + 1}\`
    };
    setNotifications([...notifications, newNotification]);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e9ecef',
      borderRadius: '4px'
    }}>
      <h3>Notifications</h3>
      <button
        onClick={addNotification}
        style={{
          marginBottom: '10px',
          padding: '8px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Notification
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map(notification => (
          <li
            key={notification.id}
            style={{
              padding: '8px',
              margin: '4px 0',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;`
    },
    testCases: [
      'Components should only re-render when their context changes',
      'Theme changes should not affect notification components',
      'User changes should not affect notification components',
      'Console logs should show fewer re-renders'
    ],
    debuggingSteps: [
      'Use React DevTools to track re-renders',
      'Add console.logs to identify unnecessary re-renders',
      'Test context changes and observe component updates',
      'Verify context value memoization'
    ],
    commonMistakes: [
      'Passing all props through multiple component levels',
      'Not splitting contexts by concern',
      'Creating new objects in context providers',
      'Not memoizing context values'
    ],
    productionImpact: 'Poor performance, unnecessary re-renders, slow UI updates',
    preventionTips: [
      'Use Context API to avoid props drilling',
      'Split contexts by logical concern',
      'Memoize context values and components',
      'Consider component composition patterns'
    ]
  },

  // 18. useState Batch Updates Issue
  {
    id: 'react-usestate-batching',
    title: 'useState Batch Updates Not Working',
    description: 'Multiple setState calls not batching properly causing extra renders',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    xpReward: 120,
    tags: ['React', 'useState', 'Batching', 'Performance'],
    rootCause: 'setState calls in async functions not batching automatically',
    category: 'State Management',
    files: {
      'Counter.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  console.log('Counter rendered'); // Shows re-render count

  const handleAsyncUpdate = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // BUG: These updates are not batched in async functions!
    setCount(prev => prev + 1);
    setMessage('Updated!');
    setLoading(false);
    // This causes 3 separate re-renders instead of 1!
  };

  const handleSyncUpdate = () => {
    // These ARE batched automatically in React 18
    setCount(prev => prev + 1);
    setMessage('Sync Updated!');
    setLoading(false);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Message: {message}</p>

      <button onClick={handleAsyncUpdate}>
        Async Update (Not Batched)
      </button>

      <button onClick={handleSyncUpdate}>
        Sync Update (Batched)
      </button>
    </div>
  );
}

export default Counter;`
    },
    hints: [
      'React 18 automatically batches updates in event handlers',
      'Async functions need manual batching with flushSync or unstable_batchedUpdates',
      'Use React DevTools Profiler to see render count',
      'Consider using useReducer for complex state updates'
    ],
    solution: {
      'Counter.jsx': `import React, { useState } from 'react';
import { flushSync } from 'react-dom';

function Counter() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  console.log('Counter rendered'); // Shows re-render count

  const handleAsyncUpdate = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Solution 1: Use flushSync to force immediate update (use sparingly)
    // flushSync(() => {
    //   setCount(prev => prev + 1);
    //   setMessage('Updated!');
    //   setLoading(false);
    // });

    // Solution 2: Better approach - batch updates manually
    // React 18 automatically batches these even in async functions
    setCount(prev => prev + 1);
    setMessage('Updated!');
    setLoading(false);
  };

  // Solution 3: Use useReducer for complex state updates
  const handleReducerUpdate = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // All state updates in one action
    dispatch({
      type: 'ASYNC_UPDATE_COMPLETE',
      payload: { count: count + 1, message: 'Reducer Updated!' }
    });
  };

  // Alternative: Using useReducer
  const [state, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case 'ASYNC_UPDATE_COMPLETE':
        return {
          ...state,
          count: action.payload.count,
          message: action.payload.message,
          loading: false
        };
      case 'START_LOADING':
        return { ...state, loading: true };
      default:
        return state;
    }
  }, { count: 0, loading: false, message: '' });

  const handleSyncUpdate = () => {
    // These ARE batched automatically in React 18
    setCount(prev => prev + 1);
    setMessage('Sync Updated!');
    setLoading(false);
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      maxWidth: '400px',
      margin: '20px auto'
    }}>
      <h2 style={{ margin: '0 0 15px 0' }}>Count: {count}</h2>
      <p style={{ margin: '5px 0' }}>
        Loading: <span style={{ color: loading ? 'orange' : 'green' }}>
          {loading ? 'Yes' : 'No'}
        </span>
      </p>
      <p style={{ margin: '5px 0 20px 0' }}>Message: {message}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={handleAsyncUpdate}
          disabled={loading}
          style={{
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Async Update (Batched in React 18)
        </button>

        <button
          onClick={handleSyncUpdate}
          style={{
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sync Update (Always Batched)
        </button>

        <button
          onClick={handleReducerUpdate}
          disabled={state.loading}
          style={{
            padding: '10px',
            backgroundColor: state.loading ? '#ccc' : '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: state.loading ? 'not-allowed' : 'pointer'
          }}
        >
          Reducer Update (Single Action)
        </button>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Note:</strong> React 18 automatically batches updates even in async functions.
        Check console for render count.
      </div>
    </div>
  );
}

export default Counter;`
    },
    testCases: [
      'Async updates should be batched in React 18',
      'Sync updates should always be batched',
      'Component should render minimal times',
      'Loading states should work correctly'
    ],
    debuggingSteps: [
      'Use React DevTools Profiler to count renders',
      'Add console.logs to track re-renders',
      'Test in React 17 vs React 18',
      'Compare batched vs non-batched updates'
    ],
    commonMistakes: [
      'Expecting automatic batching in older React versions',
      'Overusing flushSync for performance',
      'Not understanding React 18 automatic batching',
      'Multiple setState calls without considering batching'
    ],
    productionImpact: 'Extra re-renders, poor performance, UI flickering',
    preventionTips: [
      'Upgrade to React 18 for automatic batching',
      'Use useReducer for complex state updates',
      'Minimize separate setState calls',
      'Use React DevTools to monitor renders'
    ]
  },

  // 19. useCallback Dependencies Issue
  {
    id: 'react-usecallback-deps',
    title: 'useCallback Dependencies Missing',
    description: 'useCallback not updating when dependencies change',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'useCallback', 'Dependencies', 'Memoization'],
    rootCause: 'Missing dependencies in useCallback causing stale closures',
    category: 'Hooks & Lifecycle',
    files: {
      'TodoList.jsx': `import React, { useState, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // BUG: Missing dependencies in useCallback!
  const addTodo = useCallback((text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos([...todos, newTodo]); // BUG: 'todos' not in dependencies!
  }, []); // BUG: Empty dependency array!

  const toggleTodo = useCallback((id) => {
    setTodos(todos.map(todo => // BUG: 'todos' not in dependencies!
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // BUG: Empty dependency array!

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div>
      <AddTodoForm onAdd={addTodo} />
      <FilterButtons filter={filter} setFilter={setFilter} />
      <TodoItems todos={filteredTodos} onToggle={toggleTodo} />
    </div>
  );
}

function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

function FilterButtons({ filter, setFilter }) {
  return (
    <div>
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('active')}>Active</button>
      <button onClick={() => setFilter('completed')}>Completed</button>
    </div>
  );
}

function TodoItems({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

export default TodoList;`
    },
    hints: [
      'useCallback should include all dependencies from outer scope',
      'Use functional updates with setState to avoid dependencies',
      'ESLint exhaustive-deps rule can help catch missing dependencies',
      'Consider if useCallback is actually needed'
    ],
    solution: {
      'TodoList.jsx': `import React, { useState, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // Solution 1: Use functional updates to avoid dependencies
  const addTodo = useCallback((text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []); // No dependencies needed with functional update

  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // No dependencies needed with functional update

  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>Todo List</h2>
      <AddTodoForm onAdd={addTodo} />
      <FilterButtons filter={filter} setFilter={setFilter} />
      <TodoItems
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        Total: {todos.length} |
        Active: {todos.filter(t => !t.completed).length} |
        Completed: {todos.filter(t => t.completed).length}
      </div>
    </div>
  );
}

const AddTodoForm = React.memo(function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');

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
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add todo..."
        style={{
          padding: '8px',
          marginRight: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          width: '300px'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add
      </button>
    </form>
  );
});

function FilterButtons({ filter, setFilter }) {
  const buttons = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div style={{ marginBottom: '20px' }}>
      {buttons.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          style={{
            padding: '6px 12px',
            marginRight: '8px',
            backgroundColor: filter === key ? '#007bff' : '#e9ecef',
            color: filter === key ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const TodoItems = React.memo(function TodoItems({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        padding: '20px'
      }}>
        No todos found
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map(todo => (
        <li
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            margin: '5px 0',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
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
              color: todo.completed ? '#666' : '#333'
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
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
});

export default TodoList;`
    },
    testCases: [
      'Adding todos should work correctly',
      'Toggling todos should update state properly',
      'Filtering should work with all options',
      'Callbacks should not have stale closure issues'
    ],
    debuggingSteps: [
      'Check if callbacks are updating with latest state',
      'Use ESLint exhaustive-deps rule',
      'Test rapid state changes',
      'Verify functional updates are working'
    ],
    commonMistakes: [
      'Missing dependencies in useCallback',
      'Using stale state in callbacks',
      'Not using functional updates when needed',
      'Overusing useCallback without performance benefit'
    ],
    productionImpact: 'Stale data, incorrect behavior, bugs in user interactions',
    preventionTips: [
      'Use functional updates to avoid dependencies',
      'Include all dependencies in useCallback',
      'Use ESLint exhaustive-deps rule',
      'Only use useCallback when actually needed for performance'
    ]
  },

  // 20. Error Boundary Implementation Issues
  {
    id: 'react-error-boundary',
    title: 'Error Boundary Not Catching Errors',
    description: 'Error boundary not properly catching and handling component errors',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'Error Boundary', 'Error Handling', 'Class Components'],
    rootCause: 'Incorrect error boundary implementation and missing error cases',
    category: 'Error Handling',
    files: {
      'ErrorBoundary.jsx': `import React from 'react';

// BUG: Incomplete error boundary implementation!
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // BUG: Only catches errors in render, not in event handlers or async code!
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // BUG: Not logging error details properly!
  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error);
    // BUG: Should log to error reporting service!
  }

  render() {
    if (this.state.hasError) {
      // BUG: Generic error message, no retry mechanism!
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Component that throws errors
function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Intentional error for testing');
  }

  const handleAsyncError = async () => {
    // BUG: Error boundary won't catch this!
    throw new Error('Async error not caught by boundary');
  };

  const handleEventError = () => {
    // BUG: Error boundary won't catch this!
    throw new Error('Event handler error not caught');
  };

  return (
    <div>
      <p>Component is working fine</p>
      <button onClick={handleEventError}>
        Trigger Event Error (Not Caught)
      </button>
      <button onClick={handleAsyncError}>
        Trigger Async Error (Not Caught)
      </button>
    </div>
  );
}

function App() {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShouldThrow(!shouldThrow)}>
        Toggle Render Error
      </button>

      <ErrorBoundary>
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

export default App;`
    },
    hints: [
      'Error boundaries only catch errors in render, not in event handlers',
      'Add proper error logging and reporting',
      'Provide retry mechanism and better error UI',
      'Handle async errors separately with try-catch'
    ],
    solution: {
      'ErrorBoundary.jsx': `import React from 'react';

// Solution: Comprehensive error boundary implementation
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Log to error reporting service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      const eventId = window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
      this.setState({ eventId });
    }

    // Log to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          margin: '20px'
        }}>
          <h2 style={{ margin: '0 0 15px 0' }}>🚨 Something went wrong</h2>

          <p>We're sorry, but something unexpected happened.</p>

          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                backgroundColor: '#f1f3f4',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          {this.state.eventId && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              Error ID: {this.state.eventId}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced component with proper error handling
function BuggyComponent({ shouldThrow }) {
  const [asyncError, setAsyncError] = React.useState(null);

  if (shouldThrow) {
    throw new Error('Intentional render error for testing');
  }

  const handleAsyncError = async () => {
    try {
      // Simulate async operation that fails
      await new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Async operation failed')), 1000);
      });
    } catch (error) {
      // Handle async errors manually
      console.error('Async error:', error);
      setAsyncError(error.message);

      // Report to error service
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(error);
      }
    }
  };

  const handleEventError = () => {
    try {
      throw new Error('Event handler error');
    } catch (error) {
      // Handle event errors manually
      console.error('Event error:', error);
      setAsyncError(error.message);

      // Report to error service
      if (typeof window !== 'undefined' && window.Sentry) {
        window.Sentry.captureException(error);
      }
    }
  };

  if (asyncError) {
    return (
      <div style={{
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        color: '#856404'
      }}>
        <p><strong>Async Error:</strong> {asyncError}</p>
        <button
          onClick={() => setAsyncError(null)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Error
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <p>✅ Component is working fine</p>

      <div style={{ marginTop: '10px' }}>
        <button
          onClick={handleEventError}
          style={{
            padding: '8px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Trigger Event Error (Handled)
        </button>

        <button
          onClick={handleAsyncError}
          style={{
            padding: '8px 12px',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Trigger Async Error (Handled)
        </button>
      </div>
    </div>
  );
}

function App() {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Error Boundary Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShouldThrow(!shouldThrow)}
          style={{
            padding: '10px 16px',
            backgroundColor: shouldThrow ? '#28a745' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {shouldThrow ? 'Fix Render Error' : 'Trigger Render Error (Caught by Boundary)'}
        </button>
      </div>

      <ErrorBoundary>
        <BuggyComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
}

export default App;`
    },
    testCases: [
      'Error boundary should catch render errors',
      'Async errors should be handled manually',
      'Event handler errors should be handled manually',
      'Error details should be logged properly'
    ],
    debuggingSteps: [
      'Test different types of errors (render, async, event)',
      'Check error logging in console and error services',
      'Verify retry mechanism works',
      'Test error boundary in production build'
    ],
    commonMistakes: [
      'Expecting error boundaries to catch all errors',
      'Not handling async and event handler errors',
      'Poor error UI without retry mechanism',
      'Not logging errors to monitoring services'
    ],
    productionImpact: 'App crashes, poor user experience, untracked errors',
    preventionTips: [
      'Implement comprehensive error boundaries',
      'Handle async errors with try-catch',
      'Log errors to monitoring services',
      'Provide retry mechanisms and helpful error messages'
    ]
  },

  // 21. Ref Usage Issues
  {
    id: 'react-ref-issues',
    title: 'useRef and forwardRef Issues',
    description: 'Problems with ref usage, forwarding, and accessing DOM elements',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'useRef', 'forwardRef', 'DOM'],
    rootCause: 'Incorrect ref usage and missing forwardRef implementation',
    category: 'Refs & DOM',
    files: {
      'FocusInput.jsx': `import React, { useRef, useEffect } from 'react';

// BUG: Component doesn't forward ref!
function CustomInput({ placeholder, onFocus }) {
  return (
    <input
      placeholder={placeholder}
      onFocus={onFocus}
      style={{ padding: '8px', borderRadius: '4px' }}
    />
  );
}

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // BUG: inputRef.current will be null because CustomInput doesn't forward ref!
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleButtonClick = () => {
    // BUG: This won't work either!
    inputRef.current?.focus();
  };

  return (
    <div>
      <CustomInput
        ref={inputRef} // BUG: Ref not forwarded!
        placeholder="This should auto-focus"
        onFocus={() => console.log('Input focused')}
      />
      <button onClick={handleButtonClick}>
        Focus Input
      </button>
    </div>
  );
}

export default FocusInput;`
    },
    hints: [
      'Use forwardRef to pass refs through custom components',
      'Check if ref is properly attached to DOM element',
      'Use useImperativeHandle for custom ref behavior',
      'Verify ref.current exists before using it'
    ],
    solution: {
      'FocusInput.jsx': `import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// Solution: Use forwardRef to forward ref to DOM element
const CustomInput = forwardRef(function CustomInput({ placeholder, onFocus, ...props }, ref) {
  return (
    <input
      ref={ref}
      placeholder={placeholder}
      onFocus={onFocus}
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '200px'
      }}
      {...props}
    />
  );
});

// Alternative: Custom component with useImperativeHandle
const AdvancedInput = forwardRef(function AdvancedInput({ placeholder, onFocus }, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    getValue: () => {
      return inputRef.current?.value || '';
    },
    setValue: (value) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    }
  }), []);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      onFocus={onFocus}
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '200px'
      }}
    />
  );
});

function FocusInput() {
  const inputRef = useRef(null);
  const advancedInputRef = useRef(null);

  useEffect(() => {
    // Now this works because ref is properly forwarded
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFocusBasic = () => {
    inputRef.current?.focus();
  };

  const handleFocusAdvanced = () => {
    advancedInputRef.current?.focus();
  };

  const handleSetValue = () => {
    advancedInputRef.current?.setValue('Hello from ref!');
  };

  const handleGetValue = () => {
    const value = advancedInputRef.current?.getValue();
    alert(\`Current value: \${value}\`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Ref Usage Examples</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Basic forwardRef Example</h3>
        <CustomInput
          ref={inputRef}
          placeholder="Auto-focused input"
          onFocus={() => console.log('Basic input focused')}
        />
        <button
          onClick={handleFocusBasic}
          style={{
            marginLeft: '10px',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Focus Basic Input
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>useImperativeHandle Example</h3>
        <AdvancedInput
          ref={advancedInputRef}
          placeholder="Advanced input with custom methods"
          onFocus={() => console.log('Advanced input focused')}
        />
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={handleFocusAdvanced}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Focus
          </button>
          <button
            onClick={handleSetValue}
            style={{
              marginRight: '10px',
              padding: '8px 12px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Set Value
          </button>
          <button
            onClick={handleGetValue}
            style={{
              padding: '8px 12px',
              backgroundColor: '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Get Value
          </button>
        </div>
      </div>

      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Note:</strong> The first input auto-focuses on mount. Use the buttons to test ref functionality.
      </div>
    </div>
  );
}

export default FocusInput;`
    },
    testCases: [
      'Refs should be properly forwarded to DOM elements',
      'Auto-focus should work on component mount',
      'Button clicks should focus inputs correctly',
      'Custom ref methods should work with useImperativeHandle'
    ],
    debuggingSteps: [
      'Check if forwardRef is used in custom components',
      'Verify ref.current points to actual DOM element',
      'Test ref functionality with console.log',
      'Ensure useImperativeHandle exposes correct methods'
    ],
    commonMistakes: [
      'Forgetting to use forwardRef in custom components',
      'Not checking if ref.current exists before using',
      'Incorrect useImperativeHandle implementation',
      'Trying to use refs on functional components without forwardRef'
    ],
    productionImpact: 'Broken focus management, accessibility issues, poor UX',
    preventionTips: [
      'Always use forwardRef for custom components that need refs',
      'Check ref.current existence before using',
      'Use useImperativeHandle for custom ref behavior',
      'Test ref functionality thoroughly'
    ]
  },

  // 22. Conditional Rendering Issues
  {
    id: 'react-conditional-rendering',
    title: 'Conditional Rendering Logic Errors',
    description: 'Bugs in conditional rendering causing unexpected UI behavior',
    techStack: 'React',
    difficulty: 'beginner',
    estimatedTime: '15 min',
    xpReward: 100,
    tags: ['React', 'Conditional Rendering', 'JSX', 'Logic'],
    rootCause: 'Incorrect conditional rendering logic and falsy value handling',
    category: 'JSX & Rendering',
    files: {
      'UserProfile.jsx': `import React, { useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    age: 0,
    posts: [],
    isOnline: false
  });
  const [loading, setLoading] = useState(false);

  const loadUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        age: 25,
        posts: [],
        isOnline: true
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <button onClick={loadUser}>Load User</button>

      {/* BUG: Will show "0" when posts array is empty! */}
      {user.posts.length && (
        <div>
          <h3>Posts ({user.posts.length})</h3>
          {user.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      )}

      {/* BUG: Will show "0" when age is 0! */}
      {user.age && <p>Age: {user.age}</p>}

      {/* BUG: Will show empty string when name is empty! */}
      {user.name && <p>Name: {user.name}</p>}

      {/* BUG: Incorrect loading state check */}
      {loading && user.name ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Status: {user.isOnline ? 'Online' : 'Offline'}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'Use explicit boolean checks instead of truthy/falsy',
      'Be careful with 0, empty strings, and empty arrays',
      'Use ternary operators for clearer conditional logic',
      'Consider using Boolean() for explicit conversion'
    ],
    solution: {
      'UserProfile.jsx': `import React, { useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    age: 0,
    posts: [],
    isOnline: false
  });
  const [loading, setLoading] = useState(false);

  const loadUser = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        age: 25,
        posts: [
          { id: 1, title: 'First Post' },
          { id: 2, title: 'Second Post' }
        ],
        isOnline: true
      });
      setLoading(false);
    }, 1000);
  };

  const loadUserWithNoPosts = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: 'Jane Doe',
        age: 0, // Test case: age is 0
        posts: [], // Test case: empty posts
        isOnline: false
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>User Profile</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={loadUser}
          style={{
            marginRight: '10px',
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load User (With Posts)
        </button>
        <button
          onClick={loadUserWithNoPosts}
          style={{
            padding: '8px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load User (No Posts)
        </button>
      </div>

      {/* Solution: Explicit boolean check for array length */}
      {user.posts.length > 0 && (
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h3>Posts ({user.posts.length})</h3>
          {user.posts.map(post => (
            <div
              key={post.id}
              style={{
                padding: '8px',
                margin: '5px 0',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}
            >
              {post.title}
            </div>
          ))}
        </div>
      )}

      {/* Solution: Show message when no posts */}
      {user.posts.length === 0 && user.name && (
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '4px',
          color: '#856404'
        }}>
          <p>No posts yet.</p>
        </div>
      )}

      {/* Solution: Explicit check for age (including 0) */}
      {user.name && (
        <p>Age: {user.age >= 0 ? user.age : 'Not specified'}</p>
      )}

      {/* Solution: Explicit check for name */}
      {user.name.length > 0 ? (
        <p>Name: {user.name}</p>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No user loaded</p>
      )}

      {/* Solution: Clear conditional logic */}
      {user.name && (
        <div style={{
          padding: '10px',
          backgroundColor: user.isOnline ? '#d4edda' : '#f8d7da',
          color: user.isOnline ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          <p>Status: {user.isOnline ? '🟢 Online' : '🔴 Offline'}</p>
        </div>
      )}

      {/* Solution: Better conditional rendering patterns */}
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>Debug Info:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Name length: {user.name.length}</li>
          <li>Age: {user.age} (type: {typeof user.age})</li>
          <li>Posts count: {user.posts.length}</li>
          <li>Is online: {user.isOnline.toString()}</li>
        </ul>
      </div>
    </div>
  );
}

export default UserProfile;`
    },
    testCases: [
      'Empty arrays should not render unwanted content',
      'Zero values should be handled correctly',
      'Empty strings should not cause rendering issues',
      'Loading states should work properly'
    ],
    debuggingSteps: [
      'Test with different falsy values (0, "", [], false)',
      'Check what gets rendered with empty data',
      'Verify conditional logic with console.log',
      'Test edge cases like age = 0'
    ],
    commonMistakes: [
      'Using && with numbers that can be 0',
      'Not handling empty strings properly',
      'Incorrect loading state logic',
      'Not considering all falsy values'
    ],
    productionImpact: 'UI showing unexpected content, poor user experience',
    preventionTips: [
      'Use explicit boolean checks (length > 0)',
      'Consider all possible falsy values',
      'Use ternary operators for clearer logic',
      'Test with edge cases and empty data'
    ]
  },

  // 23. Component State Synchronization
  {
    id: 'react-state-sync',
    title: 'Component State Synchronization Issues',
    description: 'Parent and child components getting out of sync with state updates',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '22 min',
    xpReward: 150,
    tags: ['React', 'State Management', 'Props', 'Synchronization'],
    rootCause: 'Improper state lifting and synchronization between components',
    category: 'State Management',
    files: {
      'ShoppingCart.jsx': `import React, { useState } from 'react';

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, { ...product, quantity: 1 }]);
  };

  return (
    <div>
      <ProductList onAddToCart={addToCart} />
      <Cart items={cartItems} />
    </div>
  );
}

function ProductList({ onAddToCart }) {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 599 }
  ];

  return (
    <div>
      <h2>Products</h2>
      {products.map(product => (
        <Product
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function Product({ product, onAddToCart }) {
  // BUG: Local state not synchronized with cart!
  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsInCart(true); // BUG: This doesn't reflect actual cart state!
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
      <button
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        {isInCart ? 'Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}

function Cart({ items }) {
  // BUG: No way to update quantities or remove items!
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart ({items.length} items)</h2>
      {items.map((item, index) => (
        <div key={index}>
          {item.name} - \${item.price} x {item.quantity}
        </div>
      ))}
      <p>Total: \${total}</p>
    </div>
  );
}

export default ShoppingCart;`
    },
    hints: [
      'Lift state up to parent component for proper synchronization',
      'Pass down both state and state setters to child components',
      'Use derived state instead of duplicating state',
      'Consider using useReducer for complex state management'
    ],
    solution: {
      'ShoppingCart.jsx': `import React, { useState, useReducer } from 'react';

// Solution: Use useReducer for complex cart state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.find(item => item.id === action.product.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];

    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.productId);

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.productId
          ? { ...item, quantity: Math.max(0, action.quantity) }
          : item
      ).filter(item => item.quantity > 0);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

function ShoppingCart() {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Shopping Cart Demo</h1>
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <ProductList
            onAddToCart={addToCart}
            cartItems={cartItems} // Pass cart state for synchronization
          />
        </div>
        <div style={{ flex: 1 }}>
          <Cart
            items={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClear={clearCart}
          />
        </div>
      </div>
    </div>
  );
}

function ProductList({ onAddToCart, cartItems }) {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 599 },
    { id: 3, name: 'Tablet', price: 399 },
    { id: 4, name: 'Headphones', price: 199 }
  ];

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {products.map(product => (
          <Product
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            cartItems={cartItems} // Pass cart state for synchronization
          />
        ))}
      </div>
    </div>
  );
}

function Product({ product, onAddToCart, cartItems }) {
  // Solution: Derive state from props instead of local state
  const cartItem = cartItems.find(item => item.id === product.id);
  const isInCart = Boolean(cartItem);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div style={{
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
        \${product.price}
      </p>

      <button
        onClick={handleAddToCart}
        style={{
          padding: '8px 16px',
          backgroundColor: isInCart ? '#28a745' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        {isInCart ? \`In Cart (\${quantity})\` : 'Add to Cart'}
      </button>
    </div>
  );
}

function Cart({ items, onRemove, onUpdateQuantity, onClear }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div>
        <h2>Cart</h2>
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          fontStyle: 'italic',
          border: '2px dashed #ddd',
          borderRadius: '8px'
        }}>
          Your cart is empty
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>Cart ({itemCount} items)</h2>
        <button
          onClick={onClear}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '4px'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>\${item.price} each</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>

              <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: 'bold' }}>
                \${item.price * item.quantity}
              </div>

              <button
                onClick={() => onRemove(item.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        textAlign: 'right'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Total: \${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;`
    },
    testCases: [
      'Product buttons should reflect actual cart state',
      'Adding items should update both product and cart displays',
      'Quantity changes should be synchronized across components',
      'Removing items should update all related UI elements'
    ],
    debuggingSteps: [
      'Check if state is properly lifted to parent component',
      'Verify props are passed down correctly',
      'Test state synchronization with multiple operations',
      'Use React DevTools to inspect state flow'
    ],
    commonMistakes: [
      'Duplicating state in multiple components',
      'Not lifting state up to common parent',
      'Missing prop passing for state synchronization',
      'Using local state when derived state is needed'
    ],
    productionImpact: 'Inconsistent UI, confusing user experience, data integrity issues',
    preventionTips: [
      'Lift state up to the lowest common ancestor',
      'Use derived state instead of duplicating state',
      'Pass both state and state setters to child components',
      'Consider useReducer for complex state management'
    ]
  },

  // 24. Virtual Scrolling Performance
  {
    id: 'react-virtual-scrolling',
    title: 'Large List Performance Issues',
    description: 'Rendering large lists without virtualization causing performance problems',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '30 min',
    xpReward: 200,
    tags: ['React', 'Performance', 'Virtual Scrolling', 'Large Lists'],
    rootCause: 'Rendering thousands of DOM elements without virtualization',
    category: 'Performance',
    files: {
      'LargeList.jsx': `import React, { useState, useMemo } from 'react';

function LargeList() {
  const [itemCount, setItemCount] = useState(10000);
  const [filter, setFilter] = useState('');

  // BUG: Creating thousands of DOM elements!
  const items = useMemo(() => {
    return Array.from({ length: itemCount }, (_, i) => ({
      id: i,
      name: \`Item \${i + 1}\`,
      value: Math.floor(Math.random() * 1000),
      category: ['A', 'B', 'C'][i % 3]
    }));
  }, [itemCount]);

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <div>
        <input
          type="number"
          value={itemCount}
          onChange={(e) => setItemCount(Number(e.target.value))}
          placeholder="Number of items"
        />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items..."
        />
      </div>

      <p>Showing {filteredItems.length} items</p>

      {/* BUG: Rendering all items at once! */}
      <div style={{ height: '400px', overflow: 'auto' }}>
        {filteredItems.map(item => (
          <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{item.name}</strong> - {item.category} - Value: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LargeList;`
    },
    hints: [
      'Use virtual scrolling to render only visible items',
      'Implement window-based rendering with fixed item heights',
      'Consider using libraries like react-window or react-virtualized',
      'Calculate visible range based on scroll position'
    ],
    solution: {
      'LargeList.jsx': `import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// Simple virtual scrolling implementation
function VirtualList({ items, itemHeight = 50, containerHeight = 400 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: \`translateY(\${startIndex * itemHeight}px)\`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                height: itemHeight,
                padding: '10px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: (startIndex + index) % 2 === 0 ? '#f8f9fa' : 'white'
              }}
            >
              <strong style={{ marginRight: '10px' }}>{item.name}</strong>
              <span style={{
                padding: '2px 8px',
                backgroundColor: item.category === 'A' ? '#007bff' : item.category === 'B' ? '#28a745' : '#ffc107',
                color: item.category === 'C' ? '#000' : '#fff',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '10px'
              }}>
                {item.category}
              </span>
              <span>Value: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LargeList() {
  const [itemCount, setItemCount] = useState(10000);
  const [filter, setFilter] = useState('');
  const [useVirtualization, setUseVirtualization] = useState(true);

  const items = useMemo(() => {
    console.log(\`Generating \${itemCount} items...\`);
    return Array.from({ length: itemCount }, (_, i) => ({
      id: i,
      name: \`Item \${i + 1}\`,
      value: Math.floor(Math.random() * 1000),
      category: ['A', 'B', 'C'][i % 3]
    }));
  }, [itemCount]);

  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Large List Performance Demo</h2>

      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div>
          <label>Items: </label>
          <input
            type="number"
            value={itemCount}
            onChange={(e) => setItemCount(Math.max(1, Number(e.target.value)))}
            style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '100px'
            }}
          />
        </div>

        <div>
          <label>Filter: </label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter items..."
            style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              width: '150px'
            }}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={useVirtualization}
              onChange={(e) => setUseVirtualization(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Use Virtualization
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p>
          Showing {filteredItems.length.toLocaleString()} items
          {useVirtualization && (
            <span style={{ color: '#28a745', marginLeft: '10px' }}>
              ✓ Virtualized (only visible items rendered)
            </span>
          )}
          {!useVirtualization && filteredItems.length > 1000 && (
            <span style={{ color: '#dc3545', marginLeft: '10px' }}>
              ⚠️ All items rendered - may cause performance issues
            </span>
          )}
        </p>
      </div>

      {useVirtualization ? (
        <VirtualList
          items={filteredItems}
          itemHeight={50}
          containerHeight={400}
        />
      ) : (
        <div style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
              }}
            >
              <strong style={{ marginRight: '10px' }}>{item.name}</strong>
              <span style={{
                padding: '2px 8px',
                backgroundColor: item.category === 'A' ? '#007bff' : item.category === 'B' ? '#28a745' : '#ffc107',
                color: item.category === 'C' ? '#000' : '#fff',
                borderRadius: '12px',
                fontSize: '12px',
                marginRight: '10px'
              }}>
                {item.category}
              </span>
              <span>Value: {item.value}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '15px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4>Performance Tips:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Virtual scrolling renders only visible items</li>
          <li>Try toggling virtualization with 10,000+ items to see the difference</li>
          <li>Use React DevTools Profiler to measure performance</li>
          <li>Consider libraries like react-window for production use</li>
        </ul>
      </div>
    </div>
  );
}

export default LargeList;`
    },
    testCases: [
      'Large lists should render smoothly with virtualization',
      'Scrolling should be performant with thousands of items',
      'Filtering should work correctly with virtual scrolling',
      'Memory usage should be optimized'
    ],
    debuggingSteps: [
      'Use React DevTools Profiler to measure render time',
      'Check browser DevTools for DOM element count',
      'Test scrolling performance with large datasets',
      'Monitor memory usage in browser DevTools'
    ],
    commonMistakes: [
      'Rendering all items in large lists',
      'Not implementing virtual scrolling for performance',
      'Missing memoization for expensive calculations',
      'Not considering memory usage with large datasets'
    ],
    productionImpact: 'Poor performance, browser freezing, high memory usage, bad UX',
    preventionTips: [
      'Use virtual scrolling for lists with 100+ items',
      'Implement windowing for large datasets',
      'Consider react-window or react-virtualized libraries',
      'Monitor performance with React DevTools Profiler'
    ]
  },

  // 25. Drag and Drop Implementation Issues
  {
    id: 'react-drag-drop',
    title: 'Drag and Drop Implementation Bugs',
    description: 'Issues with drag and drop functionality and state management',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '28 min',
    xpReward: 190,
    tags: ['React', 'Drag and Drop', 'Events', 'State Management'],
    rootCause: 'Incorrect drag and drop event handling and state updates',
    category: 'User Interaction',
    files: {
      'DragDropList.jsx': `import React, { useState } from 'react';

function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' }
  ]);

  const handleDragStart = (e, item) => {
    // BUG: Not setting proper drag data!
    e.dataTransfer.setData('text', item.id);
  };

  const handleDragOver = (e) => {
    // BUG: Not preventing default behavior!
    // e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    // BUG: Not preventing default and not handling properly!
    const draggedId = e.dataTransfer.getData('text');

    // BUG: Incorrect reordering logic!
    const draggedIndex = items.findIndex(item => item.id === parseInt(draggedId));
    const targetIndex = items.findIndex(item => item.id === targetItem.id);

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setItems(newItems);
  };

  return (
    <div>
      <h2>Drag and Drop List</h2>
      {items.map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: '#f0f0f0',
            cursor: 'move'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

export default DragDropList;`
    },
    hints: [
      'Always call preventDefault() in dragOver and drop handlers',
      'Use proper data transfer format (JSON for complex data)',
      'Add visual feedback during drag operations',
      'Handle edge cases like dropping on same position'
    ],
    solution: {
      'DragDropList.jsx': `import React, { useState } from 'react';

function DragDropList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1', color: '#007bff' },
    { id: 2, text: 'Item 2', color: '#28a745' },
    { id: 3, text: 'Item 3', color: '#ffc107' },
    { id: 4, text: 'Item 4', color: '#dc3545' },
    { id: 5, text: 'Item 5', color: '#6f42c1' }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, item) => {
    // Solution: Set proper drag data and visual feedback
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(item);

    // Add drag image
    e.dataTransfer.setDragImage(e.target, e.target.offsetWidth / 2, e.target.offsetHeight / 2);
  };

  const handleDragEnd = () => {
    // Solution: Clean up drag state
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragOver = (e) => {
    // Solution: Prevent default to allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, item) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== item.id) {
      setDragOverItem(item);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the container, not child elements
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    try {
      const draggedData = JSON.parse(e.dataTransfer.getData('application/json'));

      if (!draggedData || draggedData.id === targetItem.id) {
        return; // Don't do anything if dropping on same item
      }

      const draggedIndex = items.findIndex(item => item.id === draggedData.id);
      const targetIndex = items.findIndex(item => item.id === targetItem.id);

      if (draggedIndex === -1 || targetIndex === -1) {
        return; // Invalid indices
      }

      // Solution: Proper reordering logic
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);

      setItems(newItems);
    } catch (error) {
      console.error('Error handling drop:', error);
    } finally {
      setDraggedItem(null);
      setDragOverItem(null);
    }
  };

  const resetList = () => {
    setItems([
      { id: 1, text: 'Item 1', color: '#007bff' },
      { id: 2, text: 'Item 2', color: '#28a745' },
      { id: 3, text: 'Item 3', color: '#ffc107' },
      { id: 4, text: 'Item 4', color: '#dc3545' },
      { id: 5, text: 'Item 5', color: '#6f42c1' }
    ]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Drag and Drop List</h2>
        <button
          onClick={resetList}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Order
        </button>
      </div>

      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
        💡 Drag items to reorder them. Visual feedback shows drop zones.
      </div>

      <div>
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, item)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item)}
            style={{
              padding: '15px',
              margin: '8px 0',
              backgroundColor: draggedItem?.id === item.id ? '#e9ecef' : 'white',
              border: \`2px solid \${
                dragOverItem?.id === item.id ? '#007bff' :
                draggedItem?.id === item.id ? '#6c757d' :
                item.color
              }\`,
              borderRadius: '8px',
              cursor: 'move',
              userSelect: 'none',
              transition: 'all 0.2s ease',
              opacity: draggedItem?.id === item.id ? 0.5 : 1,
              transform: dragOverItem?.id === item.id ? 'scale(1.02)' : 'scale(1)',
              boxShadow: dragOverItem?.id === item.id ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: item.color,
                  borderRadius: '50%',
                  marginRight: '12px'
                }}
              />
              <span style={{ fontWeight: '500' }}>{item.text}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px' }}>
              <span style={{ marginRight: '8px' }}>#{index + 1}</span>
              <span>⋮⋮</span>
            </div>
          </div>
        ))}
      </div>

      {draggedItem && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          Dragging: {draggedItem.text}
        </div>
      )}
    </div>
  );
}

export default DragDropList;`
    },
    testCases: [
      'Items should reorder correctly when dragged and dropped',
      'Visual feedback should show during drag operations',
      'Dropping on same item should not cause changes',
      'Drag state should be cleaned up properly'
    ],
    debuggingSteps: [
      'Check if preventDefault() is called in drag handlers',
      'Verify drag data is set and retrieved correctly',
      'Test edge cases like dropping on same position',
      'Ensure drag state is cleaned up on drag end'
    ],
    commonMistakes: [
      'Not calling preventDefault() in dragOver handler',
      'Incorrect drag data format or retrieval',
      'Missing visual feedback during drag operations',
      'Not handling edge cases and cleanup'
    ],
    productionImpact: 'Broken drag and drop functionality, poor user experience',
    preventionTips: [
      'Always prevent default in dragOver and drop handlers',
      'Use JSON for complex drag data',
      'Provide clear visual feedback during drag operations',
      'Test thoroughly with different drag scenarios'
    ]
  },

  // 26. WebSocket Connection Issues
  {
    id: 'react-websocket-connection',
    title: 'WebSocket Connection Management Issues',
    description: 'Problems with WebSocket connections, reconnection, and cleanup',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'WebSocket', 'Real-time', 'Connection Management'],
    rootCause: 'Improper WebSocket lifecycle management and missing reconnection logic',
    category: 'Real-time Communication',
    files: {
      'ChatComponent.jsx': `import React, { useState, useEffect } from 'react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // BUG: Creating new WebSocket on every render!
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected');
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]); // BUG: Potential memory leak!
    };

    ws.onclose = () => {
      console.log('Disconnected');
      setConnectionStatus('disconnected');
      // BUG: No reconnection logic!
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    setSocket(ws);

    // BUG: Missing cleanup function!
  }, []); // BUG: Empty dependency array but using state!

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      // BUG: Not checking connection state!
      socket.send(JSON.stringify({
        type: 'message',
        text: newMessage,
        timestamp: Date.now()
      }));
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>Status: {connectionStatus}</div>
      <div style={{ height: '300px', overflow: 'auto', border: '1px solid #ccc' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatComponent;`
    },
    hints: [
      'WebSocket should be created only once and properly cleaned up',
      'Implement reconnection logic for connection failures',
      'Check connection state before sending messages',
      'Limit message history to prevent memory leaks'
    ],
    solution: {
      'ChatComponent.jsx': `import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook for WebSocket management
function useWebSocket(url, options = {}) {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => {
            // Limit message history to prevent memory leaks
            const newMessages = [...prev, { ...message, id: Date.now() + Math.random() }];
            return newMessages.slice(-100); // Keep only last 100 messages
          });
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        setSocket(null);

        // Attempt reconnection if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setConnectionStatus(\`reconnecting (\${reconnectAttemptsRef.current}/\${maxReconnectAttempts})\`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionStatus('failed');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('error');
    }
  }, [url, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }
    setSocket(null);
    setConnectionStatus('disconnected');
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [socket]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  return {
    socket,
    connectionStatus,
    messages,
    sendMessage,
    connect,
    disconnect,
    clearMessages: () => setMessages([])
  };
}

function ChatComponent() {
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));

  const {
    connectionStatus,
    messages,
    sendMessage,
    connect,
    disconnect,
    clearMessages
  } = useWebSocket('ws://localhost:8080', {
    maxReconnectAttempts: 5,
    reconnectInterval: 3000
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const success = sendMessage({
        type: 'message',
        text: newMessage,
        username,
        timestamp: Date.now()
      });

      if (success) {
        setNewMessage('');
      } else {
        alert('Cannot send message. Connection is not available.');
      }
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#6c757d';
      case 'error': return '#dc3545';
      case 'failed': return '#dc3545';
      default: return '#ffc107';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>WebSocket Chat Demo</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '4px 8px',
            backgroundColor: getStatusColor(),
            color: 'white',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {connectionStatus.toUpperCase()}
          </div>
          <button
            onClick={connectionStatus === 'connected' ? disconnect : connect}
            style={{
              padding: '6px 12px',
              backgroundColor: connectionStatus === 'connected' ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          style={{
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginRight: '10px',
            width: '150px'
          }}
        />
        <button
          onClick={clearMessages}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Clear Messages
        </button>
      </div>

      <div style={{
        height: '300px',
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        marginBottom: '15px'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', paddingTop: '50px' }}>
            No messages yet. {connectionStatus !== 'connected' && 'Connect to start chatting.'}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{
              padding: '8px',
              margin: '5px 0',
              backgroundColor: 'white',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                <strong>{msg.username || 'Unknown'}</strong> - {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              <div>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          disabled={connectionStatus !== 'connected'}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            backgroundColor: connectionStatus !== 'connected' ? '#f8f9fa' : 'white'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={connectionStatus !== 'connected' || !newMessage.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: connectionStatus !== 'connected' || !newMessage.trim() ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: connectionStatus !== 'connected' || !newMessage.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          Send
        </button>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Note:</strong> This demo requires a WebSocket server running on localhost:8080.
        The component handles connection failures and implements automatic reconnection.
      </div>
    </div>
  );
}

export default ChatComponent;`
    },
    testCases: [
      'WebSocket should connect and disconnect properly',
      'Messages should be sent and received correctly',
      'Reconnection should work after connection failures',
      'Component should clean up connections on unmount'
    ],
    debuggingSteps: [
      'Check WebSocket connection state in browser DevTools',
      'Test reconnection by temporarily stopping server',
      'Verify cleanup by unmounting component',
      'Monitor memory usage with large message history'
    ],
    commonMistakes: [
      'Creating new WebSocket connections on every render',
      'Missing cleanup functions for WebSocket connections',
      'No reconnection logic for connection failures',
      'Not checking connection state before sending messages'
    ],
    productionImpact: 'Connection leaks, poor real-time experience, memory issues',
    preventionTips: [
      'Use custom hooks for WebSocket management',
      'Implement proper reconnection logic',
      'Always clean up connections in useEffect cleanup',
      'Limit message history to prevent memory leaks'
    ]
  },

  // 27-30: Adding multiple challenges at once to reach 50+
  {
    id: 'react-infinite-scroll',
    title: 'Infinite Scroll Implementation Issues',
    description: 'Problems with infinite scrolling, duplicate requests, and performance',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'Infinite Scroll', 'Performance', 'API'],
    rootCause: 'Race conditions and duplicate API calls in infinite scroll',
    category: 'Performance',
    files: {
      'InfiniteList.jsx': `import React, { useState, useEffect } from 'react';

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchItems = async (pageNum) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newItems = Array.from({ length: 20 }, (_, i) => ({
      id: (pageNum - 1) * 20 + i + 1,
      name: \`Item \${(pageNum - 1) * 20 + i + 1}\`
    }));
    setItems(prev => [...prev, ...newItems]); // BUG: Can cause duplicates!
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(page); // BUG: Can trigger multiple times!
  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop
        !== document.documentElement.offsetHeight || loading) {
      return;
    }
    setPage(prev => prev + 1); // BUG: Can trigger multiple times quickly!
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]); // BUG: Dependency on loading causes re-registration!

  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ padding: '10px', border: '1px solid #ccc' }}>
          {item.name}
        </div>
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default InfiniteList;`
    },
    hints: [
      'Use useCallback to prevent scroll handler re-registration',
      'Implement request deduplication to prevent duplicate API calls',
      'Add proper loading states and error handling',
      'Use intersection observer for better performance'
    ],
    solution: {
      'InfiniteList.jsx': `import React, { useState, useEffect, useCallback, useRef } from 'react';

function InfiniteList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);
  const observerRef = useRef(null);
  const lastItemRef = useRef(null);

  const fetchItems = useCallback(async (pageNum) => {
    if (loadingRef.current) return; // Prevent duplicate requests

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newItems = Array.from({ length: 20 }, (_, i) => ({
        id: (pageNum - 1) * 20 + i + 1,
        name: \`Item \${(pageNum - 1) * 20 + i + 1}\`
      }));

      if (newItems.length === 0 || pageNum > 10) { // Simulate end of data
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Use Intersection Observer for better performance
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, items.length]);

  useEffect(() => {
    if (page === 1) {
      fetchItems(1);
    } else if (page > 1 && hasMore) {
      fetchItems(page);
    }
  }, [page, fetchItems, hasMore]);

  const retry = () => {
    setError(null);
    fetchItems(page);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Infinite Scroll Demo</h2>
      <div>
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={index === items.length - 1 ? lastItemRef : null}
            style={{
              padding: '15px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa'
            }}
          >
            {item.name}
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>Loading more items...</div>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <div>{error}</div>
          <button onClick={retry} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Retry
          </button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No more items to load
        </div>
      )}
    </div>
  );
}

export default InfiniteList;`
    },
    testCases: [
      'Should load initial items correctly',
      'Should load more items when scrolling to bottom',
      'Should not make duplicate API requests',
      'Should handle errors gracefully'
    ],
    debuggingSteps: [
      'Check network tab for duplicate requests',
      'Test scroll behavior with slow network',
      'Verify intersection observer is working',
      'Test error handling scenarios'
    ],
    commonMistakes: [
      'Not preventing duplicate API requests',
      'Re-registering scroll handlers unnecessarily',
      'Missing error handling and retry logic',
      'Not using intersection observer for performance'
    ],
    productionImpact: 'Poor performance, duplicate requests, bad user experience',
    preventionTips: [
      'Use intersection observer instead of scroll events',
      'Implement request deduplication',
      'Add proper loading states and error handling',
      'Use useCallback to prevent unnecessary re-renders'
    ]
  },

  {
    id: 'react-modal-focus-trap',
    title: 'Modal Focus Management Issues',
    description: 'Problems with focus trapping, accessibility, and modal state management',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '22 min',
    xpReward: 150,
    tags: ['React', 'Modal', 'Accessibility', 'Focus Management'],
    rootCause: 'Missing focus trap and accessibility features in modal',
    category: 'Accessibility',
    files: {
      'Modal.jsx': `import React, { useState } from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
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
      onClick={onClose} // BUG: Closes on backdrop click without checking target!
    >
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>Modal Demo</h1>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Modal Content</h2>
        <p>This is a modal dialog.</p>
        <input type="text" placeholder="Focus should be trapped here" />
        <button>Another Button</button>
      </Modal>
    </div>
  );
}

export default App;`
    },
    hints: [
      'Implement focus trapping to keep focus within modal',
      'Add keyboard navigation (Escape key to close)',
      'Prevent backdrop clicks from bubbling',
      'Add proper ARIA attributes for accessibility'
    ],
    solution: {
      'Modal.jsx': `import React, { useState, useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children, title }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add escape key listener
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';

        // Restore focus to previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  // Focus trap implementation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          outline: 'none'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {title && (
          <h2 id="modal-title" style={{ margin: '0 0 15px 0' }}>
            {title}
          </h2>
        )}

        <div style={{ marginBottom: '20px' }}>
          {children}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Submitted: \${formData.name}, \${formData.email}\`);
    setIsModalOpen(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Accessible Modal Demo</h1>

      <p>This page has some content and a button to open a modal.</p>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Open Modal
      </button>

      <p>More content here. When modal is open, focus should be trapped inside it.</p>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contact Form"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setFormData({ name: '', email: '' })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default App;`
    },
    testCases: [
      'Focus should be trapped within modal when open',
      'Escape key should close modal',
      'Backdrop clicks should close modal',
      'Focus should return to trigger element when modal closes'
    ],
    debuggingSteps: [
      'Test keyboard navigation with Tab key',
      'Verify Escape key closes modal',
      'Check focus management with screen reader',
      'Test backdrop click behavior'
    ],
    commonMistakes: [
      'Not implementing focus trapping',
      'Missing keyboard navigation support',
      'Incorrect backdrop click handling',
      'Not restoring focus after modal closes'
    ],
    productionImpact: 'Poor accessibility, bad user experience for keyboard users',
    preventionTips: [
      'Implement proper focus trapping',
      'Add keyboard navigation support',
      'Use proper ARIA attributes',
      'Test with screen readers and keyboard-only navigation'
    ]
  },

  // 29-32: More comprehensive React challenges
  {
    id: 'react-data-fetching-race',
    title: 'Data Fetching Race Conditions',
    description: 'Race conditions in data fetching causing stale data and memory leaks',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'Data Fetching', 'Race Conditions', 'Async'],
    rootCause: 'Multiple concurrent requests and missing cleanup',
    category: 'Data Fetching',
    files: {
      'UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
        const userData = {
          id: userId,
          name: \`User \${userId}\`,
          email: \`user\${userId}@example.com\`
        };

        // BUG: No check if component is still mounted or if userId changed!
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser(); // BUG: Can cause race conditions!
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user selected</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}

function App() {
  const [selectedUserId, setSelectedUserId] = useState(1);

  return (
    <div>
      <div>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => setSelectedUserId(id)}
            style={{
              margin: '5px',
              backgroundColor: selectedUserId === id ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px'
            }}
          >
            User {id}
          </button>
        ))}
      </div>
      <UserProfile userId={selectedUserId} />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Use AbortController to cancel previous requests',
      'Check if component is still mounted before setting state',
      'Implement proper cleanup in useEffect',
      'Use a ref to track the latest request'
    ],
    solution: {
      'UserProfile.jsx': `import React, { useState, useEffect, useRef } from 'react';

// Custom hook for data fetching with race condition prevention
function useAsyncData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction(signal);

        // Only update state if component is still mounted and request wasn't aborted
        if (mountedRef.current && !signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current && !signal.aborted && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (mountedRef.current && !signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return { data, loading, error };
}

function UserProfile({ userId }) {
  const fetchUser = async (signal) => {
    // Simulate API call with random delay
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, Math.random() * 2000 + 500);

      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Request aborted'));
      });
    });

    if (signal.aborted) {
      throw new Error('Request aborted');
    }

    return {
      id: userId,
      name: \`User \${userId}\`,
      email: \`user\${userId}@example.com\`,
      bio: \`This is the bio for user \${userId}. Lorem ipsum dolor sit amet.\`,
      joinDate: new Date(2020 + userId, userId % 12, userId * 3).toLocaleDateString()
    };
  };

  const { data: user, loading, error } = useAsyncData(fetchUser, [userId]);

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <div>Loading user {userId}...</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Previous requests are automatically cancelled
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        Error loading user: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic'
      }}>
        No user selected
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      margin: '20px 0'
    }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#007bff' }}>
        {user.name}
      </h2>
      <div style={{ marginBottom: '10px' }}>
        <strong>Email:</strong> {user.email}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>User ID:</strong> {user.id}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Joined:</strong> {user.joinDate}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Bio:</strong> {user.bio}
      </div>
    </div>
  );
}

function App() {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    setRequestCount(prev => prev + 1);
  }, [selectedUserId]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Data Fetching Race Condition Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <p>Click buttons quickly to see how race conditions are handled:</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              onClick={() => setSelectedUserId(id)}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedUserId === id ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              User {id}
            </button>
          ))}
        </div>

        <div style={{
          marginTop: '10px',
          fontSize: '14px',
          color: '#666'
        }}>
          Total requests made: {requestCount}
        </div>
      </div>

      <UserProfile userId={selectedUserId} />

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4>Race Condition Prevention Features:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Previous requests are automatically cancelled using AbortController</li>
          <li>State updates are prevented if component unmounts</li>
          <li>Only the latest request's data is displayed</li>
          <li>Proper cleanup prevents memory leaks</li>
        </ul>
      </div>
    </div>
  );
}

export default App;`
    },
    testCases: [
      'Rapid user switching should not cause stale data',
      'Previous requests should be cancelled automatically',
      'Component unmounting should not cause state updates',
      'Error handling should work correctly'
    ],
    debuggingSteps: [
      'Check network tab for cancelled requests',
      'Test rapid clicking to trigger race conditions',
      'Verify cleanup when component unmounts',
      'Monitor console for any warnings or errors'
    ],
    commonMistakes: [
      'Not cancelling previous requests',
      'Setting state after component unmounts',
      'Missing cleanup in useEffect',
      'Not handling AbortError properly'
    ],
    productionImpact: 'Stale data display, memory leaks, inconsistent UI state',
    preventionTips: [
      'Use AbortController for request cancellation',
      'Check component mount status before state updates',
      'Implement proper cleanup in useEffect',
      'Use custom hooks for complex async logic'
    ]
  },

  {
    id: 'react-table-sorting-filtering',
    title: 'Table Sorting and Filtering Performance Issues',
    description: 'Performance problems with large table data sorting and filtering',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '24 min',
    xpReward: 160,
    tags: ['React', 'Table', 'Performance', 'Sorting', 'Filtering'],
    rootCause: 'Inefficient sorting and filtering causing unnecessary re-renders',
    category: 'Performance',
    files: {
      'DataTable.jsx': `import React, { useState, useMemo } from 'react';

function DataTable() {
  const [data] = useState(() => {
    // Generate large dataset
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      age: Math.floor(Math.random() * 50) + 18,
      department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
      salary: Math.floor(Math.random() * 100000) + 40000
    }));
  });

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');

  // BUG: Sorting and filtering on every render!
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.email.toLowerCase().includes(filter.toLowerCase()) ||
    item.department.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter data..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['name', 'email', 'age', 'department', 'salary'].map(field => (
              <th
                key={field}
                onClick={() => handleSort(field)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  cursor: 'pointer',
                  backgroundColor: sortField === field ? '#e9ecef' : '#f8f9fa'
                }}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr key={item.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.name}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.email}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.age}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.department}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>\${item.salary.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Showing {sortedData.length} of {data.length} records</p>
    </div>
  );
}

export default DataTable;`
    },
    hints: [
      'Use useMemo to memoize expensive sorting and filtering operations',
      'Implement debouncing for filter input',
      'Consider virtualization for large datasets',
      'Optimize comparison functions'
    ],
    solution: {
      'DataTable.jsx': `import React, { useState, useMemo, useCallback } from 'react';

// Custom hook for debounced value
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function DataTable() {
  const [data] = useState(() => {
    console.log('Generating dataset...');
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      age: Math.floor(Math.random() * 50) + 18,
      department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
      salary: Math.floor(Math.random() * 100000) + 40000
    }));
  });

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Debounce filter input to avoid excessive filtering
  const debouncedFilter = useDebounce(filter, 300);

  // Memoized filtering
  const filteredData = useMemo(() => {
    console.log('Filtering data...');
    if (!debouncedFilter) return data;

    const lowerFilter = debouncedFilter.toLowerCase();
    return data.filter(item =>
      item.name.toLowerCase().includes(lowerFilter) ||
      item.email.toLowerCase().includes(lowerFilter) ||
      item.department.toLowerCase().includes(lowerFilter)
    );
  }, [data, debouncedFilter]);

  // Memoized sorting
  const sortedData = useMemo(() => {
    console.log('Sorting data...');
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      let comparison = 0;
      if (typeof aVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = aVal - bVal;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // Memoized pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortField]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const clearFilter = useCallback(() => {
    setFilter('');
    setCurrentPage(1);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Optimized Data Table</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Filter data... (debounced)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        {filter && (
          <button
            onClick={clearFilter}
            style={{
              padding: '8px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
        <div style={{ fontSize: '14px', color: '#666' }}>
          {debouncedFilter !== filter && 'Filtering...'}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              {[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'age', label: 'Age' },
                { key: 'department', label: 'Department' },
                { key: 'salary', label: 'Salary' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    cursor: 'pointer',
                    backgroundColor: sortField === key ? '#007bff' : '#f8f9fa',
                    color: sortField === key ? 'white' : 'black',
                    userSelect: 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {label}
                  {sortField === key && (
                    <span style={{ marginLeft: '5px' }}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                }}
              >
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.age}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: item.department === 'Engineering' ? '#007bff' :
                                   item.department === 'Marketing' ? '#28a745' :
                                   item.department === 'Sales' ? '#ffc107' : '#6f42c1',
                    color: item.department === 'Sales' ? '#000' : '#fff',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {item.department}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'right' }}>
                  \${item.salary.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} records
          {filteredData.length !== data.length && \` (filtered from \${data.length})\`}
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPage === 1 ? '#e9ecef' : '#007bff',
              color: currentPage === 1 ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: currentPage === page ? '#007bff' : '#e9ecef',
                  color: currentPage === page ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPage === totalPages ? '#e9ecef' : '#007bff',
              color: currentPage === totalPages ? '#6c757d' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;`
    },
    testCases: [
      'Sorting should be fast and not cause UI freezing',
      'Filtering should be debounced to avoid excessive operations',
      'Pagination should work correctly with filtered data',
      'Large datasets should render smoothly'
    ],
    debuggingSteps: [
      'Use React DevTools Profiler to measure render performance',
      'Check console logs for unnecessary operations',
      'Test with different dataset sizes',
      'Monitor memory usage during operations'
    ],
    commonMistakes: [
      'Not memoizing expensive operations',
      'Missing debouncing for user input',
      'Sorting/filtering on every render',
      'Not implementing pagination for large datasets'
    ],
    productionImpact: 'Poor performance, UI freezing, bad user experience with large data',
    preventionTips: [
      'Use useMemo for expensive computations',
      'Implement debouncing for user input',
      'Add pagination for large datasets',
      'Profile performance with React DevTools'
    ]
  },

  // 31-35: Adding multiple challenges to reach 50+ faster
  {
    id: 'react-image-lazy-loading',
    title: 'Image Lazy Loading Implementation Issues',
    description: 'Problems with image lazy loading, intersection observer, and performance',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'Lazy Loading', 'Performance', 'Images'],
    rootCause: 'Incorrect intersection observer usage and missing cleanup',
    category: 'Performance',
    files: {
      'LazyImage.jsx': `import React, { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, placeholder }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // BUG: Not disconnecting observer after image is in view!
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    // BUG: Missing cleanup function!
  }, []); // BUG: Empty dependency array but using refs!

  return (
    <div ref={imgRef} style={{ minHeight: '200px', backgroundColor: '#f0f0f0' }}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e9ecef'
        }}>
          {placeholder || 'Loading...'}
        </div>
      )}
    </div>
  );
}

function ImageGallery() {
  const images = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: \`https://picsum.photos/400/200?random=\${i + 1}\`,
    alt: \`Image \${i + 1}\`
  }));

  return (
    <div>
      <h2>Lazy Loading Image Gallery</h2>
      {images.map(image => (
        <LazyImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          placeholder="📷"
        />
      ))}
    </div>
  );
}

export default ImageGallery;`
    },
    hints: [
      'Disconnect observer after image loads to prevent memory leaks',
      'Add proper cleanup in useEffect',
      'Handle loading and error states properly',
      'Use proper dependencies in useEffect'
    ],
    solution: {
      'LazyImage.jsx': `import React, { useState, useEffect, useRef, useCallback } from 'react';

function LazyImage({ src, alt, placeholder, className, style }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Disconnect observer after image comes into view
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    observerRef.current = observer;

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true); // Stop loading state
  }, []);

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        minHeight: '200px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '10px 0',
        ...style
      }}
    >
      {isInView ? (
        <>
          {!isLoaded && !hasError && (
            <div style={{
              width: '100%',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e9ecef',
              color: '#6c757d'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
                <div>Loading image...</div>
              </div>
            </div>
          )}

          {hasError ? (
            <div style={{
              width: '100%',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8d7da',
              color: '#721c24'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
                <div>Failed to load image</div>
              </div>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                display: isLoaded ? 'block' : 'none'
              }}
            />
          )}
        </>
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e9ecef',
          color: '#6c757d'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              {placeholder || '📷'}
            </div>
            <div>Scroll to load</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageGallery() {
  const [imageCount, setImageCount] = useState(20);
  const [loadedCount, setLoadedCount] = useState(0);

  const images = Array.from({ length: imageCount }, (_, i) => ({
    id: i + 1,
    src: \`https://picsum.photos/400/200?random=\${i + 1}\`,
    alt: \`Random image \${i + 1}\`
  }));

  const handleImageLoad = useCallback(() => {
    setLoadedCount(prev => prev + 1);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Optimized Lazy Loading Gallery</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <label>Number of images: </label>
            <input
              type="number"
              min="1"
              max="50"
              value={imageCount}
              onChange={(e) => {
                setImageCount(Number(e.target.value));
                setLoadedCount(0);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '80px'
              }}
            />
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Images loaded: {loadedCount} / {imageCount}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {images.map(image => (
          <LazyImage
            key={image.id}
            src={image.src}
            alt={image.alt}
            placeholder="🖼️"
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4>Lazy Loading Features:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Images load only when they come into view</li>
          <li>Intersection Observer automatically disconnects after loading</li>
          <li>Proper error handling for failed image loads</li>
          <li>Smooth loading transitions and placeholder states</li>
          <li>Memory efficient - no observer leaks</li>
        </ul>
      </div>
    </div>
  );
}

export default ImageGallery;`
    },
    testCases: [
      'Images should load only when scrolled into view',
      'Intersection observer should disconnect after loading',
      'Error states should be handled gracefully',
      'No memory leaks should occur'
    ],
    debuggingSteps: [
      'Check network tab to verify lazy loading behavior',
      'Test with slow network to see loading states',
      'Verify observer cleanup in React DevTools',
      'Test error handling with invalid image URLs'
    ],
    commonMistakes: [
      'Not disconnecting intersection observer after use',
      'Missing cleanup in useEffect',
      'Not handling image loading errors',
      'Incorrect dependency arrays in useEffect'
    ],
    productionImpact: 'Memory leaks, poor performance, bad user experience',
    preventionTips: [
      'Always disconnect observers when no longer needed',
      'Implement proper cleanup in useEffect',
      'Handle both loading and error states',
      'Use proper dependencies in useEffect hooks'
    ]
  },

  {
    id: 'react-search-autocomplete',
    title: 'Search Autocomplete Performance Issues',
    description: 'Problems with search autocomplete causing excessive API calls and poor UX',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'Search', 'Autocomplete', 'Debouncing', 'API'],
    rootCause: 'Missing debouncing and request cancellation in search',
    category: 'User Interaction',
    files: {
      'SearchAutocomplete.jsx': `import React, { useState, useEffect } from 'react';

function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAPI = async (searchTerm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    const mockData = [
      'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
      'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'
    ];

    return mockData.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    const performSearch = async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const searchResults = await searchAPI(query); // BUG: No debouncing!
          setResults(searchResults); // BUG: Can set stale results!
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    performSearch(); // BUG: Calls API on every keystroke!
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search fruits..."
        style={{ width: '300px', padding: '8px' }}
      />

      {loading && <div>Searching...</div>}

      {results.length > 0 && (
        <ul style={{
          border: '1px solid #ccc',
          maxHeight: '200px',
          overflow: 'auto',
          listStyle: 'none',
          padding: 0,
          margin: '5px 0'
        }}>
          {results.map((result, index) => (
            <li
              key={index}
              style={{
                padding: '8px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer'
              }}
              onClick={() => {
                setQuery(result);
                setResults([]);
              }}
            >
              {result}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchAutocomplete;`
    },
    hints: [
      'Implement debouncing to reduce API calls',
      'Use AbortController to cancel previous requests',
      'Add keyboard navigation for better UX',
      'Handle edge cases like empty queries'
    ],
    solution: {
      'SearchAutocomplete.jsx': `import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const abortControllerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Debounce the query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  const searchAPI = async (searchTerm, signal) => {
    // Simulate API call with abort support
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, Math.random() * 1000 + 200);

      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Request aborted'));
      });
    });

    if (signal.aborted) {
      throw new Error('Request aborted');
    }

    const mockData = [
      'Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Cranberry',
      'Date', 'Elderberry', 'Fig', 'Grape', 'Grapefruit', 'Honeydew',
      'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Papaya', 'Peach',
      'Pear', 'Pineapple', 'Plum', 'Raspberry', 'Strawberry', 'Watermelon'
    ];

    return mockData.filter(item =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 8); // Limit results
  };

  useEffect(() => {
    const performSearch = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (debouncedQuery.length === 0) {
        setResults([]);
        setShowResults(false);
        setLoading(false);
        return;
      }

      if (debouncedQuery.length < 2) {
        return; // Don't search for very short queries
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setLoading(true);
      setSelectedIndex(-1);

      try {
        const searchResults = await searchAPI(debouncedQuery, signal);

        if (!signal.aborted) {
          setResults(searchResults);
          setShowResults(true);
        }
      } catch (error) {
        if (error.message !== 'Request aborted') {
          console.error('Search failed:', error);
          setResults([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const handleKeyDown = useCallback((e) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showResults, results, selectedIndex]);

  const selectResult = useCallback((result) => {
    setQuery(result);
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    if (e.target.value.length === 0) {
      setShowResults(false);
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    if (results.length > 0 && query.length >= 2) {
      setShowResults(true);
    }
  }, [results.length, query.length]);

  const handleInputBlur = useCallback(() => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowResults(false);
      setSelectedIndex(-1);
    }, 150);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Smart Search Autocomplete</h2>

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search fruits... (min 2 characters)"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '2px solid #ddd',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#007bff';
            handleInputFocus();
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ddd';
            handleInputBlur();
          }}
        />

        {loading && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666'
          }}>
            ⏳
          </div>
        )}

        {showResults && results.length > 0 && (
          <ul
            ref={resultsRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '2px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              maxHeight: '200px',
              overflow: 'auto',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {results.map((result, index) => (
              <li
                key={result}
                style={{
                  padding: '12px',
                  borderBottom: index < results.length - 1 ? '1px solid #eee' : 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedIndex === index ? '#007bff' : 'transparent',
                  color: selectedIndex === index ? 'white' : 'black',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur
                onClick={() => selectResult(result)}
              >
                <span style={{ fontWeight: selectedIndex === index ? 'bold' : 'normal' }}>
                  {result}
                </span>
              </li>
            ))}
          </ul>
        )}

        {showResults && results.length === 0 && !loading && debouncedQuery.length >= 2 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '2px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '12px',
            color: '#666',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            No results found for "{debouncedQuery}"
          </div>
        )}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Features:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Debounced search (300ms delay)</li>
          <li>Request cancellation prevents stale results</li>
          <li>Keyboard navigation (↑↓ arrows, Enter, Escape)</li>
          <li>Minimum 2 characters required</li>
          <li>Smart focus/blur handling</li>
        </ul>
      </div>
    </div>
  );
}

export default SearchAutocomplete;`
    },
    testCases: [
      'Search should be debounced to reduce API calls',
      'Previous requests should be cancelled',
      'Keyboard navigation should work properly',
      'Results should update correctly without stale data'
    ],
    debuggingSteps: [
      'Check network tab for debounced requests',
      'Test rapid typing to verify request cancellation',
      'Test keyboard navigation with arrow keys',
      'Verify no stale results appear'
    ],
    commonMistakes: [
      'Not debouncing search input',
      'Missing request cancellation',
      'Poor keyboard navigation UX',
      'Not handling edge cases like empty queries'
    ],
    productionImpact: 'Excessive API calls, poor performance, bad user experience',
    preventionTips: [
      'Always debounce user input for search',
      'Implement request cancellation with AbortController',
      'Add keyboard navigation for accessibility',
      'Handle edge cases and loading states properly'
    ]
  },

  // 33-37: Adding more challenges to reach 50+
  {
    id: 'react-animation-performance',
    title: 'Animation Performance Issues',
    description: 'Problems with React animations causing janky performance and layout thrashing',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '22 min',
    xpReward: 160,
    tags: ['React', 'Animation', 'Performance', 'CSS'],
    rootCause: 'Inefficient animations causing layout thrashing and poor performance',
    category: 'Performance',
    files: {
      'AnimatedList.jsx': `import React, { useState } from 'react';

function AnimatedList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' }
  ]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      text: \`Item \${items.length + 1}\`
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <button onClick={addItem}>Add Item</button>

      <div>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f0f0f0',
              // BUG: Using width/height animations cause layout thrashing!
              transition: 'all 0.3s ease',
              // BUG: Animating layout properties!
              transform: 'scale(1)',
              width: '200px',
              height: '50px'
            }}
            onMouseEnter={(e) => {
              // BUG: Directly manipulating style causes reflow!
              e.target.style.width = '220px';
              e.target.style.height = '60px';
              e.target.style.backgroundColor = '#007bff';
            }}
            onMouseLeave={(e) => {
              e.target.style.width = '200px';
              e.target.style.height = '50px';
              e.target.style.backgroundColor = '#f0f0f0';
            }}
          >
            {item.text}
            <button
              onClick={() => removeItem(item.id)}
              style={{ float: 'right' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimatedList;`
    },
    hints: [
      'Use transform and opacity for animations instead of layout properties',
      'Avoid direct style manipulation in event handlers',
      'Use CSS classes with transitions for better performance',
      'Consider using will-change property for complex animations'
    ],
    solution: {
      'AnimatedList.jsx': `import React, { useState, useCallback } from 'react';
import './AnimatedList.css'; // CSS file for animations

function AnimatedList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' }
  ]);
  const [hoveredItem, setHoveredItem] = useState(null);

  const addItem = useCallback(() => {
    const newItem = {
      id: Date.now(),
      text: \`Item \${items.length + 1}\`
    };
    setItems(prev => [...prev, newItem]);
  }, [items.length]);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleMouseEnter = useCallback((id) => {
    setHoveredItem(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Optimized Animated List</h2>

      <button
        onClick={addItem}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'transform 0.1s ease'
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Add Item
      </button>

      <div className="animated-list">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={\`list-item \${hoveredItem === item.id ? 'hovered' : ''}\`}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
            style={{
              // Use CSS custom properties for dynamic values
              '--item-index': index,
              animationDelay: \`\${index * 0.1}s\`
            }}
          >
            <span className="item-text">{item.text}</span>
            <button
              className="remove-button"
              onClick={() => removeItem(item.id)}
              aria-label={\`Remove \${item.text}\`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <p>No items yet. Click "Add Item" to get started!</p>
        </div>
      )}

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Performance Optimizations:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Using transform and opacity instead of layout properties</li>
          <li>CSS classes for animations instead of inline styles</li>
          <li>GPU-accelerated animations with transform3d</li>
          <li>Proper use of will-change property</li>
          <li>Avoiding direct DOM manipulation in event handlers</li>
        </ul>
      </div>

      <style jsx>{\`
        .animated-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          /* Performance optimizations */
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0); /* Force GPU acceleration */
          transition:
            transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.2s ease,
            box-shadow 0.2s ease;

          /* Entry animation */
          animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .list-item.hovered {
          transform: translate3d(0, -2px, 0) scale(1.02);
          border-color: #007bff;
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15);
        }

        .list-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .list-item.hovered::before {
          left: 100%;
        }

        .item-text {
          font-weight: 500;
          color: #495057;
          transition: color 0.2s ease;
        }

        .list-item.hovered .item-text {
          color: #007bff;
        }

        .remove-button {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition:
            transform 0.2s ease,
            background-color 0.2s ease;
          will-change: transform;
        }

        .remove-button:hover {
          background: #c82333;
          transform: scale(1.1);
        }

        .remove-button:active {
          transform: scale(0.95);
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6c757d;
          font-style: italic;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .list-item {
            padding: 12px;
          }

          .item-text {
            font-size: 14px;
          }
        }
      \`}</style>
    </div>
  );
}

export default AnimatedList;`
    },
    testCases: [
      'Animations should be smooth and not cause layout thrashing',
      'Hover effects should use GPU-accelerated properties',
      'Adding/removing items should have smooth transitions',
      'Performance should be good with many items'
    ],
    debuggingSteps: [
      'Use browser DevTools Performance tab to check for layout thrashing',
      'Monitor FPS during animations',
      'Check for unnecessary repaints in DevTools',
      'Test with many items to verify performance'
    ],
    commonMistakes: [
      'Animating layout properties like width/height',
      'Direct style manipulation in event handlers',
      'Not using GPU acceleration for animations',
      'Missing will-change property for complex animations'
    ],
    productionImpact: 'Janky animations, poor performance, bad user experience',
    preventionTips: [
      'Use transform and opacity for animations',
      'Leverage CSS classes instead of inline styles',
      'Use will-change property for complex animations',
      'Test performance with browser DevTools'
    ]
  },

  {
    id: 'react-file-upload-progress',
    title: 'File Upload Progress Issues',
    description: 'Problems with file upload progress tracking and error handling',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'File Upload', 'Progress', 'Error Handling'],
    rootCause: 'Missing progress tracking and proper error handling in file uploads',
    category: 'User Interaction',
    files: {
      'FileUpload.jsx': `import React, { useState } from 'react';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // BUG: No progress tracking!
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        setSelectedFile(null);
      } else {
        alert('Upload failed!'); // BUG: Poor error handling!
      }
    } catch (error) {
      alert('Upload error!'); // BUG: Generic error message!
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {selectedFile && (
        <div>
          <p>Selected: {selectedFile.name}</p>
          <p>Size: {selectedFile.size} bytes</p>
        </div>
      )}

      <button
        onClick={uploadFile}
        disabled={!selectedFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default FileUpload;`
    },
    hints: [
      'Use XMLHttpRequest for progress tracking instead of fetch',
      'Implement proper error handling with specific error messages',
      'Add file validation (size, type) before upload',
      'Show upload progress with a progress bar'
    ],
    solution: {
      'FileUpload.jsx': `import React, { useState, useCallback, useRef } from 'react';

function FileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const abortControllersRef = useRef({});

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload images, PDF, or text files.';
    }

    return null;
  };

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const errors = {};

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors[file.name] = error;
      } else {
        validFiles.push({
          file,
          id: \`\${file.name}-\${Date.now()}\`,
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Set initial status for new files
    const newStatus = {};
    validFiles.forEach(fileObj => {
      newStatus[fileObj.id] = { status: 'ready', error: null };
    });

    // Add errors for invalid files
    Object.entries(errors).forEach(([fileName, error]) => {
      const errorId = \`error-\${fileName}-\${Date.now()}\`;
      newStatus[errorId] = { status: 'error', error, fileName };
    });

    setUploadStatus(prev => ({ ...prev, ...newStatus }));
  }, []);

  const uploadFile = useCallback((fileObj) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', fileObj.file);

      // Store abort controller
      abortControllersRef.current[fileObj.id] = xhr;

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: progress
          }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadStatus(prev => ({
            ...prev,
            [fileObj.id]: { status: 'success', error: null }
          }));
          resolve(xhr.response);
        } else {
          const error = \`Upload failed with status \${xhr.status}\`;
          setUploadStatus(prev => ({
            ...prev,
            [fileObj.id]: { status: 'error', error }
          }));
          reject(new Error(error));
        }
      });

      xhr.addEventListener('error', () => {
        const error = 'Network error occurred during upload';
        setUploadStatus(prev => ({
          ...prev,
          [fileObj.id]: { status: 'error', error }
        }));
        reject(new Error(error));
      });

      xhr.addEventListener('abort', () => {
        setUploadStatus(prev => ({
          ...prev,
          [fileObj.id]: { status: 'cancelled', error: null }
        }));
        reject(new Error('Upload cancelled'));
      });

      setUploadStatus(prev => ({
        ...prev,
        [fileObj.id]: { status: 'uploading', error: null }
      }));

      // Simulate upload endpoint
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }, []);

  const handleUpload = useCallback(async (fileObj) => {
    try {
      await uploadFile(fileObj);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      delete abortControllersRef.current[fileObj.id];
    }
  }, [uploadFile]);

  const handleUploadAll = useCallback(async () => {
    const readyFiles = selectedFiles.filter(fileObj =>
      uploadStatus[fileObj.id]?.status === 'ready'
    );

    const uploadPromises = readyFiles.map(fileObj => handleUpload(fileObj));

    try {
      await Promise.allSettled(uploadPromises);
    } catch (error) {
      console.error('Batch upload error:', error);
    }
  }, [selectedFiles, uploadStatus, handleUpload]);

  const cancelUpload = useCallback((fileId) => {
    if (abortControllersRef.current[fileId]) {
      abortControllersRef.current[fileId].abort();
    }
  }, []);

  const removeFile = useCallback((fileId) => {
    setSelectedFiles(prev => prev.filter(fileObj => fileObj.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileId];
      return newStatus;
    });

    // Cancel upload if in progress
    if (abortControllersRef.current[fileId]) {
      abortControllersRef.current[fileId].abort();
      delete abortControllersRef.current[fileId];
    }
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return '#6c757d';
      case 'uploading': return '#007bff';
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'cancelled': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const readyFilesCount = selectedFiles.filter(fileObj =>
    uploadStatus[fileObj.id]?.status === 'ready'
  ).length;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Advanced File Upload</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept="image/*,.pdf,.txt"
          style={{
            padding: '10px',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer'
          }}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Supported: Images, PDF, Text files (max 10MB each)
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Selected Files ({selectedFiles.length})</h3>
            {readyFilesCount > 0 && (
              <button
                onClick={handleUploadAll}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Upload All ({readyFilesCount})
              </button>
            )}
          </div>

          {selectedFiles.map(fileObj => {
            const status = uploadStatus[fileObj.id]?.status || 'ready';
            const error = uploadStatus[fileObj.id]?.error;
            const progress = uploadProgress[fileObj.id] || 0;

            return (
              <div
                key={fileObj.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{fileObj.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {formatFileSize(fileObj.size)} • {fileObj.type}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        backgroundColor: getStatusColor(status),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {status.toUpperCase()}
                    </span>

                    {status === 'ready' && (
                      <button
                        onClick={() => handleUpload(fileObj)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Upload
                      </button>
                    )}

                    {status === 'uploading' && (
                      <button
                        onClick={() => cancelUpload(fileObj.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(fileObj.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {status === 'uploading' && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px' }}>Uploading...</span>
                      <span style={{ fontSize: '12px' }}>{progress}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e9ecef',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          width: \`\${progress}%\`,
                          height: '100%',
                          backgroundColor: '#007bff',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    Error: {error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Show validation errors */}
      {Object.entries(uploadStatus).some(([_, status]) => status.status === 'error' && status.fileName) && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4>File Validation Errors:</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {Object.entries(uploadStatus)
              .filter(([_, status]) => status.status === 'error' && status.fileName)
              .map(([id, status]) => (
                <li key={id}>{status.fileName}: {status.error}</li>
              ))}
          </ul>
        </div>
      )}

      <div style={{
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Features:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Real-time upload progress tracking</li>
          <li>File validation (size, type)</li>
          <li>Individual and batch upload options</li>
          <li>Upload cancellation support</li>
          <li>Detailed error handling and reporting</li>
        </ul>
      </div>
    </div>
  );
}

export default FileUpload;`
    },
    testCases: [
      'Upload progress should be tracked and displayed accurately',
      'File validation should work for size and type restrictions',
      'Upload cancellation should work properly',
      'Error handling should provide specific error messages'
    ],
    debuggingSteps: [
      'Test with different file sizes to verify progress tracking',
      'Try uploading invalid file types to test validation',
      'Test upload cancellation functionality',
      'Verify error handling with network issues'
    ],
    commonMistakes: [
      'Using fetch API without progress tracking',
      'Generic error messages without specific details',
      'Missing file validation before upload',
      'Not providing upload cancellation functionality'
    ],
    productionImpact: 'Poor user experience, no progress feedback, unclear error messages',
    preventionTips: [
      'Use XMLHttpRequest for progress tracking',
      'Implement comprehensive file validation',
      'Provide specific error messages and recovery options',
      'Add upload cancellation and retry functionality'
    ]
  },

  // 35-40: Adding more challenges to reach 50+
  {
    id: 'react-theme-context-performance',
    title: 'Theme Context Performance Issues',
    description: 'Performance problems with theme context causing unnecessary re-renders',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'Context', 'Theme', 'Performance'],
    rootCause: 'Theme context causing all consumers to re-render on any change',
    category: 'Performance',
    files: {
      'ThemeProvider.jsx': `import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);
  const [primaryColor, setPrimaryColor] = useState('#007bff');

  // BUG: Creating new object on every render!
  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    primaryColor,
    setPrimaryColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

function Header() {
  const { theme, primaryColor } = useTheme();
  console.log('Header rendered'); // BUG: Renders on every theme change!

  return (
    <header style={{
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      padding: '20px'
    }}>
      <h1 style={{ color: primaryColor }}>My App</h1>
    </header>
  );
}

function Sidebar() {
  const { fontSize } = useTheme();
  console.log('Sidebar rendered'); // BUG: Renders when theme/color changes!

  return (
    <aside style={{
      padding: '20px',
      fontSize: \`\${fontSize}px\`
    }}>
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </aside>
  );
}

function ThemeControls() {
  const { theme, setTheme, fontSize, setFontSize, primaryColor, setPrimaryColor } = useTheme();

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <input
        type="range"
        min="12"
        max="24"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
      <input
        type="color"
        value={primaryColor}
        onChange={(e) => setPrimaryColor(e.target.value)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Sidebar />
      <ThemeControls />
    </ThemeProvider>
  );
}

export default App;`
    },
    hints: [
      'Split context into multiple contexts for different concerns',
      'Use useMemo to prevent object recreation on every render',
      'Create separate contexts for theme, typography, and colors',
      'Use React.memo to prevent unnecessary re-renders'
    ],
    solution: {
      'ThemeProvider.jsx': `import React, { createContext, useContext, useState, useMemo, memo } from 'react';

// Split contexts for better performance
const ThemeContext = createContext();
const TypographyContext = createContext();
const ColorContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Memoize theme context value
  const themeValue = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function TypographyProvider({ children }) {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');

  // Memoize typography context value
  const typographyValue = useMemo(() => ({
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily
  }), [fontSize, fontFamily]);

  return (
    <TypographyContext.Provider value={typographyValue}>
      {children}
    </TypographyContext.Provider>
  );
}

export function ColorProvider({ children }) {
  const [primaryColor, setPrimaryColor] = useState('#007bff');
  const [secondaryColor, setSecondaryColor] = useState('#6c757d');

  // Memoize color context value
  const colorValue = useMemo(() => ({
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor
  }), [primaryColor, secondaryColor]);

  return (
    <ColorContext.Provider value={colorValue}>
      {children}
    </ColorContext.Provider>
  );
}

// Custom hooks for each context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useTypography() {
  const context = useContext(TypographyContext);
  if (!context) {
    throw new Error('useTypography must be used within a TypographyProvider');
  }
  return context;
}

export function useColors() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
}

// Memoized components to prevent unnecessary re-renders
const Header = memo(function Header() {
  const { theme } = useTheme();
  const { primaryColor } = useColors();

  console.log('Header rendered');

  const headerStyles = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#333',
    padding: '20px',
    borderBottom: \`2px solid \${primaryColor}\`,
    transition: 'all 0.3s ease'
  }), [theme, primaryColor]);

  const titleStyles = useMemo(() => ({
    color: primaryColor,
    margin: 0,
    transition: 'color 0.3s ease'
  }), [primaryColor]);

  return (
    <header style={headerStyles}>
      <h1 style={titleStyles}>Optimized Theme App</h1>
    </header>
  );
});

const Sidebar = memo(function Sidebar() {
  const { theme } = useTheme();
  const { fontSize, fontFamily } = useTypography();

  console.log('Sidebar rendered');

  const sidebarStyles = useMemo(() => ({
    padding: '20px',
    fontSize: \`\${fontSize}px\`,
    fontFamily,
    backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f8f9fa',
    color: theme === 'dark' ? '#fff' : '#333',
    minHeight: '300px',
    transition: 'all 0.3s ease'
  }), [theme, fontSize, fontFamily]);

  return (
    <aside style={sidebarStyles}>
      <nav>
        <h3>Navigation</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0' }}>🏠 Home</li>
          <li style={{ padding: '8px 0' }}>ℹ️ About</li>
          <li style={{ padding: '8px 0' }}>📞 Contact</li>
          <li style={{ padding: '8px 0' }}>⚙️ Settings</li>
        </ul>
      </nav>
    </aside>
  );
});

function App() {
  return (
    <ThemeProvider>
      <TypographyProvider>
        <ColorProvider>
          <div style={{ minHeight: '100vh' }}>
            <Header />
            <div style={{ display: 'flex' }}>
              <Sidebar />
            </div>
          </div>
        </ColorProvider>
      </TypographyProvider>
    </ThemeProvider>
  );
}

export default App;`
    },
    testCases: [
      'Components should only re-render when their specific dependencies change',
      'Theme changes should not cause typography-only components to re-render',
      'Context values should be properly memoized',
      'All theme features should work correctly'
    ],
    debuggingSteps: [
      'Check console logs to verify selective re-rendering',
      'Use React DevTools Profiler to measure performance',
      'Test each control to see which components re-render',
      'Verify context values are memoized properly'
    ],
    commonMistakes: [
      'Creating new objects in context value on every render',
      'Using single context for unrelated concerns',
      'Not memoizing context values',
      'Missing React.memo for components'
    ],
    productionImpact: 'Unnecessary re-renders, poor performance, sluggish UI',
    preventionTips: [
      'Split contexts by concern for better performance',
      'Use useMemo for context values',
      'Wrap components with React.memo when appropriate',
      'Monitor re-renders with React DevTools'
    ]
  },

  // 36-40: Adding more challenges to reach 50+
  {
    id: 'react-data-table-virtualization',
    title: 'Data Table Virtualization Issues',
    description: 'Performance problems with large data tables and missing virtualization',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'Virtualization', 'Performance', 'Tables'],
    rootCause: 'Rendering all table rows at once causing performance issues',
    category: 'Performance',
    files: {
      'DataTable.jsx': `import React, { useState, useMemo } from 'react';

function DataTable() {
  // Generate large dataset
  const data = useMemo(() => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      age: Math.floor(Math.random() * 50) + 18,
      city: ['New York', 'London', 'Tokyo', 'Paris', 'Berlin'][Math.floor(Math.random() * 5)],
      salary: Math.floor(Math.random() * 100000) + 30000
    }));
  }, []);

  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    if (filter) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.email.toLowerCase().includes(filter.toLowerCase()) ||
        item.city.toLowerCase().includes(filter.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

    return result;
  }, [data, filter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by name, email, or city..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      <div style={{ height: '600px', overflow: 'auto', border: '1px solid #ccc' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
            <tr>
              <th onClick={() => handleSort('id')} style={{ padding: '10px', cursor: 'pointer' }}>
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('name')} style={{ padding: '10px', cursor: 'pointer' }}>
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} style={{ padding: '10px', cursor: 'pointer' }}>
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('age')} style={{ padding: '10px', cursor: 'pointer' }}>
                Age {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('city')} style={{ padding: '10px', cursor: 'pointer' }}>
                City {sortField === 'city' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('salary')} style={{ padding: '10px', cursor: 'pointer' }}>
                Salary {sortField === 'salary' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* BUG: Rendering all 10,000 rows at once! */}
            {filteredAndSortedData.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.id}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.name}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.email}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.age}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.city}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  \${item.salary.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '10px' }}>
        Showing {filteredAndSortedData.length} of {data.length} records
      </div>
    </div>
  );
}

export default DataTable;`
    },
    hints: [
      'Implement virtual scrolling to render only visible rows',
      'Use intersection observer or scroll position to determine visible items',
      'Calculate row heights and container dimensions',
      'Implement proper scroll handling and positioning'
    ],
    solution: {
      'DataTable.jsx': `import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// Custom hook for virtual scrolling
function useVirtualScroll({
  items,
  containerHeight,
  itemHeight,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, containerHeight, itemHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

function VirtualizedDataTable() {
  // Generate large dataset
  const data = useMemo(() => {
    return Array.from({ length: 50000 }, (_, i) => ({
      id: i + 1,
      name: \`User \${i + 1}\`,
      email: \`user\${i + 1}@example.com\`,
      age: Math.floor(Math.random() * 50) + 18,
      city: ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Mumbai'][Math.floor(Math.random() * 8)],
      salary: Math.floor(Math.random() * 150000) + 30000,
      department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][Math.floor(Math.random() * 5)]
    }));
  }, []);

  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  const containerRef = useRef(null);
  const containerHeight = 500;
  const itemHeight = 50;

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (filter) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = aVal.toString().toLowerCase();
      const bStr = bVal.toString().toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return result;
  }, [data, filter, sortField, sortDirection]);

  const {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  } = useVirtualScroll({
    items: filteredAndSortedData,
    containerHeight,
    itemHeight
  });

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, [setScrollTop]);

  const handleRowSelect = useCallback((id, isSelected) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === filteredAndSortedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredAndSortedData.map(item => item.id)));
    }
  }, [selectedRows.size, filteredAndSortedData]);

  const getSortIcon = useCallback((field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  }, [sortField, sortDirection]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Virtualized Data Table (50,000 rows)</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search across all fields..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />

        <div style={{ fontSize: '14px', color: '#666' }}>
          Showing {filteredAndSortedData.length.toLocaleString()} of {data.length.toLocaleString()} records
        </div>

        {selectedRows.size > 0 && (
          <div style={{ fontSize: '14px', color: '#007bff' }}>
            {selectedRows.size} selected
          </div>
        )}
      </div>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 80px 150px 200px 80px 120px 100px 120px',
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #dee2e6',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            padding: '12px 8px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <input
              type="checkbox"
              checked={selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
              onChange={handleSelectAll}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {[
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'email', label: 'Email' },
            { field: 'age', label: 'Age' },
            { field: 'city', label: 'City' },
            { field: 'department', label: 'Department' },
            { field: 'salary', label: 'Salary' }
          ].map(({ field, label }) => (
            <div
              key={field}
              onClick={() => handleSort(field)}
              style={{
                padding: '12px 8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                userSelect: 'none',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {label} <span style={{ fontSize: '12px' }}>{getSortIcon(field)}</span>
            </div>
          ))}
        </div>

        {/* Virtualized Content */}
        <div
          ref={containerRef}
          style={{
            height: containerHeight,
            overflow: 'auto',
            position: 'relative'
          }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div
              style={{
                transform: \`translateY(\${offsetY}px)\`,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
              }}
            >
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 80px 150px 200px 80px 120px 100px 120px',
                    height: itemHeight,
                    borderBottom: '1px solid #eee',
                    backgroundColor: selectedRows.has(item.id) ? '#e3f2fd' :
                                   item.index % 2 === 0 ? '#fff' : '#f8f9fa',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedRows.has(item.id)) {
                      e.target.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedRows.has(item.id)) {
                      e.target.style.backgroundColor = item.index % 2 === 0 ? '#fff' : '#f8f9fa';
                    }
                  }}
                >
                  <div style={{
                    padding: '12px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.id)}
                      onChange={(e) => handleRowSelect(item.id, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                    {item.id}
                  </div>
                  <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                    {item.name}
                  </div>
                  <div style={{
                    padding: '12px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    {item.email}
                  </div>
                  <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                    {item.age}
                  </div>
                  <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                    {item.city}
                  </div>
                  <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                    {item.department}
                  </div>
                  <div style={{
                    padding: '12px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    color: '#28a745'
                  }}>
                    \${item.salary.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Virtualization Benefits:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Only renders visible rows (~10-15 DOM elements instead of 50,000)</li>
          <li>Smooth scrolling performance with large datasets</li>
          <li>Memory efficient - constant memory usage regardless of data size</li>
          <li>Maintains full functionality: sorting, filtering, selection</li>
          <li>Responsive design with proper scroll behavior</li>
        </ul>
      </div>
    </div>
  );
}

export default VirtualizedDataTable;`
    },
    testCases: [
      'Table should render smoothly with 50,000+ rows',
      'Only visible rows should be in the DOM',
      'Scrolling should be smooth and responsive',
      'Sorting and filtering should work correctly with virtualization'
    ],
    debuggingSteps: [
      'Check DOM to verify only visible rows are rendered',
      'Test scrolling performance with large datasets',
      'Verify sorting and filtering work with virtualization',
      'Monitor memory usage during scrolling'
    ],
    commonMistakes: [
      'Rendering all rows at once without virtualization',
      'Not calculating visible range correctly',
      'Missing proper scroll handling',
      'Not maintaining scroll position during data changes'
    ],
    productionImpact: 'Poor performance, browser freezing, high memory usage',
    preventionTips: [
      'Implement virtual scrolling for large datasets',
      'Calculate visible items based on scroll position',
      'Use proper container heights and item positioning',
      'Test performance with realistic data sizes'
    ]
  },

  // 37-42: Adding more challenges to reach 50+
  {
    id: 'react-real-time-chat',
    title: 'Real-time Chat Implementation Issues',
    description: 'Problems with WebSocket connections, message ordering, and state management in chat',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'WebSocket', 'Real-time', 'Chat'],
    rootCause: 'Poor WebSocket handling and message state management',
    category: 'Real-time Communication',
    files: {
      'ChatApp.jsx': `import React, { useState, useEffect, useRef } from 'react';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [username] = useState(\`User\${Math.floor(Math.random() * 1000)}\`);

  const ws = useRef(null);

  useEffect(() => {
    // BUG: Creating new WebSocket on every render!
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // BUG: Not handling message ordering!
      setMessages(prev => [...prev, message]);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    // BUG: Missing cleanup!
  }, []); // BUG: Empty dependency array but using refs!

  const sendMessage = () => {
    if (newMessage.trim() && ws.current && isConnected) {
      const message = {
        id: Date.now(), // BUG: Not unique enough!
        text: newMessage,
        username,
        timestamp: new Date().toISOString()
      };

      // BUG: Not handling send failures!
      ws.current.send(JSON.stringify(message));
      setNewMessage('');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        height: '400px',
        border: '1px solid #ccc',
        overflow: 'auto',
        padding: '10px',
        marginBottom: '10px'
      }}>
        {messages.map(message => (
          <div key={message.id} style={{ marginBottom: '10px' }}>
            <strong>{message.username}:</strong> {message.text}
            <small style={{ color: '#666', marginLeft: '10px' }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected}
          style={{ padding: '8px 16px' }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
}

export default ChatApp;`
    },
    hints: [
      'Move WebSocket creation outside of useEffect or use proper cleanup',
      'Implement message deduplication and ordering',
      'Add reconnection logic for dropped connections',
      'Handle WebSocket errors and connection states properly'
    ],
    solution: {
      'ChatApp.jsx': `import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Custom hook for WebSocket management
function useWebSocket(url, options = {}) {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messageHistory, setMessageHistory] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setConnectionStatus('Connected');
        reconnectAttemptsRef.current = 0;
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setLastMessage(message);
        setMessageHistory(prev => [...prev, message]);
      };

      ws.onclose = (event) => {
        setConnectionStatus('Disconnected');
        console.log('WebSocket disconnected:', event.code, event.reason);

        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setConnectionStatus(\`Reconnecting... (attempt \${reconnectAttemptsRef.current})\`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('Error');
    }
  }, [url, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [socket]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  return {
    socket,
    connectionStatus,
    messageHistory,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
}

function ChatApp() {
  const [newMessage, setNewMessage] = useState('');
  const [username] = useState(\`User\${Math.floor(Math.random() * 1000)}\`);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageIdRef = useRef(0);

  // Use custom WebSocket hook
  const {
    connectionStatus,
    messageHistory,
    lastMessage,
    sendMessage: sendWebSocketMessage
  } = useWebSocket('ws://localhost:8080', {
    maxReconnectAttempts: 5,
    reconnectInterval: 3000
  });

  // Deduplicate and sort messages
  const messages = useMemo(() => {
    const messageMap = new Map();

    messageHistory.forEach(msg => {
      if (msg.type === 'message') {
        messageMap.set(msg.id, msg);
      } else if (msg.type === 'typing') {
        // Handle typing indicators
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (msg.isTyping && msg.username !== username) {
            newSet.add(msg.username);
          } else {
            newSet.delete(msg.username);
          }
          return newSet;
        });
      }
    });

    return Array.from(messageMap.values())
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [messageHistory, username]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return \`\${username}-\${Date.now()}-\${++messageIdRef.current}\`;
  }, [username]);

  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const message = {
        id: generateMessageId(),
        type: 'message',
        text: newMessage.trim(),
        username,
        timestamp: new Date().toISOString()
      };

      const success = sendWebSocketMessage(message);

      if (success) {
        setNewMessage('');
        // Stop typing indicator
        if (isTyping) {
          setIsTyping(false);
          sendWebSocketMessage({
            type: 'typing',
            username,
            isTyping: false
          });
        }
      } else {
        alert('Failed to send message. Please check your connection.');
      }
    }
  }, [newMessage, username, generateMessageId, sendWebSocketMessage, isTyping]);

  const handleInputChange = useCallback((e) => {
    setNewMessage(e.target.value);

    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      sendWebSocketMessage({
        type: 'typing',
        username,
        isTyping: true
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendWebSocketMessage({
        type: 'typing',
        username,
        isTyping: false
      });
    }, 2000);
  }, [isTyping, username, sendWebSocketMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected': return '#28a745';
      case 'Disconnected': return '#dc3545';
      case 'Error': return '#dc3545';
      default: return '#ffc107';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return \`\${diffMins}m ago\`;
    if (diffMins < 1440) return \`\${Math.floor(diffMins / 60)}h ago\`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px 8px 0 0',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Real-time Chat</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px'
        }}>
          <span>Connected as: <strong>{username}</strong></span>
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: getConnectionStatusColor(),
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {connectionStatus}
          </div>
        </div>
      </div>

      <div style={{
        height: '500px',
        border: '1px solid #dee2e6',
        borderTop: 'none',
        overflow: 'auto',
        padding: '15px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6c757d',
            fontStyle: 'italic'
          }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: message.username === username ? '#e3f2fd' : '#f8f9fa',
                alignSelf: message.username === username ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                wordWrap: 'break-word'
              }}
            >
              <div style={{
                fontWeight: 'bold',
                color: message.username === username ? '#1976d2' : '#495057',
                marginBottom: '4px'
              }}>
                {message.username === username ? 'You' : message.username}
              </div>
              <div style={{ marginBottom: '4px' }}>
                {message.text}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6c757d',
                textAlign: 'right'
              }}>
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          ))
        )}

        {typingUsers.size > 0 && (
          <div style={{
            fontStyle: 'italic',
            color: '#6c757d',
            fontSize: '14px',
            padding: '5px 10px'
          }}>
            {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '0 0 8px 8px',
        border: '1px solid #dee2e6',
        borderTop: 'none'
      }}>
        <textarea
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... (Press Enter to send)"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ced4da',
            resize: 'none',
            minHeight: '40px',
            maxHeight: '120px',
            fontFamily: 'inherit'
          }}
          disabled={connectionStatus !== 'Connected'}
        />
        <button
          onClick={sendMessage}
          disabled={connectionStatus !== 'Connected' || !newMessage.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: connectionStatus === 'Connected' && newMessage.trim() ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: connectionStatus === 'Connected' && newMessage.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Chat Features:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Automatic reconnection with exponential backoff</li>
          <li>Message deduplication and proper ordering</li>
          <li>Real-time typing indicators</li>
          <li>Auto-scroll to latest messages</li>
          <li>Connection status monitoring</li>
          <li>Proper WebSocket cleanup and error handling</li>
        </ul>
      </div>
    </div>
  );
}

export default ChatApp;`
    },
    testCases: [
      'WebSocket should reconnect automatically on connection loss',
      'Messages should be properly ordered and deduplicated',
      'Typing indicators should work correctly',
      'Connection status should be accurately displayed'
    ],
    debuggingSteps: [
      'Test WebSocket reconnection by simulating network issues',
      'Verify message ordering with rapid message sending',
      'Check typing indicator behavior',
      'Monitor WebSocket connection states in DevTools'
    ],
    commonMistakes: [
      'Creating new WebSocket connections on every render',
      'Not handling message ordering and deduplication',
      'Missing reconnection logic',
      'Poor error handling and connection state management'
    ],
    productionImpact: 'Connection issues, duplicate messages, poor user experience',
    preventionTips: [
      'Use custom hooks for WebSocket management',
      'Implement proper reconnection logic',
      'Handle message ordering and deduplication',
      'Monitor connection states and provide user feedback'
    ]
  },

  // 38-43: Adding more challenges to reach 50+
  {
    id: 'react-code-splitting-lazy',
    title: 'Code Splitting and Lazy Loading Issues',
    description: 'Problems with React.lazy, Suspense, and dynamic imports causing loading issues',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'Code Splitting', 'Lazy Loading', 'Suspense'],
    rootCause: 'Improper use of React.lazy and Suspense causing loading failures',
    category: 'Performance',
    files: {
      'App.jsx': `import React, { useState } from 'react';

// BUG: Lazy loading inside component will recreate on every render!
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // BUG: Creating lazy components inside render function!
  const HomePage = React.lazy(() => import('./HomePage'));
  const AboutPage = React.lazy(() => import('./AboutPage'));
  const ContactPage = React.lazy(() => import('./ContactPage'));

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div>
      <nav style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('about')}>About</button>
        <button onClick={() => setCurrentPage('contact')}>Contact</button>
      </nav>

      {/* BUG: Missing error boundary for lazy loading failures! */}
      <React.Suspense fallback={<div>Loading...</div>}>
        {renderPage()}
      </React.Suspense>
    </div>
  );
}

// Mock components that might fail to load
const HomePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>Home Page</h1>
    <p>Welcome to our website!</p>
  </div>
);

const AboutPage = () => {
  // BUG: Simulating a component that might fail to load
  if (Math.random() > 0.7) {
    throw new Error('Failed to load About page');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>About Page</h1>
      <p>Learn more about us!</p>
    </div>
  );
};

const ContactPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>Contact Page</h1>
    <p>Get in touch with us!</p>
  </div>
);

export default App;`
    },
    hints: [
      'Move lazy component definitions outside of render function',
      'Add error boundaries to handle lazy loading failures',
      'Implement retry logic for failed chunk loads',
      'Use proper loading states and error handling'
    ],
    solution: {
      'App.jsx': `import React, { useState, Suspense, useCallback, useEffect } from 'react';

// Define lazy components outside of component to prevent recreation
const HomePage = React.lazy(() =>
  import('./HomePage').catch(() => ({
    default: () => <div>Failed to load Home page. Please refresh.</div>
  }))
);

const AboutPage = React.lazy(() =>
  import('./AboutPage').catch(() => ({
    default: () => <div>Failed to load About page. Please refresh.</div>
  }))
);

const ContactPage = React.lazy(() =>
  import('./ContactPage').catch(() => ({
    default: () => <div>Failed to load Contact page. Please refresh.</div>
  }))
);

const DashboardPage = React.lazy(() =>
  import('./DashboardPage').catch(() => ({
    default: () => <div>Failed to load Dashboard page. Please refresh.</div>
  }))
);

// Error Boundary for lazy loading failures
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h2>⚠️ Loading Error</h2>
          <p>Failed to load the requested page.</p>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>
            Error: {this.state.error?.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced loading component
function LoadingSpinner({ message = 'Loading...', delay = 200 }) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!showSpinner) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      minHeight: '200px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '15px'
      }} />
      <p style={{ color: '#666', fontSize: '14px' }}>{message}</p>

      <style jsx>{\`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  );
}

// Route configuration
const routes = {
  home: {
    component: HomePage,
    label: 'Home',
    preload: true
  },
  about: {
    component: AboutPage,
    label: 'About',
    preload: false
  },
  contact: {
    component: ContactPage,
    label: 'Contact',
    preload: false
  },
  dashboard: {
    component: DashboardPage,
    label: 'Dashboard',
    preload: false
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [preloadedRoutes, setPreloadedRoutes] = useState(new Set(['home']));
  const [loadingStates, setLoadingStates] = useState({});

  // Preload components on hover
  const preloadRoute = useCallback(async (routeName) => {
    if (preloadedRoutes.has(routeName)) return;

    try {
      setLoadingStates(prev => ({ ...prev, [routeName]: 'preloading' }));

      // Preload the component
      const route = routes[routeName];
      if (route) {
        await route.component._payload._result;
      }

      setPreloadedRoutes(prev => new Set([...prev, routeName]));
      setLoadingStates(prev => ({ ...prev, [routeName]: 'preloaded' }));
    } catch (error) {
      console.error(\`Failed to preload \${routeName}:\`, error);
      setLoadingStates(prev => ({ ...prev, [routeName]: 'error' }));
    }
  }, [preloadedRoutes]);

  // Navigate to page
  const navigateToPage = useCallback((pageName) => {
    setCurrentPage(pageName);

    // Preload the component if not already preloaded
    if (!preloadedRoutes.has(pageName)) {
      preloadRoute(pageName);
    }
  }, [preloadRoute, preloadedRoutes]);

  // Preload critical routes on mount
  useEffect(() => {
    const criticalRoutes = Object.entries(routes)
      .filter(([_, config]) => config.preload)
      .map(([routeName]) => routeName);

    criticalRoutes.forEach(routeName => {
      if (!preloadedRoutes.has(routeName)) {
        preloadRoute(routeName);
      }
    });
  }, [preloadRoute, preloadedRoutes]);

  const renderPage = () => {
    const route = routes[currentPage];
    if (!route) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>404 - Page Not Found</h2>
          <p>The requested page does not exist.</p>
          <button
            onClick={() => navigateToPage('home')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    const Component = route.component;
    return <Component />;
  };

  const getLoadingIndicator = (routeName) => {
    const state = loadingStates[routeName];
    switch (state) {
      case 'preloading':
        return '⏳';
      case 'preloaded':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <nav style={{
        padding: '15px 20px',
        borderBottom: '2px solid #dee2e6',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {Object.entries(routes).map(([routeName, config]) => (
            <button
              key={routeName}
              onClick={() => navigateToPage(routeName)}
              onMouseEnter={() => preloadRoute(routeName)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === routeName ? '#007bff' : '#fff',
                color: currentPage === routeName ? '#fff' : '#007bff',
                border: '1px solid #007bff',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {config.label}
              <span style={{ fontSize: '12px' }}>
                {getLoadingIndicator(routeName)}
              </span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: '#666' }}>
          Preloaded: {preloadedRoutes.size}/{Object.keys(routes).length}
        </div>
      </nav>

      <main>
        <LazyLoadErrorBoundary>
          <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
            {renderPage()}
          </Suspense>
        </LazyLoadErrorBoundary>
      </main>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        maxWidth: '200px'
      }}>
        <div><strong>Code Splitting Status:</strong></div>
        {Object.entries(routes).map(([routeName, config]) => (
          <div key={routeName} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{config.label}:</span>
            <span>{preloadedRoutes.has(routeName) ? '✅' : '⏳'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock components for demonstration
const MockHomePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>🏠 Home Page</h1>
    <p>Welcome to our optimized website with proper code splitting!</p>
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
      <h3>Features:</h3>
      <ul>
        <li>Lazy loaded components</li>
        <li>Preloading on hover</li>
        <li>Error boundaries for failed loads</li>
        <li>Loading states and retry logic</li>
      </ul>
    </div>
  </div>
);

const MockAboutPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>ℹ️ About Page</h1>
    <p>This page demonstrates proper lazy loading with error handling.</p>
    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h3>Code Splitting Benefits:</h3>
      <ul>
        <li>Reduced initial bundle size</li>
        <li>Faster initial page load</li>
        <li>Better user experience</li>
        <li>Improved performance metrics</li>
      </ul>
    </div>
  </div>
);

const MockContactPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>📞 Contact Page</h1>
    <p>Get in touch with us through this lazily loaded contact form.</p>
    <form style={{ marginTop: '20px', maxWidth: '400px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
        <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input type="email" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
        <textarea style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }} />
      </div>
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Send Message
      </button>
    </form>
  </div>
);

const MockDashboardPage = () => (
  <div style={{ padding: '20px' }}>
    <h1>📊 Dashboard</h1>
    <p>This is a complex dashboard component that's loaded on demand.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
      {['Users', 'Revenue', 'Orders', 'Performance'].map(metric => (
        <div key={metric} style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #dee2e6'
        }}>
          <h3>{metric}</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {Math.floor(Math.random() * 1000)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Export mock components for the lazy imports to work
export { MockHomePage as HomePage, MockAboutPage as AboutPage, MockContactPage as ContactPage, MockDashboardPage as DashboardPage };

export default App;`
    },
    testCases: [
      'Lazy components should load correctly without recreation',
      'Error boundaries should handle loading failures gracefully',
      'Preloading should work on hover',
      'Loading states should be properly managed'
    ],
    debuggingSteps: [
      'Check Network tab for chunk loading',
      'Verify components are not recreated on re-renders',
      'Test error handling with failed imports',
      'Monitor preloading behavior on hover'
    ],
    commonMistakes: [
      'Creating lazy components inside render functions',
      'Missing error boundaries for lazy loading',
      'Not handling loading failures gracefully',
      'Poor loading state management'
    ],
    productionImpact: 'Failed page loads, poor user experience, bundle loading issues',
    preventionTips: [
      'Define lazy components outside of render functions',
      'Always wrap lazy components with error boundaries',
      'Implement proper loading states and retry logic',
      'Consider preloading critical routes'
    ]
  },

  // 39-44: Adding more challenges to reach 50+
  {
    id: 'react-testing-async-components',
    title: 'Testing Async Components Issues',
    description: 'Problems with testing components that have async operations and side effects',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'Testing', 'Async', 'Jest'],
    rootCause: 'Improper testing of async operations and missing proper test utilities',
    category: 'Testing',
    files: {
      'UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(\`/api/users/\${userId}\`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <button onClick={() => handleUpdateProfile({ ...user, age: user.age + 1 })}>
        Increment Age
      </button>
    </div>
  );
}

export default UserProfile;`,
      'UserProfile.test.js': `import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

// BUG: Not mocking fetch API!
describe('UserProfile', () => {
  test('renders user profile', () => {
    render(<UserProfile userId="123" />);

    // BUG: Not waiting for async operations!
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('handles loading state', () => {
    render(<UserProfile userId="123" />);

    // BUG: Loading state might be too fast to catch!
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles error state', () => {
    // BUG: Not mocking failed API call!
    render(<UserProfile userId="invalid" />);

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  test('updates profile on button click', () => {
    render(<UserProfile userId="123" />);

    // BUG: Not waiting for initial load!
    const button = screen.getByText('Increment Age');
    button.click();

    // BUG: Not waiting for update to complete!
    expect(screen.getByText('Age: 31')).toBeInTheDocument();
  });
});`
    },
    hints: [
      'Mock fetch API using jest.fn() or MSW',
      'Use waitFor and findBy queries for async operations',
      'Mock different API responses for various test scenarios',
      'Use proper cleanup and setup for each test'
    ],
    solution: {
      'UserProfile.jsx': `import React, { useState, useEffect, useCallback } from 'react';

function UserProfile({ userId, onError, onSuccess }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchUser = useCallback(async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(\`/api/users/\${id}\`);
      if (!response.ok) {
        throw new Error(\`Failed to fetch user: \${response.status}\`);
      }

      const userData = await response.json();
      setUser(userData);
      onSuccess?.(userData);
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  const handleUpdateProfile = useCallback(async (updatedData) => {
    if (!userId || updating) return;

    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error(\`Failed to update profile: \${response.status}\`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      onSuccess?.(updatedUser);
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [userId, updating, onError, onSuccess]);

  const handleRetry = useCallback(() => {
    fetchUser(userId);
  }, [fetchUser, userId]);

  if (loading) {
    return (
      <div data-testid="loading-state" style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading user profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error-state" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <div>Error: {error}</div>
        <button
          onClick={handleRetry}
          style={{ marginTop: '10px', padding: '8px 16px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div data-testid="no-user-state" style={{ padding: '20px', textAlign: 'center' }}>
        No user found
      </div>
    );
  }

  return (
    <div data-testid="user-profile" style={{ padding: '20px' }}>
      <h2 data-testid="user-name">{user.name}</h2>
      <p data-testid="user-email">Email: {user.email}</p>
      <p data-testid="user-age">Age: {user.age}</p>
      <div style={{ marginTop: '15px' }}>
        <button
          onClick={() => handleUpdateProfile({ ...user, age: user.age + 1 })}
          disabled={updating}
          data-testid="increment-age-button"
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: updating ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: updating ? 'not-allowed' : 'pointer'
          }}
        >
          {updating ? 'Updating...' : 'Increment Age'}
        </button>
        <button
          onClick={() => handleUpdateProfile({ ...user, name: user.name + ' (Updated)' })}
          disabled={updating}
          data-testid="update-name-button"
          style={{
            padding: '8px 16px',
            backgroundColor: updating ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: updating ? 'not-allowed' : 'pointer'
          }}
        >
          {updating ? 'Updating...' : 'Update Name'}
        </button>
      </div>
    </div>
  );
}

export default UserProfile;`,
      'UserProfile.test.js': `import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProfile from './UserProfile';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock user data
const mockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};

const updatedMockUser = {
  ...mockUser,
  age: 31
};

describe('UserProfile', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Clean up any pending timers or promises
    jest.clearAllTimers();
  });

  describe('Loading State', () => {
    test('shows loading state initially', async () => {
      // Mock a delayed response
      mockFetch.mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve(mockUser)
          }), 100)
        )
      );

      render(<UserProfile userId="123" />);

      // Should show loading state immediately
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
      expect(screen.getByText('Loading user profile...')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
      });
    });
  });

  describe('Success State', () => {
    test('renders user profile after successful fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      const onSuccess = jest.fn();
      render(<UserProfile userId="123" onSuccess={onSuccess} />);

      // Wait for user data to load
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });

      // Check if user data is displayed correctly
      expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('user-email')).toHaveTextContent('Email: john@example.com');
      expect(screen.getByTestId('user-age')).toHaveTextContent('Age: 30');

      // Check if success callback was called
      expect(onSuccess).toHaveBeenCalledWith(mockUser);
    });

    test('calls fetch with correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/users/123');
      });
    });
  });

  describe('Error State', () => {
    test('handles fetch error correctly', async () => {
      const errorMessage = 'Failed to fetch user: 404';
      mockFetch.mockRejectedValueOnce(new Error(errorMessage));

      const onError = jest.fn();
      render(<UserProfile userId="123" onError={onError} />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      expect(screen.getByText(\`Error: \${errorMessage}\`)).toBeInTheDocument();
      expect(onError).toHaveBeenCalledWith(errorMessage);
    });

    test('handles HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      expect(screen.getByText('Error: Failed to fetch user: 404')).toBeInTheDocument();
    });

    test('retry button refetches user data', async () => {
      // First call fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<UserProfile userId="123" />);

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      // Mock successful retry
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      // Click retry button
      const retryButton = screen.getByText('Retry');
      await userEvent.click(retryButton);

      // Wait for successful load
      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Update Operations', () => {
    beforeEach(async () => {
      // Setup initial user data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });
    });

    test('increments age on button click', async () => {
      // Mock update response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedMockUser)
      });

      const incrementButton = screen.getByTestId('increment-age-button');
      await userEvent.click(incrementButton);

      // Check loading state during update
      expect(incrementButton).toHaveTextContent('Updating...');
      expect(incrementButton).toBeDisabled();

      // Wait for update to complete
      await waitFor(() => {
        expect(screen.getByTestId('user-age')).toHaveTextContent('Age: 31');
      });

      // Verify API call
      expect(mockFetch).toHaveBeenLastCalledWith('/api/users/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMockUser)
      });
    });

    test('handles update errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Update failed'));

      const incrementButton = screen.getByTestId('increment-age-button');
      await userEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
      });

      expect(screen.getByText('Error: Update failed')).toBeInTheDocument();
    });

    test('prevents multiple simultaneous updates', async () => {
      // Mock slow update
      mockFetch.mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve(updatedMockUser)
          }), 100)
        )
      );

      const incrementButton = screen.getByTestId('increment-age-button');

      // Click multiple times rapidly
      await userEvent.click(incrementButton);
      await userEvent.click(incrementButton);
      await userEvent.click(incrementButton);

      // Should only make one API call
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    test('handles missing userId', () => {
      render(<UserProfile userId={null} />);

      // Should not make API call
      expect(mockFetch).not.toHaveBeenCalled();
      expect(screen.getByTestId('no-user-state')).toBeInTheDocument();
    });

    test('handles userId change', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      const { rerender } = render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/users/123');
      });

      // Change userId
      rerender(<UserProfile userId="456" />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/users/456');
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    test('has proper test ids for screen readers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      render(<UserProfile userId="123" />);

      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });

      // Check all important elements have test ids
      expect(screen.getByTestId('user-name')).toBeInTheDocument();
      expect(screen.getByTestId('user-email')).toBeInTheDocument();
      expect(screen.getByTestId('user-age')).toBeInTheDocument();
      expect(screen.getByTestId('increment-age-button')).toBeInTheDocument();
    });
  });
});`
    },
    testCases: [
      'All async operations should be properly tested with mocks',
      'Loading, success, and error states should be tested',
      'API calls should be verified with correct parameters',
      'User interactions should be tested with proper waiting'
    ],
    debuggingSteps: [
      'Check if fetch is properly mocked in tests',
      'Verify waitFor is used for async operations',
      'Test different API response scenarios',
      'Ensure proper cleanup between tests'
    ],
    commonMistakes: [
      'Not mocking fetch API in tests',
      'Not waiting for async operations to complete',
      'Missing test scenarios for error states',
      'Not testing user interactions properly'
    ],
    productionImpact: 'Unreliable tests, false positives/negatives, poor test coverage',
    preventionTips: [
      'Always mock external dependencies like fetch',
      'Use waitFor and findBy queries for async operations',
      'Test all possible states: loading, success, error',
      'Include proper cleanup and setup in tests'
    ]
  },

  // 40-45: Adding more challenges to reach 50+
  {
    id: 'react-ssr-hydration-mismatch',
    title: 'SSR Hydration Mismatch Issues',
    description: 'Problems with server-side rendering and client-side hydration mismatches',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '22 min',
    xpReward: 160,
    tags: ['React', 'SSR', 'Hydration', 'Next.js'],
    rootCause: 'Hydration mismatches between server and client rendering',
    category: 'SSR/Hydration',
    files: {
      'UserDashboard.jsx': `import React, { useState, useEffect } from 'react';

function UserDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [isClient, setIsClient] = useState(false);
  const [randomId] = useState(Math.random().toString(36)); // BUG: Different on server/client!

  useEffect(() => {
    setIsClient(true);

    // BUG: Setting state immediately in useEffect causes hydration mismatch!
    setCurrentTime(new Date().toLocaleString());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // BUG: Conditional rendering based on client state causes mismatch!
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Dashboard</h1>

      {/* BUG: Time will be different on server vs client! */}
      <p>Current time: {currentTime}</p>

      {/* BUG: Random ID will be different on server vs client! */}
      <div id={randomId}>
        <p>Session ID: {randomId}</p>
      </div>

      {/* BUG: localStorage is not available on server! */}
      <p>Theme: {localStorage.getItem('theme') || 'default'}</p>

      {/* BUG: window object not available on server! */}
      <p>Screen width: {window.innerWidth}px</p>

      <div>
        <h2>Recent Activity</h2>
        {/* BUG: Date.now() will be different on server vs client! */}
        <p>Last login: {new Date(Date.now() - 86400000).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default UserDashboard;`
    },
    hints: [
      'Use useEffect to handle client-only code',
      'Avoid using browser APIs directly in render',
      'Use consistent data between server and client',
      'Consider using suppressHydrationWarning for unavoidable mismatches'
    ],
    solution: {
      'UserDashboard.jsx': `import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Custom hook for client-side only values
function useClientOnly(clientValue, serverValue = null) {
  const [value, setValue] = useState(serverValue);

  useEffect(() => {
    setValue(clientValue);
  }, [clientValue]);

  return value;
}

// Custom hook for browser APIs
function useBrowserAPI(apiCall, fallback = null) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setValue(apiCall());
      } catch (error) {
        console.error('Browser API error:', error);
        setValue(fallback);
      }
    }
  }, [apiCall, fallback]);

  return value;
}

// Custom hook for localStorage
function useLocalStorage(key, defaultValue = null) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(key);
        setValue(stored !== null ? stored : defaultValue);
      } catch (error) {
        console.error('localStorage error:', error);
        setValue(defaultValue);
      }
    }
  }, [key, defaultValue]);

  const setStoredValue = useCallback((newValue) => {
    setValue(newValue);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (newValue === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, newValue);
        }
      } catch (error) {
        console.error('localStorage set error:', error);
      }
    }
  }, [key]);

  return [value, setStoredValue];
}

// Custom hook for window dimensions
function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
}

function UserDashboard({ initialTime, sessionId }) {
  // Use provided server-side values or generate client-side
  const [currentTime, setCurrentTime] = useState(initialTime || null);
  const [mounted, setMounted] = useState(false);

  // Use consistent session ID between server and client
  const stableSessionId = useMemo(() => {
    return sessionId || 'session-placeholder';
  }, [sessionId]);

  // Client-side only hooks
  const [theme, setTheme] = useLocalStorage('theme', 'default');
  const { width: screenWidth } = useWindowDimensions();

  // Handle time updates
  useEffect(() => {
    setMounted(true);

    // Only update time on client after mount
    if (!initialTime) {
      setCurrentTime(new Date().toLocaleString());
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  // Calculate last login time consistently
  const lastLoginTime = useMemo(() => {
    // Use a fixed timestamp that's consistent between server and client
    const fixedTimestamp = initialTime ?
      new Date(initialTime).getTime() - 86400000 :
      Date.now() - 86400000;
    return new Date(fixedTimestamp).toLocaleString();
  }, [initialTime]);

  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
  }, [setTheme]);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1>User Dashboard</h1>

        {/* Time display with proper hydration handling */}
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p>
            <strong>Current time:</strong>{' '}
            {mounted && currentTime ? (
              <span suppressHydrationWarning>{currentTime}</span>
            ) : (
              <span>Loading time...</span>
            )}
          </p>
        </div>

        {/* Session info with consistent ID */}
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p><strong>Session ID:</strong> {stableSessionId}</p>
          <p><strong>Last login:</strong> {lastLoginTime}</p>
        </div>

        {/* Theme controls */}
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Theme Settings</h3>
          <p><strong>Current theme:</strong> {theme}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => handleThemeChange('light')}
              style={{
                padding: '8px 16px',
                backgroundColor: theme === 'light' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              style={{
                padding: '8px 16px',
                backgroundColor: theme === 'dark' ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Screen dimensions - client-side only */}
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Screen Information</h3>
          <p>
            <strong>Screen width:</strong>{' '}
            {mounted && screenWidth ? (
              <span suppressHydrationWarning>{screenWidth}px</span>
            ) : (
              <span>Detecting...</span>
            )}
          </p>
          <p>
            <strong>Responsive breakpoint:</strong>{' '}
            {mounted && screenWidth ? (
              <span suppressHydrationWarning>
                {screenWidth < 768 ? 'Mobile' :
                 screenWidth < 1024 ? 'Tablet' : 'Desktop'}
              </span>
            ) : (
              <span>Detecting...</span>
            )}
          </p>
        </div>

        {/* Recent Activity */}
        <div style={{
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2>Recent Activity</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{
              padding: '10px',
              backgroundColor: theme === 'dark' ? '#555' : '#fff',
              borderRadius: '4px',
              border: '1px solid ' + (theme === 'dark' ? '#666' : '#dee2e6')
            }}>
              <p><strong>Login:</strong> {lastLoginTime}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            <div style={{
              padding: '10px',
              backgroundColor: theme === 'dark' ? '#555' : '#fff',
              borderRadius: '4px',
              border: '1px solid ' + (theme === 'dark' ? '#666' : '#dee2e6')
            }}>
              <p><strong>Profile Updated:</strong> 2 hours ago</p>
              <p><strong>Changes:</strong> Theme preferences</p>
            </div>
          </div>
        </div>

        {/* Hydration status indicator */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: mounted ? '#28a745' : '#ffc107',
          color: 'white',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {mounted ? '✅ Hydrated' : '⏳ Hydrating...'}
        </div>

        {/* Development info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            <h4>Development Info:</h4>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>Component mounted: {mounted ? 'Yes' : 'No'}</li>
              <li>Initial time provided: {initialTime ? 'Yes' : 'No'}</li>
              <li>Session ID provided: {sessionId ? 'Yes' : 'No'}</li>
              <li>Theme from localStorage: {theme}</li>
              <li>Screen width detected: {screenWidth || 'Not yet'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// HOC for SSR-safe rendering
export function withSSRSafe(Component) {
  return function SSRSafeComponent(props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      // Return a minimal server-side version
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Loading Dashboard...</h1>
          <p>Preparing your personalized experience...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Example usage with Next.js getServerSideProps
export async function getServerSideProps() {
  return {
    props: {
      initialTime: new Date().toLocaleString(),
      sessionId: \`session-\${Date.now()}\`
    }
  };
}

export default UserDashboard;`
    },
    testCases: [
      'Server and client should render consistently',
      'Browser APIs should be handled safely',
      'localStorage should work without hydration errors',
      'Time-based content should not cause mismatches'
    ],
    debuggingSteps: [
      'Check browser console for hydration warnings',
      'Compare server-rendered HTML with client HTML',
      'Test with JavaScript disabled to see server output',
      'Use React DevTools to identify hydration mismatches'
    ],
    commonMistakes: [
      'Using browser APIs directly in render',
      'Different random values on server vs client',
      'Conditional rendering based on client state',
      'Not handling localStorage safely'
    ],
    productionImpact: 'Hydration errors, layout shifts, poor SEO, broken functionality',
    preventionTips: [
      'Use useEffect for client-only code',
      'Provide consistent initial values from server',
      'Handle browser APIs safely with custom hooks',
      'Use suppressHydrationWarning sparingly for unavoidable mismatches'
    ]
  },

  // 41-46: Adding more challenges to reach 50+
  {
    id: 'react-accessibility-issues',
    title: 'Accessibility Implementation Issues',
    description: 'Problems with keyboard navigation, screen readers, and ARIA attributes',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '20 min',
    xpReward: 140,
    tags: ['React', 'Accessibility', 'ARIA', 'Keyboard Navigation'],
    rootCause: 'Missing accessibility features and improper ARIA implementation',
    category: 'Accessibility',
    files: {
      'AccessibleModal.jsx': `import React, { useState } from 'react';

function AccessibleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>

      {isOpen && (
        // BUG: Missing proper modal overlay and focus management!
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            {/* BUG: Missing proper heading structure! */}
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Contact Form
            </div>

            {/* BUG: Form lacks proper labels and error handling! */}
            <form>
              <input
                type="text"
                placeholder="Name" // BUG: Placeholder is not a label!
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', margin: '10px 0', padding: '8px' }}
              />

              <input
                type="email"
                placeholder="Email" // BUG: Placeholder is not a label!
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', margin: '10px 0', padding: '8px' }}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit">Submit</button>
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DataTable() {
  const data = [
    { id: 1, name: 'John', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane', email: 'jane@example.com', status: 'inactive' }
  ];

  return (
    // BUG: Table lacks proper accessibility attributes!
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td style={{ padding: '10px' }}>{item.name}</td>
            <td style={{ padding: '10px' }}>{item.email}</td>
            <td style={{ padding: '10px' }}>
              {/* BUG: Status indicator lacks screen reader context! */}
              <span style={{
                color: item.status === 'active' ? 'green' : 'red'
              }}>
                {item.status === 'active' ? '●' : '●'}
              </span>
            </td>
            <td style={{ padding: '10px' }}>
              {/* BUG: Buttons lack proper labels! */}
              <button>✏️</button>
              <button>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  return (
    <div>
      <AccessibleModal />
      <DataTable />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Add proper ARIA attributes and roles',
      'Implement focus management for modals',
      'Use semantic HTML elements',
      'Add proper labels and descriptions for screen readers'
    ],
    solution: {
      'AccessibleModal.jsx': `import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook for focus trap
function useFocusTrap(isActive) {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        // This will be handled by the parent component
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);

      // Restore focus to the previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

// Custom hook for managing body scroll
function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
}

function AccessibleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useFocusTrap(isOpen);
  const openButtonRef = useRef(null);

  useBodyScrollLock(isOpen);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setErrors({});
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setFormData({ name: '', email: '' });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus the first field with an error
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success - close modal
      closeModal();

      // Announce success to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.textContent = 'Form submitted successfully';
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);

    } catch (error) {
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, closeModal]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  return (
    <div>
      <button
        ref={openButtonRef}
        onClick={openModal}
        style={{
          padding: '12px 24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Open Contact Form
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={modalRef}
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title" style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              Contact Form
            </h2>

            <p id="modal-description" style={{ margin: '0 0 20px 0', color: '#666' }}>
              Please fill out the form below to get in touch with us.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: errors.name ? '#dc3545' : '#333'
                  }}
                >
                  Name {errors.name && <span aria-label="required">*</span>}
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) {
                      setErrors({...errors, name: ''});
                    }
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: \`2px solid \${errors.name ? '#dc3545' : '#ddd'}\`,
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <div
                    id="name-error"
                    role="alert"
                    style={{
                      color: '#dc3545',
                      fontSize: '14px',
                      marginTop: '5px'
                    }}
                  >
                    {errors.name}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: 'bold',
                    color: errors.email ? '#dc3545' : '#333'
                  }}
                >
                  Email Address {errors.email && <span aria-label="required">*</span>}
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) {
                      setErrors({...errors, email: ''});
                    }
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: \`2px solid \${errors.email ? '#dc3545' : '#ddd'}\`,
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <div
                    id="email-error"
                    role="alert"
                    style={{
                      color: '#dc3545',
                      fontSize: '14px',
                      marginTop: '5px'
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </div>

              {errors.submit && (
                <div
                  role="alert"
                  style={{
                    color: '#dc3545',
                    fontSize: '14px',
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    borderRadius: '4px'
                  }}
                >
                  {errors.submit}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-describedby={isSubmitting ? 'submit-status' : undefined}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting && (
                    <span
                      role="status"
                      aria-label="Submitting"
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {isSubmitting && (
                <div
                  id="submit-status"
                  aria-live="polite"
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    marginTop: '10px',
                    textAlign: 'center'
                  }}
                >
                  Please wait while we process your request...
                </div>
              )}
            </form>
          </div>

          <style jsx>{\`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          \`}</style>
        </div>
      )}
    </div>
  );
}

function DataTable() {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' }
  ]);

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [announcement, setAnnouncement] = useState('');

  const handleSort = useCallback((field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedData = [...data].sort((a, b) => {
      const aVal = a[field].toString().toLowerCase();
      const bVal = b[field].toString().toLowerCase();

      if (newDirection === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    setData(sortedData);
    setAnnouncement(\`Table sorted by \${field} in \${newDirection}ending order\`);
  }, [data, sortField, sortDirection]);

  const handleEdit = useCallback((id, name) => {
    setAnnouncement(\`Edit button activated for \${name}\`);
    // Edit functionality would go here
  }, []);

  const handleDelete = useCallback((id, name) => {
    setAnnouncement(\`Delete button activated for \${name}\`);
    // Delete functionality would go here
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management Table</h2>

      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {announcement}
      </div>

      <table
        role="table"
        aria-label="User management data table"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}
      >
        <caption style={{
          padding: '10px',
          fontSize: '14px',
          color: '#666',
          textAlign: 'left'
        }}>
          List of users with their status and available actions. Use arrow keys to navigate and Enter to activate buttons.
        </caption>

        <thead>
          <tr role="row">
            <th
              role="columnheader"
              tabIndex="0"
              onClick={() => handleSort('name')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSort('name');
                }
              }}
              aria-sort={
                sortField === 'name'
                  ? sortDirection === 'asc' ? 'ascending' : 'descending'
                  : 'none'
              }
              style={{
                padding: '12px',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              role="columnheader"
              tabIndex="0"
              onClick={() => handleSort('email')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSort('email');
                }
              }}
              aria-sort={
                sortField === 'email'
                  ? sortDirection === 'asc' ? 'ascending' : 'descending'
                  : 'none'
              }
              style={{
                padding: '12px',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              role="columnheader"
              tabIndex="0"
              onClick={() => handleSort('status')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSort('status');
                }
              }}
              aria-sort={
                sortField === 'status'
                  ? sortDirection === 'asc' ? 'ascending' : 'descending'
                  : 'none'
              }
              style={{
                padding: '12px',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              role="columnheader"
              style={{
                padding: '12px',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd'
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} role="row">
              <td
                role="gridcell"
                style={{
                  padding: '12px',
                  border: '1px solid #ddd'
                }}
              >
                {item.name}
              </td>
              <td
                role="gridcell"
                style={{
                  padding: '12px',
                  border: '1px solid #ddd'
                }}
              >
                {item.email}
              </td>
              <td
                role="gridcell"
                style={{
                  padding: '12px',
                  border: '1px solid #ddd'
                }}
              >
                <span
                  role="status"
                  aria-label={\`Status: \${item.status}\`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: item.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: item.status === 'active' ? '#155724' : '#721c24'
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: item.status === 'active' ? '#28a745' : '#dc3545'
                    }}
                  />
                  {item.status}
                </span>
              </td>
              <td
                role="gridcell"
                style={{
                  padding: '12px',
                  border: '1px solid #ddd'
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(item.id, item.name)}
                    aria-label={\`Edit \${item.name}\`}
                    title={\`Edit \${item.name}\`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    aria-label={\`Delete \${item.name}\`}
                    title={\`Delete \${item.name}\`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Accessibility Features:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Proper ARIA roles and labels</li>
          <li>Keyboard navigation support</li>
          <li>Screen reader announcements</li>
          <li>Focus management and visual indicators</li>
          <li>Semantic HTML structure</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Accessible React Components</h1>
      <div style={{ marginBottom: '40px' }}>
        <AccessibleModal />
      </div>
      <DataTable />
    </div>
  );
}

export default App;`
    },
    testCases: [
      'Modal should trap focus and handle keyboard navigation',
      'Form should have proper labels and error announcements',
      'Table should be sortable with keyboard and announce changes',
      'All interactive elements should have proper ARIA attributes'
    ],
    debuggingSteps: [
      'Test with screen reader (NVDA, JAWS, VoiceOver)',
      'Navigate using only keyboard (Tab, Enter, Escape)',
      'Check ARIA attributes with accessibility inspector',
      'Verify color contrast and visual indicators'
    ],
    commonMistakes: [
      'Using placeholders instead of proper labels',
      'Missing ARIA attributes and roles',
      'Poor focus management in modals',
      'Lack of screen reader announcements'
    ],
    productionImpact: 'Inaccessible to users with disabilities, legal compliance issues',
    preventionTips: [
      'Use semantic HTML elements',
      'Implement proper ARIA attributes',
      'Test with keyboard navigation and screen readers',
      'Follow WCAG guidelines for accessibility'
    ]
  },

  // 42-47: Adding more challenges to reach 50+
  {
    id: 'react-concurrent-features-issues',
    title: 'React 18 Concurrent Features Issues',
    description: 'Problems with Suspense, concurrent rendering, and automatic batching',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '25 min',
    xpReward: 180,
    tags: ['React', 'React 18', 'Suspense', 'Concurrent', 'Batching'],
    rootCause: 'Improper use of React 18 concurrent features and batching',
    category: 'Concurrent Features',
    files: {
      'ConcurrentApp.jsx': `import React, { useState, useEffect, Suspense, startTransition } from 'react';

// BUG: Not handling Suspense boundaries properly!
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BUG: Not using concurrent features properly!
    const fetchData = async () => {
      const response = await fetch(\`/api/users/\${userId}\`);
      const result = await response.json();
      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  // BUG: Manual loading state instead of using Suspense!
  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>User: {data?.name}</div>;
}

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query) return;

    // BUG: Not using startTransition for non-urgent updates!
    setIsSearching(true);

    const searchData = async () => {
      const response = await fetch(\`/api/search?q=\${query}\`);
      const data = await response.json();

      // BUG: These updates should be wrapped in startTransition!
      setResults(data.results);
      setIsSearching(false);
    };

    searchData();
  }, [query]);

  return (
    <div>
      {isSearching && <div>Searching...</div>}
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState(0);

  const handleSearch = (e) => {
    // BUG: Not using concurrent features for search!
    setSearchQuery(e.target.value);
  };

  const handleMultipleUpdates = () => {
    // BUG: These updates might not be batched properly!
    setCount(c => c + 1);
    setUserId(String(Math.floor(Math.random() * 100)));
    setSearchQuery('updated');
  };

  return (
    <div>
      <h1>Concurrent Features Demo</h1>

      <div>
        <button onClick={handleMultipleUpdates}>
          Update Multiple States
        </button>
        <p>Count: {count}</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* BUG: Missing proper Suspense boundary! */}
      <DataFetcher userId={userId} />

      <SearchResults query={searchQuery} />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Use Suspense boundaries for data fetching',
      'Wrap non-urgent updates with startTransition',
      'Leverage automatic batching in React 18',
      'Handle concurrent rendering properly'
    ],
    solution: {
      'ConcurrentApp.jsx': `import React, {
  useState,
  useEffect,
  Suspense,
  startTransition,
  useDeferredValue,
  useTransition,
  useMemo,
  useCallback,
  createContext,
  useContext
} from 'react';

// Create a simple cache for demonstration
const cache = new Map();

// Utility function to create a suspense-compatible resource
function createResource(promise) {
  let status = 'pending';
  let result;

  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      result = err;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

// Mock API functions
const fetchUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  return {
    id: userId,
    name: \`User \${userId}\`,
    email: \`user\${userId}@example.com\`,
    avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${userId}\`
  };
};

const searchAPI = async (query) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
  return {
    results: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
      id: i + 1,
      title: \`\${query} Result \${i + 1}\`,
      description: \`This is a search result for "\${query}"\`
    }))
  };
};

// Context for managing app state
const AppContext = createContext();

function AppProvider({ children }) {
  const [userId, setUserId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const value = {
    userId,
    setUserId,
    searchQuery,
    setSearchQuery,
    count,
    setCount,
    isPending,
    startTransition
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Suspense-compatible data fetcher
function DataFetcher({ userId }) {
  const resource = useMemo(() => {
    const cacheKey = \`user-\${userId}\`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const promise = fetchUser(userId);
    const resource = createResource(promise);
    cache.set(cacheKey, resource);

    return resource;
  }, [userId]);

  const data = resource.read();

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img
          src={data.avatar}
          alt={\`\${data.name} avatar\`}
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>{data.name}</h3>
          <p style={{ margin: 0, color: '#666' }}>{data.email}</p>
        </div>
      </div>
    </div>
  );
}

// Error boundary for Suspense
class SuspenseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Suspense error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          margin: '10px 0'
        }}>
          <h3>⚠️ Something went wrong</h3>
          <p>Failed to load data: {this.state.error?.message}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              // Clear cache to retry
              cache.clear();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
function LoadingFallback({ message = 'Loading...', delay = 300 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#e3f2fd',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <div style={{
        width: '30px',
        height: '30px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #2196f3',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 10px'
      }} />
      <p style={{ margin: 0, color: '#1976d2' }}>{message}</p>

      <style jsx>{\`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  );
}

// Search results with concurrent features
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { startTransition } = useAppContext();

  // Use deferred value for search query to avoid blocking urgent updates
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (!deferredQuery.trim()) {
      setResults([]);
      return;
    }

    const cacheKey = \`search-\${deferredQuery}\`;

    // Check cache first
    if (cache.has(cacheKey)) {
      setResults(cache.get(cacheKey));
      return;
    }

    setIsSearching(true);

    const searchData = async () => {
      try {
        const data = await searchAPI(deferredQuery);

        // Use startTransition for non-urgent updates
        startTransition(() => {
          setResults(data.results);
          setIsSearching(false);
          cache.set(cacheKey, data.results);
        });
      } catch (error) {
        console.error('Search error:', error);
        startTransition(() => {
          setResults([]);
          setIsSearching(false);
        });
      }
    };

    searchData();
  }, [deferredQuery, startTransition]);

  const isStale = query !== deferredQuery;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '10px 0',
      opacity: isStale ? 0.7 : 1,
      transition: 'opacity 0.2s ease'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>
        Search Results
        {isSearching && (
          <span style={{
            marginLeft: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            (Searching...)
          </span>
        )}
        {isStale && (
          <span style={{
            marginLeft: '10px',
            fontSize: '14px',
            color: '#ff9800'
          }}>
            (Updating...)
          </span>
        )}
      </h3>

      {results.length === 0 && !isSearching ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {deferredQuery ? 'No results found' : 'Enter a search query'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {results.map(item => (
            <li
              key={item.id}
              style={{
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '4px',
                marginBottom: '8px',
                border: '1px solid #dee2e6'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// User selector component
function UserSelector() {
  const { userId, setUserId, startTransition } = useAppContext();

  const handleUserChange = useCallback((newUserId) => {
    // Use startTransition for non-urgent user changes
    startTransition(() => {
      setUserId(newUserId);
    });
  }, [setUserId, startTransition]);

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>Select User</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => handleUserChange(String(id))}
            style={{
              padding: '8px 16px',
              backgroundColor: userId === String(id) ? '#007bff' : '#fff',
              color: userId === String(id) ? '#fff' : '#007bff',
              border: '2px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            User {id}
          </button>
        ))}
      </div>
    </div>
  );
}

// Counter component demonstrating automatic batching
function Counter() {
  const { count, setCount, setUserId, setSearchQuery, startTransition } = useAppContext();

  const handleMultipleUpdates = useCallback(() => {
    // In React 18, these updates are automatically batched
    setCount(c => c + 1);
    setUserId(String(Math.floor(Math.random() * 5) + 1));
    setSearchQuery(\`search-\${Date.now()}\`);
  }, [setCount, setUserId, setSearchQuery]);

  const handleTransitionUpdates = useCallback(() => {
    // Use startTransition for non-urgent updates
    startTransition(() => {
      setCount(c => c + 10);
      setUserId(String(Math.floor(Math.random() * 5) + 1));
      setSearchQuery(\`transition-\${Date.now()}\`);
    });
  }, [setCount, setUserId, setSearchQuery, startTransition]);

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>Counter: {count}</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleMultipleUpdates}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Batched Updates (+1)
        </button>
        <button
          onClick={handleTransitionUpdates}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Transition Updates (+10)
        </button>
      </div>
    </div>
  );
}

// Search input component
function SearchInput() {
  const { searchQuery, setSearchQuery, isPending } = useAppContext();

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    // Immediate update for input value (urgent)
    setSearchQuery(value);
  }, [setSearchQuery]);

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>Search</h3>
      <input
        type="text"
        placeholder="Search for something..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '12px',
          border: '2px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
          backgroundColor: isPending ? '#f8f9fa' : 'white'
        }}
      />
      {isPending && (
        <p style={{
          margin: '10px 0 0 0',
          fontSize: '14px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          ⏳ Processing updates...
        </p>
      )}
    </div>
  );
}

// Main app component
function App() {
  return (
    <AppProvider>
      <div style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          React 18 Concurrent Features Demo
        </h1>

        <Counter />
        <SearchInput />
        <UserSelector />

        <SuspenseErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading user data..." />}>
            <UserDataSection />
          </Suspense>
        </SuspenseErrorBoundary>

        <SearchResultsSection />

        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px'
        }}>
          <h3>React 18 Features Used:</h3>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li><strong>Automatic Batching:</strong> Multiple state updates are batched automatically</li>
            <li><strong>startTransition:</strong> Non-urgent updates don't block urgent ones</li>
            <li><strong>useDeferredValue:</strong> Defers expensive computations</li>
            <li><strong>Suspense:</strong> Declarative loading states for async operations</li>
            <li><strong>useTransition:</strong> Provides pending state for transitions</li>
          </ul>
        </div>
      </div>
    </AppProvider>
  );
}

function UserDataSection() {
  const { userId } = useAppContext();
  return <DataFetcher userId={userId} />;
}

function SearchResultsSection() {
  const { searchQuery } = useAppContext();
  return <SearchResults query={searchQuery} />;
}

export default App;`
    },
    testCases: [
      'Suspense should handle loading states properly',
      'startTransition should not block urgent updates',
      'Automatic batching should batch multiple state updates',
      'useDeferredValue should defer non-urgent updates'
    ],
    debuggingSteps: [
      'Check React DevTools Profiler for concurrent features',
      'Monitor network requests and caching behavior',
      'Test transition states and pending indicators',
      'Verify Suspense boundaries and error handling'
    ],
    commonMistakes: [
      'Not using Suspense for data fetching',
      'Missing startTransition for non-urgent updates',
      'Not leveraging automatic batching',
      'Improper error boundaries for Suspense'
    ],
    productionImpact: 'Poor performance, blocking UI updates, suboptimal user experience',
    preventionTips: [
      'Use Suspense boundaries for async operations',
      'Wrap non-urgent updates with startTransition',
      'Leverage useDeferredValue for expensive computations',
      'Implement proper error boundaries for Suspense'
    ]
  },

  // 43-48: Adding more challenges to reach 50+
  {
    id: 'react-custom-hooks-issues',
    title: 'Custom Hooks Implementation Issues',
    description: 'Problems with custom hook design, dependencies, and reusability',
    techStack: 'React',
    difficulty: 'intermediate',
    estimatedTime: '18 min',
    xpReward: 130,
    tags: ['React', 'Custom Hooks', 'Dependencies', 'Reusability'],
    rootCause: 'Improper custom hook implementation and dependency management',
    category: 'Custom Hooks',
    files: {
      'CustomHooks.jsx': `import React, { useState, useEffect, useCallback } from 'react';

// BUG: Custom hook with missing dependencies and poor design!
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // BUG: Missing userId in dependency array!
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // BUG: Missing userId dependency!

  // BUG: Not memoizing the return object!
  return { user, loading, error };
}

// BUG: Custom hook that doesn't handle cleanup properly!
function useInterval(callback, delay) {
  useEffect(() => {
    // BUG: Not storing interval ID for cleanup!
    setInterval(callback, delay);
  }, [callback, delay]); // BUG: callback changes on every render!
}

// BUG: Custom hook with inconsistent API!
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // BUG: Not updating localStorage when value changes!
  const setStoredValue = (newValue) => {
    setValue(newValue);
  };

  return [value, setStoredValue];
}

// BUG: Custom hook that causes infinite re-renders!
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // BUG: Not cleaning up timeout!
    return () => clearTimeout(handler);
  }); // BUG: Missing dependency array causes infinite re-renders!

  return debouncedValue;
}

// Component using the buggy hooks
function UserProfile({ userId }) {
  const { user, loading, error } = useUserData(userId);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // BUG: Using buggy hooks!
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // BUG: Callback will change on every render!
  useInterval(() => {
    setCount(c => c + 1);
  }, 1000);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>Count: {count}</p>
      <p>Theme: {theme}</p>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <p>Debounced: {debouncedSearch}</p>
    </div>
  );
}

export default UserProfile;`
    },
    hints: [
      'Add proper dependencies to useEffect arrays',
      'Memoize return values and callbacks in custom hooks',
      'Handle cleanup properly in custom hooks',
      'Design consistent and reusable hook APIs'
    ],
    solution: {
      'CustomHooks.jsx': `import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer
} from 'react';

// Improved custom hook for user data with proper error handling and caching
function useUserData(userId, options = {}) {
  const {
    enabled = true,
    refetchOnMount = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    onSuccess,
    onError
  } = options;

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'FETCH_START':
          return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
          return {
            ...state,
            loading: false,
            user: action.payload,
            error: null,
            lastFetched: Date.now()
          };
        case 'FETCH_ERROR':
          return {
            ...state,
            loading: false,
            error: action.payload,
            user: null
          };
        case 'RESET':
          return {
            user: null,
            loading: false,
            error: null,
            lastFetched: null
          };
        default:
          return state;
      }
    },
    {
      user: null,
      loading: false,
      error: null,
      lastFetched: null
    }
  );

  const cache = useRef(new Map());
  const abortControllerRef = useRef(null);

  const fetchUser = useCallback(async (id, force = false) => {
    if (!id || !enabled) return;

    const cacheKey = \`user-\${id}\`;
    const cached = cache.current.get(cacheKey);

    // Use cache if available and not expired
    if (!force && cached && (Date.now() - cached.timestamp < cacheTime)) {
      dispatch({ type: 'FETCH_SUCCESS', payload: cached.data });
      onSuccess?.(cached.data);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    dispatch({ type: 'FETCH_START' });

    try {
      const response = await fetch(\`/api/users/\${id}\`, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const userData = await response.json();

      // Cache the result
      cache.current.set(cacheKey, {
        data: userData,
        timestamp: Date.now()
      });

      dispatch({ type: 'FETCH_SUCCESS', payload: userData });
      onSuccess?.(userData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMessage = err.message || 'Failed to fetch user';
        dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
        onError?.(errorMessage);
      }
    }
  }, [userId, enabled, cacheTime, onSuccess, onError]);

  const refetch = useCallback(() => {
    fetchUser(userId, true);
  }, [fetchUser, userId]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  useEffect(() => {
    if (refetchOnMount) {
      fetchUser(userId);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId, fetchUser, refetchOnMount]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    ...state,
    refetch,
    reset,
    isStale: state.lastFetched && (Date.now() - state.lastFetched > cacheTime)
  }), [state, refetch, reset, cacheTime]);
}

// Improved interval hook with proper cleanup
function useInterval(callback, delay, options = {}) {
  const {
    immediate = false,
    enabled = true
  } = options;

  const savedCallback = useRef(callback);
  const intervalRef = useRef(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (!enabled || intervalRef.current) return;

    if (immediate) {
      savedCallback.current();
    }

    intervalRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);
  }, [delay, immediate, enabled]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const restart = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  useEffect(() => {
    if (enabled && delay !== null) {
      start();
    } else {
      stop();
    }

    return stop;
  }, [delay, enabled, start, stop]);

  return useMemo(() => ({
    start,
    stop,
    restart,
    isActive: intervalRef.current !== null
  }), [start, stop, restart]);
}

// Improved localStorage hook with proper error handling
function useLocalStorage(key, initialValue, options = {}) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError
  } = options;

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      onError?.(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      }
    } catch (error) {
      onError?.(error);
    }
  }, [key, serialize, storedValue, onError]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(undefined);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      onError?.(error);
    }
  }, [key, onError]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== serialize(storedValue)) {
        try {
          setStoredValue(e.newValue ? deserialize(e.newValue) : initialValue);
        } catch (error) {
          onError?.(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storedValue, initialValue, serialize, deserialize, onError]);

  return useMemo(() => [
    storedValue,
    setValue,
    removeValue
  ], [storedValue, setValue, removeValue]);
}

// Improved debounce hook with proper cleanup
function useDebounce(value, delay, options = {}) {
  const {
    leading = false,
    trailing = true,
    maxWait
  } = options;

  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);
  const maxTimeoutRef = useRef(null);
  const lastCallTimeRef = useRef(null);
  const lastInvokeTimeRef = useRef(0);

  const invokeFunc = useCallback(() => {
    setDebouncedValue(value);
    lastInvokeTimeRef.current = Date.now();
  }, [value]);

  const leadingEdge = useCallback(() => {
    lastInvokeTimeRef.current = Date.now();
    if (leading) {
      invokeFunc();
    }
  }, [leading, invokeFunc]);

  const remainingWait = useCallback((time) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    const timeWaiting = delay - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }, [delay, maxWait]);

  const shouldInvoke = useCallback((time) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

    return (
      lastCallTimeRef.current === null ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }, [delay, maxWait]);

  const trailingEdge = useCallback(() => {
    timeoutRef.current = null;
    if (trailing && lastCallTimeRef.current !== null) {
      invokeFunc();
    }
    lastCallTimeRef.current = null;
  }, [trailing, invokeFunc]);

  const timerExpired = useCallback(() => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge();
    } else {
      const remaining = remainingWait(time);
      timeoutRef.current = setTimeout(timerExpired, remaining);
    }
  }, [shouldInvoke, trailingEdge, remainingWait]);

  const debounced = useCallback(() => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastCallTimeRef.current = time;

    if (isInvoking) {
      if (timeoutRef.current === null) {
        leadingEdge();
      }
      if (maxWait !== undefined) {
        if (maxTimeoutRef.current === null) {
          maxTimeoutRef.current = setTimeout(invokeFunc, maxWait);
        }
      }
    }

    if (timeoutRef.current === null) {
      timeoutRef.current = setTimeout(timerExpired, delay);
    }
  }, [shouldInvoke, leadingEdge, timerExpired, delay, maxWait, invokeFunc]);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current !== null) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    lastCallTimeRef.current = null;
    lastInvokeTimeRef.current = 0;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current !== null) {
      invokeFunc();
      cancel();
    }
  }, [invokeFunc, cancel]);

  useEffect(() => {
    debounced();
    return cancel;
  }, [value, debounced, cancel]);

  return useMemo(() => ({
    debouncedValue,
    cancel,
    flush,
    isPending: timeoutRef.current !== null
  }), [debouncedValue, cancel, flush]);
}

// Custom hook for managing async operations
function useAsync(asyncFunction, dependencies = [], options = {}) {
  const {
    immediate = true,
    onSuccess,
    onError
  } = options;

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'LOADING':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return {
            loading: false,
            error: null,
            data: action.payload,
            lastSuccessTime: Date.now()
          };
        case 'ERROR':
          return {
            loading: false,
            error: action.payload,
            data: null
          };
        default:
          return state;
      }
    },
    {
      data: null,
      loading: false,
      error: null,
      lastSuccessTime: null
    }
  );

  const execute = useCallback(async (...args) => {
    dispatch({ type: 'LOADING' });
    try {
      const result = await asyncFunction(...args);
      dispatch({ type: 'SUCCESS', payload: result });
      onSuccess?.(result);
      return result;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error });
      onError?.(error);
      throw error;
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return useMemo(() => ({
    ...state,
    execute
  }), [state, execute]);
}

// Component using the improved hooks
function UserProfile({ userId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [count, setCount] = useState(0);

  // Use improved custom hooks
  const { user, loading, error, refetch, isStale } = useUserData(userId, {
    onSuccess: (user) => console.log('User loaded:', user.name),
    onError: (error) => console.error('Failed to load user:', error)
  });

  const { debouncedValue: debouncedSearch, isPending } = useDebounce(searchTerm, 500);

  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light', {
    onError: (error) => console.error('LocalStorage error:', error)
  });

  const { start: startCounter, stop: stopCounter, isActive } = useInterval(
    () => setCount(c => c + 1),
    1000,
    { immediate: false, enabled: true }
  );

  const handleThemeToggle = useCallback(() => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <div>Error: {error}</div>
        <button
          onClick={refetch}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>{user?.name}</h2>
        <p>Email: {user?.email}</p>

        {isStale && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            ⚠️ Data may be outdated. <button onClick={refetch}>Refresh</button>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h3>Counter: {count}</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={isActive ? stopCounter : startCounter}
              style={{
                padding: '8px 16px',
                backgroundColor: isActive ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isActive ? 'Stop' : 'Start'} Counter
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Theme: {theme}</h3>
          <button
            onClick={handleThemeToggle}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Theme
          </button>
          <button
            onClick={removeTheme}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Theme
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Search</h3>
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <p>
            Debounced: {debouncedSearch}
            {isPending && <span style={{ color: '#666' }}> (updating...)</span>}
          </p>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: theme === 'dark' ? '#444' : '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h4>Custom Hooks Status:</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>User Data: {loading ? 'Loading' : user ? 'Loaded' : 'Error'}</li>
            <li>Counter: {isActive ? 'Running' : 'Stopped'}</li>
            <li>Search Debounce: {isPending ? 'Pending' : 'Idle'}</li>
            <li>Theme: {theme} (from localStorage)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;`
    },
    testCases: [
      'Custom hooks should have proper dependency arrays',
      'Hooks should handle cleanup properly',
      'Return values should be memoized to prevent re-renders',
      'Hooks should have consistent and reusable APIs'
    ],
    debuggingSteps: [
      'Check useEffect dependency arrays for missing dependencies',
      'Verify cleanup functions are properly implemented',
      'Test hook reusability across different components',
      'Monitor re-renders caused by hook return values'
    ],
    commonMistakes: [
      'Missing dependencies in useEffect arrays',
      'Not memoizing return values from custom hooks',
      'Poor cleanup in custom hooks',
      'Inconsistent hook APIs and error handling'
    ],
    productionImpact: 'Memory leaks, infinite re-renders, poor performance, unreliable behavior',
    preventionTips: [
      'Always include all dependencies in useEffect arrays',
      'Memoize return values and callbacks in custom hooks',
      'Implement proper cleanup for timers and subscriptions',
      'Design consistent and reusable hook APIs'
    ]
  },

  // 44-49: Adding more challenges to reach 50+
  {
    id: 'react-component-composition-issues',
    title: 'Component Composition and Patterns Issues',
    description: 'Problems with render props, HOCs, compound components, and composition patterns',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '24 min',
    xpReward: 170,
    tags: ['React', 'Composition', 'HOC', 'Render Props', 'Compound Components'],
    rootCause: 'Improper implementation of React composition patterns',
    category: 'Component Patterns',
    files: {
      'CompositionPatterns.jsx': `import React, { useState, useEffect, createContext, useContext } from 'react';

// BUG: HOC with improper prop forwarding and display name!
function withLoading(WrappedComponent) {
  return function LoadingComponent(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    // BUG: Not forwarding ref and not spreading props properly!
    return <WrappedComponent {...props} />;
  };
  // BUG: Missing display name for debugging!
}

// BUG: Render prop component with poor API design!
function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]);
      setLoading(false);
    }, 1000);
  }, []);

  // BUG: Not validating children prop type!
  return children({ data, loading });
}

// BUG: Compound component with poor context usage!
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', margin: '50px auto', width: '400px' }}>
        {children}
      </div>
    </div>
  );
};

// BUG: Modal components not using context properly!
Modal.Header = ({ children }) => <h2>{children}</h2>;
Modal.Body = ({ children }) => <div>{children}</div>;
Modal.Footer = ({ children }) => <div>{children}</div>;

// BUG: Component using patterns incorrectly!
const EnhancedComponent = withLoading(({ title }) => (
  <div>
    <h1>{title}</h1>
  </div>
));

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <EnhancedComponent title="Hello World" />

      {/* BUG: Using render prop incorrectly! */}
      <DataProvider>
        {({ data, loading }) => (
          <div>
            {loading ? <p>Loading...</p> : (
              <ul>
                {data.map(item => <li key={item.id}>{item.name}</li>)}
              </ul>
            )}
          </div>
        )}
      </DataProvider>

      <button onClick={() => setModalOpen(true)}>Open Modal</button>

      {/* BUG: Compound component usage without proper context! */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>Modal content goes here</Modal.Body>
        <Modal.Footer>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;`
    },
    hints: [
      'Add proper prop forwarding and ref handling in HOCs',
      'Validate render prop function types',
      'Use context for compound components',
      'Add proper display names for debugging'
    ],
    solution: {
      'CompositionPatterns.jsx': `import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  cloneElement,
  isValidElement
} from 'react';
import PropTypes from 'prop-types';

// Improved HOC with proper prop forwarding and ref handling
function withLoading(WrappedComponent, options = {}) {
  const {
    loadingComponent: LoadingComponent = () => <div>Loading...</div>,
    delay = 1000,
    displayName
  } = options;

  const WithLoadingComponent = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const timer = setTimeout(() => {
        try {
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }, delay);

      return () => clearTimeout(timer);
    }, []);

    if (error) {
      return (
        <div style={{ color: 'red', padding: '10px' }}>
          Error: {error}
        </div>
      );
    }

    if (loading) {
      return <LoadingComponent />;
    }

    // Properly forward ref and all props
    return <WrappedComponent {...props} ref={ref} />;
  });

  // Set display name for debugging
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithLoadingComponent.displayName = displayName || \`withLoading(\${wrappedComponentName})\`;

  // Copy static properties
  Object.keys(WrappedComponent).forEach(key => {
    if (key !== 'displayName' && key !== 'name') {
      WithLoadingComponent[key] = WrappedComponent[key];
    }
  });

  return WithLoadingComponent;
}

// Improved render prop component with proper validation and error handling
function DataProvider({
  children,
  endpoint = '/api/data',
  initialData = [],
  onSuccess,
  onError,
  refetchInterval
}) {
  const [state, setState] = useState({
    data: initialData,
    loading: true,
    error: null,
    lastFetched: null
  });

  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = [
        { id: 1, name: 'Item 1', category: 'A' },
        { id: 2, name: 'Item 2', category: 'B' },
        { id: 3, name: 'Item 3', category: 'A' }
      ];

      setState({
        data: mockData,
        loading: false,
        error: null,
        lastFetched: new Date().toISOString()
      });

      onSuccess?.(mockData);
    } catch (error) {
      if (error.name !== 'AbortError') {
        const errorMessage = error.message || 'Failed to fetch data';
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
        onError?.(errorMessage);
      }
    }
  }, [endpoint, onSuccess, onError]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    let intervalId;
    if (refetchInterval) {
      intervalId = setInterval(fetchData, refetchInterval);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, refetchInterval]);

  // Validate children prop
  if (typeof children !== 'function') {
    throw new Error('DataProvider children must be a function');
  }

  const renderProps = useMemo(() => ({
    ...state,
    refetch,
    isStale: state.lastFetched && refetchInterval &&
      (Date.now() - new Date(state.lastFetched).getTime() > refetchInterval)
  }), [state, refetch, refetchInterval]);

  return children(renderProps);
}

DataProvider.propTypes = {
  children: PropTypes.func.isRequired,
  endpoint: PropTypes.string,
  initialData: PropTypes.array,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  refetchInterval: PropTypes.number
};

// Context for Modal compound component
const ModalContext = createContext(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within a Modal');
  }
  return context;
}

// Improved Modal compound component with context
const Modal = ({
  children,
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'medium',
  className = '',
  style = {}
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    small: { width: '300px', maxWidth: '90vw' },
    medium: { width: '500px', maxWidth: '90vw' },
    large: { width: '800px', maxWidth: '95vw' },
    fullscreen: { width: '100vw', height: '100vh', margin: 0 }
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const contextValue = useMemo(() => ({
    onClose,
    size,
    isOpen
  }), [onClose, size, isOpen]);

  return (
    <ModalContext.Provider value={contextValue}>
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: size === 'fullscreen' ? 0 : '20px'
        }}
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          className={className}
          style={{
            backgroundColor: 'white',
            borderRadius: size === 'fullscreen' ? 0 : '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
            overflow: 'auto',
            outline: 'none',
            ...sizeStyles[size],
            ...style
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

Modal.Header = ({ children, className = '', style = {} }) => {
  const { onClose } = useModalContext();

  return (
    <div
      className={className}
      style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
        {children}
      </div>
      <button
        onClick={onClose}
        aria-label="Close modal"
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '4px',
          color: '#6c757d',
          lineHeight: 1
        }}
      >
        ×
      </button>
    </div>
  );
};

Modal.Body = ({ children, className = '', style = {} }) => {
  return (
    <div
      className={className}
      style={{
        padding: '20px 24px',
        ...style
      }}
    >
      {children}
    </div>
  );
};

Modal.Footer = ({ children, className = '', style = {} }) => {
  return (
    <div
      className={className}
      style={{
        padding: '16px 24px 20px',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// Set display names for debugging
Modal.displayName = 'Modal';
Modal.Header.displayName = 'Modal.Header';
Modal.Body.displayName = 'Modal.Body';
Modal.Footer.displayName = 'Modal.Footer';

// PropTypes for Modal
Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'fullscreen']),
  className: PropTypes.string,
  style: PropTypes.object
};

// Higher-order component for error boundaries
function withErrorBoundary(WrappedComponent, options = {}) {
  const {
    fallback: FallbackComponent = ({ error, resetError }) => (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    ),
    onError
  } = options;

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
      onError?.(error, errorInfo);
    }

    resetError = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError) {
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ErrorBoundary.displayName = \`withErrorBoundary(\${wrappedComponentName})\`;

  return ErrorBoundary;
}

// Example components using the improved patterns
const BasicComponent = forwardRef(({ title, onClick }, ref) => (
  <div ref={ref}>
    <h1 onClick={onClick}>{title}</h1>
    <p>This is a basic component with proper ref forwarding.</p>
  </div>
));

BasicComponent.displayName = 'BasicComponent';

const EnhancedComponent = withLoading(BasicComponent, {
  delay: 1500,
  loadingComponent: () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div>🔄 Loading enhanced component...</div>
    </div>
  )
});

const SafeEnhancedComponent = withErrorBoundary(EnhancedComponent, {
  onError: (error, errorInfo) => {
    console.error('Component error:', error, errorInfo);
  }
});

// Main App component demonstrating all patterns
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('medium');
  const componentRef = useRef(null);

  const handleComponentClick = useCallback(() => {
    console.log('Component clicked!', componentRef.current);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleDataSuccess = useCallback((data) => {
    console.log('Data loaded successfully:', data);
  }, []);

  const handleDataError = useCallback((error) => {
    console.error('Data loading failed:', error);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React Composition Patterns Demo</h1>

      {/* HOC Pattern */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Higher-Order Component Pattern</h2>
        <SafeEnhancedComponent
          ref={componentRef}
          title="Enhanced Component with HOC"
          onClick={handleComponentClick}
        />
      </section>

      {/* Render Props Pattern */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Render Props Pattern</h2>
        <DataProvider
          onSuccess={handleDataSuccess}
          onError={handleDataError}
          refetchInterval={30000}
        >
          {({ data, loading, error, refetch, isStale }) => (
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: isStale ? '2px solid #ffc107' : '1px solid #dee2e6'
            }}>
              {isStale && (
                <div style={{ color: '#856404', marginBottom: '10px' }}>
                  ⚠️ Data may be outdated
                </div>
              )}

              {loading ? (
                <p>Loading data...</p>
              ) : error ? (
                <div style={{ color: 'red' }}>
                  <p>Error: {error}</p>
                  <button onClick={refetch}>Retry</button>
                </div>
              ) : (
                <div>
                  <h3>Data Items:</h3>
                  <ul>
                    {data.map(item => (
                      <li key={item.id}>
                        {item.name} (Category: {item.category})
                      </li>
                    ))}
                  </ul>
                  <button onClick={refetch} style={{ marginTop: '10px' }}>
                    Refresh Data
                  </button>
                </div>
              )}
            </div>
          )}
        </DataProvider>
      </section>

      {/* Compound Components Pattern */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Compound Components Pattern</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button onClick={() => setModalOpen(true)}>
            Open Modal
          </button>
          <select
            value={modalSize}
            onChange={(e) => setModalSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="fullscreen">Fullscreen</option>
          </select>
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={handleModalClose}
          size={modalSize}
          closeOnOverlayClick={true}
          closeOnEscape={true}
        >
          <Modal.Header>
            Compound Component Modal ({modalSize})
          </Modal.Header>
          <Modal.Body>
            <p>This modal demonstrates the compound component pattern.</p>
            <p>It uses React Context to share state between the Modal and its sub-components.</p>
            <div style={{ marginTop: '15px' }}>
              <h4>Features:</h4>
              <ul>
                <li>Focus management</li>
                <li>Keyboard navigation (ESC to close)</li>
                <li>Click outside to close</li>
                <li>Body scroll lock</li>
                <li>Multiple sizes</li>
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={handleModalClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleModalClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Confirm
            </button>
          </Modal.Footer>
        </Modal>
      </section>

      {/* Pattern Summary */}
      <section style={{
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px'
      }}>
        <h3>Composition Patterns Used:</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Higher-Order Components (HOCs):</strong> withLoading, withErrorBoundary</li>
          <li><strong>Render Props:</strong> DataProvider with function as children</li>
          <li><strong>Compound Components:</strong> Modal with Header, Body, Footer</li>
          <li><strong>Context API:</strong> Sharing state between compound components</li>
          <li><strong>Forward Refs:</strong> Proper ref forwarding in HOCs</li>
        </ul>
      </section>
    </div>
  );
}

export default App;`
    },
    testCases: [
      'HOCs should properly forward refs and props',
      'Render props should validate children function type',
      'Compound components should use context for state sharing',
      'All components should have proper display names'
    ],
    debuggingSteps: [
      'Check React DevTools for component names and hierarchy',
      'Verify prop forwarding in HOCs',
      'Test compound component context usage',
      'Validate render prop function calls'
    ],
    commonMistakes: [
      'Not forwarding refs in HOCs',
      'Missing display names for debugging',
      'Poor compound component context design',
      'Not validating render prop function types'
    ],
    productionImpact: 'Poor debugging experience, broken component composition, ref forwarding issues',
    preventionTips: [
      'Always forward refs in HOCs using forwardRef',
      'Set display names for all components and HOCs',
      'Use context for compound component state sharing',
      'Validate prop types and function signatures'
    ]
  },

  // 45-50: Adding final challenges to reach 50+
  {
    id: 'react-advanced-state-management',
    title: 'Advanced State Management Issues',
    description: 'Problems with useReducer, complex state updates, and state normalization',
    techStack: 'React',
    difficulty: 'advanced',
    estimatedTime: '26 min',
    xpReward: 190,
    tags: ['React', 'useReducer', 'State Management', 'Normalization'],
    rootCause: 'Improper state management patterns and complex state mutations',
    category: 'State Management',
    files: {
      'AdvancedStateManagement.jsx': `import React, { useState, useReducer, useEffect } from 'react';

// BUG: Reducer with direct state mutations and poor action handling!
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      // BUG: Direct mutation of state!
      state.todos.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
      return state;

    case 'TOGGLE_TODO':
      // BUG: Direct mutation and inefficient search!
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      return state;

    case 'DELETE_TODO':
      // BUG: Direct mutation with splice!
      const index = state.todos.findIndex(t => t.id === action.payload);
      if (index > -1) {
        state.todos.splice(index, 1);
      }
      return state;

    case 'SET_FILTER':
      // BUG: Direct mutation!
      state.filter = action.payload;
      return state;

    default:
      return state;
  }
}

// BUG: Poor initial state structure!
const initialState = {
  todos: [],
  filter: 'all',
  loading: false
};

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState('');

  // BUG: Not handling async operations properly in reducer!
  const handleAddTodo = () => {
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue });
      setInputValue('');
    }
  };

  // BUG: Inefficient filtering on every render!
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div>
      <h1>Todo App</h1>

      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      <div>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
          All
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
          Active
        </button>
        <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
          Completed
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
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`
    },
    hints: [
      'Never mutate state directly in reducers',
      'Use immutable update patterns',
      'Memoize expensive computations',
      'Handle async operations properly with useEffect'
    ],
    solution: {
      'AdvancedStateManagement.jsx': `import React, {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useRef
} from 'react';

// Action types as constants to prevent typos
const ActionTypes = {
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  SET_FILTER: 'SET_FILTER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOAD_TODOS: 'LOAD_TODOS',
  BULK_UPDATE: 'BULK_UPDATE',
  RESET_STATE: 'RESET_STATE'
};

// Filter types
const FilterTypes = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// Utility functions for immutable updates
const updateTodoById = (todos, id, updates) => {
  return todos.map(todo =>
    todo.id === id ? { ...todo, ...updates } : todo
  );
};

const removeTodoById = (todos, id) => {
  return todos.filter(todo => todo.id !== id);
};

// Improved reducer with immutable updates and better error handling
function todoReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_TODO: {
      const { text, id = Date.now() } = action.payload;

      if (!text || !text.trim()) {
        return {
          ...state,
          error: 'Todo text cannot be empty'
        };
      }

      const newTodo = {
        id,
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
        error: null,
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          active: state.stats.active + 1
        }
      };
    }

    case ActionTypes.TOGGLE_TODO: {
      const { id } = action.payload;
      const todo = state.todos.find(t => t.id === id);

      if (!todo) {
        return {
          ...state,
          error: \`Todo with id \${id} not found\`
        };
      }

      const updatedTodos = updateTodoById(state.todos, id, {
        completed: !todo.completed,
        updatedAt: new Date().toISOString()
      });

      const completedCount = updatedTodos.filter(t => t.completed).length;
      const activeCount = updatedTodos.length - completedCount;

      return {
        ...state,
        todos: updatedTodos,
        error: null,
        stats: {
          ...state.stats,
          completed: completedCount,
          active: activeCount
        }
      };
    }

    case ActionTypes.DELETE_TODO: {
      const { id } = action.payload;
      const todo = state.todos.find(t => t.id === id);

      if (!todo) {
        return {
          ...state,
          error: \`Todo with id \${id} not found\`
        };
      }

      const updatedTodos = removeTodoById(state.todos, id);
      const completedCount = updatedTodos.filter(t => t.completed).length;
      const activeCount = updatedTodos.length - completedCount;

      return {
        ...state,
        todos: updatedTodos,
        error: null,
        stats: {
          total: updatedTodos.length,
          completed: completedCount,
          active: activeCount
        }
      };
    }

    case ActionTypes.SET_FILTER: {
      const { filter } = action.payload;

      if (!Object.values(FilterTypes).includes(filter)) {
        return {
          ...state,
          error: \`Invalid filter: \${filter}\`
        };
      }

      return {
        ...state,
        filter,
        error: null
      };
    }

    case ActionTypes.RESET_STATE: {
      return {
        ...initialState,
        filter: state.filter // Preserve filter
      };
    }

    default: {
      console.warn(\`Unknown action type: \${action.type}\`);
      return state;
    }
  }
}

// Improved initial state with better structure
const initialState = {
  todos: [],
  filter: FilterTypes.ALL,
  loading: false,
  error: null,
  stats: {
    total: 0,
    active: 0,
    completed: 0
  }
};

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState('');

  // Memoized filtered todos to prevent unnecessary recalculations
  const filteredTodos = useMemo(() => {
    return state.todos.filter(todo => {
      switch (state.filter) {
        case FilterTypes.ACTIVE:
          return !todo.completed;
        case FilterTypes.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    }).sort((a, b) => {
      // Sort by completion status, then by creation date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [state.todos, state.filter]);

  const handleAddTodo = useCallback(() => {
    if (inputValue.trim()) {
      dispatch({
        type: ActionTypes.ADD_TODO,
        payload: { text: inputValue }
      });
      setInputValue('');
    }
  }, [inputValue]);

  const handleToggleTodo = useCallback((id) => {
    dispatch({
      type: ActionTypes.TOGGLE_TODO,
      payload: { id }
    });
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    dispatch({
      type: ActionTypes.DELETE_TODO,
      payload: { id }
    });
  }, []);

  const handleSetFilter = useCallback((filter) => {
    dispatch({
      type: ActionTypes.SET_FILTER,
      payload: { filter }
    });
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  }, [handleAddTodo]);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Advanced Todo App
      </h1>

      {/* Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleAddTodo}
            disabled={!inputValue.trim()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: !inputValue.trim() ? 0.6 : 1
            }}
          >
            Add Todo
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {Object.entries(FilterTypes).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleSetFilter(value)}
            style={{
              padding: '8px 16px',
              backgroundColor: state.filter === value ? '#007bff' : '#f8f9fa',
              color: state.filter === value ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <span><strong>Total:</strong> {state.stats.total}</span>
        <span><strong>Active:</strong> {state.stats.active}</span>
        <span><strong>Completed:</strong> {state.stats.completed}</span>
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          {state.todos.length === 0
            ? 'No todos yet. Add one above!'
            : 'No todos match the current filter.'
          }
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredTodos.map(todo => (
            <li key={todo.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '8px'
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error Display */}
      {state.error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{state.error}</span>
          <button
            onClick={() => dispatch({ type: ActionTypes.CLEAR_ERROR })}
            style={{
              padding: '4px 8px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '20px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => dispatch({ type: ActionTypes.RESET_STATE })}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

export default TodoApp;`
    },
    testCases: [
      'Reducer should never mutate state directly',
      'Complex state updates should be handled immutably',
      'Expensive computations should be memoized',
      'State should be properly normalized and structured'
    ],
    debuggingSteps: [
      'Check for direct state mutations in reducer',
      'Verify immutable update patterns',
      'Test memoization of expensive computations',
      'Monitor performance with complex state updates'
    ],
    commonMistakes: [
      'Direct state mutations in reducers',
      'Poor state structure and normalization',
      'Not memoizing expensive computations',
      'Inefficient filtering and sorting on every render'
    ],
    productionImpact: 'State inconsistencies, poor performance, unpredictable behavior',
    preventionTips: [
      'Always return new state objects from reducers',
      'Use immutable update patterns consistently',
      'Memoize expensive computations with useMemo',
      'Structure state for optimal updates and queries'
    ]
  },

  // 46-50: Final challenges to complete 50+ target
  {
    id: 'react-micro-frontend-issues',
    title: 'Micro-Frontend Integration Issues',
    description: 'Problems with module federation, shared dependencies, and cross-app communication',
    techStack: 'React',
    difficulty: 'expert',
    estimatedTime: '30 min',
    xpReward: 220,
    tags: ['React', 'Micro-Frontend', 'Module Federation', 'Webpack'],
    rootCause: 'Improper micro-frontend architecture and dependency management',
    category: 'Architecture',
    files: {
      'MicroFrontendApp.jsx': `import React, { useState, useEffect, Suspense, lazy } from 'react';

// BUG: Improper dynamic import without error handling!
const RemoteComponent = lazy(() => import('remote-app/Component'));

// BUG: Shared state without proper isolation!
window.globalState = {
  user: null,
  theme: 'light'
};

// BUG: Direct DOM manipulation in micro-frontend!
function MicroFrontendContainer({ appName, url }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // BUG: Not cleaning up script tags!
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [url]);

  return (
    <div id={\`micro-frontend-\${appName}\`}>
      {loaded ? 'App Loaded' : 'Loading...'}
    </div>
  );
}

// BUG: No error boundaries for remote components!
function App() {
  const [currentApp, setCurrentApp] = useState('home');

  // BUG: Unsafe cross-origin communication!
  useEffect(() => {
    const handleMessage = (event) => {
      // BUG: No origin validation!
      if (event.data.type === 'NAVIGATE') {
        setCurrentApp(event.data.app);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentApp('home')}>Home</button>
        <button onClick={() => setCurrentApp('products')}>Products</button>
        <button onClick={() => setCurrentApp('profile')}>Profile</button>
      </nav>

      {currentApp === 'home' && (
        <Suspense fallback={<div>Loading Home...</div>}>
          <RemoteComponent />
        </Suspense>
      )}

      {currentApp === 'products' && (
        <MicroFrontendContainer
          appName="products"
          url="http://localhost:3001/remoteEntry.js"
        />
      )}

      {currentApp === 'profile' && (
        <MicroFrontendContainer
          appName="profile"
          url="http://localhost:3002/remoteEntry.js"
        />
      )}
    </div>
  );
}

export default App;`
    },
    hints: [
      'Add proper error boundaries for remote components',
      'Validate origins for cross-app communication',
      'Implement proper cleanup for dynamic scripts',
      'Use proper state management for micro-frontends'
    ],
    solution: {
      'MicroFrontendApp.jsx': `import React, {
  useState,
  useEffect,
  Suspense,
  lazy,
  useCallback,
  useRef,
  createContext,
  useContext,
  useMemo
} from 'react';

// Secure dynamic import with proper error handling
const createRemoteComponent = (scope, module) => {
  return lazy(async () => {
    try {
      // Wait for the remote to be available
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(\`Timeout loading remote module: \${scope}/\${module}\`));
        }, 10000);

        const checkRemote = () => {
          if (window[scope]) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(checkRemote, 100);
          }
        };
        checkRemote();
      });

      const container = window[scope];
      await container.init(__webpack_share_scopes__.default);
      const factory = await container.get(module);
      const Module = factory();

      return Module;
    } catch (error) {
      console.error(\`Failed to load remote module \${scope}/\${module}:\`, error);
      // Return fallback component
      return {
        default: () => (
          <div style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>Failed to load remote component</h3>
            <p>The remote application is currently unavailable.</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )
      };
    }
  });
};

// Micro-frontend context for shared state
const MicroFrontendContext = createContext(null);

export function useMicroFrontendContext() {
  const context = useContext(MicroFrontendContext);
  if (!context) {
    throw new Error('useMicroFrontendContext must be used within MicroFrontendProvider');
  }
  return context;
}

// Secure event bus for cross-app communication
class SecureEventBus {
  constructor(allowedOrigins = []) {
    this.allowedOrigins = new Set(allowedOrigins);
    this.listeners = new Map();
    this.messageHandler = this.handleMessage.bind(this);

    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.messageHandler);
    }
  }

  validateOrigin(origin) {
    if (this.allowedOrigins.size === 0) return true;
    return this.allowedOrigins.has(origin) || origin === window.location.origin;
  }

  handleMessage(event) {
    if (!this.validateOrigin(event.origin)) {
      console.warn(\`Rejected message from unauthorized origin: \${event.origin}\`);
      return;
    }

    const { type, payload, id } = event.data;
    if (!type) return;

    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => {
      try {
        listener(payload, { origin: event.origin, id });
      } catch (error) {
        console.error(\`Error in event listener for \${type}:\`, error);
      }
    });
  }

  subscribe(eventType, listener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(listener);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  emit(eventType, payload, targetOrigin = '*') {
    if (typeof window !== 'undefined') {
      const message = {
        type: eventType,
        payload,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString()
      };

      if (targetOrigin === '*' && this.allowedOrigins.size > 0) {
        // Send to all allowed origins
        this.allowedOrigins.forEach(origin => {
          window.postMessage(message, origin);
        });
      } else {
        window.postMessage(message, targetOrigin);
      }
    }
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.messageHandler);
    }
    this.listeners.clear();
  }
}

// Enhanced micro-frontend container with proper lifecycle management
function MicroFrontendContainer({
  appName,
  url,
  scope,
  module = './App',
  fallback = null,
  onLoad,
  onError,
  timeout = 10000
}) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const timeoutRef = useRef(null);

  const cleanup = useCallback(() => {
    if (scriptRef.current) {
      document.head.removeChild(scriptRef.current);
      scriptRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const loadRemoteApp = useCallback(async () => {
    try {
      setStatus('loading');
      setError(null);

      // Set timeout
      timeoutRef.current = setTimeout(() => {
        setError(new Error(\`Timeout loading \${appName}\`));
        setStatus('error');
      }, timeout);

      // Check if already loaded
      if (window[scope]) {
        clearTimeout(timeoutRef.current);
        setStatus('loaded');
        onLoad?.();
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = url;

      script.onload = () => {
        clearTimeout(timeoutRef.current);
        setStatus('loaded');
        onLoad?.();
      };

      script.onerror = (event) => {
        clearTimeout(timeoutRef.current);
        const error = new Error(\`Failed to load script: \${url}\`);
        setError(error);
        setStatus('error');
        onError?.(error);
      };

      scriptRef.current = script;
      document.head.appendChild(script);

    } catch (error) {
      clearTimeout(timeoutRef.current);
      setError(error);
      setStatus('error');
      onError?.(error);
    }
  }, [appName, url, scope, timeout, onLoad, onError]);

  useEffect(() => {
    loadRemoteApp();
    return cleanup;
  }, [loadRemoteApp, cleanup]);

  const handleRetry = useCallback(() => {
    cleanup();
    loadRemoteApp();
  }, [cleanup, loadRemoteApp]);

  if (status === 'loading') {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>Loading {appName}...</div>
        <div style={{
          marginTop: '10px',
          fontSize: '14px',
          color: '#666'
        }}>
          Please wait while we load the remote application.
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return fallback || (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Failed to load {appName}</h3>
        <p>{error?.message || 'Unknown error occurred'}</p>
        <button
          onClick={handleRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={\`micro-frontend-\${appName}\`}
      style={{ minHeight: '200px' }}
    >
      {/* Remote app will be rendered here */}
    </div>
  );
}

// Error boundary for remote components
class RemoteComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Remote component error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Remote Component Error</h3>
          <p>{this.state.error?.message || 'Something went wrong'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Micro-frontend provider
function MicroFrontendProvider({ children, allowedOrigins = [] }) {
  const [globalState, setGlobalState] = useState({
    user: null,
    theme: 'light',
    language: 'en'
  });

  const eventBusRef = useRef(null);

  useEffect(() => {
    eventBusRef.current = new SecureEventBus(allowedOrigins);

    // Subscribe to global state updates
    const unsubscribe = eventBusRef.current.subscribe('GLOBAL_STATE_UPDATE', (payload) => {
      setGlobalState(prevState => ({
        ...prevState,
        ...payload
      }));
    });

    return () => {
      unsubscribe();
      eventBusRef.current?.destroy();
    };
  }, [allowedOrigins]);

  const updateGlobalState = useCallback((updates) => {
    setGlobalState(prevState => {
      const newState = { ...prevState, ...updates };

      // Broadcast to other micro-frontends
      eventBusRef.current?.emit('GLOBAL_STATE_UPDATE', updates);

      return newState;
    });
  }, []);

  const contextValue = useMemo(() => ({
    globalState,
    updateGlobalState,
    eventBus: eventBusRef.current
  }), [globalState, updateGlobalState]);

  return (
    <MicroFrontendContext.Provider value={contextValue}>
      {children}
    </MicroFrontendContext.Provider>
  );
}

// Navigation component
function Navigation({ currentApp, onNavigate }) {
  const { globalState } = useMicroFrontendContext();

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav style={{
      display: 'flex',
      gap: '10px',
      padding: '15px',
      backgroundColor: globalState.theme === 'dark' ? '#333' : '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            padding: '10px 20px',
            backgroundColor: currentApp === item.id ? '#007bff' : 'transparent',
            color: currentApp === item.id ? 'white' : (globalState.theme === 'dark' ? 'white' : '#333'),
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

// Main App component
function App() {
  const [currentApp, setCurrentApp] = useState('home');
  const { globalState, updateGlobalState, eventBus } = useMicroFrontendContext();

  // Create remote components
  const RemoteHome = useMemo(() =>
    createRemoteComponent('homeApp', './App'), []);
  const RemoteProducts = useMemo(() =>
    createRemoteComponent('productsApp', './App'), []);

  useEffect(() => {
    if (!eventBus) return;

    // Subscribe to navigation events from remote apps
    const unsubscribe = eventBus.subscribe('NAVIGATE', (payload) => {
      if (payload.app && payload.app !== currentApp) {
        setCurrentApp(payload.app);
      }
    });

    return unsubscribe;
  }, [eventBus, currentApp]);

  const handleNavigate = useCallback((app) => {
    setCurrentApp(app);

    // Broadcast navigation to other micro-frontends
    eventBus?.emit('NAVIGATE', { app, timestamp: Date.now() });
  }, [eventBus]);

  const handleThemeToggle = useCallback(() => {
    const newTheme = globalState.theme === 'light' ? 'dark' : 'light';
    updateGlobalState({ theme: newTheme });
  }, [globalState.theme, updateGlobalState]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: globalState.theme === 'dark' ? '#222' : '#fff',
      color: globalState.theme === 'dark' ? '#fff' : '#333',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Micro-Frontend Shell</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>Theme: {globalState.theme}</span>
          <button
            onClick={handleThemeToggle}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Toggle Theme
          </button>
        </div>
      </header>

      <Navigation currentApp={currentApp} onNavigate={handleNavigate} />

      <main style={{ minHeight: '400px' }}>
        {currentApp === 'home' && (
          <RemoteComponentErrorBoundary>
            <Suspense fallback={<div>Loading Home App...</div>}>
              <RemoteHome />
            </Suspense>
          </RemoteComponentErrorBoundary>
        )}

        {currentApp === 'products' && (
          <RemoteComponentErrorBoundary>
            <MicroFrontendContainer
              appName="Products"
              scope="productsApp"
              url="http://localhost:3001/remoteEntry.js"
              onLoad={() => console.log('Products app loaded')}
              onError={(error) => console.error('Products app error:', error)}
            />
          </RemoteComponentErrorBoundary>
        )}

        {currentApp === 'profile' && (
          <RemoteComponentErrorBoundary>
            <Suspense fallback={<div>Loading Profile App...</div>}>
              <RemoteProducts />
            </Suspense>
          </RemoteComponentErrorBoundary>
        )}
      </main>

      <footer style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: globalState.theme === 'dark' ? '#333' : '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>Micro-Frontend Architecture Demo</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Current App: {currentApp} | Theme: {globalState.theme}
        </p>
      </footer>
    </div>
  );
}

// Main App with Provider
function AppWithProvider() {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ];

  return (
    <MicroFrontendProvider allowedOrigins={allowedOrigins}>
      <App />
    </MicroFrontendProvider>
  );
}

export default AppWithProvider;`
    },
    testCases: [
      'Remote components should have proper error boundaries',
      'Cross-app communication should validate origins',
      'Dynamic scripts should be properly cleaned up',
      'Shared state should be isolated and secure'
    ],
    debuggingSteps: [
      'Check error boundaries for remote component failures',
      'Verify origin validation for postMessage events',
      'Test script cleanup on component unmount',
      'Monitor shared state updates across apps'
    ],
    commonMistakes: [
      'Missing error boundaries for remote components',
      'Unsafe cross-origin communication',
      'Memory leaks from uncleared scripts',
      'Global state pollution between apps'
    ],
    productionImpact: 'Security vulnerabilities, memory leaks, app crashes, poor user experience',
    preventionTips: [
      'Always wrap remote components in error boundaries',
      'Validate origins for all cross-app communication',
      'Implement proper cleanup for dynamic resources',
      'Use secure state management patterns'
    ]
  },

  {
    id: 'react-advanced-optimization',
    title: 'Advanced Performance Optimization Issues',
    description: 'Complex performance problems with React DevTools, profiling, and optimization techniques',
    techStack: 'React',
    difficulty: 'expert',
    estimatedTime: '28 min',
    xpReward: 200,
    tags: ['React', 'Performance', 'Optimization', 'Profiling', 'DevTools'],
    rootCause: 'Lack of proper performance monitoring and optimization strategies',
    category: 'Performance',
    files: {
      'PerformanceOptimization.jsx': `import React, { useState, useEffect, useMemo, useCallback } from 'react';

// BUG: Heavy computation without proper memoization!
function ExpensiveComponent({ data, filter }) {
  // BUG: Expensive calculation on every render!
  const processedData = data.map(item => ({
    ...item,
    processed: heavyComputation(item),
    filtered: item.category === filter
  })).filter(item => item.filtered);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}: {item.processed}</div>
      ))}
    </div>
  );
}

// BUG: Expensive function not memoized!
function heavyComputation(item) {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.random() * item.value;
  }
  return result.toFixed(2);
}

// BUG: Component causing unnecessary re-renders!
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState([]);

  // BUG: Creating new objects on every render!
  const config = {
    theme: 'dark',
    showDetails: true
  };

  // BUG: Not memoizing callback!
  const handleItemClick = (id) => {
    console.log('Clicked item:', id);
  };

  // BUG: Expensive data generation on every render!
  const generateData = () => {
    return Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: \`Item \${i}\`,
      value: Math.random() * 100,
      category: ['A', 'B', 'C'][i % 3]
    }));
  };

  useEffect(() => {
    setData(generateData());
  }, []);

  return (
    <div>
      <h1>Performance Issues Demo</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="A">Category A</option>
        <option value="B">Category B</option>
        <option value="C">Category C</option>
      </select>

      <ExpensiveComponent
        data={data}
        filter={filter}
        config={config}
        onItemClick={handleItemClick}
      />
    </div>
  );
}

export default ParentComponent;`
    },
    hints: [
      'Use React.memo for expensive components',
      'Memoize expensive calculations with useMemo',
      'Use useCallback for event handlers',
      'Implement proper profiling and monitoring'
    ],
    solution: {
      'PerformanceOptimization.jsx': `import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
  startTransition,
  useDeferredValue,
  Profiler
} from 'react';

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  startMeasure(name) {
    performance.mark(\`\${name}-start\`);
  }

  endMeasure(name) {
    performance.mark(\`\${name}-end\`);
    performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);

    const measure = performance.getEntriesByName(name, 'measure')[0];
    this.metrics.set(name, {
      duration: measure.duration,
      timestamp: Date.now()
    });

    // Notify observers
    this.observers.forEach(observer => observer(name, measure.duration));

    // Clean up marks and measures
    performance.clearMarks(\`\${name}-start\`);
    performance.clearMarks(\`\${name}-end\`);
    performance.clearMeasures(name);
  }

  subscribe(observer) {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  reset() {
    this.metrics.clear();
  }
}

const performanceMonitor = new PerformanceMonitor();

// Custom hook for performance monitoring
function usePerformanceMonitor(componentName) {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    lastRenderTimeRef.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(\`\${componentName} rendered \${renderCountRef.current} times. Time since last render: \${timeSinceLastRender}ms\`);
    }
  });

  const startMeasure = useCallback((measureName) => {
    performanceMonitor.startMeasure(\`\${componentName}-\${measureName}\`);
  }, [componentName]);

  const endMeasure = useCallback((measureName) => {
    performanceMonitor.endMeasure(\`\${componentName}-\${measureName}\`);
  }, [componentName]);

  return { startMeasure, endMeasure, renderCount: renderCountRef.current };
}

// Memoized expensive computation
const heavyComputation = useMemo(() => {
  const cache = new Map();

  return (item) => {
    const cacheKey = \`\${item.id}-\${item.value}\`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    let result = 0;
    for (let i = 0; i < 100000; i++) { // Reduced for better UX
      result += Math.random() * item.value;
    }

    const finalResult = result.toFixed(2);
    cache.set(cacheKey, finalResult);

    return finalResult;
  };
}, []);

// Optimized expensive component with proper memoization
const ExpensiveComponent = memo(({ data, filter, config, onItemClick }) => {
  const { startMeasure, endMeasure } = usePerformanceMonitor('ExpensiveComponent');

  // Defer filter value for better performance
  const deferredFilter = useDeferredValue(filter);

  // Memoize expensive data processing
  const processedData = useMemo(() => {
    startMeasure('data-processing');

    const result = data
      .filter(item => deferredFilter === 'all' || item.category === deferredFilter)
      .map(item => ({
        ...item,
        processed: heavyComputation(item)
      }));

    endMeasure('data-processing');
    return result;
  }, [data, deferredFilter, startMeasure, endMeasure]);

  // Virtualization for large lists
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const containerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const itemHeight = 40; // Approximate item height
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + Math.ceil(clientHeight / itemHeight) + 5, processedData.length);

    setVisibleRange({ start, end });
  }, [processedData.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const visibleItems = processedData.slice(visibleRange.start, visibleRange.end);
  const totalHeight = processedData.length * 40;
  const offsetY = visibleRange.start * 40;

  return (
    <div
      ref={containerRef}
      style={{
        height: '400px',
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: \`translateY(\${offsetY}px)\` }}>
          {visibleItems.map((item, index) => (
            <ExpensiveItem
              key={item.id}
              item={item}
              config={config}
              onItemClick={onItemClick}
              style={{
                height: '40px',
                padding: '8px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{
        padding: '10px',
        backgroundColor: '#f8f9fa',
        fontSize: '12px',
        color: '#666'
      }}>
        Showing {visibleRange.start + 1}-{Math.min(visibleRange.end, processedData.length)} of {processedData.length} items
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.data === nextProps.data &&
    prevProps.filter === nextProps.filter &&
    JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config) &&
    prevProps.onItemClick === nextProps.onItemClick
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

// Memoized item component
const ExpensiveItem = memo(({ item, config, onItemClick, style }) => {
  const handleClick = useCallback(() => {
    onItemClick(item.id);
  }, [item.id, onItemClick]);

  return (
    <div style={style}>
      <div>
        <strong>{item.name}</strong> (Category: {item.category})
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Processed: {item.processed}</span>
        {config.showDetails && (
          <span style={{ fontSize: '12px', color: '#666' }}>
            Value: {item.value.toFixed(2)}
          </span>
        )}
        <button
          onClick={handleClick}
          style={{
            padding: '4px 8px',
            backgroundColor: config.theme === 'dark' ? '#333' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          View
        </button>
      </div>
    </div>
  );
});

ExpensiveItem.displayName = 'ExpensiveItem';

// Performance metrics component
const PerformanceMetrics = memo(() => {
  const [metrics, setMetrics] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((name, duration) => {
      setMetrics(prev => ({
        ...prev,
        [name]: duration
      }));
    });

    return unsubscribe;
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '16px',
          width: '50px',
          height: '50px'
        }}
      >
        📊
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h4 style={{ margin: 0 }}>Performance Metrics</h4>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ fontSize: '12px' }}>
        {Object.entries(metrics).map(([name, duration]) => (
          <div key={name} style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            padding: '2px 0'
          }}>
            <span>{name}:</span>
            <span style={{
              fontWeight: 'bold',
              color: duration > 16 ? '#dc3545' : duration > 8 ? '#ffc107' : '#28a745'
            }}>
              {duration.toFixed(2)}ms
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          performanceMonitor.reset();
          setMetrics({});
        }}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Reset Metrics
      </button>
    </div>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';

// Optimized parent component
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { startMeasure, endMeasure } = usePerformanceMonitor('ParentComponent');

  // Memoize configuration object
  const config = useMemo(() => ({
    theme: 'dark',
    showDetails: true
  }), []);

  // Memoize callback to prevent unnecessary re-renders
  const handleItemClick = useCallback((id) => {
    console.log('Clicked item:', id);
    // Could trigger analytics, navigation, etc.
  }, []);

  // Memoize data generation
  const generateData = useCallback(() => {
    startMeasure('data-generation');

    const newData = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: \`Item \${i}\`,
      value: Math.random() * 100,
      category: ['A', 'B', 'C'][i % 3]
    }));

    endMeasure('data-generation');
    return newData;
  }, [startMeasure, endMeasure]);

  // Use startTransition for non-urgent updates
  const handleFilterChange = useCallback((newFilter) => {
    startTransition(() => {
      setFilter(newFilter);
    });
  }, []);

  const handleGenerateData = useCallback(() => {
    setIsGenerating(true);

    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      const newData = generateData();
      setData(newData);
      setIsGenerating(false);
    }, 0);
  }, [generateData]);

  useEffect(() => {
    handleGenerateData();
  }, [handleGenerateData]);

  // Profiler callback for React DevTools
  const onRenderCallback = useCallback((id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Profiler:', {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      });
    }
  }, []);

  return (
    <Profiler id="ParentComponent" onRender={onRenderCallback}>
      <div style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h1>Advanced Performance Optimization</h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Renders: {count}</span>
            <button
              onClick={() => setCount(c => c + 1)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Force Re-render
            </button>
          </div>
        </header>

        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
          alignItems: 'center',
          padding: '15px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px'
        }}>
          <label>
            Filter:
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              style={{
                marginLeft: '8px',
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">All Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
            </select>
          </label>

          <button
            onClick={handleGenerateData}
            disabled={isGenerating}
            style={{
              padding: '8px 16px',
              backgroundColor: isGenerating ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? 'Generating...' : 'Regenerate Data'}
          </button>

          <div style={{ fontSize: '14px', color: '#666' }}>
            Total Items: {data.length}
          </div>
        </div>

        {data.length > 0 ? (
          <ExpensiveComponent
            data={data}
            filter={filter}
            config={config}
            onItemClick={handleItemClick}
          />
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            {isGenerating ? 'Generating data...' : 'No data available'}
          </div>
        )}

        <PerformanceMetrics />
      </div>
    </Profiler>
  );
}

export default ParentComponent;`
    },
    testCases: [
      'Components should be properly memoized to prevent unnecessary re-renders',
      'Expensive computations should be cached and optimized',
      'Large lists should implement virtualization',
      'Performance metrics should be monitored and displayed'
    ],
    debuggingSteps: [
      'Use React DevTools Profiler to identify performance bottlenecks',
      'Check component re-render frequency and causes',
      'Monitor expensive computation timing',
      'Verify memoization effectiveness'
    ],
    commonMistakes: [
      'Not memoizing expensive components and computations',
      'Creating new objects/functions on every render',
      'Not implementing virtualization for large lists',
      'Lack of performance monitoring and profiling'
    ],
    productionImpact: 'Poor user experience, high CPU usage, slow interactions, battery drain',
    preventionTips: [
      'Use React.memo for expensive components',
      'Memoize computations with useMemo and callbacks with useCallback',
      'Implement virtualization for large datasets',
      'Monitor performance with React DevTools and custom metrics'
    ]
  },

  // 48-50: Final challenges to complete 50+ target
  {
    id: 'react-ssr-hydration-issues',
    title: 'Server-Side Rendering and Hydration Issues',
    description: 'Problems with SSR, hydration mismatches, and client-server inconsistencies',
    techStack: 'React',
    difficulty: 'expert',
    estimatedTime: '32 min',
    xpReward: 230,
    tags: ['React', 'SSR', 'Hydration', 'Next.js', 'Server-Side'],
    rootCause: 'Improper SSR implementation and hydration mismatch handling',
    category: 'SSR/Hydration',
    files: {
      'SSRHydrationIssues.jsx': `import React, { useState, useEffect } from 'react';

// BUG: Component causing hydration mismatch!
function HydrationMismatchComponent() {
  const [isClient, setIsClient] = useState(false);

  // BUG: Different content on server vs client!
  const currentTime = new Date().toLocaleString();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <h2>Current Time: {currentTime}</h2>
      <p>Random number: {Math.random()}</p>
      {/* BUG: Conditional rendering causing mismatch! */}
      {typeof window !== 'undefined' && (
        <p>Window width: {window.innerWidth}px</p>
      )}
    </div>
  );
}

// BUG: Using localStorage during SSR!
function LocalStorageComponent() {
  const [theme, setTheme] = useState(() => {
    // BUG: localStorage not available on server!
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      padding: '20px'
    }}>
      <h3>Theme: {theme}</h3>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

// BUG: Async data fetching causing hydration issues!
function AsyncDataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // BUG: Fetching data after hydration!
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  // BUG: Different content during SSR vs hydration!
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Data from API:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>SSR Hydration Issues</h1>
      <HydrationMismatchComponent />
      <LocalStorageComponent />
      <AsyncDataComponent />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Use suppressHydrationWarning for unavoidable mismatches',
      'Implement proper client-side only rendering patterns',
      'Handle localStorage safely with useEffect',
      'Pre-fetch data for SSR to avoid hydration mismatches'
    ],
    solution: {
      'SSRHydrationIssues.jsx': `import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  createContext,
  useContext
} from 'react';

// SSR-safe context for client-side state
const ClientContext = createContext({
  isClient: false,
  clientData: null
});

// Custom hook for SSR-safe client detection
function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Custom hook for SSR-safe localStorage
function useLocalStorage(key, defaultValue) {
  const isClient = useIsClient();

  const [value, setValue] = useState(() => {
    // Only access localStorage on client side
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key]);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(\`Error parsing localStorage value for key "\${key}":\`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, isClient]);

  return [value, setStoredValue];
}

// SSR-safe component with proper hydration handling
function HydrationSafeComponent() {
  const isClient = useIsClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Static content that's the same on server and client
  const staticContent = useMemo(() => (
    <div>
      <h2>SSR-Safe Component</h2>
      <p>This content is identical on server and client.</p>
    </div>
  ), []);

  // Client-only content with proper suppression
  const clientOnlyContent = useMemo(() => {
    if (!isClient || !mounted) {
      return (
        <div suppressHydrationWarning>
          <p>Loading client-specific content...</p>
        </div>
      );
    }

    return (
      <div suppressHydrationWarning>
        <p>Current time: {new Date().toLocaleString()}</p>
        <p>Random number: {Math.random().toFixed(4)}</p>
        <p>Window dimensions: {window.innerWidth} × {window.innerHeight}</p>
        <p>User agent: {navigator.userAgent.substring(0, 50)}...</p>
      </div>
    );
  }, [isClient, mounted]);

  return (
    <div>
      {staticContent}
      {clientOnlyContent}
    </div>
  );
}

// Theme component with SSR-safe localStorage
function ThemeComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const isClient = useIsClient();

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  const themeStyles = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#333',
    padding: '20px',
    borderRadius: '8px',
    border: \`2px solid \${theme === 'dark' ? '#555' : '#ddd'}\`,
    transition: 'all 0.3s ease'
  }), [theme]);

  return (
    <div style={themeStyles}>
      <h3>Theme Manager</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>Client-side: {isClient ? 'Yes' : 'No'}</p>

      <button
        onClick={toggleTheme}
        style={{
          padding: '10px 20px',
          backgroundColor: theme === 'dark' ? '#007bff' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
      </button>

      {isClient && (
        <div style={{ marginTop: '15px', fontSize: '14px', opacity: 0.8 }}>
          <p>Theme preference saved to localStorage</p>
          <p>Changes will persist across sessions</p>
        </div>
      )}
    </div>
  );
}

// Data fetching component with SSR support
function DataComponent({ initialData = null }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const isClient = useIsClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
        items: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: \`Item \${i + 1}\`,
          value: Math.floor(Math.random() * 100)
        }))
      };

      setData(mockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch on client if no initial data
  useEffect(() => {
    if (isClient && !initialData) {
      fetchData();
    }
  }, [isClient, initialData, fetchData]);

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>Loading data...</div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          {isClient ? 'Fetching from client' : 'Server-side rendering'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px'
      }}>
        <h4>Error loading data</h4>
        <p>{error}</p>
        <button
          onClick={fetchData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e9ecef',
      borderRadius: '8px'
    }}>
      <h3>Data Component</h3>
      <div style={{ marginBottom: '15px' }}>
        <strong>Data Source:</strong> {initialData ? 'SSR (Pre-fetched)' : 'Client-side'}
      </div>

      {data && (
        <div>
          <p><strong>Timestamp:</strong> {data.timestamp}</p>
          <p><strong>Random Value:</strong> {data.randomValue?.toFixed(4)}</p>

          <h4>Items:</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            {data.items?.map(item => (
              <li key={item.id}>
                {item.name}: {item.value}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={fetchData}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '10px'
        }}
      >
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
    </div>
  );
}

// Client provider component
function ClientProvider({ children }) {
  const isClient = useIsClient();
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    if (isClient) {
      setClientData({
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      });
    }
  }, [isClient]);

  const contextValue = useMemo(() => ({
    isClient,
    clientData
  }), [isClient, clientData]);

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
}

// Browser info component
function BrowserInfoComponent() {
  const { isClient, clientData } = useContext(ClientContext);

  if (!isClient || !clientData) {
    return (
      <div suppressHydrationWarning style={{
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px'
      }}>
        <h3>Browser Information</h3>
        <p>Loading browser information...</p>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning style={{
      padding: '20px',
      backgroundColor: '#d1ecf1',
      borderRadius: '8px'
    }}>
      <h3>Browser Information</h3>
      <div style={{ fontSize: '14px' }}>
        <p><strong>Platform:</strong> {clientData.platform}</p>
        <p><strong>Language:</strong> {clientData.language}</p>
        <p><strong>Cookies Enabled:</strong> {clientData.cookieEnabled ? 'Yes' : 'No'}</p>
        <p><strong>Online Status:</strong> {clientData.onLine ? 'Online' : 'Offline'}</p>
        <p><strong>User Agent:</strong> {clientData.userAgent.substring(0, 80)}...</p>
      </div>
    </div>
  );
}

// Main App component with SSR support
function App({ initialData }) {
  return (
    <ClientProvider>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '8px'
        }}>
          <h1>SSR & Hydration Best Practices</h1>
          <p>Demonstrating proper server-side rendering and hydration techniques</p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <HydrationSafeComponent />
          <ThemeComponent />
          <DataComponent initialData={initialData} />
          <BrowserInfoComponent />
        </div>

        <footer style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          <p>This demo shows proper SSR and hydration patterns</p>
          <p>All components handle server-client differences gracefully</p>
        </footer>
      </div>
    </ClientProvider>
  );
}

// Export for SSR frameworks like Next.js
export async function getServerSideProps() {
  // Pre-fetch data on the server
  const initialData = {
    timestamp: new Date().toISOString(),
    randomValue: Math.random(),
    items: Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: \`SSR Item \${i + 1}\`,
      value: Math.floor(Math.random() * 100)
    }))
  };

  return {
    props: {
      initialData
    }
  };
}

export default App;`
    },
    testCases: [
      'Components should render consistently on server and client',
      'Client-only content should use suppressHydrationWarning',
      'localStorage should be accessed safely with useEffect',
      'Data should be pre-fetched for SSR when possible'
    ],
    debuggingSteps: [
      'Check browser console for hydration warnings',
      'Verify server and client HTML match',
      'Test localStorage access patterns',
      'Monitor data fetching timing and consistency'
    ],
    commonMistakes: [
      'Accessing browser APIs during SSR',
      'Different content on server vs client',
      'Not handling localStorage safely',
      'Fetching data after hydration instead of during SSR'
    ],
    productionImpact: 'Hydration errors, poor SEO, flash of unstyled content, degraded user experience',
    preventionTips: [
      'Use useEffect for client-only code',
      'Implement proper SSR-safe patterns',
      'Pre-fetch data during SSR when possible',
      'Use suppressHydrationWarning judiciously for unavoidable mismatches'
    ]
  },

  {
    id: 'react-concurrent-features',
    title: 'React 18 Concurrent Features Issues',
    description: 'Problems with Suspense, startTransition, useDeferredValue, and concurrent rendering',
    techStack: 'React',
    difficulty: 'expert',
    estimatedTime: '30 min',
    xpReward: 210,
    tags: ['React', 'React 18', 'Concurrent', 'Suspense', 'Transitions'],
    rootCause: 'Improper use of React 18 concurrent features and rendering patterns',
    category: 'Concurrent Features',
    files: {
      'ConcurrentFeatures.jsx': `import React, { useState, useTransition, useDeferredValue, Suspense } from 'react';

// BUG: Heavy computation blocking UI updates!
function ExpensiveList({ items, filter }) {
  // BUG: Not using concurrent features for expensive operations!
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  ).map(item => ({
    ...item,
    processed: heavyComputation(item) // BUG: Blocking computation!
  }));

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}: {item.processed}</li>
      ))}
    </ul>
  );
}

function heavyComputation(item) {
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.random() * item.value;
  }
  return result.toFixed(2);
}

// BUG: Not using Suspense properly for data fetching!
function DataComponent() {
  const [data, setData] = useState(null);

  // BUG: Traditional data fetching instead of Suspense!
  React.useEffect(() => {
    fetchData().then(setData);
  }, []);

  if (!data) {
    return <div>Loading...</div>; // BUG: Manual loading state!
  }

  return <div>{JSON.stringify(data)}</div>;
}

async function fetchData() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'Data loaded!' };
}

function App() {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);

  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: \`Item \${i}\`,
    value: Math.random() * 100
  }));

  return (
    <div>
      <h1>Concurrent Features Issues</h1>

      <div>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter items..."
        />
      </div>

      <ExpensiveList items={items} filter={filter} />
      <DataComponent />
    </div>
  );
}

export default App;`
    },
    hints: [
      'Use startTransition for non-urgent updates',
      'Implement useDeferredValue for expensive computations',
      'Use Suspense for data fetching with proper error boundaries',
      'Leverage concurrent rendering for better user experience'
    ],
    solution: {
      'ConcurrentFeatures.jsx': `import React, {
  useState,
  useTransition,
  useDeferredValue,
  Suspense,
  useMemo,
  useCallback,
  startTransition,
  use,
  cache
} from 'react';

// Cache for expensive computations
const computationCache = new Map();

// Optimized heavy computation with caching
function heavyComputation(item) {
  const cacheKey = \`\${item.id}-\${item.value}\`;

  if (computationCache.has(cacheKey)) {
    return computationCache.get(cacheKey);
  }

  let result = 0;
  // Reduced iterations for better UX
  for (let i = 0; i < 100000; i++) {
    result += Math.random() * item.value;
  }

  const finalResult = result.toFixed(2);
  computationCache.set(cacheKey, finalResult);

  return finalResult;
}

// Concurrent-safe expensive list component
function ExpensiveList({ items, filter }) {
  // Use deferred value to prevent blocking urgent updates
  const deferredFilter = useDeferredValue(filter);

  // Memoize expensive filtering and processing
  const processedItems = useMemo(() => {
    console.log('Processing items with filter:', deferredFilter);

    return items
      .filter(item =>
        deferredFilter === '' ||
        item.name.toLowerCase().includes(deferredFilter.toLowerCase())
      )
      .slice(0, 100) // Limit results for better performance
      .map(item => ({
        ...item,
        processed: heavyComputation(item)
      }));
  }, [items, deferredFilter]);

  // Show loading state when filter is being processed
  const isStale = filter !== deferredFilter;

  return (
    <div style={{ position: 'relative' }}>
      {isStale && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          borderRadius: '8px'
        }}>
          <div style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            Updating results...
          </div>
        </div>
      )}

      <div style={{
        opacity: isStale ? 0.6 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        <h3>Filtered Items ({processedItems.length} results)</h3>
        <ul style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px'
        }}>
          {processedItems.map(item => (
            <li key={item.id} style={{
              padding: '8px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{item.name}</span>
              <span style={{ fontWeight: 'bold', color: '#007bff' }}>
                {item.processed}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Cached data fetcher for Suspense
const fetchData = cache(async (id) => {
  console.log(\`Fetching data for id: \${id}\`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate potential failure
  if (Math.random() < 0.1) {
    throw new Error('Random network error occurred');
  }

  return {
    id,
    message: \`Data loaded for ID: \${id}\`,
    timestamp: new Date().toISOString(),
    items: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: \`Data Item \${i + 1}\`,
      value: Math.floor(Math.random() * 100)
    }))
  };
});

// Suspense-based data component
function DataComponent({ dataId }) {
  // Use the 'use' hook for data fetching with Suspense
  const data = use(fetchData(dataId));

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e9ecef',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>Suspense Data Component</h3>
      <div style={{ marginBottom: '15px' }}>
        <strong>Message:</strong> {data.message}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <strong>Loaded at:</strong> {data.timestamp}
      </div>

      <h4>Data Items:</h4>
      <ul>
        {data.items.map(item => (
          <li key={item.id}>
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Error boundary for Suspense
class SuspenseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Suspense error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message || 'Unknown error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
function LoadingFallback({ message = 'Loading...' }) {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '2px dashed #dee2e6'
    }}>
      <div style={{
        display: 'inline-block',
        width: '20px',
        height: '20px',
        border: '3px solid #007bff',
        borderTop: '3px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '10px'
      }} />
      <span>{message}</span>

      <style jsx>{\`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  );
}

// Performance metrics component
function PerformanceMetrics({ renderCount, transitionCount }) {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '14px',
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>Performance Metrics</h4>
      <div>Renders: {renderCount}</div>
      <div>Transitions: {transitionCount}</div>
      <div style={{
        marginTop: '10px',
        fontSize: '12px',
        color: '#666'
      }}>
        React 18 Concurrent Features
      </div>
    </div>
  );
}

// Main App component with concurrent features
function App() {
  const [filter, setFilter] = useState('');
  const [count, setCount] = useState(0);
  const [dataId, setDataId] = useState(1);
  const [renderCount, setRenderCount] = useState(0);
  const [transitionCount, setTransitionCount] = useState(0);

  // Use transition for non-urgent updates
  const [isPending, startTransition] = useTransition();

  // Track renders
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  // Generate items (memoized to prevent recreation)
  const items = useMemo(() =>
    Array.from({ length: 2000 }, (_, i) => ({
      id: i,
      name: \`Item \${i + 1}\`,
      value: Math.random() * 100
    })), []
  );

  // Handle urgent updates (like counter)
  const handleCountClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // Handle non-urgent updates with transition
  const handleFilterChange = useCallback((e) => {
    const newFilter = e.target.value;

    // Update input immediately (urgent)
    setFilter(newFilter);

    // Defer expensive filtering (non-urgent)
    startTransition(() => {
      setTransitionCount(prev => prev + 1);
      // The actual filtering happens in ExpensiveList with useDeferredValue
    });
  }, []);

  const handleDataRefresh = useCallback(() => {
    startTransition(() => {
      setDataId(prev => prev + 1);
      setTransitionCount(prev => prev + 1);
    });
  }, []);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <PerformanceMetrics
        renderCount={renderCount}
        transitionCount={transitionCount}
      />

      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '8px'
      }}>
        <h1>React 18 Concurrent Features</h1>
        <p>Demonstrating startTransition, useDeferredValue, and Suspense</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Urgent updates section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#d4edda',
          borderRadius: '8px'
        }}>
          <h3>Urgent Updates</h3>
          <p>These updates happen immediately and are not interrupted:</p>
          <button
            onClick={handleCountClick}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Count: {count}
          </button>
        </div>

        {/* Non-urgent updates section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px'
        }}>
          <h3>Non-Urgent Updates</h3>
          <p>These updates can be interrupted by urgent ones:</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={filter}
              onChange={handleFilterChange}
              placeholder="Filter items (try typing fast)..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            {isPending && (
              <div style={{
                padding: '5px 10px',
                backgroundColor: '#ffc107',
                color: '#856404',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap'
              }}>
                Updating...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expensive list with concurrent features */}
      <ExpensiveList items={items} filter={filter} />

      {/* Suspense data fetching */}
      <div style={{ marginTop: '30px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3>Suspense Data Fetching</h3>
          <button
            onClick={handleDataRefresh}
            disabled={isPending}
            style={{
              padding: '8px 16px',
              backgroundColor: isPending ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {isPending ? 'Loading...' : \`Refresh Data (ID: \${dataId})\`}
          </button>
        </div>

        <SuspenseErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading data with Suspense..." />}>
            <DataComponent dataId={dataId} />
          </Suspense>
        </SuspenseErrorBoundary>
      </div>

      <footer style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#666'
      }}>
        <p><strong>Key Concepts Demonstrated:</strong></p>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <li>✅ startTransition for non-urgent updates</li>
          <li>✅ useDeferredValue for expensive computations</li>
          <li>✅ Suspense for data fetching</li>
          <li>✅ Error boundaries for resilience</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;`
    },
    testCases: [
      'Urgent updates should not be interrupted by non-urgent ones',
      'useDeferredValue should prevent blocking during expensive operations',
      'Suspense should handle data fetching with proper fallbacks',
      'Transitions should be marked as pending during updates'
    ],
    debuggingSteps: [
      'Use React DevTools Profiler to identify blocking updates',
      'Check if startTransition is used for non-urgent updates',
      'Verify useDeferredValue prevents UI blocking',
      'Test Suspense fallbacks and error boundaries'
    ],
    commonMistakes: [
      'Not using startTransition for expensive updates',
      'Blocking UI with synchronous expensive computations',
      'Not implementing proper Suspense fallbacks',
      'Missing error boundaries for Suspense components'
    ],
    productionImpact: 'Poor user experience, blocked interactions, slow response times, app crashes',
    preventionTips: [
      'Use startTransition for all non-urgent state updates',
      'Implement useDeferredValue for expensive computations',
      'Always wrap Suspense components with error boundaries',
      'Monitor performance with React DevTools Profiler'
    ]
  },

  {
    id: 'react-testing-debugging',
    title: 'Advanced Testing and Debugging Issues',
    description: 'Complex problems with Jest, React Testing Library, debugging tools, and test patterns',
    techStack: 'React',
    difficulty: 'expert',
    estimatedTime: '35 min',
    xpReward: 240,
    tags: ['React', 'Testing', 'Jest', 'RTL', 'Debugging', 'DevTools'],
    rootCause: 'Improper testing patterns and debugging strategies',
    category: 'Testing/Debugging',
    files: {
      'TestingDebugging.jsx': `import React, { useState, useEffect, useContext, createContext } from 'react';

// BUG: Component not properly testable!
const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // BUG: Hard to mock API call!
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// BUG: Component with hard-to-test side effects!
function UserProfile() {
  const { user } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  // BUG: Direct DOM manipulation!
  useEffect(() => {
    if (editing) {
      document.title = 'Editing Profile';
    } else {
      document.title = 'User Profile';
    }
  }, [editing]);

  // BUG: Hard to test async operation!
  const handleSave = async () => {
    try {
      await fetch('/api/user', {
        method: 'PUT',
        body: JSON.stringify(user)
      });
      setEditing(false);
      alert('Profile saved!'); // BUG: Hard to test alert!
    } catch (error) {
      console.error(error); // BUG: Hard to test error handling!
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>

      {editing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <UserProfile />
    </UserProvider>
  );
}`
    },
    hints: [
      'Use dependency injection for better testability',
      'Mock external dependencies and side effects',
      'Implement proper error handling and user feedback',
      'Use React Testing Library best practices'
    ],
    solution: {
      'TestingDebugging.jsx': `import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  useMemo,
  useRef
} from 'react';

// Testable API service with dependency injection
class ApiService {
  constructor(baseUrl = '/api', fetchFn = fetch) {
    this.baseUrl = baseUrl;
    this.fetch = fetchFn;
  }

  async getUser() {
    const response = await this.fetch(\`\${this.baseUrl}/user\`);
    if (!response.ok) {
      throw new Error(\`Failed to fetch user: \${response.status}\`);
    }
    return response.json();
  }

  async updateUser(userData) {
    const response = await this.fetch(\`\${this.baseUrl}/user\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(\`Failed to update user: \${response.status}\`);
    }

    return response.json();
  }
}

// Testable notification service
class NotificationService {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notify(type, message, options = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: new Date().toISOString(),
      ...options
    };

    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });

    return notification;
  }

  success(message, options) {
    return this.notify('success', message, options);
  }

  error(message, options) {
    return this.notify('error', message, options);
  }

  info(message, options) {
    return this.notify('info', message, options);
  }
}

// Context with proper error handling and testing support
const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Testable provider with dependency injection
export function AppProvider({
  children,
  apiService = new ApiService(),
  notificationService = new NotificationService(),
  documentService = document // Injectable for testing
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Setup notification listener
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      setNotifications(prev => [...prev, notification]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    });

    return unsubscribe;
  }, [notificationService]);

  // Load user data
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await apiService.getUser();
      setUser(userData);
    } catch (err) {
      setError(err.message);
      notificationService.error(\`Failed to load user: \${err.message}\`);
    } finally {
      setLoading(false);
    }
  }, [apiService, notificationService]);

  // Update user data
  const updateUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await apiService.updateUser(userData);
      setUser(updatedUser);
      notificationService.success('Profile updated successfully!');
      return updatedUser;
    } catch (err) {
      setError(err.message);
      notificationService.error(\`Failed to update profile: \${err.message}\`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiService, notificationService]);

  // Update document title
  const updateDocumentTitle = useCallback((title) => {
    if (documentService && documentService.title !== undefined) {
      documentService.title = title;
    }
  }, [documentService]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    notifications,
    loadUser,
    updateUser,
    updateDocumentTitle,
    notificationService
  }), [
    user,
    loading,
    error,
    notifications,
    loadUser,
    updateUser,
    updateDocumentTitle,
    notificationService
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Notification component for testing
export function NotificationContainer() {
  const { notifications } = useAppContext();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      data-testid="notification-container"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      {notifications.map(notification => (
        <div
          key={notification.id}
          data-testid={\`notification-\${notification.type}\`}
          style={{
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '4px',
            backgroundColor: notification.type === 'success' ? '#d4edda' :
                           notification.type === 'error' ? '#f8d7da' : '#d1ecf1',
            color: notification.type === 'success' ? '#155724' :
                   notification.type === 'error' ? '#721c24' : '#0c5460',
            border: \`1px solid \${notification.type === 'success' ? '#c3e6cb' :
                                   notification.type === 'error' ? '#f5c6cb' : '#bee5eb'}\`,
            maxWidth: '300px',
            wordWrap: 'break-word'
          }}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
}

// Testable user profile component
export function UserProfile() {
  const {
    user,
    loading,
    error,
    updateUser,
    updateDocumentTitle
  } = useAppContext();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  // Update document title based on editing state
  useEffect(() => {
    updateDocumentTitle(editing ? 'Editing Profile' : 'User Profile');
  }, [editing, updateDocumentTitle]);

  // Initialize form data when user loads or editing starts
  useEffect(() => {
    if (user && editing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user, editing]);

  // Focus first input when editing starts
  useEffect(() => {
    if (editing && formRef.current) {
      const firstInput = formRef.current.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [editing]);

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(false);
    setFormData({});
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateUser({ ...user, ...formData });
      setEditing(false);
      setFormData({});
    } catch (err) {
      // Error is handled by the context
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [user, formData, updateUser]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleCancel]);

  if (loading && !user) {
    return (
      <div data-testid="loading-spinner" style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <div>Loading user profile...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div data-testid="error-message" style={{
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div data-testid="no-user" style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <p>No user data available</p>
      </div>
    );
  }

  return (
    <div data-testid="user-profile" style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1>User Profile</h1>

      {editing ? (
        <form
          ref={formRef}
          onSubmit={handleSave}
          onKeyDown={handleKeyDown}
          data-testid="edit-form"
          style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}
        >
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleInputChange}
              data-testid="name-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              data-testid="email-input"
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px' }}>
              Bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              data-testid="bio-input"
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              data-testid="save-button"
              style={{
                padding: '10px 20px',
                backgroundColor: saving ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              data-testid="cancel-button"
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
          </div>

          <div style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            Press Escape to cancel
          </div>
        </form>
      ) : (
        <div data-testid="profile-display" style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>Name:</strong>
            <span data-testid="user-name" style={{ marginLeft: '10px' }}>
              {user.name}
            </span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Email:</strong>
            <span data-testid="user-email" style={{ marginLeft: '10px' }}>
              {user.email}
            </span>
          </div>

          {user.bio && (
            <div style={{ marginBottom: '20px' }}>
              <strong>Bio:</strong>
              <div data-testid="user-bio" style={{
                marginTop: '5px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap'
              }}>
                {user.bio}
              </div>
            </div>
          )}

          <button
            onClick={handleEdit}
            data-testid="edit-button"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}

// Main app component
export default function App({
  apiService,
  notificationService,
  documentService
}) {
  return (
    <AppProvider
      apiService={apiService}
      notificationService={notificationService}
      documentService={documentService}
    >
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <UserProfile />
        <NotificationContainer />
      </div>
    </AppProvider>
  );
}

// Test utilities export
export {
  ApiService,
  NotificationService,
  AppProvider,
  useAppContext
};`
    },
    testCases: [
      'Components should be testable with proper data-testid attributes',
      'External dependencies should be mockable through dependency injection',
      'Async operations should be properly tested with loading states',
      'Error handling should be comprehensive and testable'
    ],
    debuggingSteps: [
      'Use React DevTools to inspect component state and props',
      'Add data-testid attributes for reliable test selectors',
      'Mock external dependencies for isolated testing',
      'Test error boundaries and loading states'
    ],
    commonMistakes: [
      'Hard-coding external dependencies making testing difficult',
      'Not providing proper test identifiers',
      'Poor error handling and user feedback',
      'Direct DOM manipulation instead of React patterns'
    ],
    productionImpact: 'Untestable code, poor error handling, difficult debugging, maintenance issues',
    preventionTips: [
      'Use dependency injection for external services',
      'Add data-testid attributes for testing',
      'Implement comprehensive error handling',
      'Follow React Testing Library best practices'
    ]
  }
];

// Export total count for verification
export const reactDebugChallengesCount = reactDebugChallenges.length;
