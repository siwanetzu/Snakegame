import { useState } from 'react';
import '../styles/Menu.css';

const Menu = ({ onStartGame, onShowLeaderboard, onNameChange, playerName }) => {
  const [selectedMode, setSelectedMode] = useState('classic');

  const handleStartGame = () => {
    if (playerName.trim()) {
      onStartGame(selectedMode);
    }
  };

  return (
    <div className="menu">
      <div className="menu-content">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => onNameChange(e.target.value)}
          className="name-input"
        />
        
        <div className="mode-selection">
          <h2>Select Game Mode</h2>
          <div className="mode-buttons">
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
        </div>

        <button 
          className="start-button" 
          onClick={handleStartGame}
          disabled={!playerName.trim()}
        >
          Start Game
        </button>
        <button className="leaderboard-button" onClick={onShowLeaderboard}>
          Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Menu; 