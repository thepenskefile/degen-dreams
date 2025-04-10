import * as React from "react";
import { Combobox, Input, GradientButton } from "@repo/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CRYPTOCURRENCY_LIST } from "../../data/cryptocurrency-list";

const schema = z.object({
  coin: z
    .object({
      key: z.string(),
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((s) => s, "Required"),
  date: z
    .string()
    .min(1, { message: "Required" })
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
      },
      { message: "Date cannot be in the future" }
    ),
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
          max={new Date().toISOString().split("T")[0]}
          validationText={formMethods.formState.errors.date?.message}
          placeholder="Date"
          aria-label="Date"
        />
        <Input
          {...formMethods.register("amount")}
          className="flex-1"
          type="number"
          validationText={formMethods.formState.errors.amount?.message}
          placeholder="Enter an amount..."
          aria-label="Amount"
        />
      </div>
      <GradientButton type="submit" className="w-full">
        Simulate
      </GradientButton>
    </form>
  );
}
