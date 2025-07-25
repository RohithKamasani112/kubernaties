import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
import AboutFeedback from './pages/AboutFeedback';

// Cloud Architecture Module
import CloudArchitectureApp from '../modules/cloud-architecture/src/CloudArchitectureApp';

// Layouts
import Layout from './components/Layout';
import KubeQuestLayout from './components/KubeQuestLayout';

// Components
import CollaboratorsButton from './components/CollaboratorsButton';
import PerformanceOptimizer from './components/PerformanceOptimizer';

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
            <Route path="/kubernetes/about-feedback" element={<KubeQuestLayout><AboutFeedback /></KubeQuestLayout>} />

            {/* Cloud Architecture Module Routes - all prefixed with /cloud-architecture */}
            <Route path="/cloud-architecture/*" element={<CloudArchitectureApp />} />

            {/* 404 Page */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </AnimatePresence>

        {/* Collaborators Button - Only on main pages */}
        <CollaboratorsButton />

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
  );
}

export default App;