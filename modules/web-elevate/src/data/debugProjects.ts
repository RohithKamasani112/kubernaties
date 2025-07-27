export interface DebugProject {
  id: string;
  title: string;
  description: string;
  userStory: string;
  defect: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  category: string;
  points: number;
  files: { [key: string]: string };
  tests: DebugTest[];
  hints: string[];
  solution?: { [key: string]: string };
}

export interface DebugTest {
  id: string;
  name: string;
  description: string;
  testFunction: (files: { [key: string]: string }) => { passed: boolean; message: string };
}

export const debugProjects: DebugProject[] = [
  {
    id: 'todo-localstorage',
    title: '📝 To-Do List Persistence Bug',
    description: 'Tasks disappear after page refresh - fix the localStorage implementation',
    userStory: 'As a user, I want my tasks to persist after refreshing the page',
    defect: 'Tasks are not being saved to localStorage',
    difficulty: 'beginner',
    estimatedTime: '15 min',
    tags: ['JavaScript', 'localStorage', 'DOM'],
    category: 'Frontend',
    points: 100,
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>📝 My Todo List</h1>
        <div class="input-section">
            <input type="text" id="taskInput" placeholder="Add a new task...">
            <button id="addBtn">Add Task</button>
        </div>
        <ul id="taskList"></ul>
    </div>
    <script src="app.js"></script>
</body>
</html>`,
      'style.css': `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
    min-height: 100vh;
}

.container {
    max-width: 500px;
    margin: 0 auto;
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

#taskInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

#addBtn {
    padding: 12px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

#addBtn:hover {
    background: #5a6fd8;
}

#taskList {
    list-style: none;
    padding: 0;
}

.task-item {
    background: #f8f9fa;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-left: 4px solid #667eea;
}

.delete-btn {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.delete-btn:hover {
    background: #ff5252;
}`,
      'app.js': `// 🐛 BUG: Tasks are not being saved to localStorage!
// The app works but tasks disappear after refresh

let tasks = [];

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
    // TODO: Load tasks from localStorage
    displayTasks();
});

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    taskInput.value = '';
    
    // TODO: Save tasks to localStorage
    displayTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    // TODO: Save updated tasks to localStorage
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = \`
            <span>\${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(\${task.id})">Delete</button>
        \`;
        taskList.appendChild(li);
    });
}`
    },
    tests: [
      {
        id: 'localStorage-save',
        name: 'Tasks are saved to localStorage',
        description: 'Check if tasks are being saved to localStorage when added',
        testFunction: (files) => {
          const jsCode = files['app.js'] || '';
          const hasSetItem = jsCode.includes('localStorage.setItem');
          const hasStringify = jsCode.includes('JSON.stringify');
          return {
            passed: hasSetItem && hasStringify,
            message: hasSetItem && hasStringify 
              ? 'Tasks are being saved to localStorage correctly' 
              : 'Missing localStorage.setItem() or JSON.stringify() calls'
          };
        }
      },
      {
        id: 'localStorage-load',
        name: 'Tasks are loaded from localStorage',
        description: 'Check if tasks are being loaded from localStorage on page load',
        testFunction: (files) => {
          const jsCode = files['app.js'] || '';
          const hasGetItem = jsCode.includes('localStorage.getItem');
          const hasParse = jsCode.includes('JSON.parse');
          return {
            passed: hasGetItem && hasParse,
            message: hasGetItem && hasParse 
              ? 'Tasks are being loaded from localStorage correctly' 
              : 'Missing localStorage.getItem() or JSON.parse() calls'
          };
        }
      }
    ],
    hints: [
      'Use localStorage.setItem() to save data and localStorage.getItem() to retrieve it',
      'Remember to use JSON.stringify() when saving and JSON.parse() when loading',
      'Save tasks after adding or deleting them',
      'Load tasks in the DOMContentLoaded event listener'
    ],
    solution: {
      'app.js': `// ✅ FIXED: Tasks now persist using localStorage!

let tasks = [];

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    displayTasks();
});

document.getElementById('addBtn').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    tasks.push(task);
    taskInput.value = '';
    
    // Save tasks to localStorage
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    displayTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    // Save updated tasks to localStorage
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = \`
            <span>\${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(\${task.id})">Delete</button>
        \`;
        taskList.appendChild(li);
    });
}`
    }
  },

  {
    id: 'login-validation',
    title: '🔐 Login Form Validation Bug',
    description: 'Form submits with empty fields - add proper validation',
    userStory: 'As a user, I want to see error messages for invalid login attempts',
    defect: 'Form validation is missing, allowing empty submissions',
    difficulty: 'beginner',
    estimatedTime: '20 min',
    tags: ['JavaScript', 'Forms', 'Validation'],
    category: 'Frontend',
    points: 120,
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <div class="login-form">
            <h2>🔐 Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email">
                    <span class="error-message" id="emailError"></span>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password">
                    <span class="error-message" id="passwordError"></span>
                </div>
                <button type="submit" id="loginBtn">Login</button>
            </form>
            <div id="successMessage" class="success-message"></div>
        </div>
    </div>
    <script src="login.js"></script>
</body>
</html>`,
      'style.css': `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    width: 100%;
    max-width: 400px;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    border-color: #667eea;
}

.error-message {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 5px;
    display: block;
    min-height: 20px;
}

.success-message {
    color: #51cf66;
    font-size: 16px;
    text-align: center;
    margin-top: 20px;
    font-weight: 500;
}

button {
    width: 100%;
    padding: 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-weight: 500;
}

button:hover {
    background: #5a6fd8;
}

.input-error {
    border-color: #ff6b6b !important;
}`,
      'login.js': `// 🐛 BUG: Form submits without validation!
// Empty fields are being submitted without any error messages

document.getElementById('loginForm').addEventListener('submit', function(e) {
    // TODO: Add preventDefault() to stop form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // TODO: Add validation logic here

    // If we get here, show success message
    document.getElementById('successMessage').textContent = 'Login successful!';
    console.log('Login attempt:', { email, password });
});

// TODO: Add validation functions
function validateEmail(email) {
    // Email validation logic needed
}

function validatePassword(password) {
    // Password validation logic needed
}

function showError(fieldId, message) {
    // Error display logic needed
}

function clearErrors() {
    // Clear error messages logic needed
}`
    },
    tests: [
      {
        id: 'form-validation',
        name: 'Form has validation',
        description: 'Check if form prevents submission with empty fields',
        testFunction: (files) => {
          const jsCode = files['login.js'] || '';
          const hasPreventDefault = jsCode.includes('preventDefault()');
          const hasValidation = jsCode.includes('validateEmail') && jsCode.includes('validatePassword');
          return {
            passed: hasPreventDefault && hasValidation,
            message: hasPreventDefault && hasValidation
              ? 'Form validation is properly implemented'
              : 'Missing preventDefault() or validation functions'
          };
        }
      },
      {
        id: 'error-display',
        name: 'Error messages are shown',
        description: 'Check if error messages are displayed for invalid inputs',
        testFunction: (files) => {
          const jsCode = files['login.js'] || '';
          const hasErrorDisplay = jsCode.includes('showError') && jsCode.includes('textContent');
          return {
            passed: hasErrorDisplay,
            message: hasErrorDisplay
              ? 'Error messages are properly displayed'
              : 'Missing error message display functionality'
          };
        }
      }
    ],
    hints: [
      'Use e.preventDefault() to stop the form from submitting',
      'Check if email and password fields are empty before proceeding',
      'Use regular expressions to validate email format',
      'Display error messages in the error spans provided'
    ]
  },

  {
    id: 'dark-mode-toggle',
    title: '🎨 Dark Mode Toggle Bug',
    description: 'Dark mode button exists but doesn\'t work - fix the theme switching',
    userStory: 'As a user, I want to toggle between light and dark themes',
    defect: 'CSS classes are not being toggled properly',
    difficulty: 'beginner',
    estimatedTime: '12 min',
    tags: ['JavaScript', 'CSS', 'UI'],
    category: 'Frontend',
    points: 90,
    files: {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Mode Toggle</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🎨 Theme Switcher</h1>
            <button id="themeToggle" class="theme-btn">🌙 Dark Mode</button>
        </header>
        <main>
            <div class="card">
                <h2>Welcome to our website!</h2>
                <p>This is a sample website with a dark mode toggle feature. Click the button above to switch between light and dark themes.</p>
                <button class="action-btn">Get Started</button>
            </div>
            <div class="card">
                <h3>Features</h3>
                <ul>
                    <li>Responsive design</li>
                    <li>Dark mode support</li>
                    <li>Modern UI</li>
                    <li>Smooth transitions</li>
                </ul>
            </div>
        </main>
    </div>
    <script src="darkmode.js"></script>
</body>
</html>`,
      'style.css': `/* Light theme (default) */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    margin: 0;
    color: #333;
}

.theme-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    background: #667eea;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.theme-btn:hover {
    background: #5a6fd8;
}

.card {
    background: white;
    padding: 30px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.action-btn {
    padding: 12px 24px;
    background: #51cf66;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

/* Dark theme styles */
body.dark {
    background-color: #1a1a1a;
    color: #e0e0e0;
}

body.dark header {
    background: #2d2d2d;
}

body.dark h1 {
    color: #e0e0e0;
}

body.dark .card {
    background: #2d2d2d;
    color: #e0e0e0;
}

body.dark li {
    border-bottom-color: #444;
}

body.dark .theme-btn {
    background: #ffd43b;
    color: #333;
}

body.dark .theme-btn:hover {
    background: #ffec8c;
}`,
      'darkmode.js': `// 🐛 BUG: Dark mode toggle doesn't work!
// The button exists but clicking it doesn't change the theme

document.getElementById('themeToggle').addEventListener('click', function() {
    const body = document.body;
    const button = document.getElementById('themeToggle');

    // TODO: Toggle the 'dark' class on the body element

    // TODO: Update button text based on current theme
    if (body.classList.contains('dark')) {
        button.textContent = '☀️ Light Mode';
    } else {
        button.textContent = '🌙 Dark Mode';
    }
});`
    },
    tests: [
      {
        id: 'class-toggle',
        name: 'Dark class is toggled',
        description: 'Check if the dark class is being toggled on the body element',
        testFunction: (files) => {
          const jsCode = files['darkmode.js'] || '';
          const hasClassListToggle = jsCode.includes('classList.toggle') || jsCode.includes('classList.add') && jsCode.includes('classList.remove');
          return {
            passed: hasClassListToggle,
            message: hasClassListToggle
              ? 'Dark class toggle is implemented'
              : 'Missing classList.toggle() or add/remove methods'
          };
        }
      }
    ],
    hints: [
      'Use body.classList.toggle("dark") to switch themes',
      'Update the button text to reflect the current state',
      'The CSS for dark mode is already provided'
    ]
  }
];
