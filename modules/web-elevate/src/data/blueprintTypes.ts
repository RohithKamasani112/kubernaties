// Blueprint Type Definitions for WebElevate
export interface BlueprintTask {
  id: string;
  title: string;
  description: string;
  type: 'backend' | 'frontend' | 'setup' | 'testing' | 'deployment' | 'analysis';
  completed: boolean;
  optional: boolean;
  hints: string[];
  learningObjectives: string[];
  codeSnippets?: Record<string, string>; // filename -> code
  validationCriteria: string[];
  estimatedTime: number; // in minutes
  dependencies: string[]; // task IDs that must be completed first
}

export interface BlueprintMilestone {
  id: string;
  title: string;
  description: string;
  userStory: string;
  phase: 'planning' | 'development' | 'testing' | 'deployment';
  tasks: BlueprintTask[];
  completionCriteria: string[];
  xpReward: number;
  estimatedTime: number; // in hours
  keyConcepts: string[];
  deliverables: string[];
  order: number;
}

export interface BlueprintArchitecture {
  id: string;
  title: string;
  description: string;
  mermaidDiagram: string;
  components: {
    name: string;
    type: 'frontend' | 'backend' | 'database' | 'external';
    description: string;
    technologies: string[];
  }[];
  dataFlow: {
    from: string;
    to: string;
    description: string;
    protocol: string;
  }[];
}

export interface BlueprintDataModel {
  id: string;
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    validation?: string[];
  }[];
  relationships: {
    type: 'oneToOne' | 'oneToMany' | 'manyToMany';
    target: string;
    description: string;
  }[];
  example: Record<string, any>;
}

export interface BlueprintTestSuite {
  id: string;
  title: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
  framework: string; // jest, cypress, etc.
  testCases: {
    id: string;
    description: string;
    code: string;
    expectedResult: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  setupInstructions: string[];
}

export interface BlueprintDeployment {
  id: string;
  title: string;
  description: string;
  platform: 'vercel' | 'netlify' | 'heroku' | 'aws' | 'docker';
  steps: {
    id: string;
    title: string;
    description: string;
    commands?: string[];
    configFiles?: Record<string, string>;
    environmentVariables?: string[];
  }[];
  verificationSteps: string[];
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'devops';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  technologies: string[];
  estimatedDuration: string; // e.g., "2-3 weeks"
  totalXP: number;
  
  // Core Structure
  architecture: BlueprintArchitecture;
  dataModels: BlueprintDataModel[];
  milestones: BlueprintMilestone[];
  testSuites: BlueprintTestSuite[];
  deployment: BlueprintDeployment;
  
  // Learning Resources
  prerequisites: string[];
  learningResources: {
    type: 'documentation' | 'video' | 'tutorial' | 'article';
    title: string;
    url: string;
    description: string;
  }[];
  
  // Project Setup
  initialFiles: Record<string, string>; // filename -> content
  packageDependencies: {
    frontend: Record<string, string>;
    backend: Record<string, string>;
  };
  environmentVariables: string[];
  
  // Completion
  portfolioTemplate: string;
  certificateTemplate: string;
  showcaseRequirements: string[];
}

export interface BlueprintProgress {
  blueprintId: string;
  userId: string;
  startedAt: Date;
  lastUpdated: Date;
  currentMilestone: string;
  completedMilestones: string[];
  completedTasks: string[];
  totalProgress: number; // 0-100
  xpEarned: number;
  timeSpent: number; // in minutes
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
  projectUrl?: string;
  repositoryUrl?: string;
  deploymentUrl?: string;
  submittedAt?: Date;
  reviewStatus?: 'pending' | 'approved' | 'needs_revision';
  reviewFeedback?: string;
}

export interface BlueprintCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  blueprints: string[]; // blueprint IDs
  order: number;
}

// Validation and Testing Types
export interface ValidationResult {
  taskId: string;
  passed: boolean;
  score: number; // 0-100
  feedback: string;
  details: {
    criterion: string;
    passed: boolean;
    message: string;
  }[];
  executionTime: number;
  timestamp: Date;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
  modified: boolean;
  lastModified: Date;
}

export interface ProjectWorkspace {
  blueprintId: string;
  files: Record<string, ProjectFile>;
  currentMilestone: string;
  activeFile: string;
  consoleOutput: string[];
  testResults: ValidationResult[];
  buildStatus: 'idle' | 'building' | 'success' | 'error';
  previewUrl?: string;
}
