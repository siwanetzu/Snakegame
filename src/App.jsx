import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import Menu from './components/Menu';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'leaderboard'
  const [gameMode, setGameMode] = useState('classic'); // 'classic', 'timeAttack', 'maze'
  const [playerName, setPlayerName] = useState('');

  const startGame = (mode) => {
    setGameMode(mode);
    setGameState('playing');
  };

  const showLeaderboard = () => {
    setGameState('leaderboard');
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="App">
      <h1>Snake Game</h1>
      {gameState === 'menu' && (
        <Menu 
          onStartGame={startGame}
          onShowLeaderboard={showLeaderboard}
          onNameChange={setPlayerName}
          playerName={playerName}
        />
      )}
      {gameState === 'playing' && (
        <SnakeGame 
          mode={gameMode}
          playerName={playerName}
          onGameOver={(score) => setGameState('leaderboard')}
          onReturn={returnToMenu}
        />
      )}
      {gameState === 'leaderboard' && (
        <Leaderboard onReturn={returnToMenu} />
      )}
    </div>
  );
}

export default App; 