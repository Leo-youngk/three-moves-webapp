import { NextResponse } from "next/server";
import {
  createReminderSubscriptionStore,
  revokeReminderSubscription,
  upsertReminderSubscription,
} from "@/lib/reminders/server-store";
import type { ReminderSubscriptionRecord } from "@/lib/reminders/types";

export const runtime = "nodejs";

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isReminderSubscriptionRecord(value: unknown): value is ReminderSubscriptionRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<ReminderSubscriptionRecord>;
  return (
    isString(record.installId) &&
    isString(record.slotId) &&
    isString(record.timezone) &&
    isString(record.endpoint) &&
    !!record.keys &&
    isString(record.keys.p256dh) &&
    isString(record.keys.auth) &&
    (typeof record.expirationTime === "number" || record.expirationTime === null) &&
    isString(record.createdAt) &&
    isString(record.updatedAt) &&
    (typeof record.revokedAt === "string" || record.revokedAt === null)
  );
}

export async function GET() {
  const store = createReminderSubscriptionStore();
  const index = await store.loadIndex();
  return NextResponse.json({
    ok: true,
    activeCount: Object.values(index.subscriptions).filter((subscription) => subscription.revokedAt === null).length,
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as unknown;
  if (!isReminderSubscriptionRecord(payload)) {
    return NextResponse.json(
      {
        ok: false,
        error: "无效的订阅数据",
      },
      { status: 400 },
    );
  }

  const store = createReminderSubscriptionStore();
  const index = await store.loadIndex();
  const nextIndex = upsertReminderSubscription(index, payload);
  await store.saveIndex(nextIndex);

  return NextResponse.json({
    ok: true,
    subscription: nextIndex.subscriptions[payload.installId],
  });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as { installId?: unknown };
  if (!isString(payload.installId)) {
    return NextResponse.json(
      {
        ok: false,
        error: "缺少 installId",
      },
      { status: 400 },
    );
  }

  const store = createReminderSubscriptionStore();
  const index = await store.loadIndex();
  const nextIndex = revokeReminderSubscription(index, payload.installId, new Date().toISOString());
  await store.saveIndex(nextIndex);

  return NextResponse.json({
    ok: true,
    activeCount: Object.values(nextIndex.subscriptions).filter((subscription) => subscription.revokedAt === null).length,
  });
}
