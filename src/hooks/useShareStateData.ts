import { useAtomValue } from "jotai";
import { useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

import { ShareState } from "../types/gameover";
import { scoreAtom } from "../store";
import { SimplePlayer } from "../types/player";

const client = generateClient<Schema>();

export function useShareStateData() {
  const score = useAtomValue(scoreAtom);

  const [shareState, setShareState] = useState<ShareState>("button");
  const [player, setPlayer] = useState<SimplePlayer>({ username: "", highscore: score });

  function handleShare() {
    if (player.username.trim() === "") {
      setShareState("share");
      return;
    }

    client.models.Players.create(player);
    localStorage.setItem("local-player", JSON.stringify(player));

    setPlayer({ username: "", highscore: score });
    setShareState("confirm");
  }

  return { shareState, player, setPlayer, handleShare };
}
