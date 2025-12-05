import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trophy, Clock, Target, ChevronRight, Play, Star } from 'lucide-react';
import LearningPath from './LearningPath';
import TopicView from './TopicView';
import ChallengeView from './ChallengeView';
import { learningPaths } from '../data/learningPaths';

interface LearningModuleProps {
  onBack?: () => void;
}

const LearningModule: React.FC<LearningModuleProps> = ({ onBack }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    totalXP: 0,
    completedChallenges: 0,
    currentStreak: 0,
    level: 1
  });

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
  };

  const handleBackToSelection = () => {
    setSelectedPath(null);
  };

  if (selectedPath) {
    return <LearningPath pathId={selectedPath} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
            >
              Web Development Learning Paths
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Master modern web development through structured, scenario-based learning with hands-on challenges and real-world projects
            </motion.p>
          </div>

          {/* User Progress Overview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userProgress.totalXP}</div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-3">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userProgress.completedChallenges}</div>
                <div className="text-sm text-gray-600">Challenges</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-3">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userProgress.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">Level {userProgress.level}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
            <p className="text-lg text-gray-600">
              Structured learning experiences designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <LearningPathCard
                key={path.id}
                path={path}
                index={index}
                onClick={() => handlePathSelect(path.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Learning Paths?</h2>
            <p className="text-lg text-gray-600">
              Experience the most effective way to learn modern web development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-blue-600" />}
              title="Scenario-Based Learning"
              description="Learn through real-world scenarios and practical examples that mirror actual development challenges"
              delay={0.9}
            />
            
            <FeatureCard
              icon={<Play className="w-8 h-8 text-green-600" />}
              title="Interactive Challenges"
              description="Hands-on coding challenges with instant feedback and progressive difficulty levels"
              delay={1.0}
            />
            
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-purple-600" />}
              title="Gamified Progress"
              description="Earn XP, unlock achievements, and track your progress as you master React concepts"
              delay={1.1}
            />
            
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-orange-600" />}
              title="Comprehensive Content"
              description="From framework basics to advanced patterns, covering everything you need to become proficient"
              delay={1.2}
            />
            
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-red-600" />}
              title="Self-Paced Learning"
              description="Learn at your own pace with estimated time guides and flexible scheduling"
              delay={1.3}
            />
            
            <FeatureCard
              icon={<Star className="w-8 h-8 text-yellow-600" />}
              title="Expert-Crafted"
              description="Content created by web development experts with years of real-world experience"
              delay={1.4}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface LearningPathCardProps {
  path: any;
  index: number;
  onClick: () => void;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, index, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(path.difficulty)}`}>
              {path.difficulty}
            </span>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {path.title}
        </h3>
        
        <p className="text-gray-600 mb-6 line-clamp-3">
          {path.description}
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <BookOpen className="w-4 h-4" />
              <span>{path.totalTopics} topics</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{path.estimatedHours}h total</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Ready to start?</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium"
              >
                Begin Path
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default LearningModule;
