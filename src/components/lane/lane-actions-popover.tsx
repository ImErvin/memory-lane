import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteLaneDialog, UpdateLaneFormDialog } from "./lane-form-dialog";
import { api } from "@/trpc/react";
import { useState } from "react";

interface LaneActionDropdownMenuProps {
  laneId: number;
  name: string;
  description: string | null;
  creator: string;
}

const LaneActionDropdownMenu: React.FC<LaneActionDropdownMenuProps> = (
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
        <UpdateLaneFormDialog
          trigger={
            <Button className="w-full justify-start" variant="ghost" size="sm">
              <Edit />
              <span>Edit</span>
            </Button>
          }
          laneId={props.laneId}
          name={props.name}
          description={props.description}
          onSuccess={() => {
            void utils.lanes.getAllForUsername.invalidate({
              creator: props.creator,
            });
            void utils.lanes.get10.invalidate();
          }}
        />
        <DeleteLaneDialog
          trigger={
            <Button className="w-full justify-start" variant="ghost" size="sm">
              <Trash2 />
              <span>Delete</span>
            </Button>
          }
          laneId={props.laneId}
          onSuccess={() => {
            void utils.lanes.getOne.invalidate({
              id: props.laneId,
            });
            void utils.lanes.get10.invalidate();
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LaneActionDropdownMenu;
