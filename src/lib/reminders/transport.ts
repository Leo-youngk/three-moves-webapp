import webpush from "web-push";
import { getReminderPrivateVapidKey, getReminderPublicVapidKey, getReminderSubject } from "./config";
import type { ReminderPushTarget, ReminderPushTransport } from "./providers";
import type { ReminderNotificationPayload } from "./types";

function configureWebPush() {
  const publicKey = getReminderPublicVapidKey();
  const privateKey = getReminderPrivateVapidKey();
  const subject = getReminderSubject();

  if (!publicKey || !privateKey) {
    throw new Error("缺少 VAPID 密钥");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export function createWebPushReminderTransport(): ReminderPushTransport {
  configureWebPush();

  return {
    async send(target: ReminderPushTarget, payload: ReminderNotificationPayload) {
      await webpush.sendNotification(
        {
          endpoint: target.endpoint,
          keys: target.keys,
          expirationTime: target.expirationTime ?? undefined,
        },
        JSON.stringify(payload),
      );
    },
  };
}
