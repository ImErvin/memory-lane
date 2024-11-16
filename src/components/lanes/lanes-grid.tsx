"use client";
import { api } from "@/trpc/react";

const LanesGrid: React.FC = () => {
  const { data } = api.lanes.getAllForUsername.useQuery({
    creator: "test",
  });

  return <h1>Hey</h1>;
};

export default LanesGrid;
