const PRIMARY_REMINDER_PATH = "/reminder/19-00";
const DEFAULT_NOTIFICATION_TITLE = "Three Moves 提醒";
const DEFAULT_NOTIFICATION_BODY = "19:00 了，打开 Three Moves 看看今天的三件事。";
const DEFAULT_NOTIFICATION_TAG = "three-moves-reminder";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = typeof payload.title === "string" && payload.title.length > 0 ? payload.title : DEFAULT_NOTIFICATION_TITLE;
  const body = typeof payload.body === "string" && payload.body.length > 0 ? payload.body : DEFAULT_NOTIFICATION_BODY;
  const url = typeof payload.url === "string" && payload.url.length > 0 ? payload.url : PRIMARY_REMINDER_PATH;
  const tag = typeof payload.tag === "string" && payload.tag.length > 0 ? payload.tag : DEFAULT_NOTIFICATION_TAG;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
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
