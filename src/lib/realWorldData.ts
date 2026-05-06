// Real-world safety library — ported from v8 HTML prototype
// Detective + child safety + deepfake + manipulation tactics
import type { Locale } from "./i18n";

export interface RWItem {
  heading: { en: string; ru: string };
  icon: string;
  points: { en: string[]; ru: string[] };
}

export interface RWSection {
  id: string;
  icon: string;
  title: { en: string; ru: string };
  subtitle: { en: string; ru: string };
  warning?: { en: string; ru: string };
  items: RWItem[];
}

export const REAL_WORLD: RWSection[] = [
  {
    id: "irl_scammer",
    icon: "🕵️",
    title: { en: "Recognising a Scammer In Person", ru: "Как распознать мошенника в реальной жизни" },
    subtitle: { en: "Body language, speech, psychological manipulation", ru: "Язык тела, речь, психологические уловки" },
    items: [
      {
        heading: { en: "Speech patterns", ru: "Речевые признаки" },
        icon: "🗣️",
        points: {
          en: [
            "Creates artificial urgency: 'You must decide NOW — this offer disappears in 5 minutes'",
            "Appeals to authority: constantly drops names, titles, institutions",
            "Vague specifics: big numbers but unclear about exact terms",
            "Over-explains why you should trust them — genuine people rarely do this",
            "Interrupts you before you can think or ask questions",
            "Uses 'we' to seem legitimate: 'We at the bank have noticed…'",
            "Emotional levers: guilt, pity, fear ('This is your LAST chance')",
          ],
          ru: [
            "Создаёт искусственную срочность: «Решай СЕЙЧАС — предложение исчезнет через 5 минут»",
            "Апеллирует к авторитету: постоянно бросается именами, должностями",
            "Размытая конкретика: большие цифры, но без точных условий",
            "Слишком убедительно объясняет, почему вы должны доверять — настоящие люди так не делают",
            "Перебивает, не давая подумать или задать вопрос",
            "Использует «мы», чтобы казаться легитимным: «Мы в банке заметили…»",
            "Эмоциональные рычаги: вина, жалость, страх («Это ваш ПОСЛЕДНИЙ шанс»)",
          ],
        },
      },
      {
        heading: { en: "Body language red flags", ru: "Сигналы тела" },
        icon: "👁️",
        points: {
          en: [
            "Stands too close, invades personal space",
            "Avoids eye contact OR maintains unnaturally intense eye contact",
            "Touches you unnecessarily to build false intimacy",
            "Blocks your exit — positions between you and the door",
            "Speaks quietly so you have to lean in and focus only on them",
            "Changes subject rapidly when you ask direct questions",
            "Becomes over-friendly suspiciously fast",
          ],
          ru: [
            "Стоит слишком близко, вторгается в личное пространство",
            "Избегает зрительного контакта ИЛИ держит неестественно пристальный взгляд",
            "Прикасается без необходимости — создаёт ложную близость",
            "Перекрывает вам выход — встаёт между вами и дверью",
            "Говорит тихо, заставляя наклоняться и сосредотачиваться только на нём",
            "Резко меняет тему, если вы задаёте прямые вопросы",
            "Подозрительно быстро становится «лучшим другом»",
          ],
        },
      },
    ],
  },

  {
    id: "child_safety",
    icon: "🧒",
    title: { en: "Child Safety: Recognising Predators", ru: "Безопасность ребёнка" },
    subtitle: { en: "For children and parents — offline danger signs", ru: "Для детей и родителей — оффлайн-сигналы опасности" },
    warning: {
      en: "🔴 Always tell a trusted adult if anything feels wrong.",
      ru: "🔴 Если что-то чувствуется неправильным — обязательно расскажите взрослому, которому доверяете.",
    },
    items: [
      {
        heading: { en: "What an unsafe adult does", ru: "Что делает «небезопасный» взрослый" },
        icon: "⚠️",
        points: {
          en: [
            "Gives you special attention different from other adults",
            "Gives gifts, money or treats your parents don't know about",
            "Wants to spend time with you ALONE, away from others",
            "Asks you to keep secrets from your parents",
            "Talks to you about private body parts or shows pictures",
            "Says 'this is our special friendship — just between us'",
          ],
          ru: [
            "Уделяет особое внимание, не такое как другие взрослые",
            "Дарит подарки, деньги или сладости тайно от родителей",
            "Хочет проводить с тобой время НАЕДИНЕ, без других людей",
            "Просит хранить секреты от родителей",
            "Говорит о частях тела или показывает фото, которые не должен",
            "Говорит «это наша особенная дружба — только между нами»",
          ],
        },
      },
      {
        heading: { en: "What to do if it happens to you", ru: "Что делать, если это происходит" },
        icon: "🛡️",
        points: {
          en: [
            "You are NEVER in trouble for telling — it is always the adult's fault",
            "Tell a trusted adult immediately: parent, teacher, school counsellor",
            "If in immediate danger: shout, make noise, run to a public place",
            "Say loudly: 'This person is not my parent/guardian'",
            "Call emergency services if in danger (112 EU, 911 US, 999 UK)",
            "Your body belongs to you — no adult has the right to touch you without consent",
          ],
          ru: [
            "Тебе НИКОГДА не будет «попадать» за то, что ты рассказал — всегда виноват взрослый",
            "Сразу расскажи взрослому, которому доверяешь: родитель, учитель, психолог",
            "Если есть опасность — кричи, шуми, беги в людное место",
            "Громко скажи: «Этот человек не мой родитель»",
            "Звони в экстренные службы (112 / 911 / 999), если есть угроза",
            "Твоё тело принадлежит тебе — никто не имеет права трогать без твоего согласия",
          ],
        },
      },
    ],
  },

  {
    id: "deepfake_detect",
    icon: "🤖",
    title: { en: "Detecting Deepfakes & AI Identities", ru: "Распознавание дипфейков и ИИ-личностей" },
    subtitle: { en: "Visual, audio and verification techniques", ru: "Визуальные, аудио и проверочные приёмы" },
    items: [
      {
        heading: { en: "Visual tells in deepfake video", ru: "Визуальные признаки в дипфейк-видео" },
        icon: "🎥",
        points: {
          en: [
            "Unnatural blinking — too frequent, too rare, or out of sync",
            "Slight blurring or shimmer around hairline and jaw",
            "Inconsistent lighting — face shadows don't match the room",
            "Stiff or unusual head movement, especially in profile",
            "Background flickers or warps slightly during movement",
            "Teeth and hair look blurry or unnaturally perfect",
            "Glasses reflections inconsistent or wrong",
          ],
          ru: [
            "Неестественное моргание — слишком часто, редко или не в такт",
            "Лёгкое размытие или мерцание у линии волос и подбородка",
            "Несогласованное освещение — тени на лице не совпадают с комнатой",
            "Скованные или необычные движения головы, особенно в профиль",
            "Фон слегка мерцает или искажается при движении",
            "Зубы и волосы размытые или неестественно идеальные",
            "Отражения в очках неправильные или несогласованные",
          ],
        },
      },
      {
        heading: { en: "Audio tells in voice clones", ru: "Аудио-признаки клонированного голоса" },
        icon: "🎙️",
        points: {
          en: [
            "Slightly robotic or 'too smooth' quality, no natural breathing",
            "Strange pauses at unusual points in sentences",
            "Background noise that doesn't match the stated location",
            "Emotional tone doesn't match the words being said",
            "Occasional glitches, repetitions or unnatural pacing",
          ],
          ru: [
            "Слегка роботизированный или «слишком гладкий» голос, без естественного дыхания",
            "Странные паузы в неожиданных местах",
            "Фоновый шум не соответствует заявленному месту",
            "Эмоциональный тон не совпадает со словами",
            "Периодические сбои, повторы, неестественный темп",
          ],
        },
      },
      {
        heading: { en: "Real-time verification protocol", ru: "Протокол проверки в реальном времени" },
        icon: "✅",
        points: {
          en: [
            "Ask for a SPECIFIC unexpected gesture: 'Touch your left ear with your right hand' — deepfakes struggle with novel commands",
            "Ask them to hold up a number of fingers while turning sideways",
            "Change the topic suddenly with an unpredictable personal question",
            "Use a 'safe word' agreed with family in advance",
            "For any financial request: NEVER act on a video call alone — verify via a separate channel",
          ],
          ru: [
            "Попросите КОНКРЕТНЫЙ неожиданный жест: «Тронь левое ухо правой рукой» — дипфейки плохо справляются",
            "Попросите показать определённое число пальцев, повернувшись боком",
            "Резко смените тему непредсказуемым личным вопросом",
            "Используйте заранее оговорённое «секретное слово» с семьёй",
            "При финансовом запросе — НИКОГДА не действуйте только по видео, проверяйте через другой канал",
          ],
        },
      },
    ],
  },

  {
    id: "manipulation",
    icon: "🧠",
    title: { en: "Recognising Manipulation Tactics", ru: "Распознавание манипуляций" },
    subtitle: { en: "By age group and psychological technique", ru: "По возрасту и психотехнике" },
    items: [
      {
        heading: { en: "Targeting ELDERLY people", ru: "Манипуляции против ПОЖИЛЫХ" },
        icon: "👴",
        points: {
          en: [
            "Loneliness exploitation: 'I'm the only one who really cares about you'",
            "Confusion creation: complex technical or financial language",
            "Authority impersonation: fake doctors, bank workers, officials",
            "Fear amplification: 'Your account will close in 24 hours'",
            "'Don't tell your family — they'll just worry'",
            "Memory weaponised: 'Don't you remember agreeing to this last week?'",
          ],
          ru: [
            "Эксплуатация одиночества: «Только я по-настоящему о вас забочусь»",
            "Создание путаницы — сложный технический или финансовый язык",
            "Выдача за врача, банковского работника, чиновника",
            "Усиление страха: «Ваш счёт закроют через 24 часа»",
            "«Не говорите семье — они только расстроятся»",
            "Удар по памяти: «Разве вы не помните, что согласились на прошлой неделе?»",
          ],
        },
      },
      {
        heading: { en: "Targeting CHILDREN", ru: "Манипуляции против ДЕТЕЙ" },
        icon: "🧒",
        points: {
          en: [
            "Bribery normalisation: gifts and treats to lower guard",
            "Secrecy culture: 'Our special secret — only boring adults won't understand'",
            "Identity flattery: 'You're so mature for your age'",
            "Peer pressure: 'All your friends already do this'",
            "Fear of trouble: 'You'll get in trouble if you tell'",
            "Gradual boundary erosion — small requests build into big ones",
          ],
          ru: [
            "Нормализация подкупа — подарки и сладости снижают бдительность",
            "Культура секретов: «Наш особый секрет, скучные взрослые не поймут»",
            "Лесть взрослости: «Ты такой взрослый для своих лет»",
            "Имитация давления сверстников: «Все твои друзья уже это делают»",
            "Страх «попасть»: «У тебя будут проблемы, если расскажешь»",
            "Постепенное размывание границ — от малого к большему",
          ],
        },
      },
      {
        heading: { en: "Targeting ADULTS", ru: "Манипуляции против ВЗРОСЛЫХ" },
        icon: "🧑",
        points: {
          en: [
            "FOMO: 'This opportunity closes today — thousands want it'",
            "Social proof fraud: fake reviews, fake testimonials",
            "Reciprocity trap: give you something first, then ask for much more",
            "Sunk-cost trap: 'You've invested so much already…'",
            "Authority impersonation: 'I'm calling from your bank's fraud team'",
          ],
          ru: [
            "FOMO: «Эта возможность закроется сегодня — тысячи хотят её»",
            "Подделка социального доказательства: фейк-отзывы и истории",
            "Ловушка взаимности: сначала дают что-то малое, потом просят многое",
            "Ловушка вложенных затрат: «Вы уже столько вложили…»",
            "Выдача за службу безопасности банка / полицию",
          ],
        },
      },
    ],
  },
];

export function getRWLocalised(section: RWSection, locale: Locale) {
  return {
    title: section.title[locale],
    subtitle: section.subtitle[locale],
    warning: section.warning?.[locale],
    items: section.items.map((it) => ({
      heading: it.heading[locale],
      icon: it.icon,
      points: it.points[locale],
    })),
  };
}
