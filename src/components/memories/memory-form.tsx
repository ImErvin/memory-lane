"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";
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
import { convertImageToWebP } from "@/lib/utils";

const MAX_FILE_SIZE = 3000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  image: z
    .any()
    .refine((files: File[]) => files?.length == 1, "A picture is required.")
    .refine(
      (files: File[]) => files[0] && files[0].size <= MAX_FILE_SIZE,
      `File size should be less than 3mb.`,
    )
    .refine(
      (files: File[]) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type ?? ""),
      "Only these types are allowed .jpg, .jpeg, .png and .webp",
    ),
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
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      toast.error(
        error.message ||
          "We couldn't create the memory. Please try again later.",
      );
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
      toast.error(
        error.message ||
          "We couldn't update the memory. Please try again later.",
      );
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.name ?? "",
      description: props.description ?? "",
      timestamp: props.timestamp ?? "",
      image: undefined,
    },
  });

  const imageRef = form.register("image", { required: true });

  const handleUploadImage = async (file: File) => {
    setIsUploadingFile(true);

    try {
      // Trying to add some sort of image optimization on client side
      // this uses a canvas to resize the image and convert it to webp with a lower quality
      // could be improved by either using a service or a web worker or something else
      const optimizedBlob = await convertImageToWebP(file, 0.75);

      const optimizedFile = new File(
        [optimizedBlob],
        `${file.name.split(".")[0]}.webp`,
        {
          type: "image/webp",
        },
      );

      const newBlob = await upload(optimizedFile.name, optimizedFile, {
        access: "public",
        handleUploadUrl: "/api/memory/upload",
      });

      if (!newBlob) return;

      return newBlob.url;
    } catch (error) {
      console.error(error);
      toast.error("We couldn't upload the image. Please try again later.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!username) return;
    // Can assume that the validation has already passed
    // Casting as zod does not have a way to infer the type "file"
    const [imageFile] = values.image as File[];
    const imageUrl = await handleUploadImage(imageFile!);

    if (!imageUrl) return;

    const payload = {
      id: props.id ?? -1,
      laneId: props.laneId,
      name: values.name,
      description: values.description,
      timestamp: values.timestamp
        ? new Date(values.timestamp).toISOString()
        : undefined,
      creator: username,
      imageUrl,
    };

    if (props.id) {
      updateMemory(payload);
    } else {
      createMemory(payload);
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
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    {...imageRef}
                  />
                </div>
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
