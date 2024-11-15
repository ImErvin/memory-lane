import { headerOffset } from "@/lib/utils";
import clsx from "clsx";

export default async function MemoryLanePage() {
  return (
    <main
      className={clsx(
        "mx-auto flex min-h-screen max-w-hd flex-col px-4",
        headerOffset,
      )}
    ></main>
  );
}
