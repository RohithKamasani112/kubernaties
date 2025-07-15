import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Globe, 
  BookOpen, 
  Rocket, 
  Target, 
  ArrowRight,
  Star,
  Award,
  Code,
  Zap,
  Shield,
  Layers,
  GitBranch,
  Play,
  UserPlus
} from 'lucide-react';

const About: React.FC = () => {
  // SEO optimization for About page
  useEffect(() => {
    // Update page title and meta description for About page
    document.title = "About Samwi - Free Kubernetes Learning Platform | Our Mission & Values";

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Learn about Samwi\'s mission to democratize Kubernetes and DevOps education. Discover our commitment to providing free, high-quality learning resources for everyone, everywhere.'
      );
    }

    // Add structured data for organization
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Samwi",
      "description": "Free Kubernetes and DevOps learning platform providing interactive tutorials, hands-on labs, and community support",
      "url": "https://samwi.dev",
      "logo": "https://samwi.dev/logo.png",
      "foundingDate": "2024",
      "sameAs": [
        "https://github.com/samwi-dev",
        "https://twitter.com/samwi_dev"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "hello@samwi.dev"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free Kubernetes learning platform"
      }
    };

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Reset title when leaving page
      document.title = "Samwi - Free Kubernetes Learning Platform | DevOps Education";

      // Reset meta description
      if (metaDescription) {
        metaDescription.setAttribute('content',
          'Learn Kubernetes for free with Samwi\'s interactive platform. Master DevOps, container orchestration, and cloud-native technologies through hands-on labs, tutorials, and community support.'
        );
      }

      // Remove structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const stats = [
    { number: 'NEW', label: 'Fresh Learning Journey', icon: Users },
    { number: 'FOCUSED', label: 'Quality-First Approach', icon: BookOpen },
    { number: '100%', label: 'Free Forever', icon: Globe },
    { number: 'GROWING', label: 'Community Building', icon: Heart }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'Building a supportive community of learners who grow together from the very beginning of their DevOps journey.'
    },
    {
      icon: Globe,
      title: 'Fresh Start Advantage',
      description: 'Starting fresh means we can focus on modern best practices and the latest Kubernetes approaches from day one.'
    },
    {
      icon: Rocket,
      title: 'Quality Foundation',
      description: 'We\'re building one exceptional course at a time, ensuring each lesson meets the highest standards before expanding.'
    },
    {
      icon: Target,
      title: 'Learner-Shaped',
      description: 'As early adopters, you help shape our platform - your feedback directly influences how we build the future.'
    }
  ];

  const features = [
    { icon: Code, text: 'Interactive Kubernetes Playground' },
    { icon: BookOpen, text: 'Focused Learning Path' },
    { icon: Users, text: 'Growing Learning Community' },
    { icon: Award, text: 'Foundation-First Approach' },
    { icon: Zap, text: 'Hands-on Practice Labs' },
    { icon: Shield, text: 'Quality Over Quantity' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6"
              >
                <Layers className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-700 mb-6">
                Welcome to <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Samwi</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Born from a simple belief: <strong>quality education should never be behind a paywall</strong>.
                Samwi is your gateway to <strong>carefully crafted, free learning experiences</strong> - starting with
                <strong> Kubernetes and DevOps fundamentals</strong>, and expanding into <strong>emerging technologies</strong> as we grow together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/lessons"
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-sky-300 to-blue-400 text-white font-medium rounded-xl hover:from-sky-400 hover:to-blue-500 transition-all duration-300 shadow-md"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Learning Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/playground"
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-white transition-all duration-300 shadow-md"
                  >
                    <Code className="w-5 h-5" />
                    <span>Try Playground</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Content - Inspiration Story */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/30"
            >
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-rose-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-700">Our Inspiration</h2>
              </div>

              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  <strong>"Education is the most powerful weapon which you can use to change the world."</strong>
                  This quote by Nelson Mandela drives everything we do at Samwi.
                </p>

                <p className="leading-relaxed">
                  We've witnessed countless talented individuals held back by expensive courses and paywalled content.
                  That's why we created Samwi - to break down these barriers and democratize access to
                  <strong> premium technology education</strong> across all emerging fields.
                </p>

                <p className="leading-relaxed">
                  Our commitment goes beyond just being free. We're obsessed with delivering
                  <strong> the best learning experience possible</strong> - interactive environments,
                  real-world scenarios, and hands-on labs that prepare you for the future of technology.
                </p>

                <div className="bg-sky-50 rounded-xl p-4 border-l-4 border-sky-300">
                  <p className="text-sky-700 font-medium italic">
                    "Every expert was once a beginner. Every pro was once an amateur.
                    Every icon was once an unknown. We're here to accelerate your journey."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Excellence Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/30"
            >
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-sky-400 mr-3" />
                <h2 className="text-3xl font-bold text-gray-700">Our Mission</h2>
              </div>

              <div className="space-y-4 text-gray-600">
                <p className="text-lg leading-relaxed">
                  To <strong>democratize technology education</strong> and make world-class
                  <strong> learning resources</strong> accessible to everyone, regardless of their
                  financial background or geographic location.
                </p>

                <p className="leading-relaxed">
                  We're building the most comprehensive <strong>free learning platform</strong> for emerging technologies
                  that combines theoretical knowledge with practical, hands-on experience across multiple domains.
                </p>

                <div className="bg-sky-50 rounded-xl p-4">
                  <h3 className="font-medium text-sky-700 mb-2">What Makes Us Different:</h3>
                  <ul className="space-y-2 text-sky-600">
                    <li className="flex items-center"><Star className="w-4 h-4 mr-2" />100% Free, Forever</li>
                    <li className="flex items-center"><Star className="w-4 h-4 mr-2" />Multi-Technology Focus</li>
                    <li className="flex items-center"><Star className="w-4 h-4 mr-2" />Interactive Learning Labs</li>
                    <li className="flex items-center"><Star className="w-4 h-4 mr-2" />Future-Ready Skills</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Excellence Commitment */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-sky-200"
            >
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-amber-500 mr-3" />
                <h2 className="text-3xl font-medium text-gray-700">Excellence Commitment</h2>
              </div>

              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-gray-600">
                  Being free doesn't mean compromising on quality. We're committed to delivering
                  <strong> the best learning experience</strong> across all technology domains.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1 text-gray-700">Cutting-Edge Content</h3>
                      <p className="text-gray-600 text-sm">Always updated with the latest technology trends and industry best practices</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1 text-gray-700">Industry Standards</h3>
                      <p className="text-gray-600 text-sm">Content reviewed by technology experts and industry professionals</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1 text-gray-700">Community Support</h3>
                      <p className="text-gray-600 text-sm">Active community of learners and mentors ready to help</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Rocket className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1 text-gray-700">Future Ready</h3>
                      <p className="text-gray-600 text-sm">Skills for emerging technologies and tomorrow's job market</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that drive our <strong>community-focused learning</strong> platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  <Icon className="w-12 h-12 text-blue-500 mb-6" />
                  <h3 className="text-xl font-bold text-gray-700 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Experience & Features */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-medium text-gray-700 mb-6">
              The Samwi Learning Experience
            </h2>
            <p className="text-xl text-gray-500 max-w-4xl mx-auto">
              Join our <strong>growing community of early learners</strong> who are shaping the future of <strong>free tech education</strong>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Interactive Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/95 rounded-3xl p-8 shadow-lg border border-white/30"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 mb-3">Interactive Learning Labs</h3>
                <p className="text-gray-500 leading-relaxed">
                  Learn by doing with our revolutionary interactive environments. Practice with real tools,
                  technologies, and scenarios in safe, sandboxed environments.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Real technology stacks</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Visual learning tools</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Live system monitoring</span>
                </div>
              </div>
            </motion.div>

            {/* Comprehensive Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/95 rounded-3xl p-8 shadow-lg border border-white/30"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 mb-3">Multi-Tech Curriculum</h3>
                <p className="text-gray-500 leading-relaxed">
                  From cloud computing to AI/ML, our structured learning paths cover emerging technologies
                  and prepare you for the future of tech.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>100+ hands-on lessons</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Industry challenges</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Adaptive learning paths</span>
                </div>
              </div>
            </motion.div>

            {/* Community Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/95 rounded-3xl p-8 shadow-lg border border-white/30"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-300 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-gray-700 mb-3">Global Community</h3>
                <p className="text-gray-500 leading-relaxed">
                  Join thousands of learners worldwide. Get help, share knowledge, and grow
                  together in our supportive, diverse community.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>24/7 community support</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Expert mentorship</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <GitBranch className="w-4 h-4 text-emerald-400 mr-2" />
                  <span>Peer collaboration</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300 group text-center"
                >
                  <Icon className="w-6 h-6 text-sky-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-gray-600 font-medium leading-tight">{feature.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-100 to-sky-100">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-medium text-gray-700 mb-8">
              The Future of Free Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              🚀 <strong>We're just getting started!</strong> Beginning with our <strong>foundational Kubernetes course</strong>,
              we're building something special - where <strong>quality beats quantity</strong>.
              Join us as <strong>founding learners</strong> and help shape the future of free tech education together!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200">
                <div className="text-4xl mb-3">🎯</div>
                <p className="font-bold text-blue-700 text-lg">Starting Strong</p>
                <p className="text-sm text-blue-600">Quality Kubernetes foundation first</p>
              </div>
              <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="text-4xl mb-3">🌱</div>
                <p className="font-bold text-green-700 text-lg">Growing Together</p>
                <p className="text-sm text-green-600">Community-driven expansion</p>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                <div className="text-4xl mb-3">🚀</div>
                <p className="font-bold text-purple-700 text-lg">Future Ready</p>
                <p className="text-sm text-purple-600">More technologies ahead</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/lessons"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-sky-300 to-blue-400 text-white font-medium rounded-2xl hover:from-sky-400 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>Explore Free Courses</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/playground"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-600 font-medium rounded-2xl border border-gray-200 hover:bg-white transition-all duration-300 shadow-md"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Join Community</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-sky-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-gray-700 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-gray-500">
              Thousands of learners worldwide trust Samwi for their technology education
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/30 hover:shadow-lg transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-sky-400 mx-auto mb-3" />
                  <div className="text-3xl font-medium text-gray-700 mb-1">{stat.number}</div>
                  <div className="text-gray-500 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
