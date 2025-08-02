import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackData {
  email: string;
  likedMost: string;
  improvements: string;
  bugs: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    email: '',
    likedMost: '',
    improvements: '',
    bugs: ''
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);

    try {
      // Google Form submission URL
      const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdOgGSpUjjnCo_L10sH53Yo_yFoMd9Hevacl0FyUBTgKl65jQ/formResponse';

      // Create form data  Google Forms
      const googleFormData = new FormData();
      googleFormData.append('entry.1502075822', feedbackData.email); // Email Address
      googleFormData.append('entry.97433369', feedbackData.likedMost); // What did you like the most
      googleFormData.append('entry.1018470238', feedbackData.improvements); // What we can improve
      googleFormData.append('entry.96251011', feedbackData.bugs); // Did u face any bugs

      // Submit to Google Forms
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: googleFormData,
        mode: 'no-cors' // Required for Google Forms
      });

      onClose();
      // Reset form
      setFeedbackData({
        email: '',
        likedMost: '',
        improvements: '',
        bugs: ''
      });
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Share Your Feedback</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={feedbackData.email}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you like the most? *
                </label>
                <textarea
                  required
                  value={feedbackData.likedMost}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, likedMost: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Tell us what you enjoyed..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What can we improve? *
                </label>
                <textarea
                  required
                  value={feedbackData.improvements}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, improvements: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Share your suggestions for improvements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Did you face any bugs? (Optional)
                </label>
                <textarea
                  value={feedbackData.bugs}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, bugs: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe any issues you encountered..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] text-white rounded-lg hover:from-[#5848E2] hover:to-[#7C3AED] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmittingFeedback ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
