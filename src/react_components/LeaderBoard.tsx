import { useEffect, useState } from "react";
import { useMenuState } from "../hooks/useMenuState";
import { type Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Overlay } from "./Overlay";

const client = generateClient<Schema>();
type Players = Array<Schema["Players"]["type"]>;

interface PlayerProps {
  player: Schema["Players"]["type"];
  index: number;
}

export function LeaderBoard() {
  const { setCurrentView } = useMenuState();

  const [playerScores, setPlayerScores] = useState<Players>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [localPlayer, setLocalPlayer] = useState<{ username: string, highscore: number }>();

  function setAndSortPlayers(players: Players) {
    // Sort by highscore in descending order
    players.sort((a, b) => b.highscore - a.highscore);

    // Create Map to keep track of the highest score for each username 
    const uniquePlayers = players.reduce((acc, current) => {
      if (!acc.has(current.username)) {
        acc.set(current.username, current);
      }
      return acc;
    }, new Map<string, Schema["Players"]["type"]>())

    players = Array.from(uniquePlayers.values());
    // Take only the top 10 players with the highest scores 
    players = players.slice(0, 10);
    setPlayerScores(players);
  }

  useEffect(() => {
    (async () => {
      const lPlayer = localStorage.getItem("local-player") ? JSON.parse(localStorage.getItem("local-player")!) : undefined;
      setLocalPlayer(lPlayer);
      const { data, errors } = await client.models.Players.list();
      if (errors) {
        setError(errors[0].message);
      } else {
        setAndSortPlayers(data);
      }

      setIsLoading(false);
    })();

  }, []);

  function renderPlayer({ player, index }: PlayerProps) {
    if (localPlayer) {
      if (localPlayer.username === player.username && localPlayer.highscore === player.highscore) {
        return (
          <tr className="local-player" key={player.id}>
            <td>{index + 1}</td>
            <td>You</td>
            <td>{player.highscore}m</td>
          </tr>
        );
      }
    }

    return (
      <tr key={player.id}>
        <td>{index + 1}</td>
        <td>{player.username}</td>
        <td>{player.highscore}m</td>
      </tr>
    );
  }

  return (
    <Overlay>
      <div className="menu-container">
        <h1>Leaderboard</h1>
        <button className="menu-btn" onClick={() => { setCurrentView("main") }}>Back</button>
        {isLoading && <h3>Loading...</h3>}
        {error && <h3 className="error">{error}</h3>}
        {!isLoading && !error && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {playerScores?.map((player, index) => (
                renderPlayer({ player, index })
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Overlay >
  );
}