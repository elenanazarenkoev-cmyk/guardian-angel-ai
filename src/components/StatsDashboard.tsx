import { Award } from "lucide-react";
import type { Locale, Translations } from "@/lib/i18n";
import { useCurrentUser } from "@/hooks/useDatabase";
import { useUserStats } from "@/hooks/useUserStats";

interface StatsDashboardProps {
  userMode: "elderly" | "child" | "adult";
  locale: Locale;
  t: Translations;
}

const BADGES = [
  { id: "first_pass", emoji: "🛡️", title: { en: "Scam Spotter", ru: "Охотник на мошенников" }, cond: (s: number) => s >= 1 },
  { id: "five", emoji: "🎓", title: { en: "Student of Safety", ru: "Ученик безопасности" }, cond: (s: number) => s >= 5 },
  { id: "ten", emoji: "🏆", title: { en: "Safety Champion", ru: "Чемпион безопасности" }, cond: (s: number) => s >= 10 },
];

const StatsDashboard = ({ locale, t }: StatsDashboardProps) => {
  const { data: user } = useCurrentUser();
  const { data: stats, isLoading } = useUserStats(user?.id);
  const l = (en: string, ru: string) => locale === "ru" ? ru : en;

  if (!user) {
    return <div className="bg-card rounded-2xl p-6 border border-border text-center"><p className="text-base text-muted-foreground">{t.loginPromptElderly}</p></div>;
  }
  if (isLoading || !stats) {
    return <div className="bg-card rounded-2xl p-6 border border-border text-center"><p className="text-base text-muted-foreground">{t.loadingStats}</p></div>;
  }

  const rate = stats.completedScenarios > 0 ? Math.round(((stats.completedScenarios - stats.fellForTraps) / stats.completedScenarios) * 100) : 0;
  const earned = BADGES.filter(b => b.cond(stats.completedScenarios));

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border">
        <h3 className="text-lg font-bold text-foreground mb-1">{t.statsTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.statsDesc}</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { num: stats.completedScenarios, label: t.scenariosPlayed },
          { num: `${rate}%`, label: t.successRate },
          { num: stats.completedScenarios - stats.fellForTraps, label: t.scamsSpotted },
          { num: stats.fellForTraps, label: t.fellForTraps },
        ].map((c, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 text-center">
            <p className="text-2xl font-black text-primary">{c.num}</p>
            <p className="text-xs text-muted-foreground font-semibold mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          {t.badgesTitle}
        </h4>
        {earned.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.noBadges}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {earned.map(b => (
              <div key={b.id} className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1.5">
                <span>{b.emoji}</span>
                <span className="text-xs font-bold text-primary">{l(b.title.en, b.title.ru)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDashboard;
