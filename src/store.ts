import { atom, createStore } from "jotai";
import { MenuView } from "./hooks/useMenuState";
import { type Schema } from "../amplify/data/resource";

export const isMenuVisibleAtom = atom<boolean>(false);
export const currentViewAtom = atom<MenuView>("main");

export const currentPlayerAtom = atom<Schema["Players"]["type"] | null>(null);

export const store = createStore();