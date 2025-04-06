"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "./utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "relative px-4 py-1.5 rounded-lg text-sm transition-all duration-200",
        "bg-surface-light dark:bg-surface-dark border border-[#2E2E2D]",
        "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white",
        "dark:focus:ring-offset-surface-dark",
        "bg-white hover:bg-gray-100",
        "dark:bg-surface-dark dark:hover:bg-surface-dark/80",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
