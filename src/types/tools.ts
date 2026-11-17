export type ToolCategoryId =
  | "text"
  | "developer"
  | "data"
  | "ai-ml"
  | "image-pdf"
  | "student"
  | "sri-lanka";

export type ToolDefinition = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategoryId;
  keywords: string[];
  implemented: boolean;
  faqs?: { question: string; answer: string }[];
};

export type ToolCategory = {
  id: ToolCategoryId;
  title: string;
  description: string;
};
