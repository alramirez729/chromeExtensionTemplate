import { MESSAGE_TYPES } from "../shared/constants";
import type { CountLinksResponse, ExtensionMessage } from "../shared/messaging";
import { getHighlightEnabled } from "../shared/storage";

const HIGHLIGHT_ATTR = "data-my-extension-highlighted";

function countLinks(): number {
  return document.querySelectorAll("a").length;
}

function highlightLinks(): void {
  document.querySelectorAll("a").forEach((link) => {
    if (link.hasAttribute(HIGHLIGHT_ATTR)) return;
    link.style.outline = "2px solid #5a3edc";
    link.setAttribute(HIGHLIGHT_ATTR, "true");
  });
}

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === MESSAGE_TYPES.COUNT_LINKS) {
      const response: CountLinksResponse = { count: countLinks() };
      sendResponse(response);
    }
    // No async work before sendResponse, so no need to `return true` here.
  },
);

async function init(): Promise<void> {
  const highlightEnabled = await getHighlightEnabled();
  if (highlightEnabled) {
    highlightLinks();
  }
}

void init();
