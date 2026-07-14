"use client";

import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pulling, setPulling] = useState(false);
  const [startY, setStartY] = useState(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startY === 0) return;
      const delta = e.touches[0].clientY - startY;
      if (delta > 80 && window.scrollY === 0) {
        setPulling(true);
      }
    },
    [startY]
  );

  const onTouchEnd = useCallback(() => {
    if (pulling) {
      window.location.reload();
    }
    setPulling(false);
    setStartY(0);
  }, [pulling]);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {pulling && (
        <div className="flex justify-center py-4 text-emerald-400">
          <RefreshCw size={20} className="animate-spin" />
        </div>
      )}
      {children}
    </div>
  );
}
