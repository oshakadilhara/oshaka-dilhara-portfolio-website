"use client";

import {
  AdminActionForm,
  SubmitButton,
} from "@/features/admin/components/admin-flash";
import {
  CheckboxField,
  SelectField,
  TextareaField,
  TextField,
} from "@/features/admin/components/field";
import { saveArticle } from "@/actions/admin/articles";
import type { ArticleRow, CategoryRow } from "@/types/database";

export function ArticleForm({
  article,
  categories,
}: {
  article?: ArticleRow | null;
  categories: CategoryRow[];
}) {
  return (
    <AdminActionForm action={saveArticle} className="space-y-5">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Title"
          name="title"
          defaultValue={article?.title}
          required
        />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={article?.slug}
          placeholder="auto-from-title"
        />
      </div>
      <TextareaField
        label="Excerpt"
        name="excerpt"
        defaultValue={article?.excerpt}
        rows={3}
      />
      <TextareaField
        label="Body (Markdown)"
        name="body_md"
        defaultValue={article?.body_md}
        rows={16}
        required
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Status"
          name="status"
          defaultValue={article?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <SelectField
          label="Category"
          name="category_id"
          defaultValue={article?.category_id ?? ""}
          options={[
            { value: "", label: "None" },
            ...categories.map((category) => ({
              value: category.id,
              label: category.title,
            })),
          ]}
        />
        <TextField
          label="Cover URL"
          name="cover_url"
          defaultValue={article?.cover_url}
        />
      </div>
      <TextField
        label="Tags"
        name="tags"
        defaultValue={article?.tags?.join(", ")}
        placeholder="nextjs, supabase, vercel"
        hint="Comma-separated"
      />
      <CheckboxField
        label="Featured"
        name="featured"
        defaultChecked={article?.featured}
      />
      <SubmitButton>{article ? "Save article" : "Create article"}</SubmitButton>
    </AdminActionForm>
  );
}
