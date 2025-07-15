import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  PlayCircle,
  BookOpen,
  Target,
  FileText,
  Zap,
  Award,
  User,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Heart,
  Network
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-collapse when navigating to playground for more space
  React.useEffect(() => {
    if (location.pathname === '/playground') {
      setIsCollapsed(true);
    }
  }, [location.pathname]);

  // Auto-collapse on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home', color: 'text-blue-600' },
    { path: '/playground', icon: PlayCircle, label: 'Playground', color: 'text-emerald-600' },
    // { path: '/k8s-explained', icon: Network, label: 'K8s Explained', color: 'text-cyan-600' },
    { path: '/examples', icon: Lightbulb, label: 'Examples', color: 'text-yellow-600' },
    { path: '/lessons', icon: BookOpen, label: 'Lessons', color: 'text-purple-600' },
    { path: '/challenges', icon: Target, label: 'Challenges', color: 'text-orange-600' },
    { path: '/docs', icon: FileText, label: 'Docs', color: 'text-slate-600' },
    { path: '/about', icon: Heart, label: 'About', color: 'text-pink-600' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    // Close mobile menu when navigation item is clicked
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-lg p-2 shadow-lg border border-slate-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <div className="w-5 h-5 flex flex-col justify-center space-y-1">
          <div className={`h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`h-0.5 bg-slate-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </div>
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
          // Mobile responsive: show/hide based on mobile menu state
          'md:relative md:translate-x-0 ' +
          (isCollapsed ? 'relative translate-x-0' :
           isMobileMenuOpen ? 'fixed left-0 top-0 h-full z-50' : 'fixed -translate-x-full md:translate-x-0 md:relative z-50 md:z-auto')
        }`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-slate-200 transition-all duration-300`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-xl font-bold text-slate-900">KubeQuest</h1>
                  <p className="text-xs text-slate-500">From container basics to cluster mastery</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse Toggle */}
        <div className="px-4 py-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`relative group flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive(item.path) ? item.color : ''} flex-shrink-0`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      className="font-medium"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive(item.path) && !isCollapsed && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                  />
                )}

                {/* Enhanced Tooltip for hover */}
                <div className={`absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap ${
                  isCollapsed ? 'block' : 'hidden'
                }`}>
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-200 transition-all duration-300`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-xl bg-slate-50`}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  className="flex-1"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium text-slate-900">Learner</p>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-slate-500">Level 1</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        // Add padding on mobile when menu is closed to account for toggle button
        'md:ml-0 ' + (isCollapsed ? 'ml-0' : isMobileMenuOpen ? 'ml-0' : 'ml-0 pt-16 md:pt-0')
      }`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;