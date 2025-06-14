"use client";
import SettingCard from "@/components/SettingCard";
import ServiceWorkerClass from "@/utility/ServiceWorker";
import { NETWORK_MODE_GROUP, NOTIFICATION_GROUP, Setting, Setting_GROUPS, StoreState } from "@/utility/slice";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
}

export default function SettingPage() {
  // useEffect(() => {
  //   document.body.style.background = "white";
  // });
  const router = useRouter();
  const appSettings = useSelector((state: StoreState) => state.appSettings);
  const deferredInstall = useSelector((state: StoreState) => state.deferredInstall);
  const settings: Setting[] = [
    {
      groupName: Setting_GROUPS.NETWORK_MODE_GROUP,
      settingsName: [NETWORK_MODE_GROUP.OFFLINE_MODE, NETWORK_MODE_GROUP.ONLINE_MODE, NETWORK_MODE_GROUP.SEMI_OFFLINE],
      inputsType: NETWORK_MODE_GROUP.inputsType as "radio" | "checkbox",
    },
    {
      groupName: Setting_GROUPS.NOTIFICATION_GROUP,
      settingsName: [NOTIFICATION_GROUP.ALLOW_NOTIFICATIONS, NOTIFICATION_GROUP.Save_NOTIFICATIONS],
      inputsType: NOTIFICATION_GROUP.inputsType as "radio" | "checkbox",
    },
  ];

  return (
    <div className="min-h-[100lvh] w-full bg-white">
      <nav className="w-screen h-12 flex items-center px-5 justify-between">
        <MoveLeft onClick={() => router.push("/")} />
        {deferredInstall && (
          <button className="bg-blue-600 text-black px-2 py-1 ml-2 rounded-xl" onClick={() => (ServiceWorkerClass.deferredInstall as BeforeInstallPromptEvent).prompt()}>
            Install App
          </button>
        )}
      </nav>
      <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
        <h1 className="border-b py-6 text-4xl font-semibold">Settings</h1>
        <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
          {settings.map((data) => {
            return <SettingCard data={data} key={data.groupName} appSettings={appSettings} />;
          })}
        </div>
      </div>
    </div>
  );
}
