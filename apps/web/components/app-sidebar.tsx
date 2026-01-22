"use client";

import {
  Briefcase,
  Clock,
  Inbox,
  Plus,
  Square,
  TrendingUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { NavUser } from "./nav-user";

function getData(slug: string) {
  return {
    navMain: [
      {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        badge: 3,
      },
      {
        title: "My issues",
        url: "#",
        icon: TrendingUp,
      },
      {
        title: "Create workspace",
        url: "/workspaces/new",
        icon: Plus,
      },
      {
        title: "Workspace",
        url: "#",
        icon: undefined,
        isActive: true,
        isCollapsible: true,
        items: [
          {
            title: "Projects",
            url: `/${encodeURIComponent(slug)}/projects`,
            icon: Briefcase,
          },

          {
            title: "Issues",
            url: `/${encodeURIComponent(slug)}/issues`,
            icon: Square,
            badge: 12,
          },
          {
            title: "Cycles",
            isActive: true,
            isCollapsible: false,
            url: `/${encodeURIComponent(slug)}/cycles`,
            icon: Clock,
            items: [
              {
                title: "Current",
                url: `/${encodeURIComponent(slug)}/cycles/current`,
              },
              {
                title: "Upcoming",
                url: `/${encodeURIComponent(slug)}/cycles/upcoming`,
              },
            ],
          },
        ],
      },
    ],
  };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const slug = decodeURIComponent(params.workspace as string);
  const { navMain } = getData(slug);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-2">
        <NavMain items={navMain} showLabel={false} />
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t">
        <NavUser
          user={{
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
