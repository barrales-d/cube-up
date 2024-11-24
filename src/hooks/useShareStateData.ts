import { useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { ShareState } from "../types/gameover";
import { SimplePlayer } from "../types/player";
import { useGameState } from "../GameStore";

const client = generateClient<Schema>();

export function useShareStateData() {
  const [score] = useGameState("score");

  const [shareState, setShareState] = useState<ShareState>("button");
  const [player, setPlayer] = useState<SimplePlayer>({ username: "", highscore: score as number });

  function handleShare() {
    if (player.username.trim() === "") {
      setShareState("share");
      return;
    }

    client.models.Players.create(player);
    localStorage.setItem("local-player", JSON.stringify(player));

    setPlayer({ username: "", highscore: score as number });
    setShareState("confirm");
  }

  return { shareState, player, setPlayer, handleShare };
}
