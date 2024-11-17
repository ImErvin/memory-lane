"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AnimatedButton } from "../ui/button";
import { ArrowRight } from "lucide-react";
import {
  config,
  useIsomorphicLayoutEffect,
  useSpring,
} from "@react-spring/web";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

interface LaneCardProps {
  id: number;
  name: string;
  description?: string;
  creator: string;
  memoryCount?: number;
}

const LaneCard: React.FC<LaneCardProps> = (props) => {
  const [fadeInSpring, fadeInSpringApi] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  }));

  // Not sure why some parts of the app dont need to use useIsomorphicLayoutEffect to play animations
  useIsomorphicLayoutEffect(() => {
    fadeInSpringApi.start({
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    });
  }, []);

  return (
    <Card className="h-[200px] flex-shrink-0">
      <CardHeader className="w-full max-w-full border-b !p-4">
        <CardTitle className="truncate">{props.name}</CardTitle>
      </CardHeader>
      <Link
        href={`/lanes/${props.id}`}
        className="group flex h-full w-full flex-col"
      >
        <AnimatedButton
          className="flex h-[calc(100%-49px)] w-full flex-col items-start rounded-b-xl rounded-t-none border-none p-0 text-start"
          variant={"outline"}
          style={fadeInSpring}
        >
          <CardContent className="grid w-full flex-shrink-0 grid-cols-3 gap-2 px-4 !pb-0 pt-4">
            {new Array(3).fill(0).map((_, i) => {
              if ((props.memoryCount ?? 0) < i + 1) return null;

              return (
                <img
                  key={i}
                  src={`https://picsum.photos/200/${300 + props.id + i}`}
                  className="h-full max-h-20 w-full bg-gray-200 object-cover"
                />
              );
            })}
          </CardContent>
          <CardFooter className="mt-auto flex w-full items-center justify-between !px-4 pb-4">
            <p className="text-xs text-muted-foreground">
              {props?.memoryCount ?? 0} Memorie{props?.memoryCount !== 1 && "s"}
            </p>
            <ArrowRight className="text-muted-foreground opacity-0 transition-transform group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
          </CardFooter>
        </AnimatedButton>
      </Link>
    </Card>
  );
};
export default LaneCard;
