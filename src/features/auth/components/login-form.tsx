"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/features/auth/hooks";
import { loginSchema, type LoginInput } from "@/features/auth/types";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useLogin(redirectTo);

  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="space-y-4"
      noValidate
    >
      <Field id="login-email" label="Email" error={errors.email?.message}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Field
        id="login-password"
        label="Password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}
