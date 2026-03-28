import { useState, useCallback } from "react";
import { ShieldCheck } from "lucide-react";
import VoiceButton from "@/components/VoiceButton";
import UserModeToggle from "@/components/UserModeToggle";
import MessageAnalyzer from "@/components/MessageAnalyzer";
import ThreatIndicator from "@/components/ThreatIndicator";
import { toast } from "sonner";

const Index = () => {
  const [userMode, setUserMode] = useState<"elderly" | "child">("elderly");
  const [voiceQuery, setVoiceQuery] = useState<string | null>(null);

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

      <p className="text-center text-lg text-muted-foreground px-6 mb-6">
        Ваш цифровой защитник от мошенников
      </p>

      {/* Main content */}
      <main className="flex-1 px-4 pb-8 space-y-6 max-w-lg mx-auto w-full">
        {/* User mode selector */}
        <UserModeToggle mode={userMode} onChange={setUserMode} />

        {/* Status indicator */}
        <ThreatIndicator
          level="safe"
          message={userMode === "elderly" 
            ? "Сейчас всё спокойно. Угроз нет." 
            : "Всё хорошо! Ты в безопасности 😊"}
        />

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

        {/* Message analyzer */}
        <MessageAnalyzer userMode={userMode} />
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
