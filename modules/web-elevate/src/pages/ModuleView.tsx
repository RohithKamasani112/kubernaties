import React, { useState, useEffect } from 'react';
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
  Terminal
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';
import { comprehensiveReactTopics } from '../data/reactTopicsComprehensive';

type ModuleStep = 'concept' | 'code' | 'playground' | 'challenge';

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

  const path = learningPaths.find(p => p.id === pathId);
  const module = path?.modules.find(m => m.id === moduleId);

  // Get comprehensive topic data for React path
  const topicData = pathId === 'react-mastery'
    ? comprehensiveReactTopics.find(topic => topic.id === moduleId)
    : null;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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

  // Use comprehensive topic data if available
  const content = topicData || module.content?.code;
  const codeExample = topicData?.challenges?.[0]?.code;

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

        {/* Language Toggle */}
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
            </div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <FileText className="w-4 h-4" />
              <span>{showExplanation ? 'Hide' : 'Show'} Explanation</span>
            </button>
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
        {/* Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-300 text-sm font-mono">
              {topicData?.title?.replace(/[^a-zA-Z0-9]/g, '') || 'Example'}.{selectedLanguage === 'typescript' ? 'tsx' : 'jsx'}
            </span>
          </div>
          <div className="bg-gray-900 text-gray-100 p-6 overflow-x-auto">
            <pre className="text-sm font-mono">
              <code>
                {selectedLanguage === 'typescript'
                  ? (codeExample?.solution || codeExample?.initial || `// TypeScript example for ${topicData?.title}\nimport React from 'react';\n\ninterface Props {\n  title: string;\n}\n\nconst Example: React.FC<Props> = ({ title }) => {\n  return <h1>{title}</h1>;\n};\n\nexport default Example;`)
                  : (codeExample?.solution || codeExample?.initial || `// JavaScript example for ${topicData?.title}\nimport React from 'react';\n\nfunction Example({ title }) {\n  return <h1>{title}</h1>;\n}\n\nexport default Example;`)
                }
              </code>
            </pre>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Live Preview</span>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {topicData?.title || 'Component Preview'}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Interactive preview of the working component
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="text-gray-800 font-medium">
                    ✨ Component Output
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    This would show the rendered result
                  </div>
                </div>
              </div>
            </div>
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
    // Simulate code execution and testing
    setTimeout(() => {
      const randomPassed = Math.floor(Math.random() * 3) + 1;
      setTestResults({ passed: randomPassed, total: 3 });
      setIsRunning(false);
    }, 2000);
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
        {/* Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300 text-sm font-medium">Live Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-1"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hints</span>
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
              >
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Run</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-gray-900 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 bg-transparent text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder="// Start coding here..."
            />
          </div>

          {/* Console Output */}
          <div className="bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>Console Output</span>
            </div>
            <div className="p-4 max-h-32 overflow-y-auto">
              {testResults.total > 0 ? (
                <div className="space-y-1 font-mono text-sm">
                  {Array.from({ length: testResults.total }, (_, i) => (
                    <div key={i} className={`${
                      i < testResults.passed ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className="text-gray-500 mr-2">{String(i + 1).padStart(2, '0')}</span>
                      {i < testResults.passed ? '✅' : '⏳'} Test {i + 1}: {i < testResults.passed ? 'Passed' : 'Pending'}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  Click "Run" to see console output...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expected Output & Results */}
        <div className="space-y-4">
          {/* Expected Output */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-500 px-4 py-3 text-white">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Expected Output</span>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 min-h-[120px]">
                <div className="text-center mb-4">
                  <div className="text-gray-600 text-sm mb-2">Live Preview:</div>
                </div>

                {/* Live Preview Area */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm min-h-[80px]">
                  {code.trim() ? (
                    <div className="space-y-2">
                      <div className="text-gray-800 font-medium">
                        {topicData?.title || 'React Component'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Component rendered successfully!
                        {testResults.passed > 0 && (
                          <span className="text-green-600 ml-2">
                            ✅ {testResults.passed} test{testResults.passed !== 1 ? 's' : ''} passing
                          </span>
                        )}
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                        💡 In a real environment, your React component would render here
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="text-gray-400 mb-2">
                        <Code className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="text-sm">Start coding to see live preview</div>
                    </div>
                  )}
                </div>
              </div>
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
    // Simulate validation logic
    setTimeout(() => {
      const tests = challenge?.testCriteria || [
        'Component renders without errors',
        'Implements required functionality',
        'Follows React best practices'
      ];

      const passedTests = tests.map((test, index) => ({
        description: test,
        passed: Math.random() > 0.3 // Simulate test results
      }));

      const passedCount = passedTests.filter(t => t.passed).length;
      const score = Math.round((passedCount / tests.length) * 100);

      setValidationResults({
        passed: passedCount === tests.length,
        tests: passedTests,
        score
      });
      setIsValidating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
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

      {/* Challenge Editor and Validation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300 text-sm font-medium">Challenge Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center space-x-1"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hints</span>
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Solution</span>
              </button>
              <button
                onClick={handleValidateChallenge}
                disabled={isValidating}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
              >
                {isValidating ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Validating...</span>
                  </>
                ) : (
                  <>
                    <TestTube className="w-3 h-3" />
                    <span>Validate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-gray-900 p-4">
            <textarea
              value={showSolution ? (challenge?.code?.solution || 'Solution code here...') : challengeCode}
              onChange={(e) => !showSolution && setChallengeCode(e.target.value)}
              className="w-full h-96 bg-transparent text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder="// Complete the challenge here..."
              readOnly={showSolution}
            />
          </div>

          {showSolution && (
            <div className="bg-blue-50 border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2 text-blue-800">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Solution is now visible</span>
              </div>
            </div>
          )}
        </div>

        {/* Validation Results */}
        <div className="space-y-4">
          {/* Test Results Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-green-500 px-4 py-3 text-white">
              <div className="flex items-center space-x-2">
                <TestTube className="w-4 h-4" />
                <span className="text-sm font-medium">Validation Results</span>
              </div>
            </div>
            <div className="p-4">
              {validationResults ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Overall Score:</span>
                    <span className={`text-2xl font-bold ${validationResults.passed ? 'text-green-600' : 'text-orange-600'}`}>
                      {validationResults.score}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    {validationResults.tests.map((test, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        {test.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-red-300 rounded"></div>
                        )}
                        <span className={`${test.passed ? 'text-green-700' : 'text-red-700'}`}>
                          {test.description}
                        </span>
                      </div>
                    ))}
                  </div>
                  {validationResults.passed && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center space-x-2 text-green-800">
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">Challenge Complete! 🎉</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Congratulations! You've earned 100 XP for completing this challenge.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <TestTube className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Click "Validate" to test your solution</p>
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
    </div>
  );
};

export default ModuleView;
