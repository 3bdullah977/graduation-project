"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Loading } from "@/components/loading";
import { WorkspaceLayoutClient } from "./workspace-layout-client";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }
  if (!session?.user) {
    router.push("/login");
    return null;
  }
  return <WorkspaceLayoutClient>{children}</WorkspaceLayoutClient>;
}
