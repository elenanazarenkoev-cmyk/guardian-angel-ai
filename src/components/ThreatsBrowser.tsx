import { useState } from "react";
import { THREATS, THREAT_CATEGORIES } from "@/lib/threatsData";
import type { Locale, Translations } from "@/lib/i18n";

interface ThreatsBrowserProps {
  userMode: "elderly" | "child" | "adult";
  locale: Locale;
  t: Translations;
}

const ThreatsBrowser = ({ locale, t }: ThreatsBrowserProps) => {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const l = (en: string, ru: string) => locale === "ru" ? ru : en;
  const filtered = THREATS.filter(th => filter === "all" || th.cat === filter);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
        <h3 className="text-lg font-bold text-foreground mb-1">{t.threatsTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.threatsDesc}</p>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {THREAT_CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filter === c.key ? "bg-primary border-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
            {l(c.label_en, c.label_ru)}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((th, i) => {
          const isOpen = expandedId === i;
          return (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <button onClick={() => setExpandedId(isOpen ? null : i)} className="w-full p-3.5 flex items-center gap-3 text-left bg-card hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-xl flex-shrink-0">{th.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{l(th.name.en, th.name.ru)}</p>
                  <p className="text-xs text-muted-foreground">{l(th.type.en, th.type.ru)}</p>
                </div>
                <span className="text-muted-foreground text-xs">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 space-y-3 border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{l(th.how.en, th.how.ru)}</p>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">{t.redFlags}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(locale === "ru" ? th.flags.ru : th.flags.en).map((f, fi) => (
                        <span key={fi} className="text-xs font-semibold px-2 py-1 rounded-full bg-destructive/10 text-destructive">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreatsBrowser;
