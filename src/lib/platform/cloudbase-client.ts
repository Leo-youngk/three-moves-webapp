import cloudbase from "@cloudbase/node-sdk";
import { getCloudBaseApiKey, getCloudBaseEnvId } from "./env";

type CloudBaseApp = ReturnType<typeof cloudbase.init>;

let cachedCloudBaseApp: CloudBaseApp | null = null;

function hasCloudBaseCredentials() {
  return getCloudBaseApiKey().length > 0;
}

export function getCloudBaseApp(): CloudBaseApp {
  if (!hasCloudBaseCredentials()) {
    throw new Error("缺少 CloudBase 凭证：请配置 CLOUDBASE_APIKEY");
  }

  if (!cachedCloudBaseApp) {
    const env = getCloudBaseEnvId();
    const apiKey = getCloudBaseApiKey();
    cachedCloudBaseApp = cloudbase.init({
      env,
      accessKey: apiKey,
    });
  }

  return cachedCloudBaseApp;
}

export function resetCloudBaseAppForTest() {
  cachedCloudBaseApp = null;
}
