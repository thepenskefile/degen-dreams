"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageContent } from "@repo/ui";
import { ThemeSwitcher } from "./components/theme/ThemeSwitcher";
import { ReturnsForm, Schema } from "./components/forms/ReturnsForm";
import { useMutation } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { ResultsDisplay } from "./components/results/ResultsDisplay";
import { StatsCards } from "./components/results/StatsCards";
import { ShareButton } from "./components/ui/ShareButton";
import { CRYPTOCURRENCY_LIST } from "./data/cryptocurrency-list";
import { CalculateReturnsResult } from "./services/price-service";

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
    async (formData: Schema): Promise<CalculateReturnsResult> => {
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
      <Header />
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
        <>
          <ResultsDisplay
            data={{
              currentValue: submitFormMutation.data.currentValue,
              profitLossPercentage:
                submitFormMutation.data.profitLossPercentage,
              profitLoss: submitFormMutation.data.profitLoss,
              maxValue: submitFormMutation.data.maxValue,
              priceData: submitFormMutation.data.priceData,
            }}
          />

          <StatsCards
            maxValue={submitFormMutation.data.maxValue}
            maxLossPercentage={submitFormMutation.data.maxLossPercentage}
            returnMultiple={submitFormMutation.data.returnMultiple}
          />

          <ShareButton />
        </>
      )}
    </PageContent>
  );
}
