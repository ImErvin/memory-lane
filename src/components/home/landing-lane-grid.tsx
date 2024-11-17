"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { CreateLaneFormDialog } from "../lanes/lane-form-dialog";
import LaneCard from "../lanes/lane-card";
import Marquee from "react-fast-marquee";

const Landing: React.FC = () => {
  const { data: lanes, refetch } = api.lanes.get10.useQuery();

  return (
    <div className="flex flex-col max-w-full pt-10">
      <div className="flex flex-col md:flex-row h-full md:h-1/2 w-full items-start gap-20 pt-10">
        <div className="flex w-full max-w-[300px] items-center justify-center">
          <h1 className="font-magilio text-6xl font-bold">
            Welcome to Memory Lane
          </h1>
        </div>
        <div className="flex w-full max-w-[300px] flex-col gap-2">
          <h2 className="text-lg font-medium">What is Memory Lane?</h2>
          <p className="text-sm font-normal">
            Memory Lane is a place where you can create and share memories with
            your friends and family. Create a lane, add memories, and share it
            with your loved ones.
          </p>
          <CreateLaneFormDialog
            trigger={<Button className="mt-4">Get Started</Button>}
            onSuccess={refetch}
          />
        </div>
        <div className="flex max-w-[375px] flex-col gap-2">
          <h2 className="text-lg font-medium">Just browsing?</h2>
          <p className="max-w-[300px] text-sm font-normal">
            Take a look at some of the public lanes created by our users. You
            can view the memories shared in these lanes and get a feel of what
            Memory Lane is all about.
          </p>
        </div>
      </div>

      <Marquee autoFill className="h-[300px] items-start" gradient gradientWidth={4} pauseOnHover>
        <div className="ml-4 flex flex-1 flex-row gap-4">
          {lanes?.map((lane) => (
            <LaneCard
              key={lane.id}
              id={lane.id}
              name={lane.name}
              description={lane.description ?? ""}
              creator={lane.creator}
              memoryCount={lane._count.memories}
            />
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default Landing;
