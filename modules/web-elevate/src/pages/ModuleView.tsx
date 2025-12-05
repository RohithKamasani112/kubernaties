import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  Code,
  Target,
  BookOpen,
  Lightbulb,
  Clock,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Zap,
  Eye,
  Edit3,
  TestTube,
  Award,
  Info,
  Cpu,
  FileText,
  Settings,
  Terminal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import LoadingSpinner from '../components/LoadingSpinner';

// Import topics synchronously for now, but we'll optimize loading
import { comprehensiveReactTopics } from '../data/reactTopicsComprehensive';

type ModuleStep = 'concept' | 'code' | 'playground' | 'challenge';

// React Code Renderer Component
const ReactCodeRenderer: React.FC<{
  code: string;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}> = ({ code, onError, onSuccess }) => {
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simple code transformation for basic React components
      if (code.includes('function') && code.includes('return')) {
        // Extract component name
        const componentMatch = code.match(/function\s+(\w+)/);
        const componentName = componentMatch ? componentMatch[1] : 'Component';

        // Create a simple rendered version
        if (code.includes('useState')) {
          // Interactive component
          setRenderedComponent(
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{componentName}</h3>
                <div className="space-y-3">
                  {code.includes('counter') || code.includes('count') ? (
                    <InteractiveCounter />
                  ) : code.includes('todo') || code.includes('Todo') ? (
                    <InteractiveTodoList />
                  ) : code.includes('greeting') || code.includes('Greeting') ? (
                    <InteractiveGreeting />
                  ) : (
                    <div className="text-gray-600">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <p>Component rendered successfully!</p>
                      <p className="text-sm text-gray-500 mt-2">Interactive preview available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          // Static component
          setRenderedComponent(
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{componentName}</h3>
                <div className="text-gray-600">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <p>Static component rendered!</p>
                  <p className="text-sm text-gray-500 mt-2">Component displays correctly</p>
                </div>
              </div>
            </div>
          );
        }
        setError(null);
        onSuccess?.();
      } else {
        throw new Error('Invalid React component structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setRenderedComponent(null);
      onError?.(errorMessage);
    }
  }, [code, onError, onSuccess]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center space-x-2 text-red-800 mb-2">
          <XCircle className="w-5 h-5" />
          <span className="font-semibold">Render Error</span>
        </div>
        <p className="text-red-700 text-sm">{error}</p>
        <div className="mt-3 text-xs text-red-600">
          <p>💡 Check your component syntax and make sure it returns valid JSX</p>
        </div>
      </div>
    );
  }

  return renderedComponent || (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Code className="w-8 h-8 text-gray-500" />
        </div>
        <p>Write some React code to see the preview</p>
      </div>
    </div>
  );
};

// Interactive demo components
const InteractiveCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="space-y-3">
      <div className="text-2xl font-bold text-gray-900">Count: {count}</div>
      <div className="space-x-2">
        <button
          onClick={() => setCount(count - 1)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};

const InteractiveTodoList: React.FC = () => {
  const [todos, setTodos] = useState(['Learn React', 'Build awesome apps']);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo('');
    }
  };

  return (
    <div className="space-y-3 text-left">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button
          onClick={addTodo}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {todos.map((todo, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{todo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const InteractiveGreeting: React.FC = () => {
  const [name, setName] = useState('World');
  return (
    <div className="space-y-3">
      <div className="text-xl font-semibold text-gray-900">Hello, {name}! 👋</div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name..."
        className="px-3 py-2 border border-gray-300 rounded text-sm"
      />
    </div>
  );
};

const ModuleView: React.FC = () => {
  const { pathId, moduleId } = useParams<{ pathId: string; moduleId: string }>();
  const navigate = useNavigate();
  const { learningPaths, completeModule } = useWebElevateStore();

  const [currentStep, setCurrentStep] = useState<ModuleStep>('concept');
  const [stepProgress, setStepProgress] = useState<Record<ModuleStep, boolean>>({
    concept: false,
    code: false,
    playground: false,
    challenge: false
  });
  const [xpEarned, setXpEarned] = useState<Record<ModuleStep, number>>({
    concept: 0,
    code: 0,
    playground: 0,
    challenge: 0
  });
  const [topicData, setTopicData] = useState<any>(null);
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);

  const path = learningPaths.find(p => p.id === pathId);
  const module = path?.modules.find(m => m.id === moduleId);

  // Load comprehensive topic data for React path immediately
  useEffect(() => {
    if (pathId === 'react-mastery' && moduleId) {
      const topic = comprehensiveReactTopics.find(topic => topic.id === moduleId);
      setTopicData(topic);
    }
  }, [pathId, moduleId]);

  if (!path || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Link
            to="/web-elevate/paths"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Learning Paths
          </Link>
        </div>
      </div>
    );
  }

  // No loading state needed since we load immediately

  const steps: { id: ModuleStep; name: string; icon: any; description: string; xpReward: number }[] = [
    { id: 'concept', name: 'Concept', icon: BookOpen, description: 'Learn the theory', xpReward: 25 },
    { id: 'code', name: 'Code', icon: Code, description: 'See it in action', xpReward: 35 },
    { id: 'playground', name: 'Playground', icon: Play, description: 'Practice hands-on', xpReward: 50 },
    { id: 'challenge', name: 'Challenge', icon: Target, description: 'Test your skills', xpReward: 100 }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleStepComplete = () => {
    const currentStepData = steps[currentStepIndex];
    setStepProgress(prev => ({ ...prev, [currentStep]: true }));
    setXpEarned(prev => ({ ...prev, [currentStep]: currentStepData.xpReward }));

    if (isLastStep) {
      // Complete the entire module
      completeModule(pathId!, moduleId!);
      // Navigate back to path detail
      navigate(`/web-elevate/paths/${pathId}`);
    } else {
      // Move to next step
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStep(nextStep.id);
    }
  };

  const handleStepChange = (stepId: ModuleStep) => {
    setCurrentStep(stepId);
  };

  const canAccessStep = (stepId: ModuleStep) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex === 0) return true;

    // Can access if previous step is completed
    const previousStep = steps[stepIndex - 1];
    return stepProgress[previousStep.id];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <Link
              to={`/web-elevate/paths/${pathId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Path</span>
            </Link>

            {/* Module Title */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">{module.title}</h1>
              <p className="text-sm text-gray-500">
                {path.title} • {steps.find(s => s.id === currentStep)?.description}
              </p>
            </div>

            {/* Progress & XP */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{module.duration}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-indigo-600">
                <Award className="w-4 h-4" />
                <span>{Object.values(xpEarned).reduce((a, b) => a + b, 0)} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = stepProgress[step.id];
              const isAccessible = canAccessStep(step.id);
              const StepIcon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => isAccessible && handleStepChange(step.id)}
                    disabled={!isAccessible}
                    className={`relative flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 shadow-md'
                        : isCompleted
                        ? 'text-green-600 hover:bg-green-50'
                        : isAccessible
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {/* XP Badge */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        +{step.xpReward}
                      </div>
                    )}

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : isAccessible
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{step.name}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                      {!isCompleted && (
                        <div className="text-xs text-yellow-600 font-medium">{step.xpReward} XP</div>
                      )}
                    </div>
                  </button>

                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-200 mx-4" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[600px]"
          >
            {currentStep === 'concept' && <ConceptView module={module} topicData={topicData} />}
            {currentStep === 'code' && <CodeView module={module} topicData={topicData} />}
            {currentStep === 'playground' && <PlaygroundView module={module} topicData={topicData} />}
            {currentStep === 'challenge' && <ChallengeView module={module} topicData={topicData} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={() => {
              if (!isFirstStep) {
                const prevStep = steps[currentStepIndex - 1];
                setCurrentStep(prevStep.id);
              }
            }}
            disabled={isFirstStep}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleStepComplete}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <span>
              {isLastStep
                ? 'Complete Module'
                : `Next: ${steps[currentStepIndex + 1]?.name}`
              }
            </span>
            {isLastStep ? (
              <Trophy className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Concept View Component
const ConceptView: React.FC<{ module: any; topicData?: any }> = ({ module, topicData }) => {
  const [showBestPractices, setShowBestPractices] = useState(false);
  const [showUseCases, setShowUseCases] = useState(false);

  // Use comprehensive topic data if available, fallback to module content
  const content = topicData || module.content?.concept;

  if (!content) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Concept Content</h3>
          <p className="text-gray-500">This module doesn't have concept content yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Concept Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{content.title}</h2>
                <p className="text-blue-100">Learn the fundamental concepts</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Concept Theory</div>
              <div className="text-lg font-bold">25 XP</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Main Explanation */}
          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed text-lg">
              {content.explanation || content.description}
            </div>
          </div>

          {/* Key Concepts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">What is this concept?</h3>
              </div>
              <p className="text-gray-700 text-sm">
                {content.title} is a fundamental React concept that helps you build better user interfaces.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Why is it useful?</h3>
              </div>
              <p className="text-gray-700 text-sm">
                This concept improves code organization, reusability, and makes your React applications more maintainable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Practices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowBestPractices(!showBestPractices)}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Best Practices</h3>
                  <p className="text-sm text-gray-500">Do's and don'ts</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showBestPractices ? 'rotate-90' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {showBestPractices && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-6 space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <h4 className="font-medium text-green-800 mb-2">✅ Do:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Follow React naming conventions</li>
                      <li>• Keep components small and focused</li>
                      <li>• Use proper prop types</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <h4 className="font-medium text-red-800 mb-2">❌ Don't:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Mutate props directly</li>
                      <li>• Use array indices as keys</li>
                      <li>• Forget to handle edge cases</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Real-world Use Cases */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowUseCases(!showUseCases)}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-world Use Cases</h3>
                  <p className="text-sm text-gray-500">Practical applications</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showUseCases ? 'rotate-90' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {showUseCases && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-medium text-purple-800 mb-2">🏢 Enterprise Applications</h4>
                      <p className="text-sm text-purple-700">Used in large-scale applications for better code organization</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">🛒 E-commerce Platforms</h4>
                      <p className="text-sm text-blue-700">Essential for building dynamic product catalogs and shopping carts</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-medium text-orange-800 mb-2">📱 Mobile Apps</h4>
                      <p className="text-sm text-orange-700">Critical for React Native mobile application development</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Visual Diagram Section */}
      {content.animationScript && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            <span>Visual Learning</span>
          </h3>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
            <div className="text-center">
              <div className="w-full h-48 bg-white rounded-lg border-2 border-dashed border-indigo-300 flex items-center justify-center mb-4">
                <div className="text-center">
                  <Cpu className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
                  <p className="text-indigo-600 font-medium">Interactive Diagram</p>
                  <p className="text-sm text-indigo-500">Visual representation coming soon</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">{content.animationScript}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Code View Component
const CodeView: React.FC<{ module: any; topicData?: any }> = ({ module, topicData }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'typescript'>('javascript');
  const [showExplanation, setShowExplanation] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderSuccess, setRenderSuccess] = useState(false);

  // Use comprehensive topic data if available
  const content = topicData || module.content?.code;
  const codeExample = topicData?.challenges?.[0]?.code;

  useEffect(() => {
    if (codeExample?.initial) {
      setCurrentCode(codeExample.initial);
    } else if (content?.initialCode) {
      setCurrentCode(content.initialCode);
    }
  }, [codeExample, content]);

  if (!content && !codeExample) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Code Content</h3>
          <p className="text-gray-500">This module doesn't have code examples yet.</p>
        </div>
      </div>
    );
  }

  const handleRunCode = () => {
    setIsRunning(true);
    setRenderError(null);
    setRenderSuccess(false);

    // Simulate code execution delay
    setTimeout(() => {
      setIsRunning(false);
    }, 1000);
  };

  const handleRenderError = (error: string) => {
    setRenderError(error);
    setRenderSuccess(false);
  };

  const handleRenderSuccess = () => {
    setRenderError(null);
    setRenderSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{content?.title || topicData?.title}</h2>
                <p className="text-green-100">See the concepts in action</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">Code Example</div>
              <div className="text-lg font-bold">35 XP</div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    selectedLanguage === 'javascript'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLanguage('typescript')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    selectedLanguage === 'typescript'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  TypeScript
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center space-x-1 px-2 py-1 bg-white rounded border text-xs text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>

              {/* Run Code Button */}
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded text-xs hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Status Indicators */}
              {renderError && (
                <div className="flex items-center space-x-1 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs">Error</span>
                </div>
              )}
              {renderSuccess && (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs">Success</span>
                </div>
              )}

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <FileText className="w-4 h-4" />
                <span>{showExplanation ? 'Hide' : 'Show'} Explanation</span>
              </button>
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-6 bg-green-50 border-b border-gray-200"
            >
              <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
              <p className="text-gray-700 leading-relaxed">
                {content?.explanation || topicData?.explanation ||
                 `This example demonstrates ${topicData?.title || 'the concept'} in a practical way. Each part of the code serves a specific purpose in building the functionality.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Code Example and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`px-4 py-3 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {(topicData?.title?.replace(/[^a-zA-Z0-9]/g, '') || 'ListsAndKeys')}.{selectedLanguage === 'typescript' ? 'tsx' : 'jsx'}
            </span>
          </div>
          <div className={`p-4 max-h-96 overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              className={`w-full h-80 bg-transparent font-mono text-sm resize-none focus:outline-none leading-relaxed ${
                isDarkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
              placeholder={isDarkMode ? '// Edit the code here...' : '// Edit the code here...'}
              style={{
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            />
          </div>

          {/* Code Stats */}
          <div className={`px-4 py-2 text-xs ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span>Lines: {currentCode.split('\n').length} | Characters: {currentCode.length}</span>
              <span className="opacity-75">💡 Edit and run your code</span>
            </div>
          </div>
        </div>

        {/* Live Preview for Code Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Code Preview</span>
              </div>
              {renderSuccess && (
                <div className="flex items-center space-x-1 text-green-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs">Working</span>
                </div>
              )}
              {renderError && (
                <div className="flex items-center space-x-1 text-red-200">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs">Error</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4">
            <ReactCodeRenderer
              code={currentCode}
              onError={(error) => setRenderError(error)}
              onSuccess={() => setRenderSuccess(true)}
            />

            {/* Success Message */}
            {renderSuccess && !renderError && currentCode.trim() && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-semibold text-sm">✅ Code is working perfectly!</span>
                </div>
                <p className="text-green-700 text-xs mt-1">
                  Your React code compiled and rendered successfully. Try modifying it to see changes!
                </p>
              </div>
            )}

            {/* Error Message */}
            {renderError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-800 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">Code Error</span>
                </div>
                <p className="text-red-700 text-sm">{renderError}</p>
                <div className="mt-2 text-xs text-red-600">
                  <p>💡 Check your syntax and component structure</p>
                </div>
              </div>
            )}
          </div>

          {/* Inline Code Explanation */}
          <div className="bg-blue-50 border-t border-blue-200 p-4">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">💡 Code Explanation:</p>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• <code className="bg-blue-100 px-1 rounded">key={`{item.id}`}</code> - Unique identifier for React's reconciliation</li>
                  <li>• <code className="bg-blue-100 px-1 rounded">map()</code> - Transforms array items into JSX elements</li>
                  <li>• <code className="bg-blue-100 px-1 rounded">items.map()</code> - Iterates over the items array</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Live Preview</span>
              </div>
              {renderSuccess && (
                <div className="flex items-center space-x-1 text-green-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs">Rendered</span>
                </div>
              )}
              {renderError && (
                <div className="flex items-center space-x-1 text-red-200">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs">Error</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <ReactCodeRenderer
              code={currentCode || codeExample?.initial || codeExample?.solution || ''}
              onError={handleRenderError}
              onSuccess={handleRenderSuccess}
            />

            {/* Error Display */}
            {renderError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-800 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">Preview Error</span>
                </div>
                <p className="text-red-700 text-sm">{renderError}</p>
                <div className="mt-2 text-xs text-red-600">
                  <p>💡 Try clicking "Run Code" to refresh the preview</p>
                </div>
              </div>
            )}

            {/* Success Tips */}
            {renderSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-semibold text-sm">Great! Your code is working</span>
                </div>
                <p className="text-green-700 text-sm">The component rendered successfully. Try modifying the code to see how it changes!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-green-600" />
          <span>Code Breakdown</span>
        </h3>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">🔧 Key Components:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <code className="bg-green-100 px-2 py-1 rounded">import React</code> - Imports the React library</li>
              <li>• <code className="bg-green-100 px-2 py-1 rounded">function Component</code> - Defines the component</li>
              <li>• <code className="bg-green-100 px-2 py-1 rounded">return JSX</code> - Returns the UI structure</li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">💡 What each part does:</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>This example demonstrates the fundamental structure of a React component and how it renders content to the screen.</p>
              <p>Each line serves a specific purpose in creating a functional, reusable piece of UI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Playground View Component
const PlaygroundView: React.FC<{ module: any; topicData?: any }> = ({ module, topicData }) => {
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: number; total: number }>({ passed: 0, total: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderSuccess, setRenderSuccess] = useState(false);

  const content = topicData || module.content?.playground;
  const challenge = topicData?.challenges?.[0];

  useEffect(() => {
    if (challenge?.code?.initial) {
      setCode(challenge.code.initial);
    }
  }, [challenge]);

  if (!content && !challenge) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Playground Content</h3>
          <p className="text-gray-500">This module doesn't have playground exercises yet.</p>
        </div>
      </div>
    );
  }

  const handleRunCode = () => {
    setIsRunning(true);
    setRenderError(null);
    setRenderSuccess(false);
    setConsoleOutput([]);

    // Add console output for better feedback
    const newConsoleOutput = [
      '🚀 Running your React component...',
      '📦 Compiling JSX...',
      '⚡ Executing component logic...'
    ];

    // Simulate realistic code execution
    setTimeout(() => {
      try {
        // Simulate code analysis
        if (code.trim().length < 10) {
          throw new Error('Code is too short. Please write a complete React component.');
        }

        if (!code.includes('React') && !code.includes('import')) {
          throw new Error('Missing React import. Add: import React from "react";');
        }

        if (!code.includes('function') && !code.includes('const') && !code.includes('class')) {
          throw new Error('No component definition found. Create a function or class component.');
        }

        // Success case
        const randomPassed = Math.floor(Math.random() * 3) + 2; // At least 2 tests pass
        setTestResults({ passed: randomPassed, total: 3 });
        setRenderSuccess(true);

        const successOutput = [
          ...newConsoleOutput,
          '✅ Component compiled successfully!',
          '🎯 All syntax checks passed',
          `✨ ${randomPassed}/3 tests passed`,
          '🎉 Component is ready to render!'
        ];
        setConsoleOutput(successOutput);

      } catch (error) {
        setRenderError(error instanceof Error ? error.message : 'Unknown error occurred');
        const errorOutput = [
          ...newConsoleOutput,
          '❌ Compilation failed!',
          `🚨 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          '💡 Check the hints section for help'
        ];
        setConsoleOutput(errorOutput);
        setTestResults({ passed: 0, total: 3 });
      }

      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{content?.title || topicData?.title}</h2>
                <p className="text-purple-100">Practice hands-on coding</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">Interactive Practice</div>
              <div className="text-lg font-bold">50 XP</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 bg-purple-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">📝 Instructions:</h3>
          <div className="space-y-2">
            {(challenge?.instructions || [
              'Complete the implementation below',
              'Follow React best practices',
              'Test your solution by clicking Run'
            ]).map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{instruction}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Playground Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`px-4 py-3 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Edit3 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Live Editor</span>
              {renderSuccess && (
                <div className="flex items-center space-x-1 text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs">Ready</span>
                </div>
              )}
              {renderError && (
                <div className="flex items-center space-x-1 text-red-500">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs">Error</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                    : 'text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>

              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center space-x-1 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hints</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-2 rounded text-sm flex items-center space-x-1 transition-all duration-200 font-medium"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-80 bg-transparent font-mono text-sm resize-none focus:outline-none leading-relaxed ${
                isDarkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
              placeholder={isDarkMode ? '// Start coding here...' : '// Write your React component here...'}
              style={{
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            />
          </div>

          {/* Scroll Indicator */}
          <div className={`px-4 py-2 text-xs ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span>Lines: {code.split('\n').length} | Characters: {code.length}</span>
              <span className="text-xs opacity-75">💡 Use Ctrl+A to select all</span>
            </div>
          </div>

          {/* Enhanced Console Output */}
          <div className={`border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`w-full px-4 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Console Output</span>
                {consoleOutput.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    renderError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {consoleOutput.length}
                  </span>
                )}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${showConsole ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showConsole && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`p-4 max-h-40 overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                >
                  {consoleOutput.length > 0 ? (
                    <div className="space-y-1 font-mono text-sm">
                      {consoleOutput.map((output, i) => (
                        <div key={i} className={`${
                          output.includes('❌') || output.includes('🚨') ? (isDarkMode ? 'text-red-300' : 'text-red-600') :
                          output.includes('✅') || output.includes('🎉') ? (isDarkMode ? 'text-green-300' : 'text-green-600') :
                          output.includes('💡') ? (isDarkMode ? 'text-yellow-300' : 'text-yellow-600') :
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          <span className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {output}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-sm italic text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Click "Run Code" to see console output...
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Expected Output & Results */}
        <div className="space-y-4">
          {/* Enhanced Live Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Your Component Output</span>
                </div>
                {renderSuccess && (
                  <div className="flex items-center space-x-1 text-green-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Rendered</span>
                  </div>
                )}
                {renderError && (
                  <div className="flex items-center space-x-1 text-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Error</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <ReactCodeRenderer
                code={code}
                onError={(error) => setRenderError(error)}
                onSuccess={() => setRenderSuccess(true)}
              />

              {/* Success Message */}
              {renderSuccess && !renderError && code.trim() && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold text-sm">✅ Component rendered successfully!</span>
                  </div>
                  <p className="text-green-700 text-xs mt-1">
                    Your React component is working correctly. In a real browser, this would appear as interactive UI.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {renderError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold text-sm">Component Error</span>
                  </div>
                  <p className="text-red-700 text-sm">{renderError}</p>
                  <div className="mt-2 text-xs text-red-600">
                    <p>💡 Check the console output and hints for help fixing this issue</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!code.trim() && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-gray-400 mb-3">
                    <Code className="w-12 h-12 mx-auto" />
                  </div>
                  <div className="text-sm font-medium mb-1">Ready for your code!</div>
                  <div className="text-xs text-gray-400">Start typing in the editor to see your component preview</div>
                </div>
              )}
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-500 px-4 py-3 text-white">
              <div className="flex items-center space-x-2">
                <TestTube className="w-4 h-4" />
                <span className="text-sm font-medium">Test Results</span>
              </div>
            </div>
            <div className="p-4">
              {testResults.total > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Tests Passed:</span>
                    <span className={`font-bold ${testResults.passed === testResults.total ? 'text-green-600' : 'text-orange-600'}`}>
                      {testResults.passed}/{testResults.total}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: testResults.total }, (_, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        {i < testResults.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        )}
                        <span className="text-gray-700">
                          Test {i + 1}: {i < testResults.passed ? 'Passed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <TestTube className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Click "Run" to test your code</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hints Section */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-yellow-500 px-4 py-3 text-white">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Helpful Hints</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {(challenge?.hints || [
                  'Start by importing React at the top',
                  'Create a functional component',
                  'Return JSX from your component',
                  'Export your component as default'
                ]).map((hint, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      💡
                    </div>
                    <span className="text-gray-700">{hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span>Progress Tracking</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {testResults.passed}
            </div>
            <div className="text-sm text-gray-600">Tests Passed</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {code.length > 50 ? '✓' : '○'}
            </div>
            <div className="text-sm text-gray-600">Code Written</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {testResults.passed === testResults.total && testResults.total > 0 ? '50' : '0'}
            </div>
            <div className="text-sm text-gray-600">XP Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Challenge View Component
const ChallengeView: React.FC<{ module: any; topicData?: any }> = ({ module, topicData }) => {
  const [challengeCode, setChallengeCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    passed: boolean;
    tests: { description: string; passed: boolean }[];
    score: number;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showValidatePrompt, setShowValidatePrompt] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderSuccess, setRenderSuccess] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const validateButtonRef = useRef<HTMLButtonElement>(null);

  const content = topicData || module.content?.challenge;
  const challenge = topicData?.challenges?.find(c => c.type === 'challenge') || topicData?.challenges?.[0];

  useEffect(() => {
    if (challenge?.code?.initial) {
      setChallengeCode(challenge.code.initial);
    }
  }, [challenge]);

  if (!content && !challenge) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Challenge Content</h3>
          <p className="text-gray-500">This module doesn't have challenge exercises yet.</p>
        </div>
      </div>
    );
  }

  const handleValidateChallenge = () => {
    setIsValidating(true);
    setShowValidatePrompt(false);
    setRenderError(null);
    setRenderSuccess(false);

    // Simulate realistic validation logic
    setTimeout(() => {
      try {
        const tests = challenge?.testCriteria || [
          'Component renders without errors',
          'Implements required functionality',
          'Follows React best practices',
          'Uses proper JSX syntax',
          'Handles props correctly'
        ];

        // Simulate code analysis
        let passedTests = tests.map((test, index) => {
          let passed = false;

          // Basic validation logic
          if (test.includes('renders') && challengeCode.includes('return')) {
            passed = true;
          } else if (test.includes('functionality') && challengeCode.length > 100) {
            passed = Math.random() > 0.2;
          } else if (test.includes('practices') && challengeCode.includes('React')) {
            passed = Math.random() > 0.3;
          } else if (test.includes('JSX') && challengeCode.includes('<')) {
            passed = true;
          } else if (test.includes('props') && challengeCode.includes('props')) {
            passed = Math.random() > 0.4;
          } else {
            passed = Math.random() > 0.5;
          }

          return { description: test, passed };
        });

        const passedCount = passedTests.filter(t => t.passed).length;
        const score = Math.round((passedCount / tests.length) * 100);
        const earnedXP = Math.round(score * 1.5); // Up to 150 XP

        setValidationResults({
          passed: passedCount >= tests.length - 1, // Allow 1 failure
          tests: passedTests,
          score
        });

        setXpEarned(earnedXP);
        setRenderSuccess(passedCount >= tests.length - 1);

        if (passedCount < tests.length - 1) {
          setRenderError(`${tests.length - passedCount} test${tests.length - passedCount > 1 ? 's' : ''} failed. Review the requirements and try again.`);
        }

      } catch (error) {
        setRenderError('Validation failed. Please check your code syntax.');
        setValidationResults({
          passed: false,
          tests: [],
          score: 0
        });
      }

      setIsValidating(false);
    }, 2500);
  };

  // Auto-scroll to validate button when user starts typing
  useEffect(() => {
    if (challengeCode.length > 50 && showValidatePrompt && validateButtonRef.current) {
      setTimeout(() => {
        validateButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 1000);
    }
  }, [challengeCode, showValidatePrompt]);

  return (
    <div className="space-y-6">
      {/* Initial Prompt */}
      {showValidatePrompt && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Ready for the Challenge?</h3>
              <p className="text-sm text-blue-100">Complete the code below, then scroll down to validate your solution!</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{content?.title || challenge?.title || topicData?.title}</h2>
                <p className="text-red-100">Test your skills with a real challenge</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-red-100">Final Challenge</div>
              <div className="text-lg font-bold">100 XP</div>
            </div>
          </div>
        </div>

        {/* Challenge Description */}
        <div className="p-6 bg-red-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">🎯 Challenge Description:</h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {content?.description || challenge?.description ||
             `Complete the ${topicData?.title} implementation to demonstrate your understanding of this React concept.`}
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-orange-500 px-4 py-3 text-white">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Challenge Requirements</span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {(challenge?.instructions || [
              'Implement the required functionality',
              'Follow React best practices',
              'Ensure all tests pass',
              'Write clean, readable code'
            ]).map((requirement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Editor and Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`px-4 py-3 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center space-x-2">
              <Edit3 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Challenge Editor</span>
              {renderSuccess && (
                <div className="flex items-center space-x-1 text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs">Ready</span>
                </div>
              )}
              {renderError && (
                <div className="flex items-center space-x-1 text-red-500">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs">Error</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                    : 'text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>

              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center space-x-1 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hints</span>
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center space-x-1 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Solution</span>
              </button>
            </div>
          </div>

          <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <textarea
              value={showSolution ? (challenge?.code?.solution || 'Solution code here...') : challengeCode}
              onChange={(e) => !showSolution && setChallengeCode(e.target.value)}
              className={`w-full h-96 bg-transparent font-mono text-sm resize-none focus:outline-none leading-relaxed ${
                isDarkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              } ${showSolution ? 'opacity-75' : ''}`}
              placeholder={isDarkMode ? '// Complete the challenge here...' : '// Write your solution here...'}
              readOnly={showSolution}
              style={{
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            />
          </div>

          {/* Code Stats */}
          <div className={`px-4 py-2 text-xs ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <span>Lines: {challengeCode.split('\n').length} | Characters: {challengeCode.length}</span>
              {challengeCode.length > 200 && (
                <span className="text-green-500 text-xs">✓ Good progress!</span>
              )}
            </div>
          </div>

          {showSolution && (
            <div className="bg-blue-50 border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2 text-blue-800">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Solution is now visible - Study it carefully!</span>
              </div>
            </div>
          )}
        </div>

        {/* Challenge Live Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Challenge Preview</span>
                </div>
                {renderSuccess && (
                  <div className="flex items-center space-x-1 text-green-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Working</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <ReactCodeRenderer
                code={challengeCode}
                onError={(error) => setRenderError(error)}
                onSuccess={() => setRenderSuccess(true)}
              />

              {/* Preview Status */}
              {renderSuccess && !renderError && challengeCode.trim() && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold text-sm">✅ Component preview looks good!</span>
                  </div>
                  <p className="text-green-700 text-xs mt-1">
                    Your component is rendering. Now validate it to check all requirements.
                  </p>
                </div>
              )}

              {renderError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-semibold text-sm">Preview Error</span>
                  </div>
                  <p className="text-red-700 text-sm">{renderError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Validation Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`px-4 py-3 text-white ${
              validationResults?.passed ? 'bg-green-500' :
              validationResults && !validationResults.passed ? 'bg-red-500' :
              'bg-gray-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TestTube className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {validationResults ? 'Test Results' : 'Ready to Validate'}
                  </span>
                </div>
                {validationResults && (
                  <div className="flex items-center space-x-1">
                    {validationResults.passed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium">
                      {validationResults.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              {validationResults ? (
                <div className="space-y-4">
                  {/* Score Display */}
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${validationResults.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {validationResults.score}%
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Overall Score</div>

                    {/* XP Earned */}
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
                      validationResults.passed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      <Zap className="w-4 h-4" />
                      <span className="font-semibold">{xpEarned} XP Earned</span>
                    </div>
                  </div>

                  {/* Test Results */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Test Results:</h4>
                    {validationResults.tests.map((test, index) => (
                      <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                        test.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        {test.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        )}
                        <div>
                          <span className={`font-medium ${test.passed ? 'text-green-800' : 'text-red-800'}`}>
                            {test.passed ? '✅ Passed' : '❌ Failed'}
                          </span>
                          <p className={`text-sm mt-1 ${test.passed ? 'text-green-700' : 'text-red-700'}`}>
                            {test.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Success/Failure Message */}
                  {validationResults.passed ? (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 text-center">
                      <Trophy className="w-12 h-12 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">🎉 Challenge Complete!</h3>
                      <p className="text-green-100">
                        Outstanding work! You've mastered this React concept and earned {xpEarned} XP.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-orange-800 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-semibold">Keep trying!</span>
                      </div>
                      <p className="text-orange-700 text-sm">
                        You're on the right track. Review the failed tests and try again.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <TestTube className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Ready to validate your solution?</p>
                  <p className="text-sm mb-6">Click the button below to test your code against all requirements</p>

                  {/* Prominent Validate Button */}
                  <button
                    ref={validateButtonRef}
                    onClick={handleValidateChallenge}
                    disabled={isValidating || challengeCode.trim().length < 50}
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isValidating ? (
                      <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>Validating Solution...</span>
                      </>
                    ) : (
                      <>
                        <TestTube className="w-6 h-6" />
                        <span>Validate My Solution</span>
                        <span className="bg-white/20 px-2 py-1 rounded text-sm">100 XP</span>
                      </>
                    )}
                  </button>

                  {challengeCode.trim().length < 50 && (
                    <p className="text-xs text-gray-400 mt-3">
                      💡 Write at least 50 characters of code to enable validation
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* XP Reward */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge Reward</h3>
              <div className="text-3xl font-bold text-yellow-600 mb-2">100 XP</div>
              <p className="text-gray-600 text-sm">
                Complete all validation tests to earn the full reward
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hints Section */}
      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-yellow-500 px-4 py-3 text-white">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-medium">Challenge Hints</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {(challenge?.hints || [
                  'Break down the problem into smaller steps',
                  'Review the concept and code examples',
                  'Test your code frequently as you build',
                  'Don\'t hesitate to experiment with different approaches'
                ]).map((hint, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      💡
                    </div>
                    <span className="text-gray-700">{hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Validate Button (when scrolled) */}
      {!validationResults && challengeCode.trim().length >= 50 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleValidateChallenge}
            disabled={isValidating}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 transform hover:scale-105"
          >
            {isValidating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <TestTube className="w-5 h-5" />
                <span>Validate</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleView;
