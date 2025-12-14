"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { currentWorkspaceAtom } from "@/lib/atoms/current-workspace";
import { attempt } from "@/lib/error-handling";
import { listWorkspaces, type Workspace } from "@/lib/workspace";

const ITEMS_PER_PAGE = 12;

export default function WorkspacesPage() {
  const router = useRouter();
  const [, setActiveWorkspace] = useAtom(currentWorkspaceAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["workspaces", currentPage],
    queryFn: async () => {
      const [result, error] = await attempt(
        listWorkspaces(currentPage, ITEMS_PER_PAGE)
      );
      if (error || !result) {
        toast.error("Error while fetching workspaces");
        return { workspaces: [], total: 0 };
      }
      return result.data;
    },
  });

  const workspaces = data?.workspaces ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleWorkspaceClick = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    router.push(`/${encodeURIComponent(workspace.slug)}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageClick =
    (page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      handlePageChange(page);
    };

  const renderPaginationItems = () => {
    const items: React.ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={handlePageClick(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    // Show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          isActive={currentPage === 1}
          onClick={handlePageClick(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate start and end of visible pages
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the start
    if (currentPage <= 3) {
      start = 2;
      end = 4;
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            onClick={handlePageClick(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show last page
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href="#"
          isActive={totalPages === currentPage}
          onClick={handlePageClick(totalPages)}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-background via-background to-muted/40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_35%)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 pt-10 pb-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-semibold text-primary text-xs uppercase tracking-wide">
              Workspaces
            </p>
            <h1 className="font-semibold text-3xl">All Workspaces</h1>
            <p className="max-w-2xl text-muted-foreground">
              Manage and access all your workspaces. Select a workspace to get
              started or create a new one.
            </p>
          </div>
          <Button asChild>
            <Link href="/workspaces/new">
              <Plus className="mr-2 size-4" />
              Create workspace
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
        {!isLoading && workspaces.length > 0 && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <Card
                  className="cursor-pointer transition-all hover:shadow-md"
                  key={workspace.id}
                  onClick={() => handleWorkspaceClick(workspace)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <span className="font-semibold text-sm">
                          {workspace.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {workspace.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Workspace Slug: {workspace.slug}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Created{" "}
                      {new Date(workspace.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Accessed{" "}
                      {new Date(workspace.accessedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
        {!isLoading && workspaces.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No workspaces yet</CardTitle>
              <CardDescription>
                Get started by creating your first workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant={"outline"}>
                <Link href="/workspaces/new">
                  <Plus className="mr-2 size-4" />
                  Create your first workspace
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
