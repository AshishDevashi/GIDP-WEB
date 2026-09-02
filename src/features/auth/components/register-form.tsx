"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useRegister } from "@/features/auth/hooks";
import { registerSchema, type RegisterInput } from "@/features/auth/types";

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const { mutate, isPending } = useRegister(redirectTo);

  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="space-y-4"
      noValidate
    >
      <Field
        id="register-username"
        label="Username"
        error={errors.username?.message}
      >
        <Input
          id="register-username"
          autoComplete="username"
          placeholder="ashish"
          aria-invalid={Boolean(errors.username)}
          {...field("username")}
        />
      </Field>

      <Field id="register-email" label="Email" error={errors.email?.message}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={Boolean(errors.email)}
          {...field("email")}
        />
      </Field>

      <Field
        id="register-password"
        label="Password"
        error={errors.password?.message}
      >
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={Boolean(errors.password)}
          {...field("password")}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
