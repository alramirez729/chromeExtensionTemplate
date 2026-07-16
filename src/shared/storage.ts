import { STORAGE_KEYS } from "./constants";

export interface LastLinkCount {
  count: number;
  url: string;
  timestamp: number;
}

// --- chrome.storage.local: per-device results/history ---

export async function getLastLinkCount(): Promise<LastLinkCount | undefined> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.LAST_LINK_COUNT);
  return result[STORAGE_KEYS.LAST_LINK_COUNT] as LastLinkCount | undefined;
}

export async function setLastLinkCount(
  value: LastLinkCount,
): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.LAST_LINK_COUNT]: value });
}

// --- chrome.storage.sync: small user preferences ---

export async function getHighlightEnabled(): Promise<boolean> {
  const result = await chrome.storage.sync.get(
    STORAGE_KEYS.HIGHLIGHT_ENABLED,
  );
  return Boolean(result[STORAGE_KEYS.HIGHLIGHT_ENABLED]);
}

export async function setHighlightEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.sync.set({
    [STORAGE_KEYS.HIGHLIGHT_ENABLED]: enabled,
  });
}
