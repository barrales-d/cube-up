import { SimplePlayer } from "./leaderboard";

export type ShareState = "button" | "share" | "confirm";

export interface ShareScoreProps {
  shareState: ShareState;
  handleShare: () => void;
  player: SimplePlayer;
  setPlayer: (player: SimplePlayer) => void;
}