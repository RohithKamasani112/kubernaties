import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  Play, 
  Users, 
  Award, 
  Zap,
  Cloud,
  Container,
  Shield,
  Cpu,
  Database,
  Network,
  Settings,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [coursesRef, coursesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const courses = [
    {
      id: 'kubernetes',
      title: 'Kubernetes Mastery',
      description: 'From container basics to cluster mastery. Learn Kubernetes through interactive labs, real-world scenarios, and hands-on practice.',
      icon: Container,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      features: ['Interactive Labs', 'Real Clusters', 'YAML Editor', 'Troubleshooting'],
      level: 'Beginner to Advanced',
      duration: '40+ Hours',
      path: '/kubernetes'
    },
    {
      id: 'cloud-architecture',
      title: 'Cloud Architecture Studio',
      description: 'Design and build scalable cloud architectures. Master AWS, Azure, and GCP through visual learning and hands-on projects.',
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      features: ['Visual Builder', 'Multi-Cloud', 'Security Focus', 'Best Practices'],
      level: 'Intermediate to Expert',
      duration: '60+ Hours',
      path: '/cloud-architecture'
    }
  ];

  const features = [
    {
      icon: Play,
      title: 'Interactive Learning',
      description: 'Learn by doing with hands-on labs, real-time feedback, and interactive simulations.'
    },
    {
      icon: Target,
      title: 'Practical Focus',
      description: 'Master real-world skills through project-based learning and industry scenarios.'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Track progress with badges, certificates, and skill assessments.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn alongside peers, share knowledge, and get expert guidance.'
    }
  ];

  const stats = [
    { label: 'Active Learners', value: '10K+', icon: Users },
    { label: 'Hands-on Labs', value: '200+', icon: BookOpen },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
    { label: 'Expert Instructors', value: '50+', icon: Award }
  ];

  return (
    <>
      <Helmet>
        <title>SAMWI Learn - Interactive Technology Education</title>
        <meta name="description" content="Master Kubernetes, Cloud Architecture, and modern technologies through interactive, hands-on learning experiences." />
        <meta name="keywords" content="kubernetes, cloud architecture, aws, azure, gcp, learning, education, interactive" />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Welcome to{' '}
                <span className="text-gradient">SAMWI Learn</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Master modern technologies through interactive, hands-on learning experiences. 
                From Kubernetes to cloud architecture, we make complex concepts accessible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/courses"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group glass-effect px-8 py-4 rounded-xl font-semibold text-lg text-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute -top-10 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float" />
              <div className="absolute -top-5 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
              <div className="absolute top-10 left-1/3 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose SAMWI Learn?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of technical education with our innovative learning platform
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
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section ref={coursesRef} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={coursesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Our Learning Modules
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive courses designed to take you from beginner to expert
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={coursesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`${course.bgColor} ${course.borderColor} border-2 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 group`}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{course.title}</h3>
                      <p className="text-slate-600 mb-4">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.features.map((feature) => (
                          <span key={feature} className={`${course.textColor} bg-white px-3 py-1 rounded-full text-sm font-medium`}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <div className="flex items-center space-x-4">
                        <span>📚 {course.level}</span>
                        <span>⏱️ {course.duration}</span>
                      </div>
                    </div>
                    <Link
                      to={course.path}
                      className={`bg-gradient-to-r ${course.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group`}
                    >
                      <span>Start Course</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Join Thousands of Learners
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Be part of a growing community of technology professionals
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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-slate-300">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have advanced their careers with SAMWI Learn
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
