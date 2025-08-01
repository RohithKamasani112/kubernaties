import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Zap,
  Award,
  Users,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Code,
  TestTube,
  Rocket,
  Settings
} from 'lucide-react';
import { Blueprint, BlueprintMilestone, BlueprintTask } from '../data/blueprintTypes';

interface BlueprintMilestonePanelProps {
  blueprint: Blueprint;
  currentMilestone: string;
  activeTab: 'milestone' | 'docs' | 'architecture';
  onTabChange: (tab: 'milestone' | 'docs' | 'architecture') => void;
  onMilestoneChange: (milestoneId: string) => void;
}

const BlueprintMilestonePanel: React.FC<BlueprintMilestonePanelProps> = ({
  blueprint,
  currentMilestone,
  activeTab,
  onTabChange,
  onMilestoneChange
}) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const getCurrentMilestone = (): BlueprintMilestone | undefined => {
    return blueprint.milestones.find(m => m.id === currentMilestone);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'setup': return <Settings className="w-4 h-4" />;
      case 'frontend': return <Code className="w-4 h-4" />;
      case 'backend': return <Settings className="w-4 h-4" />;
      case 'testing': return <TestTube className="w-4 h-4" />;
      case 'deployment': return <Rocket className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'planning': return <Target className="w-4 h-4" />;
      case 'development': return <Code className="w-4 h-4" />;
      case 'testing': return <TestTube className="w-4 h-4" />;
      case 'deployment': return <Rocket className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getCompletedTasksCount = (milestone: BlueprintMilestone): number => {
    return milestone.tasks.filter(task => completedTasks.has(task.id)).length;
  };

  const getProgressPercentage = (milestone: BlueprintMilestone): number => {
    const completed = getCompletedTasksCount(milestone);
    const total = milestone.tasks.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const renderTask = (task: BlueprintTask) => {
    const isExpanded = expandedTasks.has(task.id);
    const isCompleted = completedTasks.has(task.id);

    return (
      <div key={task.id} className="border border-gray-200 rounded-lg mb-3">
        <div
          className={`p-3 cursor-pointer hover:bg-gray-50 ${
            isCompleted ? 'bg-green-50' : ''
          }`}
          onClick={() => toggleTask(task.id)}
        >
          <div className="flex items-start space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskCompletion(task.id);
              }}
              className={`mt-0.5 ${
                isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="text-gray-500">
                  {getTaskIcon(task.type)}
                </div>
                <h4 className={`font-medium ${
                  isCompleted ? 'text-green-900 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h4>
                {task.optional && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                    Optional
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedTime}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>{task.type}</span>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200 p-3 bg-gray-50"
            >
              {/* Learning Objectives */}
              {task.learningObjectives.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Learning Objectives</span>
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {task.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hints */}
              {task.hints.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>Hints</span>
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {task.hints.map((hint, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-500 mt-1">💡</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Validation Criteria */}
              {task.validationCriteria.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Success Criteria</span>
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {task.validationCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderMilestoneTab = () => {
    const milestone = getCurrentMilestone();
    if (!milestone) return null;

    const progress = getProgressPercentage(milestone);
    const completedCount = getCompletedTasksCount(milestone);

    return (
      <div className="p-4">
        {/* Milestone Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-blue-600">
              {getPhaseIcon(milestone.phase)}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{milestone.title}</h2>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{milestone.description}</p>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {completedCount}/{milestone.tasks.length} tasks ({progress}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {milestone.estimatedTime}h
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-purple-600 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">XP</span>
              </div>
              <div className="text-lg font-semibold text-purple-900">
                {milestone.xpReward}
              </div>
            </div>
          </div>

          {/* User Story */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-1">User Story</h4>
            <p className="text-sm text-yellow-700">{milestone.userStory}</p>
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-3">Tasks</h3>
          {milestone.tasks.map(renderTask)}
        </div>

        {/* Milestone Navigation */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const currentIndex = blueprint.milestones.findIndex(m => m.id === currentMilestone);
                if (currentIndex > 0) {
                  onMilestoneChange(blueprint.milestones[currentIndex - 1].id);
                }
              }}
              disabled={blueprint.milestones.findIndex(m => m.id === currentMilestone) === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Previous</span>
            </button>

            <span className="text-sm text-gray-500">
              {blueprint.milestones.findIndex(m => m.id === currentMilestone) + 1} of {blueprint.milestones.length}
            </span>

            <button
              onClick={() => {
                const currentIndex = blueprint.milestones.findIndex(m => m.id === currentMilestone);
                if (currentIndex < blueprint.milestones.length - 1) {
                  onMilestoneChange(blueprint.milestones[currentIndex + 1].id);
                }
              }}
              disabled={blueprint.milestones.findIndex(m => m.id === currentMilestone) === blueprint.milestones.length - 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDocsTab = () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h3>
      
      {/* Learning Resources */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Learning Resources</h4>
        <div className="space-y-2">
          {blueprint.learningResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{resource.title}</div>
                <div className="text-sm text-gray-600">{resource.description}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Key Concepts */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Key Concepts</h4>
        <div className="grid grid-cols-1 gap-2">
          {getCurrentMilestone()?.keyConcepts.map((concept, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">{concept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Prerequisites</h4>
        <ul className="space-y-2">
          {blueprint.prerequisites.map((prereq, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>{prereq}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderArchitectureTab = () => (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Architecture</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-gray-900 mb-2">{blueprint.architecture.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{blueprint.architecture.description}</p>
        
        {/* Architecture diagram would be rendered here */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Architecture diagram</p>
          <p className="text-xs text-gray-400">Mermaid diagram would be rendered here</p>
        </div>
      </div>

      {/* Components */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Components</h4>
        <div className="space-y-3">
          {blueprint.architecture.components.map((component, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <h5 className="font-medium text-gray-900">{component.name}</h5>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {component.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{component.description}</p>
              <div className="flex flex-wrap gap-1">
                {component.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex space-x-8 px-4">
          {[
            { id: 'milestone', label: 'Milestone', icon: Target },
            { id: 'docs', label: 'Docs', icon: BookOpen },
            { id: 'architecture', label: 'Architecture', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'milestone' && renderMilestoneTab()}
        {activeTab === 'docs' && renderDocsTab()}
        {activeTab === 'architecture' && renderArchitectureTab()}
      </div>
    </div>
  );
};

export default BlueprintMilestonePanel;
