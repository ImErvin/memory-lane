import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DeleteMemoryDialog,
  UpdateMemoryFormDialog,
} from "./memory-form-dialog";
import { api } from "@/trpc/react";
import { useState } from "react";

interface MemoryActionDropdownMenuProps {
  memoryId: number;
  name: string;
  description: string | null;
  creator: string;
  laneId: number;
  timestamp: string;
  imageUrl: string;
}

const MemoryActionDropdownMenu: React.FC<MemoryActionDropdownMenuProps> = (
  props,
) => {
  const utils = api.useUtils();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <UpdateMemoryFormDialog
          trigger={
            <Button className="w-full justify-start" variant="ghost" size="sm">
              <Edit />
              <span>Edit</span>
            </Button>
          }
          memoryId={props.memoryId}
          name={props.name}
          description={props.description}
          laneId={props.laneId}
          timestamp={props.timestamp}
          onSuccess={() => {
            void utils.memories.getAllForLane.invalidate({
              laneId: props.laneId,
            });
            void utils.memories.getOne.invalidate({
              id: props.memoryId,
            });
          }}
          imageUrl={props.imageUrl}
        />
        <DeleteMemoryDialog
          trigger={
            <Button className="w-full justify-start" variant="ghost" size="sm">
              <Trash2 />
              <span>Delete</span>
            </Button>
          }
          memoryId={props.memoryId}
          onSuccess={() => {
            void utils.memories.getAllForLane.invalidate({
              laneId: props.laneId,
            });
            void utils.memories.getOne.invalidate({
              id: props.memoryId,
            });
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MemoryActionDropdownMenu;
