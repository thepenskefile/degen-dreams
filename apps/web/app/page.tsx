"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { PageContent } from "@repo/ui/page-content";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <PageContent breakpoint="sm">
      <h1 className="text-3xl font-bold mb-4">If you bought...</h1>
      <Card className="flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <Input className="flex-1" />
          <Input className="flex-1" />
          <Input className="flex-1" />
        </div>
        <Button>Simulate</Button>
      </Card>

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
    </PageContent>
  );
}
