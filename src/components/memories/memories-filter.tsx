import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemoryLane } from "@/contexts/use-memory-lane";

const MemoriesFilter = () => {
  const { orderBy, setOrderBy, isRevalidatingMemories } = useMemoryLane();

  return (
    <Select
      disabled={isRevalidatingMemories}
      value={orderBy}
      onValueChange={(value: "asc" | "desc") => setOrderBy(value)}
    >
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue placeholder="Sort Order" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Order By</SelectLabel>
          <SelectItem value="asc">Old to New</SelectItem>
          <SelectItem value="desc">New to Old</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MemoriesFilter;
