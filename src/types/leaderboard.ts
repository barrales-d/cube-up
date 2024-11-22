import { type Schema } from "../../amplify/data/resource";

// Model type from AWS Amplify 
export type Player = Schema["Players"]["type"];

// Array of players
export type Players = Array<Player>;

// Simplified Player wiht AWS Amplify fields
export type SimplePlayer = {
  username: string;
  highscore: number;
}

// Props for the LeaderBoardContent comopent
export interface LeaderBoardContentProps {
  isLoading: boolean;
  error: string | null;
  playerScores: Players | undefined;
  localPlayer: SimplePlayer | undefined;
}

// Props for the PlayerRowProps comopent
export interface PlayerRowProps {
  player: Player;
  index: number;
  isLocalPlayer: boolean;
}