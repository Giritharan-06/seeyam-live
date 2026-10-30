"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  GraduationCap,
  Award,
  Clock,
  Building2,
  DollarSign,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useLeadModal } from "@/components/LeadModalContext";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    actionType: "lead_demo" | "lead_consult" | "link" | "whatsapp";
    url?: string;
  }>;
  suggestedFollowUps?: string[];
}

interface PreloadedDoubt {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
  actions?: Array<{
    label: string;
    actionType: "lead_demo" | "lead_consult" | "link" | "whatsapp";
    url?: string;
  }>;
  suggestedFollowUps?: string[];
}

const PRELOADED_DOUBTS: PreloadedDoubt[] = [
  {
    id: "non-it-switch",
    category: "Eligibility & Switching",
    question: "Can I learn if I have a non-IT / BPO background or zero coding experience?",
    keywords: ["non-it", "non it", "coding", "beginner", "bpo", "mechanical", "civil", "arts", "commerce", "background", "experience", "zero coding"],
    answer: "Yes, 100%! Over 68% of our successful alumni transitioned from non-computer science backgrounds (Mechanical, Civil, B.Com, BBA, BPO voice process, and career gap candidates).\n\n• All courses start with ground-zero fundamentals — no prior coding knowledge is required.\n• Our mentors use real business case studies and step-by-step logic building.\n• You get unlimited 1-on-1 doubt clearing until concepts click.",
    actions: [
      { label: "Book Free Demo Class", actionType: "lead_demo" },
      { label: "Explore Beginner Programs", actionType: "link", url: "/courses" },
    ],
    suggestedFollowUps: [
      "How does your placement guarantee work?",
      "Can I attend a free demo class first?",
      "What are the fees and EMI options?",
    ],
  },
  {
    id: "placements",
    category: "Placements & Career",
    question: "How does the 100% placement assurance work?",
    keywords: ["placement", "job", "guarantee", "assurance", "company", "companies", "hire", "hiring", "interview", "package", "ctc", "salary"],
    answer: "Our dedicated placement cell supports you until you secure a verified job offer:\n\n1. Dedicated Corporate Drives: 200+ active hiring partners across Chennai, Bangalore, and Hyderabad.\n2. Technical Mock Interviews: Conducted by working technical leads from Amazon, Deloitte, and Microsoft.\n3. Resume & LinkedIn Rebuilding: ATS-optimized resumes highlighting real capstone projects.\n4. Unlimited Interview Drives: We keep scheduling technical interview rounds until you receive your offer letter.\n\nGraduates secure packages ranging from ₹4.5 LPA up to ₹18.5 LPA (average CTC ₹8.2 LPA).",
    actions: [
      { label: "View Recent Placements", actionType: "link", url: "/placements" },
      { label: "Speak to Placement Cell", actionType: "lead_consult" },
    ],
    suggestedFollowUps: [
      "Can I learn if I have a non-IT background?",
      "What are the fees and EMI options?",
      "Are classes online or offline?",
    ],
  },
  {
    id: "fees-emi",
    category: "Fees & Payment",
    question: "What are the course fees and do you offer EMI or installment options?",
    keywords: ["fee", "fees", "cost", "price", "emi", "installment", "installments", "pay", "payment", "discount", "scholarship"],
    answer: "We offer transparent fee structures with zero hidden charges:\n\n• Zero-Cost Monthly EMI: 0% interest monthly installment options.\n• Milestone Payment Plans: Pay in 2 to 3 flexible installments throughout your training.\n• Fees vary depending on the specialized program (Data Analytics, Power BI, Full Stack, Digital Marketing).\n\nWe also encourage you to attend a free live demo class to review curriculum and mentors before making any payment.",
    actions: [
      { label: "Get Fee & Scholarship Details", actionType: "lead_consult" },
      { label: "Book Free Demo Session", actionType: "lead_demo" },
    ],
    suggestedFollowUps: [
      "Can I attend a free demo class first?",
      "What training modes and timings are available?",
      "How does the placement assurance work?",
    ],
  },
  {
    id: "modes-timings",
    category: "Batches & Modes",
    question: "What training modes and batch timings are available?",
    keywords: ["mode", "modes", "timing", "timings", "batch", "batches", "weekend", "weekday", "online", "offline", "classroom", "hybrid", "evening", "morning", "schedule"],
    answer: "We offer 3 flexible learning modes designed to fit college students and working professionals:\n\n1. Classroom Training: Hands-on lab experience at our physical campuses in Chennai (OMR Navalur, Vadapalani, Tambaram), Bangalore (Marathahalli), and Hyderabad (HITEC City).\n2. Live Online Interactive: High-definition live classes led by corporate trainers with instant screen-share support.\n3. Weekend Batches: Saturdays & Sundays (3–4 hrs/day) for working employees.\n4. Weekday Batches: Regular morning (7:30 AM / 10 AM) and evening (7 PM) slots.",
    actions: [
      { label: "View Upcoming Batches", actionType: "link", url: "/courses" },
      { label: "Check Campus Nearest You", actionType: "link", url: "/branches" },
    ],
    suggestedFollowUps: [
      "Can I attend a free demo class first?",
      "Where are your campuses located?",
      "Can I learn if I have a non-IT background?",
    ],
  },
  {
    id: "free-demo",
    category: "Free Demo",
    question: "Can I attend a free demo class before deciding to enroll?",
    keywords: ["demo", "trial", "free demo", "preview", "sample", "demo class", "session", "attend"],
    answer: "Yes, absolutely! We strongly recommend attending a free 1-on-1 demo or classroom preview session before enrolling:\n\n• Meet the actual instructor who will teach your batch.\n• Review the live tools, project datasets, and curriculum outline.\n• Ask all your specific questions about career switch suitability and batch schedules.\n• 100% free with zero obligation to join.",
    actions: [
      { label: "Book My Free Demo Class Now", actionType: "lead_demo" },
      { label: "Chat on WhatsApp", actionType: "whatsapp" },
    ],
    suggestedFollowUps: [
      "What are the course fees and EMI options?",
      "Which course is right for my career goals?",
      "How does the placement assurance work?",
    ],
  },
  {
    id: "course-recommendation",
    category: "Course Guidance",
    question: "Which program is best: Data Analytics, Power BI, or Digital Marketing?",
    keywords: ["recommend", "which course", "difference", "power bi", "tableau", "data analytics", "digital marketing", "seo", "best course", "choose"],
    answer: "Here is a quick guide to help you choose:\n\n📊 Data Analytics & Power BI Mastery: Best if you enjoy working with spreadsheets, metrics, and business logic without heavy software coding. High corporate demand across all industries.\n\n💻 Full Stack Web Development: Best if you want to write code, design apps, and build scalable cloud software from scratch.\n\n🚀 Digital Marketing & Performance Ads: Best if you enjoy creative strategy, SEO growth, social media ad campaigns, and brand ROI.\n\nNot sure? Our academic mentors can evaluate your background in 10 minutes and suggest the best roadmap.",
    actions: [
      { label: "Get Free 1-on-1 Career Evaluation", actionType: "lead_consult" },
      { label: "Compare All Programs", actionType: "link", url: "/courses" },
    ],
    suggestedFollowUps: [
      "Can non-IT grads learn Data Analytics?",
      "What salary package can I expect?",
      "Can I attend a free demo class?",
    ],
  },
  {
    id: "campuses",
    category: "Campuses",
    question: "Where are your physical learning hubs located?",
    keywords: ["campus", "campuses", "location", "locations", "address", "chennai", "bangalore", "hyderabad", "omr", "navalur", "vadapalani", "tambaram", "marathahalli", "hitec"],
    answer: "Seeyam Technologies operates high-tech learning campuses across South India:\n\n📍 Chennai Campuses:\n• OMR Navalur (Near Vivira Mall)\n• Vadapalani (Near Forum Vijaya Mall)\n• Tambaram West (Opp. Railway Station)\n\n📍 Bangalore Campus:\n• Marathahalli (Outer Ring Road tech corridor)\n\n📍 Hyderabad Campus:\n• HITEC City (Near Cyber Towers)\n\nEvery campus includes high-compute labs, air-conditioned lecture halls, and dedicated interview rooms.",
    actions: [
      { label: "View Campus Map & Contact", actionType: "link", url: "/branches" },
      { label: "Schedule a Campus Visit", actionType: "lead_consult" },
    ],
    suggestedFollowUps: [
      "Are classes available online as well?",
      "What are the batch timings?",
      "Can I attend a demo class at the campus?",
    ],
  },
];

export default function CareerDoubtBot() {
  const { openLeadModal } = useLeadModal();

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! 👋 I'm your Seeyam Career & Doubt Assistant. Have questions about our programs, eligibility, placements, fees, or batch timings? Ask me anything or select a popular doubt below!",
      timestamp: "Just now",
      suggestedFollowUps: [
        "Can I learn with a non-IT background?",
        "How does 100% placement work?",
        "Course fees & 0% EMI options?",
        "Can I attend a free demo class?",
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const findBestAnswer = (query: string): PreloadedDoubt | null => {
    const q = query.toLowerCase().trim();

    // Check exact question match or substring
    for (const doubt of PRELOADED_DOUBTS) {
      if (doubt.question.toLowerCase().includes(q) || q.includes(doubt.question.toLowerCase().slice(0, 20))) {
        return doubt;
      }
    }

    // Score based on keywords
    let bestMatch: PreloadedDoubt | null = null;
    let maxScore = 0;

    for (const doubt of PRELOADED_DOUBTS) {
      let score = 0;
      for (const kw of doubt.keywords) {
        if (q.includes(kw)) {
          score += kw.length > 4 ? 2 : 1;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = doubt;
      }
    }

    return maxScore > 0 ? bestMatch : null;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    setHasInteracted(true);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    // Simulate natural thinking delay (350ms)
    setTimeout(() => {
      const match = findBestAnswer(query);

      let botResponse: ChatMessage;

      if (match) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: match.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: match.actions,
          suggestedFollowUps: match.suggestedFollowUps,
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `Thank you for asking! While I don't have an exact preloaded answer for "${query}", our academic mentors can provide detailed personal guidance for you right away.\n\nYou can book a free 1-on-1 demo session or connect with an instructor directly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: [
            { label: "Book Free Demo Session", actionType: "lead_demo" },
            { label: "Chat on WhatsApp (+91 89399 15577)", actionType: "whatsapp" },
          ],
          suggestedFollowUps: [
            "Can I learn with a non-IT background?",
            "How does 100% placement work?",
            "What are the fees and EMI options?",
            "What training modes and timings are available?",
          ],
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  const handleActionClick = (action: { actionType: string; url?: string }) => {
    if (action.actionType === "lead_demo") {
      openLeadModal(undefined, undefined, "DEMO_VIDEO");
      setIsOpen(false);
    } else if (action.actionType === "lead_consult") {
      openLeadModal(undefined, undefined, "ENQUIRY");
      setIsOpen(false);
    } else if (action.actionType === "whatsapp") {
      window.open(
        "https://wa.me/918939915577?text=Hi%20Seeyam%20team,%20I%20have%20a%20question%20regarding%20courses%20and%20career%20guidance.",
        "_blank"
      );
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Chat cleared! How can I help you? Ask any doubt or pick from popular topics below.",
        timestamp: "Just now",
        suggestedFollowUps: [
          "Can I learn with a non-IT background?",
          "How does 100% placement work?",
          "Course fees & 0% EMI options?",
          "Can I attend a free demo class?",
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Widget Container in Bottom-Right */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end">
        {/* Chat Window Modal */}
        {isOpen && (
          <div className="w-[92vw] sm:w-[390px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-3 animate-scale-in">
            {/* Header */}
            <div className="bg-[#071938] text-white p-4 border-b border-[#0f2956] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#071938] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-snug">
                    <span>Seeyam Career & Doubt Bot</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online • Instant Answers</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Restart chat"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#0f2956] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#0f2956] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Topic Chips Strip */}
            <div className="bg-[#F8FAFD] px-3 py-2 border-b border-slate-200/80 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5">
                Popular:
              </span>
              {PRELOADED_DOUBTS.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSendMessage(item.question)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all shrink-0 shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  {item.category}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#F8FAFD] to-white text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                    {/* Bot Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, idx) =>
                          act.url ? (
                            <Link
                              key={idx}
                              href={act.url}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] hover:bg-blue-100 transition-colors border border-blue-200"
                            >
                              <span>{act.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-[11px] shadow-xs hover:scale-105 transition-all cursor-pointer"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Suggested Follow-up Questions from Bot */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-2 space-y-1 w-full max-w-[90%]">
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-blue-500" />
                        <span>Suggested questions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((su, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => handleSendMessage(su)}
                            className="text-left px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-colors cursor-pointer"
                          >
                            {su} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 max-w-[120px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.3s]"></span>
                  <span className="text-[10px] font-semibold text-slate-400 ml-1">Thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 shrink-0"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask any doubt... (e.g. fees, non-IT, placement)"
                  className="w-full bg-[#F8FAFD] border border-slate-300 rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 p-2 rounded-lg bg-blue-600 text-white disabled:opacity-40 disabled:hover:bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                  title="Send doubt"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>⚡ Instant Answers 24/7</span>
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      "https://wa.me/918939915577?text=Hi%20Seeyam%20team,%20I%20have%20a%20doubt%20and%20want%20to%20chat%20on%20WhatsApp.",
                      "_blank"
                    )
                  }
                  className="text-emerald-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <div className="flex items-center gap-2">
          {/* Quick subtle badge when closed */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="hidden sm:flex bg-white/95 backdrop-blur-md border border-slate-200 text-[#071938] px-3.5 py-2 rounded-full shadow-lg text-xs font-bold hover:scale-105 transition-all items-center gap-1.5 cursor-pointer animate-fade-in"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask a Doubt</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center relative cursor-pointer group"
            aria-label={isOpen ? "Close doubt bot" : "Open doubt bot"}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <>
                <MessageSquare className="w-6 h-6 fill-white" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black">
                  ?
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
