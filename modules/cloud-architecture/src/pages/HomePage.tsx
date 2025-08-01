import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight,
  Play,
  BookOpen,
  Palette,
  Zap,
  Cloud,
  Shield,
  Cpu,
  Database,
  Network,
  Award,
  Target,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: BookOpen,
      title: 'Learning Studio',
      description: 'Interactive guided learning with hands-on scenarios and real-world projects.',
      href: 'studio',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Canvas Builder',
      description: 'Design and visualize cloud architectures with our drag-and-drop builder.',
      href: 'builder',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'AI Generator',
      description: 'Generate production-ready architectures using AI assistance.',
      href: 'ai-generator',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Target,
      title: 'Scenarios',
      description: 'Practice with real-world cloud architecture scenarios and challenges.',
      href: 'scenarios',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { label: 'Cloud Platforms', value: '3+', icon: Cloud },
    { label: 'Learning Paths', value: '12+', icon: BookOpen },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
    { label: 'Interactive Labs', value: '50+', icon: Award }
  ];



  return (
    <>
      <Helmet>
        <title>Cloud Architecture Studio - Interactive Learning Platform</title>
        <meta name="description" content="Master cloud architecture through interactive learning, AI-powered tools, and hands-on scenarios." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Master{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cloud Architecture
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Design, build, and deploy scalable cloud solutions through interactive learning,
                AI-powered tools, and real-world scenarios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="studio"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="scenarios"
                  className="border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Target className="w-5 h-5" />
                  <span>Browse Scenarios</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Everything You Need to Master Cloud Architecture
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From interactive learning to AI-powered design tools, we provide comprehensive resources
                for your cloud architecture journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Link
                      to={feature.href}
                      className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Trusted by Cloud Professionals
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Join thousands of developers and architects mastering cloud technologies through our platform.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={statsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                    <div className="text-slate-600 font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
