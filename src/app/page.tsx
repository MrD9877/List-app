"use client";
import List from "@/components/List";
import { ArrowDownUp, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [moveItems, setMoveItems] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className="flex w-full h-16 justify-between text-white p-3">
        <ArrowDownUp stroke={moveItems ? "blue" : "black"} onClick={() => setMoveItems((pre) => !pre)} />
        <Settings onClick={() => router.push("/settings")} />
      </nav>

      <div className="h-[100svh] w-screen flex justify-center overflow-clip">
        <List moveItems={moveItems} />
      </div>
    </>
  );
}
