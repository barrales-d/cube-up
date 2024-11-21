import { useMenuState } from "../hooks/useMenuState";

export function MainMenu() {
  const { toggleMenu, setCurrentView } = useMenuState();
  return (
    <div className="menu-container">
      <h1>Cube Up</h1>
      <button className="menu-btn" onClick={toggleMenu}>Play</button>
      <button className="menu-btn" onClick={() => setCurrentView("leaderboard")}>Leaderboard</button>
      <button className="menu-btn" onClick={() => setCurrentView("settings")}>Settings</button>
    </div>
  );
}