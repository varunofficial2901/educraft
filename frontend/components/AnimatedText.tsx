"use client";

import { motion } from "framer-motion";

export const AnimatedText = ({ text, className = "", as: Component = "span" }: { text: string; className?: string; as?: any }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const child = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "tween" as const,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block mr-1.5 last:mr-0">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};
