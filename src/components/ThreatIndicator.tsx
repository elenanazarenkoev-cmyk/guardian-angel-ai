import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

type ThreatLevel = "safe" | "warning" | "danger";

interface ThreatIndicatorProps {
  level: ThreatLevel;
  message: string;
  details?: string;
}

const config = {
  safe: {
    icon: ShieldCheck,
    className: "status-safe glow-safe",
    statusText: "БЕЗОПАСНО",
  },
  warning: {
    icon: ShieldAlert,
    className: "status-warning glow-warning",
    statusText: "ВНИМАНИЕ",
  },
  danger: {
    icon: ShieldX,
    className: "status-danger glow-danger animate-pulse-glow",
    statusText: "ОПАСНОСТЬ",
  },
};

const ThreatIndicator = ({ level, message, details }: ThreatIndicatorProps) => {
  const { icon: Icon, className, statusText } = config[level];

  return (
    <div
      className={`rounded-3xl p-8 flex flex-col items-center text-center gap-4 ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <Icon className="w-20 h-20" aria-hidden="true" />
      <h2 className="text-4xl font-black tracking-wider">{statusText}</h2>
      <p className="text-xl font-semibold leading-relaxed max-w-md">{message}</p>
      {details && (
        <p className="text-lg opacity-80 leading-relaxed max-w-md">{details}</p>
      )}
    </div>
  );
};

export default ThreatIndicator;
