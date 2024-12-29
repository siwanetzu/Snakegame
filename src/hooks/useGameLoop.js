import { useEffect, useRef } from 'react';

const GAME_SPEED = 100; // milliseconds

const useGameLoop = (callback, isGameOver) => {
  const frameRef = useRef();

  useEffect(() => {
    if (isGameOver) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    let lastTime = 0;
    const gameLoop = (timestamp) => {
      if (timestamp - lastTime >= GAME_SPEED) {
        callback();
        lastTime = timestamp;
      }
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(frameRef.current);
  }, [callback, isGameOver]);
};

export default useGameLoop; 