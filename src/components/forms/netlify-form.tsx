"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FormName } from "./form-definitions";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "file";
  required?: boolean;
  placeholder?: string;
  accept?: string;
};

/**
 * Posts to Netlify Forms (declared in public/__forms.html). Submissions show up in
 * Netlify > Forms, where email notifications can be configured.
 */
export function NetlifyForm({
  name,
  fields,
  hidden = {},
  submitLabel = "Submit",
  successMessage = "Thank you! Your submission has been received.",
  redirectTo,
  className,
}: {
  name: FormName;
  fields: FieldDef[];
  hidden?: Record<string, string>;
  submitLabel?: string;
  successMessage?: string;
  redirectTo?: string;
  className?: string;
}) {
  const [state, setState] = React.useState<"idle" | "sending" | "done" | "error">("idle");
  const hasFile = fields.some((f) => f.type === "file");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = new FormData(e.currentTarget);
    data.set("page", window.location.pathname);
    try {
      const res = await fetch("/__forms.html", hasFile
        ? { method: "POST", body: data }
        : {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
          });
      if (!res.ok) throw new Error(String(res.status));
      if (redirectTo) {
        window.location.href = redirectTo;
        return;
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className={cn("flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800", className)}>
        <CheckCircle2 className="size-6 shrink-0" /> <p className="font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      name={name}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      encType={hasFile ? "multipart/form-data" : undefined}
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-4", className)}
    >
      <input type="hidden" name="form-name" value={name} />
      <input type="hidden" name="page" value="" />
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          <span>
            {f.label}
            {f.required && <span className="text-primary"> *</span>}
          </span>
          {f.type === "textarea" ? (
            <textarea
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              rows={4}
              className="rounded-xl border bg-white px-4 py-3 font-normal outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            />
          ) : (
            <input
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              accept={f.accept}
              className={cn(
                "rounded-xl border bg-white px-4 font-normal outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                f.type === "file" ? "py-2.5 file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-primary" : "h-12"
              )}
            />
          )}
        </label>
      ))}
      <Button type="submit" size="lg" disabled={state === "sending"} className="mt-2 w-full sm:w-fit">
        {state === "sending" && <Loader2 className="animate-spin" />} {submitLabel}
      </Button>
      {state === "error" && <p className="text-sm text-destructive">Oops! Something went wrong while submitting the form. Please try again.</p>}
    </form>
  );
}
