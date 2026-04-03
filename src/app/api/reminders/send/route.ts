import webpush from "web-push";
import { NextResponse } from "next/server";
import { PRIMARY_REMINDER_SLOT_ID, REMINDER_TIMEZONE, getReminderPrivateVapidKey, getReminderPublicVapidKey, getReminderSubject } from "@/lib/reminders/config";
import { buildReminderNotification } from "@/lib/reminders/payload";
import {
  listActiveReminderSubscriptions,
  loadReminderSubscriptionIndex,
  markReminderSubscriptionSent,
  revokeReminderSubscription,
  saveReminderSubscriptionIndex,
} from "@/lib/reminders/server-store";

export const runtime = "nodejs";

function getDateKeyInTimeZone(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

function configureWebPush() {
  const publicKey = getReminderPublicVapidKey();
  const privateKey = getReminderPrivateVapidKey();
  const subject = getReminderSubject();

  if (!publicKey || !privateKey) {
    throw new Error("缺少 VAPID 密钥");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

async function sendReminderBatch() {
  configureWebPush();

  const date = new Date();
  const dateKey = getDateKeyInTimeZone(date, REMINDER_TIMEZONE);
  const payload = buildReminderNotification({
    slotId: PRIMARY_REMINDER_SLOT_ID,
    dateKey,
    todayItems: [],
  });

  const index = await loadReminderSubscriptionIndex();
  const targets = listActiveReminderSubscriptions(index).filter((subscription) => subscription.slotId === PRIMARY_REMINDER_SLOT_ID);
  const results: Array<{ installId: string; status: "sent" | "revoked" | "skipped"; reason?: string }> = [];
  let nextIndex = index;

  for (const subscription of targets) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
          expirationTime: subscription.expirationTime ?? undefined,
        },
        JSON.stringify(payload),
      );

      nextIndex = markReminderSubscriptionSent(nextIndex, subscription.installId, dateKey, new Date().toISOString());
      results.push({ installId: subscription.installId, status: "sent" });
    } catch (error) {
      const statusCode = typeof error === "object" && error && "statusCode" in error ? Number((error as { statusCode?: unknown }).statusCode) : null;
      if (statusCode === 404 || statusCode === 410) {
        nextIndex = revokeReminderSubscription(nextIndex, subscription.installId, new Date().toISOString());
        results.push({ installId: subscription.installId, status: "revoked", reason: "subscription-expired" });
      } else {
        results.push({
          installId: subscription.installId,
          status: "skipped",
          reason: error instanceof Error ? error.message : "push-failed",
        });
      }
    }
  }

  await saveReminderSubscriptionIndex(nextIndex);

  return results;
}

export async function GET() {
  try {
    const results = await sendReminderBatch();
    return NextResponse.json({
      ok: true,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "提醒发送失败",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return GET();
}
