"use client";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useUserProfile } from "@/contexts/use-user-profile";
import { Skeleton } from "../ui/skeleton";
import {CreateLaneFormDialog} from "./lane-form-dialog";
import LanesGrid from "./lanes-grid";

const InitialLoadingState = () => {
  return (
    <Skeleton className="flex h-[calc(100%-80px)] w-full flex-col gap-2" />
  );
};

const EmptyState = () => {
  const { isCurrentUser } = useUserProfile();
  const { refetchLanes } = useUserProfile();

  return (
    <Card className="flex h-full w-full flex-col items-center gap-1 pt-10 text-center">
      <h1 className="text-xl font-medium tracking-wide">No memories to show</h1>
      {isCurrentUser && (
        <>
          <p className="max-w-[250px] text-gray-500">
            Let&apos;s create a new memory lane to start adding memories.
          </p>
          <CreateLaneFormDialog
            trigger={
              <Button className="mt-3" size="lg" variant={"default"}>
                Get Started
              </Button>
            }
            onSuccess={refetchLanes}
          />
        </>
      )}
    </Card>
  );
};

const LanesView: React.FC = () => {
  const { memoryLanes, isInitialFetching } = useUserProfile();

  if (isInitialFetching) {
    return <InitialLoadingState />;
  }

  if (!memoryLanes.length) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-[calc(100%-80px)] w-full flex-col gap-2">
      <LanesGrid />
    </div>
  );
};

export default LanesView;
