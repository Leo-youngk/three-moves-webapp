import Link from "next/link";

export function InstallGuide() {
  return (
    <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[#b2855e]">安装</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#241407]">把 Three Moves 加到 iPhone 主屏幕</h2>
      <p className="mt-3 text-sm leading-7 text-[#7b5a3e]">
        请用 Safari 打开这个网站，点分享按钮，再选择“添加到主屏幕”。添加完成后，它会像独立应用一样从图标直接打开。
      </p>

      <ol className="mt-5 space-y-3 text-sm leading-6 text-[#2b1a0c]">
        <li className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
            1
          </span>
          <span>在 iPhone 的 Safari 里打开 Three Moves。</span>
        </li>
        <li className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
            2
          </span>
          <span>点分享按钮，选择“添加到主屏幕”。</span>
        </li>
        <li className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
            3
          </span>
          <span>确认名称后点“添加”，再从主屏幕直接打开。</span>
        </li>
      </ol>

      <div className="mt-5 rounded-2xl border border-[#e0cfba] bg-[#fbf6ee] px-4 py-3 text-sm leading-6 text-[#6f5338]">
        不需要账号，不会发送通知，也不需要额外设置。
      </div>

      <Link
        href="/"
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
      >
        返回应用
      </Link>
    </div>
  );
}
