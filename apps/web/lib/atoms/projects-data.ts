import { atom } from "jotai";
import type { Project } from "@/lib/projects";

export const projectsDataAtom = atom<Project[]>([]);
