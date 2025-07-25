import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink, Heart, Users } from 'lucide-react';

const AboutFeedback: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">About & Feedback</h1>
            <p className="text-gray-600">Learn about KubeQuest and share your feedback</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">About KubeQuest</h2>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  KubeQuest is an interactive learning platform designed to help you master 
                  Kubernetes from container basics to cluster mastery.
                </p>
                <p>
                  Our mission is to make Kubernetes learning accessible, engaging, and practical 
                  through hands-on experiences and real-world scenarios.
                </p>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>Built for learners, by learners</span>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Share Feedback</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Your feedback helps us improve KubeQuest. Share your thoughts, suggestions, 
                or report issues to help us create a better learning experience.
              </p>
              
              <button
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Feedback Form</span>
              </button>
              
              <p className="text-sm text-gray-500 mt-3 text-center">
                Quick & easy • Takes 2-3 minutes • Your input shapes our roadmap
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutFeedback;
