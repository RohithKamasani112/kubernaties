import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Lock, 
  Unlock,
  AlertCircle,
  Clock,
  Target,
  BookOpen,
  Zap,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';
import { DebugChallenge } from '../data/debugPlatformComplete';

interface ProblemPanelProps {
  challenge: DebugChallenge;
  activeTab: 'problem' | 'criteria' | 'hints' | 'solution';
  onTabChange: (tab: 'problem' | 'criteria' | 'hints' | 'solution') => void;
  hintsRevealed: number;
  solutionUnlocked: boolean;
  onRevealHint: () => void;
  onUnlockSolution: () => void;
  testResults: any[];
}

const ProblemPanel: React.FC<ProblemPanelProps> = ({
  challenge,
  activeTab,
  onTabChange,
  hintsRevealed,
  solutionUnlocked,
  onRevealHint,
  onUnlockSolution,
  testResults
}) => {
  const tabs = [
    { id: 'problem', label: 'Problem', icon: FileText },
    { id: 'criteria', label: 'Criteria', icon: CheckCircle },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
    { id: 'solution', label: 'Solution', icon: solutionUnlocked ? Unlock : Lock }
  ] as const;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderProblemTab = () => (
    <div className="space-y-4">
      {/* Challenge Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
        <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
      </div>

      {/* Challenge Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Estimated Time</span>
          </div>
          <span className="text-blue-700">{challenge.estimatedTime}</span>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">XP Reward</span>
          </div>
          <span className="text-purple-700">{challenge.xpReward} XP</span>
        </div>
      </div>

      {/* Key Concept */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-4 h-4 text-orange-600" />
          <h4 className="font-medium text-orange-900">Key Concept</h4>
        </div>
        <p className="text-orange-800 text-sm">{challenge.rootCause}</p>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Technologies</h4>
        <div className="flex flex-wrap gap-2">
          {challenge.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      {challenge.debuggingSteps && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">What You'll Learn</h4>
          <ul className="space-y-1">
            {challenge.debuggingSteps.slice(0, 3).map((step, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <Target className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderCriteriaTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Success Criteria</h3>
        <span className="text-sm text-gray-500">
          {testResults.filter(r => r.passed).length}/{testResults.length || (challenge.testCases || challenge.testCriteria || []).length} passed
        </span>
      </div>

      <div className="space-y-3">
        {(challenge.testCases || challenge.testCriteria || []).map((criteria, index) => {
          const testResult = testResults[index];
          const status = testResult ? (testResult.passed ? 'passed' : 'failed') : 'pending';
          
          return (
            <motion.div
              key={index}
              className={`p-3 rounded-lg border ${
                status === 'passed' 
                  ? 'bg-green-50 border-green-200' 
                  : status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                {status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : status === 'failed' ? (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5" />
                )}
                
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    status === 'passed' 
                      ? 'text-green-900' 
                      : status === 'failed'
                      ? 'text-red-900'
                      : 'text-gray-900'
                  }`}>
                    {criteria}
                  </p>
                  
                  {testResult && testResult.message && (
                    <p className={`text-xs mt-1 ${
                      status === 'passed' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResult.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Common Mistakes */}
      {challenge.commonMistakes && challenge.commonMistakes.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <h4 className="font-medium text-yellow-900">Common Mistakes</h4>
          </div>
          <ul className="space-y-1">
            {challenge.commonMistakes.slice(0, 3).map((mistake, index) => (
              <li key={index} className="text-sm text-yellow-800">
                • {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderHintsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Hints</h3>
        <span className="text-sm text-gray-500">
          {hintsRevealed}/{challenge.hints.length} revealed
        </span>
      </div>

      {/* Hint Reveal Button */}
      {hintsRevealed < challenge.hints.length && (
        <button
          onClick={onRevealHint}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Show Hint {hintsRevealed + 1}</span>
        </button>
      )}

      {/* Revealed Hints */}
      <div className="space-y-3">
        {challenge.hints.slice(0, hintsRevealed).map((hint, index) => (
          <motion.div
            key={index}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-blue-900 text-sm leading-relaxed">{hint}</p>
              </div>
              
              <button
                onClick={() => copyToClipboard(hint)}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Copy hint"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All hints revealed */}
      {hintsRevealed === challenge.hints.length && (
        <div className="text-center py-4">
          <div className="text-green-600 mb-2">
            <CheckCircle className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-600">All hints revealed!</p>
          <p className="text-xs text-gray-500 mt-1">
            Try to solve it yourself, or unlock the solution below.
          </p>
        </div>
      )}
    </div>
  );

  const renderSolutionTab = () => (
    <div className="space-y-4">
      {!solutionUnlocked ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Solution Available</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Ready to see the solution? Click below to reveal the complete working code and explanation.
            </p>
            <motion.button
              onClick={onUnlockSolution}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Unlock className="w-5 h-5" />
              <span className="font-medium">View Solution</span>
            </motion.button>
            <p className="text-xs text-gray-500 mt-4">
              💡 Tip: Try solving it yourself first for better learning!
            </p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <motion.div
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Unlock className="w-5 h-5 text-green-600" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900">Solution Unlocked</h3>
            <div className="flex-1"></div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              ✓ Complete Solution
            </span>
          </div>

          {/* Solution Files */}
          <div className="space-y-3">
            {Object.entries(challenge.solution).map(([filename, code], index) => (
              <motion.div
                key={filename}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <File className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{filename}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                      title="Copy solution"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                      title="Apply to editor"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Apply</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code className="language-javascript">{code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explanation */}
          {challenge.preventionTips && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Prevention Tips</h4>
              <ul className="space-y-1">
                {challenge.preventionTips.map((tip, index) => (
                  <li key={index} className="text-sm text-green-800">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex space-x-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isLocked = tab.id === 'solution' && !solutionUnlocked;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : isLocked
                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'hints' && hintsRevealed > 0 && (
                  <span className="bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {hintsRevealed}
                  </span>
                )}
                {tab.id === 'solution' && !solutionUnlocked && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'problem' && renderProblemTab()}
            {activeTab === 'criteria' && renderCriteriaTab()}
            {activeTab === 'hints' && renderHintsTab()}
            {activeTab === 'solution' && renderSolutionTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProblemPanel;
