import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Playground from './pages/Playground';
import Examples from './pages/Examples';
import Lessons from './pages/Lessons';
import Challenges from './pages/Challenges';
import Documentation from './pages/Documentation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/docs" element={<Documentation />} />
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
      </div>
    </Router>
  );
}

export default App;