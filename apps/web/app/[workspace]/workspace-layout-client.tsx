"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function WorkspaceLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSettingsRoute = pathname?.includes("/settings") ?? false;

  return (
    <SidebarProvider>
      {!isSettingsRoute && <AppSidebar />}
      {children}
    </SidebarProvider>
  );
}
