"use client";

import FullPageCard from "@/components/FullPageCard";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableFilters } from "@/components/TableFilters";
import { useSearchParams } from "next/navigation";
import SingleTableSkeleton from "@/components/skeletons/SingleTableSkeleton";
import { Pagination } from "@/components/Pagination";
import { COLUMNS_USERS_TABLE, SEARCH_USER_ORDER_OPTIONS } from "../constants";
import { userService } from "../services";
import { User } from "../types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ButtonEdit } from "@/components/buttons/ButtonEdit";
import { ButtonShare } from "@/components/buttons/ButtonShare";
import { ButtonDelete } from "@/components/buttons/ButtonDelete";
import { UpdateUserModal } from "./UpdateUserModal";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

const UsersTableCard = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const user = useAuthStore(state => state._user)


    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || SEARCH_USER_ORDER_OPTIONS[0].value;
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = 5;
    const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleToggleModal = () => {
        setIsUpdateUserModalOpen(prev => !prev);
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['users', search, sort, currentPage],
        queryFn: async () => {
            const { users, totalPages } = await userService.getUsers({
                search,
                sort,
                page: currentPage,
                itemsPerPage,
            });
            console.log(totalPages)
            return { users, totalPages };
        },
    });

    const deleteItemMutation = useMutation({
        mutationFn: async (user: User) => {
            await userService.deleteUser(user._id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({
                title: 'User deleted.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: `Error deleting User.`,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleEditButton = (user: User) => {
        setSelectedUserId(user._id)
        handleToggleModal()
    };

    const handleShareButton = (user: User) => {
        router.push(`/dashboard/${user._id}`);
    };

    const handleDeleteButton = (user: User) => {
        deleteItemMutation.mutate(user);
    };

    const updateSearchParams = (key: string, value: string) => {
        const newParams = new URLSearchParams(window.location.search);

        if (newParams.get(key) === value) {
            return;
        }

        if (key === "search") {
            newParams.set("page", "1");
        }

        newParams.set(key, value);
        router.push(`?${newParams.toString()}`);
    };

    const tableSkeletonRows = Array.from({ length: itemsPerPage + 1 }).map(
        (_, index) => <SingleTableSkeleton key={index} />
    );

    return (
        <FullPageCard
            title='Users'
            description='View and update your user details here.'
            customComponent={
                <div className="flex items-center gap-2">
                    <TableFilters
                        orderOptions={SEARCH_USER_ORDER_OPTIONS}
                        search={search}
                        sort={sort}
                        onSearchChange={(newSearch) =>
                            updateSearchParams("search", newSearch)
                        }
                        onSortChange={(newSort) => updateSearchParams("sort", newSort)}
                    />
                </div>
            }
        >

            {isLoading ? (
                tableSkeletonRows
            ) : (
                <>
                    <div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {COLUMNS_USERS_TABLE.map((column) => (
                                        <TableHead key={column.header}>{column.header}</TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.users.map((user: User) => (
                                    <TableRow key={user._id}>
                                        {COLUMNS_USERS_TABLE.map((column) => (
                                            <TableCell className="whitespace-nowrap" key={column.header}>
                                                {column.cell
                                                    ? column.cell(user)
                                                    : String(user[column.accessor])}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <ButtonEdit handleClick={() => handleEditButton(user)} />

                                                <ButtonDelete handleClick={() => handleDeleteButton(user)} />

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={data?.totalPages || 1}
                        onPageChange={(newPage) => updateSearchParams("page", newPage.toString())}
                    />
                </>
            )}

            <UpdateUserModal
                isOpen={isUpdateUserModalOpen}
                onClose={handleToggleModal}
                userId={selectedUserId!}
            />
        </FullPageCard>
    );
};

export default UsersTableCard;
