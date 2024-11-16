"use client";

import { AnimatedCard, Card } from "../ui/card";
import { Button } from "../ui/button";
import { useUserProfile } from "@/contexts/user-profile";

const EmptyState = () => {
  const { isCurrentUser } = useUserProfile();

  return (
    <AnimatedCard className="flex h-full w-full flex-col items-center pt-20">
      <h1 className="text-3xl font-medium tracking-wide">No Memory Lanes :(</h1>
      {isCurrentUser && (
        <div>
          <p className="text-lg text-gray-500">
            Create a memory lane to start adding memories.
          </p>
          <Button>New Memory Lane</Button>
        </div>
      )}
    </AnimatedCard>
  );
};

const LanesView: React.FC = () => {
  const { isCurrentUser, memoryLanes } = useUserProfile();

  if (!memoryLanes.length) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-2">
      {/* <Card className="h-full w-full p-3">
        <div className="flex flex-row items-center justify-between">
          <Button>New Memory Lane</Button>
        </div>
      </Card> */}
    </div>
  );
};

export default LanesView;
