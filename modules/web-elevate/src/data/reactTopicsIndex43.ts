// Complete React Learning Path - All 43 Topics Index
// This file contains the complete curriculum structure

export interface TopicSummary {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'fundamentals' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
  xpReward: number;
}

export const all43ReactTopicsIndex: TopicSummary[] = [
  // ===== FUNDAMENTALS (Topics 1-12) =====
  {
    id: 'what-is-react',
    title: 'What is React?',
    description: 'Understanding React\'s declarative approach and Virtual DOM',
    estimatedTime: '50 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: [],
    xpReward: 125
  },
  {
    id: 'jsx-syntax',
    title: 'JSX - JavaScript + HTML Syntax',
    description: 'Master JSX syntax and learn to embed HTML in JavaScript',
    estimatedTime: '55 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['what-is-react'],
    xpReward: 140
  },
  {
    id: 'components-functional-class',
    title: 'Components - Functional vs Class',
    description: 'Master component creation with focus on modern functional components',
    estimatedTime: '60 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['jsx-syntax'],
    xpReward: 150
  },
  {
    id: 'props-data-passing',
    title: 'Props - Passing Data Between Components',
    description: 'Learn how to pass data between components using props',
    estimatedTime: '45 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['components-functional-class'],
    xpReward: 130
  },
  {
    id: 'state-usestate',
    title: 'State Management with useState',
    description: 'Master component state management with the useState hook',
    estimatedTime: '50 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['props-data-passing'],
    xpReward: 140
  },
  {
    id: 'event-handling',
    title: 'Event Handling',
    description: 'Handle user interactions and SyntheticEvents like a pro',
    estimatedTime: '45 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['state-usestate'],
    xpReward: 135
  },
  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    description: 'Show and hide UI elements based on conditions dynamically',
    estimatedTime: '40 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['event-handling'],
    xpReward: 125
  },
  {
    id: 'lists-and-keys',
    title: 'Lists and Keys',
    description: 'Render dynamic lists efficiently with proper key management',
    estimatedTime: '45 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['conditional-rendering'],
    xpReward: 135
  },
  {
    id: 'forms-input-handling',
    title: 'Forms and Input Handling',
    description: 'Master form handling and input validation in React',
    estimatedTime: '55 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['lists-and-keys'],
    xpReward: 145
  },
  {
    id: 'useeffect-hook',
    title: 'useEffect Hook - Side Effects',
    description: 'Master side effects and component lifecycle with useEffect',
    estimatedTime: '60 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['forms-input-handling'],
    xpReward: 155
  },
  {
    id: 'component-lifecycle',
    title: 'Component Lifecycle in Functional Components',
    description: 'Understand component lifecycle using hooks',
    estimatedTime: '50 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['useeffect-hook'],
    xpReward: 140
  },
  {
    id: 'controlled-uncontrolled-inputs',
    title: 'Controlled vs Uncontrolled Inputs',
    description: 'Master different input handling patterns in React',
    estimatedTime: '45 min',
    difficulty: 'beginner',
    category: 'fundamentals',
    prerequisites: ['component-lifecycle'],
    xpReward: 130
  },

  // ===== INTERMEDIATE (Topics 13-28) =====
  {
    id: 'usecontext-hook',
    title: 'useContext Hook',
    description: 'Share data across components without prop drilling',
    estimatedTime: '50 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['controlled-uncontrolled-inputs'],
    xpReward: 160
  },
  {
    id: 'useref-hook',
    title: 'useRef Hook',
    description: 'Access DOM elements and persist values across renders',
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['usecontext-hook'],
    xpReward: 150
  },
  {
    id: 'usememo-hook',
    title: 'useMemo Hook',
    description: 'Optimize performance with memoized calculations',
    estimatedTime: '40 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['useref-hook'],
    xpReward: 145
  },
  {
    id: 'usecallback-hook',
    title: 'useCallback Hook',
    description: 'Memoize functions to prevent unnecessary re-renders',
    estimatedTime: '40 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['usememo-hook'],
    xpReward: 145
  },
  {
    id: 'usereducer-hook',
    title: 'useReducer Hook',
    description: 'Manage complex state logic with useReducer',
    estimatedTime: '55 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['usecallback-hook'],
    xpReward: 165
  },
  {
    id: 'context-api',
    title: 'Context API - Global State',
    description: 'Implement global state management without Redux',
    estimatedTime: '60 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['usereducer-hook'],
    xpReward: 170
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks - Reusable Logic',
    description: 'Create reusable stateful logic with custom hooks',
    estimatedTime: '55 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['context-api'],
    xpReward: 165
  },
  {
    id: 'react-router',
    title: 'React Router (v6+) - Client-side Routing',
    description: 'Build single-page applications with navigation',
    estimatedTime: '70 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['custom-hooks'],
    xpReward: 180
  },
  {
    id: 'react-forms-advanced',
    title: 'Advanced React Forms',
    description: 'Complex form handling with validation and libraries',
    estimatedTime: '65 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['react-router'],
    xpReward: 175
  },
  {
    id: 'react-hook-form',
    title: 'React Hook Form Library',
    description: 'Efficient form handling with react-hook-form',
    estimatedTime: '50 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['react-forms-advanced'],
    xpReward: 160
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Optimize React apps with memoization and best practices',
    estimatedTime: '60 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['react-hook-form'],
    xpReward: 170
  },
  {
    id: 'error-boundaries',
    title: 'Error Boundaries',
    description: 'Handle errors gracefully in React applications',
    estimatedTime: '45 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['performance-optimization'],
    xpReward: 155
  },
  {
    id: 'portals',
    title: 'React Portals',
    description: 'Render components outside the normal DOM hierarchy',
    estimatedTime: '40 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['error-boundaries'],
    xpReward: 145
  },
  {
    id: 'forward-refs',
    title: 'Forward Refs',
    description: 'Pass refs through components to child elements',
    estimatedTime: '35 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['portals'],
    xpReward: 140
  },
  {
    id: 'lazy-loading',
    title: 'Lazy Loading and Code Splitting',
    description: 'Optimize bundle size with dynamic imports',
    estimatedTime: '50 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['forward-refs'],
    xpReward: 160
  },
  {
    id: 'suspense-concurrent',
    title: 'Suspense and Concurrent Features',
    description: 'Handle async operations with Suspense',
    estimatedTime: '55 min',
    difficulty: 'intermediate',
    category: 'intermediate',
    prerequisites: ['lazy-loading'],
    xpReward: 165
  },

  // ===== ADVANCED (Topics 29-43) =====
  {
    id: 'redux-toolkit',
    title: 'Redux Toolkit - State Management',
    description: 'Advanced state management with Redux Toolkit',
    estimatedTime: '80 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['suspense-concurrent'],
    xpReward: 200
  },
  {
    id: 'zustand-state',
    title: 'Zustand - Lightweight State Management',
    description: 'Simple state management with Zustand',
    estimatedTime: '45 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['redux-toolkit'],
    xpReward: 155
  },
  {
    id: 'jotai-recoil',
    title: 'Jotai & Recoil - Atomic State Management',
    description: 'Atomic state management patterns',
    estimatedTime: '60 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['zustand-state'],
    xpReward: 170
  },
  {
    id: 'react-memo-optimization',
    title: 'React.memo and Advanced Memoization',
    description: 'Advanced performance optimization techniques',
    estimatedTime: '50 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['jotai-recoil'],
    xpReward: 160
  },
  {
    id: 'testing-react-components',
    title: 'Testing React Components',
    description: 'Comprehensive testing with Jest and React Testing Library',
    estimatedTime: '75 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['react-memo-optimization'],
    xpReward: 185
  },
  {
    id: 'nextjs-ssr',
    title: 'Next.js - Server-Side Rendering',
    description: 'Build SSR applications with Next.js',
    estimatedTime: '90 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['testing-react-components'],
    xpReward: 210
  },
  {
    id: 'nextjs-ssg',
    title: 'Next.js - Static Site Generation',
    description: 'Generate static sites with Next.js',
    estimatedTime: '70 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['nextjs-ssr'],
    xpReward: 180
  },
  {
    id: 'gatsby-ssg',
    title: 'Gatsby - Static Site Generation',
    description: 'Build static sites with Gatsby',
    estimatedTime: '65 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['nextjs-ssg'],
    xpReward: 175
  },
  {
    id: 'react-native-basics',
    title: 'React Native Basics',
    description: 'Mobile development with React Native',
    estimatedTime: '85 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['gatsby-ssg'],
    xpReward: 195
  },
  {
    id: 'graphql-react',
    title: 'GraphQL with React',
    description: 'Integrate GraphQL APIs with React applications',
    estimatedTime: '70 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['react-native-basics'],
    xpReward: 180
  },
  {
    id: 'typescript-react',
    title: 'TypeScript with React',
    description: 'Type-safe React development with TypeScript',
    estimatedTime: '80 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['graphql-react'],
    xpReward: 190
  },
  {
    id: 'react-patterns',
    title: 'Advanced React Patterns',
    description: 'Render props, HOCs, and compound components',
    estimatedTime: '75 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['typescript-react'],
    xpReward: 185
  },
  {
    id: 'micro-frontends',
    title: 'Micro-frontends with React',
    description: 'Build scalable applications with micro-frontend architecture',
    estimatedTime: '90 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['react-patterns'],
    xpReward: 210
  },
  {
    id: 'react-deployment',
    title: 'React Deployment & Production',
    description: 'Deploy React applications to production environments',
    estimatedTime: '60 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['micro-frontends'],
    xpReward: 170
  },
  {
    id: 'react-security',
    title: 'React Security Best Practices',
    description: 'Secure React applications against common vulnerabilities',
    estimatedTime: '55 min',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['react-deployment'],
    xpReward: 165
  }
];

// Calculate totals
export const topicStats = {
  total: all43ReactTopicsIndex.length,
  fundamentals: all43ReactTopicsIndex.filter(t => t.category === 'fundamentals').length,
  intermediate: all43ReactTopicsIndex.filter(t => t.category === 'intermediate').length,
  advanced: all43ReactTopicsIndex.filter(t => t.category === 'advanced').length,
  totalTime: all43ReactTopicsIndex.reduce((total, topic) => {
    const minutes = parseInt(topic.estimatedTime);
    return total + minutes;
  }, 0),
  totalXP: all43ReactTopicsIndex.reduce((total, topic) => total + topic.xpReward, 0)
};

export const categoryBreakdown = {
  fundamentals: {
    count: topicStats.fundamentals,
    topics: all43ReactTopicsIndex.filter(t => t.category === 'fundamentals')
  },
  intermediate: {
    count: topicStats.intermediate,
    topics: all43ReactTopicsIndex.filter(t => t.category === 'intermediate')
  },
  advanced: {
    count: topicStats.advanced,
    topics: all43ReactTopicsIndex.filter(t => t.category === 'advanced')
  }
};
