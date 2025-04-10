"use client";

import { Button, cn, PageContent } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <PageContent
      breakpoint="sm"
      className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]"
    >
      <div className="text-center space-y-6 max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-200">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h1>
        <div className="p-4 rounded-lg border bg-red-50 border-red-200 dark:bg-red-200 dark:border-red-500">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push("/")}>Back to home</Button>
        </div>
      </div>
    </PageContent>
  );
}
