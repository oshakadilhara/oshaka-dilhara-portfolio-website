"use client";

import { useActionState } from "react";
import type { AdminActionState } from "@/lib/admin/guard";
import { Button } from "@/components/ui/button";

type Action = (
  prev: AdminActionState,
  formData: FormData
) => Promise<AdminActionState>;

export function AdminActionForm({
  action,
  children,
  className,
  confirmMessage,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
      {state.error ? (
        <p className="mt-2 text-sm text-destructive">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
          {state.success}
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {pending ? "Saving" : state.success || state.error || ""}
      </span>
    </form>
  );
}

export function SubmitButton({
  children,
  variant = "default",
  size = "default",
  disabled,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "xs" | "lg";
  disabled?: boolean;
}) {
  return (
    <Button type="submit" variant={variant} size={size} disabled={disabled}>
      {children}
    </Button>
  );
}
