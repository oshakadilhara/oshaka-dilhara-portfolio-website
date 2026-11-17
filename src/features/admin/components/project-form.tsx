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
import { saveProject } from "@/actions/admin/projects";
import type { ProjectRow } from "@/types/database";

export function ProjectForm({ project }: { project?: ProjectRow | null }) {
  return (
    <AdminActionForm action={saveProject} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Title"
          name="title"
          defaultValue={project?.title}
          required
        />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={project?.slug}
          placeholder="auto-from-title"
        />
      </div>
      <TextareaField
        label="Summary"
        name="summary"
        defaultValue={project?.summary}
        rows={3}
      />
      <TextareaField
        label="Body (Markdown)"
        name="body_md"
        defaultValue={project?.body_md}
        rows={12}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Status"
          name="status"
          defaultValue={project?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <SelectField
          label="Lifecycle"
          name="lifecycle"
          defaultValue={project?.lifecycle ?? "in-progress"}
          options={[
            { value: "concept", label: "Concept" },
            { value: "in-progress", label: "In progress" },
            { value: "completed", label: "Completed" },
            { value: "maintained", label: "Maintained" },
          ]}
        />
        <TextField label="Href" name="href" defaultValue={project?.href} />
      </div>
      <TextField
        label="Stack"
        name="stack"
        defaultValue={project?.stack?.join(", ")}
        placeholder="Next.js, Supabase, TypeScript"
      />
      <div className="flex flex-wrap gap-6">
        <CheckboxField
          label="Featured"
          name="featured"
          defaultChecked={project?.featured}
        />
        <CheckboxField
          label="CloudCey"
          name="cloudcey"
          defaultChecked={project?.cloudcey}
        />
      </div>
      <SubmitButton>{project ? "Save project" : "Create project"}</SubmitButton>
    </AdminActionForm>
  );
}
