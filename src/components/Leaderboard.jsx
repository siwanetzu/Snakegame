import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

const Leaderboard = ({ onReturn }) => {
  const [scores, setScores] = useState([]);
  const [selectedMode, setSelectedMode] = useState('classic');

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
    const filteredScores = savedScores
      .filter(score => score.mode === selectedMode)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setScores(filteredScores);
  }, [selectedMode]);

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      
      <div className="mode-filter">
        <button 
          className={selectedMode === 'classic' ? 'selected' : ''} 
          onClick={() => setSelectedMode('classic')}
        >
          Classic
        </button>
        <button 
          className={selectedMode === 'timeAttack' ? 'selected' : ''} 
          onClick={() => setSelectedMode('timeAttack')}
        >
          Time Attack
        </button>
        <button 
          className={selectedMode === 'maze' ? 'selected' : ''} 
          onClick={() => setSelectedMode('maze')}
        >
          Maze
        </button>
      </div>

      <div className="scores-list">
        {scores.map((score, index) => (
          <div key={index} className="score-item">
            <span className="rank">#{index + 1}</span>
            <span className="name">{score.playerName}</span>
            <span className="score">{score.score}</span>
          </div>
        ))}
        {scores.length === 0 && (
          <p className="no-scores">No scores yet!</p>
        )}
      </div>

      <button className="return-button" onClick={onReturn}>
        Return to Menu
      </button>
    </div>
  );
};

export default Leaderboard; 