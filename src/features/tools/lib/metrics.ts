export function precision(tp: number, fp: number) {
  const denom = tp + fp;
  return denom === 0 ? 0 : tp / denom;
}

export function recall(tp: number, fn: number) {
  const denom = tp + fn;
  return denom === 0 ? 0 : tp / denom;
}

export function f1Score(tp: number, fp: number, fn: number) {
  const p = precision(tp, fp);
  const r = recall(tp, fn);
  return p + r === 0 ? 0 : (2 * p * r) / (p + r);
}

export function accuracy(tp: number, tn: number, fp: number, fn: number) {
  const total = tp + tn + fp + fn;
  return total === 0 ? 0 : (tp + tn) / total;
}

export function cosineSimilarity(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function bagOfWordsVector(text: string, vocab: string[]) {
  const tokens = tokenize(text);
  return vocab.map((word) => tokens.filter((token) => token === word).length);
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function estimateTokens(text: string) {
  return {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    estimateChars: Math.ceil(text.length / 4),
    estimateWords: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) * 1.3),
  };
}

export function trainTestSplit<T>(items: T[], trainRatio: number) {
  const ratio = Math.min(0.95, Math.max(0.05, trainRatio));
  const cut = Math.floor(items.length * ratio);
  return {
    train: items.slice(0, cut),
    test: items.slice(cut),
  };
}
