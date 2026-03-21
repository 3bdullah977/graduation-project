"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Analyzing project description",
  "Evaluating market feasibility",
  "Identifying core features",
  "Determining technical requirements",
  "Generating database schema (DDL)",
  "Creating user flow diagram",
  "Finalizing blueprint",
] as const;

export type BlueprintStep = (typeof STEPS)[number];

export type BlueprintProgressEvent =
  | { step: BlueprintStep; status: "in_progress" | "completed" }
  | { done: true; blueprintId: string };

type GenerationProgressProps = {
  activeStep?: BlueprintStep;
};

function getStatusLabel(isIdle: boolean, isLastStep: boolean): string {
  if (isIdle) {
    return "idle";
  }
  if (isLastStep) {
    return "finalizing";
  }
  return "in_progress";
}

function getStatusText(isIdle: boolean, isLastStep: boolean): string {
  if (isIdle) {
    return "Awaiting input…";
  }
  if (isLastStep) {
    return "Wrapping up your blueprint…";
  }
  return "AI is working on your blueprint…";
}

function StepIcon({
  isCompleted,
  isActive,
}: {
  isCompleted: boolean;
  isActive: boolean;
}) {
  if (isCompleted) {
    return <CheckCircle2 className="size-3.5 text-emerald-500" />;
  }
  if (isActive) {
    return <Loader2 className="size-3.5 animate-spin text-primary" />;
  }
  return <div className="size-3 border border-border" />;
}

export function GenerationProgress({ activeStep }: GenerationProgressProps) {
  const activeIndex = activeStep ? STEPS.indexOf(activeStep) : -1;
  const isIdle = !activeStep;
  const isLastStep = activeIndex === STEPS.length - 1;
  const completedCount = activeIndex < 0 ? 0 : activeIndex;

  function getStatusColorClass(): string {
    if (isIdle) {
      return "text-muted-foreground/40";
    }
    if (isLastStep) {
      return "animate-pulse text-primary";
    }
    return "animate-pulse text-amber-500";
  }
  const statusColorClass = getStatusColorClass();

  return (
    <div className="flex flex-col border border-border">
      {/* Panel title bar */}
      <div className="flex items-center justify-between border-border border-b bg-muted/40 px-3 py-1.5">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Generation log
        </span>
        <span
          className={cn(
            "text-[10px] tabular-nums transition-colors",
            statusColorClass
          )}
        >
          {getStatusLabel(isIdle, isLastStep)}
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col divide-y divide-border/50">
        {STEPS.map((step, index) => {
          const isActive = activeStep === step;
          const isCompleted = activeIndex > index;
          const isPending = !(isActive || isCompleted);
          const stepNum = String(index + 1).padStart(2, "0");

          return (
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 transition-colors duration-300",
                isCompleted ? "bg-emerald-500/5" : null,
                isActive ? "bg-primary/5" : null,
                isPending ? "opacity-40" : null
              )}
              key={step}
            >
              <span className="w-4 shrink-0 text-[10px] text-muted-foreground/40 tabular-nums">
                {stepNum}
              </span>

              <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                <StepIcon isActive={isActive} isCompleted={isCompleted} />
              </div>

              <span
                className={cn(
                  "text-[11px] transition-colors duration-300",
                  isCompleted ? "text-emerald-600 dark:text-emerald-400" : null,
                  isActive ? "font-medium text-foreground" : null,
                  isPending ? "text-muted-foreground" : null
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress footer */}
      <div className="mt-auto space-y-1.5 border-border border-t border-dashed px-3 py-2.5">
        <div className="h-[2px] w-full overflow-hidden bg-border">
          <div
            className="h-full bg-primary transition-all duration-700 ease-out"
            style={{
              width: `${(completedCount / STEPS.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          {getStatusText(isIdle, isLastStep)}
        </p>
      </div>
    </div>
  );
}
