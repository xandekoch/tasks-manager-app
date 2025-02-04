import { Badge } from "@/components/ui/badge";
import { Project } from "./types";

export const SEARCH_USER_ORDER_OPTIONS = [
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
];

export const COLUMNS_USERS_TABLE = [
  { header: "Name", accessor: "name" as const },
  { header: "Email", accessor: "email" as const },
  {
    header: "Date of Creation",
    accessor: "createdAt" as const,
    cell: (user: Project) => {
      const date = new Date(user.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: "Role",
    accessor: "role" as const,
    cell: (user: Project) => (
      <Badge variant={user.role === "manager" ? "secondary" : user.role === "admin" ? "default" : "outline"}>
        {user.role}
      </Badge>
    ),
  },
];
