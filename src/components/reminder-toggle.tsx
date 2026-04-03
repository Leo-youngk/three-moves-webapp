"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { PRIMARY_REMINDER_PATH, PRIMARY_REMINDER_TIME, PRIMARY_REMINDER_SLOT_ID, REMINDER_TIMEZONE, getReminderPublicVapidKey } from "@/lib/reminders/config";
import { base64ToUint8Array } from "@/lib/reminders/push-client";
import { getOrCreateReminderInstallId } from "@/lib/reminders/install-id";

type ReminderToggleState = "checking" | "enabled" | "disabled" | "unsupported" | "denied" | "error";

function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || REMINDER_TIMEZONE;
}

export function ReminderToggle() {
  const [state, setState] = useState<ReminderToggleState>("checking");
  const [message, setMessage] = useState("正在检查提醒权限和订阅状态");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
          if (!cancelled) {
            setState("unsupported");
            setMessage("当前浏览器不支持 Web Push，请改用 iPhone Safari 并加入主屏幕后再试。");
          }
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (cancelled) {
          return;
        }

        if (subscription) {
          setState("enabled");
          setMessage(`已开启 ${PRIMARY_REMINDER_TIME} 固定提醒`);
          return;
        }

        if (Notification.permission === "denied") {
          setState("denied");
          setMessage("通知权限已被拒绝。请在浏览器设置里重新允许后再开启提醒。");
          return;
        }

        setState("disabled");
        setMessage(`尚未开启 ${PRIMARY_REMINDER_TIME} 提醒`);
      } catch {
        if (!cancelled) {
          setState("error");
          setMessage("提醒状态检查失败。请刷新页面后重试。");
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const isEnabled = state === "enabled";
  const canInteract = !busy && state !== "checking" && state !== "unsupported";

  const onToggle = async () => {
    if (!canInteract) {
      return;
    }

    setBusy(true);
    setMessage("正在处理提醒设置");

    try {
      const registration = await navigator.serviceWorker.ready;
      const installId = getOrCreateReminderInstallId(window.localStorage);
      const timezone = getBrowserTimezone();

      if (isEnabled) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }

        const response = await fetch("/api/reminders/subscription", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            installId,
          }),
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        setState("disabled");
        setMessage(`已关闭 ${PRIMARY_REMINDER_TIME} 提醒`);
        return;
      }

      const publicKey = getReminderPublicVapidKey();
      if (!publicKey) {
        throw new Error("缺少 VAPID 公钥");
      }

      const permission =
        Notification.permission === "granted" ? "granted" : await Notification.requestPermission();

      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "disabled");
        setMessage("没有通知权限，无法开启提醒。");
        return;
      }

      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToUint8Array(publicKey),
        }));

      const normalized = subscription.toJSON();
      if (!normalized.endpoint || !normalized.keys?.p256dh || !normalized.keys.auth) {
        throw new Error("订阅数据不完整");
      }

      const response = await fetch("/api/reminders/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          installId,
          slotId: PRIMARY_REMINDER_SLOT_ID,
          timezone,
          endpoint: normalized.endpoint,
          keys: {
            p256dh: normalized.keys.p256dh,
            auth: normalized.keys.auth,
          },
          expirationTime: normalized.expirationTime ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          revokedAt: null,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setState("enabled");
      setMessage(`已开启 ${PRIMARY_REMINDER_TIME} 固定提醒`);
    } catch {
      setState("error");
      setMessage("提醒设置失败，请稍后重试。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-[#dcc8ad] bg-white/80 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#b2855e]">提醒</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#241407]">开启 19:00 固定提醒</h2>
          <p className="mt-2 text-sm leading-6 text-[#7b5a3e]">
            只保留一个时段。加入主屏幕后，手机会在固定时间收到通知，点开后进入 {PRIMARY_REMINDER_PATH}。
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs ${
            isEnabled ? "bg-[#e7d3b6] text-[#2b1a0c]" : "bg-[#f7efe2] text-[#8f6c4a]"
          }`}
        >
          {isEnabled ? "已开启" : "未开启"}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onToggle}
          disabled={busy || state === "checking" || state === "unsupported"}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#d8c7ae] disabled:text-[#8b6a4c]"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : isEnabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {busy ? "处理中" : isEnabled ? "关闭提醒" : "开启提醒"}
        </button>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#7b5a3e]">{message}</p>
    </div>
  );
}
