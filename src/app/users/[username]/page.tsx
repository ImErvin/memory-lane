import LanesView from "@/components/lanes/lanes-view";
import ProfileBanner from "@/components/profile/banner";
import { UserProfileProvider } from "@/contexts/use-user-profile";
import { HydrateClient } from "@/trpc/server";

interface Props {
  params: Promise<{ username: string }>;
}

export default async function MemoryLanePage({ params }: Props) {
  const username = (await params).username;

  return (
    <HydrateClient>
      <UserProfileProvider username={username}>
        <main className="mx-auto flex w-full min-h-screen h-auto max-w-hd flex-col px-4 pt-[calc(72px+8px)] pb-4">
          <ProfileBanner />
          <LanesView />
        </main>
      </UserProfileProvider>
    </HydrateClient>
  );
}
