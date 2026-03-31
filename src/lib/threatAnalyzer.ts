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
}

const FLAG_META: Record<string, { en: string; ru: string; severity: "low" | "medium" | "high" }> = {
  urgency:            { en: "Creates urgency",        ru: "Создаёт срочность",          severity: "medium" },
  fear:               { en: "Uses fear tactics",      ru: "Использует страх",           severity: "medium" },
  money:              { en: "Requests money/payment",  ru: "Просит деньги",              severity: "high" },
  credentials:        { en: "Asks for password/PIN",   ru: "Просит пароль/PIN",          severity: "high" },
  url:                { en: "Suspicious link",         ru: "Подозрительная ссылка",       severity: "medium" },
  freegame:           { en: "Free in-game currency",   ru: "Бесплатная игровая валюта",   severity: "high" },
  secret:             { en: "Requests secrecy",        ru: "Просит хранить секрет",       severity: "high" },
  giftcard:           { en: "Gift card payment",       ru: "Оплата подарочными картами",  severity: "high" },
  greed:              { en: "Lures with prizes",       ru: "Приманка выигрышем",          severity: "medium" },
};

function buildFlag(key: string): ThreatFlag {
  const meta = FLAG_META[key] ?? { en: key, ru: key, severity: "low" as const };
  return { key, label_en: meta.en, label_ru: meta.ru, severity: meta.severity };
}

export function analyzeMessage(content: string): AnalysisResult {
  const t = content.toLowerCase();
  const flags: string[] = [];
  let score = 0;

  const urgency = [/\burgent\b/,/\bimmediately\b/,/\bright now\b/,/\bexpires\b/,/\blast chance\b/,/\bwithin \d+ (hours?|minutes?)\b/,/\bсрочно\b/,/\bнемедленно\b/,/\bпрямо сейчас\b/,/\bистекает\b/];
  const fear = [/\bsuspended\b/,/\blocked\b/,/\barrested\b/,/\bwarrant\b/,/\bvirus\b/,/\bcompromised\b/,/\bunusual activity\b/,/\bзаблокирован\b/,/\bвирус\b/,/\bподозрительн/];
  const money = [/\btransfer\b/,/\bwire\b/,/\bbitcoin\b/,/\bgift card\b/,/\bpayment\b/,/\bpay now\b/,/[£€$]\d/,/\bперевод\b/,/\bоплатите\b/,/\bперевести\b/];
  const cred = [/\bpin\b/,/\bpassword\b/,/\botp\b/,/\bverify your\b/,/\benter your\b/,/\bconfirm your\b/,/\bпин\b/,/\bпароль\b/,/\bподтвердите\b/];
  const urlPatterns = /https?:\/\/[^\s]*(bit\.ly|tinyurl|\.xyz|\.top|\.click|\.tk|goo\.gl|-[a-z]+(\.com|\.net|\.org))[^\s]*/;
  const suspDomain = /https?:\/\/[^\s]*[-](verification|secure|update|alert|confirm|support)[^\s]*/;

  if (urgency.some(r => r.test(t))) { flags.push("urgency"); score += 25; }
  if (fear.some(r => r.test(t))) { flags.push("fear"); score += 25; }
  if (money.some(r => r.test(t))) { flags.push("money"); score += 35; }
  if (cred.some(r => r.test(t))) { flags.push("credentials"); score += 40; }
  if (urlPatterns.test(t) || suspDomain.test(t)) { flags.push("url"); score += 30; }
  if (/free.*currency|free.*coins|free.*robux|free.*vbucks/i.test(t)) { flags.push("freegame"); score += 40; }
  if (/don't tell|keep.*secret|не говори|секрет/i.test(t)) { flags.push("secret"); score += 45; }
  if (/gift card|подарочн.*карт/i.test(t)) { flags.push("giftcard"); score += 45; }
  if (/выиграли|приз|бесплатно|подарок|free|won|prize|congratulations|поздравля/i.test(t)) { flags.push("greed"); score += 15; }

  score = Math.min(100, score);
  let verdict: ThreatVerdict;
  if (score >= 60) verdict = "danger";
  else if (score >= 25) verdict = "warning";
  else verdict = "safe";

  return {
    verdict,
    score,
    flags: flags.map(buildFlag),
    explanation_en:
      verdict === "safe" ? "This message looks safe. No major red flags found." :
      verdict === "warning" ? "This message has suspicious signs. Double-check before acting." :
      "This is very likely a scam. Do not click, call, or transfer any money.",
    explanation_ru:
      verdict === "safe" ? "Сообщение выглядит безопасно. Серьёзных признаков угрозы не обнаружено." :
      verdict === "warning" ? "Сообщение имеет подозрительные признаки. Проверьте перед тем как действовать." :
      "Это почти наверняка мошенничество. Не нажимайте, не звоните, не переводите деньги.",
  };
}
