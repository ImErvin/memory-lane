"use client";

import { Loader } from "lucide-react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import LaneCard from "./lane-card";
import { useUserProfile } from "@/contexts/use-user-profile";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { clsx } from "clsx";

const LanesGrid: React.FC = () => {
  const { memoryLanes, isRevalidating } = useUserProfile();

  return (
    <Card className="relative h-[calc(100%-16px)] overflow-hidden bg-white border-none">
      <ScrollArea className="flex h-full">
        <div className="grid-rows-auto relative grid h-full w-full max-w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] flex-col gap-2 pt-6 pb-4">
          {memoryLanes.map((lane) => (
            <LaneCard
              key={lane.id}
              id={lane.id}
              name={lane.name}
              description={lane.description ?? ""}
              creator={lane.creator}
              memoryCount={lane._count.memories}
            />
          ))}
        </div>
      </ScrollArea>
      <Tooltip>
        <TooltipTrigger asChild>
          <Loader
            className={clsx(
              "absolute right-4 top-4 animate-spin opacity-0 transition-opacity",
              isRevalidating && "opacity-50",
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Making sure you have the latest memories available!</p>
        </TooltipContent>
      </Tooltip>
    </Card>
  );
};

export default LanesGrid;
