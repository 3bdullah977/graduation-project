"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Brain,
  FileCode2,
  GitBranch,
  Layers,
  ScrollText,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/constants";
import { attempt } from "@/lib/error-handling";
import { cn } from "@/lib/utils";
import { findWorkspaceBySlug } from "@/lib/workspace";
import {
  type BlueprintStep,
  GenerationProgress,
} from "./_components/generation-progress";

const schema = z.object({
  description: z
    .string()
    .min(30, "Please provide at least 30 characters describing your idea"),
});

type FormValues = z.infer<typeof schema>;

const BLUEPRINT_OUTPUTS = [
  {
    icon: Brain,
    label: "Market feasibility analysis",
    description: "Scores across 6 dimensions",
    index: "01",
  },
  {
    icon: Layers,
    label: "Core features",
    description: "AI-identified product features",
    index: "02",
  },
  {
    icon: FileCode2,
    label: "PostgreSQL DDL schema",
    description: "Ready-to-use database schema",
    index: "03",
  },
  {
    icon: GitBranch,
    label: "Tech stack recommendations",
    description: "Frontend, backend, DB & AI",
    index: "04",
  },
  {
    icon: Tag,
    label: "Pricing model & user flow",
    description: "Tiers and interactive diagram",
    index: "05",
  },
] as const;

export default function BlueprintInputPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.project as string;
  const workspaceSlug = decodeURIComponent(params.workspace as string);

  const workspaceData = useQuery({
    queryKey: ["workspace", workspaceSlug],
    queryFn: async () => {
      const [result, error] = await attempt(findWorkspaceBySlug(workspaceSlug));
      if (error || !result) {
        toast.error("Error while fetching workspace");
      }
      return result?.data.workspace;
    },
    enabled: !!workspaceSlug,
  });

  const workspaceId = workspaceData.data?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description: "" },
    mode: "onChange",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<BlueprintStep | undefined>();

  const descriptionLength = form.watch("description").length;
  const progressPct = Math.min((descriptionLength / 30) * 100, 100);

  async function onSubmit(values: FormValues) {
    if (isGenerating) {
      return;
    }
    setIsGenerating(true);
    setActiveStep("Analyzing project description");

    try {
      const url = new URL(
        `${BACKEND_URL}/workspaces/${workspaceId}/projects/${projectId}/blueprint/generate`
      );
      url.searchParams.set("description", values.description);

      const eventSource = new EventSource(url.toString(), {
        withCredentials: true,
      });

      eventSource.addEventListener("progress", (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data) as {
            step?: BlueprintStep;
            status?: "in_progress" | "completed";
          };
          if (data.step) {
            setActiveStep(data.step);
          }
        } catch {
          // best-effort parsing; ignore malformed messages
        }
      });

      eventSource.addEventListener("done", (event) => {
        try {
          const data = JSON.parse((event as MessageEvent).data) as {
            done?: boolean;
            blueprintId?: string;
          };
          if (data.done && data.blueprintId) {
            eventSource.close();
            router.push(
              `/${workspaceSlug}/projects/${projectId}/blueprint/review`
            );
          }
        } catch {
          eventSource.close();
          setIsGenerating(false);
          toast.error("Error while finishing blueprint generation");
        }
      });

      eventSource.onerror = () => {
        eventSource.close();
        setIsGenerating(false);
        toast.error("Error while generating blueprint");
      };
    } catch {
      toast.error("Error while starting blueprint generation");
      setIsGenerating(false);
    }
  }

  if (!(workspaceId && projectId)) {
    return <Loading />;
  }

  return (
    <div className="relative mx-auto mt-4 flex w-full max-w-6xl flex-col gap-7 py-6">
      {/* Blueprint dot-grid ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── Header ── */}
      <header className="relative flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary uppercase tracking-widest">
              AI System
            </span>
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
              Blueprint Generator
            </span>
          </div>

          <h1 className="font-bold text-2xl tracking-tight">
            Describe your idea.
          </h1>

          <p className="max-w-lg text-muted-foreground text-sm">
            From a single description, generate a complete product blueprint —
            market analysis, features, tech stack, schema, and more.
          </p>
        </div>

        <Button
          asChild
          className="mt-0.5 shrink-0 gap-1.5 border-dashed"
          size="sm"
          variant="outline"
        >
          <Link
            href={`/${workspaceSlug}/projects/${projectId}/blueprint/review`}
          >
            <ScrollText className="size-3.5" />
            View blueprint
          </Link>
        </Button>
      </header>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
          Input
        </span>
        <div className="h-px w-6 bg-border" />
      </div>

      {/* ── Form ── */}
      <Form {...form}>
        <form
          className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Left: Textarea panel */}
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="gap-0 space-y-0">
                  {/* Panel title bar */}
                  <div className="flex items-center justify-between border border-border border-b-0 bg-muted/40 px-3 py-1.5">
                    <span className="text-[10px] text-muted-foreground tracking-wide">
                      idea_description.txt
                    </span>
                    <span
                      className={cn(
                        "text-[10px] tabular-nums tracking-wide transition-colors duration-300",
                        descriptionLength === 0 && "text-muted-foreground/40",
                        descriptionLength > 0 &&
                          descriptionLength < 30 &&
                          "text-amber-500",
                        descriptionLength >= 30 && "text-emerald-500"
                      )}
                    >
                      {descriptionLength < 30
                        ? `${descriptionLength} / 30 min`
                        : `${descriptionLength} chars`}
                    </span>
                  </div>

                  <FormControl>
                    <Textarea
                      className={cn(
                        "min-h-[248px] resize-none border-border bg-background/60 font-mono text-sm",
                        "placeholder:text-muted-foreground/35 focus-visible:ring-0",
                        "transition-colors focus-visible:border-primary"
                      )}
                      disabled={isGenerating}
                      placeholder={
                        "// Describe your SaaS idea\n// — Who are your target users?\n// — What problem does it solve?\n// — What features do you envision?\n// — Any constraints or tech preferences?"
                      }
                      {...field}
                    />
                  </FormControl>

                  {/* Character progress bar */}
                  <div className="h-[2px] w-full overflow-hidden bg-border">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
                        descriptionLength < 30
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      )}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <FormMessage className="px-0 pt-1.5 text-xs" />
                </FormItem>
              )}
            />

            {/* Toolbar row */}
            <div className="flex items-center justify-between border border-border border-t-0 px-3 py-2">
              <p className="text-[11px] text-muted-foreground/60">
                More context → richer blueprint
              </p>
              <Button
                className="gap-1.5"
                disabled={isGenerating || !form.formState.isValid}
                type="submit"
              >
                <Sparkles className="size-3.5" />
                {isGenerating ? "Generating…" : "Generate blueprint"}
              </Button>
            </div>
          </div>

          {/* Right: Outputs manifest or generation progress */}
          {isGenerating ? (
            <GenerationProgress activeStep={activeStep} />
          ) : (
            <div className="flex max-h-fit flex-col border border-border">
              {/* Panel title bar */}
              <div className="flex items-center justify-between border-border border-b bg-muted/40 px-3 py-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Output manifest
                </span>
                <span className="text-[10px] text-muted-foreground/40 tabular-nums">
                  5 artifacts
                </span>
              </div>

              {/* Output items */}
              <div className="flex flex-col divide-y divide-border">
                {BLUEPRINT_OUTPUTS.map(
                  ({ icon: Icon, label, description, index }) => (
                    <div
                      className="group flex items-start gap-3 px-3 py-3 transition-colors hover:bg-muted/30"
                      key={label}
                    >
                      <span className="mt-0.5 shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">
                        {index}
                      </span>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-border bg-background">
                        <Icon className="size-3 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs leading-tight">
                          {label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Footer tip */}
              <div className="mt-auto border-border border-t border-dashed px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <span className="text-foreground">Tip —</span> Include target
                  users, the core problem, and any constraints for the most
                  actionable blueprint.
                </p>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
