import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main
        className="max-w-hd mx-auto flex min-h-screen flex-col px-4 pt-[calc(72px+16px)]"
      ></main>
    </HydrateClient>
  );
}
