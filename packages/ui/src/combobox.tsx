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
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface ComboboxOption<T> {
  key: string | number;
  label: string;
  value: T;
  disabled?: boolean;
}

export interface ComboboxProps<T> {
  options: ComboboxOption<T>[];
  onChange?: (option: ComboboxOption<T> | null) => void;
  onBlur?: () => void;
  name?: string;
  validationText?: string;
  value?: ComboboxOption<T> | null;
  placeholder?: string;
}

export function Combobox<T>({
  options,
  onChange,
  onBlur,
  name,
  validationText,
  value,
  placeholder,
}: ComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="w-full">
      <HeadlessUiCombobox
        as="div"
        name={name}
        value={value}
        onChange={(option) => {
          setQuery("");
          onChange?.(option);
        }}
        onBlur={() => {
          onBlur?.();
        }}
      >
        <div className="relative">
          <ComboboxButton className="relative cursor-pointer">
            <ComboboxInput
              placeholder={placeholder}
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
                "disabled:opacity-50 disabled:cursor-not-allowed",
                { "border-red-400 focus:ring-red-200": Boolean(validationText) }
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
                      "bg-gray-200 text-black": value?.key === option.key,
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

      {validationText && (
        <p className={cn("mt-0.5 text-xs text-red-400")}>{validationText}</p>
      )}
    </div>
  );
}

function ReactHookFormComboboxField<T, K extends FieldValues>({
  control,
  name,
  onChange = () => {},
  onBlur = () => {},
  shouldUnregister = false,
  ...props
}: ComboboxProps<T> & {
  control: Control<K, unknown>;
  name: Path<K>;
  shouldUnregister?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => {
        return (
          <Combobox<T>
            {...props}
            name={field?.name}
            onChange={(option) => {
              field?.onChange(option);
              onChange(option);
            }}
            onBlur={() => {
              field?.onBlur();
              onBlur();
            }}
            validationText={fieldState?.error?.message}
            value={field?.value || null}
          />
        );
      }}
    />
  );
}

Combobox.ReactHookForm = ReactHookFormComboboxField;
