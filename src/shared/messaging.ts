import { MESSAGE_TYPES } from "./constants";

export interface CountLinksMessage {
  type: typeof MESSAGE_TYPES.COUNT_LINKS;
}

export interface CountLinksResponse {
  count: number;
}

export interface LinksCountedMessage {
  type: typeof MESSAGE_TYPES.LINKS_COUNTED;
  count: number;
  url: string;
}

export type ExtensionMessage = CountLinksMessage | LinksCountedMessage;

/** Send a message to the content script running in the given tab. */
export async function sendMessageToTab<TResponse = unknown>(
  tabId: number,
  message: ExtensionMessage,
): Promise<TResponse> {
  return chrome.tabs.sendMessage(tabId, message);
}

/** Send a message to the background service worker (or any other listener). */
export async function sendMessageToRuntime<TResponse = unknown>(
  message: ExtensionMessage,
): Promise<TResponse> {
  return chrome.runtime.sendMessage(message);
}

/** Get the active tab in the current window. Throws if none is found. */
export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (!tab) {
    throw new Error("No active tab found");
  }
  return tab;
}
