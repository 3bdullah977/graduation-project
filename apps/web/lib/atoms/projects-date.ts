import { atom } from "jotai";

export type Project = {
  createdAt: string | null;
  description: string;
  endDate: string | null;
  id: string;
  name: string;
  priority: number;
  startDate: string;
  status: "backlog" | "planned" | "in_progress" | "completed" | "cancelled";
  updatedAt: string;
  workspaceId: string;
};

export const projectsDateAtom = atom<Project[]>([]);
