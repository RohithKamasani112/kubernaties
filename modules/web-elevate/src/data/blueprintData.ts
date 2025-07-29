import { Blueprint, BlueprintCategory } from './blueprintTypes';

// Blueprint Categories
export const blueprintCategories: BlueprintCategory[] = [
  {
    id: 'fullstack-apps',
    name: 'Full-Stack Applications',
    description: 'Complete web applications with frontend, backend, and database',
    icon: '🌐',
    color: 'blue',
    blueprints: ['kanban-board', 'blog-platform', 'ecommerce-app'],
    order: 1
  },
  {
    id: 'frontend-projects',
    name: 'Frontend Projects',
    description: 'Modern frontend applications and user interfaces',
    icon: '🎨',
    color: 'purple',
    blueprints: ['responsive-landing', 'dashboard-ui', 'pwa-app'],
    order: 2
  },
  {
    id: 'backend-apis',
    name: 'Backend & APIs',
    description: 'Server-side applications and API development',
    icon: '⚙️',
    color: 'green',
    blueprints: ['rest-api', 'graphql-api', 'microservices'],
    order: 3
  },
  {
    id: 'devops-deployment',
    name: 'DevOps & Deployment',
    description: 'CI/CD pipelines, containerization, and cloud deployment',
    icon: '🚀',
    color: 'orange',
    blueprints: ['cicd-pipeline', 'docker-deployment', 'aws-hosting'],
    order: 4
  }
];

// Sample Blueprint: Real-time Kanban Board
export const kanbanBoardBlueprint: Blueprint = {
  id: 'kanban-board',
  title: 'Real-time Kanban Board',
  description: 'Build a collaborative project management tool with drag-and-drop functionality, real-time updates, and user authentication.',
  category: 'fullstack',
  difficulty: 'intermediate',
  tags: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT', 'Drag & Drop'],
  technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Tailwind CSS'],
  estimatedDuration: '3-4 weeks',
  totalXP: 2500,
  
  architecture: {
    id: 'kanban-arch',
    title: 'Kanban Board Architecture',
    description: 'Full-stack architecture with real-time communication',
    mermaidDiagram: `
graph TB
    A[React Frontend] --> B[Express API]
    A --> C[Socket.io Client]
    B --> D[MongoDB Database]
    B --> E[JWT Auth]
    C --> F[Socket.io Server]
    F --> B
    B --> G[File Upload Service]
    G --> H[Cloud Storage]
    `,
    components: [
      {
        name: 'React Frontend',
        type: 'frontend',
        description: 'User interface with drag-and-drop kanban board',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'React DnD']
      },
      {
        name: 'Express API',
        type: 'backend',
        description: 'RESTful API for CRUD operations',
        technologies: ['Node.js', 'Express', 'JWT', 'bcrypt']
      },
      {
        name: 'MongoDB Database',
        type: 'database',
        description: 'Document database for storing boards, tasks, and users',
        technologies: ['MongoDB', 'Mongoose']
      },
      {
        name: 'Socket.io Server',
        type: 'backend',
        description: 'Real-time communication for live updates',
        technologies: ['Socket.io', 'Redis']
      }
    ],
    dataFlow: [
      {
        from: 'React Frontend',
        to: 'Express API',
        description: 'HTTP requests for CRUD operations',
        protocol: 'HTTP/REST'
      },
      {
        from: 'React Frontend',
        to: 'Socket.io Server',
        description: 'Real-time events for live updates',
        protocol: 'WebSocket'
      },
      {
        from: 'Express API',
        to: 'MongoDB Database',
        description: 'Database queries and updates',
        protocol: 'MongoDB Protocol'
      }
    ]
  },
  
  dataModels: [
    {
      id: 'user-model',
      name: 'User',
      description: 'User account information',
      fields: [
        { name: 'id', type: 'ObjectId', required: true, description: 'Unique identifier' },
        { name: 'username', type: 'String', required: true, description: 'Unique username' },
        { name: 'email', type: 'String', required: true, description: 'User email address' },
        { name: 'password', type: 'String', required: true, description: 'Hashed password' },
        { name: 'avatarUrl', type: 'String', required: false, description: 'Profile picture URL' },
        { name: 'role', type: 'String', required: true, description: 'User role (admin, member)' }
      ],
      relationships: [
        { type: 'oneToMany', target: 'Board', description: 'User can own multiple boards' },
        { type: 'manyToMany', target: 'Board', description: 'User can be member of multiple boards' }
      ],
      example: {
        username: 'john_doe',
        email: 'john@example.com',
        password: '$2b$10$...',
        role: 'member'
      }
    },
    {
      id: 'board-model',
      name: 'Board',
      description: 'Kanban board containing columns and tasks',
      fields: [
        { name: 'id', type: 'ObjectId', required: true, description: 'Unique identifier' },
        { name: 'title', type: 'String', required: true, description: 'Board title' },
        { name: 'description', type: 'String', required: false, description: 'Board description' },
        { name: 'ownerId', type: 'ObjectId', required: true, description: 'Board owner reference' },
        { name: 'members', type: 'Array<ObjectId>', required: false, description: 'Board members' },
        { name: 'columns', type: 'Array<ObjectId>', required: false, description: 'Board columns' }
      ],
      relationships: [
        { type: 'oneToMany', target: 'Column', description: 'Board contains multiple columns' },
        { type: 'manyToMany', target: 'User', description: 'Board can have multiple members' }
      ],
      example: {
        title: 'Project Alpha',
        description: 'Main project board',
        ownerId: '507f1f77bcf86cd799439011'
      }
    }
  ],
  
  milestones: [
    {
      id: 'setup-milestone',
      title: 'Project Setup & Environment',
      description: 'Initialize the project structure and development environment',
      userStory: 'As a developer, I want to set up the project structure so I can start building the application.',
      phase: 'planning',
      order: 1,
      estimatedTime: 4,
      xpReward: 200,
      keyConcepts: ['Project Structure', 'Package Management', 'Environment Variables', 'Git Workflow'],
      deliverables: ['Project repository', 'Development environment', 'Basic folder structure'],
      completionCriteria: [
        'Frontend and backend projects are initialized',
        'All dependencies are installed',
        'Development servers can start successfully',
        'Git repository is set up with initial commit'
      ],
      tasks: [
        {
          id: 'init-frontend',
          title: 'Initialize React Frontend',
          description: 'Create a new React application with TypeScript and Tailwind CSS',
          type: 'setup',
          completed: false,
          optional: false,
          estimatedTime: 30,
          dependencies: [],
          hints: [
            'Use Create React App with TypeScript template',
            'Install Tailwind CSS following the official guide',
            'Remove default boilerplate code'
          ],
          learningObjectives: [
            'Understanding React project structure',
            'Setting up TypeScript in React',
            'Configuring Tailwind CSS'
          ],
          validationCriteria: [
            'React app starts without errors',
            'TypeScript compilation works',
            'Tailwind CSS is properly configured'
          ]
        },
        {
          id: 'init-backend',
          title: 'Initialize Express Backend',
          description: 'Set up Node.js backend with Express, TypeScript, and essential middleware',
          type: 'setup',
          completed: false,
          optional: false,
          estimatedTime: 45,
          dependencies: [],
          hints: [
            'Initialize npm project with TypeScript',
            'Install Express, cors, helmet, and other middleware',
            'Set up basic server structure'
          ],
          learningObjectives: [
            'Node.js project initialization',
            'Express server setup',
            'TypeScript configuration for Node.js'
          ],
          validationCriteria: [
            'Express server starts on specified port',
            'Basic middleware is configured',
            'TypeScript compilation works for backend'
          ]
        }
      ]
    }
  ],
  
  testSuites: [],
  deployment: {
    id: 'kanban-deployment',
    title: 'Production Deployment',
    description: 'Deploy the application to production environment',
    platform: 'vercel',
    steps: [],
    verificationSteps: []
  },
  
  prerequisites: [
    'Basic knowledge of JavaScript/TypeScript',
    'Understanding of React fundamentals',
    'Basic Node.js and Express knowledge',
    'Familiarity with Git version control'
  ],
  
  learningResources: [
    {
      type: 'documentation',
      title: 'React Documentation',
      url: 'https://react.dev',
      description: 'Official React documentation and guides'
    },
    {
      type: 'documentation',
      title: 'Express.js Guide',
      url: 'https://expressjs.com',
      description: 'Express.js official documentation'
    }
  ],
  
  initialFiles: {
    'frontend/src/App.tsx': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-8">
        Kanban Board
      </h1>
    </div>
  );
}

export default App;`,
    'backend/src/server.ts': `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
  },
  
  packageDependencies: {
    frontend: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'typescript': '^4.9.5',
      '@types/react': '^18.0.28',
      '@types/react-dom': '^18.0.11',
      'tailwindcss': '^3.3.0'
    },
    backend: {
      'express': '^4.18.2',
      'cors': '^2.8.5',
      'helmet': '^6.1.5',
      'mongoose': '^7.0.3',
      'jsonwebtoken': '^9.0.0',
      'bcryptjs': '^2.4.3',
      'socket.io': '^4.6.1'
    }
  },
  
  environmentVariables: [
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'PORT'
  ],
  
  portfolioTemplate: 'A collaborative Kanban board application with real-time updates...',
  certificateTemplate: 'Certificate of completion for Real-time Kanban Board project...',
  showcaseRequirements: [
    'Live demo URL',
    'GitHub repository with clean code',
    'README with setup instructions',
    'Screenshots of key features'
  ]
};

// Additional Blueprint Examples
export const userRegistrationBlueprint: Blueprint = {
  id: 'user-registration',
  title: 'Secure User Registration System',
  description: 'Build a complete user authentication system with secure registration, login, and profile management.',
  category: 'backend',
  difficulty: 'beginner',
  tags: ['Node.js', 'Express', 'JWT', 'bcrypt', 'MongoDB', 'Authentication'],
  technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'bcrypt', 'React'],
  estimatedDuration: '1-2 weeks',
  totalXP: 1500,

  architecture: {
    id: 'auth-arch',
    title: 'Authentication System Architecture',
    description: 'Secure user authentication with JWT tokens',
    mermaidDiagram: `
graph TB
    A[React Frontend] --> B[Express API]
    B --> C[JWT Middleware]
    B --> D[bcrypt Password Hashing]
    B --> E[MongoDB Database]
    C --> F[Protected Routes]
    `,
    components: [
      {
        name: 'Express API',
        type: 'backend',
        description: 'RESTful API with authentication endpoints',
        technologies: ['Express', 'JWT', 'bcrypt']
      },
      {
        name: 'MongoDB Database',
        type: 'database',
        description: 'User data storage with secure password hashing',
        technologies: ['MongoDB', 'Mongoose']
      }
    ],
    dataFlow: []
  },

  dataModels: [
    {
      id: 'user-auth-model',
      name: 'User',
      description: 'User authentication and profile data',
      fields: [
        { name: 'username', type: 'String', required: true, description: 'Unique username' },
        { name: 'email', type: 'String', required: true, description: 'User email (unique)' },
        { name: 'password', type: 'String', required: true, description: 'Hashed password' },
        { name: 'role', type: 'String', required: true, description: 'User role (admin, member)' }
      ],
      relationships: [],
      example: {
        username: 'john_doe',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        role: 'member'
      }
    }
  ],

  milestones: [
    {
      id: 'auth-setup',
      title: 'Authentication Setup',
      description: 'Set up the basic authentication system',
      userStory: 'As a new user, I want to sign up with my email and password so that I can have a personal account.',
      phase: 'development',
      order: 1,
      estimatedTime: 8,
      xpReward: 500,
      keyConcepts: ['Password Hashing', 'JWT Tokens', 'API Security', 'Database Validation'],
      deliverables: ['User registration endpoint', 'Login endpoint', 'Password hashing'],
      completionCriteria: [
        'Users can register with email and password',
        'Passwords are securely hashed',
        'JWT tokens are generated on login',
        'Registration validates unique emails'
      ],
      tasks: [
        {
          id: 'create-user-model',
          title: 'Create User Model',
          description: 'Define the User schema with username, email, and password fields',
          type: 'backend',
          completed: false,
          optional: false,
          estimatedTime: 30,
          dependencies: [],
          hints: [
            'Use Mongoose schema with validation',
            'Make email field unique',
            'Add password field with minimum length'
          ],
          learningObjectives: [
            'Database schema design',
            'Mongoose validation',
            'Unique constraints'
          ],
          validationCriteria: [
            'User model has required fields',
            'Email field has unique constraint',
            'Password field has validation'
          ]
        }
      ]
    }
  ],

  testSuites: [],
  deployment: {
    id: 'auth-deployment',
    title: 'Authentication System Deployment',
    description: 'Deploy the authentication system',
    platform: 'heroku',
    steps: [],
    verificationSteps: []
  },

  prerequisites: [
    'Basic JavaScript knowledge',
    'Understanding of HTTP requests',
    'Basic database concepts'
  ],

  learningResources: [
    {
      type: 'documentation',
      title: 'JWT.io Documentation',
      url: 'https://jwt.io',
      description: 'Learn about JSON Web Tokens'
    }
  ],

  initialFiles: {
    'backend/models/User.js': `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);`
  },

  packageDependencies: {
    frontend: {
      'react': '^18.2.0',
      'axios': '^1.3.0'
    },
    backend: {
      'express': '^4.18.2',
      'mongoose': '^7.0.3',
      'bcryptjs': '^2.4.3',
      'jsonwebtoken': '^9.0.0',
      'cors': '^2.8.5'
    }
  },

  environmentVariables: [
    'MONGODB_URI',
    'JWT_SECRET',
    'NODE_ENV'
  ],

  portfolioTemplate: 'A secure user authentication system with registration and login...',
  certificateTemplate: 'Certificate of completion for User Authentication System...',
  showcaseRequirements: [
    'Working registration and login',
    'Secure password hashing',
    'JWT token implementation',
    'API documentation'
  ]
};

// Real-time Notifications Blueprint
export const realTimeNotificationsBlueprint: Blueprint = {
  id: 'real-time-notifications',
  title: 'Real-time Notification System',
  description: 'Build a comprehensive notification system with WebSocket connections, push notifications, and real-time updates.',
  category: 'fullstack',
  difficulty: 'intermediate',
  tags: ['WebSocket', 'Socket.io', 'Push Notifications', 'Real-time', 'Node.js', 'React'],
  technologies: ['Node.js', 'Socket.io', 'React', 'MongoDB', 'Service Workers'],
  estimatedDuration: '2-3 weeks',
  totalXP: 2500,

  architecture: {
    id: 'notification-arch',
    title: 'Real-time Notification Architecture',
    description: 'WebSocket-based notification system with push notifications',
    mermaidDiagram: `
graph TB
    A[React Frontend] --> B[Socket.io Client]
    B --> C[Socket.io Server]
    C --> D[Notification Service]
    D --> E[MongoDB Database]
    D --> F[Push Notification Service]
    F --> G[Service Worker]
    G --> H[Browser Notifications]
    `,
    components: [
      {
        name: 'Socket.io Server',
        type: 'backend',
        description: 'Real-time WebSocket server for instant notifications',
        technologies: ['Socket.io', 'Node.js']
      },
      {
        name: 'Notification Service',
        type: 'backend',
        description: 'Manages notification logic and delivery',
        technologies: ['Node.js', 'MongoDB']
      }
    ],
    dataFlow: []
  },

  dataModels: [
    {
      id: 'notification-model',
      name: 'Notification',
      description: 'Notification data structure',
      fields: [
        { name: 'id', type: 'String', required: true, description: 'Unique notification ID' },
        { name: 'userId', type: 'String', required: true, description: 'Target user ID' },
        { name: 'title', type: 'String', required: true, description: 'Notification title' },
        { name: 'message', type: 'String', required: true, description: 'Notification content' },
        { name: 'type', type: 'String', required: true, description: 'Notification type (info, warning, error)' },
        { name: 'read', type: 'Boolean', required: true, description: 'Read status' },
        { name: 'createdAt', type: 'Date', required: true, description: 'Creation timestamp' }
      ],
      relationships: [],
      example: {
        id: 'notif_123',
        userId: 'user_456',
        title: 'New Message',
        message: 'You have received a new message',
        type: 'info',
        read: false,
        createdAt: new Date()
      }
    }
  ],

  milestones: [
    {
      id: 'websocket-setup',
      title: 'WebSocket Setup',
      description: 'Set up Socket.io server and client connections',
      userStory: 'As a user, I want to receive real-time notifications so that I stay updated instantly.',
      phase: 'development',
      order: 1,
      estimatedTime: 12,
      xpReward: 800,
      keyConcepts: ['WebSocket', 'Socket.io', 'Real-time Communication', 'Event Handling'],
      deliverables: ['Socket.io server setup', 'Client connection', 'Basic event handling'],
      completionCriteria: [
        'Socket.io server is running',
        'Client can connect to server',
        'Basic events are working',
        'Connection status is displayed'
      ],
      tasks: [
        {
          id: 'setup-socketio-server',
          title: 'Setup Socket.io Server',
          description: 'Create Socket.io server with connection handling',
          type: 'backend',
          completed: false,
          optional: false,
          estimatedTime: 45,
          dependencies: [],
          hints: [
            'Install socket.io package',
            'Create server instance with Express',
            'Handle connection and disconnection events'
          ],
          learningObjectives: [
            'WebSocket fundamentals',
            'Socket.io server setup',
            'Event-driven architecture'
          ],
          validationCriteria: [
            'Socket.io server is configured',
            'Connection events are handled',
            'Server logs connections'
          ]
        }
      ]
    }
  ],

  testSuites: [],
  deployment: {
    id: 'notification-deployment',
    title: 'Notification System Deployment',
    description: 'Deploy the real-time notification system',
    platform: 'heroku',
    steps: [],
    verificationSteps: []
  },

  prerequisites: [
    'JavaScript ES6+ knowledge',
    'Basic React understanding',
    'Node.js fundamentals',
    'Understanding of WebSocket concepts'
  ],

  learningResources: [
    {
      type: 'documentation',
      title: 'Socket.io Documentation',
      url: 'https://socket.io/docs/',
      description: 'Official Socket.io documentation'
    }
  ],

  initialFiles: {
    'backend/server.js': `const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
  },

  packageDependencies: {
    frontend: {
      'react': '^18.2.0',
      'socket.io-client': '^4.6.0'
    },
    backend: {
      'express': '^4.18.2',
      'socket.io': '^4.6.0',
      'cors': '^2.8.5'
    }
  },

  environmentVariables: [
    'PORT',
    'MONGODB_URI',
    'NOTIFICATION_SECRET'
  ],

  portfolioTemplate: 'A real-time notification system with WebSocket connections...',
  certificateTemplate: 'Certificate of completion for Real-time Notification System...',
  showcaseRequirements: [
    'Working WebSocket connections',
    'Real-time notification delivery',
    'Push notification support',
    'Notification management UI'
  ]
};

// File Upload System Blueprint
export const fileUploadBlueprint: Blueprint = {
  id: 'file-upload-system',
  title: 'Advanced File Upload System',
  description: 'Build a robust file upload system with drag-and-drop, progress tracking, cloud storage integration, and file management.',
  category: 'fullstack',
  difficulty: 'intermediate',
  tags: ['File Upload', 'Cloud Storage', 'Drag & Drop', 'Progress Tracking', 'AWS S3', 'Multer'],
  technologies: ['Node.js', 'Express', 'React', 'AWS S3', 'Multer', 'MongoDB'],
  estimatedDuration: '2-3 weeks',
  totalXP: 2200,

  architecture: {
    id: 'file-upload-arch',
    title: 'File Upload System Architecture',
    description: 'Scalable file upload with cloud storage integration',
    mermaidDiagram: `
graph TB
    A[React Frontend] --> B[File Upload Component]
    B --> C[Express API]
    C --> D[Multer Middleware]
    D --> E[AWS S3 Storage]
    C --> F[MongoDB Database]
    F --> G[File Metadata]
    `,
    components: [
      {
        name: 'File Upload API',
        type: 'backend',
        description: 'RESTful API for file upload and management',
        technologies: ['Express', 'Multer', 'AWS SDK']
      },
      {
        name: 'Cloud Storage',
        type: 'storage',
        description: 'AWS S3 bucket for file storage',
        technologies: ['AWS S3']
      }
    ],
    dataFlow: []
  },

  dataModels: [
    {
      id: 'file-model',
      name: 'File',
      description: 'File metadata and storage information',
      fields: [
        { name: 'filename', type: 'String', required: true, description: 'Original filename' },
        { name: 'mimetype', type: 'String', required: true, description: 'File MIME type' },
        { name: 'size', type: 'Number', required: true, description: 'File size in bytes' },
        { name: 'url', type: 'String', required: true, description: 'File access URL' },
        { name: 'uploadedBy', type: 'String', required: true, description: 'User who uploaded the file' },
        { name: 'uploadedAt', type: 'Date', required: true, description: 'Upload timestamp' }
      ],
      relationships: [],
      example: {
        filename: 'document.pdf',
        mimetype: 'application/pdf',
        size: 1024000,
        url: 'https://bucket.s3.amazonaws.com/files/document.pdf',
        uploadedBy: 'user_123',
        uploadedAt: new Date()
      }
    }
  ],

  milestones: [
    {
      id: 'basic-upload',
      title: 'Basic File Upload',
      description: 'Implement basic file upload functionality',
      userStory: 'As a user, I want to upload files easily so that I can store and share documents.',
      phase: 'development',
      order: 1,
      estimatedTime: 10,
      xpReward: 700,
      keyConcepts: ['File Handling', 'Multer Middleware', 'Form Data', 'File Validation'],
      deliverables: ['File upload endpoint', 'Basic upload form', 'File validation'],
      completionCriteria: [
        'Users can upload files',
        'File types are validated',
        'File size limits are enforced',
        'Upload progress is shown'
      ],
      tasks: [
        {
          id: 'setup-multer',
          title: 'Setup Multer Middleware',
          description: 'Configure Multer for handling file uploads',
          type: 'backend',
          completed: false,
          optional: false,
          estimatedTime: 30,
          dependencies: [],
          hints: [
            'Install multer package',
            'Configure storage destination',
            'Add file filtering'
          ],
          learningObjectives: [
            'File upload handling',
            'Middleware configuration',
            'File validation'
          ],
          validationCriteria: [
            'Multer is configured',
            'File uploads work',
            'File validation is active'
          ]
        }
      ]
    }
  ],

  testSuites: [],
  deployment: {
    id: 'file-upload-deployment',
    title: 'File Upload System Deployment',
    description: 'Deploy the file upload system with cloud storage',
    platform: 'aws',
    steps: [],
    verificationSteps: []
  },

  prerequisites: [
    'Node.js and Express knowledge',
    'React fundamentals',
    'Basic AWS understanding',
    'File handling concepts'
  ],

  learningResources: [
    {
      type: 'documentation',
      title: 'AWS S3 Documentation',
      url: 'https://docs.aws.amazon.com/s3/',
      description: 'AWS S3 storage documentation'
    }
  ],

  initialFiles: {
    'backend/routes/upload.js': `const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const router = express.Router();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation here
    cb(null, true);
  }
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: \`uploads/\${Date.now()}-\${file.originalname}\`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const result = await s3.upload(uploadParams).promise();

    res.json({
      message: 'File uploaded successfully',
      url: result.Location,
      filename: file.originalname,
      size: file.size
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;`
  },

  packageDependencies: {
    frontend: {
      'react': '^18.2.0',
      'react-dropzone': '^14.2.0'
    },
    backend: {
      'express': '^4.18.2',
      'multer': '^1.4.5',
      'aws-sdk': '^2.1300.0'
    }
  },

  environmentVariables: [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'S3_BUCKET_NAME'
  ],

  portfolioTemplate: 'An advanced file upload system with cloud storage integration...',
  certificateTemplate: 'Certificate of completion for File Upload System...',
  showcaseRequirements: [
    'Working file upload with progress',
    'Cloud storage integration',
    'File management interface',
    'Drag and drop functionality'
  ]
};

// E-commerce REST API Blueprint
export const ecommerceApiBlueprint: Blueprint = {
  id: 'ecommerce-api',
  title: 'E-commerce REST API',
  description: 'Build a scalable backend API for an online store with products, orders, payments, and inventory management.',
  category: 'backend',
  difficulty: 'advanced',
  tags: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Redis'],
  estimatedTime: '20-25 hours',
  prerequisites: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
  learningObjectives: [
    'Design RESTful API architecture',
    'Implement authentication and authorization',
    'Handle payment processing with Stripe',
    'Manage inventory and orders',
    'Implement caching with Redis'
  ],
  architecture: {
    overview: 'Microservices-based e-commerce API with separate services for products, orders, payments, and users.',
    components: [
      { name: 'API Gateway', type: 'service', description: 'Routes requests to appropriate microservices' },
      { name: 'User Service', type: 'service', description: 'Handles user authentication and profiles' },
      { name: 'Product Service', type: 'service', description: 'Manages product catalog and inventory' },
      { name: 'Order Service', type: 'service', description: 'Processes orders and manages order lifecycle' },
      { name: 'Payment Service', type: 'service', description: 'Handles payment processing with Stripe' }
    ],
    technologies: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Stripe API', 'JWT']
  },
  dataModels: [
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'email', type: 'String', required: true },
        { name: 'password', type: 'String', required: true },
        { name: 'profile', type: 'Object', required: false }
      ]
    },
    {
      name: 'Product',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'name', type: 'String', required: true },
        { name: 'price', type: 'Number', required: true },
        { name: 'inventory', type: 'Number', required: true }
      ]
    }
  ],
  milestones: [
    {
      id: 'setup-project',
      title: 'Project Setup',
      description: 'Initialize the project structure and basic configuration',
      order: 1,
      estimatedTime: '2 hours',
      tasks: [
        {
          id: 'init-project',
          title: 'Initialize Node.js project',
          description: 'Set up package.json and install dependencies',
          type: 'setup',
          completed: false,
          validationCriteria: ['package.json exists', 'Dependencies installed']
        }
      ],
      deliverables: ['Project structure', 'Basic server setup'],
      validationCriteria: ['Server starts successfully', 'Basic routes respond']
    }
  ],
  resources: {
    documentation: ['Express.js Docs', 'MongoDB Docs', 'Stripe API Docs'],
    tutorials: ['Building REST APIs', 'Payment Integration'],
    examples: ['Sample API responses', 'Database schemas']
  }
};

// Data Dashboard Blueprint
export const dataDashboardBlueprint: Blueprint = {
  id: 'data-dashboard',
  title: 'Real-time Data Dashboard',
  description: 'Create an interactive analytics dashboard with charts, real-time updates, and data visualization.',
  category: 'frontend',
  difficulty: 'intermediate',
  tags: ['React', 'D3.js', 'Chart.js', 'WebSocket', 'TypeScript'],
  estimatedTime: '15-20 hours',
  prerequisites: ['React', 'JavaScript', 'CSS'],
  learningObjectives: [
    'Build interactive data visualizations',
    'Implement real-time data updates',
    'Create responsive dashboard layouts',
    'Handle large datasets efficiently'
  ],
  architecture: {
    overview: 'React-based dashboard with real-time data visualization and interactive charts.',
    components: [
      { name: 'Dashboard Layout', type: 'component', description: 'Main dashboard container with grid layout' },
      { name: 'Chart Components', type: 'component', description: 'Reusable chart components for different data types' },
      { name: 'Data Service', type: 'service', description: 'Handles data fetching and WebSocket connections' },
      { name: 'Filter Panel', type: 'component', description: 'Interactive filters for data exploration' }
    ],
    technologies: ['React', 'TypeScript', 'D3.js', 'Chart.js', 'WebSocket']
  },
  dataModels: [
    {
      name: 'MetricData',
      fields: [
        { name: 'timestamp', type: 'Date', required: true },
        { name: 'value', type: 'Number', required: true },
        { name: 'category', type: 'String', required: true }
      ]
    }
  ],
  milestones: [
    {
      id: 'setup-dashboard',
      title: 'Dashboard Setup',
      description: 'Create the basic dashboard layout and structure',
      order: 1,
      estimatedTime: '3 hours',
      tasks: [
        {
          id: 'create-layout',
          title: 'Create dashboard layout',
          description: 'Build responsive grid layout for dashboard components',
          type: 'implementation',
          completed: false,
          validationCriteria: ['Layout is responsive', 'Grid system works']
        }
      ],
      deliverables: ['Dashboard layout', 'Basic navigation'],
      validationCriteria: ['Dashboard renders correctly', 'Layout is responsive']
    }
  ],
  resources: {
    documentation: ['React Docs', 'D3.js Docs', 'Chart.js Docs'],
    tutorials: ['Data Visualization', 'Real-time Updates'],
    examples: ['Dashboard layouts', 'Chart examples']
  }
};

// Export all blueprints
export const allBlueprints: Blueprint[] = [
  kanbanBoardBlueprint,
  userRegistrationBlueprint,
  realTimeNotificationsBlueprint,
  fileUploadBlueprint,
  ecommerceApiBlueprint,
  dataDashboardBlueprint
];
