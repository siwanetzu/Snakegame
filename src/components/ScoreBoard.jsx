import { getHighScore } from '../utils/gameUtils';

const ScoreBoard = ({ score }) => {
  return (
    <div className="score-board">
      <h2>Score: {score}</h2>
      <h3>High Score: {getHighScore()}</h3>
    </div>
  );
};

export default ScoreBoard; 