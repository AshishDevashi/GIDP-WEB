"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteRegistry } from "@/features/registries/hooks";
import type { Registry } from "@/features/registries/types";

export function DeleteRegistryDialog({
  registry,
  redirectToList = false,
}: {
  registry: Registry;
  redirectToList?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useDeleteRegistry(() => {
    setOpen(false);
    if (redirectToList) router.push("/registries");
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${registry.name}`}
        >
          <Trash2 className="text-danger h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {registry.name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the registry and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => mutate(registry.id)}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
