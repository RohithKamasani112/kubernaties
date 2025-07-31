import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Code,
  Terminal,
  Play,
  Settings,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  X,
  Save,
  RotateCcw,
  Eye,
  Globe,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Zap,
  Github,
  GitBranch,
  Star,
  Trophy,
  Target,
  BookOpen,
  Users,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Layout,
  Maximize2,
  Minimize2,
  ExternalLink,
  Award,
  Flame,
  Coffee
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import AIAdvisor from '../components/AIAdvisor';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  path?: string;
  size?: number;
  lastModified?: Date;
}

interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'react' | 'nodejs' | 'angular' | 'vue' | 'html-css-js' | 'fullstack';
  userStories: UserStory[];
  setupInstructions: string[];
  previewUrl?: string;
  demoUrl?: string;
}

interface UserStory {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  tasks: Task[];
  hints: string[];
  completed: boolean;
}

interface Task {
  id: string;
  description: string;
  file: string;
  lineNumber?: number;
  completed: boolean;
  validationCriteria: string[];
}

interface PlaygroundSession {
  id: string;
  repoId: string;
  userId?: string;
  files: FileNode[];
  completedStories: string[];
  totalXP: number;
  lastSaved: Date;
  isForked: boolean;
  forkUrl?: string;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
  accessToken: string;
}

// Badge Definitions
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (xp: number, completedStories: Set<string>, repos: GitHubRepo[]) => boolean;
}

const badges: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first user story',
    icon: '🎯',
    condition: (xp, completedStories) => completedStories.size >= 1
  },
  {
    id: 'code-warrior',
    name: 'Code Warrior',
    description: 'Earn 500 XP points',
    icon: '⚔️',
    condition: (xp) => xp >= 500
  },
  {
    id: 'story-master',
    name: 'Story Master',
    description: 'Complete 5 user stories',
    icon: '📚',
    condition: (xp, completedStories) => completedStories.size >= 5
  },
  {
    id: 'react-ninja',
    name: 'React Ninja',
    description: 'Complete all React project stories',
    icon: '⚛️',
    condition: (xp, completedStories, repos) => {
      const reactRepos = repos.filter(r => r.category === 'react');
      const reactStories = reactRepos.flatMap(r => r.userStories.map(s => s.id));
      return reactStories.every(storyId => completedStories.has(storyId));
    }
  },
  {
    id: 'github-contributor',
    name: 'GitHub Contributor',
    description: 'Fork and push to a repository',
    icon: '🍴',
    condition: () => false // Will be set manually when user pushes
  },
  {
    id: 'xp-legend',
    name: 'XP Legend',
    description: 'Earn 1000 XP points',
    icon: '🏆',
    condition: (xp) => xp >= 1000
  }
];

// Sample GitHub Repositories
const sampleRepos: GitHubRepo[] = [
  {
    id: 'react-todo-app',
    name: 'react-todo-app',
    fullName: 'webelevate/react-todo-app',
    description: 'A beginner-friendly React Todo application with modern hooks and styling',
    language: 'JavaScript',
    stars: 245,
    forks: 89,
    topics: ['react', 'hooks', 'beginner', 'todo', 'frontend'],
    difficulty: 'beginner',
    category: 'react',
    setupInstructions: [
      'npm install',
      'npm start',
      'Open http://localhost:3000'
    ],
    userStories: [
      {
        id: 'story-1',
        title: 'Fix the Add Todo Button',
        description: 'The add todo button is not working. Fix the onClick handler to properly add new todos.',
        difficulty: 'easy',
        xpReward: 100,
        completed: false,
        tasks: [
          {
            id: 'task-1',
            description: 'Fix the addTodo function in App.js',
            file: 'src/App.js',
            lineNumber: 15,
            completed: false,
            validationCriteria: ['Button adds new todo', 'Input clears after adding', 'Todo appears in list']
          }
        ],
        hints: [
          'Check the onClick handler in the button',
          'Make sure the state is being updated correctly',
          'Verify the input value is being captured'
        ]
      },
      {
        id: 'story-2',
        title: 'Add Delete Functionality',
        description: 'Implement the ability to delete todos by clicking a delete button.',
        difficulty: 'medium',
        xpReward: 150,
        completed: false,
        tasks: [
          {
            id: 'task-2',
            description: 'Add delete button to each todo item',
            file: 'src/components/TodoItem.js',
            completed: false,
            validationCriteria: ['Delete button appears on each todo', 'Clicking delete removes the todo', 'List updates correctly']
          }
        ],
        hints: [
          'Add a delete button to the TodoItem component',
          'Pass a delete function as a prop',
          'Use filter to remove the todo from state'
        ]
      }
    ]
  },
  {
    id: 'react-weather-app',
    name: 'react-weather-app',
    fullName: 'webelevate/react-weather-app',
    description: 'Weather application using React and OpenWeatherMap API',
    language: 'JavaScript',
    stars: 189,
    forks: 67,
    topics: ['react', 'api', 'weather', 'intermediate'],
    difficulty: 'intermediate',
    category: 'react',
    setupInstructions: [
      'npm install',
      'Add your API key to .env file',
      'npm start'
    ],
    userStories: [
      {
        id: 'weather-story-1',
        title: 'Fix API Integration',
        description: 'The weather API is not returning data. Fix the API call and error handling.',
        difficulty: 'medium',
        xpReward: 200,
        completed: false,
        tasks: [
          {
            id: 'weather-task-1',
            description: 'Fix the API endpoint and error handling',
            file: 'src/services/weatherApi.js',
            completed: false,
            validationCriteria: ['API call succeeds', 'Weather data displays', 'Error handling works']
          }
        ],
        hints: [
          'Check the API endpoint URL',
          'Verify the API key is correct',
          'Add proper error handling for failed requests'
        ]
      }
    ]
  },
  {
    id: 'express-blog-api',
    name: 'express-blog-api',
    fullName: 'webelevate/express-blog-api',
    description: 'RESTful blog API built with Express.js and MongoDB',
    language: 'JavaScript',
    stars: 156,
    forks: 43,
    topics: ['nodejs', 'express', 'mongodb', 'api', 'backend'],
    difficulty: 'intermediate',
    category: 'nodejs',
    setupInstructions: [
      'npm install',
      'Set up MongoDB connection',
      'npm run dev'
    ],
    userStories: [
      {
        id: 'api-story-1',
        title: 'Fix Blog Post Creation',
        description: 'The POST /posts endpoint is not creating blog posts correctly.',
        difficulty: 'medium',
        xpReward: 180,
        completed: false,
        tasks: [
          {
            id: 'api-task-1',
            description: 'Fix the blog post creation endpoint',
            file: 'routes/posts.js',
            completed: false,
            validationCriteria: ['POST request creates new post', 'Validation works', 'Response includes created post']
          }
        ],
        hints: [
          'Check the request body parsing',
          'Verify the database model',
          'Add proper validation for required fields'
        ]
      }
    ]
  },
  // New React Projects
  {
    id: 'react-50-projects',
    name: 'learn-react-by-building-50-projects',
    fullName: 'FarmerAbdulAlim/learn-react-by-building-50-projects',
    description: '50 beginner-level React mini-apps (counter, todo, clock, quiz, etc.)',
    language: 'JavaScript',
    stars: 1250,
    forks: 340,
    topics: ['react', 'beginner', 'mini-apps', 'counter', 'quiz'],
    difficulty: 'beginner',
    category: 'react',
    setupInstructions: [
      'npm install',
      'npm start',
      'Open http://localhost:3000'
    ],
    userStories: [
      {
        id: 'counter-story',
        title: 'Build a Counter with Increment/Decrement',
        description: 'Create a functional counter component with increment and decrement buttons that properly updates the state.',
        difficulty: 'easy',
        xpReward: 120,
        completed: false,
        tasks: [
          {
            id: 'counter-task-1',
            description: 'Create useState hook for counter state',
            file: 'src/components/Counter.js',
            completed: false,
            validationCriteria: ['useState hook initialized with 0', 'State variable named count', 'Setter function named setCount']
          },
          {
            id: 'counter-task-2',
            description: 'Add increment button functionality',
            file: 'src/components/Counter.js',
            completed: false,
            validationCriteria: ['Button with + text exists', 'onClick handler increases count by 1', 'State updates correctly']
          },
          {
            id: 'counter-task-3',
            description: 'Add decrement button functionality',
            file: 'src/components/Counter.js',
            completed: false,
            validationCriteria: ['Button with - text exists', 'onClick handler decreases count by 1', 'State updates correctly']
          }
        ],
        hints: [
          'Use useState hook: const [count, setCount] = useState(0)',
          'Increment: setCount(count + 1) or setCount(prev => prev + 1)',
          'Decrement: setCount(count - 1) or setCount(prev => prev - 1)',
          'Display the count value in JSX: {count}'
        ]
      },
      {
        id: 'theme-toggle-story',
        title: 'Add Stateful Flip-Theme Toggle (Light/Dark)',
        description: 'Implement a theme toggle that switches between light and dark modes using React state.',
        difficulty: 'medium',
        xpReward: 150,
        completed: false,
        tasks: [
          {
            id: 'theme-task-1',
            description: 'Create theme state with useState',
            file: 'src/components/ThemeToggle.js',
            completed: false,
            validationCriteria: ['useState hook for theme', 'Initial state is light or dark', 'State variable named theme']
          },
          {
            id: 'theme-task-2',
            description: 'Add toggle button that switches themes',
            file: 'src/components/ThemeToggle.js',
            completed: false,
            validationCriteria: ['Button toggles between light/dark', 'onClick handler switches theme state', 'Button text changes based on current theme']
          },
          {
            id: 'theme-task-3',
            description: 'Apply theme styles conditionally',
            file: 'src/components/ThemeToggle.js',
            completed: false,
            validationCriteria: ['Background color changes with theme', 'Text color changes with theme', 'Conditional className or style applied']
          }
        ],
        hints: [
          'Use useState: const [theme, setTheme] = useState("light")',
          'Toggle function: setTheme(theme === "light" ? "dark" : "light")',
          'Conditional styling: className={theme === "dark" ? "dark-theme" : "light-theme"}',
          'Or use inline styles: style={{backgroundColor: theme === "dark" ? "#333" : "#fff"}}'
        ]
      },
      {
        id: 'quiz-story',
        title: 'Create a Quiz that Displays Random Questions',
        description: 'Build a quiz component that shows random questions from a predefined set and tracks user answers.',
        difficulty: 'medium',
        xpReward: 200,
        completed: false,
        tasks: [
          {
            id: 'quiz-task-1',
            description: 'Create questions array and current question state',
            file: 'src/components/Quiz.js',
            completed: false,
            validationCriteria: ['Questions array with at least 3 questions', 'currentQuestion state tracks index', 'Each question has question text and options']
          },
          {
            id: 'quiz-task-2',
            description: 'Display current question and answer options',
            file: 'src/components/Quiz.js',
            completed: false,
            validationCriteria: ['Current question text displayed', 'Answer options rendered as buttons/radio', 'Options are clickable']
          },
          {
            id: 'quiz-task-3',
            description: 'Add next question functionality',
            file: 'src/components/Quiz.js',
            completed: false,
            validationCriteria: ['Next button advances to next question', 'Quiz ends when all questions answered', 'Score or completion message shown']
          }
        ],
        hints: [
          'Create questions array: [{question: "What is React?", options: ["Library", "Framework"], correct: 0}]',
          'Use useState for currentQuestion index and score',
          'Map over options to create clickable elements',
          'Increment currentQuestion index to move to next question'
        ]
      }
    ]
  },
  {
    id: 'react-85-projects',
    name: 'React-projects-for-beginners',
    fullName: 'ianshulx/React-projects-for-beginners',
    description: 'Collection of 85+ beginner apps (movie search, YouTube clone, wallet UI, etc.)',
    language: 'JavaScript',
    stars: 890,
    forks: 245,
    topics: ['react', 'beginner', 'movie-search', 'api', 'pagination'],
    difficulty: 'intermediate',
    category: 'react',
    setupInstructions: [
      'npm install',
      'Get API key from OMDB or similar service',
      'npm start'
    ],
    userStories: [
      {
        id: 'movie-search-story',
        title: 'Build a Movie Search using API Fetch',
        description: 'Create a movie search component that fetches data from an API and displays results.',
        difficulty: 'medium',
        xpReward: 220,
        completed: false,
        tasks: [
          {
            id: 'movie-task-1',
            description: 'Create search input and movies state',
            file: 'src/components/MovieSearch.js',
            completed: false,
            validationCriteria: ['Search input field exists', 'movies state array', 'searchTerm state for input value']
          },
          {
            id: 'movie-task-2',
            description: 'Implement API fetch function',
            file: 'src/components/MovieSearch.js',
            completed: false,
            validationCriteria: ['fetch() or axios call to movie API', 'Async function handles API response', 'Error handling for failed requests']
          },
          {
            id: 'movie-task-3',
            description: 'Display search results',
            file: 'src/components/MovieSearch.js',
            completed: false,
            validationCriteria: ['Movies mapped and displayed', 'Movie title and poster shown', 'Loading state during API call']
          }
        ],
        hints: [
          'Use useState for movies array and search term',
          'Create async function: const searchMovies = async (query) => {...}',
          'Use fetch: const response = await fetch(`api-url?search=${query}`)',
          'Update state: setMovies(response.data.Search || [])'
        ]
      },
      {
        id: 'pagination-story',
        title: 'Implement Pagination on List View',
        description: 'Add pagination functionality to handle large lists of items efficiently.',
        difficulty: 'medium',
        xpReward: 180,
        completed: false,
        tasks: [
          {
            id: 'pagination-task-1',
            description: 'Create pagination state variables',
            file: 'src/components/PaginatedList.js',
            completed: false,
            validationCriteria: ['currentPage state', 'itemsPerPage constant', 'totalItems calculation']
          },
          {
            id: 'pagination-task-2',
            description: 'Calculate items to display on current page',
            file: 'src/components/PaginatedList.js',
            completed: false,
            validationCriteria: ['Slice array based on current page', 'startIndex and endIndex calculated correctly', 'Only current page items displayed']
          },
          {
            id: 'pagination-task-3',
            description: 'Add pagination controls',
            file: 'src/components/PaginatedList.js',
            completed: false,
            validationCriteria: ['Previous/Next buttons', 'Page numbers displayed', 'Buttons update currentPage state']
          }
        ],
        hints: [
          'Calculate start: (currentPage - 1) * itemsPerPage',
          'Calculate end: start + itemsPerPage',
          'Slice array: items.slice(start, end)',
          'Total pages: Math.ceil(totalItems / itemsPerPage)'
        ]
      },
      {
        id: 'form-validation-story',
        title: 'Add Form Validation (Email Field)',
        description: 'Implement client-side form validation with proper error messages and user feedback.',
        difficulty: 'medium',
        xpReward: 160,
        completed: false,
        tasks: [
          {
            id: 'validation-task-1',
            description: 'Create form state and validation state',
            file: 'src/components/ValidatedForm.js',
            completed: false,
            validationCriteria: ['Form data state object', 'errors state object', 'Input controlled by state']
          },
          {
            id: 'validation-task-2',
            description: 'Add email validation function',
            file: 'src/components/ValidatedForm.js',
            completed: false,
            validationCriteria: ['Email regex validation', 'Required field validation', 'Validation function returns boolean']
          },
          {
            id: 'validation-task-3',
            description: 'Display validation errors',
            file: 'src/components/ValidatedForm.js',
            completed: false,
            validationCriteria: ['Error messages displayed below inputs', 'Form submission prevented if invalid', 'Visual feedback for invalid fields']
          }
        ],
        hints: [
          'Email regex: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/',
          'Validate on blur or submit: const isValid = emailRegex.test(email)',
          'Show errors conditionally: {errors.email && <span>{errors.email}</span>}',
          'Prevent submit: if (!isValid) return;'
        ]
      }
    ]
  },
  // Angular Projects
  {
    id: 'angular-beginner-starter',
    name: 'angular-for-beginners-starter',
    fullName: 'angular-university/angular-for-beginners-starter',
    description: 'Simple modular Angular starter app with routing and components',
    language: 'TypeScript',
    stars: 680,
    forks: 190,
    topics: ['angular', 'typescript', 'routing', 'components', 'beginner'],
    difficulty: 'beginner',
    category: 'angular',
    setupInstructions: [
      'npm install',
      'ng serve',
      'Open http://localhost:4200'
    ],
    userStories: [
      {
        id: 'angular-component-story',
        title: 'Create New Component and Link via Angular Routing',
        description: 'Generate a new Angular component and set up routing to navigate to it.',
        difficulty: 'easy',
        xpReward: 140,
        completed: false,
        tasks: [
          {
            id: 'angular-task-1',
            description: 'Generate new component using Angular CLI',
            file: 'src/app/profile/profile.component.ts',
            completed: false,
            validationCriteria: ['Component decorator present', 'Component class exported', 'Template and styles defined']
          },
          {
            id: 'angular-task-2',
            description: 'Add route configuration',
            file: 'src/app/app-routing.module.ts',
            completed: false,
            validationCriteria: ['Route object added to routes array', 'Path and component specified', 'RouterModule configured']
          },
          {
            id: 'angular-task-3',
            description: 'Add navigation link',
            file: 'src/app/app.component.html',
            completed: false,
            validationCriteria: ['routerLink directive used', 'Navigation link visible', 'Clicking link navigates to component']
          }
        ],
        hints: [
          'Use ng generate component profile to create component',
          'Add route: {path: "profile", component: ProfileComponent}',
          'Use routerLink: <a routerLink="/profile">Profile</a>',
          'Import component in routing module'
        ]
      },
      {
        id: 'angular-binding-story',
        title: 'Use Two-Way Binding on Form Input',
        description: 'Implement two-way data binding using ngModel directive on form inputs.',
        difficulty: 'easy',
        xpReward: 120,
        completed: false,
        tasks: [
          {
            id: 'binding-task-1',
            description: 'Create property in component class',
            file: 'src/app/form/form.component.ts',
            completed: false,
            validationCriteria: ['Property declared in component', 'Property has initial value', 'Property is public']
          },
          {
            id: 'binding-task-2',
            description: 'Add ngModel to input field',
            file: 'src/app/form/form.component.html',
            completed: false,
            validationCriteria: ['ngModel directive on input', 'Two-way binding syntax [(ngModel)]', 'FormsModule imported']
          },
          {
            id: 'binding-task-3',
            description: 'Display bound value in template',
            file: 'src/app/form/form.component.html',
            completed: false,
            validationCriteria: ['Interpolation shows property value', 'Value updates as user types', 'Binding works both ways']
          }
        ],
        hints: [
          'Declare property: public username: string = "";',
          'Use two-way binding: [(ngModel)]="username"',
          'Display value: {{username}}',
          'Import FormsModule in app.module.ts'
        ]
      },
      {
        id: 'angular-service-story',
        title: 'Add Shared Service to Share Data Between Components',
        description: 'Create an Angular service to share data between multiple components.',
        difficulty: 'medium',
        xpReward: 180,
        completed: false,
        tasks: [
          {
            id: 'service-task-1',
            description: 'Generate and configure service',
            file: 'src/app/services/data.service.ts',
            completed: false,
            validationCriteria: ['Injectable decorator present', 'Service class exported', 'providedIn: "root" configured']
          },
          {
            id: 'service-task-2',
            description: 'Add data sharing methods',
            file: 'src/app/services/data.service.ts',
            completed: false,
            validationCriteria: ['BehaviorSubject or Subject used', 'Getter method for data', 'Setter method for data']
          },
          {
            id: 'service-task-3',
            description: 'Inject service in components',
            file: 'src/app/component-a/component-a.component.ts',
            completed: false,
            validationCriteria: ['Service injected in constructor', 'Component subscribes to service data', 'Component can update shared data']
          }
        ],
        hints: [
          'Generate service: ng generate service services/data',
          'Use BehaviorSubject: private dataSubject = new BehaviorSubject(initialValue)',
          'Inject in constructor: constructor(private dataService: DataService)',
          'Subscribe: this.dataService.data$.subscribe(data => {...})'
        ]
      }
    ]
  },
  {
    id: 'angular-tic-tac-toe',
    name: 'ng-beginner-tic-tac-toe',
    fullName: 'gaetanBloch/ng-beginner',
    description: 'Tic-tac-toe game built in Angular 2+ with game logic and UI',
    language: 'TypeScript',
    stars: 145,
    forks: 67,
    topics: ['angular', 'game', 'tic-tac-toe', 'beginner'],
    difficulty: 'intermediate',
    category: 'angular',
    setupInstructions: [
      'npm install',
      'ng serve',
      'Open http://localhost:4200'
    ],
    userStories: [
      {
        id: 'tictactoe-game-story',
        title: 'Play Full Tic-Tac-Toe Game with X/O Turn Logic',
        description: 'Implement complete game logic for tic-tac-toe including turn management and win detection.',
        difficulty: 'medium',
        xpReward: 250,
        completed: false,
        tasks: [
          {
            id: 'game-task-1',
            description: 'Create game board state and current player tracking',
            file: 'src/app/game/game.component.ts',
            completed: false,
            validationCriteria: ['Board array with 9 elements', 'currentPlayer property (X or O)', 'Game state management']
          },
          {
            id: 'game-task-2',
            description: 'Implement move logic and turn switching',
            file: 'src/app/game/game.component.ts',
            completed: false,
            validationCriteria: ['makeMove method implemented', 'Turn alternates between X and O', 'Prevents moves on occupied squares']
          },
          {
            id: 'game-task-3',
            description: 'Add win detection logic',
            file: 'src/app/game/game.component.ts',
            completed: false,
            validationCriteria: ['checkWinner method implemented', 'Detects horizontal wins', 'Detects vertical and diagonal wins']
          }
        ],
        hints: [
          'Use array: board: string[] = Array(9).fill("")',
          'Switch turns: this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"',
          'Check win patterns: [[0,1,2], [3,4,5], [6,7,8], [0,3,6], ...]',
          'Win condition: board[a] && board[a] === board[b] && board[a] === board[c]'
        ]
      }
    ]
  },
  // Node.js Projects
  {
    id: 'nodejs-10-projects',
    name: 'NodeJS_Projects',
    fullName: 'MAshrafM/NodeJS_Projects',
    description: 'Collection of 10 beginner Node.js projects + REST APIs',
    language: 'JavaScript',
    stars: 420,
    forks: 125,
    topics: ['nodejs', 'express', 'rest-api', 'crud', 'beginner'],
    difficulty: 'intermediate',
    category: 'nodejs',
    setupInstructions: [
      'npm install',
      'npm start',
      'Test endpoints with Postman or curl'
    ],
    userStories: [
      {
        id: 'nodejs-crud-story',
        title: 'Build REST API with CRUD for Todos Resource',
        description: 'Create a complete REST API with Create, Read, Update, Delete operations for todos.',
        difficulty: 'medium',
        xpReward: 220,
        completed: false,
        tasks: [
          {
            id: 'crud-task-1',
            description: 'Set up Express server and routes',
            file: 'server.js',
            completed: false,
            validationCriteria: ['Express app initialized', 'JSON middleware configured', 'Routes defined for /api/todos']
          },
          {
            id: 'crud-task-2',
            description: 'Implement GET and POST endpoints',
            file: 'routes/todos.js',
            completed: false,
            validationCriteria: ['GET /todos returns all todos', 'POST /todos creates new todo', 'Proper HTTP status codes']
          },
          {
            id: 'crud-task-3',
            description: 'Add PUT and DELETE endpoints',
            file: 'routes/todos.js',
            completed: false,
            validationCriteria: ['PUT /todos/:id updates todo', 'DELETE /todos/:id removes todo', 'Error handling for invalid IDs']
          }
        ],
        hints: [
          'Use express.Router() for modular routes',
          'Store data in array initially: let todos = []',
          'Generate IDs: id: Date.now() or use uuid',
          'Find by ID: todos.find(todo => todo.id === parseInt(req.params.id))'
        ]
      },
      {
        id: 'nodejs-filtering-story',
        title: 'Add Query Filtering (completed=true)',
        description: 'Implement query parameter filtering to filter todos by completion status.',
        difficulty: 'easy',
        xpReward: 140,
        completed: false,
        tasks: [
          {
            id: 'filter-task-1',
            description: 'Add query parameter parsing',
            file: 'routes/todos.js',
            completed: false,
            validationCriteria: ['req.query.completed accessed', 'Query parameter validation', 'Default behavior when no filter']
          },
          {
            id: 'filter-task-2',
            description: 'Filter todos based on completed status',
            file: 'routes/todos.js',
            completed: false,
            validationCriteria: ['Todos filtered by completed property', 'Returns only completed todos when completed=true', 'Returns only incomplete when completed=false']
          }
        ],
        hints: [
          'Access query: const { completed } = req.query',
          'Filter array: todos.filter(todo => todo.completed === (completed === "true"))',
          'Handle string conversion: completed === "true" converts to boolean',
          'Return all if no filter: if (!completed) return res.json(todos)'
        ]
      },
      {
        id: 'nodejs-validation-story',
        title: 'Add Basic Input Validation',
        description: 'Implement input validation using express-validator for API endpoints.',
        difficulty: 'medium',
        xpReward: 160,
        completed: false,
        tasks: [
          {
            id: 'validation-task-1',
            description: 'Install and configure express-validator',
            file: 'package.json',
            completed: false,
            validationCriteria: ['express-validator in dependencies', 'Validation middleware imported', 'Validation rules defined']
          },
          {
            id: 'validation-task-2',
            description: 'Add validation rules for todo creation',
            file: 'routes/todos.js',
            completed: false,
            validationCriteria: ['Title field validation (required, min length)', 'Validation middleware applied to POST route', 'Error messages returned for invalid input']
          }
        ],
        hints: [
          'Install: npm install express-validator',
          'Import: const { body, validationResult } = require("express-validator")',
          'Add validation: body("title").isLength({ min: 1 }).withMessage("Title required")',
          'Check errors: const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({errors})'
        ]
      }
    ]
  },
  {
    id: 'node-realworld-api',
    name: 'node-express-realworld-example-app',
    fullName: 'gothinkster/node-express-realworld-example-app',
    description: 'RealWorld backend example (Node + Express + PostgreSQL) with authentication',
    language: 'JavaScript',
    stars: 1850,
    forks: 520,
    topics: ['nodejs', 'express', 'postgresql', 'jwt', 'authentication', 'realworld'],
    difficulty: 'advanced',
    category: 'nodejs',
    setupInstructions: [
      'npm install',
      'Set up PostgreSQL database',
      'Configure environment variables',
      'npm start'
    ],
    userStories: [
      {
        id: 'realworld-profile-story',
        title: 'Add & Fetch User Profiles (GET /profiles/:username)',
        description: 'Implement user profile endpoints to fetch and display user information.',
        difficulty: 'medium',
        xpReward: 200,
        completed: false,
        tasks: [
          {
            id: 'profile-task-1',
            description: 'Create profile route handler',
            file: 'routes/api/profiles.js',
            completed: false,
            validationCriteria: ['GET /profiles/:username route defined', 'Username parameter extracted', 'User lookup by username']
          },
          {
            id: 'profile-task-2',
            description: 'Return profile data with following status',
            file: 'routes/api/profiles.js',
            completed: false,
            validationCriteria: ['Profile object returned', 'Following status included', 'Proper error handling for non-existent users']
          }
        ],
        hints: [
          'Extract username: const { username } = req.params',
          'Find user: await User.findOne({ username })',
          'Return profile: res.json({ profile: { username, bio, image, following } })',
          'Handle not found: if (!user) return res.status(404).json({errors: {profile: "not found"}})'
        ]
      },
      {
        id: 'realworld-auth-story',
        title: 'Create Persistent Session Login (Token-based)',
        description: 'Implement JWT-based authentication for persistent user sessions.',
        difficulty: 'hard',
        xpReward: 280,
        completed: false,
        tasks: [
          {
            id: 'auth-task-1',
            description: 'Generate JWT tokens on login',
            file: 'routes/api/users.js',
            completed: false,
            validationCriteria: ['JWT token generated on successful login', 'Token includes user ID', 'Token has expiration time']
          },
          {
            id: 'auth-task-2',
            description: 'Create token verification middleware',
            file: 'middleware/auth.js',
            completed: false,
            validationCriteria: ['Middleware extracts token from header', 'Token verification using JWT', 'User attached to request object']
          }
        ],
        hints: [
          'Generate token: jwt.sign({ id: user.id }, secret, { expiresIn: "7d" })',
          'Extract token: const token = req.header("Authorization")?.replace("Bearer ", "")',
          'Verify token: const decoded = jwt.verify(token, secret)',
          'Attach user: req.user = await User.findById(decoded.id)'
        ]
      }
    ]
  }
];

const Playground: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { currentPlaygroundSession, updatePlaygroundSession } = useWebElevateStore();

  // Enhanced State Management
  const [currentView, setCurrentView] = useState<'repo-selection' | 'playground'>('repo-selection');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [playgroundSession, setPlaygroundSession] = useState<PlaygroundSession | null>(null);

  const [files, setFiles] = useState<FileNode[]>([]);
  const [isLoadingRepo, setIsLoadingRepo] = useState(false);
  const [repoFilter, setRepoFilter] = useState<'all' | 'react' | 'nodejs' | 'angular' | 'vue' | 'html-css-js'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const [activeFile, setActiveFile] = useState<string>('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'Welcome to Web Elevate GitHub Playground!',
    'Select a repository to get started.',
    ''
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'tests' | 'stories'>('stories');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isAIAdvisorVisible, setIsAIAdvisorVisible] = useState<boolean>(false);

  // Gamification State
  const [userXP, setUserXP] = useState<number>(0);
  const [completedStories, setCompletedStories] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set());
  const [showBadgeEarned, setShowBadgeEarned] = useState<string | null>(null);

  // Layout State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  // Session Management Functions
  const saveSessionToStorage = (session: PlaygroundSession) => {
    try {
      localStorage.setItem(`playground-session-${session.repoId}`, JSON.stringify({
        ...session,
        files,
        completedStories: Array.from(completedStories),
        earnedBadges: Array.from(earnedBadges),
        userXP,
        lastSaved: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const loadSessionFromStorage = (repoId: string): PlaygroundSession | null => {
    try {
      const saved = localStorage.getItem(`playground-session-${repoId}`);
      if (saved) {
        const session = JSON.parse(saved);
        return {
          ...session,
          lastSaved: new Date(session.lastSaved)
        };
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
    return null;
  };

  const restoreSession = (savedSession: any) => {
    setFiles(savedSession.files || []);
    setCompletedStories(new Set(savedSession.completedStories || []));
    setEarnedBadges(new Set(savedSession.earnedBadges || []));
    setUserXP(savedSession.userXP || 0);
    setPlaygroundSession(savedSession);

    setTerminalOutput(prev => [...prev,
      `📁 Session restored from ${new Date(savedSession.lastSaved).toLocaleString()}`,
      `🏆 XP: ${savedSession.userXP || 0}`,
      `✅ Stories: ${savedSession.completedStories?.length || 0}`,
      `🏅 Badges: ${savedSession.earnedBadges?.length || 0}`,
      ''
    ]);
  };

  // Auto-save session every 30 seconds
  useEffect(() => {
    if (playgroundSession) {
      const interval = setInterval(() => {
        saveSessionToStorage(playgroundSession);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [playgroundSession, files, completedStories, earnedBadges, userXP]);

  // Save session when component unmounts
  useEffect(() => {
    return () => {
      if (playgroundSession) {
        saveSessionToStorage(playgroundSession);
      }
    };
  }, [playgroundSession]);

  // Badge and Achievement Functions
  const checkForNewBadges = (newXP: number, newCompletedStories: Set<string>) => {
    badges.forEach(badge => {
      if (!earnedBadges.has(badge.id) && badge.condition(newXP, newCompletedStories, sampleRepos)) {
        setEarnedBadges(prev => new Set([...prev, badge.id]));
        setShowBadgeEarned(badge.id);
        setTimeout(() => setShowBadgeEarned(null), 4000);

        setTerminalOutput(prev => [...prev,
          `🎉 Badge Earned: ${badge.name}`,
          `   ${badge.description}`,
          ''
        ]);
      }
    });
  };

  // Story Validation System
  const validateStoryCompletion = (story: UserStory): { isValid: boolean; feedback: string[]; completedTasks: number } => {
    const feedback: string[] = [];
    let completedTasks = 0;

    story.tasks.forEach(task => {
      const fileContent = getFileContent(task.file);
      const validationResults = validateTask(task, fileContent, story);

      if (validationResults.isValid) {
        completedTasks++;
        feedback.push(`✅ ${task.description} - COMPLETED`);
      } else {
        feedback.push(`❌ ${task.description} - NEEDS WORK`);
        validationResults.issues.forEach(issue => {
          feedback.push(`   • ${issue}`);
        });
      }
    });

    const isValid = completedTasks === story.tasks.length;

    if (isValid) {
      feedback.push(`🎉 All tasks completed! Story "${story.title}" is ready for submission.`);
    } else {
      feedback.push(`📝 ${completedTasks}/${story.tasks.length} tasks completed. Keep working!`);
    }

    return { isValid, feedback, completedTasks };
  };

  const validateTask = (task: Task, fileContent: string, story: UserStory): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    let isValid = true;

    if (!fileContent) {
      issues.push(`File ${task.file} not found or empty`);
      return { isValid: false, issues };
    }

    // React-specific validations
    if (story.id.includes('counter')) {
      if (task.id === 'counter-task-1') {
        if (!fileContent.includes('useState')) {
          issues.push('useState hook not found');
          isValid = false;
        }
        if (!fileContent.includes('count') || !fileContent.includes('setCount')) {
          issues.push('count state variable or setCount function not found');
          isValid = false;
        }
      }
      if (task.id === 'counter-task-2') {
        if (!fileContent.includes('onClick') || !fileContent.includes('+')) {
          issues.push('Increment button or onClick handler not found');
          isValid = false;
        }
        if (!fileContent.includes('setCount') || !fileContent.includes('+ 1')) {
          issues.push('Increment logic not implemented correctly');
          isValid = false;
        }
      }
      if (task.id === 'counter-task-3') {
        if (!fileContent.includes('onClick') || !fileContent.includes('-')) {
          issues.push('Decrement button or onClick handler not found');
          isValid = false;
        }
        if (!fileContent.includes('setCount') || !fileContent.includes('- 1')) {
          issues.push('Decrement logic not implemented correctly');
          isValid = false;
        }
      }
    }

    // Theme toggle validations
    if (story.id.includes('theme')) {
      if (task.id === 'theme-task-1') {
        if (!fileContent.includes('useState') || !fileContent.includes('theme')) {
          issues.push('Theme state with useState not found');
          isValid = false;
        }
      }
      if (task.id === 'theme-task-2') {
        if (!fileContent.includes('setTheme') || !fileContent.includes('onClick')) {
          issues.push('Theme toggle functionality not implemented');
          isValid = false;
        }
      }
    }

    // Quiz validations
    if (story.id.includes('quiz')) {
      if (task.id === 'quiz-task-1') {
        if (!fileContent.includes('questions') || !fileContent.includes('currentQuestion')) {
          issues.push('Questions array or currentQuestion state not found');
          isValid = false;
        }
      }
    }

    // Movie search validations
    if (story.id.includes('movie')) {
      if (task.id === 'movie-task-2') {
        if (!fileContent.includes('fetch') && !fileContent.includes('axios')) {
          issues.push('API fetch call not found');
          isValid = false;
        }
        if (!fileContent.includes('async')) {
          issues.push('Async function not found');
          isValid = false;
        }
      }
    }

    // Node.js CRUD validations
    if (story.id.includes('crud')) {
      if (task.id === 'crud-task-1') {
        if (!fileContent.includes('express') || !fileContent.includes('app.use')) {
          issues.push('Express setup not found');
          isValid = false;
        }
      }
      if (task.id === 'crud-task-2') {
        if (!fileContent.includes('app.get') || !fileContent.includes('app.post')) {
          issues.push('GET or POST routes not implemented');
          isValid = false;
        }
      }
    }

    // Angular validations
    if (story.id.includes('angular')) {
      if (task.id === 'angular-task-1') {
        if (!fileContent.includes('@Component') || !fileContent.includes('export class')) {
          issues.push('Angular component structure not found');
          isValid = false;
        }
      }
      if (task.id === 'binding-task-2') {
        if (!fileContent.includes('[(ngModel)]')) {
          issues.push('Two-way binding with ngModel not found');
          isValid = false;
        }
      }
    }

    return { isValid, issues };
  };

  const handleStoryCompletion = (storyId: string, xp: number) => {
    const story = selectedRepo?.userStories.find(s => s.id === storyId);
    if (!story) return;

    // Validate the story completion
    const validation = validateStoryCompletion(story);

    setTerminalOutput(prev => [...prev,
      `🔍 Validating story: ${story.title}`,
      ...validation.feedback,
      ''
    ]);

    if (validation.isValid) {
      // Story is actually completed
      const newCompletedStories = new Set([...completedStories, storyId]);
      const newXP = userXP + xp;

      setCompletedStories(newCompletedStories);
      setUserXP(newXP);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);

      // Check for new badges
      checkForNewBadges(newXP, newCompletedStories);

      setTerminalOutput(prev => [...prev,
        `🎉 Story validation PASSED!`,
        `✅ Story completed: +${xp} XP`,
        `🏆 Total XP: ${newXP}`,
        ''
      ]);
    } else {
      // Story validation failed
      setTerminalOutput(prev => [...prev,
        `❌ Story validation FAILED!`,
        `📚 Please complete the remaining tasks and try again.`,
        `💡 Hint: Check the validation feedback above for specific issues.`,
        ''
      ]);
    }
  };

  // GitHub Integration Functions
  const handleGitHubLogin = async () => {
    // In a real implementation, this would use GitHub OAuth
    // For demo purposes, we'll simulate a login
    setTerminalOutput(prev => [...prev, '🔄 Connecting to GitHub...', '']);

    // Simulate OAuth flow
    setTimeout(() => {
      const mockUser: GitHubUser = {
        login: 'demo-user',
        name: 'Demo User',
        avatar_url: 'https://github.com/github.png',
        email: 'demo@example.com',
        accessToken: 'mock-token'
      };
      setGithubUser(mockUser);
      setTerminalOutput(prev => [...prev,
        `✅ Successfully logged in as ${mockUser.name}`,
        '🔑 GitHub access token obtained',
        '📁 You can now fork and push repositories',
        ''
      ]);
    }, 1500);
  };

  const forkRepository = async () => {
    if (!githubUser || !selectedRepo) return;

    setTerminalOutput(prev => [...prev,
      `🍴 Forking ${selectedRepo.fullName}...`,
      '🔄 Creating fork in your GitHub account...'
    ]);

    // Simulate forking process
    setTimeout(() => {
      const forkUrl = `https://github.com/${githubUser.login}/${selectedRepo.name}`;
      setPlaygroundSession(prev => prev ? {
        ...prev,
        isForked: true,
        forkUrl
      } : null);

      setTerminalOutput(prev => [...prev,
        `✅ Repository forked successfully!`,
        `🔗 Fork URL: ${forkUrl}`,
        '💡 You can now make changes and push them to your fork',
        ''
      ]);
    }, 2000);
  };

  const pushToGitHub = async () => {
    if (!githubUser || !selectedRepo || !playgroundSession?.isForked) {
      setTerminalOutput(prev => [...prev,
        '❌ Please login to GitHub and fork the repository first',
        ''
      ]);
      return;
    }

    setTerminalOutput(prev => [...prev,
      '🚀 Pushing changes to your GitHub fork...',
      '📦 Preparing files for commit...',
      '🔄 Uploading to GitHub...'
    ]);

    // Simulate push process
    setTimeout(() => {
      setTerminalOutput(prev => [...prev,
        `✅ Successfully pushed to ${playgroundSession.forkUrl}`,
        '🎉 Your changes are now live on GitHub!',
        '💡 You can create a pull request to contribute back',
        ''
      ]);

      // Reset unsaved changes
      setHasUnsavedChanges(false);
    }, 3000);
  };

  const loadRepository = async (repo: GitHubRepo) => {
    setIsLoadingRepo(true);
    setSelectedRepo(repo);
    setTerminalOutput(prev => [...prev, `📦 Loading repository: ${repo.fullName}`, '']);

    // Check for existing session
    const existingSession = loadSessionFromStorage(repo.id);

    // Simulate loading repository files
    setTimeout(() => {
      if (existingSession) {
        // Restore existing session
        setTerminalOutput(prev => [...prev, `🔄 Found existing session, restoring...`, '']);
        restoreSession(existingSession);
        setActiveFile(getDefaultFile(existingSession.files));
      } else {
        // Create new session
        const mockFiles = generateMockRepoFiles(repo);
        console.log('Generated mock files:', mockFiles);

        setFiles(mockFiles);
        const defaultFile = getDefaultFile(mockFiles);
        console.log('Setting default file:', defaultFile);
        setActiveFile(defaultFile);

        // Verify file content is available
        setTimeout(() => {
          const content = getFileContent(defaultFile);
          console.log('Default file content check:', content.length > 0 ? 'Content loaded' : 'No content');
        }, 100);

        // Create playground session
        const session: PlaygroundSession = {
          id: `session-${Date.now()}`,
          repoId: repo.id,
          userId: githubUser?.login,
          files: mockFiles,
          completedStories: [],
          totalXP: 0,
          lastSaved: new Date(),
          isForked: false
        };
        setPlaygroundSession(session);

        setTerminalOutput(prev => [...prev,
          `✅ Repository loaded successfully!`,
          `📁 ${mockFiles.length} files loaded`,
          `🎯 ${repo.userStories.length} user stories available`,
          `📝 Default file: ${defaultFile}`,
          ''
        ]);
      }

      setCurrentView('playground');
      setIsLoadingRepo(false);
    }, 2000);
  };

  const generateMockRepoFiles = (repo: GitHubRepo): FileNode[] => {
    // Generate mock file structure based on repository type and specific project
    switch (repo.id) {
      case 'react-50-projects':
        return [
          {
            name: 'src',
            type: 'folder',
            isOpen: true,
            children: [
              {
                name: 'components',
                type: 'folder',
                isOpen: true,
                children: [
                  {
                    name: 'Counter.js',
                    type: 'file',
                    content: `import React, { useState } from 'react';\nimport './Counter.css';\n\n// Complete Counter Component - Ready to Run!\nfunction Counter() {\n  // State to track the current count\n  const [count, setCount] = useState(0);\n  \n  // Function to increment the counter\n  const increment = () => {\n    setCount(prevCount => prevCount + 1);\n  };\n  \n  // Function to decrement the counter\n  const decrement = () => {\n    setCount(prevCount => prevCount - 1);\n  };\n  \n  // Function to reset the counter\n  const reset = () => {\n    setCount(0);\n  };\n\n  return (\n    <div className="counter">\n      <h2>🔢 Counter App</h2>\n      <div className="counter-display">\n        <span className="count-value">{count}</span>\n      </div>\n      <div className="counter-buttons">\n        <button \n          className="btn btn-decrement" \n          onClick={decrement}\n          disabled={count <= 0}\n        >\n          ➖\n        </button>\n        <button \n          className="btn btn-reset" \n          onClick={reset}\n        >\n          🔄\n        </button>\n        <button \n          className="btn btn-increment" \n          onClick={increment}\n        >\n          ➕\n        </button>\n      </div>\n      <div className="counter-info">\n        <p>Current count: <strong>{count}</strong></p>\n        <p>Status: {count === 0 ? 'Zero' : count > 0 ? 'Positive' : 'Negative'}</p>\n      </div>\n    </div>\n  );\n}\n\nexport default Counter;`
                  },
                  {
                    name: 'ThemeToggle.js',
                    type: 'file',
                    content: `import React, { useState, useEffect } from 'react';\nimport './ThemeToggle.css';\n\n// Complete Theme Toggle Component - Ready to Run!\nfunction ThemeToggle() {\n  // State to track current theme (light or dark)\n  const [theme, setTheme] = useState('light');\n  \n  // Function to toggle between light and dark themes\n  const toggleTheme = () => {\n    const newTheme = theme === 'light' ? 'dark' : 'light';\n    setTheme(newTheme);\n  };\n  \n  // Apply theme to document body for global styling\n  useEffect(() => {\n    document.body.className = theme + '-theme';\n    return () => {\n      document.body.className = '';\n    };\n  }, [theme]);\n\n  return (\n    <div className={\`theme-toggle \${theme}-theme\`}>\n      <h2>🎨 Theme Toggle</h2>\n      <div className="content">\n        <div className="theme-info">\n          <p>Current theme: <strong>{theme === 'light' ? '☀️ Light' : '🌙 Dark'}</strong></p>\n          <div className="theme-preview">\n            <div className="preview-box">\n              <p>This is how your content looks!</p>\n              <small>Background and text colors change with theme</small>\n            </div>\n          </div>\n        </div>\n        <button \n          className="theme-toggle-btn"\n          onClick={toggleTheme}\n        >\n          Switch to {theme === 'light' ? '🌙 Dark' : '☀️ Light'}\n        </button>\n      </div>\n      <div className="theme-features">\n        <h3>Theme Features:</h3>\n        <ul>\n          <li>✅ Automatic body class application</li>\n          <li>✅ Smooth transitions</li>\n          <li>✅ Persistent state during session</li>\n          <li>✅ Accessible color contrast</li>\n        </ul>\n      </div>\n    </div>\n  );\n}\n\nexport default ThemeToggle;`
                  },
                  {
                    name: 'Quiz.js',
                    type: 'file',
                    content: `import React, { useState, useEffect } from 'react';\nimport './Quiz.css';\n\n// Complete Quiz Component with React Questions - Ready to Run!\nconst questions = [\n  {\n    id: 1,\n    question: "What is React?",\n    options: [\n      "A JavaScript library for building user interfaces",\n      "A database management system", \n      "A CSS framework",\n      "A server-side language"\n    ],\n    correct: 0\n  },\n  {\n    id: 2,\n    question: "What hook is used for state management in functional components?",\n    options: ["useEffect", "useState", "useContext", "useReducer"],\n    correct: 1\n  },\n  {\n    id: 3,\n    question: "What does JSX stand for?",\n    options: [\n      "JavaScript XML",\n      "Java Syntax Extension", \n      "JavaScript Extension",\n      "Java XML"\n    ],\n    correct: 0\n  },\n  {\n    id: 4,\n    question: "Which method is used to render a React component?",\n    options: ["render()", "display()", "show()", "mount()"],\n    correct: 0\n  },\n  {\n    id: 5,\n    question: "What is the virtual DOM?",\n    options: [\n      "A copy of the real DOM kept in memory",\n      "A new web browser",\n      "A CSS framework", \n      "A database"\n    ],\n    correct: 0\n  }\n];\n\nfunction Quiz() {\n  const [currentQuestion, setCurrentQuestion] = useState(0);\n  const [score, setScore] = useState(0);\n  const [selectedAnswer, setSelectedAnswer] = useState(null);\n  const [showResult, setShowResult] = useState(false);\n  const [quizCompleted, setQuizCompleted] = useState(false);\n  \n  // Function to handle answer selection\n  const handleAnswer = (selectedOption) => {\n    setSelectedAnswer(selectedOption);\n  };\n  \n  // Function to submit answer and go to next question\n  const submitAnswer = () => {\n    if (selectedAnswer === null) return;\n    \n    // Check if answer is correct\n    if (selectedAnswer === questions[currentQuestion].correct) {\n      setScore(score + 1);\n    }\n    \n    setShowResult(true);\n    \n    // Move to next question after showing result\n    setTimeout(() => {\n      if (currentQuestion < questions.length - 1) {\n        setCurrentQuestion(currentQuestion + 1);\n        setSelectedAnswer(null);\n        setShowResult(false);\n      } else {\n        setQuizCompleted(true);\n      }\n    }, 1500);\n  };\n  \n  // Function to restart quiz\n  const restartQuiz = () => {\n    setCurrentQuestion(0);\n    setScore(0);\n    setSelectedAnswer(null);\n    setShowResult(false);\n    setQuizCompleted(false);\n  };\n  \n  if (quizCompleted) {\n    return (\n      <div className="quiz">\n        <h2>🎉 Quiz Completed!</h2>\n        <div className="quiz-results">\n          <h3>Your Score: {score}/{questions.length}</h3>\n          <p className="score-percentage">\n            {Math.round((score / questions.length) * 100)}%\n          </p>\n          <p className="score-message">\n            {score === questions.length ? "Perfect! 🌟" : \n             score >= questions.length * 0.7 ? "Great job! 👏" :\n             score >= questions.length * 0.5 ? "Good effort! 👍" : "Keep learning! 📚"}\n          </p>\n          <button className="restart-btn" onClick={restartQuiz}>\n            🔄 Take Quiz Again\n          </button>\n        </div>\n      </div>\n    );\n  }\n\n  return (\n    <div className="quiz">\n      <h2>🧠 React Quiz</h2>\n      <div className="quiz-progress">\n        <p>Question {currentQuestion + 1} of {questions.length}</p>\n        <div className="progress-bar">\n          <div \n            className="progress-fill" \n            style={{width: \`\${((currentQuestion + 1) / questions.length) * 100}%\`}}\n          ></div>\n        </div>\n      </div>\n      \n      <div className="question-container">\n        <h3 className="question">{questions[currentQuestion].question}</h3>\n        \n        <div className="options">\n          {questions[currentQuestion].options.map((option, index) => (\n            <button\n              key={index}\n              className={\`option \${selectedAnswer === index ? 'selected' : ''} \${showResult ? (index === questions[currentQuestion].correct ? 'correct' : selectedAnswer === index ? 'incorrect' : '') : ''}\`}\n              onClick={() => handleAnswer(index)}\n              disabled={showResult}\n            >\n              {option}\n            </button>\n          ))}\n        </div>\n        \n        {showResult && (\n          <div className="result-feedback">\n            {selectedAnswer === questions[currentQuestion].correct ? (\n              <p className="correct-feedback">✅ Correct!</p>\n            ) : (\n              <p className="incorrect-feedback">\n                ❌ Incorrect. The correct answer is: {questions[currentQuestion].options[questions[currentQuestion].correct]}\n              </p>\n            )}\n          </div>\n        )}\n        \n        {!showResult && (\n          <button \n            className="submit-btn"\n            onClick={submitAnswer}\n            disabled={selectedAnswer === null}\n          >\n            Submit Answer\n          </button>\n        )}\n        \n        <div className="quiz-stats">\n          <p>Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</p>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nexport default Quiz;`
                  }
                ]
              },
              {
                name: 'App.js',
                type: 'file',
                content: `import React from 'react';\nimport Counter from './components/Counter';\nimport ThemeToggle from './components/ThemeToggle';\nimport Quiz from './components/Quiz';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>50 React Projects</h1>\n        <p>Learn React by building mini-apps!</p>\n      </header>\n      \n      <main className="projects-container">\n        <section className="project">\n          <Counter />\n        </section>\n        \n        <section className="project">\n          <ThemeToggle />\n        </section>\n        \n        <section className="project">\n          <Quiz />\n        </section>\n      </main>\n    </div>\n  );\n}\n\nexport default App;`
              },
              {
                name: 'App.css',
                type: 'file',
                content: `.App {\n  text-align: center;\n  min-height: 100vh;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 20px;\n}\n\n.App-header {\n  margin-bottom: 40px;\n}\n\n.App-header h1 {\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}\n\n.projects-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 30px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.project {\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 15px;\n  padding: 25px;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}`
              },
              {
                name: 'components',
                type: 'folder',
                isOpen: false,
                children: [
                  {
                    name: 'Counter.css',
                    type: 'file',
                    content: `.counter {\n  text-align: center;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 2rem;\n  border-radius: 20px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n  max-width: 400px;\n  margin: 0 auto;\n}\n\n.counter h2 {\n  margin-bottom: 1.5rem;\n  font-size: 1.8rem;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.3);\n}\n\n.counter-display {\n  background: rgba(255,255,255,0.2);\n  border-radius: 15px;\n  padding: 1.5rem;\n  margin: 1.5rem 0;\n  backdrop-filter: blur(10px);\n}\n\n.count-value {\n  font-size: 4rem;\n  font-weight: bold;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.3);\n  display: block;\n}\n\n.counter-buttons {\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n  margin: 1.5rem 0;\n}\n\n.btn {\n  font-size: 1.5rem;\n  width: 60px;\n  height: 60px;\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.btn-decrement {\n  background: linear-gradient(135deg, #ff6b6b, #ee5a52);\n  color: white;\n}\n\n.btn-increment {\n  background: linear-gradient(135deg, #51cf66, #40c057);\n  color: white;\n}\n\n.btn-reset {\n  background: linear-gradient(135deg, #74c0fc, #339af0);\n  color: white;\n}\n\n.btn:hover:not(:disabled) {\n  transform: translateY(-3px) scale(1.05);\n  box-shadow: 0 6px 20px rgba(0,0,0,0.3);\n}\n\n.btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none;\n}\n\n.counter-info {\n  background: rgba(255,255,255,0.1);\n  border-radius: 10px;\n  padding: 1rem;\n  margin-top: 1.5rem;\n  backdrop-filter: blur(5px);\n}\n\n.counter-info p {\n  margin: 0.5rem 0;\n  font-size: 1rem;\n}`
                  },
                  {
                    name: 'ThemeToggle.css',
                    type: 'file',
                    content: `.theme-toggle {\n  text-align: center;\n  padding: 2rem;\n  border-radius: 20px;\n  transition: all 0.5s ease;\n  max-width: 500px;\n  margin: 0 auto;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n}\n\n.theme-toggle.light-theme {\n  background: linear-gradient(135deg, #ffeaa7, #fab1a0);\n  color: #2d3436;\n}\n\n.theme-toggle.dark-theme {\n  background: linear-gradient(135deg, #2d3436, #636e72);\n  color: #ddd;\n}\n\n.theme-toggle h2 {\n  margin-bottom: 1.5rem;\n  font-size: 1.8rem;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n\n.content {\n  padding: 1.5rem;\n  border-radius: 15px;\n  margin: 1.5rem 0;\n}\n\n.theme-info {\n  margin-bottom: 1.5rem;\n}\n\n.theme-preview {\n  margin: 1rem 0;\n}\n\n.preview-box {\n  padding: 1rem;\n  border-radius: 10px;\n  margin: 1rem 0;\n  transition: all 0.3s ease;\n}\n\n.light-theme .preview-box {\n  background: rgba(255,255,255,0.3);\n  border: 2px solid rgba(255,255,255,0.5);\n}\n\n.dark-theme .preview-box {\n  background: rgba(0,0,0,0.3);\n  border: 2px solid rgba(255,255,255,0.2);\n}\n\n.theme-toggle-btn {\n  padding: 1rem 2rem;\n  border: none;\n  border-radius: 50px;\n  font-size: 1.1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  margin: 1rem 0;\n  box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n}\n\n.light-theme .theme-toggle-btn {\n  background: linear-gradient(135deg, #6c5ce7, #a29bfe);\n  color: white;\n}\n\n.dark-theme .theme-toggle-btn {\n  background: linear-gradient(135deg, #fdcb6e, #e17055);\n  color: white;\n}\n\n.theme-toggle-btn:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 6px 20px rgba(0,0,0,0.3);\n}\n\n.theme-features {\n  margin-top: 1.5rem;\n  text-align: left;\n}\n\n.theme-features h3 {\n  margin-bottom: 1rem;\n  text-align: center;\n}\n\n.theme-features ul {\n  list-style: none;\n  padding: 0;\n}\n\n.theme-features li {\n  padding: 0.5rem 0;\n  font-size: 0.9rem;\n}\n\n/* Global theme styles */\nbody.light-theme {\n  background: linear-gradient(135deg, #ffeaa7, #fab1a0);\n  color: #2d3436;\n  transition: all 0.5s ease;\n}\n\nbody.dark-theme {\n  background: linear-gradient(135deg, #2d3436, #636e72);\n  color: #ddd;\n  transition: all 0.5s ease;\n}`
                  },
                  {
                    name: 'Quiz.css',
                    type: 'file',
                    content: `.quiz {\n  text-align: center;\n  max-width: 600px;\n  margin: 0 auto;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 2rem;\n  border-radius: 20px;\n  box-shadow: 0 15px 35px rgba(0,0,0,0.2);\n}\n\n.quiz h2 {\n  margin-bottom: 1.5rem;\n  font-size: 2rem;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.3);\n}\n\n.quiz-progress {\n  margin-bottom: 2rem;\n}\n\n.quiz-progress p {\n  margin-bottom: 1rem;\n  font-size: 1.1rem;\n  opacity: 0.9;\n}\n\n.progress-bar {\n  background: rgba(255,255,255,0.2);\n  height: 8px;\n  border-radius: 4px;\n  overflow: hidden;\n}\n\n.progress-fill {\n  background: linear-gradient(90deg, #51cf66, #40c057);\n  height: 100%;\n  transition: width 0.5s ease;\n  border-radius: 4px;\n}\n\n.question-container {\n  background: rgba(255,255,255,0.1);\n  border-radius: 15px;\n  padding: 2rem;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255,255,255,0.2);\n}\n\n.question {\n  font-size: 1.3rem;\n  margin-bottom: 2rem;\n  font-weight: 600;\n  line-height: 1.4;\n}\n\n.options {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  margin-bottom: 2rem;\n}\n\n.option {\n  padding: 1rem 1.5rem;\n  border: 2px solid rgba(255,255,255,0.3);\n  border-radius: 12px;\n  background: rgba(255,255,255,0.1);\n  color: white;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  font-size: 1rem;\n  text-align: left;\n  backdrop-filter: blur(5px);\n}\n\n.option:hover:not(:disabled) {\n  border-color: rgba(255,255,255,0.6);\n  background: rgba(255,255,255,0.2);\n  transform: translateY(-2px);\n}\n\n.option.selected {\n  border-color: #74c0fc;\n  background: rgba(116,192,252,0.3);\n}\n\n.option.correct {\n  border-color: #51cf66;\n  background: rgba(81,207,102,0.3);\n}\n\n.option.incorrect {\n  border-color: #ff6b6b;\n  background: rgba(255,107,107,0.3);\n}\n\n.option:disabled {\n  cursor: not-allowed;\n}\n\n.submit-btn, .restart-btn {\n  background: linear-gradient(135deg, #74c0fc, #339af0);\n  color: white;\n  border: none;\n  padding: 1rem 2rem;\n  border-radius: 25px;\n  font-size: 1.1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n}\n\n.submit-btn:hover:not(:disabled), .restart-btn:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(0,0,0,0.3);\n}\n\n.submit-btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none;\n}\n\n.result-feedback {\n  margin: 1.5rem 0;\n  padding: 1rem;\n  border-radius: 10px;\n  font-weight: 600;\n}\n\n.correct-feedback {\n  background: rgba(81,207,102,0.2);\n  color: #51cf66;\n  border: 1px solid rgba(81,207,102,0.3);\n}\n\n.incorrect-feedback {\n  background: rgba(255,107,107,0.2);\n  color: #ff6b6b;\n  border: 1px solid rgba(255,107,107,0.3);\n}\n\n.quiz-stats {\n  margin-top: 1.5rem;\n  padding: 1rem;\n  background: rgba(255,255,255,0.1);\n  border-radius: 10px;\n  backdrop-filter: blur(5px);\n}\n\n.quiz-results {\n  text-align: center;\n  padding: 2rem;\n}\n\n.quiz-results h3 {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.score-percentage {\n  font-size: 3rem;\n  font-weight: bold;\n  margin: 1rem 0;\n  text-shadow: 0 2px 4px rgba(0,0,0,0.3);\n}\n\n.score-message {\n  font-size: 1.2rem;\n  margin: 1.5rem 0;\n  opacity: 0.9;\n}`
                  }
                ]
              },
              {
                name: 'index.js',
                type: 'file',
                content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`
              }
            ]
          },
          {
            name: 'public',
            type: 'folder',
            isOpen: false,
            children: [
              {
                name: 'index.html',
                type: 'file',
                content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>React Todo App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>`
              }
            ]
          },
          {
            name: 'package.json',
            type: 'file',
            content: `{\n  "name": "${repo.name}",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-scripts": "5.0.1"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  }\n}`
          },
          {
            name: 'README.md',
            type: 'file',
            content: `# ${repo.name}\n\n${repo.description}\n\n## Getting Started\n\n${repo.setupInstructions.map(step => `- ${step}`).join('\n')}\n\n## User Stories\n\n${repo.userStories.map(story => `### ${story.title}\n${story.description}\n**Difficulty:** ${story.difficulty} | **XP:** ${story.xpReward}`).join('\n\n')}`
          }
        ];

      case 'react-85-projects':
        return [
          {
            name: 'src',
            type: 'folder',
            isOpen: true,
            children: [
              {
                name: 'components',
                type: 'folder',
                isOpen: true,
                children: [
                  {
                    name: 'MovieSearch.js',
                    type: 'file',
                    content: `import React from 'react';\nimport './MovieSearch.css';\n\n// TODO: Implement movie search functionality\nfunction MovieSearch() {\n  // Add state for movies, searchTerm, and loading\n  \n  // Add search function\n  const searchMovies = async (query) => {\n    // TODO: Implement API fetch\n    // Example: const response = await fetch(\`https://www.omdbapi.com/?s=\${query}&apikey=YOUR_KEY\`);\n  };\n  \n  // Add handle search function\n  const handleSearch = (e) => {\n    e.preventDefault();\n    // TODO: Call searchMovies with search term\n  };\n\n  return (\n    <div className="movie-search">\n      <h2>Movie Search</h2>\n      <form onSubmit={handleSearch}>\n        <input \n          type="text"\n          placeholder="Search for movies..."\n          // TODO: Add value and onChange\n        />\n        <button type="submit">Search</button>\n      </form>\n      \n      <div className="movies-grid">\n        {/* TODO: Map through movies and display them */}\n        <p>Search results will appear here</p>\n      </div>\n    </div>\n  );\n}\n\nexport default MovieSearch;`
                  },
                  {
                    name: 'PaginatedList.js',
                    type: 'file',
                    content: `import React from 'react';\nimport './PaginatedList.css';\n\n// Sample data for demonstration\nconst sampleItems = Array.from({ length: 50 }, (_, i) => \`Item \${i + 1}\`);\n\nfunction PaginatedList() {\n  // TODO: Add state for currentPage\n  const itemsPerPage = 10;\n  \n  // TODO: Calculate items to display\n  const startIndex = 0; // Calculate based on currentPage\n  const endIndex = itemsPerPage; // Calculate based on currentPage\n  const currentItems = sampleItems.slice(startIndex, endIndex);\n  \n  // TODO: Calculate total pages\n  const totalPages = Math.ceil(sampleItems.length / itemsPerPage);\n  \n  // TODO: Add pagination functions\n  const goToPage = (page) => {\n    // Implement page navigation\n  };\n  \n  const nextPage = () => {\n    // Implement next page\n  };\n  \n  const prevPage = () => {\n    // Implement previous page\n  };\n\n  return (\n    <div className="paginated-list">\n      <h2>Paginated List</h2>\n      \n      <div className="items-list">\n        {currentItems.map((item, index) => (\n          <div key={index} className="list-item">\n            {item}\n          </div>\n        ))}\n      </div>\n      \n      <div className="pagination">\n        {/* TODO: Add pagination controls */}\n        <button onClick={prevPage}>Previous</button>\n        <span>Page 1 of {totalPages}</span>\n        <button onClick={nextPage}>Next</button>\n      </div>\n    </div>\n  );\n}\n\nexport default PaginatedList;`
                  }
                ]
              }
            ]
          }
        ];

      case 'angular-beginner-starter':
        return [
          {
            name: 'src',
            type: 'folder',
            isOpen: true,
            children: [
              {
                name: 'app',
                type: 'folder',
                isOpen: true,
                children: [
                  {
                    name: 'app.component.ts',
                    type: 'file',
                    content: `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-root',\n  templateUrl: './app.component.html',\n  styleUrls: ['./app.component.css']\n})\nexport class AppComponent {\n  title = 'angular-beginner-starter';\n}`
                  },
                  {
                    name: 'app.component.html',
                    type: 'file',
                    content: `<div class="container">\n  <h1>Welcome to {{title}}!</h1>\n  \n  <!-- TODO: Add navigation links here -->\n  <nav>\n    <a routerLink="/">Home</a>\n    <!-- Add more navigation links -->\n  </nav>\n  \n  <router-outlet></router-outlet>\n</div>`
                  },
                  {
                    name: 'app-routing.module.ts',
                    type: 'file',
                    content: `import { NgModule } from '@angular/core';\nimport { RouterModule, Routes } from '@angular/router';\n\n// TODO: Import your components here\n\nconst routes: Routes = [\n  // TODO: Add your routes here\n  // Example: { path: 'profile', component: ProfileComponent }\n];\n\n@NgModule({\n  imports: [RouterModule.forRoot(routes)],\n  exports: [RouterModule]\n})\nexport class AppRoutingModule { }`
                  },
                  {
                    name: 'form',
                    type: 'folder',
                    isOpen: false,
                    children: [
                      {
                        name: 'form.component.ts',
                        type: 'file',
                        content: `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-form',\n  templateUrl: './form.component.html',\n  styleUrls: ['./form.component.css']\n})\nexport class FormComponent {\n  // TODO: Add properties for two-way binding\n  // Example: public username: string = '';\n}`
                      },
                      {
                        name: 'form.component.html',
                        type: 'file',
                        content: `<div class="form-container">\n  <h2>Form with Two-Way Binding</h2>\n  \n  <form>\n    <div class="form-group">\n      <label for="username">Username:</label>\n      <!-- TODO: Add ngModel for two-way binding -->\n      <input type="text" id="username" placeholder="Enter username">\n    </div>\n    \n    <!-- TODO: Display the bound value -->\n    <p>You typed: </p>\n  </form>\n</div>`
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ];

      case 'nodejs-10-projects':
      case 'nodejs':
        return [
          {
            name: 'routes',
            type: 'folder',
            isOpen: true,
            children: [
              {
                name: 'todos.js',
                type: 'file',
                content: `const express = require('express');\nconst router = express.Router();\n\n// In-memory storage for demo (use database in production)\nlet todos = [\n  { id: 1, title: 'Learn Node.js', completed: false },\n  { id: 2, title: 'Build REST API', completed: true }\n];\n\n// TODO: Implement GET /todos endpoint\nrouter.get('/', (req, res) => {\n  // TODO: Add query filtering for completed status\n  // Example: ?completed=true should filter completed todos\n  \n  res.json(todos);\n});\n\n// TODO: Implement POST /todos endpoint\nrouter.post('/', (req, res) => {\n  // TODO: Add input validation\n  // TODO: Create new todo with auto-generated ID\n  // TODO: Add to todos array\n  // TODO: Return created todo\n  \n  res.status(501).json({ error: 'Not implemented yet' });\n});\n\n// TODO: Implement PUT /todos/:id endpoint\nrouter.put('/:id', (req, res) => {\n  // TODO: Find todo by ID\n  // TODO: Update todo properties\n  // TODO: Return updated todo\n  \n  res.status(501).json({ error: 'Not implemented yet' });\n});\n\n// TODO: Implement DELETE /todos/:id endpoint\nrouter.delete('/:id', (req, res) => {\n  // TODO: Find and remove todo by ID\n  // TODO: Return success message\n  \n  res.status(501).json({ error: 'Not implemented yet' });\n});\n\nmodule.exports = router;`
              }
            ]
          },
          {
            name: 'server.js',
            type: 'file',
            content: `const express = require('express');\nconst app = express();\n\n// TODO: Configure middleware\n// Add express.json() middleware for parsing JSON bodies\n\n// TODO: Import and use routes\nconst todosRouter = require('./routes/todos');\n// app.use('/api/todos', todosRouter);\n\n// Basic route\napp.get('/', (req, res) => {\n  res.json({ \n    message: 'Welcome to the Todos API!',\n    endpoints: {\n      'GET /api/todos': 'Get all todos',\n      'POST /api/todos': 'Create a new todo',\n      'PUT /api/todos/:id': 'Update a todo',\n      'DELETE /api/todos/:id': 'Delete a todo'\n    }\n  });\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(\`🚀 Server running on port \${PORT}\`);\n  console.log(\`📝 API available at http://localhost:\${PORT}/api/todos\`);\n});`
          },
          {
            name: 'package.json',
            type: 'file',
            content: `{\n  "name": "nodejs-todos-api",\n  "version": "1.0.0",\n  "description": "A simple REST API for managing todos",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js",\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "dependencies": {\n    "express": "^4.18.2"\n  },\n  "devDependencies": {\n    "nodemon": "^2.0.22"\n  },\n  "keywords": ["nodejs", "express", "rest-api", "todos"],\n  "author": "Web Elevate Student",\n  "license": "MIT"\n}`
          },
          {
            name: 'README.md',
            type: 'file',
            content: `# Node.js Todos REST API\n\nA simple REST API for managing todos built with Express.js.\n\n## Getting Started\n\n1. Install dependencies:\n   \`\`\`bash\n   npm install\n   \`\`\`\n\n2. Start the development server:\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n\n3. Test the API endpoints:\n   - GET http://localhost:3000/api/todos\n   - POST http://localhost:3000/api/todos\n   - PUT http://localhost:3000/api/todos/:id\n   - DELETE http://localhost:3000/api/todos/:id\n\n## User Stories\n\n### 1. Build REST API with CRUD for Todos Resource\n- [ ] Set up Express server and routes\n- [ ] Implement GET and POST endpoints\n- [ ] Add PUT and DELETE endpoints\n\n### 2. Add Query Filtering (completed=true)\n- [ ] Add query parameter parsing\n- [ ] Filter todos based on completed status\n\n### 3. Add Basic Input Validation\n- [ ] Install and configure express-validator\n- [ ] Add validation rules for todo creation\n\n## API Endpoints\n\n| Method | Endpoint | Description |\n|--------|----------|-------------|\n| GET | /api/todos | Get all todos |\n| GET | /api/todos?completed=true | Get completed todos |\n| POST | /api/todos | Create a new todo |\n| PUT | /api/todos/:id | Update a todo |\n| DELETE | /api/todos/:id | Delete a todo |\n\n## Example Todo Object\n\n\`\`\`json\n{\n  "id": 1,\n  "title": "Learn Node.js",\n  "completed": false\n}\n\`\`\``
          }
        ];

      default:
        return [];
    }
  };

  const getDefaultFile = (files: FileNode[]): string => {
    // Find the main file to open by default
    const findMainFile = (nodes: FileNode[], path = ''): string => {
      for (const node of nodes) {
        const currentPath = path ? `${path}/${node.name}` : node.name;
        if (node.type === 'file') {
          if (node.name === 'App.js' || node.name === 'index.js' || node.name === 'server.js') {
            return currentPath;
          }
        } else if (node.children) {
          const found = findMainFile(node.children, currentPath);
          if (found) return found;
        }
      }
      return '';
    };

    return findMainFile(files) || (files[0]?.children?.[0]?.name ? `${files[0].name}/${files[0].children[0].name}` : '');
  };

  const getFileContent = (path: string): string => {
    if (!path || !files.length) {
      console.log('No path or files available:', { path, filesLength: files.length });
      return '';
    }

    const pathParts = path.split('/');
    let current: FileNode[] = files;

    for (const part of pathParts) {
      const found = current.find(item => item.name === part);
      if (!found) {
        console.log(`File part not found: ${part} in path: ${path}`);
        return '';
      }

      if (found.type === 'file') {
        const content = found.content || '';
        console.log(`Retrieved content for ${path}:`, content.length > 0 ? `${content.length} characters` : 'empty');
        return content;
      } else if (found.children) {
        current = found.children;
      }
    }
    return '';
  };

  const updateFileContent = (path: string, content: string) => {
    const updateFiles = (items: FileNode[], pathParts: string[]): FileNode[] => {
      return items.map(item => {
        if (item.name === pathParts[0]) {
          if (pathParts.length === 1 && item.type === 'file') {
            return { ...item, content };
          } else if (item.children && pathParts.length > 1) {
            return { ...item, children: updateFiles(item.children, pathParts.slice(1)) };
          }
        }
        return item;
      });
    };

    setFiles(updateFiles(files, path.split('/')));
    setHasUnsavedChanges(true);

    // Auto-save after 2 seconds of inactivity
    setTimeout(() => {
      setHasUnsavedChanges(false);
      // In a real implementation, this would save to GitHub or local storage
    }, 2000);
  };

  // Tab Management Functions
  const openTab = (filePath: string) => {
    if (!openTabs.includes(filePath)) {
      setOpenTabs(prev => [...prev, filePath]);
    }
    setActiveFile(filePath);
  };

  const closeTab = (filePath: string) => {
    const newTabs = openTabs.filter(tab => tab !== filePath);
    setOpenTabs(newTabs);

    if (activeFile === filePath) {
      // Switch to the last tab or empty if no tabs
      setActiveFile(newTabs.length > 0 ? newTabs[newTabs.length - 1] : '');
    }
  };

  const saveCurrentFile = () => {
    if (activeFile && hasUnsavedChanges) {
      setHasUnsavedChanges(false);
      setTerminalOutput(prev => [...prev, `💾 Saved ${activeFile}`, '']);

      // In a real implementation, this would save to GitHub
      if (githubUser && playgroundSession) {
        setTerminalOutput(prev => [...prev, `🔄 Syncing with GitHub...`, '']);
        // Simulate GitHub sync
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, `✅ Synced to GitHub`, '']);
        }, 1000);
      }
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, '$ Running project...', '']);

    // Simulate code execution
    setTimeout(() => {
      const jsContent = getFileContent('src/script.js');
      const output = ['Project executed successfully!'];

      // Simple console.log extraction (for demo purposes)
      const consoleMatches = jsContent.match(/console\.log\([^)]+\)/g);
      if (consoleMatches) {
        consoleMatches.forEach(match => {
          const content = match.match(/console\.log\((.+)\)/)?.[1];
          if (content) {
            try {
              // Simple evaluation for demo (in real app, use sandboxed execution)
              const result = content.replace(/['"]/g, '').replace(/`([^`]+)`/, '$1');
              output.push(`> ${result}`);
            } catch (e) {
              output.push(`> ${content}`);
            }
          }
        });
      }

      setTerminalOutput(prev => [...prev, ...output, '']);
      setIsRunning(false);

      // Run tests
      runTests();
    }, 1000);
  };

  const runTests = () => {
    // Mock test results
    const mockTests = [
      { name: 'HTML structure is valid', passed: true, message: 'All HTML elements are properly structured' },
      { name: 'CSS styles are applied', passed: true, message: 'Styles are correctly linked and applied' },
      { name: 'JavaScript functions work', passed: true, message: 'All functions execute without errors' },
      { name: 'Console output is correct', passed: Math.random() > 0.3, message: 'Expected output matches actual output' }
    ];

    setTestResults(mockTests);
  };

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`]);
    const cmd = command.toLowerCase().trim();
    const args = cmd.split(' ');

    switch (args[0]) {
      case 'clear':
        setTerminalOutput(['']);
        break;

      case 'ls':
        const fileList = listFiles(files);
        setTerminalOutput(prev => [...prev, ...fileList, '']);
        break;

      case 'pwd':
        setTerminalOutput(prev => [...prev, `/workspace/${selectedRepo?.name || 'playground'}`, '']);
        break;

      case 'cat':
        if (args[1]) {
          const content = getFileContent(args[1]);
          if (content) {
            setTerminalOutput(prev => [...prev, content, '']);
          } else {
            setTerminalOutput(prev => [...prev, `cat: ${args[1]}: No such file or directory`, '']);
          }
        } else {
          setTerminalOutput(prev => [...prev, 'cat: missing file operand', '']);
        }
        break;

      case 'npm':
        handleNpmCommand(args.slice(1));
        break;

      case 'yarn':
        handleYarnCommand(args.slice(1));
        break;

      case 'git':
        handleGitCommand(args.slice(1));
        break;

      case 'help':
        setTerminalOutput(prev => [...prev,
          'Available commands:',
          '  clear - Clear terminal',
          '  ls - List files and directories',
          '  pwd - Print working directory',
          '  cat <file> - Display file contents',
          '  npm <command> - NPM package manager',
          '  yarn <command> - Yarn package manager',
          '  git <command> - Git version control',
          '  run - Execute project',
          '  test - Run tests',
          '  help - Show this help',
          ''
        ]);
        break;

      case 'run':
        runCode();
        return;

      case 'test':
        runTests();
        setTerminalOutput(prev => [...prev, 'Running tests...', '']);
        break;

      default:
        setTerminalOutput(prev => [...prev, `Command not found: ${args[0]}. Type 'help' for available commands.`, '']);
    }
  };

  const listFiles = (fileNodes: FileNode[], prefix = ''): string[] => {
    const result: string[] = [];
    fileNodes.forEach(node => {
      const fullPath = prefix ? `${prefix}/${node.name}` : node.name;
      if (node.type === 'folder') {
        result.push(`${fullPath}/`);
        if (node.isOpen && node.children) {
          result.push(...listFiles(node.children, fullPath));
        }
      } else {
        result.push(fullPath);
      }
    });
    return result;
  };

  const handleNpmCommand = (args: string[]) => {
    const subcommand = args[0];
    switch (subcommand) {
      case 'install':
      case 'i':
        setTerminalOutput(prev => [...prev,
          '📦 Installing dependencies...',
          'npm WARN deprecated package@1.0.0',
          '✅ Dependencies installed successfully',
          ''
        ]);
        break;
      case 'start':
        setTerminalOutput(prev => [...prev,
          '🚀 Starting development server...',
          `> ${selectedRepo?.name}@1.0.0 start`,
          '> react-scripts start',
          '',
          'Local:            http://localhost:3000',
          'On Your Network:  http://192.168.1.100:3000',
          '',
          'Note: This is a simulated environment',
          ''
        ]);
        break;
      case 'run':
        const script = args[1] || 'start';
        setTerminalOutput(prev => [...prev,
          `📜 Running script: ${script}`,
          `> ${selectedRepo?.name}@1.0.0 ${script}`,
          '✅ Script executed successfully',
          ''
        ]);
        break;
      case 'test':
        setTerminalOutput(prev => [...prev,
          '🧪 Running tests...',
          'PASS src/App.test.js',
          '✓ renders learn react link (23ms)',
          '',
          'Test Suites: 1 passed, 1 total',
          'Tests:       1 passed, 1 total',
          'Snapshots:   0 total',
          'Time:        2.841s',
          ''
        ]);
        break;
      default:
        setTerminalOutput(prev => [...prev, `npm: unknown command '${subcommand}'`, '']);
    }
  };

  const handleYarnCommand = (args: string[]) => {
    const subcommand = args[0];
    switch (subcommand) {
      case 'install':
        setTerminalOutput(prev => [...prev,
          '🧶 Installing dependencies with Yarn...',
          'yarn install v1.22.19',
          '[1/4] 🔍  Resolving packages...',
          '[2/4] 🚚  Fetching packages...',
          '[3/4] 🔗  Linking dependencies...',
          '[4/4] 🔨  Building fresh packages...',
          '✨  Done in 2.84s.',
          ''
        ]);
        break;
      case 'start':
        setTerminalOutput(prev => [...prev,
          '🚀 Starting with Yarn...',
          'yarn run v1.22.19',
          `$ react-scripts start`,
          'Starting the development server...',
          ''
        ]);
        break;
      default:
        setTerminalOutput(prev => [...prev, `yarn: unknown command '${subcommand}'`, '']);
    }
  };

  const handleGitCommand = (args: string[]) => {
    const subcommand = args[0];
    switch (subcommand) {
      case 'status':
        setTerminalOutput(prev => [...prev,
          'On branch main',
          'Your branch is up to date with \'origin/main\'.',
          '',
          'Changes not staged for commit:',
          '  (use "git add <file>..." to update what will be committed)',
          '  (use "git checkout -- <file>..." to discard changes in working directory)',
          '',
          '\tmodified:   src/App.js',
          '',
          'no changes added to commit (use "git add" and "git commit")',
          ''
        ]);
        break;
      case 'add':
        const file = args[1] || '.';
        setTerminalOutput(prev => [...prev, `✅ Added ${file} to staging area`, '']);
        break;
      case 'commit':
        if (args.includes('-m')) {
          const messageIndex = args.indexOf('-m') + 1;
          const message = args[messageIndex] || 'Update files';
          setTerminalOutput(prev => [...prev,
            `[main ${Math.random().toString(36).substr(2, 7)}] ${message}`,
            ' 1 file changed, 5 insertions(+), 2 deletions(-)',
            ''
          ]);
        } else {
          setTerminalOutput(prev => [...prev, 'git: commit message required. Use -m "message"', '']);
        }
        break;
      case 'push':
        if (githubUser) {
          setTerminalOutput(prev => [...prev,
            '🔄 Pushing to GitHub...',
            `Enumerating objects: 5, done.`,
            `Counting objects: 100% (5/5), done.`,
            `Delta compression using up to 8 threads`,
            `Compressing objects: 100% (3/3), done.`,
            `Writing objects: 100% (3/3), 342 bytes | 342.00 KiB/s, done.`,
            `Total 3 (delta 2), reused 0 (delta 0)`,
            `To github.com:${githubUser.login}/${selectedRepo?.name}.git`,
            `   abc1234..def5678  main -> main`,
            '✅ Successfully pushed to GitHub!',
            ''
          ]);
        } else {
          setTerminalOutput(prev => [...prev, 'git: Please login to GitHub first', '']);
        }
        break;
      case 'clone':
        const repoUrl = args[1];
        if (repoUrl) {
          setTerminalOutput(prev => [...prev,
            `Cloning into '${repoUrl.split('/').pop()}'...`,
            'remote: Enumerating objects: 123, done.',
            'remote: Total 123 (delta 0), reused 0 (delta 0), pack-reused 123',
            'Receiving objects: 100% (123/123), 45.67 KiB | 1.52 MiB/s, done.',
            'Resolving deltas: 100% (67/67), done.',
            '✅ Repository cloned successfully',
            ''
          ]);
        } else {
          setTerminalOutput(prev => [...prev, 'git: repository URL required', '']);
        }
        break;
      default:
        setTerminalOutput(prev => [...prev, `git: '${subcommand}' is not a git command. See 'git --help'.`, '']);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Render Repository Selection or Playground
  if (currentView === 'repo-selection') {
    return <RepositorySelection
      repos={sampleRepos}
      onSelectRepo={loadRepository}
      onGitHubLogin={handleGitHubLogin}
      githubUser={githubUser}
      isLoading={isLoadingRepo}
      repoFilter={repoFilter}
      setRepoFilter={setRepoFilter}
      difficultyFilter={difficultyFilter}
      setDifficultyFilter={setDifficultyFilter}
    />;
  }

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('repo-selection')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Repos</span>
            </button>

            {selectedRepo && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">{selectedRepo.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {selectedRepo.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="w-4 h-4" />
                  <span>{selectedRepo.stars}</span>
                </div>
              </div>
            )}

            {playgroundSession && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-gray-900">{userXP} XP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">{completedStories.size} stories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">{earnedBadges.size} badges</span>
                  {earnedBadges.size > 0 && (
                    <div className="flex space-x-1">
                      {Array.from(earnedBadges).slice(0, 3).map(badgeId => (
                        <span key={badgeId} className="text-xs">
                          {badges.find(b => b.id === badgeId)?.icon}
                        </span>
                      ))}
                      {earnedBadges.size > 3 && (
                        <span className="text-xs text-gray-500">+{earnedBadges.size - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <RotateCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>

            <button
              onClick={() => {
                if (playgroundSession) {
                  saveSessionToStorage(playgroundSession);
                  setTerminalOutput(prev => [...prev, '💾 Session saved to local storage', '']);
                }
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Session</span>
            </button>

            {githubUser && selectedRepo && (
              <div className="flex items-center space-x-2">
                {!playgroundSession?.isForked ? (
                  <button
                    onClick={forkRepository}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Fork Repo</span>
                  </button>
                ) : (
                  <button
                    onClick={pushToGitHub}
                    className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Push Changes</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => setIsAIAdvisorVisible(!isAIAdvisorVisible)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isAIAdvisorVisible
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* File Tree */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Files</h3>
              <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <FileTree
              files={files}
              activeFile={activeFile}
              onFileSelect={openTab}
              onToggleFolder={(path) => {
                // Toggle folder open/closed state
                const toggleFolder = (items: FileNode[], pathParts: string[]): FileNode[] => {
                  return items.map(item => {
                    if (item.name === pathParts[0]) {
                      if (pathParts.length === 1 && item.type === 'folder') {
                        return { ...item, isOpen: !item.isOpen };
                      } else if (item.children && pathParts.length > 1) {
                        return { ...item, children: toggleFolder(item.children, pathParts.slice(1)) };
                      }
                    }
                    return item;
                  });
                };
                setFiles(toggleFolder(files, path.split('/')));
              }}
            />
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* File Tabs */}
            {openTabs.length > 0 && (
              <div className="bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
                {openTabs.map((tab) => (
                  <div
                    key={tab}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm border-r border-gray-700 cursor-pointer transition-colors ${
                      activeFile === tab
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-750'
                    }`}
                    onClick={() => setActiveFile(tab)}
                  >
                    <FileText className="w-3 h-3" />
                    <span className="truncate max-w-32">{tab.split('/').pop()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Editor Header */}
            <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">{activeFile || 'No file selected'}</span>
                {hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {hasUnsavedChanges && (
                  <button
                    onClick={saveCurrentFile}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                )}
                <span className="text-xs text-gray-400">Monaco Editor</span>
              </div>
            </div>
            <div className="flex-1">
              {activeFile ? (
                <Editor
                  height="100%"
                  language={getLanguageFromFile(activeFile)}
                  theme="vs-dark"
                  value={getFileContent(activeFile) || `// Welcome to ${selectedRepo?.name || 'Playground'}!\n// File: ${activeFile}\n// Start coding here...\n\nconsole.log('Hello, World!');`}
                  onChange={(value) => value && updateFileContent(activeFile, value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    autoIndent: 'full'
                  }}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-400">
                  <div className="text-center">
                    <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No file selected</h3>
                    <p className="text-sm">Select a file from the explorer to start coding</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terminal/Output */}
          <div className="h-48 bg-black text-green-400 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium text-white">Terminal</span>
              </div>
              <button
                onClick={() => setTerminalOutput([''])}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4" ref={terminalRef}>
              <div className="font-mono text-sm space-y-1">
                {terminalOutput.map((line, index) => (
                  <div key={index} className={line.startsWith('$') ? 'text-yellow-400' : 'text-green-400'}>
                    {line}
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-yellow-400">$ </span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleTerminalCommand(terminalInput);
                        setTerminalInput('');
                      }
                    }}
                    className="bg-transparent border-none outline-none text-green-400 flex-1 ml-1"
                    placeholder="Type a command..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Right Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'stories', label: 'Stories', icon: Target },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'console', label: 'Console', icon: Terminal },
              { id: 'tests', label: 'Tests', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'stories' && selectedRepo && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">User Stories</h3>
                    <div className="flex items-center space-x-2 text-xs">
                      <Trophy className="w-3 h-3 text-yellow-600" />
                      <span className="text-gray-600">{userXP} XP</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedRepo.userStories.map((story) => (
                    <UserStoryCard
                      key={story.id}
                      story={story}
                      isCompleted={completedStories.has(story.id)}
                      onComplete={handleStoryCompletion}
                      onSelectFile={(file) => openTab(file)}
                      onValidate={validateStoryCompletion}
                    />
                  ))}

                  {selectedRepo.userStories.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No user stories available</p>
                      <p className="text-xs">Start coding to unlock challenges!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // Refresh preview
                          const iframe = document.querySelector('iframe[title="Live Preview"]') as HTMLIFrameElement;
                          if (iframe) {
                            iframe.src = iframe.src;
                          }
                        }}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh</span>
                      </button>
                      <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                        <ExternalLink className="w-3 h-3" />
                        <span>Open in new tab</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-white">
                  {selectedRepo ? (
                    <LivePreview repo={selectedRepo} files={files} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No preview available</p>
                        <p className="text-xs">Select a repository to see live preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Console Output</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="font-mono text-sm space-y-1">
                    {terminalOutput.filter(line => line.includes('>')).map((line, index) => (
                      <div key={index} className="text-gray-700">
                        {line}
                      </div>
                    ))}
                    {terminalOutput.filter(line => line.includes('>')).length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No console output yet</p>
                        <p className="text-xs">Run your code to see console.log output</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Test Results</h3>
                    <button
                      onClick={runTests}
                      className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Run Tests</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {testResults.length > 0 ? (
                    <div className="space-y-3">
                      {testResults.map((test, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          test.passed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {test.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                test.passed ? 'text-green-900' : 'text-red-900'
                              }`}>
                                {test.name}
                              </h4>
                              <p className={`text-xs mt-1 ${
                                test.passed ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {test.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tests run yet</p>
                      <p className="text-xs">Click "Run Tests" to check your code</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Advisor */}
      <AIAdvisor
        code={getFileContent(activeFile)}
        language={getLanguageFromFile(activeFile)}
        filename={activeFile}
        isVisible={isAIAdvisorVisible}
        onToggle={() => setIsAIAdvisorVisible(!isAIAdvisorVisible)}
      />

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Story Completed! 🎉</h3>
                  <p className="text-yellow-100">You earned XP points!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Earned Animation */}
      <AnimatePresence>
        {showBadgeEarned && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.5 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-yellow-300">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">
                  {badges.find(b => b.id === showBadgeEarned)?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">Badge Earned!</h3>
                  <p className="text-purple-100">
                    {badges.find(b => b.id === showBadgeEarned)?.name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Repository Selection Component
interface RepositorySelectionProps {
  repos: GitHubRepo[];
  onSelectRepo: (repo: GitHubRepo) => void;
  onGitHubLogin: () => void;
  githubUser: GitHubUser | null;
  isLoading: boolean;
  repoFilter: string;
  setRepoFilter: (filter: any) => void;
  difficultyFilter: string;
  setDifficultyFilter: (filter: any) => void;
}

const RepositorySelection: React.FC<RepositorySelectionProps> = ({
  repos,
  onSelectRepo,
  onGitHubLogin,
  githubUser,
  isLoading,
  repoFilter,
  setRepoFilter,
  difficultyFilter,
  setDifficultyFilter
}) => {
  const filteredRepos = repos.filter(repo => {
    const matchesCategory = repoFilter === 'all' || repo.category === repoFilter;
    const matchesDifficulty = difficultyFilter === 'all' || repo.difficulty === difficultyFilter;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            GitHub Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Learn by coding with real GitHub repositories. Pick a project, complete user stories, and earn XP!
          </p>

          {/* GitHub Login */}
          {!githubUser ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGitHubLogin}
              className="flex items-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mx-auto"
            >
              <Github className="w-6 h-6" />
              <span>Connect with GitHub</span>
            </motion.button>
          ) : (
            <div className="flex items-center justify-center space-x-4 bg-white rounded-xl p-4 shadow-lg max-w-md mx-auto">
              <img src={githubUser.avatar_url} alt={githubUser.name} className="w-10 h-10 rounded-full" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">{githubUser.name}</p>
                <p className="text-sm text-gray-600">@{githubUser.login}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filter Projects:</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={repoFilter}
                onChange={(e) => setRepoFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Technologies</option>
                <option value="react">React</option>
                <option value="nodejs">Node.js</option>
                <option value="angular">Angular</option>
                <option value="vue">Vue.js</option>
                <option value="html-css-js">HTML/CSS/JS</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredRepos.length} project{filteredRepos.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </motion.div>

        {/* Repository Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredRepos.map((repo, index) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              index={index}
              onSelect={() => onSelectRepo(repo)}
              isLoading={isLoading}
            />
          ))}
        </motion.div>

        {filteredRepos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more projects</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Repository Card Component
interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
  onSelect: () => void;
  isLoading: boolean;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, index, onSelect, isLoading }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'react': return '⚛️';
      case 'nodejs': return '🟢';
      case 'angular': return '🅰️';
      case 'vue': return '💚';
      case 'html-css-js': return '🌐';
      default: return '📁';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getCategoryIcon(repo.category)}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {repo.name}
              </h3>
              <p className="text-sm text-gray-600">{repo.language}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(repo.difficulty)}`}>
            {repo.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {repo.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitBranch className="w-4 h-4" />
              <span>{repo.forks}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{repo.userStories.length} stories</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {topic}
            </span>
          ))}
          {repo.topics.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
              +{repo.topics.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Total XP: {repo.userStories.reduce((sum, story) => sum + story.xpReward, 0)}
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Start Coding</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// User Story Card Component
interface UserStoryCardProps {
  story: UserStory;
  isCompleted: boolean;
  onComplete: (storyId: string, xp: number) => void;
  onSelectFile: (file: string) => void;
  onValidate?: (story: UserStory) => { isValid: boolean; feedback: string[]; completedTasks: number };
}

const UserStoryCard: React.FC<UserStoryCardProps> = ({ story, isCompleted, onComplete, onSelectFile, onValidate }) => {
  const [showValidation, setShowValidation] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; feedback: string[]; completedTasks: number } | null>(null);
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCheckWork = () => {
    if (onValidate) {
      const result = onValidate(story);
      setValidationResult(result);
      setShowValidation(true);
    }
  };

  const handleMarkComplete = () => {
    if (validationResult?.isValid) {
      onComplete(story.id, story.xpReward);
      setShowValidation(false);
    } else {
      // Show validation first
      handleCheckWork();
    }
  };

  return (
    <div className={`border rounded-xl p-4 transition-all ${
      isCompleted
        ? 'bg-green-50 border-green-200'
        : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Target className="w-5 h-5 text-blue-600" />
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(story.difficulty)}`}>
            {story.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <Trophy className="w-3 h-3 text-yellow-600" />
          <span className="font-medium">{story.xpReward} XP</span>
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 mb-2">{story.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{story.description}</p>

      <div className="space-y-2 mb-3">
        {story.tasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-2">
            <div className={`w-4 h-4 rounded border-2 mt-0.5 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300'
            }`}>
              {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-700">{task.description}</p>
              <button
                onClick={() => onSelectFile(task.file)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                {task.file}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Feedback */}
      {showValidation && validationResult && (
        <div className={`mt-4 p-3 rounded-lg border ${
          validationResult.isValid
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-semibold">
              {validationResult.isValid ? '✅ Validation Passed!' : '📝 Validation Results'}
            </h5>
            <button
              onClick={() => setShowValidation(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {validationResult.feedback.map((feedback, index) => (
              <p key={index} className="text-xs text-gray-700">
                {feedback}
              </p>
            ))}
          </div>
          {validationResult.isValid && (
            <button
              onClick={() => onComplete(story.id, story.xpReward)}
              className="mt-3 w-full text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              🎉 Claim {story.xpReward} XP Reward!
            </button>
          )}
        </div>
      )}

      {!isCompleted && (
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleCheckWork}
              className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔍 Check My Work
            </button>
            <button
              onClick={handleMarkComplete}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark Complete
            </button>
          </div>
          <span className="text-xs text-gray-500">{story.hints.length} hints available</span>
        </div>
      )}
    </div>
  );
};

// Live Preview Component
interface LivePreviewProps {
  repo: GitHubRepo;
  files: FileNode[];
}

const LivePreview: React.FC<LivePreviewProps> = ({ repo, files }) => {
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generatePreviewContent = () => {
    switch (repo.category) {
      case 'react':
        return generateReactPreview(files);
      case 'html-css-js':
        return generateHTMLPreview(files);
      case 'nodejs':
        return generateNodePreview(files);
      default:
        return '<div style="padding: 20px; text-align: center; color: #666;">Preview not available for this project type</div>';
    }
  };

  const generateReactPreview = (files: FileNode[]): string => {
    // For React projects, we'll create a simple preview
    const appJs = findFileContent(files, 'src/App.js') || '';
    const appCss = findFileContent(files, 'src/App.css') || '';

    // Simple React-to-HTML conversion for demo purposes
    // In a real implementation, you'd use a proper React renderer
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>React Preview</title>
        <style>
          ${appCss}
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        </style>
      </head>
      <body>
        <div id="root">
          <div class="App">
            <h1>Todo App</h1>
            <div>
              <input placeholder="Add a todo..." />
              <button>Add Todo</button>
            </div>
            <ul>
              <li>Sample todo item</li>
            </ul>
          </div>
        </div>
        <script>
          console.log('React app preview loaded');
        </script>
      </body>
      </html>
    `;
  };

  const generateHTMLPreview = (files: FileNode[]): string => {
    const htmlContent = findFileContent(files, 'src/index.html') || findFileContent(files, 'index.html') || '';
    const cssContent = findFileContent(files, 'src/style.css') || findFileContent(files, 'style.css') || '';
    const jsContent = findFileContent(files, 'src/script.js') || findFileContent(files, 'script.js') || '';

    // Inject CSS and JS into HTML
    return htmlContent
      .replace('</head>', `<style>${cssContent}</style></head>`)
      .replace('</body>', `<script>${jsContent}</script></body>`);
  };

  const generateNodePreview = (files: FileNode[]): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Node.js API Preview</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .api-info { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .endpoint { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #007bff; }
        </style>
      </head>
      <body>
        <div class="api-info">
          <h1>🟢 Node.js API Server</h1>
          <p>This is a backend API project. In a real environment, the server would be running.</p>
          <div class="endpoint">
            <strong>GET /posts</strong> - Get all blog posts
          </div>
          <div class="endpoint">
            <strong>POST /posts</strong> - Create a new blog post
          </div>
          <p><em>Note: Use the terminal to run 'npm start' to start the server.</em></p>
        </div>
      </body>
      </html>
    `;
  };

  const findFileContent = (files: FileNode[], path: string): string => {
    const pathParts = path.split('/');
    let current: FileNode[] = files;

    for (const part of pathParts) {
      const found = current.find(item => item.name === part);
      if (!found) return '';

      if (found.type === 'file') {
        return found.content || '';
      } else if (found.children) {
        current = found.children;
      }
    }
    return '';
  };

  useEffect(() => {
    setIsLoading(true);
    const content = generatePreviewContent();
    setPreviewContent(content);
    setIsLoading(false);
  }, [repo, files]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Generating preview...</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={previewContent}
      className="w-full h-full border-none"
      title="Live Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

// Helper function to get language from file extension
const getLanguageFromFile = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'plaintext';
  }
};

// File Tree Component
interface FileTreeProps {
  files: FileNode[];
  activeFile: string;
  onFileSelect: (path: string) => void;
  onToggleFolder: (path: string) => void;
  level?: number;
  parentPath?: string;
}

const FileTree: React.FC<FileTreeProps> = ({
  files,
  activeFile,
  onFileSelect,
  onToggleFolder,
  level = 0,
  parentPath = ''
}) => {
  return (
    <div className="space-y-1">
      {files.map((file) => {
        const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
        const isActive = activeFile === fullPath;

        return (
          <div key={file.name}>
            <div
              className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{ paddingLeft: `${8 + level * 16}px` }}
              onClick={() => {
                if (file.type === 'file') {
                  onFileSelect(fullPath);
                } else {
                  onToggleFolder(fullPath);
                }
              }}
              title={file.type === 'file' && file.content ? `${file.content.length} characters` : undefined}
            >
              {file.type === 'folder' ? (
                file.isOpen ? (
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-500" />
                )
              ) : (
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-500" />
                  {file.content && file.content.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" title="File has content" />
                  )}
                </div>
              )}
              <span className="flex-1 truncate">{file.name}</span>
              {file.type === 'file' && file.content && (
                <span className="text-xs text-gray-400">
                  {file.content.length > 1000 ? `${Math.round(file.content.length / 1000)}k` : file.content.length}
                </span>
              )}
            </div>

            {file.type === 'folder' && file.isOpen && file.children && (
              <FileTree
                files={file.children}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                onToggleFolder={onToggleFolder}
                level={level + 1}
                parentPath={fullPath}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Playground;
