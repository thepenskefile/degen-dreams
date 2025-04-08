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

type Schema = z.infer<typeof schema>;

const COIN_OPTIONS: ComboboxOption<string>[] = [
  { key: "btc", label: "Bitcoin", value: "btc" },
  { key: "eth", label: "Ethereum", value: "eth" },
  { key: "sol", label: "Solana", value: "sol" },
  { key: "sui", label: "Sui", value: "sui" },
];

async function formAction(formData: Schema) {
  console.log("BLAH FORM DATA: ", formData);
}

export function ReturnsForm() {
  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { coin: null, date: "", amount: "" },
  });

  return (
    <form
      onSubmit={formMethods?.handleSubmit(formAction)}
      className="flex flex-col gap-4"
    >
      <div className="flex gap-2 w-full">
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
      <Button type="submit">Simulate</Button>
    </form>
  );
}
