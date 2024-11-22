import { useEffect, useState } from "react";
import { SimplePlayer } from "../types/leaderboard";

export function useLocalPlayer() {
  const [localPlayer, setLocalPlayer] = useState<SimplePlayer>();

  useEffect(() => {
    if (localStorage.getItem("local-player")) {
      const player = JSON.parse(localStorage.getItem("local-player")!);
      setLocalPlayer(player);
    } else {
      setLocalPlayer(undefined);
    }
  }, []);

  return { localPlayer };

}