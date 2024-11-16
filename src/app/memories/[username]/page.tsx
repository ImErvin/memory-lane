import MemoriesGrid from "@/components/memories/memories-grid";
import { UserMemoriesProvider } from "@/contexts/user-memories";
import { HydrateClient } from "@/trpc/server";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function MemoryLanePage({ params }: Props) {
  const username = (await params).username;

  return (
    <HydrateClient>
      <UserMemoriesProvider username={username}>
        <main className="mx-auto flex min-h-screen max-w-hd flex-col px-4 pt-[calc(72px+16px)]">
          <MemoriesGrid />
        </main>
      </UserMemoriesProvider>
    </HydrateClient>
  );
}
