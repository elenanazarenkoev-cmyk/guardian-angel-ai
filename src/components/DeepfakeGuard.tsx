import { useState } from "react";
import { Eye, ChevronDown, ChevronUp, AlertTriangle, TrendingUp } from "lucide-react";
import type { Locale, Translations, UserMode } from "@/lib/i18n";
import { DEEPFAKE_THREATS, DEEPFAKE_STATS, type DeepfakeThreat } from "@/lib/deepfakeData";

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
        : "Как распознать deepfake: голосовые клоны, видео-фейки и ИИ-манипуляции в B2B и личных финансах"
    : userMode === "child"
      ? "Learn how scammers use AI to pretend to be other people! 🤖"
      : userMode === "elderly"
        ? "Learn to recognize fake voices and videos created by artificial intelligence"
        : "How to spot deepfakes: voice clones, fake videos, and AI manipulation in B2B and personal finance";

  const infoBox = locale === "ru"
    ? userMode === "child"
      ? "⚠️ Мошенники могут скопировать голос или лицо любого человека с помощью компьютера. Даже если звонящий выглядит и звучит как знакомый — всегда проверяй!"
      : "⚠️ В 2024 году компания Arup потеряла $25 млн из-за дипфейк-видеозвонка, где все «руководители» были сгенерированы ИИ. Достаточно 3 секунд аудио из соцсетей для создания убедительного клона голоса."
    : userMode === "child"
      ? "⚠️ Scammers can copy anyone's voice or face using a computer. Even if a caller looks and sounds familiar — always verify!"
      : "⚠️ In 2024, Arup lost $25M via a deepfake video call where all 'executives' were AI-generated. Just 3 seconds of social media audio is enough to clone a convincing voice.";

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

      {/* Stats bar — adults & elderly only */}
      {userMode !== "child" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEEPFAKE_STATS.slice(0, 3).map((stat, i) => (
            <div key={i} className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-lg sm:text-xl font-extrabold text-primary">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight mt-0.5">
                {locale === "ru" ? stat.label.ru : stat.label.en}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Warning box */}
      <div className="bg-[hsl(var(--danger))]/10 border border-[hsl(var(--danger))]/20 rounded-2xl p-4 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-[hsl(var(--danger))] flex-shrink-0 mt-0.5" />
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
                  {/* Real case highlight */}
                  {threat.realCase && (
                    <div className="bg-[hsl(var(--danger))]/5 border border-[hsl(var(--danger))]/15 rounded-xl p-3">
                      <p className="text-xs leading-relaxed text-foreground">
                        {locale === "ru" ? threat.realCase.ru : threat.realCase.en}
                      </p>
                    </div>
                  )}

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

      {/* AI defense info — adults only */}
      {userMode === "adult" && (
        <div className="bg-card rounded-2xl p-4 border border-border space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-bold text-foreground">
              {locale === "ru" ? "ИИ на защите" : "AI Defense Systems"}
            </h4>
          </div>
          <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
            <p>{locale === "ru"
              ? "• Графовые нейронные сети (GNN) анализируют связи между транзакциями в реальном времени, заменяя устаревшие системы на основе правил"
              : "• Graph Neural Networks (GNN) analyze transaction relationships in real-time, replacing legacy rule-based systems"}</p>
            <p>{locale === "ru"
              ? "• Visa выявила мошеннические схемы на $1 млрд с помощью генеративного ИИ, анализируя миллиарды транзакций"
              : "• Visa detected $1B+ in fraud patterns using generative AI, analyzing billions of transactions"}</p>
            <p>{locale === "ru"
              ? "• Федеративное обучение повышает точность до 99% без раскрытия данных между учреждениями"
              : "• Federated learning achieves 99% accuracy without exposing raw data between institutions"}</p>
            <p>{locale === "ru"
              ? "• Объясняемый ИИ (XAI) соответствует требованиям Закона ЕС об ИИ 2026 года"
              : "• Explainable AI (XAI) meets EU AI Act 2026 compliance requirements"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeepfakeGuard;
