import { COLORS, PALETTE } from "./colors";

describe("colors", () => {
  it("resolves COLORS from the matching PALETTE step", () => {
    expect(COLORS.primary).toBe(PALETTE.primary[500]);
    expect(COLORS.secondary).toBe(PALETTE.secondary[500]);
    expect(COLORS.background).toBe(PALETTE.neutral[50]);
    expect(COLORS.surface).toBe(PALETTE.neutral[0]);
    expect(COLORS.textMain).toBe(PALETTE.neutral[900]);
    expect(COLORS.textMuted).toBe(PALETTE.neutral[500]);
    expect(COLORS.danger).toBe(PALETTE.danger[500]);
    expect(COLORS.success).toBe(PALETTE.success[500]);
  });
});
