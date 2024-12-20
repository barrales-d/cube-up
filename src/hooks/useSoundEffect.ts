import { useCallback, useMemo } from "react";

export function useSoundEffect(soundPath: string) {
  const audio = useMemo(() => new Audio(soundPath), [soundPath]);

  const playSound = useCallback(() => {
    audio.currentTime = 0;
    audio.play();
  }, [audio]);

  return playSound;
}