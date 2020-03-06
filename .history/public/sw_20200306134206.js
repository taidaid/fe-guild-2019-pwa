const CACHE_STATIC_NAME = "static";
const CACHE_DYNAMIC_NAME = "dynamic";
const URLS_TO_CACHE = [
    "/",
    "index.html",
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
    );
});
self.addEventListener("activate", event => {
    console.log("[Service Worker] Activating Service Worker ...", event);
    return self.clients.claim();
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
        caches.match(event.request).then(response => {
            if (response) {
                console.log(response);
                return response;
            }
            const requestToCache = event.request.clone();
            return fetch(requestToCache).then(response => {
                if (!response || response.status !== 200) {
                    return response;
                }
                const responseToCache = event.request.clone();
                caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                    cache.put(requestToCache, responseToCache);
                });
                return response;
            });
        })
    );
});
