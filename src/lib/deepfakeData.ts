// Deepfake threats database — age-specific detection guides
// Enhanced with real-world B2B cases (Arup $25M, Visa AI detection)
import type { UserMode } from "./i18n";

export interface DeepfakeThreat {
  id: string;
  emoji: string;
  name: { en: string; ru: string };
  description: { en: string; ru: string };
  howToDetect: { en: string[]; ru: string[] };
  audience: UserMode[];
  severity: "critical" | "high" | "medium";
  examples: { en: string[]; ru: string[] };
  realCase?: { en: string; ru: string };
}

export interface DeepfakeStat {
  value: string;
  label: { en: string; ru: string };
  source: string;
}

export const DEEPFAKE_STATS: DeepfakeStat[] = [
  { value: "€4.2B", label: { en: "Payment fraud in EU (2024)", ru: "Платёжное мошенничество в ЕС (2024)" }, source: "ECB" },
  { value: "$25M", label: { en: "Arup deepfake heist (2024)", ru: "Кража через дипфейк в Arup (2024)" }, source: "Arup case" },
  { value: "$12.5B", label: { en: "US fraud losses (2024)", ru: "Потери от мошенничества в США (2024)" }, source: "FTC" },
  { value: "300%", label: { en: "AI detection improvement", ru: "Улучшение ИИ-обнаружения" }, source: "Mastercard" },
  { value: "80%", label: { en: "Leaders confirm AI reduces fraud time", ru: "Руководителей подтверждают: ИИ сокращает время расследования" }, source: "Mastercard survey" },
];

export const DEEPFAKE_THREATS: DeepfakeThreat[] = [
  // === ADULT / PROFESSIONAL threats ===
  {
    id: "df-ceo-fraud",
    emoji: "👔",
    name: { en: "CEO / Boss Deepfake Call", ru: "Дипфейк-звонок от руководителя" },
    description: {
      en: "Scammers clone the voice or video of your boss/CEO using AI to demand urgent wire transfers. In the Arup case (2024), an employee processed 15 wire transfers totaling $25 million after a deepfake video call with fake executives.",
      ru: "Мошенники клонируют голос или видео руководителя с помощью ИИ для срочных переводов. В деле Arup (2024) сотрудник выполнил 15 переводов на $25 млн после видеозвонка с дипфейк-руководителями."
    },
    howToDetect: {
      en: [
        "Unusual urgency — 'Transfer now, I'll explain later'",
        "Request bypasses normal approval procedures",
        "Slight audio delay or robotic quality in the voice",
        "Video call with frozen expressions or strange lip sync",
        "Verify by calling back on a known number",
        "Check if multiple approvers are required by company policy"
      ],
      ru: [
        "Необычная срочность — «Переведи сейчас, объясню позже»",
        "Запрос обходит обычные процедуры согласования",
        "Небольшая задержка или роботизированное звучание голоса",
        "Видеозвонок с застывшей мимикой или странной синхронизацией губ",
        "Проверьте, перезвонив по известному номеру",
        "Убедитесь, что политика компании требует нескольких подтверждений"
      ]
    },
    audience: ["adult"],
    severity: "critical",
    realCase: {
      en: "🔴 REAL CASE: Arup (2024) — Employee joined a video call where the CFO and other executives appeared to instruct $25M in wire transfers. All 'executives' were AI-generated deepfakes.",
      ru: "🔴 РЕАЛЬНЫЙ СЛУЧАЙ: Arup (2024) — Сотрудник присоединился к видеозвонку, где CFO и другие руководители дали указание перевести $25 млн. Все «руководители» были дипфейками."
    },
    examples: {
      en: ["'This is confidential — transfer $50K to this account before 3pm. I'll sign the papers later. Don't involve anyone else.'"],
      ru: ["«Это конфиденциально — переведи $50K на этот счёт до 15:00. Бумаги подпишу позже. Больше никого не привлекай.»"]
    }
  },
  {
    id: "df-b2b-invoice",
    emoji: "📄",
    name: { en: "B2B Invoice Deepfake", ru: "Дипфейк B2B-счёта" },
    description: {
      en: "Scammers use AI to create fake invoices with cloned signatures, letterheads, and even follow-up video calls from 'suppliers' confirming changed bank details. Traditional rule-based systems miss these because the fraud occurs before the transaction.",
      ru: "Мошенники используют ИИ для создания поддельных счетов с клонированными подписями, бланками и даже видеозвонками от «поставщиков», подтверждающих изменение банковских реквизитов."
    },
    howToDetect: {
      en: [
        "Bank details changed from previous invoices",
        "Request to update payment info via email or video call",
        "Slight differences in email domain (company-inc.com vs company.com)",
        "Always verify changes through a known, pre-established contact",
        "Use dual-approval for any payment detail changes"
      ],
      ru: [
        "Банковские реквизиты изменились по сравнению с предыдущими счетами",
        "Запрос на обновление платёжных данных по email или видеозвонку",
        "Небольшие различия в домене (company-inc.com вместо company.com)",
        "Всегда проверяйте изменения через известный, заранее установленный контакт",
        "Используйте двойное подтверждение для любых изменений реквизитов"
      ]
    },
    audience: ["adult"],
    severity: "critical",
    realCase: {
      en: "🔴 Mastercard estimates $60M in corporate payment fraud in 2025 alone. Fraudsters use AI-generated documents and deepfake calls to redirect legitimate payments.",
      ru: "🔴 Mastercard оценивает мошенничество с корпоративными платежами в $60 млн только в 2025 году. Мошенники используют ИИ-документы и дипфейк-звонки для перенаправления платежей."
    },
    examples: {
      en: ["'Hi, this is John from Acme Supplies. We've changed our bank account. Please update your records and send the next payment to this new account.'"],
      ru: ["«Здравствуйте, это Иван из «Альфа-Снабжение». Мы сменили банковский счёт. Пожалуйста, обновите данные и отправьте следующий платёж на новый счёт.»"]
    }
  },
  {
    id: "df-romance-video",
    emoji: "💕",
    name: { en: "Romance Deepfake Video Call", ru: "Романтический дипфейк-видеозвонок" },
    description: {
      en: "Scammers use AI-generated face and voice during video calls to maintain fake romantic relationships and extract money.",
      ru: "Мошенники используют ИИ-лицо и голос во время видеозвонков для поддержки фальшивых романтических отношений и выманивания денег."
    },
    howToDetect: {
      en: [
        "Person refuses video calls or has poor quality with 'bad connection'",
        "Face looks too smooth, hair doesn't move naturally",
        "Ask them to turn sideways — deepfakes struggle with profile views",
        "Ask to hold up random objects — AI can't improvise props",
        "Emotional manipulation: crisis stories to extract money"
      ],
      ru: [
        "Человек избегает видеозвонков или качество плохое — «плохая связь»",
        "Лицо слишком гладкое, волосы не двигаются естественно",
        "Попросите повернуться боком — дипфейки плохо справляются с профилем",
        "Попросите поднять случайный предмет — ИИ не может импровизировать",
        "Эмоциональная манипуляция: кризисные истории для выманивания денег"
      ]
    },
    audience: ["adult", "elderly"],
    severity: "critical",
    examples: {
      en: ["'I can't meet yet, but I need $2,000 for my mother's surgery — you're the only one I trust.'"],
      ru: ["«Я пока не могу встретиться, но мне нужно 200 000 на операцию маме — ты единственный, кому я доверяю.»"]
    }
  },
  {
    id: "df-fake-news",
    emoji: "📰",
    name: { en: "Deepfake News & Manipulation", ru: "Дипфейк-новости и манипуляции" },
    description: {
      en: "AI-generated videos of politicians, celebrities or officials making false statements to spread misinformation, cause panic, or manipulate markets.",
      ru: "ИИ-видео политиков, знаменитостей или чиновников с ложными заявлениями для дезинформации, паники или манипуляции рынками."
    },
    howToDetect: {
      en: [
        "Check multiple reputable news sources",
        "Look for unnatural blinking or eye movement",
        "Audio may not match lip movements perfectly",
        "Background may have visual artifacts or warping",
        "Reverse image search the video thumbnail"
      ],
      ru: [
        "Проверьте новость в нескольких надёжных источниках",
        "Обратите внимание на неестественное моргание",
        "Звук может не совпадать с движением губ",
        "Фон может иметь артефакты или искажения",
        "Сделайте обратный поиск по кадру из видео"
      ]
    },
    audience: ["adult", "elderly"],
    severity: "high",
    examples: {
      en: ["Fake video of a president declaring emergency measures, shared on WhatsApp to cause panic buying."],
      ru: ["Фейковое видео президента, объявляющего чрезвычайное положение, распространяется в мессенджерах."]
    }
  },
  // === ELDERLY threats ===
  {
    id: "df-grandchild",
    emoji: "👴",
    name: { en: "Grandchild Voice Clone Scam", ru: "Клонирование голоса внука/внучки" },
    description: {
      en: "AI clones a grandchild's voice from social media. The 'grandchild' calls crying, saying they're in trouble and need money — and begs you not to tell the parents.",
      ru: "ИИ клонирует голос внука из соцсетей. «Внук» звонит в слезах, говорит, что попал в беду, срочно нужны деньги — и просит не говорить родителям."
    },
    howToDetect: {
      en: [
        "Emotional pressure: crying, panic, 'Don't tell mom and dad'",
        "Asks for unusual payment: gift cards, crypto, wire transfer",
        "Cannot answer personal questions only real grandchild would know",
        "Hang up and call the grandchild's actual phone number",
        "Set up a family code word for emergencies"
      ],
      ru: [
        "Эмоциональное давление: плач, паника, «Не говори маме и папе»",
        "Просит необычный способ оплаты: подарочные карты, крипта, перевод",
        "Не может ответить на личные вопросы настоящего внука",
        "Положите трубку и позвоните внуку на его номер",
        "Установите семейное кодовое слово для экстренных случаев"
      ]
    },
    audience: ["elderly"],
    severity: "critical",
    realCase: {
      en: "🔴 Voice cloning requires only 3 seconds of audio from a social media video. In 2024, thousands of elderly victims lost savings to AI voice clones of relatives.",
      ru: "🔴 Для клонирования голоса достаточно 3 секунд аудио из соцсетей. В 2024 году тысячи пожилых людей потеряли сбережения из-за ИИ-клонов голосов родственников."
    },
    examples: {
      en: ["'Grandma, it's me! I got arrested and I need bail money. Please don't call mom.'"],
      ru: ["«Бабушка, это я! Меня задержали, мне нужны деньги на залог. Не звони маме.»"]
    }
  },
  {
    id: "df-doctor",
    emoji: "🏥",
    name: { en: "Fake Doctor / Hospital Deepfake", ru: "Фальшивый врач / больница" },
    description: {
      en: "Deepfake video impersonating a doctor, claiming a family member is in critical condition and requires immediate payment.",
      ru: "Дипфейк-видео, выдающее себя за врача, сообщающее что родственник в критическом состоянии и требуется срочная оплата."
    },
    howToDetect: {
      en: [
        "Real hospitals don't demand payment via phone video call",
        "Doctor's background may look artificial",
        "Ask for the hospital name and call their public number",
        "Check if family member is actually unreachable",
        "No medical situation requires gift card payment"
      ],
      ru: [
        "Настоящие больницы не требуют оплату через видеозвонок",
        "Фон «врача» может выглядеть искусственным",
        "Спросите название больницы и позвоните по общественному номеру",
        "Проверьте, действительно ли родственник недоступен",
        "Ни одна медицинская ситуация не требует оплаты подарочными картами"
      ]
    },
    audience: ["elderly"],
    severity: "high",
    examples: {
      en: ["'This is Dr. Smith from City Hospital. Your daughter was in an accident — we need $5,000 for emergency surgery now.'"],
      ru: ["«Это доктор Иванов из городской больницы. Ваша дочь попала в аварию — нужно 500 000 на экстренную операцию.»"]
    }
  },
  {
    id: "df-bank-officer",
    emoji: "🏦",
    name: { en: "Deepfake Bank Officer Video Call", ru: "Дипфейк-сотрудник банка" },
    description: {
      en: "A 'bank security officer' calls via video showing a uniform and badge — all AI-generated — to convince you to transfer funds to a 'safe account'.",
      ru: "«Сотрудник безопасности банка» звонит по видео в форме с удостоверением — всё сгенерировано ИИ — чтобы убедить перевести деньги на «безопасный счёт»."
    },
    howToDetect: {
      en: [
        "Banks never initiate video calls to customers",
        "Badge and uniform details may warp when moving",
        "Extreme urgency about 'unauthorized transactions'",
        "Ask for employee ID and call the bank's official line",
        "Never share card numbers or OTP codes on video"
      ],
      ru: [
        "Банки никогда не инициируют видеозвонки клиентам",
        "Детали формы и удостоверения могут искажаться при движении",
        "Крайняя срочность о «несанкционированных операциях»",
        "Спросите табельный номер и позвоните на горячую линию банка",
        "Никогда не сообщайте номер карты или OTP-код по видео"
      ]
    },
    audience: ["elderly", "adult"],
    severity: "critical",
    examples: {
      en: ["'I'm calling from your bank's security department. We detected fraud — transfer your savings to this safe account immediately.'"],
      ru: ["«Я звоню из службы безопасности банка. Обнаружено мошенничество — немедленно переведите сбережения на безопасный счёт.»"]
    }
  },
  {
    id: "df-govt-official",
    emoji: "⚖️",
    name: { en: "Fake Government Official", ru: "Фальшивый чиновник" },
    description: {
      en: "AI-generated video of a tax authority, police officer, or government official demanding immediate payment to avoid arrest, fines, or deportation.",
      ru: "ИИ-видео налогового инспектора, полицейского или чиновника, требующего немедленной оплаты во избежание ареста, штрафов или депортации."
    },
    howToDetect: {
      en: [
        "Government agencies never demand payment by phone or video",
        "Real authorities send official written notices",
        "They use fear and urgency to prevent you from thinking",
        "Hang up and contact the agency through their official website",
        "Never pay fines through gift cards or crypto"
      ],
      ru: [
        "Госорганы никогда не требуют оплату по телефону или видео",
        "Настоящие органы отправляют официальные письменные уведомления",
        "Используют страх и срочность, чтобы вы не думали",
        "Повесьте трубку и свяжитесь с организацией через официальный сайт",
        "Никогда не платите штрафы через подарочные карты или крипту"
      ]
    },
    audience: ["elderly", "adult"],
    severity: "high",
    examples: {
      en: ["'This is Inspector from the tax authority. You owe $15,000 in back taxes. Pay within 2 hours or a warrant will be issued.'"],
      ru: ["«Это инспектор налоговой службы. Вы должны 1 500 000 руб. задолженности. Оплатите в течение 2 часов, иначе будет выписан ордер.»"]
    }
  },
  // === CHILD threats ===
  {
    id: "df-fake-influencer",
    emoji: "🎭",
    name: { en: "Fake Influencer / YouTuber", ru: "Фейковый блогер / ютубер" },
    description: {
      en: "A deepfake video of a popular YouTuber or TikToker sends a 'personal message' asking to click a link for free prizes or in-game items.",
      ru: "Дипфейк-видео популярного ютубера отправляет «личное сообщение» с просьбой перейти по ссылке за бесплатные призы или игровые предметы."
    },
    howToDetect: {
      en: [
        "Real influencers don't DM random followers with prize links",
        "Check the account — low followers, new creation date = fake",
        "Video quality may be lower than their real content",
        "Mouth movements slightly off or face too smooth",
        "Never enter your password on links from DMs"
      ],
      ru: [
        "Настоящие блогеры не рассылают случайным подписчикам ссылки",
        "Проверьте аккаунт — мало подписчиков, новая дата = фейк",
        "Качество видео ниже, чем у реального контента",
        "Движения рта слегка не совпадают или лицо слишком гладкое",
        "Никогда не вводи пароль по ссылкам из ЛС"
      ]
    },
    audience: ["child"],
    severity: "high",
    examples: {
      en: ["'Hey! It's MrBeast! 🎉 I'm giving away free Robux — click this link and enter your login!'"],
      ru: ["«Привет! Это MrBeast! 🎉 Дарю бесплатные Робуксы — перейди по ссылке и введи логин!»"]
    }
  },
  {
    id: "df-friend-clone",
    emoji: "👫",
    name: { en: "Cloned Friend's Voice / Video", ru: "Клон голоса / видео друга" },
    description: {
      en: "A deepfake of your friend's voice or face asks for your game login, sends scary messages, or tries to get you to do something dangerous.",
      ru: "Дипфейк голоса или лица друга просит логин от игры, отправляет пугающие сообщения или пытается убедить сделать что-то опасное."
    },
    howToDetect: {
      en: [
        "Your friend sounds slightly different — pitch, speed, or tone is off",
        "They ask for your password or personal info",
        "Message comes from an unfamiliar number or new account",
        "Ask a question only your real friend would know",
        "Tell a parent or trusted adult if something feels wrong"
      ],
      ru: [
        "Друг звучит немного иначе — высота, скорость или тон не те",
        "Просит пароль или личные данные",
        "Сообщение с незнакомого номера или нового аккаунта",
        "Задай вопрос, на который ответит только настоящий друг",
        "Расскажи родителям, если что-то кажется странным"
      ]
    },
    audience: ["child"],
    severity: "high",
    examples: {
      en: ["'Heyy it's me!! Give me your Fortnite password I'll add V-Bucks real quick 😄'"],
      ru: ["«Привет это я!! Дай пароль от Fortnite, я быстро добавлю В-Баксы 😄»"]
    }
  },
  {
    id: "df-fake-teacher",
    emoji: "👩‍🏫",
    name: { en: "Fake Teacher / School Authority", ru: "Фейковый учитель / школьная администрация" },
    description: {
      en: "AI-generated voice or video of a teacher contacts a child demanding personal information or asking them to go somewhere.",
      ru: "ИИ-голос или видео учителя связывается с ребёнком, требуя личную информацию или прося куда-то пойти."
    },
    howToDetect: {
      en: [
        "Teachers contact through school channels, not personal DMs",
        "They would never ask to keep a conversation secret from parents",
        "Voice may sound slightly robotic or have unusual pauses",
        "Ask: 'What class do I have first on Monday?'",
        "Always tell a parent about unexpected messages from 'teachers'"
      ],
      ru: [
        "Учителя связываются через школьные каналы, не через ЛС",
        "Никогда не попросят скрывать разговор от родителей",
        "Голос может звучать роботизированно",
        "Спроси: «Какой у меня первый урок в понедельник?»",
        "Всегда рассказывай родителям о неожиданных сообщениях от «учителей»"
      ]
    },
    audience: ["child"],
    severity: "critical",
    examples: {
      en: ["'Hi, this is Mrs. Johnson. I need your home address for a special award. Don't tell your parents — it's a surprise!'"],
      ru: ["«Привет, это Мария Ивановна. Мне нужен твой адрес для награждения. Не говори родителям — это сюрприз!»"]
    }
  },
  {
    id: "df-ai-chatbot-grooming",
    emoji: "🤖",
    name: { en: "AI Chatbot Grooming", ru: "Груминг через ИИ-чатбот" },
    description: {
      en: "An AI chatbot pretending to be a peer builds trust, then gradually requests personal photos, location, or to meet in person.",
      ru: "ИИ-чатбот, притворяющийся ровесником, завоёвывает доверие, затем постепенно просит личные фото, местоположение или встречу."
    },
    howToDetect: {
      en: [
        "They always agree with everything you say — too perfect",
        "Conversations gradually become more personal",
        "They ask for photos, your location, or school name",
        "They suggest keeping the friendship secret from parents",
        "Real friends sometimes disagree and have their own opinions"
      ],
      ru: [
        "Всегда соглашается со всем — слишком идеальный",
        "Разговоры постепенно становятся личными",
        "Просит фото, местоположение или название школы",
        "Предлагает скрывать дружбу от родителей",
        "Настоящие друзья иногда не соглашаются"
      ]
    },
    audience: ["child"],
    severity: "critical",
    examples: {
      en: ["'You're so cool! What school do you go to? Send me a selfie! 📸'"],
      ru: ["«Ты такой классный! В какую школу ходишь? Пришли селфи! 📸»"]
    }
  },
  {
    id: "df-fake-game-support",
    emoji: "🎮",
    name: { en: "Fake Game Support Deepfake", ru: "Фальшивая техподдержка игры" },
    description: {
      en: "AI-generated video or voice of 'game support' contacts you about your account being hacked, asking for your login to 'fix' it.",
      ru: "ИИ-видео или голос «поддержки игры» сообщает, что ваш аккаунт взломан, и просит логин для «исправления»."
    },
    howToDetect: {
      en: [
        "Real game support uses in-app tickets, not video calls",
        "They would never ask for your password",
        "Check the official game website for real support channels",
        "If urgent — it's a scam. Real support gives you time",
        "Tell a parent before giving any information"
      ],
      ru: [
        "Настоящая поддержка использует тикеты в приложении, не видеозвонки",
        "Никогда не попросят твой пароль",
        "Проверь официальный сайт игры для реальных каналов поддержки",
        "Если срочно — это мошенничество. Реальная поддержка даёт время",
        "Расскажи родителям перед тем как давать информацию"
      ]
    },
    audience: ["child"],
    severity: "high",
    examples: {
      en: ["'Hello, this is Roblox Support. Your account has been flagged for suspicious activity. Give us your password to restore it.'"],
      ru: ["«Здравствуйте, это поддержка Roblox. Ваш аккаунт помечен за подозрительную активность. Дайте нам пароль для восстановления.»"]
    }
  },
];

export const DEEPFAKE_CATEGORIES = [
  { key: "all", label_en: "All", label_ru: "Все" },
  { key: "voice", label_en: "Voice Clone", label_ru: "Клон голоса" },
  { key: "video", label_en: "Video Fake", label_ru: "Видео-фейк" },
  { key: "chatbot", label_en: "AI Chatbot", label_ru: "ИИ-чатбот" },
];

export function getDeepfakeByAudience(mode: UserMode): DeepfakeThreat[] {
  return DEEPFAKE_THREATS.filter(t => t.audience.includes(mode));
}
