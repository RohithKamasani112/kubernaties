import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Palette, 
  BookOpen, 
  Trophy,
  Settings,
  ArrowLeft,
  Cloud,
  Zap,
  Shield,
  Award,
  User
} from 'lucide-react';
// import { useCloudArchitecture } from '../context/CloudArchitectureContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  // const { state } = useCloudArchitecture();

  const navigation = [
    { name: 'Home', href: '/cloud-architecture', icon: Home, description: 'Overview and getting started' },
    { name: 'Learning Studio', href: '/cloud-architecture/studio', icon: BookOpen, description: 'Interactive guided learning' },
    { name: 'Canvas Builder', href: '/cloud-architecture/builder', icon: Palette, description: 'Free-form architecture design' },
    { name: 'Scenarios', href: '/cloud-architecture/scenarios', icon: Zap, description: 'Browse learning scenarios' },
    { name: 'Progress', href: '/cloud-architecture/progress', icon: Trophy, description: 'Track achievements and progress' },
  ];

  const isActive = (path: string) => {
    if (path === '/cloud-architecture') return location.pathname === '/cloud-architecture';
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Breadcrumb */}
            <div className="flex items-center space-x-4">
              <Link to="/cloud-architecture" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg font-bold text-gradient">Cloud Architecture</h1>
                    <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      BETA
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 -mt-1">Interactive Learning Studio</p>
                </div>
              </Link>

              {/* Navigation to Main Platform */}
              <div className="flex items-center space-x-2">
                <div className="w-px h-6 bg-slate-300 mx-4 hidden md:block" />
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 rounded-lg transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span className="text-sm font-semibold">SAMWI Homepage</span>
                </Link>

                <Link
                  to="/courses"
                  className="hidden sm:flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Courses</span>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                      isActive(item.href)
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.description}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* User Progress & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Progress Indicator - Temporarily disabled */}
              {/* {state.userProgress && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-lg">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">
                      Level {state.userProgress.level}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1.5 rounded-lg">
                    <Trophy className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {state.userProgress.totalPoints} pts
                    </span>
                  </div>
                </div>
              )} */}

              {/* User Menu */}
              <div className="w-8 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-sm"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
                
                {/* Mobile Progress - Temporarily disabled */}
                {/* {state.userProgress && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Level {state.userProgress.level}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">{state.userProgress.totalPoints} pts</span>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {children}

        {/* Floating Navigation for Mobile */}
        <div className="fixed bottom-6 right-6 z-50 md:hidden">
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-semibold">SAMWI Homepage</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Cloud Architecture Studio</h3>
                <p className="text-slate-400 text-sm">Part of SAMWI Learn Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <Link to="/help" className="hover:text-white transition-colors">Help</Link>
              <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
              <Link to="/feedback" className="hover:text-white transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
