import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { REAL_WORLD, getRWLocalised } from "@/lib/realWorldData";
import type { Locale } from "@/lib/i18n";

interface Props {
  locale: Locale;
}

const RealWorldGuide = ({ locale }: Props) => {
  const [openId, setOpenId] = useState<string | null>(REAL_WORLD[0]?.id ?? null);

  const title = locale === "ru" ? "🗺 Реальный мир" : "🗺 Real World Safety";
  const desc = locale === "ru"
    ? "Психология манипуляций, безопасность детей, признаки дипфейков. Знание уровня детектива."
    : "Manipulation psychology, child safety, deepfake tells. Detective-level awareness.";

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
        <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>

      {REAL_WORLD.map((section) => {
        const open = openId === section.id;
        const loc = getRWLocalised(section, locale);
        return (
          <div key={section.id} className="bg-card rounded-2xl border border-border overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : section.id)}
              className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/40 transition-colors"
              aria-expanded={open}
            >
              <span className="text-2xl flex-shrink-0">{section.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground text-sm leading-tight">{loc.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{loc.subtitle}</p>
              </div>
              {open
                ? <ChevronUp className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />}
            </button>

            {open && (
              <div className="px-4 pb-4 space-y-4 animate-in fade-in duration-200">
                {loc.warning && (
                  <div className="bg-[hsl(var(--danger))]/10 border border-[hsl(var(--danger))]/20 rounded-xl p-3 text-sm text-foreground">
                    {loc.warning}
                  </div>
                )}
                {loc.items.map((it, i) => (
                  <div key={i} className="bg-muted/40 rounded-xl p-3.5 border border-border">
                    <p className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                      <span>{it.icon}</span>
                      <span>{it.heading}</span>
                    </p>
                    <ul className="space-y-1.5">
                      {it.points.map((p, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
                          <span className="text-primary font-bold mt-0.5">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RealWorldGuide;
