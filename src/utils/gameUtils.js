export const BOARD_SIZE = 20;
export const CELL_SIZE = 20;

export const INITIAL_SNAKE = [
  { x: 10, y: 10 }, // head
  { x: 9, y: 10 },  // body
  { x: 8, y: 10 }   // tail
];

export const FOOD_TYPES = {
  REGULAR: {
    color: '#ff0000',
    points: 1,
    growth: 1,
    probability: 0.7
  },
  BONUS: {
    color: '#ffd700',
    points: 3,
    growth: 2,
    probability: 0.2
  },
  SPECIAL: {
    color: '#00ffff',
    points: 5,
    growth: 3,
    probability: 0.1
  }
};

export const generateFoodPosition = (snake) => {
  while (true) {
    const position = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };

    // Determine food type based on probability
    const random = Math.random();
    let foodType;
    if (random < FOOD_TYPES.REGULAR.probability) {
      foodType = 'REGULAR';
    } else if (random < FOOD_TYPES.REGULAR.probability + FOOD_TYPES.BONUS.probability) {
      foodType = 'BONUS';
    } else {
      foodType = 'SPECIAL';
    }

    // Make sure food doesn't appear on snake
    if (!snake.some(segment => segment.x === position.x && segment.y === position.y)) {
      return { ...position, type: foodType };
    }
  }
};

export const getHighScore = () => {
  return parseInt(localStorage.getItem('snakeHighScore')) || 0;
};

export const setHighScore = (score) => {
  const currentHigh = getHighScore();
  if (score > currentHigh) {
    localStorage.setItem('snakeHighScore', score.toString());
    return true;
  }
  return false;
}; 