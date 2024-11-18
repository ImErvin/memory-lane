"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import {
  animated,
  config,
  useIsomorphicLayoutEffect,
  useSpring,
} from "@react-spring/web";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import useUserStore from "@/stores/user-store";
import LaneActionDropdownMenu from "../lane/lane-actions-popover";

interface LaneCardProps {
  id: number;
  name: string;
  description?: string;
  creator: string;
  memoryCount?: number;
  isPublic?: boolean;
  images: string[];
}

const LaneCard: React.FC<LaneCardProps> = (props) => {
  const { username } = useUserStore();
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

  return (
    <Card className="flex-shrink-0">
      <CardHeader className="flex w-full max-w-full flex-row items-center justify-between space-y-0 border-b !px-4 !py-2">
        <CardTitle className="truncate">{props.name}</CardTitle>
        {props.isPublic && (
          <div>
            <Link href={`/users/${props.creator}`}>
              <Button
                variant={"link"}
                size="sm"
                className="text-xs text-muted-foreground"
              >
                {props.creator}
              </Button>
            </Link>
          </div>
        )}
        {!props.isPublic && username === props.creator && (
          <LaneActionDropdownMenu
            laneId={props.id}
            name={props.name}
            description={props.description ?? ""}
            creator={props.creator}
          />
        )}
      </CardHeader>
      {/* TODO: Fix this card content to be more responsive */}
      <AnimatedLink
        href={`/lanes/${props.id}`}
        className="group flex h-[200px] w-full flex-col"
        style={fadeInSpring}
      >
        <CardContent className="grid w-full flex-shrink-0 grid-cols-3 gap-2 px-4 !pb-0 pt-4">
          {new Array(3).fill(0).map((_, i) => {
            if (!props?.images?.[i]) {
              return (
                <div
                  key={`${props.id}-${i}`}
                  className="aspect-square h-full w-full rounded-xl bg-gray-200"
                />
              );
            }

            return (
              <div
                key={props.images[i]}
                className="relative aspect-square h-auto w-full"
              >
                <Image
                  src={props.images[i]}
                  alt="memory"
                  layout="fill"
                  className="rounded-xl object-cover"
                />
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="mt-auto flex w-full items-center justify-between !px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            {props?.memoryCount ?? 0} Memor
            {props?.memoryCount !== 1 ? "ies" : "y"}
          </p>
          <ArrowRight className="text-muted-foreground opacity-0 transition-transform group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
        </CardFooter>
      </AnimatedLink>
    </Card>
  );
};

const AnimatedLink = animated(Link);

export const SkeletonLaneCard: React.FC = () => {
  return <Skeleton className="h-[250px] flex-shrink-0" />;
};
export default LaneCard;
