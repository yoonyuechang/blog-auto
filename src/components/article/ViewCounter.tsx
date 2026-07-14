"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ articleId, initialCount }: { articleId: number; initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.viewCount) setCount(d.viewCount); })
      .catch(() => {});
  }, [articleId]);

  return <>{count.toLocaleString()}</>;
}
