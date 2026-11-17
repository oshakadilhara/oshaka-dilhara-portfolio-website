"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/features/tools/components/copy-button";

function Panel({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function WordCounterTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    return { words, chars, charsNoSpace, sentences, paragraphs };
  }, [text]);

  return (
    <Panel>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text..."
        className="min-h-48"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="Chars (no spaces)" value={stats.charsNoSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
      </div>
    </Panel>
  );
}

export function CharacterCounterTool() {
  const [text, setText] = useState("");
  return (
    <Panel>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text to count characters..."
        className="min-h-40"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="With spaces" value={text.length} />
        <Stat label="Without spaces" value={text.replace(/\s/g, "").length} />
        <Stat label="UTF-16 code units" value={text.length} />
      </div>
    </Panel>
  );
}

export function TextCaseConverterTool() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  function toTitleCase(value: string) {
    return value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={() => setOutput(text.toUpperCase())}>
            UPPERCASE
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setOutput(text.toLowerCase())}>
            lowercase
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setOutput(toTitleCase(text))}>
            Title Case
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setOutput(
                text
                  ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
                  : ""
              )
            }
          >
            Sentence case
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-32" placeholder="Input text" />
      <Textarea value={output} readOnly className="min-h-32" placeholder="Converted output" />
    </Panel>
  );
}

export function SlugGeneratorTool() {
  const [text, setText] = useState("");
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return (
    <Panel actions={<CopyButton value={slug} />}>
      <Label htmlFor="slug-input">Title</Label>
      <Input
        id="slug-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="My Amazing Article Title"
      />
      <Input value={slug} readOnly placeholder="generated-slug" />
    </Panel>
  );
}

export function TextDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const rows = useMemo(() => {
    const a = left.split("\n");
    const b = right.split("\n");
    const max = Math.max(a.length, b.length);
    return Array.from({ length: max }, (_, i) => {
      const l = a[i] ?? "";
      const r = b[i] ?? "";
      const status = l === r ? "same" : !l ? "added" : !r ? "removed" : "changed";
      return { l, r, status };
    });
  }, [left, right]);

  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea value={left} onChange={(e) => setLeft(e.target.value)} className="min-h-40" placeholder="Original" />
        <Textarea value={right} onChange={(e) => setRight(e.target.value)} className="min-h-40" placeholder="Changed" />
      </div>
      <div className="max-h-80 space-y-1 overflow-auto rounded-xl border border-border/70 p-3 font-mono text-xs">
        {rows.map((row, index) => (
          <div
            key={`${index}-${row.status}`}
            className={
              row.status === "same"
                ? "text-muted-foreground"
                : row.status === "added"
                  ? "bg-emerald-500/10 text-emerald-300"
                  : row.status === "removed"
                    ? "bg-rose-500/10 text-rose-300"
                    : "bg-amber-500/10 text-amber-200"
            }
          >
            <span className="inline-block w-8 opacity-50">{index + 1}</span>
            {row.l || "∅"} → {row.r || "∅"}
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function DuplicateLineRemoverTool() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  function dedupe() {
    const seen = new Set<string>();
    const lines: string[] = [];
    for (const line of text.split("\n")) {
      if (!seen.has(line)) {
        seen.add(line);
        lines.push(line);
      }
    }
    setOutput(lines.join("\n"));
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={dedupe}>
            Remove duplicates
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-40" placeholder="One line per row" />
      <Textarea value={output} readOnly className="min-h-40" placeholder="Unique lines" />
    </Panel>
  );
}

export function LoremIpsumTool() {
  const [count, setCount] = useState(3);
  const seed =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const output = Array.from({ length: Math.max(1, Math.min(20, count)) }, () => seed).join(
    "\n\n"
  );

  return (
    <Panel actions={<CopyButton value={output} />}>
      <Label htmlFor="lorem-count">Paragraphs (1-20)</Label>
      <Input
        id="lorem-count"
        type="number"
        min={1}
        max={20}
        value={count}
        onChange={(e) => setCount(Number(e.target.value) || 1)}
      />
      <Textarea value={output} readOnly className="min-h-48" />
    </Panel>
  );
}

export function Base64ConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function encode() {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
    } catch {
      setError("Unable to encode input.");
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError("");
    } catch {
      setError("Invalid Base64 input.");
    }
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={encode}>
            Encode
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={decode}>
            Decode
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-32" placeholder="Input" />
      <Textarea value={output} readOnly className="min-h-32" placeholder="Output" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function UrlEncoderTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  return (
    <Panel
      actions={
        <>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setOutput(encodeURIComponent(input));
              setError("");
            }}
          >
            Encode
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              try {
                setOutput(decodeURIComponent(input));
                setError("");
              } catch {
                setError("Invalid encoded URI component.");
              }
            }}
          >
            Decode
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-28" />
      <Textarea value={output} readOnly className="min-h-28" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format(space: number | undefined) {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, space));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={() => format(2)}>
            Pretty print
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => format(undefined)}>
            Minify
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-40 font-mono text-sm" placeholder='{"hello":"world"}' />
      <Textarea value={output} readOnly className="min-h-40 font-mono text-sm" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function JsonValidatorTool() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);

  function validate() {
    try {
      JSON.parse(input);
      setOk(true);
      setMessage("Valid JSON.");
    } catch (err) {
      setOk(false);
      setMessage(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  return (
    <Panel
      actions={
        <Button type="button" size="sm" onClick={validate}>
          Validate
        </Button>
      }
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-40 font-mono text-sm" />
      {ok !== null ? (
        <p className={ok ? "text-sm text-emerald-400" : "text-sm text-destructive"}>{message}</p>
      ) : null}
    </Panel>
  );
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");

  function generate() {
    const n = Math.max(1, Math.min(50, count));
    const values = Array.from({ length: n }, () => crypto.randomUUID());
    setOutput(values.join("\n"));
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={generate}>
            Generate
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Label htmlFor="uuid-count">Count</Label>
      <Input
        id="uuid-count"
        type="number"
        min={1}
        max={50}
        value={count}
        onChange={(e) => setCount(Number(e.target.value) || 1)}
      />
      <Textarea value={output} readOnly className="min-h-40 font-mono text-sm" />
    </Panel>
  );
}

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [sha256, setSha256] = useState("");
  const [sha1, setSha1] = useState("");

  async function hash(algorithm: "SHA-256" | "SHA-1") {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest(algorithm, data);
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function generate() {
    setSha256(await hash("SHA-256"));
    setSha1(await hash("SHA-1"));
  }

  return (
    <Panel
      actions={
        <Button type="button" size="sm" onClick={generate}>
          Generate hashes
        </Button>
      }
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-28" />
      <div className="space-y-3">
        <div>
          <Label>SHA-256</Label>
          <div className="mt-1 flex gap-2">
            <Input value={sha256} readOnly className="font-mono text-xs" />
            <CopyButton value={sha256} />
          </div>
        </div>
        <div>
          <Label>SHA-1</Label>
          <div className="mt-1 flex gap-2">
            <Input value={sha1} readOnly className="font-mono text-xs" />
            <CopyButton value={sha1} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const [output, setOutput] = useState("");

  function generate() {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()-_=+[]{};:,.?";
    const alphabet = lower + upper + numbers + (symbols ? special : "");
    const bytes = new Uint32Array(Math.max(8, Math.min(64, length)));
    crypto.getRandomValues(bytes);
    setOutput([...bytes].map((n) => alphabet[n % alphabet.length]).join(""));
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={generate}>
            Generate
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Label htmlFor="pw-length">Length</Label>
      <Input
        id="pw-length"
        type="number"
        min={8}
        max={64}
        value={length}
        onChange={(e) => setLength(Number(e.target.value) || 16)}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={symbols}
          onChange={(e) => setSymbols(e.target.checked)}
        />
        Include symbols
      </label>
      <Input value={output} readOnly className="font-mono" />
    </Panel>
  );
}

export function TimestampConverterTool() {
  const [unix, setUnix] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [iso, setIso] = useState(() => new Date().toISOString());
  const [error, setError] = useState("");

  function fromUnix() {
    const value = Number(unix);
    if (!Number.isFinite(value)) {
      setError("Unix timestamp must be a number.");
      return;
    }
    const ms = Math.abs(value) < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) {
      setError("Invalid timestamp.");
      return;
    }
    setIso(date.toISOString());
    setError("");
  }

  function fromIso() {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      setError("Invalid ISO date.");
      return;
    }
    setUnix(Math.floor(date.getTime() / 1000).toString());
    setError("");
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={fromUnix}>
            Unix → ISO
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={fromIso}>
            ISO → Unix
          </Button>
        </>
      }
    >
      <Label htmlFor="unix">Unix timestamp</Label>
      <Input id="unix" value={unix} onChange={(e) => setUnix(e.target.value)} />
      <Label htmlFor="iso">ISO date</Label>
      <Input id="iso" value={iso} onChange={(e) => setIso(e.target.value)} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0);
      break;
    case gn:
      h = (bn - rn) / d + 2;
      break;
    default:
      h = (rn - gn) / d + 4;
  }
  h /= 6;
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#3B82F6");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <Panel>
      <Label htmlFor="hex">HEX</Label>
      <div className="flex gap-3">
        <Input id="hex" value={hex} onChange={(e) => setHex(e.target.value)} />
        <div
          className="size-9 rounded-lg border border-border"
          style={{ backgroundColor: rgb ? hex : "transparent" }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          label="RGB"
          value={rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "Invalid"}
        />
        <Stat
          label="HSL"
          value={hsl ? `${hsl.h}°, ${hsl.s}%, ${hsl.l}%` : "Invalid"}
        />
      </div>
    </Panel>
  );
}

export function CsvToJsonTool() {
  const [input, setInput] = useState("name,role\nOshaka,Engineer\n");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    try {
      const lines = input
        .trim()
        .split(/\r?\n/)
        .filter(Boolean);
      if (lines.length < 2) throw new Error("Provide a header row and at least one data row.");
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        return Object.fromEntries(headers.map((header, i) => [header, cols[i] ?? ""]));
      });
      setOutput(JSON.stringify(rows, null, 2));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    }
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={convert}>
            Convert
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-36 font-mono text-sm" />
      <Textarea value={output} readOnly className="min-h-36 font-mono text-sm" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("\\b\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Hello world from Oshaka");
  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      return {
        error: "",
        matches: [...text.matchAll(regex)].map((match) => match[0]),
      };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "Invalid regex",
        matches: [] as string[],
      };
    }
  }, [pattern, flags, text]);

  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Pattern" />
        <Input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="Flags" />
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-32" />
      {result.error ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <div className="rounded-xl border border-border/70 p-4 text-sm">
          <p className="text-muted-foreground">{result.matches.length} match(es)</p>
          <ul className="mt-2 space-y-1 font-mono">
            {result.matches.map((match, index) => (
              <li key={`${match}-${index}`}>{match}</li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  function decodePart(part: string) {
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return JSON.stringify(JSON.parse(atob(padded)), null, 2);
  }

  function decode() {
    try {
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("JWT must include header and payload segments.");
      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to decode JWT");
    }
  }

  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" onClick={decode}>
            Decode
          </Button>
          <CopyButton value={payload} label="Copy payload" />
        </>
      }
    >
      <Textarea value={token} onChange={(e) => setToken(e.target.value)} className="min-h-28 font-mono text-xs" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
      <Label>Header</Label>
      <Textarea value={header} readOnly className="min-h-28 font-mono text-xs" />
      <Label>Payload</Label>
      <Textarea value={payload} readOnly className="min-h-28 font-mono text-xs" />
      <p className="text-xs text-muted-foreground">
        Signature verification is intentionally not performed.
      </p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function TokenEstimatorTool() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const estimate = Math.max(0, Math.ceil(chars / 4));
  const altEstimate = Math.max(0, Math.ceil(words * 1.3));

  return (
    <Panel>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-40"
        placeholder="Paste prompt or document text..."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Characters" value={chars} />
        <Stat label="Words" value={words} />
        <Stat label="Estimate (chars/4)" value={estimate} />
        <Stat label="Estimate (words×1.3)" value={altEstimate} />
      </div>
      <p className="text-xs text-muted-foreground">
        Heuristic only. Exact tokenization depends on the target model family.
        Assumptions dated 2026-11.
      </p>
    </Panel>
  );
}
