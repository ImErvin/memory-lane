"use client";

import { useMemoryLane } from "@/contexts/use-memory-lane";
import MemoryView from "./memory-view";

const MemoriesGrid: React.FC = () => {
  const { memories } = useMemoryLane();

  return (
    <>
      <div className="mx-auto flex w-full max-w-hd flex-col gap-20 px-4 pb-20">
        {memories.map((memory) => {
          return (
            <MemoryView
              key={memory.id}
              name={memory.name}
              description={memory.description}
              id={memory.id}
              timestamp={memory.timestamp}
              imageUrl={memory.imageUrl}
            />
          );
        })}
      </div>
    </>
  );
};

export default MemoriesGrid;
