"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2, Lock, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";
import { attempt } from "@/lib/error-handling";
import { createWorkspace } from "@/lib/workspace";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only."),
});

type WorkspaceFormValues = z.infer<typeof schema>;

export function CreateWorkspaceForm() {
  const router = useRouter();
  const resolver = useMemo(() => zodResolver(schema), []);

  const form = useForm<WorkspaceFormValues>({
    resolver,
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const slugPreview = form.watch("slug") || "your-workspace";

  async function onSubmit(values: WorkspaceFormValues) {
    const [data, error] = await attempt<
      { workspaceId: string },
      AxiosError<{ message: string }>
    >(createWorkspace(values.name, values.slug));
    console.log(data);
    console.log(error);

    if (error) {
      if (
        error.message?.includes("Session expired") ||
        error.message?.includes("Unauthorized")
      ) {
        router.push("/login");
        return;
      }
      form.setError("root", {
        message: error.response?.data?.message ?? "Failed to create workspace",
      });
    } else {
      router.push(`/${encodeURIComponent(values.slug)}`);
      toast.success(`Workspace ${values.name} created successfully`);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[2fr,1fr]">
      <div className="rounded-2xl border bg-card/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 font-medium text-xs">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                Quick setup
              </span>
              <span className="rounded-full border px-2.5 py-1 text-muted-foreground">
                Secure by default
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Spin up a workspace for your team in a few steps.
            </p>
            <h1 className="font-semibold text-2xl">Create workspace</h1>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
            Step 1 of 1
          </span>
        </div>

        <Separator className="my-6" />

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {form.formState.errors.root?.message ? (
              <p className="text-destructive text-sm" key="error-message">
                {form.formState.errors.root?.message}
              </p>
            ) : null}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Design Studio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="acme"
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-")
                            .replace(/--+/g, "-")
                            .replace(/^-+|-+$/g, "")
                        )
                      }
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Workspace URL: https://app.yourdomain.com/{slugPreview}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 px-4 py-3 text-sm">
              <div className="text-muted-foreground">
                You can invite teammates and set permissions after creating the
                workspace.
              </div>
              <Button disabled={isSubmitting || !isValid} type="submit">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create workspace
              </Button>
            </div>

            <div className="grid gap-3 rounded-xl border bg-linear-to-r from-primary/5 via-background to-background p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2 font-semibold text-primary text-xs uppercase">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                  Next up
                </span>
                <span className="text-muted-foreground">Preview the steps</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg border bg-card/60 p-3">
                  <p className="font-medium">Create</p>
                  <p className="text-muted-foreground text-sm">
                    Name your workspace and set the slug.
                  </p>
                </div>
                <div className="rounded-lg border bg-card/60 p-3">
                  <p className="font-medium">Invite</p>
                  <p className="text-muted-foreground text-sm">
                    Add teammates with roles and permissions.
                  </p>
                </div>
                <div className="rounded-lg border bg-card/60 p-3">
                  <p className="font-medium">Ship</p>
                  <p className="text-muted-foreground text-sm">
                    Start projects with a clean slate and templates.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <aside className="rounded-2xl border bg-linear-to-b from-muted/60 via-background to-muted/60 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          Workspace setup guide
        </div>
        <ul className="mt-4 space-y-4 text-muted-foreground text-sm">
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="font-medium text-foreground">Role-ready</p>
              <p>
                Keep owners, admins, and members organized with clear roles.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Users className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="font-medium text-foreground">Invite teammates</p>
              <p>
                Send invites once you create the workspace to start working.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Lock className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="font-medium text-foreground">Secure by default</p>
              <p>Private until you decide to share projects with the team.</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  );
}
