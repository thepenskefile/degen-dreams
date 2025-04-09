import React from "react";
import { Button } from "@repo/ui/button";
import { LinkIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";

export function ShareButton() {
  return (
    <div className="flex justify-center mt-8">
      <div className="relative p-0.5 rounded-[10px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
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
          className="flex items-center gap-1 bg-white dark:bg-surface-dark hover:bg-gray-100/80 dark:hover:bg-surface-dark/80 border-none"
        >
          Share
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
