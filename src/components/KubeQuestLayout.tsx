import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Play,
  BookOpen,
  Target,
  Layers,
  Bug,
  Cloud,
  FileText,
  MessageCircle,
  User,
  Zap,
  ArrowLeft,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface KubeQuestLayoutProps {
  children: React.ReactNode;
}

const KubeQuestLayout: React.FC<KubeQuestLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Determine which module we're in
  const isCloudArchitecture = location.pathname.startsWith('/cloud-architecture');

  // Check if we're on the playground page to auto-shrink sidebar
  const isPlaygroundPage = location.pathname === '/kubernetes/playground';

  const kubernetesNavigation = [
    { name: 'Dashboard', href: '/kubernetes', icon: Home },
    { name: 'Playground', href: '/kubernetes/playground', icon: Play },
    { name: 'Lessons', href: '/kubernetes/lessons', icon: BookOpen },
    { name: 'Examples', href: '/kubernetes/examples', icon: Layers },
    { name: 'Challenges', href: '/kubernetes/challenges', icon: Target },
    { name: 'K8s Debugging', href: '/kubernetes/debugging', icon: Bug },
    { name: 'Docs', href: '/kubernetes/docs', icon: FileText },
    { name: 'About & Feedback', href: '/kubernetes/about-feedback', icon: MessageCircle },
    { name: 'Cloud Architecture', href: '/cloud-architecture', icon: Cloud },
  ];

  const cloudArchitectureNavigation = [
    { name: 'Dashboard', href: '/cloud-architecture', icon: Home },
    { name: 'AI Generator', href: '/cloud-architecture/ai-generator', icon: Zap },
    { name: 'Learning Studio', href: '/cloud-architecture/studio', icon: BookOpen },
    { name: 'Canvas Builder', href: '/cloud-architecture/builder', icon: Layers },
    { name: 'Scenarios', href: '/cloud-architecture/scenarios', icon: Target },
    { name: 'Kubernetes', href: '/kubernetes', icon: Cloud },
  ];

  const navigation = isCloudArchitecture ? cloudArchitectureNavigation : kubernetesNavigation;

  const isActive = (path: string) => {
    // For the main kubernetes route, check if we're exactly on /kubernetes
    if (path === '/kubernetes') {
      return location.pathname === '/kubernetes';
    }
    // For other routes, check if the current path starts with the route path
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar - Hidden on mobile, responsive on desktop */}
      <motion.div
        className="hidden md:flex bg-white border-r border-slate-200 flex-col flex-shrink-0"
        animate={{
          width: isPlaygroundPage ? 64 : 256
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isCloudArchitecture ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Cloud className="w-4 h-4 text-white" />
                  </div>
                  <AnimatePresence>
                    {!isPlaygroundPage && (
                      <motion.div
                        initial={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center space-x-2">
                          <h1 className="text-lg font-bold text-slate-900">Cloud Architecture</h1>
                          <motion.span
                            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            BETA
                          </motion.span>
                        </div>
                        <p className="text-xs text-slate-500 -mt-0.5">Interactive Learning Studio</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                  <AnimatePresence>
                    {!isPlaygroundPage && (
                      <motion.div
                        initial={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h1 className="text-lg font-bold text-slate-900">KubeQuest</h1>
                        <p className="text-xs text-slate-500 -mt-0.5">From container basics to cluster mastery</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="px-4 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>SAMWI Platform</span>
            </div>

            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-lg transition-all duration-200 group text-sm shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span className="font-semibold">SAMWI Homepage</span>
              <div className="ml-auto">
                <ArrowRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>

            <Link
              to="/courses"
              className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 group text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">All Courses</span>
              <div className="ml-auto">
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-50 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* Module Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? isCloudArchitecture
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={isPlaygroundPage ? item.name : undefined}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${
                    active
                      ? isCloudArchitecture
                        ? 'text-purple-600'
                        : 'text-blue-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <AnimatePresence>
                    {!isPlaygroundPage && (
                      <motion.span
                        initial={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {active && (
                  <motion.div
                    className={`w-2 h-2 rounded-full relative ${
                      isCloudArchitecture ? 'bg-purple-600' : 'bg-blue-600'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    {/* Pulsing ring effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-full ${
                        isCloudArchitecture ? 'bg-purple-600' : 'bg-blue-600'
                      }`}
                      animate={{
                        scale: [1, 2.5, 1],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    {/* Glowing effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-full ${
                        isCloudArchitecture ? 'bg-purple-400' : 'bg-blue-400'
                      }`}
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCloudArchitecture ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <User className={`w-4 h-4 ${
                isCloudArchitecture ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            <AnimatePresence>
              {!isPlaygroundPage && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {isCloudArchitecture ? 'Cloud Architect' : 'Learner'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">Level 1</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Responsive to sidebar state */}
      <div className="flex-1 flex flex-col bg-slate-50 min-h-0 relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center space-x-3">
            {isCloudArchitecture ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Cloud className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Cloud Architecture</h1>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">KubeQuest</h1>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Breadcrumb Navigation - Desktop only */}
        <div className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-slate-500 hover:text-slate-700 transition-colors flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>SAMWI Learn</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700 font-medium">
              {isCloudArchitecture ? 'Cloud Architecture' : 'Kubernetes'}
            </span>
            {location.pathname !== '/kubernetes' && location.pathname !== '/cloud-architecture' && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-semibold">
                  {(() => {
                    const pathSegments = location.pathname.split('/');
                    const lastSegment = pathSegments[pathSegments.length - 1];
                    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
                  })()}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 shadow-lg">
          <div className="flex items-center justify-around">
            <Link
              to="/"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-semibold">SAMWI Homepage</span>
            </Link>

            <Link
              to="/courses"
              className="flex flex-col items-center space-y-1 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-medium">Courses</span>
            </Link>

            <Link
              to={isCloudArchitecture ? "/cloud-architecture" : "/kubernetes"}
              className="flex flex-col items-center space-y-1 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Floating Navigation for Playground Mode - Desktop */}
        <AnimatePresence>
          {isPlaygroundPage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex fixed top-4 left-4 z-50 space-x-2"
            >
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-200 group"
                title="Go to SAMWI Learn Homepage"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-semibold">SAMWI Homepage</span>
              </Link>

              <Link
                to="/kubernetes"
                className="flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg hover:shadow-xl text-slate-700 hover:text-slate-900 hover:bg-white transition-all duration-200 group"
                title="Kubernetes Dashboard"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KubeQuestLayout;
