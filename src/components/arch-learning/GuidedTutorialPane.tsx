import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  BookOpen, 
  Target, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { LearningStep } from './InteractiveLearningPath';

interface GuidedTutorialPaneProps {
  step: LearningStep | undefined;
  stepNumber: number;
  totalSteps: number;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export const GuidedTutorialPane: React.FC<GuidedTutorialPaneProps> = ({
  step,
  stepNumber,
  totalSteps,
  isCompleted,
  onNext,
  onPrevious,
  canProceed
}) => {
  if (!step) return null;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isCompleted ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{step.title}</h3>
            <p className="text-sm text-slate-600">Step {stepNumber} of {totalSteps}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Concept Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">💡 Concept</h4>
              <p className="text-blue-800 text-sm leading-relaxed">{step.concept}</p>
            </div>
          </div>
        </motion.div>

        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-50 rounded-xl p-4 border border-orange-200"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ Problem</h4>
              <p className="text-orange-800 text-sm leading-relaxed">{step.problem}</p>
            </div>
          </div>
        </motion.div>

        {/* Task Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-start space-x-3">
            <Target className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">🎯 Your Task</h4>
              <p className="text-green-800 text-sm leading-relaxed font-medium">{step.task}</p>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
        >
          <h4 className="font-semibold text-slate-900 mb-3">📝 Instructions</h4>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">1</span>
              <p>Look at the code template in the editor pane</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">2</span>
              <p>Replace the <code className="bg-slate-100 px-1 rounded">___FILL_IN___</code> placeholder with the correct value</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">3</span>
              <p>Click the <strong>"Apply"</strong> button to deploy your changes</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">4</span>
              <p>Watch the architecture diagram update in real-time</p>
            </div>
          </div>
        </motion.div>

        {/* Hints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 rounded-xl p-4 border border-purple-200"
        >
          <h4 className="font-semibold text-purple-900 mb-2">💡 Hint</h4>
          <p className="text-purple-800 text-sm">
            {step.resourceType === 'vpc' && "CIDR blocks define the IP address range for your network. /16 gives you 65,536 IP addresses."}
            {step.resourceType === 'subnet' && "Subnets must be within the VPC's CIDR range. /24 gives you 256 IP addresses."}
            {step.resourceType === 'ec2' && "t3.micro is perfect for testing and small workloads. It's also free tier eligible!"}
            {step.resourceType === 'load_balancer' && "Port 80 is the standard port for HTTP traffic. HTTPS uses port 443."}
            {step.resourceType === 'resource_group' && "East US is a popular region with good availability and pricing."}
          </p>
        </motion.div>

        {/* Success Message */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-100 rounded-xl p-4 border border-green-300"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">✅ Step Completed!</h4>
                <p className="text-green-800 text-sm">Great job! You can now proceed to the next step.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={stepNumber === 1}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < stepNumber - 1 ? 'bg-green-500' :
                  i === stepNumber - 1 ? 'bg-blue-500' :
                  'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={stepNumber === totalSteps || !canProceed}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTutorialPane;
