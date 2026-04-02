import { ReminderPage } from "@/components/reminder-page";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ slot?: string }>;
}) {
  const resolved = await params;
  return <ReminderPage slotId={resolved.slot} />;
}
