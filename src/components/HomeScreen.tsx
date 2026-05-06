import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import RiskGauge from "./RiskGauge";
import VoiceButton from "./VoiceButton";
import type { Locale, Translations, UserMode } from "@/lib/i18n";
import { TIPS } from "@/lib/i18n";
import { analyzeMessage, type AnalysisResult } from "@/lib/threatAnalyzer";

interface HomeScreenProps {
  userMode: UserMode;
  locale: Locale;
  t: Translations;
  onNavigate: (tab: string) => void;
  onVoiceResult: (text: string) => void;
}

const HomeScreen = ({ userMode, locale, t, onNavigate, onVoiceResult }: HomeScreenProps) => {
  const [heroInput, setHeroInput] = useState("");
  const [heroResult, setHeroResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const tip = useMemo(() => {
    const tips = TIPS[locale];
    return tips[Math.floor(Math.random() * tips.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const heroAnalyse = async () => {
    const v = heroInput.trim();
    if (!v) return;
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 400));
    setHeroResult(analyzeMessage(v));
    setAnalyzing(false);
  };

  const heroLabel = locale === "ru" ? "Проверить сообщение" : "Check a message";
  const heroPlaceholder = locale === "ru" ? "Вставь SMS, email или ссылку…" : "Paste SMS, email or link…";
  const heroBtn = locale === "ru" ? "Проверить за 3 секунды →" : "Check in 3 seconds →";
  const heroOpenFull = locale === "ru" ? "Открыть полный анализатор →" : "Open full analyser →";

  const verdictLabel = heroResult
    ? { safe: t.resultSafe, warning: t.resultWarning, danger: t.resultDanger }[heroResult.verdict]
    : "";

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <ThreatIndicator
        level="safe"
        message={userMode === "child" ? t.safeStatusChild : t.safeStatus}
        details={t.safeStatusSub}
        locale={locale}
      />

      {/* HERO inline check */}
      <div
        className="rounded-2xl p-5 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #0d2b5e, #1e4a7f)" }}
      >
        <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">{heroLabel}</p>
        <textarea
          value={heroInput}
          onChange={(e) => setHeroInput(e.target.value)}
          placeholder={heroPlaceholder}
          rows={3}
          className="w-full rounded-xl px-3.5 py-3 bg-white/10 border border-white/25 text-white placeholder:text-white/50 outline-none focus:border-white/50 focus:bg-white/15 text-sm resize-none transition"
        />
        <button
          onClick={heroAnalyse}
          disabled={!heroInput.trim() || analyzing}
          className="w-full mt-3 rounded-xl px-4 py-3 bg-white text-[#0d2b5e] text-sm font-extrabold disabled:opacity-50 hover:bg-white/90 transition flex items-center justify-center gap-2 min-h-[48px]"
        >
          {analyzing ? <Search className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {analyzing ? t.analyzing : heroBtn}
        </button>

        {heroResult && (
          <div className="mt-4 bg-white rounded-xl p-4 text-foreground animate-in fade-in duration-300">
            <div className="mb-3">
              <ThreatIndicator level={heroResult.verdict} message={verdictLabel} locale={locale} />
            </div>
            <RiskGauge score={heroResult.score} locale={locale} />
            <p className="text-sm text-foreground mt-3 leading-relaxed">
              {locale === "ru" ? heroResult.explanation_ru : heroResult.explanation_en}
            </p>
            <button
              onClick={() => onNavigate("analyzer")}
              className="w-full mt-3 rounded-xl px-3 py-2.5 bg-muted text-foreground text-sm font-semibold hover:bg-muted/70 transition"
            >
              {heroOpenFull}
            </button>
          </div>
        )}
      </div>

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
          onClick={() => onNavigate("training")}
          className="w-full rounded-xl p-3.5 sm:p-4 bg-primary text-primary-foreground text-sm sm:text-base font-bold transition-all hover:opacity-90 min-h-[48px]"
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
