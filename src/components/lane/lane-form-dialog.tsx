"use client";

import type React from "react";
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
import { useState } from "react";
import useUserStore from "@/stores/user-store";
import LoginForm from "../login/login-form";
import LaneForm from "./lane-form";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface LaneFormDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const CreateLaneFormDialog: React.FC<LaneFormDialogProps> = (props) => {
  const { username } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {props.trigger ?? <Button>New Memory Lane</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-lg p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>
            {username ? "Create a new memory lane" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            {username
              ? "Store your memories in a new memory lane."
              : "You need to sign in to create a memory lane."}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full w-full px-6 pb-6">
          {!username && <LoginForm />}
          {username && (
            <LaneForm
              onSuccess={() => {
                setIsOpen(false);
                props.onSuccess?.();
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface UpdateLaneFormDialogProps extends LaneFormDialogProps {
  laneId: number;
  name: string;
  description: string | null;
  trigger: React.ReactNode;
}

const UpdateLaneFormDialog: React.FC<UpdateLaneFormDialogProps> = (props) => {
  const { username } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-lg p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>
            {username ? "Update your Memory Lane" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            {username
              ? "Edit the fields below to update your memory lane."
              : "You need to sign in to update this memory lane."}
          </DialogDescription>
        </DialogHeader>
        <div className="h-full w-full px-6 pb-6">
          {!username && <LoginForm />}
          {username && (
            <LaneForm
              onSuccess={() => {
                setIsOpen(false);
                props.onSuccess?.();
              }}
              id={props.laneId}
              name={props.name}
              description={props.description}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteLaneDialogProps {
  laneId: number;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

const DeleteLaneDialog: React.FC<DeleteLaneDialogProps> = (props) => {
  const { username } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const [isInvalidating, setIsInvalidating] = useState(false);

  const { mutate: deleteLane, isPending } = api.lanes.deleteOne.useMutation({
    onSuccess: async () => {
      toast.success("Memory lane deleted successfully");

      setIsInvalidating(true);
      await utils.lanes.get10.invalidate();
      await utils.lanes.getAllForUsername.invalidate({
        creator: username!,
      });
      setIsInvalidating(false);

      setIsOpen(false);

      props.onSuccess();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "We couldn't delete the memory lane. Please try again later.",
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-[360px] rounded-lg p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {username ? "Delete your Memory Lane" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            {username
              ? "Are you sure you want to delete this memory lane? This action cannot be undone."
              : "You need to sign in to delete this memory lane."}
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
                  deleteLane({
                    id: props.laneId,
                    creator: username,
                  });
                }}
                isLoading={isPending || isInvalidating}
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

export { CreateLaneFormDialog, UpdateLaneFormDialog, DeleteLaneDialog };
