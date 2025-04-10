import React from "react";
import { GradientButton } from "@repo/ui";
import { LinkIcon } from "@heroicons/react/20/solid";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

export function ShareButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getUrl = React.useCallback(() => {
    const params = new URLSearchParams(searchParams);
    return `${window.location.origin}${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard
      .writeText(getUrl())
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  }, [getUrl]);

  return (
    <div className="flex justify-center mt-8">
      <GradientButton onClick={handleCopy} className="flex items-center gap-1">
        Share
        <LinkIcon className="w-4 h-4" />
      </GradientButton>
    </div>
  );
}
