"use client";

import Lottie from "lottie-react";
import animationData from "@/public/images/home.json";

export function LapLottie({ className }: { className?: string }) {
  return (
    <div className={className ?? "w-full max-w-2xl mx-auto"} style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: "16px" }}>
      <div style={{ width: "100%", height: "100%", transform: "scale(1.35)", transformOrigin: "center center" }}>
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        />
      </div>
    </div>
  );
}
