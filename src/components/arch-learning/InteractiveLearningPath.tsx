import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Code,
  Eye,
  BookOpen,
  Zap,
  X,
  Save,
  Download,
  RotateCcw,
  Settings,
  Award,
  Target,
  Lightbulb,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { CloudScenario } from '../../data/cloudScenarios';
import { LearningScenario, getScenarioById } from '../../data/learningScenarios';
import { GuidedTutorialPane } from './GuidedTutorialPane';
import { LiveCodeEditor } from './LiveCodeEditor';
import { ArchitectureCanvas } from './ArchitectureCanvas';
import { SecurityDashboard } from './SecurityDashboard';
import { ProgressDashboard } from './ProgressDashboard';
import { GamificationSystem } from '../../utils/gamificationSystem';

// Export types for other components that might import them
export interface LearningStep {
  id: string;
  title: string;
  concept: string;
  problem: string;
  task: string;
  codeTemplate: string;
  expectedCode: string;
  resourceType: string;
  language: 'terraform' | 'yaml' | 'json';
  validation: (code: string) => { isValid: boolean; message: string; securityIssues?: string[]; bestPractices?: string[] };
  hints: string[];
  securityTips: string[];
  bestPractices: string[];
}

export interface DeployedResource {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
  connections: string[];
  position: { x: number; y: number };
  securityLevel: 'secure' | 'warning' | 'critical';
}

export interface LearningProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  startTime: Date;
  timeSpent: number;
  achievements: string[];
  score: number;
}

interface InteractiveLearningPathProps {
  scenario: CloudScenario;
  onClose: () => void;
}

const InteractiveLearningPath: React.FC<InteractiveLearningPathProps> = ({ scenario, onClose }) => {
  // State management for the three-pane interface
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string; securityIssues?: string[]; bestPractices?: string[] } | null>(null);
  const [deployedResources, setDeployedResources] = useState<DeployedResource[]>([]);
  const [progress, setProgress] = useState<LearningProgress>({
    currentStep: 0,
    completedSteps: [],
    totalSteps: 0,
    startTime: new Date(),
    timeSpent: 0,
    achievements: [],
    score: 0
  });
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showBestPracticesPanel, setShowBestPracticesPanel] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);

  const gamificationSystem = GamificationSystem.getInstance();

  // Get learning scenario data
  const learningScenario = getScenarioById(`${scenario.provider}-${scenario.id}`) ||
                           getScenarioById(scenario.id) ||
                           getScenarioById(`${scenario.provider}-static-website-complete`);

  const learningSteps = learningScenario?.steps || [];
  const currentStepData = learningSteps[currentStep];

  // Initialize progress
  useEffect(() => {
    setProgress(prev => ({
      ...prev,
      totalSteps: learningSteps.length,
      currentStep: 0
    }));

    if (learningSteps.length > 0) {
      setCurrentCode(learningSteps[0].codeTemplate);
    }
  }, [learningSteps]);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCurrentCode(newCode);
    setValidationResult(null);
  }, []);

  // Handle code application/validation
  const handleApplyCode = useCallback(async () => {
    if (!currentStepData) return;

    setIsValidating(true);

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = currentStepData.validation(currentCode);
    setValidationResult(result);

    if (result.isValid) {
      // Mark step as completed
      setCompletedSteps(prev => [...prev, currentStep]);

      // Create deployed resource for visualization
      const newResource: DeployedResource = {
        id: `${currentStepData.resourceType}-${Date.now()}`,
        type: currentStepData.resourceType,
        name: currentStepData.resourceType.toUpperCase(),
        properties: { code: currentCode },
        connections: [],
        position: { x: 200 + (currentStep * 150), y: 200 },
        securityLevel: result.securityIssues?.length ? 'warning' : 'secure'
      };

      setDeployedResources(prev => [...prev, newResource]);

      // Update progress
      setProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep],
        score: prev.score + 100
      }));

      // Update gamification progress
      const securityScore = result.securityIssues?.length ? 70 : 95; // Simple scoring
      const bestPracticesCount = result.bestPractices?.length || 0;

      const progressUpdate = gamificationSystem.updateProgress('default', {
        stepsCompleted: 1,
        securityScore,
        bestPracticesFollowed: bestPracticesCount,
        timeSpent: 5 // Assume 5 minutes per step
      });

      // Show achievement notifications
      if (progressUpdate.newAchievements.length > 0) {
        setNewAchievements(progressUpdate.newAchievements);
        setShowAchievementNotification(true);
        setTimeout(() => setShowAchievementNotification(false), 5000);
      }

      // Check if scenario is completed
      if (currentStep === learningSteps.length - 1) {
        const scenarioId = `${scenario.provider}-${scenario.id}`;
        gamificationSystem.updateProgress('default', {
          scenariosCompleted: [scenarioId]
        });
      }
    }

    setIsValidating(false);
  }, [currentCode, currentStep, currentStepData]);

  // Navigation handlers
  const handleNextStep = useCallback(() => {
    if (currentStep < learningSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setCurrentCode(learningSteps[nextStep].codeTemplate);
      setValidationResult(null);
    }
  }, [currentStep, learningSteps]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setCurrentCode(learningSteps[prevStep].codeTemplate);
      setValidationResult(null);
    }
  }, [currentStep, learningSteps]);

  const canProceed = completedSteps.includes(currentStep) || validationResult?.isValid;

  if (learningSteps.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Scenario Not Ready</h3>
          <p className="text-slate-600 mb-6">
            This scenario is still being developed. Please try another scenario or check back later.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Another Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Interactive Learning Studio</h2>
              <p className="text-sm text-slate-600">{scenario.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-slate-600">
                Step {currentStep + 1} of {learningSteps.length}
              </div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: learningSteps.length }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      completedSteps.includes(i) ? 'bg-green-500' :
                      i === currentStep ? 'bg-blue-500' :
                      'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowProgressDashboard(true)}
                className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200 rounded-lg transition-colors"
                title="Progress Dashboard"
              >
                <Award className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowSecurityPanel(!showSecurityPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showSecurityPanel ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Security Panel"
              >
                <Shield className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowBestPracticesPanel(!showBestPracticesPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showBestPracticesPanel ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Best Practices"
              >
                <Lightbulb className="w-4 h-4" />
              </button>

              <button
                className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                title="Save Progress"
              >
                <Save className="w-4 h-4" />
              </button>

              <button
                className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Three-Pane Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Guided Tutorial */}
          <div className="w-1/3 border-r border-slate-200 flex flex-col">
            <GuidedTutorialPane
              step={currentStepData}
              stepNumber={currentStep + 1}
              totalSteps={learningSteps.length}
              isCompleted={completedSteps.includes(currentStep)}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              canProceed={canProceed}
            />
          </div>

          {/* Center Pane: Live Code Editor */}
          <div className="w-1/3 border-r border-slate-200 flex flex-col">
            <LiveCodeEditor
              code={currentCode}
              onChange={handleCodeChange}
              onApply={handleApplyCode}
              isValidating={isValidating}
              validationResult={validationResult}
              language={currentStepData?.language || 'terraform'}
            />
          </div>

          {/* Right Pane: Architecture Canvas */}
          <div className="w-1/3 flex flex-col">
            <div className="flex-1">
              <ArchitectureCanvas
                deployedResources={deployedResources}
                onResourceUpdate={setDeployedResources}
                isAnimating={false}
                scenario={scenario}
              />
            </div>

            {/* Security Dashboard */}
            <div className="border-t border-slate-200 p-4">
              <SecurityDashboard
                code={currentCode}
                resourceType={currentStepData?.resourceType || ''}
                provider={scenario.provider}
                isVisible={showSecurityPanel}
                onToggle={() => setShowSecurityPanel(!showSecurityPanel)}
              />
            </div>
          </div>
        </div>

        {/* Security and Best Practices Panels */}
        <AnimatePresence>
          {showSecurityPanel && validationResult?.securityIssues && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-red-200 bg-red-50 p-4"
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Security Issues Detected</h4>
                  <ul className="space-y-1 text-sm text-red-800">
                    {validationResult.securityIssues.map((issue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {showBestPracticesPanel && validationResult?.bestPractices && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-green-200 bg-green-50 p-4"
            >
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Best Practices Recommendations</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    {validationResult.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500">•</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer with Progress and Achievements */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Completed: {completedSteps.length}/{learningSteps.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>Score: {progress.score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span>Provider: {scenario.provider.toUpperCase()}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              💡 Complete each step to unlock the next one
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Dashboard */}
      <ProgressDashboard
        isOpen={showProgressDashboard}
        onClose={() => setShowProgressDashboard(false)}
        userId="default"
      />

      {/* Achievement Notifications */}
      <AnimatePresence>
        {showAchievementNotification && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            className="fixed top-4 right-4 z-[10000] space-y-2"
          >
            {newAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg border border-yellow-300 max-w-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-white">Achievement Unlocked!</h4>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        +{achievement.points} pts
                      </span>
                    </div>
                    <h5 className="font-semibold text-yellow-100">{achievement.title}</h5>
                    <p className="text-sm text-yellow-100 opacity-90">{achievement.description}</p>
                  </div>
                  <button
                    onClick={() => setShowAchievementNotification(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveLearningPath;
