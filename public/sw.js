const CACHE_STATIC_NAME = "static_v2";
const CACHE_DYNAMIC_NAME = "dynamic_v1";
const URLS_TO_CACHE = [
    "/",
    "index.html",
    "offline.html",
    "src/js/app.js",
    "src/js/feed.js",
    "src/lib/material.min.js",
    "src/css/app.css",
    "src/css/feed.css",
    "src/images/main-image.jpg",
    "https://fonts.googleapis.com/css?family=Roboto:400,700",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
];

self.addEventListener("install", event => {
    console.log("[Service Worker] Installing Service Worker ...", event);
    event.waitUntil(
        caches
            .open(CACHE_STATIC_NAME)
            .then(cache => {
                console.log("[Service Worker] Precaching App Shell");
                cache.addAll(URLS_TO_CACHE);
            })
            .then(() => {
                console.log("[Service Worker] Skip waiting on install");
                return self.skipWaiting();
            })
            .catch(console.error)
    );
});
self.addEventListener("activate", event => {
    console.log("[Service Worker] Activating Service Worker ...", event);
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (
                            cacheName !== CACHE_STATIC_NAME &&
                            cacheName !== CACHE_DYNAMIC_NAME
                        ) {
                            console.log(
                                "[Service Worker] Removing old cache.",
                                cacheName
                            );
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log("Service Worker] Claiming clients");
                return self.clients.claim();
            })
            .catch(console.error)
    );
});

self.addEventListener("fetch", event => {
    console.log("[Service Worker] Fetching something ....", event);
    // This fixes a weird bug in Chrome when you open the Developer Tools
    if (
        event.request.cache === "only-if-cached" &&
        event.request.mode !== "same-origin"
    ) {
        return;
    }
    event.respondWith(
        caches
            .match(event.request)
            .then(response => {
                if (response) {
                    console.log(response);
                    return response;
                }
                const requestToCache = event.request.clone();
                return fetch(requestToCache).then(response => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                        cache.put(requestToCache, responseToCache);
                    });
                    return response;
                });
            })
            .catch(error => {
                return caches.open(CACHE_STATIC_NAME).then(cache => {
                    if (
                        event.request.headers
                            .get("accept")
                            .includes("text/html")
                    ) {
                        return cache.match("/fe-guild-2019-pwa/offline.html");
                    }
                });
            })
    );
});
