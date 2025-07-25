import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Cloud,
  ArrowRight,
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Award,
  Filter,
  Search,
  Eye,
  X,
  Database,
  BarChart3,
  Code,
  Shield,
  Zap,
  GitBranch,
  Server,
  Brain,
  Wrench,
  Hammer
} from 'lucide-react';


const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [previewCourse, setPreviewCourse] = useState<string | null>(null);

  const courses = [
    {
      id: 'kubernetes',
      title: 'Kubernetes Mastery',
      subtitle: 'From Container Basics to Cluster Mastery',
      description: 'Master Kubernetes through interactive labs, real-world scenarios, and hands-on practice. Learn container orchestration, deployment strategies, and cluster management.',
      icon: Container,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      level: 'Beginner to Advanced',
      duration: '40+ Hours',
      students: '5.2K',
      rating: 4.9,
      path: '/kubernetes',
      provider: 'kubernetes',
      features: [
        'Interactive Kubernetes Playground',
        'Real Cluster Simulations',
        'YAML Configuration Editor',
        'Troubleshooting Scenarios',
        'Security Best Practices',
        'Production Deployment Strategies'
      ],
      modules: [
        'Container Fundamentals',
        'Kubernetes Architecture',
        'Pods and Deployments',
        'Services and Networking',
        'Storage and Volumes',
        'Security and RBAC',
        'Monitoring and Logging',
        'Advanced Patterns'
      ]
    },
    {
      id: 'cloud-architecture',
      title: 'Cloud Architecture Studio',
      subtitle: 'Design Scalable Cloud Solutions',
      description: 'Design and build scalable cloud architectures across AWS, Azure, and GCP. Master cloud patterns, security, and best practices through visual learning.',
      icon: Cloud,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      level: 'Intermediate to Expert',
      duration: '60+ Hours',
      students: '3.8K',
      rating: 4.8,
      path: '/cloud-architecture',
      provider: 'multi-cloud',
      status: 'beta',
      features: [
        'Visual Architecture Builder',
        'Multi-Cloud Support (AWS/Azure/GCP)',
        'Security Analysis Engine',
        'Cost Optimization Tools',
        'Infrastructure as Code',
        'Real-time Collaboration'
      ],
      modules: [
        'Cloud Fundamentals',
        'AWS Architecture Patterns',
        'Azure Solutions',
        'Google Cloud Platform',
        'Security Architecture',
        'Cost Optimization',
        'DevOps Integration',
        'Enterprise Patterns'
      ]
    },
    {
      id: 'docker',
      title: 'Docker Mastery',
      subtitle: 'Containerization from Basics to Production',
      description: 'Master Docker containerization, from basic concepts to advanced orchestration. Learn to build, deploy, and manage containerized applications.',
      icon: Container,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      level: 'Beginner to Advanced',
      duration: '25+ Hours',
      students: 'Coming Soon',
      rating: 'New',
      path: '#',
      provider: 'docker',
      status: 'coming-soon',
      progress: 75,
      features: [
        'Docker Fundamentals',
        'Container Orchestration',
        'Docker Compose',
        'Production Deployment',
        'Security Best Practices',
        'Multi-stage Builds'
      ],
      modules: [
        'Docker Basics',
        'Images & Containers',
        'Docker Compose',
        'Networking',
        'Volumes & Storage',
        'Security',
        'Production Deployment',
        'Orchestration'
      ]
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics',
      subtitle: 'Transform Data into Insights',
      description: 'Learn to analyze data, create visualizations, and derive actionable insights using modern analytics tools and techniques.',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      level: 'Beginner to Advanced',
      duration: '35+ Hours',
      students: 'Coming Soon',
      rating: 'New',
      path: '#',
      provider: 'analytics',
      status: 'coming-soon',
      progress: 60,
      features: [
        'Statistical Analysis',
        'Data Visualization',
        'Python/R Programming',
        'SQL Mastery',
        'Business Intelligence',
        'Machine Learning Basics'
      ],
      modules: [
        'Data Fundamentals',
        'Statistical Methods',
        'Python for Analytics',
        'SQL & Databases',
        'Visualization Tools',
        'Business Intelligence',
        'Predictive Analytics',
        'Real-world Projects'
      ]
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      subtitle: 'Build Scalable Data Pipelines',
      description: 'Design and build robust data pipelines, ETL processes, and data infrastructure for modern data-driven organizations.',
      icon: Database,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      level: 'Intermediate to Expert',
      duration: '45+ Hours',
      students: 'Coming Soon',
      rating: 'New',
      path: '#',
      provider: 'data-engineering',
      status: 'coming-soon',
      progress: 40,
      features: [
        'ETL/ELT Pipelines',
        'Big Data Technologies',
        'Stream Processing',
        'Data Warehousing',
        'Apache Spark',
        'Cloud Data Platforms'
      ],
      modules: [
        'Data Pipeline Basics',
        'Apache Spark',
        'Stream Processing',
        'Data Warehousing',
        'ETL Best Practices',
        'Cloud Platforms',
        'Monitoring & Optimization',
        'Real-time Analytics'
      ]
    },
    {
      id: 'web-development',
      title: 'Web Development',
      subtitle: 'Build Modern Web Applications',
      description: 'Master full-stack web development with modern frameworks, responsive design, and best practices for creating dynamic web applications.',
      icon: Code,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      textColor: 'text-violet-700',
      level: 'Beginner to Advanced',
      duration: '50+ Hours',
      students: 'Coming Soon',
      rating: 'New',
      path: '#',
      provider: 'web-dev',
      status: 'coming-soon',
      progress: 70,
      features: [
        'HTML, CSS, JavaScript',
        'React & Modern Frameworks',
        'Backend Development',
        'Database Integration',
        'Responsive Design',
        'API Development'
      ],
      modules: [
        'HTML & CSS Fundamentals',
        'JavaScript Essentials',
        'React Development',
        'Backend with Node.js',
        'Database Integration',
        'API Design',
        'Deployment & Hosting',
        'Advanced Patterns'
      ]
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      subtitle: 'Protect Digital Assets',
      description: 'Learn cybersecurity fundamentals, threat detection, incident response, and security best practices for modern organizations.',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      level: 'Beginner to Advanced',
      duration: '50+ Hours',
      students: 'Coming Soon',
      rating: 'New',
      path: '#',
      provider: 'security',
      status: 'coming-soon',
      progress: 30,
      features: [
        'Threat Detection',
        'Incident Response',
        'Network Security',
        'Application Security',
        'Compliance & Governance',
        'Ethical Hacking'
      ],
      modules: [
        'Security Fundamentals',
        'Network Security',
        'Application Security',
        'Threat Analysis',
        'Incident Response',
        'Compliance',
        'Ethical Hacking',
        'Security Operations'
      ]
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      subtitle: 'Build Intelligent Systems',
      description: 'Dive into artificial intelligence and machine learning, from basic algorithms to advanced deep learning and neural networks.',
      icon: Brain,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
      level: 'Intermediate to Expert',
      duration: '60+ Hours',
      students: 'Coming Soon',
      rating: 'New',
      path: '#',
      provider: 'ai-ml',
      status: 'coming-soon',
      progress: 20,
      features: [
        'Machine Learning Algorithms',
        'Deep Learning',
        'Neural Networks',
        'Computer Vision',
        'Natural Language Processing',
        'MLOps & Deployment'
      ],
      modules: [
        'ML Fundamentals',
        'Supervised Learning',
        'Unsupervised Learning',
        'Deep Learning',
        'Computer Vision',
        'NLP',
        'MLOps',
        'Advanced Topics'
      ]
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase().includes(selectedLevel);
    const matchesProvider = selectedProvider === 'all' || course.provider === selectedProvider;

    return matchesSearch && matchesLevel && matchesProvider;
  });

  // Separate available and coming soon courses
  const availableCourses = filteredCourses.filter(course => !course.status || course.status !== 'coming-soon');
  const comingSoonCourses = filteredCourses.filter(course => course.status === 'coming-soon');

  return (
    <>
      <Helmet>
        <title>Courses - SAMWI Learn</title>
        <meta name="description" content="Explore our comprehensive technology courses including Kubernetes and Cloud Architecture. Interactive, hands-on learning for all skill levels." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50" />
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Compact Header */}
        <section className="py-8 lg:py-12 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Choose Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learning Path
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Interactive courses designed for hands-on learning. Start your journey today!
              </p>
            </motion.div>

            {/* Quick Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-300 bg-white/90 backdrop-blur-sm text-slate-700 placeholder-slate-400"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Available Courses */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-3"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>Available Now</span>
            </motion.h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {availableCourses.map((course, index) => {
                const Icon = course.icon;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.03,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
                  >
                    {/* Progress indicator */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${course.color}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Beta Badge */}
                    {course.status === 'beta' && (
                      <div className="absolute top-4 right-4 z-10">
                        <motion.div
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                          animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              '0 4px 6px rgba(0, 0, 0, 0.1)',
                              '0 8px 15px rgba(251, 146, 60, 0.3)',
                              '0 4px 6px rgba(0, 0, 0, 0.1)'
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          BETA
                        </motion.div>
                      </div>
                    )}
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-10`} />
                    </div>

                    {/* Course Header - Compact */}
                    <div className="p-6 relative">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <motion.div
                            className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${course.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}
                            whileHover={{
                              scale: 1.1,
                              rotate: [0, -5, 5, 0],
                              transition: { duration: 0.5 }
                            }}
                          >
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                              }}
                              transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            >
                              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </motion.div>
                          </motion.div>
                          <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                              {course.title}
                            </h2>
                            <p className="text-slate-600 font-medium text-sm sm:text-base">{course.subtitle}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 self-start">
                          <motion.button
                            onClick={() => setPreviewCourse(course.id)}
                            className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-300 flex items-center space-x-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </motion.button>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              to={course.path}
                              className={`bg-gradient-to-r ${course.color} text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group/btn relative overflow-hidden`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                              <Play className="w-4 h-4" />
                              <span>Start Now</span>
                            </Link>
                          </motion.div>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-4 leading-relaxed">{course.description}</p>

                      {/* Beta Notice */}
                      {course.status === 'beta' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-3 mb-4"
                        >
                          <div className="flex items-center space-x-2">
                            <motion.div
                              className="w-2 h-2 bg-orange-500 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <span className="text-sm font-medium text-orange-800">
                              Beta Version - New features being added regularly!
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Course Stats - Compact */}
                      <div className="flex items-center justify-between bg-slate-50/80 backdrop-blur-sm rounded-xl p-3 mb-4">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{course.students}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Award className="w-4 h-4" />
                          <span className="text-sm font-medium">{course.level}</span>
                        </div>
                      </div>

                      {/* Key Features - Compact */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {course.features.slice(0, 4).map((feature, featureIndex) => (
                          <motion.div
                            key={feature}
                            className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg p-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="font-medium text-slate-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Course Modules - Expandable */}
                    <div className="px-6 pb-6 relative">
                      <motion.div
                        className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-4"
                        whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.9)" }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-slate-600" />
                            <span>Course Modules ({course.modules.length})</span>
                          </h3>
                          <motion.button
                            className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            View All
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {course.modules.slice(0, 6).map((module, moduleIndex) => (
                            <motion.div
                              key={module}
                              className="text-xs text-slate-600 flex items-center space-x-2 bg-white/60 rounded-lg p-2"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: moduleIndex * 0.03 }}
                            >
                              <span className={`w-5 h-5 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center text-xs font-bold text-white`}>
                                {moduleIndex + 1}
                              </span>
                              <span className="font-medium truncate">{module}</span>
                            </motion.div>
                          ))}
                        </div>

                        {course.modules.length > 6 && (
                          <div className="text-center mt-3">
                            <span className="text-xs text-slate-500">
                              +{course.modules.length - 6} more modules
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Coming Soon Courses */}
        {comingSoonCourses.length > 0 && (
          <section className="pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center justify-center space-x-3">
                  <motion.div
                    className="w-3 h-3 bg-orange-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span>Coming Soon - We're Working On It!</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Wrench className="w-5 h-5 text-orange-500" />
                  </motion.div>
                </h2>
                <p className="text-slate-600 mb-4">
                  Our team is actively developing these courses. Get ready for amazing learning experiences!
                </p>

                {/* Development Stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Overall Progress</span>
                    <span className="font-bold text-slate-900">
                      {Math.round(comingSoonCourses.reduce((acc, course) => acc + course.progress, 0) / comingSoonCourses.length)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${Math.round(comingSoonCourses.reduce((acc, course) => acc + course.progress, 0) / comingSoonCourses.length)}%`
                      }}
                      transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comingSoonCourses.map((course, index) => {
                  const Icon = course.icon;
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        y: -5,
                        transition: { duration: 0.3 }
                      }}
                      className="bg-white/90 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group relative"
                    >
                      {/* Working Progress Bar */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${course.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Coming Soon Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <motion.div
                          className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {course.progress}% Complete
                        </motion.div>
                      </div>

                      <div className="p-6 relative">
                        <div className="flex items-center space-x-4 mb-4">
                          <motion.div
                            className={`w-14 h-14 bg-gradient-to-r ${course.color} rounded-xl flex items-center justify-center shadow-lg relative`}
                            animate={{
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Icon className="w-7 h-7 text-white" />
                            {/* Working indicator */}
                            <motion.div
                              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-slate-600 font-medium text-sm">{course.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-slate-700 mb-4 text-sm leading-relaxed">{course.description}</p>

                        {/* Progress Details */}
                        <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-3 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-600">Development Progress</span>
                            <span className="text-xs font-bold text-slate-900">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 bg-gradient-to-r ${course.color} rounded-full`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 2, ease: "easeInOut", delay: index * 0.2 }}
                            />
                          </div>
                        </div>

                        {/* Features Preview */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {course.features.slice(0, 4).map((feature, featureIndex) => (
                            <motion.div
                              key={feature}
                              className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-lg p-2 text-xs"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                            >
                              <motion.div
                                className="w-2 h-2 bg-orange-500 rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: featureIndex * 0.2
                                }}
                              />
                              <span className="font-medium text-slate-700">{feature}</span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <motion.button
                            className="flex-1 bg-slate-200 text-slate-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                          >
                            <Clock className="w-4 h-4" />
                            <span>Coming Soon</span>
                          </motion.button>

                          <motion.button
                            onClick={() => setPreviewCourse(course.id)}
                            className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-300 flex items-center space-x-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="w-4 h-4" />
                            <span>Preview</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* No Results */}
            {filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your search</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevel('all');
                    setSelectedProvider('all');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Floating Quick Start Bar - Only Available Courses */}
        {availableCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Ready to start?</span>
                </div>
                <div className="flex space-x-2">
                  {availableCourses.map((course) => (
                    <motion.div key={course.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to={course.path}
                        className={`bg-gradient-to-r ${course.color} text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm group relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <course.icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">
                          Start {course.title.split(' ')[0]}
                          {course.status === 'beta' && (
                            <span className="ml-1 text-xs bg-white/20 px-1 rounded">BETA</span>
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Coming Soon Notification Bar */}
        {comingSoonCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="fixed bottom-20 right-6 z-40"
          >
            <div className="bg-orange-500/95 backdrop-blur-sm text-white rounded-xl shadow-xl p-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Hammer className="w-4 h-4" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium">
                    {comingSoonCourses.length} courses in development
                  </p>
                  <p className="text-xs opacity-90">
                    Coming soon!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Future Roadmap */}
        <section className="py-8 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                </motion.div>
                <span>Future Learning Paths</span>
              </h2>
              <p className="text-slate-600 mb-4 max-w-xl mx-auto">
                More exciting courses are in our roadmap for 2024!
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Microservices', 'Blockchain', 'IoT Development', 'Quantum Computing'].map((course) => (
                  <motion.div
                    key={course}
                    className="bg-white/80 backdrop-blur-sm text-slate-600 px-3 py-1 rounded-lg text-sm font-medium border border-white/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    {course}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Preview Modal */}
        {previewCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const course = courses.find(c => c.id === previewCourse);
                if (!course) return null;
                const Icon = course.icon;

                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${course.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{course.title}</h2>
                          <p className="text-slate-600">{course.subtitle}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreviewCourse(null)}
                        className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-slate-900 mb-3">Course Overview</h3>
                        <p className="text-slate-700 leading-relaxed">{course.description}</p>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 mb-3">What You'll Learn</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {course.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-slate-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 mb-3">Course Modules</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {course.modules.map((module, index) => (
                            <div key={index} className="flex items-center space-x-3 bg-slate-50 rounded-lg p-3">
                              <span className={`w-6 h-6 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center text-xs font-bold text-white`}>
                                {index + 1}
                              </span>
                              <span className="font-medium text-slate-700">{module}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-4 pt-4 border-t border-slate-200">
                        <Link
                          to={course.path}
                          className={`flex-1 bg-gradient-to-r ${course.color} text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2`}
                        >
                          <Play className="w-5 h-5" />
                          <span>Start Learning</span>
                        </Link>
                        <button
                          onClick={() => setPreviewCourse(null)}
                          className="px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default CoursesPage;
