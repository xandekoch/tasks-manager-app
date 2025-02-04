'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateTaskModal } from "@/features/task/components/CreateTaskModal";
import TasksTableCard from "@/features/task/components/TasksTableCard";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/features/project/services';

export default function Tasks() {
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const user = useAuthStore(state => state._user)
    const { id } = useParams();

    const { data } = useQuery({
        queryKey: [`project-${id}`],
        queryFn: async () => {
            const { project } = await projectService.getProject(id as string);
            console.log(project)
            return { project };
        },
    });

    const handleToggleModal = () => {
        setIsCreateTaskModalOpen(prev => !prev);
    }

    return (
        <>
            <PageHeader
                title="Tasks"
                description="Manage yours tasks settings."
            >
                {(user?.role === "admin" || user?._id === data?.project.manager._id) &&
                    <Button onClick={handleToggleModal}>
                        + New Task
                    </Button>}
            </PageHeader>

            <TasksTableCard project={data?.project}/>

            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={handleToggleModal}
            />
        </>
    );
};
