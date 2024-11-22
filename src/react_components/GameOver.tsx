import { useMenuState } from "../hooks/useMenuState";
import { ShareScoreProps } from "../types/gameover";
import { useShareStateData } from "../hooks/useShareStateData";

export function GameOver() {

  const { toggleMenu, setCurrentView } = useMenuState();
  const shareStateProps = useShareStateData();

  function handleRestart() {
    toggleMenu();
    setCurrentView("main");
  }
  return (
    <div className="menu-container">
      <h1>Game Over</h1>
      <h3>Score: {shareStateProps.player.highscore}m</h3>

      <ShareScore {...shareStateProps} />

      <button className="menu-btn" onClick={handleRestart}>Play Again</button>
      <button className="menu-btn" onClick={() => setCurrentView("main")}>Main Menu</button>
    </div>
  );
}

function ShareScore({ shareState, handleShare, player, setPlayer }: ShareScoreProps) {
  switch (shareState) {
    case "button": return <button className="menu-btn" onClick={handleShare}>Share?</button>;
    case "confirm": return <p>Thank you for sharing!</p>
    case "share": return (
      <div className="share-container">
        <input
          type="text"
          value={player.username}
          onChange={(e) => setPlayer({ username: e.target.value, highscore: player.highscore })}
          placeholder="Enter Nickname"
          className="share-input"
          autoFocus
        />
        <button className="menu-btn" onClick={handleShare}>Submit Score</button>
      </div>
    )
  }
}