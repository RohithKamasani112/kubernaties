import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, Clock, Trophy, Lightbulb, Target, BookOpen, Code } from 'lucide-react';
import { LearningTopic, LearningChallenge } from '../data/learningPaths';

interface TopicViewProps {
  topic: LearningTopic;
  completedChallenges: Set<string>;
  onChallengeSelect: (challenge: LearningChallenge) => void;
  onBack: () => void;
  onMarkComplete: (topicId: string) => void;
}

const TopicView: React.FC<TopicViewProps> = ({
  topic,
  completedChallenges,
  onChallengeSelect,
  onBack,
  onMarkComplete
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'playground': return <Code className="w-5 h-5" />;
      case 'challenge': return <Trophy className="w-5 h-5" />;
      case 'mini-project': return <Target className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'playground': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'challenge': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mini-project': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const completedChallengesCount = topic.challenges.filter(c => completedChallenges.has(c.id)).length;
  const progressPercentage = topic.challenges.length > 0 ? Math.round((completedChallengesCount / topic.challenges.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </motion.button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(topic.difficulty)}`}>
              {topic.difficulty}
            </span>
            <span className="text-sm text-gray-500">{topic.estimatedTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{topic.description}</p>
        </div>
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Progress</h2>
          <span className="text-sm font-medium text-gray-600">{completedChallengesCount}/{topic.challenges.length} challenges</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
          />
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
          <span className="text-gray-600 ml-2">Complete</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              Explanation
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{topic.explanation}</p>
            </div>
          </motion.div>

          {/* Scenario */}
          {topic.scenario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-6 h-6 text-purple-600 mr-3" />
                Scenario
              </h2>
              <p className="text-gray-700 leading-relaxed">{topic.scenario}</p>
            </motion.div>
          )}

          {/* Animation Script */}
          {topic.animationScript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Play className="w-6 h-6 text-green-600 mr-3" />
                  Visual Learning
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnimation(!showAnimation)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAnimation ? 'Hide' : 'Show'} Animation
                </motion.button>
              </div>
              
              {showAnimation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300"
                >
                  <p className="text-gray-700 italic whitespace-pre-line">{topic.animationScript}</p>
                  <div className="mt-4 text-center">
                    <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      🎬 Animation Preview
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Outcomes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
              Learning Outcomes
            </h3>
            <ul className="space-y-3">
              {topic.learningOutcomes.map((outcome, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{outcome}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Prerequisites */}
          {topic.prerequisites && topic.prerequisites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-orange-50 rounded-xl border border-orange-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
              <ul className="space-y-2">
                {topic.prerequisites.map((prereq, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>

      {/* Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-6 h-6 text-purple-600 mr-3" />
          Challenges ({topic.challenges.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
              isCompleted={completedChallenges.has(challenge.id)}
              onClick={() => onChallengeSelect(challenge)}
            />
          ))}
        </div>
      </motion.div>

      {/* Complete Topic Button */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkComplete(topic.id)}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Mark Topic Complete
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

interface ChallengeCardProps {
  challenge: LearningChallenge;
  index: number;
  isCompleted: boolean;
  onClick: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, index, isCompleted, onClick }) => {
  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'playground': return <Code className="w-5 h-5" />;
      case 'challenge': return <Trophy className="w-5 h-5" />;
      case 'mini-project': return <Target className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'playground': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'challenge': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mini-project': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
      transition={{ delay: 1.0 + index * 0.1 }}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border-l-4 border-blue-500"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg border ${getChallengeTypeColor(challenge.type)}`}>
              {getChallengeTypeIcon(challenge.type)}
            </div>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getChallengeTypeColor(challenge.type)} border`}>
                {challenge.type}
              </span>
            </div>
          </div>
          
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {challenge.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{challenge.estimatedTime}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-purple-600">
            <Trophy className="w-4 h-4" />
            <span className="font-medium">{challenge.xpReward} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicView;
