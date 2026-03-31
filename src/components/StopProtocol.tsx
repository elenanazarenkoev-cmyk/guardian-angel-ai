import { useState } from "react";
import { Pause, Search, Eye, Lock, CheckCircle, ChevronDown } from "lucide-react";
import type { Locale, Translations } from "@/lib/i18n";

interface StopStep {
  letter: string;
  color: string;
  icon: React.ElementType;
  title_en: string;
  title_ru: string;
  text_en: string;
  text_ru: string;
  elderlyText_en: string;
  elderlyText_ru: string;
  childText_en: string;
  childText_ru: string;
  actions_en: string[];
  actions_ru: string[];
  emergency_en: string;
  emergency_ru: string;
}

const stopSteps: StopStep[] = [
  {
    letter: "S",
    color: "hsl(var(--safe))",
    icon: Pause,
    title_en: "Slow Down",
    title_ru: "Остановись",
    text_en: "Any message saying 'act NOW' is almost always a scam. Take 30 seconds before doing anything.",
    text_ru: "Любое сообщение «сделайте СЕЙЧАС» — почти всегда мошенничество. Подождите 30 секунд.",
    elderlyText_en: "Scammers rush you so you can't think. If someone says 'right now' or 'urgent' — it's a scam signal. Say 'I'll call back later' and hang up.",
    elderlyText_ru: "Мошенники торопят вас, чтобы вы не успели подумать. Если кто-то говорит «прямо сейчас» — это обман. Скажите «Я перезвоню» и положите трубку.",
    childText_en: "If someone rushes you — STOP! 🛑 Real friends don't get angry if you wait.",
    childText_ru: "Если кто-то торопит тебя — СТОП! 🛑 Настоящие друзья не будут злиться.",
    actions_en: ["Don't rush your response", "Say 'I'll think about it'", "Hang up if pressured"],
    actions_ru: ["Не торопитесь с ответом", "Скажите «Я подумаю»", "Положите трубку если давят"],
    emergency_en: "Breathe. You have time. The real danger is acting too fast.",
    emergency_ru: "Дышите. У вас есть время. Настоящая опасность — действовать слишком быстро.",
  },
  {
    letter: "T",
    color: "hsl(var(--primary))",
    icon: Search,
    title_en: "Think & Trace",
    title_ru: "Проверь",
    text_en: "Check the real email address or phone number — not just the display name.",
    text_ru: "Проверьте реальный адрес или номер — не только отображаемое имя.",
    elderlyText_en: "Check who is really calling. Look at the real phone number. If 'your grandchild is in trouble' — call them back on a saved number.",
    elderlyText_ru: "Проверьте, кто на самом деле звонит. Если «звонит внук» — перезвоните ему по сохранённому номеру.",
    childText_en: "Check who actually wrote! 🔍 The name can be fake, but the real address can't.",
    childText_ru: "Посмотри, кто на самом деле написал! 🔍 Имя может быть любым.",
    actions_en: ["Check real sender address", "Call back on saved number", "Don't trust display names"],
    actions_ru: ["Проверьте реальный адрес", "Перезвоните по сохранённому номеру", "Не доверяйте имени отправителя"],
    emergency_en: "If in doubt, find the official contact yourself.",
    emergency_ru: "Если сомневаетесь, найдите официальный контакт сами.",
  },
  {
    letter: "O",
    color: "hsl(var(--warning))",
    icon: Eye,
    title_en: "Observe Emotions",
    title_ru: "Оцени эмоции",
    text_en: "Ask: 'Am I feeling sudden fear, excitement, or guilt?' These emotions are the scammer's tools.",
    text_ru: "Спросите себя: «Я испуган? Взволнован?» Эти эмоции — оружие мошенников.",
    elderlyText_en: "Ask yourself: 'Am I scared? Excited? Feeling guilty?' These emotions are the scammer's main weapon.",
    elderlyText_ru: "Спросите себя: «Я сейчас испуган? Чувствую вину?» Эти эмоции — главное оружие мошенников.",
    childText_en: "Ask yourself: 'Am I scared? Do I really want this prize?' 🤔 If yes — someone might be tricking you!",
    childText_ru: "Спроси себя: «Мне страшно? Я очень хочу приз?» 🤔 Если да — тебя пытаются обмануть!",
    actions_en: ["Identify your emotion: fear, greed, guilt?", "Strong emotions = danger signal", "Pause and breathe"],
    actions_ru: ["Определите эмоцию: страх, жадность, вина?", "Сильные эмоции = сигнал опасности", "Возьмите паузу, подышите"],
    emergency_en: "High emotion = high scam risk. The stronger you feel, the more careful you should be.",
    emergency_ru: "Сильные эмоции = высокий риск. Чем сильнее чувствуете — тем осторожнее нужно быть.",
  },
  {
    letter: "P",
    color: "hsl(var(--danger))",
    icon: Lock,
    title_en: "Private stays Private",
    title_ru: "Защити данные",
    text_en: "NEVER share passwords, PINs, OTP codes, or card numbers. No legitimate company asks for these.",
    text_ru: "НИКОГДА не сообщайте пароли, ПИН-коды, SMS-коды или номера карт.",
    elderlyText_en: "NEVER share passwords, PINs, or SMS codes. No bank, police, or government agency has the right to ask for them.",
    elderlyText_ru: "НИКОГДА не называйте пароли, ПИН-коды, SMS-коды. Ни банк, ни полиция — никто не имеет права их спрашивать.",
    childText_en: "Passwords and codes are a SECRET! 🔐 Never tell anyone — not in a game, not on the phone. Tell your parents!",
    childText_ru: "Пароли и коды — это СЕКРЕТ! 🔐 Никому не говори. Расскажи родителям!",
    actions_en: ["Never share passwords or codes", "Bank NEVER asks for PIN", "Any data request = scammer"],
    actions_ru: ["Никогда не сообщайте пароли", "Банк НИКОГДА не просит ПИН-код", "Запрос данных = мошенник"],
    emergency_en: "If already shared: freeze accounts NOW and change passwords immediately.",
    emergency_ru: "Если уже сказали: немедленно заблокируйте счета и смените пароли.",
  },
];

const IMMEDIATE_ACTIONS = {
  en: [
    { icon: "🏦", text: "Freeze your bank accounts via the official app or card number." },
    { icon: "🔑", text: "Change passwords on email and financial apps." },
    { icon: "📋", text: "Report to your national cybercrime unit." },
    { icon: "📞", text: "Tell a trusted person what happened." },
  ],
  ru: [
    { icon: "🏦", text: "Заблокируйте счета через официальное приложение или по номеру на карте." },
    { icon: "🔑", text: "Смените пароли в почте и финансовых приложениях." },
    { icon: "📋", text: "Сообщите в службу киберпреступлений вашей страны." },
    { icon: "📞", text: "Расскажите доверенному человеку." },
  ],
};

interface StopProtocolProps {
  userMode: "elderly" | "child" | "adult";
  locale: Locale;
  t: Translations;
}

const StopProtocol = ({ userMode, locale, t }: StopProtocolProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const l = (en: string, ru: string) => locale === "ru" ? ru : en;

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
        {t.stopTitle}
      </h3>
      <p className="text-center text-lg text-muted-foreground">
        {userMode === "elderly" ? t.stopSubElderly : t.stopSubChild}
      </p>

      <div className="space-y-3">
        {stopSteps.map((s, idx) => {
          const Icon = s.icon;
          const isExpanded = expandedStep === idx;
          const isComplete = completedSteps.includes(idx);

          return (
            <div key={idx} className={`rounded-2xl overflow-hidden border-2 transition-colors ${
              isExpanded ? "border-primary" : isComplete ? "border-safe/50" : "border-border"
            }`}>
              <button
                onClick={() => toggleStep(idx)}
                className={`touch-zone w-full p-5 text-left flex items-center gap-4 transition-all duration-200 ${
                  isComplete ? "bg-safe/10" : "bg-card hover:bg-muted"
                }`}
                aria-expanded={isExpanded}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0 text-primary-foreground"
                  style={{ backgroundColor: isComplete ? "hsl(var(--safe))" : s.color }}
                >
                  {isComplete ? "✓" : s.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground">{l(s.title_en, s.title_ru)}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{l(s.text_en, s.text_ru)}</p>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="bg-card px-5 pb-5 space-y-4 border-t border-border">
                  <div className="flex items-start gap-3 pt-4">
                    <Icon className="w-8 h-8 text-primary shrink-0 mt-1" aria-hidden="true" />
                    <p className="text-lg leading-relaxed text-foreground">
                      {userMode === "elderly" ? l(s.elderlyText_en, s.elderlyText_ru) : l(s.childText_en, s.childText_ru)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {(locale === "ru" ? s.actions_ru : s.actions_en).map((action, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3">
                        <CheckCircle className="w-5 h-5 text-safe shrink-0" aria-hidden="true" />
                        <p className="text-base text-foreground">{action}</p>
                      </div>
                    ))}
                  </div>

                  {/* Emergency note */}
                  <div className="rounded-xl p-4 border-2 border-dashed border-warning/50 bg-warning/5">
                    <p className="text-base font-semibold text-warning">
                      ⚡ {l(s.emergency_en, s.emergency_ru)}
                    </p>
                  </div>

                  {!isComplete && (
                    <button
                      onClick={() => markComplete(idx)}
                      className="touch-zone w-full rounded-xl p-4 bg-primary text-primary-foreground text-lg font-bold transition-all hover:opacity-90"
                    >
                      {t.understood}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Already scammed? */}
      <div className="rounded-2xl border-2 border-warning bg-warning/5 p-5 space-y-3">
        <p className="text-lg font-bold text-warning">
          {t.alreadyScammed}
        </p>
        {IMMEDIATE_ACTIONS[locale].map((action, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xl">{action.icon}</span>
            <p className="text-base text-foreground leading-relaxed">{action.text}</p>
          </div>
        ))}
      </div>

      {allComplete && (
        <div className="status-safe rounded-2xl p-6 text-center">
          <p className="text-2xl font-bold mb-2">{t.stopComplete}</p>
          <p className="text-lg">
            {userMode === "elderly" ? t.stopCompleteElderly : t.stopCompleteChild}
          </p>
        </div>
      )}
    </div>
  );
};

export default StopProtocol;
