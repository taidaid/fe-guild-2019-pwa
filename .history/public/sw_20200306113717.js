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
