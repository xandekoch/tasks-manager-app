"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaCreateTask, SchemaCreateTaskType } from "../types";
import { taskService } from "../services";
import ModalCard from "@/components/ModalCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormFields/FormInput";
import FormSelect from "@/components/FormFields/FormSelect";
import { useEffect } from "react";

type UpdateTaskModalProps = {
    taskId: string;
    isOpen: boolean;
    onClose: () => void;
};

export const UpdateTaskModal = ({ isOpen, onClose, taskId }: UpdateTaskModalProps) => {
    console.log(taskId)
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const dataUsers = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { users } = await taskService.getUsers();
            return { users };
        },
    });

    const { data } = useQuery({
        queryKey: [`task-${taskId}`, taskId],
        queryFn: async () => {
            const { task } = await taskService.getTask(taskId);
            setValue("title", task.title);
            setValue("description", task.description);
            setValue("status", task.status);
            setValue("assignedTo", task.assignedTo._id);
            return { task }
        },
        enabled: isOpen,
    });

    const updateTaskMutation = useMutation<void, Error, SchemaCreateTaskType>(
        {
            mutationFn: async (data: SchemaCreateTaskType) => {
                const response = await taskService.updateTask(data, taskId);
                console.log(response);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["tasks"] });
                toast({
                    title: `Task updated.`,
                });
                onClose()
            },
            onError: (error: Error) => {
                toast({
                    title: "Error updating task.",
                    description: error.message,
                    variant: "destructive",
                });
            },
        }
    );

    const form = useForm<SchemaCreateTaskType>({
        resolver: zodResolver(SchemaCreateTask),
        defaultValues: {
            title: '',
            description: '',
            status: '',
            assignedTo: ''
        }
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

    function onSubmit(data: SchemaCreateTaskType) {
        const response = updateTaskMutation.mutate(data);
    };

    return (
        <ModalCard isOpen={isOpen} onOpenChange={onClose} title="Update a new Task">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-6 py-4">
                        <FormInput
                            form={form}
                            name="title"
                            label="Title"
                            placeholder="Task Title"
                        />

                        <FormSelect
                            form={form}
                            name="status"
                            label="Status"
                            options={[{ value: "pending", label: "pending" }, { value: "in-progress", label: "In Progress" }, { value: "completed", label: "Completed" }]}
                        />

                        <FormSelect
                            form={form}
                            name="assignedTo"
                            label="Responsible"
                            options={dataUsers?.data?.users.map(user => ({
                                value: user._id,
                                label: user.name
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
