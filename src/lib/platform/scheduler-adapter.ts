import { NextResponse } from "next/server";
import { getReminderDispatchSecret } from "./env";

const DISPATCH_SECRET_HEADER = "x-three-moves-dispatch-secret";
const DISPATCH_SECRET_QUERY = "secret";

export function isAuthorizedReminderDispatch(request: Request): boolean {
  const expectedSecret = getReminderDispatchSecret();
  if (!expectedSecret) {
    return true;
  }

  const url = new URL(request.url);
  const providedSecret = request.headers.get(DISPATCH_SECRET_HEADER) ?? url.searchParams.get(DISPATCH_SECRET_QUERY) ?? "";
  return providedSecret === expectedSecret;
}

export function createUnauthorizedReminderDispatchResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "无效的提醒调度请求",
    },
    { status: 401 },
  );
}

export function assertAuthorizedReminderDispatch(request: Request) {
  return isAuthorizedReminderDispatch(request) ? null : createUnauthorizedReminderDispatchResponse();
}
