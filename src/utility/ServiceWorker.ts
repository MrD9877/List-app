import { setOnline, setPwaInsall, store, swRedirect } from "./slice";

const ServiceWorkerClass: {
  deferredInstall: null | Event;
  SW: ServiceWorker | null;
  isOnline: boolean;
  init: () => void;
  handleMessage: (ev: MessageEvent<unknown>) => void;
  sendMessage: (ev: string) => void;
  checkOnline: () => void;
  unregister: () => void;
} = {
  SW: null,
  isOnline: typeof navigator !== "undefined" ? "onLine" in navigator && navigator.onLine : false,
  deferredInstall: null,
  async init() {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
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
    } else if (matchMedia("(display-mode: standalone)").matches) {
      console.log("Installed on Android or desktop");
    } else {
      console.log("Launched from a browser tab");
      store.dispatch(setPwaInsall(false));
    }

    window.addEventListener("beforeinstallprompt", (ev) => {
      ev.preventDefault();
      ServiceWorkerClass.deferredInstall = ev;
      store.dispatch(setPwaInsall(true));
    });
  },
  unregister: () => {
    if ("serviceWorker" in navigator) {
      // 4. remove/unregister service workers
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          reg.unregister().then((isUnreg) => console.log(isUnreg));
        }
      });
    }
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
    } else if (typeof ev.data === "string" && ev.data === "not-found") {
      store.dispatch(swRedirect("/notFound"));
    }
  },
  sendMessage(msg: string) {
    navigator.serviceWorker.controller?.postMessage(msg);
  },
};

export default ServiceWorkerClass;
