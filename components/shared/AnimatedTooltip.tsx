"use client";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

/**
 * AnimatedTooltip is a React component that displays an animated tooltip
 * for its child elements when hovered. The tooltip's appearance, including
 * rotation and translation, is animated using Framer Motion based on the mouse
 * position over the child element. The tooltip text is customizable via props.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child elements over which the tooltip is shown.
 * @param {string} props.tooltipText - The text content to display inside the tooltip.
 *
 * @example
 * <AnimatedTooltip tooltipText="Tooltip text goes here">
 *   <button>Hover over me</button>
 * </AnimatedTooltip>
 *
 * @returns {React.ReactElement} The AnimatedTooltip component with children and a conditional tooltip based on hover state.
 */
export const AnimatedTooltip = ({
  children,
  tooltipText,
}: {
  children: React.ReactNode;
  tooltipText: string;
}) => {
  const [isHovered, setIsHovered] = useState(false); // State to manage hover status
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const halfWidth = target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className="-mr-4 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseOutCapture={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
            className="absolute -top-14 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-dark-1 z-50 shadow-xl px-4 py-2"
          >
            <div className="absolute right-1 z-30 w-[30%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
            <div className="absolute left-1 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
            <div className="font-bold text-white relative z-30 text-small-regular">
              {tooltipText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
