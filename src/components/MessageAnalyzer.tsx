import { useState } from "react";
import { Search, Mail, MessageSquare, Phone } from "lucide-react";
import ThreatIndicator from "./ThreatIndicator";
import SafeTouchButton from "./SafeTouchButton";

type ThreatLevel = "safe" | "warning" | "danger";

interface AnalysisResult {
  level: ThreatLevel;
  message: string;
  details: string;
  elderlyExplanation: string;
  childExplanation: string;
}

const sampleMessages = [
  {
    type: "sms" as const,
    icon: MessageSquare,
    sender: "+7-900-XXX-XX-XX",
    text: "Ваша карта заблокирована! Срочно перейдите по ссылке bank-security-check.xyz для разблокировки",
  },
  {
    type: "email" as const,
    icon: Mail,
    sender: "support@biink-safety.com",
    text: "Уважаемый клиент! Вы выиграли 500 000 рублей. Для получения приза отправьте код подтверждения.",
  },
  {
    type: "call" as const,
    icon: Phone,
    sender: "+7-495-XXX-XX-XX",
    text: "Звонок: 'Здравствуйте, это служба безопасности вашего банка. На ваш счёт зафиксирован несанкционированный перевод...'",
  },
  {
    type: "sms" as const,
    icon: MessageSquare,
    sender: "Мама",
    text: "Привет! Забери молоко из магазина по дороге домой 🥛",
  },
];

function analyzeMessage(text: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  const urgencyWords = ["срочно", "немедленно", "заблокирован", "последний шанс"];
  const greedWords = ["выиграли", "приз", "бесплатно", "подарок"];
  const codeWords = ["код", "пароль", "пин", "cvv", "подтверждение"];
  const linkPattern = /\b[\w-]+\.(xyz|tk|ml|ga|cf|click|buzz)\b/i;

  const urgency = urgencyWords.some(w => lowerText.includes(w));
  const greed = greedWords.some(w => lowerText.includes(w));
  const codeRequest = codeWords.some(w => lowerText.includes(w));
  const suspiciousLink = linkPattern.test(text);

  const score = (urgency ? 3 : 0) + (greed ? 2 : 0) + (codeRequest ? 3 : 0) + (suspiciousLink ? 4 : 0);

  if (score >= 5) {
    return {
      level: "danger",
      message: "Это мошенничество!",
      details: `Обнаружено: ${[
        urgency && "давление срочностью",
        greed && "приманка выигрышем",
        codeRequest && "запрос секретного кода",
        suspiciousLink && "поддельная ссылка",
      ].filter(Boolean).join(", ")}`,
      elderlyExplanation: "Это обманщики. Они хотят украсть ваши деньги. Не отвечайте и не нажимайте ни на что. Я уже предупредил вашего близкого.",
      childExplanation: "Это плохие люди! Они врут и хотят обмануть. Не трогай это сообщение. Покажи маме или папе!",
    };
  } else if (score >= 2) {
    return {
      level: "warning",
      message: "Есть подозрения",
      details: `Замечено: ${[
        urgency && "торопят с решением",
        greed && "обещают что-то бесплатно",
        codeRequest && "просят личные данные",
      ].filter(Boolean).join(", ")}`,
      elderlyExplanation: "Это сообщение вызывает сомнения. Лучше не отвечайте. Давайте вместе проверим — спросите у близкого человека.",
      childExplanation: "Хмм, это сообщение какое-то странное. Лучше спроси у взрослого, прежде чем что-то делать.",
    };
  }
  return {
    level: "safe",
    message: "Всё в порядке",
    details: "Подозрительных признаков не обнаружено.",
    elderlyExplanation: "Это обычное безопасное сообщение. Можете спокойно его прочитать.",
    childExplanation: "Всё хорошо! Это обычное сообщение. 😊",
  };
}

interface MessageAnalyzerProps {
  userMode: "elderly" | "child";
}

const MessageAnalyzer = ({ userMode }: MessageAnalyzerProps) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (idx: number) => {
    setSelectedIdx(idx);
    setResult(analyzeMessage(sampleMessages[idx].text));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-center text-foreground">
        📬 Входящие сообщения
      </h3>

      <div className="space-y-3">
        {sampleMessages.map((msg, idx) => {
          const Icon = msg.icon;
          const isSelected = selectedIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => handleAnalyze(idx)}
              className={`touch-zone w-full rounded-2xl p-5 text-left flex items-start gap-4
                transition-all duration-200 select-none
                ${isSelected ? "ring-4 ring-primary bg-muted" : "bg-card hover:bg-muted"}`}
              aria-label={`Проверить сообщение от ${msg.sender}`}
            >
              <Icon className="w-8 h-8 mt-1 text-muted-foreground shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground">{msg.sender}</p>
                <p className="text-base text-muted-foreground line-clamp-2">{msg.text}</p>
              </div>
              <Search className="w-6 h-6 text-muted-foreground shrink-0 mt-2" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {result && (
        <div className="space-y-4 mt-6">
          <ThreatIndicator level={result.level} message={result.message} details={result.details} />

          <div className="bg-card rounded-2xl p-6">
            <p className="text-lg font-semibold text-foreground mb-2">
              {userMode === "elderly" ? "👴 Объяснение:" : "👧 Объяснение:"}
            </p>
            <p className="text-xl leading-relaxed text-foreground">
              {userMode === "elderly" ? result.elderlyExplanation : result.childExplanation}
            </p>
          </div>

          {result.level === "danger" && (
            <div className="grid grid-cols-1 gap-3">
              <SafeTouchButton
                label="🚫 ЗАБЛОКИРОВАТЬ"
                variant="danger"
                onConfirm={() => {}}
              />
              <SafeTouchButton
                label="📞 ПОЗВОНИТЬ БЛИЗКОМУ"
                variant="primary"
                onConfirm={() => {}}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageAnalyzer;
