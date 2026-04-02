"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, NotebookText } from "lucide-react";
import { AppShell } from "./app-shell";
import { getMoodById } from "@/lib/constants/moods";
import { useThreeMovesStore } from "@/hooks/use-three-moves-store";

const STATUS_LABELS = {
  not_started: "未开始",
  started: "已开始",
  completed: "已完成",
} as const;

function HistoryLoadingState() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3" aria-busy="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5">
          <div className="h-4 w-24 rounded-full bg-[#eadbc4]" />
          <div className="mt-4 h-5 w-full rounded-full bg-[#f3e7d4]" />
          <div className="mt-3 h-5 w-3/4 rounded-full bg-[#f3e7d4]" />
        </div>
      ))}
    </div>
  );
}

function HistoryList({
  entries,
}: {
  entries: ReturnType<typeof useThreeMovesStore>["history"];
}) {
  const [expandedDateKey, setExpandedDateKey] = useState<string | null>(entries[0]?.dateKey ?? null);

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const expanded = expandedDateKey === entry.dateKey;

        return (
          <article
            key={entry.dateKey}
            className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.05)]"
          >
            <button
              type="button"
              onClick={() => setExpandedDateKey(expanded ? null : entry.dateKey)}
              aria-expanded={expanded}
              aria-controls={`history-panel-${entry.dateKey}`}
              className="flex w-full items-start justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-[#6f5338]">
                  <NotebookText className="h-4 w-4" />
                  {entry.dateKey}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#8f6c4a]">
                  {entry.note.trim() ? entry.note : entry.items.some((item) => item.trim().length > 0) ? "当天没有晚间笔记" : "当天还没有填写内容"}
                </p>
              </div>
              {expanded ? <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-[#a37a51]" /> : <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[#a37a51]" />}
            </button>

            {expanded ? (
              <div id={`history-panel-${entry.dateKey}`} className="mt-4 space-y-3">
                {entry.items.map((item, index) => {
                  const value = item.trim() || "未填写";

                  return (
                    <div key={index} className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-[#2b1a0c]">{value}</p>
                        <p className="mt-1 text-xs text-[#8f6c4a]">{STATUS_LABELS[entry.statuses[index]]}</p>
                      </div>
                    </div>
                  );
                })}

                {entry.mood ? (
                  <div className="rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-3 text-sm text-[#6f5338]">
                    {(() => {
                      const mood = getMoodById(entry.mood as "calm" | "energized" | "tired" | "focused");
                      return `今天的状态：${mood?.emoji ?? ""} ${mood?.label ?? ""}`;
                    })()}
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function HistoryPage() {
  const { ready, issue, history } = useThreeMovesStore();

  return (
    <AppShell
      title="History"
      subtitle="按日期回看每天写下的三件事和晚间状态。"
      notice={issue?.message ?? null}
    >
      {!ready ? (
        <HistoryLoadingState />
      ) : (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
          {history.length === 0 ? (
            <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 text-sm leading-7 text-[#7b5a3e]">
              还没有历史记录。先去 Today 完成一次保存，再回来查看。
            </div>
          ) : (
            <HistoryList key={history[0]?.dateKey ?? "empty"} entries={history} />
          )}
        </div>
      )}
    </AppShell>
  );
}
