import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Search
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');

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
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level.toLowerCase().includes(selectedLevel);
    const matchesProvider = selectedProvider === 'all' || course.provider === selectedProvider;
    
    return matchesSearch && matchesLevel && matchesProvider;
  });

  return (
    <>
      <Helmet>
        <title>Courses - SAMWI Learn</title>
        <meta name="description" content="Explore our comprehensive technology courses including Kubernetes and Cloud Architecture. Interactive, hands-on learning for all skill levels." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Our <span className="text-gradient">Learning Modules</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Master modern technologies through comprehensive, interactive courses designed by industry experts
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="glass-effect rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Level Filter */}
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  {/* Provider Filter */}
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Providers</option>
                    <option value="kubernetes">Kubernetes</option>
                    <option value="multi-cloud">Multi-Cloud</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCourses.map((course, index) => {
                const Icon = course.icon;
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="glass-effect rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    {/* Course Header */}
                    <div className={`${course.bgColor} ${course.borderColor} border-b-2 p-8`}>
                      <div className="flex items-start space-x-4 mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-slate-900 mb-1">{course.title}</h2>
                          <p className="text-slate-600 font-medium">{course.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-slate-700 mb-6 leading-relaxed">{course.description}</p>

                      {/* Course Stats */}
                      <div className="flex items-center space-x-6 text-sm text-slate-600 mb-6">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students} students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {course.features.slice(0, 4).map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-8">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Course Modules</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-2 mb-8">
                        {course.modules.map((module, moduleIndex) => (
                          <div key={module} className="text-sm text-slate-600 flex items-center space-x-2">
                            <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium">
                              {moduleIndex + 1}
                            </span>
                            <span>{module}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-4">
                        <Link
                          to={course.path}
                          className={`flex-1 bg-gradient-to-r ${course.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group`}
                        >
                          <Play className="w-5 h-5" />
                          <span>Start Learning</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300">
                          Preview
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* No Results */}
            {filteredCourses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No courses found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevel('all');
                    setSelectedProvider('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">More Courses Coming Soon</h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                We're constantly expanding our course library. Stay tuned for new modules on DevOps, Security, and more!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['DevOps Pipeline', 'Security Fundamentals', 'Microservices', 'Data Engineering'].map((course) => (
                  <div key={course} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-medium">
                    {course} - Coming Soon
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CoursesPage;
