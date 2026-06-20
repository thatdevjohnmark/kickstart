"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const result = await resetPassword(fd);

    setSubmitting(false);
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("Check your email for the password reset link.");
    }
  }

  if (status === "success") {
    return (
      <div className="retro-card bg-surface p-8 text-center space-y-3">
        <div className="text-4xl">📬</div>
        <p className="text-white font-semibold text-sm">Email sent!</p>
        <p className="text-white/50 text-xs leading-relaxed">{message}</p>
      </div>
    );
  }

  return (
    <div className="retro-card bg-surface p-8 space-y-5">
      <p className="text-white/50 text-sm leading-relaxed">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="email@example.com"
            className="bg-background border-gray-700 text-white"
          />
        </div>

        {status === "error" && message && (
          <p className="text-rejected text-xs">{message}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full py-2.5 rounded-md border-2 border-black text-sm font-medium",
            "bg-primary text-white shadow-[3px_3px_0px_#000]",
            "hover:bg-primary/90 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {submitting ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
