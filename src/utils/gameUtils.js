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

export const saveScore = (playerName, score, mode) => {
  const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
  scores.push({
    playerName,
    score,
    mode,
    date: new Date().toISOString()
  });
  localStorage.setItem('snakeScores', JSON.stringify(scores));
};

// Add game mode constants
export const GAME_MODES = {
  CLASSIC: {
    name: 'classic',
    baseSpeed: 100,
    speedIncrement: 2
  },
  TIME_ATTACK: {
    name: 'timeAttack',
    baseSpeed: 80, // Faster base speed
    timeLimit: 60, // 60 seconds
    bonusTime: {
      REGULAR: 0,
      BONUS: 2,
      SPECIAL: 5
    }
  },
  MAZE: {
    name: 'maze',
    baseSpeed: 100,
    obstacles: [
      // Example obstacle layout
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 5, y: 7 },
      { x: 15, y: 12 },
      { x: 15, y: 13 },
      { x: 15, y: 14 }
    ],
    portals: [
      // Example portal pairs
      { entrance: { x: 3, y: 3 }, exit: { x: 16, y: 16 } },
      { entrance: { x: 16, y: 3 }, exit: { x: 3, y: 16 } }
    ]
  }
};

// Add collision detection for obstacles
export const checkCollision = (head, snake, mode, obstacles = []) => {
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return true;
  }

  // Check obstacle collision in maze mode
  if (mode === 'maze' && 
      obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
    return true;
  }

  return false;
};

// Add portal detection for maze mode
export const checkPortal = (head, portals) => {
  for (const portal of portals) {
    if (head.x === portal.entrance.x && head.y === portal.entrance.y) {
      return portal.exit;
    }
  }
  return null;
}; 