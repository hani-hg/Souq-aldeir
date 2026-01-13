if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => {
      console.log("Service Worker شغّال ✅");
    })
    .catch((err) => {
      console.log("خطأ في Service Worker ❌", err);
    });
}