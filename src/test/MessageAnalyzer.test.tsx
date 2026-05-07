import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import { translations } from "@/lib/i18n";

const CASES = [
  { name: "safe", text: "Hi, are we still meeting tomorrow at 10?" },
  { name: "warning", text: "Congratulations! Claim your free prize reward." },
  { name: "danger", text: "URGENT: your bank account is suspended. Verify your PIN at http://sber-secure.xyz/login" },
];

for (const locale of ["en", "ru"] as const) {
  describe(`MessageAnalyzer UI (${locale})`, () => {
    for (const c of CASES) {
      it(`renders explanation without breaking for ${c.name}`, async () => {
        const t = translations[locale];
        const { container } = render(
          <MessageAnalyzer userMode="adult" locale={locale} t={t} />
        );

        const textarea = container.querySelector("textarea")!;
        fireEvent.change(textarea, { target: { value: c.text } });

        const btn = screen.getByRole("button", { name: new RegExp(t.analyzeBtn, "i") });
        fireEvent.click(btn);

        await waitFor(() => {
          expect(screen.getByText(t.elderlyExplanation)).toBeInTheDocument();
        }, { timeout: 2000 });

        // Explanation paragraph exists, non-empty
        const explHeader = screen.getByText(t.elderlyExplanation);
        const explBlock = explHeader.closest("div")!.parentElement!;
        const paragraph = explBlock.querySelector("p")!;
        expect(paragraph.textContent?.trim().length ?? 0).toBeGreaterThan(10);
      });
    }
  });
}
