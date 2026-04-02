import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(186,134,74,0.18),_transparent_38%),linear-gradient(180deg,_#f4ecde_0%,_#efe2cf_100%)] px-4 py-8 text-[#2b1a0c]">
      <div className="w-full max-w-md rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/95 p-6 shadow-[0_16px_40px_rgba(90,58,24,0.12)]">
        <p className="text-xs uppercase tracking-[0.34em] text-[#a77744]">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">页面不存在</h1>
        <p className="mt-3 text-sm leading-6 text-[#7b5a3e]">
          你访问的链接不在当前 v1 范围内。返回首页继续写今天的三件事。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#b06a1a] px-5 py-3 text-sm font-medium text-[#fff8ef] transition hover:brightness-105"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
