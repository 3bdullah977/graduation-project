import type { Metadata } from "next";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const metadata: Metadata = {
  title: "Create workspace",
  description: "Set up a new workspace for your team.",
};

export default function Page() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-background via-background to-muted/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_35%)]"
      />
      <div className="relative mx-auto flex max-w-5xl flex-1 flex-col gap-6 px-4 pt-10 pb-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-semibold text-primary text-xs uppercase tracking-wide">
              Workspaces
            </p>
            <h1 className="font-semibold text-3xl">Create a new workspace</h1>
            <p className="max-w-2xl text-muted-foreground">
              Launch a focused space for your team with invites, permissions,
              and a clean starting point. We keep things secure while you stay
              in flow.
            </p>
          </div>
        </div>

        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
