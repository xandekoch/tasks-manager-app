"use client";

import FullPageCard from "@/components/FullPageCard";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableFilters } from "@/components/TableFilters";
import { useSearchParams } from "next/navigation";
import SingleTableSkeleton from "@/components/skeletons/SingleTableSkeleton";
import { Pagination } from "@/components/Pagination";
import { COLUMNS_PROJECTS_TABLE, SEARCH_PROJECT_ORDER_OPTIONS } from "../constants";
import { projectService } from "../services";
import { Project } from "../types";
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
import { UpdateProjectModal } from "./UpdateProjectModal";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

const ProjectsTableCard = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const user = useAuthStore(state => state._user)


    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || SEARCH_PROJECT_ORDER_OPTIONS[0].value;
    const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = 5;
    const [isUpdateProjectModalOpen, setIsUpdateProjectModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const handleToggleModal = () => {
        setIsUpdateProjectModalOpen(prev => !prev);
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['projects', search, sort, currentPage],
        queryFn: async () => {
            const { projects, totalPages } = await projectService.getProjects({
                search,
                sort,
                page: currentPage,
                itemsPerPage,
            });
            console.log(totalPages)
            return { projects, totalPages };
        },
    });

    const deleteItemMutation = useMutation({
        mutationFn: async (project: Project) => {
            await projectService.deleteProject(project._id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast({
                title: 'Project deleted.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: `Error deleting Project.`,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleEditButton = (project: Project) => {
        setSelectedProjectId(project._id)
        handleToggleModal()
    };

    const handleShareButton = (project: Project) => {
        router.push(`/dashboard/${project._id}`);
    };

    const handleDeleteButton = (project: Project) => {
        deleteItemMutation.mutate(project);
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
            title='Projects'
            description='View and update your project details here.'
            customComponent={
                <div className="flex items-center gap-2">
                    <TableFilters
                        orderOptions={SEARCH_PROJECT_ORDER_OPTIONS}
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
                                    {COLUMNS_PROJECTS_TABLE.map((column) => (
                                        <TableHead key={column.header}>{column.header}</TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.projects.map((project: Project) => (
                                    <TableRow key={project._id}>
                                        {COLUMNS_PROJECTS_TABLE.map((column) => (
                                            <TableCell className="whitespace-nowrap" key={column.header}>
                                                {column.cell
                                                    ? column.cell(project)
                                                    : String(project[column.accessor])}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <div className="flex justify-end gap-2">

                                                {(user?.role === "admin" || user?._id === project.manager._id) &&
                                                    <ButtonEdit handleClick={() => handleEditButton(project)} />
                                                }


                                                <ButtonShare handleClick={() => handleShareButton(project)} />

                                                {user?.role === "admin" &&

                                                    <ButtonDelete handleClick={() => handleDeleteButton(project)} />
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

            <UpdateProjectModal
                isOpen={isUpdateProjectModalOpen}
                onClose={handleToggleModal}
                projectId={selectedProjectId!}
            />
        </FullPageCard>
    );
};

export default ProjectsTableCard;
