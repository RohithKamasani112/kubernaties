import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CloudArchitectureProvider } from './context/CloudArchitectureContext';
import KubeQuestLayout from '../../../src/components/KubeQuestLayout';
import HomePage from './pages/HomePage';
import AIGeneratorPage from './pages/AIGeneratorPage';
import LearningStudioPage from './pages/LearningStudioPage';
import CanvasBuilderPage from './pages/CanvasBuilderPage';
import ScenariosPage from './pages/ScenariosPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

const CloudArchitectureApp: React.FC = () => {
  return (
    <HelmetProvider>
      <CloudArchitectureProvider>
        <KubeQuestLayout>
          <Routes>
            {/* Main Cloud Architecture Page */}
            <Route index element={<HomePage />} />

            {/* Feature Pages */}
            <Route path="ai-generator" element={<AIGeneratorPage />} />
            <Route path="studio" element={<LearningStudioPage />} />
            <Route path="builder" element={<CanvasBuilderPage />} />
            <Route path="scenarios" element={<ScenariosPage />} />

            {/* Redirects */}
            <Route path="learn" element={<Navigate to="studio" replace />} />
            <Route path="build" element={<Navigate to="builder" replace />} />
            <Route path="ai" element={<Navigate to="ai-generator" replace />} />

            {/* Catch all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </KubeQuestLayout>
      </CloudArchitectureProvider>
    </HelmetProvider>
  );
};

export default CloudArchitectureApp;
