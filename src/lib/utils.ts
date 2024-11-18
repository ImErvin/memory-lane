import { upload } from "@vercel/blob/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertImageToWebP = (
  file: File,
  quality = 0.6,
  maxWidth = 1280,
  maxHeight = 1280,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height *= maxWidth / width;
            width = maxWidth;
          } else {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File(
                [blob],
                `${file.name.split(".")[0]}.webp`,
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                },
              );
              resolve(webpFile);
            } else {
              reject(new Error("Conversion to WebP failed"));
            }
          },
          "image/webp",
          quality,
        );
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};


export const handleUploadImage = async (file: File) => {
  try {
    const optimizedBlob = await convertImageToWebP(file, 0.75);
    const optimizedFile = new File(
      [optimizedBlob],
      `${file.name.split(".")[0]}.webp`,
      { type: "image/webp" }
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
  }
};