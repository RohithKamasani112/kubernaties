import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  PlayCircle, 
  CheckCircle,
  BookOpen,
  Code,
  HelpCircle,
  Lightbulb,
  Target,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LessonContent {
  introduction: string;
  keyPoints: string[];
  interactiveExample: {
    yaml: string;
    explanation: string;
  };
  quiz: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  topics: string[];
  content: LessonContent;
}

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [yamlContent, setYamlContent] = useState(lesson.content.interactiveExample.yaml);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const steps = [
    { id: 'introduction', title: 'Introduction', icon: BookOpen },
    { id: 'keypoints', title: 'Key Concepts', icon: Lightbulb },
    { id: 'interactive', title: 'Interactive Example', icon: Code },
    { id: 'quiz', title: 'Knowledge Check', icon: HelpCircle },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowQuizResults(true);
    const correctAnswers = lesson.content.quiz.filter((q, i) => q.correct === quizAnswers[i]).length;
    const percentage = (correctAnswers / lesson.content.quiz.length) * 100;
    
    if (percentage >= 80) {
      toast.success(`🎉 Great job! You scored ${percentage}%`);
    } else {
      toast.error(`You scored ${percentage}%. Try reviewing the material again.`);
    }
  };

  const tryInPlayground = () => {
    // Navigate to playground with the current YAML
    const playgroundUrl = `/playground?yaml=${encodeURIComponent(yamlContent)}`;
    window.open(playgroundUrl, '_blank');
    toast.success('Opening in playground...');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      setCopiedCode(true);
      toast.success('YAML copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      toast.error('Failed to copy YAML');
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
    },
    theme: 'vs-light',
    wordWrap: 'on' as const,
    automaticLayout: true,
    readOnly: false,
    folding: true,
    foldingStrategy: 'indentation' as const,
    showFoldingControls: 'always' as const,
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'introduction':
        return (
          <motion.div
            className="prose prose-slate max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">
                    {lesson.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <span>{lesson.duration}</span>
                    <span>•</span>
                    <span>{lesson.difficulty}</span>
                  </div>
                </div>
              </div>
              <p className="text-blue-800 text-lg leading-relaxed">
                {lesson.content.introduction}
              </p>
            </div>
          </motion.div>
        );

      case 'keypoints':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
              Key Concepts to Master
            </h3>
            <div className="space-y-4">
              {lesson.content.keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 leading-relaxed">{point}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'interactive':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center">
                <Code className="w-6 h-6 text-purple-500 mr-2" />
                Interactive Example
              </h3>
              <p className="text-slate-600">{lesson.content.interactiveExample.explanation}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* YAML Editor */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900">YAML Configuration</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-slate-600 hover:text-slate-900 rounded transition-colors"
                        title={isExpanded ? "Minimize" : "Expand"}
                      >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1 px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="text-sm">{copiedCode ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={tryInPlayground}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Try in Playground</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`${isExpanded ? 'fixed inset-0 z-50 bg-white' : 'h-80'}`}>
                  <Editor
                    height="100%"
                    defaultLanguage="yaml"
                    value={yamlContent}
                    onChange={(value) => setYamlContent(value || '')}
                    options={editorOptions}
                  />
                </div>
              </div>

              {/* Visual Representation */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 text-indigo-500 mr-2" />
                  Visual Representation
                </h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-slate-900">Pod: my-first-pod</h5>
                        <p className="text-sm text-slate-600">Running nginx:latest</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <div className="text-center text-slate-500 text-sm">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Code className="w-8 h-8 text-purple-600" />
                      </div>
                      <p>This visual shows how your YAML translates to actual Kubernetes resources</p>
                    </div>
                  </div>

                  {/* Interactive Elements */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Resource Status:</span>
                      <span className="text-emerald-600 font-medium">✓ Valid Configuration</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Lines of YAML:</span>
                      <span className="text-blue-600 font-medium">{yamlContent.split('\n').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'quiz':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center">
                <HelpCircle className="w-6 h-6 text-orange-500 mr-2" />
                Knowledge Check
              </h3>
              <p className="text-slate-600">Test your understanding of the concepts covered in this lesson.</p>
            </div>

            <div className="space-y-6">
              {lesson.content.quiz.map((question, qIndex) => (
                <div key={qIndex} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h4 className="font-medium text-slate-900 mb-4">
                    Question {qIndex + 1}: {question.question}
                  </h4>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          quizAnswers[qIndex] === oIndex
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        } ${
                          showQuizResults
                            ? oIndex === question.correct
                              ? 'border-emerald-500 bg-emerald-50'
                              : quizAnswers[qIndex] === oIndex && oIndex !== question.correct
                              ? 'border-red-500 bg-red-50'
                              : 'border-slate-200 bg-slate-50'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={oIndex}
                          checked={quizAnswers[qIndex] === oIndex}
                          onChange={() => handleQuizAnswer(qIndex, oIndex)}
                          disabled={showQuizResults}
                          className="text-blue-600"
                        />
                        <span className="text-slate-700">{option}</span>
                        {showQuizResults && oIndex === question.correct && (
                          <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!showQuizResults && (
                <button
                  onClick={submitQuiz}
                  disabled={quizAnswers.length !== lesson.content.quiz.length}
                  className="w-full py-3 px-6 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Submit Quiz
                </button>
              )}

              {showQuizResults && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full border border-emerald-200">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Lesson completed! 🎉</span>
                  </div>
                  <p className="text-slate-600 mt-2">
                    You scored {Math.round((lesson.content.quiz.filter((q, i) => q.correct === quizAnswers[i]).length / lesson.content.quiz.length) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Lessons</span>
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
              <p className="text-slate-600">{lesson.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="w-32 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center space-x-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-100' : isCompleted ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className="font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;