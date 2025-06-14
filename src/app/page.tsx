"use client";
import List from "@/components/List";
import ServiceWorkerClass from "@/utility/ServiceWorker";
import { StoreState } from "@/utility/slice";
import { ArrowDownUp, CircleSmall, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [moveItems, setMoveItems] = useState(false);
  const isOnline = useSelector((state: StoreState) => state.isOnline);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    ServiceWorkerClass.checkOnline();
  }, []);

  return (
    <div style={{ background: "#41cccc" }}>
      <nav className=" h-26">
        <div className="flex justify-end px-3 mt-2">
          <CircleSmall width={12} height={12} stroke="none" fill={isOnline ? "green" : "red"} className="animate-pulse" />
        </div>
        <div className="flex w-full  justify-between text-white px-5">
          <ArrowDownUp stroke={moveItems ? "blue" : "white"} onClick={() => setMoveItems((pre) => !pre)} width={32} height={32} />
          <Settings onClick={() => router.push("/settings")} width={32} height={32} />
        </div>
      </nav>

      <div className="h-[100svh] w-full flex justify-center overflow-clip">
        <List moveItems={moveItems} />
      </div>
    </div>
  );
}
