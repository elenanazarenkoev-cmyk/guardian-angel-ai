import { useThreats } from "@/hooks/useDatabase";
import { AlertTriangle, Shield } from "lucide-react";
import { useState } from "react";
import type { Locale, Translations } from "@/lib/i18n";

interface ThreatsBrowserProps {
  userMode: "elderly" | "child";
  locale: Locale;
  t: Translations;
}

const severityColors: Record<string, string> = {
  critical: "bg-danger text-danger-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-safe text-safe-foreground",
};

const ThreatsBrowser = ({ userMode, locale, t }: ThreatsBrowserProps) => {
  const audience = userMode === "elderly" ? "elderly" : "child";
  const { data: threats, isLoading } = useThreats(audience);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 text-center">
        <p className="text-lg text-muted-foreground">{t.loadingThreats}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-center text-foreground">
        {t.threatsTitle}
      </h3>
      <p className="text-center text-lg text-muted-foreground">
        {userMode === "elderly" ? t.threatsSubElderly : t.threatsSubChild}
      </p>

      <div className="space-y-3">
        {threats?.map((threat) => (
          <div key={threat.id} className="rounded-2xl overflow-hidden border border-border">
            <button
              onClick={() => setExpandedId(expandedId === threat.id ? null : threat.id)}
              className="touch-zone w-full p-5 text-left bg-card hover:bg-muted transition-all flex items-center gap-4"
              aria-expanded={expandedId === threat.id}
            >
              <AlertTriangle className="w-8 h-8 text-warning shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-foreground">{threat.title}</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${severityColors[threat.severity] || "bg-muted text-muted-foreground"}`}>
                  {threat.severity === "critical" ? t.severityCritical : threat.severity === "high" ? t.severityHigh : threat.severity}
                </span>
              </div>
            </button>

            {expandedId === threat.id && (
              <div className="bg-card px-5 pb-5 space-y-3 border-t border-border">
                <p className="text-base text-foreground leading-relaxed pt-3">{threat.description}</p>

                <div>
                  <p className="text-sm font-bold text-muted-foreground mb-2">{t.redFlags}</p>
                  <div className="flex flex-wrap gap-2">
                    {threat.red_flags.map((flag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-danger/10 text-danger text-sm font-semibold">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>

                {threat.examples.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-muted-foreground mb-2">{t.examplePhrases}</p>
                    {threat.examples.map((ex, i) => (
                      <p key={i} className="text-base text-foreground bg-secondary rounded-xl px-4 py-2 mb-1 italic">
                        {ex}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {threats?.length === 0 && (
          <div className="bg-card rounded-2xl p-6 text-center">
            <Shield className="w-10 h-10 text-safe mx-auto mb-2" aria-hidden="true" />
            <p className="text-lg text-muted-foreground">{t.noThreats}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatsBrowser;
