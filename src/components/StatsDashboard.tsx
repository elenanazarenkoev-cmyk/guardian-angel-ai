import { useCurrentUser } from "@/hooks/useDatabase";
import { useUserStats } from "@/hooks/useUserStats";
import { Trophy, Target, ShieldAlert, CheckCircle } from "lucide-react";

interface StatsDashboardProps {
  userMode: "elderly" | "child";
}

const StatsDashboard = ({ userMode }: StatsDashboardProps) => {
  const { data: user } = useCurrentUser();
  const { data: stats, isLoading } = useUserStats(user?.id);

  if (!user) {
    return (
      <div className="bg-card rounded-2xl p-6 text-center">
        <p className="text-lg text-muted-foreground">
          {userMode === "elderly"
            ? "Войдите в аккаунт, чтобы сохранять прогресс обучения"
            : "Войди в аккаунт, чтобы сохранять свои результаты! 🎮"}
        </p>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="bg-card rounded-2xl p-6 text-center">
        <p className="text-lg text-muted-foreground">Загрузка статистики...</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: Target,
      label: "Пройдено сценариев",
      value: `${stats.completedScenarios} / ${stats.totalScenarios}`,
      color: "text-primary",
    },
    {
      icon: Trophy,
      label: "Успешность",
      value: `${stats.successRate}%`,
      color: "text-safe",
    },
    {
      icon: ShieldAlert,
      label: "Попались на уловку",
      value: `${stats.fellForTraps}`,
      color: "text-danger",
    },
    {
      icon: CheckCircle,
      label: "Протокол S.T.O.P.",
      value: stats.stopCompleted ? "Пройден ✅" : "Не пройден",
      color: stats.stopCompleted ? "text-safe" : "text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-center text-foreground">
        📊 Ваш прогресс
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-card rounded-2xl p-4 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${card.color}`} aria-hidden="true" />
              <p className="text-2xl font-black text-foreground">{card.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsDashboard;
