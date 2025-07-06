import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, Trophy, Star } from 'lucide-react';
import { LessonQuiz as LessonQuizType } from '../../data/lessons';

interface LessonQuizProps {
  quiz: LessonQuizType[];
  onComplete: (score: number) => void;
}

const LessonQuiz: React.FC<LessonQuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);

    // Calculate score
    const isCorrect = answerIndex === quiz[currentQuestion].correct;
    if (isCorrect && selectedAnswers[currentQuestion] === undefined) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      onComplete(score);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setQuizCompleted(false);
    setScore(0);
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage >= 90) return { message: "Excellent! You've mastered this topic!", icon: Trophy, color: "text-yellow-500" };
    if (percentage >= 70) return { message: "Great job! You have a solid understanding!", icon: Star, color: "text-blue-500" };
    if (percentage >= 50) return { message: "Good effort! Review the material and try again.", icon: CheckCircle, color: "text-green-500" };
    return { message: "Keep learning! Practice makes perfect.", icon: Lightbulb, color: "text-orange-500" };
  };

  if (quizCompleted) {
    const scoreInfo = getScoreMessage();
    const ScoreIcon = scoreInfo.icon;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 text-center border border-green-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6 ${scoreInfo.color}`}
        >
          <ScoreIcon className="w-10 h-10" />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">Quiz Complete!</h3>
        <p className="text-lg text-gray-600 mb-6">{scoreInfo.message}</p>
        
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {score} / {quiz.length}
          </div>
          <div className="text-gray-600">
            {Math.round((score / quiz.length) * 100)}% Correct
          </div>
        </div>

        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  const currentQ = quiz[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correct;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Knowledge Check</h3>
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h4>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQ.correct;
              
              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
              
              if (!showExplanation) {
                buttonClass += isSelected 
                  ? "border-blue-500 bg-blue-50 text-blue-800" 
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
              } else {
                if (isCorrectAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (isSelected && !isCorrectAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  whileHover={!showExplanation ? { scale: 1.02 } : {}}
                  whileTap={!showExplanation ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showExplanation && (
                      <div className="flex items-center space-x-2">
                        {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-l-4 mb-6 ${
                isCorrect 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-blue-50 border-blue-500 text-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">
                    {isCorrect ? 'Correct!' : 'Not quite right.'}
                  </p>
                  <p className="text-sm leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {showExplanation && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Complete Quiz'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LessonQuiz;
