"use client";

import { useMemo, useState } from "react";
import { dump as yamlDump, load as yamlLoad } from "js-yaml";
import { format as formatSql } from "sql-formatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/features/tools/components/copy-button";
import { Note, Panel, Stat } from "@/features/tools/components/tool-ui";
import {
  columnValues,
  mean,
  numericColumn,
  parseCsv,
  pearson,
  stdDev,
} from "@/features/tools/lib/csv";
import { safeMarkdownPreview } from "@/lib/security/sanitize";

export function TextSorterTool() {
  const [text, setText] = useState("banana\napple\ncarrot");
  const [desc, setDesc] = useState(false);
  const output = useMemo(() => {
    const lines = text.split("\n");
    const sorted = [...lines].sort((a, b) =>
      desc ? b.localeCompare(a) : a.localeCompare(b)
    );
    return sorted.join("\n");
  }, [text, desc]);
  return (
    <Panel
      actions={
        <>
          <Button type="button" size="sm" variant="outline" onClick={() => setDesc((v) => !v)}>
            {desc ? "Descending" : "Ascending"}
          </Button>
          <CopyButton value={output} />
        </>
      }
    >
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-36" />
      <Textarea value={output} readOnly className="min-h-36" />
    </Panel>
  );
}

export function ReadabilityCheckerTool() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = Math.max(1, (text.match(/[.!?]+/g) ?? []).length);
    const syllables = Math.max(
      1,
      (text.toLowerCase().match(/[aeiouy]+/g) ?? []).length
    );
    const flesch =
      words === 0
        ? 0
        : 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return {
      words,
      sentences,
      score: Math.round(flesch * 10) / 10,
    };
  }, [text]);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-40" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Words" value={stats.words} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Flesch-like score" value={stats.score} />
      </div>
      <Note>Heuristic readability estimate for drafting support only.</Note>
    </Panel>
  );
}

export function MarkdownEditorTool() {
  const [md, setMd] = useState("# Hello\n\n**Bold** and `code`.");
  const html = useMemo(() => safeMarkdownPreview(md), [md]);
  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea value={md} onChange={(e) => setMd(e.target.value)} className="min-h-56 font-mono text-sm" />
        <div
          className="min-h-56 rounded-xl border border-border/70 bg-background/40 p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <Note>Lightweight local preview — not a full Markdown engine.</Note>
    </Panel>
  );
}

export function XmlFormatterTool() {
  const [input, setInput] = useState("<root><item>1</item><item>2</item></root>");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function format() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
      const serialized = new XMLSerializer().serializeToString(doc);
      setOutput(serialized.replace(/></g, ">\n<"));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Format failed");
    }
  }
  return (
    <Panel actions={<><Button size="sm" onClick={format}>Format</Button><CopyButton value={output} /></>}>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-36 font-mono text-sm" />
      <Textarea value={output} readOnly className="min-h-36 font-mono text-sm" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Panel>
  );
}

export function YamlConverterTool() {
  const [input, setInput] = useState("name: Oshaka\nrole: Engineer");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel
      actions={
        <>
          <Button
            size="sm"
            onClick={() => {
              try {
                const data = yamlLoad(input);
                setOutput(JSON.stringify(data, null, 2));
                setError("");
              } catch (err) {
                setError(err instanceof Error ? err.message : "YAML parse failed");
              }
            }}
          >
            YAML → JSON
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              try {
                setOutput(yamlDump(JSON.parse(input)));
                setError("");
              } catch (err) {
                setError(err instanceof Error ? err.message : "JSON parse failed");
              }
            }}
          >
            JSON → YAML
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

export function SqlFormatterTool() {
  const [input, setInput] = useState("select id,name from users where active=true order by name");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel
      actions={
        <>
          <Button
            size="sm"
            onClick={() => {
              try {
                setOutput(formatSql(input, { language: "sql" }));
                setError("");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Format failed");
              }
            }}
          >
            Format SQL
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

export function CronGeneratorTool() {
  const [minute, setMinute] = useState("*/5");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");
  const expr = `${minute} ${hour} ${dom} ${month} ${dow}`;
  return (
    <Panel actions={<CopyButton value={expr} />}>
      <div className="grid gap-3 sm:grid-cols-5">
        {[
          ["Minute", minute, setMinute],
          ["Hour", hour, setHour],
          ["Day", dom, setDom],
          ["Month", month, setMonth],
          ["Weekday", dow, setDow],
        ].map(([label, value, setter]) => (
          <div key={String(label)}>
            <Label>{label as string}</Label>
            <Input
              value={value as string}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
            />
          </div>
        ))}
      </div>
      <Input value={expr} readOnly className="font-mono" />
      <Note>Expression only — validate against your scheduler dialect.</Note>
    </Panel>
  );
}

export function CssGradientGeneratorTool() {
  const [from, setFrom] = useState("#3B82F6");
  const [to, setTo] = useState("#8B5CF6");
  const [angle, setAngle] = useState(135);
  const css = `background: linear-gradient(${angle}deg, ${from}, ${to});`;
  return (
    <Panel actions={<CopyButton value={css} />}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>From</Label><Input value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><Label>To</Label><Input value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div><Label>Angle</Label><Input type="number" value={angle} onChange={(e) => setAngle(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="h-32 rounded-2xl border border-border/70" style={{ background: `linear-gradient(${angle}deg, ${from}, ${to})` }} />
      <Input value={css} readOnly className="font-mono text-xs" />
    </Panel>
  );
}

export function HtmlPlaygroundTool() {
  const [html, setHtml] = useState("<h1>Hello</h1><p>Playground preview</p>");
  return (
    <Panel>
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea value={html} onChange={(e) => setHtml(e.target.value)} className="min-h-56 font-mono text-sm" />
        <iframe title="HTML preview" className="min-h-56 rounded-xl border border-border/70 bg-white" srcDoc={html} sandbox="" />
      </div>
      <Note>Sandboxed preview with scripts disabled.</Note>
    </Panel>
  );
}

export function GitCommandReferenceTool() {
  const [q, setQ] = useState("");
  const commands = [
    { cmd: "git status", tip: "Show working tree status" },
    { cmd: "git add .", tip: "Stage all changes" },
    { cmd: "git commit -m \"message\"", tip: "Create a commit" },
    { cmd: "git push origin main", tip: "Push branch to remote" },
    { cmd: "git pull --rebase", tip: "Update branch with rebase" },
    { cmd: "git checkout -b feature", tip: "Create and switch branch" },
    { cmd: "git log --oneline", tip: "Compact commit history" },
    { cmd: "git stash", tip: "Temporarily shelve changes" },
  ];
  const filtered = commands.filter(
    (item) =>
      item.cmd.toLowerCase().includes(q.toLowerCase()) ||
      item.tip.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <Panel>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search git commands..." />
      <ul className="space-y-2">
        {filtered.map((item) => (
          <li key={item.cmd} className="rounded-xl border border-border/70 bg-background/40 p-3">
            <code className="text-sm text-primary">{item.cmd}</code>
            <p className="mt-1 text-sm text-muted-foreground">{item.tip}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function DockerfileGeneratorTool() {
  const [runtime, setRuntime] = useState("node:20-alpine");
  const [port, setPort] = useState("3000");
  const [start, setStart] = useState("npm run start");
  const output = `FROM ${runtime}\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE ${port}\nCMD [${start
    .split(" ")
    .map((part) => `"${part}"`)
    .join(", ")}]`;
  return (
    <Panel actions={<CopyButton value={output} />}>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Base image</Label><Input value={runtime} onChange={(e) => setRuntime(e.target.value)} /></div>
        <div><Label>Port</Label><Input value={port} onChange={(e) => setPort(e.target.value)} /></div>
        <div><Label>Start command</Label><Input value={start} onChange={(e) => setStart(e.target.value)} /></div>
      </div>
      <Textarea value={output} readOnly className="min-h-48 font-mono text-sm" />
    </Panel>
  );
}

function useCsv(initial: string) {
  const [text, setText] = useState(initial);
  const table = useMemo(() => parseCsv(text), [text]);
  return { text, setText, table };
}

export function CsvViewerTool() {
  const { text, setText, table } = useCsv("name,score\nA,10\nB,20\nC,15");
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <div className="overflow-auto rounded-xl border border-border/70">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {table.headers.map((header) => (
                <th key={header} className="border-b border-border/60 px-3 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={`${i}-${j}`} className="border-b border-border/40 px-3 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function CsvAnalyzerTool() {
  const { text, setText, table } = useCsv("name,score\nA,10\nB,20\nC,");
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Columns" value={table.headers.length} />
        <Stat label="Rows" value={table.rows.length} />
        <Stat label="Cells" value={table.headers.length * table.rows.length} />
      </div>
      <ul className="space-y-2 text-sm">
        {table.headers.map((header, index) => {
          const values = columnValues(table, index);
          const missing = values.filter((v) => !v).length;
          const nums = numericColumn(table, index);
          return (
            <li key={header} className="rounded-xl border border-border/70 p-3">
              <p className="font-medium">{header}</p>
              <p className="text-muted-foreground">
                Missing: {missing} · Numeric samples: {nums.length}
                {nums.length ? ` · Mean: ${mean(nums).toFixed(2)}` : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function DataProfilerTool() {
  return <CsvAnalyzerTool />;
}

export function MissingValueAnalyzerTool() {
  const { text, setText, table } = useCsv("a,b\n1,\n2,3\n,4");
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {table.headers.map((header, index) => {
          const values = columnValues(table, index);
          const missing = values.filter((v) => !v).length;
          const pct = values.length ? ((missing / values.length) * 100).toFixed(1) : "0.0";
          return <Stat key={header} label={header} value={`${missing} (${pct}%)`} />;
        })}
      </div>
    </Panel>
  );
}

export function DuplicateDetectorTool() {
  const { text, setText, table } = useCsv("id,name\n1,A\n2,B\n1,A");
  const dupes = useMemo(() => {
    const seen = new Map<string, number>();
    const duplicates: string[] = [];
    table.rows.forEach((row) => {
      const key = row.join("|");
      const count = (seen.get(key) ?? 0) + 1;
      seen.set(key, count);
      if (count === 2) duplicates.push(key);
    });
    return duplicates;
  }, [table]);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <Stat label="Duplicate row patterns" value={dupes.length} />
      <Textarea value={dupes.join("\n")} readOnly className="min-h-28 font-mono text-xs" />
    </Panel>
  );
}

export function DataCleaningTool() {
  const [text, setText] = useState(" Name , Age \n Ada , 30 \n Ada , 30 \n Bob,  ");
  const cleaned = useMemo(() => {
    const table = parseCsv(text);
    const seen = new Set<string>();
    const rows = table.rows
      .map((row) => row.map((cell) => cell.trim()))
      .filter((row) => {
        const key = row.join("|");
        if (seen.has(key)) return false;
        seen.add(key);
        return row.some(Boolean);
      });
    return [table.headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  }, [text]);
  return (
    <Panel actions={<CopyButton value={cleaned} />}>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <Textarea value={cleaned} readOnly className="min-h-28 font-mono text-sm" />
    </Panel>
  );
}

export function DescriptiveStatisticsTool() {
  const [text, setText] = useState("10,20,30,40,50");
  const values = text
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    sorted.length === 0
      ? 0
      : sorted.length % 2
        ? sorted[(sorted.length - 1) / 2]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-24" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Count" value={values.length} />
        <Stat label="Mean" value={mean(values).toFixed(2)} />
        <Stat label="Median" value={median} />
        <Stat label="Min" value={sorted[0] ?? 0} />
        <Stat label="Std Dev" value={stdDev(values).toFixed(2)} />
      </div>
    </Panel>
  );
}

export function CorrelationCalculatorTool() {
  const { text, setText, table } = useCsv("x,y\n1,2\n2,4\n3,5\n4,8");
  const corr =
    table.headers.length >= 2
      ? pearson(numericColumn(table, 0), numericColumn(table, 1))
      : 0;
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <Stat label="Pearson correlation (col1 vs col2)" value={corr.toFixed(4)} />
    </Panel>
  );
}

export function OutlierDetectorTool() {
  const [text, setText] = useState("10,12,11,13,12,100");
  const values = text.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  const avg = mean(values);
  const sd = stdDev(values);
  const outliers = values.filter((v) => sd > 0 && Math.abs((v - avg) / sd) > 2);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-24" />
      <Stat label="Outliers (|z| > 2)" value={outliers.length} />
      <Input value={outliers.join(", ")} readOnly />
    </Panel>
  );
}

export function DataVisualizationTool() {
  const { text, setText, table } = useCsv("label,value\nA,10\nB,25\nC,15");
  const max = Math.max(1, ...numericColumn(table, 1));
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <div className="space-y-2">
        {table.rows.map((row) => (
          <div key={row.join("-")} className="grid grid-cols-[80px_1fr_40px] items-center gap-2 text-sm">
            <span>{row[0]}</span>
            <div className="h-3 rounded bg-muted">
              <div
                className="h-3 rounded bg-primary"
                style={{ width: `${(Number(row[1] || 0) / max) * 100}%` }}
              />
            </div>
            <span>{row[1]}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function PivotTableSimulatorTool() {
  const { text, setText, table } = useCsv("region,amount\nWest,10\nEast,20\nWest,5");
  const pivot = useMemo(() => {
    const map = new Map<string, number>();
    table.rows.forEach((row) => {
      const key = row[0] ?? "";
      map.set(key, (map.get(key) ?? 0) + Number(row[1] || 0));
    });
    return [...map.entries()];
  }, [table]);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <ul className="space-y-2 text-sm">
        {pivot.map(([key, value]) => (
          <li key={key} className="rounded-xl border border-border/70 px-3 py-2">
            {key}: {value}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

const FORMULAS: Record<string, { title: string; items: string[] }> = {
  excel: {
    title: "Excel",
    items: [
      "SUM(range)",
      "AVERAGE(range)",
      "VLOOKUP(lookup, table, col, FALSE)",
      "IF(condition, true, false)",
      "TEXT(value, format)",
    ],
  },
  dax: {
    title: "DAX",
    items: [
      "CALCULATE(expression, filters)",
      "SUMX(table, expression)",
      "RELATED(column)",
      "DATEADD(dates, -1, YEAR)",
      "DIVIDE(numerator, denominator)",
    ],
  },
  sql: {
    title: "SQL",
    items: [
      "SELECT cols FROM table WHERE condition",
      "GROUP BY col HAVING aggregate_condition",
      "INNER JOIN t2 ON t1.id = t2.id",
      "WINDOW functions: ROW_NUMBER() OVER (...)",
      "CTE: WITH cte AS (SELECT ...) SELECT ...",
    ],
  },
};

export function ExcelFormulaHelperTool() {
  return <ReferenceList items={FORMULAS.excel.items} />;
}
export function DaxFormulaHelperTool() {
  return <ReferenceList items={FORMULAS.dax.items} />;
}
export function SqlQueryHelperTool() {
  return <ReferenceList items={FORMULAS.sql.items} />;
}

function ReferenceList({ items }: { items: string[] }) {
  return (
    <Panel>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl border border-border/70 bg-background/40 px-3 py-2 font-mono text-sm">
            {item}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function DateTableGeneratorTool() {
  const [start, setStart] = useState("2026-01-01");
  const [days, setDays] = useState(30);
  const output = useMemo(() => {
    const rows = ["date,year,month,day"];
    const base = new Date(start);
    for (let i = 0; i < Math.min(366, Math.max(1, days)); i += 1) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      rows.push(
        `${d.toISOString().slice(0, 10)},${d.getUTCFullYear()},${d.getUTCMonth() + 1},${d.getUTCDate()}`
      );
    }
    return rows.join("\n");
  }, [start, days]);
  return (
    <Panel actions={<CopyButton value={output} />}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Start date</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
        <div><Label>Days</Label><Input type="number" value={days} onChange={(e) => setDays(Number(e.target.value) || 1)} /></div>
      </div>
      <Textarea value={output} readOnly className="min-h-48 font-mono text-xs" />
    </Panel>
  );
}

export function DataQualityReportTool() {
  const { text, setText, table } = useCsv("id,email\n1,a@x.com\n2,\n2,b@x.com");
  const report = useMemo(() => {
    const totalCells = table.headers.length * table.rows.length;
    let missing = 0;
    table.rows.forEach((row) => row.forEach((cell) => { if (!cell) missing += 1; }));
    const keys = new Set(table.rows.map((row) => row.join("|")));
    return {
      rows: table.rows.length,
      missing,
      completeness: totalCells ? (((totalCells - missing) / totalCells) * 100).toFixed(1) : "0.0",
      uniqueRows: keys.size,
    };
  }, [table]);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 font-mono text-sm" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Rows" value={report.rows} />
        <Stat label="Missing cells" value={report.missing} />
        <Stat label="Completeness %" value={report.completeness} />
        <Stat label="Unique rows" value={report.uniqueRows} />
      </div>
    </Panel>
  );
}
