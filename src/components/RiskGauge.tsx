import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

interface Props {
  score: number;
  locale: Locale;
}

const RiskGauge = ({ score, locale }: Props) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const R = 54;
  const C = 2 * Math.PI * R;
  const arcSpan = 0.75; // 270°
  const pct = Math.min(100, Math.max(0, animated)) / 100;

  const colorVar =
    score >= 60 ? "hsl(var(--danger))" :
    score >= 25 ? "hsl(var(--warning))" :
    "hsl(var(--safe))";

  const label =
    score >= 60 ? (locale === "ru" ? "ВЫСОКИЙ" : "HIGH") :
    score >= 25 ? (locale === "ru" ? "СРЕДНИЙ" : "MEDIUM") :
    (locale === "ru" ? "НИЗКИЙ" : "LOW");

  return (
    <div className="relative w-[140px] h-[140px] mx-auto" role="img" aria-label={`${label} ${score}%`}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(135deg)" }}>
        <circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="10"
          strokeDasharray={`${C * arcSpan} ${C}`}
          strokeLinecap="round"
        />
        <circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke={colorVar}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${C * pct * arcSpan} ${C}`}
          style={{ transition: "stroke-dasharray .8s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tabular-nums" style={{ color: colorVar }}>{score}</span>
        <span className="text-[11px] font-bold tracking-wider" style={{ color: colorVar }}>{label}</span>
      </div>
    </div>
  );
};

export default RiskGauge;
