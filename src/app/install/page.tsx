import { AppShell } from "@/components/app-shell";
import { InstallGuide } from "@/components/install-guide";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell
      title="Install"
      subtitle="Quick steps for adding Three Moves to your iPhone home screen."
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        <InstallGuide />
      </div>
    </AppShell>
  );
}
