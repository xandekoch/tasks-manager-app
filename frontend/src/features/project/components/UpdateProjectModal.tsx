"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaCreateProject, SchemaCreateProjectType } from "../types";
import { projectService } from "../services";
import ModalCard from "@/components/ModalCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormFields/FormInput";
import FormSelect from "@/components/FormFields/FormSelect";
import { useEffect } from "react";

type UpdateProjectModalProps = {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
};

export const UpdateProjectModal = ({ isOpen, onClose, projectId }: UpdateProjectModalProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const dataManagers = useQuery({
        queryKey: ['managers'],
        queryFn: async () => {
            const { managers } = await projectService.getManagers();
            return { managers };
        },
    });

    const { data } = useQuery({
        queryKey: [`project-${projectId}`, projectId],
        queryFn: async () => {
            const { project } = await projectService.getProject(projectId);
            setValue("name", project.name);
            setValue("description", project.description);
            setValue("status", project.status);
            setValue("manager", project.manager._id);
            return { project }
        },
        enabled: isOpen,
    });

    const updateProjectMutation = useMutation<void, Error, SchemaCreateProjectType>(
        {
            mutationFn: async (project: SchemaCreateProjectType) => {
                const response = await projectService.updateProject(project, projectId);
                console.log(response);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projects"] });
                toast({
                    title: `Project updated.`,
                });
                onClose()
            },
            onError: (error: Error) => {
                toast({
                    title: "Error updating project.",
                    description: error.message,
                    variant: "destructive",
                });
            },
        }
    );

    const form = useForm<SchemaCreateProjectType>({
        resolver: zodResolver(SchemaCreateProject),
        defaultValues: {
            name: '',
            description: '',
            status: '',
            manager: ''
        }
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

    function onSubmit(data: SchemaCreateProjectType) {
        const response = updateProjectMutation.mutate(data);
    };

    return (
        <ModalCard isOpen={isOpen} onOpenChange={onClose} title="Update a new Project">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-6 py-4">
                        <FormInput
                            form={form}
                            name="name"
                            label="Name"
                            placeholder="Project Name"
                        />

                        <FormSelect
                            form={form}
                            name="status"
                            label="Status"
                            options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
                        />

                        <FormSelect
                            form={form}
                            name="manager"
                            label="Manager"
                            options={dataManagers?.data?.managers.map(manager => ({
                                value: manager._id,
                                label: manager.name
                            }))}
                        />

                        <div className="col-span-3 space-y-2">
                            <Label className="text-muted-foreground">Description</Label>
                            <Textarea
                                placeholder="You can add a description to your campaign."
                                className="bg-background border-border text-foreground resize-none min-h-[120px]"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="animate-spin" />} {""}
                            Update now
                        </Button>
                    </div>
                </form>
            </Form>
        </ModalCard>
    );
};
