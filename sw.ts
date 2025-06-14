"use client";

export const SETTING_CACHES = {
  CACHE_NAME: "settings",
  CACHE_URL: "/network_mode",
  CACHE_HEADER: "x-network_mode",
};

export const NETWORK_MODE_GROUP = {
  ONLINE_MODE: "Online mode",
  SEMI_OFFLINE: "Semi-offline",
  OFFLINE_MODE: "Offline Mode",
  inputsType: "radio",
};

declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;

export const version = 1;

const cacheNameArray = [`default-version-${version}`, `javascript-version-${version}`, `html-version-${version}`, `css-version-${version}`, SETTING_CACHES.CACHE_URL];

////////////////////////////////////////////////

self.addEventListener("install", (ev: ExtendableEvent) => {
  self.skipWaiting();
  ev.waitUntil(deleteOldCaches());
});

self.addEventListener("activate", (ev: ExtendableEvent) => {
  ev.waitUntil(clients.claim());
});
self.addEventListener("fetch", (ev: FetchEvent) => {
  ev.respondWith(
    (async () => {
      const res: Response = await handleRequest(ev);
      return res;
    })()
  );
});

self.addEventListener("message", (ev: ExtendableMessageEvent) => {
  if (ev.data === "confirmOnline") {
    ev.waitUntil(confirmOnlineFn(ev));
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////

const deleteOldCaches = async () => {
  const cachesArr = await caches.keys();

  for (let i = 0; i < cachesArr.length; i++) {
    const currCache = cachesArr[i];
    if (!cacheNameArray.includes(currCache)) {
      await caches.delete(currCache);
    }
  }
};

async function confirmOnlineFn(ev: ExtendableMessageEvent) {
  let confirmOnline = false;
  try {
    const res = await fetch("/globe.svg", { method: "HEAD" });
    if (res.ok) {
      confirmOnline = true;
    }
  } catch (err) {
    console.log(err);
    confirmOnline = false;
  }
  if (ev.source && "id" in ev.source) {
    const client = await clients.get(ev.source.id);
    client?.postMessage({ confirmOnline });
  }
  return confirmOnline;
}

const fetchAndSaveInCaches = async (req: Request) => {
  let cachesName = "default";
  try {
    const response = await fetch(req);
    if (response && response.headers.has("content-type")) {
      const contentType = response.headers.get("content-type") || "";
      cachesName = contentType === "text/javascript" ? "javascript" : cachesName;
      cachesName = contentType === "text/html" ? "html" : cachesName;
      cachesName = contentType === "text/css" ? "css" : cachesName;
    }

    const cache = await caches.open(`${cachesName}-version-${version}`);
    await cache.delete(`${req.url}-version-${version}`);
    await cache.put(`${req.url}-version-${version}`, response.clone());
    return response;
  } catch {
    return null;
  }
};

const getNetworkMode = async (ev: FetchEvent) => {
  const request = ev.request;
  try {
    if (request.headers.has(SETTING_CACHES.CACHE_HEADER)) {
      const mode = request.headers.get(SETTING_CACHES.CACHE_HEADER);
      return mode;
    }
    const res = await caches.match(SETTING_CACHES.CACHE_URL);
    if (res && res.headers.has(SETTING_CACHES.CACHE_HEADER)) {
      const mode = res.headers.get(SETTING_CACHES.CACHE_HEADER);
      return mode;
    }
  } catch {
    return null;
  }
};

const getClient = async (ev: FetchEvent) => {
  const client = await clients.get(ev.clientId);
  return client;
};

async function handleRequest(ev: FetchEvent): Promise<Response> {
  let mode = await getNetworkMode(ev);
  mode = mode === null ? NETWORK_MODE_GROUP.ONLINE_MODE : mode;
  const cacheRes = await caches.match(`${ev.request.url}-version-${version}`);

  if (mode === NETWORK_MODE_GROUP.ONLINE_MODE) {
    const res = await fetchAndSaveInCaches(ev.request);
    if (res) return res;
    else if (cacheRes) return cacheRes;
    else {
      getClient(ev).then((client) => client?.postMessage("not-found"));
      return new Response();
    }
    ///////////////////////////////
  } else if (mode === NETWORK_MODE_GROUP.OFFLINE_MODE) {
    if (cacheRes) return cacheRes;
    else {
      const res = await fetchAndSaveInCaches(ev.request);
      if (res) return res;
      else {
        getClient(ev).then((client) => client?.postMessage("not-found"));
        return new Response();
      }
    }
    ///////////////////////////////
  } else {
    if (cacheRes) return cacheRes;
    else {
      const res = await fetchAndSaveInCaches(ev.request);
      if (res) return res;
      else {
        getClient(ev).then((client) => client?.postMessage("not-found"));
        return new Response();
      }
    }
  }
}
