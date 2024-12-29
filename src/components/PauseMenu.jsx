import '../styles/PauseMenu.css';

const PauseMenu = ({ onResume, onQuit }) => {
  return (
    <div className="pause-overlay">
      <div className="pause-menu">
        <h2>Game Paused</h2>
        <div className="pause-buttons">
          <button onClick={onResume}>Resume</button>
          <button onClick={onQuit}>Quit Game</button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu; 