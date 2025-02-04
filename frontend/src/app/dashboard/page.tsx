"use client";

import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/features/project/components/CreateProjectModal";
import ProjectsTableCard from "@/features/project/components/ProjectsTableCard";
import { useAuthStore } from "@/stores/authStore";

export default function Home() {
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const user = useAuthStore(state => state._user)

    const handleToggleModal = () => {
        setIsCreateProjectModalOpen(prev => !prev);
    }

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Manage yours projects settings."
            >
                {user?.role === "admin" &&
                    <Button onClick={handleToggleModal}>
                        + New Project
                    </Button>}
            </PageHeader>

            <ProjectsTableCard />

            <CreateProjectModal
                isOpen={isCreateProjectModalOpen}
                onClose={handleToggleModal}
            />
        </>
    );
};
