"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-4">Degen Dreams</h1>

      <Card className="flex gap-2">
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
        <Input />
      </Card>
    </div>
  );
}
