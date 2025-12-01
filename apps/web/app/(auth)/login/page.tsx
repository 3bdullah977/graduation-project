"use client";

import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6">
      <div className="flex w-96 flex-col items-center justify-center rounded-lg border p-6 shadow-sm">
        <div className="w-full">
          <h1 className="mb-1 font-bold text-2xl">Login</h1>
          <p className="mb-4 text-muted-foreground text-sm">
            Login to your account to continue
          </p>
          <LoginForm />
        </div>
      </div>

      <p className="w-64 text-center text-muted-foreground text-sm">
        By logging in, you agree to our{" "}
        <Link className="underline" href={"/terms"}>
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link className="underline" href={"/privacy"}>
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
