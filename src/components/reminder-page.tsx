"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, CircleAlert } from "lucide-react";
import { AppShell } from "./app-shell";
import { getReminderSlot } from "@/lib/constants/reminders";
import { useThreeMovesStore } from "@/hooks/use-three-moves-store";

function ReminderLoadingState() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5" aria-busy="true">
      <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5">
        <div className="h-4 w-28 rounded-full bg-[#eadbc4]" />
        <div className="mt-4 h-24 rounded-2xl bg-[#f3e7d4]" />
      </div>
      <div className="rounded-[28px] border border-[#dcc8ad] bg-white/80 p-5">
        <div className="h-4 w-24 rounded-full bg-[#eadbc4]" />
        <div className="mt-4 space-y-3">
          <div className="h-12 rounded-2xl bg-[#f3e7d4]" />
          <div className="h-12 rounded-2xl bg-[#f3e7d4]" />
          <div className="h-12 rounded-2xl bg-[#f3e7d4]" />
        </div>
      </div>
    </div>
  );
}

export function ReminderPage({ slotId }: { slotId?: string }) {
  const { todayEntry, ready, issue } = useThreeMovesStore();
  const slot = getReminderSlot(slotId);

  const slotNumber = Number(slot.id);
  const previous = String(slotNumber > 1 ? slotNumber - 1 : 1);
  const next = String(slotNumber < 6 ? slotNumber + 1 : 6);
  const hasTodayItems = todayEntry.items.some((item) => item.trim().length > 0);

  return (
    <AppShell
      title="Reminder"
      subtitle="提醒页只展示文案和今天三件事，不做通知投递。"
      notice={issue?.message ?? null}
    >
      {!ready ? (
        <ReminderLoadingState />
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-[#e0cfba] bg-[#f7efe2] px-3 py-1 text-xs text-[#8f6c4a]">
                {slot.time} · {slot.label}
              </span>
              <span className="text-xs uppercase tracking-[0.24em] text-[#b2855e]">Reminder</span>
            </div>
            <p className="text-[18px] leading-9 text-[#2b1a0c]">{slot.question}</p>
          </div>

          <div className="rounded-[28px] border border-[#dcc8ad] bg-white/80 p-5">
            <div className="mb-4 flex items-center gap-2 text-sm text-[#6f5338]">
              <CircleAlert className="h-4 w-4" />
              今天的三件事
            </div>

            {!hasTodayItems ? (
              <div className="rounded-2xl border border-[#e0cfba] bg-[#fffaf2] px-4 py-4 text-sm leading-7 text-[#8f6c4a]">
                今天还没有写内容，先去 Today 完成三件事，再回来查看提醒页。
              </div>
            ) : (
              <div className="space-y-3">
                {todayEntry.items.map((item, index) => (
                  <div key={index} className="flex gap-3 rounded-2xl border border-[#e5d3be] bg-[#fbf6ee] px-4 py-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-white text-xs text-[#8f6c4a]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[#2b1a0c]">{item.trim() || "未填写"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              href={`/reminder/${previous}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dcc8ad] bg-white/70 px-4 py-3 text-sm text-[#6f5338] transition hover:bg-[#f7efdf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
            >
              <ChevronLeft className="h-4 w-4" />
              上一个
            </Link>
            <Link
              href={`/reminder/${next}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dcc8ad] bg-[#f7efe2] px-4 py-3 text-sm text-[#6f5338] transition hover:bg-[#efe2cf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
            >
              下一个
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </AppShell>
  );
}
