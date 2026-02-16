"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";

interface AttributeCellProps {
  value: string;
  status: "CORRECT" | "PARTIAL" | "INCORRECT";
  direction?: "UP" | "DOWN" | "EQUAL" | "NONE";
  delay?: number;
}

export function AttributeCell({
  value,
  status,
  direction,
  delay = 0,
}: AttributeCellProps) {
  const getColor = () => {
    switch (status) {
      case "CORRECT":
        return "bg-green-600 border-green-500";
      case "PARTIAL":
        return "bg-orange-500 border-orange-400";
      case "INCORRECT":
        return "bg-red-600 border-red-500";
      default:
        return "bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <motion.div
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`
        w-24 h-24 md:w-32 md:h-32 
        flex flex-col items-center justify-center 
        border-2 rounded-md shadow-md p-1
        text-center text-xs md:text-sm font-bold text-white
        ${getColor()}
      `}
    >
      <span className="wrap-break-word w-full px-1">{value}</span>

      {direction === "UP" && (
        <ArrowUp className="w-6 h-6 mt-1 animate-bounce" />
      )}
      {direction === "DOWN" && (
        <ArrowDown className="w-6 h-6 mt-1 animate-bounce" />
      )}
    </motion.div>
  );
}
