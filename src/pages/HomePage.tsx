import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { easingCurves, durations, animationVariants, transitions } from '../utils/animationConfig';
import {
  ArrowRight,
  ArrowDown,
  Users,
  Cloud,
  Container,
  Shield,
  Database,
  Network,
  Server,
  Clock,
  Package,
  Heart,
  Lightbulb,
  Globe,
  Mail,
  Code,
  Play,
  Star,
  CheckCircle,
  Zap,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  Rocket,
  Settings,
  Sparkles
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';



const HomePage: React.FC = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [pathsRef, pathsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [whyRef, whyInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const [email, setEmail] = useState('');

  // Typing animation state
  const [showFirstLine, setShowFirstLine] = React.useState(false);
  const [showSecondLine, setShowSecondLine] = React.useState(false);
  const [typingText, setTypingText] = React.useState('But by doing Real labs.');
  const [isTyping, setIsTyping] = React.useState(false);

  const typingSequence = ['Real labs.', 'Real projects.', 'Real confidence.'];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (heroInView) {
      const timer1 = setTimeout(() => setShowFirstLine(true), 800);
      const timer2 = setTimeout(() => setShowSecondLine(true), 1400);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [heroInView]);

  // Typing animation effect
  React.useEffect(() => {
    if (showSecondLine) {
      const startTyping = () => {
        setIsTyping(true);
        let currentText = typingSequence[currentIndex];

        // Backspace animation - slower and more controlled
        const backspaceInterval = setInterval(() => {
          setTypingText(prev => {
            if (prev.length <= 'But by doing Real '.length) {
              clearInterval(backspaceInterval);

              // Small pause before typing new text
              setTimeout(() => {
                // Type new text
                let charIndex = 'But by doing Real '.length;
                const typeInterval = setInterval(() => {
                  if (charIndex < `But by doing ${currentText}`.length) {
                    setTypingText(`But by doing ${currentText}`.slice(0, charIndex + 1));
                    charIndex++;
                  } else {
                    clearInterval(typeInterval);
                    setIsTyping(false);

                    // Longer pause to read the complete sentence
                    setTimeout(() => {
                      setCurrentIndex((prev) => (prev + 1) % typingSequence.length);
                    }, 2500);
                  }
                }, 120);
              }, 300);

              return prev;
            }
            return prev.slice(0, -1);
          });
        }, 60);
      };

      // Start with a delay when second line shows
      const startTimer = setTimeout(startTyping, 800);
      return () => clearTimeout(startTimer);
    }
  }, [showSecondLine, currentIndex]);

  const learningPaths = [
    {
      icon: Container,
      title: 'Kubernetes Mastery',
      description: 'From container basics to production clusters. Interactive labs, real scenarios, and hands-on practice.',
      status: 'Live Now',
      statusColor: 'bg-green-100 text-green-700',
      path: '/kubernetes',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Interactive Playground', 'Real Cluster Simulations', 'YAML Editor'],
      duration: '40+ Hours',
      students: '5.2K',
      rating: 4.9
    },
    {
      icon: Cloud,
      title: 'Cloud Architecture Studio',
      description: 'Design scalable solutions across AWS, Azure & GCP. Visual builder with security analysis and real-time collaboration.',
      status: 'Beta Version',
      statusColor: 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200',
      path: '/cloud-architecture',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Visual Builder', 'Multi-Cloud Support', 'Cost Analysis', 'Beta Features'],
      duration: '60+ Hours',
      students: '3.8K',
      rating: 4.8,
      betaNote: 'New features added regularly!'
    },
    {
      icon: Server,
      title: 'DevOps Pipeline',
      description: 'Build robust CI/CD workflows with Docker, Jenkins, and GitOps practices.',
      status: 'Coming Q2 2025',
      statusColor: 'bg-orange-100 text-orange-700',
      path: '#',
      gradient: 'from-orange-500 to-red-500',
      features: ['Pipeline Builder', 'GitOps Workflows', 'Monitoring'],
      duration: '35+ Hours',
      students: 'New',
      rating: null
    },
    {
      icon: Shield,
      title: 'Security Fundamentals',
      description: 'Learn cybersecurity essentials, threat modeling, and secure coding practices.',
      status: 'Coming Q3 2025',
      statusColor: 'bg-red-100 text-red-700',
      path: '#',
      gradient: 'from-red-500 to-pink-500',
      features: ['Threat Modeling', 'Secure Coding', 'Penetration Testing'],
      duration: '45+ Hours',
      students: 'New',
      rating: null
    },
    {
      icon: Database,
      title: 'Database Architecture',
      description: 'Master SQL, NoSQL, and distributed database design patterns.',
      status: 'Coming Q4 2025',
      statusColor: 'bg-indigo-100 text-indigo-700',
      path: '#',
      gradient: 'from-indigo-500 to-purple-500',
      features: ['SQL Mastery', 'NoSQL Patterns', 'Distributed Systems'],
      duration: '50+ Hours',
      students: 'New',
      rating: null
    },
    {
      icon: Network,
      title: 'Network Engineering',
      description: 'Deep dive into networking protocols, SDN, and network automation.',
      status: 'Coming 2026',
      statusColor: 'bg-gray-100 text-gray-600',
      path: '#',
      gradient: 'from-gray-500 to-slate-500',
      features: ['Protocol Deep Dive', 'SDN Concepts', 'Network Automation'],
      duration: '40+ Hours',
      students: 'New',
      rating: null
    }
  ];

  const whyFeatures = [
    {
      icon: Rocket,
      title: 'Hands-On Learning',
      description: 'Build real projects in interactive environments. No more passive video watching.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Community-First',
      description: 'Learn alongside peers, share knowledge, and grow together in our supportive community.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Industry-Relevant',
      description: 'Master technologies that companies actually use. Stay ahead of the curve.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Practical Focus',
      description: 'Skip the theory overload. Learn what you need to succeed in real-world scenarios.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '5K+', label: 'Active Learners', icon: Users },
    { number: '95%', label: 'Completion Rate', icon: TrendingUp },
    { number: '4.9/5', label: 'Average Rating', icon: Star },
    { number: '100%', label: 'Free Access', icon: Heart }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Pass email as URL parameter to pre-fill the join form
      window.location.href = `/join?email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>SAMWI Learn - Master Real Technologies with Hands-On Learning</title>
        <meta name="description" content="SAMWI Learn is a minimal, community-driven platform to help you learn by building. Master Kubernetes, Cloud Architecture, and more." />
      </Helmet>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-8 sm:py-12 lg:py-16" style={{ backgroundColor: '#FAFAFC' }}>
        {/* Optimized Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 0.1, scale: 1 } : {}}
            transition={{
              duration: 1.5,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smoother animation
            }}
            className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] rounded-full blur-3xl float-animation"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 0.08, scale: 1 } : {}}
            transition={{
              duration: 1.5,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="absolute top-20 sm:top-40 right-5 sm:right-20 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-[#8B7CF6] to-[#A855F7] rounded-full blur-2xl float-animation float-delay-1"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={heroInView ? { opacity: 0.06, scale: 1 } : {}}
            transition={{ duration: 2, delay: 1.5 }}
            className="absolute bottom-10 sm:bottom-20 left-1/4 w-12 sm:w-20 h-12 sm:h-20 bg-gradient-to-r from-[#A855F7] to-[#6C63FF] rounded-full blur-2xl float-animation float-delay-2"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
            {/* Left Content - Asymmetrical layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left"
            >
              {/* Main Heading */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-[1.1] sm:leading-[1.2] tracking-tight px-2 sm:px-0"
                  style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}
                >
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={heroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="block mb-1 sm:mb-2 lg:mb-3"
                  >
                    Stop Watching Tutorials.
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 15 }}
                    animate={heroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="block text-[#6C63FF] bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] bg-clip-text text-transparent"
                  >
                    Start Building Real Tech.
                  </motion.span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#4A4A68] leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0"
                  style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}
                >
                  <motion.div
                    className="block mb-2 sm:mb-3 min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem] py-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={showFirstLine ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    Master Kubernetes, DevOps, and Cloud — not by reading or watching,
                  </motion.div>
                  <motion.div
                    className="block min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem] py-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={showSecondLine ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="font-semibold text-[#6C63FF]">
                      {typingText}
                      {isTyping && <span className="animate-pulse">|</span>}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center lg:justify-start px-2 sm:px-0"
              >
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.9,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  className="group"
                >
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-[#6C63FF] to-[#8B7CF6] hover:from-[#5848E2] hover:to-[#7C3AED] text-white px-6 sm:px-8 py-4 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto relative overflow-hidden min-h-[48px] touch-manipulation"
                    style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                    <span className="relative z-10">Start Learning Free</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 1.0,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.03,
                    y: -2,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  className="group"
                >
                  <Link
                    to="/kubernetes/debugging"
                    className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-white border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white px-6 sm:px-8 py-4 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-md hover:shadow-xl w-full sm:w-auto relative overflow-hidden min-h-[48px] touch-manipulation"
                    style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}
                  >
                    <div className="absolute inset-0 bg-[#6C63FF] -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform group-hover:rotate-12 duration-300" />
                    <span className="relative z-10">Preview a Lab</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust Indicators - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8 max-w-xs sm:max-w-sm lg:max-w-md mx-auto lg:mx-0">
                {[
                  { icon: Users, number: '5,000+', label: 'Active Learners' },
                  { icon: CheckCircle, number: '95%', label: 'Completion Rate' },
                  { icon: Star, number: '4.9/5', label: 'Average Rating' },
                  { icon: Heart, number: '100%', label: 'Free Access' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-2 sm:space-x-3"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6C63FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#8E8EA0]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm sm:text-lg font-bold text-slate-900 leading-tight" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm text-[#8E8EA0] font-medium leading-tight" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative mt-6 sm:mt-8 lg:mt-0 px-2 sm:px-0"
            >
              {/* Dashboard Mockup */}
              <div className="relative bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-gray-100 max-w-sm sm:max-w-lg mx-auto lg:max-w-none">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-[#6C63FF] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-xs lg:text-sm">K</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                        Kubernetes Lab
                      </h3>
                      <p className="text-xs text-gray-500 hidden sm:block">Interactive Terminal</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Terminal Content */}
                <div className="bg-gray-900 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                  <div className="text-green-400 mb-1 sm:mb-2">$ kubectl get pods</div>
                  <div className="text-gray-300 mb-1 hidden sm:block">NAME                    READY   STATUS</div>
                  <div className="text-gray-300 mb-1 sm:hidden">NAME           READY</div>
                  <div className="text-blue-400 mb-1">web-app-7d4b8c9f-xyz12  1/1     Running</div>
                  <div className="text-blue-400 mb-1 hidden sm:block">database-5f6g7h8-abc34   1/1     Running</div>
                  <div className="text-green-400 mb-1 sm:mb-2">$ kubectl apply -f deployment.yaml</div>
                  <div className="text-yellow-400">deployment.apps/web-app created ✓</div>
                  <div className="text-green-400 mt-1 sm:mt-2 animate-pulse">$ _</div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                    Lab Progress
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-12 sm:w-16 lg:w-24 h-1.5 sm:h-2 bg-gray-200 rounded-full">
                      <motion.div
                        className="h-full bg-[#6C63FF] rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#6C63FF]">75%</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 border border-gray-100 hidden sm:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs font-medium text-gray-700">Pod Created</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 bg-white rounded-lg sm:rounded-xl shadow-lg p-2 sm:p-3 border border-gray-100 hidden sm:block"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-700">5 Active Users</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Beta Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50 border border-orange-200 rounded-xl p-3 max-w-sm mx-auto mt-8"
          >
            <div className="flex items-center justify-center space-x-2">
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
              <div className="text-center">
                <p className="text-xs font-semibold text-orange-800">
                  🎉 Cloud Architecture Studio is now in Beta!
                  <Link
                    to="/cloud-architecture"
                    className="text-orange-700 hover:text-orange-900 underline font-medium ml-1"
                  >
                    Try it →
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="max-w-4xl mx-auto px-6 lg:px-8 mt-12"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Avatars */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex -space-x-2">
                  {[
                    { name: 'Student 1', bg: 'bg-blue-500' },
                    { name: 'Student 2', bg: 'bg-green-500' },
                    { name: 'Student 3', bg: 'bg-purple-500' },
                    { name: 'Student 4', bg: 'bg-orange-500' }
                  ].map((student, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${student.bg} rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs sm:text-sm`}
                    >
                      {student.name.split(' ')[1]}
                    </div>
                  ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                  <span className="font-semibold text-gray-900">5,000+</span> learners building real projects
                </div>
              </div>

              {/* Testimonial */}
              <div className="text-center md:text-right">
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-1" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                  "I built my first cloud project using SAMWI in just one week."
                </p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Inter, "Segoe UI", Roboto, sans-serif' }}>
                  — DevOps Engineer, Early Adopter
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Learning Paths Section */}
      <section ref={pathsRef} className="py-6 sm:py-8 lg:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pathsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Learning Paths</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-2 sm:px-0">
              Choose your learning path and start building real-world skills
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 20 }}
                animate={pathsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {(path.status === 'Live Now' || path.status === 'Beta Version') ? (
                  <Link
                    to={path.path}
                    className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] block relative overflow-hidden touch-manipulation"
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${path.gradient} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <path.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <motion.span
                          className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${path.statusColor}`}
                          animate={path.status === 'Beta Version' ? {
                            scale: [1, 1.05, 1],
                            boxShadow: [
                              '0 2px 4px rgba(0, 0, 0, 0.1)',
                              '0 4px 8px rgba(251, 146, 60, 0.2)',
                              '0 2px 4px rgba(0, 0, 0, 0.1)'
                            ]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {path.status}
                        </motion.span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{path.title}</h3>
                      <p className="text-slate-600 mb-3 sm:mb-4 text-sm leading-relaxed">{path.description}</p>

                      {/* Beta Notice */}
                      {path.status === 'Beta Version' && path.betaNote && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-2 mb-4"
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
                            <span className="text-xs font-medium text-orange-800">
                              {path.betaNote}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Features */}
                      <div className="space-y-1 mb-3 sm:mb-4">
                        {path.features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 sm:mb-4 gap-2">
                        <div className="flex items-center space-x-1 min-w-0">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{path.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 min-w-0">
                          <Users className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{path.students}</span>
                        </div>
                        {path.rating && (
                          <div className="flex items-center space-x-1 min-w-0">
                            <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                            <span>{path.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center text-transparent bg-gradient-to-r ${path.gradient} bg-clip-text font-medium group-hover:translate-x-1 transition-transform duration-300`}>
                        <span>Start Learning</span>
                        <ArrowRight className="w-4 h-4 ml-2 text-slate-400 flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-5`} />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${path.gradient} opacity-50 rounded-xl flex items-center justify-center`}>
                          <path.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${path.statusColor}`}>
                          {path.status}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{path.title}</h3>
                      <p className="text-slate-600 mb-4 text-sm leading-relaxed">{path.description}</p>

                      {/* Features */}
                      <div className="space-y-1 mb-4">
                        {path.features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center text-slate-400 font-medium">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm">Get notified when available</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SAMWI Learn Section */}
      <section ref={whyRef} className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={whyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Why SAMWI Learn?</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={whyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                >
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed px-2 sm:px-0">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section ref={missionRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                We believe in learning by doing
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                SAMWI is built for tech learners who want to build, not just watch.
                We're creating a platform where you can master real technologies through
                hands-on projects, practical scenarios, and community collaboration.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl overflow-hidden">
                {/* Animated Code Lines */}
                <div className="absolute inset-4 space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0, opacity: 0 }}
                      animate={missionInView ? {
                        width: `${Math.random() * 60 + 40}%`,
                        opacity: 1
                      } : {}}
                      transition={{
                        duration: 0.8,
                        delay: 0.5 + i * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 2
                      }}
                      className={`h-3 rounded-full ${
                        i % 3 === 0 ? 'bg-blue-400' :
                        i % 3 === 1 ? 'bg-indigo-400' : 'bg-purple-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Floating Icons */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-6 right-6 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <Cloud className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 8, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute bottom-6 left-6 w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
                >
                  <Container className="w-5 h-5 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, -6, 0],
                    x: [0, 3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-xl"
                >
                  <Settings className="w-7 h-7 text-white animate-spin" style={{ animationDuration: '4s' }} />
                </motion.div>

                {/* Pulsing Background Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl"
                />

                {/* Bottom Label */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={missionInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.5 }}
                    className="text-slate-600 font-medium text-sm bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    Interactive Learning
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
              Trusted by developers worldwide
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  quote: "Finally, a platform that teaches by doing. The Kubernetes labs are incredible!",
                  author: "DevOps Engineer",
                  role: "Early Adopter",
                  avatar: "DE"
                },
                {
                  quote: "SAMWI Learn helped me advance my cloud skills. The hands-on approach really works.",
                  author: "Cloud Architect",
                  role: "Platform User",
                  avatar: "CA"
                },
                {
                  quote: "Best tech learning platform I've used. Interactive, practical, and completely free.",
                  author: "Software Developer",
                  role: "Community Member",
                  avatar: "SD"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 mb-3 sm:mb-4 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs sm:text-sm">{testimonial.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.author}</p>
                      <p className="text-xs sm:text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Early Access CTA Section */}
      <section ref={ctaRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full translate-x-16 translate-y-16" />

            <div className="relative">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-4 py-2 mb-6"
              >
                <Rocket className="w-4 h-4" />
                <span className="text-sm font-medium">Shape the Future</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2 sm:px-0">
                Ready to Level Up Your{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Tech Skills?
                </span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                Register for upcoming courses and help us build what you want to learn! Share your feedback,
                request new topics, and get early access to course launches and beta features.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  { icon: Zap, text: 'Early Access' },
                  { icon: Users, text: 'Community' },
                  { icon: Award, text: 'Free Forever' }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-center space-x-2 bg-slate-50 rounded-lg sm:rounded-xl py-2 sm:py-3 px-3 sm:px-4"
                  >
                    <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto px-2 sm:px-0">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Register Now</span>
                  </motion.button>
                </div>
              </form>

              <p className="text-sm text-slate-500 mt-6 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>No spam, unsubscribe anytime. We respect your privacy.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
