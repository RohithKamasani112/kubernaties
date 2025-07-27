import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { useWebElevateStore } from '../store/webElevateStore';

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

  const path = learningPaths.find(p => p.id === pathId);
  const module = path?.modules.find(m => m.id === moduleId);

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

  const steps: { id: ModuleStep; name: string; icon: any; description: string }[] = [
    { id: 'concept', name: 'Concept', icon: BookOpen, description: 'Learn the theory' },
    { id: 'code', name: 'Code', icon: Code, description: 'See it in action' },
    { id: 'playground', name: 'Playground', icon: Play, description: 'Practice hands-on' },
    { id: 'challenge', name: 'Challenge', icon: Target, description: 'Test your skills' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleStepComplete = () => {
    setStepProgress(prev => ({ ...prev, [currentStep]: true }));

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
              <p className="text-sm text-gray-500">{path.title}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{module.duration}</span>
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
                    className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : isCompleted
                        ? 'text-green-600 hover:bg-green-50'
                        : isAccessible
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
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
            {currentStep === 'concept' && <ConceptView module={module} />}
            {currentStep === 'code' && <CodeView module={module} />}
            {currentStep === 'playground' && <PlaygroundView module={module} />}
            {currentStep === 'challenge' && <ChallengeView module={module} />}
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
            <span>{isLastStep ? 'Complete Module' : 'Next Step'}</span>
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
const ConceptView: React.FC<{ module: any }> = ({ module }) => {
  const content = module.content?.concept;

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <p className="text-blue-100">Learn the fundamental concepts</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {content.content}
          </div>
        </div>

        {content.diagrams && content.diagrams.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Diagrams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.diagrams.map((diagram, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Diagram {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.quiz && content.quiz.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Quiz</h3>
            <div className="space-y-4">
              {content.quiz.map((question, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{question.question}</h4>
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name={`question-${index}`} className="text-blue-600" />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Code View Component
const CodeView: React.FC<{ module: any }> = ({ module }) => {
  const content = module.content?.code;

  if (!content) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <p className="text-green-100">See the concepts in action</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{content.explanation}</p>
        </div>

        {content.codeBlocks && content.codeBlocks.length > 0 && (
          <div className="space-y-6">
            {content.codeBlocks.map((block, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{block.language}</span>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{block.code}</code>
                  </pre>
                </div>
                {block.explanation && (
                  <div className="bg-blue-50 p-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{block.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {content.exercises && content.exercises.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Exercises</h3>
            <div className="space-y-4">
              {content.exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{exercise.question}</h4>
                  {exercise.type === 'multiple-choice' && exercise.options && (
                    <div className="space-y-2">
                      {exercise.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name={`exercise-${index}`} className="text-green-600" />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Playground View Component
const PlaygroundView: React.FC<{ module: any }> = ({ module }) => {
  const content = module.content?.playground;

  if (!content) {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <p className="text-purple-100">Practice hands-on coding</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{content.instructions}</p>
        </div>

        {/* Playground Interface Preview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Interactive Playground</h3>
            <Link
              to="/web-elevate/playground"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Open Full Playground
            </Link>
          </div>
          <div className="bg-gray-800 rounded p-4 text-gray-300 text-sm">
            <div className="text-green-400">// Welcome to the Web Elevate Playground!</div>
            <div className="text-blue-400">// Start coding here...</div>
            <div className="mt-2">
              <span className="text-purple-400">function</span>{' '}
              <span className="text-yellow-400">helloWorld</span>() {'{'}
            </div>
            <div className="ml-4">
              <span className="text-blue-400">console</span>.
              <span className="text-yellow-400">log</span>
              (<span className="text-green-400">'Hello, Web Elevate!'</span>);
            </div>
            <div>{'}'}</div>
          </div>
        </div>

        {content.hints && content.hints.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-gray-900">Helpful Hints</h3>
            </div>
            <ul className="space-y-2">
              {content.hints.map((hint, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.tests && content.tests.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Tests to Pass</h3>
            <div className="space-y-2">
              {content.tests.map((test, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <span className="text-gray-700">{test.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Challenge View Component
const ChallengeView: React.FC<{ module: any }> = ({ module }) => {
  const content = module.content?.challenge;

  if (!content) {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{content.title}</h2>
            <p className="text-red-100">Test your skills with a real challenge</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-lg">{content.description}</p>
        </div>

        {content.requirements && content.requirements.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span>Challenge Requirements</span>
            </h3>
            <ul className="space-y-3">
              {content.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-200 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenge Interface Preview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Challenge Environment</h3>
            <Link
              to="/web-elevate/playground"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Start Challenge</span>
            </Link>
          </div>
          <div className="bg-gray-800 rounded p-4 text-gray-300 text-sm">
            <div className="text-green-400">// Challenge: {content.title}</div>
            <div className="text-blue-400">// Complete the requirements above</div>
            <div className="text-yellow-400">// Good luck! 🚀</div>
            <div className="mt-4 text-gray-500">
              <div>📁 src/</div>
              <div className="ml-4">📄 index.html</div>
              <div className="ml-4">📄 style.css</div>
              <div className="ml-4">📄 script.js</div>
            </div>
          </div>
        </div>

        {content.tests && content.tests.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-red-600" />
              <span>Success Criteria</span>
            </h3>
            <div className="space-y-2">
              {content.tests.map((test, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 border-2 border-red-300 rounded"></div>
                  <span className="text-gray-700">{test.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Trophy className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Ready for the Challenge?</h3>
              <p className="text-sm text-gray-600">
                This is your chance to apply everything you've learned. Take your time,
                experiment, and don't be afraid to make mistakes - that's how we learn!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleView;
