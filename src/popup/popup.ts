import { MESSAGE_TYPES } from "../shared/constants";
import {
  getActiveTab,
  sendMessageToRuntime,
  sendMessageToTab,
  type CountLinksResponse,
} from "../shared/messaging";
import { getLastLinkCount } from "../shared/storage";
import { formatLinkCount } from "../shared/format";

const countBtn = document.querySelector<HTMLButtonElement>("#count-links-btn")!;
const resultEl = document.querySelector<HTMLParagraphElement>("#result")!;
const lastResultEl =
  document.querySelector<HTMLParagraphElement>("#last-result")!;
const optionsLink = document.querySelector<HTMLAnchorElement>("#options-link")!;

optionsLink.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});

countBtn.addEventListener("click", async () => {
  countBtn.disabled = true;
  resultEl.textContent = "Counting…";

  try {
    const tab = await getActiveTab();
    if (!tab.id) throw new Error("Active tab has no id");

    const response = await sendMessageToTab<CountLinksResponse>(tab.id, {
      type: MESSAGE_TYPES.COUNT_LINKS,
    });

    resultEl.textContent = formatLinkCount(response.count);

    await sendMessageToRuntime({
      type: MESSAGE_TYPES.LINKS_COUNTED,
      count: response.count,
      url: tab.url ?? "",
    });
  } catch (error) {
    resultEl.textContent =
      "Couldn't reach the content script on this page (try a regular http/https tab).";
    console.error("[popup] count links failed:", error);
  } finally {
    countBtn.disabled = false;
  }
});

async function showLastResult(): Promise<void> {
  const last = await getLastLinkCount();
  if (!last) return;
  lastResultEl.textContent = `Last: ${last.count} link(s) on ${last.url}`;
}

void showLastResult();
