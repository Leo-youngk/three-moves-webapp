"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import { AppShell } from "./app-shell";
import { MOODS, type MoodId } from "@/lib/constants/moods";
import { useThreeMovesStore } from "@/hooks/use-three-moves-store";
import { STATUS_ORDER, type Status } from "@/lib/domain/status";
import { type DailyEntry } from "@/lib/domain/daily-entry";

const STATUS_LABELS: Record<Status, string> = {
  not_started: "未开始",
  started: "已开始",
  completed: "已完成",
};

function NightLoadingState() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5" aria-busy="true">
      <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
        <div className="h-4 w-28 rounded-full bg-[#eadbc4]" />
        <div className="mt-5 space-y-3">
          <div className="h-14 rounded-2xl bg-[#f3e7d4]" />
          <div className="h-14 rounded-2xl bg-[#f3e7d4]" />
          <div className="h-14 rounded-2xl bg-[#f3e7d4]" />
        </div>
      </div>
      <div className="rounded-[28px] border border-[#dcc8ad] bg-white/80 p-5">
        <div className="h-4 w-20 rounded-full bg-[#eadbc4]" />
        <div className="mt-4 h-10 rounded-full bg-[#f3e7d4]" />
        <div className="mt-4 h-32 rounded-2xl bg-[#f3e7d4]" />
      </div>
    </div>
  );
}

function NightForm({
  entry,
  onToggle,
  onSave,
}: {
  entry: DailyEntry;
  onToggle: (index: 0 | 1 | 2) => void;
  onSave: (input: { note: string; mood: MoodId | null }) => void;
}) {
  const [note, setNote] = useState(entry.note);
  const [mood, setMood] = useState<MoodId | null>(entry.mood as MoodId | null);

  const hasTodayItems = entry.items.some((item) => item.trim().length > 0);
  const isDirty = note !== entry.note || mood !== entry.mood;
  const canSave = hasTodayItems && isDirty;

  return (
    <>
      {hasTodayItems ? (
        <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.24em] text-[#b2855e]">Tonight</span>
            <span className="rounded-full border border-[#e0cfba] bg-[#f7efe2] px-3 py-1 text-xs text-[#8f6c4a]">
              {entry.dateKey}
            </span>
          </div>

          <div className="space-y-3">
            {entry.items.map((item, index) => {
              const status = entry.statuses[index];
              const activeIndex = STATUS_ORDER.indexOf(status);
              const label = item.trim() || `第 ${index + 1} 件事`;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onToggle(index as 0 | 1 | 2)}
                  aria-label={`切换第 ${index + 1} 件事的状态，当前为 ${STATUS_LABELS[status]}`}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4 text-left transition hover:border-[#bc8750] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-sm text-[#8f6c4a]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-[#2b1a0c]">{label}</p>
                    <p className="mt-1 text-xs text-[#8f6c4a]">{STATUS_LABELS[STATUS_ORDER[activeIndex]]}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
                    {STATUS_ORDER.map((candidate) => (
                      <span
                        key={candidate}
                        className={`h-3 w-3 rounded-full border ${
                          candidate === status ? "border-[#a56a27] bg-[#c88a38]" : "border-[#dfcfbb] bg-[#f7efe2]"
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 text-sm leading-7 text-[#7b5a3e] shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
          今天还没有写三件事，先回 Today 完成记录，再回来标记进度。
        </div>
      )}

      <div className="rounded-[28px] border border-[#dcc8ad] bg-white/80 p-5">
        <p className="mb-3 text-sm text-[#6f5338]">今天的状态</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((option) => {
            const active = mood === option.id;
            return (
              <button
                key={option.id}
                type="button"
                disabled={!hasTodayItems}
                onClick={() => setMood(active ? null : option.id)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  active ? "border-[#b06a1a] bg-[#f0ddc0] text-[#2b1a0c]" : "border-[#e0cfba] bg-[#fffaf2] text-[#7b5a3e]"
                }`}
              >
                <span>{option.emoji}</span>
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5">
        <label htmlFor="night-note" className="mb-2 block text-sm text-[#6f5338]">
          晚间笔记
        </label>
        <textarea
          id="night-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={!hasTodayItems}
          placeholder="写几句话，或者什么都不写。"
          rows={4}
          className="w-full rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-3 text-sm leading-7 text-[#2b1a0c] outline-none placeholder:text-[#c5ae90] focus:border-[#bc8750] disabled:cursor-not-allowed disabled:bg-[#f7f1e7] disabled:text-[#9c866c]"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-[#8f6c4a]">
            {hasTodayItems ? (note.length > 0 ? `${note.length} 个字` : "可以不写") : "先完成 Today，再保存晚间记录。"}
          </span>
          <button
            type="button"
            onClick={() => {
              if (!canSave) {
                return;
              }
              onSave({ note, mood });
            }}
            disabled={!canSave}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[#d8c7ae] disabled:text-[#8b6a4c]"
          >
            <Save className="h-4 w-4" />
            保存晚间记录
          </button>
        </div>
      </div>
    </>
  );
}

export function NightPage() {
  const { ready, issue, todayKey, todayEntry, toggleStatus, saveNightDetails } = useThreeMovesStore();
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const saved = savedKey === todayKey;

  return (
    <AppShell
      title="Night"
      subtitle="记录今天三件事的状态：未开始、已开始、已完成。"
      notice={issue?.message ?? null}
    >
      {!ready ? (
        <NightLoadingState />
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <NightForm
            key={`${todayEntry.dateKey}:${todayEntry.updatedAt}`}
            entry={todayEntry}
            onToggle={(index) => {
              toggleStatus(todayKey, index);
              setSavedKey(null);
            }}
            onSave={(input) => {
              saveNightDetails(todayKey, input);
              setSavedKey(todayKey);
            }}
          />

          {saved ? (
            <div className="rounded-[24px] border border-[#d9c5ab] bg-[#f7efe2] px-4 py-3 text-sm text-[#6f5338]">
              <Check className="mr-2 inline-block h-4 w-4" />
              晚间记录已保存到本地。
            </div>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
