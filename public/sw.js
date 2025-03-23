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
export default null;
export const version = 1;
const cacheNameArray = [`default-version-${version}`, `javascript-version-${version}`, `html-version-${version}`, `css-version-${version}`, SETTING_CACHES.CACHE_URL];
////////////////////////////////////////////////
self.addEventListener("install", (ev) => {
    self.skipWaiting();
    ev.waitUntil(deleteOldCaches());
});
self.addEventListener("activate", (ev) => {
    ev.waitUntil(clients.claim());
});
self.addEventListener("fetch", (ev) => {
    ev.respondWith((() => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield handleRequest(ev);
        return res;
    }))());
});
self.addEventListener("message", (ev) => {
    if (ev.data === "confirmOnline") {
        ev.waitUntil(confirmOnlineFn(ev));
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////
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
            const res = yield fetch("/globe.svg", { method: "HEAD" });
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
        return confirmOnline;
    });
}
const fetchAndSaveInCaches = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let cachesName = "default";
    try {
        const response = yield fetch(req);
        if (response && response.headers.has("content-type")) {
            const contentType = response.headers.get("content-type") || "";
            cachesName = contentType === "text/javascript" ? "javascript" : cachesName;
            cachesName = contentType === "text/html" ? "html" : cachesName;
            cachesName = contentType === "text/css" ? "css" : cachesName;
        }
        const cache = yield caches.open(`${cachesName}-version-${version}`);
        yield cache.delete(`${req.url}-version-${version}`);
        yield cache.put(`${req.url}-version-${version}`, response.clone());
        return response;
    }
    catch (_a) {
        return null;
    }
});
const getNetworkMode = (ev) => __awaiter(void 0, void 0, void 0, function* () {
    const request = ev.request;
    try {
        if (request.headers.has(SETTING_CACHES.CACHE_HEADER)) {
            const mode = request.headers.get(SETTING_CACHES.CACHE_HEADER);
            return mode;
        }
        const res = yield caches.match(SETTING_CACHES.CACHE_URL);
        if (res && res.headers.has(SETTING_CACHES.CACHE_HEADER)) {
            const mode = res.headers.get(SETTING_CACHES.CACHE_HEADER);
            return mode;
        }
    }
    catch (_a) {
        return null;
    }
});
const getClient = (ev) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clients.get(ev.clientId);
    return client;
});
function handleRequest(ev) {
    return __awaiter(this, void 0, void 0, function* () {
        let mode = yield getNetworkMode(ev);
        mode = mode === null ? NETWORK_MODE_GROUP.OFFLINE_MODE : mode;
        const cacheRes = yield caches.match(`${ev.request.url}-version-${version}`);
        if (mode === NETWORK_MODE_GROUP.ONLINE_MODE) {
            const res = yield fetchAndSaveInCaches(ev.request);
            if (res)
                return res;
            else if (cacheRes)
                return cacheRes;
            else {
                getClient(ev).then((client) => client === null || client === void 0 ? void 0 : client.postMessage("not-found"));
                return new Response();
            }
            ///////////////////////////////
        }
        else if (mode === NETWORK_MODE_GROUP.OFFLINE_MODE) {
            if (cacheRes)
                return cacheRes;
            else {
                const res = yield fetchAndSaveInCaches(ev.request);
                if (res)
                    return res;
                else {
                    getClient(ev).then((client) => client === null || client === void 0 ? void 0 : client.postMessage("not-found"));
                    return new Response();
                }
            }
            ///////////////////////////////
        }
        else {
            if (cacheRes)
                return cacheRes;
            else {
                const res = yield fetchAndSaveInCaches(ev.request);
                if (res)
                    return res;
                else {
                    getClient(ev).then((client) => client === null || client === void 0 ? void 0 : client.postMessage("not-found"));
                    return new Response();
                }
            }
        }
    });
}
