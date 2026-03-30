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
  {
    id: "delivery-scam",
    title_en: "Fake Delivery SMS",
    title_ru: "Поддельное SMS о доставке",
    category_en: "Smishing (SMS phishing)",
    category_ru: "Смишинг (SMS-фишинг)",
    triggerMessage_en: '📦 SMS from "PostOffice":\n\n"Your parcel is held at customs. Pay the €2.99 fee to release it: bit.ly/customs-pay\n\nDelivery will be cancelled in 24h!"',
    triggerMessage_ru: "📦 SMS от «Почта России»:\n\n«Ваша посылка задержана на таможне. Оплатите сбор 299₽ для получения: bit.ly/pochta-pay\n\nЧерез 24 часа посылка будет возвращена!»",
    triggerSender: "Post Office / Почта",
    redFlags: [
      { label_en: "📦 Unexpected parcel", label_ru: "📦 Неожиданная посылка", explanation_en: "You didn't order anything", explanation_ru: "Вы ничего не заказывали" },
      { label_en: "🔗 Shortened link", label_ru: "🔗 Короткая ссылка", explanation_en: "bit.ly hides the real destination", explanation_ru: "bit.ly скрывает настоящий адрес" },
      { label_en: "⏰ 24h deadline", label_ru: "⏰ Дедлайн 24 часа", explanation_en: "Artificial urgency to prevent thinking", explanation_ru: "Искусственная срочность, чтобы не думали" },
    ],
    options: [
      { id: "a", label_en: "Click the link and pay", label_ru: "Перейти по ссылке и оплатить", is_correct: false, feedback_en: "This link leads to a fake payment page that steals your card data!", feedback_ru: "Эта ссылка ведёт на поддельную страницу оплаты, которая украдёт данные карты!" },
      { id: "b", label_en: "Check tracking on official site", label_ru: "Проверить на сайте Почты", is_correct: true, feedback_en: "Correct! Always check delivery status on the official website.", feedback_ru: "Правильно! Всегда проверяйте статус на официальном сайте." },
      { id: "c", label_en: "Reply to ask for details", label_ru: "Ответить на SMS", is_correct: false, feedback_en: "Replying confirms your number is active for more scams.", feedback_ru: "Ответ подтверждает, что ваш номер активен для новых атак." },
    ],
    lesson_en: "Real delivery services don't ask for payment via SMS links. Always use the official app or website.",
    lesson_ru: "Настоящие службы доставки не просят оплату через ссылки в SMS. Используйте официальный сайт.",
    elderlyLesson_en: "If you get an SMS about a parcel you didn't order — it's a scam. Check on the official website or call the post office.",
    elderlyLesson_ru: "Если пришло SMS о посылке, которую вы не заказывали — это обман. Проверьте на официальном сайте или позвоните на почту.",
    childLesson_en: "Got a message about a package? Ask your parents first! Don't click links in messages. 📦🚫",
    childLesson_ru: "Пришло сообщение о посылке? Спроси родителей! Не нажимай на ссылки в сообщениях. 📦🚫",
    targetGroup: ["elderly", "child"],
  },
  {
    id: "tech-support",
    title_en: "Fake Tech Support Call",
    title_ru: "Звонок от «техподдержки»",
    category_en: "Vishing (tech support scam)",
    category_ru: "Вишинг (мошенничество техподдержки)",
    triggerMessage_en: '💻 Pop-up on screen:\n\n"⚠️ CRITICAL ALERT! Your computer is infected with 13 viruses!\nCall Microsoft Support NOW: 1-800-XXX-XXXX\n\nDO NOT close this window!"',
    triggerMessage_ru: "💻 Всплывающее окно:\n\n«⚠️ КРИТИЧЕСКАЯ ОШИБКА! Ваш компьютер заражён 13 вирусами!\nСрочно позвоните в техподдержку: 8-800-XXX-XXXX\n\nНЕ закрывайте это окно!»",
    triggerSender: "Microsoft Security / Техподдержка",
    redFlags: [
      { label_en: "😱 Scare tactics", label_ru: "😱 Запугивание", explanation_en: "Real antivirus doesn't show pop-ups with phone numbers", explanation_ru: "Настоящий антивирус не показывает номера телефонов" },
      { label_en: "📞 Call this number", label_ru: "📞 Позвоните нам", explanation_en: "Microsoft never asks you to call from a pop-up", explanation_ru: "Microsoft никогда не просит звонить из всплывающего окна" },
      { label_en: "🔒 Don't close", label_ru: "🔒 Не закрывайте", explanation_en: "Tries to trap you on the page", explanation_ru: "Пытается удержать на странице" },
    ],
    options: [
      { id: "a", label_en: "Call the number", label_ru: "Позвонить по номеру", is_correct: false, feedback_en: "They'll ask for remote access to your computer and steal your data!", feedback_ru: "Они попросят удалённый доступ к компьютеру и украдут ваши данные!" },
      { id: "b", label_en: "Close the browser completely", label_ru: "Закрыть браузер полностью", is_correct: true, feedback_en: "Correct! Just close the browser. Real viruses don't show pop-ups with phone numbers.", feedback_ru: "Правильно! Просто закройте браузер. Настоящие вирусы не показывают номера телефонов." },
      { id: "c", label_en: "Install the suggested antivirus", label_ru: "Установить предложенный антивирус", is_correct: false, feedback_en: "The 'antivirus' is actually malware that gives scammers access to your computer.", feedback_ru: "«Антивирус» — это вредоносная программа, дающая мошенникам доступ к вашему компьютеру." },
    ],
    lesson_en: "Microsoft, Apple, and Google NEVER show pop-ups with phone numbers. Just close the browser.",
    lesson_ru: "Microsoft, Apple и Google НИКОГДА не показывают номера для звонка. Просто закройте браузер.",
    elderlyLesson_en: "If your screen shows a scary message with a phone number — DON'T call! Just close everything. Ask a family member for help.",
    elderlyLesson_ru: "Если на экране страшное сообщение с номером телефона — НЕ звоните! Просто закройте всё. Попросите близких помочь.",
    childLesson_en: "Scary pop-up on screen? Don't panic! Just close the browser and tell an adult. It's not a real virus! 💻✨",
    childLesson_ru: "Страшное окно на экране? Не паникуй! Закрой браузер и скажи взрослым. Это не настоящий вирус! 💻✨",
    targetGroup: ["elderly", "child"],
  },
  {
    id: "social-giveaway",
    title_en: "Fake Social Media Giveaway",
    title_ru: "Фейковый розыгрыш в соцсетях",
    category_en: "Phishing (social media)",
    category_ru: "Фишинг (социальные сети)",
    triggerMessage_en: '🎁 Instagram DM from "@apple_official_giveaway":\n\n"🎉 You\'ve been selected to win a FREE iPhone 16! Just:\n1. Follow our page\n2. Enter your Apple ID & password at: apple-winners.com"',
    triggerMessage_ru: "🎁 Сообщение в Instagram от «@apple_official_prize»:\n\n«🎉 Вы выбраны для получения БЕСПЛАТНОГО iPhone 16! Просто:\n1. Подпишитесь на наш аккаунт\n2. Введите Apple ID и пароль: apple-winners.com»",
    triggerSender: "@apple_official_giveaway",
    redFlags: [
      { label_en: "🎁 Free prize", label_ru: "🎁 Бесплатный приз", explanation_en: "If it's too good to be true — it is", explanation_ru: "Если слишком хорошо — это обман" },
      { label_en: "🔑 Password request", label_ru: "🔑 Запрос пароля", explanation_en: "Apple NEVER asks for passwords via DM", explanation_ru: "Apple НИКОГДА не просит пароль через DM" },
      { label_en: "🌐 Fake domain", label_ru: "🌐 Поддельный домен", explanation_en: "apple-winners.com is not apple.com", explanation_ru: "apple-winners.com — это не apple.com" },
    ],
    options: [
      { id: "a", label_en: "Enter my Apple ID", label_ru: "Ввести Apple ID и пароль", is_correct: false, feedback_en: "Your account will be stolen! Apple never contacts winners through DMs.", feedback_ru: "Ваш аккаунт украдут! Apple никогда не связывается через DM." },
      { id: "b", label_en: "Report and block account", label_ru: "Пожаловаться и заблокировать", is_correct: true, feedback_en: "Perfect! Giveaways asking for passwords are always scams.", feedback_ru: "Отлично! Розыгрыши с запросом паролей — всегда мошенничество." },
      { id: "c", label_en: "Share with friends", label_ru: "Поделиться с друзьями", is_correct: false, feedback_en: "You'd be helping the scammer reach more victims!", feedback_ru: "Вы поможете мошенникам добраться до ваших друзей!" },
    ],
    lesson_en: "Real companies never ask for passwords via social media. Any 'giveaway' requiring your login is a scam.",
    lesson_ru: "Настоящие компании никогда не просят пароли в соцсетях. Любой «розыгрыш» с запросом логина — мошенничество.",
    elderlyLesson_en: "No real company gives away expensive phones through Instagram messages. If it asks for a password — it's a scam.",
    elderlyLesson_ru: "Ни одна настоящая компания не дарит телефоны через Instagram. Если просят пароль — это обман.",
    childLesson_en: "Free iPhone? 🤔 Nope! Companies don't give away phones through DMs. Never enter passwords on strange sites!",
    childLesson_ru: "Бесплатный iPhone? 🤔 Нет! Компании не раздают телефоны через сообщения. Не вводи пароли на чужих сайтах!",
    targetGroup: ["elderly", "child"],
  },
  {
    id: "messenger-hack",
    title_en: "Hacked Friend's Account",
    title_ru: "Взломанный аккаунт друга",
    category_en: "Social engineering (messenger)",
    category_ru: "Социальная инженерия (мессенджер)",
    triggerMessage_en: '💬 WhatsApp from "Mom":\n\n"Hey sweetie! I got a new phone and number. Can you send me the code that just came to your phone? I need it to set up WhatsApp. Love you! 💕"',
    triggerMessage_ru: "💬 WhatsApp от «Мамы»:\n\n«Привет, солнышко! У меня новый телефон. Пришли мне код, который тебе сейчас придёт в SMS — мне нужно настроить WhatsApp. Люблю тебя! 💕»",
    triggerSender: "Mom / Мама",
    redFlags: [
      { label_en: "📱 New number", label_ru: "📱 Новый номер", explanation_en: "Claims to have a new number", explanation_ru: "Утверждает что у неё новый номер" },
      { label_en: "🔢 Asks for code", label_ru: "🔢 Просит код", explanation_en: "SMS codes should NEVER be shared", explanation_ru: "SMS-коды НЕЛЬЗЯ никому сообщать" },
      { label_en: "💕 Emotional manipulation", label_ru: "💕 Эмоции", explanation_en: "Uses love to lower your guard", explanation_ru: "Использует чувства чтобы снизить бдительность" },
    ],
    options: [
      { id: "a", label_en: "Send the code", label_ru: "Отправить код", is_correct: false, feedback_en: "That code is to take over YOUR WhatsApp! Never share SMS codes.", feedback_ru: "Этот код — для взлома ВАШЕГО WhatsApp! Никогда не делитесь SMS-кодами." },
      { id: "b", label_en: "Call mom on her old number", label_ru: "Позвонить маме на старый номер", is_correct: true, feedback_en: "Correct! Always verify through a known contact method.", feedback_ru: "Правильно! Всегда проверяйте через известный способ связи." },
      { id: "c", label_en: "Ask a personal question", label_ru: "Задать личный вопрос", is_correct: false, feedback_en: "Scammers may know details from social media. Call directly instead.", feedback_ru: "Мошенники могут знать детали из соцсетей. Лучше позвоните напрямую." },
    ],
    lesson_en: "SMS verification codes are the keys to your accounts. NEVER share them with anyone, even family.",
    lesson_ru: "SMS-коды — это ключи к вашим аккаунтам. НИКОГДА не делитесь ими, даже с семьёй.",
    elderlyLesson_en: "If someone asks for an SMS code — even your child or grandchild — call them on their old number first. It might be a scammer.",
    elderlyLesson_ru: "Если кто-то просит SMS-код — даже ваш ребёнок или внук — позвоните им на старый номер. Это может быть мошенник.",
    childLesson_en: "If 'mom' texts from a new number asking for a code — STOP! Call mom yourself on her real number! 📞",
    childLesson_ru: "Если «мама» пишет с нового номера и просит код — СТОП! Позвони маме сам на её настоящий номер! 📞",
    targetGroup: ["elderly", "child"],
  },
  {
    id: "lottery-scam",
    title_en: "The Lottery Winner Email",
    title_ru: "Письмо о выигрыше в лотерею",
    category_en: "Phishing (advance fee scam)",
    category_ru: "Фишинг (мошенничество с предоплатой)",
    triggerMessage_en: '📧 Email from "EuroMillions Official":\n\n"CONGRATULATIONS! Your email was randomly selected and you have WON €2,500,000! To claim, pay the processing fee of €150 via wire transfer."',
    triggerMessage_ru: "📧 Письмо от «Гослото Официальный»:\n\n«ПОЗДРАВЛЯЕМ! Ваш email случайно выбран и вы ВЫИГРАЛИ 2 500 000₽! Для получения оплатите регистрационный сбор 5000₽ на карту.»",
    triggerSender: "EuroMillions / Гослото",
    redFlags: [
      { label_en: "🎰 Unexpected win", label_ru: "🎰 Неожиданный выигрыш", explanation_en: "You can't win a lottery you never entered", explanation_ru: "Нельзя выиграть в лотерею, в которой не участвовали" },
      { label_en: "💳 Fee required", label_ru: "💳 Нужна оплата", explanation_en: "Real prizes never require upfront payment", explanation_ru: "Настоящие призы не требуют предоплаты" },
      { label_en: "📧 Email lottery", label_ru: "📧 Лотерея по email", explanation_en: "No real lottery contacts winners by email", explanation_ru: "Ни одна лотерея не связывается по email" },
    ],
    options: [
      { id: "a", label_en: "Pay the fee to get the prize", label_ru: "Оплатить сбор для получения приза", is_correct: false, feedback_en: "You'll lose your money. After paying, they'll ask for more 'fees'.", feedback_ru: "Вы потеряете деньги. После оплаты попросят ещё «сборы»." },
      { id: "b", label_en: "Delete the email immediately", label_ru: "Удалить письмо", is_correct: true, feedback_en: "Correct! You can't win a lottery you never entered.", feedback_ru: "Правильно! Нельзя выиграть в лотерею, в которой не участвовали." },
      { id: "c", label_en: "Reply to ask for proof", label_ru: "Ответить и попросить доказательства", is_correct: false, feedback_en: "They'll send fake documents to convince you. Don't engage.", feedback_ru: "Они пришлют поддельные документы. Не вступайте в переписку." },
    ],
    lesson_en: "You can't win a lottery you never entered. Any 'prize' that requires payment upfront is a scam.",
    lesson_ru: "Нельзя выиграть в лотерею, в которой не участвовали. Любой «приз» с предоплатой — мошенничество.",
    elderlyLesson_en: "Remember: real prizes never require you to pay first. If you didn't buy a ticket — you didn't win.",
    elderlyLesson_ru: "Запомните: настоящие призы не требуют оплаты. Если не покупали билет — вы не выиграли.",
    childLesson_en: "Won a million? 🤔 Did you even play? No? Then it's fake! Real prizes don't cost money!",
    childLesson_ru: "Выиграл миллион? 🤔 А ты играл? Нет? Значит обман! Настоящие призы не стоят денег!",
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
