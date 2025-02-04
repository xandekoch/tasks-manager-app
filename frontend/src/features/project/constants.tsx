import { Badge } from "@/components/ui/badge";
import { Project } from "./types";

export const SEARCH_PROJECT_ORDER_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const COLUMNS_PROJECTS_TABLE = [
  { header: "Name", accessor: "name" as const },
  {
    header: "Description", accessor: "description" as const,
    cell: (project: Project) => {
      const description = project.description;
      if (description.length >= 10) return <span>{project.description.slice(0, 10)}...</span>

      return <span>{description}</span>
    }
  },
  {
    header: "Date of Creation",
    accessor: "createdAt" as const,
    cell: (project: Project) => {
      const date = new Date(project.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: "Manager", accessor: "manager" as const,
    cell: (project: Project) => <span>{project.manager ? project.manager.name : 'No Manager'}</span>

  },
  {
    header: "Status",
    accessor: "status" as const,
    cell: (project: Project) => (
      <Badge variant={project.status === "active" ? "default" : "secondary"}>
        {project.status}
      </Badge>
    ),
  },
];
