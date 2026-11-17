import { describe, expect, it } from "vitest";
import { getImplementedTools, getToolBySlug, tools } from "@/features/tools/data/catalog";
import { REGISTERED_TOOL_SLUGS } from "@/features/tools/data/registered-slugs";
import { parseCsv, pearson, mean } from "@/features/tools/lib/csv";
import {
  cosineSimilarity,
  f1Score,
  precision,
  recall,
  trainTestSplit,
} from "@/features/tools/lib/metrics";
import {
  epfEmployee,
  etfEmployer,
  fuelCost,
  takeHomeSalary,
  vatInclusive,
} from "@/features/tools/lib/sri-lanka";

describe("free tools catalog", () => {
  it("marks every catalog tool as implemented", () => {
    expect(tools.length).toBeGreaterThan(90);
    expect(tools.every((tool) => tool.implemented)).toBe(true);
    expect(getImplementedTools().length).toBe(tools.length);
  });

  it("registers a UI component for every catalog slug", () => {
    const registered = new Set<string>(REGISTERED_TOOL_SLUGS);
    const missing = tools.map((tool) => tool.slug).filter((slug) => !registered.has(slug));
    const extras = [...registered].filter((slug) => !tools.some((tool) => tool.slug === slug));
    expect(missing).toEqual([]);
    expect(extras).toEqual([]);
  });

  it("resolves known tools without login dependencies", () => {
    expect(getToolBySlug("word-counter")?.implemented).toBe(true);
    expect(getToolBySlug("salary-calculator")?.category).toBe("sri-lanka");
  });
});

describe("tool logic", () => {
  it("parses csv and computes stats", () => {
    const table = parseCsv("x,y\n1,2\n2,4\n3,6");
    expect(table.headers).toEqual(["x", "y"]);
    expect(table.rows).toHaveLength(3);
    expect(mean([1, 2, 3])).toBe(2);
    expect(pearson([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
  });

  it("computes ml metrics and similarity", () => {
    expect(precision(40, 10)).toBeCloseTo(0.8);
    expect(recall(40, 10)).toBeCloseTo(0.8);
    expect(f1Score(40, 10, 10)).toBeCloseTo(0.8);
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(trainTestSplit([1, 2, 3, 4], 0.5).train).toEqual([1, 2]);
  });

  it("applies sri lanka calculators with dated assumptions", () => {
    expect(epfEmployee(100000)).toBe(8000);
    expect(etfEmployer(100000)).toBe(3000);
    expect(takeHomeSalary(100000, 10000)).toBe(102000);
    expect(vatInclusive(100, 0.18)).toBe(118);
    expect(fuelCost(100, 10, 400)).toBe(4000);
  });
});
