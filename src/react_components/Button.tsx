import { useSoundEffect } from "../hooks/useSoundEffect";

interface ButtonProps {
  type: "menu-btn" | "pause-btn" | "share-btn";
  onClick: () => void;
  children: React.ReactNode;
}
export function Button({ type, onClick, children }: ButtonProps) {
  const playHoverSound = useSoundEffect("assets/UI_SFX_Set/rollover5.wav");
  const playClickSound = useSoundEffect("assets/UI_SFX_Set/click5.wav");

  return (
    <button
      className={type}
      onMouseEnter={playHoverSound}
      onClick={() => {
        playClickSound();
        onClick();
      }}>
      {children}
    </button>
  )

}