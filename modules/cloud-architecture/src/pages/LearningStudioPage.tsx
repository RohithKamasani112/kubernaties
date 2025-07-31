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
  Users
} from 'lucide-react';
import { learningScenarios } from '../../../../src/data/learningScenarios';

interface LearningStudioPageProps {}

const LearningStudioPage: React.FC<LearningStudioPageProps> = () => {
  const { scenarioId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [codeContent, setCodeContent] = useState('');

  // Find the actual scenario data
  const scenario = learningScenarios.find(s => s.id === scenarioId) || learningScenarios.find(s => s.id === 'aws-static-website-complete');

  // Initialize code content with the current step's template
  useEffect(() => {
    if (scenario && scenario.steps[currentStep]) {
      setCodeContent(scenario.steps[currentStep].codeTemplate || '');
    }
  }, [scenario, currentStep]);

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

export default LearningStudioPage;
