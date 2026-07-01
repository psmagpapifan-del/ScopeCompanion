import { SupportedLanguage } from "./localization";

export interface LocalizedPrompt {
  label: string;
  question: string;
  simpleExplanation: string;
}

export interface LocalizedCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  goals: string[];
  prompts: LocalizedPrompt[];
}

export interface LocalizedPreset {
  name: string;
  icon: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

export interface LocalizedMilestoneItem {
  id: string;
  text: string;
  completed: boolean;
  notes: string;
}

export interface LocalizedMilestone {
  phase: string;
  title: string;
  icon: string;
  desc: string;
  color: string;
  items: LocalizedMilestoneItem[];
}

// ENGLISH DATA (DEFAULT)
const EN_CATEGORIES: LocalizedCategory[] = [
  {
    id: "kickstart",
    title: "1. Kickstart & Core Value",
    emoji: "🚀",
    color: "bg-[#FFE66D]",
    goals: [
      "Understand the 'Why' behind the project",
      "Explain software development simply to layman clients",
      "Separate core needs from shiny optional wishes"
    ],
    prompts: [
      {
        label: "The Core Pain Point",
        question: "What is the single biggest headache your users face today, and how does your software turn that headache into a smile?",
        simpleExplanation: "Why do users need this? Let's talk about their regular day and what makes them frustrated without this tool."
      },
      {
        label: "The Human Analogy",
        question: "If your software was a real, helpful human standing in a room, what job title would they have? A diligent accountant, a fast delivery runner, or a protective security guard?",
        simpleExplanation: "Using an analogy helps us design the software's 'brain' and structure without getting lost in database jargon."
      },
      {
        label: "The Superpower Feature",
        question: "If you could only build ONE single feature and nothing else, what would that feature be for the app to still be useful?",
        simpleExplanation: "This helps us identify the 'Heart' of your software. We can add more beautiful pages later, but let's make the heart beat first."
      }
    ]
  },
  {
    id: "scoping",
    title: "2. Scope & Target Audience",
    emoji: "🎯",
    color: "bg-[#4ECDC4]",
    goals: [
      "Define who the actual users are",
      "Avoid 'Scope Creep' (making the app too complex before launching)",
      "Outline how the users will interact with the application"
    ],
    prompts: [
      {
        label: "Understanding the Layman User",
        question: "How technical is your average user? Do they use complex software every day, or do they get confused by standard login forms?",
        simpleExplanation: "This tells us if we need a complex settings page or if we should keep the app simple with large, direct buttons."
      },
      {
        label: "The 'No-Go' list",
        question: "What is one cool feature you saw on another app that we should explicitly agree NOT to build for the first release?",
        simpleExplanation: "By agreeing on what NOT to build, we save thousands of dollars and launch the app months earlier."
      },
      {
        label: "User's Device Habit",
        question: "Where will your clients open this software? Will they be sitting at an office desk with a big screen, or walking outside with a shaky phone?",
        simpleExplanation: "Mobile users need big touch buttons and offline-friendly features, while desktop users can handle rich data grids."
      }
    ]
  },
  {
    id: "tech_realities",
    title: "3. Tech Realities & Data Flow",
    emoji: "⚙️",
    color: "bg-[#FF6B6B]",
    goals: [
      "Explain databases, logins, and API processes in simple terms",
      "Identify third-party integrations (payments, map locations, SMS)",
      "Secure user permissions and data collection boundaries"
    ],
    prompts: [
      {
        label: "Explaining the Database",
        question: "What information does your app absolutely need to remember even when the user turns off their phone?",
        simpleExplanation: "Think of the database like a highly-organized digital filing cabinet. We only want to store files we need to read later."
      },
      {
        label: "Third-Party Helpers (APIs)",
        question: "Should the app send real phone text alerts, process real credit cards, or fetch live map directions?",
        simpleExplanation: "Instead of building maps or payment systems from scratch, we hire external tools (like Stripe or Google Maps) to help us."
      },
      {
        label: "Security & Login Needs",
        question: "How sensitive is the user data? Do we need bank-level security with code messages, or a simple email-and-password system?",
        simpleExplanation: "More security is great, but it adds steps for the client. Let's find the perfect balance of safety and ease."
      }
    ]
  },
  {
    id: "budget_timeline",
    title: "4. Budget & MVP Timelines",
    emoji: "💰",
    color: "bg-[#A0D2EB]",
    goals: [
      "Align realistic budgets with project features",
      "Discuss maintenance costs (servers, domains, security)",
      "Plan the feedback cycle for testing early versions"
    ],
    prompts: [
      {
        label: "The 'Good-Enough' MVP Launch",
        question: "Is it more important to launch a simpler app quickly to get user feedback, or wait longer to launch a highly polished product?",
        simpleExplanation: "We always recommend launching an MVP because real users will tell us what they actually want, saving us from building unused features."
      },
      {
        label: "Maintenance & Monthly Costs",
        question: "Are you comfortable with standard monthly cloud server and subscription tool fees?",
        simpleExplanation: "Just like a physical shop requires rent and electricity, custom software has small monthly 'digital utility' costs to stay online."
      },
      {
        label: "Testing with Real People",
        question: "Who are 3 friendly people in your circle who will test the very first rough draft of this software and give honest feedback?",
        simpleExplanation: "Early testing saves developers from writing the wrong code and ensures the final app is highly intuitive."
      }
    ]
  }
];

const EN_PRESETS: LocalizedPreset[] = [
  {
    name: "AI Receipt Scanner SaaS",
    icon: "🧾",
    q1: "A mobile-friendly web app where freelancers can snap photos of receipts and automatically categorize expenses for tax reporting.",
    q2: "Independent freelancers and small business owners who are too busy to do bookkeeping manually and hate accounting math.",
    q3: "1. Camera upload and receipt photo cropping.\n2. Automatic date, vendor, and price extraction (OCR).\n3. Export reports as CSV files for tax advisors.",
    q4: "Yes - Users need a secure login to store tax receipts, and premium users will pay a monthly subscription via credit card.",
    q5: "Ideal launch in 6 weeks, with a starter MVP budget of approximately $10,000 to $15,000."
  },
  {
    name: "Local E-Commerce Bakery Platform",
    icon: "🥐",
    q1: "A website for local artisanal bakers to list daily pastries and allow neighborhood clients to pre-order and pay for morning pickup.",
    q2: "Neighborhood food lovers, early commuters, and local home bakers looking for extra sales without hosting a physical retail store.",
    q3: "1. Interactive daily menu with real-time stock limits.\n2. Easy pickup slot selection.\n3. Text message alerts when orders are bagged.",
    q4: "Yes - Customers need email login to track orders, and must pay for orders instantly online before picking them up.",
    q5: "Ideal launch in 4 weeks, with a community-funded budget of around $6,000."
  }
];

const EN_MILESTONES: LocalizedMilestone[] = [
  {
    phase: "Phase 1",
    title: "The Initial Handshake",
    icon: "🤝",
    desc: "Setting goals, signing basic agreements, and establishing smooth communication.",
    color: "bg-[#FFE66D]",
    items: [
      { id: "p1-1", text: "Sign Mutual NDA (keeps the client's creative concept safe)", completed: false, notes: "" },
      { id: "p1-2", text: "Define preferred communication channel (Slack, WhatsApp, Email)", completed: false, notes: "" },
      { id: "p1-3", text: "Fill out the 5-Question Founders Questionnaire together", completed: false, notes: "" },
      { id: "p1-4", text: "Explain target budget limits and realistic dev phases", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 2",
    title: "Feature Scoping & MVP",
    icon: "📐",
    desc: "Deciding what features are 'Must-Haves' for launch and what are 'Nice-to-Haves'.",
    color: "bg-[#4ECDC4]",
    items: [
      { id: "p2-1", text: "Write the 'One Sentence Goal' for the application", completed: false, notes: "" },
      { id: "p2-2", text: "Identify the top 3 core features to build first (MVP Core)", completed: false, notes: "" },
      { id: "p2-3", text: "Identify 3 ideas that we are explicitly DELAYING for Phase 2", completed: false, notes: "" },
      { id: "p2-4", text: "Discuss database security, logins, or payment requirements", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 3",
    title: "UX Design & Simple Flow",
    icon: "📱",
    desc: "Drawing the screens and making sure non-tech clients understand the user journey.",
    color: "bg-[#FF6B6B]",
    items: [
      { id: "p3-1", text: "Sketch wireframe shapes of the 3 primary screens", completed: false, notes: "" },
      { id: "p3-2", text: "Verify button sizes and screen flow for mobile users", completed: false, notes: "" },
      { id: "p3-3", text: "Review copy texts inside the app for simple, clear language", completed: false, notes: "" },
      { id: "p3-4", text: "Client approves the screen visual layout drafts", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 4",
    title: "Incremental Beta Tests",
    icon: "🧪",
    desc: "Releasing weekly mockups or clickable prototypes so clients can click buttons early.",
    color: "bg-[#A0D2EB]",
    items: [
      { id: "p4-1", text: "Deploy initial frontend with empty data inputs", completed: false, notes: "" },
      { id: "p4-2", text: "Conduct 'Click-Through' test with 2 real prospective users", completed: false, notes: "" },
      { id: "p4-3", text: "Collect and group feedback in a simple spreadsheet", completed: false, notes: "" },
      { id: "p4-4", text: "Apply design feedback before connecting the backend", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 5",
    title: "Production Release & Handoff",
    icon: "🚀",
    desc: "Going live on production URLs, conducting basic training, and transitioning ownership.",
    color: "bg-[#FFE66D]",
    items: [
      { id: "p5-1", text: "Final security sanity check (ensure no public test API keys)", completed: false, notes: "" },
      { id: "p5-2", text: "Link custom domain name and test SSL certificates", completed: false, notes: "" },
      { id: "p5-3", text: "Record a short 3-minute video guide explaining how to use the admin board", completed: false, notes: "" },
      { id: "p5-4", text: "Deliver repository code and celebrate the successful launch!", completed: false, notes: "" }
    ]
  }
];

// SPANISH TRANSLATIONS
const ES_CATEGORIES: LocalizedCategory[] = EN_CATEGORIES.map(c => {
  if (c.id === "kickstart") {
    return {
      ...c,
      title: "1. Preguntas Iniciales y Valor",
      goals: [
        "Comprender el 'Por qué' del proyecto",
        "Explicar el desarrollo de software de forma sencilla",
        "Separar necesidades reales de deseos secundarios"
      ],
      prompts: [
        {
          label: "El dolor principal",
          question: "¿Cuál es el mayor dolor de cabeza de tus usuarios hoy, y cómo lo soluciona tu software?",
          simpleExplanation: "¿Por qué lo necesitan? Hablemos de su día a día sin esta herramienta."
        },
        {
          label: "La analogía humana",
          question: "Si tu software fuera una persona real ayudando en una oficina, ¿cuál sería su puesto de trabajo?",
          simpleExplanation: "Usar un rol ayuda a diseñar el cerebro del software sin enredarse en bases de datos."
        },
        {
          label: "La característica suprema",
          question: "Si solo pudieras lanzar UNA sola funcionalidad, ¿cuál sería para que la app siga siendo útil?",
          simpleExplanation: "Esto nos ayuda a identificar el corazón del software. Hagamos latir el corazón primero."
        }
      ]
    };
  }
  if (c.id === "scoping") {
    return {
      ...c,
      title: "2. Alcance y Público Objetivo",
      goals: [
        "Definir quiénes son los usuarios reales",
        "Evitar agregar funciones complejas antes del lanzamiento",
        "Trazar cómo interactuarán con la aplicación"
      ],
      prompts: [
        {
          label: "Comprender al usuario común",
          question: "¿Qué tan tecnológico es tu usuario promedio? ¿Se confunden con los formularios comunes?",
          simpleExplanation: "Esto define si necesitamos pantallas hiper-simples o grids de datos avanzados."
        },
        {
          label: "La lista de exclusión",
          question: "¿Qué función viste en otra app que decidimos explícitamente NO construir para el MVP?",
          simpleExplanation: "Al acordar qué NO construir, ahorramos dinero y lanzamos meses antes."
        },
        {
          label: "Hábitos de dispositivo",
          question: "¿Dónde abrirán este software? ¿En un escritorio o caminando con un celular inestable?",
          simpleExplanation: "Los celulares requieren botones grandes y funciones sin conexión; las PCs, más densidad."
        }
      ]
    };
  }
  return c;
});

const ES_PRESETS: LocalizedPreset[] = [
  {
    name: "SaaS Escáner de Recibos IA",
    icon: "🧾",
    q1: "Una aplicación web móvil para que los freelancers fotografíen recibos y automaticen gastos tributarios.",
    q2: "Freelancers independientes y pequeños empresarios que odian la contabilidad manual.",
    q3: "1. Carga de foto y recorte automático.\n2. Extracción de fecha, proveedor y precio con IA OCR.\n3. Exportación a CSV.",
    q4: "Sí - Registro seguro y suscripción mensual con tarjeta de crédito vía Stripe.",
    q5: "Lanzamiento en 6 semanas, con un presupuesto inicial aproximado de $10,000."
  },
  {
    name: "Plataforma de Panadería Local",
    icon: "🥐",
    q1: "Sitio web para que panaderos locales publiquen pasteles diarios y los clientes reserven y paguen en línea.",
    q2: "Amantes del pan local, trabajadores de mañana y panaderos artesanales.",
    q3: "1. Menú con stock real.\n2. Selección de hora de recogida.\n3. Alertas SMS automáticas.",
    q4: "Sí - Inicio de sesión por correo y pago en línea por adelantado.",
    q5: "Lanzamiento en 4 semanas con presupuesto de $6,000."
  }
];

const ES_MILESTONES: LocalizedMilestone[] = EN_MILESTONES.map(m => {
  if (m.phase === "Phase 1") {
    return {
      ...m,
      phase: "Fase 1",
      title: "El Saludo Inicial",
      desc: "Definición de objetivos, firma de acuerdos básicos y canales de comunicación.",
      items: [
        { id: "p1-1", text: "Firmar acuerdo NDA mutuo (protege la idea creativa del cliente)", completed: false, notes: "" },
        { id: "p1-2", text: "Definir canal de comunicación preferido (Slack, WhatsApp o Correo)", completed: false, notes: "" },
        { id: "p1-3", text: "Completar el Cuestionario de 5 Preguntas juntos", completed: false, notes: "" },
        { id: "p1-4", text: "Explicar límites de presupuesto y fases de desarrollo realistas", completed: false, notes: "" }
      ]
    };
  }
  if (m.phase === "Phase 2") {
    return {
      ...m,
      phase: "Fase 2",
      title: "Alcance y MVP",
      desc: "Decidir qué características son imprescindibles y cuáles se retrasan.",
      items: [
        { id: "p2-1", text: "Escribir el 'Objetivo en una Sola Frase' de la aplicación", completed: false, notes: "" },
        { id: "p2-2", text: "Identificar las 3 funciones MVP indispensables", completed: false, notes: "" },
        { id: "p2-3", text: "Identificar 3 ideas para retrasar a la Fase 2", completed: false, notes: "" },
        { id: "p2-4", text: "Discutir seguridad de datos, inicios de sesión y flujos de pago", completed: false, notes: "" }
      ]
    };
  }
  return {
    ...m,
    phase: m.phase.replace("Phase", "Fase")
  };
});

// CHINESE TRANSLATIONS
const ZH_CATEGORIES: LocalizedCategory[] = EN_CATEGORIES.map(c => {
  if (c.id === "kickstart") {
    return {
      ...c,
      title: "1. 会议启动与核心价值",
      goals: [
        "理解项目背后的深层动力",
        "用最通俗易懂的话术向客户解释软件开发",
        "将核心必备需求与次要愿望清单分离开来"
      ],
      prompts: [
        {
          label: "核心痛点提取",
          question: "您的用户今天面临的最大痛点是什么？您的软件将如何帮他们化解这个痛点？",
          simpleExplanation: "为什么用户急需它？让我们聊聊没有这个工具时，他们一天的烦恼。"
        },
        {
          label: "拟人化类比",
          question: "如果您的软件是办公室里的一名员工，他担任什么职位？会计、跑腿小哥，还是保安？",
          simpleExplanation: "用人设来给软件规划大脑与边界，而不用陷入生硬的数据表名词中。"
        },
        {
          label: "最关键功能",
          question: "如果只能做唯一一个功能，必须做哪个才能让这款APP具备实际使用价值？",
          simpleExplanation: "这能帮我们精准锁定MVP的灵魂，其他精美界面后续都可以慢慢添加。"
        }
      ]
    };
  }
  return c;
});

const ZH_PRESETS: LocalizedPreset[] = [
  {
    name: "AI 票据识别记账 SaaS",
    icon: "🧾",
    q1: "一个移动端友好的网页应用，自由职业者可以拍照上传收据并自动归类，方便报税。",
    q2: "平日工作繁忙、讨厌繁琐记账和数学公式的独立自由职业者与小微企业主。",
    q3: "1. 手机拍照上传与图片智能裁剪。\n2. 自动识别收据日期、商户和金额 (OCR 技术)。\n3. 一键导出 CSV 报表发给财务顾问。",
    q4: "需要 - 用户需要安全登录查看收据，高级用户按月订阅付款 (Stripe 接入)。",
    q5: "期望 6 周内首发，MVP 启动预算约为 10,000 至 15,000 美元。"
  }
];

const ZH_MILESTONES: LocalizedMilestone[] = EN_MILESTONES.map(m => {
  return {
    ...m,
    phase: m.phase.replace("Phase", "阶段"),
    title: m.phase === "Phase 1" ? "初步接触与建联" : m.phase === "Phase 2" ? "功能范围与核心MVP" : m.title
  };
});

// JAPANESE TRANSLATIONS
const JA_CATEGORIES: LocalizedCategory[] = EN_CATEGORIES.map(c => {
  if (c.id === "kickstart") {
    return {
      ...c,
      title: "1. 会議のキックオフと核心価値",
      goals: [
        "プロジェクト開発の「本当の動機」を理解する",
        "クライアントにシステム開発の工程を分かりやすく解説する",
        "必須の要望と、後回しにできる要望を明確に分類する"
      ],
      prompts: [
        {
          label: "核心となる痛み",
          question: "ユーザーが今日直面している最大の悩みは何ですか？また、このアプリはどうそれを解決しますか？",
          simpleExplanation: "ユーザーがなぜこれを必要とするのか、無かった頃の不便な日常を語り合いましょう。"
        },
        {
          label: "人の役割に例える",
          question: "もしこのアプリがオフィスで働く「人間」だとしたら、どんな職種（会計係、配達員、警備員など）ですか？",
          simpleExplanation: "例え話を使うことで、データベース用語を使わずにアプリの境界線や動きを整理できます。"
        }
      ]
    };
  }
  return c;
});

export function getLocalizedCategories(lang: SupportedLanguage): LocalizedCategory[] {
  if (lang === "Spanish") return ES_CATEGORIES;
  if (lang === "Chinese") return ZH_CATEGORIES;
  if (lang === "Japanese") return JA_CATEGORIES;
  return EN_CATEGORIES;
}

export function getLocalizedPresets(lang: SupportedLanguage): LocalizedPreset[] {
  if (lang === "Spanish") return ES_PRESETS;
  if (lang === "Chinese") return ZH_PRESETS;
  return EN_PRESETS;
}

export function getLocalizedMilestones(lang: SupportedLanguage): LocalizedMilestone[] {
  if (lang === "Spanish") return ES_MILESTONES;
  if (lang === "Chinese") return ZH_MILESTONES;
  return EN_MILESTONES;
}
