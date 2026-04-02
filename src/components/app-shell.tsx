"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Clock3, House, MoonStar, NotebookText, Bell } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants/navigation";

const iconMap = {
  "/": House,
  "/reminder/1": Bell,
  "/night": MoonStar,
  "/history": NotebookText,
} as const;

function isTextEntryTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

export function AppShell({
  title,
  subtitle,
  notice,
  children,
}: {
  title: string;
  subtitle?: string;
  notice?: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [keyboardActive, setKeyboardActive] = useState(false);

  useEffect(() => {
    const updateKeyboardState = () => {
      const activeElement = document.activeElement;
      setKeyboardActive(isTextEntryTarget(activeElement));
    };

    const onFocusIn = (event: FocusEvent) => {
      setKeyboardActive(isTextEntryTarget(event.target));
    };

    const onFocusOut = () => {
      window.setTimeout(updateKeyboardState, 0);
    };

    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(186,134,74,0.18),_transparent_38%),linear-gradient(180deg,_#f4ecde_0%,_#efe2cf_100%)] text-[#2b1a0c]">
      <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 pb-[calc(9rem+env(safe-area-inset-bottom))] pt-6 sm:px-6">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="max-w-[75%]">
            <p className="mb-2 text-[11px] uppercase tracking-[0.34em] text-[#a77744]">Three Moves</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#241407] sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm leading-6 text-[#7b5a3e]">{subtitle}</p> : null}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-full border border-[#d8c2a3] bg-white/70 px-3 py-2 text-xs text-[#7b5a3e] shadow-sm backdrop-blur">
              <Clock3 className="mr-1 inline-block h-3.5 w-3.5" />
              Local first
            </div>
            <Link
              href="/install"
              className="inline-flex items-center rounded-full border border-[#dcc8ad] bg-white/70 px-3 py-1.5 text-[11px] font-medium text-[#7b5a3e] shadow-sm backdrop-blur transition hover:bg-[#f7efdf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4ecde]"
              aria-label="Install Three Moves on iPhone"
            >
              Install
            </Link>
          </div>
        </header>

        {notice ? (
          <div
            role="status"
            className="mb-5 rounded-[24px] border border-[#dcc8ad] bg-[#fffaf2]/90 px-4 py-3 text-sm leading-6 text-[#7b5a3e] shadow-[0_8px_20px_rgba(90,58,24,0.05)]"
          >
            {notice}
          </div>
        ) : null}

        <section className="flex-1">{children}</section>
      </main>

      <nav
        className={`fixed inset-x-0 bottom-4 z-20 px-4 transition duration-200 ${
          keyboardActive ? "pointer-events-none translate-y-8 opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-label="Primary"
      >
        <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-full border border-[#d8c2a3] bg-[#fbf6ed]/90 px-2 py-2 shadow-[0_12px_32px_rgba(85,54,22,0.12)] backdrop-blur">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === "/reminder/1" && pathname?.startsWith("/reminder"));
            const Icon = iconMap[item.href];

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-1 flex-col items-center justify-center rounded-full px-2 py-2 text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b06a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fbf6ed] ${
                  isActive ? "bg-[#e7d3b6] text-[#2b1a0c]" : "text-[#94704f] hover:bg-[#f1e5d4]"
                }`}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
