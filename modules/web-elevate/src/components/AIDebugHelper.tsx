import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  MessageCircle,
  Lightbulb,
  Search,
  Code,
  AlertTriangle,
  CheckCircle,
  X,
  Send,
  Sparkles,
  Brain,
  Target,
  Zap
} from 'lucide-react';

interface AIDebugHelperProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentCode: { [key: string]: string };
  testResults: any[];
  onHintUsed: () => void;
}

interface AIMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  category?: 'hint' | 'analysis' | 'suggestion' | 'encouragement';
}

const AIDebugHelper: React.FC<AIDebugHelperProps> = ({
  isOpen,
  onClose,
  projectId,
  currentCode,
  testResults,
  onHintUsed
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'general' | 'specific' | 'error'>('general');

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          type: 'ai',
          content: `🤖 Hi there! I'm your AI debugging assistant. I'm here to help you find and fix bugs without giving away the solution directly. 

What would you like help with?
• 🔍 **Analyze my code** - I'll scan for potential issues
• 💡 **Give me a hint** - Get a nudge in the right direction  
• ❓ **Explain the error** - Help understand what's going wrong
• 🎯 **Check my approach** - Validate your debugging strategy

Just ask me anything!`,
          timestamp: new Date(),
          category: 'encouragement'
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const analyzeCode = (mode: 'general' | 'specific' | 'error') => {
    setIsAnalyzing(true);
    setAnalysisMode(mode);
    
    // Simulate AI analysis
    setTimeout(() => {
      let analysisResult = '';
      
      if (projectId === 'todo-localstorage') {
        switch (mode) {
          case 'general':
            analysisResult = `🔍 **Code Analysis Complete**

I've scanned your code and noticed a few things:

1. **Data Persistence**: Your app creates and displays tasks perfectly, but there's something missing in the data flow...

2. **Browser Storage**: I see you have TODO comments mentioning localStorage - that's a great clue! 

3. **Function Structure**: Your functions are well-organized. The issue isn't with the logic, but with **where** the data goes after processing.

**Question to consider**: What happens to your tasks when the page refreshes? 🤔`;
            break;
          case 'specific':
            analysisResult = `🎯 **Specific Issue Analysis**

Looking at your \`addTask()\` and \`deleteTask()\` functions:

**What's working**: 
- ✅ Tasks are added to the array
- ✅ DOM is updated correctly
- ✅ User input is validated

**What's missing**:
- ❌ No permanent storage mechanism
- ❌ No data retrieval on page load

**Key insight**: You're modifying the \`tasks\` array, but the browser "forgets" it when you refresh. Think about how to make the browser "remember" your data...`;
            break;
          case 'error':
            analysisResult = `⚠️ **Error Pattern Analysis**

The "bug" here isn't a JavaScript error - it's a **feature gap**!

**The Problem**: Data only exists in memory (RAM), not in permanent storage.

**The Solution Pattern**: 
1. **Save** data when it changes
2. **Load** data when the app starts
3. **Use** browser's built-in storage APIs

**Hint**: Look for the TODO comments in your code - they're breadcrumbs leading to the solution! 🍞`;
            break;
        }
      } else if (projectId === 'login-validation') {
        switch (mode) {
          case 'general':
            analysisResult = `🔍 **Form Validation Analysis**

Your form looks good visually, but I notice:

1. **Form Submission**: The form tries to submit even with empty fields
2. **Error Display**: You have error message elements, but they're not being used
3. **Validation Logic**: The validation functions exist but aren't implemented

**Key Question**: What should happen BEFORE the form actually submits? 🛑`;
            break;
          case 'specific':
            analysisResult = `🎯 **Form Behavior Analysis**

In your form submit handler:

**Missing**: 
- ❌ \`e.preventDefault()\` to stop submission
- ❌ Validation checks before proceeding
- ❌ Error message display logic

**The flow should be**: 
1. User clicks submit
2. **Stop** the default submission
3. **Check** if fields are valid
4. **Show errors** OR **proceed** with submission`;
            break;
          case 'error':
            analysisResult = `⚠️ **Form Submission Issue**

**The Problem**: Forms have default behavior - they submit automatically!

**The Fix**: You need to "intercept" the submission and add your own checks first.

**JavaScript Tip**: Look for an event method that "prevents" the default action... 🚫`;
            break;
        }
      } else {
        analysisResult = `🔍 **General Code Analysis**

I'm analyzing your code structure and logic flow. Here's what I found:

1. **Code Organization**: Your code structure looks good
2. **Potential Issues**: I can see some areas that might need attention
3. **Missing Pieces**: There appear to be some incomplete implementations

Would you like me to focus on a specific area or provide more targeted hints?`;
      }

      const newMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: analysisResult,
        timestamp: new Date(),
        category: 'analysis'
      };

      setMessages(prev => [...prev, newMessage]);
      setIsAnalyzing(false);
      onHintUsed();
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response based on user input
    setTimeout(() => {
      let aiResponse = '';
      const input = userInput.toLowerCase();

      if (input.includes('hint') || input.includes('help')) {
        aiResponse = `💡 **Here's a gentle nudge:**

Instead of giving you the exact code, let me guide your thinking:

1. **What's the goal?** Make data survive page refreshes
2. **What tool can help?** Browser storage APIs
3. **When to use it?** When data changes AND when app loads

**Try this**: Look up "localStorage" in JavaScript documentation. You'll need two main methods - one to save, one to retrieve! 🔑`;
      } else if (input.includes('error') || input.includes('wrong')) {
        aiResponse = `🔍 **Let's debug this together:**

Errors can be tricky! Here's how to approach them:

1. **Read the error message carefully** - what is it telling you?
2. **Check the console** - are there any JavaScript errors?
3. **Test step by step** - does each part work individually?

What specific error are you seeing? I can help you understand it! 🕵️‍♀️`;
      } else if (input.includes('localstorage') || input.includes('storage')) {
        aiResponse = `🎯 **Great question about localStorage!**

You're on the right track! localStorage is perfect for this. Here's the pattern:

**Saving data:**
\`localStorage.setItem('key', 'value')\`

**Loading data:**
\`localStorage.getItem('key')\`

**Important**: localStorage only stores strings, so you'll need to convert objects. Look up JSON.stringify() and JSON.parse()! 📦`;
      } else {
        aiResponse = `🤖 **I'm here to help!**

I understand you're working on this debugging challenge. Here are some ways I can assist:

• Ask me to **analyze your code**
• Request a **specific hint** about the bug
• Get help **understanding error messages**
• Discuss your **debugging approach**

What would be most helpful right now? 🚀`;
      }

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        category: 'hint'
      };

      setMessages(prev => [...prev, aiMessage]);
      onHintUsed();
    }, 1000);

    setUserInput('');
  };

  const quickActions = [
    {
      icon: Search,
      label: 'Analyze Code',
      action: () => analyzeCode('general'),
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    },
    {
      icon: Lightbulb,
      label: 'Get Hint',
      action: () => analyzeCode('specific'),
      color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    },
    {
      icon: AlertTriangle,
      label: 'Explain Error',
      action: () => analyzeCode('error'),
      color: 'bg-red-100 text-red-700 hover:bg-red-200'
    }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Debug Assistant</h3>
                <p className="text-purple-100 text-sm">Your intelligent debugging companion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={isAnalyzing}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${action.color} disabled:opacity-50`}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                        {message.category || 'AI Assistant'}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span className="text-sm">Analyzing your code...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about debugging..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isAnalyzing}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIDebugHelper;
