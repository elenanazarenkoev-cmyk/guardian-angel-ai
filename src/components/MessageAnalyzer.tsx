import { useState } from "react";
import { Search, Volume2, RotateCcw } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import SafeTouchButton from "./SafeTouchButton";
import { analyzeMessage, type SourceType, type AnalysisResult } from "@/lib/threatAnalyzer";
import type { Locale, Translations } from "@/lib/i18n";

const SOURCE_OPTIONS: { key: SourceType; label_key: string }[] = [
  { key: "sms", label_key: "sms" },
  { key: "email", label_key: "email" },
  { key: "call", label_key: "call" },
  { key: "web", label_key: "web" },
];

interface MessageAnalyzerProps {
  userMode: "elderly" | "child" | "adult";
  locale: Locale;
  t: Translations;
}

const MessageAnalyzer = ({ locale, t }: MessageAnalyzerProps) => {
  const [source, setSource] = useState<SourceType>("sms");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
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

  const verdictLabel = result
    ? { safe: t.resultSafe, warning: t.resultWarning, danger: t.resultDanger }[result.verdict]
    : "";
  const explanation = result
    ? locale === "ru" ? result.explanation_ru : result.explanation_en
    : "";

  const scoreColor = result
    ? result.verdict === "danger" ? "bg-[hsl(var(--danger))]"
    : result.verdict === "warning" ? "bg-[hsl(var(--warning))]"
    : "bg-[hsl(var(--safe))]"
    : "";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
        <h3 className="text-lg font-bold text-foreground mb-1">{t.inboxTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.inboxDesc}</p>
      </div>

      {/* Source tabs */}
      <div className="flex gap-1" role="radiogroup" aria-label="Message type">
        {SOURCE_OPTIONS.map(opt => {
          const isActive = source === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => { setSource(opt.key); handleReset(); }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
              role="radio"
              aria-checked={isActive}
            >
              {t.sourceLabels[opt.label_key]}
            </button>
          );
        })}
      </div>

      {/* Text input */}
      <textarea
        className="w-full min-h-[100px] rounded-xl p-3.5 bg-card text-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none resize-vertical text-sm leading-relaxed placeholder:text-muted-foreground transition-colors"
        placeholder={t.pastePlaceholder[source]}
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={5}
      />

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !content.trim()}
        className="w-full rounded-xl p-4 bg-primary text-primary-foreground text-base font-bold transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-3 min-h-[52px]"
      >
        {isAnalyzing ? (
          <>
            <Search className="w-5 h-5 animate-spin" />
            <span>{t.analyzing}</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>{t.analyzeBtn}</span>
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <ThreatIndicator
            level={result.verdict}
            message={verdictLabel}
            locale={locale}
          />

          {/* Score bar */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.riskLabel}</span>
              <span className="text-sm font-bold text-foreground">{result.score}%</span>
            </div>
            <div className="h-2.5 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${scoreColor}`} style={{ width: `${result.score}%` }} />
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-foreground">{t.elderlyExplanation}</span>
              <button
                onClick={() => speak(explanation)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Read aloud"
              >
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
          </div>

          {/* Flags */}
          {result.flags.length > 0 && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">{t.detectedSignals}</p>
              <div className="flex flex-wrap gap-1.5">
                {result.flags.map(flag => (
                  <span
                    key={flag.key}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      flag.severity === "high"
                        ? "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]"
                        : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
                    }`}
                  >
                    {locale === "ru" ? flag.label_ru : flag.label_en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Danger actions */}
          {result.verdict === "danger" && (
            <div className="grid grid-cols-1 gap-3">
              <SafeTouchButton label={t.blockBtn} variant="danger" onConfirm={() => {}} />
              <SafeTouchButton label={t.callRelativeBtn} variant="primary" onConfirm={() => {}} />
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full rounded-xl p-3.5 bg-secondary text-secondary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t.checkAnother}
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageAnalyzer;
