"use client";

import { useState } from "react";
import Input from "@/components/shared/Input";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export default function SubscriberList({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");
  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-4">
        <Input placeholder="이메일 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">이메일</th>
              <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">구독일</th>
              <th className="px-4 py-3 text-left font-mono text-xs uppercase text-text-muted">상태</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="border-b border-border">
                <td className="px-4 py-3 text-text-primary">{sub.email}</td>
                <td className="px-4 py-3 text-text-muted">{sub.subscribedAt}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${sub.isActive ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                    {sub.isActive ? "활성" : "비활성"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
