// SafeGuard AI — Local threat analysis engine
// Zero-knowledge: raw content never leaves the device
// Ported from v8 HTML prototype (rule + brand-phishing + homoglyph engine)

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
  brands: string[];
  explanation_en: string;
  explanation_ru: string;
}

const FLAG_META: Record<string, { en: string; ru: string; severity: "low" | "medium" | "high" }> = {
  urgency:           { en: "Creates urgency",          ru: "Создаёт срочность",            severity: "medium" },
  fear:              { en: "Uses fear tactics",        ru: "Использует страх",             severity: "medium" },
  credentials:       { en: "Asks for password/PIN",    ru: "Просит пароль/PIN",            severity: "high" },
  money:             { en: "Requests money/payment",   ru: "Просит деньги",                severity: "high" },
  free_reward:       { en: "Lures with prizes",        ru: "Приманка выигрышем",           severity: "medium" },
  secret:            { en: "Requests secrecy",         ru: "Просит хранить в секрете",     severity: "high" },
  gift_card:         { en: "Gift card payment",        ru: "Оплата подарочными картами",   severity: "high" },
  tech_support:      { en: "Fake tech support",        ru: "Поддельная техподдержка",      severity: "high" },
  impersonation:     { en: "Authority impersonation",  ru: "Выдача за организацию",        severity: "high" },
  family_emergency:  { en: "Fake family emergency",    ru: "Фальшивая семейная беда",      severity: "high" },
  ai_voice:          { en: "AI voice clone signs",     ru: "Признаки клонирования голоса", severity: "high" },
  brand_phishing:    { en: "Brand phishing URL",       ru: "Фишинг под бренд",             severity: "high" },
  suspicious_url:    { en: "Suspicious link",          ru: "Подозрительная ссылка",        severity: "medium" },
  homoglyph:         { en: "Homoglyph trick (lookalike letters)", ru: "Подмена символов в адресе", severity: "high" },
  shortener:         { en: "URL shortener",            ru: "Сокращённая ссылка",           severity: "medium" },
  ip_url:            { en: "Raw IP address link",      ru: "Ссылка на IP-адрес",           severity: "high" },
  zero_width:        { en: "Hidden zero-width chars",  ru: "Скрытые невидимые символы",    severity: "high" },
  pig_butchering:    { en: "Pig-butchering pattern",   ru: "Схема «разделать свинью»",     severity: "high" },
};

function buildFlag(key: string): ThreatFlag {
  const meta = FLAG_META[key] ?? { en: key, ru: key, severity: "low" as const };
  return { key, label_en: meta.en, label_ru: meta.ru, severity: meta.severity };
}

// ── Brand phishing reference data ──────────────────────────
const OFFICIAL_DOMAINS: Record<string, RegExp> = {
  amazon:    /^https?:\/\/(www\.)?amazon\.(com|co\.uk|de|fr|es|it|ca|com\.au|nl|se|pl|in|com\.br|com\.mx|com\.tr)\//i,
  paypal:    /^https?:\/\/(www\.)?paypal\.(com|co\.uk|de|fr|es|it|me)\//i,
  netflix:   /^https?:\/\/(www\.)?netflix\.com\//i,
  apple:     /^https?:\/\/([a-z]+\.)?apple\.com\//i,
  microsoft: /^https?:\/\/([a-z]+\.)?(microsoft|live|outlook|hotmail)\.com\//i,
  google:    /^https?:\/\/([a-z]+\.)?google\.(com|co\.uk|de|fr)\//i,
  dhl:       /^https?:\/\/(www\.)?dhl\.(com|de|co\.uk|fr)\//i,
  fedex:     /^https?:\/\/(www\.)?fedex\.com\//i,
  hsbc:      /^https?:\/\/(www\.)?hsbc\.(com|co\.uk)\//i,
  sber:      /^https?:\/\/(www\.)?sberbank\.ru\//i,
  tinkoff:   /^https?:\/\/(www\.)?tinkoff\.ru\//i,
};

const BRAND_PATTERNS: Record<string, RegExp> = {
  amazon:    /\bamazon\b/i,
  paypal:    /\bpaypal\b/i,
  netflix:   /\bnetflix\b/i,
  apple:     /\b(apple|itunes|icloud|apple id)\b/i,
  microsoft: /\b(microsoft|windows|outlook|office\s*365)\b/i,
  google:    /\b(google|gmail)\b/i,
  dhl:       /\bdhl\b/i,
  fedex:     /\bfedex\b/i,
  hsbc:      /\bhsbc\b/i,
  sber:      /\b(сбер|сбербанк)\b/i,
  tinkoff:   /\b(тинькофф|тинькоff)\b/i,
};

const PHISH_URL_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s]*(amazon|paypal|netflix|apple|microsoft|google|hsbc|dhl|fedex|sber)[^\s]*(secure|verify|update|confirm|alert|suspend|blocked|account|login|signin|billing|payment)[^\s]*\./i,
  /https?:\/\/[^\s]*(secure|verify|update|confirm|alert|account|login|signin)[^\s]*(amazon|paypal|netflix|apple|microsoft|hsbc|dhl|fedex)[^\s]*\./i,
  /https?:\/\/(amazon|paypal|netflix|apple|microsoft|hsbc|dhl|fedex)[.\-][^\s]+\.(xyz|top|click|tk|ml|ga|cf|gq|pw|cc|icu|online|site|fun|live|biz|info|vip|shop|sbs|cfd)\//i,
  /https?:\/\/[^\s]+\.(xyz|top|click|tk|ml|ga|cf|gq|pw|cc|icu|online|fun|live|biz|vip|sbs|cfd|cyou|zip|mov)\b/i,
  /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  /https?:\/\/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|is\.gd|cutt\.ly|rb\.gy)\/?[a-zA-Z0-9]+/i,
];

const HOMOGLYPH_PATTERNS: RegExp[] = [
  /рaypal|рaypаl|pаypal/i,       // Cyrillic р / а
  /аmazon|amаzon|amazоn/i,       // Cyrillic а / о
  /арple|aррle|аpple/i,          // Cyrillic а / р
  /arnazon|am4zon|amaz0n/i,
  /paypa1|p4ypal/i,
  /netfl1x|netfIix/i,
  /micros0ft|micrоsoft/i,
  /go0gle|googie/i,
  /hsbс|hsb0/i,
];

function detectBrandPhishing(text: string): { score: number; brands: string[]; flags: string[] } {
  let score = 0;
  const brands: string[] = [];
  const flags: string[] = [];

  for (const [brand, pattern] of Object.entries(BRAND_PATTERNS)) {
    if (pattern.test(text)) {
      brands.push(brand);
      const urlMatch = text.match(/https?:\/\/[^\s]+/i);
      if (urlMatch) {
        const off = OFFICIAL_DOMAINS[brand];
        if (off && !off.test(urlMatch[0])) { score += 45; flags.push("brand_phishing"); }
      } else if (/verify|update|confirm|click|tap|call|подтвердите|обновите/i.test(text)) {
        score += 20; flags.push("brand_phishing");
      }
    }
  }

  for (const p of PHISH_URL_PATTERNS) {
    if (p.test(text)) { score += 35; flags.push("suspicious_url"); break; }
  }
  if (/https?:\/\/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly|cutt\.ly)/i.test(text)) flags.push("shortener");
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(text)) flags.push("ip_url");

  for (const la of HOMOGLYPH_PATTERNS) {
    if (la.test(text)) { score += 50; flags.push("homoglyph"); break; }
  }
  if (/[\u200b\u200c\u200d\u2060\u202a-\u202e]/.test(text)) {
    score += 35; flags.push("zero_width");
  }

  return { score: Math.min(score, 100), brands, flags };
}

// ── Rule engine ────────────────────────────────────────────
const RULES: { name: string; regex: RegExp; weight: number }[] = [
  { name: "urgency",          regex: /\b(urgent|immediately|right now|act now|expires|last chance|within \d+ (hours?|min)|срочно|немедленно|прямо сейчас|истекает)\b/i, weight: 20 },
  { name: "fear",             regex: /\b(suspended|blocked|locked|arrested|warrant|virus|compromised|unusual.?activity|заблокирован|арест|вирус|взломан|подозрительн)\b/i, weight: 25 },
  { name: "credentials",      regex: /\b(pin|password|cvv|otp|verify your|enter your|confirm your|пин|пароль|подтвердите|введите код|passcode)\b/i, weight: 40 },
  { name: "money",            regex: /\b(transfer|wire|send money|pay now|bitcoin|crypto|переведите|оплатите|отправьте деньги|перевод)\b/i, weight: 35 },
  { name: "free_reward",      regex: /\b(free|won|winner|prize|claim|reward|congratulations|voucher|бесплатно|выиграли|приз|заберите|поздравля)\b/i, weight: 15 },
  { name: "secret",           regex: /(don'?t tell|keep.*secret|between us|никому не говори|только между нами|do not tell anyone)/i, weight: 45 },
  { name: "gift_card",        regex: /\b(gift card|itunes card|amazon card|google play card|steam card|подарочн.*карт)\b/i, weight: 45 },
  { name: "tech_support",     regex: /\b(microsoft|apple support|google security|windows defender).{0,40}(call|contact|phone|number|позвон|свяж)\b/i, weight: 30 },
  { name: "impersonation",    regex: /\b(this is your bank|calling from|we are amazon|official notice|government|hmrc|police|служба безопасности|сотрудник банка|налогов|полиц)\b/i, weight: 25 },
  { name: "family_emergency", regex: /(мама|бабушка|дедушка|это я|помоги|в беде|нужны деньги срочно|bail money|police station|it.{0,2}s me.*accident|hi mum|hi dad|привет мам|привет пап)/i, weight: 35 },
  { name: "ai_voice",         regex: /\b(don'?t call back|phone.*dying|bad connection|can'?t talk|number belongs to|my friend'?s phone|не перезванивай|телефон сад|чужого телефона)\b/i, weight: 30 },
  { name: "pig_butchering",   regex: /(met online|matched.*mistake|wrong city|случайно совпали).{0,200}(invest|trading|crypto|platform|инвест|криптоплатформ)/is, weight: 40 },
];

export function analyzeMessage(content: string): AnalysisResult {
  const text = content.slice(0, 3000);
  const { score: brandScore, brands, flags: brandFlags } = detectBrandPhishing(text);

  let score = brandScore;
  const flags: string[] = [...brandFlags];

  for (const rule of RULES) {
    if (rule.regex.test(text)) { score += rule.weight; flags.push(rule.name); }
  }

  // Combo amplifiers
  if (/bank/i.test(text) && /account/i.test(text) && /link|click|tap|нажм/i.test(text)) score += 15;
  if (/account.{0,20}(locked|suspended|blocked|заблокирован)/i.test(text)) score += 15;

  score = Math.min(100, score);
  const unique = Array.from(new Set(flags));

  let verdict: ThreatVerdict;
  if (score >= 60) verdict = "danger";
  else if (score >= 25) verdict = "warning";
  else verdict = "safe";

  return {
    verdict,
    score,
    brands,
    flags: unique.map(buildFlag),
    explanation_en:
      verdict === "safe"    ? "This message looks safe. No major red flags found." :
      verdict === "warning" ? "This message has suspicious signs. Double-check via an independent channel before acting." :
                              "This is very likely a scam. Do not click, call back, or transfer any money. Verify via an official number you find yourself.",
    explanation_ru:
      verdict === "safe"    ? "Сообщение выглядит безопасно. Серьёзных признаков угрозы не обнаружено." :
      verdict === "warning" ? "Сообщение имеет подозрительные признаки. Проверьте через независимый канал перед действиями." :
                              "Это почти наверняка мошенничество. Не нажимайте, не перезванивайте, не переводите деньги. Проверьте по официальному номеру, который вы нашли сами.",
  };
}
