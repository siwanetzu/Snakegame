import { useEffect, useRef } from 'react';

const BASE_SPEED = 100; // Base speed in milliseconds
const MAX_SPEED = 50;   // Maximum speed (minimum delay)
const SPEED_INCREMENT = 2; // How much to decrease delay per score point

const useGameLoop = (callback, isGameOver, score) => {
  const frameRef = useRef();

  useEffect(() => {
    if (isGameOver) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    // Calculate game speed based on score
    const gameSpeed = Math.max(
      MAX_SPEED,
      BASE_SPEED - (score * SPEED_INCREMENT)
    );

    let lastTime = 0;
    const gameLoop = (timestamp) => {
      if (timestamp - lastTime >= gameSpeed) {
        callback();
        lastTime = timestamp;
      }
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(frameRef.current);
  }, [callback, isGameOver, score]);
};

export default useGameLoop; 