import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight,
  Play,
  BookOpen,
  Palette,
  Zap,
  Cloud,
  Shield,
  Cpu,
  Database,
  Network,
  Settings,
  Award,
  Target,
  Users,
  TrendingUp,
  Clock,
  Star,
  Trophy,
  Search,
  ChevronRight,
  Lightbulb,
  Calendar,
  BarChart3,
  Activity,
  Flame,
  Edit3,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCloudArchitecture } from '../context/CloudArchitectureContext';

const HomePage: React.FC = () => {
  const { state, gamificationSystem } = useCloudArchitecture();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration - in real app this would come from API/context
  const [recentActivity] = useState([
    {
      id: '1',
      title: 'AWS Web Application Architecture',
      type: 'scenario',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      progress: 75,
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'Multi-tier Security Setup',
      type: 'project',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      progress: 100,
      status: 'completed'
    },
    {
      id: '3',
      title: 'Serverless Data Pipeline',
      type: 'lesson',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      progress: 45,
      status: 'in-progress'
    }
  ]);

  const [dailyChallenge] = useState({
    title: 'Design a Cost-Optimized E-commerce Platform',
    description: 'Create a scalable e-commerce architecture on AWS that handles 10k concurrent users while keeping costs under $200/month',
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate',
    points: 150,
    category: 'Cost Optimization'
  });

  const [learningTip] = useState({
    title: 'VPC Peering Best Practice',
    content: 'VPC peering connections are not transitive. If VPC A peers with VPC B, and VPC B peers with VPC C, VPC A cannot communicate with VPC C through VPC B.',
    category: 'Networking'
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get user's current level title
  const getUserLevelTitle = (level: number) => {
    const titles = {
      1: 'Cloud Novice',
      2: 'Cloud Explorer',
      3: 'Cloud Architect',
      4: 'Cloud Expert',
      5: 'Cloud Master'
    };
    return titles[level as keyof typeof titles] || 'Cloud Professional';
  };

  // Calculate progress percentage for current level
  const getProgressPercentage = () => {
    if (!state.userProgress) return 0;
    const { experiencePoints, experienceToNextLevel } = state.userProgress;
    return Math.round((experiencePoints / (experiencePoints + experienceToNextLevel)) * 100);
  };

  // Get next suggested action based on user progress
  const getNextSuggestedAction = () => {
    if (!state.userProgress) {
      return {
        title: 'Start Your Cloud Journey',
        description: 'Begin with our interactive learning studio to master cloud fundamentals',
        action: 'Start Learning',
        href: 'studio',
        icon: BookOpen
      };
    }

    if (state.userProgress.statistics.scenariosCompleted < 3) {
      return {
        title: 'Complete Your First Scenarios',
        description: 'Practice with hands-on scenarios to build real-world cloud skills',
        action: 'Browse Scenarios',
        href: 'scenarios',
        icon: Target
      };
    }

    if (state.userProgress.level < 3) {
      return {
        title: 'Try the AI Generator',
        description: 'Generate production-ready architectures with AI assistance',
        action: 'Try AI Generator',
        href: 'ai-generator',
        icon: Zap
      };
    }

    return {
      title: 'Build Custom Architecture',
      description: 'Use our canvas builder to design your own cloud solutions',
      action: 'Open Canvas',
      href: 'builder',
      icon: Palette
    };
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const nextAction = getNextSuggestedAction();

  const quickAccessShortcuts = [
    { name: 'Load Balancer', icon: '⚖️', href: 'studio?service=load-balancer' },
    { name: 'VPC Setup', icon: '🌐', href: 'studio?service=vpc' },
    { name: 'Terraform', icon: '🏗️', href: 'ai-generator?export=terraform' },
    { name: 'CI/CD Pipeline', icon: '🔄', href: 'scenarios?category=devops' },
    { name: 'Serverless', icon: '⚡', href: 'scenarios?category=serverless' },
    { name: 'Security', icon: '🔒', href: 'scenarios?category=security' }
  ];

  const platformTrends = [
    { name: 'Serverless Blog Architecture', usage: '89%', trend: 'up' },
    { name: 'Microservices on Kubernetes', usage: '76%', trend: 'up' },
    { name: 'Multi-Region Setup', usage: '64%', trend: 'stable' },
    { name: 'Event-Driven Architecture', usage: '58%', trend: 'up' }
  ];

  return (
    <>
      <Helmet>
        <title>Cloud Architecture Dashboard - Interactive Learning Platform</title>
        <meta name="description" content="Your personalized cloud architecture learning dashboard with progress tracking, challenges, and guided learning paths." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">

          {/* Beta Notice - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 sm:mb-6"
          >
            <div className="bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <motion.div
                  className="w-3 h-3 bg-orange-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-semibold text-orange-800 mb-1">
                    🚀 You're using the Beta version of Cloud Architecture Studio!
                  </p>
                  <p className="text-xs text-orange-700">
                    New features and improvements are being added regularly. Share your feedback to help us improve!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Welcome Header - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 mb-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                  Welcome to Cloud Architecture Studio 👋
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600">
                  {state.userProgress ? (
                    <>Level {state.userProgress.level} – {getUserLevelTitle(state.userProgress.level)}</>
                  ) : (
                    'Ready to start your cloud journey?'
                  )}
                </p>
              </div>
              <div className="text-left sm:text-right text-xs sm:text-sm text-slate-500 flex-shrink-0">
                <div>{currentTime.toLocaleDateString()}</div>
                <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </motion.div>

          {/* Main Dashboard Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">

              {/* Progress Tracker Panel - Mobile Responsive */}
              {state.userProgress && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Learning Progress</h2>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-600">
                      <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                      <span>{state.userProgress.currentStreak} day streak</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Level {state.userProgress.level} Progress
                      </span>
                      <span className="text-sm text-slate-600">
                        {getProgressPercentage()}% complete
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>{state.userProgress.experiencePoints} XP</span>
                      <span>{state.userProgress.experiencePoints + state.userProgress.experienceToNextLevel} XP</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {state.userProgress.statistics.scenariosCompleted}
                      </div>
                      <div className="text-sm text-slate-600">Scenarios Completed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {state.userProgress.achievements.length}
                      </div>
                      <div className="text-sm text-slate-600">Achievements</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {Math.floor(state.userProgress.totalTimeSpent / 60)}h
                      </div>
                      <div className="text-sm text-slate-600">Time Spent</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {state.userProgress.totalPoints}
                      </div>
                      <div className="text-sm text-slate-600">Total Points</div>
                    </div>
                  </div>

                  {/* Recent Badges */}
                  {state.userProgress.achievements.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h3 className="text-sm font-medium text-slate-700 mb-3">Recent Achievements</h3>
                      <div className="flex space-x-3">
                        {state.userProgress.achievements.slice(-3).map((achievement, index) => (
                          <div key={achievement.id} className="flex items-center space-x-2 bg-slate-50 rounded-lg px-3 py-2">
                            <span className="text-lg">{achievement.icon}</span>
                            <span className="text-sm font-medium text-slate-700">{achievement.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Recent Activity Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
                  <Link to="scenarios" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === 'scenario' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'project' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'scenario' ? <Target className="w-5 h-5" /> :
                           activity.type === 'project' ? <Palette className="w-5 h-5" /> :
                           <BookOpen className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{activity.title}</h3>
                          <div className="flex items-center space-x-3 text-sm text-slate-600">
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                            <span>•</span>
                            <span className="capitalize">{activity.type}</span>
                            {activity.progress < 100 && (
                              <>
                                <span>•</span>
                                <span>{activity.progress}% complete</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activity.status === 'completed' ? (
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <Link
                            to={`${activity.type}s/${activity.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Continue
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">

              {/* Daily Cloud Challenge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Daily Challenge</h2>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm">
                    +{dailyChallenge.points} XP
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{dailyChallenge.title}</h3>
                <p className="text-purple-100 mb-4 text-sm leading-relaxed">
                  {dailyChallenge.description}
                </p>

                <div className="flex items-center justify-between text-sm text-purple-100 mb-6">
                  <span>⏱️ {dailyChallenge.estimatedTime}</span>
                  <span>📊 {dailyChallenge.difficulty}</span>
                  <span>🏷️ {dailyChallenge.category}</span>
                </div>

                <Link
                  to="scenarios?challenge=daily"
                  className="w-full bg-white text-purple-600 py-3 px-4 rounded-xl font-semibold text-center hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Try Now</span>
                </Link>
              </motion.div>

              {/* Next Suggested Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recommended Next</h2>

                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <nextAction.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">{nextAction.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{nextAction.description}</p>
                  </div>
                </div>

                <Link
                  to={nextAction.href}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium text-center hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{nextAction.action}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Learning Tip of the Day */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Tip of the Day</h2>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-medium text-slate-900 mb-2">{learningTip.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{learningTip.content}</p>
                  <div className="mt-3">
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {learningTip.category}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Community Trends */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Trending Architectures</h2>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                <div className="space-y-3">
                  {platformTrends.map((trend, index) => (
                    <div key={trend.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-medium text-slate-600">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{trend.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-600">{trend.usage}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          trend.trend === 'up' ? 'bg-green-500' : 'bg-slate-400'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="scenarios"
                  className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Explore All Architectures
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Search and Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Access</h2>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services, scenarios, or documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quick Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickAccessShortcuts.map((shortcut) => (
                <Link
                  key={shortcut.name}
                  to={shortcut.href}
                  className="flex items-center space-x-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <span className="text-lg">{shortcut.icon}</span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {shortcut.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Feature Announcement Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">New! Kubernetes Visual Builder</h3>
                    <p className="text-green-100 text-sm">Design and deploy Kubernetes architectures with our new visual interface</p>
                  </div>
                </div>
                <Link
                  to="/kubernetes"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center space-x-2"
                >
                  <span>Try Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </>
  );
};

export default HomePage;
