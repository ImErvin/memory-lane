"use client";

import { useMemoryLane } from "@/contexts/use-memory-lane";
import {
  animated,
  config,
  useIsomorphicLayoutEffect,
  useSpring,
} from "@react-spring/web";
import MemoryLanePlaque from "./memory-lane-plaque";
import { Button } from "../ui/button";
import { CreateMemoryFormDialog } from "../memories/memories-form-dialog";
import MemoriesGrid from "../memories/memories-grid";
import useUserStore from "@/stores/user-store";
import { ScrollArea } from "../ui/scroll-area";

const EmptyState = () => {
  const { username } = useUserStore();
  const { lane } = useMemoryLane();

  return (
    <div className="!h-full bg-white p-6 mx-auto w-full max-w-hd">
      {username === lane.creator && (
        <CreateMemoryFormDialog
          trigger={
            <Button
              variant="outline"
              className="h-full w-full animate-pulse border-2 border-dashed"
            >
              <span className="max-w-[200px] text-wrap">
                Start by pressing here!
              </span>
            </Button>
          }
          laneId={lane.id}
        />
      )}

      {username !== lane.creator && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-xl font-medium text-gray-500">
            {lane.creator} has not added any memories yet.
          </p>
        </div>
      )}
    </div>
  );
};

const MemoryLane: React.FC = () => {
  const [fadeInSpring, fadeInSpringApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  }));

  // Not sure why some parts of the app dont need to use useIsomorphicLayoutEffect to play animations
  useIsomorphicLayoutEffect(() => {
    void fadeInSpringApi.start({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    });
  }, []);

  const { lane, memories } = useMemoryLane();

  if (!lane) return null;

  return (
    <animated.main
      className="flex h-full min-h-screen w-full flex-col"
      style={fadeInSpring}
    >
      <ScrollArea className="">
        <div className="z-0 flex h-auto w-full pt-[calc(72px+8px+16px)]">
          <MemoryLanePlaque />
        </div>
        {memories.length === 0 && <EmptyState />}
        {memories.length !== 0 && <MemoriesGrid />}
      </ScrollArea>
    </animated.main>
  );
};

export default MemoryLane;
