import { useState } from "react";
import { Search, MessageSquare, Mail, Phone, Globe, Volume2, RotateCcw } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import SafeTouchButton from "./SafeTouchButton";
import { analyzeMessage, type SourceType, type AnalysisResult } from "@/lib/threatAnalyzer";
import type { Locale, Translations } from "@/lib/i18n";

const SOURCE_OPTIONS: { key: SourceType; icon: React.ElementType }[] = [
  { key: "sms", icon: MessageSquare },
  { key: "email", icon: Mail },
  { key: "call", icon: Phone },
  { key: "web", icon: Globe },
];

interface MessageAnalyzerProps {
  userMode: "elderly" | "child";
  locale: Locale;
  t: Translations;
}

const MessageAnalyzer = ({ userMode, locale, t }: MessageAnalyzerProps) => {
  const [source, setSource] = useState<SourceType>("sms");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    // Simulate brief processing delay for UX
    await new Promise(r => setTimeout(r, 600));
    const res = analyzeMessage(content);
    setResult(res);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setResult(null);
    setContent("");
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = locale === "ru" ? "ru-RU" : "en-GB";
      utt.rate = 0.85;
      speechSynthesis.speak(utt);
    }
  };

  const verdictLevel = result?.verdict === "safe" ? "safe" : result?.verdict === "warning" ? "warning" : "danger";
  const verdictLabel = result
    ? { safe: t.resultSafe, warning: t.resultWarning, danger: t.resultDanger }[result.verdict]
    : "";
  const explanation = result
    ? userMode === "elderly"
      ? locale === "ru" ? result.elderlyExplanation_ru : result.elderlyExplanation_en
      : locale === "ru" ? result.childExplanation_ru : result.childExplanation_en
    : "";

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-center text-foreground">
        {t.inboxTitle}
      </h3>

      {/* Source type selector */}
      <div className="flex gap-2" role="radiogroup" aria-label="Message type">
        {SOURCE_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const isActive = source === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => { setSource(opt.key); handleReset(); }}
              className={`touch-zone flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl border-2 transition-all duration-200 ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
              role="radio"
              aria-checked={isActive}
              aria-label={t.sourceLabels[opt.key]}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-bold">{t.sourceLabels[opt.key]}</span>
            </button>
          );
        })}
      </div>

      {/* Text input */}
      <textarea
        className="w-full min-h-[120px] rounded-2xl p-4 bg-card text-foreground border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none resize-none text-base leading-relaxed placeholder:text-muted-foreground transition-colors"
        placeholder={t.pastePlaceholder[source]}
        value={content}
        onChange={e => setContent(e.target.value)}
        aria-label={locale === "ru" ? "Введите текст для проверки" : "Enter text to check"}
        rows={userMode === "elderly" ? 5 : 4}
      />

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !content.trim()}
        className="touch-zone w-full rounded-2xl p-5 bg-primary text-primary-foreground text-xl font-bold transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-3"
        aria-label={locale === "ru" ? "Проверить сообщение" : "Check message"}
      >
        {isAnalyzing ? (
          <>
            <Search className="w-6 h-6 animate-spin" />
            <span>{t.analyzing}</span>
          </>
        ) : (
          <>
            <Search className="w-6 h-6" />
            <span>{t.analyzeBtn}</span>
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-4 mt-2 animate-in fade-in duration-300">
          <ThreatIndicator
            level={verdictLevel as "safe" | "warning" | "danger"}
            message={verdictLabel}
            details={`${t.riskLabel} ${Math.round(result.score * 100)}%`}
          />

          {/* Explanation */}
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold text-foreground">
                {userMode === "elderly" ? t.elderlyExplanation : t.childExplanation}
              </p>
              <button
                onClick={() => speak(explanation)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
                aria-label={locale === "ru" ? "Прочитать вслух" : "Read aloud"}
              >
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xl leading-relaxed text-foreground">
              {explanation}
            </p>
          </div>

          {/* Threat flags */}
          {result.flags.length > 0 && (
            <div className="bg-card rounded-2xl p-5">
              <p className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide">
                {t.detectedSignals}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.flags.map(flag => (
                  <span
                    key={flag.key}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                      flag.severity === "high"
                        ? "bg-danger/10 text-danger border-danger/30"
                        : flag.severity === "medium"
                        ? "bg-warning/10 text-warning border-warning/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {locale === "ru" ? flag.label_ru : flag.label_en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons for danger */}
          {result.verdict === "danger" && (
            <div className="grid grid-cols-1 gap-3">
              <SafeTouchButton label={t.blockBtn} variant="danger" onConfirm={() => {}} />
              <SafeTouchButton label={t.callRelativeBtn} variant="primary" onConfirm={() => {}} />
            </div>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="touch-zone w-full rounded-2xl p-4 bg-secondary text-secondary-foreground text-lg font-semibold flex items-center justify-center gap-2 transition-all hover:bg-secondary/80"
          >
            <RotateCcw className="w-5 h-5" />
            {t.checkAnother}
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageAnalyzer;
