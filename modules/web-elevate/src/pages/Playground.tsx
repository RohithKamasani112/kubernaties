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
    setTerminalOutput(prev => [...prev,
      `🚀 Cloning repository: ${repo.fullName}`,
      `📦 Initializing project workspace...`,
      `🔄 Setting up development environment...`,
      ''
    ]);

    // Check for existing session
    const existingSession = loadSessionFromStorage(repo.id);

    // Simulate realistic cloning process with progress updates
    const loadingSteps = [
      { message: '📥 Downloading project files...', delay: 800 },
      { message: '🔧 Installing dependencies...', delay: 1200 },
      { message: '⚙️ Configuring development server...', delay: 600 },
      { message: '🎯 Loading user stories and challenges...', delay: 400 },
      { message: '✅ Project ready for development!', delay: 200 }
    ];

    let currentStep = 0;
    const updateProgress = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setTerminalOutput(prev => [...prev, step.message]);
        currentStep++;
        setTimeout(updateProgress, step.delay);
      } else {
        // Complete the loading process
        if (existingSession) {
          // Restore existing session
          setTerminalOutput(prev => [...prev,
            `🔄 Found existing session, restoring workspace...`,
            `📂 Restored ${existingSession.files.length} files`,
            ''
          ]);
          restoreSession(existingSession);
          setActiveFile(getDefaultFile(existingSession.files));
        } else {
          // Create new session with complete project files
          const mockFiles = generateCompleteProjectFiles(repo);
          console.log('Generated complete project files:', mockFiles);

          setFiles(mockFiles);
          const defaultFile = getDefaultFile(mockFiles);
          console.log('Setting default file:', defaultFile);
          setActiveFile(defaultFile);

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
            `🎉 ${repo.name} cloned successfully!`,
            `📁 Generated ${mockFiles.length} project files`,
            `🎯 ${repo.userStories.length} challenges available`,
            `📝 Opening: ${defaultFile}`,
            `💡 Start coding and complete challenges to earn XP!`,
            ''
          ]);
        }

        setCurrentView('playground');
        setIsLoadingRepo(false);
      }
    };

    // Start the loading process
    setTimeout(updateProgress, 500);
  };

  const generateCompleteProjectFiles = (repo: GitHubRepo): FileNode[] => {
    console.log(`Generating complete project files for: ${repo.id}, category: ${repo.category}`);

    // Generate complete file structure based on repository type and specific project
    switch (repo.id) {
      case 'react-todo-app':
        return generateReactTodoApp(repo);

      case 'react-50-projects':
        return generateReact50ProjectsComplete(repo);

      case 'react-weather-app':
        return generateReactWeatherAppComplete(repo);

      case 'express-blog-api':
        return generateExpressBlogApiComplete(repo);

      case 'react-85-projects':
        return generateReact85ProjectsComplete(repo);

      case 'angular-beginner-starter':
        return generateAngularBeginnerComplete(repo);

      case 'angular-tic-tac-toe':
        return generateAngularTicTacToeComplete(repo);

      case 'nodejs-10-projects':
        return generateNodeJs10ProjectsComplete(repo);

      case 'node-realworld-api':
        return generateNodeRealworldApiComplete(repo);

      case 'vue-beginner-projects':
        return generateVueBeginnerProjectsComplete(repo);

      case 'html-css-js-projects':
        return generateHtmlCssJsProjectsComplete(repo);

      case 'fullstack-mern':
        return generateFullstackMernComplete(repo);

      case 'angular-todo-app':
        return generateAngularTodoAppComplete(repo);

      case 'nodejs-express-api':
        return generateNodejsExpressApiComplete(repo);

      case 'react-portfolio':
        return generateReactPortfolioComplete(repo);

      case 'vue-todo-app':
        return generateVueTodoAppComplete(repo);

      case 'angular-weather-app':
        return generateAngularWeatherAppComplete(repo);

      case 'nodejs-chat-app':
        return generateNodejsChatAppComplete(repo);

      default:
        console.warn(`No specific generator found for repo: ${repo.id}, using comprehensive generic generator`);
        return generateComprehensiveProjectFiles(repo);
    }
  };

  // Comprehensive project generator for unknown projects
  const generateComprehensiveProjectFiles = (repo: GitHubRepo): FileNode[] => {
    console.log(`Generating comprehensive project for: ${repo.name}, category: ${repo.category}`);

    switch (repo.category) {
      case 'react':
        return generateReactProjectComplete(repo);
      case 'nodejs':
        return generateNodeJsProjectComplete(repo);
      case 'angular':
        return generateAngularProjectComplete(repo);
      case 'vue':
        return generateVueProjectComplete(repo);
      case 'html-css-js':
        return generateHtmlCssJsProjectComplete(repo);
      case 'fullstack':
        return generateFullstackProjectComplete(repo);
      default:
        return generateBasicProjectComplete(repo);
    }
  };

  // Enhanced React 50 Projects generator
  const generateReact50ProjectsComplete = (repo: GitHubRepo): FileNode[] => {
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

  // Loading Animation Component
  const LoadingAnimation = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            🚀 Setting up your playground...
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Cloning repository and preparing your development environment. This may take a few moments.
          </p>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-w-2xl mx-auto text-left font-mono text-sm">
            <div className="space-y-1">
              {terminalOutput.slice(-8).map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  {line.includes('✅') && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {line.includes('🔄') && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                  {line.includes('📦') && <Download className="w-4 h-4 text-purple-400" />}
                  <span>{line}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Show loading animation when cloning repository
  if (isLoadingRepo) {
    return <LoadingAnimation />;
  }

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
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const generatePreviewContent = () => {
    console.log(`Generating preview for ${repo.name} (${repo.category})`);

    switch (repo.category) {
      case 'react':
        return generateReactPreview(files);
      case 'html-css-js':
        return generateHTMLPreview(files);
      case 'nodejs':
        return generateNodePreview(files);
      case 'angular':
        return generateAngularPreview(files);
      case 'vue':
        return generateVuePreview(files);
      default:
        return generateGenericPreview(repo, files);
    }
  };

  const generateReactPreview = (files: FileNode[]): string => {
    const appJs = findFileContent(files, 'src/App.js') || '';
    const appCss = findFileContent(files, 'src/App.css') || '';
    const indexCss = findFileContent(files, 'src/index.css') || '';

    // Extract JSX content and convert to HTML
    const extractedContent = extractReactContent(appJs);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${repo.name} - Live Preview</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Base styles */
          ${indexCss}

          /* App styles */
          ${appCss}

          /* Preview-specific styles */
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
          }

          .preview-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .preview-header {
            background: #282c34;
            color: white;
            padding: 10px 20px;
            font-size: 14px;
            border-bottom: 1px solid #444;
          }

          .preview-content {
            flex: 1;
            overflow: auto;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            🚀 ${repo.name} - Live Preview
          </div>
          <div class="preview-content">
            <div id="root">
              ${extractedContent}
            </div>
          </div>
        </div>
        <script>
          // Isolated console for this preview
          const originalConsole = window.console;
          const previewConsole = {
            log: (...args) => {
              originalConsole.log('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                args: args.map(arg => String(arg))
              }, '*');
            },
            error: (...args) => {
              originalConsole.error('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                args: args.map(arg => String(arg))
              }, '*');
            },
            warn: (...args) => {
              originalConsole.warn('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'warn',
                args: args.map(arg => String(arg))
              }, '*');
            }
          };

          window.console = previewConsole;

          // Initialize the app
          console.log('${repo.name} preview initialized');
          console.log('Project description: ${repo.description}');

          // Add interactive functionality
          document.addEventListener('DOMContentLoaded', function() {
            // Add click handlers for buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach((button, index) => {
              button.addEventListener('click', function() {
                console.log(\`Button \${index + 1} clicked: \${this.textContent}\`);
              });
            });

            // Add input handlers
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input, index) => {
              input.addEventListener('input', function() {
                console.log(\`Input \${index + 1} changed: \${this.value}\`);
              });
            });

            console.log('Interactive elements initialized');
          });
        </script>
      </body>
      </html>
    `;
  };

  // Helper function to extract React content and convert to HTML
  const extractReactContent = (appJs: string): string => {
    // Simple JSX to HTML conversion for preview
    // This is a basic implementation - in production you'd use a proper JSX parser

    if (appJs.includes('card-container')) {
      return `
        <div class="App">
          <header class="App-header">
            <h1>🚀 ${repo.name}</h1>
            <p>${repo.description}</p>
          </header>
          <main class="App-main">
            <div class="card-container">
              <div class="card">
                <h3>Welcome to ${repo.name}!</h3>
                <p>${repo.description}</p>
              </div>
              <div class="card">
                <h3>Start Building</h3>
                <p>Modify this component to build your app</p>
              </div>
              <div class="card">
                <h3>Learn React</h3>
                <p>Check out the React documentation</p>
              </div>
            </div>
            <div class="actions">
              <button>Get Started</button>
            </div>
          </main>
        </div>
      `;
    }

    // Default React app structure
    return `
      <div class="App">
        <header class="App-header">
          <h1>🚀 ${repo.name}</h1>
          <p>${repo.description}</p>
          <div class="app-content">
            <p>Your React app is running!</p>
            <button onclick="console.log('Hello from ${repo.name}!')">Click me</button>
          </div>
        </header>
      </div>
    `;
  };

  const generateHTMLPreview = (files: FileNode[]): string => {
    const indexHtml = findFileContent(files, 'index.html');
    const styles = findFileContent(files, 'styles.css') || findFileContent(files, 'style.css') || '';
    const script = findFileContent(files, 'script.js') || findFileContent(files, 'main.js') || '';

    if (indexHtml) {
      // Inject console isolation into existing HTML
      return indexHtml.replace(
        '</head>',
        `
        <style>
          ${styles}
        </style>
        <script>
          // Console isolation for HTML/CSS/JS projects
          const originalConsole = window.console;
          window.console = {
            log: (...args) => {
              originalConsole.log('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                args: args.map(arg => String(arg))
              }, '*');
            },
            error: (...args) => {
              originalConsole.error('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                args: args.map(arg => String(arg))
              }, '*');
            },
            warn: (...args) => {
              originalConsole.warn('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'warn',
                args: args.map(arg => String(arg))
              }, '*');
            }
          };
        </script>
        </head>`
      ).replace(
        '</body>',
        `
        <script>
          ${script}
          console.log('${repo.name} loaded successfully');
        </script>
        </body>`
      );
    }

    // Generate default HTML structure
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${repo.name}</title>
        <style>
          ${styles}
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 ${repo.name}</h1>
          <p>${repo.description}</p>
          <div class="content">
            <p>Your HTML/CSS/JS project is running!</p>
            <button onclick="console.log('Hello from ${repo.name}!')">Click me</button>
          </div>
        </div>
        <script>
          ${script}
          console.log('${repo.name} initialized');
        </script>
      </body>
      </html>
    `;
  };

  const generateNodePreview = (files: FileNode[]): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${repo.name} - Node.js API Preview</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .api-preview {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
          }
          .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            font-size: 12px;
          }
          .get { background: #28a745; }
          .post { background: #007bff; }
          .put { background: #ffc107; color: #000; }
          .delete { background: #dc3545; }
        </style>
      </head>
      <body>
        <div class="api-preview">
          <h1>🚀 ${repo.name} - API Documentation</h1>
          <p>${repo.description}</p>

          <h2>Available Endpoints:</h2>

          <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/</strong> - Welcome message and API info
          </div>

          <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/health</strong> - Server health check
          </div>

          <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/users</strong> - Get all users
          </div>

          <div class="endpoint">
            <span class="method post">POST</span>
            <strong>/api/users</strong> - Create new user
          </div>

          <div class="endpoint">
            <span class="method post">POST</span>
            <strong>/auth/login</strong> - User authentication
          </div>

          <h3>To run this API:</h3>
          <ol>
            <li>Run <code>npm install</code> to install dependencies</li>
            <li>Run <code>npm start</code> or <code>npm run dev</code> to start the server</li>
            <li>Visit <code>http://localhost:3000</code> to access the API</li>
          </ol>

          <button onclick="console.log('API documentation viewed')">Test Console</button>
        </div>

        <script>
          // Console isolation for Node.js projects
          const originalConsole = window.console;
          window.console = {
            log: (...args) => {
              originalConsole.log('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                args: args.map(arg => String(arg))
              }, '*');
            },
            error: (...args) => {
              originalConsole.error('[${repo.name}]', ...args);
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                args: args.map(arg => String(arg))
              }, '*');
            }
          };

          console.log('${repo.name} API documentation loaded');
          console.log('This is a Node.js backend project');
        </script>
      </body>
      </html>
    `;
  };

  // Add missing preview generators
  const generateAngularPreview = (files: FileNode[]): string => {
    const appComponent = findFileContent(files, 'src/app/app.component.html') || '';
    const appStyles = findFileContent(files, 'src/app/app.component.css') || '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${repo.name} - Angular Preview</title>
        <style>
          ${appStyles}
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${appComponent || `
          <div class="app-container">
            <header class="app-header">
              <h1>🚀 ${repo.name}</h1>
              <p>${repo.description}</p>
            </header>
            <main class="app-main">
              <div class="card-container">
                <div class="card">
                  <h3>Angular Basics</h3>
                  <p class="completed">✅ Completed</p>
                </div>
                <div class="card">
                  <h3>Components</h3>
                  <p class="pending">⏳ Pending</p>
                </div>
              </div>
            </main>
          </div>
        `}
        <script>
          console.log('${repo.name} Angular preview loaded');
        </script>
      </body>
      </html>
    `;
  };

  const generateVuePreview = (files: FileNode[]): string => {
    const appVue = findFileContent(files, 'src/App.vue') || '';

    // Extract styles from Vue file
    const styleMatch = appVue.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    const styles = styleMatch ? styleMatch[1] : '';

    // Extract template from Vue file
    const templateMatch = appVue.match(/<template[^>]*>([\s\S]*?)<\/template>/);
    const template = templateMatch ? templateMatch[1] : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${repo.name} - Vue Preview</title>
        <style>
          ${styles}
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        ${template || `
          <div id="app">
            <header class="app-header">
              <h1>🚀 ${repo.name}</h1>
              <p>${repo.description}</p>
            </header>
            <main class="app-main">
              <div class="card-container">
                <div class="card">
                  <h3>Vue Basics</h3>
                  <p class="completed">✅ Completed</p>
                </div>
              </div>
            </main>
          </div>
        `}
        <script>
          console.log('${repo.name} Vue preview loaded');
        </script>
      </body>
      </html>
    `;
  };

  const generateGenericPreview = (repo: GitHubRepo, files: FileNode[]): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${repo.name} - Preview</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
          }
          .preview-container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
          }
          .file-list {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
          }
          .file-item {
            padding: 5px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <h1>🚀 ${repo.name}</h1>
          <p>${repo.description}</p>
          <p>Category: ${repo.category}</p>

          <div class="file-list">
            <h3>Project Files:</h3>
            ${files.map(file => `<div class="file-item">📄 ${file.name}</div>`).join('')}
          </div>

          <button onclick="console.log('Generic preview loaded for ${repo.name}')">Test Console</button>
        </div>

        <script>
          console.log('${repo.name} preview loaded');
          console.log('Project type: ${repo.category}');
          console.log('Files available: ${files.length}');
        </script>
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

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        const { level, args } = event.data;
        setConsoleOutput(prev => [...prev, `[${level.toUpperCase()}] ${args.join(' ')}`]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <iframe
          srcDoc={previewContent}
          className="w-full h-full border-none"
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin allow-modals"
        />
      </div>
      {consoleOutput.length > 0 && (
        <div className="h-24 bg-gray-900 text-green-400 text-xs font-mono p-2 overflow-y-auto border-t">
          <div className="text-gray-400 mb-1">Console Output ({repo.name}):</div>
          {consoleOutput.slice(-10).map((output, index) => (
            <div key={index}>{output}</div>
          ))}
        </div>
      )}
    </div>
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

// Helper function to generate generic project files based on category
const generateGenericProjectFiles = (repo: GitHubRepo): FileNode[] => {
  switch (repo.category) {
    case 'react':
      return generateReactProjectFiles(repo, {
        mainComponent: 'App',
        components: ['Counter', 'TodoList', 'UserProfile'],
        features: ['State management', 'Event handling', 'Component composition']
      });

    case 'nodejs':
      return generateNodeJsProjectFiles(repo, {
        type: 'API',
        features: ['Express server', 'REST endpoints', 'Middleware', 'Error handling']
      });

    case 'angular':
      return generateAngularProjectFiles(repo, {
        mainComponent: 'AppComponent',
        components: ['HomeComponent', 'AboutComponent'],
        features: ['Two-way binding', 'Services', 'Routing']
      });

    case 'vue':
      return generateVueProjectFiles(repo, {
        mainComponent: 'App',
        components: ['Counter', 'TodoList', 'UserCard'],
        features: ['Reactive data', 'Event handling', 'Computed properties']
      });

    case 'html-css-js':
      return generateHtmlCssJsProjectFiles(repo, {
        projects: ['Calculator', 'Todo List', 'Weather App'],
        features: ['DOM manipulation', 'Local storage', 'API calls']
      });

    case 'fullstack':
      return generateFullstackProjectFiles(repo, {
        frontend: 'React',
        backend: 'Node.js + Express',
        database: 'MongoDB',
        features: ['Authentication', 'CRUD operations', 'API integration']
      });

    default:
      return generateBasicProjectFiles(repo);
  }
};

const generateReactProjectFiles = (repo: GitHubRepo, config: any): FileNode[] => {
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
          children: config.components.map((componentName: string) => ({
            name: `${componentName}.js`,
            type: 'file',
            content: generateReactComponent(componentName, repo)
          }))
        },
        {
          name: 'App.js',
          type: 'file',
          content: generateReactApp(repo, config.components)
        },
        {
          name: 'App.css',
          type: 'file',
          content: generateReactCSS(repo)
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
          content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>${repo.name}</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: generatePackageJson(repo, 'react')
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateNodeJsProjectFiles = (repo: GitHubRepo, config: any): FileNode[] => {
  return [
    {
      name: 'routes',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'index.js',
          type: 'file',
          content: generateExpressRoute('index', repo)
        },
        {
          name: 'api.js',
          type: 'file',
          content: generateExpressRoute('api', repo)
        }
      ]
    },
    {
      name: 'server.js',
      type: 'file',
      content: generateExpressServer(repo)
    },
    {
      name: 'package.json',
      type: 'file',
      content: generatePackageJson(repo, 'nodejs')
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateAngularProjectFiles = (repo: GitHubRepo, config: any): FileNode[] => {
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
              content: generateAngularComponent('App', repo)
            },
            {
              name: 'app.component.html',
              type: 'file',
              content: generateAngularTemplate('App', repo)
            },
            {
              name: 'app.component.css',
              type: 'file',
              content: generateAngularCSS(repo)
            },
            {
              name: 'app.module.ts',
              type: 'file',
              content: generateAngularModule(repo)
            }
          ]
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: generatePackageJson(repo, 'angular')
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateVueProjectFiles = (repo: GitHubRepo, config: any): FileNode[] => {
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
          children: config.components.map((componentName: string) => ({
            name: `${componentName}.vue`,
            type: 'file',
            content: generateVueComponent(componentName, repo)
          }))
        },
        {
          name: 'App.vue',
          type: 'file',
          content: generateVueApp(repo, config.components)
        },
        {
          name: 'main.js',
          type: 'file',
          content: `import { createApp } from 'vue'\nimport App from './App.vue'\n\ncreateApp(App).mount('#app')`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: generatePackageJson(repo, 'vue')
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateHtmlCssJsProjectFiles = (repo: GitHubRepo, config: any): FileNode[] => {
  return [
    {
      name: 'index.html',
      type: 'file',
      content: generateHtmlFile(repo)
    },
    {
      name: 'style.css',
      type: 'file',
      content: generateCssFile(repo)
    },
    {
      name: 'script.js',
      type: 'file',
      content: generateJsFile(repo)
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

// Comprehensive React Project Generator
const generateReactProjectComplete = (repo: GitHubRepo): FileNode[] => {
  return [
    {
      name: 'public',
      type: 'folder',
      isOpen: false,
      children: [
        {
          name: 'index.html',
          type: 'file',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="${repo.description}" />
  <title>${repo.name}</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>`
        },
        {
          name: 'favicon.ico',
          type: 'file',
          content: '// Favicon file'
        }
      ]
    },
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'App.js',
          type: 'file',
          content: `import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: 1, title: 'Welcome to ${repo.name}!', description: '${repo.description}' },
        { id: 2, title: 'Start Building', description: 'Modify this component to build your app' },
        { id: 3, title: 'Learn React', description: 'Check out the React documentation' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 ${repo.name}</h1>
        <p>${repo.description}</p>
      </header>

      <main className="App-main">
        <div className="card-container">
          {data.map(item => (
            <div key={item.id} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={() => console.log('Button clicked!')}>
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;`
        },
        {
          name: 'App.css',
          type: 'file',
          content: `.App {
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.App-header {
  margin-bottom: 40px;
}

.App-header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.App-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.App-main {
  max-width: 1200px;
  margin: 0 auto;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.actions button {
  background: linear-gradient(135deg, #74c0fc, #339af0);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5rem;
}`
        },
        {
          name: 'index.js',
          type: 'file',
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
        },
        {
          name: 'index.css',
          type: 'file',
          content: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: `{
  "name": "${repo.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "description": "${repo.description}",
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`
    },
    {
      name: 'README.md',
      type: 'file',
      content: `# ${repo.name}

${repo.description}

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### \`npm start\`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### \`npm test\`

Launches the test runner in the interactive watch mode.

### \`npm run build\`

Builds the app for production to the \`build\` folder.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
`
    }
  ];
};

const generateFullstackProjectFiles = (repo: GitHubRepo, config: any): FileNode[] => {
  return [
    {
      name: 'frontend',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            {
              name: 'App.js',
              type: 'file',
              content: generateReactApp(repo, ['Login', 'Dashboard'])
            },
            {
              name: 'components',
              type: 'folder',
              isOpen: false,
              children: [
                {
                  name: 'Login.js',
                  type: 'file',
                  content: generateReactComponent('Login', repo)
                },
                {
                  name: 'Dashboard.js',
                  type: 'file',
                  content: generateReactComponent('Dashboard', repo)
                }
              ]
            }
          ]
        },
        {
          name: 'package.json',
          type: 'file',
          content: generatePackageJson(repo, 'react')
        }
      ]
    },
    {
      name: 'backend',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'server.js',
          type: 'file',
          content: generateExpressServer(repo)
        },
        {
          name: 'routes',
          type: 'folder',
          isOpen: false,
          children: [
            {
              name: 'auth.js',
              type: 'file',
              content: generateExpressRoute('auth', repo)
            },
            {
              name: 'api.js',
              type: 'file',
              content: generateExpressRoute('api', repo)
            }
          ]
        },
        {
          name: 'package.json',
          type: 'file',
          content: generatePackageJson(repo, 'nodejs')
        }
      ]
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateBasicProjectFiles = (repo: GitHubRepo): FileNode[] => {
  return [
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'index.js',
          type: 'file',
          content: `// ${repo.name}\n// ${repo.description}\n\nconsole.log('Welcome to ${repo.name}!');\n\n// TODO: Start building your project here\n// Check the user stories for specific requirements\n\n${repo.userStories.map(story => `// User Story: ${story.title}\n// ${story.description}\n// Difficulty: ${story.difficulty} | XP: ${story.xpReward}`).join('\n\n')}`
        }
      ]
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

// Content generation helper functions
const generateReactComponent = (componentName: string, repo: GitHubRepo): string => {
  const componentTemplates: { [key: string]: string } = {
    Counter: `import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="counter">\n      <h2>Counter: {count}</h2>\n      <button onClick={() => setCount(count - 1)}>-</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n      <button onClick={() => setCount(count + 1)}>+</button>\n    </div>\n  );\n}\n\nexport default Counter;`,
    TodoList: `import React, { useState } from 'react';\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([]);\n  const [inputValue, setInputValue] = useState('');\n\n  const addTodo = () => {\n    if (inputValue.trim()) {\n      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);\n      setInputValue('');\n    }\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo => \n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\n    ));\n  };\n\n  return (\n    <div className="todo-list">\n      <h2>Todo List</h2>\n      <div>\n        <input \n          value={inputValue}\n          onChange={(e) => setInputValue(e.target.value)}\n          placeholder="Add a todo..."\n        />\n        <button onClick={addTodo}>Add</button>\n      </div>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>\n            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>\n              {todo.text}\n            </span>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default TodoList;`,
    UserProfile: `import React, { useState } from 'react';\n\nfunction UserProfile() {\n  const [user, setUser] = useState({\n    name: 'John Doe',\n    email: 'john@example.com',\n    bio: 'Web developer passionate about React'\n  });\n\n  const [isEditing, setIsEditing] = useState(false);\n\n  return (\n    <div className="user-profile">\n      <h2>User Profile</h2>\n      {isEditing ? (\n        <div>\n          <input \n            value={user.name}\n            onChange={(e) => setUser({...user, name: e.target.value})}\n          />\n          <input \n            value={user.email}\n            onChange={(e) => setUser({...user, email: e.target.value})}\n          />\n          <textarea \n            value={user.bio}\n            onChange={(e) => setUser({...user, bio: e.target.value})}\n          />\n          <button onClick={() => setIsEditing(false)}>Save</button>\n        </div>\n      ) : (\n        <div>\n          <h3>{user.name}</h3>\n          <p>{user.email}</p>\n          <p>{user.bio}</p>\n          <button onClick={() => setIsEditing(true)}>Edit</button>\n        </div>\n      )}\n    </div>\n  );\n}\n\nexport default UserProfile;`
  };

  return componentTemplates[componentName] || `import React from 'react';\n\nfunction ${componentName}() {\n  // TODO: Implement ${componentName} component\n  // Check the user stories for specific requirements\n  \n  return (\n    <div className="${componentName.toLowerCase()}">\n      <h2>${componentName}</h2>\n      <p>Component implementation goes here...</p>\n    </div>\n  );\n}\n\nexport default ${componentName};`;
};

const generateReactApp = (repo: GitHubRepo, components: string[]): string => {
  const imports = components.map(comp => `import ${comp} from './components/${comp}';`).join('\n');
  const componentUsage = components.map(comp => `        <${comp} />`).join('\n');

  return `import React from 'react';\n${imports}\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>${repo.name}</h1>\n        <p>${repo.description}</p>\n      </header>\n      \n      <main className="App-main">\n${componentUsage}\n      </main>\n    </div>\n  );\n}\n\nexport default App;`;
};

const generateReactCSS = (repo: GitHubRepo): string => {
  return `.App {\n  text-align: center;\n  min-height: 100vh;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 20px;\n}\n\n.App-header {\n  margin-bottom: 40px;\n}\n\n.App-header h1 {\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}\n\n.App-main {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 30px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.counter, .todo-list, .user-profile {\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 15px;\n  padding: 25px;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}\n\nbutton {\n  background: linear-gradient(135deg, #74c0fc, #339af0);\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 8px;\n  cursor: pointer;\n  margin: 5px;\n  transition: all 0.3s ease;\n}\n\nbutton:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n}\n\ninput, textarea {\n  padding: 10px;\n  border: 1px solid rgba(255,255,255,0.3);\n  border-radius: 8px;\n  background: rgba(255,255,255,0.1);\n  color: white;\n  margin: 5px;\n}\n\ninput::placeholder {\n  color: rgba(255,255,255,0.7);\n}`;
};

// Comprehensive Node.js Project Generator
const generateNodeJsProjectComplete = (repo: GitHubRepo): FileNode[] => {
  return [
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'server.js',
          type: 'file',
          content: `const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ${repo.name} API!',
    description: '${repo.description}',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  res.json({ users, total: users.length });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };

  res.status(201).json({ user: newUser, message: 'User created successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📖 API Documentation: http://localhost:\${PORT}\`);
});

module.exports = app;`
        },
        {
          name: 'routes',
          type: 'folder',
          isOpen: false,
          children: [
            {
              name: 'auth.js',
              type: 'file',
              content: `const express = require('express');
const router = express.Router();

// Mock user database
const users = [
  { id: 1, username: 'admin', password: 'password123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // In a real app, you'd generate a JWT token here
  const token = 'mock-jwt-token-' + Date.now();

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

// Register endpoint
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password, // In a real app, hash this!
    email,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  // Mock authentication check
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Mock user data
  res.json({
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    }
  });
});

module.exports = router;`
            },
            {
              name: 'api.js',
              type: 'file',
              content: `const express = require('express');
const router = express.Router();

// Mock data
let todos = [
  { id: 1, title: 'Learn Node.js', completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Build an API', completed: true, createdAt: new Date().toISOString() },
  { id: 3, title: 'Deploy to production', completed: false, createdAt: new Date().toISOString() }
];

// Get all todos
router.get('/todos', (req, res) => {
  const { completed, limit = 10 } = req.query;

  let filteredTodos = todos;

  if (completed !== undefined) {
    filteredTodos = todos.filter(todo => todo.completed === (completed === 'true'));
  }

  const limitedTodos = filteredTodos.slice(0, parseInt(limit));

  res.json({
    todos: limitedTodos,
    total: filteredTodos.length,
    showing: limitedTodos.length
  });
});

// Get single todo
router.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json({ todo });
});

// Create new todo
router.post('/todos', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo = {
    id: Math.max(...todos.map(t => t.id)) + 1,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  todos.push(newTodo);

  res.status(201).json({
    message: 'Todo created successfully',
    todo: newTodo
  });
});

// Update todo
router.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, description, completed } = req.body;

  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title || todos[todoIndex].title,
    description: description !== undefined ? description : todos[todoIndex].description,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
    updatedAt: new Date().toISOString()
  };

  res.json({
    message: 'Todo updated successfully',
    todo: todos[todoIndex]
  });
});

// Delete todo
router.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];

  res.json({
    message: 'Todo deleted successfully',
    todo: deletedTodo
  });
});

module.exports = router;`
            }
          ]
        },
        {
          name: 'middleware',
          type: 'folder',
          isOpen: false,
          children: [
            {
              name: 'auth.js',
              type: 'file',
              content: `// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // In a real app, verify JWT token here
  if (token === 'mock-jwt-token') {
    req.user = { id: 1, username: 'admin', role: 'admin' };
    next();
  } else {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authenticateToken, requireRole };`
            }
          ]
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: `{
  "name": "${repo.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "${repo.description}",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^6.1.5",
    "morgan": "^1.10.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "supertest": "^6.3.3"
  },
  "keywords": ["nodejs", "express", "api"],
  "author": "Developer",
  "license": "MIT"
}`
    },
    {
      name: '.env',
      type: 'file',
      content: `# Environment Variables
PORT=3000
NODE_ENV=development

# Database (if needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=myapp
# DB_USER=user
# DB_PASS=password

# JWT Secret (if using JWT)
# JWT_SECRET=your-secret-key-here`
    },
    {
      name: 'README.md',
      type: 'file',
      content: `# ${repo.name}

${repo.description}

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The server will start on http://localhost:3000

## API Endpoints

### Authentication
- \`POST /auth/login\` - User login
- \`POST /auth/register\` - User registration
- \`GET /auth/me\` - Get current user

### Todos
- \`GET /api/todos\` - Get all todos
- \`GET /api/todos/:id\` - Get single todo
- \`POST /api/todos\` - Create new todo
- \`PUT /api/todos/:id\` - Update todo
- \`DELETE /api/todos/:id\` - Delete todo

### Health Check
- \`GET /health\` - Server health status

## Scripts

- \`npm start\` - Start production server
- \`npm run dev\` - Start development server with nodemon
- \`npm test\` - Run tests
- \`npm run test:watch\` - Run tests in watch mode

## Environment Variables

See \`.env\` file for configuration options.
`
    }
  ];
};

const generateExpressServer = (repo: GitHubRepo): string => {
  return `const express = require('express');\nconst cors = require('cors');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\n// Middleware\napp.use(cors());\napp.use(express.json());\n\n// Routes\napp.get('/', (req, res) => {\n  res.json({ \n    message: 'Welcome to ${repo.name} API!',\n    description: '${repo.description}'\n  });\n});\n\n// TODO: Add your API routes here\n// Example:\n// app.get('/api/users', (req, res) => {\n//   res.json({ users: [] });\n// });\n\napp.listen(PORT, () => {\n  console.log(\`Server running on port \${PORT}\`);\n});`;
};

const generateExpressRoute = (routeName: string, repo: GitHubRepo): string => {
  const routeTemplates: { [key: string]: string } = {
    index: `const express = require('express');\nconst router = express.Router();\n\n// Home route\nrouter.get('/', (req, res) => {\n  res.json({ message: 'Welcome to ${repo.name}!' });\n});\n\nmodule.exports = router;`,
    api: `const express = require('express');\nconst router = express.Router();\n\n// Sample data\nlet items = [\n  { id: 1, name: 'Item 1', completed: false },\n  { id: 2, name: 'Item 2', completed: true }\n];\n\n// GET all items\nrouter.get('/items', (req, res) => {\n  res.json(items);\n});\n\n// POST new item\nrouter.post('/items', (req, res) => {\n  const newItem = {\n    id: Date.now(),\n    name: req.body.name,\n    completed: false\n  };\n  items.push(newItem);\n  res.status(201).json(newItem);\n});\n\n// PUT update item\nrouter.put('/items/:id', (req, res) => {\n  const id = parseInt(req.params.id);\n  const itemIndex = items.findIndex(item => item.id === id);\n  \n  if (itemIndex !== -1) {\n    items[itemIndex] = { ...items[itemIndex], ...req.body };\n    res.json(items[itemIndex]);\n  } else {\n    res.status(404).json({ error: 'Item not found' });\n  }\n});\n\n// DELETE item\nrouter.delete('/items/:id', (req, res) => {\n  const id = parseInt(req.params.id);\n  items = items.filter(item => item.id !== id);\n  res.json({ message: 'Item deleted' });\n});\n\nmodule.exports = router;`,
    auth: `const express = require('express');\nconst router = express.Router();\n\n// Mock user data\nconst users = [\n  { id: 1, username: 'demo', password: 'password', email: 'demo@example.com' }\n];\n\n// Login route\nrouter.post('/login', (req, res) => {\n  const { username, password } = req.body;\n  const user = users.find(u => u.username === username && u.password === password);\n  \n  if (user) {\n    res.json({ \n      message: 'Login successful',\n      user: { id: user.id, username: user.username, email: user.email }\n    });\n  } else {\n    res.status(401).json({ error: 'Invalid credentials' });\n  }\n});\n\n// Register route\nrouter.post('/register', (req, res) => {\n  const { username, password, email } = req.body;\n  \n  // Check if user already exists\n  if (users.find(u => u.username === username)) {\n    return res.status(400).json({ error: 'User already exists' });\n  }\n  \n  const newUser = {\n    id: Date.now(),\n    username,\n    password,\n    email\n  };\n  \n  users.push(newUser);\n  res.status(201).json({ \n    message: 'User created successfully',\n    user: { id: newUser.id, username: newUser.username, email: newUser.email }\n  });\n});\n\nmodule.exports = router;`
  };

  return routeTemplates[routeName] || `const express = require('express');\nconst router = express.Router();\n\n// TODO: Implement ${routeName} routes\n// Add your route handlers here\n\nrouter.get('/', (req, res) => {\n  res.json({ message: '${routeName} route' });\n});\n\nmodule.exports = router;`;
};

const generatePackageJson = (repo: GitHubRepo, type: string): string => {
  const packageTemplates: { [key: string]: any } = {
    react: {
      name: repo.name,
      version: "0.1.0",
      private: true,
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "5.0.1"
      },
      scripts: {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
      }
    },
    nodejs: {
      name: repo.name,
      version: "1.0.0",
      description: repo.description,
      main: "server.js",
      scripts: {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      dependencies: {
        "express": "^4.18.2",
        "cors": "^2.8.5"
      },
      devDependencies: {
        "nodemon": "^2.0.22"
      }
    },
    angular: {
      name: repo.name,
      version: "0.0.0",
      scripts: {
        "ng": "ng",
        "start": "ng serve",
        "build": "ng build",
        "test": "ng test"
      },
      dependencies: {
        "@angular/animations": "^15.0.0",
        "@angular/common": "^15.0.0",
        "@angular/compiler": "^15.0.0",
        "@angular/core": "^15.0.0",
        "@angular/forms": "^15.0.0",
        "@angular/platform-browser": "^15.0.0",
        "@angular/platform-browser-dynamic": "^15.0.0",
        "@angular/router": "^15.0.0"
      }
    },
    vue: {
      name: repo.name,
      version: "0.0.0",
      scripts: {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
      },
      dependencies: {
        "vue": "^3.2.47"
      },
      devDependencies: {
        "@vitejs/plugin-vue": "^4.0.0",
        "vite": "^4.0.0"
      }
    }
  };

  return JSON.stringify(packageTemplates[type] || packageTemplates.nodejs, null, 2);
};

const generateReadme = (repo: GitHubRepo): string => {
  return `# ${repo.name}\n\n${repo.description}\n\n## 🚀 Getting Started\n\n${repo.setupInstructions.map(step => `- ${step}`).join('\n')}\n\n## 📋 User Stories\n\n${repo.userStories.map((story, index) => `### ${index + 1}. ${story.title}\n\n${story.description}\n\n**Difficulty:** ${story.difficulty} | **XP Reward:** ${story.xpReward}\n\n**Tasks:**\n${story.tasks.map(task => `- [ ] ${task.description}`).join('\n')}\n\n**Hints:**\n${story.hints.map(hint => `💡 ${hint}`).join('\n')}`).join('\n\n---\n\n')}\n\n## 🏆 Completion Criteria\n\nComplete all user stories to earn the full XP reward and unlock achievements!\n\n## 📚 Learning Resources\n\n- Check the hints in each user story\n- Use the AI advisor for guidance\n- Explore the code examples in the playground\n\n---\n\n**Happy coding! 🎉**`;
};

const generateVueComponent = (componentName: string, repo: GitHubRepo): string => {
  const vueTemplates: { [key: string]: string } = {
    Counter: `<template>\n  <div class="counter">\n    <h2>Counter: {{ count }}</h2>\n    <button @click="decrement">-</button>\n    <button @click="reset">Reset</button>\n    <button @click="increment">+</button>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'Counter',\n  data() {\n    return {\n      count: 0\n    }\n  },\n  methods: {\n    increment() {\n      this.count++\n    },\n    decrement() {\n      this.count--\n    },\n    reset() {\n      this.count = 0\n    }\n  }\n}\n</script>\n\n<style scoped>\n.counter {\n  text-align: center;\n  padding: 20px;\n  border-radius: 10px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}\n\nbutton {\n  margin: 5px;\n  padding: 10px 20px;\n  border: none;\n  border-radius: 5px;\n  background: #42b883;\n  color: white;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background: #369870;\n}\n</style>`,
    TodoList: `<template>\n  <div class="todo-list">\n    <h2>Todo List</h2>\n    <div class="input-section">\n      <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Add a todo..." />\n      <button @click="addTodo">Add</button>\n    </div>\n    <ul>\n      <li v-for="todo in todos" :key="todo.id" @click="toggleTodo(todo.id)">\n        <span :class="{ completed: todo.completed }">{{ todo.text }}</span>\n      </li>\n    </ul>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'TodoList',\n  data() {\n    return {\n      newTodo: '',\n      todos: []\n    }\n  },\n  methods: {\n    addTodo() {\n      if (this.newTodo.trim()) {\n        this.todos.push({\n          id: Date.now(),\n          text: this.newTodo,\n          completed: false\n        })\n        this.newTodo = ''\n      }\n    },\n    toggleTodo(id) {\n      const todo = this.todos.find(t => t.id === id)\n      if (todo) {\n        todo.completed = !todo.completed\n      }\n    }\n  }\n}\n</script>\n\n<style scoped>\n.todo-list {\n  max-width: 400px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\n.input-section {\n  display: flex;\n  margin-bottom: 20px;\n}\n\ninput {\n  flex: 1;\n  padding: 10px;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n}\n\nbutton {\n  padding: 10px 20px;\n  background: #42b883;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  margin-left: 10px;\n  cursor: pointer;\n}\n\nul {\n  list-style: none;\n  padding: 0;\n}\n\nli {\n  padding: 10px;\n  border-bottom: 1px solid #eee;\n  cursor: pointer;\n}\n\n.completed {\n  text-decoration: line-through;\n  opacity: 0.6;\n}\n</style>`
  };

  return vueTemplates[componentName] || `<template>\n  <div class="${componentName.toLowerCase()}">\n    <h2>${componentName}</h2>\n    <p>Component implementation goes here...</p>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: '${componentName}',\n  data() {\n    return {\n      // Add your data properties here\n    }\n  },\n  methods: {\n    // Add your methods here\n  }\n}\n</script>\n\n<style scoped>\n.${componentName.toLowerCase()} {\n  padding: 20px;\n  text-align: center;\n}\n</style>`;
};

const generateVueApp = (repo: GitHubRepo, components: string[]): string => {
  const imports = components.map(comp => `import ${comp} from './components/${comp}.vue'`).join('\n');
  const componentRegistrations = components.map(comp => `    ${comp}`).join(',\n');
  const componentUsage = components.map(comp => `    <${comp} />`).join('\n');

  return `<template>\n  <div id="app">\n    <header>\n      <h1>${repo.name}</h1>\n      <p>${repo.description}</p>\n    </header>\n    \n    <main>\n${componentUsage}\n    </main>\n  </div>\n</template>\n\n<script>\n${imports}\n\nexport default {\n  name: 'App',\n  components: {\n${componentRegistrations}\n  }\n}\n</script>\n\n<style>\n#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n\nheader {\n  margin-bottom: 40px;\n}\n\nmain {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 30px;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n</style>`;
};

const generateAngularComponent = (componentName: string, repo: GitHubRepo): string => {
  return `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-${componentName.toLowerCase()}',\n  templateUrl: './${componentName.toLowerCase()}.component.html',\n  styleUrls: ['./${componentName.toLowerCase()}.component.css']\n})\nexport class ${componentName}Component {\n  title = '${repo.name}';\n  description = '${repo.description}';\n  \n  // TODO: Add your component logic here\n  // Check the user stories for specific requirements\n}`;
};

const generateAngularTemplate = (componentName: string, repo: GitHubRepo): string => {
  return `<div class="container">\n  <h1>Welcome to {{title}}!</h1>\n  <p>{{description}}</p>\n  \n  <!-- TODO: Add your component template here -->\n  <!-- Check the user stories for specific requirements -->\n  \n  <div class="content">\n    <p>Start building your Angular application here!</p>\n  </div>\n</div>`;
};

const generateAngularCSS = (repo: GitHubRepo): string => {
  return `.container {\n  text-align: center;\n  padding: 20px;\n  max-width: 800px;\n  margin: 0 auto;\n}\n\nh1 {\n  color: #dd0031;\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}\n\np {\n  color: #666;\n  font-size: 1.1rem;\n  margin-bottom: 20px;\n}\n\n.content {\n  background: #f5f5f5;\n  padding: 30px;\n  border-radius: 10px;\n  margin-top: 30px;\n}`;
};

const generateAngularModule = (repo: GitHubRepo): string => {
  return `import { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { FormsModule } from '@angular/forms';\n\nimport { AppRoutingModule } from './app-routing.module';\nimport { AppComponent } from './app.component';\n\n@NgModule({\n  declarations: [\n    AppComponent\n    // TODO: Add your components here\n  ],\n  imports: [\n    BrowserModule,\n    AppRoutingModule,\n    FormsModule\n  ],\n  providers: [],\n  bootstrap: [AppComponent]\n})\nexport class AppModule { }`;
};

const generateHtmlFile = (repo: GitHubRepo): string => {
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${repo.name}</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="container">\n        <header>\n            <h1>${repo.name}</h1>\n            <p>${repo.description}</p>\n        </header>\n        \n        <main>\n            <!-- TODO: Add your HTML content here -->\n            <!-- Check the user stories for specific requirements -->\n            \n            <section class="demo-section">\n                <h2>Demo Section</h2>\n                <p>Start building your project here!</p>\n                \n                <div class="interactive-demo">\n                    <button id="demo-btn">Click Me!</button>\n                    <p id="demo-output">Output will appear here...</p>\n                </div>\n            </section>\n        </main>\n        \n        <footer>\n            <p>Built with HTML, CSS, and JavaScript</p>\n        </footer>\n    </div>\n    \n    <script src="script.js"></script>\n</body>\n</html>`;
};

const generateCssFile = (repo: GitHubRepo): string => {
  return `/* ${repo.name} Styles */\n\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: 'Arial', sans-serif;\n    line-height: 1.6;\n    color: #333;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    min-height: 100vh;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 20px;\n}\n\nheader {\n    text-align: center;\n    margin-bottom: 40px;\n    color: white;\n}\n\nheader h1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0,0,0,0.3);\n}\n\nheader p {\n    font-size: 1.2rem;\n    opacity: 0.9;\n}\n\nmain {\n    background: rgba(255, 255, 255, 0.95);\n    border-radius: 15px;\n    padding: 30px;\n    box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n    backdrop-filter: blur(10px);\n}\n\n.demo-section {\n    text-align: center;\n    padding: 20px;\n}\n\n.demo-section h2 {\n    color: #333;\n    margin-bottom: 20px;\n    font-size: 1.8rem;\n}\n\n.interactive-demo {\n    background: #f8f9fa;\n    padding: 30px;\n    border-radius: 10px;\n    margin: 20px 0;\n    border: 2px solid #e9ecef;\n}\n\nbutton {\n    background: linear-gradient(135deg, #667eea, #764ba2);\n    color: white;\n    border: none;\n    padding: 12px 24px;\n    border-radius: 8px;\n    font-size: 1rem;\n    cursor: pointer;\n    transition: all 0.3s ease;\n    box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n}\n\nbutton:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 6px 20px rgba(0,0,0,0.3);\n}\n\nbutton:active {\n    transform: translateY(0);\n}\n\n#demo-output {\n    margin-top: 20px;\n    padding: 15px;\n    background: white;\n    border-radius: 8px;\n    border: 1px solid #ddd;\n    min-height: 50px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-weight: 500;\n}\n\nfooter {\n    text-align: center;\n    margin-top: 40px;\n    color: white;\n    opacity: 0.8;\n}\n\n/* Responsive Design */\n@media (max-width: 768px) {\n    .container {\n        padding: 10px;\n    }\n    \n    header h1 {\n        font-size: 2rem;\n    }\n    \n    main {\n        padding: 20px;\n    }\n}`;
};

const generateJsFile = (repo: GitHubRepo): string => {
  return `// ${repo.name} JavaScript\n// ${repo.description}\n\n// Wait for DOM to be fully loaded\ndocument.addEventListener('DOMContentLoaded', function() {\n    console.log('Welcome to ${repo.name}!');\n    \n    // Initialize the application\n    initializeApp();\n});\n\nfunction initializeApp() {\n    // TODO: Add your initialization code here\n    // Check the user stories for specific requirements\n    \n    setupEventListeners();\n    setupDemoFeatures();\n}\n\nfunction setupEventListeners() {\n    // Demo button functionality\n    const demoBtn = document.getElementById('demo-btn');\n    const demoOutput = document.getElementById('demo-output');\n    \n    if (demoBtn && demoOutput) {\n        demoBtn.addEventListener('click', function() {\n            const messages = [\n                'Hello, World! 👋',\n                'JavaScript is working! ✨',\n                'Ready to build something amazing! 🚀',\n                'Let\\'s code together! 💻',\n                'The possibilities are endless! 🌟'\n            ];\n            \n            const randomMessage = messages[Math.floor(Math.random() * messages.length)];\n            demoOutput.textContent = randomMessage;\n            \n            // Add some visual feedback\n            demoOutput.style.background = '#e8f5e8';\n            demoOutput.style.color = '#2d5a2d';\n            demoOutput.style.border = '2px solid #4caf50';\n            \n            setTimeout(() => {\n                demoOutput.style.background = 'white';\n                demoOutput.style.color = '#333';\n                demoOutput.style.border = '1px solid #ddd';\n            }, 2000);\n        });\n    }\n}\n\nfunction setupDemoFeatures() {\n    // TODO: Add more interactive features here\n    // Examples:\n    // - Form validation\n    // - Dynamic content loading\n    // - Local storage functionality\n    // - API calls\n    // - Animation effects\n    \n    console.log('Demo features initialized');\n}\n\n// Utility functions\nfunction showMessage(message, type = 'info') {\n    // TODO: Implement a message display system\n    console.log(\`[\${type.toUpperCase()}] \${message}\`);\n}\n\nfunction saveToLocalStorage(key, data) {\n    try {\n        localStorage.setItem(key, JSON.stringify(data));\n        return true;\n    } catch (error) {\n        console.error('Error saving to localStorage:', error);\n        return false;\n    }\n}\n\nfunction loadFromLocalStorage(key) {\n    try {\n        const data = localStorage.getItem(key);\n        return data ? JSON.parse(data) : null;\n    } catch (error) {\n        console.error('Error loading from localStorage:', error);\n        return null;\n    }\n}\n\n// Export functions for testing (if using modules)\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = {\n        initializeApp,\n        setupEventListeners,\n        setupDemoFeatures,\n        showMessage,\n        saveToLocalStorage,\n        loadFromLocalStorage\n    };\n}`;
};

// ===== PRODUCTION-READY PROJECT GENERATORS =====

const generateReactTodoApp = (repo: GitHubRepo): FileNode[] => {
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
              name: 'TodoList.js',
              type: 'file',
              content: `import React, { useState } from 'react';\nimport TodoItem from './TodoItem';\nimport './TodoList.css';\n\nfunction TodoList() {\n  const [todos, setTodos] = useState([\n    { id: 1, text: 'Learn React', completed: false },\n    { id: 2, text: 'Build a todo app', completed: true },\n    { id: 3, text: 'Master JavaScript', completed: false }\n  ]);\n  const [inputValue, setInputValue] = useState('');\n\n  // TODO: Fix this function - it's not working!\n  const addTodo = () => {\n    // BUG: This function is incomplete\n    // HINT: You need to create a new todo object and add it to the todos array\n    console.log('Adding todo:', inputValue);\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo => \n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\n    ));\n  };\n\n  // TODO: Implement delete functionality\n  const deleteTodo = (id) => {\n    // HINT: Use filter to remove the todo with the given id\n    console.log('Deleting todo:', id);\n  };\n\n  return (\n    <div className="todo-list">\n      <h1>My Todo App</h1>\n      \n      <div className="add-todo">\n        <input \n          type="text"\n          value={inputValue}\n          onChange={(e) => setInputValue(e.target.value)}\n          placeholder="Add a new todo..."\n          onKeyPress={(e) => e.key === 'Enter' && addTodo()}\n        />\n        <button onClick={addTodo} className="add-btn">\n          Add Todo\n        </button>\n      </div>\n\n      <div className="todos">\n        {todos.map(todo => (\n          <TodoItem \n            key={todo.id}\n            todo={todo}\n            onToggle={toggleTodo}\n            onDelete={deleteTodo}\n          />\n        ))}\n      </div>\n      \n      <div className="stats">\n        <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>\n      </div>\n    </div>\n  );\n}\n\nexport default TodoList;`
            },
            {
              name: 'TodoItem.js',
              type: 'file',
              content: `import React from 'react';\nimport './TodoItem.css';\n\nfunction TodoItem({ todo, onToggle, onDelete }) {\n  return (\n    <div className={\`todo-item \${todo.completed ? 'completed' : ''}\`}>\n      <input \n        type="checkbox"\n        checked={todo.completed}\n        onChange={() => onToggle(todo.id)}\n        className="todo-checkbox"\n      />\n      <span className="todo-text">{todo.text}</span>\n      {/* TODO: Add delete button */}\n      {/* HINT: Create a button that calls onDelete(todo.id) */}\n    </div>\n  );\n}\n\nexport default TodoItem;`
            }
          ]
        },
        {
          name: 'App.js',
          type: 'file',
          content: `import React from 'react';\nimport TodoList from './components/TodoList';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <TodoList />\n    </div>\n  );\n}\n\nexport default App;`
        },
        {
          name: 'App.css',
          type: 'file',
          content: `.App {\n  text-align: center;\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 20px;\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n}\n\nbody {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  margin: 0;\n}`
        },
        {
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: [
            {
              name: 'TodoList.css',
              type: 'file',
              content: `.todo-list {\n  background: white;\n  border-radius: 15px;\n  padding: 30px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}\n\n.todo-list h1 {\n  color: #333;\n  margin-bottom: 30px;\n  font-size: 2.5rem;\n}\n\n.add-todo {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n}\n\n.add-todo input {\n  flex: 1;\n  padding: 15px;\n  border: 2px solid #e1e5e9;\n  border-radius: 10px;\n  font-size: 16px;\n  outline: none;\n  transition: border-color 0.3s;\n}\n\n.add-todo input:focus {\n  border-color: #667eea;\n}\n\n.add-btn {\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: white;\n  border: none;\n  padding: 15px 25px;\n  border-radius: 10px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\n.add-btn:hover {\n  transform: translateY(-2px);\n}\n\n.todos {\n  margin-bottom: 20px;\n}\n\n.stats {\n  color: #666;\n  font-size: 14px;\n  padding: 15px;\n  background: #f8f9fa;\n  border-radius: 10px;\n}`
            },
            {
              name: 'TodoItem.css',
              type: 'file',
              content: `.todo-item {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n  padding: 15px;\n  margin-bottom: 10px;\n  background: #f8f9fa;\n  border-radius: 10px;\n  transition: all 0.3s;\n}\n\n.todo-item:hover {\n  background: #e9ecef;\n  transform: translateX(5px);\n}\n\n.todo-item.completed {\n  opacity: 0.7;\n}\n\n.todo-checkbox {\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n}\n\n.todo-text {\n  flex: 1;\n  text-align: left;\n  font-size: 16px;\n  color: #333;\n}\n\n.todo-item.completed .todo-text {\n  text-decoration: line-through;\n  color: #999;\n}\n\n.delete-btn {\n  background: #ff6b6b;\n  color: white;\n  border: none;\n  padding: 8px 12px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 12px;\n  transition: background 0.3s;\n}\n\n.delete-btn:hover {\n  background: #ff5252;\n}`
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
      content: generatePackageJson(repo, 'react')
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateNodeJs10Projects = (repo: GitHubRepo): FileNode[] => {
  return [
    {
      name: 'routes',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'todos.js',
          type: 'file',
          content: `const express = require('express');\nconst router = express.Router();\n\n// In-memory storage for demo (use database in production)\nlet todos = [\n  { id: 1, title: 'Learn Node.js', completed: false, createdAt: new Date() },\n  { id: 2, title: 'Build REST API', completed: true, createdAt: new Date() },\n  { id: 3, title: 'Add validation', completed: false, createdAt: new Date() }\n];\n\nlet nextId = 4;\n\n// GET /api/todos - Get all todos with optional filtering\nrouter.get('/', (req, res) => {\n  try {\n    let filteredTodos = todos;\n    \n    // TODO: Add query filtering for completed status\n    // HINT: Check if req.query.completed exists and filter accordingly\n    // Example: if (req.query.completed !== undefined) { ... }\n    \n    res.json({\n      success: true,\n      count: filteredTodos.length,\n      data: filteredTodos\n    });\n  } catch (error) {\n    res.status(500).json({ success: false, error: error.message });\n  }\n});\n\n// POST /api/todos - Create a new todo\nrouter.post('/', (req, res) => {\n  try {\n    const { title, completed = false } = req.body;\n    \n    // TODO: Add input validation\n    // HINT: Check if title exists and is not empty\n    // if (!title || title.trim() === '') { return res.status(400).json({...}) }\n    \n    const newTodo = {\n      id: nextId++,\n      title: title.trim(),\n      completed: Boolean(completed),\n      createdAt: new Date()\n    };\n    \n    todos.push(newTodo);\n    \n    res.status(201).json({\n      success: true,\n      message: 'Todo created successfully',\n      data: newTodo\n    });\n  } catch (error) {\n    res.status(500).json({ success: false, error: error.message });\n  }\n});\n\n// PUT /api/todos/:id - Update a todo\nrouter.put('/:id', (req, res) => {\n  try {\n    const id = parseInt(req.params.id);\n    const { title, completed } = req.body;\n    \n    // TODO: Find todo by ID and update it\n    // HINT: Use todos.findIndex() to find the todo\n    // const todoIndex = todos.findIndex(todo => todo.id === id);\n    \n    res.status(501).json({ \n      success: false, \n      error: 'Update functionality not implemented yet',\n      hint: 'Find the todo by ID and update its properties'\n    });\n  } catch (error) {\n    res.status(500).json({ success: false, error: error.message });\n  }\n});\n\n// DELETE /api/todos/:id - Delete a todo\nrouter.delete('/:id', (req, res) => {\n  try {\n    const id = parseInt(req.params.id);\n    \n    // TODO: Find and remove todo by ID\n    // HINT: Use todos.filter() to remove the todo\n    // todos = todos.filter(todo => todo.id !== id);\n    \n    res.status(501).json({ \n      success: false, \n      error: 'Delete functionality not implemented yet',\n      hint: 'Filter out the todo with the given ID'\n    });\n  } catch (error) {\n    res.status(500).json({ success: false, error: error.message });\n  }\n});\n\nmodule.exports = router;`
        },
        {
          name: 'index.js',
          type: 'file',
          content: `const express = require('express');\nconst router = express.Router();\n\n// Home route\nrouter.get('/', (req, res) => {\n  res.json({\n    message: 'Welcome to Node.js 10 Projects API!',\n    version: '1.0.0',\n    endpoints: {\n      'GET /': 'This endpoint',\n      'GET /api/todos': 'Get all todos',\n      'POST /api/todos': 'Create a new todo',\n      'PUT /api/todos/:id': 'Update a todo',\n      'DELETE /api/todos/:id': 'Delete a todo'\n    },\n    documentation: 'Check README.md for detailed API documentation'\n  });\n});\n\nmodule.exports = router;`
        }
      ]
    },
    {
      name: 'middleware',
      type: 'folder',
      isOpen: false,
      children: [
        {
          name: 'validation.js',
          type: 'file',
          content: `// TODO: Implement validation middleware\n// HINT: Use express-validator for input validation\n\nconst validateTodo = (req, res, next) => {\n  // TODO: Add validation rules\n  // Example validation:\n  // - title is required and not empty\n  // - title is a string\n  // - completed is optional boolean\n  \n  console.log('Validation middleware called');\n  next(); // Continue to next middleware\n};\n\nmodule.exports = {\n  validateTodo\n};`
        },
        {
          name: 'errorHandler.js',
          type: 'file',
          content: `// Global error handling middleware\nconst errorHandler = (err, req, res, next) => {\n  console.error('Error:', err.message);\n  \n  // Default error\n  let error = { ...err };\n  error.message = err.message;\n  \n  // Log error for debugging\n  console.error(err.stack);\n  \n  res.status(error.statusCode || 500).json({\n    success: false,\n    error: error.message || 'Server Error',\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })\n  });\n};\n\nmodule.exports = errorHandler;`
        }
      ]
    },
    {
      name: 'server.js',
      type: 'file',
      content: `const express = require('express');\nconst cors = require('cors');\nconst morgan = require('morgan');\nconst errorHandler = require('./middleware/errorHandler');\n\nconst app = express();\n\n// Middleware\napp.use(cors());\napp.use(morgan('combined'));\napp.use(express.json({ limit: '10mb' }));\napp.use(express.urlencoded({ extended: true }));\n\n// Routes\nconst indexRouter = require('./routes/index');\nconst todosRouter = require('./routes/todos');\n\napp.use('/', indexRouter);\napp.use('/api/todos', todosRouter);\n\n// Error handling middleware (must be last)\napp.use(errorHandler);\n\n// Handle 404\napp.use('*', (req, res) => {\n  res.status(404).json({\n    success: false,\n    error: 'Route not found',\n    availableRoutes: {\n      'GET /': 'API information',\n      'GET /api/todos': 'Get all todos',\n      'POST /api/todos': 'Create todo',\n      'PUT /api/todos/:id': 'Update todo',\n      'DELETE /api/todos/:id': 'Delete todo'\n    }\n  });\n});\n\nconst PORT = process.env.PORT || 3000;\n\napp.listen(PORT, () => {\n  console.log(\`🚀 Server running on port \${PORT}\`);\n  console.log(\`📝 API available at http://localhost:\${PORT}\`);\n  console.log(\`📋 Todos endpoint: http://localhost:\${PORT}/api/todos\`);\n  console.log(\`📖 Documentation: Check README.md\`);\n});`
    },
    {
      name: 'package.json',
      type: 'file',
      content: `{\n  "name": "nodejs-10-projects",\n  "version": "1.0.0",\n  "description": "Collection of 10 Node.js projects for learning",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js",\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "dependencies": {\n    "express": "^4.18.2",\n    "cors": "^2.8.5",\n    "morgan": "^1.10.0",\n    "express-validator": "^6.15.0"\n  },\n  "devDependencies": {\n    "nodemon": "^3.0.1"\n  },\n  "keywords": ["nodejs", "express", "rest-api", "learning", "projects"],\n  "author": "Web Elevate Student",\n  "license": "MIT"\n}`
    },
    {
      name: '.env.example',
      type: 'file',
      content: `# Environment Variables\nPORT=3000\nNODE_ENV=development\n\n# Database (for future use)\n# DB_HOST=localhost\n# DB_PORT=5432\n# DB_NAME=todos\n# DB_USER=your_username\n# DB_PASS=your_password`
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

const generateReactWeatherApp = (repo: GitHubRepo): FileNode[] => {
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
              name: 'WeatherApp.js',
              type: 'file',
              content: `import React, { useState, useEffect } from 'react';\nimport './WeatherApp.css';\n\nfunction WeatherApp() {\n  const [weather, setWeather] = useState(null);\n  const [city, setCity] = useState('London');\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n\n  // TODO: Fix the API integration\n  const fetchWeather = async (cityName) => {\n    setLoading(true);\n    setError(null);\n    \n    try {\n      // BUG: API endpoint is incorrect\n      // HINT: Use OpenWeatherMap API: https://api.openweathermap.org/data/2.5/weather\n      const response = await fetch(\`https://api.broken-weather.com/weather?q=\${cityName}\`);\n      \n      if (!response.ok) {\n        throw new Error('Weather data not found');\n      }\n      \n      const data = await response.json();\n      setWeather(data);\n    } catch (err) {\n      setError(err.message);\n      console.error('Weather API Error:', err);\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  useEffect(() => {\n    fetchWeather(city);\n  }, []);\n\n  const handleSearch = (e) => {\n    e.preventDefault();\n    if (city.trim()) {\n      fetchWeather(city.trim());\n    }\n  };\n\n  return (\n    <div className="weather-app">\n      <h1>🌤️ Weather App</h1>\n      \n      <form onSubmit={handleSearch} className="search-form">\n        <input \n          type="text"\n          value={city}\n          onChange={(e) => setCity(e.target.value)}\n          placeholder="Enter city name..."\n          className="city-input"\n        />\n        <button type="submit" className="search-btn">\n          Get Weather\n        </button>\n      </form>\n\n      {loading && <div className="loading">Loading weather data...</div>}\n      \n      {error && (\n        <div className="error">\n          <p>❌ {error}</p>\n          <p className="hint">💡 Hint: Check the API endpoint and your internet connection</p>\n        </div>\n      )}\n      \n      {weather && (\n        <div className="weather-info">\n          <h2>{weather.name}</h2>\n          <div className="temperature">{Math.round(weather.main?.temp || 0)}°C</div>\n          <div className="description">{weather.weather?.[0]?.description || 'No description'}</div>\n          <div className="details">\n            <p>Feels like: {Math.round(weather.main?.feels_like || 0)}°C</p>\n            <p>Humidity: {weather.main?.humidity || 0}%</p>\n            <p>Wind: {weather.wind?.speed || 0} m/s</p>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}\n\nexport default WeatherApp;`
            }
          ]
        },
        {
          name: 'App.js',
          type: 'file',
          content: `import React from 'react';\nimport WeatherApp from './components/WeatherApp';\nimport './App.css';\n\nfunction App() {\n  return (\n    <div className="App">\n      <WeatherApp />\n    </div>\n  );\n}\n\nexport default App;`
        },
        {
          name: 'App.css',
          type: 'file',
          content: `.App {\n  text-align: center;\n  min-height: 100vh;\n  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);\n  padding: 20px;\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n}`
        },
        {
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: [
            {
              name: 'WeatherApp.css',
              type: 'file',
              content: `.weather-app {\n  max-width: 500px;\n  margin: 0 auto;\n  background: rgba(255, 255, 255, 0.95);\n  border-radius: 20px;\n  padding: 30px;\n  box-shadow: 0 15px 35px rgba(0,0,0,0.1);\n  backdrop-filter: blur(10px);\n}\n\n.weather-app h1 {\n  color: #2d3436;\n  margin-bottom: 30px;\n  font-size: 2.5rem;\n}\n\n.search-form {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 30px;\n}\n\n.city-input {\n  flex: 1;\n  padding: 15px;\n  border: 2px solid #ddd;\n  border-radius: 10px;\n  font-size: 16px;\n  outline: none;\n  transition: border-color 0.3s;\n}\n\n.city-input:focus {\n  border-color: #74b9ff;\n}\n\n.search-btn {\n  background: linear-gradient(135deg, #74b9ff, #0984e3);\n  color: white;\n  border: none;\n  padding: 15px 25px;\n  border-radius: 10px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.2s;\n}\n\n.search-btn:hover {\n  transform: translateY(-2px);\n}\n\n.loading {\n  color: #74b9ff;\n  font-size: 18px;\n  margin: 20px 0;\n}\n\n.error {\n  background: #ffe0e0;\n  border: 2px solid #ff6b6b;\n  border-radius: 10px;\n  padding: 20px;\n  margin: 20px 0;\n  color: #d63031;\n}\n\n.hint {\n  font-size: 14px;\n  margin-top: 10px;\n  color: #636e72;\n}\n\n.weather-info {\n  background: linear-gradient(135deg, #74b9ff, #0984e3);\n  color: white;\n  border-radius: 15px;\n  padding: 30px;\n  margin-top: 20px;\n}\n\n.weather-info h2 {\n  font-size: 2rem;\n  margin-bottom: 15px;\n}\n\n.temperature {\n  font-size: 4rem;\n  font-weight: bold;\n  margin: 20px 0;\n}\n\n.description {\n  font-size: 1.5rem;\n  text-transform: capitalize;\n  margin-bottom: 20px;\n}\n\n.details {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 15px;\n  margin-top: 20px;\n}\n\n.details p {\n  background: rgba(255,255,255,0.2);\n  padding: 10px;\n  border-radius: 8px;\n  margin: 0;\n}`
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
          content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>React Weather App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: generatePackageJson(repo, 'react')
    },
    {
      name: 'README.md',
      type: 'file',
      content: generateReadme(repo)
    }
  ];
};

// Complete project generators for all supported types
const generateReactWeatherAppComplete = (repo: GitHubRepo): FileNode[] => {
  return generateReactProjectComplete(repo);
};

const generateExpressBlogApiComplete = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectComplete(repo);
};

const generateReact85ProjectsComplete = (repo: GitHubRepo): FileNode[] => {
  return generateReactProjectComplete(repo);
};

const generateAngularBeginnerComplete = (repo: GitHubRepo): FileNode[] => {
  return generateAngularProjectComplete(repo);
};

const generateAngularTicTacToeComplete = (repo: GitHubRepo): FileNode[] => {
  return generateAngularProjectComplete(repo);
};

const generateNodeJs10ProjectsComplete = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectComplete(repo);
};

const generateNodeRealworldApiComplete = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectComplete(repo);
};

const generateVueBeginnerProjectsComplete = (repo: GitHubRepo): FileNode[] => {
  return generateVueProjectComplete(repo);
};

const generateHtmlCssJsProjectsComplete = (repo: GitHubRepo): FileNode[] => {
  return generateHtmlCssJsProjectComplete(repo);
};

const generateFullstackMernComplete = (repo: GitHubRepo): FileNode[] => {
  return generateFullstackProjectComplete(repo);
};

const generateAngularTodoAppComplete = (repo: GitHubRepo): FileNode[] => {
  return generateAngularProjectComplete(repo);
};

const generateNodejsExpressApiComplete = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectComplete(repo);
};

const generateReactPortfolioComplete = (repo: GitHubRepo): FileNode[] => {
  return generateReactProjectComplete(repo);
};

const generateVueTodoAppComplete = (repo: GitHubRepo): FileNode[] => {
  return generateVueProjectComplete(repo);
};

const generateAngularWeatherAppComplete = (repo: GitHubRepo): FileNode[] => {
  return generateAngularProjectComplete(repo);
};

const generateNodejsChatAppComplete = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectComplete(repo);
};

// Add placeholder generators for other projects
const generateExpressBlogApi = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectFiles(repo, { type: 'Blog API', features: ['CRUD operations', 'Authentication', 'Validation'] });
};

const generateReact85Projects = (repo: GitHubRepo): FileNode[] => {
  return generateReactProjectFiles(repo, { mainComponent: 'App', components: ['MovieSearch', 'PaginatedList', 'FormValidation'], features: ['API integration', 'Pagination', 'Form validation'] });
};

const generateAngularBeginnerStarter = (repo: GitHubRepo): FileNode[] => {
  return generateAngularProjectFiles(repo, { mainComponent: 'AppComponent', components: ['HomeComponent', 'FormComponent'], features: ['Routing', 'Two-way binding', 'Services'] });
};

const generateAngularTicTacToe = (repo: GitHubRepo): FileNode[] => {
  return generateAngularProjectFiles(repo, { mainComponent: 'GameComponent', components: ['BoardComponent', 'SquareComponent'], features: ['Game logic', 'State management', 'Win detection'] });
};

const generateNodeRealworldApi = (repo: GitHubRepo): FileNode[] => {
  return generateNodeJsProjectFiles(repo, { type: 'Realworld API', features: ['JWT Authentication', 'User profiles', 'Article CRUD', 'Following system'] });
};

// Base project generators for different categories
const generateAngularProjectComplete = (repo: GitHubRepo): FileNode[] => {
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
              content: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '${repo.name}';
  description = '${repo.description}';

  items = [
    { id: 1, name: 'Angular Basics', completed: true },
    { id: 2, name: 'Components', completed: false },
    { id: 3, name: 'Services', completed: false }
  ];

  onItemClick(item: any) {
    item.completed = !item.completed;
    console.log('Item clicked:', item);
  }
}`
            },
            {
              name: 'app.component.html',
              type: 'file',
              content: `<div class="app-container">
  <header class="app-header">
    <h1>🚀 {{ title }}</h1>
    <p>{{ description }}</p>
  </header>

  <main class="app-main">
    <div class="card-container">
      <div class="card" *ngFor="let item of items" (click)="onItemClick(item)">
        <h3>{{ item.name }}</h3>
        <p [class]="item.completed ? 'completed' : 'pending'">
          {{ item.completed ? '✅ Completed' : '⏳ Pending' }}
        </p>
      </div>
    </div>
  </main>
</div>`
            },
            {
              name: 'app.component.css',
              type: 'file',
              content: `.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.completed {
  color: #51cf66;
}

.pending {
  color: #ffd43b;
}`
            },
            {
              name: 'app.module.ts',
              type: 'file',
              content: `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`
            }
          ]
        },
        {
          name: 'main.ts',
          type: 'file',
          content: `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: `{
  "name": "${repo.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/animations": "^15.0.0",
    "@angular/common": "^15.0.0",
    "@angular/compiler": "^15.0.0",
    "@angular/core": "^15.0.0",
    "@angular/forms": "^15.0.0",
    "@angular/platform-browser": "^15.0.0",
    "@angular/platform-browser-dynamic": "^15.0.0",
    "@angular/router": "^15.0.0",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.12.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^15.0.0",
    "@angular/cli": "~15.0.0",
    "@angular/compiler-cli": "^15.0.0",
    "typescript": "~4.8.0"
  }
}`
    }
  ];
};

const generateVueProjectComplete = (repo: GitHubRepo): FileNode[] => {
  return [
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          name: 'App.vue',
          type: 'file',
          content: `<template>
  <div id="app">
    <header class="app-header">
      <h1>🚀 ${repo.name}</h1>
      <p>${repo.description}</p>
    </header>

    <main class="app-main">
      <div class="card-container">
        <div
          v-for="item in items"
          :key="item.id"
          class="card"
          @click="toggleItem(item)"
        >
          <h3>{{ item.name }}</h3>
          <p :class="item.completed ? 'completed' : 'pending'">
            {{ item.completed ? '✅ Completed' : '⏳ Pending' }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      items: [
        { id: 1, name: 'Vue Basics', completed: true },
        { id: 2, name: 'Components', completed: false },
        { id: 3, name: 'Reactivity', completed: false }
      ]
    }
  },
  methods: {
    toggleItem(item) {
      item.completed = !item.completed;
      console.log('Item toggled:', item);
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.completed {
  color: #51cf66;
}

.pending {
  color: #ffd43b;
}
</style>`
        },
        {
          name: 'main.js',
          type: 'file',
          content: `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      content: `{
  "name": "${repo.name.toLowerCase().replace(/\s+/g, '-')}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.8.3",
    "vue": "^3.2.13"
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-plugin-vue": "^8.0.3"
  }
}`
    }
  ];
};

const generateHtmlCssJsProjectComplete = (repo: GitHubRepo): FileNode[] => {
  return [
    {
      name: 'index.html',
      type: 'file',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${repo.name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🚀 ${repo.name}</h1>
            <p>${repo.description}</p>
        </header>

        <main class="main">
            <div class="card-container" id="cardContainer">
                <!-- Cards will be generated by JavaScript -->
            </div>

            <div class="actions">
                <button id="addBtn" class="btn btn-primary">Add Item</button>
                <button id="clearBtn" class="btn btn-secondary">Clear All</button>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>`
    },
    {
      name: 'styles.css',
      type: 'file',
      content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    text-align: center;
    margin-bottom: 40px;
}

.header h1 {
    font-size: 3rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 25px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-5px);
}

.card h3 {
    margin-bottom: 15px;
    font-size: 1.5rem;
}

.card p {
    opacity: 0.8;
    line-height: 1.6;
}

.actions {
    text-align: center;
    display: flex;
    gap: 15px;
    justify-content: center;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn-primary {
    background: linear-gradient(135deg, #74c0fc, #339af0);
    color: white;
}

.btn-secondary {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.completed {
    color: #51cf66;
}

.pending {
    color: #ffd43b;
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 2rem;
    }

    .card-container {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column;
        align-items: center;
    }
}`
    },
    {
      name: 'script.js',
      type: 'file',
      content: `// Application state
let items = [
    { id: 1, title: 'HTML Structure', description: 'Learn HTML basics and semantic elements', completed: true },
    { id: 2, title: 'CSS Styling', description: 'Master CSS layouts and animations', completed: false },
    { id: 3, title: 'JavaScript Logic', description: 'Add interactivity with JavaScript', completed: false }
];

// DOM elements
const cardContainer = document.getElementById('cardContainer');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');

// Render items to the DOM
function renderItems() {
    cardContainer.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = \`
            <h3>\${item.title}</h3>
            <p>\${item.description}</p>
            <p class="\${item.completed ? 'completed' : 'pending'}">
                \${item.completed ? '✅ Completed' : '⏳ Pending'}
            </p>
        \`;

        // Add click handler to toggle completion
        card.addEventListener('click', () => toggleItem(item.id));

        cardContainer.appendChild(card);
    });
}

// Toggle item completion status
function toggleItem(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
        renderItems();
        console.log('Item toggled:', item);
    }
}

// Add new item
function addItem() {
    const titles = ['New Feature', 'Bug Fix', 'Enhancement', 'Documentation', 'Testing'];
    const descriptions = [
        'Implement new functionality',
        'Fix reported issues',
        'Improve existing features',
        'Update documentation',
        'Add test coverage'
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    const newItem = {
        id: Date.now(),
        title: randomTitle,
        description: randomDescription,
        completed: false
    };

    items.push(newItem);
    renderItems();
    console.log('Item added:', newItem);
}

// Clear all items
function clearItems() {
    if (confirm('Are you sure you want to clear all items?')) {
        items = [];
        renderItems();
        console.log('All items cleared');
    }
}

// Event listeners
addBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearItems);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderItems();
    console.log('App initialized with', items.length, 'items');
});

// Export for potential use in other scripts
window.AppState = {
    items,
    addItem,
    clearItems,
    toggleItem
};`
    }
  ];
};

const generateFullstackProjectComplete = (repo: GitHubRepo): FileNode[] => {
  return generateFullstackProjectFiles(repo, {});
};

const generateBasicProjectComplete = (repo: GitHubRepo): FileNode[] => {
  return generateHtmlCssJsProjectComplete(repo);
};

export default Playground;
