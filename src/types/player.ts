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
