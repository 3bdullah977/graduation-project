"use client";

import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function SignupPage() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="hidden min-h-screen w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground md:flex">
        <h3 className="font-bold text-2xl">Create an account</h3>
        <p className="w-4/5 text-muted">Register to your account to continue</p>
      </div>
      <div className="flex w-10/12 justify-center md:w-1/2">
        <div className="w-80 space-y-2">
          <h1 className="text-center font-bold text-2xl">Create an account</h1>
          <RegisterForm />
          <div className="mt-2 flex justify-between text-sm">
            <p>
              Already have an account?{" "}
              <Link className="underline" href={"/login"}>
                Login
              </Link>
            </p>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            By registering, you agree to our{" "}
            <Link className="underline" href={"/terms"}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className="underline" href={"/privacy"}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
