import { useState, useCallback } from "react";
import { ShieldCheck } from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import UserModeToggle from "@/components/UserModeToggle";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import StopProtocol from "@/components/StopProtocol";
import ThreatIndicator from "@/components/ThreatIndicator";
import TabButton from "@/components/TabButton";
import { toast } from "sonner";

type TabKey = "analyzer" | "training" | "stop";

const Index = () => {
  const [userMode, setUserMode] = useState<"elderly" | "child">("elderly");
  const [voiceQuery, setVoiceQuery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("analyzer");

  const handleVoiceResult = useCallback((text: string) => {
    setVoiceQuery(text);
    toast.success(`Вы сказали: "${text}"`, {
      description: "Анализирую ваш запрос...",
      duration: 4000,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-center gap-3">
        <ShieldCheck className="w-10 h-10 text-safe" aria-hidden="true" />
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          SafeGuard AI
        </h1>
      </header>

      <p className="text-center text-lg text-muted-foreground px-6 mb-4">
        Ваш цифровой защитник от мошенников
      </p>

      {/* Navigation tabs */}
      <nav className="px-4 mb-4" aria-label="Основная навигация">
        <div className="flex gap-2 max-w-lg mx-auto w-full">
          <NavLink label="Анализ" icon="📬" isActive={activeTab === "analyzer"} onClick={() => setActiveTab("analyzer")} />
          <NavLink label="Тренажёр" icon="🎓" isActive={activeTab === "training"} onClick={() => setActiveTab("training")} />
          <NavLink label="S.T.O.P." icon="🛡️" isActive={activeTab === "stop"} onClick={() => setActiveTab("stop")} />
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8 space-y-6 max-w-lg mx-auto w-full">
        {/* User mode selector */}
        <UserModeToggle mode={userMode} onChange={setUserMode} />

        {/* Voice control */}
        <VoiceButton
          onResult={handleVoiceResult}
          promptText={userMode === "elderly"
            ? "🎤 Нажмите и спросите голосом"
            : "🎤 Нажми и спроси!"}
        />

        {voiceQuery && (
          <div className="bg-card rounded-2xl p-5">
            <p className="text-muted-foreground text-base">Ваш вопрос:</p>
            <p className="text-foreground text-xl font-semibold mt-1">«{voiceQuery}»</p>
          </div>
        )}

        {/* Tab content */}
        {activeTab === "analyzer" && (
          <>
            <ThreatIndicator
              level="safe"
              message={userMode === "elderly"
                ? "Сейчас всё спокойно. Угроз нет."
                : "Всё хорошо! Ты в безопасности 😊"}
            />
            <MessageAnalyzer userMode={userMode} />
          </>
        )}

        {activeTab === "training" && (
          <ScenarioSimulator userMode={userMode} />
        )}

        {activeTab === "stop" && (
          <StopProtocol userMode={userMode} />
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          SafeGuard AI — защита от социальной инженерии
        </p>
      </footer>
    </div>
  );
};

export default Index;
