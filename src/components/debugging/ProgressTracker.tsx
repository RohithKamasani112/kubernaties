import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle,
  Circle,
  Clock,
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Award,
  Flag,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Terminal,
  Eye,
  FileText,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { useDebuggingStore } from '../../store/debuggingStore';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  type: 'observation' | 'command' | 'analysis' | 'fix' | 'verification';
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  command?: string;
  expectedOutput?: string;
  hints?: string[];
  points: number;
  estimatedTime: string;
  dependencies?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  emoji: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Using emoji instead of React node
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface GameStats {
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  streak: number;
  completionRate: number;
  averageTime: number;
  rank: string;
}

const ProgressTracker: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showHints, setShowHints] = useState(false);
  
  const { currentScenario, commandHistory, executeCommand } = useDebuggingStore();

  // Define progress steps based on current scenario
  const getProgressSteps = (): ProgressStep[] => {
    if (!currentScenario) return [];

    const baseSteps: ProgressStep[] = [
      {
        id: 'initial-assessment',
        title: '🔍 Initial Assessment',
        description: 'Get an overview of the cluster state and identify problematic resources',
        type: 'observation',
        status: 'pending',
        command: 'kubectl get pods --all-namespaces',
        points: 10,
        estimatedTime: '2 min',
        difficulty: 'beginner',
        category: 'Discovery',
        emoji: '🔍',
        hints: [
          '👀 Look for pods with unusual status (CrashLoopBackOff, Pending, Error)',
          '🔄 Check restart counts - high numbers indicate problems',
          '📋 Note any pending or failed pods for further investigation',
          '🏷️ Pay attention to namespaces and pod names'
        ]
      },
      {
        id: 'examine-events',
        title: '📋 Examine Cluster Events',
        description: 'Check recent cluster events for error messages and warnings',
        type: 'command',
        status: 'pending',
        command: 'kubectl get events --sort-by=.metadata.creationTimestamp --field-selector type!=Normal',
        points: 15,
        estimatedTime: '3 min',
        difficulty: 'beginner',
        category: 'Investigation',
        emoji: '📋',
        dependencies: ['initial-assessment'],
        hints: [
          '⏰ Focus on recent events (last few minutes/hours)',
          '⚠️ Look for Warning and Error event types',
          '🎯 Note which resources are affected by events',
          '🔗 Connect events to the problematic pods you found'
        ]
      },
      {
        id: 'check-node-health',
        title: '🖥️ Check Node Health',
        description: 'Verify that cluster nodes are healthy and have sufficient resources',
        type: 'command',
        status: 'pending',
        command: 'kubectl get nodes -o wide && kubectl top nodes',
        points: 12,
        estimatedTime: '2 min',
        difficulty: 'beginner',
        category: 'Infrastructure',
        emoji: '🖥️',
        dependencies: ['initial-assessment'],
        hints: [
          '✅ All nodes should be in Ready state',
          '💾 Check memory and CPU usage percentages',
          '🚫 Look for any NotReady or SchedulingDisabled nodes',
          '📊 High resource usage (>80%) can cause scheduling issues'
        ]
      }
    ];

    // Add scenario-specific steps
    switch (currentScenario.id) {
      case 'crashloop-1':
        return [
          ...baseSteps,
          {
            id: 'check-pod-logs',
            title: '📜 Analyze Pod Logs',
            description: 'Examine logs from the failing pod to identify the root cause of crashes',
            type: 'command',
            status: 'pending',
            command: 'kubectl logs nginx-deployment-abc123 --previous',
            points: 20,
            estimatedTime: '5 min',
            difficulty: 'intermediate',
            category: 'Debugging',
            emoji: '📜',
            dependencies: ['examine-events'],
            hints: [
              '🔍 Look for error messages and stack traces',
              '⚙️ Check for missing environment variables',
              '🚨 Note any panic or fatal error messages',
              '⏮️ Use --previous flag to see logs from crashed container'
            ]
          },
          {
            id: 'describe-pod',
            title: '🔬 Deep Dive Pod Analysis',
            description: 'Get detailed information about the pod configuration and current status',
            type: 'analysis',
            status: 'pending',
            command: 'kubectl describe pod nginx-deployment-abc123',
            points: 15,
            estimatedTime: '3 min',
            difficulty: 'intermediate',
            category: 'Analysis',
            emoji: '🔬',
            dependencies: ['check-pod-logs'],
            hints: [
              '📋 Check the Events section at the bottom',
              '🐳 Look at container status and restart count',
              '💾 Review resource limits and requests',
              '🔄 Note the restart policy and backoff'
            ]
          },
          {
            id: 'identify-root-cause',
            title: '🎯 Identify Root Cause',
            description: 'Analyze the evidence to identify the missing DATABASE_URL environment variable',
            type: 'analysis',
            status: 'pending',
            points: 25,
            estimatedTime: '5 min',
            difficulty: 'intermediate',
            category: 'Problem Solving',
            emoji: '🎯',
            dependencies: ['describe-pod'],
            hints: [
              '🔍 The error mentions a missing environment variable',
              '🗄️ DATABASE_URL is commonly required for web applications',
              '⚙️ Check deployment configuration for env vars',
              '🔗 Connect the error message to the missing configuration'
            ]
          },
          {
            id: 'fix-environment',
            title: '🔧 Apply Configuration Fix',
            description: 'Add the missing environment variable to resolve the crash loop',
            type: 'fix',
            status: 'pending',
            command: 'kubectl set env deployment/nginx-deployment DATABASE_URL=postgresql://localhost:5432/mydb',
            points: 30,
            estimatedTime: '3 min',
            dependencies: ['identify-missing-env'],
            hints: ['Use kubectl set env command', 'Set a valid database URL', 'The deployment will automatically restart']
          },
          {
            id: 'verify-fix',
            title: 'Verify the Fix',
            description: 'Confirm that the pod is now running successfully',
            type: 'verification',
            status: 'pending',
            command: 'kubectl get pods',
            points: 20,
            estimatedTime: '2 min',
            dependencies: ['fix-environment'],
            hints: ['Pod should show Running status', 'Restart count should stabilize', 'No more crash events']
          }
        ];

      case 'imagepull-1':
        return [
          ...baseSteps,
          {
            id: 'check-image-status',
            title: 'Check Image Pull Status',
            description: 'Examine why the container image cannot be pulled',
            type: 'command',
            status: 'pending',
            command: 'kubectl describe pod frontend-deployment-ghi789',
            points: 20,
            estimatedTime: '4 min',
            dependencies: ['examine-events'],
            hints: ['Look for ImagePullBackOff status', 'Check the Events section', 'Note the exact error message']
          },
          {
            id: 'verify-image-name',
            title: 'Verify Image Name and Tag',
            description: 'Check if the image name and tag are correct',
            type: 'analysis',
            status: 'pending',
            points: 25,
            estimatedTime: '5 min',
            dependencies: ['check-image-status'],
            hints: ['Check deployment YAML', 'Verify image registry', 'Confirm tag exists']
          },
          {
            id: 'fix-image-reference',
            title: 'Fix Image Reference',
            description: 'Update the deployment with the correct image reference',
            type: 'fix',
            status: 'pending',
            command: 'kubectl set image deployment/frontend-deployment frontend=nginx:latest',
            points: 30,
            estimatedTime: '3 min',
            dependencies: ['verify-image-name'],
            hints: ['Use a public image for testing', 'nginx:latest is always available', 'Update will trigger new deployment']
          }
        ];

      default:
        return baseSteps;
    }
  };

  const progressSteps = getProgressSteps();

  // Game stats calculation
  const calculateGameStats = (): GameStats => {
    const completedCount = completedSteps.size;
    const totalSteps = progressSteps.length;
    const completionRate = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

    // Calculate level based on total points
    const level = Math.floor(totalPoints / 100) + 1;
    const experiencePoints = totalPoints % 100;
    const experienceToNextLevel = 100 - experiencePoints;

    // Calculate rank based on completion rate and points
    const rank = totalPoints >= 500 ? '🏆 Kubernetes Master' :
                totalPoints >= 300 ? '⭐ Senior Engineer' :
                totalPoints >= 150 ? '🔧 DevOps Specialist' :
                totalPoints >= 50 ? '📚 Junior Developer' : '🌱 Beginner';

    return {
      totalPoints,
      level,
      experiencePoints,
      experienceToNextLevel,
      streak: 0, // Would track consecutive days in real implementation
      completionRate,
      averageTime: 0, // Would calculate from session data
      rank
    };
  };

  // Initialize achievements with enhanced game elements
  useEffect(() => {
    setAchievements([
      {
        id: 'first-command',
        title: '🚀 First Steps',
        description: 'Execute your first kubectl command',
        icon: '🚀',
        unlocked: false,
        rarity: 'common',
        points: 10
      },
      {
        id: 'log-detective',
        title: '🔍 Log Detective',
        description: 'Successfully analyze pod logs to find issues',
        icon: '🔍',
        unlocked: false,
        rarity: 'common',
        points: 25
      },
      {
        id: 'problem-solver',
        title: '🏆 Problem Solver',
        description: 'Complete your first debugging scenario',
        icon: '🏆',
        unlocked: false,
        rarity: 'rare',
        points: 50
      },
      {
        id: 'speed-demon',
        title: '⚡ Speed Demon',
        description: 'Complete a scenario in under 10 minutes',
        icon: '⚡',
        unlocked: false,
        rarity: 'epic',
        points: 75
      },
      {
        id: 'perfectionist',
        title: '⭐ Perfectionist',
        description: 'Complete all steps without skipping any',
        icon: '⭐',
        unlocked: false,
        rarity: 'epic',
        points: 100
      },
      {
        id: 'crash-loop-master',
        title: '🔄 CrashLoop Master',
        description: 'Successfully resolve a CrashLoopBackOff issue',
        icon: '🔄',
        unlocked: false,
        rarity: 'rare',
        points: 60
      },
      {
        id: 'network-ninja',
        title: '🌐 Network Ninja',
        description: 'Diagnose and fix network connectivity issues',
        icon: '🌐',
        unlocked: false,
        rarity: 'epic',
        points: 80
      },
      {
        id: 'resource-guru',
        title: '💾 Resource Guru',
        description: 'Resolve resource-related scheduling problems',
        icon: '💾',
        unlocked: false,
        rarity: 'rare',
        points: 65
      },
      {
        id: 'kubernetes-legend',
        title: '👑 Kubernetes Legend',
        description: 'Achieve 500+ total points across all scenarios',
        icon: '👑',
        unlocked: false,
        rarity: 'legendary',
        points: 200
      }
    ]);
  }, []);

  // Track command execution and update progress
  useEffect(() => {
    if (commandHistory.length > 0) {
      const lastCommand = commandHistory[commandHistory.length - 1];
      
      // Check if command matches any step
      const matchingStep = progressSteps.find(step => 
        step.command && lastCommand.command.includes(step.command.split(' ')[1])
      );

      if (matchingStep && !completedSteps.has(matchingStep.id)) {
        markStepCompleted(matchingStep.id);
      }

      // Check for achievements
      checkAchievements();
    }
  }, [commandHistory]);

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    const step = progressSteps.find(s => s.id === stepId);
    if (step) {
      setTotalPoints(prev => prev + step.points);
    }
    
    // Auto-advance to next step
    const currentIndex = progressSteps.findIndex(s => s.id === stepId);
    const nextStep = progressSteps[currentIndex + 1];
    if (nextStep && canStartStep(nextStep)) {
      setCurrentStep(nextStep.id);
    }
  };

  const canStartStep = (step: ProgressStep): boolean => {
    if (!step.dependencies) return true;
    return step.dependencies.every(dep => completedSteps.has(dep));
  };

  const checkAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      switch (achievement.id) {
        case 'first-command':
          shouldUnlock = commandHistory.length >= 1;
          break;
        case 'log-detective':
          shouldUnlock = commandHistory.some(cmd => cmd.command.includes('logs'));
          break;
        case 'problem-solver':
          shouldUnlock = completedSteps.size >= progressSteps.length;
          break;
        case 'speed-demon':
          const elapsed = (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60;
          shouldUnlock = completedSteps.size >= progressSteps.length && elapsed < 10;
          break;
        case 'perfectionist':
          shouldUnlock = completedSteps.size >= progressSteps.length && 
                        progressSteps.every(step => completedSteps.has(step.id));
          break;
      }

      if (shouldUnlock) {
        return { ...achievement, unlocked: true, unlockedAt: new Date() };
      }
      return achievement;
    }));
  };

  const getStepIcon = (type: string, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    
    switch (type) {
      case 'observation': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'command': return <Terminal className="w-5 h-5 text-purple-600" />;
      case 'analysis': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'fix': return <Settings className="w-5 h-5 text-orange-600" />;
      case 'verification': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'in-progress': return 'border-blue-200 bg-blue-50';
      case 'pending': return 'border-slate-200 bg-slate-50';
      case 'skipped': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const executeStepCommand = async (step: ProgressStep) => {
    if (step.command) {
      setCurrentStep(step.id);
      await executeCommand(step.command);
    }
  };

  const skipStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    // Don't award points for skipped steps
  };

  const completionPercentage = (completedSteps.size / progressSteps.length) * 100;
  const gameStats = calculateGameStats();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Enhanced Header with Game Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200 p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">🎮 Progress Tracker</h3>
              <p className="text-sm text-slate-600">Level up your Kubernetes debugging skills!</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Level and XP */}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Lv.{gameStats.level}</div>
              <div className="text-xs text-slate-600">Level</div>
            </div>

            {/* Points */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameStats.totalPoints}</div>
              <div className="text-xs text-slate-600">Points</div>
            </div>

            {/* Completion */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(completionPercentage)}%</div>
              <div className="text-xs text-slate-600">Complete</div>
            </div>

            {/* Rank */}
            <div className="text-center">
              <div className="text-sm font-bold text-orange-600">{gameStats.rank}</div>
              <div className="text-xs text-slate-600">Rank</div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Experience: {gameStats.experiencePoints}/100 XP
            </span>
            <span className="text-sm text-slate-500">
              {gameStats.experienceToNextLevel} XP to next level
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${gameStats.experiencePoints}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Enhanced Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">
                📋 {completedSteps.size} of {progressSteps.length} objectives completed
              </span>
              <div className="flex items-center space-x-2">
                {progressSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-all ${
                      completedSteps.has(step.id)
                        ? 'bg-green-500 shadow-lg'
                        : currentStep === step.id
                        ? 'bg-blue-500 animate-pulse'
                        : canStartStep(step)
                        ? 'bg-slate-300'
                        : 'bg-slate-200'
                    }`}
                    title={step.title}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all shadow-sm ${
                  showHints
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span className="text-base">💡</span>
                <span>Hints</span>
              </button>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
            <motion.div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-4 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {completionPercentage === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎉</span>
                <div>
                  <h4 className="font-semibold text-green-800">Scenario Complete!</h4>
                  <p className="text-sm text-green-700">You've mastered this debugging challenge!</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Steps List */}
        <div className="space-y-4 mb-6">
          {progressSteps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const canStart = canStartStep(step);
            const status = isCompleted ? 'completed' :
                         isCurrent ? 'in-progress' :
                         canStart ? 'pending' : 'locked';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg transition-all shadow-sm hover:shadow-md ${getStepColor(status)} ${
                  isCurrent ? 'ring-2 ring-blue-400 shadow-lg' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Step Number and Status */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? 'bg-blue-500 text-white animate-pulse' :
                        canStart ? 'bg-slate-300 text-slate-700' :
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-slate-900 text-lg">{step.title}</h4>
                          <span className="text-2xl">{step.emoji}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Difficulty Badge */}
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            step.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            step.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            step.difficulty === 'advanced' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {step.difficulty}
                          </span>

                          {/* Points */}
                          <span className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-300">
                            🏆 {step.points} pts
                          </span>

                          {/* Time */}
                          <span className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-full border border-slate-300">
                            ⏱️ {step.estimatedTime}
                          </span>

                          {/* Category */}
                          <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full border border-purple-300">
                            📂 {step.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-4 leading-relaxed">{step.description}</p>
                  
                  {/* Command */}
                  {step.command && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between bg-slate-900 text-green-400 p-2 rounded text-sm">
                        <code>{step.command}</code>
                        {!isCompleted && canStart && (
                          <button
                            onClick={() => executeStepCommand(step)}
                            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                          >
                            Run
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Hints */}
                  {showHints && step.hints && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center space-x-1 mb-1">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Hints:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {step.hints.map((hint, idx) => (
                          <li key={idx} className="text-sm text-yellow-700">{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Actions */}
                  {!isCompleted && canStart && (
                    <div className="flex items-center space-x-2">
                      {!step.command && (
                        <button
                          onClick={() => markStepCompleted(step.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Mark Complete</span>
                        </button>
                      )}
                      <button
                        onClick={() => skipStep(step.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700"
                      >
                        <span>Skip</span>
                      </button>
                    </div>
                  )}
                    </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>

      {/* Achievements */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
          <Award className="w-4 h-4" />
          <span>Achievements</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {achievements.map(achievement => (
            <motion.div
              key={achievement.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                achievement.unlocked 
                  ? 'border-yellow-200 bg-yellow-50 text-yellow-800' 
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
              whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
            >
              <div className={`mx-auto mb-2 ${achievement.unlocked ? 'text-yellow-600' : 'text-slate-400'}`}>
                {achievement.icon}
              </div>
              <div className="text-xs font-medium">{achievement.title}</div>
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="text-xs text-yellow-600 mt-1">
                  Unlocked!
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
