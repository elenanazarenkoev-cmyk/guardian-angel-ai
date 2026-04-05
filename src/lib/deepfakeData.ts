// Deepfake threats database — age-specific detection guides
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
}

export const DEEPFAKE_THREATS: DeepfakeThreat[] = [
  // === ADULT threats ===
  {
    id: "df-ceo-fraud",
    emoji: "👔",
    name: { en: "CEO / Boss Deepfake Call", ru: "Дипфейк-звонок от руководителя" },
    description: {
      en: "Scammers clone the voice or video of your boss/CEO using AI to demand urgent wire transfers or sensitive data.",
      ru: "Мошенники клонируют голос или видео вашего руководителя с помощью ИИ, чтобы потребовать срочные переводы или конфиденциальные данные."
    },
    howToDetect: {
      en: [
        "Unusual urgency — 'Transfer now, I'll explain later'",
        "Request bypasses normal approval procedures",
        "Slight audio delay or robotic quality in the voice",
        "Video call with frozen expressions or strange lip sync",
        "Verify by calling back on a known number"
      ],
      ru: [
        "Необычная срочность — «Переведи сейчас, объясню позже»",
        "Запрос обходит обычные процедуры согласования",
        "Небольшая задержка или роботизированное звучание голоса",
        "Видеозвонок с застывшей мимикой или странной синхронизацией губ",
        "Проверьте, перезвонив по известному номеру"
      ]
    },
    audience: ["adult"],
    severity: "critical",
    examples: {
      en: ["'This is urgent — wire $50K to this account before 3pm, I'll sign the papers later.'"],
      ru: ["«Это срочно — переведи 5 млн на этот счёт до 15:00, бумаги подпишу позже.»"]
    }
  },
  {
    id: "df-romance-video",
    emoji: "💕",
    name: { en: "Romance Deepfake Video Call", ru: "Романтический дипфейк-видеозвонок" },
    description: {
      en: "Scammers use AI-generated face and voice during video calls to maintain fake romantic relationships and extract money.",
      ru: "Мошенники используют ИИ-лицо и голос во время видеозвонков, чтобы поддерживать фальшивые романтические отношения и выманивать деньги."
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
      en: ["'I can't meet yet, but I need $2,000 for my mother's surgery — please, you're the only one I trust.'"],
      ru: ["«Я пока не могу встретиться, но мне нужно 200 000 на операцию маме — пожалуйста, ты единственный, кому я доверяю.»"]
    }
  },
  {
    id: "df-fake-news",
    emoji: "📰",
    name: { en: "Deepfake News & Political Manipulation", ru: "Дипфейк-новости и манипуляции" },
    description: {
      en: "AI-generated videos of politicians, celebrities or officials making false statements, used to spread misinformation or cause panic.",
      ru: "ИИ-видео политиков, знаменитостей или чиновников с ложными заявлениями для распространения дезинформации или паники."
    },
    howToDetect: {
      en: [
        "Check multiple reputable news sources for the same story",
        "Look for unnatural blinking or eye movement",
        "Audio may not perfectly match lip movements",
        "Background may have visual artifacts or warping",
        "Reverse image search the video thumbnail"
      ],
      ru: [
        "Проверьте новость в нескольких надёжных источниках",
        "Обратите внимание на неестественное моргание или движение глаз",
        "Звук может не совпадать с движением губ",
        "Фон может иметь визуальные артефакты или искажения",
        "Сделайте обратный поиск по кадру из видео"
      ]
    },
    audience: ["adult", "elderly"],
    severity: "high",
    examples: {
      en: ["Fake video of a president declaring war, shared on WhatsApp to cause panic buying."],
      ru: ["Фейковое видео президента, объявляющего войну, распространяется в мессенджерах для паники."]
    }
  },
  // === ELDERLY threats ===
  {
    id: "df-grandchild",
    emoji: "👴",
    name: { en: "Grandchild Voice Clone Scam", ru: "Клонирование голоса внука/внучки" },
    description: {
      en: "AI clones a grandchild's voice from social media posts. The 'grandchild' calls crying, saying they're in trouble and need money immediately — and begs you not to tell the parents.",
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
        "Не может ответить на личные вопросы, которые знает только настоящий внук",
        "Положите трубку и позвоните внуку на его номер",
        "Установите семейное кодовое слово для экстренных случаев"
      ]
    },
    audience: ["elderly"],
    severity: "critical",
    examples: {
      en: ["'Grandma, it's me! I got arrested and I need bail money. Please don't call mom, she'll be so disappointed.'"],
      ru: ["«Бабушка, это я! Меня задержали, мне нужны деньги на залог. Пожалуйста, не звони маме, она расстроится.»"]
    }
  },
  {
    id: "df-doctor",
    emoji: "🏥",
    name: { en: "Fake Doctor / Hospital Deepfake", ru: "Фальшивый врач / больница" },
    description: {
      en: "Scammers use deepfake video to impersonate a doctor or hospital representative, claiming a family member is in critical condition and requires immediate payment.",
      ru: "Мошенники используют дипфейк-видео, чтобы выдать себя за врача, сообщая что родственник в критическом состоянии и требуется срочная оплата."
    },
    howToDetect: {
      en: [
        "Real hospitals don't demand payment via phone video call",
        "Doctor's background may look too perfect or artificial",
        "Ask for the hospital name and call their public number",
        "Check if family member is actually unreachable",
        "No legitimate medical situation requires gift card payment"
      ],
      ru: [
        "Настоящие больницы не требуют оплату через видеозвонок",
        "Фон «врача» может выглядеть слишком идеальным или искусственным",
        "Спросите название больницы и позвоните по общественному номеру",
        "Проверьте, действительно ли родственник недоступен",
        "Ни одна медицинская ситуация не требует оплаты подарочными картами"
      ]
    },
    audience: ["elderly"],
    severity: "high",
    examples: {
      en: ["'This is Dr. Smith from City Hospital. Your daughter was in an accident — we need $5,000 for emergency surgery now.'"],
      ru: ["«Это доктор Иванов из городской больницы. Ваша дочь попала в аварию — нам нужно 500 000 на экстренную операцию прямо сейчас.»"]
    }
  },
  {
    id: "df-bank-officer",
    emoji: "🏦",
    name: { en: "Deepfake Bank Officer Video Call", ru: "Дипфейк-сотрудник банка" },
    description: {
      en: "A 'bank security officer' calls via video showing a uniform and badge — all AI-generated — to convince you to transfer funds to a 'safe account'.",
      ru: "«Сотрудник безопасности банка» звонит по видео в форме и с удостоверением — всё сгенерировано ИИ — чтобы убедить перевести деньги на «безопасный счёт»."
    },
    howToDetect: {
      en: [
        "Banks never initiate video calls to customers",
        "Badge and uniform details may warp when moving",
        "They create extreme urgency about 'unauthorized transactions'",
        "Ask for an employee ID and call the bank's official line",
        "Never share card numbers or OTP codes on video"
      ],
      ru: [
        "Банки никогда не инициируют видеозвонки клиентам",
        "Детали формы и удостоверения могут искажаться при движении",
        "Создают крайнюю срочность о «несанкционированных операциях»",
        "Спросите табельный номер и позвоните на горячую линию банка",
        "Никогда не сообщайте номер карты или OTP-код по видео"
      ]
    },
    audience: ["elderly", "adult"],
    severity: "critical",
    examples: {
      en: ["'I'm calling from your bank's security department. We detected fraud on your account — transfer your savings to this safe account immediately.'"],
      ru: ["«Я звоню из службы безопасности вашего банка. Мы обнаружили мошенничество — немедленно переведите сбережения на безопасный счёт.»"]
    }
  },
  // === CHILD threats ===
  {
    id: "df-fake-influencer",
    emoji: "🎭",
    name: { en: "Fake Influencer / YouTuber", ru: "Фейковый блогер / ютубер" },
    description: {
      en: "A deepfake video of a popular YouTuber or TikToker sends you a 'personal message' asking to click a link for free prizes, followers, or in-game items.",
      ru: "Дипфейк-видео популярного ютубера или тиктокера отправляет «личное сообщение» с просьбой перейти по ссылке за бесплатные призы или игровые предметы."
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
        "Настоящие блогеры не рассылают случайным подписчикам ссылки на призы",
        "Проверьте аккаунт — мало подписчиков, новая дата создания = фейк",
        "Качество видео может быть ниже, чем у реального контента",
        "Движения рта слегка не совпадают или лицо слишком гладкое",
        "Никогда не вводи пароль по ссылкам из личных сообщений"
      ]
    },
    audience: ["child"],
    severity: "high",
    examples: {
      en: ["'Hey! It's MrBeast! 🎉 I'm giving away free Robux to my top fans — click this link and enter your Roblox login!'"],
      ru: ["«Привет! Это MrBeast! 🎉 Дарю бесплатные Робуксы лучшим фанатам — перейди по ссылке и введи логин Roblox!»"]
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
        "They ask for your password or personal info (real friends don't)",
        "Message comes from an unfamiliar number or new account",
        "Ask a question only your real friend would know the answer to",
        "Tell a parent or trusted adult if something feels wrong"
      ],
      ru: [
        "Друг звучит немного иначе — высота, скорость или тон не те",
        "Просит пароль или личные данные (настоящие друзья не просят)",
        "Сообщение с незнакомого номера или нового аккаунта",
        "Задай вопрос, на который ответит только настоящий друг",
        "Расскажи родителям, если что-то кажется странным"
      ]
    },
    audience: ["child"],
    severity: "high",
    examples: {
      en: ["'Heyy it's me!! Give me your Fortnite password I'll add V-Bucks to your account real quick 😄'"],
      ru: ["«Привет это я!! Дай мне пароль от Fortnite, я быстро добавлю В-Баксы на твой аккаунт 😄»"]
    }
  },
  {
    id: "df-fake-teacher",
    emoji: "👩‍🏫",
    name: { en: "Fake Teacher / School Authority", ru: "Фейковый учитель / школьная администрация" },
    description: {
      en: "AI-generated voice or video of a teacher or school official contacts a child demanding personal information or asking them to go somewhere.",
      ru: "ИИ-голос или видео учителя или сотрудника школы связывается с ребёнком, требуя личную информацию или прося куда-то пойти."
    },
    howToDetect: {
      en: [
        "Teachers contact through school channels, not personal DMs",
        "They would never ask you to keep a conversation secret from parents",
        "Voice may sound slightly robotic or have unusual pauses",
        "Ask: 'What class do I have first on Monday?' — real teachers know",
        "Always tell a parent about unexpected messages from 'teachers'"
      ],
      ru: [
        "Учителя связываются через школьные каналы, не через личные сообщения",
        "Никогда не попросят скрывать разговор от родителей",
        "Голос может звучать роботизированно или с необычными паузами",
        "Спроси: «Какой у меня первый урок в понедельник?» — настоящий учитель знает",
        "Всегда рассказывай родителям о неожиданных сообщениях от «учителей»"
      ]
    },
    audience: ["child"],
    severity: "critical",
    examples: {
      en: ["'Hi, this is Mrs. Johnson from school. I need your home address for a special award. Don't tell your parents — it's a surprise!'"],
      ru: ["«Привет, это Мария Ивановна из школы. Мне нужен твой домашний адрес для специального награждения. Не говори родителям — это сюрприз!»"]
    }
  },
  {
    id: "df-ai-chatbot-grooming",
    emoji: "🤖",
    name: { en: "AI Chatbot Grooming", ru: "Груминг через ИИ-чатбот" },
    description: {
      en: "An AI chatbot pretending to be a peer builds trust with a child through friendly conversation, then gradually requests personal photos, location, or to meet in person.",
      ru: "ИИ-чатбот, притворяющийся ровесником, завоёвывает доверие ребёнка дружелюбным общением, затем постепенно просит личные фото, местоположение или встречу."
    },
    howToDetect: {
      en: [
        "They always agree with everything you say — too perfect",
        "Conversations gradually become more personal or uncomfortable",
        "They ask for photos, your location, or school name",
        "They suggest keeping the friendship secret from parents",
        "Real friends sometimes disagree and have their own opinions"
      ],
      ru: [
        "Всегда соглашается со всем — слишком идеальный",
        "Разговоры постепенно становятся всё более личными",
        "Просит фото, местоположение или название школы",
        "Предлагает скрывать дружбу от родителей",
        "Настоящие друзья иногда не соглашаются и имеют своё мнение"
      ]
    },
    audience: ["child"],
    severity: "critical",
    examples: {
      en: ["'You're so cool! I wish I had a friend like you at my school. What school do you go to? Send me a selfie! 📸'"],
      ru: ["«Ты такой классный! Хочу друга как ты в своей школе. В какую школу ходишь? Пришли селфи! 📸»"]
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
