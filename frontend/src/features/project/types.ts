import { z } from "zod";

export type Manager = {
    _id: string
    name: string
    email: string
    role: "admin" | "manager"
}

export type Project = {
    _id: string
    name: string
    description: string
    manager: Manager
    dateCreated: string
    status: "active" | "inactive"
}

export const SchemaCreateProject = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    description: z.string().optional(),
    status: z.string().min(1, {message: "Required"}),
    manager: z.string().optional()
});

export type SchemaCreateProjectType = z.infer<typeof SchemaCreateProject>;

export enum ProjectAction {
    Edit = "edit",
    Open = "open",
    Delete = "delete",
}
