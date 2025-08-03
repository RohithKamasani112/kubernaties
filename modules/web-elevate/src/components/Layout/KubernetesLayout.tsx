import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import {
  Home,
  Code,
  BookOpen,
  Zap,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight,
  Layers,
  Sparkles,
  Construction,
  User
} from 'lucide-react';

interface KubernetesLayoutProps {
  children: React.ReactNode;
}

const KubernetesLayout: React.FC<KubernetesLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Scroll to top when location changes
  useScrollToTop('smooth');

  const navigation = [
    {
      name: 'Home',
      href: '/web-elevate/kubernetes-dashboard',
      icon: Home,
      description: 'Dashboard overview',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Learning Paths',
      href: '/web-elevate/paths',
      icon: BookOpen,
      description: 'Structured learning',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'Playground',
      href: '/web-elevate/playground',
      icon: Code,
      description: 'Interactive coding',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Debug Challenges',
      href: '/web-elevate/debug-projects',
      icon: Zap,
      description: 'Fix bugs & learn',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Blueprints',
      href: '/web-elevate/blueprints',
      icon: Layers,
      description: 'Project templates',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Collaboration',
      href: '/web-elevate/collaboration',
      icon: Users,
      description: 'Work together',
      gradient: 'from-teal-500 to-teal-600',
      devInProgress: true
    },
    {
      name: 'Portfolio',
      href: '/web-elevate/portfolio',
      icon: User,
      description: 'Your projects',
      gradient: 'from-pink-500 to-pink-600',
      devInProgress: true
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sidebar - Hidden on mobile, responsive on desktop */}
      <motion.div
        className="hidden md:flex bg-white/80 backdrop-blur-sm border-r border-gray-100 flex-col flex-shrink-0 w-72"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Web Platform</h2>
              <p className="text-sm text-gray-500">Development Hub</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-sm bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Platform Ready</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 px-2">
            Navigation
          </div>
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <motion.div
                key={item.name}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={item.href}
                  className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${
                    active
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                      : item.devInProgress
                      ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-25'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-all duration-300 relative ${
                    active
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                      : item.devInProgress
                      ? 'bg-gray-100'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      active ? 'text-white' :
                      item.devInProgress ? 'text-gray-400' :
                      'text-gray-500 group-hover:text-gray-700'
                    }`} />
                    {item.devInProgress && (
                      <Construction className="w-2.5 h-2.5 text-orange-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold flex items-center">
                      {item.name}
                      {item.devInProgress && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                          Dev
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      active ? 'text-blue-600' :
                      item.devInProgress ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-l-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/web-elevate/settings"
            className={`flex items-center space-x-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 group ${
              isActive('/web-elevate/settings')
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isActive('/web-elevate/settings')
                ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                : 'bg-gray-100 group-hover:bg-gray-200'
            }`}>
              <Settings className={`w-4 h-4 ${
                isActive('/web-elevate/settings') ? 'text-white' : 'text-gray-500'
              }`} />
            </div>
            <div>
              <div className="font-semibold">Settings</div>
              <div className={`text-xs ${
                isActive('/web-elevate/settings') ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Platform preferences
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Web Platform</h1>
              <p className="text-xs text-gray-500 -mt-1">Development Hub</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
              className="border-t border-gray-100 bg-white/90 backdrop-blur-sm"
            >
              <nav className="px-4 py-2 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700'
                        : item.devInProgress
                        ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-25'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative ${
                      isActive(item.href)
                        ? `bg-gradient-to-r ${item.gradient}`
                        : item.devInProgress
                        ? 'bg-gray-100'
                        : 'bg-gray-100'
                    }`}>
                      <item.icon className={`w-4 h-4 ${
                        isActive(item.href) ? 'text-white' :
                        item.devInProgress ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      {item.devInProgress && (
                        <Construction className="w-2.5 h-2.5 text-orange-500 absolute -top-1 -right-1" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center">
                        {item.name}
                        {item.devInProgress && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            Dev
                          </span>
                        )}
                      </div>
                      <div className={`text-xs ${
                        isActive(item.href) ? 'text-blue-600' :
                        item.devInProgress ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
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
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors font-medium">
              Platform
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">Web Development</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default KubernetesLayout;