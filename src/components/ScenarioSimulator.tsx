import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Phone, Shield, Heart, ChevronRight, RotateCcw, Eye } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import { useCurrentUser, useSaveTrainingProgress } from "@/hooks/useDatabase";
import type { Locale, Translations } from "@/lib/i18n";

type SimStep = "trigger" | "breathing" | "analysis" | "simulation" | "lesson";

interface ScenarioOption {
  id: string;
  label_en: string;
  label_ru: string;
  is_correct: boolean;
  feedback_en: string;
  feedback_ru: string;
}

interface Scenario {
  id: string;
  title_en: string;
  title_ru: string;
  category_en: string;
  category_ru: string;
  triggerMessage_en: string;
  triggerMessage_ru: string;
  triggerSender: string;
  redFlags: { label_en: string; label_ru: string; explanation_en: string; explanation_ru: string }[];
  options: ScenarioOption[];
  lesson_en: string;
  lesson_ru: string;
  elderlyLesson_en: string;
  elderlyLesson_ru: string;
  childLesson_en: string;
  childLesson_ru: string;
  targetGroup: ("elderly" | "child")[];
}

const scenarios: Scenario[] = [
  {
    id: "bank-alert",
    title_en: 'The "Frozen Account" Call',
    title_ru: "Срочное уведомление от банка",
    category_en: "Vishing (voice phishing)",
    category_ru: "Вишинг (голосовой фишинг)",
    triggerMessage_en: '📞 Incoming call: "Security Department — Your Bank"\n\n"Hello, this is the Security Department. We have detected suspicious activity on your account. Your card will be frozen in 10 minutes unless you verify your identity now. Please provide your card number and PIN."',
    triggerMessage_ru: "⚠️ ВНИМАНИЕ: Обнаружен несанкционированный перевод 150 000 ₽ с вашего счёта. Срочно позвоните по номеру 8-800-XXX-XXXX для блокировки!",
    triggerSender: "Security Dept / Служба безопасности",
    redFlags: [
      { label_en: "⏰ Urgency", label_ru: "⏰ Срочность", explanation_en: "The text forces a split-second decision", explanation_ru: "Текст заставляет действовать немедленно" },
      { label_en: "😨 Fear", label_ru: "😨 Страх", explanation_en: "Uses a large amount to trigger panic", explanation_ru: "Крупная сумма вызывает панику" },
      { label_en: "📞 Unknown number", label_ru: "📞 Неизвестный номер", explanation_en: "A real bank never sends a callback number via SMS", explanation_ru: "Настоящий банк никогда не присылает номер для звонка" },
    ],
    options: [
      { id: "a", label_en: "Give them my card and PIN", label_ru: "Назвать ПИН-код", is_correct: false, feedback_en: "A real bank NEVER asks for your PIN over the phone.", feedback_ru: "Настоящий банк НИКОГДА не просит ПИН-код по телефону." },
      { id: "b", label_en: "Hang up and call my card's number", label_ru: "Положить трубку и перезвонить", is_correct: true, feedback_en: "Correct! Always call the official number from your card.", feedback_ru: "Правильно! Перезвоните по номеру с обратной стороны карты." },
      { id: "c", label_en: "Ask them to prove identity", label_ru: "Попросить доказательства", is_correct: false, feedback_en: "Scammers can fake proof. The only safe action is to hang up.", feedback_ru: "Мошенники умеют подделывать доказательства. Положите трубку." },
    ],
    lesson_en: "Banks never ask for PINs by phone. Urgency is a scam signal.",
    lesson_ru: "Банки НИКОГДА не просят ПИН-код по телефону. Срочность — признак мошенничества.",
    elderlyLesson_en: "Remember one rule: a real bank NEVER calls asking for your secret code. Hang up.",
    elderlyLesson_ru: "Запомните: настоящий банк НИКОГДА не звонит и не просит назвать ваш секретный код. Положите трубку.",
    childLesson_en: "If someone on the phone asks for a secret code — it's a trap! Hang up and tell an adult! 🛡️",
    childLesson_ru: "Если кто-то по телефону просит секретный код — это ловушка! Положи трубку и расскажи взрослым! 🛡️",
    targetGroup: ["elderly", "child"],
  },
  {
    id: "game-scam",
    title_en: "The Free V-Bucks Offer",
    title_ru: "Бесплатная валюта в игре",
    category_en: "Smishing (for children)",
    category_ru: "Фишинг (для детей и подростков)",
    triggerMessage_en: '📱 DM from "FortniteSupport_Official":\n\n"🎉 CONGRATULATIONS! You have been selected for 10,000 FREE V-Bucks! Click: bit.ly/vbucks-free999\n\nExpires in 30 MINUTES! Share your login to activate."',
    triggerMessage_ru: "🎮 ПОЗДРАВЛЯЕМ! Вы выиграли 10 000 V-Bucks! Перейдите по ссылке free-vbucks-generator.xyz и введите логин!",
    triggerSender: "FortniteRewards",
    redFlags: [
      { label_en: "🎁 Bait", label_ru: "🎁 Приманка", explanation_en: "Free reward promises are classic traps", explanation_ru: "Обещание бесплатных наград — ловушка" },
      { label_en: "🔗 Fake link", label_ru: "🔗 Поддельная ссылка", explanation_en: "Domain .xyz has nothing to do with the real game", explanation_ru: "Домен .xyz не связан с настоящей игрой" },
      { label_en: "🔑 Login request", label_ru: "🔑 Запрос логина", explanation_en: "Asks for account credentials on a third-party site", explanation_ru: "Просят ввести данные на стороннем сайте" },
    ],
    options: [
      { id: "a", label_en: "Click and enter my login", label_ru: "Ввести логин и пароль", is_correct: false, feedback_en: "This will steal your account! Official games NEVER give free currency through DMs.", feedback_ru: "Это украдёт аккаунт! Игры НИКОГДА не дают валюту через сообщения." },
      { id: "b", label_en: "Ignore and report", label_ru: "Игнорировать и пожаловаться", is_correct: true, feedback_en: "Perfect! Free currency via DM is always a scam.", feedback_ru: "Отлично! Бесплатная валюта через сообщения — всегда мошенничество." },
      { id: "c", label_en: "Ask a friend if it's real", label_ru: "Спросить друга", is_correct: false, feedback_en: "Better than clicking, but safest to just ignore and report.", feedback_ru: "Лучше, чем нажать, но безопаснее — просто проигнорировать." },
    ],
    lesson_en: "If something online is free AND urgent AND needs your login — it's a scam. 100%.",
    lesson_ru: "Если что-то бесплатно И срочно И требует логин — это мошенничество. Всегда.",
    elderlyLesson_en: "If a grandchild shows a message about a 'free prize' in a game — it's a scam.",
    elderlyLesson_ru: "Если внук показывает сообщение о «бесплатном призе» в игре — это обман.",
    childLesson_en: "Free V-Bucks don't exist! 🚫 Real prizes only come inside the actual game.",
    childLesson_ru: "Бесплатных V-Bucks не бывает! 🚫 Настоящие призы дают только в самой игре!",
    targetGroup: ["elderly", "child"],
  },
  {
    id: "health-scam",
    title_en: 'The "Health Alert" Email',
    title_ru: "Звонок от «родственника»",
    category_en: "Phishing (health scam)",
    category_ru: "Дипфейк-мошенничество",
    triggerMessage_en: '📧 From: health-alert@eurohealth-notifications.net\nSubject: URGENT: Your booster appointment\n\n"Dear resident, CONFIRM YOUR SLOT by clicking below and entering your health ID and date of birth."',
    triggerMessage_ru: "📞 Голос, похожий на вашего внука: «Бабушка! У меня авария, мне срочно нужны деньги! Переведи 50 000 на этот номер!»",
    triggerSender: "Unknown / Неизвестный",
    redFlags: [
      { label_en: "😢 Emotional pressure", label_ru: "😢 Эмоциональное давление", explanation_en: "Uses love for family to bypass logic", explanation_ru: "Используют любовь к близким" },
      { label_en: "⏰ Urgency", label_ru: "⏰ Срочность", explanation_en: "'Right now' — no time to verify", explanation_ru: "«Срочно» — не дают проверить" },
      { label_en: "💸 Money request", label_ru: "💸 Запрос денег", explanation_en: "Asks to transfer money to unknown number", explanation_ru: "Просят перевести деньги на незнакомый номер" },
    ],
    options: [
      { id: "a", label_en: "Send money immediately", label_ru: "Перевести деньги", is_correct: false, feedback_en: "Modern tech can fake any voice. ALWAYS call back on a saved number.", feedback_ru: "Современные технологии позволяют подделать голос. ВСЕГДА перезванивайте сами." },
      { id: "b", label_en: "Hang up, call them directly", label_ru: "Положить трубку и перезвонить", is_correct: true, feedback_en: "Correct! Always verify by calling them on their saved number.", feedback_ru: "Правильно! Перезвоните родственнику на его настоящий номер." },
      { id: "c", label_en: "Ask for more details", label_ru: "Попросить подробности", is_correct: false, feedback_en: "Scammers are prepared for this. Hang up and call back yourself.", feedback_ru: "Мошенники к этому готовы. Положите трубку и перезвоните сами." },
    ],
    lesson_en: "Modern tech can fake any voice. ALWAYS call back on a saved number. Create a family password.",
    lesson_ru: "Современные технологии подделывают любой голос. ВСЕГДА перезванивайте сами. Придумайте семейный пароль.",
    elderlyLesson_en: "Even if the voice sounds like your grandchild — it can be faked. Hang up and call them yourself.",
    elderlyLesson_ru: "Даже если голос звучит как ваш внук — это может быть подделка. Положите трубку и перезвоните внуку сами.",
    childLesson_en: "Bad people can pretend to be mom or dad on the phone. If someone asks for money — check with real parents first! 🤫",
    childLesson_ru: "Плохие люди могут притвориться мамой или папой по телефону. Если просят деньги — спроси у настоящих родителей! 🤫",
    targetGroup: ["elderly", "child"],
  },
];

interface ScenarioSimulatorProps {
  userMode: "elderly" | "child";
  locale: Locale;
  t: Translations;
}

const ScenarioSimulator = ({ userMode, locale, t }: ScenarioSimulatorProps) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [step, setStep] = useState<SimStep>("trigger");
  const [breathCount, setBreathCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [revealedFlags, setRevealedFlags] = useState<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const { data: user } = useCurrentUser();
  const saveProgress = useSaveTrainingProgress();

  const l = (en: string, ru: string) => locale === "ru" ? ru : en;

  const resetSimulation = useCallback(() => {
    setSelectedScenario(null);
    setStep("trigger");
    setBreathCount(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setRevealedFlags([]);
  }, []);

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

  const handleOptionSelect = (option: ScenarioOption) => {
    setSelectedOption(option);
    setShowFeedback(true);

    if (user && selectedScenario) {
      saveProgress.mutate({
        user_id: user.id,
        scenario_id: selectedScenario.id,
        user_fell_for_trap: !option.is_correct,
        user_mode: userMode,
        time_spent_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    }
  };

  const filtered = scenarios.filter(s => s.targetGroup.includes(userMode));

  // Scenario picker
  if (!selectedScenario) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-foreground">
          {t.trainingTitle}
        </h3>
        <p className="text-center text-muted-foreground text-lg">
          {userMode === "elderly" ? t.trainingSubElderly : t.trainingSubChild}
        </p>

        <div className="space-y-3">
          {filtered.map(sc => (
            <button
              key={sc.id}
              onClick={() => { setSelectedScenario(sc); setStep("trigger"); startTimeRef.current = Date.now(); }}
              className="touch-zone w-full rounded-2xl p-5 text-left bg-card hover:bg-muted transition-all duration-200 flex items-center gap-4"
              aria-label={l(sc.title_en, sc.title_ru)}
            >
              <AlertTriangle className="w-8 h-8 text-warning shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-foreground">{l(sc.title_en, sc.title_ru)}</p>
                <p className="text-base text-muted-foreground">{l(sc.category_en, sc.category_ru)}</p>
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
        <h3 className="text-xl font-bold text-foreground">{l(selectedScenario.title_en, selectedScenario.title_ru)}</h3>
        <button
          onClick={resetSimulation}
          className="touch-zone flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          <span className="text-base font-semibold">{t.back}</span>
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center">
        {(["trigger", "breathing", "analysis", "simulation", "lesson"] as SimStep[]).map((s, i) => (
          <div key={s} className={`w-3 h-3 rounded-full transition-all ${
            s === step ? "bg-primary scale-125" :
            (["trigger","breathing","analysis","simulation","lesson"].indexOf(step) > i) ? "bg-safe" : "bg-border"
          }`} />
        ))}
      </div>

      {/* Step: Trigger */}
      {step === "trigger" && (
        <div className="space-y-4">
          <div className="status-danger rounded-2xl p-6 animate-pulse-glow">
            <p className="text-sm font-bold opacity-80 mb-2">{selectedScenario.triggerSender}</p>
            <p className="text-xl font-bold leading-relaxed whitespace-pre-line">
              {l(selectedScenario.triggerMessage_en, selectedScenario.triggerMessage_ru)}
            </p>
          </div>
          <button
            onClick={() => setStep("breathing")}
            className="touch-zone w-full rounded-2xl p-5 bg-primary text-primary-foreground text-xl font-bold transition-all hover:opacity-90"
          >
            {userMode === "elderly" ? `🫁 ${t.breatheTitle}` : `🫁 ${t.breatheTitle}`}
          </button>
        </div>
      )}

      {/* Step: Breathing */}
      {step === "breathing" && (
        <div className="space-y-4 text-center">
          <div className="bg-card rounded-2xl p-8">
            <Heart className="w-16 h-16 mx-auto text-danger mb-4 animate-pulse" aria-hidden="true" />
            <p className="text-xl font-bold text-foreground mb-2">
              {userMode === "elderly" ? t.breatheSubElderly : t.breatheSubChild}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {userMode === "elderly" ? t.breatheInstructionElderly : t.breatheInstructionChild}
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
              {breathCount >= 3 ? t.breatheDone : t.breatheBtn}
            </button>
          </div>
        </div>
      )}

      {/* Step: Analysis */}
      {step === "analysis" && (
        <div className="space-y-4">
          <ThreatIndicator
            level="danger"
            message={t.redFlagsFound}
            details={t.redFlagsCount(selectedScenario.redFlags.length)}
            locale={locale}
          />
          <div className="space-y-3">
            {selectedScenario.redFlags.map((flag, idx) => (
              <button
                key={idx}
                onClick={() => revealFlag(idx)}
                className={`touch-zone w-full rounded-2xl p-5 text-left transition-all duration-300 ${
                  revealedFlags.includes(idx) ? "bg-danger/10 border-2 border-danger" : "bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-danger shrink-0" aria-hidden="true" />
                  <p className="text-lg font-bold text-foreground">{l(flag.label_en, flag.label_ru)}</p>
                </div>
                {revealedFlags.includes(idx) && (
                  <p className="text-base text-muted-foreground mt-2 pl-9">{l(flag.explanation_en, flag.explanation_ru)}</p>
                )}
              </button>
            ))}
          </div>

          {revealedFlags.length === selectedScenario.redFlags.length && (
            <button
              onClick={() => setStep("simulation")}
              className="touch-zone w-full rounded-2xl p-5 bg-warning text-warning-foreground text-xl font-bold transition-all hover:opacity-90"
            >
              {t.goToSimulation}
            </button>
          )}
        </div>
      )}

      {/* Step: Simulation — Choice */}
      {step === "simulation" && (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-6">
            <Phone className="w-10 h-10 text-warning mx-auto mb-3" aria-hidden="true" />
            <p className="text-xl leading-relaxed text-foreground text-center font-semibold">
              {t.whatDoYouDo}
            </p>
          </div>

          <div className="space-y-3">
            {selectedScenario.options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt)}
                disabled={showFeedback}
                className={`touch-zone w-full rounded-2xl p-5 text-left text-lg font-bold transition-all duration-300 ${
                  showFeedback && selectedOption?.id === opt.id
                    ? opt.is_correct ? "bg-safe text-safe-foreground" : "bg-danger text-danger-foreground"
                    : showFeedback && opt.is_correct
                    ? "bg-safe/20 border-2 border-safe"
                    : "bg-card hover:bg-muted disabled:opacity-60"
                }`}
              >
                <span>{l(opt.label_en, opt.label_ru)}</span>
                {showFeedback && selectedOption?.id === opt.id && (
                  <p className="text-base font-normal mt-2 opacity-90">
                    {l(opt.feedback_en, opt.feedback_ru)}
                  </p>
                )}
              </button>
            ))}
          </div>

          {showFeedback && (
            <button
              onClick={() => setStep("lesson")}
              className="touch-zone w-full rounded-2xl p-5 bg-primary text-primary-foreground text-xl font-bold"
            >
              {selectedOption?.is_correct ? "→" : "→"} {locale === "ru" ? "Далее" : "Next"}
            </button>
          )}
        </div>
      )}

      {/* Step: Lesson */}
      {step === "lesson" && (
        <div className="space-y-4">
          <ThreatIndicator
            level={selectedOption?.is_correct ? "safe" : "danger"}
            message={selectedOption?.is_correct ? t.passedTest : t.fellForTrap}
            details={selectedOption?.is_correct ? t.passedTestDetail : t.fellForTrapDetail}
            locale={locale}
          />

          <div className="bg-card rounded-2xl p-6">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" aria-hidden="true" />
            <p className="text-xl leading-relaxed text-foreground">
              {userMode === "elderly"
                ? l(selectedScenario.elderlyLesson_en, selectedScenario.elderlyLesson_ru)
                : l(selectedScenario.childLesson_en, selectedScenario.childLesson_ru)}
            </p>
          </div>

          <button
            onClick={resetSimulation}
            className="touch-zone w-full rounded-2xl p-5 bg-primary text-primary-foreground text-xl font-bold"
          >
            🔄 {t.tryAnother}
          </button>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
