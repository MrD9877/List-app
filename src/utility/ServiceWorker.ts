import { setOnline, store } from "./slice";

const ServiceWorkerClass: {
  deferredInstall: null | Event;
  SW: ServiceWorker | null;
  isOnline: boolean;
  init: () => void;
  handleMessage: (ev: MessageEvent<unknown>) => void;
  sendMessage: (ev: string) => void;
  checkOnline: () => void;
} = {
  SW: null,
  isOnline: "onLine" in navigator && navigator.onLine,
  deferredInstall: null,
  async init() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          type: "module",
        });

        // Wait for the service worker to be active
        ServiceWorkerClass.SW = registration.active || registration.waiting;

        // Make sure to claim the service worker after activation
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (installingWorker.state === "activated") {
                // Service worker is active
                ServiceWorkerClass.SW = installingWorker;
              }
            });
          }
        });

        console.log("Service worker registered and active");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
      navigator.serviceWorker.addEventListener("message", ServiceWorkerClass.handleMessage);
      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        ServiceWorkerClass.SW = navigator.serviceWorker.controller;
      });
    }
    if ("standalone" in navigator && navigator.standalone) {
      console.log("Installed on iOS");
      document.body.classList.add("pwa");
    } else if (matchMedia("(display-mode: standalone)").matches) {
      console.log("Installed on Android or desktop");
      document.body.classList.add("pwa");
    } else {
      console.log("Launched from a browser tab");
      document.body.classList.remove("pwa");
    }

    window.addEventListener("beforeinstallprompt", (ev) => {
      // Prevent the mini-infobar from appearing on mobile
      ev.preventDefault();
      // Stash the event so it can be triggered later.
      ServiceWorkerClass.deferredInstall = ev;
      console.log("saved the install event");
    });
  },

  checkOnline() {
    if ("onLine" in navigator && navigator.onLine) {
      ServiceWorkerClass.sendMessage("confirmOnline");
    } else {
      store.dispatch(setOnline(false));
    }
  },

  handleMessage(ev: MessageEvent<unknown>) {
    console.log(ev.data);
    if (typeof ev.data === "object" && ev.data && "confirmOnline" in ev.data) {
      store.dispatch(setOnline(ev.data.confirmOnline as boolean));
    }
    console.log(ev.data);
  },
  sendMessage(msg: string) {
    navigator.serviceWorker.controller?.postMessage(msg);
  },
};

export default ServiceWorkerClass;
