import axios from "axios";
import { SchemaCreateTaskType } from "./types";

const authStorage = localStorage.getItem("auth-storage");
const parsedToken = JSON.parse(authStorage as string).state._token;

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${parsedToken}`
    },
});

export const taskService = {
    getTasks: async (params: { search: string; sort: string; page: number, itemsPerPage: number, projectId: string }) => {
        try {
            const response = await apiClient.get("/api/tasks/", {
                params: {
                    search: params.search,
                    sort: params.sort,
                    page: params.page,
                    projectId: params.projectId,
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching tasks");
            }
            throw new Error("Unknown error occurred while fetching tasks");
        }

    },

    getTask: async (id: string) => {
        try {
            const response = await apiClient.get(`/api/tasks/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching task");
            }
            throw new Error("Unknown error occurred while fetching task");
        }
    },

    createTask: async (data: SchemaCreateTaskType, project: string) => {

        try {
            const response = await apiClient.post("/api/tasks", { ...data, project });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during task creation");
            }
            throw new Error("Unknown error occurred while creating task");
        }
    },

    updateTask: async (data: SchemaCreateTaskType, id: string) => {
        try {
            const { data: responseData } = await apiClient.patch(`/api/tasks/${id}`, data);
            return responseData;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Error during task update";
                throw new Error(errorMessage);
            }
            throw new Error("Unknown error occurred while updating task");
        }
    },

    deleteTask: async (id: string) => {
        try {
            const response = await apiClient.delete(`/api/tasks/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during task delete");
            }
            throw new Error("Unknown error occurred while deleting task");
        }
    },

    getUsers: async () => {
        try {
            const response = await apiClient.get("/api/users");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching tasks");
            }
            throw new Error("Unknown error occurred while fetching tasks");
        }

    },
};

