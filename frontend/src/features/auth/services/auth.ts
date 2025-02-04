import axios from "axios";
import { SchemaSigninType } from "../types";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const authService = {
    signIn: async (data: SchemaSigninType) => {
        try {
            const response = await apiClient.post("/api/auth/login", data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during login");
            }
        }
    },
};
