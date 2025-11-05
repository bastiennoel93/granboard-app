import { Segment } from "@/services/boardinfo";
import { useEffect, useState } from "react";

interface HitAnimationProps {
  hit: Segment | null;
  onComplete?: () => void;
}

export function HitAnimation({ hit, onComplete }: HitAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hit, onComplete]);

  if (!hit || !show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
      {/* Overlay with fade */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      {/* Hit display */}
      <div className="relative animate-bounce-scale">
        <div className="bg-theme-card text-theme-primary rounded-3xl shadow-2xl p-16 border-4 border-accent">
          <div className="text-center">
            <div className="text-9xl font-black text-accent">
              {hit.ShortName}
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-accent rounded-3xl blur-3xl opacity-40 animate-pulse" />
      </div>
    </div>
  );
}
