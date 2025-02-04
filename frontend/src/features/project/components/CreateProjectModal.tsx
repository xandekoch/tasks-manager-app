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

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['managers'],
    queryFn: async () => {
      const { managers } = await projectService.getManagers();
      return { managers };
    },
  });

  const createProjectMutation = useMutation<void, Error, SchemaCreateProjectType>(
    {
      mutationFn: async (project: SchemaCreateProjectType) => {
        const response = await projectService.createProject(project);
        console.log(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast({
          title: `Project created.`,
        });
        onClose();
      },
      onError: (error: Error) => {
        toast({
          title: "Error creating project.",
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
    formState: { errors, isSubmitting },
  } = form;

  function onSubmit(data: SchemaCreateProjectType) {
    const response = createProjectMutation.mutate(data);
  };

  return (
    <ModalCard isOpen={isOpen} onOpenChange={onClose} title="Create a new Project">
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
              options={data?.managers.map(manager => ({
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
              Create now
            </Button>
          </div>
        </form>
      </Form>
    </ModalCard>
  );
};
