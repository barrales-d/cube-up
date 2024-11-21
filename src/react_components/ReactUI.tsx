import { useEffect } from "react";
import { useMenuState } from "../hooks/useMenuState";
import { MainMenu } from "./MainMenu";
import { Overlay } from "./Overlay";

export function ReactUI() {
  const { isMenuVisible, currentView, toggleMenu } = useMenuState();

  useEffect(() => {
    toggleMenu();
  }, []);
  
  if (!isMenuVisible) {
    return (
      <button className="pause-btn" onClick={toggleMenu}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </svg>
      </button>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "leaderboard": return <div>Leaderboard</div>;
      case "settings":    return <div>Settings</div>;
      case "gameover":    return <div>Game Over</div>;
      case "main":        return <MainMenu />;
    }
  };

  return (
    <Overlay>
      {renderView()}
    </Overlay>
  );
}