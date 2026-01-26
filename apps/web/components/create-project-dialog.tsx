"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  ChevronRight,
  Target,
  User,
  Users,
  ShieldCheck as Complete,
  Loader as Backlog,
  Shield as Planned,
  ShieldX as Cancelled,
  ShieldEllipsis as InProgress,
  Ellipsis as NoPriority,
  SignalLow as LowPriority,
  SignalMedium as MediumPriority,
  SignalHigh as HighPriority,
  OctagonAlert as UrgentPriority,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { attempt } from "@/lib/error-handling";
import { type CreateProjectData, createProject } from "@/lib/projects";
import type { Workspace } from "@/lib/workspace";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace;
};

const priorityOptions = [
  { value: 0, label: "No priority", icon: <NoPriority /> },
  { value: 1, label: "Low", icon: <LowPriority /> },
  { value: 2, label: "Medium", icon: <MediumPriority /> },
  { value: 3, label: "High", icon: <HighPriority /> },
  { value: 4, label: "Urgent", icon: <UrgentPriority /> },
];

const statusOptions = [
  { value: "backlog", label: "Backlog", icon: <Backlog color='#f2994a'/> },
  { value: "planned", label: "Planned", icon: <Planned color='#d7d8db'/> },
  { value: "in_progress", label: "In Progress", icon: <InProgress color='#f0bf00'/> },
  { value: "completed", label: "Completed", icon: <Complete color='#5e6ad2'/> },
  { value: "cancelled", label: "Cancelled", icon: <Cancelled color='#8a8f98'/> },
] as const;

const schema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  status: z.enum([
    "backlog",
    "planned",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  priority: z.number().min(0).max(4),
});

type FormValues = z.infer<typeof schema>;

export function CreateProjectDialog({
  open,
  onOpenChange,
  workspace,
}: CreateProjectDialogProps) {
  const [startDate, setStartDate] = React.useState<Date>();
  const [targetDate, setTargetDate] = React.useState<Date>();

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      status: "backlog",
      priority: 0,
    },
    mode: "onChange",
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const [result, error] = await attempt(createProject(workspace.id, data));
      if (error || !result) {
        throw new Error("Failed to create project");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects", workspace.id] });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Error while creating project");
    },
  });

  function onSubmit(data: FormValues) {
    createMutation.mutate({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      status: data.status,
      priority: data.priority,
    });
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh]! gap-0 overflow-y-auto p-0 sm:max-w-4xl!">
        <DialogHeader className="space-y-4 p-6 pb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${workspace.slug}`}>
                  {workspace.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="size-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>New project</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-6 px-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="h-12 border-none p-0 font-bold text-xl! shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                        placeholder="Project name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-auto h-8" size="sm">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    {status.icon && (
                                      <span className="size-4">{status.icon}</span>
                                    )}
                                    <span>{status.label}</span>
                                  </div>
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select 
                          value={String(field.value)} 
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger className="w-auto h-8" size="sm">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              priorityOptions.map((priority) => (
                                <SelectItem key={priority.value} value={String(priority.value)}>
                                  <div className="flex items-center gap-2">
                                    {priority.icon && (
                                      <span className="size-4">{priority.icon}</span>
                                    )}
                                    <span>{priority.label}</span>
                                  </div>
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-8 gap-1.5"
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <User className="size-3.5" />
                  Lead
                </Button>
                <Button
                  className="h-8 gap-1.5"
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <Users className="size-3.5" />
                  Members
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 gap-1.5"
                      size="sm"
                      type="button"
                    >
                      {startDate ? (
                        format(startDate, "MMM dd, yyyy")
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="size-3.5" />
                          <span>Start</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 gap-1.5"
                      size="sm"
                      type="button"
                      disabled={!startDate}
                    >
                      {targetDate ? (
                        format(targetDate, "MMM dd, yyyy")
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Target className="size-3.5" />
                          <span>Target</span>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={targetDate}
                      onSelect={setTargetDate}
                      disabled={(date) => {
                        if (date > new Date() || date < new Date("1900-01-01")) {
                          return true;
                        }
                        if (startDate && date <= startDate) {
                          return true;
                        }
                        return false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="border-t pt-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="min-h-[200px] resize-none border-none p-0 text-base! shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                          placeholder="Write a description, a project brief, or collect ideas..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-4 pb-6">
              <Button
                onClick={() => onOpenChange(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={createMutation.isPending || !form.formState.isValid}
                type="submit"
              >
                {createMutation.isPending ? "Creating..." : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
