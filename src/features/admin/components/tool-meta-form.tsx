"use client";

import {
  AdminActionForm,
  SubmitButton,
} from "@/features/admin/components/admin-flash";
import {
  CheckboxField,
  TextareaField,
  TextField,
} from "@/features/admin/components/field";
import { saveToolMeta } from "@/actions/admin/tools";
import type { ToolMetaRow } from "@/types/database";

export function ToolMetaForm({
  slug,
  meta,
}: {
  slug: string;
  meta?: ToolMetaRow | null;
}) {
  return (
    <AdminActionForm action={saveToolMeta} className="space-y-3">
      <input type="hidden" name="slug" value={slug} />
      <div className="flex flex-wrap gap-4">
        <CheckboxField
          label="Featured"
          name="featured"
          defaultChecked={meta?.featured}
        />
        <CheckboxField
          label="Published"
          name="published"
          defaultChecked={meta?.published ?? true}
        />
      </div>
      <TextField
        label="Sort order"
        name="sort_order"
        type="number"
        defaultValue={meta?.sort_order ?? 0}
      />
      <TextareaField
        label="Admin notes"
        name="notes"
        defaultValue={meta?.notes}
        rows={2}
      />
      <SubmitButton size="sm">Save</SubmitButton>
    </AdminActionForm>
  );
}
