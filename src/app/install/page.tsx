import { AppShell } from "@/components/app-shell";
import { InstallGuide } from "@/components/install-guide";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell
      title="安装"
      subtitle="iPhone 上最短的安装路径：Safari 打开，分享，添加到主屏幕。"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <InstallGuide />
      </div>
    </AppShell>
  );
}
