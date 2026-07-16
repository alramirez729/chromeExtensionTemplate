import { getHighlightEnabled, setHighlightEnabled } from "../shared/storage";

const toggle = document.querySelector<HTMLInputElement>("#highlight-toggle")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;

async function restore(): Promise<void> {
  toggle.checked = await getHighlightEnabled();
}

toggle.addEventListener("change", async () => {
  await setHighlightEnabled(toggle.checked);
  status.textContent = "Saved.";
  setTimeout(() => {
    status.textContent = "";
  }, 1200);
});

void restore();
