import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
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
  Plus
} from "lucide-react";
import { type ProjectTask } from "@/lib/projects";

const statuses = [
  { statusValue: "backlog", statusLabel: "Backlog", statusIcon: <Backlog color='#f2994a' size={20}/>, priorityValue: 0, priorityLabel: "No priority", priorityIcon: <NoPriority /> },
  { statusValue: "planned", statusLabel: "Planned", statusIcon: <Planned color='#d7d8db' size={20}/>, priorityValue: 1, priorityLabel: "Low", priorityIcon: <LowPriority /> },
  { statusValue: "in_progress", statusLabel: "In Progress", statusIcon: <InProgress color='#f0bf00' size={20}/>, priorityValue: 2, priorityLabel: "Medium", priorityIcon: <MediumPriority /> },
  { statusValue: "completed", statusLabel: "Completed", statusIcon: <Complete color='#5e6ad2' size={20}/>, priorityValue: 3, priorityLabel: "High", priorityIcon: <HighPriority /> },
  { statusValue: "cancelled", statusLabel: "Cancelled", statusIcon: <Cancelled color='#8a8f98' size={20}/>, priorityValue: 4, priorityLabel: "Urgent", priorityIcon: <UrgentPriority /> },
];

export default function IssuesTable({ projectTaskData }: { projectTaskData: ProjectTask[] }) {
  return (
    <>
      <div>
        <div>
          <Accordion type="multiple" collapsible>
            {statuses.map((status, index) => {
              const statusTasks = projectTaskData.filter(
                (task) => task.status === status.statusValue
              );

              if (statusTasks.length === 0) return null;

              return (
                <AccordionItem key={status.statusValue} value={`item-${index}`}>
                  <div className="flex justify-between items-center bg-muted px-6">
                    <AccordionTrigger className="font-semibold items-center flex-row-reverse">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {status.statusIcon}
                          {status.statusLabel}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {statusTasks.length}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <Plus size={16} />
                  </div>
                  <AccordionContent>
                    <Table>
                      <TableBody>
                        {statusTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium text-left pl-8">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  {status.priorityIcon}
                                  TES-38
                                </div>
                                <div className="flex items-center gap-2">
                                  {status.statusIcon}
                                  {task.name}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <div className="flex items-center justify-end gap-2">
                                <div>
                                  <div className="flex aspect-square size-6 items-center justify-center rounded-sm bg-amber-500 text-white">
                                    <span className="font-semibold text-xs">
                                      AH
                                    </span>
                                  </div>
                                </div>
                                <div>Dec 21</div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </>
  );
}