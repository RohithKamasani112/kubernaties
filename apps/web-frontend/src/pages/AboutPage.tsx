import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About - KubeQuest</title>
        <meta name="description" content="Learn about KubeQuest - Your comprehensive Kubernetes learning platform" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About KubeQuest</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your comprehensive platform for mastering Kubernetes and cloud-native technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600">
              To make Kubernetes learning accessible, practical, and engaging for developers at all levels.
              We believe in hands-on learning with real-world scenarios.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">What We Offer</h3>
            <p className="text-slate-600">
              Interactive courses, hands-on labs, real-world projects, and a supportive community
              to help you master container orchestration.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-slate-600 mb-6">
            Join thousands of developers who have mastered Kubernetes with KubeQuest
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AboutPage;
