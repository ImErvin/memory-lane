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

        // Calculate the new dimensions while maintaining the aspect ratio
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
              // Create a new File from the Blob
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
          quality, // Use lower quality for more aggressive compression (e.g., 0.6 or lower)
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
