import { useGameState } from "../GameStore";
import { Button } from "./Button";

export function MainMenu() {
  const [, setCurrentView] = useGameState("currentView");
  const [, setIsPlaying] = useGameState("isPlaying");
  return (
    <div className="menu-container">
      <h1 className="menu-title" >Cube Up</h1>
      <Button type="menu-btn" onClick={() => setIsPlaying(true)}>Play</Button>
      <Button type="menu-btn" onClick={() => setCurrentView("leaderboard")}>Leaderboard</Button>
      <Button type="menu-btn" onClick={() => setCurrentView("settings")}>Settings</Button>
    </div>
  );
}