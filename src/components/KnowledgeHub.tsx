import { useState } from "react";
import ThreatsBrowser from "./ThreatsBrowser";
import DeepfakeGuard from "./DeepfakeGuard";
import type { Locale, Translations, UserMode } from "@/lib/i18n";

interface Props {
  userMode: UserMode;
  locale: Locale;
  t: Translations;
}

const KnowledgeHub = ({ userMode, locale, t }: Props) => {
  const [tab, setTab] = useState<"threats" | "deepfake">("threats");

  const labels = {
    threats: locale === "ru" ? "📚 Угрозы" : "📚 Threats",
    deepfake: locale === "ru" ? "🎭 Дипфейк" : "🎭 Deepfake",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-muted rounded-2xl" role="tablist">
        {(["threats", "deepfake"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === k
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels[k]}
          </button>
        ))}
      </div>
      {tab === "threats" ? (
        <ThreatsBrowser userMode={userMode} locale={locale} t={t} />
      ) : (
        <DeepfakeGuard userMode={userMode} locale={locale} t={t} />
      )}
    </div>
  );
};

export default KnowledgeHub;
