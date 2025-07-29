import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { debugChallenges } from '../data/debugChallenges';
import { reactDebugChallenges } from '../data/reactDebugChallenges';
import { angularDebugChallenges } from '../data/angularDebugChallenges';
import { nodeDebugChallenges } from '../data/nodeDebugChallenges';
import DebugChallengeInterface from './DebugChallengeInterface';

interface DebugChallengeViewerProps {
  challengeId?: string;
  challenge?: any; // Accept challenge object directly
  onBack: () => void;
  onComplete?: (challengeId: string, xpEarned: number) => void;
}

const DebugChallengeViewer: React.FC<DebugChallengeViewerProps> = ({
  challengeId,
  challenge: providedChallenge,
  onBack,
  onComplete
}) => {
  // Combine all challenges
  const allChallenges = [
    ...reactDebugChallenges,
    ...angularDebugChallenges,
    ...nodeDebugChallenges,
    ...debugChallenges
  ];

  // Find the challenge by ID, use provided challenge, or use the first one as default
  const challenge = providedChallenge ||
    (challengeId ? allChallenges.find(c => c.id === challengeId) : null) ||
    allChallenges[0];

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge Not Found</h2>
          <p className="text-gray-600 mb-6">The requested debug challenge could not be found.</p>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Challenges</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <DebugChallengeInterface
      challenge={challenge}
      onBack={onBack}
      onComplete={onComplete}
    />
  );
};

export default DebugChallengeViewer;
