import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import CollaboratorsButton from './components/CollaboratorsButton';
import Dashboard from './pages/Dashboard';
import Playground from './pages/Playground';
// import K8sExplained from './pages/K8sExplained';
import Examples from './pages/Examples';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Documentation from './pages/Documentation';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/playground" element={<Playground />} />
            {/* <Route path="/k8s-explained" element={<K8sExplained />} /> */}
            <Route path="/examples" element={<Examples />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
            },
          }}
        />

        {/* Global Collaborators Button */}
        <CollaboratorsButton />
      </div>
    </Router>
  );
}

export default App;