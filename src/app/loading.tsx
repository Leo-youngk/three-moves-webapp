export default function Loading() {
  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(186,134,74,0.18),_transparent_38%),linear-gradient(180deg,_#f4ecde_0%,_#efe2cf_100%)] px-4 py-6 text-[#2b1a0c]">
      <div className="mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col gap-4">
        <div className="h-6 w-40 rounded-full bg-[#eadbc4]" />
        <div className="h-4 w-72 rounded-full bg-[#f0e2cd]" />
        <div className="mt-4 space-y-3">
          <div className="h-32 rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90" />
          <div className="h-32 rounded-[28px] border border-[#dcc8ad] bg-[#fffaf2]/90" />
        </div>
      </div>
    </div>
  );
}
