"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default null;
export const version = 1;
const cacheNameArray = [`default-version-${version}`, `javascript-version-${version}`, `html-version-${version}`, `css-version-${version}`];
const deleteOldCaches = () => __awaiter(void 0, void 0, void 0, function* () {
    const cachesArr = yield caches.keys();
    for (let i = 0; i < cachesArr.length; i++) {
        const currCache = cachesArr[i];
        if (!cacheNameArray.includes(currCache)) {
            yield caches.delete(currCache);
        }
    }
});
function confirmOnlineFn(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        let confirmOnline = false;
        try {
            const res = yield fetch("/vite.svg", { method: "HEAD" });
            console.log({ res });
            if (res.ok) {
                confirmOnline = true;
            }
        }
        catch (err) {
            console.log(err);
            confirmOnline = false;
        }
        if (ev.source && "id" in ev.source) {
            const client = yield clients.get(ev.source.id);
            client === null || client === void 0 ? void 0 : client.postMessage({ confirmOnline });
        }
    });
}
const fetchAndSaveInCaches = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("fetch");
    let cachesName = "default";
    const opts = {
        cache: "no-cache",
        mode: "cors",
    };
    if (!req.url.startsWith(location.origin)) {
        //not on the same domain as my html file
        opts.mode = "cors";
        opts.credentials = "omit";
    }
    try {
        const response = yield fetch(req, opts);
        if (response && response.headers.has("content-type")) {
            const contentType = response.headers.get("content-type") || "";
            cachesName = contentType === "text/javascript" ? "javascript" : cachesName;
            cachesName = contentType === "text/html" ? "html" : cachesName;
            cachesName = contentType === "text/css" ? "css" : cachesName;
        }
        const cache = yield caches.open(`${cachesName}-version-${version}`);
        yield cache.put(`${req.url}-version-${version}`, response.clone());
        return response;
    }
    catch (_a) {
        const cacheRes = yield caches.match(`/-version-${version}`);
        const res = new Response();
        res.headers.set("content-type", "text/html");
        return cacheRes || res;
    }
});
function handleRequest(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheRes = yield caches.match(`${ev.request.url}-version-${version}`);
        return cacheRes || (yield fetchAndSaveInCaches(ev.request));
    });
}
self.addEventListener("install", (ev) => {
    self.skipWaiting();
    ev.waitUntil(deleteOldCaches());
});
self.addEventListener("activate", (ev) => {
    console.log("active");
    ev.waitUntil(clients.claim().then(() => {
        console.log("claimed");
    }));
});
self.addEventListener("fetch", (ev) => {
    ev.respondWith((() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield handleRequest(ev);
        return res;
    }))());
});
self.addEventListener("message", (ev) => {
    console.log(ev.data);
    if (ev.data === "confirmOnline") {
        ev.waitUntil(confirmOnlineFn(ev));
    }
});
