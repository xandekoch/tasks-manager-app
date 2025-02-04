"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaCreateUser, SchemaCreateUserType } from "../types";
import { userService } from "../services";
import ModalCard from "@/components/ModalCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormFields/FormInput";
import FormSelect from "@/components/FormFields/FormSelect";

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation<void, Error, SchemaCreateUserType>(
    {
      mutationFn: async (user: SchemaCreateUserType) => {
        const response = await userService.createUser(user);
        console.log(response);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: `User created.`,
        });
        onClose();
      },
      onError: (error: Error) => {
        toast({
          title: "Error creating user.",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  const form = useForm<SchemaCreateUserType>({
    resolver: zodResolver(SchemaCreateUser),
    defaultValues: {
      name: '',
      role: '',
      password: '',
      email: ''
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  function onSubmit(data: SchemaCreateUserType) {
    const response = createUserMutation.mutate(data);
  };

  return (
    <ModalCard isOpen={isOpen} onOpenChange={onClose} title="Create a new User">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-6 py-4">
            <FormInput
              form={form}
              name="name"
              label="Name"
              placeholder="User Name"
            />

            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Email"
            />

            <FormInput
              form={form}
              name="password"
              label="Password"
            />

            <FormSelect
              form={form}
              name="role"
              label="Role"
              options={[{ value: "user", label: "User" }, { value: "manager", label: "Manager" }, { value: "admin", label: "Admin" }]}
            />
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
