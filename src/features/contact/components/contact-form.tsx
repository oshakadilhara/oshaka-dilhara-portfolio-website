"use client";

import { useActionState } from "react";
import { submitContact, type ContactActionState } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactActionState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/40 p-8">
        <p className="text-lg font-medium tracking-tight">Message received</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out. I will reply when I can.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative space-y-5 rounded-2xl border border-border/70 bg-card/40 p-8">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={120} autoComplete="name" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" maxLength={200} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          className="min-h-36"
        />
      </div>
      {/* Honeypot — hidden from users, visible to naive bots */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Messages are rate-limited and stored securely. Do not include passwords or secrets.
      </p>
    </form>
  );
}
