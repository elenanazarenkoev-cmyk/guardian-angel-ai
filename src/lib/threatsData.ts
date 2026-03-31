// Local threats library — no Supabase dependency
export interface ThreatItem {
  cat: string;
  emoji: string;
  name: { en: string; ru: string };
  type: { en: string; ru: string };
  how: { en: string; ru: string };
  flags: { en: string[]; ru: string[] };
}

export const THREATS: ThreatItem[] = [
  {
    cat: "phishing", emoji: "📧",
    name: { en: "Phishing (Email)", ru: "Фишинг (Email)" },
    type: { en: "Email scam", ru: "Мошенничество по email" },
    how: {
      en: "Fake emails that look like they come from banks, delivery companies, or tech firms. They contain links to fake websites designed to steal your login or payment details.",
      ru: "Поддельные письма, имитирующие банки, службы доставки или технологические компании. Содержат ссылки на фальшивые сайты для кражи логинов или платёжных данных."
    },
    flags: {
      en: ["Urgent subject line", "External domain (not the real company)", "Link to unfamiliar website", "Asks for password or card number", "Poor grammar or odd formatting"],
      ru: ["Срочная тема письма", "Внешний домен (не настоящая компания)", "Ссылка на незнакомый сайт", "Просит пароль или номер карты", "Ошибки в тексте"]
    }
  },
  {
    cat: "vishing", emoji: "📞",
    name: { en: "Vishing (Voice Call)", ru: "Вишинг (Голосовой звонок)" },
    type: { en: "Phone scam", ru: "Телефонное мошенничество" },
    how: {
      en: "Scammers call pretending to be your bank, tech support, or government services. They use spoofed caller IDs to appear legitimate.",
      ru: "Мошенники звонят, притворяясь банком, техподдержкой или государственными службами. Подделывают номера."
    },
    flags: {
      en: ["Unsolicited call", "Asks for PIN, password, or card number", "Caller ID shows a known company (can be faked)", "Creates fear or urgency", "Asks to transfer money or buy gift cards"],
      ru: ["Неожиданный звонок", "Просит PIN, пароль или номер карты", "Определитель показывает известную компанию (может быть подделан)", "Создаёт страх или срочность", "Просит перевести деньги или купить подарочные карты"]
    }
  },
  {
    cat: "smishing", emoji: "📱",
    name: { en: "Smishing (SMS)", ru: "Смишинг (SMS)" },
    type: { en: "SMS scam", ru: "SMS мошенничество" },
    how: {
      en: "Fake text messages about deliveries, bank alerts, or prizes. They contain links to malware or forms that steal your payment card details.",
      ru: "Поддельные SMS о посылках, банковских оповещениях или призах. Содержат ссылки на вредоносные сайты."
    },
    flags: {
      en: ["Unexpected delivery notification", "Short URL (bit.ly etc.) or unknown domain", "Creates urgency ('Act within 24 hours')", "Small payment required", "No personalisation (Dear Customer)"],
      ru: ["Неожиданное уведомление о доставке", "Короткая ссылка или неизвестный домен", "Создаёт срочность", "Небольшой платёж", "Обезличенное обращение (Уважаемый клиент)"]
    }
  },
  {
    cat: "gaming", emoji: "🎮",
    name: { en: "Gaming Scams", ru: "Игровые мошенничества" },
    type: { en: "In-game / platform scam", ru: "Внутриигровое / платформенное" },
    how: {
      en: "Scammers target gamers with fake currency generators, fake trades, account sharing requests, and impersonation of game support staff.",
      ru: "Мошенники нацелены на игроков: поддельные генераторы валюты, фальшивые обмены и имитация поддержки."
    },
    flags: {
      en: ["Free currency offers via chat", "Requests to share login credentials", "Trade links to non-official websites", "'Support' contacting without a ticket", "Offer too good to be true"],
      ru: ["Предложения бесплатной валюты в чате", "Запросы на передачу логина", "Ссылки на неофициальные сайты", "'Поддержка' связывается без обращения", "Предложение слишком выгодное"]
    }
  },
  {
    cat: "romance", emoji: "💔",
    name: { en: "Romance Scams", ru: "Романтические мошенничества" },
    type: { en: "Social engineering / long-term manipulation", ru: "Социальная инженерия / долгосрочная манипуляция" },
    how: {
      en: "Scammers build fake romantic relationships over weeks or months before asking for money citing emergencies, travel costs, or investment opportunities.",
      ru: "Мошенники выстраивают фиктивные романтические отношения в течение недель, затем просят деньги."
    },
    flags: {
      en: ["Never meets in person or on video", "Lives far away (offshore, military)", "Falls in love very quickly", "Asks for money or gift cards", "Has excuses for every meeting cancellation"],
      ru: ["Никогда не встречается лично или по видео", "Живёт далеко", "Влюбляется очень быстро", "Просит деньги или подарочные карты", "Всегда есть причина для отмены встречи"]
    }
  },
];

export const THREAT_CATEGORIES = [
  { key: "all", label_en: "All", label_ru: "Все" },
  { key: "phishing", label_en: "Phishing", label_ru: "Фишинг" },
  { key: "vishing", label_en: "Vishing", label_ru: "Вишинг" },
  { key: "smishing", label_en: "Smishing", label_ru: "Смишинг" },
  { key: "gaming", label_en: "Gaming", label_ru: "Игры" },
  { key: "romance", label_en: "Romance", label_ru: "Романтика" },
];
