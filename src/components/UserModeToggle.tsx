interface UserModeToggleProps {
  mode: "elderly" | "child";
  onChange: (mode: "elderly" | "child") => void;
}

const UserModeToggle = ({ mode, onChange }: UserModeToggleProps) => {
  return (
    <div className="flex gap-3 w-full" role="radiogroup" aria-label="Режим пользователя">
      <button
        className={`touch-zone flex-1 rounded-2xl p-4 text-xl font-bold transition-all select-none
          ${mode === "elderly" 
            ? "bg-primary text-primary-foreground ring-4 ring-primary/50" 
            : "bg-secondary text-secondary-foreground"}`}
        onClick={() => onChange("elderly")}
        role="radio"
        aria-checked={mode === "elderly"}
        aria-label="Режим для пожилых"
      >
        👴 Пожилой
      </button>
      <button
        className={`touch-zone flex-1 rounded-2xl p-4 text-xl font-bold transition-all select-none
          ${mode === "child" 
            ? "bg-primary text-primary-foreground ring-4 ring-primary/50" 
            : "bg-secondary text-secondary-foreground"}`}
        onClick={() => onChange("child")}
        role="radio"
        aria-checked={mode === "child"}
        aria-label="Режим для детей"
      >
        👧 Ребёнок
      </button>
    </div>
  );
};

export default UserModeToggle;
