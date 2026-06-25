"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export type FluidGradientTextProps = {
  text: string;
  svgViewBoxWidth?: number;
  svgViewBoxHeight?: number;
};

export function FluidGradientText({
  text,
  svgViewBoxWidth = 1200,
  svgViewBoxHeight = 300,
}: FluidGradientTextProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const gradientX1Raw = useMotionValue(svgViewBoxWidth / 2);
  const gradientX1 = useSpring(gradientX1Raw, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const normalizedX = (mouseX / rect.width) * svgViewBoxWidth;

    gradientX1Raw.set(
      Math.max(0, Math.min(svgViewBoxWidth, normalizedX))
    );
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    gradientX1Raw.set(svgViewBoxWidth / 2);
  };

  return (
    <div
      className="relative size-full overflow-hidden after:absolute after:bottom-0 after:h-px after:w-full after:bg-current/15"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className={`size-full select-none ${
          isMobile ? "translate-y-[50%]" : "translate-y-[37.5%]"
        }`}
        viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          stroke={isMobile ? "white" : "currentColor"}
          strokeOpacity={isMobile ? "0" : "0.1"}
          strokeWidth="2"
          fill={isMobile ? "white" : "url(#fluid_gradient_text_linear)"}
          style={{
            fontFamily: "Minecraft",
            fontSize: svgViewBoxHeight,
          }}
        >
          {text}
        </text>

        {!isMobile && (
          <defs>
            <motion.linearGradient
              id="fluid_gradient_text_linear"
              x1={gradientX1}
              y1="0"
              x2={svgViewBoxWidth / 2}
              y2={svgViewBoxHeight}
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0.625"
                stopColor="currentColor"
                stopOpacity="0"
              />
              <stop offset="1" stopColor="currentColor" />
            </motion.linearGradient>
          </defs>
        )}
      </svg>
    </div>
  );
}