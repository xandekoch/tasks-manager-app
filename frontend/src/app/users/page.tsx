"use client";

import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { CreateUserModal } from "@/features/user/components/CreateUserModal";
import UsersTableCard from "@/features/user/components/UsersTableCard";

export default function Home() {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const user = useAuthStore(state => state._user)

    const handleToggleModal = () => {
        setIsCreateUserModalOpen(prev => !prev);
    }

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Manage yours users settings."
            >
                {user?.role === "admin" &&
                    <Button onClick={handleToggleModal}>
                        + New User
                    </Button>}
            </PageHeader>

            <UsersTableCard />

            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                onClose={handleToggleModal}
            />
        </>
    );
};
