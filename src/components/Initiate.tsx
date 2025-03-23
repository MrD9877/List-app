"use client";
import { setList } from "@/utility/ListItemsFn";
import { setLoading, store, StoreState, swRedirect } from "@/utility/slice";
import ServiceWorkerClass from "@/utility/ServiceWorker";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { setSettings } from "@/utility/SettingsFn";
import { useRouter } from "next/navigation";

export default function Initiate() {
  const { loading, redirect } = useSelector((state: StoreState) => ({ loading: state.loading, redirect: state.serviceWorkerRedirect }));
  const router = useRouter();
  async function intial() {
    await setList();
    await setSettings();
  }
  useEffect(() => {
    ServiceWorkerClass.init();
    // ServiceWorkerClass.unregister();
    store.dispatch(setLoading(true));
    intial();
  }, []);

  useEffect(() => {
    console.log(redirect);
    if (redirect) {
      router.push(redirect);
      store.dispatch(swRedirect(null));
    }
  }, [redirect]);
  return <>{loading && <Loading />}</>;
}
