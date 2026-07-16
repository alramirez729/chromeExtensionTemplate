import { describe, expect, it } from "vitest";
import { formatLinkCount } from "./format";

describe("formatLinkCount", () => {
  it("handles zero links", () => {
    expect(formatLinkCount(0)).toBe("No links found");
  });

  it("uses singular wording for exactly one link", () => {
    expect(formatLinkCount(1)).toBe("1 link found");
  });

  it("uses plural wording for more than one link", () => {
    expect(formatLinkCount(4)).toBe("4 links found");
  });
});
