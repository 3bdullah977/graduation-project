'use client'

import IssuesTable from "@/app/[workspace]/_components/issues-table";
import { useQuery } from "@tanstack/react-query";
import { attempt } from "@/lib/error-handling";
import { getProjectTask } from "@/lib/projects";
import { currentWorkspaceAtom } from "@/lib/atoms/current-workspace";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Loading } from "@/components/loading";

export default function ProjectIssues() {
  const [currentWorkspace, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);

  const params = useParams();
  const projectId = params.project as string;

  const { data: projectTaskData, isLoading } = useQuery({
    queryKey: ["projectTask", projectId],
    queryFn: async () => {
      if (!projectId) {
        return [];
      }
      
      const [projectTaskResult, projectTaskError] = await attempt(
        getProjectTask(currentWorkspace.id, projectId)
      );
          if (projectTaskError || !projectTaskResult) {
            toast.error("Error while fetching project tasks");
            return [];
          }
          return projectTaskResult.data.tasks;
        }
      });
      
      if (isLoading) {
        return <Loading />;
      }
      return (
        <>
      <div>
        <IssuesTable projectTaskData={projectTaskData} />
      </div>
    </>
  )
}