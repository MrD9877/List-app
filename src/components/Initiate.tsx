"use client";
import { setList } from "@/utility/ListItemsFn";
import { setLoading, store, StoreState } from "@/utility/slice";
import ServiceWorkerClass from "@/utility/ServiceWorker";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { setSettings } from "@/utility/SettingsFn";

export default function Initiate() {
  const loading = useSelector((state: StoreState) => state.loading);
  async function intial() {
    await setList();
    await setSettings();
  }
  useEffect(() => {
    // ServiceWorkerClass.init();
    ServiceWorkerClass.unregister();
    store.dispatch(setLoading(true));
    intial();
  }, []);
  return <>{loading && <Loading />}</>;
}
