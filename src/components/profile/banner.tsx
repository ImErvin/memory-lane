"use client";

import { useUserProfile } from "@/contexts/user-profile";
import BoringAvatar, { AnimatedBoringAvatar } from "../ui/boring-avatar";
import { AnimatedCard } from "../ui/card";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useSpring, config, animated } from "@react-spring/web";

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
    <div className="relative flex h-20 overflow-hidden">
      <Skeleton className="relative ml-auto flex h-16 w-full flex-col items-start justify-center gap-0.5 rounded-l-full rounded-r-full bg-opacity-45 py-1" />

      <Skeleton className="absolute left-[calc(100%-64px)] z-20 h-16 w-16 rounded-full" />
    </div>
  );
};

const ProfileBanner: React.FC = () => {
  const { username, isCurrentUser, memoryLanes } = useUserProfile();
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
      left: "100%",
      rotate: "360deg",
    },
    to: {
      left: "0%",
      rotate: "0deg",
    },
    config: config.molasses,
  });

  const bannerMaskSpring = useSpring({
    from: {
      width: "calc(0% - 32px)",
      paddingLeft: "0px",
    },
    to: {
      width: "calc(100% - 20px)",
      paddingLeft: "52px",
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
    <div className="relative flex h-24 overflow-hidden items-center">
      <AnimatedCard
        className="relative ml-auto flex h-16 w-full flex-col items-start justify-center gap-1 bg-opacity-45 py-1"
        style={{
          background: bannerBg,
          ...bannerMaskSpring,
        }}
      >
        <animated.h1
          style={textSpring}
          className="font-sans text-lg font-semibold leading-none tracking-wide text-white"
        >
          {isCurrentUser ? "You" : username}
        </animated.h1>
        <animated.h2
          style={textSpring}
          className="text-md font-sans font-normal leading-none tracking-wide text-white"
        >
          {memoryLanes.length} lane{memoryLanes.length !== 1 && "s"}
        </animated.h2>
      </AnimatedCard>

      <AnimatedBoringAvatar
        ref={handleRef}
        name={username}
        size={"custom"}
        customSize={62}
        className="absolute z-20 rounded-full"
        style={introAnimationSpring}
      />
    </div>
  );
};

export default ProfileBanner;
