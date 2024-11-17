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
  Card,
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

interface MemoryPageProps {
  memory: inferProcedureOutput<AppRouter["memories"]["getOne"]>;
}

const AnimatedImage = animated(Image);

const MemoryPage: React.FC<MemoryPageProps> = (props) => {
  const [ref, inView] = useInView({
    amount: 0.5,
  });

  const fadeInOutSpring = useSpring({
    from: { opacity: 0, scale: 1, filter: "blur(40px)" },
    to: {
      opacity: inView ? 1 : 0,
      scale: inView ? 1 : 1.1,
      filter: "blur(20px)",
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
    <animated.main
      className="flex h-full min-h-screen w-full flex-col"
      style={fadeInSpring}
    >
      <Card className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-3xl">
        <animated.div className="absolute inset-0 z-0 h-full w-full flex-shrink-0 bg-cover bg-center">
          <AnimatedImage
            style={fadeInOutSpring}
            src={props.memory.imageUrl}
            alt={"background image"}
            layout="fill"
            objectFit="cover"
          />
        </animated.div>
        <div
          ref={ref}
          className="relative z-10 flex h-full max-h-[95%] min-h-[300px] w-full max-w-full flex-shrink items-center justify-center border-b object-center p-4"
        >
          <Image
            src={props.memory.imageUrl}
            alt={props.memory.name}
            className="rounded-xl object-contain object-center"
            fill
          />
        </div>
        <div className="z-10 w-full flex-shrink-0 bg-white">
          <div className="mx-auto flex w-full max-w-hd flex-col pr-4">
            <CardHeader className="w-full max-w-[360px]">
              <CardTitle className="text-xl lg:text-3xl">
                {props.memory.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {props.memory?.description && (
                <CardDescription className="w-full max-w-[360px]">
                  {props.memory.description}
                </CardDescription>
              )}
              <h3 className="text-sm text-gray-500">
                {format(new Date(props.memory.timestamp), "MMM dd, yyyy")}
              </h3>
            </CardContent>
            <CardFooter>
              <Link href={`/lanes/${props.memory.laneId}`}>
                <Button variant="default" size="sm">
                  See Lane
                </Button>
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    </animated.main>
  );
};

export default MemoryPage;
