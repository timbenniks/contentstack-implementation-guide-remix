import contentstack, { Region, QueryOperation, LivePreviewQuery } from "@contentstack/delivery-sdk"
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page } from "./types";

declare global {
  interface Window {
    ENV: { [key: string]: string };
  }
}

export function getEnv(key: string) {
  if (typeof window !== "undefined" && window.ENV) {
    return window.ENV[key];
  }

  return process.env[key];
}

export const stack = contentstack.stack({
  apiKey: getEnv('CONTENTSTACK_API_KEY') as string,
  deliveryToken: getEnv('CONTENTSTACK_DELIVERY_TOKEN') as string,
  environment: getEnv('CONTENTSTACK_ENVIRONMENT') as string,
  region: getEnv('CONTENTSTACK_REGION') === 'EU' ? Region.EU : Region.US,
  live_preview: {
    enable: getEnv('CONTENTSTACK_PREVIEW') === 'true',
    preview_token: getEnv('CONTENTSTACK_PREVIEW_TOKEN'),
    host: getEnv('CONTENTSTACK_REGION') === 'EU' ? "eu-rest-preview.contentstack.com" : "rest-preview.contentstack.com",
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: true,
    enable: getEnv('CONTENTSTACK_PREVIEW') === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: getEnv('CONTENTSTACK_API_KEY'),
      environment: getEnv('CONTENTSTACK_ENVIRONMENT'),
    },
    clientUrlParams: {
      host:
        getEnv('CONTENTSTACK_REGION') === "EU"
          ? "eu-app.contentstack.com"
          : "app.contentstack.com",
    },
    editButton: {
      enable: true,
    },
  });
}

export async function getPage(url: string, livePreviewQuery: LivePreviewQuery) {
  if (livePreviewQuery && livePreviewQuery.live_preview) {
    stack.livePreviewQuery(livePreviewQuery)
  }

  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0]

    if (getEnv('CONTENTSTACK_PREVIEW') === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true);
    }

    return entry;
  }
}