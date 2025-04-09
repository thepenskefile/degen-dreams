import React from "react";

export function Header() {
  return (
    <div className="flex justify-center mb-12">
      <h1 className="text-3xl md:text-5xl font-black uppercase relative w-full text-center">
        <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-xl opacity-50"></span>
        <span className="relative px-4 py-2 inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Degen
          </span>
          <span className="dark:text-white ml-2">Dreams</span>
        </span>
      </h1>
    </div>
  );
}
