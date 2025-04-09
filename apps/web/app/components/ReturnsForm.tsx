import * as React from "react";
import { Button } from "@repo/ui/button";
import { Combobox } from "@repo/ui/combobox";
import { Input } from "@repo/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CRYPTOCURRENCY_LIST } from "../data/cryptocurrency-list";

const schema = z.object({
  coin: z
    .object({
      key: z.string(),
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((s) => s, "Required"),
  date: z.string().min(1, { message: "Required" }),
  amount: z.string().min(1, { message: "Required" }),
});

export type Schema = z.infer<typeof schema>;

export function ReturnsForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (formData: Schema) => void;
  defaultValues: Schema;
}) {
  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={formMethods?.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-2 w-full flex-col md:flex-row">
        <Combobox.ReactHookForm
          control={formMethods.control}
          name="coin"
          options={CRYPTOCURRENCY_LIST}
          placeholder="Select a coin..."
        />

        <Input
          {...formMethods.register("date")}
          className="flex-1"
          type="date"
          validationText={formMethods.formState.errors.date?.message}
          placeholder="Date"
        />
        <Input
          {...formMethods.register("amount")}
          className="flex-1"
          type="number"
          validationText={formMethods.formState.errors.amount?.message}
          placeholder="Enter an amount..."
        />
      </div>
      <div className="relative p-[1px] rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <Button
          type="submit"
          className="w-full bg-white dark:bg-surface-dark hover:bg-gray-100/80 dark:hover:bg-surface-dark/80"
        >
          Simulate
        </Button>
      </div>
    </form>
  );
}
