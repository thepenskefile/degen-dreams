"use client";

import * as React from "react";
import { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  validationText?: string | undefined;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, validationText, ...props }, ref) => {
    const uniqueId = React.useId();
    const inputId = `form-input-${uniqueId}`;

    return (
      <div className="relative w-full">
        <input
          id={inputId}
          ref={ref}
          {...(validationText && {
            "aria-describedby": `${inputId}-error`,
            "aria-invalid": true,
          })}
          className={cn(
            "min-w-0 w-full px-4 py-1.5 rounded-lg text-sm transition-all duration-200",
            "bg-surface-light dark:bg-surface-dark border dark:border-zinc-700 border-gray-300",
            "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white",
            "dark:focus:ring-offset-surface-dark",
            "bg-white hover:bg-gray-100",
            "dark:bg-surface-dark dark:hover:bg-surface-dark/80",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "[&::-webkit-datetime-edit-fields-wrapper:not(:focus):placeholder-shown]:text-gray-400",
            "placeholder:text-gray-400",
            { "border-red-400 focus:ring-red-200": Boolean(validationText) },
            className
          )}
          {...props}
        />
        {validationText && (
          <p
            id={`${inputId}-error`}
            className={cn("mt-0.5 text-xs text-red-400")}
          >
            {validationText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
