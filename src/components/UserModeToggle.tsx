import type { Locale, UserMode } from "@/lib/i18n";

interface UserModeToggleProps {
  mode: UserMode;
  onChange: (mode: UserMode) => void;
  locale: Locale;
}

const modes: { key: UserMode; emoji: string; label_en: string; label_ru: string }[] = [
  { key: "adult", emoji: "🧑", label_en: "Adult", label_ru: "Взрослый" },
  { key: "elderly", emoji: "👴", label_en: "Senior", label_ru: "Пожилой" },
  { key: "child", emoji: "🧒", label_en: "Child", label_ru: "Ребёнок" },
];

const UserModeToggle = ({ mode, onChange, locale }: UserModeToggleProps) => {
  return (
    <div className="flex gap-2 w-full" role="radiogroup" aria-label={locale === "ru" ? "Режим пользователя" : "User mode"}>
      {modes.map(m => (
        <button
          key={m.key}
          className={`flex-1 rounded-xl p-2.5 sm:p-3 text-sm font-bold transition-all select-none flex items-center justify-center gap-1.5
            ${mode === m.key
              ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
              : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
          onClick={() => onChange(m.key)}
          role="radio"
          aria-checked={mode === m.key}
        >
          <span>{m.emoji}</span>
          <span className="hidden sm:inline">{locale === "ru" ? m.label_ru : m.label_en}</span>
        </button>
      ))}
    </div>
  );
};

export default UserModeToggle;
