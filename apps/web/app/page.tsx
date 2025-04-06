"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-4">Degen Dreams</h1>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setTheme("dark");
          }}
        >
          Dark mode
        </Button>
        <Button
          onClick={() => {
            setTheme("light");
          }}
        >
          Light mode
        </Button>
      </div>
    </div>
  );
}
