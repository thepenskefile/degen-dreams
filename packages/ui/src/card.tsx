"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "./utils/cn";

interface CardProps extends ButtonHTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-light dark:bg-surface-dark border dark:border-[#2E2E2D] border-gray-300",
        "py-2.5 px-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
