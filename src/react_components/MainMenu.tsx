import { useGameState } from "../GameStore";

export function MainMenu() {
  const [, setCurrentView] = useGameState("currentView");
  const [, setIsPlaying] = useGameState("isPlaying");
  
  return (
    <div className="menu-container">
      <h1>Cube Up</h1>
      <button className="menu-btn" onClick={() => setIsPlaying(true)}>Play</button>
      <button className="menu-btn" onClick={() => setCurrentView("leaderboard")}>Leaderboard</button>
      <button className="menu-btn" onClick={() => setCurrentView("settings")}>Settings</button>
    </div>
  );
}