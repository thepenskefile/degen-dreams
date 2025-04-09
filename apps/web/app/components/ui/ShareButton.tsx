import React from "react";
import { GradientButton } from "@repo/ui";
import { LinkIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";

export function ShareButton() {
  return (
    <div className="flex justify-center mt-8">
      <GradientButton
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
        className="flex items-center gap-1"
      >
        Share
        <LinkIcon className="w-4 h-4" />
      </GradientButton>
    </div>
  );
}
