import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Pages
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import LearningPaths from './pages/LearningPaths';
import PathDetail from './pages/PathDetail';
import ModuleView from './pages/ModuleView';
import Playground from './pages/Playground';
import Portfolio from './pages/Portfolio';
import Blueprints from './pages/Blueprints';
import BlueprintDetail from './pages/BlueprintDetail';
import Collaboration from './pages/Collaboration';
import DebugProjects from './pages/DebugProjects';
import DebugPlayground from './pages/DebugPlayground';
import NotFound from './pages/NotFound';

// Layout and Components
import WebElevateLayout from './components/Layout/WebElevateLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Store
import { useWebElevateStore } from './store/webElevateStore';

const WebElevateApp: React.FC = () => {
  const { isInitialized, initializeApp } = useWebElevateStore();

  React.useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, initializeApp]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Web Elevate...</h2>
          <p className="text-gray-500 mt-2">Preparing your learning environment</p>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <AnimatePresence mode="wait">
        <Routes>
          {/* Redirect root to dashboard - skip welcome page */}
          <Route path="/" element={<Navigate to="/web-elevate/dashboard" replace />} />

          {/* Main Web Elevate Routes */}
          <Route path="/dashboard" element={<WebElevateLayout><Dashboard /></WebElevateLayout>} />

          {/* Keep welcome page accessible but not as default */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/paths" element={<WebElevateLayout><LearningPaths /></WebElevateLayout>} />
          <Route path="/paths/:pathId" element={<WebElevateLayout><PathDetail /></WebElevateLayout>} />
          <Route path="/paths/:pathId/modules/:moduleId" element={<WebElevateLayout><ModuleView /></WebElevateLayout>} />
          <Route path="/blueprints" element={<WebElevateLayout><Blueprints /></WebElevateLayout>} />
          <Route path="/blueprints/:blueprintId" element={<WebElevateLayout><BlueprintDetail /></WebElevateLayout>} />
          <Route path="/collaboration" element={<WebElevateLayout><Collaboration /></WebElevateLayout>} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/playground/:sessionId" element={<Playground />} />
          <Route path="/portfolio" element={<WebElevateLayout><Portfolio /></WebElevateLayout>} />

          {/* Debug Playground Routes */}
          <Route path="/debug-projects" element={<WebElevateLayout><DebugProjects /></WebElevateLayout>} />
          <Route path="/debug-playground/:projectId" element={<DebugPlayground />} />

          {/* Catch all - show 404 page */}
          <Route path="*" element={<NotFound />} />
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
      </div>
    </ErrorBoundary>
  );
};

export default WebElevateApp;
