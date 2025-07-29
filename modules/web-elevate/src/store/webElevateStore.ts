import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { all43ReactTopicsIndex, topicStats } from '../data/reactTopicsIndex43';

// Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'frontend' | 'backend' | 'fullstack';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: Module[];
  progress: number;
  isStarted: boolean;
  isCompleted: boolean;
  icon: string;
  color: string;
  technologies: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'code' | 'playground' | 'challenge';
  duration: string;
  isLocked: boolean;
  isCompleted: boolean;
  isInProgress: boolean;
  content: ModuleContent;
  prerequisites: string[];
}

export interface ModuleContent {
  concept?: {
    title: string;
    content: string;
    diagrams?: string[];
    quiz?: QuizQuestion[];
  };
  code?: {
    title: string;
    explanation: string;
    codeBlocks: CodeBlock[];
    exercises?: Exercise[];
  };
  playground?: {
    title: string;
    instructions: string;
    initialFiles: FileStructure;
    tests: Test[];
    hints: string[];
  };
  challenge?: {
    title: string;
    description: string;
    requirements: string[];
    initialFiles: FileStructure;
    tests: Test[];
    solution?: FileStructure;
  };
}

export interface CodeBlock {
  language: string;
  code: string;
  explanation: string;
  highlights?: number[];
}

export interface Exercise {
  id: string;
  question: string;
  type: 'multiple-choice' | 'code-completion' | 'drag-drop';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FileStructure {
  [path: string]: {
    content: string;
    type: 'file' | 'folder';
    language?: string;
  };
}

export interface Test {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e';
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
}

export interface DebugProjectProgress {
  projectId: string;
  isCompleted: boolean;
  completedAt?: Date;
  bestTime?: number;
  bestScore?: number;
  attempts: number;
  hintsUsed: number;
}

export interface UserProgress {
  completedModules: string[];
  currentPath?: string;
  currentModule?: string;
  achievements: Achievement[];
  skillsGraph: SkillLevel[];
  totalHours: number;
  streak: number;
  // Gamification features
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  badges: Badge[];
  challenges: Challenge[];
  learningStreak: LearningStreak;
  skillTrees: SkillTree[];
  dailyChallengeCompleted: boolean;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
  // Debug playground progress
  debugProjects: DebugProjectProgress[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'learning' | 'coding' | 'completion' | 'streak';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  timeLimit?: number; // in minutes
  requirements: string[];
  hints: string[];
  isCompleted: boolean;
  bestTime?: number;
  attempts: number;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakGoal: number;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  nodes: SkillNode[];
  totalNodes: number;
  unlockedNodes: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  prerequisites: string[];
  rewards: {
    points: number;
    badges?: string[];
    achievements?: string[];
  };
  position: { x: number; y: number };
}

export interface SkillLevel {
  skill: string;
  level: number;
  maxLevel: number;
  experience: number;
  category: 'frontend' | 'backend' | 'tools' | 'concepts';
}

export interface PlaygroundSession {
  id: string;
  pathId: string;
  moduleId: string;
  files: FileStructure;
  activeFile: string;
  terminalHistory: string[];
  isRunning: boolean;
  lastSaved: Date;
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  scenario: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  userStories: string[];
  technicalRequirements: string[];
  concepts: string[];
  isUnlocked: boolean;
  isStarted: boolean;
  isCompleted: boolean;
  progress: number;
  technologies: string[];
  deliverables: string[];
  architectureComponents: ArchitectureComponent[];
  initialFiles: FileStructure;
  tests: Test[];
  solution?: FileStructure;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'cache' | 'api' | 'service';
  description: string;
  position: { x: number; y: number };
  connections: string[];
  technologies: string[];
}

// Store interface
interface WebElevateStore {
  // State
  isInitialized: boolean;
  learningPaths: LearningPath[];
  blueprints: Blueprint[];
  userProgress: UserProgress;
  currentPlaygroundSession?: PlaygroundSession;
  
  // Actions
  initializeApp: () => void;
  startPath: (pathId: string) => void;
  completeModule: (pathId: string, moduleId: string) => void;
  updateProgress: (pathId: string, moduleId: string, progress: number) => void;
  createPlaygroundSession: (pathId: string, moduleId: string) => string;
  updatePlaygroundSession: (sessionId: string, updates: Partial<PlaygroundSession>) => void;
  savePlaygroundSession: (sessionId: string) => void;
  loadPlaygroundSession: (sessionId: string) => PlaygroundSession | null;
  startBlueprint: (blueprintId: string) => void;
  completeBlueprint: (blueprintId: string) => void;
  updateBlueprintProgress: (blueprintId: string, progress: number) => void;
  addAchievement: (achievement: Achievement) => void;
  updateSkillLevel: (skill: string, experience: number) => void;
  // Gamification actions
  awardPoints: (points: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeChallenge: (challengeId: string, timeSpent?: number) => void;
  updateStreak: () => void;
  unlockSkillNode: (treeId: string, nodeId: string) => void;
  checkAchievements: () => void;
  startDailyChallenge: () => Challenge | null;
  updateWeeklyGoal: (progress: number) => void;
  // Debug playground actions
  completeDebugProject: (projectId: string, timeSpent: number, score: number, hintsUsed: number) => void;
  getDebugProjectProgress: (projectId: string) => DebugProjectProgress | null;
}

export const useWebElevateStore = create<WebElevateStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      learningPaths: [],
      blueprints: [],
      userProgress: {
        completedModules: [],
        achievements: [],
        skillsGraph: [],
        totalHours: 0,
        streak: 0,
        // Gamification initial values
        totalPoints: 0,
        level: 1,
        experiencePoints: 0,
        experienceToNextLevel: 100,
        badges: [],
        challenges: [],
        learningStreak: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: new Date(),
          streakGoal: 7
        },
        skillTrees: [],
        dailyChallengeCompleted: false,
        weeklyGoalProgress: 0,
        monthlyGoalProgress: 0,
        debugProjects: [],
      },
      currentPlaygroundSession: undefined,

      // Actions
      initializeApp: () => {
        // Initialize with mock data
        const mockPaths = createMockLearningPaths();
        const mockBlueprints = createMockBlueprints();
        const mockSkills = createMockSkillsGraph();

        set({
          isInitialized: true,
          learningPaths: mockPaths,
          blueprints: mockBlueprints,
          userProgress: {
            ...get().userProgress,
            skillsGraph: mockSkills,
          },
        });
      },

      startPath: (pathId: string) => {
        set((state) => ({
          learningPaths: state.learningPaths.map((path) =>
            path.id === pathId
              ? { ...path, isStarted: true }
              : path
          ),
          userProgress: {
            ...state.userProgress,
            currentPath: pathId,
          },
        }));
      },

      completeModule: (pathId: string, moduleId: string) => {
        set((state) => {
          const updatedPaths = state.learningPaths.map((path) => {
            if (path.id === pathId) {
              const updatedModules = path.modules.map((module) =>
                module.id === moduleId
                  ? { ...module, isCompleted: true, isInProgress: false }
                  : module
              );
              
              const completedCount = updatedModules.filter(m => m.isCompleted).length;
              const progress = (completedCount / updatedModules.length) * 100;
              
              return {
                ...path,
                modules: updatedModules,
                progress,
                isCompleted: progress === 100,
              };
            }
            return path;
          });

          return {
            learningPaths: updatedPaths,
            userProgress: {
              ...state.userProgress,
              completedModules: [...state.userProgress.completedModules, moduleId],
            },
          };
        });
      },

      updateProgress: (pathId: string, moduleId: string, progress: number) => {
        set((state) => ({
          learningPaths: state.learningPaths.map((path) =>
            path.id === pathId
              ? {
                  ...path,
                  modules: path.modules.map((module) =>
                    module.id === moduleId
                      ? { ...module, isInProgress: progress > 0 && progress < 100 }
                      : module
                  ),
                }
              : path
          ),
        }));
      },

      createPlaygroundSession: (pathId: string, moduleId: string) => {
        const sessionId = `session_${Date.now()}`;
        const path = get().learningPaths.find(p => p.id === pathId);
        const module = path?.modules.find(m => m.id === moduleId);
        
        if (!module?.content.playground && !module?.content.challenge) {
          throw new Error('Module does not have playground content');
        }

        const initialFiles = module.content.playground?.initialFiles || 
                           module.content.challenge?.initialFiles || {};

        const session: PlaygroundSession = {
          id: sessionId,
          pathId,
          moduleId,
          files: initialFiles,
          activeFile: Object.keys(initialFiles)[0] || 'index.js',
          terminalHistory: [],
          isRunning: false,
          lastSaved: new Date(),
        };

        set({ currentPlaygroundSession: session });
        return sessionId;
      },

      updatePlaygroundSession: (sessionId: string, updates: Partial<PlaygroundSession>) => {
        set((state) => ({
          currentPlaygroundSession: state.currentPlaygroundSession?.id === sessionId
            ? { ...state.currentPlaygroundSession, ...updates, lastSaved: new Date() }
            : state.currentPlaygroundSession,
        }));
      },

      savePlaygroundSession: (sessionId: string) => {
        // In a real app, this would save to backend
        console.log('Saving playground session:', sessionId);
      },

      loadPlaygroundSession: (sessionId: string) => {
        // In a real app, this would load from backend
        return get().currentPlaygroundSession?.id === sessionId 
          ? get().currentPlaygroundSession! 
          : null;
      },

      addAchievement: (achievement: Achievement) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            achievements: [...state.userProgress.achievements, achievement],
          },
        }));
      },

      updateSkillLevel: (skill: string, experience: number) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            skillsGraph: state.userProgress.skillsGraph.map((skillLevel) =>
              skillLevel.skill === skill
                ? {
                    ...skillLevel,
                    experience: skillLevel.experience + experience,
                    level: Math.floor((skillLevel.experience + experience) / 100) + 1,
                  }
                : skillLevel
            ),
          },
        }));
      },

      startBlueprint: (blueprintId: string) => {
        set((state) => ({
          blueprints: state.blueprints.map((blueprint) =>
            blueprint.id === blueprintId
              ? { ...blueprint, isStarted: true, progress: 0 }
              : blueprint
          ),
        }));
      },

      completeBlueprint: (blueprintId: string) => {
        set((state) => ({
          blueprints: state.blueprints.map((blueprint) =>
            blueprint.id === blueprintId
              ? { ...blueprint, isCompleted: true, progress: 100 }
              : blueprint
          ),
        }));
      },

      updateBlueprintProgress: (blueprintId: string, progress: number) => {
        set((state) => ({
          blueprints: state.blueprints.map((blueprint) =>
            blueprint.id === blueprintId
              ? { ...blueprint, progress, isStarted: true }
              : blueprint
          ),
        }));
      },

      // Gamification actions
      awardPoints: (points: number, reason: string) => {
        set((state) => {
          const newTotalPoints = state.userProgress.totalPoints + points;
          const newExperience = state.userProgress.experiencePoints + points;
          const currentLevel = state.userProgress.level;
          const experienceNeeded = currentLevel * 100;

          let newLevel = currentLevel;
          let remainingExperience = newExperience;

          // Level up calculation
          while (remainingExperience >= experienceNeeded) {
            remainingExperience -= experienceNeeded;
            newLevel++;
          }

          const experienceToNext = (newLevel * 100) - remainingExperience;

          return {
            userProgress: {
              ...state.userProgress,
              totalPoints: newTotalPoints,
              level: newLevel,
              experiencePoints: remainingExperience,
              experienceToNextLevel: experienceToNext,
            },
          };
        });
      },

      unlockBadge: (badgeId: string) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            badges: state.userProgress.badges.map((badge) =>
              badge.id === badgeId
                ? { ...badge, isUnlocked: true }
                : badge
            ),
          },
        }));
      },

      completeChallenge: (challengeId: string, timeSpent?: number) => {
        set((state) => {
          const challenge = state.userProgress.challenges.find(c => c.id === challengeId);
          if (!challenge) return state;

          const updatedChallenges = state.userProgress.challenges.map((c) =>
            c.id === challengeId
              ? {
                  ...c,
                  isCompleted: true,
                  bestTime: timeSpent && (!c.bestTime || timeSpent < c.bestTime) ? timeSpent : c.bestTime
                }
              : c
          );

          return {
            userProgress: {
              ...state.userProgress,
              challenges: updatedChallenges,
              totalPoints: state.userProgress.totalPoints + challenge.points,
            },
          };
        });
      },

      updateStreak: () => {
        set((state) => {
          const today = new Date();
          const lastActivity = new Date(state.userProgress.learningStreak.lastActivityDate);
          const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

          let newStreak = state.userProgress.learningStreak.currentStreak;

          if (daysDiff === 1) {
            // Consecutive day
            newStreak++;
          } else if (daysDiff > 1) {
            // Streak broken
            newStreak = 1;
          }
          // If daysDiff === 0, same day, no change

          const newLongestStreak = Math.max(newStreak, state.userProgress.learningStreak.longestStreak);

          return {
            userProgress: {
              ...state.userProgress,
              learningStreak: {
                ...state.userProgress.learningStreak,
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastActivityDate: today,
              },
            },
          };
        });
      },

      unlockSkillNode: (treeId: string, nodeId: string) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            skillTrees: state.userProgress.skillTrees.map((tree) =>
              tree.id === treeId
                ? {
                    ...tree,
                    nodes: tree.nodes.map((node) =>
                      node.id === nodeId
                        ? { ...node, isUnlocked: true }
                        : node
                    ),
                    unlockedNodes: tree.nodes.filter(n => n.isUnlocked || n.id === nodeId).length,
                  }
                : tree
            ),
          },
        }));
      },

      checkAchievements: () => {
        // This would check for new achievements based on current progress
        // Implementation would check various conditions and award achievements
        console.log('Checking for new achievements...');
      },

      startDailyChallenge: () => {
        const state = get();
        if (state.userProgress.dailyChallengeCompleted) {
          return null;
        }

        // Return a random challenge (simplified implementation)
        const dailyChallenge: Challenge = {
          id: `daily-${Date.now()}`,
          title: '🎯 Daily Coding Challenge',
          description: 'Complete a React component in under 10 minutes!',
          difficulty: 'medium',
          points: 50,
          timeLimit: 10,
          requirements: ['Create a functional component', 'Use useState hook', 'Handle click events'],
          hints: ['Remember to import React and useState', 'Use arrow functions for event handlers'],
          isCompleted: false,
          attempts: 0,
        };

        return dailyChallenge;
      },

      updateWeeklyGoal: (progress: number) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            weeklyGoalProgress: Math.min(100, progress),
          },
        }));
      },

      // Debug playground actions
      completeDebugProject: (projectId: string, timeSpent: number, score: number, hintsUsed: number) => {
        set((state) => {
          const existingProject = state.userProgress.debugProjects.find(p => p.projectId === projectId);
          const now = new Date();

          if (existingProject) {
            // Update existing project if this is a better score or first completion
            const updatedProjects = state.userProgress.debugProjects.map(p =>
              p.projectId === projectId
                ? {
                    ...p,
                    isCompleted: true,
                    completedAt: now,
                    bestTime: p.bestTime ? Math.min(p.bestTime, timeSpent) : timeSpent,
                    bestScore: p.bestScore ? Math.max(p.bestScore, score) : score,
                    attempts: p.attempts + 1,
                    hintsUsed: Math.min(p.hintsUsed, hintsUsed)
                  }
                : p
            );

            return {
              userProgress: {
                ...state.userProgress,
                debugProjects: updatedProjects,
              },
            };
          } else {
            // Add new project completion
            const newProject: DebugProjectProgress = {
              projectId,
              isCompleted: true,
              completedAt: now,
              bestTime: timeSpent,
              bestScore: score,
              attempts: 1,
              hintsUsed
            };

            return {
              userProgress: {
                ...state.userProgress,
                debugProjects: [...state.userProgress.debugProjects, newProject],
              },
            };
          }
        });
      },

      getDebugProjectProgress: (projectId: string) => {
        const state = get();
        return state.userProgress?.debugProjects?.find(p => p.projectId === projectId) || null;
      },
    }),
    {
      name: 'web-elevate-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        learningPaths: state.learningPaths.map(path => ({
          ...path,
          modules: path.modules.map(module => ({
            id: module.id,
            isCompleted: module.isCompleted,
            isInProgress: module.isInProgress,
            isLocked: module.isLocked,
          })),
        })),
      }),
    }
  )
);

// Helper functions to create mock data
function createMockLearningPaths(): LearningPath[] {
  const reactModules = createReactModules();
  const angularModules = createAngularModules();

  return [
    {
      id: 'react-mastery',
      title: '⚛️ React Mastery Path',
      description: '🚀 Master React from zero to hero! Build amazing UIs with interactive challenges, real projects, and gamified learning. Perfect for beginners who want to become React pros!',
      category: 'frontend',
      difficulty: 'beginner',
      duration: '35 hours',
      progress: 0,
      isStarted: false,
      isCompleted: false,
      icon: 'react',
      color: 'from-blue-500 to-cyan-500',
      technologies: ['React', 'JSX', 'Hooks', 'State Management', 'Props', 'Components'],
      modules: reactModules,
    },
    {
      id: 'angular-fundamentals',
      title: '🅰️ Angular Complete Journey',
      description: '🚀 Master Angular from ground up! Learn TypeScript, components, services, routing, and build enterprise-grade applications with Google\'s powerful framework!',
      category: 'frontend',
      difficulty: 'intermediate',
      duration: '45 hours',
      progress: 0,
      isStarted: false,
      isCompleted: false,
      icon: 'layers',
      color: 'from-red-500 to-pink-500',
      technologies: ['Angular', 'TypeScript', 'RxJS', 'Components', 'Services', 'Routing'],
      modules: angularModules,
    },
  ];
}

function createMockSkillsGraph(): SkillLevel[] {
  return [
    { skill: 'React', level: 1, maxLevel: 10, experience: 0, category: 'frontend' },
    { skill: 'JavaScript', level: 2, maxLevel: 10, experience: 150, category: 'frontend' },
    { skill: 'HTML/CSS', level: 3, maxLevel: 10, experience: 250, category: 'frontend' },
    { skill: 'Node.js', level: 1, maxLevel: 10, experience: 0, category: 'backend' },
    { skill: 'Express', level: 1, maxLevel: 10, experience: 0, category: 'backend' },
    { skill: 'MongoDB', level: 1, maxLevel: 10, experience: 0, category: 'backend' },
    { skill: 'Git', level: 2, maxLevel: 10, experience: 120, category: 'tools' },
    { skill: 'Docker', level: 1, maxLevel: 10, experience: 0, category: 'tools' },
  ];
}

// Helper functions to create module data
function createReactModules(): Module[] {
  // Convert all 43 React topics to module format - ALL UNLOCKED
  return all43ReactTopicsIndex.map((topic, index) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    type: 'concept' as const,
    duration: topic.estimatedTime,
    isLocked: false, // ALL TOPICS UNLOCKED for comprehensive learning
    isCompleted: false,
    isInProgress: false,
    prerequisites: topic.prerequisites,
    content: {
      concept: {
        title: topic.title,
        content: `${topic.description}\n\nDifficulty: ${topic.difficulty}\nCategory: ${topic.category}\nXP Reward: ${topic.xpReward}`
      }
    }
  }));
}

function createReactModulesOld(): Module[] {
  return [
    // 🎯 Part 1: React Fundamentals
    {
      id: 'react-intro',
      title: '🚀 What is React?',
      description: 'Discover the magic of React - your gateway to modern web development!',
      type: 'concept',
      duration: '25 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: [],
      content: {
        concept: {
          title: 'Welcome to React! 🎉',
          content: `
# What is React? 🤔

Think of React like building with LEGO blocks! 🧱

React is a **JavaScript library** that helps you build user interfaces. But what makes it special?

## Why React is Amazing ✨

1. **Component-Based**: Like LEGO blocks, you build small pieces and combine them
2. **Declarative**: You describe what you want, React figures out how to do it
3. **Virtual DOM**: Super fast updates that make your apps lightning quick ⚡

## Your First React Component 🎯

Let's start with something simple - a greeting component:

\`\`\`jsx
function Welcome() {
  return <h1>Hello, Future React Developer! 👋</h1>;
}
\`\`\`

**What's happening here?**
- We created a function called \`Welcome\`
- It returns JSX (HTML-like syntax in JavaScript)
- This is your first React component! 🎊

## Try This! 💪
Can you guess what this component will display?

\`\`\`jsx
function Greeting() {
  return <h2>Welcome to the React Adventure! 🚀</h2>;
}
\`\`\`

**Answer**: It will show a heading that says "Welcome to the React Adventure! 🚀"
          `,
          quiz: [
            {
              id: 'react-basics-1',
              question: 'What makes React components like LEGO blocks?',
              options: [
                'They are colorful',
                'You can combine small pieces to build bigger things',
                'They are made of plastic',
                'They are expensive'
              ],
              correctAnswer: 1,
              explanation: 'Exactly! React components are reusable pieces that you can combine to build complex user interfaces, just like LEGO blocks! 🧱'
            },
            {
              id: 'react-basics-2',
              question: 'What does JSX allow you to do?',
              options: [
                'Write HTML-like syntax in JavaScript',
                'Create databases',
                'Style your components',
                'Deploy your app'
              ],
              correctAnswer: 0,
              explanation: 'Perfect! JSX lets you write HTML-like syntax directly in your JavaScript, making it super intuitive to create UI components! ✨'
            }
          ]
        }
      }
    },
    {
      id: 'jsx-fundamentals',
      title: '🎨 JSX - HTML in JavaScript',
      description: 'Master JSX and learn to embed HTML in JavaScript like a pro!',
      type: 'code',
      duration: '30 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['react-intro'],
      content: {
        code: {
          title: 'JSX Magic ✨',
          explanation: `
# JSX - Your New Superpower! 🦸‍♀️

JSX is like having a magic wand that lets you write HTML inside JavaScript!

## The Rules of JSX 📋

1. **One Root Element**: Every component must return ONE parent element
2. **Use {} for JavaScript**: Want to use variables? Wrap them in curly braces!
3. **className not class**: Use \`className\` instead of \`class\`
4. **camelCase attributes**: \`onClick\` not \`onclick\`

## Let's Practice! 💪
          `,
          codeBlocks: [
            {
              language: 'jsx',
              code: `// ❌ Wrong - Multiple root elements
function BadComponent() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ Correct - One root element
function GoodComponent() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  );
}`,
              explanation: 'Always wrap multiple elements in a parent element like <div> or React Fragment <> </>',
              highlights: [2, 3, 9, 10, 11]
            },
            {
              language: 'jsx',
              code: `function PersonCard() {
  const name = "Alex";
  const age = 25;

  return (
    <div className="person-card">
      <h2>Hello, {name}! 👋</h2>
      <p>You are {age} years old</p>
      <p>Next year you'll be {age + 1}!</p>
    </div>
  );
}`,
              explanation: 'Use curly braces {} to embed JavaScript expressions in JSX. You can use variables, calculations, and more!',
              highlights: [7, 8, 9]
            }
          ],
          exercises: [
            {
              id: 'jsx-exercise-1',
              question: 'Create a component that displays your favorite color using a variable',
              type: 'code-completion',
              correctAnswer: `function FavoriteColor() {
  const color = "blue";
  return <p>My favorite color is {color}!</p>;
}`,
              explanation: 'Great job! You used a variable inside JSX with curly braces! 🎨'
            }
          ]
        }
      }
    },
    {
      id: 'react-components-deep',
      title: '🧩 Building React Components',
      description: 'Create reusable components and learn the art of component composition!',
      type: 'playground',
      duration: '45 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['jsx-fundamentals'],
      content: {
        playground: {
          title: 'Component Workshop 🛠️',
          instructions: `
# Welcome to the Component Workshop! 🎯

Your mission: Build a **Profile Card** component that displays user information!

## 🎮 Challenge Requirements:
1. Create a \`ProfileCard\` component
2. Display a user's name, age, and hobby
3. Add some basic styling with className
4. Make it reusable for different users

## 🏆 Bonus Points:
- Add an emoji based on the hobby
- Use conditional rendering for age display
- Style it to look awesome!

**Hint**: Think about what information a profile card should show and how to make it look good! 💡
          `,
          initialFiles: {
            'src/App.js': {
              content: `import React from 'react';
import './App.css';

// TODO: Create your ProfileCard component here
function ProfileCard() {
  // Your code here
  return <div>Profile Card Coming Soon...</div>;
}

function App() {
  return (
    <div className="App">
      <h1>Profile Cards Gallery 🖼️</h1>
      <ProfileCard />
    </div>
  );
}

export default App;`,
              type: 'file',
              language: 'javascript'
            },
            'src/App.css': {
              content: `.App {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 15px;
  margin: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  max-width: 300px;
  margin: 20px auto;
}

.profile-card h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.profile-card p {
  margin: 5px 0;
  opacity: 0.9;
}`,
              type: 'file',
              language: 'css'
            }
          },
          tests: [
            {
              id: 'component-test-1',
              name: 'ProfileCard renders correctly',
              description: 'Component should display user information',
              type: 'unit'
            },
            {
              id: 'component-test-2',
              name: 'Component uses props',
              description: 'Component should accept and use props for user data',
              type: 'unit'
            }
          ],
          hints: [
            'Start by defining what props your component needs (name, age, hobby)',
            'Use the provided CSS class "profile-card" for styling',
            'Remember to use curly braces {} for JavaScript expressions in JSX',
            'Try adding emojis to make it more fun! 🎨'
          ]
        }
      }
    },

    // 🎯 Part 2: Props & Component Communication
    {
      id: 'props-mastery',
      title: '🎁 Props - Passing Data Like Gifts',
      description: 'Learn how to pass data between components using props!',
      type: 'concept',
      duration: '35 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['react-components-deep'],
      content: {
        concept: {
          title: 'Props - The Gift Exchange System! 🎁',
          content: `
# Props - Passing Data Between Components 📦

Think of props like **gifts** you pass from parent to child components!

## What are Props? 🤔

Props (short for "properties") are how you pass data from a parent component to a child component.

**Analogy**: Imagine you're giving a birthday gift 🎂
- **Parent Component**: The gift giver
- **Props**: The gift itself
- **Child Component**: The gift receiver

## How Props Work ⚡

\`\`\`jsx
// Parent Component (Gift Giver)
function App() {
  return (
    <div>
      <Greeting name="Sarah" age={25} />
      <Greeting name="Mike" age={30} />
    </div>
  );
}

// Child Component (Gift Receiver)
function Greeting(props) {
  return (
    <div>
      <h2>Hello, {props.name}! 👋</h2>
      <p>You are {props.age} years old</p>
    </div>
  );
}
\`\`\`

## Props Destructuring - The Clean Way! ✨

\`\`\`jsx
// Instead of props.name, props.age...
function Greeting({ name, age }) {
  return (
    <div>
      <h2>Hello, {name}! 👋</h2>
      <p>You are {age} years old</p>
    </div>
  );
}
\`\`\`

## Props Rules 📋

1. **Read-Only**: Props are like sealed gifts - you can't change them!
2. **One-Way Flow**: Data flows from parent → child only
3. **Any Data Type**: Strings, numbers, objects, functions, even other components!

## Try This Challenge! 💪

What will this component display?

\`\`\`jsx
function MovieCard({ title, year, rating }) {
  return (
    <div>
      <h3>{title} ({year})</h3>
      <p>Rating: {rating}/10 ⭐</p>
    </div>
  );
}

// Used like this:
<MovieCard title="The Matrix" year={1999} rating={9} />
\`\`\`

**Answer**: It will show "The Matrix (1999)" as a heading and "Rating: 9/10 ⭐" as a paragraph!
          `,
          quiz: [
            {
              id: 'props-quiz-1',
              question: 'What are props in React?',
              options: [
                'A way to style components',
                'A way to pass data from parent to child components',
                'A way to create new components',
                'A way to handle user clicks'
              ],
              correctAnswer: 1,
              explanation: 'Exactly! Props are like gifts that parent components give to their children - they pass data down! 🎁'
            },
            {
              id: 'props-quiz-2',
              question: 'Can you modify props inside a component?',
              options: [
                'Yes, you can change them anytime',
                'No, props are read-only',
                'Only on Sundays',
                'Only if you ask nicely'
              ],
              correctAnswer: 1,
              explanation: 'Correct! Props are read-only - think of them as sealed gifts that you can look at but not change! 📦'
            }
          ]
        }
      }
    },

    // 🎯 Part 3: State & Interactivity
    {
      id: 'state-introduction',
      title: '🎮 State - Making Components Interactive',
      description: 'Bring your components to life with state and user interactions!',
      type: 'code',
      duration: '40 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['props-mastery'],
      content: {
        code: {
          title: 'State - Your Component\'s Memory! 🧠',
          explanation: `
# State - Making Components Remember Things! 🧠

State is like your component's **memory** - it remembers information and can change over time!

## Props vs State 🤔

- **Props**: Data from parent (like receiving a gift) 🎁
- **State**: Component's own data (like your personal diary) 📔

## useState Hook - Your New Best Friend! 🪝

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  // useState returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me! 🚀
      </button>
    </div>
  );
}
\`\`\`

## How useState Works ⚡

1. **Initial Value**: \`useState(0)\` starts count at 0
2. **Current Value**: \`count\` holds the current value
3. **Setter Function**: \`setCount\` updates the value
4. **Re-render**: Component updates when state changes!
          `,
          codeBlocks: [
            {
              language: 'jsx',
              code: `import React, { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  return (
    <button
      onClick={handleLike}
      style={{
        backgroundColor: isLiked ? '#ff6b6b' : '#ddd',
        color: isLiked ? 'white' : 'black'
      }}
    >
      {isLiked ? '❤️' : '🤍'} {likes} likes
    </button>
  );
}`,
              explanation: 'This component tracks both the number of likes and whether the user has liked it. Notice how we use multiple useState hooks!',
              highlights: [4, 5, 7, 8, 12, 13]
            }
          ],
          exercises: [
            {
              id: 'state-exercise-1',
              question: 'Create a component that toggles between "Hello" and "Goodbye" when clicked',
              type: 'code-completion',
              correctAnswer: `function ToggleGreeting() {
  const [greeting, setGreeting] = useState("Hello");

  const toggleGreeting = () => {
    setGreeting(greeting === "Hello" ? "Goodbye" : "Hello");
  };

  return (
    <button onClick={toggleGreeting}>
      {greeting}! 👋
    </button>
  );
}`,
              explanation: 'Perfect! You used state to toggle between two values. This is a common pattern in React! 🎉'
            }
          ]
        }
      }
    }
  ];
}

function createNodejsModules(): Module[] {
  return [
    // 🎯 Part 1: Node.js Fundamentals
    {
      id: 'nodejs-intro',
      title: '🟢 Welcome to Node.js World',
      description: 'Discover the power of server-side JavaScript and join millions of developers!',
      type: 'concept',
      duration: '30 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: [],
      content: {
        concept: {
          title: 'Node.js - JavaScript Everywhere! 🌍',
          content: `
# What is Node.js? 🤔

Imagine if JavaScript could run **everywhere** - not just in browsers! That's Node.js! 🚀

## The Big Picture 🖼️

**Before Node.js**: JavaScript only lived in browsers 🌐
**After Node.js**: JavaScript can run on servers, build APIs, create desktop apps, and more! 💪

## Why Node.js is Amazing ✨

1. **Same Language**: Use JavaScript for frontend AND backend
2. **Super Fast**: Built on Chrome's V8 engine (the same one that makes Chrome fast!)
3. **Non-blocking**: Can handle thousands of requests at once
4. **Huge Community**: npm has over 1 million packages! 📦

## Your First Node.js Program 🎯

Let's start with the classic "Hello World":

\`\`\`javascript
// hello.js
console.log("Hello from Node.js! 🟢");
console.log("I'm running on the server!");
\`\`\`

**To run it**: \`node hello.js\`

## Node.js vs Browser JavaScript 🆚

| Browser JavaScript | Node.js |
|-------------------|---------|
| \`window\` object | \`global\` object |
| DOM manipulation | File system access |
| \`fetch()\` for HTTP | \`http\` module |
| Limited file access | Full file system |

## Global Objects in Node.js 🌐

\`\`\`javascript
console.log(__filename);  // Current file path
console.log(__dirname);   // Current directory
console.log(process.env); // Environment variables
\`\`\`

## Try This! 💪

What will this code output?

\`\`\`javascript
console.log("Starting...");
console.log("Current directory:", __dirname);
console.log("Node version:", process.version);
console.log("Done!");
\`\`\`

**Answer**: It will show the startup message, your current directory path, Node.js version, and "Done!"
          `,
          quiz: [
            {
              id: 'nodejs-basics-1',
              question: 'What makes Node.js special?',
              options: [
                'It only works in browsers',
                'It lets JavaScript run on servers',
                'It\'s only for mobile apps',
                'It replaces HTML'
              ],
              correctAnswer: 1,
              explanation: 'Exactly! Node.js brought JavaScript to the server-side, making it possible to use one language for everything! 🌍'
            },
            {
              id: 'nodejs-basics-2',
              question: 'What engine does Node.js use?',
              options: [
                'Firefox\'s SpiderMonkey',
                'Safari\'s JavaScriptCore',
                'Chrome\'s V8',
                'Internet Explorer\'s Chakra'
              ],
              correctAnswer: 2,
              explanation: 'Perfect! Node.js uses Chrome\'s V8 engine, which is super fast and efficient! ⚡'
            }
          ]
        }
      }
    },

    // 🎯 Part 2: Core Modules & File System
    {
      id: 'nodejs-core-modules',
      title: '📁 File System & Core Modules',
      description: 'Master Node.js built-in modules and learn to work with files like a pro!',
      type: 'code',
      duration: '45 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['nodejs-intro'],
      content: {
        code: {
          title: 'Working with Files & Modules 📂',
          explanation: `
# Core Modules - Node.js Built-in Superpowers! 🦸‍♂️

Node.js comes with amazing built-in modules. No installation needed!

## The File System (fs) Module 📁

The \`fs\` module lets you work with files and directories:

\`\`\`javascript
const fs = require('fs');

// Read a file
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write a file
fs.writeFile('output.txt', 'Hello World!', (err) => {
  if (err) throw err;
  console.log('File saved! 💾');
});
\`\`\`

## Sync vs Async - The Big Decision! ⚡

- **Async** (recommended): Non-blocking, better performance
- **Sync**: Blocking, simpler code but slower

## Other Useful Core Modules 🛠️

- \`path\`: Work with file paths
- \`os\`: Operating system info
- \`crypto\`: Encryption and hashing
- \`events\`: Event emitters
          `,
          codeBlocks: [
            {
              language: 'javascript',
              code: `const fs = require('fs');
const path = require('path');

// Create a simple file manager
function createFile(filename, content) {
  const filePath = path.join(__dirname, filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('❌ Error creating file:', err);
    } else {
      console.log(\`✅ File '\${filename}' created successfully!\`);
    }
  });
}

function readFile(filename) {
  const filePath = path.join(__dirname, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading file:', err);
    } else {
      console.log(\`📖 Content of '\${filename}':\`);
      console.log(data);
    }
  });
}

// Usage
createFile('my-notes.txt', 'Learning Node.js is awesome! 🚀');
setTimeout(() => readFile('my-notes.txt'), 100);`,
              explanation: 'This code creates a simple file manager with create and read functions. Notice how we use callbacks to handle async operations!',
              highlights: [6, 7, 8, 17, 18, 19]
            }
          ],
          exercises: [
            {
              id: 'fs-exercise-1',
              question: 'Create a function that checks if a file exists and logs an appropriate message',
              type: 'code-completion',
              correctAnswer: `function checkFileExists(filename) {
  fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(\`❌ File '\${filename}' does not exist\`);
    } else {
      console.log(\`✅ File '\${filename}' exists!\`);
    }
  });
}`,
              explanation: 'Great! You used fs.access() to check file existence. This is the recommended way to check if files exist! 🎉'
            }
          ]
        }
      }
    },

    // 🎯 Part 3: HTTP Server & Express.js
    {
      id: 'http-server-basics',
      title: '🌐 Building Your First Web Server',
      description: 'Create web servers and APIs that can handle real HTTP requests!',
      type: 'playground',
      duration: '50 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['nodejs-core-modules'],
      content: {
        playground: {
          title: 'Web Server Workshop 🏗️',
          instructions: `
# Build Your First Web Server! 🌐

Your mission: Create a web server that can handle different routes and serve JSON responses!

## 🎮 Challenge Requirements:
1. Create an HTTP server using Node.js built-in \`http\` module
2. Handle different routes: \`/\`, \`/about\`, \`/api/users\`
3. Return appropriate JSON responses
4. Handle 404 errors for unknown routes

## 🏆 Bonus Points:
- Add request logging (show method and URL)
- Handle different HTTP methods (GET, POST)
- Add proper HTTP status codes
- Make responses look professional with emojis!

**Hint**: Use \`req.url\` and \`req.method\` to handle different routes! 💡
          `,
          initialFiles: {
            'server.js': {
              content: `const http = require('http');
const url = require('url');

// TODO: Create your web server here
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // Get the URL path
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // TODO: Add your routing logic here
  console.log(\`\${method} \${path}\`);

  // Default response
  res.statusCode = 200;
  res.end(JSON.stringify({
    message: 'Server is running! 🚀',
    path: path,
    method: method
  }));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`🌐 Server running at http://localhost:\${PORT}\`);
  console.log('Try visiting:');
  console.log('  - http://localhost:3000/');
  console.log('  - http://localhost:3000/about');
  console.log('  - http://localhost:3000/api/users');
});`,
              type: 'file',
              language: 'javascript'
            },
            'package.json': {
              content: `{
  "name": "my-web-server",
  "version": "1.0.0",
  "description": "My first Node.js web server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["nodejs", "server", "http"],
  "author": "You",
  "license": "MIT"
}`,
              type: 'file',
              language: 'json'
            }
          },
          tests: [
            {
              id: 'server-test-1',
              name: 'Server starts successfully',
              description: 'Server should start on port 3000',
              type: 'integration'
            },
            {
              id: 'server-test-2',
              name: 'Routes respond correctly',
              description: 'Different routes should return appropriate responses',
              type: 'integration'
            }
          ],
          hints: [
            'Use if/else or switch statements to handle different paths',
            'Remember to set appropriate status codes (200, 404, etc.)',
            'Use JSON.stringify() to send JSON responses',
            'Test your server by visiting the URLs in your browser! 🌐'
          ]
        }
      }
    }
  ];
}

function createAngularModules(): Module[] {
  return [
    // 🎯 Part 1: Angular Fundamentals
    {
      id: 'angular-intro',
      title: '🅰️ Welcome to Angular Universe',
      description: 'Discover Angular - Google\'s powerful framework for building amazing web applications!',
      type: 'concept',
      duration: '35 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: [],
      content: {
        concept: {
          title: 'Angular - The Complete Solution! 🏗️',
          content: `
# What is Angular? 🤔

Angular is like having a **complete construction kit** for building web applications! 🏗️

## Angular vs React - The Big Picture 🖼️

| Angular | React |
|---------|-------|
| **Complete Framework** 📦 | **Library** 📚 |
| Everything included | Choose your tools |
| TypeScript by default | JavaScript (TS optional) |
| Opinionated structure | Flexible approach |

## Why Angular is Awesome ✨

1. **Complete Solution**: Routing, HTTP, Forms, Testing - all included!
2. **TypeScript Power**: Better code quality and developer experience
3. **Enterprise Ready**: Used by Google, Microsoft, Samsung, and more
4. **Powerful CLI**: Generate components, services, and entire apps instantly
5. **Two-Way Data Binding**: UI and data stay in sync automatically

## Angular Architecture 🏛️

\`\`\`
📱 Angular App
├── 🧩 Components (UI pieces)
├── 🔧 Services (business logic)
├── 📦 Modules (organize features)
├── 🛣️ Router (navigation)
└── 📡 HTTP Client (API calls)
\`\`\`

## Your First Angular Component 🎯

\`\`\`typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  template: \`
    <h1>Welcome to Angular! 🅰️</h1>
    <p>Let's build something amazing!</p>
  \`,
  styles: [\`
    h1 { color: #dd0031; }
    p { color: #666; }
  \`]
})
export class WelcomeComponent {
  title = 'My Angular App';
}
\`\`\`

## Angular CLI - Your Best Friend! 🛠️

\`\`\`bash
# Install Angular CLI
npm install -g @angular/cli

# Create new app
ng new my-awesome-app

# Generate component
ng generate component hero

# Start development server
ng serve
\`\`\`

## TypeScript in 2 Minutes ⚡

\`\`\`typescript
// Variables with types
let name: string = "Angular Developer";
let age: number = 25;
let isAwesome: boolean = true;

// Interfaces (like contracts)
interface User {
  id: number;
  name: string;
  email: string;
}

// Classes
class Hero {
  constructor(public name: string, public power: string) {}

  introduce(): string {
    return \`I'm \${this.name} and my power is \${this.power}!\`;
  }
}
\`\`\`

## Try This Challenge! 💪

What will this Angular component display?

\`\`\`typescript
@Component({
  selector: 'app-counter',
  template: \`
    <h2>Count: {{count}}</h2>
    <button (click)="increment()">+1</button>
  \`
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }
}
\`\`\`

**Answer**: A counter that shows "Count: 0" and a button that increases the count when clicked!
          `,
          quiz: [
            {
              id: 'angular-basics-1',
              question: 'What makes Angular different from React?',
              options: [
                'Angular is only for mobile apps',
                'Angular is a complete framework with everything included',
                'Angular doesn\'t use JavaScript',
                'Angular is only for small projects'
              ],
              correctAnswer: 1,
              explanation: 'Exactly! Angular is a complete framework that includes routing, HTTP client, forms, testing, and more out of the box! 📦'
            },
            {
              id: 'angular-basics-2',
              question: 'What language does Angular use by default?',
              options: [
                'JavaScript',
                'Python',
                'TypeScript',
                'Java'
              ],
              correctAnswer: 2,
              explanation: 'Perfect! Angular uses TypeScript by default, which adds type safety and better developer experience to JavaScript! 🎯'
            }
          ]
        }
      }
    },

    // 🎯 Part 2: Components & Templates
    {
      id: 'angular-components',
      title: '🧩 Angular Components Deep Dive',
      description: 'Master Angular components, templates, and data binding like a pro!',
      type: 'code',
      duration: '50 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      prerequisites: ['angular-intro'],
      content: {
        code: {
          title: 'Component Mastery Workshop 🛠️',
          explanation: `
# Angular Components - The Building Blocks! 🧱

Components are the **heart** of Angular applications. Think of them as custom HTML elements with superpowers!

## Component Anatomy 🔬

\`\`\`typescript
@Component({
  selector: 'app-hero-card',      // How to use: <app-hero-card>
  templateUrl: './hero-card.component.html',  // HTML template
  styleUrls: ['./hero-card.component.css']    // CSS styles
})
export class HeroCardComponent {
  // Component logic goes here
}
\`\`\`

## Data Binding - The Magic! ✨

Angular has **4 types** of data binding:

1. **Interpolation**: \`{{value}}\` - Display data
2. **Property Binding**: \`[property]="value"\` - Set element properties
3. **Event Binding**: \`(event)="handler()"\` - Handle events
4. **Two-Way Binding**: \`[(ngModel)]="value"\` - Both directions

## Let's Build a Hero Card! 🦸‍♀️
          `,
          codeBlocks: [
            {
              language: 'typescript',
              code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-card',
  template: \`
    <div class="hero-card">
      <!-- Interpolation: Display data -->
      <h2>{{hero.name}}</h2>
      <p>Power: {{hero.power}}</p>

      <!-- Property Binding: Set image source -->
      <img [src]="hero.imageUrl" [alt]="hero.name">

      <!-- Event Binding: Handle clicks -->
      <button (click)="toggleFavorite()">
        {{isFavorite ? '❤️' : '🤍'}} Favorite
      </button>

      <!-- Two-way Binding: Edit hero name -->
      <input [(ngModel)]="hero.name" placeholder="Hero name">
    </div>
  \`,
  styles: [\`
    .hero-card {
      border: 2px solid #ddd;
      border-radius: 10px;
      padding: 20px;
      margin: 10px;
      text-align: center;
    }
    img { width: 100px; height: 100px; border-radius: 50%; }
    button { margin: 10px; padding: 10px 20px; }
  \`]
})
export class HeroCardComponent {
  hero = {
    name: 'Wonder Woman',
    power: 'Super Strength',
    imageUrl: 'https://example.com/wonder-woman.jpg'
  };

  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    console.log(\`\${this.hero.name} is \${this.isFavorite ? 'now' : 'no longer'} a favorite!\`);
  }
}`,
              explanation: 'This component demonstrates all 4 types of data binding! Notice how the template and component class work together.',
              highlights: [8, 11, 14, 19, 22]
            }
          ],
          exercises: [
            {
              id: 'angular-component-exercise-1',
              question: 'Create a component that displays a book with title, author, and a "Read" button that toggles between "Read" and "Unread"',
              type: 'code-completion',
              correctAnswer: `@Component({
  selector: 'app-book-card',
  template: \`
    <div class="book-card">
      <h3>{{book.title}}</h3>
      <p>by {{book.author}}</p>
      <button (click)="toggleRead()">
        {{isRead ? 'Mark as Unread' : 'Mark as Read'}}
      </button>
    </div>
  \`
})
export class BookCardComponent {
  book = {
    title: 'Angular Guide',
    author: 'Angular Team'
  };
  isRead = false;

  toggleRead() {
    this.isRead = !this.isRead;
  }
}`,
              explanation: 'Excellent! You created a book component with interpolation for displaying data and event binding for the toggle functionality! 📚'
            }
          ]
        }
      }
    }
  ];
}

function createFullstackModules(): Module[] {
  return [
    {
      id: 'fullstack-intro',
      title: 'Full-Stack Architecture',
      description: 'Understanding how frontend and backend work together',
      type: 'concept',
      duration: '35 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      content: {
        concept: {
          title: 'Full-Stack Development',
          description: 'Learn how to connect React frontend with Node.js backend',
          sections: [
            {
              title: 'Client-Server Architecture',
              content: 'Understanding how web applications communicate...',
              codeExample: 'fetch("/api/users").then(res => res.json())'
            }
          ]
        }
      }
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      description: 'Connect your React app to a backend API',
      type: 'playground',
      duration: '60 min',
      isLocked: false,
      isCompleted: false,
      isInProgress: false,
      content: {
        playground: {
          title: 'Building a Full-Stack App',
          description: 'Create a complete application with frontend and backend',
          initialFiles: [
            {
              name: 'App.js',
              content: 'import React from "react";\n\nfunction App() {\n  return <div>My App</div>;\n}'
            }
          ],
          tasks: ['Set up API endpoints', 'Fetch data in React', 'Handle loading states']
        }
      }
    }
  ];
}

// Mock Blueprints Data
function createMockBlueprints(): Blueprint[] {
  return [
    {
      id: 'kanban-board',
      title: 'Build a Real-time Kanban Board',
      description: 'Create a collaborative project management tool with drag-and-drop functionality, real-time updates, and user authentication.',
      scenario: 'Your startup needs a project management tool to track development tasks. Build a Kanban board that allows team members to create, move, and update tasks in real-time.',
      category: 'fullstack',
      difficulty: 'intermediate',
      estimatedTime: '15-20 hours',
      prerequisites: ['React fundamentals', 'Node.js basics', 'Database concepts'],
      userStories: [
        'As a user, I can create an account and log in securely',
        'As a user, I can create, edit, and delete project boards',
        'As a user, I can add tasks to different columns (To Do, In Progress, Done)',
        'As a user, I can drag and drop tasks between columns',
        'As a user, I can see real-time updates when other users make changes',
        'As a user, I can assign tasks to team members',
        'As a user, I can add due dates and priority levels to tasks'
      ],
      technicalRequirements: [
        'Responsive design that works on desktop and mobile',
        'Real-time synchronization using WebSockets',
        'User authentication and authorization',
        'Data persistence with a database',
        'RESTful API design',
        'Error handling and loading states',
        'Unit and integration tests'
      ],
      concepts: [
        'Component state management',
        'API integration',
        'WebSocket communication',
        'Database design',
        'Authentication flows',
        'Drag and drop interactions',
        'Real-time data synchronization'
      ],
      isUnlocked: true,
      isStarted: false,
      isCompleted: false,
      progress: 0,
      technologies: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB', 'JWT'],
      deliverables: [
        'Fully functional Kanban board application',
        'User authentication system',
        'Real-time collaboration features',
        'Responsive UI/UX design',
        'API documentation',
        'Test suite with good coverage',
        'Deployment to cloud platform'
      ],
      architectureComponents: [
        {
          id: 'frontend',
          name: 'React Frontend',
          type: 'frontend',
          description: 'User interface with drag-and-drop functionality',
          position: { x: 100, y: 100 },
          connections: ['api-server'],
          technologies: ['React', 'CSS', 'Socket.io-client']
        },
        {
          id: 'api-server',
          name: 'Express API Server',
          type: 'backend',
          description: 'RESTful API and WebSocket server',
          position: { x: 300, y: 100 },
          connections: ['database', 'frontend'],
          technologies: ['Node.js', 'Express', 'Socket.io']
        },
        {
          id: 'database',
          name: 'MongoDB Database',
          type: 'database',
          description: 'Data storage for users, boards, and tasks',
          position: { x: 500, y: 100 },
          connections: ['api-server'],
          technologies: ['MongoDB', 'Mongoose']
        }
      ],
      initialFiles: {
        'package.json': {
          content: '{\n  "name": "kanban-board",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js"\n  }\n}',
          type: 'file',
          language: 'json'
        },
        'server.js': {
          content: '// Express server setup\nconst express = require(\'express\');\nconst app = express();\n\n// Your code here\n\napp.listen(3000, () => {\n  console.log(\'Server running on port 3000\');\n});',
          type: 'file',
          language: 'javascript'
        },
        'client/src/App.js': {
          content: 'import React from \'react\';\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Kanban Board</h1>\n      {/* Your components here */}\n    </div>\n  );\n}\n\nexport default App;',
          type: 'file',
          language: 'javascript'
        }
      },
      tests: [
        {
          id: 'auth-test',
          name: 'User Authentication',
          description: 'Users can register, login, and access protected routes',
          type: 'integration',
          status: 'pending'
        },
        {
          id: 'board-crud',
          name: 'Board CRUD Operations',
          description: 'Users can create, read, update, and delete boards',
          type: 'integration',
          status: 'pending'
        },
        {
          id: 'realtime-sync',
          name: 'Real-time Synchronization',
          description: 'Changes are synchronized across all connected clients',
          type: 'e2e',
          status: 'pending'
        }
      ]
    },
    {
      id: 'ecommerce-api',
      title: 'E-commerce REST API',
      description: 'Build a scalable backend API for an online store with products, orders, payments, and inventory management.',
      scenario: 'A local business wants to expand online. Create a robust API that can handle product catalogs, user orders, payment processing, and inventory tracking.',
      category: 'backend',
      difficulty: 'advanced',
      estimatedTime: '20-25 hours',
      prerequisites: ['Node.js advanced', 'Database design', 'API security'],
      userStories: [
        'As a customer, I can browse products with filtering and search',
        'As a customer, I can add products to cart and place orders',
        'As a customer, I can track my order status',
        'As an admin, I can manage product inventory',
        'As an admin, I can view sales analytics',
        'As a developer, I can integrate payment processing'
      ],
      technicalRequirements: [
        'RESTful API with proper HTTP methods',
        'Database schema design and optimization',
        'Authentication and authorization',
        'Payment gateway integration',
        'Rate limiting and security measures',
        'API documentation with Swagger',
        'Comprehensive error handling',
        'Performance optimization'
      ],
      concepts: [
        'API design patterns',
        'Database relationships',
        'Payment processing',
        'Security best practices',
        'Performance optimization',
        'Documentation standards'
      ],
      isUnlocked: false,
      isStarted: false,
      isCompleted: false,
      progress: 0,
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'Stripe', 'JWT', 'Redis'],
      deliverables: [
        'Complete REST API with all endpoints',
        'Database schema and migrations',
        'Payment integration',
        'API documentation',
        'Security implementation',
        'Performance benchmarks',
        'Deployment configuration'
      ],
      architectureComponents: [
        {
          id: 'api-gateway',
          name: 'API Gateway',
          type: 'api',
          description: 'Entry point for all API requests',
          position: { x: 100, y: 100 },
          connections: ['auth-service', 'product-service'],
          technologies: ['Express', 'Rate Limiting']
        },
        {
          id: 'auth-service',
          name: 'Authentication Service',
          type: 'service',
          description: 'User authentication and authorization',
          position: { x: 200, y: 200 },
          connections: ['database'],
          technologies: ['JWT', 'bcrypt']
        },
        {
          id: 'product-service',
          name: 'Product Service',
          type: 'service',
          description: 'Product catalog and inventory management',
          position: { x: 300, y: 200 },
          connections: ['database', 'cache'],
          technologies: ['Express', 'PostgreSQL']
        },
        {
          id: 'database',
          name: 'PostgreSQL Database',
          type: 'database',
          description: 'Primary data storage',
          position: { x: 400, y: 300 },
          connections: [],
          technologies: ['PostgreSQL']
        },
        {
          id: 'cache',
          name: 'Redis Cache',
          type: 'cache',
          description: 'Caching layer for performance',
          position: { x: 500, y: 200 },
          connections: [],
          technologies: ['Redis']
        }
      ],
      initialFiles: {
        'package.json': {
          content: '{\n  "name": "ecommerce-api",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node server.js",\n    "dev": "nodemon server.js"\n  }\n}',
          type: 'file',
          language: 'json'
        },
        'server.js': {
          content: '// E-commerce API server\nconst express = require(\'express\');\nconst app = express();\n\n// Middleware setup\napp.use(express.json());\n\n// Routes\n// TODO: Implement product routes\n// TODO: Implement user routes\n// TODO: Implement order routes\n\napp.listen(3000, () => {\n  console.log(\'E-commerce API running on port 3000\');\n});',
          type: 'file',
          language: 'javascript'
        }
      },
      tests: [
        {
          id: 'product-api',
          name: 'Product API Tests',
          description: 'CRUD operations for products work correctly',
          type: 'integration',
          status: 'pending'
        },
        {
          id: 'order-flow',
          name: 'Order Processing Flow',
          description: 'Complete order flow from cart to payment',
          type: 'e2e',
          status: 'pending'
        }
      ]
    }
  ];
}
