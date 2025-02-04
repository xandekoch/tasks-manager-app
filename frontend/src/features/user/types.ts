import { z } from "zod";

export type User = {
    _id: string
    name: string
    email: string
    role: "admin" | "user" | "manager"
    dateCreated: string
}

export const SchemaCreateUser = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    role: z.string().min(1, { message: "Required" }),
    password: z.string().min(6, { message: "6 characters at least" }),
    email: z.string().email()
});

export type SchemaCreateUserType = z.infer<typeof SchemaCreateUser>;

export enum UserAction {
    Edit = "edit",
    Delete = "delete",
}
