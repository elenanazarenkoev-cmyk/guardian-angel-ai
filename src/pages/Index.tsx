import { useState, useCallback } from "react";
import { ShieldCheck, Globe } from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import UserModeToggle from "@/components/UserModeToggle";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import StopProtocol from "@/components/StopProtocol";
import StatsDashboard from "@/components/StatsDashboard";
import ThreatsBrowser from "@/components/ThreatsBrowser";
import ThreatIndicator from "@/components/ThreatIndicator";
import TabButton from "@/components/TabButton";
import { toast } from "sonner";
import { T, type Locale } from "@/lib/i18n";

type TabKey = "analyzer" | "training" | "stop" | "threats" | "stats";

const TAB_ICONS: Record<TabKey, string> = {
  analyzer: "📬",
  training: "🎓",
  stop: "🛡️",
  threats: "🔍",
  stats: "📊",
};

const Index = () => {
  const [userMode, setUserMode] = useState<"elderly" | "child">("elderly");
  const [locale, setLocale] = useState<Locale>("ru");
  const [voiceQuery, setVoiceQuery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("analyzer");

  const t = T[locale];

  const handleVoiceResult = useCallback((text: string) => {
    setVoiceQuery(text);
    toast.success(locale === "ru" ? `Вы сказали: "${text}"` : `You said: "${text}"`, {
      description: locale === "ru" ? "Анализирую ваш запрос..." : "Analyzing your request...",
      duration: 4000,
    });
  }, [locale]);

  const toggleLocale = () => setLocale(l => l === "ru" ? "en" : "ru");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-safe" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {t.appName}
        </h1>
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold hover:bg-secondary/80 transition-colors"
          aria-label={locale === "ru" ? "Switch to English" : "Переключить на русский"}
        >
          <Globe className="w-4 h-4" />
          {locale === "ru" ? "EN" : "RU"}
        </button>
      </header>

      <p className="text-center text-base sm:text-lg text-muted-foreground px-4 sm:px-6 mb-3 sm:mb-4">
        {t.tagline}
      </p>

      {/* Navigation tabs — scrollable on mobile, wrapped on desktop */}
      <nav className="px-3 sm:px-4 mb-3 sm:mb-4" aria-label={locale === "ru" ? "Основная навигация" : "Main navigation"}>
        <div className="flex gap-1.5 sm:gap-2 max-w-2xl mx-auto w-full overflow-x-auto pb-1 scrollbar-hide">
          {(["analyzer", "training", "stop", "threats", "stats"] as TabKey[]).map(tab => (
            <TabButton
              key={tab}
              label={t.tabs[tab]}
              icon={TAB_ICONS[tab]}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-3 sm:px-4 pb-6 sm:pb-8 space-y-4 sm:space-y-6 max-w-2xl mx-auto w-full">
        {/* User mode selector */}
        <UserModeToggle mode={userMode} onChange={setUserMode} locale={locale} />

        {/* Voice control */}
        <VoiceButton
          onResult={handleVoiceResult}
          promptText={t.voicePrompt}
          locale={locale}
        />

        {voiceQuery && (
          <div className="bg-card rounded-2xl p-4 sm:p-5">
            <p className="text-muted-foreground text-sm sm:text-base">{locale === "ru" ? "Ваш вопрос:" : "Your question:"}</p>
            <p className="text-foreground text-lg sm:text-xl font-semibold mt-1">«{voiceQuery}»</p>
          </div>
        )}

        {/* Tab content */}
        {activeTab === "analyzer" && (
          <>
            <ThreatIndicator
              level="safe"
              message={userMode === "elderly" ? t.safeStatus : t.safeStatusChild}
              locale={locale}
            />
            <MessageAnalyzer userMode={userMode} locale={locale} t={t} />
          </>
        )}

        {activeTab === "training" && <ScenarioSimulator userMode={userMode} locale={locale} t={t} />}
        {activeTab === "stop" && <StopProtocol userMode={userMode} locale={locale} t={t} />}
        {activeTab === "threats" && <ThreatsBrowser userMode={userMode} locale={locale} t={t} />}
        {activeTab === "stats" && <StatsDashboard userMode={userMode} locale={locale} t={t} />}
      </main>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-3 sm:py-4 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default Index;
