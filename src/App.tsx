import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, ArrowLeft } from 'lucide-react';

// Main Platform Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import JoinPage from './pages/JoinPage';
import NotFoundPage from './pages/NotFoundPage';

// Kubernetes Module Pages
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Playground from './pages/Playground';
import Challenges from './pages/Challenges';
import Examples from './pages/Examples';
import K8sDebugging from './pages/K8sDebugging';
import Documentation from './pages/Documentation';


// Cloud Architecture Module
import CloudArchitectureApp from '../modules/cloud-architecture/src/CloudArchitectureApp';

// Web Elevate Module
import WebElevateApp from '../modules/web-elevate/src/WebElevateApp';

// Layouts
import Layout from './components/Layout';
import KubeQuestLayout from './components/KubeQuestLayout';

// Components
import CollaboratorsButton from './components/CollaboratorsButton';
import PerformanceOptimizer from './components/PerformanceOptimizer';

// Styles
import './styles/scroll.css';

function App() {
  return (
    <Router>
      <PerformanceOptimizer />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Main Platform Routes - with Layout */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/join" element={<Layout><JoinPage /></Layout>} />

            {/* Kubernetes Module Routes - all prefixed with /kubernetes */}
            <Route path="/kubernetes" element={<KubeQuestLayout><Dashboard /></KubeQuestLayout>} />
            <Route path="/kubernetes/dashboard" element={<KubeQuestLayout><Dashboard /></KubeQuestLayout>} />
            <Route path="/kubernetes/lessons" element={<KubeQuestLayout><Lessons /></KubeQuestLayout>} />
            <Route path="/kubernetes/playground" element={<KubeQuestLayout><Playground /></KubeQuestLayout>} />
            <Route path="/kubernetes/challenges" element={<KubeQuestLayout><Challenges /></KubeQuestLayout>} />
            <Route path="/kubernetes/examples" element={<KubeQuestLayout><Examples /></KubeQuestLayout>} />
            <Route path="/kubernetes/debugging" element={<KubeQuestLayout><K8sDebugging /></KubeQuestLayout>} />
            <Route path="/kubernetes/docs" element={<KubeQuestLayout><Documentation /></KubeQuestLayout>} />


            {/* Cloud Architecture Module Routes - DISABLED (Testing Phase) */}
            <Route path="/cloud-architecture/*" element={
              <Layout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="max-w-md mx-auto text-center p-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-yellow-200 p-8 shadow-lg"
                    >
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Cloud className="w-8 h-8 text-white" />
                        <motion.div
                          className="absolute inset-0 border-2 border-yellow-400 rounded-2xl"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>

                      <motion.h1
                        className="text-2xl font-bold text-slate-900 mb-4"
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Cloud Architecture Studio
                      </motion.h1>

                      <motion.div
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6"
                        animate={{
                          boxShadow: [
                            '0 2px 4px rgba(0, 0, 0, 0.1)',
                            '0 4px 8px rgba(251, 191, 36, 0.2)',
                            '0 2px 4px rgba(0, 0, 0, 0.1)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <motion.div
                            className="w-3 h-3 bg-yellow-500 rounded-full"
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
                          <span className="text-sm font-semibold text-yellow-800">Testing Phase</span>
                        </div>
                        <p className="text-yellow-700 text-sm">
                          Currently in testing phase. Advanced features and improvements are being developed. Stay tuned for the official launch!
                        </p>
                      </motion.div>

                      <div className="flex items-center justify-center text-yellow-600 font-medium mb-6">
                        <motion.div
                          className="w-5 h-5 mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          ⚙️
                        </motion.div>
                        <span>Currently in Testing</span>
                      </div>

                      <Link
                        to="/courses"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Courses</span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </Layout>
            } />

            {/* Web Elevate Module Routes - all prefixed with /web-elevate */}
            <Route path="/web-elevate/*" element={<WebElevateApp />} />

            {/* 404 Page */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </AnimatePresence>



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

          {/* Floating Collaborators Button - DEACTIVATED */}
          {/* <CollaboratorsButton /> */}
        </div>
      </Router>
  );
}

export default App;