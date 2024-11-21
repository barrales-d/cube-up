import { useAtom } from "jotai";
import { currentViewAtom, isMenuVisibleAtom } from "../store";

export type MenuView = "main" | "leaderboard" | "settings" | "gameover";
export function useMenuState(): {
  isMenuVisible: boolean;
  currentView: MenuView;
  toggleMenu: () => void;
  setCurrentView: (view: MenuView) => void;
} {
  const [isMenuVisible, setIsMenuVisible] = useAtom(isMenuVisibleAtom);
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    if (isMenuVisible)
      setCurrentView("main");
  };

  return {
    isMenuVisible,
    currentView,
    toggleMenu,
    setCurrentView
  };
}