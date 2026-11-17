"use client";

import {
  AdminActionForm,
  SubmitButton,
} from "@/features/admin/components/admin-flash";
import {
  SelectField,
  TextareaField,
  TextField,
} from "@/features/admin/components/field";
import { saveCategory } from "@/actions/admin/categories";
import type { CategoryRow } from "@/types/database";

export function CategoryForm({ category }: { category?: CategoryRow | null }) {
  return (
    <AdminActionForm action={saveCategory} className="space-y-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Title"
          name="title"
          defaultValue={category?.title}
          required
        />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={category?.slug}
          placeholder="auto-from-title"
        />
      </div>
      <SelectField
        label="Kind"
        name="kind"
        defaultValue={category?.kind ?? "blog"}
        options={[
          { value: "blog", label: "Blog" },
          { value: "tool", label: "Tool" },
          { value: "resource", label: "Resource" },
          { value: "project", label: "Project" },
        ]}
      />
      <TextareaField
        label="Description"
        name="description"
        defaultValue={category?.description}
        rows={3}
      />
      <SubmitButton>
        {category ? "Save category" : "Create category"}
      </SubmitButton>
    </AdminActionForm>
  );
}
