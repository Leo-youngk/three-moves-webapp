const PRIMARY_REMINDER_PATH = "/reminder/5";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "Three Moves 提醒";
  const body = payload.body || "19:00 了，打开 Three Moves 看看今天的三件事。";
  const url = payload.url || PRIMARY_REMINDER_PATH;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: payload.tag || "three-moves-reminder",
      data: {
        url,
      },
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-maskable-192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification?.data?.url || PRIMARY_REMINDER_PATH;
  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            const clientUrl = new URL(client.url);
            if (clientUrl.pathname === url) {
              return client.focus();
            }
          }
        }

        return self.clients.openWindow(url);
      }),
  );
});
