import { useAtomValue } from "jotai";
import { scoreAtom } from "../store";
import { useMenuState } from "../hooks/useMenuState";

export function GameOver() {
  const { toggleMenu, setCurrentView } = useMenuState();
  const score = useAtomValue(scoreAtom);

  function handleRestart() {
    toggleMenu();
    setCurrentView("main");
  }

  return (
    <div className="menu-container">
      <h1>Game Over</h1>
      <h3>Score: {score}m</h3>
      <button className="menu-btn">Share?</button>
      <button className="menu-btn" onClick={handleRestart}>Play Again</button>
      <button className="menu-btn" onClick={() => setCurrentView("main")}>Main Menu</button>
    </div>
  );
}