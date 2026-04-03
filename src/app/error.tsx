"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(186,134,74,0.18),_transparent_38%),linear-gradient(180deg,_#f4ecde_0%,_#efe2cf_100%)] px-4 py-8 text-[#2b1a0c]">
      <div className="w-full max-w-md rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/95 p-6 shadow-[0_16px_40px_rgba(90,58,24,0.12)]">
        <p className="text-xs uppercase tracking-[0.34em] text-[#a77744]">Three Moves</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">页面出错了</h1>
        <p className="mt-3 text-sm leading-6 text-[#7b5a3e]">
          当前页面运行时发生了错误。你可以先重试；如果问题持续，请返回首页继续操作。
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105"
          >
            重试
          </button>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[#dcc8ad] bg-white/80 px-5 py-3 text-sm font-medium text-[#6f5338] transition hover:bg-[#f7efdf]"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
