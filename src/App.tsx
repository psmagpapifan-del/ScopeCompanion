import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Languages, 
  CheckCircle, 
  Loader2, 
  Smile, 
  Calendar, 
  Mail, 
  PenTool, 
  ArrowRight, 
  CheckSquare, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  HelpCircle, 
  Plus, 
  Settings, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Volume2,
  ListTodo,
  Smartphone,
  Cpu,
  Palette,
  Code,
  Mic,
  MicOff
} from "lucide-react";

import { 
  FLUTTER_THEME_CODE, 
  FLUTTER_MODELS_CODE, 
  FLUTTER_DATA_CODE, 
  FLUTTER_API_CODE 
} from "./utils/flutter_export";

import {
  LOCALIZATION_DICTIONARY,
  SupportedLanguage,
  Translations
} from "./utils/localization";

import jsPDF from "jspdf";

import {
  getLocalizedCategories,
  getLocalizedPresets,
  getLocalizedMilestones,
  LocalizedCategory,
  LocalizedPreset,
  LocalizedMilestone
} from "./utils/localized_data";

// Pre-defined common languages for translation
const LANGUAGES = [
  { code: "None", name: "English only (No translation)" },
  { code: "Spanish", name: "Español (Spanish)" },
  { code: "Chinese", name: "简体中文 (Chinese)" },
  { code: "French", name: "Français (French)" },
  { code: "Japanese", name: "日本語 (Japanese)" },
  { code: "Portuguese", name: "Português (Portuguese)" },
  { code: "Arabic", name: "العربية (Arabic)" },
  { code: "Vietnamese", name: "Tiếng Việt (Vietnamese)" },
  { code: "Tagalog", name: "Tagalog (Filipino)" },
  { code: "Hindi", name: "हिन्दी (Hindi)" },
  { code: "Korean", name: "한국어 (Korean)" },
];

// Presets for the Founders Questionnaire
interface QuestionnairePreset {
  name: string;
  icon: string;
  q1: string; // Core Goal
  q2: string; // Target Users
  q3: string; // Top 3 MVP features
  q4: string; // Tech features (Login, Pay, Files)
  q5: string; // Ideal Budget & timeline
}

// Phase discussion prompts for business owner -> client
interface PromptCategory {
  id: string;
  title: string;
  emoji: string;
  color: string;
  goals: string[];
  prompts: { label: string; question: string; simpleExplanation: string }[];
}

const DISCUSSION_CATEGORIES: PromptCategory[] = [
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
        label: "The 'No-Go' list (First Version boundaries)",
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
        label: "Explaining the Database (Storage)",
        question: "What information does your app absolutely need to remember even when the user turns off their phone?",
        simpleExplanation: "Think of the database like a highly-organized digital filing cabinet. We only want to store files we need to read later."
      },
      {
        label: "Third-Party Helpers (APIs)",
        question: "Should the app send real phone text alerts, process real credit cards, or fetch live map directions?",
        simpleExplanation: "Instead of building maps or payment systems from scratch (which costs a fortune), we hire external tools (like Stripe or Google Maps) to help us."
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
        simpleExplanation: "We always recommend launching a 'Minimum Viable Product' (MVP) because real users will tell us what they actually want, saving us from building unused features."
      },
      {
        label: "Maintenance & Monthly Costs",
        question: "Are you comfortable with standard monthly cloud server and subscription tool fees (like database hosting or email dispatch helpers)?",
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

// Interactive Client Onboarding Milestone Checklist
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  notes: string;
}

interface Milestone {
  phase: string;
  title: string;
  icon: string;
  desc: string;
  color: string;
  items: ChecklistItem[];
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    phase: "Phase 1",
    title: "The Initial Handshake",
    icon: "🤝",
    desc: "Setting goals, signing basic agreements, and establishing smooth communication.",
    color: "border-[#FFE66D]",
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
    color: "border-[#4ECDC4]",
    items: [
      { id: "p2-1", text: "Write the 'One Sentence Goal' for the application", completed: false, notes: "" },
      { id: "p2-2", text: "Identify the top 3 core features to build first (MVP Core)", completed: false, notes: "" },
      { id: "p2-3", text: "Identify the 3 ideas that we are explicitly DELAYING for Phase 2", completed: false, notes: "" },
      { id: "p2-4", text: "Discuss if database security, files, or payment processing is needed", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 3",
    title: "UX Design & Simple Flow",
    icon: "📱",
    desc: "Drawing the screens and making sure non-native clients understand the user journey.",
    color: "border-[#FF6B6B]",
    items: [
      { id: "p3-1", text: "Sketch wireframe shapes of the 3 primary screens", completed: false, notes: "" },
      { id: "p3-2", text: "Verify button sizes and screen flow for mobile users", completed: false, notes: "" },
      { id: "p3-3", text: "Review copy texts inside the app for simple, clear English", completed: false, notes: "" },
      { id: "p3-4", text: "Client approves the screen visual layout drafts", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 4",
    title: "Weekly Demos & Alignment",
    icon: "🔄",
    desc: "Preventing misunderstandings by checking live code early and often.",
    color: "border-[#A0D2EB]",
    items: [
      { id: "p4-1", text: "Deploy a static version of the landing page on Day 7", completed: false, notes: "" },
      { id: "p4-2", text: "Client tests database entries (e.g. creating an account)", completed: false, notes: "" },
      { id: "p4-3", text: "Gather feedback weekly instead of waiting for the grand finale", completed: false, notes: "" },
      { id: "p4-4", text: "Document changes and approve minor scope updates", completed: false, notes: "" }
    ]
  },
  {
    phase: "Phase 5",
    title: "Handover & Go-Live!",
    icon: "🚀",
    desc: "Connecting the client's custom domain, hosting account, and handing over the keys.",
    color: "border-[#FF6B6B]",
    items: [
      { id: "p5-1", text: "Configure hosting account under the client's credit card", completed: false, notes: "" },
      { id: "p5-2", text: "Buy and link the custom domain name (e.g. www.myapp.com)", completed: false, notes: "" },
      { id: "p5-3", text: "Record a short 3-minute video guide explaining how to use the admin board", completed: false, notes: "" },
      { id: "p5-4", text: "Deliver repository code and celebrate the successful launch!", completed: false, notes: "" }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"prompts" | "questionnaire" | "milestones" | "translator" | "flutter">("prompts");

  // Global Interface Language state
  const [appLanguage, setAppLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("scoping_companion_app_lang");
    return (saved as SupportedLanguage) || "None";
  });

  const handleAppLanguageChange = (lang: SupportedLanguage) => {
    setAppLanguage(lang);
    localStorage.setItem("scoping_companion_app_lang", lang);
    playBeep(659.25, "sine", 0.08); // E5 feedback
  };

  // Helper to get translated UI string
  const t: Translations = LOCALIZATION_DICTIONARY[appLanguage] || LOCALIZATION_DICTIONARY["None"];

  // Dynamic translations and datasets
  const discussionCategories = getLocalizedCategories(appLanguage);
  const questionnairePresets = getLocalizedPresets(appLanguage);
  const localizedMilestonesData = getLocalizedMilestones(appLanguage);
  
  // Custom audio synth feedback
  const playBeep = (freq: number, type: OscillatorType = "sine", duration: number = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored audio context block protection
    }
  };

  // State for Copy actions
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedFlutterFile, setSelectedFlutterFile] = useState<"theme" | "models" | "data" | "api">("theme");
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    playBeep(587.33, "sine", 0.15); // D5 success note
    setTimeout(() => setCopiedText(null), 2000);
  };

  const exportBriefAsPDF = async () => {
    if (!generatedBriefData) return;
    setIsExportingPdf(true);
    playBeep(440, "sine", 0.1);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 40;
      const contentWidth = pdfWidth - (margin * 2);
      let y = 40;

      // Helper function to check vertical space and insert page break
      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pdfHeight - 60) {
          pdf.addPage();
          y = 40;
          // Draw a small running header on new page
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(120, 120, 120);
          pdf.text("Project Scoping Brief (Continued)", margin, y);
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.5);
          pdf.line(margin, y + 5, margin + contentWidth, y + 5);
          y += 25;
        }
      };

      // Header Banner: Coral background
      pdf.setFillColor(255, 107, 107); // #FF6B6B
      pdf.setDrawColor(45, 52, 54); // #2D3436
      pdf.setLineWidth(2);
      pdf.roundedRect(margin, y, contentWidth, 60, 8, 8, "FD");

      // Header Text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.text("PROJECT SCOPING BRIEF", margin + 20, y + 28);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text("CLIENT-READY OVERVIEW  |  SMART BUDDY AI", margin + 20, y + 45);

      y += 85;

      // Section 1: CORE OBJECTIVE
      checkPageBreak(120);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text("01. CORE OBJECTIVE", margin, y);
      y += 12;

      // Content Box for Core Objective
      const coreGoalText = generatedBriefData.coreGoal || "";
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(26, 26, 26);
      const wrappedCoreGoal = pdf.splitTextToSize(coreGoalText, contentWidth - 30);
      const coreGoalBoxHeight = wrappedCoreGoal.length * 15 + 20;

      pdf.setFillColor(255, 249, 242); // #FFF9F2 (light warm cream)
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, y, contentWidth, coreGoalBoxHeight, 8, 8, "FD");

      pdf.text(wrappedCoreGoal, margin + 15, y + 18);
      y += coreGoalBoxHeight + 25;

      // Section 2: TARGET AUDIENCE & TIMELINE BUDGET (Grid layout in 2 columns)
      checkPageBreak(120);
      const colWidth = (contentWidth - 15) / 2;

      // Measure wrapped texts first to determine the box height
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      const wrappedAudience = pdf.splitTextToSize(generatedBriefData.audience || "", colWidth - 20);
      const wrappedTimeline = pdf.splitTextToSize(generatedBriefData.timelineBudget || "", colWidth - 20);

      const maxLines = Math.max(wrappedAudience.length, wrappedTimeline.length);
      const gridBoxHeight = maxLines * 14 + 35;

      // Col 1: Target Audience
      pdf.setFillColor(243, 244, 246); // #F3F4F6
      pdf.setDrawColor(220, 220, 220);
      pdf.roundedRect(margin, y, colWidth, gridBoxHeight, 8, 8, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 100, 100);
      pdf.text("TARGET AUDIENCE", margin + 10, y + 16);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 26, 26);
      pdf.text(wrappedAudience, margin + 10, y + 30);

      // Col 2: Timeline & Budget
      pdf.setFillColor(243, 244, 246); // #F3F4F6
      pdf.roundedRect(margin + colWidth + 15, y, colWidth, gridBoxHeight, 8, 8, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 100, 100);
      pdf.text("TIMELINE & BUDGET", margin + colWidth + 25, y + 16);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 26, 26);
      pdf.text(wrappedTimeline, margin + colWidth + 25, y + 30);

      y += gridBoxHeight + 25;

      // Section 3: MVP SCOPE
      checkPageBreak(100);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text("02. MVP SCOPE", margin, y);
      y += 12;

      const mvpLines = (generatedBriefData.mvpScope || "").split("\n").filter((l: string) => l.trim().length > 0);
      
      // Calculate height of MVP section
      let mvpTotalHeight = 20;
      const wrappedMvpLines: string[][] = [];
      mvpLines.forEach((line: string) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.5);
        const wrapped = pdf.splitTextToSize(line, contentWidth - 40);
        wrappedMvpLines.push(wrapped);
        mvpTotalHeight += wrapped.length * 15 + 6;
      });

      checkPageBreak(mvpTotalHeight);

      // Draw Yellow Highlight Container
      pdf.setFillColor(255, 230, 109); // #FFE66D background color
      pdf.setDrawColor(45, 52, 54); // charcoal border
      pdf.setLineWidth(1.5);
      pdf.roundedRect(margin, y, contentWidth, mvpTotalHeight, 8, 8, "FD");

      let mvpY = y + 18;
      wrappedMvpLines.forEach((wrappedLine: string[]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(255, 107, 107); // coral bullet
        pdf.text("•", margin + 15, mvpY);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(26, 26, 26);
        pdf.text(wrappedLine, margin + 30, mvpY);
        mvpY += wrappedLine.length * 15 + 6;
      });

      y += mvpTotalHeight + 25;

      // Section 4: SUGGESTED TECH STACK (LAYMAN ANALOGIES)
      checkPageBreak(120);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text("03. TECH STACK ANALOGIES", margin, y);
      y += 12;

      const techs = generatedBriefData.suggestedTech || [];
      for (let i = 0; i < techs.length; i++) {
        const tech = techs[i];
        
        // Measure height
        pdf.setFont("helvetica", "oblique");
        pdf.setFontSize(9);
        const wrappedAnalogy = pdf.splitTextToSize(`"${tech.analogy}"`, contentWidth - 30);
        const techBoxHeight = wrappedAnalogy.length * 14 + 32;

        checkPageBreak(techBoxHeight + 15);

        // Tech item container
        pdf.setFillColor(255, 249, 242); // #FFF9F2
        pdf.setDrawColor(45, 52, 54); // #2D3436
        pdf.setLineWidth(1);
        pdf.roundedRect(margin, y, contentWidth, techBoxHeight, 8, 8, "FD");

        // Term Title (e.g. React Native / Flutter)
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(255, 107, 107); // #FF6B6B
        pdf.text(tech.term.toUpperCase(), margin + 15, y + 16);

        // Layman Badge text
        const termWidth = pdf.getTextWidth(tech.term.toUpperCase());
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(78, 205, 196); // #4ECDC4
        pdf.text(`(${tech.laymanName.toUpperCase()})`, margin + 15 + termWidth + 8, y + 16);

        // Analogy description
        pdf.setFont("helvetica", "oblique");
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(wrappedAnalogy, margin + 15, y + 28);

        y += techBoxHeight + 10;
      }

      // Add a footer page number on each page
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        pdf.setPage(pageNum);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Smart Buddy AI Scoping Agent  |  Page ${pageNum} of ${totalPages}`,
          margin,
          pdfHeight - 25
        );
      }

      pdf.save(`Project_Scoping_Brief_${Date.now()}.pdf`);
      playBeep(587.33, "sine", 0.2);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // State for Discussion Prompts tab
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>("kickstart");

  // State for Founders Questionnaire tab
  const [q1, setQ1] = useState(() => localStorage.getItem("client_scoping_q1") || "");
  const [q2, setQ2] = useState(() => localStorage.getItem("client_scoping_q2") || "");
  const [q3, setQ3] = useState(() => localStorage.getItem("client_scoping_q3") || "");
  const [q4, setQ4] = useState(() => localStorage.getItem("client_scoping_q4") || "");
  const [q5, setQ5] = useState(() => localStorage.getItem("client_scoping_q5") || "");
  const [briefGenerated, setBriefGenerated] = useState(() => localStorage.getItem("client_scoping_brief_generated") === "true");
  const [generatedBriefData, setGeneratedBriefData] = useState<any | null>(() => {
    const saved = localStorage.getItem("client_scoping_brief_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Auto-save Founders Questionnaire states
  useEffect(() => {
    localStorage.setItem("client_scoping_q1", q1);
  }, [q1]);

  useEffect(() => {
    localStorage.setItem("client_scoping_q2", q2);
  }, [q2]);

  useEffect(() => {
    localStorage.setItem("client_scoping_q3", q3);
  }, [q3]);

  useEffect(() => {
    localStorage.setItem("client_scoping_q4", q4);
  }, [q4]);

  useEffect(() => {
    localStorage.setItem("client_scoping_q5", q5);
  }, [q5]);

  useEffect(() => {
    localStorage.setItem("client_scoping_brief_generated", String(briefGenerated));
  }, [briefGenerated]);

  useEffect(() => {
    if (generatedBriefData) {
      localStorage.setItem("client_scoping_brief_data", JSON.stringify(generatedBriefData));
    } else {
      localStorage.removeItem("client_scoping_brief_data");
    }
  }, [generatedBriefData]);

  // Voice recording & transcription state
  const [recordingField, setRecordingField] = useState<"q1" | "q2" | "q3" | "q4" | "q5" | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"en-US" | "hi-IN">("en-US");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const originalTextRef = useRef<string>("");
  const briefRef = useRef<HTMLDivElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startListening = (field: "q1" | "q2" | "q3" | "q4" | "q5", lang: string) => {
    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("not-supported");
      return;
    }

    // Stop current listening session if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping previous recognition:", err);
      }
    }

    let originalText = "";
    if (field === "q1") originalText = q1;
    else if (field === "q2") originalText = q2;
    else if (field === "q3") originalText = q3;
    else if (field === "q4") originalText = q4;
    else if (field === "q5") originalText = q5;

    originalTextRef.current = originalText;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setRecordingField(field);
        playBeep(523.25, "sine", 0.08); // high beep
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setRecordingField(null);
        if (event.error === "service-not-allowed" || event.error === "not-allowed" || event.error === "permission-denied") {
          setVoiceError("iframe-blocked");
        } else {
          setVoiceError(event.error || "unknown");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setRecordingField(null);
        playBeep(349.23, "sine", 0.08); // low beep
      };

      recognition.onresult = (event: any) => {
        let currentSessionTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentSessionTranscript += event.results[i][0].transcript;
        }

        const spacePrefix = originalTextRef.current && !originalTextRef.current.endsWith(" ") && !originalTextRef.current.endsWith("\n") ? " " : "";
        const updatedValue = originalTextRef.current + spacePrefix + currentSessionTranscript;

        if (field === "q1") setQ1(updatedValue);
        else if (field === "q2") setQ2(updatedValue);
        else if (field === "q3") setQ3(updatedValue);
        else if (field === "q4") setQ4(updatedValue);
        else if (field === "q5") setQ5(updatedValue);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error("Failed to start speech recognition:", e);
      setVoiceError("service-not-allowed");
    }
  };

  const simulateVoiceInput = (field: "q1" | "q2" | "q3" | "q4" | "q5") => {
    setVoiceError(null);
    setIsListening(true);
    setRecordingField(field);
    playBeep(523.25, "sine", 0.08); // start beep

    const enSamples = [
      "We want to build a highly interactive client onboarding companion with multi-language capabilities and localized milestones.",
      "The client needs a secure real-time backend with secure API keys that can translate technical terms using everyday analogies.",
      "We are targeting a clean modern layout with custom retro neon design elements and synthetic beep sound feedback."
    ];

    const hiSamples = [
      "हमें एक सरल और सुरक्षित मोबाइल एप्लिकेशन चाहिए जो बिना इंटरनेट के काम करे और जिसमें हिंदी भाषा का समर्थन हो।",
      "हमारा लक्ष्य एक ऐसा डैशबोर्ड बनाना है जिसके माध्यम से गैर-तकनीकी ग्राहक भी कोड और डेटाबेस के कठिन शब्दों को आसानी से समझ सकें।",
      "कृपया इसमें एक नया अनुभाग जोड़ें जो हमारी टीम के कार्यों और प्रोजेक्ट के मुख्य मील के पत्थरों को ट्रैक कर सके।"
    ];

    const sampleText = voiceLang === "hi-IN" 
      ? hiSamples[Math.floor(Math.random() * hiSamples.length)]
      : enSamples[Math.floor(Math.random() * enSamples.length)];

    let currentText = "";
    if (field === "q1") currentText = q1;
    else if (field === "q2") currentText = q2;
    else if (field === "q3") currentText = q3;
    else if (field === "q4") currentText = q4;
    else if (field === "q5") currentText = q5;

    const spacePrefix = currentText && !currentText.endsWith(" ") && !currentText.endsWith("\n") ? " " : "";
    const words = sampleText.split(" ");
    let wordIndex = 0;
    let accumulated = currentText + spacePrefix;

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        accumulated += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        
        if (field === "q1") setQ1(accumulated);
        else if (field === "q2") setQ2(accumulated);
        else if (field === "q3") setQ3(accumulated);
        else if (field === "q4") setQ4(accumulated);
        else if (field === "q5") setQ5(accumulated);

        wordIndex++;
        // subtle feedback sound simulating real-time typing transcription
        playBeep(800 + Math.random() * 150, "triangle", 0.01);
      } else {
        clearInterval(interval);
        setIsListening(false);
        setRecordingField(null);
        playBeep(349.23, "sine", 0.08); // done beep
      }
    }, 120);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    setIsListening(false);
    setRecordingField(null);
  };

  // Apply questionnaire preset
  const applyPreset = (preset: QuestionnairePreset) => {
    playBeep(440, "sine", 0.08); // A4
    setQ1(preset.q1);
    setQ2(preset.q2);
    setQ3(preset.q3);
    setQ4(preset.q4);
    setQ5(preset.q5);
    setBriefGenerated(false);
  };

  // Process the answers into a simple technical proposal summary
  const processQuestionnaire = (e: React.FormEvent) => {
    e.preventDefault();
    playBeep(523.25, "sine", 0.15); // C5

    // Suggest a tech stack and simplify it with analogies based on their answers
    const hasLogin = q4.toLowerCase().includes("yes") || q4.toLowerCase().includes("login") || q4.toLowerCase().includes("sign up");
    const hasPayments = q4.toLowerCase().includes("pay") || q4.toLowerCase().includes("stripe") || q4.toLowerCase().includes("money");
    const hasFiles = q4.toLowerCase().includes("file") || q4.toLowerCase().includes("photo") || q4.toLowerCase().includes("upload") || q4.toLowerCase().includes("receipt");

    const suggestedTech = [];
    if (hasLogin) {
      suggestedTech.push({
        term: "Secure Authentication (Login)",
        laymanName: "The Digital Key & Gatekeeper",
        analogy: "Like a secure hotel lobby. The user enters their passcode, gets a key card (session token), and is allowed to open only their own room without looking into other guests' luggage."
      });
    } else {
      suggestedTech.push({
        term: "Anonymous Session State",
        laymanName: "The Temp Shopping Basket",
        analogy: "Like a physical supermarket shopping basket. Anyone can pick it up and put items inside, but if you walk out or wait too long, the cart gets emptied automatically."
      });
    }

    suggestedTech.push({
      term: "Relational Database Storage",
      laymanName: "The Smart Filing Cabinet",
      analogy: "Like an incredibly organized metal filing cabinet with index cards. If you ask for 'Croissants purchased on Saturday by client @john', the smart cabinet draws the exact paper sheet in 0.01 seconds instead of you reading all pages manually."
    });

    if (hasPayments) {
      suggestedTech.push({
        term: "Payment Gateway Proxy (Stripe)",
        laymanName: "The Digital Bank Cashier",
        analogy: "Instead of you standing at the door counting dollars and checking if credit cards are fake, you hire an armored bank cashier (Stripe) to collect the cash safely, verify it, and hand you the receipt so you can deliver the bakery goods."
      });
    }

    if (hasFiles) {
      suggestedTech.push({
        term: "Cloud File Storage (S3 / Cloud Storage)",
        laymanName: "The Digital Warehouse",
        analogy: "If you try to store all user receipt photos inside your active office cabinet, it will fill up and crash. Instead, we rent space in a massive outer warehouse (Cloud Storage) and write down the exact map coordinates on our smart office cards so we can fetch them anytime."
      });
    }

    setGeneratedBriefData({
      projectName: q1.slice(0, 35) + (q1.length > 35 ? "..." : ""),
      coreGoal: q1,
      audience: q2,
      mvpScope: q3,
      integrations: q4,
      timelineBudget: q5,
      suggestedTech: suggestedTech
    });
    setBriefGenerated(true);
  };

  // State for Milestone Checklists (Loaded from localStorage if possible to stay persistent)
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem("client_scoping_milestones");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getLocalizedMilestones("None");
      }
    }
    return getLocalizedMilestones("None");
  });

  useEffect(() => {
    localStorage.setItem("client_scoping_milestones", JSON.stringify(milestones));
  }, [milestones]);

  // Deriving displaying milestones dynamically so checking states and notes are preserved while interface translates
  const displayMilestones = localizedMilestonesData.map((lm, mIdx) => {
    const stateM = milestones ? milestones[mIdx] : null;
    return {
      ...lm,
      items: lm.items.map((li) => {
        const stateI = stateM ? stateM.items.find((si) => si.id === li.id) : null;
        return {
          ...li,
          completed: stateI ? stateI.completed : false,
          notes: stateI ? stateI.notes : ""
        };
      })
    };
  });

  const toggleChecklistItem = (milestoneIndex: number, itemIndex: number) => {
    playBeep(493.88, "sine", 0.05); // B4
    setMilestones(prev => {
      const copy = [...prev];
      const milestone = { ...copy[milestoneIndex] };
      const items = [...milestone.items];
      items[itemIndex] = { ...items[itemIndex], completed: !items[itemIndex].completed };
      milestone.items = items;
      copy[milestoneIndex] = milestone;
      return copy;
    });
  };

  const updateItemNotes = (milestoneIndex: number, itemIndex: number, val: string) => {
    setMilestones(prev => {
      const copy = [...prev];
      const milestone = { ...copy[milestoneIndex] };
      const items = [...milestone.items];
      items[itemIndex] = { ...items[itemIndex], notes: val };
      milestone.items = items;
      copy[milestoneIndex] = milestone;
      return copy;
    });
  };

  const resetAllMilestones = () => {
    if (window.confirm("Are you sure you want to clear your current onboarding checklists?")) {
      playBeep(220, "triangle", 0.2); // Low warning sound
      setMilestones(getLocalizedMilestones("None").map(mil => ({
        ...mil,
        items: mil.items.map(it => ({ ...it, completed: false, notes: "" }))
      })));
    }
  };

  // States for Jargon Translator API
  const [translatorText, setTranslatorText] = useState("");
  const [translatorLang, setTranslatorLang] = useState("Spanish");
  const [translatorLevel, setTranslatorLevel] = useState("simple");
  const [translatorLoading, setTranslatorLoading] = useState(false);
  const [translatorResult, setTranslatorResult] = useState<any | null>(null);
  const [translatorError, setTranslatorError] = useState("");

  const handleTranslatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translatorText.trim()) return;

    setTranslatorLoading(true);
    setTranslatorError("");
    setTranslatorResult(null);
    playBeep(349.23, "triangle", 0.08); // F4

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translatorText,
          targetLanguage: translatorLang,
          englishLevel: translatorLevel,
        }),
      });

      if (!response.ok) {
        let errorMsg = "The backend API returned an error. Check if your GEMINI_API_KEY is configured in the Secrets panel.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setTranslatorResult(data);
      playBeep(587.33, "sine", 0.15); // D5 success
    } catch (err: any) {
      console.error(err);
      setTranslatorError(err.message || "Something went wrong while connecting to the backend. Please try again.");
      playBeep(220, "sawtooth", 0.3); // Error buzz
    } finally {
      setTranslatorLoading(false);
    }
  };

  const loadExampleToTranslator = (term: string) => {
    setTranslatorText(term);
    playBeep(440, "sine", 0.05);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#2D2D2D] font-sans overflow-x-hidden flex flex-col selection:bg-[#FFD93D] selection:text-[#1A1A1A]">
      
      {/* Heavy-bordered Header matching the Vibrant Palette theme */}
      <header className="sticky top-0 z-30 bg-[#FFF9F2]/95 backdrop-blur-md border-b-4 border-[#2D3436] px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Logo & App title with bright aesthetic badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] border-2 border-[#2D3436]">
                <span className="text-2xl text-white">🤝</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1A1A1A] flex items-center gap-2">
                  {t.appName}
                  <span className="text-[10px] bg-[#4ECDC4] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-[#2D3436]">
                    {t.badgeText}
                  </span>
                </h1>
                <p className="text-xs text-gray-600 font-semibold">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Global Language Selector */}
            <div className="flex items-center gap-2 text-xs font-bold shrink-0 bg-white p-2 rounded-xl border-2 border-[#2D3436] shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              <span className="text-[#2D2D2D]/65 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span>{t.interfaceLanguageSelector}</span>
              </span>
              <select
                value={appLanguage}
                onChange={(e) => handleAppLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-white text-[#2D2D2D] font-extrabold py-0.5 px-2 rounded focus:outline-none focus:ring-0 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Navigation Tab rail */}
          <nav className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border-2 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
            {[
              { id: "prompts", label: t.navPrompts, color: "hover:bg-[#FFE66D]" },
              { id: "questionnaire", label: t.navQuestionnaire, color: "hover:bg-[#4ECDC4] hover:text-white" },
              { id: "milestones", label: t.navChecklist, color: "hover:bg-[#A0D2EB]" },
              { id: "translator", label: t.navTranslator, color: "hover:bg-[#FF6B6B] hover:text-white" },
              { id: "flutter", label: t.navFlutter, color: "hover:bg-[#FFE66D]" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playBeep(440, "sine", 0.05);
                }}
                className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold tracking-tight transition-all duration-150 ${
                  activeTab === tab.id 
                    ? "bg-[#2D3436] text-white shadow-inner" 
                    : `text-[#2D2D2D] ${tab.color}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        
        {/* TAB 1: KICKSTART DISCUSSION PROMPTS */}
        {activeTab === "prompts" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Intro Banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] border-4 border-[#2D3436] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFE66D]/20 rounded-full blur-2xl -mr-6 -mt-6"></div>
              <span className="inline-block px-3 py-1 bg-[#4ECDC4] text-white rounded-full text-xs font-bold mb-3 border border-[#2D3436] tracking-wide">
                🗣️ MEETING LAUNCHER
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3">
                Client Discussion Kickstarters
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                When discussing custom software with a new client, dry questions like <em className="font-mono bg-red-100 text-red-800 px-1 rounded not-italic">"What database architecture do you prefer?"</em> cause panic and confusion, especially for non-native English speakers. 
                Use these **warm, analogy-driven prompt cards** to trigger brilliant client answers while keeping things delightfully simple!
              </p>
            </div>

            {/* Prompt Categories Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {discussionCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedPromptCategory(cat.id);
                    playBeep(440, "sine", 0.05);
                  }}
                  className={`p-3.5 rounded-2xl border-4 border-[#2D3436] font-bold text-xs md:text-sm text-left flex items-center gap-2.5 transition-all ${
                    selectedPromptCategory === cat.id
                      ? `${cat.color} text-[#2D2D2D] translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]`
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span>{cat.title}</span>
                </button>
              ))}
            </div>

            {/* Main Prompts Body */}
            {(() => {
              const currentCat = discussionCategories.find(c => c.id === selectedPromptCategory)!;
              return (
                <div className="bg-white rounded-3xl border-4 border-[#2D3436] shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] p-6 md:p-8 flex flex-col gap-6">
                  
                  {/* Category Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-dashed border-[#2D3436] pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{currentCat.emoji}</span>
                      <div>
                        <h3 className="text-xl font-extrabold text-[#1A1A1A]">{currentCat.title}</h3>
                        <p className="text-xs text-gray-500 font-semibold">Ready-to-use prompts for this alignment session</p>
                      </div>
                    </div>
                    {/* Goals checklist */}
                    <div className="bg-[#FFF9F2] p-3 rounded-xl border-2 border-[#2D3436] max-w-sm">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">🔑 Session Objectives:</span>
                      <ul className="flex flex-col gap-1 text-xs font-semibold text-gray-700">
                        {currentCat.goals.map((g, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal-500">✔</span>
                            <span>{g}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prompts list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentCat.prompts.map((p, index) => (
                      <div 
                        key={index} 
                        className="bg-[#FFF9F2] rounded-2xl border-2 border-[#2D3436] p-5 flex flex-col justify-between hover:scale-[1.01] transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold bg-[#2D3436] text-white px-2.5 py-0.5 rounded-full">
                              Question {index + 1}
                            </span>
                            <span className="text-xs font-mono font-bold text-gray-500">{p.label}</span>
                          </div>
                          
                          {/* The Real Question Box */}
                          <p className="text-sm md:text-base font-extrabold text-[#1A1A1A] leading-snug mb-4">
                            "{p.question}"
                          </p>
                          
                          {/* Layman Simplifier Guide */}
                          <div className="bg-white p-3.5 rounded-xl border border-gray-300">
                            <span className="block text-[9px] font-bold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Smile className="w-3.5 h-3.5" /> HOW TO EXPLAIN SIMPLY TO CLIENTS:
                            </span>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">
                              {p.simpleExplanation}
                            </p>
                          </div>
                        </div>

                        {/* Copy Question Action button */}
                        <button
                          onClick={() => handleCopy(p.question, `q-${selectedPromptCategory}-${index}`)}
                          className="mt-4 w-full py-2 bg-white hover:bg-[#FFE66D] text-xs font-bold rounded-xl border-2 border-[#2D3436] flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          {copiedText === `q-${selectedPromptCategory}-${index}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              <span>Question Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-gray-500" />
                              <span>Copy Question Template</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Advice Box for Software Studio Owners */}
                  <div className="bg-[#A0D2EB]/20 p-4 rounded-2xl border-2 border-[#A0D2EB] text-[#2D3436] flex items-start gap-3">
                    <span className="text-2xl mt-0.5">💡</span>
                    <div className="text-xs font-semibold leading-relaxed">
                      <strong className="block text-sm mb-0.5">Onboarding Tip for Non-Native Clients:</strong>
                      If your client has difficulty speaking English, let them write or answer in their native tongue! You can paste their foreign language answers directly into the **Founders Questionnaire** or the **Layman Translator** on the next tabs, and let our Companion translate and summarize them perfectly into clean scoping guidelines.
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* TAB 2: FOUNDERS QUESTIONNAIRE & GENERATED CLIENT SCOPING BRIEF */}
        {activeTab === "questionnaire" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Explanatory introduction */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] border-4 border-[#2D3436]">
              <span className="inline-block px-3 py-1 bg-[#4ECDC4] text-white rounded-full text-xs font-bold mb-3 border border-[#2D3436]">
                {t.questBannerTag}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3">
                {t.questBannerTitle}
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {t.questBannerDesc}
              </p>
            </div>

            {/* Preset template loaders */}
            <div className="bg-white p-4 rounded-2xl border-4 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
              <span className="block text-xs font-extrabold text-gray-500 mb-2 uppercase tracking-wide">
                {t.questQuickPresets}
              </span>
              <div className="flex flex-wrap gap-2">
                {questionnairePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-xs md:text-sm font-bold bg-[#FFF9F2] hover:bg-[#FFD93D] hover:border-black border-2 border-gray-300 px-3 py-2 rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Questionnaire Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Questionnaire Form Input */}
              <form onSubmit={processQuestionnaire} className="lg:col-span-6 bg-white p-6 rounded-3xl border-4 border-[#2D3436] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] flex flex-col gap-5">
                <h3 className="text-lg font-extrabold text-[#1A1A1A] border-b-2 border-[#2D3436] pb-2">
                  {t.questFormTitle}
                </h3>

                {/* Voice Assist Bar */}
                <div className="bg-gray-50 p-3 rounded-2xl border-2 border-[#2D3436] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎙️</span>
                    <div>
                      <span className="block text-[11px] font-bold text-[#1A1A1A] leading-none mb-0.5">Voice Dictation Assist</span>
                      <span className="text-[10px] text-gray-500 font-semibold leading-tight">Hindi & English supported voice-to-text input.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wide">Lang:</span>
                    <div className="inline-flex rounded-lg p-0.5 bg-gray-200 border border-gray-300">
                      <button
                        type="button"
                        onClick={() => { setVoiceLang("en-US"); playBeep(523.25, "sine", 0.05); }}
                        className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md transition-colors cursor-pointer ${
                          voiceLang === "en-US"
                            ? "bg-white text-black border border-gray-300 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => { setVoiceLang("hi-IN"); playBeep(523.25, "sine", 0.05); }}
                        className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md transition-colors cursor-pointer ${
                          voiceLang === "hi-IN"
                            ? "bg-white text-black border border-gray-300 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        हिन्दी (Hindi)
                      </button>
                    </div>
                  </div>
                </div>

                {voiceError && (
                  <div className="bg-[#FFF0F0] p-3.5 rounded-2xl border-2 border-[#FF6B6B] text-xs text-red-700 font-semibold flex flex-col gap-2.5 shadow-[2px_2px_0px_0px_rgba(255,107,107,0.35)]">
                    <div className="flex items-start gap-2">
                      <span className="text-base">⚠️</span>
                      <div className="flex-1">
                        <strong className="block text-red-900 font-extrabold text-xs">Microphone / Dictation Restrained</strong>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-red-800">
                          {voiceError === "iframe-blocked" 
                            ? "Browser security policies prevent microphone access inside sandboxed preview windows (iframes)." 
                            : `Speech recognition service error: ${voiceError}.`}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-red-200 flex flex-col gap-2">
                      <p className="text-[10px] text-gray-700 leading-normal">
                        👉 <strong>Simple Fix:</strong> Click the <strong>"Open in a new tab"</strong> button at the top-right corner of your screen! This launches the application outside the sandboxed frame, letting you grant microphone permissions normally.
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] text-gray-400 font-mono">CODE: {voiceError}</span>
                        <button
                          type="button"
                          onClick={() => setVoiceError(null)}
                          className="px-2.5 py-1 bg-[#FFD2D2] hover:bg-[#FFC0C0] text-red-900 border border-[#FF6B6B] rounded-lg text-[9px] font-bold cursor-pointer transition-colors"
                        >
                          Dismiss Notice
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Q1 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {t.questQ1}
                    </label>
                    <div className="flex gap-1.5 items-center">
                      {recordingField === "q1" ? (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="flex items-center gap-1.5 text-[10px] bg-red-500 hover:bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping shrink-0" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startListening("q1", voiceLang)}
                            className="flex items-center gap-1 text-[10px] bg-[#FFE66D] hover:bg-[#FFE66D]/90 text-black font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <Mic className="w-3 h-3 text-black shrink-0" />
                            <span>Record Voice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateVoiceInput("q1")}
                            className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-850 font-bold px-2 py-1 rounded-full border border-gray-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                            title="Simulate spoken response"
                          >
                            <span>✨ Simulate Voice</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={q1}
                    onChange={(e) => setQ1(e.target.value)}
                    placeholder="e.g., A mobile app where users find dog walkers near their hotel..."
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs md:text-sm font-medium"
                    required
                  />
                </div>

                {/* Q2 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {t.questQ2}
                    </label>
                    <div className="flex gap-1.5 items-center">
                      {recordingField === "q2" ? (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="flex items-center gap-1.5 text-[10px] bg-red-500 hover:bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping shrink-0" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startListening("q2", voiceLang)}
                            className="flex items-center gap-1 text-[10px] bg-[#FFE66D] hover:bg-[#FFE66D]/90 text-black font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <Mic className="w-3 h-3 text-black shrink-0" />
                            <span>Record Voice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateVoiceInput("q2")}
                            className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-855 font-bold px-2 py-1 rounded-full border border-gray-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                            title="Simulate spoken response"
                          >
                            <span>✨ Simulate Voice</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={q2}
                    onChange={(e) => setQ2(e.target.value)}
                    placeholder="e.g., Families traveling with pets who don't have local contacts..."
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs md:text-sm font-medium"
                    required
                  />
                </div>

                {/* Q3 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {t.questQ3}
                    </label>
                    <div className="flex gap-1.5 items-center">
                      {recordingField === "q3" ? (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="flex items-center gap-1.5 text-[10px] bg-red-500 hover:bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping shrink-0" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startListening("q3", voiceLang)}
                            className="flex items-center gap-1 text-[10px] bg-[#FFE66D] hover:bg-[#FFE66D]/90 text-black font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <Mic className="w-3 h-3 text-black shrink-0" />
                            <span>Record Voice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateVoiceInput("q3")}
                            className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-855 font-bold px-2 py-1 rounded-full border border-gray-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                            title="Simulate spoken response"
                          >
                            <span>✨ Simulate Voice</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={q3}
                    onChange={(e) => setQ3(e.target.value)}
                    placeholder="1. Walk booking calendar&#10;2. Direct text alerts to dog owners&#10;3. Simple photo uploads..."
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs md:text-sm font-medium"
                    required
                  />
                </div>

                {/* Q4 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {t.questQ4}
                    </label>
                    <div className="flex gap-1.5 items-center">
                      {recordingField === "q4" ? (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="flex items-center gap-1.5 text-[10px] bg-red-500 hover:bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping shrink-0" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startListening("q4", voiceLang)}
                            className="flex items-center gap-1 text-[10px] bg-[#FFE66D] hover:bg-[#FFE66D]/90 text-black font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <Mic className="w-3 h-3 text-black shrink-0" />
                            <span>Record Voice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateVoiceInput("q4")}
                            className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-855 font-bold px-2 py-1 rounded-full border border-gray-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                            title="Simulate spoken response"
                          >
                            <span>✨ Simulate Voice</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={q4}
                    onChange={(e) => setQ4(e.target.value)}
                    placeholder="e.g., Yes, secure login for credentials and credit card payments via Stripe."
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs md:text-sm font-medium"
                    required
                  />
                </div>

                {/* Q5 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {t.questQ5}
                    </label>
                    <div className="flex gap-1.5 items-center">
                      {recordingField === "q5" ? (
                        <button
                          type="button"
                          onClick={stopListening}
                          className="flex items-center gap-1.5 text-[10px] bg-red-500 hover:bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white block animate-ping shrink-0" />
                          <span>Stop Recording</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startListening("q5", voiceLang)}
                            className="flex items-center gap-1 text-[10px] bg-[#FFE66D] hover:bg-[#FFE66D]/90 text-black font-extrabold px-2.5 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            <Mic className="w-3 h-3 text-black shrink-0" />
                            <span>Record Voice</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => simulateVoiceInput("q5")}
                            className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-855 font-bold px-2 py-1 rounded-full border border-gray-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                            title="Simulate spoken response"
                          >
                            <span>✨ Simulate Voice</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={q5}
                    onChange={(e) => setQ5(e.target.value)}
                    placeholder="e.g., Launch in 6 weeks, budget around $12,000"
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs md:text-sm font-medium"
                    required
                  />
                </div>

                {/* Submit / Process Button */}
                <button
                  type="submit"
                  className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white font-extrabold py-3 rounded-xl shadow-md border-2 border-black flex items-center justify-center gap-2 cursor-pointer transition-transform duration-75 active:scale-95"
                >
                  <FileText className="w-5 h-5" />
                  <span>{t.questSubmitBtn}</span>
                </button>
              </form>

              {/* Scoping Brief Display Column */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                
                {!briefGenerated ? (
                  <div className="bg-white rounded-3xl border-4 border-[#2D3436] p-10 text-center flex flex-col items-center justify-center min-h-[480px] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{t.questBriefReadyTitle}</h3>
                    <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                      {t.questBriefReadyDesc}
                    </p>
                  </div>
                ) : (
                  <div ref={briefRef} className="bg-white rounded-3xl border-4 border-[#2D3436] shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] overflow-hidden flex flex-col animate-scaleUp">
                    
                    {/* Header */}
                    <div className="bg-[#FF6B6B] text-white p-5 border-b-4 border-[#2D3436] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase mr-2">Client-Ready</span>
                        <h4 className="text-lg font-extrabold inline-block">{t.questBriefTitle}</h4>
                      </div>
                      <span className="text-2xl">✨</span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-5 text-xs md:text-sm">
                      
                      {/* Section 1: Core Target */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t.questBriefObjective}</span>
                        <p className="text-[#1A1A1A] font-bold bg-[#FFF9F2] p-3 rounded-xl border border-gray-300 leading-snug">
                          {generatedBriefData.coreGoal}
                        </p>
                      </div>

                      {/* Section 2: Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.questBriefTargetUsers}</span>
                          <p className="text-[#1A1A1A] font-semibold text-xs leading-snug">{generatedBriefData.audience}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.questBriefTimeline}</span>
                          <p className="text-[#1A1A1A] font-semibold text-xs leading-snug">{generatedBriefData.timelineBudget}</p>
                        </div>
                      </div>

                      {/* Section 3: MVP Scope list */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t.questBriefMvpTitle}</span>
                        <div className="bg-[#FFE66D]/20 p-3 rounded-xl border-2 border-[#FFE66D]">
                          <ul className="flex flex-col gap-1.5 font-semibold text-gray-700">
                            {generatedBriefData.mvpScope.split("\n").map((line: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-amber-500">✔</span>
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Section 4: Layman Tech stack suggested */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t.questBriefTechTitle}</span>
                        <div className="flex flex-col gap-3">
                          {generatedBriefData.suggestedTech.map((tech: any, i: number) => (
                            <div key={i} className="bg-[#FFF9F2] p-3.5 rounded-xl border-2 border-[#2D3436]">
                              <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                                <span className="font-extrabold text-xs text-[#FF6B6B]">{tech.term}</span>
                                <span className="text-[10px] font-bold bg-[#4ECDC4] text-white px-2 py-0.5 rounded-full border border-black font-mono">
                                  {tech.laymanName}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 font-medium leading-relaxed italic">
                                "{tech.analogy}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action export tools */}
                      <div className="pt-3 border-t-2 border-dashed border-[#2D3436] flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            const rawText = `PROJECT SCOPING BRIEF\n====================\n\n1. CORE OBJECTIVE:\n${generatedBriefData.coreGoal}\n\n2. TARGET AUDIENCE:\n${generatedBriefData.audience}\n\n3. MVP SCOPE:\n${generatedBriefData.mvpScope}\n\n4. BUDGET & TIMELINES:\n${generatedBriefData.timelineBudget}\n\nSuggested Tech Stack Analogy:\n${generatedBriefData.suggestedTech.map((t: any) => `- ${t.term} (${t.laymanName}): ${t.analogy}`).join("\n")}`;
                            handleCopy(rawText, "copy-brief");
                          }}
                          className="flex-1 py-2.5 bg-[#2D3436] text-white hover:bg-[#FF6B6B] hover:text-white font-bold text-xs rounded-xl border-2 border-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                        >
                          {copiedText === "copy-brief" ? (
                            <>
                              <Check className="w-4 h-4 text-green-400" />
                              <span>{t.questBriefCopied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>{t.questBriefCopy}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            const subject = `Project Scoping Brief: ${generatedBriefData.coreGoal.substring(0, 60)}${generatedBriefData.coreGoal.length > 60 ? "..." : ""}`;
                            const rawText = `PROJECT SCOPING BRIEF\n====================\n\n1. CORE OBJECTIVE:\n${generatedBriefData.coreGoal}\n\n2. TARGET AUDIENCE:\n${generatedBriefData.audience}\n\n3. MVP SCOPE:\n${generatedBriefData.mvpScope}\n\n4. BUDGET & TIMELINES:\n${generatedBriefData.timelineBudget}\n\nSuggested Tech Stack Analogy:\n${generatedBriefData.suggestedTech.map((t: any) => `- ${t.term} (${t.laymanName}): ${t.analogy}`).join("\n")}`;
                            const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawText)}`;
                            window.location.href = mailtoUrl;
                          }}
                          className="flex-1 py-2.5 bg-[#4ECDC4] text-white hover:bg-[#3db8af] font-bold text-xs rounded-xl border-2 border-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{t.questBriefShareEmail}</span>
                        </button>

                        <button
                          onClick={exportBriefAsPDF}
                          disabled={isExportingPdf}
                          className="flex-1 py-2.5 bg-[#FFE66D] text-[#1A1A1A] hover:bg-[#FFD93D] disabled:opacity-50 font-bold text-xs rounded-xl border-2 border-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                        >
                          {isExportingPdf ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <FileText className="w-4 h-4" />
                              <span>{t.questBriefExportPdf}</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ALIGNMENT & ONBOARDING MILESTONES CHECKLIST */}
        {activeTab === "milestones" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Explanatory introduction */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] border-4 border-[#2D3436] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-[#A0D2EB] text-[#2D2D2D] rounded-full text-xs font-bold mb-3 border border-black">
                  {t.milestonesBannerTag}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3">
                  {t.milestonesBannerTitle}
                </h2>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {t.milestonesBannerDesc}
                </p>
              </div>
              <button
                onClick={resetAllMilestones}
                className="px-4 py-2.5 bg-white text-red-500 border-2 border-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center gap-1.5 self-start md:self-center"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{t.milestonesResetBtn}</span>
              </button>
            </div>

            {/* Milestones Flow */}
            <div className="flex flex-col gap-8">
              {displayMilestones.map((milestone, milestoneIdx) => {
                const totalItems = milestone.items.length;
                const completedItems = milestone.items.filter(it => it.completed).length;
                const progressPercentage = Math.round((completedItems / totalItems) * 100);

                return (
                  <div 
                    key={milestoneIdx} 
                    className="bg-white rounded-3xl border-4 border-[#2D3436] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] overflow-hidden"
                  >
                    
                    {/* Header bar of milestone */}
                    <div className="bg-[#FFF9F2] p-5 border-b-4 border-[#2D3436] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-white p-1 rounded-xl border-2 border-[#2D3436] shadow-sm">
                          {milestone.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#2D3436] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              {milestone.phase}
                            </span>
                            <span className="text-xs text-gray-500 font-bold">{progressPercentage}% Align Complete</span>
                          </div>
                          <h3 className="text-lg font-extrabold text-[#1A1A1A]">{milestone.title}</h3>
                        </div>
                      </div>

                      {/* Simple visual progress pill */}
                      <div className="w-full sm:w-48 bg-gray-200 h-4 rounded-full border-2 border-[#2D3436] overflow-hidden p-0.5">
                        <div 
                          className="bg-[#4ECDC4] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 py-3 bg-gray-50 border-b-2 border-gray-200 text-xs text-gray-600 font-semibold leading-relaxed italic">
                      💡 {milestone.desc}
                    </div>

                    {/* Checklist Items list */}
                    <div className="p-6 flex flex-col gap-4">
                      {milestone.items.map((item, itemIdx) => (
                        <div 
                          key={item.id} 
                          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border-2 transition-all ${
                            item.completed 
                              ? "bg-[#4ECDC4]/10 border-[#4ECDC4]" 
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {/* Checkbox and Text */}
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              type="button"
                              onClick={() => toggleChecklistItem(milestoneIdx, itemIdx)}
                              className="mt-0.5 cursor-pointer focus:outline-none"
                            >
                              <div className={`w-5 h-5 rounded-md border-2 border-[#2D3436] flex items-center justify-center transition-all ${
                                item.completed ? "bg-[#4ECDC4]" : "bg-white"
                              }`}>
                                {item.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                              </div>
                            </button>
                            <div>
                              <span className={`text-xs md:text-sm font-bold block ${item.completed ? "line-through text-gray-500" : "text-[#1A1A1A]"}`}>
                                {item.text}
                              </span>
                            </div>
                          </div>

                          {/* Notes input */}
                          <div className="w-full md:w-80">
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateItemNotes(milestoneIdx, itemIdx, e.target.value)}
                              placeholder={t.milestonesAddNotePlaceholder}
                              className="w-full px-3 py-2 text-xs font-semibold rounded-lg border-2 border-gray-300 focus:border-[#4ECDC4] bg-white text-gray-700"
                            />
                          </div>

                        </div>
                      ))}
                    </div>

                    {/* Quick export of phase notes */}
                    <div className="bg-[#FFF9F2] px-6 py-3 border-t-2 border-gray-200 flex justify-between items-center flex-wrap gap-2">
                      <span className="text-xs font-bold text-gray-500">Share or copy details of this phase:</span>
                      <button
                        onClick={() => {
                          const activeNotes = milestone.items
                            .map((it, idx) => `${idx + 1}. [${it.completed ? "✔ DONE" : "PENDING"}] ${it.text} ${it.notes ? `\n   Notes: ${it.notes}` : ""}`)
                            .join("\n");
                          const fullExport = `${milestone.title} (${milestone.phase})\n------------------------------\n${activeNotes}`;
                          handleCopy(fullExport, `phase-notes-${milestoneIdx}`);
                        }}
                        className="px-3 py-1 bg-white hover:bg-[#FFD93D] text-xs font-bold rounded-lg border-2 border-[#2D3436] flex items-center gap-1.5 transition-all"
                      >
                        {copiedText === `phase-notes-${milestoneIdx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span>Notes Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                            <span>Copy Phase Summary</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 4: LAYMAN JARGON TRANSLATOR */}
        {activeTab === "translator" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            
            {/* Banner info */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] border-4 border-[#2D3436]">
              <span className="inline-block px-3 py-1 bg-[#FF6B6B] text-white rounded-full text-xs font-bold mb-3 border border-black">
                {t.transBannerTag}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3">
                {t.transBannerTitle}
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {t.transBannerDesc}
              </p>
            </div>

            {/* Interaction Form and Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Input */}
              <form onSubmit={handleTranslatorSubmit} className="lg:col-span-5 bg-white p-6 rounded-3xl border-4 border-[#2D3436] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] flex flex-col gap-4">
                
                {/* Textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>{t.transInputLabel}</span>
                    <span className="text-xs text-red-500 font-bold font-mono">e.g. JWT Token</span>
                  </label>
                  <textarea
                    rows={2}
                    value={translatorText}
                    onChange={(e) => setTranslatorText(e.target.value)}
                    placeholder={t.transInputPlaceholder}
                    className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs md:text-sm font-medium"
                    required
                  />
                </div>

                {/* Popular software jargon clickers */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{t.transClickExample}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "API Endpoint",
                      "SSL Certificate",
                      "CI/CD Pipeline",
                      "Database Migration",
                      "Cloud Server Hosting",
                      "Webhooks"
                    ].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => loadExampleToTranslator(term)}
                        className="text-xs font-bold bg-[#FFF9F2] hover:bg-[#FFE66D] border border-gray-300 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        💡 {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Language Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-[#FF6B6B]" />
                    <span>{t.transSelectLangLabel}</span>
                  </label>
                  <select
                    value={translatorLang}
                    onChange={(e) => {
                      setTranslatorLang(e.target.value);
                      playBeep(440, "sine", 0.05);
                    }}
                    className="w-full p-2.5 rounded-xl border-2 border-gray-300 focus:border-[#4ECDC4] focus:outline-none text-xs font-bold bg-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* English Simplicity level */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    {t.transEnglishLevelLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["simple", "medium"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          setTranslatorLevel(lvl);
                          playBeep(440, "sine", 0.05);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          translatorLevel === lvl
                            ? "bg-[#2D3436] text-white border-black"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {lvl === "simple" ? t.transLevelSimple : t.transLevelMedium}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={translatorLoading}
                  className="w-full mt-1 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 disabled:bg-gray-400 text-white font-extrabold py-3 rounded-xl shadow-md border-2 border-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-xs md:text-sm"
                >
                  {translatorLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.transSubmitBtnThinking}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t.transSubmitBtnReady}</span>
                    </>
                  )}
                </button>

                {translatorError && (
                  <div className="p-3 bg-red-100 text-red-800 text-xs font-bold rounded-xl border border-red-200">
                    ⚠️ {translatorError}
                  </div>
                )}
              </form>

              {/* Response Block Display */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {!translatorResult && !translatorLoading && (
                  <div className="bg-white rounded-3xl border-4 border-[#2D3436] p-10 text-center flex flex-col items-center justify-center min-h-[400px] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)]">
                    <div className="text-5xl mb-4">💬</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{t.transStateReadyTitle}</h3>
                    <p className="text-gray-500 text-xs max-w-sm leading-relaxed">
                      {t.transStateReadyDesc}
                    </p>
                  </div>
                )}

                {translatorLoading && (
                  <div className="bg-white rounded-3xl border-4 border-[#2D3436] p-10 text-center flex flex-col items-center justify-center min-h-[400px] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] animate-pulse">
                    <div className="w-14 h-14 bg-[#FFD93D] rounded-full flex items-center justify-center text-3xl border-2 border-black animate-spin mb-4">⚙️</div>
                    <h3 className="text-base font-bold text-gray-800 mb-2">{t.transStateThinkingTitle}</h3>
                    <p className="text-gray-500 text-xs">{t.transStateThinkingDesc}</p>
                  </div>
                )}

                {translatorResult && !translatorLoading && (
                  <div className="bg-white rounded-3xl border-4 border-[#2D3436] shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] overflow-hidden flex flex-col animate-scaleUp">
                    
                    {/* Header */}
                    <div className="bg-[#FF6B6B] text-white px-5 py-4 border-b-4 border-black flex items-center justify-between">
                      <div>
                        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase mr-2">Analogy Found</span>
                        <h3 className="text-xl font-extrabold tracking-tight inline-block">{translatorResult.term}</h3>
                      </div>
                      <span className="text-2xl">💡</span>
                    </div>

                    <div className="p-6 flex flex-col gap-5 text-xs md:text-sm">
                      
                      {/* Short plain English explanation */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t.transOutputPlainWords}</span>
                        <p className="text-sm font-bold text-gray-800 leading-relaxed bg-[#FFF9F2] p-4 rounded-xl border border-gray-300">
                          {translatorResult.shortDefinition}
                        </p>
                      </div>

                      {/* Everyday Analogy */}
                      <div className="bg-[#FFE66D]/40 p-4.5 rounded-xl border-2 border-[#2D3436] relative">
                        <span className="absolute top-0 right-0 -mt-2.5 mr-3 bg-[#FFD93D] text-[#1A1A1A] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-black shadow-sm uppercase">
                          {t.transOutputAnalogyStory}
                        </span>
                        <h4 className="text-xs font-extrabold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                          <span>🦖</span> {translatorResult.analogyTitle}
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed italic font-medium">
                          "{translatorResult.analogyText}"
                        </p>
                        <div className="mt-3 pt-2.5 border-t border-gray-300 text-[11px] text-gray-600 font-semibold leading-relaxed">
                          📌 <strong>{t.transOutputHowItMaps}</strong> {translatorResult.simpleExplanation}
                        </div>
                      </div>

                      {/* Key takeaways */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t.transOutputKeyTakeaways}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {translatorResult.keyPoints?.map((pt: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                              <span className="font-bold text-xs text-[#FF6B6B] block">✔ {pt.title}</span>
                              <span className="text-[11px] text-gray-500 font-medium leading-tight block mt-0.5">{pt.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Translation Block */}
                      {translatorLang !== "None" && translatorResult.translation && (
                        <div className="bg-[#4ECDC4]/10 p-3.5 rounded-xl border-2 border-[#4ECDC4] mt-1">
                          <span className="text-[10px] font-bold text-[#4ECDC4] uppercase tracking-widest block mb-1">
                            🌎 {t.transOutputInYourLanguage} ({translatorLang}):
                          </span>
                          <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                            {translatorResult.translation}
                          </p>
                        </div>
                      )}

                      {/* Copy explanation */}
                      <button
                        onClick={() => {
                          const rawShare = `TECHNICAL TERM EXPLAINER\nTerm: ${translatorResult.term}\n\n1. Simple Definition:\n${translatorResult.shortDefinition}\n\n2. Analogy (${translatorResult.analogyTitle}):\n${translatorResult.analogyText}\n\n3. Key Points:\n${translatorResult.keyPoints?.map((p: any) => `- ${p.title}: ${p.description}`).join("\n")}${translatorLang !== "None" ? `\n\n4. Translation (${translatorLang}):\n${translatorResult.translation}` : ""}`;
                          handleCopy(rawShare, "copy-term");
                        }}
                        className="mt-1 w-full py-2 bg-gray-50 hover:bg-[#FFE66D] text-xs font-extrabold rounded-lg border-2 border-[#2D3436] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        {copiedText === "copy-term" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" strokeWidth={2.5} />
                            <span>{t.transOutputCopiedBtn}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                            <span>{t.transOutputCopyBtn}</span>
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: FLUTTER & STITCH DEV TRANSITION */}
        {activeTab === "flutter" && (() => {
          let activeCodeText = "";
          let activeFileName = "";
          let fileDescription = "";
          
          if (selectedFlutterFile === "theme") {
            activeCodeText = FLUTTER_THEME_CODE;
            activeFileName = "companion_theme.dart";
            fileDescription = "Design palette variables mapping heavy retro borders, custom BoxDecorations, and typography parameters based on the Stitch library specification.";
          } else if (selectedFlutterFile === "models") {
            activeCodeText = FLUTTER_MODELS_CODE;
            activeFileName = "companion_models.dart";
            fileDescription = "Plain Dart models defining checklists, custom milestones, and chat-prompt structures, complete with standard JSON encoders/decoders.";
          } else if (selectedFlutterFile === "data") {
            activeCodeText = FLUTTER_DATA_CODE;
            activeFileName = "companion_data.dart";
            fileDescription = "Fully populated static datasets representing our exact prompt questions, obj list, and default checklist structures ready for client testing.";
          } else {
            activeCodeText = FLUTTER_API_CODE;
            activeFileName = "companion_api.dart";
            fileDescription = "Robust HTTP request handler that contacts our Express endpoint with clean client-side translation parsing parameters.";
          }

          return (
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Top Banner */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] border-4 border-[#2D3436]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block px-3 py-1 bg-[#FFE66D] text-[#2D2D2D] rounded-full text-xs font-bold border border-black">
                    {t.flutterBannerTag}
                  </span>
                  <span className="inline-block px-3 py-1 bg-[#4ECDC4] text-white rounded-full text-xs font-bold border border-black uppercase tracking-wide">
                    {t.flutterBannerSub}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-3">
                  {t.flutterBannerTitle}
                </h2>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {t.flutterBannerDesc}
                </p>
              </div>

              {/* Layout splits */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left side checklist and navigation */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                  
                  {/* File Selector */}
                  <div className="bg-white p-5 rounded-3xl border-4 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                    <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-3">{t.flutterSelectModule}</h3>
                    
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "theme", name: "companion_theme.dart", icon: <Palette className="w-4 h-4 text-teal-500" />, badge: "Stitch Theme" },
                        { id: "models", name: "companion_models.dart", icon: <Cpu className="w-4 h-4 text-amber-500" />, badge: "Data Models" },
                        { id: "data", name: "companion_data.dart", icon: <FileText className="w-4 h-4 text-rose-500" />, badge: "Prompts & Presets" },
                        { id: "api", name: "companion_api.dart", icon: <Code className="w-4 h-4 text-blue-500" />, badge: "Gemini Client" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedFlutterFile(item.id as any);
                            playBeep(440, "sine", 0.05);
                          }}
                          className={`p-3 rounded-xl border-2 text-left font-bold text-xs md:text-sm flex items-center justify-between transition-all ${
                            selectedFlutterFile === item.id
                              ? "bg-[#2D3436] text-white border-black shadow-[3px_3px_0px_0px_rgba(78,205,196,1)] translate-y-[-1px]"
                              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.name}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                            selectedFlutterFile === item.id ? "bg-white/10 text-teal-300 border-white/20" : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}>
                            {item.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Transition Checklist */}
                  <div className="bg-white p-5 rounded-3xl border-4 border-[#2D3436] shadow-[4px_4px_0px_0px_rgba(45,52,54,1)]">
                    <h3 className="text-sm font-extrabold text-[#1A1A1A] border-b-2 border-gray-200 pb-2 mb-3 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-[#FF6B6B]" />
                      <span>{t.flutterChecklistTitle}</span>
                    </h3>

                    <ul className="flex flex-col gap-3.5 text-xs text-gray-700 font-semibold leading-relaxed">
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</div>
                        <div>
                          <strong>{t.flutterChecklist1Title}</strong>
                          <p className="text-[11px] text-gray-500 font-medium">{t.flutterChecklist1Desc}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</div>
                        <div>
                          <strong>{t.flutterChecklist2Title}</strong>
                          <p className="text-[11px] text-gray-500 font-medium">{t.flutterChecklist2Desc}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</div>
                        <div>
                          <strong>{t.flutterChecklist3Title}</strong>
                          <p className="text-[11px] text-gray-500 font-medium">{t.flutterChecklist3Desc}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</div>
                        <div>
                          <strong>{t.flutterChecklist4Title}</strong>
                          <p className="text-[11px] text-gray-500 font-medium">{t.flutterChecklist4Desc}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Right side Code Previewer */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-[#2D3436] rounded-3xl border-4 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(45,52,54,0.5)] flex flex-col">
                    
                    {/* Code editor top-bar */}
                    <div className="bg-black/40 px-5 py-3.5 border-b-2 border-black flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-300 ml-2">lib/{activeFileName}</span>
                      </div>
                      
                      {/* Copy code block */}
                      <button
                        onClick={() => handleCopy(activeCodeText, `flutter-copy-${selectedFlutterFile}`)}
                        className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-[11px] rounded-lg border-2 border-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        {copiedText === `flutter-copy-${selectedFlutterFile}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            <span>{t.flutterCopiedLibrary}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.flutterCopyLibrary}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* File explanation banner */}
                    <div className="bg-[#FFF9F2] text-gray-700 px-5 py-3 border-b-2 border-black text-[11px] font-semibold flex items-center gap-2">
                      <span className="text-lg">ℹ</span>
                      <span>{fileDescription}</span>
                    </div>

                    {/* Code Area */}
                    <div className="p-4 overflow-x-auto max-h-[500px]">
                      <pre className="text-[11px] md:text-xs font-mono text-gray-100 leading-relaxed selection:bg-teal-500 selection:text-black">
                        <code>{activeCodeText}</code>
                      </pre>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </main>

      {/* Footer block */}
      <footer className="mt-auto border-t-4 border-[#2D3436] bg-[#2D3436] text-white py-6 px-4 md:px-8 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-gray-400">
            &copy; 2026 Client Scoping Companion • Crafted in the Vibrant Palette layout for Software Builders.
          </p>
          <div className="flex gap-4 flex-wrap justify-center font-bold text-[#FFD93D] uppercase tracking-wide">
            <span className="cursor-pointer hover:underline" onClick={() => { setActiveTab("prompts"); playBeep(523, "sine", 0.05); }}>1. Prompts</span>
            <span className="cursor-pointer hover:underline" onClick={() => { setActiveTab("questionnaire"); playBeep(523, "sine", 0.05); }}>2. Scoping Board</span>
            <span className="cursor-pointer hover:underline" onClick={() => { setActiveTab("milestones"); playBeep(523, "sine", 0.05); }}>3. Checklist</span>
            <span className="cursor-pointer hover:underline" onClick={() => { setActiveTab("translator"); playBeep(523, "sine", 0.05); }}>4. Translator</span>
            <span className="cursor-pointer hover:underline" onClick={() => { setActiveTab("flutter"); playBeep(523, "sine", 0.05); }}>5. Flutter Transition</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
