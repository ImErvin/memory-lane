import Link from "next/link";
import BoringAvatar from "../ui/boring-avatar";
import { Button } from "../ui/button";
import { format } from "date-fns/format";
import { useMemoryLane } from "@/contexts/use-memory-lane";
import useUserStore from "@/stores/user-store";
import { Menubar } from "../ui/menubar";
import { Card } from "../ui/card";
import { Pencil } from "lucide-react";
import {
  DeleteLaneDialog,
  UpdateLaneFormDialog,
} from "../lanes/lane-form-dialog";
import { useRouter } from "next/navigation";
import { CreateMemoryFormDialog } from "../memories/memories-form-dialog";

const MemoryLanePlaque = () => {
  const { lane, refetchLane, refetchMemories } = useMemoryLane();
  const { username } = useUserStore();
  const router = useRouter();

  if (!lane) return null;

  return (
    <div className="mx-auto flex w-full max-w-hd flex-col items-start px-4 pb-10">
      <div className="flex max-w-[300px] flex-col gap-2 pb-2 md:max-w-[500px]">
        <h1 className="font-magilio text-5xl font-bold">{lane.name}</h1>
        <p className="break-words font-medium text-primary">
          {lane?.description}
        </p>
        <div className="group flex items-center gap-2">
          <BoringAvatar name={lane.creator} size="sm" />
          <p className="peer text-xs text-primary/50">
            Created by
            <Link href={`/users/${lane.creator}`}>
              <Button variant={"link"} size="sm" className="px-1">
                {username === lane.creator ? "You" : lane.creator}
              </Button>
            </Link>
            on {format(new Date(lane.createdAt), "MMM dd, yyyy")}
          </p>
        </div>
        {username === lane.creator && (
          <Card className="mt-2 flex flex-row gap-2 bg-white/30 p-2">
            <CreateMemoryFormDialog
              trigger={
                <Button variant={"outline"} size={"sm"} className="mr-auto">
                  Add Memory
                </Button>
              }
              laneId={lane.id}
              onSuccess={() => {
                refetchLane();
                refetchMemories();
              }}
            />

            <UpdateLaneFormDialog
              trigger={
                <Button variant={"outline"} size={"sm"}>
                  Edit
                </Button>
              }
              description={lane?.description}
              name={lane.name}
              laneId={lane.id}
              onSuccess={refetchLane}
            />

            <DeleteLaneDialog
              trigger={
                <Button variant={"destructive"} size={"sm"}>
                  Delete
                </Button>
              }
              laneId={lane.id}
              onSuccess={() => {
                router.push(`/users/${username}`);
              }}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemoryLanePlaque;