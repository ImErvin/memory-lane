import MemoryLane from "@/components/lane/lane-view";
import { MemoryLaneProvider } from "@/contexts/use-memory-lane";
import { api, HydrateClient } from "@/trpc/server";
import { type TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function MemoryLanePage({ params }: Props) {
  const laneId = (await params).id;

  const lane = await api.lanes
    .getOne({ id: Number(laneId ?? "-1") })
    .catch((err: TRPCError) => {
      if (err?.code === "NOT_FOUND") notFound();

      throw err;
    });

  const memories = await api.memories.getAllForLane({
    laneId: Number(laneId ?? "-1"),
  });

  return (
    <HydrateClient>
      <MemoryLaneProvider
        initialLane={lane}
        laneId={Number(laneId ?? "-1")}
        initialMemories={memories}
      >
        <MemoryLane />
      </MemoryLaneProvider>
    </HydrateClient>
  );
}
