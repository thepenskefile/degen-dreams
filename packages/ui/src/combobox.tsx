"use client";

import {
  Combobox as HeadlessUiCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { cn } from "./utils";

export interface ComboboxOption<T> {
  key: string | number;
  label: string;
  value: T;
  disabled?: boolean;
}

export interface ComboboxProps<T> {
  options: ComboboxOption<T>[];
}

export function Combobox<T>({ options }: ComboboxProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] =
    useState<ComboboxOption<T> | null>(null);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <HeadlessUiCombobox
      as="div"
      value={selectedOption}
      onChange={(option) => {
        setQuery("");
        setSelectedOption(option);
      }}
    >
      <div className="relative">
        <ComboboxButton className="relative">
          <ComboboxInput
            className={cn(
              "min-w-0 px-4 py-1.5 rounded-lg text-sm",
              "transition-all duration-200",
              "bg-surface-light dark:bg-surface-dark",
              "border border-[#2E2E2D]",
              "focus:outline-none",
              "focus:ring-2 focus:ring-gray-200",
              "focus:ring-offset-2 focus:ring-offset-white",
              "dark:focus:ring-offset-surface-dark",
              "bg-white hover:bg-gray-100",
              "dark:bg-surface-dark dark:hover:bg-surface-dark/80",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => setQuery("")}
            displayValue={(option: ComboboxOption<T> | null) =>
              option?.label ?? ""
            }
          />

          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 h-full",
              "flex items-center rounded-r-md px-2",
              "focus:outline-hidden text-gray-400"
            )}
          >
            <ChevronUpDownIcon aria-hidden="true" className="size-5" />
          </div>
        </ComboboxButton>

        {filteredOptions.length > 0 && (
          <ComboboxOptions
            transition
            className={cn(
              "absolute z-10 mt-1",
              "max-h-60 w-full overflow-auto",
              "rounded-md bg-surface-light dark:bg-surface-dark",
              "border border-[#2E2E2D] py-1 shadow-lg",
              "focus:outline-hidden text-sm",
              "origin-top transition duration-200 ease-out empty:invisible data-[closed]:scale-95 data-[closed]:opacity-0"
            )}
          >
            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option.key}
                value={option}
                className={cn(
                  "group relative cursor-pointer",
                  "py-2 pr-9 pl-3 select-none",
                  "hover:bg-gray-100 hover:text-black",
                  {
                    "bg-gray-200 text-black":
                      selectedOption?.key === option.key,
                  }
                )}
              >
                <span className="block truncate group-data-selected:font-semibold">
                  {option.label}
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </HeadlessUiCombobox>
  );
}
