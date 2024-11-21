import { useAtomValue } from "jotai";
import { scoreAtom } from "../store";
import { useMenuState } from "../hooks/useMenuState";
import { useState } from "react";
import { type Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export function GameOver() {
  const { toggleMenu, setCurrentView } = useMenuState();
  const score = useAtomValue(scoreAtom);

  const [showShareInput, setShowShareInput] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [playerName, setPlayerName] = useState("");

  function handleRestart() {
    toggleMenu();
    setCurrentView("main");
  }

  function handleShare() {
    if (playerName.trim() === "") {
      setShowShareInput(true);
      return;
    }
    // TODO: Update Score?

    client.models.Players.create({
      username: playerName,
      highscore: score,
    });


    setPlayerName("");
    setShowShareInput(false);
    setShowThankYou(true);
  }

  return (
    <div className="menu-container">
      <h1>Game Over</h1>
      <h3>Score: {score}m</h3>

      {showShareInput && (
        <div className="share-input-container">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Nickname"
            className="share-input"
            autoFocus
          />
        </div>
      )
      }
      {showThankYou && (
        <div className="share-input-container">
          <p>Thank you for sharing!</p>
        </div>
      )}

      {!showThankYou && (
        <button className="menu-btn" onClick={handleShare}>
          {showShareInput ? "Submit Score" : "Share?"}
        </button>
      )
      }
      <button className="menu-btn" onClick={handleRestart}>Play Again</button>
      <button className="menu-btn" onClick={() => setCurrentView("main")}>Main Menu</button>
    </div>
  );
}