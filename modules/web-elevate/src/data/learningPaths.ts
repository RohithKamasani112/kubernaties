import { all43ReactTopicsIndex, topicStats, categoryBreakdown } from './reactTopicsIndex43';

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
  id: 'react-mastery',
  title: 'React Mastery Path',
  description: `Complete React mastery from beginner to expert! All ${topicStats.total} topics covering fundamentals (${categoryBreakdown.fundamentals.count}), intermediate (${categoryBreakdown.intermediate.count}), and advanced (${categoryBreakdown.advanced.count}) concepts. ${Math.round(topicStats.totalTime / 60)} hours of comprehensive learning with ${topicStats.totalXP.toLocaleString()} XP rewards.`,
  totalTopics: topicStats.total,
  estimatedHours: Math.round(topicStats.totalTime / 60),
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
  topics: all43ReactTopicsIndex.map(topic => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    explanation: `${topic.description}\n\nThis ${topic.difficulty} level topic is part of the ${topic.category} category and offers ${topic.xpReward} XP upon completion.`,
    animationScript: `Interactive learning experience for ${topic.title}`,
    scenario: `🧩 Master ${topic.title} through hands-on practice and real-world examples.`,
    challenges: [
      {
        id: `${topic.id}-challenge`,
        title: `${topic.title} Challenge`,
        description: `Complete interactive exercises for ${topic.title}`,
        type: 'playground' as const,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime,
        xpReward: topic.xpReward,
        code: {
          initial: `// ${topic.title} - Interactive Challenge\n// Complete the implementation below\n\nimport React from 'react';\n\nfunction ${topic.title.replace(/[^a-zA-Z0-9]/g, '')}Demo() {\n  return (\n    <div>\n      <h1>${topic.title}</h1>\n      {/* Your implementation here */}\n    </div>\n  );\n}\n\nexport default ${topic.title.replace(/[^a-zA-Z0-9]/g, '')}Demo;`,
          solution: `// ${topic.title} - Complete Solution\nimport React from 'react';\n\nfunction ${topic.title.replace(/[^a-zA-Z0-9]/g, '')}Demo() {\n  return (\n    <div style={{ padding: '20px' }}>\n      <h1>${topic.title}</h1>\n      <p>${topic.description}</p>\n      <div style={{ \n        padding: '15px', \n        backgroundColor: '#f8f9fa', \n        borderRadius: '8px',\n        border: '1px solid #dee2e6'\n      }}>\n        <h3>✅ Implementation Complete!</h3>\n        <p>This is a working example of ${topic.title}.</p>\n        <p><strong>Difficulty:</strong> ${topic.difficulty}</p>\n        <p><strong>XP Earned:</strong> ${topic.xpReward}</p>\n      </div>\n    </div>\n  );\n}\n\nexport default ${topic.title.replace(/[^a-zA-Z0-9]/g, '')}Demo;`
        },
        hints: [
          `Focus on ${topic.title} fundamentals`,
          'Follow React best practices',
          'Test your implementation thoroughly',
          'Consider performance implications'
        ]
      }
    ],
    estimatedTime: topic.estimatedTime,
    difficulty: topic.difficulty,
    prerequisites: topic.prerequisites,
    nextTopics: [],
    category: topic.category
  }))
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
    'Understanding of component-based architecture'
  ],
  learningOutcomes: [
    'Build complete Angular applications',
    'Master Angular CLI and project structure',
    'Implement routing and navigation',
    'Handle forms and validation',
    'Work with services and dependency injection'
  ],
  topics: [
    {
      id: 'angular-setup',
      title: 'Angular Setup & CLI',
      description: 'Learn to set up Angular development environment',
      explanation: 'Angular CLI is the official tool for creating and managing Angular projects. It provides scaffolding, build tools, and development server.',
      animationScript: 'Command line → ng new → project structure appears → ng serve → browser opens',
      scenario: 'Set up your first Angular project and understand the project structure',
      challenges: [
        {
          id: 'first-angular-app',
          title: 'Create Your First Angular App',
          description: 'Set up Angular CLI and create a basic application',
          type: 'challenge',
          difficulty: 'beginner',
          estimatedTime: '30 min',
          xpReward: 100,
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
