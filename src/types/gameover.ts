import { SimplePlayer } from "./player";

// Different UI States that can occur when sharing user scores
export type ShareState = "button" | "share" | "confirm";

// Props for the ShareScore Component
export interface ShareScoreProps {
  shareState: ShareState;
  handleShare: () => void;
  player: SimplePlayer;
  setPlayer: (player: SimplePlayer) => void;
}