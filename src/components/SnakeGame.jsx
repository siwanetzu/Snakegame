import { useState, useCallback, useEffect } from 'react';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import PauseMenu from './PauseMenu';
import useGameLoop from '../hooks/useGameLoop';
import { BOARD_SIZE, INITIAL_SNAKE, generateFoodPosition, FOOD_TYPES, setHighScore, saveScore, GAME_MODES, checkCollision, checkPortal } from '../utils/gameUtils';

const SnakeGame = ({ mode, playerName, onReturn, onGameOver }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFoodPosition(INITIAL_SNAKE));
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [foodEaten, setFoodEaten] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_MODES.TIME_ATTACK.timeLimit);
  const [obstacles, setObstacles] = useState([]);
  const [portals, setPortals] = useState([]);

  // Initialize mode-specific settings
  useEffect(() => {
    if (mode === 'maze') {
      setObstacles(GAME_MODES.MAZE.obstacles);
      setPortals(GAME_MODES.MAZE.portals);
    }
  }, [mode]);

  // Timer for Time Attack mode
  useEffect(() => {
    if (mode === 'timeAttack' && !isGameOver && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 0) {
            setIsGameOver(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [mode, isGameOver, isPaused]);

  const moveSnake = useCallback(() => {
    setSnake(currentSnake => {
      const head = { ...currentSnake[0] };

      switch (direction) {
        case 'UP':
          head.y = (head.y - 1 + BOARD_SIZE) % BOARD_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % BOARD_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + BOARD_SIZE) % BOARD_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % BOARD_SIZE;
          break;
      }

      // Check for portals in maze mode
      if (mode === 'maze') {
        const portalExit = checkPortal(head, portals);
        if (portalExit) {
          head.x = portalExit.x;
          head.y = portalExit.y;
        }
      }

      // Check collisions based on mode
      if (checkCollision(head, currentSnake.slice(1), mode, obstacles)) {
        setIsGameOver(true);
        const isNew = setHighScore(score);
        setIsNewHighScore(isNew);
        return currentSnake;
      }

      const newSnake = [head, ...currentSnake];
      
      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        const foodType = FOOD_TYPES[food.type];
        setScore(s => s + foodType.points);
        setFoodEaten(true);
        setTimeout(() => setFoodEaten(false), 300);
        
        // Grow snake based on food type
        for (let i = 1; i < foodType.growth; i++) {
          newSnake.push({ ...currentSnake[currentSnake.length - 1] });
        }
        
        setFood(generateFoodPosition(newSnake));
      } else {
        newSnake.pop();
      }

      // Add bonus time in Time Attack mode
      if (mode === 'timeAttack' && head.x === food.x && head.y === food.y) {
        setTimeLeft(time => 
          time + GAME_MODES.TIME_ATTACK.bonusTime[food.type]
        );
      }

      return newSnake;
    });
  }, [direction, food, score, mode, obstacles, portals]);

  useGameLoop(moveSnake, isGameOver || isPaused, score);

  const handleKeyPress = useCallback((event) => {
    // Prevent default behavior for arrow keys
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
    }

    const key = event.key.toLowerCase();
    
    // Handle pause
    if (key === 'escape') {
      setIsPaused(p => !p);
      return;
    }

    // Don't process movement keys if paused
    if (isPaused) return;
    
    setDirection(currentDirection => {
      if (key === 'arrowup' && currentDirection !== 'DOWN') return 'UP';
      if (key === 'arrowdown' && currentDirection !== 'UP') return 'DOWN';
      if (key === 'arrowleft' && currentDirection !== 'RIGHT') return 'LEFT';
      if (key === 'arrowright' && currentDirection !== 'LEFT') return 'RIGHT';
      return currentDirection;
    });
  }, [isPaused]);

  const handleQuitGame = () => {
    saveScore(playerName, score, mode);
    onReturn();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('RIGHT');
    setFood(generateFoodPosition(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="snake-game">
      <ScoreBoard 
        score={score} 
        timeLeft={mode === 'timeAttack' ? timeLeft : null}
      />
      <GameBoard 
        snake={snake} 
        food={food} 
        isGameOver={isGameOver}
        foodEaten={foodEaten}
        obstacles={obstacles}
        portals={portals}
      />
      {isPaused && (
        <PauseMenu 
          onResume={handleResume}
          onQuit={handleQuitGame}
        />
      )}
      {isGameOver && (
        <div className="game-over">
          <div>
            <h2>Game Over!</h2>
            {isNewHighScore && <h3>New High Score! 🎉</h3>}
            <p>Final Score: {score}</p>
            <button onClick={handleQuitGame}>Return to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame; 