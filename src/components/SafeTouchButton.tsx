import { useState, useRef, useCallback } from "react";

interface SafeTouchButtonProps {
  label: string;
  onConfirm: () => void;
  variant: "safe" | "warning" | "danger" | "primary";
  icon?: React.ReactNode;
  holdDuration?: number;
  className?: string;
  ariaLabel?: string;
}

const variantClasses = {
  safe: "status-safe",
  warning: "status-warning",
  danger: "status-danger",
  primary: "bg-primary text-primary-foreground",
};

const SafeTouchButton = ({
  label,
  onConfirm,
  variant,
  icon,
  holdDuration = 400,
  className = "",
  ariaLabel,
}: SafeTouchButtonProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const startHold = useCallback(() => {
    setIsHolding(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(pct);
    }, 16);

    timerRef.current = setTimeout(() => {
      onConfirm();
      setIsHolding(false);
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, holdDuration);
  }, [holdDuration, onConfirm]);

  const cancelHold = useCallback(() => {
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return (
    <button
      className={`relative touch-zone w-full rounded-2xl text-2xl font-bold 
        flex items-center justify-center gap-4 p-6 select-none
        transition-all duration-200 active:scale-[0.97]
        ${variantClasses[variant]} ${className}`}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      aria-label={ariaLabel || label}
      role="button"
    >
      {icon && <span className="text-3xl" aria-hidden="true">{icon}</span>}
      <span>{label}</span>

      {/* Hold progress bar */}
      {isHolding && (
        <div className="absolute bottom-0 left-0 right-0 h-2 rounded-b-2xl overflow-hidden bg-background/30">
          <div
            className="h-full bg-foreground/50 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
};

export default SafeTouchButton;
