"use client";

import { Card } from "@repo/ui/card";
import { PageContent } from "@repo/ui/page-content";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ReturnsForm } from "./components/ReturnsForm";

export default function Home() {
  return (
    <PageContent breakpoint="sm">
      <div className="flex flex-row justify-between items-center  mb-4">
        <h1 className="text-3xl font-bold">If you bought...</h1>
        <ThemeSwitcher className="w-8 h-8" />
      </div>
      <ReturnsForm />
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-1">
          <div>
            <span className="text-4xl font-bold">
              🎉 You&apos;d have $4,370 today!
            </span>
          </div>
          <div>
            <span className="text-zinc-500">
              That&apos;s a <span className="text-teal-400">+337%</span> gain!
            </span>
          </div>
        </div>

        <div>
          <span className="uppercase text-4xl font-bold text-amber-300">
            But you missed out on a max of $12,900...{" "}
            <span className="italic">Ouch!</span>
          </span>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-8">
        <Card className="flex flex-col gap-4 w-full justify-between">
          <span className="text-zinc-500">If you sold at the top: </span>
          <span className="text-3xl font-semibold">$12,900</span>
        </Card>
        <Card className="flex flex-col gap-4 w-full justify-between">
          <span className="text-zinc-500">At the worst moment: </span>
          <span className="text-3xl font-semibold">-78%</span>
        </Card>
        <Card className="flex flex-col gap-4 w-full justify-between">
          <span className="text-zinc-500">Return multiple: </span>
          <span className="text-3xl font-semibold">3x</span>
        </Card>
      </div>
    </PageContent>
  );
}
