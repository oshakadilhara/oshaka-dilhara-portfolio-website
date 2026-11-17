"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { submitFeedback, type FeedbackActionState } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: FeedbackActionState = {};

export function FeedbackForm() {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(
    submitFeedback,
    initialState
  );

  if (state.success) {
    return (
      <p className="rounded-lg border border-border/70 bg-card/40 px-4 py-3 text-sm">
        Thanks for the feedback.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="page_path" value={pathname || "/contact"} />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <Label htmlFor="feedback-message">Site feedback</Label>
        <Textarea
          id="feedback-message"
          name="message"
          required
          rows={4}
          placeholder="What should improve?"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="feedback-rating">Rating (optional)</Label>
        <select
          id="feedback-rating"
          name="rating"
          defaultValue=""
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30"
        >
          <option value="">No rating</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Sending..." : "Send feedback"}
      </Button>
    </form>
  );
}
