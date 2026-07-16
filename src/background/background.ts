import { MESSAGE_TYPES } from "../shared/constants";
import type { ExtensionMessage } from "../shared/messaging";
import { setLastLinkCount } from "../shared/storage";

// Service worker — has no DOM access and can be terminated by the browser
// between events, so keep it stateless and re-derive everything from
// chrome.storage rather than module-level variables.

chrome.runtime.onInstalled.addListener(() => {
  console.log("[background] MY_EXTENSION_NAME installed");
});

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.type === MESSAGE_TYPES.LINKS_COUNTED) {
    void setLastLinkCount({
      count: message.count,
      url: message.url,
      timestamp: Date.now(),
    }).then(() => {
      console.log(
        `[background] stored link count for ${message.url}: ${message.count}`,
      );
    });
  }
  // No response is sent — return nothing so `chrome.runtime.sendMessage`
  // callers resolve immediately instead of waiting on `sendResponse`.
});
