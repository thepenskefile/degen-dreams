"use client";

import { Button, ButtonProps } from "./Button";
import { cn } from "../../utils/cn";

export interface GradientButtonProps extends ButtonProps {
  gradientClassName?: string;
}

export function GradientButton({
  className,
  gradientClassName,
  ...props
}: GradientButtonProps) {
  return (
    <div
      className={cn(
        "relative p-0.5 rounded-[10px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-surface-dark",
        "focus-within:ring-purple-500/50 dark:focus-within:ring-purple-500/30",
        gradientClassName
      )}
    >
      <Button
        className={cn(
          "bg-white dark:bg-surface-dark hover:bg-gray-100/80 dark:hover:bg-surface-dark/80 border-none",
          "focus:outline-none",
          className
        )}
        {...props}
      />
    </div>
  );
}
