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
import DebugChallengePage from './pages/DebugChallengePage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Layout and Components
import WebElevateLayout from './components/Layout/WebElevateLayout';
import SidebarLayout from './components/SidebarLayout';
import NewDashboard from './pages/NewDashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Learning Module Components
import LearningModule from './components/LearningModule';

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
          <Route path="/" element={<Navigate to="/web-elevate" replace />} />

          {/* Main Web Elevate Routes with Sidebar Layout */}
          <Route index element={<SidebarLayout><NewDashboard /></SidebarLayout>} />
          <Route path="/dashboard" element={<Navigate to="/web-elevate" replace />} />

          {/* Keep welcome page accessible but not as default */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/paths" element={<SidebarLayout><LearningPaths /></SidebarLayout>} />
          <Route path="/paths/:pathId" element={<SidebarLayout><PathDetail /></SidebarLayout>} />
          <Route path="/paths/:pathId/modules/:moduleId" element={<SidebarLayout><ModuleView /></SidebarLayout>} />

          {/* Enhanced Learning Module Routes */}
          <Route path="/learning" element={<SidebarLayout><LearningModule /></SidebarLayout>} />
          <Route path="/learning/:pathId" element={<SidebarLayout><LearningModule /></SidebarLayout>} />
          <Route path="/blueprints" element={<SidebarLayout><Blueprints /></SidebarLayout>} />
          <Route path="/blueprints/:blueprintId" element={<SidebarLayout><BlueprintDetail /></SidebarLayout>} />
          <Route path="/collaboration" element={<SidebarLayout><Collaboration /></SidebarLayout>} />
          <Route path="/playground" element={<SidebarLayout><Playground /></SidebarLayout>} />
          <Route path="/playground/:sessionId" element={<SidebarLayout><Playground /></SidebarLayout>} />
          <Route path="/portfolio" element={<SidebarLayout><Portfolio /></SidebarLayout>} />

          {/* Debug Playground Routes */}
          <Route path="/debug-projects" element={<SidebarLayout><DebugProjects /></SidebarLayout>} />
          <Route path="/debug-playground/:projectId" element={<SidebarLayout><DebugPlayground /></SidebarLayout>} />
          <Route path="/debug-challenge/:challengeId" element={<SidebarLayout><DebugChallengePage /></SidebarLayout>} />

          {/* Additional Sidebar Routes */}
          <Route path="/achievements" element={<SidebarLayout><div className="p-6"><h1 className="text-2xl font-bold">Achievements Coming Soon</h1></div></SidebarLayout>} />
          <Route path="/settings" element={<SidebarLayout><Settings /></SidebarLayout>} />

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
