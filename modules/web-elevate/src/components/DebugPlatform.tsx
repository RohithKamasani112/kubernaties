// Complete Debugging Platform Component
// Comprehensive debugging challenges for React, Angular, and Node.js

import React, { useState, useEffect } from 'react';
import { debugPlatformStats, allDebugCategories } from '../data/debugPlatformComplete';
import { reactDebugChallenges } from '../data/reactDebugChallenges';
import { angularDebugChallenges } from '../data/angularDebugChallenges';
import { nodeDebugChallenges } from '../data/nodeDebugChallenges';

interface DebugPlatformProps {
  onChallengeSelect?: (challenge: any) => void;
}

const DebugPlatform: React.FC<DebugPlatformProps> = ({ onChallengeSelect }) => {
  const [selectedTech, setSelectedTech] = useState<'React' | 'Angular' | 'Node.js' | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>([]);

  // Combine all challenges
  const allChallenges = [
    ...reactDebugChallenges,
    ...angularDebugChallenges,
    ...nodeDebugChallenges
  ];

  // Filter challenges based on selected criteria
  useEffect(() => {
    let filtered = allChallenges;

    // Filter by technology
    if (selectedTech !== 'All') {
      filtered = filtered.filter(challenge => challenge.techStack === selectedTech);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
        challenge.rootCause.toLowerCase().includes(query)
      );
    }

    setFilteredChallenges(filtered);
  }, [selectedTech, selectedDifficulty, selectedCategory, searchQuery]);

  // Get unique categories for the selected technology
  const getAvailableCategories = () => {
    let challenges = allChallenges;
    if (selectedTech !== 'All') {
      challenges = challenges.filter(challenge => challenge.techStack === selectedTech);
    }
    const categories = [...new Set(challenges.map(challenge => challenge.category))];
    return categories.sort();
  };

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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>
          🐛 Ultimate Debugging Platform
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Master debugging skills across React, Angular, and Node.js
        </p>
        
        {/* Platform Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
              {debugPlatformStats.totalChallenges}+
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Challenges</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {debugPlatformStats.technologies}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Technologies</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
              {debugPlatformStats.totalXP.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total XP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
              {Math.round(parseInt(debugPlatformStats.totalTime) / 60)}h
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Learning Time</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Technology Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Technology Stack
          </label>
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="All">All Technologies</option>
            <option value="React">React</option>
            <option value="Angular">Angular</option>
            <option value="Node.js">Node.js</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Difficulty Level
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="all">All Categories</option>
            {getAvailableCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Search Challenges
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or tags..."
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        borderLeft: '4px solid #2196f3'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          Found {filteredChallenges.length} debugging challenges
        </h3>
        <p style={{ margin: 0, color: '#666' }}>
          Total XP available: {filteredChallenges.reduce((sum, challenge) => sum + challenge.xpReward, 0)}
        </p>
      </div>

      {/* Challenge Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => onChallengeSelect?.(challenge)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            {/* Challenge Header */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span
                  style={{
                    backgroundColor: getTechColor(challenge.techStack),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
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
              
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '18px',
                color: '#333',
                lineHeight: '1.3'
              }}>
                {challenge.title}
              </h3>
              
              <p style={{ 
                margin: '0 0 10px 0', 
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {challenge.description}
              </p>
            </div>

            {/* Challenge Details */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
                <strong>Root Cause:</strong> {challenge.rootCause}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>
                <strong>Category:</strong> {challenge.category}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {challenge.tags.slice(0, 4).map((tag: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f0f0f0',
                      color: '#666',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {challenge.tags.length > 4 && (
                  <span style={{ fontSize: '11px', color: '#999' }}>
                    +{challenge.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Challenge Footer */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '15px',
              borderTop: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ⏱️ {challenge.estimatedTime}
              </div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#007bff'
              }}>
                {challenge.xpReward} XP
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredChallenges.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#666' }}>No challenges found</h3>
          <p style={{ color: '#999' }}>
            Try adjusting your filters or search query to find debugging challenges.
          </p>
        </div>
      )}
    </div>
  );
};

export default DebugPlatform;
