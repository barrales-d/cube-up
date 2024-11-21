import { atom, createStore } from "jotai";

export const isMenuVisibleAtom = atom<boolean>(false);

export const store = createStore();