"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateRegistry } from "@/features/registries/hooks";
import {
  emptyRegistryForm,
  registryFormSchema,
  type RegistryFormValues,
  type RegistryPayload,
} from "@/features/registries/types";

export function CreateRegistryDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistryFormValues, unknown, RegistryPayload>({
    resolver: zodResolver(registryFormSchema),
    defaultValues: emptyRegistryForm,
  });

  const { mutate, isPending } = useCreateRegistry(() => {
    reset(emptyRegistryForm);
    setOpen(false);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset(emptyRegistryForm);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New registry
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a registry</DialogTitle>
          <DialogDescription>
            A registry hosts container images for your services.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => mutate(values))}
          className="space-y-4"
          noValidate
        >
          <Field id="registry-name" label="Name" error={errors.name?.message}>
            <Input
              id="registry-name"
              placeholder="test-api"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field
            id="registry-description"
            label="Description"
            error={errors.description?.message}
          >
            <Input
              id="registry-description"
              placeholder="test service image"
              {...register("description")}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-primary h-4 w-4"
              {...register("private")}
            />
            Private registry
          </label>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create registry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
