import { Loader } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="w-screen h-screen bg-white/40 flex justify-center items-center absolute top-0 z-100">
      <Loader className="animate-spin text-black" />
    </div>
  );
}
