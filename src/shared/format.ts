/** Pure helper (no chrome.* APIs) so it's easy to unit test — see format.test.ts. */
export function formatLinkCount(count: number): string {
  if (count === 0) return "No links found";
  if (count === 1) return "1 link found";
  return `${count} links found`;
}
