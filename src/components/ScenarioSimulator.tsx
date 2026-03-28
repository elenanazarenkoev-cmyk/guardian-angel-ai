import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Phone, Shield, Heart, ChevronRight, RotateCcw, Eye } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import { useCurrentUser, useSaveTrainingProgress } from "@/hooks/useDatabase";

type SimStep = "trigger" | "breathing" | "analysis" | "simulation" | "lesson";

interface Scenario {
  id: string;
  title: string;
  category: string;
  triggerMessage: string;
  triggerSender: string;
  redFlags: { label: string; explanation: string }[];
  simulationPrompt: string;
  simulationTrap: string;
  lessonTitle: string;
  lessonText: string;
  elderlyLesson: string;
  childLesson: string;
}

const scenarios: Scenario[] = [
  {
    id: "bank-alert",
    title: "Срочное уведомление от банка",
    category: "Вишинг (голосовой фишинг)",
    triggerMessage: "⚠️ ВНИМАНИЕ: Обнаружен несанкционированный перевод 150 000 ₽ с вашего счёта. Срочно позвоните по номеру 8-800-XXX-XXXX для блокировки!",
    triggerSender: "Служба безопасности банка",
    redFlags: [
      { label: "⏰ Срочность", explanation: "Текст заставляет действовать немедленно, не дав подумать" },
      { label: "😨 Страх", explanation: "Крупная сумма вызывает панику и блокирует критическое мышление" },
      { label: "📞 Неизвестный номер", explanation: "Настоящий банк никогда не присылает номер для звонка в SMS" },
    ],
    simulationPrompt: "Вы «звоните» по указанному номеру. Вежливый голос просит назвать ПИН-код для «подтверждения личности»...",
    simulationTrap: "Назвать ПИН-код",
    lessonTitle: "Вишинг-атака",
    lessonText: "Настоящий банк НИКОГДА не просит ПИН-код, CVV или пароль по телефону. Если вам звонят «из банка» — положите трубку и перезвоните сами по номеру на обратной стороне карты.",
    elderlyLesson: "Запомните одно простое правило: настоящий банк НИКОГДА не звонит и не просит назвать ваш секретный код. Если кто-то просит — это обманщик. Положите трубку.",
    childLesson: "Если кто-то по телефону просит назвать секретный код или пароль — это ловушка! Настоящий банк так не делает. Положи трубку и расскажи взрослым! 🛡️",
  },
  {
    id: "game-scam",
    title: "Бесплатная валюта в игре",
    category: "Фишинг (для детей и подростков)",
    triggerMessage: "🎮 ПОЗДРАВЛЯЕМ! Вы выиграли 10 000 V-Bucks! Перейдите по ссылке free-vbucks-generator.xyz и введите логин от аккаунта для получения приза!",
    triggerSender: "FortniteRewards",
    redFlags: [
      { label: "🎁 Приманка", explanation: "Обещание бесплатных наград — классическая ловушка" },
      { label: "🔗 Поддельная ссылка", explanation: "Домен .xyz не имеет отношения к настоящей игре" },
      { label: "🔑 Запрос логина", explanation: "Просят ввести данные аккаунта на стороннем сайте" },
    ],
    simulationPrompt: "Вы переходите по ссылке. Красивый сайт просит ввести логин и пароль от игрового аккаунта...",
    simulationTrap: "Ввести логин и пароль",
    lessonTitle: "Фишинг через игры",
    lessonText: "Бесплатная валюта в играх — это ВСЕГДА ловушка. Настоящие награды раздаются только внутри официальной игры или магазина. Никогда не вводите пароль на незнакомых сайтах.",
    elderlyLesson: "Если внук показывает сообщение о «бесплатном призе» в игре — это обман. Помогите ему понять: за настоящие призы не просят пароли.",
    childLesson: "Бесплатных V-Bucks не бывает! 🚫 Это ловушка, чтобы украсть твой аккаунт. Настоящие призы дают только в самой игре. Никогда не вводи пароль на незнакомых сайтах!",
  },
  {
    id: "deepfake-call",
    title: "Звонок от «родственника»",
    category: "Дипфейк-мошенничество",
    triggerMessage: "📞 Входящий звонок: голос, похожий на вашего внука/ребёнка: «Бабушка/мама! У меня авария, мне срочно нужны деньги! Переведи 50 000 на этот номер, потом всё объясню!»",
    triggerSender: "Неизвестный номер",
    redFlags: [
      { label: "😢 Эмоциональное давление", explanation: "Используют любовь к близким, чтобы отключить логику" },
      { label: "⏰ Срочность", explanation: "«Срочно», «прямо сейчас» — не дают времени проверить" },
      { label: "💸 Запрос денег", explanation: "Просят перевести деньги на незнакомый номер" },
    ],
    simulationPrompt: "Голос звучит очень похоже на вашего близкого. Он плачет и просит перевести деньги немедленно...",
    simulationTrap: "Перевести деньги",
    lessonTitle: "Дипфейк-атака",
    lessonText: "Современные технологии позволяют подделать любой голос. ВСЕГДА перезванивайте родственнику на его настоящий номер. Договоритесь о «семейном пароле» — секретном слове, которое знаете только вы.",
    elderlyLesson: "Даже если голос звучит как ваш внук — это может быть подделка. Положите трубку и перезвоните внуку сами. Придумайте секретное слово для семьи, которое мошенники не узнают.",
    childLesson: "Иногда плохие люди могут притвориться мамой или папой по телефону. Если кто-то просит деньги — сначала спроси у настоящих родителей лично! Придумайте семейное секретное слово 🤫",
  },
];

interface ScenarioSimulatorProps {
  userMode: "elderly" | "child";
}

const ScenarioSimulator = ({ userMode }: ScenarioSimulatorProps) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [step, setStep] = useState<SimStep>("trigger");
  const [breathCount, setBreathCount] = useState(0);
  const [userFell, setUserFell] = useState(false);
  const [revealedFlags, setRevealedFlags] = useState<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const { data: user } = useCurrentUser();
  const saveProgress = useSaveTrainingProgress();

  const resetSimulation = useCallback(() => {
    setSelectedScenario(null);
    setStep("trigger");
    setBreathCount(0);
    setUserFell(false);
    setRevealedFlags([]);
  }, []);

  // Breathing exercise auto-advance
  useEffect(() => {
    if (step === "breathing" && breathCount >= 3) {
      const timer = setTimeout(() => setStep("analysis"), 800);
      return () => clearTimeout(timer);
    }
  }, [step, breathCount]);

  const revealFlag = (idx: number) => {
    if (!revealedFlags.includes(idx)) {
      setRevealedFlags(prev => [...prev, idx]);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-foreground">
          🎓 Тренажёр безопасности
        </h3>
        <p className="text-center text-muted-foreground text-lg">
          {userMode === "elderly"
            ? "Потренируйтесь распознавать мошенников в безопасной среде"
            : "Научись распознавать обманщиков! Выбери сценарий 👇"}
        </p>

        <div className="space-y-3">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => { setSelectedScenario(sc); setStep("trigger"); }}
              className="touch-zone w-full rounded-2xl p-5 text-left bg-card hover:bg-muted transition-all duration-200 flex items-center gap-4"
              aria-label={`Начать сценарий: ${sc.title}`}
            >
              <AlertTriangle className="w-8 h-8 text-warning shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-foreground">{sc.title}</p>
                <p className="text-base text-muted-foreground">{sc.category}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground shrink-0" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">{selectedScenario.title}</h3>
        <button
          onClick={resetSimulation}
          className="touch-zone flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground"
          aria-label="Вернуться к списку сценариев"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          <span className="text-base font-semibold">Назад</span>
        </button>
      </div>

      {/* Step: Trigger */}
      {step === "trigger" && (
        <div className="space-y-4">
          <div className="status-danger rounded-2xl p-6 animate-pulse-glow">
            <p className="text-sm font-bold opacity-80 mb-2">{selectedScenario.triggerSender}</p>
            <p className="text-xl font-bold leading-relaxed">{selectedScenario.triggerMessage}</p>
          </div>

          <button
            onClick={() => setStep("breathing")}
            className="touch-zone w-full rounded-2xl p-5 bg-primary text-primary-foreground text-xl font-bold transition-all hover:opacity-90"
          >
            {userMode === "elderly" ? "🫁 Остановиться и подышать" : "🫁 Стоп! Сначала подышим"}
          </button>
        </div>
      )}

      {/* Step: Breathing */}
      {step === "breathing" && (
        <div className="space-y-4 text-center">
          <div className="bg-card rounded-2xl p-8">
            <Heart className="w-16 h-16 mx-auto text-danger mb-4 animate-pulse" aria-hidden="true" />
            <p className="text-xl font-bold text-foreground mb-2">
              {userMode === "elderly" ? "Сейчас вы можете чувствовать страх или спешку." : "Ты можешь испугаться — это нормально!"}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {userMode === "elderly" ? "Давайте сделаем 3 глубоких вдоха." : "Давай сделаем 3 вдоха вместе! 🌬️"}
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-500 ${
                    breathCount > i ? "bg-safe text-safe-foreground scale-110" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {breathCount > i ? "✓" : i + 1}
                </div>
              ))}
            </div>

            <button
              onClick={() => setBreathCount(prev => Math.min(prev + 1, 3))}
              disabled={breathCount >= 3}
              className="touch-zone px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-xl font-bold disabled:opacity-50 transition-all"
            >
              {breathCount >= 3 ? "Отлично! Переходим к анализу..." : "Вдох... Выдох... 🫁"}
            </button>
          </div>
        </div>
      )}

      {/* Step: Analysis */}
      {step === "analysis" && (
        <div className="space-y-4">
          <ThreatIndicator
            level="danger"
            message="Обнаружены красные флаги!"
            details={`Найдено ${selectedScenario.redFlags.length} признаков мошенничества`}
          />

          <div className="space-y-3">
            {selectedScenario.redFlags.map((flag, idx) => (
              <button
                key={idx}
                onClick={() => revealFlag(idx)}
                className={`touch-zone w-full rounded-2xl p-5 text-left transition-all duration-300 ${
                  revealedFlags.includes(idx) ? "bg-danger/10 border-2 border-danger" : "bg-card hover:bg-muted"
                }`}
                aria-label={`Показать красный флаг: ${flag.label}`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-danger shrink-0" aria-hidden="true" />
                  <p className="text-lg font-bold text-foreground">{flag.label}</p>
                </div>
                {revealedFlags.includes(idx) && (
                  <p className="text-base text-muted-foreground mt-2 pl-9">{flag.explanation}</p>
                )}
              </button>
            ))}
          </div>

          {revealedFlags.length === selectedScenario.redFlags.length && (
            <button
              onClick={() => setStep("simulation")}
              className="touch-zone w-full rounded-2xl p-5 bg-warning text-warning-foreground text-xl font-bold transition-all hover:opacity-90"
            >
              ⚡ Перейти к симуляции
            </button>
          )}
        </div>
      )}

      {/* Step: Simulation */}
      {step === "simulation" && (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-6">
            <Phone className="w-10 h-10 text-warning mx-auto mb-3" aria-hidden="true" />
            <p className="text-xl leading-relaxed text-foreground text-center">
              {selectedScenario.simulationPrompt}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => {
                setUserFell(true);
                setStep("lesson");
                if (user && selectedScenario) {
                  saveProgress.mutate({
                    user_id: user.id,
                    scenario_id: selectedScenario.id,
                    user_fell_for_trap: true,
                    user_mode: userMode,
                    time_spent_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
                  });
                }
              }}
              className="touch-zone w-full rounded-2xl p-5 bg-danger text-danger-foreground text-xl font-bold transition-all hover:opacity-90"
            >
              {selectedScenario.simulationTrap}
            </button>
            <button
              onClick={() => {
                setUserFell(false);
                setStep("lesson");
                if (user && selectedScenario) {
                  saveProgress.mutate({
                    user_id: user.id,
                    scenario_id: selectedScenario.id,
                    user_fell_for_trap: false,
                    user_mode: userMode,
                    time_spent_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
                  });
                }
              }}
              className="touch-zone w-full rounded-2xl p-5 bg-safe text-safe-foreground text-xl font-bold transition-all hover:opacity-90"
            >
              🚫 Отказаться и положить трубку
            </button>
          </div>
        </div>
      )}

      {/* Step: Lesson */}
      {step === "lesson" && (
        <div className="space-y-4">
          <ThreatIndicator
            level={userFell ? "danger" : "safe"}
            message={userFell ? "Вы попались на уловку!" : "Отлично! Вы распознали обман!"}
            details={userFell
              ? "Но не волнуйтесь — это тренировка. Теперь вы будете знать."
              : "Вы правильно поступили, отказавшись выполнять требования."}
          />

          <div className="bg-card rounded-2xl p-6">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" aria-hidden="true" />
            <p className="text-lg font-bold text-foreground mb-3 text-center">
              📚 {selectedScenario.lessonTitle}
            </p>
            <p className="text-xl leading-relaxed text-foreground">
              {userMode === "elderly" ? selectedScenario.elderlyLesson : selectedScenario.childLesson}
            </p>
          </div>

          <button
            onClick={resetSimulation}
            className="touch-zone w-full rounded-2xl p-5 bg-primary text-primary-foreground text-xl font-bold transition-all hover:opacity-90"
          >
            🔄 Попробовать другой сценарий
          </button>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
