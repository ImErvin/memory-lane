import { headerOffset } from "@/lib/utils";
import { HydrateClient } from "@/trpc/server";
import clsx from "clsx";

export default async function Home() {
  return (
    <HydrateClient>
      <main
        className={clsx(
          "max-w-hd mx-auto flex min-h-screen flex-col px-4",
          headerOffset,
        )}
      ></main>
    </HydrateClient>
  );
}
