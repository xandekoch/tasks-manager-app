"use client";

import FullPageCard from "@/components/FullPageCard";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableFilters } from "@/components/TableFilters";
import { useSearchParams } from "next/navigation";
import SingleTableSkeleton from "@/components/skeletons/SingleTableSkeleton";
import { Pagination } from "@/components/Pagination";
import { COLUMNS_TASKS_TABLE, SEARCH_TASK_ORDER_OPTIONS } from "../constants";
import { taskService } from "../services";
import { Task } from "../types";
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
import { UpdateTaskModal } from "./UpdateTaskModal";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { projectService } from "@/features/project/services";

const TasksTableCard = (project: any) => {
    const selectedProject = project.project;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const user = useAuthStore(state => state._user)
    const { id } = useParams();


    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || SEARCH_TASK_ORDER_OPTIONS[0].value;
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = 5;
    const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const handleToggleModal = () => {
        setIsUpdateTaskModalOpen(prev => !prev);
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['tasks', search, sort, currentPage],
        queryFn: async () => {
            const { tasks, totalPages } = await taskService.getTasks({
                search,
                sort,
                page: currentPage,
                itemsPerPage,
                projectId: id as string,
            });
            console.log(totalPages)
            return { tasks, totalPages };
        },
    });

    const deleteItemMutation = useMutation({
        mutationFn: async (task: Task) => {
            await taskService.deleteTask(task._id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast({
                title: 'Task deleted.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: `Error deleting Task.`,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleEditButton = (task: Task) => {
        setSelectedTaskId(task._id)
        handleToggleModal()
    };

    const handleDeleteButton = (task: Task) => {
        deleteItemMutation.mutate(task);
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
            title='Tasks'
            description='View and update your task details here.'
            customComponent={
                <div className="flex items-center gap-2">
                    <TableFilters
                        orderOptions={SEARCH_TASK_ORDER_OPTIONS}
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
                                    {COLUMNS_TASKS_TABLE.map((column) => (
                                        <TableHead key={column.header}>{column.header}</TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.tasks.map((task: Task) => (
                                    <TableRow key={task._id}>
                                        {COLUMNS_TASKS_TABLE.map((column) => (
                                            <TableCell className="whitespace-nowrap" key={column.header}>
                                                {column.cell
                                                    ? column.cell(task)
                                                    : String(task[column.accessor])}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <div className="flex justify-end gap-2">

                                                {(user?.role === "admin" || user?._id === selectedProject.manager._id) &&
                                                    <ButtonEdit handleClick={() => handleEditButton(task)} />
                                                }



                                                {user?.role === "admin" &&

                                                    <ButtonDelete handleClick={() => handleDeleteButton(task)} />
                                                }

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

            <UpdateTaskModal
                isOpen={isUpdateTaskModalOpen}
                onClose={handleToggleModal}
                taskId={selectedTaskId!}
            />
        </FullPageCard>
    );
};

export default TasksTableCard;
