import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageCircle,
  Share2,
  Eye,
  Code,
  Star,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Screen,
  Send,
  ThumbsUp,
  MessageSquare,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

const Collaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'sessions' | 'community'>('reviews');
  const [searchQuery, setSearchQuery] = useState('');

  const mockCodeReviews = [
    {
      id: '1',
      title: 'React Todo App - Component Structure Review',
      author: 'Sarah Chen',
      authorAvatar: 'SC',
      language: 'JavaScript',
      status: 'pending',
      createdAt: '2 hours ago',
      comments: 3,
      likes: 5,
      description: 'Looking for feedback on my component structure and state management approach.',
      tags: ['React', 'State Management', 'Components']
    },
    {
      id: '2',
      title: 'Node.js API - Error Handling Best Practices',
      author: 'Mike Johnson',
      authorAvatar: 'MJ',
      language: 'JavaScript',
      status: 'reviewed',
      createdAt: '1 day ago',
      comments: 8,
      likes: 12,
      description: 'Implemented error handling middleware, would appreciate feedback on the approach.',
      tags: ['Node.js', 'Error Handling', 'API']
    },
    {
      id: '3',
      title: 'CSS Grid Layout - Responsive Design',
      author: 'Emma Wilson',
      authorAvatar: 'EW',
      language: 'CSS',
      status: 'pending',
      createdAt: '3 hours ago',
      comments: 1,
      likes: 3,
      description: 'Created a responsive grid layout, looking for suggestions on browser compatibility.',
      tags: ['CSS', 'Grid', 'Responsive']
    }
  ];

  const mockLiveSessions = [
    {
      id: '1',
      title: 'Building a Real-time Chat App',
      host: 'Alex Rodriguez',
      hostAvatar: 'AR',
      participants: 8,
      maxParticipants: 10,
      status: 'live',
      startTime: 'Now',
      duration: '45 min',
      description: 'Join me as we build a real-time chat application using Socket.io and React.',
      tags: ['React', 'Socket.io', 'Real-time']
    },
    {
      id: '2',
      title: 'Code Review Session: E-commerce API',
      host: 'Lisa Park',
      hostAvatar: 'LP',
      participants: 5,
      maxParticipants: 8,
      status: 'scheduled',
      startTime: 'In 30 min',
      duration: '60 min',
      description: 'Collaborative code review of an e-commerce API with authentication and payment integration.',
      tags: ['Node.js', 'API', 'Code Review']
    },
    {
      id: '3',
      title: 'Frontend Architecture Discussion',
      host: 'David Kim',
      hostAvatar: 'DK',
      participants: 12,
      maxParticipants: 15,
      status: 'scheduled',
      startTime: 'Tomorrow 2 PM',
      duration: '90 min',
      description: 'Discussing modern frontend architecture patterns and best practices.',
      tags: ['Architecture', 'Frontend', 'Best Practices']
    }
  ];

  const mockCommunityPosts = [
    {
      id: '1',
      type: 'question',
      title: 'How to handle async operations in React hooks?',
      author: 'John Doe',
      authorAvatar: 'JD',
      createdAt: '1 hour ago',
      replies: 5,
      likes: 8,
      tags: ['React', 'Hooks', 'Async'],
      excerpt: 'I\'m struggling with handling async operations inside useEffect. What are the best practices?'
    },
    {
      id: '2',
      type: 'showcase',
      title: 'Built my first full-stack application!',
      author: 'Maria Garcia',
      authorAvatar: 'MG',
      createdAt: '3 hours ago',
      replies: 12,
      likes: 24,
      tags: ['Full-Stack', 'Achievement', 'MERN'],
      excerpt: 'Just finished my first MERN stack application. Here\'s what I learned along the way...'
    },
    {
      id: '3',
      type: 'tip',
      title: 'Pro tip: Using CSS custom properties for theming',
      author: 'Chris Taylor',
      authorAvatar: 'CT',
      createdAt: '5 hours ago',
      replies: 7,
      likes: 15,
      tags: ['CSS', 'Theming', 'Tips'],
      excerpt: 'Here\'s a simple way to implement dark/light mode using CSS custom properties...'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-700 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'reviewed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return MessageCircle;
      case 'showcase': return Star;
      case 'tip': return CheckCircle;
      default: return MessageCircle;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Collaboration Hub</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with fellow developers, share code for review, join live coding sessions, 
          and participate in our vibrant learning community.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8"
      >
        <div className="flex">
          {[
            { id: 'reviews', label: 'Code Reviews', icon: Code, count: mockCodeReviews.length },
            { id: 'sessions', label: 'Live Sessions', icon: Video, count: mockLiveSessions.length },
            { id: 'community', label: 'Community', icon: Users, count: mockCommunityPosts.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'reviews' ? 'Request Review' : 
               activeTab === 'sessions' ? 'Start Session' : 
               'New Post'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {activeTab === 'reviews' && <CodeReviewsTab reviews={mockCodeReviews} />}
        {activeTab === 'sessions' && <LiveSessionsTab sessions={mockLiveSessions} />}
        {activeTab === 'community' && <CommunityTab posts={mockCommunityPosts} />}
      </motion.div>
    </div>
  );
};

// Code Reviews Tab Component
const CodeReviewsTab: React.FC<{ reviews: any[] }> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                {review.authorAvatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{review.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {review.author}</span>
                  <span>{review.createdAt}</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{review.language}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(review.status)}`}>
              {review.status}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{review.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {review.tags.map((tag: string) => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{review.comments} comments</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{review.likes} likes</span>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              Review Code
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Live Sessions Tab Component
const LiveSessionsTab: React.FC<{ sessions: any[] }> = ({ sessions }) => {
  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <div key={session.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                {session.hostAvatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>hosted by {session.host}</span>
                  <span>{session.startTime}</span>
                  <span>{session.duration}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
          </div>

          <p className="text-gray-600 mb-4">{session.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {session.tags.map((tag: string) => (
              <span key={tag} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{session.participants}/{session.maxParticipants} participants</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{session.duration}</span>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              session.status === 'live'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}>
              {session.status === 'live' ? 'Join Now' : 'Join Session'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Community Tab Component
const CommunityTab: React.FC<{ posts: any[] }> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const PostIcon = getPostTypeIcon(post.type);
        return (
          <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                {post.authorAvatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <PostIcon className="w-4 h-4 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <span>by {post.author}</span>
                  <span>{post.createdAt}</span>
                </div>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.replies} replies</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View Discussion
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Collaboration;
