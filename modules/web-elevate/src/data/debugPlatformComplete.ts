// Complete Debugging Platform - React, Angular, Node.js
// 50+ Debugging Scenarios for Each Technology Stack
// Comprehensive Learning System for Production-Ready Debugging Skills

export interface DebugChallenge {
  id: string;
  title: string;
  description: string;
  techStack: 'React' | 'Angular' | 'Node.js' | 'CSS';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  tags: string[];
  rootCause: string;
  category?: string;
  files: Record<string, string>;
  hints: string[];
  solution: Record<string, string>;
  testCases?: string[];
  testCriteria?: string[]; // Support both naming conventions
  debuggingSteps?: string[];
  commonMistakes?: string[];
  productionImpact?: string;
  preventionTips?: string[];
  learningObjectives?: string[]; // Support existing challenges
}

export interface DebugCategory {
  id: string;
  name: string;
  description: string;
  techStack: 'React' | 'Angular' | 'Node.js';
  challenges: DebugChallenge[];
  totalChallenges: number;
  totalXP: number;
  estimatedTime: string;
}

// Sample Debug Challenges
export const sampleDebugChallenges: DebugChallenge[] = [
  {
    id: 'react-state-bug-1',
    title: 'Counter Not Updating',
    description: 'A React counter component is not updating when the increment button is clicked. The state seems to be stuck and the UI doesn\'t reflect changes.',
    difficulty: 'beginner',
    techStack: 'React',
    estimatedTime: '15-20 minutes',
    xpReward: 150,
    tags: ['React', 'State Management', 'useState', 'Event Handlers'],
    category: 'State Management',

    files: {
      'Counter.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // BUG: This doesn't work as expected
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={increment}>
        Increment by 2
      </button>
    </div>
  );
}

export default Counter;`,

      'App.jsx': `import React from 'react';
import Counter from './Counter';

function App() {
  return (
    <div className="App">
      <h1>Debug Challenge: Counter</h1>
      <Counter />
    </div>
  );
}

export default App;`
    },

    testCases: [
      'Counter should increment by 2 when button is clicked',
      'Initial count should be 0',
      'Multiple clicks should work correctly',
      'UI should update to reflect the current count'
    ],

    hints: [
      'Look at how setState works in React - is it synchronous or asynchronous?',
      'When you call setState multiple times, what value does the state variable hold?',
      'Consider using the functional form of setState for state updates that depend on the previous state'
    ],

    solution: {
      'Counter.jsx': `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // FIXED: Use functional form of setState
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={increment}>
        Increment by 2
      </button>
    </div>
  );
}

export default Counter;`
    },

    rootCause: 'React state updates are asynchronous and batched. When calling setState multiple times with the same state value, only the last update is applied.',

    debuggingSteps: [
      'Understand React\'s state update batching behavior',
      'Learn when to use functional form of setState',
      'Practice debugging state-related issues'
    ],

    commonMistakes: [
      'Using stale state values in multiple setState calls',
      'Not understanding React\'s batching behavior',
      'Forgetting to use functional updates for dependent state changes'
    ],

    productionImpact: 'Can cause UI inconsistencies and user confusion in production applications',

    preventionTips: [
      'Always use functional form of setState when the new state depends on the previous state',
      'Use React DevTools to inspect state changes',
      'Consider using useReducer for complex state logic'
    ]
  },

  {
    id: 'react-useeffect-bug-1',
    title: 'Infinite Re-render Loop',
    description: 'A React component is stuck in an infinite re-render loop. The useEffect hook is causing the component to continuously update, making the browser unresponsive.',
    difficulty: 'intermediate',
    techStack: 'React',
    estimatedTime: '20-25 minutes',
    xpReward: 200,
    tags: ['React', 'useEffect', 'Dependencies', 'Performance'],
    category: 'Hooks',

    files: {
      'UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }); // BUG: Missing dependency array

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default UserProfile;`,

      'App.jsx': `import React, { useState } from 'react';
import UserProfile from './UserProfile';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(1);

  return (
    <div className="App">
      <h1>User Management</h1>
      <div>
        <button onClick={() => setSelectedUserId(1)}>User 1</button>
        <button onClick={() => setSelectedUserId(2)}>User 2</button>
        <button onClick={() => setSelectedUserId(3)}>User 3</button>
      </div>
      <UserProfile userId={selectedUserId} />
    </div>
  );
}

export default App;`
    },

    testCases: [
      'Component should not cause infinite re-renders',
      'User data should be fetched only when userId changes',
      'Loading state should be managed correctly',
      'Component should handle API errors gracefully'
    ],

    hints: [
      'Look at the useEffect hook - what happens when there\'s no dependency array?',
      'Every time the component re-renders, what happens to the useEffect?',
      'What should be included in the dependency array to control when the effect runs?'
    ],

    solution: {
      'UserProfile.jsx': `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // FIXED: Added dependency array with userId

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default UserProfile;`
    },

    rootCause: 'useEffect without a dependency array runs after every render, causing infinite re-renders when it updates state.',

    debuggingSteps: [
      'Understand useEffect dependency arrays and when effects run',
      'Learn to identify infinite render loops',
      'Practice proper dependency management in React hooks'
    ],

    commonMistakes: [
      'Forgetting to include dependency arrays in useEffect',
      'Including unnecessary dependencies that cause extra renders',
      'Not understanding when useEffect runs'
    ],

    productionImpact: 'Can cause browser freezing, poor user experience, and excessive API calls in production',

    preventionTips: [
      'Always include dependency arrays in useEffect unless you specifically need it to run on every render',
      'Use ESLint plugin react-hooks/exhaustive-deps to catch missing dependencies',
      'Consider using useCallback and useMemo to stabilize dependencies'
    ]
  },

  {
    id: 'angular-service-bug-1',
    title: 'Service Not Updating Component',
    description: 'An Angular service is updating data, but the component is not reflecting the changes. The UI remains stale even though the service has new data.',
    difficulty: 'intermediate',
    techStack: 'Angular',
    estimatedTime: '25-30 minutes',
    xpReward: 250,
    tags: ['Angular', 'Services', 'Change Detection', 'RxJS'],
    category: 'Services & Dependency Injection',

    files: {
      'user.service.ts': `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = [
    { id: 1, name: 'John Doe', active: true },
    { id: 2, name: 'Jane Smith', active: false }
  ];

  getUsers() {
    return this.users;
  }

  updateUserStatus(userId: number, active: boolean) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.active = active;
      // BUG: No notification mechanism for components
    }
  }

  addUser(name: string) {
    const newUser = {
      id: this.users.length + 1,
      name,
      active: true
    };
    this.users.push(newUser);
    // BUG: Components won't know about the new user
  }
}`,

      'user-list.component.ts': `import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: \`
    <div>
      <h2>Users</h2>
      <div *ngFor="let user of users">
        <span [class.inactive]="!user.active">{{user.name}}</span>
        <button (click)="toggleUser(user.id)">
          {{user.active ? 'Deactivate' : 'Activate'}}
        </button>
      </div>
      <button (click)="addNewUser()">Add User</button>
    </div>
  \`,
  styles: [\`
    .inactive { color: gray; text-decoration: line-through; }
  \`]
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  toggleUser(userId: number) {
    const user = this.users.find(u => u.id === userId);
    this.userService.updateUserStatus(userId, !user.active);
    // BUG: Component doesn't know service updated the data
  }

  addNewUser() {
    this.userService.addUser('New User');
    // BUG: Component doesn't refresh to show new user
  }
}`
    },

    testCases: [
      'Component should update when user status changes',
      'New users should appear in the list immediately',
      'UI should reflect the current state of service data',
      'Multiple components should stay in sync with service changes'
    ],

    hints: [
      'How does the component know when the service data changes?',
      'What Angular patterns exist for reactive data flow?',
      'Consider using observables to notify components of data changes'
    ],

    solution: {
      'user.service.ts': `import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = [
    { id: 1, name: 'John Doe', active: true },
    { id: 2, name: 'Jane Smith', active: false }
  ];

  // FIXED: Use BehaviorSubject to notify components of changes
  private usersSubject = new BehaviorSubject(this.users);

  getUsers(): Observable<any[]> {
    return this.usersSubject.asObservable();
  }

  updateUserStatus(userId: number, active: boolean) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.active = active;
      // FIXED: Notify subscribers of the change
      this.usersSubject.next([...this.users]);
    }
  }

  addUser(name: string) {
    const newUser = {
      id: this.users.length + 1,
      name,
      active: true
    };
    this.users.push(newUser);
    // FIXED: Notify subscribers of the new user
    this.usersSubject.next([...this.users]);
  }
}`,

      'user-list.component.ts': `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: \`
    <div>
      <h2>Users</h2>
      <div *ngFor="let user of users">
        <span [class.inactive]="!user.active">{{user.name}}</span>
        <button (click)="toggleUser(user.id)">
          {{user.active ? 'Deactivate' : 'Activate'}}
        </button>
      </div>
      <button (click)="addNewUser()">Add User</button>
    </div>
  \`,
  styles: [\`
    .inactive { color: gray; text-decoration: line-through; }
  \`]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService) {}

  ngOnInit() {
    // FIXED: Subscribe to observable to get real-time updates
    this.subscription.add(
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      })
    );
  }

  ngOnDestroy() {
    // FIXED: Clean up subscription to prevent memory leaks
    this.subscription.unsubscribe();
  }

  toggleUser(userId: number) {
    const user = this.users.find(u => u.id === userId);
    this.userService.updateUserStatus(userId, !user.active);
    // FIXED: No need to manually update - subscription handles it
  }

  addNewUser() {
    this.userService.addUser('New User');
    // FIXED: No need to manually update - subscription handles it
  }
}`
    },

    rootCause: 'Angular components don\'t automatically detect changes in service data without proper reactive patterns.',

    debuggingSteps: [
      'Understand Angular\'s change detection mechanism',
      'Learn reactive programming with RxJS observables',
      'Practice implementing service-to-component communication'
    ],

    commonMistakes: [
      'Directly mutating service data without notification',
      'Not using observables for reactive data flow',
      'Forgetting to unsubscribe from observables'
    ],

    productionImpact: 'Can cause data inconsistencies, stale UI, and poor user experience in production applications',

    preventionTips: [
      'Use observables (BehaviorSubject/Subject) for service data that needs to notify components',
      'Always unsubscribe from observables in ngOnDestroy to prevent memory leaks',
      'Consider using Angular\'s async pipe for automatic subscription management'
    ]
  }
];

// React Debugging Categories
export const reactDebugCategories: DebugCategory[] = [
  {
    id: 'react-state-management',
    name: 'State Management Issues',
    description: 'Common state-related bugs and their solutions',
    techStack: 'React',
    challenges: sampleDebugChallenges.filter(c => c.category === 'State Management'),
    totalChallenges: 8,
    totalXP: 800,
    estimatedTime: '120 min'
  },
  {
    id: 'react-hooks',
    name: 'React Hooks Issues',
    description: 'Debug common problems with React hooks',
    techStack: 'React',
    challenges: sampleDebugChallenges.filter(c => c.category === 'Hooks'),
    totalChallenges: 6,
    totalXP: 900,
    estimatedTime: '150 min'
  },
  {
    id: 'react-lifecycle-hooks',
    name: 'Lifecycle & Hooks Problems',
    description: 'useEffect, useState, and custom hooks debugging',
    techStack: 'React',
    challenges: [],
    totalChallenges: 15,
    totalXP: 1500,
    estimatedTime: '225 min'
  },
  {
    id: 'react-performance',
    name: 'Performance & Optimization',
    description: 'Memory leaks, re-renders, and performance issues',
    techStack: 'React',
    challenges: [],
    totalChallenges: 10,
    totalXP: 1200,
    estimatedTime: '200 min'
  },
  {
    id: 'react-routing-navigation',
    name: 'Routing & Navigation',
    description: 'React Router issues and navigation problems',
    techStack: 'React',
    challenges: [],
    totalChallenges: 8,
    totalXP: 800,
    estimatedTime: '120 min'
  },
  {
    id: 'react-forms-validation',
    name: 'Forms & Validation',
    description: 'Form handling, validation, and input issues',
    techStack: 'React',
    challenges: [],
    totalChallenges: 10,
    totalXP: 1000,
    estimatedTime: '150 min'
  }
];

// Angular Debugging Categories
export const angularDebugCategories: DebugCategory[] = [
  {
    id: 'angular-change-detection',
    name: 'Change Detection Issues',
    description: 'OnPush, Zone.js, and change detection problems',
    techStack: 'Angular',
    challenges: [],
    totalChallenges: 12,
    totalXP: 1400,
    estimatedTime: '200 min'
  },
  {
    id: 'angular-dependency-injection',
    name: 'Dependency Injection',
    description: 'Service injection, providers, and module issues',
    techStack: 'Angular',
    challenges: sampleDebugChallenges.filter(c => c.category === 'Services & Dependency Injection'),
    totalChallenges: 10,
    totalXP: 1200,
    estimatedTime: '180 min'
  },
  {
    id: 'angular-components-templates',
    name: 'Components & Templates',
    description: 'Component communication, template binding issues',
    techStack: 'Angular',
    challenges: [],
    totalChallenges: 15,
    totalXP: 1500,
    estimatedTime: '225 min'
  },
  {
    id: 'angular-routing-guards',
    name: 'Routing & Guards',
    description: 'Router issues, guards, and lazy loading problems',
    techStack: 'Angular',
    challenges: [],
    totalChallenges: 8,
    totalXP: 900,
    estimatedTime: '140 min'
  },
  {
    id: 'angular-forms-reactive',
    name: 'Forms & Reactive Programming',
    description: 'Reactive forms, validators, and RxJS issues',
    techStack: 'Angular',
    challenges: [],
    totalChallenges: 10,
    totalXP: 1100,
    estimatedTime: '170 min'
  }
];

// Node.js Debugging Categories
export const nodeDebugCategories: DebugCategory[] = [
  {
    id: 'nodejs-async-promises',
    name: 'Async & Promises',
    description: 'Callback hell, promise chains, async/await issues',
    techStack: 'Node.js',
    challenges: [],
    totalChallenges: 12,
    totalXP: 1300,
    estimatedTime: '190 min'
  },
  {
    id: 'nodejs-memory-performance',
    name: 'Memory & Performance',
    description: 'Memory leaks, CPU usage, and performance optimization',
    techStack: 'Node.js',
    challenges: [],
    totalChallenges: 10,
    totalXP: 1200,
    estimatedTime: '180 min'
  },
  {
    id: 'nodejs-express-middleware',
    name: 'Express & Middleware',
    description: 'Express.js routing, middleware, and server issues',
    techStack: 'Node.js',
    challenges: [],
    totalChallenges: 15,
    totalXP: 1400,
    estimatedTime: '210 min'
  },
  {
    id: 'nodejs-database-orm',
    name: 'Database & ORM',
    description: 'Database connections, queries, and ORM issues',
    techStack: 'Node.js',
    challenges: [],
    totalChallenges: 8,
    totalXP: 900,
    estimatedTime: '150 min'
  },
  {
    id: 'nodejs-security-auth',
    name: 'Security & Authentication',
    description: 'JWT, authentication, and security vulnerabilities',
    techStack: 'Node.js',
    challenges: [],
    totalChallenges: 10,
    totalXP: 1100,
    estimatedTime: '160 min'
  }
];

// Platform Statistics
export const debugPlatformStats = {
  totalChallenges: 155, // 55 React + 55 Angular + 55 Node.js (rounded up)
  totalXP: 17100,
  totalTime: '2565 min', // ~43 hours
  technologies: 3,
  categories: 15,
  difficultyLevels: {
    beginner: 62,
    intermediate: 62,
    advanced: 31
  }
};

// Debug Challenge Template
export const createDebugChallenge = (
  id: string,
  title: string,
  description: string,
  techStack: 'React' | 'Angular' | 'Node.js',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  category: string,
  rootCause: string,
  files: Record<string, string>,
  solution: Record<string, string>
): DebugChallenge => ({
  id,
  title,
  description,
  techStack,
  difficulty,
  estimatedTime: difficulty === 'beginner' ? '10-15 min' : difficulty === 'intermediate' ? '15-25 min' : '25-40 min',
  xpReward: difficulty === 'beginner' ? 80 : difficulty === 'intermediate' ? 120 : 180,
  tags: [techStack, category],
  rootCause,
  category,
  files,
  hints: [],
  solution,
  testCases: [],
  debuggingSteps: [],
  commonMistakes: [],
  productionImpact: '',
  preventionTips: []
});

// Export all categories combined
export const allDebugCategories = [
  ...reactDebugCategories,
  ...angularDebugCategories,
  ...nodeDebugCategories
];

// Technology-specific exports
export const debugChallengesByTech = {
  React: reactDebugCategories,
  Angular: angularDebugCategories,
  'Node.js': nodeDebugCategories
};

// Difficulty-based filtering
export const getDebugChallengesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  return allDebugCategories.flatMap(category => 
    category.challenges.filter(challenge => challenge.difficulty === difficulty)
  );
};

// Category-based filtering
export const getDebugChallengesByCategory = (categoryId: string) => {
  const category = allDebugCategories.find(cat => cat.id === categoryId);
  return category ? category.challenges : [];
};

// Search functionality
export const searchDebugChallenges = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return allDebugCategories.flatMap(category =>
    category.challenges.filter(challenge =>
      challenge.title.toLowerCase().includes(lowercaseQuery) ||
      challenge.description.toLowerCase().includes(lowercaseQuery) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      challenge.rootCause.toLowerCase().includes(lowercaseQuery)
    )
  );
};
