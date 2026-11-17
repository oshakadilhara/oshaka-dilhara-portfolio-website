"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/features/tools/components/copy-button";
import { Note, Panel, Stat } from "@/features/tools/components/tool-ui";
import {
  accuracy,
  bagOfWordsVector,
  cosineSimilarity,
  estimateTokens,
  f1Score,
  precision,
  recall,
  tokenize,
  trainTestSplit,
} from "@/features/tools/lib/metrics";
import {
  SL_ASSUMPTIONS,
  epfEmployee,
  epfEmployer,
  estimateElectricityBill,
  etfEmployer,
  fuelCost,
  takeHomeSalary,
  vatExclusive,
  vatInclusive,
} from "@/features/tools/lib/sri-lanka";

export function PromptBuilderTool() {
  const [role, setRole] = useState("You are a senior AI engineer.");
  const [task, setTask] = useState("Explain RAG evaluation.");
  const [constraints, setConstraints] = useState("Be concise. Use bullet points.");
  const [format, setFormat] = useState("Markdown");
  const prompt = `${role}\n\nTask: ${task}\n\nConstraints:\n${constraints}\n\nOutput format: ${format}`;
  return (
    <Panel actions={<CopyButton value={prompt} />}>
      <Label>Role</Label><Textarea value={role} onChange={(e) => setRole(e.target.value)} />
      <Label>Task</Label><Textarea value={task} onChange={(e) => setTask(e.target.value)} />
      <Label>Constraints</Label><Textarea value={constraints} onChange={(e) => setConstraints(e.target.value)} />
      <Label>Output format</Label><Input value={format} onChange={(e) => setFormat(e.target.value)} />
      <Textarea value={prompt} readOnly className="min-h-40" />
    </Panel>
  );
}

export function AiCostCalculatorTool() {
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [inputPrice, setInputPrice] = useState(0.5);
  const [outputPrice, setOutputPrice] = useState(1.5);
  const cost =
    (inputTokens / 1_000_000) * inputPrice + (outputTokens / 1_000_000) * outputPrice;
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Input tokens</Label><Input type="number" value={inputTokens} onChange={(e) => setInputTokens(Number(e.target.value) || 0)} /></div>
        <div><Label>Output tokens</Label><Input type="number" value={outputTokens} onChange={(e) => setOutputTokens(Number(e.target.value) || 0)} /></div>
        <div><Label>Input $/1M</Label><Input type="number" value={inputPrice} onChange={(e) => setInputPrice(Number(e.target.value) || 0)} /></div>
        <div><Label>Output $/1M</Label><Input type="number" value={outputPrice} onChange={(e) => setOutputPrice(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Estimated cost (USD)" value={cost.toFixed(6)} />
      <Note>Bring your own pricing. This is arithmetic only.</Note>
    </Panel>
  );
}

export function EmbeddingExplorerTool() {
  const [text, setText] = useState("retrieval augmented generation systems");
  const tokens = tokenize(text);
  const vocab = [...new Set(tokens)];
  const vector = bagOfWordsVector(text, vocab);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28" />
      <p className="text-sm text-muted-foreground">Vocab: {vocab.join(", ") || "—"}</p>
      <Input value={`[${vector.join(", ")}]`} readOnly className="font-mono text-xs" />
      <Note>Educational bag-of-words vectors, not neural embeddings.</Note>
    </Panel>
  );
}

export function CosineSimilarityCalculatorTool() {
  const [a, setA] = useState("1,0,1");
  const [b, setB] = useState("1,1,0");
  const va = a.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  const vb = b.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  return (
    <Panel>
      <Label>Vector A</Label><Input value={a} onChange={(e) => setA(e.target.value)} />
      <Label>Vector B</Label><Input value={b} onChange={(e) => setB(e.target.value)} />
      <Stat label="Cosine similarity" value={cosineSimilarity(va, vb).toFixed(6)} />
    </Panel>
  );
}

export function TextSimilarityTool() {
  const [left, setLeft] = useState("machine learning models");
  const [right, setRight] = useState("learning machine systems");
  const vocab = [...new Set([...tokenize(left), ...tokenize(right)])];
  const score = cosineSimilarity(bagOfWordsVector(left, vocab), bagOfWordsVector(right, vocab));
  return (
    <Panel>
      <Textarea value={left} onChange={(e) => setLeft(e.target.value)} />
      <Textarea value={right} onChange={(e) => setRight(e.target.value)} />
      <Stat label="Similarity" value={score.toFixed(4)} />
    </Panel>
  );
}

export function ChunkSizeCalculatorTool() {
  const [chars, setChars] = useState(12000);
  const [chunk, setChunk] = useState(800);
  const [overlap, setOverlap] = useState(100);
  const step = Math.max(1, chunk - overlap);
  const chunks = chunk <= 0 ? 0 : Math.ceil(Math.max(0, chars - overlap) / step);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Document chars</Label><Input type="number" value={chars} onChange={(e) => setChars(Number(e.target.value) || 0)} /></div>
        <div><Label>Chunk size</Label><Input type="number" value={chunk} onChange={(e) => setChunk(Number(e.target.value) || 0)} /></div>
        <div><Label>Overlap</Label><Input type="number" value={overlap} onChange={(e) => setOverlap(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Estimated chunks" value={chunks} />
    </Panel>
  );
}

export function RagVisualizerTool() {
  const stages = ["Ingest", "Chunk", "Embed", "Retrieve", "Generate"];
  const [active, setActive] = useState(0);
  return (
    <Panel>
      <div className="flex flex-wrap gap-2">
        {stages.map((stage, index) => (
          <Button key={stage} size="sm" variant={index === active ? "default" : "outline"} onClick={() => setActive(index)}>
            {index + 1}. {stage}
          </Button>
        ))}
      </div>
      <div className="rounded-xl border border-border/70 bg-background/40 p-4 text-sm text-muted-foreground">
        Current stage: <span className="text-foreground">{stages[active]}</span>. This local visualizer demonstrates RAG flow without calling an API.
      </div>
    </Panel>
  );
}

export function ConfusionMatrixTool() {
  const [tp, setTp] = useState(40);
  const [fp, setFp] = useState(10);
  const [tn, setTn] = useState(35);
  const [fn, setFn] = useState(15);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-4">
        <div><Label>TP</Label><Input type="number" value={tp} onChange={(e) => setTp(Number(e.target.value) || 0)} /></div>
        <div><Label>FP</Label><Input type="number" value={fp} onChange={(e) => setFp(Number(e.target.value) || 0)} /></div>
        <div><Label>TN</Label><Input type="number" value={tn} onChange={(e) => setTn(Number(e.target.value) || 0)} /></div>
        <div><Label>FN</Label><Input type="number" value={fn} onChange={(e) => setFn(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Accuracy" value={accuracy(tp, tn, fp, fn).toFixed(4)} />
        <Stat label="Precision" value={precision(tp, fp).toFixed(4)} />
        <Stat label="Recall" value={recall(tp, fn).toFixed(4)} />
        <Stat label="F1" value={f1Score(tp, fp, fn).toFixed(4)} />
      </div>
    </Panel>
  );
}

export function PrecisionCalculatorTool() {
  const [tp, setTp] = useState(40);
  const [fp, setFp] = useState(10);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>TP</Label><Input type="number" value={tp} onChange={(e) => setTp(Number(e.target.value) || 0)} /></div>
        <div><Label>FP</Label><Input type="number" value={fp} onChange={(e) => setFp(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Precision" value={precision(tp, fp).toFixed(6)} />
    </Panel>
  );
}

export function RecallCalculatorTool() {
  const [tp, setTp] = useState(40);
  const [fn, setFn] = useState(15);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>TP</Label><Input type="number" value={tp} onChange={(e) => setTp(Number(e.target.value) || 0)} /></div>
        <div><Label>FN</Label><Input type="number" value={fn} onChange={(e) => setFn(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Recall" value={recall(tp, fn).toFixed(6)} />
    </Panel>
  );
}

export function F1CalculatorTool() {
  const [tp, setTp] = useState(40);
  const [fp, setFp] = useState(10);
  const [fn, setFn] = useState(15);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>TP</Label><Input type="number" value={tp} onChange={(e) => setTp(Number(e.target.value) || 0)} /></div>
        <div><Label>FP</Label><Input type="number" value={fp} onChange={(e) => setFp(Number(e.target.value) || 0)} /></div>
        <div><Label>FN</Label><Input type="number" value={fn} onChange={(e) => setFn(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="F1" value={f1Score(tp, fp, fn).toFixed(6)} />
    </Panel>
  );
}

export function RocVisualizerTool() {
  const points = [
    [0, 0],
    [0.1, 0.4],
    [0.2, 0.65],
    [0.4, 0.8],
    [0.7, 0.92],
    [1, 1],
  ];
  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x * 280 + 20} ${220 - y * 180}`)
    .join(" ");
  return (
    <Panel>
      <svg viewBox="0 0 320 240" className="w-full rounded-xl border border-border/70 bg-background/40">
        <path d={path} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" />
        <line x1="20" y1="220" x2="300" y2="40" stroke="currentColor" className="text-muted-foreground/40" strokeDasharray="4" />
      </svg>
      <Note>Illustrative ROC curve for teaching. Replace points with your model scores as needed.</Note>
    </Panel>
  );
}

export function TrainTestSplitTool() {
  const [text, setText] = useState("a\nb\nc\nd\ne\nf\ng\nh");
  const [ratio, setRatio] = useState(0.75);
  const items = text.split("\n");
  const split = trainTestSplit(items, ratio);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28" />
      <Label>Train ratio</Label>
      <Input type="number" step="0.05" min={0.05} max={0.95} value={ratio} onChange={(e) => setRatio(Number(e.target.value) || 0.75)} />
      <div className="grid gap-3 md:grid-cols-2">
        <Textarea value={split.train.join("\n")} readOnly className="min-h-28" />
        <Textarea value={split.test.join("\n")} readOnly className="min-h-28" />
      </div>
    </Panel>
  );
}

export function NeuralNetworkVisualizerTool() {
  const [layers, setLayers] = useState("4,6,3");
  const sizes = layers.split(",").map(Number).filter((n) => n > 0 && n < 20);
  return (
    <Panel>
      <Label>Layer sizes</Label>
      <Input value={layers} onChange={(e) => setLayers(e.target.value)} />
      <svg viewBox="0 0 480 240" className="w-full rounded-xl border border-border/70 bg-background/40">
        {sizes.map((size, layerIndex) =>
          Array.from({ length: size }).map((_, nodeIndex) => {
            const x = 60 + layerIndex * 120;
            const y = 40 + nodeIndex * (160 / Math.max(size - 1, 1));
            return <circle key={`${layerIndex}-${nodeIndex}`} cx={x} cy={y} r="8" className="fill-primary/80" />;
          })
        )}
      </svg>
    </Panel>
  );
}

export function TemperatureExplorerTool() {
  const [temp, setTemp] = useState(0.7);
  const logits = [2.0, 1.0, 0.5];
  const probs = useMemo(() => {
    const scaled = logits.map((v) => Math.exp(v / Math.max(0.05, temp)));
    const sum = scaled.reduce((a, b) => a + b, 0);
    return scaled.map((v) => v / sum);
  }, [temp]);
  return (
    <Panel>
      <Label>Temperature</Label>
      <Input type="number" step="0.1" min={0.1} max={2} value={temp} onChange={(e) => setTemp(Number(e.target.value) || 0.7)} />
      <div className="grid gap-3 sm:grid-cols-3">
        {probs.map((p, i) => (
          <Stat key={i} label={`Token ${i + 1}`} value={p.toFixed(4)} />
        ))}
      </div>
    </Panel>
  );
}

export function MlMetricsTool() {
  return <ConfusionMatrixTool />;
}

export function AgentWorkflowDesignerTool() {
  const [steps, setSteps] = useState("Researcher\nCritic\nSynthesizer\nReporter");
  return (
    <Panel actions={<CopyButton value={steps} />}>
      <Textarea value={steps} onChange={(e) => setSteps(e.target.value)} className="min-h-40" />
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        {steps.split("\n").filter(Boolean).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </Panel>
  );
}

export function VectorSearchExplorerTool() {
  const [query, setQuery] = useState("vector search retrieval");
  const [docs, setDocs] = useState("RAG retrieves documents\nImage classifiers detect objects\nVector databases store embeddings");
  const ranked = useMemo(() => {
    const list = docs.split("\n").filter(Boolean);
    const vocab = [...new Set(list.flatMap(tokenize).concat(tokenize(query)))];
    const qv = bagOfWordsVector(query, vocab);
    return list
      .map((doc) => ({ doc, score: cosineSimilarity(qv, bagOfWordsVector(doc, vocab)) }))
      .sort((a, b) => b.score - a.score);
  }, [query, docs]);
  return (
    <Panel>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Query" />
      <Textarea value={docs} onChange={(e) => setDocs(e.target.value)} className="min-h-28" />
      <ul className="space-y-2 text-sm">
        {ranked.map((item) => (
          <li key={item.doc} className="rounded-xl border border-border/70 px-3 py-2">
            {item.score.toFixed(4)} — {item.doc}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function QrCodeGeneratorTool() {
  const [text, setText] = useState("https://oshakadilhara.com");
  const [dataUrl, setDataUrl] = useState("");
  useEffect(() => {
    QRCode.toDataURL(text || " ")
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [text]);
  return (
    <Panel>
      <Input value={text} onChange={(e) => setText(e.target.value)} />
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="QR code" className="size-48 rounded-xl border border-border/70 bg-white p-2" />
      ) : null}
      {dataUrl ? <a className="text-sm text-primary underline" href={dataUrl} download="qrcode.png">Download PNG</a> : null}
    </Panel>
  );
}

async function readFileAsDataURL(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageToBase64Tool() {
  const [output, setOutput] = useState("");
  return (
    <Panel actions={<CopyButton value={output} />}>
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setOutput(await readFileAsDataURL(file));
        }}
      />
      <Textarea value={output} readOnly className="min-h-40 font-mono text-xs" />
    </Panel>
  );
}

function useImageCanvas() {
  const [preview, setPreview] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  async function load(file: File) {
    const url = await readFileAsDataURL(file);
    const image = new Image();
    image.src = url;
    await image.decode();
    imgRef.current = image;
    setPreview(url);
  }
  function exportCanvas(
    width: number,
    height: number,
    type: string,
    quality: number
  ) {
    const image = imgRef.current;
    if (!image) return "";
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL(type, quality);
  }
  return { preview, load, exportCanvas, imgRef };
}

export function ImageCompressorTool() {
  const { preview, load, exportCanvas, imgRef } = useImageCanvas();
  const [quality, setQuality] = useState(0.7);
  const [out, setOut] = useState("");
  return (
    <Panel>
      <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      <Label>Quality</Label>
      <Input type="number" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value) || 0.7)} />
      <Button
        size="sm"
        onClick={() => {
          const image = imgRef.current;
          if (!image) return;
          setOut(exportCanvas(image.width, image.height, "image/jpeg", quality));
        }}
      >
        Compress
      </Button>
      {preview ? <p className="text-xs text-muted-foreground">Loaded preview ready.</p> : null}
      {out ? <a className="text-sm text-primary underline" href={out} download="compressed.jpg">Download compressed JPEG</a> : null}
    </Panel>
  );
}

export function ImageResizerTool() {
  const { load, exportCanvas, imgRef } = useImageCanvas();
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [out, setOut] = useState("");
  return (
    <Panel>
      <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Width</Label><Input type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 1)} /></div>
        <div><Label>Height</Label><Input type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 1)} /></div>
      </div>
      <Button size="sm" onClick={() => setOut(exportCanvas(w, h, "image/png", 1))} disabled={!imgRef.current && !out}>
        Resize
      </Button>
      {out ? <a className="text-sm text-primary underline" href={out} download="resized.png">Download resized PNG</a> : null}
    </Panel>
  );
}

export function ImageFormatConverterTool() {
  const { load, exportCanvas, imgRef } = useImageCanvas();
  const [format, setFormat] = useState("image/png");
  const [out, setOut] = useState("");
  return (
    <Panel>
      <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      <Label>Target format</Label>
      <select className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm" value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="image/png">PNG</option>
        <option value="image/jpeg">JPEG</option>
        <option value="image/webp">WebP</option>
      </select>
      <Button
        size="sm"
        onClick={() => {
          const image = imgRef.current;
          if (!image) return;
          setOut(exportCanvas(image.width, image.height, format, 0.92));
        }}
      >
        Convert
      </Button>
      {out ? <a className="text-sm text-primary underline" href={out} download={`converted.${format.split("/")[1]}`}>Download</a> : null}
    </Panel>
  );
}

export function PdfMergerTool() {
  const [url, setUrl] = useState("");
  return (
    <Panel>
      <Input
        type="file"
        accept="application/pdf"
        multiple
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])];
          const merged = await PDFDocument.create();
          for (const file of files) {
            const bytes = await file.arrayBuffer();
            const doc = await PDFDocument.load(bytes);
            const pages = await merged.copyPages(doc, doc.getPageIndices());
            pages.forEach((page) => merged.addPage(page));
          }
          const out = await merged.save();
          setUrl(URL.createObjectURL(new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" })));
        }}
      />
      {url ? <a className="text-sm text-primary underline" href={url} download="merged.pdf">Download merged PDF</a> : null}
    </Panel>
  );
}

export function PdfSplitterTool() {
  const [url, setUrl] = useState("");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  return (
    <Panel>
      <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>From page</Label><Input type="number" min={1} value={from} onChange={(e) => setFrom(Number(e.target.value) || 1)} /></div>
        <div><Label>To page</Label><Input type="number" min={1} value={to} onChange={(e) => setTo(Number(e.target.value) || 1)} /></div>
      </div>
      <Button
        size="sm"
        onClick={async () => {
          if (!file) return;
          const src = await PDFDocument.load(await file.arrayBuffer());
          const outDoc = await PDFDocument.create();
          const start = Math.max(0, from - 1);
          const end = Math.min(src.getPageCount() - 1, to - 1);
          const indices = [];
          for (let i = start; i <= end; i += 1) indices.push(i);
          const pages = await outDoc.copyPages(src, indices);
          pages.forEach((page) => outDoc.addPage(page));
          const bytes = await outDoc.save();
          setUrl(URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })));
        }}
      >
        Split
      </Button>
      {url ? <a className="text-sm text-primary underline" href={url} download="split.pdf">Download split PDF</a> : null}
    </Panel>
  );
}

export function PdfPageCounterTool() {
  const [count, setCount] = useState<number | null>(null);
  return (
    <Panel>
      <Input
        type="file"
        accept="application/pdf"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const doc = await PDFDocument.load(await file.arrayBuffer());
          setCount(doc.getPageCount());
        }}
      />
      <Stat label="Pages" value={count ?? "—"} />
    </Panel>
  );
}

export function PdfMetadataViewerTool() {
  const [meta, setMeta] = useState("");
  return (
    <Panel>
      <Input
        type="file"
        accept="application/pdf"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const doc = await PDFDocument.load(await file.arrayBuffer());
          setMeta(
            JSON.stringify(
              {
                pageCount: doc.getPageCount(),
                title: doc.getTitle() ?? "",
                author: doc.getAuthor() ?? "",
                subject: doc.getSubject() ?? "",
                creator: doc.getCreator() ?? "",
              },
              null,
              2
            )
          );
        }}
      />
      <Textarea value={meta} readOnly className="min-h-40 font-mono text-xs" />
    </Panel>
  );
}

export function QrCodeReaderTool() {
  const [result, setResult] = useState("");
  return (
    <Panel>
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const url = await readFileAsDataURL(file);
          const image = new Image();
          image.src = url;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(image, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          setResult(code?.data ?? "No QR code detected.");
        }}
      />
      <Textarea value={result} readOnly className="min-h-28" />
    </Panel>
  );
}

export function FileSizeConverterTool() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("MB");
  const factor: Record<string, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
  const bytes = value * (factor[from] ?? 1);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Value</Label><Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} /></div>
        <div>
          <Label>Unit</Label>
          <select className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm" value={from} onChange={(e) => setFrom(e.target.value)}>
            {Object.keys(factor).map((unit) => <option key={unit}>{unit}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {Object.entries(factor).map(([unit, mult]) => (
          <Stat key={unit} label={unit} value={(bytes / mult).toFixed(4)} />
        ))}
      </div>
    </Panel>
  );
}

export function ExifViewerTool() {
  const [info, setInfo] = useState("");
  return (
    <Panel>
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setInfo(
            JSON.stringify(
              {
                name: file.name,
                type: file.type,
                sizeBytes: file.size,
                lastModified: new Date(file.lastModified).toISOString(),
                note: "Browser JS cannot reliably read all EXIF fields without a specialized parser. File metadata shown here.",
              },
              null,
              2
            )
          );
        }}
      />
      <Textarea value={info} readOnly className="min-h-40 font-mono text-xs" />
    </Panel>
  );
}

export function ExifRemoverTool() {
  const { load, exportCanvas, imgRef } = useImageCanvas();
  const [out, setOut] = useState("");
  return (
    <Panel>
      <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && load(e.target.files[0])} />
      <Button
        size="sm"
        onClick={() => {
          const image = imgRef.current;
          if (!image) return;
          setOut(exportCanvas(image.width, image.height, "image/jpeg", 0.92));
        }}
      >
        Strip metadata via re-encode
      </Button>
      {out ? <a className="text-sm text-primary underline" href={out} download="no-exif.jpg">Download</a> : null}
      <Note>Canvas re-encoding removes EXIF by rewriting pixel data.</Note>
    </Panel>
  );
}

export function ScientificCalculatorTool() {
  const [expr, setExpr] = useState("sin(0.5)+2^3");
  const [result, setResult] = useState("");
  function evaluate() {
    try {
      const normalized = expr
        .replace(/\^/g, "**")
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/log/g, "Math.log");
      // Controlled local eval for calculator UX.
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${normalized});`)();
      setResult(String(value));
    } catch {
      setResult("Error");
    }
  }
  return (
    <Panel actions={<Button size="sm" onClick={evaluate}>Evaluate</Button>}>
      <Input value={expr} onChange={(e) => setExpr(e.target.value)} />
      <Stat label="Result" value={result || "—"} />
    </Panel>
  );
}

export function MatrixCalculatorTool() {
  const [a, setA] = useState("1,2;3,4");
  const [b, setB] = useState("5,6;7,8");
  const parse = (text: string) =>
    text.split(";").map((row) => row.split(",").map(Number));
  const add = () => {
    const A = parse(a);
    const B = parse(b);
    return A.map((row, i) => row.map((val, j) => val + (B[i]?.[j] ?? 0)).join(",")).join(";");
  };
  return (
    <Panel actions={<CopyButton value={add()} />}>
      <Label>Matrix A (rows with ;)</Label><Input value={a} onChange={(e) => setA(e.target.value)} />
      <Label>Matrix B</Label><Input value={b} onChange={(e) => setB(e.target.value)} />
      <Input value={add()} readOnly />
      <Note>Addition only for equal-sized matrices.</Note>
    </Panel>
  );
}

export function EquationSolverTool() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [c, setC] = useState(11);
  const x = a === 0 ? null : (c - b) / a;
  return (
    <Panel>
      <p className="text-sm text-muted-foreground">Solve ax + b = c</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>a</Label><Input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} /></div>
        <div><Label>b</Label><Input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} /></div>
        <div><Label>c</Label><Input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} /></div>
      </div>
      <Stat label="x" value={x === null ? "Undefined" : x} />
    </Panel>
  );
}

export function PercentageCalculatorTool() {
  const [base, setBase] = useState(200);
  const [pct, setPct] = useState(15);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Base</Label><Input type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 0)} /></div>
        <div><Label>Percent</Label><Input type="number" value={pct} onChange={(e) => setPct(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Percent of base" value={((base * pct) / 100).toFixed(2)} />
        <Stat label="Increase" value={(base * (1 + pct / 100)).toFixed(2)} />
        <Stat label="Decrease" value={(base * (1 - pct / 100)).toFixed(2)} />
      </div>
    </Panel>
  );
}

export function GpaCalculatorTool() {
  const [rows, setRows] = useState("3,A\n4,B+\n3,A-");
  const map: Record<string, number> = { A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2 };
  const parsed = rows.split("\n").map((line) => {
    const [credits, grade] = line.split(",");
    return { credits: Number(credits), points: map[grade?.trim() ?? ""] ?? 0 };
  });
  const totalCredits = parsed.reduce((s, r) => s + (r.credits || 0), 0);
  const gpa = totalCredits
    ? parsed.reduce((s, r) => s + r.credits * r.points, 0) / totalCredits
    : 0;
  return (
    <Panel>
      <Textarea value={rows} onChange={(e) => setRows(e.target.value)} className="min-h-28" placeholder="credits,grade" />
      <Stat label="GPA" value={gpa.toFixed(3)} />
    </Panel>
  );
}

export function StatisticsCalculatorTool() {
  return <DescriptiveProxy />;
}

function DescriptiveProxy() {
  const [text, setText] = useState("1,2,3,4,5");
  const values = text.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  return (
    <Panel>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Count" value={values.length} />
        <Stat label="Mean" value={avg.toFixed(4)} />
        <Stat label="Sum" value={values.reduce((a, b) => a + b, 0)} />
      </div>
    </Panel>
  );
}

export function ProbabilityCalculatorTool() {
  const [n, setN] = useState(5);
  const [r, setR] = useState(2);
  const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
  const perm = n >= r ? fact(n) / fact(n - r) : 0;
  const comb = r >= 0 && n >= r ? perm / fact(r) : 0;
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>n</Label><Input type="number" value={n} onChange={(e) => setN(Number(e.target.value) || 0)} /></div>
        <div><Label>r</Label><Input type="number" value={r} onChange={(e) => setR(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="P(n,r)" value={perm} />
        <Stat label="C(n,r)" value={comb} />
      </div>
    </Panel>
  );
}

export function BinaryCalculatorTool() {
  const [a, setA] = useState("1010");
  const [b, setB] = useState("0101");
  const sum = (parseInt(a || "0", 2) + parseInt(b || "0", 2)).toString(2);
  return (
    <Panel>
      <Input value={a} onChange={(e) => setA(e.target.value)} />
      <Input value={b} onChange={(e) => setB(e.target.value)} />
      <Stat label="Binary sum" value={sum} />
    </Panel>
  );
}

export function NumberSystemConverterTool() {
  const [value, setValue] = useState("255");
  const [base, setBase] = useState(10);
  const n = parseInt(value, base);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Value</Label><Input value={value} onChange={(e) => setValue(e.target.value)} /></div>
        <div><Label>From base</Label><Input type="number" value={base} onChange={(e) => setBase(Number(e.target.value) || 10)} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Bin" value={Number.isFinite(n) ? n.toString(2) : "—"} />
        <Stat label="Oct" value={Number.isFinite(n) ? n.toString(8) : "—"} />
        <Stat label="Dec" value={Number.isFinite(n) ? n.toString(10) : "—"} />
        <Stat label="Hex" value={Number.isFinite(n) ? n.toString(16) : "—"} />
      </div>
    </Panel>
  );
}

export function UnitConverterTool() {
  const [km, setKm] = useState(1);
  return (
    <Panel>
      <Label>Kilometers</Label>
      <Input type="number" value={km} onChange={(e) => setKm(Number(e.target.value) || 0)} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Meters" value={km * 1000} />
        <Stat label="Miles" value={(km * 0.621371).toFixed(4)} />
        <Stat label="Feet" value={(km * 3280.84).toFixed(2)} />
      </div>
    </Panel>
  );
}

export function BmiCalculatorTool() {
  const [kg, setKg] = useState(70);
  const [cm, setCm] = useState(170);
  const m = cm / 100;
  const bmi = m ? kg / (m * m) : 0;
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Weight (kg)</Label><Input type="number" value={kg} onChange={(e) => setKg(Number(e.target.value) || 0)} /></div>
        <div><Label>Height (cm)</Label><Input type="number" value={cm} onChange={(e) => setCm(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="BMI" value={bmi.toFixed(2)} />
    </Panel>
  );
}

export function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(60);
  const monthlyRate = rate / 12 / 100;
  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Principal</Label><Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} /></div>
        <div><Label>Annual %</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></div>
        <div><Label>Months</Label><Input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value) || 1)} /></div>
      </div>
      <Stat label="EMI" value={emi.toFixed(2)} />
    </Panel>
  );
}

export function GraphPlotterTool() {
  const points = Array.from({ length: 21 }, (_, i) => {
    const x = i - 10;
    return { x, y: x * x };
  });
  const maxY = Math.max(...points.map((p) => p.y), 1);
  return (
    <Panel>
      <Note>Plots y = x² over [-10, 10] for a quick local demo.</Note>
      <div className="flex h-40 items-end gap-1 rounded-xl border border-border/70 p-3">
        {points.map((p) => (
          <div key={p.x} className="flex-1 rounded-t bg-primary/80" style={{ height: `${(p.y / maxY) * 100}%` }} title={`x=${p.x}, y=${p.y}`} />
        ))}
      </div>
    </Panel>
  );
}

export function DerivativeCalculatorTool() {
  const [x, setX] = useState(2);
  const h = 0.0001;
  const f = (v: number) => v * v;
  const approx = (f(x + h) - f(x - h)) / (2 * h);
  return (
    <Panel>
      <Label>x for f(x)=x²</Label>
      <Input type="number" value={x} onChange={(e) => setX(Number(e.target.value) || 0)} />
      <Stat label="f'(x) approx" value={approx.toFixed(6)} />
    </Panel>
  );
}

export function IntegralCalculatorTool() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const n = 1000;
  const f = (v: number) => v * v;
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i += 1) sum += f(a + i * dx) * dx;
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>a</Label><Input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} /></div>
        <div><Label>b</Label><Input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} /></div>
      </div>
      <Stat label="∫ x² dx approx" value={sum.toFixed(6)} />
    </Panel>
  );
}

export function SalaryCalculatorTool() {
  const [basic, setBasic] = useState(100000);
  const [allowances, setAllowances] = useState(20000);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Basic</Label><Input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value) || 0)} /></div>
        <div><Label>Allowances</Label><Input type="number" value={allowances} onChange={(e) => setAllowances(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="EPF employee" value={epfEmployee(basic)} />
        <Stat label="EPF employer" value={epfEmployer(basic)} />
        <Stat label="ETF employer" value={etfEmployer(basic)} />
        <Stat label="Take-home est." value={takeHomeSalary(basic, allowances)} />
      </div>
      <Note>{SL_ASSUMPTIONS}</Note>
    </Panel>
  );
}

export function EpfCalculatorTool() {
  const [basic, setBasic] = useState(100000);
  return (
    <Panel>
      <Label>Basic salary</Label>
      <Input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value) || 0)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Employee 8%" value={epfEmployee(basic)} />
        <Stat label="Employer 12%" value={epfEmployer(basic)} />
      </div>
      <Note>{SL_ASSUMPTIONS}</Note>
    </Panel>
  );
}

export function EtfCalculatorTool() {
  const [basic, setBasic] = useState(100000);
  return (
    <Panel>
      <Label>Basic salary</Label>
      <Input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value) || 0)} />
      <Stat label="Employer ETF 3%" value={etfEmployer(basic)} />
      <Note>{SL_ASSUMPTIONS}</Note>
    </Panel>
  );
}

export function TakeHomeSalaryCalculatorTool() {
  const [basic, setBasic] = useState(100000);
  const [allowances, setAllowances] = useState(15000);
  const [deductions, setDeductions] = useState(0);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Basic</Label><Input type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value) || 0)} /></div>
        <div><Label>Allowances</Label><Input type="number" value={allowances} onChange={(e) => setAllowances(Number(e.target.value) || 0)} /></div>
        <div><Label>Other deductions</Label><Input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Estimated take-home" value={takeHomeSalary(basic, allowances, deductions)} />
      <Note>{SL_ASSUMPTIONS}</Note>
    </Panel>
  );
}

export function CurrencyConverterTool() {
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(300);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Amount (USD)</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
        <div><Label>LKR per USD</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="LKR" value={(amount * rate).toFixed(2)} />
      <Note>Manual rate entry — no live FX feed.</Note>
    </Panel>
  );
}

export function ElectricityBillEstimatorTool() {
  const [units, setUnits] = useState(120);
  return (
    <Panel>
      <Label>Units (kWh)</Label>
      <Input type="number" value={units} onChange={(e) => setUnits(Number(e.target.value) || 0)} />
      <Stat label="Estimated bill (LKR)" value={estimateElectricityBill(units)} />
      <Note>{SL_ASSUMPTIONS} Simplified educational block model.</Note>
    </Panel>
  );
}

export function BudgetPlannerTool() {
  const [income, setIncome] = useState(150000);
  const [expenses, setExpenses] = useState(110000);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Income</Label><Input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value) || 0)} /></div>
        <div><Label>Expenses</Label><Input type="number" value={expenses} onChange={(e) => setExpenses(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Remaining" value={income - expenses} />
    </Panel>
  );
}

export function SavingsCalculatorTool() {
  const [monthly, setMonthly] = useState(20000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(8);
  const r = rate / 100 / 12;
  const future =
    r === 0
      ? monthly * months
      : monthly * (((1 + r) ** months - 1) / r);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Monthly</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value) || 0)} /></div>
        <div><Label>Months</Label><Input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value) || 1)} /></div>
        <div><Label>Annual %</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Projected value" value={future.toFixed(2)} />
    </Panel>
  );
}

export function FuelCostCalculatorTool() {
  const [distance, setDistance] = useState(100);
  const [efficiency, setEfficiency] = useState(15);
  const [price, setPrice] = useState(450);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label>Distance (km)</Label><Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} /></div>
        <div><Label>Km/litre</Label><Input type="number" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value) || 0)} /></div>
        <div><Label>Price/litre</Label><Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} /></div>
      </div>
      <Stat label="Fuel cost" value={fuelCost(distance, efficiency, price)} />
    </Panel>
  );
}

export function VatCalculatorTool() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>Amount</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></div>
        <div><Label>VAT %</Label><Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Stat label="Inclusive" value={vatInclusive(amount, rate / 100)} />
        <Stat label="Exclusive from inclusive input" value={vatExclusive(amount, rate / 100)} />
      </div>
      <Note>{SL_ASSUMPTIONS}</Note>
    </Panel>
  );
}
