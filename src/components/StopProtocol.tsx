import { useState } from "react";
import { Pause, Search, Eye, Lock, CheckCircle, ChevronDown } from "lucide-react";

interface StopStep {
  letter: string;
  title: string;
  icon: React.ElementType;
  elderlyText: string;
  childText: string;
  actions: string[];
}

const stopSteps: StopStep[] = [
  {
    letter: "S",
    title: "Остановись (Slow Down)",
    icon: Pause,
    elderlyText: "Мошенники торопят вас, чтобы вы не успели подумать. Если кто-то говорит «прямо сейчас» или «срочно» — это первый признак обмана. Скажите: «Я перезвоню позже» и положите трубку.",
    childText: "Если кто-то торопит тебя — СТОП! 🛑 Настоящие друзья и взрослые не будут злиться, если ты подождёшь. Скажи: «Мне нужно подумать».",
    actions: ["Не торопитесь с ответом", "Скажите «Я подумаю» или «Перезвоню»", "Положите трубку если давят"],
  },
  {
    letter: "T",
    title: "Проверь (Think & Trace)",
    icon: Search,
    elderlyText: "Проверьте, кто на самом деле пишет или звонит. Посмотрите настоящий номер телефона или адрес почты — не только имя отправителя. Если «звонит внук» — перезвоните ему на тот номер, который у вас сохранён.",
    childText: "Посмотри, кто на самом деле написал! 🔍 Имя может быть любым, а вот настоящий адрес или номер — нет. Если друг просит что-то странное — позвони ему сам!",
    actions: ["Проверьте реальный номер/адрес отправителя", "Перезвоните по сохранённому номеру", "Не доверяйте только имени отправителя"],
  },
  {
    letter: "O",
    title: "Оцени эмоции (Observe)",
    icon: Eye,
    elderlyText: "Спросите себя: «Я сейчас испуган? Взволнован? Чувствую вину?» Эти эмоции — главное оружие мошенников. Если вы чувствуете сильные эмоции от сообщения — скорее всего, вами пытаются манипулировать.",
    childText: "Спроси себя: «Мне страшно? Я очень хочу этот приз?» 🤔 Если да — возможно, тебя пытаются обмануть! Мошенники специально пугают или обещают подарки.",
    actions: ["Определите свою эмоцию: страх, жадность, вина?", "Сильные эмоции = сигнал опасности", "Возьмите паузу, подышите"],
  },
  {
    letter: "P",
    title: "Защити данные (Private stays Private)",
    icon: Lock,
    elderlyText: "НИКОГДА не называйте пароли, ПИН-коды, SMS-коды или номера карт. Ни банк, ни полиция, ни «Госуслуги» — никто не имеет права их спрашивать. Если просят — это 100% мошенник.",
    childText: "Пароли и коды — это СЕКРЕТ! 🔐 Никому не говори их — ни в игре, ни по телефону, ни в сообщениях. Даже если просит «друг» или «учитель». Расскажи родителям!",
    actions: ["Никогда не сообщайте пароли и коды", "Банк НИКОГДА не просит ПИН-код", "При запросе данных — это мошенник"],
  },
];

interface StopProtocolProps {
  userMode: "elderly" | "child";
}

const StopProtocol = ({ userMode }: StopProtocolProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  const markComplete = (idx: number) => {
    if (!completedSteps.includes(idx)) {
      setCompletedSteps(prev => [...prev, idx]);
    }
  };

  const allComplete = completedSteps.length === stopSteps.length;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-center text-foreground">
        🛡️ Протокол S.T.O.P.
      </h3>
      <p className="text-center text-lg text-muted-foreground">
        {userMode === "elderly"
          ? "4 шага для защиты от любого мошенника"
          : "4 суперсилы против обманщиков! 💪"}
      </p>

      <div className="space-y-3">
        {stopSteps.map((s, idx) => {
          const Icon = s.icon;
          const isExpanded = expandedStep === idx;
          const isComplete = completedSteps.includes(idx);

          return (
            <div key={idx} className="rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleStep(idx)}
                className={`touch-zone w-full p-5 text-left flex items-center gap-4 transition-all duration-200 ${
                  isComplete ? "bg-safe/10" : "bg-card hover:bg-muted"
                }`}
                aria-expanded={isExpanded}
                aria-label={`Шаг ${s.letter}: ${s.title}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0 ${
                  isComplete ? "bg-safe text-safe-foreground" : "bg-primary text-primary-foreground"
                }`}>
                  {isComplete ? "✓" : s.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground">{s.title}</p>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="bg-card px-5 pb-5 space-y-4">
                  <div className="flex items-start gap-3 pt-2">
                    <Icon className="w-8 h-8 text-primary shrink-0 mt-1" aria-hidden="true" />
                    <p className="text-lg leading-relaxed text-foreground">
                      {userMode === "elderly" ? s.elderlyText : s.childText}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {s.actions.map((action, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3">
                        <CheckCircle className="w-5 h-5 text-safe shrink-0" aria-hidden="true" />
                        <p className="text-base text-foreground">{action}</p>
                      </div>
                    ))}
                  </div>

                  {!isComplete && (
                    <button
                      onClick={() => markComplete(idx)}
                      className="touch-zone w-full rounded-xl p-4 bg-primary text-primary-foreground text-lg font-bold transition-all hover:opacity-90"
                    >
                      ✅ Понятно!
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allComplete && (
        <div className="status-safe rounded-2xl p-6 text-center">
          <p className="text-2xl font-bold mb-2">🏆 Вы освоили протокол S.T.O.P.!</p>
          <p className="text-lg">
            {userMode === "elderly"
              ? "Теперь вы знаете, как защитить себя от мошенников."
              : "Теперь ты настоящий киберзащитник! 🦸"}
          </p>
        </div>
      )}
    </div>
  );
};

export default StopProtocol;
