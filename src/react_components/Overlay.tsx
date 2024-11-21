interface OverlayProps {
  children: React.ReactNode;
}

export function Overlay({ children }: OverlayProps) {
  return (
    <div className="overlay">
      {children}
    </div>
  );
}