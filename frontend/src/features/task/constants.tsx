import { Badge } from "@/components/ui/badge";
import { Task } from "./types";

export const SEARCH_TASK_ORDER_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const COLUMNS_TASKS_TABLE = [
  { header: "Title", accessor: "title" as const },
  {
    header: "Description", accessor: "description" as const,
    cell: (task: Task) => {
      const description = task.description;
      if (description.length >= 10) return <span>{task.description.slice(0, 10)}...</span>

      return <span>{description}</span>
    }
  },
  {
    header: "Date of Creation",
    accessor: "createdAt" as const,
    cell: (task: Task) => {
      const date = new Date(task.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: "Responsible", accessor: "assignedTo" as const,
    cell: (task: Task) => <span>{task.assignedTo ? task.assignedTo.name : 'Not defined'}</span>

  },
  {
    header: "Status",
    accessor: "status" as const,
    cell: (task: Task) => (
      <Badge variant={task.status === "completed" ? "default" : "secondary"}>
        {task.status}
      </Badge>
    ),
  },
];
