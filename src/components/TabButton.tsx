interface TabButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, icon, isActive, onClick }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-xl transition-all duration-200 text-center min-h-[44px] ${
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-card text-muted-foreground hover:bg-muted border border-border"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <span className="text-base sm:text-lg" aria-hidden="true">{icon}</span>
      <span className="text-xs sm:text-sm font-bold leading-tight whitespace-nowrap">{label}</span>
    </button>
  );
};

export default TabButton;
