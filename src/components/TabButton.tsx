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
      className={`touch-zone flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 text-center ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground hover:bg-muted"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <span className="text-2xl" aria-hidden="true">{icon}</span>
      <span className="text-xs font-bold leading-tight">{label}</span>
    </button>
  );
};

export default TabButton;
