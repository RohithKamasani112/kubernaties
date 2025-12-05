import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                404
              </div>
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-white/20 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-slate-600 mb-4">Looking for something specific? Try these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/courses"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/kubernetes"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Kubernetes Module
                </Link>
                <Link
                  to="/cloud-architecture"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Cloud Architecture
                </Link>
                <Link
                  to="/about"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  About Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
