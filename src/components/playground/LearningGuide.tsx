import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ArrowRight, X, Target, Lightbulb, AlertCircle } from 'lucide-react';
import { useKubernetesStore } from '../../store/kubernetesStore';
import toast from 'react-hot-toast';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  requirement: string;
  completed: boolean;
  hint: string;
}

const LearningGuide: React.FC = () => {
  const { nodes, edges } = useKubernetesStore();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const learningSteps: LearningStep[] = [
    {
      id: 'add-pod',
      title: 'Add Your First Pod',
      description: 'Start by adding a Pod to the canvas. Pods are the smallest deployable units in Kubernetes.',
      requirement: 'Add a Pod component',
      completed: nodes.some(node => node.data.componentType === 'pod'),
      hint: 'Drag the Pod component from the Workloads section to the canvas.'
    },
    {
      id: 'add-service',
      title: 'Expose with a Service',
      description: 'Add a Service to expose your Pod to network traffic.',
      requirement: 'Add a Service component',
      completed: nodes.some(node => node.data.componentType === 'service'),
      hint: 'Services make your Pods accessible. Find Service in the Networking section.'
    },
    {
      id: 'connect-service',
      title: 'Connect Service to Pod',
      description: 'Connect your Service to the Pod to establish the network path.',
      requirement: 'Connect Service to Pod',
      completed: edges.some(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        return (sourceNode?.data.componentType === 'service' && targetNode?.data.componentType === 'pod') ||
               (sourceNode?.data.componentType === 'pod' && targetNode?.data.componentType === 'service');
      }),
      hint: 'Drag from the connection point on the Service to the Pod (or vice versa).'
    },
    {
      id: 'add-ingress',
      title: 'Add External Access',
      description: 'Add an Ingress to allow external traffic to reach your application.',
      requirement: 'Add an Ingress component',
      completed: nodes.some(node => node.data.componentType === 'ingress'),
      hint: 'Ingress controllers manage external access. Find it in the Networking section.'
    },
    {
      id: 'connect-ingress',
      title: 'Complete the Path',
      description: 'Connect the Ingress to your Service to complete the traffic path.',
      requirement: 'Connect Ingress to Service',
      completed: edges.some(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        return (sourceNode?.data.componentType === 'ingress' && targetNode?.data.componentType === 'service') ||
               (sourceNode?.data.componentType === 'service' && targetNode?.data.componentType === 'ingress');
      }),
      hint: 'Connect Ingress to Service to allow external traffic to reach your Pod.'
    }
  ];

  // Update current step based on completion
  useEffect(() => {
    const completedSteps = learningSteps.filter(step => step.completed).length;
    if (completedSteps > currentStep) {
      setCurrentStep(completedSteps);
      
      // Show congratulations for completed step
      if (completedSteps > 0 && completedSteps <= learningSteps.length) {
        const completedStep = learningSteps[completedSteps - 1];
        toast.success(`✅ ${completedStep.title} completed!`, {
          duration: 3000,
          icon: '🎉',
        });
      }
    }
  }, [nodes, edges, currentStep]);

  const getProgress = () => {
    const completed = learningSteps.filter(step => step.completed).length;
    return (completed / learningSteps.length) * 100;
  };

  const showHint = (step: LearningStep) => {
    toast.success(step.hint, {
      duration: 5000,
      icon: '💡',
      style: {
        maxWidth: '400px',
      },
    });
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        title="Show Learning Guide"
      >
        <BookOpen className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Learning Guide</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-slate-400 hover:text-slate-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{Math.round(getProgress())}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="max-h-80 overflow-y-auto">
        {learningSteps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`p-4 border-b border-slate-100 last:border-b-0 ${
              step.completed ? 'bg-emerald-50' : index === currentStep ? 'bg-blue-50' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.completed 
                  ? 'bg-emerald-500 text-white' 
                  : index === currentStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${
                  step.completed ? 'text-emerald-800' : 'text-slate-900'
                }`}>
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {step.description}
                </p>
                
                {!step.completed && index === currentStep && (
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => showHint(step)}
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Lightbulb className="w-3 h-3" />
                      <span>Show hint</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      {getProgress() === 100 && (
        <div className="p-4 bg-emerald-50 border-t border-emerald-200">
          <div className="flex items-center space-x-2 text-emerald-800">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Congratulations! 🎉</span>
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            You've completed the basic Kubernetes learning path!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LearningGuide;
