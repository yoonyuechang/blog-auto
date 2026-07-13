import React from "react";

// Parses callout lines from blockquote children:
// > ℹ️ Info: text
// > ⚠️ Warning: text
// > ✅ Success: text
// > 🚫 Danger: text

const CALLOUT_RE = /^[ℹ️💡] *(?:Info|참고)[:：]\s*/i;
const CALLOUT_WARN = /^[⚠️!] *(?:Warning|주의)[:：]\s*/i;
const CALLOUT_OK = /^[✅✓] *(?:Success|성공)[:：]\s*/i;
const CALLOUT_BAD = /^[🚫❌✗] *(?:Danger|위험)[:：]\s*/i;

export interface ParsedCallout {
  type: "info" | "warning" | "success" | "danger";
  title: string;
  content: string;
}

export function parseCallout(text: string): ParsedCallout | null {
  let m = text.match(CALLOUT_RE);
  if (m) return { type: "info", title: "참고", content: text.slice(m[0].length) };
  m = text.match(CALLOUT_WARN);
  if (m) return { type: "warning", title: "주의", content: text.slice(m[0].length) };
  m = text.match(CALLOUT_OK);
  if (m) return { type: "success", title: "성공", content: text.slice(m[0].length) };
  m = text.match(CALLOUT_BAD);
  if (m) return { type: "danger", title: "위험", content: text.slice(m[0].length) };
  return null;
}

export function isCalloutBlockquote(children: React.ReactNode): ParsedCallout | null {
  const extract = (node: React.ReactNode): string => {
    if (typeof node === "string") return node.trim();
    if (Array.isArray(node)) return node.map(extract).join("\n").trim();
    if (React.isValidElement(node) && node.props.children) return extract(node.props.children);
    return "";
  };
  return parseCallout(extract(children));
}
