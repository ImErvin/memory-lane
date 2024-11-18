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
import { useEffect } from "react";
import { ACCEPTED_IMAGE_TYPES } from "./memory-form";
import { handleUploadImage } from "@/lib/utils";
import { track } from "@vercel/analytics";

const formSchemaUpdate = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name must be at most 50 characters." }),
  description: z
    .string()
    .max(250, "Description must be at most 250 characters")
    .optional(),
  timestamp: z.string().min(10, { message: "Invalid date" }),
  image: z.any().optional(),
});

interface UpdateMemoryFormProps {
  onSuccess: () => void;
  laneId: number;
  name: string;
  description?: string | null;
  timestamp: string;
  id: number;
  imageUrl: string;
}

const UpdateMemoryForm: React.FC<UpdateMemoryFormProps> = (props) => {
  const { username } = useUserStore();
  const router = useRouter();

  const { mutate: updateMemory, isPending } =
    api.memories.updateOne.useMutation({
      onSuccess: (data) => {
        toast.success("Memory updated successfully", {
          action: {
            label: "View",
            onClick: () => {
              router.push(`/memories/${data.id}`);
            },
          },
        });

        track("memory_updated", {
          laneId: data.laneId,
          memoryId: data.id,
          memoryName: data.name,
          timestamp:
            data?.timestamp?.toISOString()?.split("T")?.[0] ?? "unknown",
            username,
        });

        props.onSuccess();
      },
      onError: (error) => {
        toast.error(
          error.message ||
            "We couldn't update the memory. Please try again later.",
        );
      },
    });

  const form = useForm<z.infer<typeof formSchemaUpdate>>({
    resolver: zodResolver(formSchemaUpdate),
    defaultValues: {
      name: props.name,
      description: props.description ?? "",
      timestamp:
        (props.timestamp &&
          new Date(props.timestamp).toISOString().split("T")[0]) ??
        "",
      image: props.imageUrl,
    },
  });

  const imageRef = form.register("image", { required: true });

  useEffect(() => {
    if (props.imageUrl) {
      form.setValue("image", props.imageUrl);
    }
  }, [props.imageUrl, form]);

  const onSubmit = async (values: z.infer<typeof formSchemaUpdate>) => {
    if (!username) return;

    let imageUrl: string | undefined = props.imageUrl;

    if (values.image !== props.imageUrl) {
      const [imageFile] = values.image as File[];

      imageUrl = await handleUploadImage(imageFile!);
    }

    if (!imageUrl) return;

    const payload = {
      id: props.id,
      laneId: props.laneId,
      name: values.name,
      description: values.description,
      timestamp: values.timestamp
        ? new Date(values.timestamp).toISOString()
        : undefined,
      creator: username,
      imageUrl,
    };

    updateMemory(payload);
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

        <FormItem>
          <FormLabel>Picture</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              {...imageRef}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

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
              <FormLabel>When did this memory happen?</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="ml-auto"
          isLoading={form.formState.isSubmitting || isPending}
        >
          Update memory
        </Button>
      </form>
    </Form>
  );
};

export default UpdateMemoryForm;
