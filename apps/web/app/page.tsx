"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@repo/ui/card";
import { PageContent } from "@repo/ui/page-content";
import { ThemeSwitcher } from "./components/theme/ThemeSwitcher";
import { ReturnsForm, Schema } from "./components/forms/ReturnsForm";
import { useMutation } from "@tanstack/react-query";
import { PriceChart } from "./components/charts/PriceChart";
import { Button } from "@repo/ui/button";
import { LinkIcon } from "@heroicons/react/20/solid";
import { CRYPTOCURRENCY_LIST } from "./data/cryptocurrency-list";

interface PriceData {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ProfitLossData {
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  maxValue: number;
  maxProfit: number;
  minValue: number;
  maxLoss: number;
  maxLossPercentage: number;
  returnMultiple: number;
  priceData: PriceData[];
}

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultValues = React.useMemo(() => {
    const coin = searchParams.get("coin");
    const date = searchParams.get("date");
    const amount = searchParams.get("amount");

    const coinOption = CRYPTOCURRENCY_LIST.find((c) => c.value === coin);

    return {
      coin: coinOption || null,
      date: date || "",
      amount: amount || "",
    };
  }, [searchParams]);

  const handleSubmitForm = React.useCallback(
    async (formData: Schema): Promise<ProfitLossData> => {
      // Convert the date string to Unix timestamp (seconds)
      const fromTs = Math.floor(new Date(formData.date).getTime() / 1000);

      const response = await fetch(
        `/api/crypto/calculate-returns?fromTs=${fromTs}&amount=${formData.amount}&fromSymbol=${formData.coin?.value}&toSymbol=USD`
      );

      if (!response.ok) {
        throw new Error("Failed to calculate returns");
      }

      const data = await response.json();
      return data;
    },
    []
  );

  const submitFormMutation = useMutation({
    mutationFn: handleSubmitForm,
    onSuccess: (responseData, formData) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("coin", formData.coin?.value || "");
      params.set("date", formData.date);
      params.set("amount", formData.amount.toString());
      router.push(`?${params.toString()}`);
    },
    onError: (error) => {
      console.error(error);
      router.push("/");
    },
  });

  React.useEffect(() => {
    if (defaultValues.coin && defaultValues.date && defaultValues.amount) {
      submitFormMutation.mutate({
        coin: defaultValues.coin,
        date: defaultValues.date,
        amount: defaultValues.amount,
      });
    }
    // Disabling eslint rule because we want to run this effect only once on mount.
  }, []); //eslint-disable-line

  return (
    <PageContent breakpoint="sm">
      <div className="flex justify-center mb-12">
        <h1 className="text-3xl md:text-5xl font-black uppercase relative w-full text-center">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-xl opacity-50"></span>
          <span className="relative px-4 py-2 inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Degen
            </span>
            <span className="dark:text-white ml-2">Dreams</span>
          </span>
        </h1>
      </div>
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">If you bought...</h1>
        <ThemeSwitcher className="w-8 h-8" />
      </div>
      <ReturnsForm
        onSubmit={submitFormMutation.mutate}
        defaultValues={defaultValues}
      />

      {submitFormMutation?.isPending && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      )}

      {submitFormMutation?.error && (
        <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <p className="text-red-600 dark:text-red-400">
            {submitFormMutation?.error?.message}
          </p>
        </div>
      )}
      {submitFormMutation?.isSuccess && (
        <div>
          <div className="mt-8 space-y-4">
            <div className="flex flex-col gap-1">
              <div>
                <span className="text-3xl md:text-4xl font-bold">
                  {submitFormMutation.data.profitLoss >= 0 ? "🎉" : "💸"}{" "}
                  You&apos;d have $
                  {submitFormMutation.data.currentValue.toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}{" "}
                  today!
                </span>
              </div>
              <div>
                <span className="text-zinc-500">
                  That&apos;s a{" "}
                  <span
                    className={
                      submitFormMutation.data.profitLossPercentage >= 0
                        ? "text-teal-400"
                        : "text-red-400"
                    }
                  >
                    {submitFormMutation.data.profitLossPercentage >= 0
                      ? "+"
                      : ""}
                    {submitFormMutation.data.profitLossPercentage.toFixed(2)}%
                  </span>{" "}
                  {submitFormMutation.data.profitLoss >= 0 ? "gain" : "loss"}!
                </span>
              </div>
            </div>

            <div>
              <span className="uppercase text-3xl md:text-4xl font-bold text-amber-300">
                But you missed out on a max of $
                {submitFormMutation.data.maxValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
                ... <span className="italic">Ouch!</span>
              </span>
            </div>

            <PriceChart
              data={submitFormMutation.data.priceData}
              isProfit={submitFormMutation.data.profitLoss >= 0}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Card className="flex flex-col gap-4 w-full justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <span className="text-zinc-500">If you sold at the top: </span>
              <span className="text-2xl md:text-3xl font-semibold">
                $
                {submitFormMutation.data.maxValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </Card>
            <Card className="flex flex-col gap-4 w-full justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <span className="text-zinc-500">At the worst moment: </span>
              <span className="text-2xl md:text-3xl font-semibold">
                {submitFormMutation.data.maxLossPercentage.toFixed(2)}%
              </span>
            </Card>
            <Card className="flex flex-col gap-4 w-full justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <span className="text-zinc-500">Return multiple: </span>
              <span className="text-2xl md:text-3xl font-semibold">
                {submitFormMutation.data.returnMultiple.toFixed(2)}x
              </span>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <div className="relative p-[1px] rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              <Button
                onClick={() => {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      toast.success("Link copied to clipboard!");
                    })
                    .catch(() => {
                      toast.error("Failed to copy link");
                    });
                }}
                className="flex items-center gap-1 bg-white dark:bg-surface-dark hover:bg-gray-100/80 dark:hover:bg-surface-dark/80"
              >
                Share
                <LinkIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContent>
  );
}
