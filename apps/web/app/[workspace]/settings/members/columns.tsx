"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { attempt } from "@/lib/error-handling";
import { updateMemberRole, WorkspaceMember } from "@/lib/workspace";

export const columns: ColumnDef<WorkspaceMember>[] = [
  {
    accessorKey: "image",
    header: "Image",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant={row.original.role === "admin" ? "destructive" : "outline"}
      >
        {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "addedAt",
    header: "Added At",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const handleUpdateRole = async (
        role: "admin" | "developer" | "viewer"
      ) => {
        const [, error] = await attempt(
          updateMemberRole(row.original.workspaceId, row.original.id, role)
        );
        if (error) {
          toast.error("Failed to update member role");
          return;
        }
        queryClient.invalidateQueries({
          queryKey: ["workspace-members", row.original.workspaceId],
        });
        toast.success("Member role updated successfully");
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8" size="icon" variant="ghost">
              <EllipsisVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <PencilIcon className="h-4 w-4" />
                    Update role
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleUpdateRole("admin")}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateRole("developer")}
                  >
                    Developer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleUpdateRole("viewer")}>
                    Viewer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
