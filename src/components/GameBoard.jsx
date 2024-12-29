import { useEffect, useRef } from 'react';
import { BOARD_SIZE, CELL_SIZE, FOOD_TYPES } from '../utils/gameUtils';

const GameBoard = ({ snake, food, isGameOver, foodEaten }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const drawCell = (ctx, x, y, color, scale = 1) => {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const size = (CELL_SIZE - 1) * scale;

    ctx.fillStyle = color;
    ctx.fillRect(
      centerX - size / 2,
      centerY - size / 2,
      size,
      size
    );
  };

  const animateFood = (ctx, food, progress) => {
    const scale = 1 + Math.sin(progress * Math.PI) * 0.2;
    drawCell(ctx, food.x, food.y, FOOD_TYPES[food.type].color, scale);
  };

  const animateGameOver = (ctx) => {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1000;

      // Clear the canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);

      // Draw snake
      snake.forEach(({ x, y }, index) => {
        const color = index === 0 ? '#00ff00' : '#008000';
        drawCell(ctx, x, y, color);
      });

      // Animate food
      animateFood(ctx, food, progress);

      // Game over animation
      if (isGameOver) {
        animateGameOver(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [snake, food, isGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_SIZE * CELL_SIZE}
      height={BOARD_SIZE * CELL_SIZE}
      style={{ border: '1px solid white' }}
    />
  );
};

export default GameBoard; 