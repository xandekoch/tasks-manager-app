"use client";

import Link from "next/link";
import { Apple, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SchemaSignin, SchemaSigninType } from "@/features/auth/types";
import { useToast } from "@/hooks/use-toast";
import { authService } from "../services/auth";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

const SigninForm = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchemaSigninType>({
    resolver: zodResolver(SchemaSignin),
  });

  const login = useAuthStore((state) => state.login);

  const router = useRouter();

  const onSubmit = async (data: SchemaSigninType) => {
    try {
      const response = await authService.signIn(data);

      const { user, token } = response;

      login(user, token);

      router.push("/dashboard");

      toast({
        title: "You are successfully logged in!",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during sign-in:", error.message);
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: error.message,
        });
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-6 p-6"
    >
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Log in to track and complete your tasks!
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-primary">Email:</p>
          <Input
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-primary">Password:</p>
          <Input
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />} {""}
          Sign up
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="underline text-primary hover:text-primary"
          >
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SigninForm;
