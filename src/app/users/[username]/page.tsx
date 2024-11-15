import MemoriesGrid from "@/components/memories/memories-grid";
import { UserMemoriesProvider } from "@/contexts/user-memories";
import { headerOffset } from "@/lib/utils";
import { HydrateClient } from "@/trpc/server";
import clsx from "clsx";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function MemoryLanePage({ params }: Props) {
  const username = (await params).username;

  return (
    <HydrateClient>
      <UserMemoriesProvider username={username}>
        <main
          className={clsx(
            "max-w-hd mx-auto flex min-h-screen flex-col px-4",
            headerOffset,
          )}
        >
          <MemoriesGrid />
        </main>
      </UserMemoriesProvider>
    </HydrateClient>
  );
}
