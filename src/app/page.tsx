import Landing from "@/components/home/landing-lane-grid";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen max-w-hd flex-col w-full px-4 pt-[calc(72px+8px)] gap-10 overflow-x-hidden">
        <Landing />
      </main>
    </HydrateClient>
  );
}
