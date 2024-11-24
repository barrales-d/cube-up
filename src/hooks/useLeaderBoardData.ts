import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Player, Players } from "../types/player";

const client = generateClient<Schema>();

export function useLeaderBoardData() {
  const [playerScores, setPlayerScores] = useState<Players>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, errors } = await client.models.Players.list();
      if (errors) {
        setError(errors[0].message);
      } else {
        const sortedPlayers = processPlayers(data);
        setPlayerScores(sortedPlayers);
      }

      setIsLoading(false);
    })();

  }, []);

  return { playerScores, isLoading, error };

}

function processPlayers(players: Players): Players {
  // Sort by highscore in descending order
  players.sort((a, b) => b.highscore - a.highscore);

  // Create Map to keep track of the highest score for each username 
  const uniquePlayers = players.reduce((acc, current) => {
    if (!acc.has(current.username)) {
      acc.set(current.username, current);
    }
    return acc;
  }, new Map<string, Player>())

  // Return only the top 10 players with the highest scores 
  return Array.from(uniquePlayers.values()).slice(0, 10);
}