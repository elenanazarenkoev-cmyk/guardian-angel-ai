import { useState } from "react";
import { ShieldAlert, Eye, ChevronDown, ChevronUp } from "lucide-react";
import type { Locale, Translations, UserMode } from "@/lib/i18n";
import { DEEPFAKE_THREATS, type DeepfakeThreat } from "@/lib/deepfakeData";

interface Props {
  userMode: UserMode;
  locale: Locale;
  t: Translations;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-[hsl(var(--danger))]/15 text-[hsl(var(--danger))] border-[hsl(var(--danger))]/30",
  high: "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30",
  medium: "bg-primary/15 text-primary border-primary/30",
};

const SEVERITY_LABEL: Record<string, { en: string; ru: string }> = {
  critical: { en: "CRITICAL", ru: "КРИТИЧЕСКИЙ" },
  high: { en: "HIGH", ru: "ВЫСОКИЙ" },
  medium: { en: "MEDIUM", ru: "СРЕДНИЙ" },
};

const DeepfakeGuard = ({ userMode, locale }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | UserMode>("all");

  const filtered = DEEPFAKE_THREATS.filter(t => {
    if (filter === "all") return t.audience.includes(userMode);
    return t.audience.includes(filter);
  });

  const title = locale === "ru" ? "🛡️ Дипфейк-угрозы" : "🛡️ Deepfake Threats";
  const desc = locale === "ru"
    ? userMode === "child"
      ? "Узнай, как мошенники используют ИИ, чтобы притворяться другими людьми! 🤖"
      : userMode === "elderly"
        ? "Научитесь распознавать поддельные голоса и видео, созданные искусственным интеллектом"
        : "Как распознать deepfake: голосовые клоны, видео-фейки и ИИ-манипуляции"
    : userMode === "child"
      ? "Learn how scammers use AI to pretend to be other people! 🤖"
      : userMode === "elderly"
        ? "Learn to recognize fake voices and videos created by artificial intelligence"
        : "How to spot deepfakes: voice clones, fake videos, and AI manipulation";

  const infoBox = locale === "ru"
    ? userMode === "child"
      ? "⚠️ Мошенники могут скопировать голос или лицо любого человека с помощью компьютера. Даже если звонящий выглядит и звучит как знакомый — всегда проверяй!"
      : "⚠️ Технологии дипфейков позволяют в реальном времени подделывать голос и видео любого человека. Достаточно нескольких секунд записи из соцсетей для создания убедительного клона."
    : userMode === "child"
      ? "⚠️ Scammers can copy anyone's voice or face using a computer. Even if a caller looks and sounds familiar — always verify!"
      : "⚠️ Deepfake technology can fake anyone's voice and video in real-time. Just a few seconds of social media audio is enough to create a convincing clone.";

  const audienceFilters = [
    { key: "all" as const, en: "For You", ru: "Для вас" },
    { key: "adult" as const, en: "Adults", ru: "Взрослые" },
    { key: "elderly" as const, en: "Seniors", ru: "Пожилые" },
    { key: "child" as const, en: "Kids", ru: "Дети" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
        <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>

      {/* Warning box */}
      <div className="bg-[hsl(var(--danger))]/10 border border-[hsl(var(--danger))]/20 rounded-2xl p-4">
        <p className="text-sm text-foreground leading-relaxed">{infoBox}</p>
      </div>

      {/* Audience filter */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        {audienceFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {locale === "ru" ? f.ru : f.en}
          </button>
        ))}
      </div>

      {/* Threat cards */}
      <div className="space-y-3">
        {filtered.map(threat => {
          const isOpen = expandedId === threat.id;
          return (
            <div key={threat.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : threat.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{threat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-foreground text-sm">
                      {locale === "ru" ? threat.name.ru : threat.name.en}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${SEVERITY_STYLES[threat.severity]}`}>
                      {locale === "ru" ? SEVERITY_LABEL[threat.severity].ru : SEVERITY_LABEL[threat.severity].en}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {locale === "ru" ? threat.description.ru : threat.description.en}
                  </p>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-3 animate-in fade-in duration-200">
                  {/* Detection tips */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {locale === "ru" ? "Как распознать" : "How to detect"}
                    </p>
                    <ul className="space-y-1.5">
                      {(locale === "ru" ? threat.howToDetect.ru : threat.howToDetect.en).map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="text-primary font-bold mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {locale === "ru" ? "💬 Пример фразы:" : "💬 Example phrase:"}
                    </p>
                    {(locale === "ru" ? threat.examples.ru : threat.examples.en).map((ex, i) => (
                      <p key={i} className="text-sm italic text-muted-foreground bg-muted/50 rounded-xl p-3 border border-border">
                        {ex}
                      </p>
                    ))}
                  </div>

                  {/* Audience badges */}
                  <div className="flex gap-1.5 flex-wrap">
                    {threat.audience.map(a => (
                      <span key={a} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                        {a === "adult" ? (locale === "ru" ? "Взрослые" : "Adults") : a === "elderly" ? (locale === "ru" ? "Пожилые" : "Seniors") : (locale === "ru" ? "Дети" : "Kids")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border text-center">
            <p className="text-muted-foreground text-sm">
              {locale === "ru" ? "Нет угроз для этой аудитории" : "No threats for this audience"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepfakeGuard;
