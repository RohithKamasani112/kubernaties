// Debug Platform Page - Main debugging interface
// Comprehensive debugging challenges for React, Angular, and Node.js

import React, { useState, useEffect } from 'react';
import { useWebElevateStore } from '../store/webElevateStore';
import DebugPlatformDashboard from '../components/DebugPlatformDashboard';
import DebugChallengeViewer from '../components/DebugChallengeViewer';

const DebugPlatformPage: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const {
    debugPlatform,
    initializeDebugPlatform,
    selectDebugChallenge,
    completeDebugChallenge
  } = useWebElevateStore();

  // Initialize debug platform on mount
  useEffect(() => {
    if (debugPlatform.challenges.length === 0) {
      initializeDebugPlatform();
    }
  }, [debugPlatform.challenges.length, initializeDebugPlatform]);

  const handleChallengeSelect = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    // selectDebugChallenge can be called with the ID if needed
  };

  const handleChallengeComplete = (challengeId: string, xpEarned: number) => {
    completeDebugChallenge(challengeId, xpEarned);
    
    // Show completion notification
    alert(`🎉 Challenge completed! You earned ${xpEarned} XP!`);
    
    // Return to platform view
    setSelectedChallenge(null);
  };

  const handleBackToPlatform = () => {
    setSelectedChallenge(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {selectedChallenge ? (
        <DebugChallengeViewer
          challengeId={selectedChallenge}
          onBack={handleBackToPlatform}
          onComplete={handleChallengeComplete}
        />
      ) : (
        <DebugPlatformDashboard onChallengeSelect={handleChallengeSelect} />
      )}
    </div>
  );
};

export default DebugPlatformPage;
