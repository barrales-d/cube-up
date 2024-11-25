import { useCallback, useEffect } from "react";
import { atom, createStore, useAtom } from "jotai";

export type MenuView = "main" | "leaderboard" | "settings" | "gameover";

export interface GameState {
  // Determines if the Game is running
  isPlaying: boolean;
  // Determines what Menu should be displayed when Paused
  currentView: MenuView;
  // Used for the current run's score
  score: number;
  // Flag to determine if the game is over
  hasGameOver: boolean;

}

const initialGameState: GameState = {
  isPlaying: false,           // The game should be paused and displaying a Menu
  currentView: "main",        // Displays the MainMenu by default
  score: 0,                   // Default score is 0
  hasGameOver: false,
};


const isPlayingAtom = atom<boolean>(initialGameState.isPlaying);
const currentViewAtom = atom<MenuView>(initialGameState.currentView);
const scoreAtom = atom<number>(initialGameState.score);
const hasGameOverAtom = atom<boolean>(initialGameState.hasGameOver);

export const store = createStore();

class GameStore {
  constructor() { }
  public getAtom<K extends keyof GameState>(key: K) {
    switch (key) {
      case "isPlaying": return isPlayingAtom;
      case "currentView": return currentViewAtom;
      case "score": return scoreAtom;
      case "hasGameOver": return hasGameOverAtom;
      default: {
        const unreachable: never = key;
        throw new Error(`Unhandled key: ${unreachable}`);
      }
    }
  }
  public setState<K extends keyof GameState>(key: K, value: GameState[K]) {
    switch (key) {
      case "isPlaying":
        store.set(isPlayingAtom, value as boolean);
        break;
      case "currentView":
        store.set(currentViewAtom, value as MenuView);
        break;
      case "score":
        store.set(scoreAtom, value as number);
        break;
      case "hasGameOver":
        store.set(hasGameOverAtom, value as boolean);
        break;
    }
  }

  public getState<K extends keyof GameState>(key: K): GameState[K] {
    switch (key) {
      case "isPlaying": return store.get(isPlayingAtom) as GameState[K];
      case "currentView": return store.get(currentViewAtom) as GameState[K];
      case "score": return store.get(scoreAtom) as GameState[K];
      case "hasGameOver": return store.get(hasGameOverAtom) as GameState[K];
      default: {
        const unreachable: never = key;
        throw new Error(`Unhandled key: ${unreachable}`);
      }
    }
  }

  public sub<K extends keyof GameState>(key: K, func: any) {
    switch (key) {
      case "isPlaying":
        return store.sub(isPlayingAtom, () => func(this.getState(key)));
      case "currentView":
        return store.sub(currentViewAtom, () => func(this.getState(key)));
      case "score":
        return store.sub(scoreAtom, () => func(this.getState(key)));
      case "hasGameOver":
        return store.sub(hasGameOverAtom, () => func(this.getState(key)));
      default: {
        const unreachable: never = key;
        throw new Error(`Unhandled key: ${unreachable}`);
      }
    }
  }
}

export const gameStore = new GameStore();

export function useGameState<K extends keyof GameState>(key: K) {
  const [value, setValue] = useAtom(gameStore.getAtom(key));

  useEffect(() => {
    const unsubcribe = gameStore.sub(key, setValue);
    return () => { unsubcribe(); };
  }, [key]);

  const updateValue = useCallback((newValue: GameState[K]) => {
    gameStore.setState(key, newValue);
  }, [key]);

  return [value, updateValue] as const;

}