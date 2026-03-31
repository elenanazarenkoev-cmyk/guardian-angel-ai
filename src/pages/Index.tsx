import { useState, useCallback } from "react";
import { ShieldCheck, Globe } from "lucide-react";
import Onboarding from "@/components/Onboarding";
import HomeScreen from "@/components/HomeScreen";
import UserModeToggle from "@/components/UserModeToggle";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import StopProtocol from "@/components/StopProtocol";
import ThreatsBrowser from "@/components/ThreatsBrowser";
import StatsDashboard from "@/components/StatsDashboard";
import TabButton from "@/components/TabButton";
import { toast } from "sonner";
import { T, type Locale, type UserMode } from "@/lib/i18n";

type TabKey = "home" | "analyzer" | "training" | "stop" | "threats" | "stats";

const TAB_ICONS: Record<TabKey, string> = {
  home: "🏠",
  analyzer: "🔍",
  training: "🎓",
  stop: "🛑",
  threats: "📚",
  stats: "📊",
};

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userMode, setUserMode] = useState<UserMode>("adult");
  const [locale, setLocale] = useState<Locale>("ru");
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  const t = T[locale];
  const toggleLocale = () => setLocale(l => l === "ru" ? "en" : "ru");

  const handleModeSelect = (mode: UserMode) => {
    setUserMode(mode);
    setShowOnboarding(false);
  };

  const handleVoiceResult = useCallback((text: string) => {
    toast.success(locale === "ru" ? `Вы сказали: "${text}"` : `You said: "${text}"`, {
      description: locale === "ru" ? "Анализирую ваш запрос..." : "Analyzing your request...",
      duration: 4000,
    });
    setActiveTab("analyzer");
  }, [locale]);

  if (showOnboarding) {
    return <Onboarding locale={locale} onSelect={handleModeSelect} onToggleLang={toggleLocale} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 pt-4 pb-3 bg-gradient-to-b from-[#1e3a5f] to-[#1e4a7f] text-white rounded-b-[28px]">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg">🛡️</div>
            <span className="text-lg font-extrabold tracking-tight">{t.appName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnboarding(true)}
              className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold hover:bg-white/25 transition-colors"
            >
              {userMode === "adult" ? t.modeAdult : userMode === "elderly" ? t.modeElderly : t.modeChild}
            </button>
            <button
              onClick={toggleLocale}
              className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-bold hover:bg-white/25 transition-colors"
            >
              {locale === "ru" ? "EN" : "RU"}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="max-w-2xl mx-auto w-full bg-white/10 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" style={{ animation: "pulse-glow 2s infinite" }} />
          <div>
            <p className="text-sm font-semibold">{t.safeStatus}</p>
            <p className="text-xs opacity-60">{t.safeStatusSub}</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="px-3 py-2.5" aria-label="Main navigation">
        <div className="flex gap-1 max-w-2xl mx-auto w-full overflow-x-auto scrollbar-hide">
          {(["home", "analyzer", "training", "stop", "threats", "stats"] as TabKey[]).map(tab => (
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
      <main className="flex-1 px-3 sm:px-4 pb-6 space-y-4 max-w-2xl mx-auto w-full">
        {activeTab === "home" && (
          <HomeScreen
            userMode={userMode}
            locale={locale}
            t={t}
            onNavigate={(tab) => setActiveTab(tab as TabKey)}
            onVoiceResult={handleVoiceResult}
          />
        )}
        {activeTab === "analyzer" && <MessageAnalyzer userMode={userMode} locale={locale} t={t} />}
        {activeTab === "training" && <ScenarioSimulator userMode={userMode} locale={locale} t={t} />}
        {activeTab === "stop" && <StopProtocol userMode={userMode} locale={locale} t={t} />}
        {activeTab === "threats" && <ThreatsBrowser userMode={userMode} locale={locale} t={t} />}
        {activeTab === "stats" && <StatsDashboard userMode={userMode} locale={locale} t={t} />}
      </main>
    </div>
  );
};

export default Index;
