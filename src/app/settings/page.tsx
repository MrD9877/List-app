"use client";
import SettingCard from "@/components/SettingCard";
import { NETWORK_MODE_GROUP, NOTIFICATION_GROUP, Setting, Setting_GROUPS, StoreState } from "@/utility/slice";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const settings: Setting[] = [
  {
    groupName: Setting_GROUPS.NETWORK_MODE_GROUP,
    settingsName: [NETWORK_MODE_GROUP.OFFLINE_MODE, NETWORK_MODE_GROUP.ONLINE_MODE, NETWORK_MODE_GROUP.SEMI_OFFLINE],
    inputsType: NETWORK_MODE_GROUP.inputsType,
  },
  {
    groupName: Setting_GROUPS.NOTIFICATION_GROUP,
    settingsName: [NOTIFICATION_GROUP.ALLOW_NOTIFICATIONS, NOTIFICATION_GROUP.Save_NOTIFICATIONS],
    inputsType: NOTIFICATION_GROUP.inputsType,
  },
];

export default function SettingPage() {
  const router = useRouter();
  const appSettings = useSelector((state: StoreState) => state.appSettings);

  return (
    <div className="min-h-[100lvh] w-screen bg-white">
      <nav className="w-screen h-12 flex items-center px-5">
        <MoveLeft onClick={() => router.push("/")} />
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
