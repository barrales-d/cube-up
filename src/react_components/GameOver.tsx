import { ShareScoreProps } from "../types/gameover";
import { useShareStateData } from "../hooks/useShareStateData";
import { useGameState } from "../GameStore";
import { Button } from "./Button";

export function GameOver() {
  const [hasGameOver] = useGameState("hasGameOver");
  const [, setCurrentView] = useGameState("currentView");
  const [, setIsPlaying] = useGameState("isPlaying");

  const shareStateProps = useShareStateData();

  function handleRestart() {
    if (hasGameOver) {
      setIsPlaying(true);
      return;
    }
    setCurrentView("main");
  }
  return (
    <div className="menu-container">
      <h1>Game Over</h1>
      <h3>Score: {shareStateProps.player.highscore}m</h3>

      <ShareScore {...shareStateProps} />

      <Button type="menu-btn" onClick={handleRestart}>Play Again</Button>
      <Button type="menu-btn" onClick={() => setCurrentView("main")}>Main Menu</Button>
    </div>
  );
}

function ShareScore({ shareState, handleShare, player, setPlayer }: ShareScoreProps) {
  switch (shareState) {
    case "button": return <Button type="menu-btn" onClick={handleShare}>Share?</Button>;
    case "confirm": return <h3>Thank you for sharing!</h3>
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
        <Button type="share-btn" onClick={handleShare}>Submit Score</Button>
      </div>
    )
  }
}