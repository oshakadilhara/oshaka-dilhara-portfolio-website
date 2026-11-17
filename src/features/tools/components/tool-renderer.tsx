"use client";

import {
  Base64ConverterTool,
  CharacterCounterTool,
  ColorConverterTool,
  CsvToJsonTool,
  DuplicateLineRemoverTool,
  HashGeneratorTool,
  JsonFormatterTool,
  JsonValidatorTool,
  JwtDecoderTool,
  LoremIpsumTool,
  PasswordGeneratorTool,
  RegexTesterTool,
  SlugGeneratorTool,
  TextCaseConverterTool,
  TextDiffTool,
  TimestampConverterTool,
  TokenEstimatorTool,
  UrlEncoderTool,
  UuidGeneratorTool,
  WordCounterTool,
} from "@/features/tools/components/implemented-tools";

const registry: Record<string, React.ComponentType> = {
  "word-counter": WordCounterTool,
  "character-counter": CharacterCounterTool,
  "text-case-converter": TextCaseConverterTool,
  "slug-generator": SlugGeneratorTool,
  "text-diff": TextDiffTool,
  "duplicate-line-remover": DuplicateLineRemoverTool,
  "lorem-ipsum": LoremIpsumTool,
  "base64-converter": Base64ConverterTool,
  "url-encoder": UrlEncoderTool,
  "json-formatter": JsonFormatterTool,
  "json-validator": JsonValidatorTool,
  "uuid-generator": UuidGeneratorTool,
  "hash-generator": HashGeneratorTool,
  "password-generator": PasswordGeneratorTool,
  "timestamp-converter": TimestampConverterTool,
  "color-converter": ColorConverterTool,
  "csv-to-json": CsvToJsonTool,
  "regex-tester": RegexTesterTool,
  "jwt-decoder": JwtDecoderTool,
  "token-estimator": TokenEstimatorTool,
};

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
