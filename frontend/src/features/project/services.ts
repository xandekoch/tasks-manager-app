import axios from "axios";
import { SchemaCreateProjectType } from "./types";

let parsedToken: string | null = null;

if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
        parsedToken = JSON.parse(authStorage).state._token;
    }
}

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "authorization": parsedToken ? `Bearer ${parsedToken}` : "",
    },
});

export const projectService = {
    getProjects: async (params: { search: string; sort: string; page: number, itemsPerPage: number }) => {
        try {
            const response = await apiClient.get("/api/projects/", {
                params: {
                    search: params.search,
                    sort: params.sort,
                    page: params.page,
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching projects");
            }
            throw new Error("Unknown error occurred while fetching projects");
        }

    },

    getProject: async (id: string) => {
        try {
            const response = await apiClient.get(`/api/projects/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching project");
            }
            throw new Error("Unknown error occurred while fetching project");
        }
    },

    createProject: async (data: SchemaCreateProjectType) => {

        try {
            const response = await apiClient.post("/api/projects", data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during project creation");
            }
            throw new Error("Unknown error occurred while creating project");
        }
    },

    updateProject: async (data: SchemaCreateProjectType, id: string) => {
        try {
            const { data: responseData } = await apiClient.patch(`/api/projects/${id}`, data);
            return responseData;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Error during project update";
                throw new Error(errorMessage);
            }
            throw new Error("Unknown error occurred while updating project");
        }
    },

    deleteProject: async (id: string) => {
        try {
            const response = await apiClient.delete(`/api/projects/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during project delete");
            }
            throw new Error("Unknown error occurred while deleting project");
        }
    },

    getManagers: async () => {
        try {
            const response = await apiClient.get("/api/getManagers");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching projects");
            }
            throw new Error("Unknown error occurred while fetching projects");
        }

    },
};

