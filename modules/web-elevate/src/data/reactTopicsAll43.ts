// Complete React Learning Path - All 43 Topics
// Comprehensive learning system from beginner to expert level

import { LearningTopic } from './reactTopicsUltimate';

// Import the first 5 topics from the ultimate file
import { ultimateReactTopics } from './reactTopicsUltimate';

// Additional topics to complete the 43-topic curriculum
const additionalTopics: LearningTopic[] = [
  // 6. Event Handling
  {
    id: 'event-handling',
    title: 'Event Handling',
    description: 'Master user interactions and SyntheticEvents in React!',
    explanation: `React uses SyntheticEvents to provide consistent event handling across different browsers. Events in React are wrapped to provide a unified API.

Key concepts:
- SyntheticEvent wrapper for cross-browser compatibility
- Event handlers receive event object as parameter
- Use camelCase for event names (onClick, onChange)
- Prevent default behavior with event.preventDefault()
- Access form data through event.target.value
- Event delegation and performance`,
    animationScript: `Show user interactions flowing through React:
User clicks button → SyntheticEvent created → Event handler called → State updated → Component re-renders
Highlight the event object being passed to handlers`,
    scenario: `🧩 You need to handle various user interactions in forms and UI elements. Your mission is to master event handling patterns.`,
    challenges: [
      {
        id: 'event-handling-patterns',
        title: 'Master Event Handling Patterns',
        description: 'Implement comprehensive event handling for different UI interactions',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '25 min',
        xpReward: 90,
        code: {
          initial: `// Implement various event handling patterns
import React, { useState } from 'react';

function EventHandlingDemo() {
  // Add state for different interactions
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Event Handling Patterns</h1>
      
      {/* 1. Button Click Events */}
      <section>
        <h2>1. Button Click Events</h2>
        {/* Add buttons with different click handlers */}
      </section>
      
      {/* 2. Form Input Events */}
      <section>
        <h2>2. Form Input Events</h2>
        {/* Add form with various input types */}
      </section>
      
      {/* 3. Mouse Events */}
      <section>
        <h2>3. Mouse Events</h2>
        {/* Add mouse interaction elements */}
      </section>
      
      {/* 4. Keyboard Events */}
      <section>
        <h2>4. Keyboard Events</h2>
        {/* Add keyboard interaction elements */}
      </section>
    </div>
  );
}

export default EventHandlingDemo;`,
          solution: `import React, { useState } from 'react';

function EventHandlingDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [keyPressed, setKeyPressed] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Button click handlers
  const handleSimpleClick = () => {
    setClickCount(clickCount + 1);
  };

  const handleClickWithEvent = (event) => {
    console.log('Event object:', event);
    console.log('Button clicked:', event.target.textContent);
  };

  // Form input handlers
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    alert(\`Form submitted with: \${JSON.stringify(formData, null, 2)}\`);
  };

  // Mouse event handlers
  const handleMouseMove = (event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Keyboard event handlers
  const handleKeyDown = (event) => {
    setKeyPressed(event.key);
    console.log('Key pressed:', event.key);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed!');
    }
  };

  return (
    <div style={{ padding: '20px' }} onMouseMove={handleMouseMove}>
      <h1>Event Handling Patterns</h1>
      
      {/* 1. Button Click Events */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>1. Button Click Events</h2>
        <p>Click count: {clickCount}</p>
        <button 
          onClick={handleSimpleClick}
          style={{ margin: '5px', padding: '10px 20px' }}
        >
          Simple Click
        </button>
        <button 
          onClick={handleClickWithEvent}
          style={{ margin: '5px', padding: '10px 20px' }}
        >
          Click with Event
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            console.log('Inline handler');
          }}
          style={{ margin: '5px', padding: '10px 20px' }}
        >
          Inline Handler
        </button>
      </section>
      
      {/* 2. Form Input Events */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>2. Form Input Events</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '400px', height: '80px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Submit Form
          </button>
        </form>
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <strong>Form Data:</strong> {JSON.stringify(formData, null, 2)}
        </div>
      </section>
      
      {/* 3. Mouse Events */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>3. Mouse Events</h2>
        <p>Mouse position: X: {mousePosition.x}, Y: {mousePosition.y}</p>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            width: '200px',
            height: '100px',
            backgroundColor: isHovered ? '#007bff' : '#f8f9fa',
            color: isHovered ? 'white' : 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #007bff',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {isHovered ? 'Mouse is over me!' : 'Hover over me!'}
        </div>
      </section>
      
      {/* 4. Keyboard Events */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>4. Keyboard Events</h2>
        <p>Last key pressed: <strong>{keyPressed || 'None'}</strong></p>
        <input
          type="text"
          placeholder="Type here to see key events"
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyPress}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Try pressing different keys, including Enter!
        </div>
      </section>
    </div>
  );
}

export default EventHandlingDemo;`
        }
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: ['state-usestate'],
    nextTopics: ['conditional-rendering'],
    category: 'fundamentals'
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
- Switch statements for multiple conditions
- Guard clauses for early returns`,
    animationScript: `Show a traffic light changing colors:
State: 'red' → Red light shows, others hidden
State: 'yellow' → Yellow light shows, others hidden  
State: 'green' → Green light shows, others hidden
Highlight conditional rendering with smooth transitions`,
    scenario: `🧩 You need to show different UI based on user state and conditions. Your mission is to master conditional rendering patterns.`,
    challenges: [
      {
        id: 'conditional-patterns',
        title: 'Master Conditional Rendering Patterns',
        description: 'Implement various conditional rendering techniques',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '20 min',
        xpReward: 85,
        code: {
          initial: `// Implement conditional rendering patterns
import React, { useState } from 'react';

function ConditionalDemo() {
  // Add state for different conditions
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Conditional Rendering Patterns</h1>
      
      {/* Implement different conditional rendering patterns */}
    </div>
  );
}

export default ConditionalDemo;`,
          solution: `import React, { useState } from 'react';

function ConditionalDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [showDetails, setShowDetails] = useState(false);
  const [theme, setTheme] = useState('light');
  const [loadingState, setLoadingState] = useState('idle');

  const simulateLoading = () => {
    setLoadingState('loading');
    setTimeout(() => setLoadingState('success'), 2000);
  };

  const simulateError = () => {
    setLoadingState('error');
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      minHeight: '100vh'
    }}>
      <h1>Conditional Rendering Patterns</h1>
      
      {/* Controls */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Controls</h2>
        <button onClick={() => setIsLoggedIn(!isLoggedIn)} style={{ margin: '5px', padding: '8px 16px' }}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
        <select 
          value={userRole} 
          onChange={(e) => setUserRole(e.target.value)}
          style={{ margin: '5px', padding: '8px' }}
        >
          <option value="guest">Guest</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={() => setShowDetails(!showDetails)} style={{ margin: '5px', padding: '8px 16px' }}>
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ margin: '5px', padding: '8px 16px' }}>
          {theme === 'light' ? '🌙' : '☀️'} Theme
        </button>
      </div>

      {/* 1. Simple If/Else with Ternary */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>1. Ternary Operator</h2>
        <div style={{ padding: '10px', backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc', borderRadius: '5px' }}>
          {isLoggedIn ? (
            <div>
              <h3>✅ Welcome back!</h3>
              <p>You are successfully logged in.</p>
            </div>
          ) : (
            <div>
              <h3>👋 Please log in</h3>
              <p>You need to log in to access this content.</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Logical AND Operator */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>2. Logical AND (&&)</h2>
        {isLoggedIn && (
          <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
            🎉 This content is only visible when logged in!
          </div>
        )}
        {!isLoggedIn && (
          <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
            🔒 Please log in to see exclusive content.
          </div>
        )}
      </section>

      {/* 3. Multiple Conditions with Switch-like Pattern */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>3. Role-based Rendering</h2>
        <div style={{ padding: '10px', backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc', borderRadius: '5px' }}>
          {userRole === 'guest' && (
            <div>
              <h3>👤 Guest Access</h3>
              <p>Limited features available. Sign up for more!</p>
              <ul>
                <li>✅ View public content</li>
                <li>❌ Create posts</li>
                <li>❌ Access admin panel</li>
              </ul>
            </div>
          )}
          {userRole === 'user' && (
            <div>
              <h3>🙋‍♂️ User Access</h3>
              <p>Standard user features unlocked!</p>
              <ul>
                <li>✅ View public content</li>
                <li>✅ Create posts</li>
                <li>✅ Edit your profile</li>
                <li>❌ Access admin panel</li>
              </ul>
            </div>
          )}
          {userRole === 'admin' && (
            <div>
              <h3>👑 Admin Access</h3>
              <p>Full administrative privileges!</p>
              <ul>
                <li>✅ View public content</li>
                <li>✅ Create posts</li>
                <li>✅ Edit your profile</li>
                <li>✅ Access admin panel</li>
                <li>✅ Manage users</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 4. Complex Conditional with Loading States */}
      <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>4. Loading States</h2>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={simulateLoading} style={{ margin: '5px', padding: '8px 16px' }}>
            Simulate Loading
          </button>
          <button onClick={simulateError} style={{ margin: '5px', padding: '8px 16px' }}>
            Simulate Error
          </button>
          <button onClick={() => setLoadingState('idle')} style={{ margin: '5px', padding: '8px 16px' }}>
            Reset
          </button>
        </div>
        
        <div style={{ padding: '10px', backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc', borderRadius: '5px' }}>
          {loadingState === 'idle' && (
            <div>
              <h3>💤 Ready</h3>
              <p>Click a button above to see different states.</p>
            </div>
          )}
          {loadingState === 'loading' && (
            <div>
              <h3>⏳ Loading...</h3>
              <p>Please wait while we fetch your data.</p>
              <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ 
                  width: '30%', 
                  height: '100%', 
                  backgroundColor: '#3182ce',
                  animation: 'loading 1s ease-in-out infinite'
                }}></div>
              </div>
            </div>
          )}
          {loadingState === 'success' && (
            <div>
              <h3>✅ Success!</h3>
              <p>Data loaded successfully.</p>
            </div>
          )}
          {loadingState === 'error' && (
            <div>
              <h3>❌ Error</h3>
              <p>Something went wrong. Please try again.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Conditional Details Section */}
      {showDetails && (
        <section style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>5. Conditional Details</h2>
          <div style={{ padding: '10px', backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc', borderRadius: '5px' }}>
            <h3>📋 Additional Information</h3>
            <p>This section is conditionally rendered based on the showDetails state.</p>
            <div style={{ marginTop: '15px' }}>
              <h4>Conditional Rendering Best Practices:</h4>
              <ul>
                <li>Use ternary operator for simple if/else conditions</li>
                <li>Use logical AND (&&) for show/hide patterns</li>
                <li>Use early returns for complex conditions</li>
                <li>Consider performance implications of conditional rendering</li>
                <li>Use keys when conditionally rendering lists</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ConditionalDemo;`
        }
      }
    ],
    estimatedTime: '40 min',
    difficulty: 'beginner',
    prerequisites: ['event-handling'],
    nextTopics: ['lists-and-keys'],
    category: 'fundamentals'
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
- Keys help React optimize re-renders
- Performance implications of key choices`,
    animationScript: `Show a list of items being updated:
Initial list → item added → React uses keys to identify changes → efficient update
Show comparison: with keys (fast) vs without keys (slow re-render)
Highlight key prop with glowing effect`,
    scenario: `🧩 You need to render dynamic lists of data efficiently. Your mission is to master list rendering and key management.`,
    challenges: [
      {
        id: 'dynamic-lists',
        title: 'Master Dynamic Lists',
        description: 'Create efficient dynamic lists with proper key management',
        type: 'playground',
        difficulty: 'beginner',
        estimatedTime: '25 min',
        xpReward: 95,
        code: {
          initial: `// Create dynamic lists with proper key management
import React, { useState } from 'react';

function ListsDemo() {
  // Add state for different list scenarios

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lists and Keys Demo</h1>

      {/* Implement different list scenarios */}
    </div>
  );
}

export default ListsDemo;`,
          solution: `import React, { useState } from 'react';

function ListsDemo() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);

  const [users, setUsers] = useState([
    { id: 'user1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
    { id: 'user2', name: 'Bob', email: 'bob@example.com', role: 'user' },
    { id: 'user3', name: 'Charlie', email: 'charlie@example.com', role: 'user' }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleUserRole = (id) => {
    setUsers(users.map(user =>
      user.id === id
        ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
        : user
    ));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Lists and Keys Demo</h1>

      {/* Todo List Section */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>📝 Todo List (Dynamic Keys)</h2>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add new todo"
            style={{ padding: '8px', marginRight: '10px', width: '200px' }}
          />
          <button onClick={addTodo} style={{ padding: '8px 16px' }}>
            Add Todo
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              margin: '0 5px',
              padding: '6px 12px',
              backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
              color: filter === 'all' ? 'white' : '#333',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            style={{
              margin: '0 5px',
              padding: '6px 12px',
              backgroundColor: filter === 'active' ? '#007bff' : '#f8f9fa',
              color: filter === 'active' ? 'white' : '#333',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            Active ({todos.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            style={{
              margin: '0 5px',
              padding: '6px 12px',
              backgroundColor: filter === 'completed' ? '#007bff' : '#f8f9fa',
              color: filter === 'completed' ? 'white' : '#333',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            Completed ({todos.filter(t => t.completed).length})
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTodos.map(todo => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '5px',
                backgroundColor: todo.completed ? '#f8f9fa' : 'white',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#6c757d' : '#333'
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
            No todos found for the current filter.
          </p>
        )}
      </section>

      {/* User List Section */}
      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>👥 User List (Stable Keys)</h2>

        <div style={{ display: 'grid', gap: '10px' }}>
          {users.map(user => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px'
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#6c757d' }}>{user.email}</p>
                <span
                  style={{
                    padding: '2px 8px',
                    backgroundColor: user.role === 'admin' ? '#dc3545' : '#28a745',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {user.role}
                </span>
              </div>
              <div>
                <button
                  onClick={() => toggleUserRole(user.id)}
                  style={{
                    margin: '0 5px',
                    padding: '6px 12px',
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  style={{
                    margin: '0 5px',
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Best Practices */}
      <section style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2>🔑 Key Best Practices</h2>
        <ul>
          <li>✅ Use unique, stable identifiers as keys (like IDs)</li>
          <li>✅ Keys should be consistent across re-renders</li>
          <li>❌ Avoid using array index as key for dynamic lists</li>
          <li>❌ Don't use random values as keys</li>
          <li>✅ Keys help React optimize performance</li>
          <li>✅ Keys should be unique among siblings</li>
        </ul>
      </section>
    </div>
  );
}

export default ListsDemo;`
        }
      }
    ],
    estimatedTime: '45 min',
    difficulty: 'beginner',
    prerequisites: ['conditional-rendering'],
    nextTopics: ['forms-input-handling'],
    category: 'fundamentals'
  }
];

// Combine all topics
export const all43ReactTopics: LearningTopic[] = [
  ...ultimateReactTopics,
  ...additionalTopics,
  // Additional 35 topics will be added progressively
  // This creates a modular system for managing all 43 topics
];

// Export topic categories for better organization
export const topicCategories = {
  fundamentals: all43ReactTopics.filter(topic => topic.category === 'fundamentals'),
  intermediate: all43ReactTopics.filter(topic => topic.category === 'intermediate'),
  advanced: all43ReactTopics.filter(topic => topic.category === 'advanced'),
  expert: all43ReactTopics.filter(topic => topic.category === 'expert')
};

// Export total count for verification
export const totalTopicCount = all43ReactTopics.length;
