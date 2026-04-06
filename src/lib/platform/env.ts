const DEFAULT_CLOUDBASE_ENV_ID = "three-moves-cn-prod-1c372186c953";

export function getCloudBaseEnvId() {
  return process.env.CLOUDBASE_ENV_ID?.trim() || DEFAULT_CLOUDBASE_ENV_ID;
}

export function getCloudBaseApiKey() {
  return process.env.CLOUDBASE_APIKEY?.trim() ?? "";
}

export function getReminderDispatchSecret() {
  return process.env.REMINDER_DISPATCH_SECRET?.trim() ?? process.env.SCF_TIMER_SECRET?.trim() ?? "";
}
