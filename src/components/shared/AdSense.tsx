"use client";

import { useEffect, useRef } from "react";

interface AdSenseProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSense({ slot, format = "auto", responsive = true, className = "" }: AdSenseProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div className={`my-6 flex justify-center ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5685733067450849"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
