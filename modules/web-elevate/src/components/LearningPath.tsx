import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Trophy,
  BookOpen,
  Target,
  Lightbulb,
  Star,
  Award,
  Zap,
  Filter,
  Search,
  BarChart3,
  Users,
  TrendingUp,
  ArrowLeft,
  Lock,
  Unlock
} from 'lucide-react';
import { LearningPath as LearningPathType, LearningTopic, LearningChallenge } from '../data/learningPaths';
import { reactLearningPath } from '../data/learningPaths';

interface LearningPathProps {
  pathId?: string;
}

const LearningPath: React.FC<LearningPathProps> = ({ pathId = 'react-mastery' }) => {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<LearningChallenge | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'overview' | 'topic' | 'challenge'>('overview');

  // New state for improved UI
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fundamentals' | 'intermediate' | 'advanced'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Filter topics based on search and filters
  const filteredTopics = learningPath.topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

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
              filteredTopics={filteredTopics}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              viewMode={viewMode}
              setViewMode={setViewMode}
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
  filteredTopics: LearningTopic[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDifficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  setSelectedDifficulty: (difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced') => void;
  selectedCategory: 'all' | 'fundamentals' | 'intermediate' | 'advanced';
  setSelectedCategory: (category: 'all' | 'fundamentals' | 'intermediate' | 'advanced') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const OverviewView: React.FC<OverviewViewProps> = ({
  learningPath,
  completedTopics,
  onTopicSelect,
  progressPercentage,
  filteredTopics,
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode
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

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="fundamentals">Fundamentals</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredTopics.length} of {learningPath.totalTopics} topics
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          <span>{completedTopics.size} completed</span>
        </div>
      </motion.div>

      {/* Topics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
            Learning Topics
          </div>
          <div className="text-sm font-normal text-gray-500">
            {filteredTopics.length} topics
          </div>
        </h2>

        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredTopics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              isCompleted={completedTopics.has(topic.id)}
              onClick={() => onTopicSelect(topic)}
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

interface TopicCardProps {
  topic: LearningTopic;
  index: number;
  isCompleted: boolean;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, index, isCompleted, onClick, viewMode = 'grid' }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🚀';
      case 'advanced': return '⚡';
      default: return '📚';
    }
  };

  const getTopicIcon = (title: string) => {
    if (title.toLowerCase().includes('component')) return '🧩';
    if (title.toLowerCase().includes('hook')) return '🎣';
    if (title.toLowerCase().includes('state')) return '🔄';
    if (title.toLowerCase().includes('prop')) return '📦';
    if (title.toLowerCase().includes('event')) return '⚡';
    if (title.toLowerCase().includes('router')) return '🛣️';
    if (title.toLowerCase().includes('context')) return '🌐';
    if (title.toLowerCase().includes('effect')) return '✨';
    return '⚛️';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: 8, scale: 1.01 }}
        onClick={onClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border-l-4 border-blue-500 hover:border-blue-600"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Enhanced Number/Status Circle */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-md ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
              }`}>
                {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
              </div>

              {/* Topic Icon */}
              <div className="text-2xl">
                {getTopicIcon(topic.title)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {topic.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(topic.difficulty)}`}>
                    {getDifficultyIcon(topic.difficulty)} {topic.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-base truncate font-medium">
                  {topic.description}
                </p>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{topic.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Play className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{topic.challenges.length} challenges</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100 hover:border-blue-200"
    >
      {/* Header with gradient background */}
      <div className={`h-2 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}></div>

      <div className="p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Enhanced Number/Status Circle */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg ${
              isCompleted
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
            }`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>

            {/* Topic Icon */}
            <div className="text-2xl">
              {getTopicIcon(topic.title)}
            </div>
          </div>

          {/* Difficulty Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(topic.difficulty)}`}>
            {getDifficultyIcon(topic.difficulty)} {topic.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {topic.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {topic.description}
        </p>

        {/* Stats Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">{topic.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
            <Play className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">{topic.challenges.length} challenges</span>
          </div>
        </div>

        {/* Progress Indicator */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 flex items-center justify-center space-x-2 bg-green-50 text-green-700 py-2 rounded-lg"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Completed! 🎉</span>
          </motion.div>
        )}

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </div>
      </div>
    </motion.div>
  );
};

export default LearningPath;
