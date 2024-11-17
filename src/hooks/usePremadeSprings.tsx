"use client";

import { config, useSpring, useSpringRef } from "@react-spring/web";

export const useFadeIn = () => {
  const fadeInRef = useSpringRef();
  const fadeIn = useSpring({
    ref: fadeInRef,
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    confing: config.gentle,
  });

  return {
    fadeInSpring: fadeIn,
    fadeInSpringRef: fadeInRef,
  };
};
