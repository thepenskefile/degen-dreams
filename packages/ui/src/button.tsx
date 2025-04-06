"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({
  children,
  className,
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "relative px-4 py-1.5 rounded-lg text-sm transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white",
        "dark:focus:ring-surface-dark dark:focus:ring-offset-2 dark:focus:ring-offset-surface-dark",
        "border border-[#2E2E2D]",
        "bg-white hover:bg-gray-100",
        "dark:bg-surface-dark dark:hover:bg-surface-dark/80",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
