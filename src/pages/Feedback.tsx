import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bug, Lightbulb, ExternalLink, Send } from 'lucide-react';

const Feedback: React.FC = () => {
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  const feedbackTypes = [
    {
      icon: Bug,
      title: 'Report a Bug',
      description: 'Found something that\'s not working correctly? Let us know!',
      color: 'from-red-500 to-red-600',
      examples: ['UI elements not displaying properly', 'Features not working as expected', 'Error messages or crashes']
    },
    {
      icon: Lightbulb,
      title: 'Feature Request',
      description: 'Have an idea for a new feature or improvement?',
      color: 'from-yellow-500 to-orange-500',
      examples: ['New learning modules', 'UI/UX improvements', 'Additional tools or integrations']
    },
    {
      icon: MessageSquare,
      title: 'General Feedback',
      description: 'Share your thoughts about the overall experience',
      color: 'from-blue-500 to-blue-600',
      examples: ['User experience feedback', 'Content suggestions', 'Platform improvements']
    }
  ];

  const handleOpenForm = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSfRRM1ZI7aSogq93y9onzbR2R4vJZkxswPGqV6wqSQyUm0FSA/viewform?usp=dialog',
      '_blank',
      'width=800,height=900,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help Us Improve KubeQuest
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your feedback is invaluable in making KubeQuest the best Kubernetes learning platform. 
            Report bugs, suggest features, or share your thoughts with us.
          </p>
        </motion.div>

        {/* Feedback Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {feedbackTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Examples:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {type.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Main Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Submit Your Feedback</h2>
                <p className="text-blue-100">
                  Use the form below to share bugs, feature requests, or general feedback
                </p>
              </div>
              <Send className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Form Instructions */}
              <div className="lg:w-1/3 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Submit Feedback</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">1</span>
                      <p>Click the "Open Feedback Form" button to launch the form in a new window</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">2</span>
                      <p>Choose the type of feedback you want to provide</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">3</span>
                      <p>Fill out the form with detailed information</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">4</span>
                      <p>Submit and we'll review your feedback promptly</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be specific about the issue or suggestion</li>
                    <li>• Include steps to reproduce bugs</li>
                    <li>• Mention your browser and device if relevant</li>
                    <li>• Screenshots are always helpful!</li>
                  </ul>
                </div>
              </div>

              {/* Form Launch Area */}
              <div className="lg:w-2/3">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ExternalLink className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Ready to Share Your Feedback?
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Click the button below to open our feedback form in a new window. 
                    Your input helps us make KubeQuest better for everyone!
                  </p>
                  <button
                    onClick={handleOpenForm}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Open Feedback Form</span>
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Opens in a new window • Takes 2-3 minutes to complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Thank You for Helping Us Improve! 🙏
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every piece of feedback helps us create a better learning experience. 
              We read every submission and use your insights to prioritize improvements and new features.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
