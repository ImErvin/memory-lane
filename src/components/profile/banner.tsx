"use client";

import { useUserProfile } from "@/contexts/use-user-profile";
import BoringAvatar, { AnimatedBoringAvatar } from "../ui/boring-avatar";
import { AnimatedCard } from "../ui/card";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useSpring, config, animated } from "@react-spring/web";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CreateLaneFormDialog } from "../lanes/lane-form-dialog";

const ignoredColors = ["#ffffff", "#000000"];

const getMainColors = (svg: SVGSVGElement) => {
  const colors = new Set<string>();
  const rects = svg.querySelectorAll("rect");
  rects.forEach((rect) => {
    const fill = rect.getAttribute("fill");

    if (fill) {
      colors.add(fill);
    }
  });
  return Array.from(colors).filter(
    (color) => !ignoredColors.includes(color.toLowerCase()),
  );
};

const LoadingState: React.FC = () => {
  return (
    <div className="relative flex h-24 flex-shrink-0 items-center overflow-hidden">
      <Skeleton className="relative ml-auto flex h-16 w-full flex-col items-start justify-center gap-0.5 rounded-l-full rounded-r-full bg-opacity-45 py-1" />

      <Skeleton className="absolute left-[calc(100%-64px)] z-20 h-16 w-16 rounded-full" />
    </div>
  );
};

const ProfileBanner: React.FC = () => {
  const { username, isCurrentUser, memoryLanes, refetchLanes } =
    useUserProfile();
  const [bannerBg, setBannerBg] = useState<string>(null!);

  const handleRef = (element: SVGSVGElement | null) => {
    if (element) {
      const colors = getMainColors(element);

      if (colors.length > 1) {
        setBannerBg(`linear-gradient(45deg, ${colors[0]}, ${colors[1]})`);
      }
    }
  };

  const introAnimationSpring = useSpring({
    from: {
      left: "0%",
      rotate: "270deg",
    },
    to: {
      left: "0%",
      rotate: "0deg",
    },
    config: config.molasses,
  });

  const bannerMaskSpring = useSpring({
    from: {
      width: "calc(100% - 20px)",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    to: {
      width: "calc(100% - 20px)",
      paddingLeft: "58px",
      paddingRight: "16px",
    },
    config: config.molasses,
  });

  const textSpring = useSpring({
    from: {
      transform: "translateX(-200px)",
    },
    to: {
      transform: "translateX(0px)",
    },
    config: config.molasses,
  });

  if (!bannerBg) {
    return (
      <>
        <BoringAvatar
          ref={handleRef}
          name={username}
          size={"custom"}
          customSize={1}
          className="absolute"
        />
        <LoadingState />
      </>
    );
  }
  return (
    <div className="relative flex h-24 flex-shrink-0 items-center overflow-hidden">
      <AnimatedCard
        className="relative ml-auto flex h-16 w-full flex-row items-center justify-between gap-1.5 border-0 py-1"
        style={{
          background: bannerBg,
          ...bannerMaskSpring,
        }}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-1">
            <animated.h1
              style={textSpring}
              className="font-sans text-lg font-semibold leading-none tracking-wide text-white"
            >
              {username}
            </animated.h1>
            {isCurrentUser && (
              <animated.span
                style={textSpring}
                className="font-thing text-xs leading-none tracking-widest text-white/60"
              >
                {"(you)"}
              </animated.span>
            )}
          </div>
          <animated.h2
            style={textSpring}
            className="text-md font-sans font-normal leading-none tracking-wide text-white"
          >
            {memoryLanes.length} Lane{memoryLanes.length !== 1 && "s"}
          </animated.h2>
        </div>
        {isCurrentUser && (
          <CreateLaneFormDialog
            trigger={
              <Button size="sm" className="mt-0" variant={"outline"}>
                <span className="hidden lg:block">New Memory Lane</span>
                <Plus size={16} />
              </Button>
            }
            onSuccess={refetchLanes}
          />
        )}
      </AnimatedCard>

      <AnimatedBoringAvatar
        ref={handleRef}
        name={username}
        size={"custom"}
        customSize={64}
        className="absolute z-20 rounded-full"
        style={introAnimationSpring}
      />
    </div>
  );
};

export default ProfileBanner;
