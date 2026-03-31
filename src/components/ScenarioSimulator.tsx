import { useState, useRef } from "react";
import { RotateCcw } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import { useCurrentUser, useSaveTrainingProgress } from "@/hooks/useDatabase";
import { SCENARIOS, SCENARIO_CATEGORIES, type Scenario, type ScenarioStep } from "@/lib/scenarioData";
import type { Locale, Translations, UserMode } from "@/lib/i18n";

interface ScenarioSimulatorProps {
  userMode: UserMode;
  locale: Locale;
  t: Translations;
}

const ScenarioSimulator = ({ userMode, locale, t }: ScenarioSimulatorProps) => {
  const [filter, setFilter] = useState("all");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const { data: user } = useCurrentUser();
  const saveProgress = useSaveTrainingProgress();

  const l = (en: string, ru: string) => locale === "ru" ? ru : en;

  const filtered = SCENARIOS.filter(s => {
    const catOk = filter === "all" || s.cat === filter;
    const targetOk = s.targets.includes(userMode) || filter === "child";
    return catOk && targetOk;
  });

  const resetSim = () => {
    setSelectedScenario(null);
    setStepIdx(0);
    setAnswered(false);
    setChosenIdx(null);
  };

  const startScenario = (s: Scenario) => {
    setSelectedScenario(s);
    setStepIdx(0);
    setAnswered(false);
    setChosenIdx(null);
    startTimeRef.current = Date.now();
  };

  const nextStep = () => {
    if (!selectedScenario) return;
    if (stepIdx + 1 >= selectedScenario.steps.length) {
      // Complete
      if (user) {
        saveProgress.mutate({
          user_id: user.id,
          scenario_id: selectedScenario.id,
          user_fell_for_trap: chosenIdx !== null && selectedScenario.steps.find(s => s.type === "choice")?.choices?.[chosenIdx]?.correct === false,
          user_mode: userMode,
          time_spent_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        });
      }
      setStepIdx(selectedScenario.steps.length); // show win screen
      return;
    }
    setStepIdx(prev => prev + 1);
    setAnswered(false);
    setChosenIdx(null);
  };

  const selectChoice = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setChosenIdx(idx);
  };

  // Scenario list
  if (!selectedScenario) {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
          <h3 className="text-lg font-bold text-foreground mb-1">{t.trainingTitle}</h3>
          <p className="text-sm text-muted-foreground">{t.trainingDesc}</p>
        </div>

        {/* Filter */}
        <div className="flex gap-1.5 flex-wrap">
          {SCENARIO_CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === c.key
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {l(c.label_en, c.label_ru)}
            </button>
          ))}
        </div>

        {/* Scenario cards */}
        <div className="space-y-2.5">
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => startScenario(s)}
              className="w-full rounded-xl border border-border bg-card p-4 text-left flex items-center gap-3.5 hover:border-primary/50 hover:shadow-sm transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl flex-shrink-0">
                {s.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{l(s.title.en, s.title.ru)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l(s.desc.en, s.desc.ru)}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 uppercase ${
                s.badgeColor === "red" ? "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]" :
                s.badgeColor === "yellow" ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]" :
                "bg-purple-500/10 text-purple-400"
              }`}>
                {s.badge}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">{t.noThreats}</p>
          )}
        </div>
      </div>
    );
  }

  // Win screen
  if (stepIdx >= selectedScenario.steps.length) {
    return (
      <div className="space-y-4 text-center py-8">
        <span className="text-6xl block animate-bounce">🏆</span>
        <h3 className="text-2xl font-black text-[hsl(var(--safe))]">{t.winTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.winSub}</p>
        <button
          onClick={resetSim}
          className="w-full rounded-xl p-4 bg-[hsl(var(--safe))] text-white text-base font-bold transition-all hover:opacity-90"
        >
          {t.tryAnother}
        </button>
      </div>
    );
  }

  const step = selectedScenario.steps[stepIdx];
  const total = selectedScenario.steps.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={resetSim} className="p-2 rounded-lg hover:bg-muted text-muted-foreground text-lg">←</button>
        <h3 className="text-sm font-bold text-foreground flex-1 truncate">{l(selectedScenario.title.en, selectedScenario.title.ru)}</h3>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 items-center justify-center">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${
            i < stepIdx ? "bg-primary" : i === stepIdx ? "bg-primary scale-125" : "bg-border"
          }`} />
        ))}
      </div>

      {/* Step content */}
      {step.type === "message" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4 bg-background text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {l(step.content!.en, step.content!.ru)}
          </div>
          <button onClick={nextStep} className="w-full rounded-xl p-4 bg-primary text-primary-foreground text-sm font-bold min-h-[48px]">
            {t.nextBtn}
          </button>
        </div>
      )}

      {step.type === "breathe" && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-5 text-center">
            <span className="text-4xl block mb-3" style={{ animation: "breathe-anim 4s infinite" }}>🧘</span>
            <p className="text-sm font-semibold text-primary mb-2">{t.breatheTitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{l(step.content!.en, step.content!.ru)}</p>
          </div>
          <button onClick={nextStep} className="w-full rounded-xl p-4 bg-primary text-primary-foreground text-sm font-bold min-h-[48px]">
            {t.gotIt}
          </button>
        </div>
      )}

      {step.type === "choice" && step.choices && (
        <div className="space-y-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm font-bold text-foreground">{l(step.prompt!.en, step.prompt!.ru)}</p>
          </div>
          <div className="space-y-2">
            {step.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => selectChoice(i)}
                disabled={answered}
                className={`w-full rounded-xl border-2 p-3.5 text-left text-sm leading-relaxed transition-all min-h-[48px] ${
                  answered && chosenIdx === i
                    ? c.correct ? "border-[hsl(var(--safe))] bg-[hsl(var(--safe))]/10 text-[hsl(var(--safe))]" : "border-[hsl(var(--danger))] bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]"
                    : answered && c.correct ? "border-[hsl(var(--safe))]/50 bg-[hsl(var(--safe))]/5"
                    : "border-border bg-card hover:border-primary/50"
                } disabled:cursor-default`}
              >
                {l(c.text.en, c.text.ru)}
              </button>
            ))}
          </div>
          {answered && chosenIdx !== null && (
            <div className={`rounded-xl p-3.5 text-sm leading-relaxed font-medium border ${
              step.choices[chosenIdx].correct
                ? "bg-[hsl(var(--safe))]/10 border-[hsl(var(--safe))]/30 text-[hsl(var(--safe))]"
                : "bg-[hsl(var(--danger))]/10 border-[hsl(var(--danger))]/30 text-[hsl(var(--danger))]"
            }`}>
              {l(step.choices[chosenIdx].feedback.en, step.choices[chosenIdx].feedback.ru)}
            </div>
          )}
          {answered && (
            <button onClick={nextStep} className="w-full rounded-xl p-4 bg-primary text-primary-foreground text-sm font-bold min-h-[48px]">
              {t.nextBtn}
            </button>
          )}
        </div>
      )}

      {step.type === "lesson" && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-[hsl(var(--safe))]/40 bg-[hsl(var(--safe))]/5 p-5">
            <span className="text-2xl block mb-2">🛡️</span>
            <p className="text-sm font-bold text-[hsl(var(--safe))] mb-2">{locale === "ru" ? "Главный урок" : "Key lesson"}</p>
            <p className="text-sm text-foreground leading-relaxed">{l(step.content!.en, step.content!.ru)}</p>
          </div>
          {stepIdx < total - 1 ? (
            <button onClick={nextStep} className="w-full rounded-xl p-4 bg-primary text-primary-foreground text-sm font-bold min-h-[48px]">
              {t.nextBtn}
            </button>
          ) : (
            <button onClick={nextStep} className="w-full rounded-xl p-4 bg-[hsl(var(--safe))] text-white text-sm font-bold min-h-[48px]">
              {locale === "ru" ? "Завершить! 🎉" : "Complete! 🎉"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
