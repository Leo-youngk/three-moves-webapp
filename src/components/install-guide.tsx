import Link from "next/link";

export function InstallGuide() {
  return (
    <div className="rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90 p-5 shadow-[0_10px_30px_rgba(90,58,24,0.06)]">
      <p className="text-xs uppercase tracking-[0.24em] text-[#b2855e]">Install</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#241407]">Add Three Moves to your iPhone</h2>
      <p className="mt-3 text-sm leading-7 text-[#7b5a3e]">
        Open this site in Safari, tap the Share button, then choose Add to Home Screen.
        The app will open as its own icon on your phone.
      </p>

      <ol className="mt-5 space-y-3 text-sm leading-6 text-[#2b1a0c]">
        <li className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
            1
          </span>
          <span>Open Three Moves in Safari.</span>
        </li>
        <li className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
            2
          </span>
          <span>Tap Share and choose Add to Home Screen.</span>
        </li>
        <li className="flex gap-3 rounded-2xl border border-[#e0cfba] bg-white/80 px-4 py-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#dec8ac] bg-[#f6ebdb] text-xs text-[#8f6c4a]">
            3
          </span>
          <span>Open the new icon to launch the app directly.</span>
        </li>
      </ol>

      <div className="mt-5 rounded-2xl border border-[#e0cfba] bg-[#fbf6ee] px-4 py-3 text-sm leading-6 text-[#6f5338]">
        No notifications. No account. No extra setup.
      </div>

      <Link
        href="/"
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2]"
      >
        Back to app
      </Link>
    </div>
  );
}
