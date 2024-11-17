"use client";

import { useMemoryLane } from "@/contexts/use-memory-lane";
import MemoryView from "./memory-view";
import { useScroll } from "@react-spring/web";

const MemoriesGrid: React.FC = () => {
  const { memories } = useMemoryLane();

  return (
    <>
      <div className="h-full max-h-[20%] flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent" />
      <div className="grid gap-10 bg-black">
        {memories.map((memory, i) => {
          return (
            <MemoryView
              key={memory.id}
              name={memory.name}
              description={memory.description}
              id={memory.id}
              timestamp={memory.timestamp}
              pageNumber={i}
            />
          );
        })}
      </div>
    </>
  );
};

export default MemoriesGrid;
