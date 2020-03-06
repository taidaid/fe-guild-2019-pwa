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
