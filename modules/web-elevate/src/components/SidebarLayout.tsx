import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Code,
  User,
  Award,
  Users,
  Settings,

  Zap,
  ChevronRight,
  Star,
  TrendingUp,
  Target,
  Trophy,
  ArrowLeft,
  ChevronLeft,
  Bug,
  Palette,
  FileText,
  Heart
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/web-elevate',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BookOpen,
      label: 'Learning Paths',
      href: '/web-elevate/paths',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Code,
      label: 'Playground',
      href: '/web-elevate/playground',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Bug,
      label: 'Debug Challenges',
      href: '/web-elevate/debug-projects',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Target,
      label: 'Blueprints',
      href: '/web-elevate/blueprints',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Users,
      label: 'Collaboration',
      href: '/web-elevate/collaboration',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: User,
      label: 'Portfolio',
      href: '/web-elevate/portfolio',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/web-elevate/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/web-elevate') {
      return location.pathname === '/web-elevate' || location.pathname === '/web-elevate/';
    }
    return location.pathname.startsWith(path);
  };

  const userProfile = {
    name: 'John Doe',
    level: 2,
    xp: 250,
    nextLevelXp: 500,
    avatar: 'JD'
  };

  const progressPercentage = (userProfile.xp / userProfile.nextLevelXp) * 100;

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">


      {/* Left Sidebar - Kubernetes Style (Flexbox Layout) */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '48px' : '200px'
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex flex-col bg-white border-r border-slate-200 flex-shrink-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Compact */}
          <div className="p-3 border-b border-slate-200">
            <Link to="/web-elevate" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-0"
                  >
                    <h1 className="text-lg font-bold text-slate-900 truncate">Web Elevate</h1>
                    <p className="text-xs text-slate-500 truncate">From basics to mastery</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Collapse Toggle - Kubernetes Style */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-2 top-4 w-4 h-4 bg-white border border-slate-300 rounded-sm flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 hover:bg-slate-50 lg:flex hidden"
            >
              {isCollapsed ? (
                <ChevronRight className="w-2 h-2 text-slate-600" />
              ) : (
                <ChevronLeft className="w-2 h-2 text-slate-600" />
              )}
            </button>
          </div>

          {/* Quick Navigation - Compact */}
          <div className="px-3 py-2 border-b border-slate-200">
            <div className="space-y-1">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 px-0"
                  >
                    SAMWI PLATFORM
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                to="/"
                className="flex items-center space-x-3 px-0 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                title={isCollapsed ? "SAMWI Homepage" : undefined}
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      SAMWI Homepage
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link
                to="/courses"
                className="flex items-center space-x-3 px-0 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                title={isCollapsed ? "All Courses" : undefined}
              >
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      All Courses
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>

          {/* Navigation - Compact */}
          <nav className="flex-1 px-3 py-2 space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between px-0 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}

                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      active
                        ? 'text-blue-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Link - Compact */}
          <div className="p-3 border-t border-slate-200">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.a
                  initial={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  href="https://samwi.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-600 hover:text-blue-800 transition-colors text-center"
                >
                  https://samwi.in
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>



      {/* Main Content - Kubernetes Style (Flexbox Layout) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        {/* Page Content - Full Height Layout */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Page Content - Independent Scrollable Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50 min-h-0">
            <div className="h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
