import React from 'react';
import { useNavigate } from 'react-router-dom';
import DebugPlatformDashboard from '../components/DebugPlatformDashboard';

const DebugProjects: React.FC = () => {
  const navigate = useNavigate();

  const handleChallengeSelect = (challengeId: string) => {
    navigate(`/web-elevate/debug-challenge/${challengeId}`);
  };

  return (
    <DebugPlatformDashboard onChallengeSelect={handleChallengeSelect} />
  );
};

export default DebugProjects;
