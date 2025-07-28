import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, CheckCircle, Clock, Trophy, BookOpen, Target, Lightbulb } from 'lucide-react';
import { LearningPath as LearningPathType, LearningTopic, LearningChallenge } from '../data/learningPaths';
import { reactLearningPath } from '../data/learningPaths';

interface LearningPathProps {
  pathId?: string;
}

const LearningPath: React.FC<LearningPathProps> = ({ pathId = 'react-fundamentals' }) => {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<LearningChallenge | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'overview' | 'topic' | 'challenge'>('overview');

  const learningPath = reactLearningPath; // In a real app, this would be fetched based on pathId

  const handleTopicSelect = (topic: LearningTopic) => {
    setSelectedTopic(topic);
    setCurrentView('topic');
  };

  const handleChallengeSelect = (challenge: LearningChallenge) => {
    setSelectedChallenge(challenge);
    setCurrentView('challenge');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedTopic(null);
    setSelectedChallenge(null);
  };

  const handleBackToTopic = () => {
    setCurrentView('topic');
    setSelectedChallenge(null);
  };

  const markTopicComplete = (topicId: string) => {
    setCompletedTopics(prev => new Set([...prev, topicId]));
  };

  const markChallengeComplete = (challengeId: string) => {
    setCompletedChallenges(prev => new Set([...prev, challengeId]));
  };

  const getProgressPercentage = () => {
    return Math.round((completedTopics.size / learningPath.totalTopics) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'overview' && (
            <OverviewView
              learningPath={learningPath}
              completedTopics={completedTopics}
              onTopicSelect={handleTopicSelect}
              progressPercentage={getProgressPercentage()}
            />
          )}
          
          {currentView === 'topic' && selectedTopic && (
            <TopicView
              topic={selectedTopic}
              completedChallenges={completedChallenges}
              onChallengeSelect={handleChallengeSelect}
              onBack={handleBackToOverview}
              onMarkComplete={markTopicComplete}
            />
          )}
          
          {currentView === 'challenge' && selectedChallenge && (
            <ChallengeView
              challenge={selectedChallenge}
              onBack={handleBackToTopic}
              onMarkComplete={markChallengeComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface OverviewViewProps {
  learningPath: LearningPathType;
  completedTopics: Set<string>;
  onTopicSelect: (topic: LearningTopic) => void;
  progressPercentage: number;
}

const OverviewView: React.FC<OverviewViewProps> = ({
  learningPath,
  completedTopics,
  onTopicSelect,
  progressPercentage
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {learningPath.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          {learningPath.description}
        </motion.p>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{learningPath.totalTopics}</div>
            <div className="text-sm text-gray-600">Topics</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-3">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{learningPath.estimatedHours}h</div>
            <div className="text-sm text-gray-600">Est. Time</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-3">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedTopics.size}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Learning Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="w-6 h-6 text-blue-600 mr-3" />
          What You'll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningPath.learningOutcomes.map((outcome, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{outcome}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
          Learning Topics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPath.topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              isCompleted={completedTopics.has(topic.id)}
              onClick={() => onTopicSelect(topic)}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface TopicCardProps {
  topic: LearningTopic;
  index: number;
  isCompleted: boolean;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, index, isCompleted, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isCompleted ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
              {topic.difficulty}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {topic.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {topic.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{topic.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Play className="w-4 h-4" />
            <span>{topic.challenges.length} challenges</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningPath;
