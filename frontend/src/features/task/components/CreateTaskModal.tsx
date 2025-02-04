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
import { useParams } from "next/navigation";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const project = id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { users } = await taskService.getUsers();
      return { users };
    },
  });

  const createTaskMutation = useMutation<void, Error, SchemaCreateTaskType>(
    {
      mutationFn: async (task: SchemaCreateTaskType) => {
        const response = await taskService.createTask(task, project as string);
        console.log(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast({
          title: `Task creates.`,
        });
        onClose();
      },
      onError: (error: Error) => {
        toast({
          title: "Error creating task.",
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
    formState: { errors, isSubmitting },
  } = form;

  function onSubmit(data: SchemaCreateTaskType) {
    const response = createTaskMutation.mutate(data);
  };

  return (
    <ModalCard isOpen={isOpen} onOpenChange={onClose} title="Create a new Task">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-6 py-4">
            <FormInput
              form={form}
              name="title"
              label="Title"
              placeholder="Task Name"
            />

            <FormSelect
              form={form}
              name="status"
              label="Status"
              options={[{ value: "pending", label: "Pending" }, { value: "in-progress", label: "In Progress" }, { value: "completed", label: "Completed" }]}
            />

            <FormSelect
              form={form}
              name="assignedTo"
              label="Responsible"
              options={data?.users.map(user => ({
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
              Create now
            </Button>
          </div>
        </form>
      </Form>
    </ModalCard>
  );
};
