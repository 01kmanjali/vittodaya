"use client";

import Lottie from "lottie-react";

export function LottiePlayer({
  src,
  className,
}: {
  src: object;
  className?: string;
}) {
  return (
    <Lottie
      animationData={src}
      loop
      autoplay
      className={className}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
