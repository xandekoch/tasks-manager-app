import axios from "axios";
import { SchemaCreateUserType } from "./types";

const authStorage = localStorage.getItem("auth-storage");
const parsedToken = JSON.parse(authStorage as string).state._token;

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${parsedToken}`
    },
});

export const userService = {
    getUsers: async (params: { search: string; sort: string; page: number, itemsPerPage: number }) => {
        try {
            const response = await apiClient.get("/api/users/", {
                params: {
                    search: params.search,
                    sort: params.sort,
                    page: params.page,
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching users");
            }
            throw new Error("Unknown error occurred while fetching users");
        }

    },

    getUser: async (id: string) => {
        try {
            const response = await apiClient.get(`/api/users/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching user");
            }
            throw new Error("Unknown error occurred while fetching user");
        }
    },

    createUser: async (data: SchemaCreateUserType) => {

        try {
            const response = await apiClient.post("/api/users", data);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during user creation");
            }
            throw new Error("Unknown error occurred while creating user");
        }
    },

    updateUser: async (data: SchemaCreateUserType, id: string) => {
        try {
            const { data: responseData } = await apiClient.patch(`/api/users/${id}`, data);
            return responseData;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "Error during user update";
                throw new Error(errorMessage);
            }
            throw new Error("Unknown error occurred while updating user");
        }
    },

    deleteUser: async (id: string) => {
        try {
            const response = await apiClient.delete(`/api/users/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during user delete");
            }
            throw new Error("Unknown error occurred while deleting user");
        }
    },

    getManagers: async () => {
        try {
            const response = await apiClient.get("/api/getManagers");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Error during fetching users");
            }
            throw new Error("Unknown error occurred while fetching users");
        }

    },
};

