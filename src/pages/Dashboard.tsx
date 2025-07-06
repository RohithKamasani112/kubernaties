import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, 
  BookOpen, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Lessons Completed', value: '3', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Challenges Solved', value: '1', icon: Target, color: 'text-orange-600 bg-orange-50' },
    { label: 'Time Spent', value: '2.5h', icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Current Level', value: 'Beginner', icon: Star, color: 'text-purple-600 bg-purple-50' },
  ];

  const recentActivity = [
    { type: 'lesson', title: 'What is a Pod?', completed: true, time: '2 hours ago' },
    { type: 'lesson', title: 'Deploying with Deployment', completed: true, time: '1 day ago' },
    { type: 'challenge', title: 'Broken Service Challenge', completed: true, time: '2 days ago' },
    { type: 'lesson', title: 'Services and Networking', completed: false, time: 'In progress' },
  ];

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current lesson',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      href: '/lessons'
    },
    {
      title: 'Try Playground',
      description: 'Experiment with Kubernetes',
      icon: PlayCircle,
      color: 'from-emerald-500 to-emerald-600',
      href: '/playground'
    },
    {
      title: 'Take Challenge',
      description: 'Test your debugging skills',
      icon: Target,
      color: 'from-orange-500 to-orange-600',
      href: '/challenges'
    }
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600">
            Ready to master Kubernetes? Let's continue your learning journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={action.href}
                      className="block p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        Get started
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'lesson' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {activity.type === 'lesson' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {activity.completed ? (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div className="w-3 h-3 border-2 border-slate-300 rounded-full" />
                        )}
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;