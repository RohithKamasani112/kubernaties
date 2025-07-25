import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Heart,
  Linkedin,
  Mail,
  Github
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Practical Learning',
      description: 'We believe in learning by doing. Every concept is taught through hands-on practice and real-world scenarios.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Learning is better together. We foster a supportive community where everyone can grow and succeed.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from content creation to user experience.'
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Technology education should be accessible to everyone, regardless of background or experience level.'
    }
  ];

  const team = [
    {
      name: 'Platform Team',
      role: 'Development Team',
      bio: 'Experienced cloud architects and platform engineers dedicated to creating exceptional learning experiences.',
      image: '/api/placeholder/150/150',
      social: {
        linkedin: '#'
      }
    },
    {
      name: 'Content Team',
      role: 'Learning Specialists',
      bio: 'Kubernetes experts and educators focused on creating comprehensive, hands-on learning content.',
      image: '/api/placeholder/150/150',
      social: {
        linkedin: '#'
      }
    },
    {
      name: 'Community Team',
      role: 'Community Builders',
      bio: 'Passionate about fostering a supportive learning community and gathering user feedback.',
      image: '/api/placeholder/150/150',
      social: {
        linkedin: '#'
      }
    }
  ];

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SAMWI Learn</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed">
                We're on a mission to make technology education accessible, interactive, and practical for everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Technology is evolving rapidly, and traditional learning methods often fall short of preparing 
                  professionals for real-world challenges. We believe that the best way to learn complex technologies 
                  like Kubernetes and cloud architecture is through hands-on, interactive experiences.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  SAMWI Learn was created to bridge the gap between theoretical knowledge and practical skills, 
                  providing learners with the tools and environment they need to master modern technologies 
                  through experimentation and practice.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                      <div className="text-slate-600">Active Learners</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                      <div className="text-slate-600">Interactive Labs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                      <div className="text-slate-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                      <div className="text-slate-600">Expert Instructors</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                The principles that guide everything we do at SAMWI Learn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Passionate educators and technologists dedicated to your learning success
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-700">{member.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex justify-center space-x-3">
                      <a href={member.social.linkedin} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Have questions or feedback? We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@samwilearn.com"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact Us</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
