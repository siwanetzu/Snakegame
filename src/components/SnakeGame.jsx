import { useState, useCallback, useEffect } from 'react';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import useGameLoop from '../hooks/useGameLoop';
import { BOARD_SIZE, INITIAL_SNAKE, generateFoodPosition, FOOD_TYPES, setHighScore } from '../utils/gameUtils';

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFoodPosition(INITIAL_SNAKE));
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [foodEaten, setFoodEaten] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

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

      // Check for collisions with self only
      if (currentSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
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

      return newSnake;
    });
  }, [direction, food, score]);

  useGameLoop(moveSnake, isGameOver);

  const handleKeyPress = useCallback((event) => {
    // Prevent default behavior for arrow keys
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
    }
    
    const key = event.key.toLowerCase();
    
    setDirection(currentDirection => {
      if (key === 'arrowup' && currentDirection !== 'DOWN') return 'UP';
      if (key === 'arrowdown' && currentDirection !== 'UP') return 'DOWN';
      if (key === 'arrowleft' && currentDirection !== 'RIGHT') return 'LEFT';
      if (key === 'arrowright' && currentDirection !== 'LEFT') return 'RIGHT';
      return currentDirection;
    });
  }, []);

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
      <ScoreBoard score={score} />
      <GameBoard 
        snake={snake} 
        food={food} 
        isGameOver={isGameOver}
        foodEaten={foodEaten}
      />
      {isGameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          {isNewHighScore && <h3>New High Score! 🎉</h3>}
          <p>Final Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame; 