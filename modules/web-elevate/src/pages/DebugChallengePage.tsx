import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DebugChallengeViewer from '../components/DebugChallengeViewer';
import { useWebElevateStore } from '../store/webElevateStore';

const DebugChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { completeDebugProject, awardPoints } = useWebElevateStore();

  const handleBack = () => {
    navigate('/web-elevate/debug-projects');
  };

  const handleComplete = (challengeId: string, xpEarned: number) => {
    completeDebugProject(challengeId);
    awardPoints(xpEarned);
  };

  return (
    <DebugChallengeViewer
      challengeId={challengeId}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
};

export default DebugChallengePage;
