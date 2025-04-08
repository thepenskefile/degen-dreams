import { Button } from "@repo/ui/button";
import { Combobox, ComboboxOption } from "@repo/ui/combobox";
import { Input } from "@repo/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const COIN_OPTIONS: ComboboxOption<string>[] = [
  { key: "BTC", label: "Bitcoin", value: "BTC" },
  { key: "ETH", label: "Ethereum", value: "ETH" },
  { key: "SOL", label: "Solana", value: "SOL" },
  { key: "SUI", label: "Sui", value: "SUI" },
];

export function ReturnsForm({
  onSubmit,
}: {
  onSubmit: (formData: Schema) => void;
}) {
  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { coin: null, date: "", amount: "" },
  });

  return (
    <form
      onSubmit={formMethods?.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-2 w-full flex-col md:flex-row">
        <div className="flex-1">
          <Combobox.ReactHookForm
            control={formMethods.control}
            name="coin"
            options={COIN_OPTIONS}
            placeholder="Select a coin..."
          />
        </div>
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
          className="w-full bg-white dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-surface-dark/80"
        >
          Simulate
        </Button>
      </div>
    </form>
  );
}
