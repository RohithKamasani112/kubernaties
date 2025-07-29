// Debug Challenge Viewer Component
// Interactive debugging challenge interface with code editor and solution

import React, { useState } from 'react';
import { DebugChallenge } from '../data/debugPlatformComplete';

interface DebugChallengeViewerProps {
  challenge: DebugChallenge;
  onBack: () => void;
  onComplete?: (challengeId: string, xpEarned: number) => void;
}

const DebugChallengeViewer: React.FC<DebugChallengeViewerProps> = ({
  challenge,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'problem' | 'debugging' | 'solution'>('problem');
  const [selectedFile, setSelectedFile] = useState<string>(Object.keys(challenge.files)[0]);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState<Record<string, string>>(challenge.files);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#28a745';
      case 'intermediate': return '#ffc107';
      case 'advanced': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Get tech stack color
  const getTechColor = (tech: string) => {
    switch (tech) {
      case 'React': return '#61dafb';
      case 'Angular': return '#dd0031';
      case 'Node.js': return '#339933';
      default: return '#6c757d';
    }
  };

  // Handle hint usage
  const useHint = () => {
    if (hintsUsed < challenge.hints.length) {
      setHintsUsed(hintsUsed + 1);
      setShowHints(true);
    }
  };

  // Handle challenge completion
  const handleComplete = () => {
    const xpEarned = Math.max(challenge.xpReward - (hintsUsed * 10), challenge.xpReward * 0.5);
    onComplete?.(challenge.id, Math.round(xpEarned));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <button
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '15px'
            }}
          >
            ← Back to Challenges
          </button>
          
          <span
            style={{
              backgroundColor: getTechColor(challenge.techStack),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            {challenge.techStack}
          </span>
          
          <span
            style={{
              backgroundColor: getDifficultyColor(challenge.difficulty),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {challenge.difficulty}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            ⏱️ {challenge.estimatedTime}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff' }}>
            {challenge.xpReward - (hintsUsed * 10)} XP
          </div>
        </div>
      </div>

      {/* Challenge Title and Description */}
      <div style={{ 
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
          🐛 {challenge.title}
        </h1>
        <p style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#666' }}>
          {challenge.description}
        </p>
        
        <div style={{ 
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '6px',
          borderLeft: '4px solid #ffc107'
        }}>
          <strong>Root Cause:</strong> {challenge.rootCause}
        </div>
      </div>

      {/* Step Navigation */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {[
          { key: 'problem', label: '1. Analyze Problem', icon: '🔍' },
          { key: 'debugging', label: '2. Debug & Fix', icon: '🛠️' },
          { key: 'solution', label: '3. View Solution', icon: '✅' }
        ].map((step) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key as any)}
            style={{
              flex: 1,
              padding: '12px',
              margin: '0 5px',
              backgroundColor: currentStep === step.key ? '#007bff' : '#f8f9fa',
              color: currentStep === step.key ? 'white' : '#666',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: currentStep === step.key ? 'bold' : 'normal'
            }}
          >
            {step.icon} {step.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left Panel - Code/Problem */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>
              {currentStep === 'problem' ? '📁 Problem Files' : 
               currentStep === 'debugging' ? '🛠️ Debug the Code' : 
               '✅ Solution Files'}
            </h3>
            
            {Object.keys(challenge.files).length > 1 && (
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                {Object.keys(challenge.files).map(filename => (
                  <option key={filename} value={filename}>{filename}</option>
                ))}
              </select>
            )}
          </div>

          {/* Code Editor */}
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '6px',
            padding: '15px',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.5',
            overflow: 'auto',
            maxHeight: '500px'
          }}>
            {currentStep === 'solution' ? (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {challenge.solution[selectedFile] || 'No solution available for this file'}
              </pre>
            ) : (
              <textarea
                value={userCode[selectedFile] || ''}
                onChange={(e) => setUserCode({
                  ...userCode,
                  [selectedFile]: e.target.value
                })}
                style={{
                  width: '100%',
                  height: '400px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                  resize: 'none',
                  outline: 'none'
                }}
                readOnly={currentStep === 'problem'}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Information */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {currentStep === 'problem' && (
            <div>
              <h3 style={{ margin: '0 0 15px 0' }}>🎯 Challenge Details</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Production Impact</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {challenge.productionImpact}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Tags</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {challenge.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Test Cases</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {challenge.testCases.map((testCase, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                      {testCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentStep === 'debugging' && (
            <div>
              <h3 style={{ margin: '0 0 15px 0' }}>🛠️ Debugging Tools</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={useHint}
                  disabled={hintsUsed >= challenge.hints.length}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: hintsUsed >= challenge.hints.length ? '#6c757d' : '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: hintsUsed >= challenge.hints.length ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}
                >
                  💡 Get Hint ({hintsUsed}/{challenge.hints.length})
                </button>
                
                {showHints && (
                  <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '6px',
                    padding: '15px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>Hints Used:</h4>
                    {challenge.hints.slice(0, hintsUsed).map((hint, index) => (
                      <div key={index} style={{ 
                        fontSize: '14px', 
                        color: '#856404',
                        marginBottom: '8px',
                        paddingLeft: '15px',
                        borderLeft: '3px solid #ffc107'
                      }}>
                        {index + 1}. {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Common Mistakes</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {challenge.commonMistakes.map((mistake, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Debugging Steps</h4>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  {challenge.debuggingSteps.map((step, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {currentStep === 'solution' && (
            <div>
              <h3 style={{ margin: '0 0 15px 0' }}>✅ Solution Explanation</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Prevention Tips</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {challenge.preventionTips.map((tip, index) => (
                    <li key={index} style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={handleComplete}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  🎉 Complete Challenge (+{Math.round(challenge.xpReward - (hintsUsed * 10))} XP)
                </button>
              </div>

              <div style={{
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '6px',
                padding: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>Key Learnings</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#155724' }}>
                  You've successfully debugged a {challenge.difficulty} level {challenge.techStack} issue! 
                  This challenge focused on {challenge.category.toLowerCase()} and taught you how to 
                  identify and fix {challenge.rootCause.toLowerCase()}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugChallengeViewer;
