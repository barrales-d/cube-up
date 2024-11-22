import { SimplePlayer, Player, Players } from "./player";

// Props for the LeaderBoardContent Component
export interface LeaderBoardContentProps {
  isLoading: boolean;
  error: string | null;
  playerScores: Players | undefined;
  localPlayer: SimplePlayer | undefined;
}

// Props for the PlayerRow Component
export interface PlayerRowProps {
  player: Player;
  index: number;
  isLocalPlayer: boolean;
}