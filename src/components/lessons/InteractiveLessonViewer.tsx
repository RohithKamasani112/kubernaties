import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Video,
  Code,
  HelpCircle
} from 'lucide-react';
import { Lesson } from '../../data/lessons';
import LessonAnimation from './LessonAnimation';
import LessonQuiz from './LessonQuiz';
import YamlViewer from './YamlViewer';

interface InteractiveLessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete: (lessonId: number) => void;
}

const InteractiveLessonViewer: React.FC<InteractiveLessonViewerProps> = ({
  lesson,
  onClose,
  onComplete
}) => {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleAnimationComplete = () => {
    setAnimationCompleted(true);
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    onComplete(lesson.id);
  };







  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-gray-200"
      >
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-3 relative overflow-hidden flex-shrink-0">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">{lesson.title}</h2>
                <div className="flex items-center space-x-2">
                  <span className="bg-white bg-opacity-25 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                    {lesson.difficulty}
                  </span>
                  <span className="bg-white bg-opacity-25 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium">
                    {lesson.duration}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* All Content Visible */}

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-4">

            {/* Introduction Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-4 border border-blue-200"
            >
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Introduction</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3 text-sm">{lesson.content.introduction}</p>

              <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Key Learning Points</h4>
                <div className="space-y-1.5">
                  {lesson.content.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Core Concept</h4>
                <p className="text-gray-700 leading-relaxed text-sm">{lesson.content.conceptExplanation}</p>
              </div>
            </motion.div>

            {/* Animation Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-lg p-4 border border-purple-200"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Video className="w-4 h-4 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">Interactive Animation</h3>
              </div>
              <LessonAnimation
                animation={lesson.content.animation}
                onComplete={handleAnimationComplete}
              />
            </motion.div>

            {/* YAML Example Section */}
            {lesson.content.yamlExample && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-lg p-4 border border-green-200"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-800">YAML Example</h3>
                </div>
                <YamlViewer
                  title={lesson.content.yamlExample.title}
                  code={lesson.content.yamlExample.code}
                  explanation={lesson.content.yamlExample.explanation}
                />
              </motion.div>
            )}

            {/* Quiz Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-lg p-4 border border-yellow-200"
            >
              <div className="flex items-center space-x-2 mb-3">
                <HelpCircle className="w-4 h-4 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-800">Test Your Knowledge</h3>
              </div>
              <LessonQuiz
                quiz={lesson.content.quiz}
                onComplete={handleQuizComplete}
              />
            </motion.div>

          </div>
        </div>

        {/* Simple Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-center flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Close Lesson
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveLessonViewer;

