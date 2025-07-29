import React, { useState } from 'react';
import BlueprintDashboard from '../components/BlueprintDashboard';
import ProjectBuilder from '../components/ProjectBuilder';

const BlueprintPage: React.FC = () => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);

  const handleBlueprintSelect = (blueprintId: string) => {
    setSelectedBlueprint(blueprintId);
  };

  const handleBackToDashboard = () => {
    setSelectedBlueprint(null);
  };

  return (
    <div className="h-screen">
      {selectedBlueprint ? (
        <ProjectBuilder
          blueprintId={selectedBlueprint}
          onBack={handleBackToDashboard}
        />
      ) : (
        <BlueprintDashboard onBlueprintSelect={handleBlueprintSelect} />
      )}
    </div>
  );
};

export default BlueprintPage;
