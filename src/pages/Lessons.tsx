import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveLessonViewer from '../components/lessons/InteractiveLessonViewer';
import DiagramLearning from '../components/lessons/DiagramLearning';
import { lessons, Lesson } from '../data/lessons';
import {
  PlayCircle,
  Clock,
  Star,
  ArrowRight,
  ArrowDown,
  BookOpen,
  X,
  Trophy,
  Target,
  Zap,
  Shield,
  CheckCircle,
  Lock,
  Rocket,
  Brain,
  Sparkles,
  Award,
  Search,
  MapPin,
  Route,
  Flag,
  Map,
  Network,
  Eye
} from 'lucide-react';

const Lessons: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhase, setActivePhase] = useState<number>(1);
  const [showDiagramLearning, setShowDiagramLearning] = useState(false);

  // Learning roadmap phases with clear progression
  const learningPhases = [
    {
      id: 1,
      title: "Foundation Phase",
      subtitle: "Start Here - Build Your Base",
      description: "Essential concepts every Kubernetes beginner needs to know",
      icon: BookOpen,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      estimatedTime: "2-3 weeks",
      difficulty: "Beginner",
      lessons: lessons.filter(l => l.difficulty === 'Beginner').slice(0, 12)
    },
    {
      id: 2,
      title: "Core Operations",
      subtitle: "Build Real Skills",
      description: "Learn to deploy and manage applications effectively",
      icon: Target,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      estimatedTime: "3-4 weeks",
      difficulty: "Intermediate",
      lessons: lessons.filter(l => l.difficulty === 'Intermediate').slice(0, 15)
    },
    {
      id: 3,
      title: "Advanced Patterns",
      subtitle: "Scale & Optimize",
      description: "Master complex scenarios and production patterns",
      icon: Zap,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      estimatedTime: "4-5 weeks",
      difficulty: "Advanced",
      lessons: lessons.filter(l => l.difficulty === 'Advanced')
    },
    {
      id: 4,
      title: "Production Mastery",
      subtitle: "Expert Level",
      description: "Production-ready deployments, security, and best practices",
      icon: Award,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700",
      estimatedTime: "3-4 weeks",
      difficulty: "Expert",
      lessons: lessons.filter(l => l.difficulty === 'Expert')
    }
  ];

  // Get filtered lessons for search
  const getFilteredLessons = () => {
    if (!searchQuery) return [];

    return lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredLessons = getFilteredLessons();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Route className="w-4 h-4" />
            Your Learning Roadmap
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Kubernetes Learning Path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Follow our structured path from beginner to expert. Each phase builds on the previous one.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results ({filteredLessons.length})
              </h3>
              <div className="grid gap-4">
                {filteredLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {lesson.difficulty}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                        </div>
                      </div>
                      <PlayCircle className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Diagram Learning Feature */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-lg rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <Map className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Learn from Interactive Diagrams</h3>
                        <p className="text-blue-100">Visual exploration of Kubernetes architecture</p>
                      </div>
                    </div>

                    <p className="text-blue-100 mb-6 max-w-2xl">
                      Explore Kubernetes components through an interactive node-based map.
                      Hover over components for quick insights, click for detailed explanations,
                      and export your learning materials as PDF for offline study.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                        <Network className="w-4 h-4" />
                        <span className="text-sm">Interactive Architecture Map</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Hover Tooltips & Click Details</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">Export to PDF</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowDiagramLearning(true)}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2 shadow-lg"
                    >
                      <Map className="w-5 h-5" />
                      Explore Architecture Map
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preview Animation */}
                  <div className="hidden lg:block">
                    <div className="relative w-64 h-48">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute top-4 left-4 w-16 h-16 bg-white bg-opacity-30 rounded-xl flex items-center justify-center"
                      >
                        <span className="text-2xl">🧠</span>
                      </motion.div>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          y: [0, -10, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="absolute top-16 right-8 w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-lg">🚀</span>
                      </motion.div>
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          x: [0, 10, 0]
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                        className="absolute bottom-8 left-8 w-14 h-14 bg-white bg-opacity-30 rounded-full flex items-center justify-center"
                      >
                        <span className="text-xl">🔗</span>
                      </motion.div>

                      {/* Connecting Lines */}
                      <svg className="absolute inset-0 w-full h-full">
                        <motion.path
                          d="M 60 60 Q 120 80 180 100"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.path
                          d="M 180 100 Q 140 140 100 160"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learning Roadmap */}
        {!searchQuery && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Start Your Journey Here
              </h2>
              <p className="text-gray-600">
                Follow the phases in order for the best learning experience
              </p>
            </motion.div>

            {learningPhases.map((phase, phaseIndex) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + phaseIndex * 0.1 }}
                className="relative"
              >
                {/* Phase Header */}
                <div className={`${phase.bgColor} ${phase.borderColor} border-2 rounded-xl p-6 mb-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${phase.color} rounded-lg flex items-center justify-center`}>
                        <phase.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-xl font-bold ${phase.textColor}`}>
                            Phase {phase.id}: {phase.title}
                          </h3>
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                            {phase.estimatedTime}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium">{phase.subtitle}</p>
                        <p className="text-gray-600 text-sm mt-1">{phase.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${phase.textColor}`}>
                        {phase.lessons.length}
                      </div>
                      <div className="text-sm text-gray-600">lessons</div>
                    </div>
                  </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {phase.lessons.map((lesson, lessonIndex) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + phaseIndex * 0.1 + lessonIndex * 0.05 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                        <PlayCircle className="w-6 h-6 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {lesson.category}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">4.8</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Phase Connector */}
                {phaseIndex < learningPhases.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <ArrowDown className="w-5 h-5" />
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
            >
              <Flag className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 mb-4">
                Begin with Phase 1 and work your way up to become a Kubernetes expert
              </p>
              <button
                onClick={() => setSelectedLesson(learningPhases[0].lessons[0])}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
              >
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Interactive Lesson Viewer Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <InteractiveLessonViewer
            lesson={selectedLesson}
            onClose={() => setSelectedLesson(null)}
            onComplete={() => {
              setSelectedLesson(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Diagram Learning Modal */}
      <AnimatePresence>
        {showDiagramLearning && (
          <DiagramLearning
            onClose={() => setShowDiagramLearning(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lessons;
