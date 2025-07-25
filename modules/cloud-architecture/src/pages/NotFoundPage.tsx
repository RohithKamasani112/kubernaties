import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Cloud } from 'lucide-react';

interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
            <p className="text-slate-600 mb-8">
              The architecture you're looking for seems to have drifted into the cloud. 
              Let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/cloud-architecture"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go to Home</span>
            </Link>

            <Link
              to="/cloud-architecture/scenarios"
              className="w-full border border-slate-300 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Browse Scenarios</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full text-slate-500 py-3 px-6 rounded-lg font-medium hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Need help?</strong> If you think this is an error, please check the URL or 
              contact our support team.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
