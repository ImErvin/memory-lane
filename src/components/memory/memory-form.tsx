"use client";

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
import { handleUploadImage } from "@/lib/utils";
import ExifReader from "exifreader";
import { track } from "@vercel/analytics";

export const MAX_FILE_SIZE = 10000000;
export const ACCEPTED_IMAGE_TYPES = [
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
      `File size should be less than ${MAX_FILE_SIZE / 1000000}MB.`,
    )
    .refine(
      (files: File[]) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type ?? ""),
      "Only these types are allowed .jpg, .jpeg, .png and .webp",
    ),
});

interface MemoryFormProps {
  onSuccess: () => void;
  laneId: number;
}

const MemoryForm: React.FC<MemoryFormProps> = (props) => {
  const { username } = useUserStore();
  const router = useRouter();

  const { mutate: createMemory, isPending } =
    api.memories.createOne.useMutation({
      onSuccess: (data) => {
        toast.success("Memory created successfully", {
          action: {
            label: "View",
            onClick: () => {
              router.push(`/memories/${data.id}`);
            },
          },
        });

        track("memory_created", {
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
            "We couldn't create the memory. Please try again later.",
        );
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      timestamp: "",
      image: undefined,
    },
  });

  const imageRef = form.register("image", { required: true });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!username) return;

    const [imageFile] = values.image as File[];
    const imageUrl = await handleUploadImage(imageFile!);

    if (!imageUrl) return;

    const payload = {
      laneId: props.laneId,
      name: values.name,
      description: values.description,
      timestamp: values.timestamp
        ? new Date(values.timestamp).toISOString()
        : undefined,
      creator: username,
      imageUrl,
    };

    createMemory(payload);
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
              onChange={async (e) => {
                void imageRef.onChange(e);

                if (!e.target.files) return;

                const file = e.target.files[0];
                if (file) {
                  try {
                    const arrayBuffer = await file.arrayBuffer();
                    const tags = ExifReader.load(arrayBuffer);

                    if (tags.DateTimeOriginal) {
                      const dateTimeOriginal =
                        tags.DateTimeOriginal.description;

                      const formattedDate = new Date(dateTimeOriginal)
                        .toISOString()
                        .split("T")[0];

                      if (!formattedDate) return;

                      form.setValue("timestamp", formattedDate);
                    }
                  } catch (error) {
                    console.error("Error reading EXIF data:", error);
                  }
                }
              }}
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
          Save changes
        </Button>
      </form>
    </Form>
  );
};

export default MemoryForm;
