import type { Locale, UserMode } from "@/lib/i18n";
import { T } from "@/lib/i18n";

interface OnboardingProps {
  locale: Locale;
  onSelect: (mode: UserMode) => void;
  onToggleLang: () => void;
}

const modes: { key: UserMode; emoji: string }[] = [
  { key: "adult", emoji: "🧑" },
  { key: "elderly", emoji: "👴" },
  { key: "child", emoji: "🧒" },
];

const Onboarding = ({ locale, onSelect, onToggleLang }: OnboardingProps) => {
  const t = T[locale];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 text-center text-white"
      style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
      <span className="text-7xl mb-4 animate-bounce">🛡️</span>
      <h1 className="text-3xl font-black mb-2">{t.onboardTitle}</h1>
      <p className="text-base opacity-80 leading-relaxed mb-8 max-w-xs">{t.onboardSub}</p>

      <div className="flex gap-3 w-full max-w-xs mb-6">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            className="flex-1 rounded-2xl border-2 border-white/20 bg-white/10 p-4 text-center transition-all hover:bg-white/20 hover:border-white/50 active:scale-95"
          >
            <span className="text-3xl block mb-1">{m.emoji}</span>
            <span className="text-sm font-bold block">
              {m.key === "adult" ? t.modeAdult : m.key === "elderly" ? t.modeElderly : t.modeChild}
            </span>
            <span className="text-xs opacity-70 block mt-0.5">
              {m.key === "adult" ? t.modeAdultDesc : m.key === "elderly" ? t.modeElderlyDesc : t.modeChildDesc}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onToggleLang}
        className="px-5 py-2 rounded-full border-2 border-white/30 bg-white/10 text-sm font-bold hover:bg-white/20 transition-colors"
      >
        {t.onboardLang}
      </button>
    </div>
  );
};

export default Onboarding;
