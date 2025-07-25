import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import Layout from './components/Layout';

// Styles
import './index.css';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/kubernetes" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center min-h-[60vh]"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Kubernetes Module</h2>
                      <p className="text-slate-600 mb-4">Loading Kubernetes learning environment...</p>
                      <div className="animate-pulse bg-slate-200 h-2 w-48 rounded mx-auto"></div>
                    </div>
                  </motion.div>
                } />
                <Route path="/cloud-architecture" element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center min-h-[60vh]"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">☁️</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Cloud Architecture Module</h2>
                      <p className="text-slate-600 mb-4">Loading cloud architecture studio...</p>
                      <div className="animate-pulse bg-slate-200 h-2 w-48 rounded mx-auto"></div>
                    </div>
                  </motion.div>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AnimatePresence>
          </Layout>
          
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
