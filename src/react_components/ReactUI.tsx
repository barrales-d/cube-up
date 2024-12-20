import { MainMenu } from "./MainMenu";
import { Overlay } from "./Overlay";
import { GameOver } from "./GameOver";
import { LeaderBoard } from "./LeaderBoard";
import { MenuView, useGameState } from "../GameStore";
import '../../index.css';
import { Button } from "./Button";

export function ReactUI() {
  const [isPlaying, setIsPlaying] = useGameState("isPlaying");
  const [currentView] = useGameState("currentView");

  if (isPlaying as boolean) {
    // Game is running, Render PauseButton
    return (
      <Button type="pause-btn" onClick={() => setIsPlaying(false)}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </svg>
      </Button>
    );
  }

  const renderView = () => {
    switch (currentView as MenuView) {
      case "leaderboard": return <LeaderBoard />;
      case "settings": return <div>Settings</div>;
      case "gameover": return <GameOver />;
      case "main": return <MainMenu />;
    }
  };

  return (
    <Overlay>
      {renderView()}
    </Overlay>
  );
}