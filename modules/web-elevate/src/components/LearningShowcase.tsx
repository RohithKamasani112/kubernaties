import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Target, 
  Play, 
  CheckCircle, 
  Star, 
  Zap,
  Users,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';

const LearningShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Scenario-Based Learning",
      description: "Learn through real-world scenarios that mirror actual development challenges",
      details: "Each topic is presented through compelling narratives and practical contexts that make learning engaging and memorable.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Code className="w-8 h-8 text-green-600" />,
      title: "Interactive Challenges",
      description: "Hands-on coding with Monaco editor and instant feedback",
      details: "Professional-grade code editor with syntax highlighting, real-time validation, and progressive hint systems.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Play className="w-8 h-8 text-purple-600" />,
      title: "Visual Learning",
      description: "Animation scripts that visualize complex React concepts",
      details: "Interactive animations that break down complex concepts like Virtual DOM, component lifecycle, and state management.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Trophy className="w-8 h-8 text-orange-600" />,
      title: "Gamified Progress",
      description: "XP rewards, achievements, and progress tracking",
      details: "Earn experience points, unlock achievements, and track your learning journey with detailed progress analytics.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { label: "Learning Topics", value: "43+", icon: <BookOpen className="w-6 h-6" /> },
    { label: "Interactive Challenges", value: "120+", icon: <Code className="w-6 h-6" /> },
    { label: "XP Rewards", value: "5000+", icon: <Trophy className="w-6 h-6" /> },
    { label: "Estimated Hours", value: "120", icon: <Star className="w-6 h-6" /> }
  ];

  const learningPath = [
    { title: "React Fundamentals", topics: 8, difficulty: "Beginner", color: "bg-green-100 text-green-800" },
    { title: "Component Patterns", topics: 12, difficulty: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { title: "State Management", topics: 10, difficulty: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { title: "Advanced Hooks", topics: 8, difficulty: "Advanced", color: "bg-red-100 text-red-800" },
    { title: "Performance", topics: 5, difficulty: "Advanced", color: "bg-red-100 text-red-800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 mb-16"
        >
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
            >
              Enhanced React Learning
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-600 max-w-4xl mx-auto"
            >
              Experience the future of web development education with scenario-based learning, 
              interactive challenges, and smooth animations
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-12 mb-16"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Revolutionary Learning Experience</h2>
            <p className="text-xl text-gray-600">
              Discover what makes our React learning platform unique
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  onClick={() => setActiveFeature(index)}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-white shadow-xl border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                      {React.cloneElement(feature.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Detail */}
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center space-y-6">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${features[activeFeature].color}`}>
                  {React.cloneElement(features[activeFeature].icon, { className: "w-12 h-12 text-white" })}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{features[activeFeature].details}</p>
                
                {/* Mock Interface Preview */}
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Interactive Preview</p>
                    <p className="text-xs">Experience this feature in the live platform</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Learning Path Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-8 mb-16"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Structured Learning Journey</h2>
            <p className="text-xl text-gray-600">
              Progress through carefully crafted modules from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {learningPath.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  
                  <div className="space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${module.color}`}>
                      {module.difficulty}
                    </span>
                    <p className="text-sm text-gray-600">{module.topics} topics</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center space-y-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your React Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers mastering React through our innovative learning platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Learning Now</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Content</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningShowcase;
