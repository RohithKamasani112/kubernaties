import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, MessageSquare, Send, CheckCircle, Phone, AlertCircle, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const JoinPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    feedback: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill email from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Google Form submission URL (replace with your actual form URL)
      const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSehRtlaYF48CJoSZ9aG43yxlTEfpnLisFWurlhbS_F2b0ZbJA/formResponse';

      // Create form data for Google Forms
      const googleFormData = new FormData();

      // Map your form fields to Google Form entry IDs
      // TO GET THE CORRECT ENTRY IDs:
      // 1. Open your Google Form: https://docs.google.com/forms/d/e/1FAIpQLSehRtlaYF48CJoSZ9aG43yxlTEfpnLisFWurlhbS_F2b0ZbJA/viewform
      // 2. Right-click on each input field and select "Inspect Element"
      // 3. Look for name="entry.XXXXXXXX" in the HTML
      // 4. Replace the IDs below with the actual entry IDs from your form

      // Correct entry IDs from your Google Form:
      googleFormData.append('entry.396195895', formData.name); // Name field
      googleFormData.append('entry.1338141041', formData.mobile); // Mobile field
      googleFormData.append('entry.786313690', formData.email); // Email field
      googleFormData.append('entry.469946608', formData.feedback); // Feedback field

      // Submit to Google Forms
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: googleFormData,
        mode: 'no-cors' // Required for Google Forms
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Registration Successful - SAMWI Learn</title>
          <meta name="description" content="Thank you for your course registration and feedback. We'll review everything and keep you updated." />
        </Helmet>

        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Registration & Feedback Received!</h1>
            <p className="text-slate-600 mb-8">
              Please explore our courses and start your learning journey with hands-on interactive content!
            </p>
            <motion.div className="space-y-4">
              <Link to="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Explore Courses</span>
                </motion.button>
              </Link>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-slate-100 text-slate-700 px-6 py-3 rounded-full font-medium hover:bg-slate-200 transition-all duration-300"
                >
                  Back to Home
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Feedback / Course Registration - SAMWI Learn</title>
        <meta name="description" content="Register for courses, share your feedback, and get early access to SAMWI Learn's latest features." />
      </Helmet>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Feedback / Course Registration
            </h1>
            <p className="text-xl text-slate-600 max-w-lg mx-auto">
              Register for upcoming courses, share your feedback, and get early access to new content and beta features.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Feedback & Course Registration Field */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-2">
                  Course Registration & Feedback
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your learning goals and feedback:&#10;• Which courses would you like to register for? (e.g., Advanced Kubernetes, AWS Solutions Architect, DevOps with Terraform)&#10;• Course requests and topics you want to learn&#10;• Feedback on existing content&#10;• Platform feature requests&#10;• Suggestions for improvements&#10;&#10;We'll take care of everything from here and keep you updated on course availability and our progress!"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Registration & Feedback</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">What Happens Next?</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>We'll review your course registration and feedback within 48 hours</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>You'll get notified about course availability and early access to new features</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>We'll keep you updated on course launches and progress - no spam, just valuable updates</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-slate-500">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default JoinPage;
