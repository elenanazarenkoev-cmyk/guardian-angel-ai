import { describe, it, expect } from "vitest";
import { analyzeMessage, type ThreatVerdict } from "@/lib/threatAnalyzer";

const SAMPLES: Record<ThreatVerdict, string> = {
  safe: "Hi, are we still meeting for coffee tomorrow at 10?",
  warning: "Congratulations! You won a free prize, claim your reward now.",
  danger: "URGENT: your bank account is suspended. Verify your PIN at http://sber-secure.xyz/login",
};

describe("threatAnalyzer explanations", () => {
  for (const [expected, text] of Object.entries(SAMPLES) as [ThreatVerdict, string][]) {
    it(`returns non-empty RU/EN explanations for ${expected}`, () => {
      const r = analyzeMessage(text);
      expect(r.verdict).toBe(expected);
      expect(r.explanation_en.trim().length).toBeGreaterThan(10);
      expect(r.explanation_ru.trim().length).toBeGreaterThan(10);
      expect(r.explanation_en).not.toBe(r.explanation_ru);
    });

    it(`RU/EN explanations have comparable length for ${expected}`, () => {
      const r = analyzeMessage(text);
      const en = r.explanation_en.length;
      const ru = r.explanation_ru.length;
      const ratio = Math.max(en, ru) / Math.min(en, ru);
      // Allow up to 1.6x difference (RU often slightly longer)
      expect(ratio).toBeLessThanOrEqual(1.6);
    });
  }

  it("flags have non-empty distinct RU/EN labels", () => {
    const r = analyzeMessage(SAMPLES.danger);
    expect(r.flags.length).toBeGreaterThan(0);
    for (const f of r.flags) {
      expect(f.label_en.trim()).not.toBe("");
      expect(f.label_ru.trim()).not.toBe("");
      expect(f.label_en).not.toBe(f.label_ru);
    }
  });

  it("handles empty and very long inputs without throwing", () => {
    expect(() => analyzeMessage("")).not.toThrow();
    expect(() => analyzeMessage("a".repeat(10000))).not.toThrow();
  });
});
