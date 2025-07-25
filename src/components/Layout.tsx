import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  BookOpen,
  Info,
  Linkedin,
  Mail,
  ExternalLink
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Register', href: '/join', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SAMWI Learn</h1>
                <p className="text-xs text-slate-600 -mt-1">Interactive Tech Education</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Start Learning
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
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
              className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-sm"
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
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-slate-200">
                  <Link
                    to="/courses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">SAMWI Learn</h3>
                  <p className="text-slate-400 text-sm">Interactive Tech Education</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Master modern technologies through hands-on, interactive learning experiences.
                From Kubernetes to cloud architecture, we make complex concepts accessible.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/samwi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:samwi.global@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/courses" className="text-slate-300 hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Courses */}
            <div>
              <h4 className="font-semibold mb-4">Courses</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/kubernetes" className="text-slate-300 hover:text-white transition-colors flex items-center">
                    Kubernetes
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </li>
                <li>
                  <Link to="/cloud-architecture" className="text-slate-300 hover:text-white transition-colors flex items-center">
                    Cloud Architecture
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </li>
                <li><span className="text-slate-500">More coming soon...</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Contact Information */}
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm">
                <a
                  href="mailto:samwi.global@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>samwi.global@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/samwi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>SAMWI Company</span>
                </a>
              </div>

              {/* Links */}
              <div className="flex space-x-6">
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;