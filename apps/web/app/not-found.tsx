"use client";

import { Button, PageContent, cn } from "@repo/ui";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <PageContent
      breakpoint="sm"
      className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]"
    >
      <div className="text-center space-y-6 max-w-2xl">
        <div
          className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-full",
            theme === "dark" ? "bg-red-200" : "bg-red-100"
          )}
        >
          <svg
            className={cn(
              "w-8 h-8",
              theme === "dark" ? "text-red-400" : "text-red-600"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1
          className={cn(
            "text-3xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          Page Not Found
        </h1>
        <div
          className={cn(
            "p-4 rounded-lg border",
            theme === "dark"
              ? "bg-red-200 border-red-500"
              : "bg-red-50 border-red-200"
          )}
        >
          <p
            className={cn(
              "font-medium",
              theme === "dark" ? "text-red-400" : "text-red-600"
            )}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <p className={cn(theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          Don&apos;t worry, you can go back to the home page and try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/")}>Back to home</Button>
        </div>
      </div>
    </PageContent>
  );
}
