"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type React from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useUserStore from "@/stores/user-store";
import { usePathname, useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

// Define the form schema with validation using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name must be at most 50 characters." }),
  description: z
    .string()
    .max(250, "Description must be at most 250 characters")
    .optional(),
});

interface LaneFormProps {
  onSuccess: () => void;
  name?: string;
  description?: string | null;
  id?: number;
}

const LaneForm: React.FC<LaneFormProps> = (props) => {
  const { username } = useUserStore();
  const router = useRouter();
  const pathName = usePathname();

  const { mutate: createLane, isPending } = api.lanes.createOne.useMutation({
    onSuccess: (data) => {
      toast.success(
        "Memory lane created successfully, redirecting you to your new lane!",
        {
          duration: 3000,
        },
      );
      track("memory_lane_created", {
        laneId: data.id,
        laneName: data.name,
        username: data.creator,
      });
      router.push(`/lanes/${data.id}`);
      props.onSuccess();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "We couldn't create the memory lane. Please try again later.",
      );
    },
  });

  const { mutate: updateLane, isPending: isUpdatePending } =
    api.lanes.updateOne.useMutation({
      onSuccess: (data) => {
        const isOnCurrentPage = pathName === `/lanes/${data.id}`;

        track("memory_lane_updated", {
          laneId: data.id,
          laneName: data.name,
          username: data.creator,
        });

        toast.success("Memory lane updated successfully", {
          ...(isOnCurrentPage
            ? {}
            : {
                action: {
                  label: "View",
                  onClick: () => {
                    router.push(`/lanes/${data.id}`);
                  },
                },
              }),
        });

        props.onSuccess();
      },
      onError: (error) => {
        toast.error(
          error.message ||
            "We couldn't update the memory lane. Please try again later.",
        );
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name ?? "",
      description: props.description ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!username) {
      return;
    }

    // If the lane has an ID, we are updating an existing lane
    if (props.id) {
      updateLane({
        id: props.id,
        name: values.name,
        description: values.description,
        creator: username,
      });

      return;
    }

    createLane({
      creator: username,
      name: values.name,
      description: values.description,
    });
  };

  const formContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (formContainerRef.current) {
        formContainerRef.current.style.setProperty(
          "bottom",
          `env(safe-area-inset-bottom)`,
        );
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <div ref={formContainerRef}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter lane name"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter lane description"
                    className="h-10 max-h-[150px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="ml-auto"
            isLoading={
              form.formState.isSubmitting || isPending || isUpdatePending
            }
          >
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LaneForm;
