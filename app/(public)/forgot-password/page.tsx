import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1
            className="text-primary text-sm mb-2"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            KICKSTART
          </h1>
          <p className="text-white/40 text-sm">Reset your password</p>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-white/40">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
