"use client";
export default null;
declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;

export const version = 1;

const cacheNameArray = [`default-version-${version}`, `javascript-version-${version}`, `html-version-${version}`, `css-version-${version}`];

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
    const res = await fetch("/vite.svg", { method: "HEAD" });
    console.log({ res });
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
}

const fetchAndSaveInCaches = async (req: Request) => {
  console.log("fetch");
  let cachesName = "default";
  const opts: RequestInit = {
    cache: "no-cache",
    mode: "cors",
  };
  if (!req.url.startsWith(location.origin)) {
    //not on the same domain as my html file
    opts.mode = "cors";
    opts.credentials = "omit";
  }
  try {
    const response = await fetch(req, opts);

    if (response && response.headers.has("content-type")) {
      const contentType = response.headers.get("content-type") || "";
      cachesName = contentType === "text/javascript" ? "javascript" : cachesName;
      cachesName = contentType === "text/html" ? "html" : cachesName;
      cachesName = contentType === "text/css" ? "css" : cachesName;
    }

    const cache = await caches.open(`${cachesName}-version-${version}`);
    await cache.put(`${req.url}-version-${version}`, response.clone());
    return response;
  } catch {
    const cacheRes = await caches.match(`/-version-${version}`);
    const res = new Response();
    res.headers.set("content-type", "text/html");
    return cacheRes || res;
  }
};

async function handleRequest(ev: FetchEvent) {
  const cacheRes = await caches.match(`${ev.request.url}-version-${version}`);
  return cacheRes || (await fetchAndSaveInCaches(ev.request));
}

self.addEventListener("install", (ev) => {
  self.skipWaiting();
  ev.waitUntil(deleteOldCaches());
});

self.addEventListener("activate", (ev) => {
  console.log("active");
  ev.waitUntil(
    clients.claim().then(() => {
      console.log("claimed");
    })
  );
});

self.addEventListener("fetch", (ev) => {
  ev.respondWith(
    (async () => {
      const res: Response = await handleRequest(ev);
      return res;
    })()
  );
});

self.addEventListener("message", (ev) => {
  console.log(ev.data);
  if (ev.data === "confirmOnline") {
    ev.waitUntil(confirmOnlineFn(ev));
  }
});
