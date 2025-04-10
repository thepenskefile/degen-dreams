import React from "react";
export function Header() {
  return (
    <div className="flex flex-col items-center mb-12">
      <h1 className="text-3xl md:text-5xl font-black uppercase relative w-full text-center">
        <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-xl opacity-50"></span>
        <span className="relative px-4 py-2 inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Degen
          </span>
          <span className="text-gray-900 dark:text-white ml-2 transition-colors duration-200">
            Dreams
          </span>
        </span>
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-4 text-center max-w-2xl px-4 transition-colors duration-200">
        Ever wondered how much your crypto investment would be worth today?
        Select a coin, pick a date, enter your investment amount, and see what
        could have been.
      </p>
    </div>
  );
}
