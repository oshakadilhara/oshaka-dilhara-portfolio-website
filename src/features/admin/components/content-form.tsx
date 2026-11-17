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
import { saveContentEntry } from "@/actions/admin/content";
import type { ContentEntryRow, ContentSection } from "@/types/database";

export function ContentForm({
  section,
  entry,
}: {
  section: ContentSection;
  entry?: ContentEntryRow | null;
}) {
  return (
    <AdminActionForm action={saveContentEntry} className="space-y-5">
      <input type="hidden" name="section" value={section} />
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Title"
          name="title"
          defaultValue={entry?.title}
          required
        />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={entry?.slug}
          placeholder="auto-from-title"
        />
      </div>
      <TextareaField
        label="Summary"
        name="summary"
        defaultValue={entry?.summary}
        rows={3}
      />
      <TextareaField
        label="Body (Markdown)"
        name="body_md"
        defaultValue={entry?.body_md}
        rows={12}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Status"
          name="status"
          defaultValue={entry?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <TextField
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={entry?.sort_order ?? 0}
        />
      </div>
      <SubmitButton>{entry ? "Save entry" : "Create entry"}</SubmitButton>
    </AdminActionForm>
  );
}
