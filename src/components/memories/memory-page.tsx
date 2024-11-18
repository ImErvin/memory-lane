"use client";
import { type AppRouter } from "@/server/api/root";
import {
  animated,
  config,
  useInView,
  useIsomorphicLayoutEffect,
  useSpring,
} from "@react-spring/web";
import { type inferProcedureOutput } from "@trpc/server";
import React from "react";
import {
  AnimatedCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { format } from "date-fns/format";
import Link from "next/link";
import { Button } from "../ui/button";
import MemoryActionDropdownMenu from "../memory/memory-actions-popover";
import useUserStore from "@/stores/user-store";
import { toZonedTime } from "date-fns-tz";

interface MemoryPageProps {
  memory: inferProcedureOutput<AppRouter["memories"]["getOne"]>;
}

const AnimatedImage = animated(Image);

const MemoryPage: React.FC<MemoryPageProps> = (props) => {
  const { username } = useUserStore();
  const [ref, inView] = useInView({
    amount: 0.5,
  });

  const fadeInOutSpring = useSpring({
    from: { opacity: 0, scale: 1 },
    to: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 1.1,
    },
    config: config.molasses,
  });

  const [fadeInSpring, fadeInSpringApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  }));

  // Not sure why some parts of the app dont need to use useIsomorphicLayoutEffect to play animations
  useIsomorphicLayoutEffect(() => {
    void fadeInSpringApi.start({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    });
  }, []);

  if (!props.memory) return null;

  return (
    <AnimatedCard
      style={fadeInSpring}
      className="relative flex h-full min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-3xl"
    >
      <animated.div className="absolute inset-0 z-0 h-full w-full flex-shrink-0 bg-cover bg-center">
        <AnimatedImage
          style={fadeInOutSpring}
          src={props.memory.imageUrl}
          alt={"background image"}
          layout="fill"
          objectFit="cover"
          className="blur-md"
        />
      </animated.div>
      <div
        ref={ref}
        className="relative z-10 mt-auto flex h-full max-h-[80%] min-h-[300px] w-full max-w-full flex-shrink items-center justify-center object-center p-4"
      >
        <Image
          src={props.memory.imageUrl}
          alt={props.memory.name}
          className="rounded-xl object-contain object-center max-w-full max-h-full"
          width={1200}
          height={1200}
        />
      </div>
      <div className="z-10 mt-auto w-full flex-shrink-0 bg-white">
        <div className="mx-auto flex w-full max-w-hd flex-col pr-4">
          <CardHeader className="flex w-full flex-row items-center justify-between space-y-0">
            <CardTitle className="max-w-[360px] truncate">
              {props.memory.name}
            </CardTitle>

            {username === props.memory.lane.creator && (
              <MemoryActionDropdownMenu
                laneId={props.memory.laneId}
                creator={props.memory.lane.creator}
                description={props.memory.description ?? ""}
                memoryId={props.memory.id}
                name={props.memory.name}
                timestamp={props.memory.timestamp.toISOString()}
                imageUrl={props.memory.imageUrl}
              />
            )}
          </CardHeader>
          <CardContent>
            {props.memory?.description && (
              <CardDescription className="w-full max-w-[360px]">
                {props.memory.description}
              </CardDescription>
            )}
            <h3 className="text-sm text-gray-500">
              {format(
                toZonedTime(props.memory.timestamp, "UTC"),
                "MMM dd, yyyy",
              )}
            </h3>
          </CardContent>
          <CardFooter>
            <Link href={`/lanes/${props.memory.laneId}`}>
              <Button variant="outline" size="sm">
                See Lane
              </Button>
            </Link>
          </CardFooter>
        </div>
      </div>
    </AnimatedCard>
    // </animated.main>
  );
};

export default MemoryPage;
