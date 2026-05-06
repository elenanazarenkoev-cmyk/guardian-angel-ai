import { useState } from "react";
import ThreatsBrowser from "./ThreatsBrowser";
import DeepfakeGuard from "./DeepfakeGuard";
import RealWorldGuide from "./RealWorldGuide";
import type { Locale, Translations, UserMode } from "@/lib/i18n";

interface Props {
  userMode: UserMode;
  locale: Locale;
  t: Translations;
}

type SubTab = "threats" | "deepfake" | "realworld";

const KnowledgeHub = ({ userMode, locale, t }: Props) => {
  const [tab, setTab] = useState<SubTab>("threats");

  const labels: Record<SubTab, string> = {
    threats:   locale === "ru" ? "📚 Угрозы"   : "📚 Threats",
    deepfake:  locale === "ru" ? "🎭 Дипфейк"  : "🎭 Deepfake",
    realworld: locale === "ru" ? "🗺 Реальный мир" : "🗺 Real World",
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1 p-1 bg-muted rounded-2xl overflow-x-auto scrollbar-hide" role="tablist">
        {(["threats", "deepfake", "realworld"] as SubTab[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`flex-1 min-w-[110px] py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              tab === k
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels[k]}
          </button>
        ))}
      </div>
      {tab === "threats"   && <ThreatsBrowser userMode={userMode} locale={locale} t={t} />}
      {tab === "deepfake"  && <DeepfakeGuard  userMode={userMode} locale={locale} t={t} />}
      {tab === "realworld" && <RealWorldGuide locale={locale} />}
    </div>
  );
};

export default KnowledgeHub;
