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
import { useDeleteRepo } from "@/features/repos/hooks";
import type { Repo } from "@/features/repos/types";

export function DeleteRepoDialog({
  repo,
  redirectToList = false,
}: {
  repo: Repo;
  redirectToList?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useDeleteRepo(() => {
    setOpen(false);
    if (redirectToList) router.push("/repos");
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Delete ${repo.name}`}>
          <Trash2 className="text-danger h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {repo.name}?</DialogTitle>
          <DialogDescription>
            This permanently removes the repository and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isPending}
            onClick={() => mutate(repo.id)}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
