import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Pages
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import KubernetesDashboard from './pages/KubernetesDashboard';
import LearningPaths from './pages/LearningPaths';
import PathDetail from './pages/PathDetail';
import ModuleView from './pages/ModuleView';
import Playground from './pages/Playground';
import Portfolio from './pages/Portfolio';
import Blueprints from './pages/Blueprints';
import BlueprintDetail from './pages/BlueprintDetail';
import BlueprintPage from './pages/BlueprintPage';
import BlueprintDashboard from './components/BlueprintDashboard';
import Collaboration from './pages/Collaboration';
import DebugProjects from './pages/DebugProjects';
import DebugPlayground from './pages/DebugPlayground';
import DebugChallengePage from './pages/DebugChallengePage';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Layout and Components
import WebElevateLayout from './components/Layout/WebElevateLayout';
import KubernetesLayout from './components/Layout/KubernetesLayout';
import SidebarLayout from './components/SidebarLayout';
import NewDashboard from './pages/NewDashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Learning Module Components
import LearningModule from './components/LearningModule';

// Store
import { useWebElevateStore } from './store/webElevateStore';

// Wrapper component for BlueprintDashboard with navigation
const BlueprintDashboardWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBlueprintSelect = (blueprintId: string) => {
    navigate(`/web-elevate/blueprints/${blueprintId}`);
  };

  return <BlueprintDashboard onBlueprintSelect={handleBlueprintSelect} />;
};

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

          {/* Main Web Elevate Routes with Kubernetes Layout */}
          <Route index element={<KubernetesLayout><KubernetesDashboard /></KubernetesLayout>} />
          <Route path="/kubernetes-dashboard" element={<KubernetesLayout><KubernetesDashboard /></KubernetesLayout>} />
          <Route path="/dashboard" element={<Navigate to="/web-elevate" replace />} />
          <Route path="/old-dashboard" element={<SidebarLayout><NewDashboard /></SidebarLayout>} />

          {/* Keep welcome page accessible but not as default */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/paths" element={<KubernetesLayout><LearningPaths /></KubernetesLayout>} />
          <Route path="/paths/:pathId" element={<KubernetesLayout><PathDetail /></KubernetesLayout>} />
          <Route path="/paths/:pathId/modules/:moduleId" element={<KubernetesLayout><ModuleView /></KubernetesLayout>} />

          {/* Enhanced Learning Module Routes */}
          <Route path="/learning" element={<KubernetesLayout><LearningModule /></KubernetesLayout>} />
          <Route path="/learning/:pathId" element={<KubernetesLayout><LearningModule /></KubernetesLayout>} />
          <Route path="/blueprints" element={<KubernetesLayout><BlueprintDashboardWrapper /></KubernetesLayout>} />
          <Route path="/blueprints/:blueprintId" element={<KubernetesLayout><BlueprintDetail /></KubernetesLayout>} />
          <Route path="/blueprint-builder" element={<BlueprintPage />} />
          <Route path="/collaboration" element={<KubernetesLayout><Collaboration /></KubernetesLayout>} />
          <Route path="/playground" element={<KubernetesLayout><Playground /></KubernetesLayout>} />
          <Route path="/playground/:sessionId" element={<KubernetesLayout><Playground /></KubernetesLayout>} />
          <Route path="/portfolio" element={<KubernetesLayout><Portfolio /></KubernetesLayout>} />

          {/* Debug Playground Routes */}
          <Route path="/debug-projects" element={<KubernetesLayout><DebugProjects /></KubernetesLayout>} />
          <Route path="/debug-playground/:projectId" element={<KubernetesLayout><DebugPlayground /></KubernetesLayout>} />
          <Route path="/debug-challenge/:challengeId" element={<KubernetesLayout><DebugChallengePage /></KubernetesLayout>} />

          {/* Documentation and Examples Routes */}
          <Route path="/docs" element={<KubernetesLayout><div className="p-6"><h1 className="text-2xl font-bold">Documentation Coming Soon</h1></div></KubernetesLayout>} />
          <Route path="/examples" element={<KubernetesLayout><div className="p-6"><h1 className="text-2xl font-bold">Code Examples Coming Soon</h1></div></KubernetesLayout>} />

          {/* Additional Routes */}
          <Route path="/achievements" element={<KubernetesLayout><div className="p-6"><h1 className="text-2xl font-bold">Achievements Coming Soon</h1></div></KubernetesLayout>} />
          <Route path="/settings" element={<KubernetesLayout><Settings /></KubernetesLayout>} />

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
