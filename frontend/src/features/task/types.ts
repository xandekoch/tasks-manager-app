import { z } from "zod";

export type AssignedTo = {
    _id: string
    name: string
    email: string
    role: "admin" | "manager" | "user"
}

export type Task = {
    _id: string
    title: string
    description: string
    assignedTo: AssignedTo
    createdAt: string
    status: "pending" | "in-progress" | "completed"
}

export const SchemaCreateTask = z.object({
    title: z.string().min(2, "Name must be at least 2 characters long"),
    description: z.string().optional(),
    status: z.string().min(1, {message: "Required"}),
    assignedTo: z.string().optional()
});

export type SchemaCreateTaskType = z.infer<typeof SchemaCreateTask>;

export enum TaskAction {
    Edit = "edit",
    Delete = "delete",
}
