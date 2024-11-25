"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUserStore from "@/stores/user-store";
import MemoryForm from "./memory-form";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import LoginForm from "../login/login-form";
import { useRouter } from "next/navigation";
import UpdateMemoryForm from "./memory-form-update";

interface MemoryFormDialogProps {
  trigger?: React.ReactNode;
  laneId: number;
  onSuccess?: () => void;
}

const CreateMemoryFormDialog: React.FC<MemoryFormDialogProps> = (props) => {
  const { username } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {props.trigger ?? <Button>New Memory</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-lg p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>
            {username ? "Create a new memory" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            {username
              ? "Add details about your new memory."
              : "You need to sign in to create a memory."}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full w-full px-6 pb-6">
          {!username && <LoginForm />}
          {username && (
            <MemoryForm
              laneId={props.laneId}
              onSuccess={() => {
                setIsOpen(false);
                void utils.memories.getAllForLane.invalidate({
                  laneId: props.laneId,
                });
                props.onSuccess?.();
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface UpdateMemoryFormDialogProps {
  laneId: number;
  memoryId: number;
  name: string;
  description?: string | null;
  timestamp: string;
  trigger: React.ReactNode;
  imageUrl: string;
  onSuccess?: () => void;
}

const UpdateMemoryFormDialog: React.FC<UpdateMemoryFormDialogProps> = (
  props,
) => {
  const { username } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-lg p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>
            {username ? "Update your memory" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            {username
              ? "Edit the details of your memory below."
              : "You need to sign in to update this memory."}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full w-full px-6 pb-6">
          {!username && <LoginForm />}
          {username && (
            <UpdateMemoryForm
              id={props.memoryId}
              laneId={props.laneId}
              name={props.name}
              description={props.description}
              timestamp={props.timestamp}
              onSuccess={() => {
                setIsOpen(false);
                void utils.memories.getAllForLane.invalidate({
                  laneId: props.laneId,
                });
                void utils.memories.getOne.invalidate({
                  id: props.memoryId,
                });
                props.onSuccess?.();
              }}
              imageUrl={props.imageUrl}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteMemoryDialogProps {
  memoryId: number;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

const DeleteMemoryDialog: React.FC<DeleteMemoryDialogProps> = (props) => {
  const { username } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteMemory, isPending } =
    api.memories.deleteOne.useMutation({
      onSuccess: async (data) => {
        toast.success("Memory deleted successfully");
        props.onSuccess();
        router.push(`/lanes/${data.laneId}`);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(
          error.message ||
            "We couldn't delete the memory. Please try again later.",
        );
      },
    });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-lg p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {username ? "Delete your memory" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            {username
              ? "Are you sure you want to delete this memory? This action cannot be undone."
              : "You need to sign in to delete this memory."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="h-full w-full px-6 pb-6">
          {!username && <LoginForm />}
          {username && (
            <div className="flex w-full justify-between gap-2">
              <Button variant={"outline"} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => {
                  deleteMemory({
                    id: props.memoryId,
                    creator: username,
                  });
                }}
                isLoading={isPending}
              >
                Delete
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CreateMemoryFormDialog, UpdateMemoryFormDialog, DeleteMemoryDialog };
