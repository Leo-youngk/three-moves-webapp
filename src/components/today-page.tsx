"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Save } from "lucide-react";
import { AppShell } from "./app-shell";
import { useThreeMovesStore } from "@/hooks/use-three-moves-store";
import { type DailyEntry } from "@/lib/domain/daily-entry";

function TodayLoadingState() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5" aria-busy="true">
      <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
        <div className="h-4 w-24 rounded-full bg-[#eadbc4]" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-14 rounded-2xl bg-[#f3e7d4]" />
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <div className="h-12 flex-1 rounded-full bg-[#eadbc4]" />
          <div className="h-12 flex-1 rounded-full bg-[#f3e7d4]" />
        </div>
      </div>
    </div>
  );
}

function TodayForm({
  entry,
  onSave,
}: {
  entry: DailyEntry;
  onSave: (items: [string, string, string]) => void;
}) {
  const [items, setItems] = useState<[string, string, string]>(entry.items);

  const filledCount = items.filter((item) => item.trim().length > 0).length;
  const isComplete = filledCount === 3;
  const isDirty = items.some((item, index) => item !== entry.items[index]);
  const canSave = isComplete && isDirty;

  return (
    <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
      <p className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#a37a51]">
        <span>Today</span>
        <span>
          {filledCount}/3
        </span>
      </p>

      <div className="space-y-3">
        {items.map((value, index) => {
          const inputId = `today-item-${index + 1}`;
          return (
            <label
              key={inputId}
              htmlFor={inputId}
              className="flex items-center gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-3 py-3 transition focus-within:border-[#bc8750]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-sm text-[#8f6c4a]">
                {index + 1}
              </span>
              <span className="sr-only">第 {index + 1} 件事</span>
              <input
                id={inputId}
                value={value}
                onChange={(event) => {
                  const next = [...items] as [string, string, string];
                  next[index] = event.target.value;
                  setItems(next);
                }}
                placeholder={["今天最重要的一件事", "如果今天只做一件事，是什么", "第三件事，给今天一个明确落点"][index]}
                aria-label={`第 ${index + 1} 件事`}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full bg-transparent text-[15px] leading-6 text-[#2b1a0c] outline-none placeholder:text-[#c5ae90]"
              />
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            if (!canSave) {
              return;
            }
            onSave(items);
          }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#d8c7ae] disabled:text-[#8b6a4c]"
          disabled={!canSave}
        >
          <Save className="h-4 w-4" />
          保存今天
        </button>
        <Link
          href="/reminder/1"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dcc8ad] bg-white/70 px-5 py-3 text-sm font-medium text-[#6f5338] transition hover:bg-[#f7efdf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
        >
          去提醒
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function TodayPage() {
  const { ready, issue, todayEntry, saveTodayItems } = useThreeMovesStore();

  return (
    <AppShell
      title="Today"
      subtitle="写下今天最重要的三件事。"
      notice={issue?.message ?? null}
    >
      {!ready ? (
        <TodayLoadingState />
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <TodayForm key={`${todayEntry.dateKey}:${todayEntry.updatedAt}`} entry={todayEntry} onSave={saveTodayItems} />

          <div className="rounded-[24px] border border-[#e0cfba] bg-[#fffaf2]/80 p-4 text-sm leading-7 text-[#7b5a3e]">
            保存后会写入浏览器本地存储。刷新页面、关闭再打开都不会丢。
          </div>
        </div>
      )}
    </AppShell>
  );
}
