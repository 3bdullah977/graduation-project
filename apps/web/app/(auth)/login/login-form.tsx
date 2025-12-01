"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/auth";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(data: z.infer<typeof schema>) {
    const res = await loginUser(data.email, data.password);
    if (res?.error) {
      form.setError("root", { message: res?.error.message });
    } else {
    }
  }

  return (
    <Form {...form}>
      <form
        className="mb-2 w-full space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-red-500 text-sm">
          {form.formState.errors.root?.message}
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          disabled={isSubmitting || !isValid}
          type="submit"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
        <p className="text-center text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link className="underline" href={"/register"}>
            Register
          </Link>
        </p>
      </form>
    </Form>
  );
}
