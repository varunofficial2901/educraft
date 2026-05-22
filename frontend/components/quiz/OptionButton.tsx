"use client";

import { motion } from "framer-motion";

interface OptionButtonProps {
  id: string;
  text: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function OptionButton({
  id,
  text,
  isSelected,
  onClick,
  index,
}: OptionButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-colors font-inter ${
        isSelected
          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950"
          : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
      }`}
    >
      <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-3">
        {id}.
      </span>
      <span className="text-gray-800 dark:text-gray-200">{text}</span>
    </motion.button>
  );
}
