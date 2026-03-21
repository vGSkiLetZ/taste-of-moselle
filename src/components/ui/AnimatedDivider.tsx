"use client";

import { motion } from "framer-motion";

type DividerType = "vine" | "utensils" | "wave";

const paths: Record<DividerType, string> = {
  vine: "M0,20 C50,5 100,35 150,20 S250,5 300,20 S400,35 450,20 S550,5 600,20",
  utensils: "M0,25 Q75,10 150,25 T300,25 T450,25 T600,25",
  wave: "M0,30 C100,10 200,40 300,20 S500,40 600,20",
};

const decorations: Record<DividerType, { emoji: string; positions: number[] }> = {
  vine: { emoji: "🍇", positions: [150, 450] },
  utensils: { emoji: "🍴", positions: [300] },
  wave: { emoji: "🍷", positions: [200, 400] },
};

interface AnimatedDividerProps {
  type?: DividerType;
  className?: string;
}

export default function AnimatedDivider({ type = "vine", className = "" }: AnimatedDividerProps) {
  const path = paths[type];
  const deco = decorations[type];

  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <motion.svg
        viewBox="0 0 600 40"
        className="w-full max-w-md h-10 overflow-visible"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
      >
        <motion.path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-moselle-brown/30"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.5, ease: "easeInOut" },
            },
          }}
        />
        {/* Small leaf accents */}
        {[100, 200, 300, 400, 500].map((x) => (
          <motion.circle
            key={x}
            cx={x}
            cy={20 + Math.sin(x * 0.02) * 8}
            r="2"
            className="fill-moselle-green/30"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: { delay: 0.5 + x * 0.001, duration: 0.3 },
              },
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
