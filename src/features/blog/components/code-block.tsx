"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="group relative mt-6 overflow-hidden rounded-xl border border-border/70 bg-[#0d1526]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs tracking-wide text-white/50 uppercase">
          {language}
        </span>
        <Button
          type="button"
          size="xs"
          variant="ghost"
          className="text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onCopy}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-sky-50">
        <code>{code}</code>
      </pre>
    </div>
  );
}
