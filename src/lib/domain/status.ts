export type Status = "not_started" | "started" | "completed";

export const STATUS_ORDER: Status[] = ["not_started", "started", "completed"];

export function nextStatus(status: Status): Status {
  const index = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

