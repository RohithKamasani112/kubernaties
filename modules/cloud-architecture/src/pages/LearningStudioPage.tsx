import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  BookOpen,
  Code,
  Eye,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  ArrowLeft,
  Clock,
  Award,
  Users,
  DollarSign
} from 'lucide-react';
import { learningScenarios } from '../../../../src/data/learningScenarios';
import { cloudScenarios } from '../../../../src/data/cloudScenarios';

interface LearningStudioPageProps {}

const LearningStudioPage: React.FC<LearningStudioPageProps> = () => {
  const { scenarioId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [codeContent, setCodeContent] = useState('');

  // Find the actual scenario data - first check learningScenarios, then cloudScenarios
  const learningScenario = learningScenarios.find(s => s.id === scenarioId);
  const cloudScenario = cloudScenarios.find(s => s.id === scenarioId);

  // Use learning scenario if available, otherwise fall back to default or cloud scenario
  const scenario = learningScenario || learningScenarios.find(s => s.id === 'aws-static-website-complete');

  // Initialize code content with the current step's template
  useEffect(() => {
    if (scenario && scenario.steps[currentStep]) {
      setCodeContent(scenario.steps[currentStep].codeTemplate || '');
    }
  }, [scenario, currentStep]);

  // If we have a cloudScenario but no learningScenario, create a comprehensive learning experience
  if (!scenario && cloudScenario) {
    return <ComprehensiveLearningExperience cloudScenario={cloudScenario} />;
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Scenario Not Found</h1>
          <p className="text-slate-600 mb-6">The learning scenario you're looking for doesn't exist.</p>
          <Link
            to="/cloud-architecture/scenarios"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scenarios</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentStepData = scenario.steps[currentStep];

  const handleApplyCode = () => {
    // Validate the code using the scenario's validation function
    const currentStepData = scenario.steps[currentStep];
    if (currentStepData.validation) {
      const result = currentStepData.validation(codeContent);
      console.log('Validation result:', result);
      // You could show validation feedback here
    }
    console.log('Applying code:', codeContent);
  };

  const handleNextStep = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Panel - Guided Tutorial - Mobile Responsive */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <Link
              to="/cloud-architecture/scenarios"
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Scenarios</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">{scenario.title}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  scenario.level === 'beginner' ? 'bg-green-100 text-green-700' :
                  scenario.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {scenario.level}
                </span>
                <div className="flex items-center space-x-1 text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{scenario.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-slate-500">
                  <Award className="w-3 h-3" />
                  <span className="text-xs">{scenario.provider.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{scenario.description}</p>

          {/* Learning Objectives */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Learning Objectives</h3>
            <ul className="space-y-1">
              {scenario.learningObjectives.map((objective, index) => (
                <li key={index} className="text-xs text-blue-800 flex items-start space-x-2">
                  <Target className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Progress */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-500">{currentStep + 1} of {scenario.steps.length}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / scenario.steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-slate-900 mb-4">{scenario.steps[currentStep].title}</h2>

            {/* Concept */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-slate-800">Concept</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{scenario.steps[currentStep].concept}</p>
            </div>

            {/* Problem */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-red-500" />
                <h3 className="font-semibold text-slate-800">Problem</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{scenario.steps[currentStep].problem}</p>
            </div>

            {/* Task */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-slate-800">Your Task</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{scenario.steps[currentStep].task}</p>
            </div>

            {/* Resource Type Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                scenario.steps[currentStep].resourceType === 's3' ? 'bg-orange-100 text-orange-800' :
                scenario.steps[currentStep].resourceType === 'cloudfront' ? 'bg-blue-100 text-blue-800' :
                scenario.steps[currentStep].resourceType === 'route53' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {scenario.steps[currentStep].resourceType?.toUpperCase() || 'AWS'} Resource
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStep >= scenario.steps.length - 1}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{currentStep >= scenario.steps.length - 1 ? 'Complete' : 'Next Step'}</span>
                {currentStep < scenario.steps.length - 1 ? <ArrowRight className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Middle Panel - Live Code Editor - Mobile Responsive */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Code Editor</h2>
          </div>
          <button
            onClick={handleApplyCode}
            className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-600 transition-colors touch-manipulation"
          >
            Apply
          </button>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-3 sm:p-4 min-h-[200px] lg:min-h-0">
          <textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder="# Write your infrastructure code here
# Example: Terraform, CloudFormation, or Pulumi

resource &quot;aws_lb&quot; &quot;main&quot; {
  name               = &quot;web-app-lb&quot;
  internal           = false
  load_balancer_type = &quot;application&quot;

  subnets = [
    aws_subnet.public_1.id,
    aws_subnet.public_2.id
  ]
}"
            className="w-full h-full resize-none border border-slate-200 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Panel - Live Architecture Visualizer - Mobile Responsive */}
      <div className="w-full lg:w-1/3 flex flex-col min-h-[300px] lg:min-h-0">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center space-x-2">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Architecture Canvas</h2>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-3 sm:p-4 bg-slate-50">
          <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium text-sm sm:text-base">Architecture will appear here</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Write code and click Apply to visualize</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Comprehensive Learning Experience Component
const ComprehensiveLearningExperience: React.FC<{ cloudScenario: any }> = ({ cloudScenario }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Generate comprehensive learning steps based on the scenario
  const generateLearningSteps = (scenario: any) => {
    const steps = [
      {
        id: 'overview',
        title: 'Scenario Overview',
        type: 'theory',
        content: {
          title: 'Understanding the Challenge',
          description: scenario.description,
          challenge: scenario.prompt,
          objectives: [
            'Understand the business requirements',
            'Identify the key technical challenges',
            'Learn about the target architecture pattern',
            'Understand cost and performance considerations'
          ]
        }
      },
      {
        id: 'services',
        title: 'Cloud Services Deep Dive',
        type: 'theory',
        content: {
          title: 'Required Cloud Services',
          services: scenario.services.map((serviceName: string) => ({
            name: serviceName,
            description: getServiceDescription(serviceName, scenario.provider),
            useCase: getServiceUseCase(serviceName, scenario.provider),
            pricing: getServicePricing(serviceName, scenario.provider)
          }))
        }
      },
      {
        id: 'architecture',
        title: 'Architecture Design Principles',
        type: 'theory',
        content: {
          title: 'Design Patterns & Best Practices',
          principles: getArchitecturePrinciples(scenario),
          patterns: getDesignPatterns(scenario),
          bestPractices: getBestPractices(scenario)
        }
      },
      {
        id: 'planning',
        title: 'Implementation Planning',
        type: 'interactive',
        content: {
          title: 'Step-by-Step Implementation Plan',
          steps: getImplementationSteps(scenario),
          considerations: getImplementationConsiderations(scenario)
        }
      },
      {
        id: 'hands-on',
        title: 'Hands-On Building',
        type: 'practical',
        content: {
          title: 'Build Your Architecture',
          instructions: 'Now that you understand the theory and planning, let\'s build the actual architecture.',
          builderLink: `/cloud-architecture/builder?scenario=${scenario.id}`
        }
      }
    ];

    return steps;
  };

  const learningSteps = generateLearningSteps(cloudScenario);

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const canProceedToNext = (stepIndex: number) => {
    return completedSteps.includes(stepIndex) || stepIndex === 0;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/cloud-architecture/scenarios"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Scenarios</span>
              </Link>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                cloudScenario.level === 'beginner' ? 'bg-green-100 text-green-800' :
                cloudScenario.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {cloudScenario.level.charAt(0).toUpperCase() + cloudScenario.level.slice(1)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">{cloudScenario.title}</h1>
            <p className="text-slate-600 mb-4">{cloudScenario.description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Learning Progress</span>
                <span className="text-sm text-slate-500">
                  {completedSteps.length} of {learningSteps.length} steps completed
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps.length / learningSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Step Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h3 className="font-semibold text-slate-900 mb-4">Learning Path</h3>
                <div className="space-y-2">
                  {learningSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        currentStep === index
                          ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500'
                          : completedSteps.includes(index)
                          ? 'bg-green-50 text-green-800 hover:bg-green-100'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          completedSteps.includes(index)
                            ? 'bg-green-500 text-white'
                            : currentStep === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {completedSteps.includes(index) ? '✓' : index + 1}
                        </div>
                        <span className="text-sm font-medium">{step.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <StepContent
                step={learningSteps[currentStep]}
                stepIndex={currentStep}
                onComplete={() => markStepComplete(currentStep)}
                isCompleted={completedSteps.includes(currentStep)}
                onNext={() => setCurrentStep(Math.min(currentStep + 1, learningSteps.length - 1))}
                onPrevious={() => setCurrentStep(Math.max(currentStep - 1, 0))}
                canProceedToNext={canProceedToNext(currentStep)}
                cloudScenario={cloudScenario}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Content Component
const StepContent: React.FC<{
  step: any;
  stepIndex: number;
  onComplete: () => void;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canProceedToNext: boolean;
  cloudScenario: any;
}> = ({ step, stepIndex, onComplete, isCompleted, onNext, onPrevious, canProceedToNext, cloudScenario }) => {

  const renderStepContent = () => {
    switch (step.type) {
      case 'theory':
        return <TheoryContent step={step} cloudScenario={cloudScenario} />;
      case 'interactive':
        return <InteractiveContent step={step} cloudScenario={cloudScenario} />;
      case 'practical':
        return <PracticalContent step={step} cloudScenario={cloudScenario} />;
      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h2>
        <div className="flex items-center space-x-4 text-sm text-slate-500">
          <span>Step {stepIndex + 1} of 5</span>
          <span>•</span>
          <span className="capitalize">{step.type} Learning</span>
        </div>
      </div>

      {renderStepContent()}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={onPrevious}
          disabled={stepIndex === 0}
          className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-3">
          {!isCompleted && (
            <button
              onClick={onComplete}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark Complete
            </button>
          )}

          {stepIndex < 4 ? (
            <button
              onClick={onNext}
              disabled={!canProceedToNext}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to={step.content.builderLink}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Start Building</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Theory Content Component
const TheoryContent: React.FC<{ step: any; cloudScenario: any }> = ({ step, cloudScenario }) => {
  const { content } = step;

  if (step.id === 'overview') {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Business Challenge</h3>
          <p className="text-blue-800 leading-relaxed">{content.challenge}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Learning Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.objectives.map((objective: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <span className="text-slate-700">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Key Insight</span>
          </div>
          <p className="text-yellow-700">
            This scenario will teach you how to design {cloudScenario.level} level cloud architectures
            using {cloudScenario.provider.toUpperCase()} services with estimated costs of {cloudScenario.costLevel} range.
          </p>
        </div>
      </div>
    );
  }

  if (step.id === 'services') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Required Cloud Services</h3>
          <div className="grid grid-cols-1 gap-4">
            {content.services.map((service: any, index: number) => (
              <div key={index} className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{service.name}</h4>
                    <span className="text-sm text-slate-500 uppercase tracking-wide">
                      {cloudScenario.provider} Service
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {service.pricing}
                  </span>
                </div>

                <p className="text-slate-600 mb-4">{service.description}</p>

                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-semibold text-green-900 mb-2">Use Case in This Scenario:</h5>
                  <p className="text-green-800 text-sm">{service.useCase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step.id === 'architecture') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Architecture Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {content.principles.map((principle: any, index: number) => (
              <div key={index} className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">{principle.title}</h4>
                <p className="text-purple-800 text-sm">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Design Patterns</h3>
          <div className="space-y-4 mb-6">
            {content.patterns.map((pattern: any, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-900 mb-2">{pattern.name}</h4>
                <p className="text-blue-800 text-sm mb-2">{pattern.description}</p>
                <div className="text-xs text-blue-600">
                  <strong>Benefits:</strong> {pattern.benefits}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Best Practices</h3>
          <div className="grid grid-cols-1 gap-3">
            {content.bestPractices.map((practice: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-green-800 text-sm">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <div>Theory content for {step.id}</div>;
};

// Interactive Content Component
const InteractiveContent: React.FC<{ step: any; cloudScenario: any }> = ({ step, cloudScenario }) => {
  const { content } = step;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Implementation Steps</h3>
        <div className="space-y-4">
          {content.steps.map((implementationStep: any, index: number) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">{implementationStep.title}</h4>
                  <p className="text-slate-600 mb-3">{implementationStep.description}</p>

                  {implementationStep.services && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-slate-700">Services involved: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {implementationStep.services.map((service: string, serviceIndex: number) => (
                          <span key={serviceIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {implementationStep.considerations && (
                    <div className="bg-yellow-50 rounded p-3">
                      <span className="text-sm font-medium text-yellow-800">💡 Considerations: </span>
                      <span className="text-sm text-yellow-700">{implementationStep.considerations}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Considerations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.considerations.map((consideration: any, index: number) => (
            <div key={index} className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <h4 className="font-semibold text-orange-900 mb-2">{consideration.category}</h4>
              <p className="text-orange-800 text-sm">{consideration.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Practical Content Component
const PracticalContent: React.FC<{ step: any; cloudScenario: any }> = ({ step, cloudScenario }) => {
  const { content } = step;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">🚀 Ready to Build!</h3>
        <p className="text-slate-700 mb-6">{content.instructions}</p>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-slate-900 mb-3">What you'll do in the builder:</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Drag and drop the required services onto the canvas</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Connect services to create data flows</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Configure service properties and settings</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Export your architecture as code (Terraform/CloudFormation)</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Success Criteria</span>
          </div>
          <p className="text-blue-800 text-sm">
            Your architecture should include all {cloudScenario.services.length} required services,
            follow the design patterns learned, and implement the security best practices discussed.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper Functions for Educational Content
const getServiceDescription = (serviceName: string, provider: string) => {
  const serviceDescriptions: { [key: string]: { [key: string]: string } } = {
    aws: {
      'S3': 'Amazon Simple Storage Service (S3) is an object storage service offering industry-leading scalability, data availability, security, and performance.',
      'CloudFront': 'Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally.',
      'Route 53': 'Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.',
      'Lambda': 'AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers.',
      'API Gateway': 'Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs.',
      'EC2': 'Amazon Elastic Compute Cloud (EC2) provides secure, resizable compute capacity in the cloud.',
      'RDS': 'Amazon Relational Database Service (RDS) makes it easy to set up, operate, and scale a relational database in the cloud.',
      'VPC': 'Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS Cloud.',
      'ELB': 'Elastic Load Balancing automatically distributes incoming application traffic across multiple targets.',
      'CloudWatch': 'Amazon CloudWatch is a monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers.'
    },
    azure: {
      'Functions': 'Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure.',
      'API Management': 'Azure API Management is a turnkey solution for publishing APIs to external and internal customers.',
      'Cosmos DB': 'Azure Cosmos DB is a fully managed NoSQL database service for modern app development.',
      'App Service': 'Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends.',
      'Container Registry': 'Azure Container Registry allows you to build, store, and manage container images and artifacts.',
      'Application Insights': 'Application Insights is an extensible Application Performance Management (APM) service for developers and DevOps professionals.'
    },
    gcp: {
      'Cloud Run': 'Cloud Run is a managed compute platform that enables you to run containers that are invocable via requests or events.',
      'Cloud Functions': 'Cloud Functions is a serverless execution environment for building and connecting cloud services.',
      'Pub/Sub': 'Cloud Pub/Sub is a messaging service for exchanging event data among applications and services.',
      'Cloud Storage': 'Cloud Storage is a RESTful online file storage web service for storing and accessing data on Google Cloud Platform infrastructure.',
      'Cloud SQL': 'Cloud SQL is a fully-managed database service that helps you set up, maintain, manage, and administer your relational databases.',
      'Cloud Build': 'Cloud Build is a service that executes your builds on Google Cloud Platform infrastructure.',
      'Artifact Registry': 'Artifact Registry is a single place for your organization to manage container images and language packages.'
    }
  };

  return serviceDescriptions[provider]?.[serviceName] || `${serviceName} is a ${provider.toUpperCase()} cloud service that provides essential functionality for your architecture.`;
};

const getServiceUseCase = (serviceName: string, provider: string) => {
  const useCases: { [key: string]: { [key: string]: string } } = {
    aws: {
      'S3': 'Stores static website files (HTML, CSS, JS, images) and serves them directly to users with high availability and durability.',
      'CloudFront': 'Caches and delivers static content globally, reducing latency and improving user experience worldwide.',
      'Route 53': 'Manages DNS routing and can perform health checks to ensure high availability of your application.',
      'Lambda': 'Processes API requests, handles business logic, and integrates with other AWS services without server management.',
      'API Gateway': 'Creates RESTful APIs that trigger Lambda functions and manages authentication, throttling, and monitoring.',
      'EC2': 'Hosts web applications, databases, and other services that require persistent compute resources.',
      'RDS': 'Provides managed relational database services with automated backups, patching, and scaling.',
      'VPC': 'Creates isolated network environments for secure communication between your cloud resources.',
      'ELB': 'Distributes incoming traffic across multiple EC2 instances to ensure high availability and fault tolerance.',
      'CloudWatch': 'Monitors application performance, logs, and metrics to ensure optimal operation and quick issue resolution.'
    },
    azure: {
      'Functions': 'Executes serverless code in response to HTTP requests, timers, or other Azure service events.',
      'API Management': 'Provides a unified API gateway with security, throttling, and analytics for your serverless functions.',
      'Cosmos DB': 'Stores application data with global distribution and multiple consistency models for optimal performance.',
      'App Service': 'Hosts web applications and APIs with built-in scaling, security, and deployment capabilities.',
      'Container Registry': 'Stores and manages Docker container images for your applications with security scanning.',
      'Application Insights': 'Provides real-time monitoring and analytics for your applications to track performance and usage.'
    },
    gcp: {
      'Cloud Run': 'Runs containerized applications in a fully managed serverless environment with automatic scaling.',
      'Cloud Functions': 'Executes code in response to events without managing servers, perfect for microservices architecture.',
      'Pub/Sub': 'Enables reliable, many-to-many, asynchronous messaging between independent applications.',
      'Cloud Storage': 'Provides object storage for application data, backups, and content distribution.',
      'Cloud SQL': 'Offers fully managed relational databases with high availability and automatic backups.',
      'Cloud Build': 'Automates the building, testing, and deployment of your applications from source code.',
      'Artifact Registry': 'Manages container images and other artifacts with vulnerability scanning and access control.'
    }
  };

  return useCases[provider]?.[serviceName] || `In this scenario, ${serviceName} will handle critical functionality for your ${provider.toUpperCase()} architecture.`;
};

const getServicePricing = (serviceName: string, provider: string) => {
  const pricingInfo: { [key: string]: { [key: string]: string } } = {
    aws: {
      'S3': 'Pay-per-use',
      'CloudFront': 'Pay-per-request',
      'Route 53': 'Low fixed cost',
      'Lambda': 'Pay-per-execution',
      'API Gateway': 'Pay-per-request',
      'EC2': 'Hourly billing',
      'RDS': 'Hourly billing',
      'VPC': 'Free tier available',
      'ELB': 'Hourly + data processing',
      'CloudWatch': 'Pay-per-metric'
    },
    azure: {
      'Functions': 'Pay-per-execution',
      'API Management': 'Tiered pricing',
      'Cosmos DB': 'Pay-per-RU',
      'App Service': 'Tiered pricing',
      'Container Registry': 'Pay-per-storage',
      'Application Insights': 'Pay-per-data'
    },
    gcp: {
      'Cloud Run': 'Pay-per-request',
      'Cloud Functions': 'Pay-per-invocation',
      'Pub/Sub': 'Pay-per-message',
      'Cloud Storage': 'Pay-per-GB',
      'Cloud SQL': 'Hourly billing',
      'Cloud Build': 'Pay-per-build-minute',
      'Artifact Registry': 'Pay-per-storage'
    }
  };

  return pricingInfo[provider]?.[serviceName] || 'Variable pricing';
};

const getArchitecturePrinciples = (scenario: any) => {
  const commonPrinciples = [
    {
      title: 'Scalability',
      description: 'Design systems that can handle increasing loads by adding resources horizontally or vertically.'
    },
    {
      title: 'Reliability',
      description: 'Ensure your system continues to work correctly even when failures occur.'
    },
    {
      title: 'Security',
      description: 'Implement defense in depth with multiple layers of security controls.'
    },
    {
      title: 'Cost Optimization',
      description: 'Use resources efficiently and avoid unnecessary costs while meeting performance requirements.'
    }
  ];

  // Add scenario-specific principles
  if (scenario.level === 'expert') {
    commonPrinciples.push({
      title: 'High Availability',
      description: 'Design for minimal downtime with redundancy and failover mechanisms.'
    });
  }

  return commonPrinciples;
};

const getDesignPatterns = (scenario: any) => {
  const patterns = [];

  if (scenario.category === 'web-hosting' || scenario.tags?.includes('web-app')) {
    patterns.push({
      name: '3-Tier Architecture',
      description: 'Separates presentation, application logic, and data storage into distinct layers.',
      benefits: 'Improved maintainability, scalability, and security through separation of concerns.'
    });
  }

  if (scenario.category === 'serverless' || scenario.tags?.includes('serverless')) {
    patterns.push({
      name: 'Event-Driven Architecture',
      description: 'Components communicate through events, enabling loose coupling and scalability.',
      benefits: 'Better scalability, reduced costs, and improved fault tolerance.'
    });
  }

  if (scenario.level === 'expert') {
    patterns.push({
      name: 'Microservices Pattern',
      description: 'Breaks down applications into small, independent services that communicate over APIs.',
      benefits: 'Independent deployment, technology diversity, and better fault isolation.'
    });
  }

  // Default pattern if none match
  if (patterns.length === 0) {
    patterns.push({
      name: 'Layered Architecture',
      description: 'Organizes code into horizontal layers, each with specific responsibilities.',
      benefits: 'Clear separation of concerns and easier maintenance.'
    });
  }

  return patterns;
};

const getBestPractices = (scenario: any) => {
  const practices = [
    'Use Infrastructure as Code (IaC) for consistent deployments',
    'Implement proper monitoring and logging for observability',
    'Follow the principle of least privilege for security',
    'Use managed services to reduce operational overhead',
    'Implement automated backups and disaster recovery',
    'Tag all resources for cost tracking and management'
  ];

  if (scenario.provider === 'aws') {
    practices.push('Use AWS Well-Architected Framework principles');
    practices.push('Leverage AWS CloudFormation or CDK for infrastructure');
  } else if (scenario.provider === 'azure') {
    practices.push('Follow Azure Well-Architected Framework guidelines');
    practices.push('Use Azure Resource Manager (ARM) templates or Bicep');
  } else if (scenario.provider === 'gcp') {
    practices.push('Apply Google Cloud Architecture Framework principles');
    practices.push('Use Google Cloud Deployment Manager or Terraform');
  }

  if (scenario.level === 'expert') {
    practices.push('Implement blue-green or canary deployment strategies');
    practices.push('Use service mesh for microservices communication');
    practices.push('Implement comprehensive security scanning and compliance checks');
  }

  return practices;
};

const getImplementationSteps = (scenario: any) => {
  const steps = [];

  // Common first steps
  steps.push({
    title: 'Set up core infrastructure',
    description: 'Create the foundational network and security components',
    services: ['VPC', 'Subnets', 'Security Groups'],
    considerations: 'Plan your IP address ranges and security boundaries carefully'
  });

  // Add scenario-specific steps
  if (scenario.category === 'web-hosting') {
    steps.push({
      title: 'Deploy compute resources',
      description: 'Set up the servers or serverless functions to run your application',
      services: scenario.services.filter((s: string) => ['EC2', 'Lambda', 'App Service', 'Cloud Run'].includes(s)),
      considerations: 'Consider auto-scaling requirements and instance sizing'
    });

    steps.push({
      title: 'Configure data storage',
      description: 'Set up databases and object storage for your application data',
      services: scenario.services.filter((s: string) => ['RDS', 'S3', 'Cosmos DB', 'Cloud Storage'].includes(s)),
      considerations: 'Plan for data backup, encryption, and access patterns'
    });
  }

  if (scenario.tags?.includes('cdn') || scenario.services.includes('CloudFront')) {
    steps.push({
      title: 'Set up content delivery',
      description: 'Configure CDN for global content distribution and performance',
      services: ['CloudFront', 'Route 53'],
      considerations: 'Configure caching policies and SSL certificates'
    });
  }

  steps.push({
    title: 'Implement monitoring and logging',
    description: 'Set up comprehensive monitoring for your architecture',
    services: ['CloudWatch', 'Application Insights', 'Cloud Monitoring'],
    considerations: 'Define key metrics, alerts, and log retention policies'
  });

  steps.push({
    title: 'Security hardening and testing',
    description: 'Apply security best practices and test your architecture',
    services: ['IAM', 'Security Groups', 'WAF'],
    considerations: 'Perform security audits and penetration testing'
  });

  return steps;
};

const getImplementationConsiderations = (scenario: any) => {
  return [
    {
      category: 'Performance',
      description: 'Consider latency, throughput, and response time requirements for your users'
    },
    {
      category: 'Security',
      description: 'Implement encryption, access controls, and network security measures'
    },
    {
      category: 'Cost',
      description: 'Monitor spending and optimize resource usage to stay within budget'
    },
    {
      category: 'Compliance',
      description: 'Ensure your architecture meets relevant regulatory and industry standards'
    }
  ];
};

export default LearningStudioPage;
