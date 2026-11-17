export type CsvTable = {
  headers: string[];
  rows: string[][];
};

export function parseCsv(text: string): CsvTable {
  const lines = text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    while (cols.length < headers.length) cols.push("");
    return cols.slice(0, headers.length);
  });
  return { headers, rows };
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

export function csvToObjects(table: CsvTable) {
  return table.rows.map((row) =>
    Object.fromEntries(table.headers.map((header, i) => [header, row[i] ?? ""]))
  );
}

export function columnValues(table: CsvTable, index: number) {
  return table.rows.map((row) => row[index] ?? "");
}

export function numericColumn(table: CsvTable, index: number) {
  return columnValues(table, index)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

export function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function stdDev(values: number[]) {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
    (values.length - 1);
  return Math.sqrt(variance);
}

export function pearson(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const xs = x.slice(0, n);
  const ys = y.slice(0, n);
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i += 1) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  if (dx === 0 || dy === 0) return 0;
  return num / Math.sqrt(dx * dy);
}
