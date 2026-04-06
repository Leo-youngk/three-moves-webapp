import { NextResponse } from "next/server";
import { REMINDER_FIXED_SLOT } from "@/lib/reminders/config";
import { buildReminderNotification } from "@/lib/reminders/payload";
import { getDateKeyInTimeZone, listActiveReminderSubscriptionsForSlot } from "@/lib/reminders/domains";
import { toReminderPushTarget } from "@/lib/reminders/push-client";
import {
  createReminderSubscriptionStore,
  markReminderSubscriptionSent,
  revokeReminderSubscription,
} from "@/lib/reminders/server-store";
import { createWebPushReminderTransport } from "@/lib/reminders/transport";
import { assertAuthorizedReminderDispatch } from "@/lib/platform/scheduler-adapter";

export const runtime = "nodejs";

type DispatchError = {
  reason: string;
  message?: string;
};

function createDispatchFailureResponse({
  status,
  reason,
  message,
}: {
  status: number;
  reason: string;
  message?: string;
}) {
  return NextResponse.json(
    {
      success: false,
      slot: REMINDER_FIXED_SLOT.id,
      sent: [],
      errors: [{ reason, message }],
    },
    { status },
  );
}

async function sendReminderBatch() {
  const date = new Date();
  const dateKey = getDateKeyInTimeZone(date);
  const slotId = REMINDER_FIXED_SLOT.id;
  const payload = buildReminderNotification({
    slotId,
    dateKey,
    todayItems: [],
  });

  const store = createReminderSubscriptionStore();
  const transport = createWebPushReminderTransport();
  const index = await store.loadIndex();
  const targets = listActiveReminderSubscriptionsForSlot(index, slotId);
  const sent: string[] = [];
  const errors: Array<DispatchError & { installId?: string }> = [];
  let nextIndex = index;

  for (const subscription of targets) {
    try {
      await transport.send(toReminderPushTarget(subscription), payload);

      nextIndex = markReminderSubscriptionSent(nextIndex, subscription.installId, dateKey, new Date().toISOString());
      sent.push(subscription.installId);
    } catch (error) {
      const statusCode =
        typeof error === "object" && error && "statusCode" in error
          ? Number((error as { statusCode?: unknown }).statusCode)
          : null;

      if (statusCode === 404 || statusCode === 410) {
        nextIndex = revokeReminderSubscription(nextIndex, subscription.installId, new Date().toISOString());
        errors.push({ installId: subscription.installId, reason: "subscription-expired" });
      } else {
        errors.push({
          installId: subscription.installId,
          reason: error instanceof Error ? error.message : "push-failed",
        });
      }
    }
  }

  await store.saveIndex(nextIndex);

  return {
    slot: slotId,
    sent,
    errors,
  };
}

export async function GET(request: Request) {
  const unauthorized = assertAuthorizedReminderDispatch(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const requestedSlot = new URL(request.url).searchParams.get("slot");
    if (requestedSlot && requestedSlot !== REMINDER_FIXED_SLOT.id) {
      return createDispatchFailureResponse({
        status: 400,
        reason: "only-19-00-is-supported",
        message: "Only slot 19-00 is supported",
      });
    }

    const results = await sendReminderBatch();
    return NextResponse.json({
      success: true,
      slot: results.slot,
      sent: results.sent,
      errors: results.errors,
    });
  } catch (error) {
    return createDispatchFailureResponse({
      status: 500,
      reason: "dispatch-failed",
      message: error instanceof Error ? error.message : "Reminder dispatch failed",
    });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
