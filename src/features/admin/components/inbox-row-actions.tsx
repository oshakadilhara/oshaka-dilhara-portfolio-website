"use client";

import {
  AdminActionForm,
  SubmitButton,
} from "@/features/admin/components/admin-flash";
import type { AdminActionState } from "@/lib/admin/guard";

type Action = (
  prev: AdminActionState,
  formData: FormData
) => Promise<AdminActionState>;

export function InboxStatusForm({
  id,
  action,
  options,
  current,
}: {
  id: string;
  action: Action;
  options: Array<{ value: string; label: string }>;
  current: string;
}) {
  return (
    <AdminActionForm action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={current}
        className="h-7 rounded-lg border border-input bg-transparent px-2 text-xs dark:bg-input/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <SubmitButton size="xs" variant="outline">
        Update
      </SubmitButton>
    </AdminActionForm>
  );
}

export function DeleteForm({
  id,
  action,
  label = "Delete",
  hiddenFields,
}: {
  id: string;
  action: Action;
  label?: string;
  hiddenFields?: Record<string, string>;
}) {
  return (
    <AdminActionForm
      action={action}
      confirmMessage="Delete this item permanently?"
    >
      <input type="hidden" name="id" value={id} />
      {hiddenFields
        ? Object.entries(hiddenFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))
        : null}
      <SubmitButton size="xs" variant="destructive">
        {label}
      </SubmitButton>
    </AdminActionForm>
  );
}
