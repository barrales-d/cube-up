import { Overlay } from "./Overlay";
import { useLeaderBoardData } from "../hooks/useLeaderBoardData";
import { useLocalPlayer } from "../hooks/useLocalPlayer";
import { LeaderBoardContentProps, PlayerRowProps } from "../types/leaderboard";
import { useGameState } from "../GameStore";


export function LeaderBoard() {
  const [, setCurrentView] = useGameState("currentView");
  
  const { playerScores, isLoading, error } = useLeaderBoardData();
  const { localPlayer } = useLocalPlayer();

  return (
    <Overlay>
      <div className="menu-container">
        <h1>Leaderboard</h1>
        <button className="menu-btn" onClick={() => { setCurrentView("main") }}>Back</button>

        <LeaderBoardContent
          isLoading={isLoading}
          error={error}
          playerScores={playerScores}
          localPlayer={localPlayer}
        />

      </div>
    </Overlay >
  );
}

function LeaderBoardContent({ isLoading, error, playerScores, localPlayer }: LeaderBoardContentProps) {
  if (isLoading) return <h3>Loading...</h3>;
  if (error) return <h3 className="error">{error}</h3>;
  if (!playerScores) return <h3>No scores yet</h3>;

  return (
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
          <PlayerRow
            key={player.id}
            player={player}
            index={index}
            isLocalPlayer={localPlayer?.username === player.username && localPlayer?.highscore === player.highscore}
          />
        ))}
      </tbody>
    </table>
  );
}

function PlayerRow({ player, index, isLocalPlayer }: PlayerRowProps) {
  return (
    <tr className={isLocalPlayer ? "local-player" : ""} key={player.id}>
      <td>{index + 1}</td>
      <td>{player.username}</td>
      <td>{player.highscore}m</td>
    </tr>
  );
}