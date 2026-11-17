"use client";

import type { ComponentType } from "react";
import * as Core from "@/features/tools/components/implemented-tools";
import * as BatchA from "@/features/tools/components/tools-batch-a";
import * as BatchB from "@/features/tools/components/tools-batch-b";
import { REGISTERED_TOOL_SLUGS } from "@/features/tools/data/registered-slugs";

const registry: Record<string, ComponentType> = {
  "word-counter": Core.WordCounterTool,
  "character-counter": Core.CharacterCounterTool,
  "text-case-converter": Core.TextCaseConverterTool,
  "slug-generator": Core.SlugGeneratorTool,
  "text-diff": Core.TextDiffTool,
  "duplicate-line-remover": Core.DuplicateLineRemoverTool,
  "lorem-ipsum": Core.LoremIpsumTool,
  "base64-converter": Core.Base64ConverterTool,
  "url-encoder": Core.UrlEncoderTool,
  "json-formatter": Core.JsonFormatterTool,
  "json-validator": Core.JsonValidatorTool,
  "uuid-generator": Core.UuidGeneratorTool,
  "hash-generator": Core.HashGeneratorTool,
  "password-generator": Core.PasswordGeneratorTool,
  "timestamp-converter": Core.TimestampConverterTool,
  "color-converter": Core.ColorConverterTool,
  "csv-to-json": Core.CsvToJsonTool,
  "regex-tester": Core.RegexTesterTool,
  "jwt-decoder": Core.JwtDecoderTool,
  "token-estimator": Core.TokenEstimatorTool,

  "text-sorter": BatchA.TextSorterTool,
  "readability-checker": BatchA.ReadabilityCheckerTool,
  "markdown-editor": BatchA.MarkdownEditorTool,
  "xml-formatter": BatchA.XmlFormatterTool,
  "yaml-converter": BatchA.YamlConverterTool,
  "sql-formatter": BatchA.SqlFormatterTool,
  "cron-generator": BatchA.CronGeneratorTool,
  "css-gradient-generator": BatchA.CssGradientGeneratorTool,
  "html-playground": BatchA.HtmlPlaygroundTool,
  "git-command-reference": BatchA.GitCommandReferenceTool,
  "dockerfile-generator": BatchA.DockerfileGeneratorTool,
  "csv-viewer": BatchA.CsvViewerTool,
  "csv-analyzer": BatchA.CsvAnalyzerTool,
  "data-profiler": BatchA.DataProfilerTool,
  "missing-value-analyzer": BatchA.MissingValueAnalyzerTool,
  "duplicate-detector": BatchA.DuplicateDetectorTool,
  "data-cleaning": BatchA.DataCleaningTool,
  "descriptive-statistics": BatchA.DescriptiveStatisticsTool,
  "correlation-calculator": BatchA.CorrelationCalculatorTool,
  "outlier-detector": BatchA.OutlierDetectorTool,
  "data-visualization": BatchA.DataVisualizationTool,
  "pivot-table-simulator": BatchA.PivotTableSimulatorTool,
  "excel-formula-helper": BatchA.ExcelFormulaHelperTool,
  "dax-formula-helper": BatchA.DaxFormulaHelperTool,
  "sql-query-helper": BatchA.SqlQueryHelperTool,
  "date-table-generator": BatchA.DateTableGeneratorTool,
  "data-quality-report": BatchA.DataQualityReportTool,

  "prompt-builder": BatchB.PromptBuilderTool,
  "ai-cost-calculator": BatchB.AiCostCalculatorTool,
  "embedding-explorer": BatchB.EmbeddingExplorerTool,
  "cosine-similarity-calculator": BatchB.CosineSimilarityCalculatorTool,
  "text-similarity": BatchB.TextSimilarityTool,
  "chunk-size-calculator": BatchB.ChunkSizeCalculatorTool,
  "rag-visualizer": BatchB.RagVisualizerTool,
  "confusion-matrix": BatchB.ConfusionMatrixTool,
  "precision-calculator": BatchB.PrecisionCalculatorTool,
  "recall-calculator": BatchB.RecallCalculatorTool,
  "f1-calculator": BatchB.F1CalculatorTool,
  "roc-visualizer": BatchB.RocVisualizerTool,
  "train-test-split": BatchB.TrainTestSplitTool,
  "neural-network-visualizer": BatchB.NeuralNetworkVisualizerTool,
  "temperature-explorer": BatchB.TemperatureExplorerTool,
  "ml-metrics": BatchB.MlMetricsTool,
  "agent-workflow-designer": BatchB.AgentWorkflowDesignerTool,
  "vector-search-explorer": BatchB.VectorSearchExplorerTool,
  "qr-code-generator": BatchB.QrCodeGeneratorTool,
  "image-to-base64": BatchB.ImageToBase64Tool,
  "image-compressor": BatchB.ImageCompressorTool,
  "image-resizer": BatchB.ImageResizerTool,
  "image-format-converter": BatchB.ImageFormatConverterTool,
  "pdf-merger": BatchB.PdfMergerTool,
  "pdf-splitter": BatchB.PdfSplitterTool,
  "pdf-page-counter": BatchB.PdfPageCounterTool,
  "pdf-metadata-viewer": BatchB.PdfMetadataViewerTool,
  "qr-code-reader": BatchB.QrCodeReaderTool,
  "file-size-converter": BatchB.FileSizeConverterTool,
  "exif-viewer": BatchB.ExifViewerTool,
  "exif-remover": BatchB.ExifRemoverTool,
  "scientific-calculator": BatchB.ScientificCalculatorTool,
  "matrix-calculator": BatchB.MatrixCalculatorTool,
  "equation-solver": BatchB.EquationSolverTool,
  "percentage-calculator": BatchB.PercentageCalculatorTool,
  "gpa-calculator": BatchB.GpaCalculatorTool,
  "statistics-calculator": BatchB.StatisticsCalculatorTool,
  "probability-calculator": BatchB.ProbabilityCalculatorTool,
  "binary-calculator": BatchB.BinaryCalculatorTool,
  "number-system-converter": BatchB.NumberSystemConverterTool,
  "unit-converter": BatchB.UnitConverterTool,
  "bmi-calculator": BatchB.BmiCalculatorTool,
  "loan-calculator": BatchB.LoanCalculatorTool,
  "graph-plotter": BatchB.GraphPlotterTool,
  "derivative-calculator": BatchB.DerivativeCalculatorTool,
  "integral-calculator": BatchB.IntegralCalculatorTool,
  "salary-calculator": BatchB.SalaryCalculatorTool,
  "epf-calculator": BatchB.EpfCalculatorTool,
  "etf-calculator": BatchB.EtfCalculatorTool,
  "take-home-salary-calculator": BatchB.TakeHomeSalaryCalculatorTool,
  "currency-converter": BatchB.CurrencyConverterTool,
  "electricity-bill-estimator": BatchB.ElectricityBillEstimatorTool,
  "budget-planner": BatchB.BudgetPlannerTool,
  "savings-calculator": BatchB.SavingsCalculatorTool,
  "fuel-cost-calculator": BatchB.FuelCostCalculatorTool,
  "vat-calculator": BatchB.VatCalculatorTool,
};

const registeredKeySet = new Set(Object.keys(registry));
for (const slug of REGISTERED_TOOL_SLUGS) {
  if (!registeredKeySet.has(slug)) {
    throw new Error(`Missing tool component for registered slug: ${slug}`);
  }
}
for (const slug of registeredKeySet) {
  if (!REGISTERED_TOOL_SLUGS.includes(slug as (typeof REGISTERED_TOOL_SLUGS)[number])) {
    throw new Error(`Tool component registered but missing from REGISTERED_TOOL_SLUGS: ${slug}`);
  }
}

export function ToolRenderer({ slug }: { slug: string }) {
  const Tool = registry[slug];
  if (!Tool) {
    return (
      <p className="text-sm text-muted-foreground">
        This tool is not implemented yet.
      </p>
    );
  }
  return <Tool />;
}

export function getRegisteredToolSlugs() {
  return [...REGISTERED_TOOL_SLUGS];
}
