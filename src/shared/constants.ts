// Message types passed between popup/content/background via
// chrome.runtime.sendMessage / chrome.tabs.sendMessage.
export const MESSAGE_TYPES = {
  COUNT_LINKS: "COUNT_LINKS",
  LINKS_COUNTED: "LINKS_COUNTED",
} as const;

// Keys used with chrome.storage. Local storage is per-device and holds
// results/history; sync storage holds small user preferences that should
// follow the user across signed-in Chrome instances.
export const STORAGE_KEYS = {
  LAST_LINK_COUNT: "lastLinkCount", // chrome.storage.local
  HIGHLIGHT_ENABLED: "highlightEnabled", // chrome.storage.sync
} as const;
