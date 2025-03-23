"use client";
import {} from "@/app/settings/page";
import { AppSettingsType, Setting, store, upDateAppSettings } from "@/utility/slice";
import React from "react";
import { useEffect } from "react";
export default function SettingCard({ data, appSettings }: { data: Setting; appSettings: AppSettingsType }) {
  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>, group: string, id: string) => {
    const value = e.target.checked;
    const type = e.target.type;
    store.dispatch(upDateAppSettings({ group, id, value, type }));
  };
  useEffect(() => {
    console.log(appSettings);
  }, [appSettings]);
  return (
    <>
      <div className="col-span-8 overflow-hidden rounded-xl bg-gray-50 px-8 shadow my-4 border">
        <div className="grid  py-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold leading-4 text-slate-700">{data.groupName}</h2>
          </div>
          <div className="mt-4 flex items-center sm:justify-end">
            <div className="flex flex-col gap-3">
              {data.settingsName.map((id) => {
                const uniqueID = `${id}-${data.groupName}`;
                return (
                  <label key={uniqueID} htmlFor={uniqueID} className="relative inline-flex cursor-pointer items-center">
                    <input type={data.inputsType} value={id} name={data.groupName} id={uniqueID} className="peer sr-only" checked={appSettings[data.groupName][id] || false} onChange={(e) => handlerInput(e, data.groupName, id)} />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 text-nowrap ">{id.toUpperCase()}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
