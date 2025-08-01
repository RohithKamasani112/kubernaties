import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, Clock, Trophy, Lightbulb, Target, Code, Eye, EyeOff } from 'lucide-react';
import { LearningChallenge } from '../data/learningPaths';
import Editor from '@monaco-editor/react';

interface ChallengeViewProps {
  challenge: LearningChallenge;
  onBack: () => void;
  onMarkComplete: (challengeId: string) => void;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  onBack,
  onMarkComplete
}) => {
  const [code, setCode] = useState(challenge.code?.initial || '');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChallengeTypeIcon = (type: string) => {
    switch (type) {
      case 'playground': return <Code className="w-5 h-5" />;
      case 'challenge': return <Trophy className="w-5 h-5" />;
      case 'mini-project': return <Target className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'playground': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'challenge': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mini-project': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    // Simulate code execution
    setTimeout(() => {
      setOutput('Code executed successfully!');
      
      // Simulate test results
      const mockResults = challenge.testCriteria.map((criteria, index) => ({
        passed: Math.random() > 0.3, // 70% chance of passing
        message: criteria
      }));
      
      setTestResults(mockResults);
      setIsRunning(false);
    }, 1500);
  };

  const handleShowNextHint = () => {
    if (currentHint < challenge.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const handleResetCode = () => {
    setCode(challenge.code?.initial || '');
    setOutput('');
    setTestResults([]);
  };

  const handleShowSolution = () => {
    setCode(challenge.code?.solution || '');
    setShowSolution(true);
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </motion.button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getChallengeTypeColor(challenge.type)}`}>
              {getChallengeTypeIcon(challenge.type)}
              <span className="ml-2">{challenge.type}</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {challenge.estimatedTime}
            </span>
            <span className="text-sm text-purple-600 flex items-center font-medium">
              <Trophy className="w-4 h-4 mr-1" />
              {challenge.xpReward} XP
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{challenge.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions & Hints */}
        <div className="lg:col-span-1 space-y-6">
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 text-blue-600 mr-3" />
              Instructions
            </h2>
            <ol className="space-y-3">
              {challenge.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Hints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow-50 rounded-xl border border-yellow-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Lightbulb className="w-6 h-6 text-yellow-600 mr-3" />
                Hints
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHints(!showHints)}
                className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
              >
                {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            </div>
            
            {showHints && (
              <div className="space-y-3">
                {challenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white rounded-lg border border-yellow-200"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm">{hint}</span>
                    </div>
                  </motion.div>
                ))}
                
                {currentHint < challenge.hints.length - 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShowNextHint}
                    className="w-full py-2 bg-yellow-200 text-yellow-800 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
                  >
                    Show Next Hint ({currentHint + 2}/{challenge.hints.length})
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>

          {/* Test Criteria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              Test Criteria
            </h2>
            <ul className="space-y-2">
              {challenge.testCriteria.map((criteria, index) => {
                const testResult = testResults[index];
                return (
                  <li key={index} className="flex items-start space-x-2">
                    <div className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ${
                      testResult 
                        ? testResult.passed 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                        : 'bg-gray-300'
                    }`} />
                    <span className={`text-sm ${
                      testResult 
                        ? testResult.passed 
                          ? 'text-green-700' 
                          : 'text-red-700'
                        : 'text-gray-700'
                    }`}>
                      {criteria}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Code Editor & Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Code className="w-6 h-6 text-purple-600 mr-3" />
                Code Editor
              </h2>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetCode}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  Reset
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowSolution}
                  className="px-3 py-1 bg-orange-200 text-orange-700 rounded-lg text-sm hover:bg-orange-300 transition-colors"
                >
                  Show Solution
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </motion.button>
              </div>
            </div>
            
            <div className="h-96">
              <Editor
                height="100%"
                defaultLanguage={challenge.code?.language || 'javascript'}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  tabSize: 2,
                }}
              />
            </div>
          </motion.div>

          {/* Output & Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Output & Results</h2>
            
            {output && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">Console Output:</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{output}</pre>
              </div>
            )}
            
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Test Results:</h3>
                {testResults.map((result, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-red-500" />
                      )}
                      <span className="text-sm">{result.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {allTestsPassed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkComplete(challenge.id)}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Complete Challenge (+{challenge.xpReward} XP)</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChallengeView;
