import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveLessonViewer from '../components/lessons/InteractiveLessonViewer';
import { lessons, Lesson } from '../data/lessons';
import {
  PlayCircle,
  Clock,
  Star,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  X,
  Trophy,
  Target,
  Zap,
  Shield,
  Network,
  Database,
  Settings,
  Activity,
  Users,
  GitBranch,
  Monitor,
  Cloud,
  Gamepad2,
  Code,
  Video,
  PuzzlePiece,
  Lightbulb,
  Rocket,
  Brain,
  Sparkles,
  Award,
  Search
} from 'lucide-react';

const Lessons: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('beginner');
  // Removed completion tracking - all lessons are accessible
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const categories = [
    {
      id: 'beginner',
      name: 'Beginner',
      subtitle: 'Foundations',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-blue-400 to-blue-600',
      lessons: 25,
      description: 'Master the fundamentals with interactive animations'
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      subtitle: 'Core Ops',
      icon: Target,
      color: 'bg-gradient-to-r from-blue-500 to-blue-700',
      lessons: 30,
      description: 'Dive deep into operational concepts'
    },
    {
      id: 'advanced',
      name: 'Advanced',
      subtitle: 'Scaling & Ecosystem',
      icon: Zap,
      color: 'bg-gradient-to-r from-blue-600 to-blue-800',
      lessons: 25,
      description: 'Advanced patterns and ecosystem tools'
    },
    {
      id: 'expert',
      name: 'Expert',
      subtitle: 'Production & Security',
      icon: Award,
      color: 'bg-gradient-to-r from-blue-700 to-blue-900',
      lessons: 20,
      description: 'Production-ready deployments and security'
    }
  ];

  // Filter lessons based on active filters
  const getFilteredLessons = () => {
    let filtered = lessons;

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.difficulty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply topic filter
    if (selectedTopic) {
      filtered = filtered.filter(lesson =>
        lesson.category.toLowerCase().includes(selectedTopic.toLowerCase()) ||
        lesson.title.toLowerCase().includes(selectedTopic.toLowerCase()) ||
        lesson.description.toLowerCase().includes(selectedTopic.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredLessons = getFilteredLessons();

  // Map lessons by difficulty for categorization
  const lessonsByCategory = {
    beginner: filteredLessons.filter(lesson => lesson.difficulty === 'Beginner'),
    intermediate: filteredLessons.filter(lesson => lesson.difficulty === 'Intermediate'),
    advanced: filteredLessons.filter(lesson => lesson.difficulty === 'Advanced'),
    expert: filteredLessons.filter(lesson => lesson.difficulty === 'Expert')
  };

  const allLessons = filteredLessons;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'animation': return Video;
      case 'interactive': return Target;
      case 'hands-on': return Code;
      case 'game': return Gamepad2;
      case 'simulation': return Activity;
      case 'project': return Award;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'animation': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'interactive': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'hands-on': return 'text-green-600 bg-green-100 border-green-200';
      case 'game': return 'text-pink-600 bg-pink-100 border-pink-200';
      case 'simulation': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'project': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 pb-20 min-h-screen">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Interactive Kubernetes Mastery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8"
          >
            🚀 Master Kubernetes with <span className="font-semibold text-blue-600">animated lessons</span>,
            <span className="font-semibold text-purple-600"> interactive simulations</span>, and
            <span className="font-semibold text-green-600"> hands-on challenges</span>
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
              <input
                type="text"
                placeholder="Search lessons by topic, difficulty, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Progress Overview with Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12 border border-white/20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Journey</h2>
              <p className="text-gray-600">Track your progress across all skill levels</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const categoryLessons = lessonsByCategory[category.id as keyof typeof lessonsByCategory] || [];
              const total = category.lessons;
              // All lessons are available - no completion tracking

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 group-hover:scale-105">
                    <div className="text-center">
                      <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{category.subtitle}</p>
                      <p className="text-xs text-gray-400 mb-4">{category.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Available Lessons</span>
                          <span className="font-semibold text-gray-900">{total}</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 1.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                            className={`h-3 rounded-full ${category.color} relative`}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </motion.div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                          <BookOpen className="w-3 h-3" />
                          <span>All lessons unlocked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Topic Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Learn by Topic</h3>
            {selectedTopic && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Active: {selectedTopic.toUpperCase()}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'WORKLOADS', count: 7, icon: '🚀', color: 'bg-blue-500' },
              { name: 'NETWORKING', count: 6, icon: '🌐', color: 'bg-green-500' },
              { name: 'CONFIGURATION & STORAGE', count: 6, icon: '⚙️', color: 'bg-purple-500' },
              { name: 'SECURITY & RBAC', count: 7, icon: '🔒', color: 'bg-red-500' },
              { name: 'AUTOSCALING & MONITORING', count: 5, icon: '📊', color: 'bg-yellow-500' },
              { name: 'ADVANCED RESOURCES', count: 8, icon: '🔧', color: 'bg-indigo-500' },
              { name: 'CLUSTER MANAGEMENT', count: 5, icon: '🏗️', color: 'bg-pink-500' }
            ].map((segment, index) => (
              <motion.div
                key={segment.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className={`rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 ${
                  selectedTopic === segment.name.toLowerCase().split(' ')[0]
                    ? 'bg-blue-100 border-2 border-blue-500 ring-2 ring-blue-200'
                    : 'bg-white'
                }`}
                onClick={() => {
                  const topicKey = segment.name.toLowerCase().split(' ')[0];
                  if (selectedTopic === topicKey) {
                    setSelectedTopic(null); // Deselect if already selected
                  } else {
                    setSelectedTopic(topicKey);
                    setSearchQuery(''); // Clear search
                  }
                }}
              >
                <div className={`w-12 h-12 ${segment.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{segment.icon}</span>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-sm text-gray-800 mb-1">{segment.name}</h4>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-lg font-bold text-gray-900">{segment.count}</span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>



        {/* Interactive Lessons Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {lessonsByCategory[selectedCategory as keyof typeof lessonsByCategory]?.map((lesson, index) => {
              const TypeIcon = Video; // Default to animation icon since all lessons have animations
              // All lessons are unlocked and accessible

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 cursor-pointer hover:-translate-y-2"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl border-2 text-blue-600 bg-blue-100 border-blue-200 group-hover:scale-110 transition-transform duration-300">
                        <TypeIcon className="w-8 h-8" />
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* All lessons are available - no status indicators needed */}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {lesson.description}
                      </p>

                      {/* Animation Feature Badge */}
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>Interactive Animation</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between mb-6 text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-blue-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium">{lesson.category}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {lesson.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    >
                      <PlayCircle className="w-5 h-5" />
                      <span>Start Interactive Lesson</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-8 py-4 rounded-2xl border border-blue-200">
            <BookOpen className="w-6 h-6" />
            <span className="font-bold text-lg">
              {selectedTopic
                ? `${filteredLessons.length} Lessons Found for Topic: ${selectedTopic.toUpperCase()}`
                : searchQuery
                ? `${filteredLessons.length} Lessons Found for "${searchQuery}"`
                : '58 Comprehensive Kubernetes Lessons Available - Complete Learning Path!'
              }
            </span>
            <Sparkles className="w-6 h-6" />
          </div>

          {/* Clear Filters Button */}
          {(selectedTopic || searchQuery) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setSelectedTopic(null);
                setSearchQuery('');
                setSelectedCategory('beginner');
              }}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Interactive Lesson Viewer Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <InteractiveLessonViewer
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onComplete={() => {
              // No completion tracking needed - just close the lesson
              setSelectedLesson(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lessons;
