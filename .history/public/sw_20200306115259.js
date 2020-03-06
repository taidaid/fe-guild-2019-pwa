window.addEventListener("load", () => {
    // Place this code after the existing code !!!
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register(`${baseUrl}sw.js`)
            .then(registration => {
                // Registration was successful
                console.log(
                    "ServiceWorker registration successful with scope: ",
                    registration.scope
                );
            })
            .catch(err => {
                // registration failed :(
                console.log("ServiceWorker registration failed: ", err);
            });
    }
});

self.addEventListener("install", event => {
    console.log("[Service Worker] Installing Service Worker ...", event);
    event.waitUntil(self.skipWaiting());
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
    event.respondWith(fetch(event.request));
});
