import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Code,
  User,
  Users,
  Settings,
  ArrowLeft,
  Zap,
  Trophy,
  Target,
  Menu,
  X,
  ChevronRight,
  Cloud
} from 'lucide-react';

interface WebElevateLayoutProps {
  children: React.ReactNode;
}

const WebElevateLayout: React.FC<WebElevateLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/web-elevate/dashboard', icon: Home },
    { name: 'React Learning', href: '/web-elevate/learning', icon: BookOpen, featured: true },
    { name: 'Learning Paths', href: '/web-elevate/paths', icon: BookOpen },
    { name: 'Debug Challenges', href: '/web-elevate/debug-projects', icon: Zap },
    { name: 'Blueprints', href: '/web-elevate/blueprints', icon: Target },
    { name: 'Collaboration', href: '/web-elevate/collaboration', icon: Users },
    { name: 'Playground', href: '/web-elevate/playground', icon: Code },
    { name: 'Portfolio', href: '/web-elevate/portfolio', icon: User },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar - Hidden on mobile, responsive on desktop */}
      <motion.div
        className="hidden md:flex bg-white border-r border-slate-200 flex-col flex-shrink-0"
        animate={{
          width: 240
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/icons/web-elevate-icon.svg" alt="Web Elevate" className="w-8 h-8" />
              </div>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-sm font-semibold text-slate-900">Web Elevate</h2>
                  <p className="text-xs text-slate-500">Master Web Development</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SAMWI Platform Section */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>SAMWI PLATFORM</span>
          </div>
          <Link
            to="/"
            className="flex items-center space-x-2 px-2 py-1.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>SAMWI Homepage</span>
            <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <motion.div
                key={item.name}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="truncate">{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-l"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  {item.featured && (
                    <span className="ml-auto">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </motion.div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/icons/web-elevate-icon.svg" alt="Web Elevate" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Web Elevate</h1>
              <p className="text-xs text-slate-500 -mt-1">Master Web Development</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 bg-white"
            >
              <nav className="px-4 py-2 space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>SAMWI Homepage</span>
                </Link>
                <div className="border-t border-slate-200 my-2"></div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.featured && (
                      <span className="ml-auto">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-slate-500 hover:text-slate-700 transition-colors">
              Samwi Learn
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Web Elevate</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          {children}
        </main>
      </div>

    </div>
  );
};

export default WebElevateLayout;
