// Scenarios ported from the comprehensive HTML prototype
import type { UserMode } from "./i18n";

export interface ScenarioChoice {
  text: { en: string; ru: string };
  correct: boolean;
  feedback: { en: string; ru: string };
}

export interface ScenarioStep {
  type: "message" | "breathe" | "choice" | "lesson";
  content?: { en: string; ru: string };
  prompt?: { en: string; ru: string };
  choices?: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  cat: string;
  targets: UserMode[];
  emoji: string;
  badge: string;
  badgeColor: string;
  title: { en: string; ru: string };
  desc: { en: string; ru: string };
  steps: ScenarioStep[];
}

export const SCENARIOS: Scenario[] = [
  // ── GAMING ──
  {
    id: "game1", cat: "game", targets: ["adult", "elderly", "child"],
    emoji: "🎮", badge: "smishing", badgeColor: "purple",
    title: { en: "Free V-Bucks Offer (Fortnite/Roblox)", ru: "Бесплатные V-Bucks (Fortnite/Roblox)" },
    desc: { en: "DM offering free in-game currency", ru: "Сообщение с бесплатной игровой валютой" },
    steps: [
      { type: "message", content: {
        en: "📱 Direct message from 'FortniteOfficial_Support':\n\n🎉 CONGRATULATIONS! You've been selected for 50,000 FREE V-Bucks!\n\nClaim in the next 15 MINUTES: bit.ly/vbucks-claim99\n\nEnter your Epic Games login to activate. Offer expires soon!",
        ru: "📱 Сообщение от 'FortniteOfficial_Support':\n\n🎉 ПОЗДРАВЛЯЕМ! Вы выбраны для получения 50 000 БЕСПЛАТНЫХ V-Bucks!\n\nЗаберите в течение 15 МИНУТ: bit.ly/vbucks-claim99\n\nВведите логин от Epic Games для активации."
      }},
      { type: "breathe", content: {
        en: "Notice: you feel EXCITED and RUSHED. These feelings are exactly what scammers want. Take a breath.",
        ru: "Заметьте: вы чувствуете ВОЗБУЖДЕНИЕ и СПЕШКУ. Именно этого и хотят мошенники. Сделайте вдох."
      }},
      { type: "choice", prompt: { en: "What do you do?", ru: "Что вы делаете?" }, choices: [
        { text: { en: "Click the link and enter my login", ru: "Нажать ссылку и ввести логин" }, correct: false,
          feedback: { en: "Your account will be stolen. Official games NEVER give currency via DMs. bit.ly links hide the real destination.", ru: "Ваш аккаунт украдут. Официальные игры НИКОГДА не дают валюту через сообщения." }},
        { text: { en: "Ignore, report, and block", ru: "Игнорировать, пожаловаться и заблокировать" }, correct: true,
          feedback: { en: "Perfect! Free currency via DM is always a scam. V-Bucks only come from the official Epic Games store.", ru: "Отлично! Бесплатная валюта через сообщения — всегда мошенничество." }},
        { text: { en: "Forward to a friend to check", ru: "Переслать другу для проверки" }, correct: false,
          feedback: { en: "You'd be spreading the scam. Scam links are dangerous even to look at.", ru: "Вы распространите мошенничество. Ссылки опасны даже при переходе." }}
      ]},
      { type: "lesson", content: {
        en: "🛡 No website or DM can give you free V-Bucks or Robux. These offers are ALWAYS scams designed to steal your account. Only purchase through official stores.",
        ru: "🛡 Никакой сайт или сообщение не может дать бесплатные V-Bucks или Robux. Это ВСЕГДА мошенничество для кражи аккаунта."
      }}
    ]
  },
  {
    id: "game2", cat: "game", targets: ["adult", "child"],
    emoji: "🔫", badge: "phishing", badgeColor: "red",
    title: { en: "Fake Steam Trade Bot (CS2)", ru: "Поддельный Steam-бот (CS2)" },
    desc: { en: "Scammer impersonating Steam support", ru: "Мошенник под видом поддержки Steam" },
    steps: [
      { type: "message", content: {
        en: "💬 Steam chat from 'CS2_TradeBotPro':\n\nHey! I want to buy your AK-47 skin for £150 real money. Send your items to my bot first for verification:\n\nsteamcommunity-trade.xyz/offer/XXXXXXX\n\n✅ Verified by Steam Support\n⚡ Transfer instant.",
        ru: "💬 Steam чат от 'CS2_TradeBotPro':\n\nПривет! Хочу купить твой скин AK-47 за €150. Сначала отправь предметы на моего бота:\n\nsteamcommunity-trade.xyz/offer/XXXXXXX\n\n✅ Проверено Steam Support"
      }},
      { type: "choice", prompt: { en: "What do you spot first?", ru: "Что вы заметите первым?" }, choices: [
        { text: { en: "The link says steamcommunity-trade.xyz — not the real Steam site", ru: "Ссылка ведёт на steamcommunity-trade.xyz — не настоящий сайт Steam" }, correct: true,
          feedback: { en: "Exactly right! The real Steam domain is ONLY steamcommunity.com. Never send items before receiving payment.", ru: "Именно! Настоящий домен Steam — только steamcommunity.com." }},
        { text: { en: "It says 'Verified by Steam Support' so it must be real", ru: "Написано 'Проверено Steam Support' — значит настоящее" }, correct: false,
          feedback: { en: "Scammers can write anything they want. 'Verified' badges in chat messages mean nothing.", ru: "Мошенники могут написать что угодно. 'Проверено' в чат-сообщении ничего не значит." }},
        { text: { en: "The price is very good, so I should act fast", ru: "Цена хорошая, надо действовать быстро" }, correct: false,
          feedback: { en: "High price + urgency = classic manipulation. Legitimate buyers never rush.", ru: "Высокая цена + срочность = классическая манипуляция." }}
      ]},
      { type: "lesson", content: { en: "🛡 Golden rules: Real Steam = steamcommunity.com only. Payment first, items second. Use official Steam Trade system.", ru: "🛡 Золотые правила: Настоящий Steam = только steamcommunity.com. Сначала оплата, потом предметы." }}
    ]
  },
  {
    id: "game3", cat: "game", targets: ["child"],
    emoji: "🎲", badge: "smishing", badgeColor: "purple",
    title: { en: "Free Robux Generator (Roblox)", ru: "Генератор бесплатных Robux (Roblox)" },
    desc: { en: "Fake generator site asking for your password", ru: "Поддельный сайт, просящий пароль от Roblox" },
    steps: [
      { type: "message", content: {
        en: "💬 Your online friend sends:\n\n\"OMG I just got 100,000 FREE ROBUX from this site!!\n👉 robux-generator-2025.net\n\nYou just enter your username and password and they add Robux. It actually WORKS I promise!!\"",
        ru: "💬 Ваш онлайн-друг пишет:\n\n«О боже, я только что получил 100 000 БЕСПЛАТНЫХ ROBUX с этого сайта!!\n👉 robux-generator-2025.net\n\nПросто вводишь логин и пароль. Это РЕАЛЬНО РАБОТАЕТ!!»"
      }},
      { type: "breathe", content: {
        en: "⚠️ Even a FRIEND can be scammed and unknowingly spread scams. This is called 'account compromise spreading'. Take a breath and think.",
        ru: "⚠️ Даже ДРУГ может стать жертвой мошенников и невольно распространять их. Подумайте."
      }},
      { type: "choice", prompt: { en: "What do you do?", ru: "Что вы делаете?" }, choices: [
        { text: { en: "Visit the site — my friend says it works!", ru: "Захожу на сайт — друг говорит, что работает!" }, correct: false,
          feedback: { en: "Your friend's account was already hacked. Robux generators are 100% fake.", ru: "Аккаунт друга уже взломан. Генераторы Robux — полная ложь." }},
        { text: { en: "Tell a parent or adult about this message", ru: "Рассказываю родителям об этом сообщении" }, correct: true,
          feedback: { en: "Perfect! Tell an adult, and also warn your real friend that their account may be hacked.", ru: "Отлично! Расскажи взрослым и предупреди друга, что его аккаунт могли взломать." }},
        { text: { en: "Only enter my username, not my password", ru: "Введу только логин, но не пароль" }, correct: false,
          feedback: { en: "Even your username is valuable to scammers. Never visit these sites.", ru: "Даже логин ценен для мошенников. Никогда не заходите на такие сайты." }}
      ]},
      { type: "lesson", content: { en: "🛡 No website can give you free Robux. If someone claims they can — they want your login. Always go to parents.", ru: "🛡 Никакой сайт не может дать бесплатный Robux. Всегда обращайся к родителям." }}
    ]
  },
  // ── EMAIL ──
  {
    id: "email1", cat: "email", targets: ["adult", "elderly"],
    emoji: "📧", badge: "phishing", badgeColor: "red",
    title: { en: "Bank Phishing Email", ru: "Фишинговое письмо от \"банка\"" },
    desc: { en: "Fake security alert asking to verify account", ru: "Фальшивое уведомление с просьбой подтвердить аккаунт" },
    steps: [
      { type: "message", content: {
        en: "📧 From: security@lloyds-bank-verification.com\nSubject: ⚠️ URGENT: Unusual login detected\n\nDear Customer,\n\nWe have detected unusual login activity from a device in Romania.\n\nTo protect your account, verify within 24 HOURS or your account will be suspended.\n\n[VERIFY MY ACCOUNT NOW]\n\nLloyds Bank Security Team",
        ru: "📧 От: security@lloyds-bank-verification.com\nТема: ⚠️ СРОЧНО: Подозрительный вход\n\nУважаемый клиент,\n\nМы обнаружили подозрительный вход с устройства в Румынии.\n\nПодтвердите личность в течение 24 ЧАСОВ.\n\n[ПОДТВЕРДИТЬ АККАУНТ СЕЙЧАС]"
      }},
      { type: "choice", prompt: { en: "What are the red flags here?", ru: "Какие здесь тревожные признаки?" }, choices: [
        { text: { en: "The email is 'lloyds-bank-verification.com' — not lloyds.com", ru: "Email: 'lloyds-bank-verification.com' — не lloyds.com" }, correct: true,
          feedback: { en: "Spot on! Real banks use their own domain. Urgency ('24 HOURS'), fear ('suspended'), and a CTA button are classic phishing.", ru: "Правильно! Настоящие банки используют свой домен. Срочность и кнопка — классика фишинга." }},
        { text: { en: "The bank knows about the foreign login, so it must be real", ru: "Банк знает о входе — значит настоящее" }, correct: false,
          feedback: { en: "Scammers use believable details. Always verify by logging into your bank's official app directly.", ru: "Мошенники используют правдоподобные детали. Проверяйте через официальное приложение." }},
        { text: { en: "I should click to check if my account is at risk", ru: "Надо нажать, чтобы проверить аккаунт" }, correct: false,
          feedback: { en: "Never click links in security emails. Open your bank app directly.", ru: "Никогда не нажимайте ссылки в письмах. Откройте приложение банка." }}
      ]},
      { type: "lesson", content: { en: "🛡 Phishing formula: Trusted brand + Urgency/Fear + Link to fake site = Phishing. Always type bank address yourself.", ru: "🛡 Формула фишинга: Бренд + Срочность + Ссылка = Фишинг. Всегда вводите адрес банка сами." }}
    ]
  },
  {
    id: "email2", cat: "email", targets: ["adult"],
    emoji: "💼", badge: "phishing", badgeColor: "red",
    title: { en: "CEO / BEC Fraud (Work Email)", ru: "CEO-мошенничество на работе (BEC)" },
    desc: { en: "Your 'boss' urgently needs a bank transfer", ru: "Ваш 'начальник' срочно просит перевести деньги" },
    steps: [
      { type: "message", content: {
        en: "📧 From: james.wilson@company-finance-dept.net\nSubject: Urgent wire transfer needed\n\nI'm in a meeting and can't take calls. Please process an urgent transfer of €48,500 to our new supplier before 3pm today.\n\nAccount: IBAN DE89 3704 0044 0532 0130 00\n\nJames Wilson\nCFO",
        ru: "📧 От: james.wilson@company-finance-dept.net\nТема: Срочный банковский перевод\n\nЯ на встрече, не могу говорить. Проведите срочный перевод на €48 500 нашему новому поставщику до 15:00.\n\nДжеймс Уилсон\nФинансовый директор"
      }},
      { type: "breathe", content: {
        en: "This is Business Email Compromise (BEC). The domain 'company-finance-dept.net' is NOT your company domain.",
        ru: "Это мошенничество через корпоративную почту (BEC). Домен — не домен вашей компании."
      }},
      { type: "choice", prompt: { en: "What is the right action?", ru: "Какое правильное действие?" }, choices: [
        { text: { en: "Process the transfer — it's from my CFO", ru: "Провожу перевод — это мой финансовый директор" }, correct: false,
          feedback: { en: "This is exactly how companies lose thousands. The email came from a fake domain.", ru: "Именно так компании теряют тысячи евро." }},
        { text: { en: "Call James on his known number to verify", ru: "Звоню Джеймсу на известный мне номер" }, correct: true,
          feedback: { en: "Correct! Call directly on a number you already have saved.", ru: "Правильно! Позвоните на известный вам номер." }},
        { text: { en: "Reply to the email asking for details", ru: "Отвечаю на письмо с вопросами" }, correct: false,
          feedback: { en: "Replying contacts the scammer, not your real CFO.", ru: "Ответ на письмо — это общение с мошенником." }}
      ]},
      { type: "lesson", content: { en: "🛡 BEC rule: Any unusual payment request via email requires a phone call to verify.", ru: "🛡 Правило BEC: Любой необычный запрос о платеже требует звонка для проверки." }}
    ]
  },
  // ── SMS ──
  {
    id: "sms1", cat: "sms", targets: ["adult", "elderly"],
    emoji: "📱", badge: "smishing", badgeColor: "yellow",
    title: { en: "Parcel Delivery Smishing", ru: "SMS про посылку (\"смишинг\")" },
    desc: { en: "Fake delivery fee request", ru: "Запрос фальшивой оплаты доставки" },
    steps: [
      { type: "message", content: {
        en: "📱 SMS from +44 7700 900847:\n\nRoyalMail: Your parcel (RW394821GB) could not be delivered. Customs fee of £2.99 outstanding.\n\nPay now: rm-deliver-pay.xyz/pay\n\nIgnoring will result in return.",
        ru: "📱 SMS от неизвестного номера:\n\nRoyalMail: Ваша посылка не доставлена. Неоплаченный таможенный сбор: £2.99.\n\nОплатите: rm-deliver-pay.xyz/pay"
      }},
      { type: "choice", prompt: { en: "What do you do?", ru: "Что вы делаете?" }, choices: [
        { text: { en: "Pay the £2.99 — it's only small", ru: "Плачу £2,99 — это мелочь" }, correct: false,
          feedback: { en: "The £2.99 is a hook. Once you enter card details on that fake site, they steal your full card number.", ru: "£2,99 — это приманка. Введя данные карты, вы отдаёте их мошенникам." }},
        { text: { en: "Delete the SMS and check on royalmail.com", ru: "Удаляю SMS и проверяю на royalmail.com" }, correct: true,
          feedback: { en: "Perfect! Real delivery services have your parcel info on their official website.", ru: "Правильно! Проверяйте посылки только на официальном сайте." }},
        { text: { en: "Click the link to check if I have a parcel", ru: "Нажимаю ссылку чтобы проверить" }, correct: false,
          feedback: { en: "Even clicking can install malware. Delete the SMS and visit the real site.", ru: "Даже переход по ссылке может установить вредоносную программу." }}
      ]},
      { type: "lesson", content: { en: "🛡 Real delivery companies never ask for payment via SMS links.", ru: "🛡 Настоящие службы никогда не просят оплату через SMS-ссылки." }}
    ]
  },
  {
    id: "sms2", cat: "sms", targets: ["adult", "elderly"],
    emoji: "🏦", badge: "smishing", badgeColor: "yellow",
    title: { en: "Bank Account 'Frozen' SMS", ru: "SMS о 'замороженном' счёте" },
    desc: { en: "Fake security SMS about your bank account", ru: "Поддельное SMS о банковском счёте" },
    steps: [
      { type: "message", content: {
        en: "📱 SMS from 'SecureBank':\n\n⚠️ ALERT: Unusual transaction of £1,247.00 detected. If NOT you, click to freeze:\n\nsecurebank-fraud-stop.com/freeze\n\nOr call 0800 234 5678",
        ru: "📱 SMS от 'SecureBank':\n\n⚠️ ВНИМАНИЕ: Подозрительная транзакция на £1 247. Нажмите для заморозки:\n\nsecurebank-fraud-stop.com/freeze"
      }},
      { type: "breathe", content: {
        en: "You feel panic — a large sum. This is deliberate. Scammers pick specific amounts. Stop. Breathe.",
        ru: "Вы чувствуете панику — упомянута большая сумма. Это намеренно. Остановитесь."
      }},
      { type: "choice", prompt: { en: "What is your next action?", ru: "Ваше следующее действие?" }, choices: [
        { text: { en: "Call the number in the SMS", ru: "Звоню по номеру из SMS" }, correct: false,
          feedback: { en: "That's the scammer's number. Never call numbers from SMS.", ru: "Это номер мошенника. Никогда не звоните по номеру из SMS." }},
        { text: { en: "Open my bank's official app", ru: "Открываю официальное приложение банка" }, correct: true,
          feedback: { en: "Correct. If there's a real transaction, it will show in your official app.", ru: "Правильно. Настоящая транзакция будет в официальном приложении." }},
        { text: { en: "Click the link to freeze account", ru: "Нажимаю ссылку для заморозки" }, correct: false,
          feedback: { en: "'securebank-fraud-stop.com' is a fake site.", ru: "'securebank-fraud-stop.com' — поддельный сайт." }}
      ]},
      { type: "lesson", content: { en: "🛡 Your bank's real SMS will NEVER contain links to external websites.", ru: "🛡 Настоящее SMS от банка НИКОГДА не содержит ссылок на сторонние сайты." }}
    ]
  },
  // ── CALLS ──
  {
    id: "call1", cat: "call", targets: ["adult", "elderly"],
    emoji: "📞", badge: "vishing", badgeColor: "red",
    title: { en: "'Your Bank' Vishing Call", ru: "Вишинговый звонок 'из банка'" },
    desc: { en: "Caller poses as bank fraud team", ru: "Звонящий притворяется отделом безопасности" },
    steps: [
      { type: "message", content: {
        en: "📞 Incoming call (caller ID: NatWest Bank)\n\nCaller: \"I'm calling from NatWest Fraud Prevention. We've detected a transaction of £890. I'll need your full card number, CVV, and online banking password.\"",
        ru: "📞 Входящий звонок (определитель: NatWest Bank)\n\nЗвонящий: «Звоню из отдела по предотвращению мошенничества. Зафиксирована транзакция на £890. Мне нужен номер карты, CVV и пароль.»"
      }},
      { type: "breathe", content: {
        en: "Caller ID can be FAKED (spoofed). The fact it says 'NatWest' means nothing. They ask for card number, CVV AND password — no legitimate person needs all three.",
        ru: "Определитель номера может быть ПОДДЕЛАН. Они просят номер карты, CVV И пароль — ни один настоящий сотрудник так не делает."
      }},
      { type: "choice", prompt: { en: "What is the correct response?", ru: "Какой правильный ответ?" }, choices: [
        { text: { en: "Give them my details — caller ID shows my bank", ru: "Называю данные — определитель показывает мой банк" }, correct: false,
          feedback: { en: "Caller ID is easily faked. Banks NEVER ask for full card number, CVV, and password.", ru: "Определитель легко подделать. Банки НИКОГДА не просят все данные вместе." }},
        { text: { en: "Hang up and call the number on my bank card", ru: "Кладу трубку и звоню на номер с карты" }, correct: true,
          feedback: { en: "Perfect! Hang up, find your card, call the number printed on the back.", ru: "Отлично! Положите трубку и позвоните на номер с обратной стороны карты." }},
        { text: { en: "Ask them to prove they work for the bank", ru: "Прошу доказать, что они из банка" }, correct: false,
          feedback: { en: "Scammers can 'prove' anything from data leaks. Hang up and call yourself.", ru: "Мошенники могут 'доказать' что угодно. Положите трубку." }}
      ]},
      { type: "lesson", content: { en: "🛡 Banks NEVER call asking for PIN, password, or full card number. Hang up and call back yourself.", ru: "🛡 Банки НИКОГДА не звонят с просьбой назвать PIN, пароль или номер карты." }}
    ]
  },
  {
    id: "call2", cat: "call", targets: ["elderly"],
    emoji: "💻", badge: "vishing", badgeColor: "red",
    title: { en: "Tech Support Scam Call", ru: "Звонок 'технической поддержки'" },
    desc: { en: "\"Microsoft\" calls about a virus", ru: "\"Microsoft\" звонит про вирус" },
    steps: [
      { type: "message", content: {
        en: "📞 Incoming call from unknown number\n\nCaller: \"Hello, I'm from Microsoft Technical Support. Your computer has been infected with a dangerous virus. I need you to turn on your computer so I can connect remotely to fix this.\"",
        ru: "📞 Входящий звонок\n\nЗвонящий: «Здравствуйте, звоню из технической поддержки Microsoft. Ваш компьютер заражён вирусом. Включите компьютер, чтобы я мог подключиться удалённо.»"
      }},
      { type: "choice", prompt: { en: "How do you respond?", ru: "Как вы отвечаете?" }, choices: [
        { text: { en: "Turn on computer and let them connect", ru: "Включаю и даю удалённый доступ" }, correct: false,
          feedback: { en: "Remote access gives them complete control. They can steal bank details and install malware. Microsoft NEVER calls unprompted.", ru: "Удалённый доступ = полный контроль. Microsoft НИКОГДА не звонит сам." }},
        { text: { en: "Hang up — Microsoft never calls about viruses", ru: "Кладу трубку — Microsoft не звонит про вирусы" }, correct: true,
          feedback: { en: "Exactly! Microsoft, Apple, Google never proactively call about viruses.", ru: "Совершенно верно! Microsoft, Apple, Google не звонят по поводу вирусов." }},
        { text: { en: "Ask what the virus is called", ru: "Спрашиваю название вируса" }, correct: false,
          feedback: { en: "Scammers have convincing technical answers. Just hang up.", ru: "Мошенники обучены давать технические ответы. Просто положите трубку." }}
      ]},
      { type: "lesson", content: { en: "🛡 Real tech companies do NOT call you about viruses. If worried, contact a local technician yourself.", ru: "🛡 Настоящие компании НЕ звонят по поводу вирусов. Обратитесь к местному специалисту." }}
    ]
  },
  {
    id: "call3", cat: "call", targets: ["adult", "elderly"],
    emoji: "🏥", badge: "vishing", badgeColor: "red",
    title: { en: "Health / Medicare Scam Call", ru: "Звонок о 'медицинских услугах'" },
    desc: { en: "Fake health official demands payment", ru: "Поддельный медработник требует оплату" },
    steps: [
      { type: "message", content: {
        en: "📞 Incoming call (caller ID: NHS / Health Service)\n\nCaller: \"Due to system changes, all patients must re-verify their details or lose access to health services. I'll need your date of birth, NHS number, and a £15 admin fee by bank transfer.\"",
        ru: "📞 Входящий звонок\n\nЗвонящий: «В связи с изменениями системы все пациенты должны подтвердить данные иначе потеряют доступ к медпомощи. Нужна дата рождения, номер полиса и сбор €15.»"
      }},
      { type: "choice", prompt: { en: "What are the warning signs?", ru: "Какие предупреждающие признаки?" }, choices: [
        { text: { en: "Health services charging an 'admin fee' by bank transfer", ru: "Медслужба берёт 'сбор' банковским переводом" }, correct: true,
          feedback: { en: "Exactly. Legitimate health services never charge fees over the phone via bank transfer.", ru: "Именно. Настоящие медицинские службы никогда не берут сборы по телефону." }},
        { text: { en: "They know my name, so they must be legitimate", ru: "Они знают моё имя — значит настоящие" }, correct: false,
          feedback: { en: "Personal data is often available from data leaks.", ru: "Личные данные часто доступны из утечек данных." }},
        { text: { en: "I need to comply or I'll lose healthcare", ru: "Нужно выполнить требование" }, correct: false,
          feedback: { en: "This fear is exactly what scammers exploit. Real health services send written letters.", ru: "Этот страх — именно то, что эксплуатируют мошенники." }}
      ]},
      { type: "lesson", content: { en: "🛡 Healthcare scam signals: payment by phone, threat of losing services, urgency. Real health services send written letters.", ru: "🛡 Признаки: оплата по телефону, угроза лишения услуг, срочность. Настоящие медслужбы присылают письма." }}
    ]
  },
  // ── CHILD-SPECIFIC ──
  {
    id: "child1", cat: "child", targets: ["child"],
    emoji: "🎭", badge: "grooming", badgeColor: "red",
    title: { en: "Stranger Pretending to be a Kid", ru: "Незнакомец притворяется ровесником" },
    desc: { en: "Online 'friend' asks to meet in person", ru: "Онлайн-'друг' просит встретиться" },
    steps: [
      { type: "message", content: {
        en: "💬 New Roblox friend 'CoolGamer2015':\n\n\"Hey we should totally meet up IRL! I live near your school. What's your address? Don't tell your parents — they won't understand. I'll bring you a present! 🎁\"",
        ru: "💬 Новый друг в Roblox 'CoolGamer2015':\n\n«Давай встретимся! Я живу рядом с твоей школой. Какой у тебя адрес? Не говори родителям — они не поймут. Принесу тебе подарок! 🎁»"
      }},
      { type: "breathe", content: {
        en: "🚨 THREE HUGE RED FLAGS: (1) Asks for your address (2) Says 'don't tell your parents' (3) Offers presents. This is a dangerous stranger.",
        ru: "🚨 ТРИ ОГРОМНЫХ КРАСНЫХ ФЛАГА: (1) Просит адрес (2) Говорит 'не говори родителям' (3) Предлагает подарки. Это опасный незнакомец."
      }},
      { type: "choice", prompt: { en: "What do you do?", ru: "Что ты делаешь?" }, choices: [
        { text: { en: "Tell them my address — they seem nice", ru: "Скажу адрес — они хорошие" }, correct: false,
          feedback: { en: "NEVER give your address to someone you only know online. Someone who says 'don't tell your parents' is hiding something dangerous.", ru: "НИКОГДА не давай адрес тем, кого знаешь только в интернете!" }},
        { text: { en: "Tell my parents and show the messages", ru: "Рассказываю родителям и показываю переписку" }, correct: true,
          feedback: { en: "PERFECT! This is exactly right. Show everything to your parents or a teacher right away. You did nothing wrong — this person is the bad one.", ru: "ОТЛИЧНО! Покажи всё родителям или учителю. Ты ни в чём не виноват — плохой человек это он." }},
        { text: { en: "Meet them but bring a friend", ru: "Встречусь, но возьму друга" }, correct: false,
          feedback: { en: "Meeting strangers from the internet is NEVER safe, even with friends. Only meet people you know in real life.", ru: "Встречаться с незнакомцами из интернета НИКОГДА не безопасно." }}
      ]},
      { type: "lesson", content: { en: "🛡 Rule for life: If someone online says 'don't tell your parents' — ALWAYS tell your parents. That's the biggest red flag of all.", ru: "🛡 Правило на всю жизнь: Если кто-то в интернете говорит 'не говори родителям' — ВСЕГДА рассказывай родителям." }}
    ]
  },
  // ── DEEPFAKE scenarios ──
  {
    id: "df-scenario-ceo", cat: "deepfake", targets: ["adult"],
    emoji: "👔", badge: "deepfake", badgeColor: "red",
    title: { en: "Deepfake CEO Video Call ($25M Arup Case)", ru: "Дипфейк-звонок от CEO (Дело Arup на $25 млн)" },
    desc: { en: "Your CFO appears on a video call with urgent wire transfer instructions", ru: "Ваш финансовый директор появляется на видеозвонке с срочными инструкциями по переводу" },
    steps: [
      { type: "message", content: {
        en: "📹 You join a video conference. Your CFO and two other executives are already on the call. The CFO says:\n\n'Good, you're here. We need to process 15 wire transfers totaling $25 million to our Hong Kong accounts immediately. This is a confidential acquisition — do not discuss with anyone else. I'll send the account details now.'",
        ru: "📹 Вы присоединяетесь к видеоконференции. Ваш финансовый директор и два других руководителя уже на звонке. CFO говорит:\n\n«Хорошо, ты здесь. Нам нужно обработать 15 банковских переводов на общую сумму $25 млн на наши счета в Гонконге немедленно. Это конфиденциальная сделка — ни с кем не обсуждай. Сейчас отправлю реквизиты.»"
      }},
      { type: "breathe" },
      { type: "choice", prompt: { en: "Your CFO looks and sounds exactly like them. What do you do?", ru: "Ваш CFO выглядит и звучит точно как настоящий. Что вы делаете?" }, choices: [
        { text: { en: "Process the transfers — it's the CFO on video", ru: "Выполнить переводы — это же CFO на видео" }, correct: false, feedback: { en: "❌ This is exactly what happened at Arup in 2024. All 'executives' were AI deepfakes. $25M was lost.", ru: "❌ Именно так произошло в Arup в 2024 году. Все «руководители» были ИИ-дипфейками. Потеряно $25 млн." }},
        { text: { en: "Ask a personal question only the real CFO would know", ru: "Задать личный вопрос, на который ответит только настоящий CFO" }, correct: false, feedback: { en: "⚠️ Good instinct, but sophisticated deepfakes can use pre-collected personal info. Better to verify through a separate channel.", ru: "⚠️ Хороший инстинкт, но продвинутые дипфейки могут использовать заранее собранную информацию. Лучше проверить по отдельному каналу." }},
        { text: { en: "Hang up and call CFO on their known personal number", ru: "Положить трубку и позвонить CFO на его известный личный номер" }, correct: true, feedback: { en: "✅ Correct! Always verify urgent financial requests through a separate, known communication channel. No legitimate executive would object.", ru: "✅ Верно! Всегда проверяйте срочные финансовые запросы через отдельный, известный канал связи." }},
      ]},
      { type: "lesson", content: { en: "🛡 REAL CASE: In 2024, engineering giant Arup lost $25M when an employee was tricked by a deepfake video call. All 'executives' were AI-generated.\n\n✅ Rule: ANY urgent financial request must be verified through a separate channel.\n✅ Use dual-approval processes for all wire transfers.\n✅ Establish code words for sensitive discussions.", ru: "🛡 РЕАЛЬНЫЙ СЛУЧАЙ: В 2024 году инженерный гигант Arup потерял $25 млн, когда сотрудник был обманут дипфейк-видеозвонком.\n\n✅ Правило: ЛЮБОЙ срочный финансовый запрос проверяйте по отдельному каналу.\n✅ Используйте двойное подтверждение для всех переводов.\n✅ Установите кодовые слова для конфиденциальных обсуждений." }}
    ]
  },
  {
    id: "df-scenario-grandchild", cat: "deepfake", targets: ["elderly"],
    emoji: "👴", badge: "deepfake", badgeColor: "red",
    title: { en: "Grandchild Voice Clone Emergency", ru: "Клон голоса внука — экстренная ситуация" },
    desc: { en: "A call from your 'grandchild' in trouble, needing money urgently", ru: "Звонок от «внука» в беде, которому срочно нужны деньги" },
    steps: [
      { type: "message", content: {
        en: "📞 Your phone rings. It sounds exactly like your grandson:\n\n*sobbing* 'Grandma! It's me, Alex! I got into a car accident and I've been arrested. I need $5,000 for bail right now. Please don't call mom — she'll be so disappointed in me. Can you buy gift cards and read me the numbers?'",
        ru: "📞 Звонит телефон. Голос звучит точно как ваш внук:\n\n*всхлипывая* «Бабушка! Это я, Алёша! Я попал в аварию и меня задержали. Мне нужно 500 000 на залог прямо сейчас. Пожалуйста, не звони маме — она расстроится. Можешь купить подарочные карты и продиктовать мне номера?»"
      }},
      { type: "breathe" },
      { type: "choice", prompt: { en: "The voice sounds exactly like your grandson. What do you do?", ru: "Голос звучит точно как ваш внук. Что вы делаете?" }, choices: [
        { text: { en: "Buy gift cards and give the numbers — he's in trouble!", ru: "Купить подарочные карты и дать номера — он в беде!" }, correct: false, feedback: { en: "❌ This is the #1 deepfake scam targeting seniors. AI can clone a voice from just 3 seconds of social media audio. No bail is ever paid with gift cards.", ru: "❌ Это мошенничество №1 с дипфейками, нацеленное на пожилых. ИИ может клонировать голос из 3 секунд аудио из соцсетей. Залог никогда не оплачивают подарочными картами." }},
        { text: { en: "Hang up and call grandson on his real number", ru: "Повесить трубку и позвонить внуку на его настоящий номер" }, correct: true, feedback: { en: "✅ Perfect! Always verify through a known number. Real grandchildren will be glad you checked.", ru: "✅ Отлично! Всегда проверяйте по известному номеру. Настоящий внук будет рад, что вы проверили." }},
        { text: { en: "Ask him to prove it's him with a family code word", ru: "Попросить назвать семейное кодовое слово" }, correct: true, feedback: { en: "✅ Great if you have a code word! If not, hang up and call back on their known number.", ru: "✅ Отлично, если у вас есть кодовое слово! Если нет — повесьте трубку и перезвоните на его номер." }},
      ]},
      { type: "lesson", content: { en: "🛡 Voice cloning needs only 3 seconds of audio from social media.\n\n✅ Set up a family code word that only your family knows.\n✅ NEVER pay bail with gift cards — this is always a scam.\n✅ 'Don't tell parents' = biggest red flag.\n✅ Hang up and call the person directly.", ru: "🛡 Для клонирования голоса нужно всего 3 секунды аудио из соцсетей.\n\n✅ Установите семейное кодовое слово.\n✅ НИКОГДА не платите залог подарочными картами — это всегда мошенничество.\n✅ «Не говори родителям» = главный красный флаг.\n✅ Повесьте трубку и позвоните человеку напрямую." }}
    ]
  },
  {
    id: "df-scenario-influencer", cat: "deepfake", targets: ["child"],
    emoji: "🎭", badge: "deepfake", badgeColor: "red",
    title: { en: "Fake YouTuber Deepfake DM", ru: "Фейковый ютубер — дипфейк-сообщение" },
    desc: { en: "Your favorite YouTuber sends you a personal video message with a 'special offer'", ru: "Твой любимый ютубер отправляет личное видеосообщение с «особым предложением»" },
    steps: [
      { type: "message", content: {
        en: "📱 You get a DM with a video from what looks like your favorite YouTuber:\n\n🎥 'Hey! It's me, MrBeast! I'm giving away 10,000 FREE Robux to my top 100 fans this week! You've been selected! Just click the link below and enter your Roblox username and password to claim your reward. Hurry — only 12 spots left! 🎉'\n\nThe video looks real — same face, same voice!",
        ru: "📱 Тебе приходит ЛС с видео от твоего любимого ютубера:\n\n🎥 «Привет! Это я, MrBeast! Дарю 10 000 БЕСПЛАТНЫХ Робуксов 100 лучшим фанатам на этой неделе! Ты выбран! Просто перейди по ссылке и введи логин и пароль от Roblox, чтобы забрать награду. Спеши — осталось 12 мест! 🎉»\n\nВидео выглядит настоящим — то же лицо, тот же голос!"
      }},
      { type: "breathe" },
      { type: "choice", prompt: { en: "The video looks exactly like the real YouTuber! What do you do?", ru: "Видео выглядит точно как настоящий ютубер! Что ты делаешь?" }, choices: [
        { text: { en: "Click the link and enter my password — it's really them!", ru: "Перейти по ссылке и ввести пароль — это же правда они!" }, correct: false, feedback: { en: "❌ NEVER enter your password from a DM link! This is a deepfake — AI can copy anyone's face and voice. Your account would be stolen.", ru: "❌ НИКОГДА не вводи пароль по ссылке из ЛС! Это дипфейк — ИИ может скопировать любое лицо и голос. Твой аккаунт украдут." }},
        { text: { en: "Check if this is from the official verified channel", ru: "Проверить, это с официального подтверждённого канала?" }, correct: true, feedback: { en: "✅ Smart! Check the account — real influencers have verified badges and millions of followers. Fake accounts have few followers and were recently created.", ru: "✅ Молодец! Проверь аккаунт — у настоящих блогеров есть галочка и миллионы подписчиков. У фейков мало подписчиков и аккаунт создан недавно." }},
        { text: { en: "Tell a parent or trusted adult about this", ru: "Рассказать родителям или взрослому, которому доверяю" }, correct: true, feedback: { en: "✅ Always the right choice! Adults can help you check if something is real or fake.", ru: "✅ Всегда правильный выбор! Взрослые помогут проверить, настоящее это или фейк." }},
      ]},
      { type: "lesson", content: { en: "🛡 AI can now copy ANYONE's face and voice from their videos.\n\n✅ Real YouTubers NEVER ask for your password in DMs.\n✅ Check for verified badge ✓ and follower count.\n✅ If it asks for your password — it's ALWAYS a scam.\n✅ When in doubt — tell a parent!", ru: "🛡 ИИ теперь может скопировать лицо и голос ЛЮБОГО человека из их видео.\n\n✅ Настоящие ютуберы НИКОГДА не просят пароль в ЛС.\n✅ Проверяй наличие галочки ✓ и количество подписчиков.\n✅ Если просят пароль — это ВСЕГДА мошенничество.\n✅ Сомневаешься — расскажи родителям!" }}
    ]
  },
  {
    id: "df-scenario-bank", cat: "deepfake", targets: ["elderly", "adult"],
    emoji: "🏦", badge: "deepfake", badgeColor: "red",
    title: { en: "Deepfake Bank Officer Video Call", ru: "Дипфейк-видеозвонок от сотрудника банка" },
    desc: { en: "A 'bank officer' calls via video about suspicious activity on your account", ru: "«Сотрудник банка» звонит по видео о подозрительной активности на вашем счёте" },
    steps: [
      { type: "message", content: {
        en: "📹 You receive a video call from a person in a bank uniform with an official-looking badge:\n\n'Good afternoon. I'm calling from your bank's security department. We've detected 3 unauthorized transactions on your account totaling $12,000. To protect your savings, you need to transfer your funds to a temporary safe account immediately. I'll guide you through the process. Please have your card and PIN ready.'",
        ru: "📹 Вам поступает видеозвонок от человека в форме банка с официальным удостоверением:\n\n«Добрый день. Я звоню из службы безопасности вашего банка. Мы обнаружили 3 несанкционированные транзакции на вашем счёте на общую сумму 1 200 000 руб. Для защиты ваших сбережений нужно перевести средства на временный безопасный счёт немедленно. Я проведу вас через процесс. Приготовьте карту и PIN-код.»"
      }},
      { type: "breathe" },
      { type: "choice", prompt: { en: "The person looks professional in a bank uniform. What do you do?", ru: "Человек выглядит профессионально в форме банка. Что вы делаете?" }, choices: [
        { text: { en: "Follow instructions — they look official", ru: "Следовать инструкциям — они выглядят официально" }, correct: false, feedback: { en: "❌ Banks NEVER initiate video calls or ask you to transfer to 'safe accounts'. The uniform and badge are AI-generated.", ru: "❌ Банки НИКОГДА не звонят по видео и не просят переводить на «безопасные счета». Форма и удостоверение сгенерированы ИИ." }},
        { text: { en: "Hang up and call the bank's official number myself", ru: "Повесить трубку и позвонить на официальный номер банка" }, correct: true, feedback: { en: "✅ Correct! Always call your bank yourself using the number on your card or their official website.", ru: "✅ Верно! Всегда звоните в банк сами по номеру с карты или с официального сайта." }},
        { text: { en: "Ask for their employee ID to verify later", ru: "Спросить табельный номер для проверки позже" }, correct: false, feedback: { en: "⚠️ They'll give you a fake ID. Don't engage — hang up immediately and call your bank directly.", ru: "⚠️ Они дадут вам фальшивый номер. Не общайтесь — сразу повесьте трубку и позвоните в банк." }},
      ]},
      { type: "lesson", content: { en: "🛡 Banks NEVER:\n• Initiate video calls to customers\n• Ask to transfer to 'safe accounts'\n• Ask for your PIN or full card number\n• Create urgency about 'unauthorized transactions'\n\n✅ Always call the bank yourself using the number on your card.", ru: "🛡 Банки НИКОГДА:\n• Не звонят клиентам по видео\n• Не просят переводить на «безопасные счета»\n• Не спрашивают PIN или полный номер карты\n• Не создают срочность о «несанкционированных операциях»\n\n✅ Всегда звоните в банк сами по номеру с карты." }}
    ]
  },
];

export const SCENARIO_CATEGORIES = [
  { key: "all", label_en: "All", label_ru: "Все" },
  { key: "game", label_en: "🎮 Gaming", label_ru: "🎮 Игры" },
  { key: "email", label_en: "📧 Email", label_ru: "📧 Email" },
  { key: "sms", label_en: "📱 SMS", label_ru: "📱 SMS" },
  { key: "call", label_en: "📞 Calls", label_ru: "📞 Звонки" },
  { key: "deepfake", label_en: "🎭 Deepfake", label_ru: "🎭 Дипфейк" },
  { key: "child", label_en: "🧒 Kids", label_ru: "🧒 Дети" },
];
