import type { Locale } from "@/lib/i18n";

interface UserModeToggleProps {
  mode: "elderly" | "child";
  onChange: (mode: "elderly" | "child") => void;
  locale: Locale;
}

const UserModeToggle = ({ mode, onChange, locale }: UserModeToggleProps) => {
  const elderlyLabel = locale === "ru" ? "👴 Взрослый" : "👴 Senior";
  const childLabel = locale === "ru" ? "👧 Ребёнок" : "👧 Child";

  return (
    <div className="flex gap-3 w-full" role="radiogroup" aria-label={locale === "ru" ? "Режим пользователя" : "User mode"}>
      <button
        className={`touch-zone flex-1 rounded-2xl p-4 text-xl font-bold transition-all select-none
          ${mode === "elderly" 
            ? "bg-primary text-primary-foreground ring-4 ring-primary/50" 
            : "bg-secondary text-secondary-foreground"}`}
        onClick={() => onChange("elderly")}
        role="radio"
        aria-checked={mode === "elderly"}
      >
        {elderlyLabel}
      </button>
      <button
        className={`touch-zone flex-1 rounded-2xl p-4 text-xl font-bold transition-all select-none
          ${mode === "child" 
            ? "bg-primary text-primary-foreground ring-4 ring-primary/50" 
            : "bg-secondary text-secondary-foreground"}`}
        onClick={() => onChange("child")}
        role="radio"
        aria-checked={mode === "child"}
      >
        {childLabel}
      </button>
    </div>
  );
};

export default UserModeToggle;
