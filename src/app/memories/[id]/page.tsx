import MemoryLane from "@/components/lane/memory-lane-view";
import MemoryPage from "@/components/memories/memory-page";
import { MemoryLaneProvider } from "@/contexts/use-memory-lane";
import { api, HydrateClient } from "@/trpc/server";
import { type TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function MemoryLanePage({ params }: Props) {
  const laneId = (await params).id;

  const lane = await api.memories
    .getOne({ id: Number(laneId ?? "-1") })
    .catch((err: TRPCError) => {
      if (err?.code === "NOT_FOUND") notFound();

      throw err;
    });

  return (
    <HydrateClient>
      <MemoryPage memory={lane} />
    </HydrateClient>
  );
}
