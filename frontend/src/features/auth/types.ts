import { z } from "zod";

export const SchemaSignin = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, {message: "Password must have at least 6 characters"})
});

export type SchemaSigninType = z.infer<typeof SchemaSignin>;