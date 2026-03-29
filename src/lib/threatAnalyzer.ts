// SafeGuard AI — Local threat analysis engine
// Zero-knowledge: raw content never leaves the device

export type ThreatVerdict = "safe" | "warning" | "danger";
export type SourceType = "sms" | "email" | "call" | "web";

export interface ThreatFlag {
  key: string;
  label_en: string;
  label_ru: string;
  severity: "low" | "medium" | "high";
}

export interface AnalysisResult {
  verdict: ThreatVerdict;
  score: number;
  flags: ThreatFlag[];
  explanation_en: string;
  explanation_ru: string;
  elderlyExplanation_en: string;
  elderlyExplanation_ru: string;
  childExplanation_en: string;
  childExplanation_ru: string;
}

// Pattern libraries (EN + RU)
const URGENCY_PATTERNS = [
  /\b(urgent|immediately|right now|act now|expires|last chance|limited time)\b/i,
  /\b(срочно|немедленно|заблокирован|последний шанс|ограничен)/i,
];
const FEAR_PATTERNS = [
  /\b(suspended|blocked|locked|arrested|warrant|virus|compromised|unusual activity)\b/i,
  /\b(заблокирован|арест|вирус|подозрительн|несанкционированн)/i,
];
const MONEY_PATTERNS = [
  /\b(transfer|send|wire|bitcoin|gift card|payment|refund|prize|won|€|£|pay now)\b/i,
  /\b(перевод|переведи|оплат|приз|выигр|бесплатно|подарок)/i,
];
const SECRET_PATTERNS = [
  /\b(pin|password|otp|code|verify|confirm|enter your|social security|bank details)\b/i,
  /\b(код|пароль|пин|cvv|подтверждение|назовите)/i,
];
const LOOKALIKE_URL = /https?:\/\/[^\s]*(?:\.xyz|\.top|\.click|\.tk|bit\.ly|tinyurl|goo\.gl)[^\s]*/i;
const SIMPLE_URL = /\b[\w-]+\.(xyz|tk|ml|ga|cf|click|buzz)\b/i;

const FLAG_META: Record<string, { en: string; ru: string; severity: "low" | "medium" | "high" }> = {
  urgency:            { en: "Creates urgency",     ru: "Создаёт срочность",       severity: "medium" },
  fear:               { en: "Uses fear tactics",   ru: "Использует страх",        severity: "medium" },
  money_request:      { en: "Asks for money",      ru: "Просит деньги",           severity: "high" },
  credential_request: { en: "Asks for password",   ru: "Просит пароль/код",       severity: "high" },
  suspicious_url:     { en: "Suspicious link",     ru: "Подозрительная ссылка",   severity: "medium" },
  greed:              { en: "Lures with prizes",   ru: "Приманка выигрышем",      severity: "medium" },
};

function buildFlag(key: string): ThreatFlag {
  const meta = FLAG_META[key] ?? { en: key, ru: key, severity: "low" as const };
  return { key, label_en: meta.en, label_ru: meta.ru, severity: meta.severity };
}

export function analyzeMessage(content: string): AnalysisResult {
  const flags: string[] = [];

  const urgency = URGENCY_PATTERNS.some(p => p.test(content));
  const fear = FEAR_PATTERNS.some(p => p.test(content));
  const money = MONEY_PATTERNS.some(p => p.test(content));
  const secret = SECRET_PATTERNS.some(p => p.test(content));
  const suspUrl = LOOKALIKE_URL.test(content) || SIMPLE_URL.test(content);

  if (urgency) flags.push("urgency");
  if (fear) flags.push("fear");
  if (money) flags.push("money_request");
  if (secret) flags.push("credential_request");
  if (suspUrl) flags.push("suspicious_url");

  // Greed detection
  const greedWords = /\b(выиграли|приз|бесплатно|подарок|free|won|prize|congratulations|поздравля)\b/i;
  if (greedWords.test(content)) flags.push("greed");

  const score =
    (urgency ? 0.15 : 0) +
    (fear ? 0.15 : 0) +
    (money ? 0.25 : 0) +
    (secret ? 0.25 : 0) +
    (suspUrl ? 0.2 : 0) +
    (flags.includes("greed") ? 0.1 : 0);

  const clampedScore = Math.min(1, score);
  const verdict: ThreatVerdict = clampedScore >= 0.4 ? "danger" : clampedScore >= 0.15 ? "warning" : "safe";

  return {
    verdict,
    score: clampedScore,
    flags: flags.map(buildFlag),
    explanation_en:
      verdict === "safe" ? "This message looks safe." :
      verdict === "warning" ? "This message has some suspicious signs. Check it carefully." :
      "Warning: this message shows strong signs of a scam. Do not respond.",
    explanation_ru:
      verdict === "safe" ? "Сообщение выглядит безопасно." :
      verdict === "warning" ? "В сообщении есть подозрительные признаки. Проверьте его." :
      "Внимание: сообщение похоже на мошенничество. Не отвечайте.",
    elderlyExplanation_en:
      verdict === "safe" ? "This is a normal, safe message. You can read it without worry." :
      verdict === "warning" ? "This message raises some doubts. Better not to respond. Ask a trusted person." :
      "This is a scam. They want to steal your money. Do not respond or click anything.",
    elderlyExplanation_ru:
      verdict === "safe" ? "Это обычное безопасное сообщение. Можете спокойно его прочитать." :
      verdict === "warning" ? "Это сообщение вызывает сомнения. Лучше не отвечайте. Спросите у близкого человека." :
      "Это обманщики. Они хотят украсть ваши деньги. Не отвечайте и не нажимайте ни на что.",
    childExplanation_en:
      verdict === "safe" ? "All good! This is a normal message. 😊" :
      verdict === "warning" ? "Hmm, this message seems weird. Better ask an adult before doing anything." :
      "These are bad people! They're lying and want to trick you. Don't touch this message. Show mom or dad!",
    childExplanation_ru:
      verdict === "safe" ? "Всё хорошо! Это обычное сообщение. 😊" :
      verdict === "warning" ? "Хмм, это сообщение какое-то странное. Лучше спроси у взрослого." :
      "Это плохие люди! Они врут и хотят обмануть. Не трогай это сообщение. Покажи маме или папе!",
  };
}
