import React from 'react';
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
  X
} from 'lucide-react';
import { CloudScenario } from '../../data/cloudScenarios';

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
  validation: (code: string) => { isValid: boolean; message: string };
}

export interface DeployedResource {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
  connections: string[];
}

interface InteractiveLearningPathProps {
  scenario: CloudScenario;
  onClose: () => void;
}

const InteractiveLearningPath: React.FC<InteractiveLearningPathProps> = ({ scenario, onClose }) => {
  console.log('🎯 InteractiveLearningPath COMPONENT RENDERED!');
  console.log('📦 Scenario:', scenario);
  console.log('🔧 onClose function:', onClose);

  return (
    <div
      className="fixed inset-0 bg-red-500/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(255, 0, 0, 0.9)' // Red background to make it obvious
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Interactive Learning Path</h2>
              <p className="text-sm text-gray-500">{scenario.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Coming Soon Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon! 🚀</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Interactive Learning Paths are currently in development. This feature will provide
              step-by-step guided tutorials with hands-on coding exercises, real-time feedback,
              and interactive architecture building.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Step-by-step guided tutorials</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Interactive code editor</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Real-time architecture visualization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Progress tracking & achievements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Expected release: Q2 2024
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLearningPath;
