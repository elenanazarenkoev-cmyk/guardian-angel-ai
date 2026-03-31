import { useMemo } from "react";
import ThreatIndicator from "./ThreatIndicator";
import VoiceButton from "./VoiceButton";
import type { Locale, Translations, UserMode } from "@/lib/i18n";
import { TIPS } from "@/lib/i18n";

interface HomeScreenProps {
  userMode: UserMode;
  locale: Locale;
  t: Translations;
  onNavigate: (tab: string) => void;
  onVoiceResult: (text: string) => void;
}

const HomeScreen = ({ userMode, locale, t, onNavigate, onVoiceResult }: HomeScreenProps) => {
  const tip = useMemo(() => {
    const tips = TIPS[locale];
    return tips[Math.floor(Math.random() * tips.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <ThreatIndicator
        level="safe"
        message={userMode === "child" ? t.safeStatusChild : t.safeStatus}
        details={t.safeStatusSub}
        locale={locale}
      />

      {/* Voice control */}
      <VoiceButton
        onResult={onVoiceResult}
        promptText={t.voicePrompt}
        locale={locale}
      />

      {/* Quick actions */}
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-foreground">{t.quickActions}</h3>
        <button
          onClick={() => onNavigate("analyzer")}
          className="w-full rounded-xl p-3.5 sm:p-4 bg-primary text-primary-foreground text-sm sm:text-base font-bold transition-all hover:opacity-90 min-h-[48px]"
        >
          {t.qaCheck}
        </button>
        <button
          onClick={() => onNavigate("training")}
          className="w-full rounded-xl p-3 sm:p-3.5 border border-border bg-card text-muted-foreground text-sm font-semibold hover:bg-muted transition-colors min-h-[44px]"
        >
          {t.qaTrain}
        </button>
        <button
          onClick={() => onNavigate("stop")}
          className="w-full rounded-xl p-3 sm:p-3.5 border border-border bg-card text-muted-foreground text-sm font-semibold hover:bg-muted transition-colors min-h-[44px]"
        >
          {t.qaStop}
        </button>
      </div>

      {/* Daily tip */}
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
        <h3 className="text-base font-bold text-foreground mb-2">💡 {t.tipTitle}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
      </div>
    </div>
  );
};

export default HomeScreen;
