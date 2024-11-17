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
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";

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
  timestamp: z.string().min(10, { message: "Invalid date" }),
});

interface MemoryFormProps {
  onSuccess: () => void;
  laneId: number;
  name?: string;
  description?: string | null;
  timestamp?: string;
  id?: number;
}

const MemoryForm: React.FC<MemoryFormProps> = (props) => {
  const { username } = useUserStore();
  const router = useRouter();

  const { mutate: createMemory } = api.memories.createOne.useMutation({
    onSuccess: (data) => {
      toast.success("Memory created successfully", {
        action: {
          label: "View",
          onClick: () => {
            router.push(`/memories/${data.id}`);
          },
        },
      });
      props.onSuccess();
    },
    onError: (error) => {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("We couldn't create the memory. Please try again later.");
      }
    },
  });

  const { mutate: updateMemory } = api.memories.updateOne.useMutation({
    onSuccess: (data) => {
      toast.success("Memory updated successfully", {
        action: {
          label: "View",
          onClick: () => {
            router.push(`/memories/${data.id}`);
          },
        },
      });
      props.onSuccess();
    },
    onError: (error) => {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("We couldn't update the memory. Please try again later.");
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name ?? "",
      description: props.description ?? "",
      timestamp: props.timestamp ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!username) {
      return;
    }

    if (props.id) {
      updateMemory({
        id: props.id,
        name: values.name,
        description: values.description,
        timestamp: values.timestamp
          ? new Date(values.timestamp).toISOString()
          : undefined,
        creator: username,
      });
    } else {
      createMemory({
        laneId: props.laneId,
        name: values.name,
        description: values.description,
        timestamp: values.timestamp
          ? new Date(values.timestamp).toISOString()
          : undefined,
        creator: username,
      });
    }
  };

  return (
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
                  placeholder="Enter memory name"
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
                  placeholder="Enter memory description"
                  className="h-10 max-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timestamp</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="ml-auto">
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default MemoryForm;
