"use client";

import { useParams, useRouter } from "next/navigation";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.project as string;
  const workspaceId = params.workspace as string;

  router.push(`/${workspaceId}/projects/${projectId}/overview`);
}
