import { EventEmitter } from "events";
import { MenuView } from "./hooks/useMenuState";
import { Player } from "./types/player";
import { useCallback, useEffect, useState } from "react";

export interface GameState {
  // Determines if the Game is running
  isPlaying: boolean;
  // Determines what Menu should be displayed when Paused
  currentView: MenuView;
  // Set when the User creates a username and saved in Local Storage
  currentPlayer: Player | undefined;
  // Seperate score for when there is no currentPlayer
  // In addition, used for the current run's score
  score: number;
  // Flag to determine if the game is over
  hasGameOver: boolean;

}

const initialGameState: GameState = {
  isPlaying: false,           // The game should be paused and displaying a Menu
  currentView: "main",        // Displays the MainMenu by default
  currentPlayer: undefined,   // No player on first run
  score: 0,                   // Default score is 0
  hasGameOver: false,
};


class GameStore extends EventEmitter {
  private state: GameState;
  constructor() {
    super();
    this.state = initialGameState;
  }

  public setState<K extends keyof GameState>(key: K, value: GameState[K]) {
    this.state[key] = value;
    this.emit(key, value);
  }

  public getState<K extends keyof GameState>(key: K): GameState[K] {
    return this.state[key];
  }

  public sub<K extends keyof GameState>(key: K, func: (value: GameState[K]) => void) {
    this.on(key, func);
    return () => this.off(key, func);
  }
}

export const gameStore = new GameStore();

export function useGameState<K extends keyof GameState>(key: K) {
  const [value, setValue] = useState<GameState[K]>(gameStore.getState(key));

  useEffect(() => {
    const unsubcribe = gameStore.sub(key, setValue);
    return () => { unsubcribe(); };
  }, [key]);

  const updateValue = useCallback((newValue: GameState[K]) => {
    gameStore.setState(key, newValue);
  }, [key]);

  return [value, updateValue] as const;

}