"use client";

import { useMemoryLane } from "@/contexts/use-memory-lane";
import MemoryCard from "./memory-card";

const MemoriesGrid: React.FC = () => {
  const { memories, lane } = useMemoryLane();

  return (
    <div className="mx-auto flex w-full max-w-hd flex-col gap-20 px-4 pb-20">
      {memories.map((memory) => {
        return (
          <MemoryCard
            key={memory.id}
            name={memory.name}
            description={memory.description}
            id={memory.id}
            timestamp={memory.timestamp.toISOString()}
            creator={lane.creator}
            laneId={lane.id}
            imageUrl={memory.imageUrl}
          />
        );
      })}
    </div>
  );
};

export default MemoriesGrid;
