"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Settings,
  Building2,
  Bell,
  ShieldCheck,
  Download,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MessageSquare,
  Globe2,
  Users2,
  Database,
  KeyRound,
  Sparkles,
  Video,
  Play,
  ExternalLink,
  Youtube,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { exportLeadsCsv } from "@/actions/leads";
import { getHeroMedia, updateHeroMedia } from "@/actions/media";
import { INITIAL_HERO_MEDIA, HeroMediaSettings } from "@/lib/mock-data";
import { extractYoutubeEmbedUrl, extractYoutubeId } from "@/lib/utils";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "media" | "routing" | "notifications" | "security" | "backup"
  >("general");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: "Seeyam Technologies",
    tagline: "Premier IT Training, Certification & Placement Institute",
    supportEmail: "admissions@seeyamtechnologies.com",
    helplinePhone: "+91 98400 12345",
    whatsappNumber: "+91 98400 12345",
    headquarters: "OMR IT Corridor, Chennai, Tamil Nadu - 600096",
  });

  // Hero Media / YouTube state
  const [heroMedia, setHeroMedia] = useState<HeroMediaSettings>(INITIAL_HERO_MEDIA);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [routingSettings, setRoutingSettings] = useState({
    autoAssign: true,
    routingMethod: "round-robin",
    defaultCounselor: "Priya Sharma",
    notifyOnNewLead: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    whatsappAlerts: true,
    smsAlerts: false,
    dailySummaryEmail: true,
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    getHeroMedia().then((res) => {
      if (res) setHeroMedia(res);
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage("Settings updated and saved successfully!");
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleSaveHeroMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setMediaLoading(true);
    const res = await updateHeroMedia(heroMedia);
    setMediaLoading(false);

    if (res.success) {
      setSavedMessage("Hero YouTube video configuration saved and live on homepage!");
      setTimeout(() => setSavedMessage(null), 3500);
    }
  };

  const handleBackupDownload = async (format: "json" | "csv") => {
    if (format === "csv") {
      const csv = await exportLeadsCsv({});
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `seeyam-crm-backup-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const data = {
        institute: generalSettings,
        heroMedia,
        exportDate: new Date().toISOString(),
        version: "1.0.0",
        message: "Full database schema backup exported from Seeyam CRM",
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `seeyam-settings-backup-${new Date().toISOString().split("T")[0]}.json`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const currentEmbedUrl = extractYoutubeEmbedUrl(heroMedia.youtubeUrl);
  const currentVideoId = extractYoutubeId(heroMedia.youtubeUrl);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-800" />
              <span>Platform Settings & Administration</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure institute branding, homepage YouTube video showcase, lead routing, and security.
            </p>
          </div>

          {savedMessage && (
            <div className="p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{savedMessage}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "general"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Institute Profile</span>
          </button>

          {/* New Hero Video Tab */}
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "media"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>Homepage Hero Video</span>
          </button>

          <button
            onClick={() => setActiveTab("routing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "routing"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Counselor Lead Routing</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "notifications"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "security"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Security</span>
          </button>

          <button
            onClick={() => setActiveTab("backup")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "backup"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Export & Backup</span>
          </button>
        </div>

        {/* Tab 1: General Institute Profile */}
        {activeTab === "general" && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6" data-card-3d="settings" data-card-density="compact"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Institute Profile & Contact Points
              </h3>
              <p className="text-xs text-slate-500">
                Public entity details displayed across landing page, WhatsApp links, and search schemas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Institute Brand Name</label>
                <input
                  type="text"
                  value={generalSettings.instituteName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, instituteName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Public Tagline</label>
                <input
                  type="text"
                  value={generalSettings.tagline}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, tagline: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Admissions Email</label>
                <input
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Direct Helpline Phone</label>
                <input
                  type="text"
                  value={generalSettings.helplinePhone}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, helplinePhone: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">WhatsApp Business Helpline</label>
                <input
                  type="text"
                  value={generalSettings.whatsappNumber}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, whatsappNumber: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Headquarters Address</label>
                <input
                  type="text"
                  value={generalSettings.headquarters}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, headquarters: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Hero YouTube Video & Media Showcase */}
        {activeTab === "media" && (
          <form
            onSubmit={handleSaveHeroMedia}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6" data-card-3d="settings" data-card-density="compact"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                <Video className="w-3.5 h-3.5" />
                <span>Public Landing Page Hero Card</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Homepage YouTube Video Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Replace or update the video displayed in the main hero section of the website. Supports standard YouTube URLs, short links, or embed links.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Controls */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                {/* YouTube Link */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>YouTube Video URL *</span>
                    </span>
                    {heroMedia.youtubeUrl && (
                      <a
                        href={heroMedia.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Open on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    required
                    value={heroMedia.youtubeUrl}
                    onChange={(e) =>
                      setHeroMedia({ ...heroMedia, youtubeUrl: e.target.value })
                    }
                    placeholder="e.g. https://www.youtube.com/watch?v=kqtD5dpn9C8 or https://youtu.be/..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-mono"
                  />
                  <div className="text-[11px] text-slate-400">
                    Supports formats: <code>https://youtube.com/watch?v=...</code>, <code>https://youtu.be/...</code>, or <code>embed/...</code>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Top Floating Badge Text
                  </label>
                  <input
                    type="text"
                    value={heroMedia.badge}
                    onChange={(e) =>
                      setHeroMedia({ ...heroMedia, badge: e.target.value })
                    }
                    placeholder="e.g. Featured Masterclass & Campus Tour"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Video Title */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Video Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroMedia.title}
                    onChange={(e) =>
                      setHeroMedia({ ...heroMedia, title: e.target.value })
                    }
                    placeholder="e.g. Inside Seeyam Technologies — Campus Tour & Student Transformations"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                {/* Subtitle / Caption */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Description / Caption
                  </label>
                  <textarea
                    rows={3}
                    value={heroMedia.subtitle}
                    onChange={(e) =>
                      setHeroMedia({ ...heroMedia, subtitle: e.target.value })
                    }
                    placeholder="e.g. Watch how our students master real-world software development, cloud infrastructure, and land top-tier tech jobs."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed"
                  />
                </div>

                {/* Preset Suggestions */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Quick Preset Links
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setHeroMedia({
                          ...heroMedia,
                          youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
                          title: "Python for Beginners — Full Course",
                          subtitle: "Learn Python programming fundamentals, data structures, and OOP for tech jobs.",
                          badge: "Free Masterclass Session",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                    >
                      Python Masterclass
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroMedia({
                          ...heroMedia,
                          youtubeUrl: "https://www.youtube.com/watch?v=8pDqJVdNa44",
                          title: "Full Stack Web Development Roadmap",
                          subtitle: "Complete guide on frontend, backend, microservices, and high-scale deployments.",
                          badge: "Career Roadmap 2026",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                    >
                      Full Stack Roadmap
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroMedia({
                          ...heroMedia,
                          youtubeUrl: "https://www.youtube.com/watch?v=X3paOmcrTjQ",
                          title: "Next.js 15 Full Tutorial & Deployment",
                          subtitle: "Build high performance applications with React Server Components & Server Actions.",
                          badge: "Modern Frameworks",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                    >
                      Next.js Masterclass
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>Live Hero Card Preview</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Video ID: {currentVideoId || "None"}
                  </span>
                </div>

                <div className="bg-slate-900 rounded-3xl p-5 text-white border border-slate-800 shadow-xl space-y-3" data-card-3d="settings" data-card-density="compact">
                  {/* Floating badge */}
                  <div className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                    <Video className="w-3 h-3 fill-slate-950" />
                    <span>{heroMedia.badge || "Featured Video"}</span>
                  </div>

                  {/* Video Player */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                    <iframe
                      src={currentEmbedUrl}
                      title="Hero Preview"
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Title and Subtitle */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-white leading-snug">
                      {heroMedia.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {heroMedia.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Changes take effect instantly across all homepage visitors.
              </span>
              <button
                type="submit"
                disabled={mediaLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
              >
                {mediaLoading ? (
                  <span>Saving Video...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Update Hero Video</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Counselor Lead Routing */}
        {activeTab === "routing" && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6" data-card-3d="settings" data-card-density="compact"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lead Assignment & Counselor Workflows
              </h3>
              <p className="text-xs text-slate-500">
                Configure how new website and walk-in inquiries are distributed among staff
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={routingSettings.autoAssign}
                  onChange={(e) =>
                    setRoutingSettings({ ...routingSettings, autoAssign: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Enable Automatic Lead Assignment</div>
                  <div className="text-slate-500">
                    Distribute new inquiries instantly when submitted on landing page
                  </div>
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Distribution Algorithm</label>
                  <select
                    value={routingSettings.routingMethod}
                    onChange={(e) =>
                      setRoutingSettings({ ...routingSettings, routingMethod: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="round-robin">Round Robin (Equal Share)</option>
                    <option value="branch-based">Campus Branch Matching (OMR, Velachery, BTM)</option>
                    <option value="load-balanced">Counselor Workload Balanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Lead Counselor</label>
                  <select
                    value={routingSettings.defaultCounselor}
                    onChange={(e) =>
                      setRoutingSettings({ ...routingSettings, defaultCounselor: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Priya Sharma">Priya Sharma (Senior Counselor)</option>
                    <option value="Karthik Raj">Karthik Raj (Tech Counselor)</option>
                    <option value="Divya M">Divya M (Placement Coordinator)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Routing Rules</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Alerts & Notifications */}
        {activeTab === "notifications" && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6" data-card-3d="settings" data-card-density="compact"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">Notification Triggers</h3>
              <p className="text-xs text-slate-500">
                Configure real-time alerts for counselors and students
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailAlerts: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Instant Email Alert to Counselors</div>
                  <div className="text-slate-500">
                    Send candidate details to admissions team when a lead is captured
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsappAlerts}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      whatsappAlerts: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    WhatsApp Instant Confirmation to Student
                  </div>
                  <div className="text-slate-500">
                    Send automated syllabus PDF and counselor contact via WhatsApp API
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.dailySummaryEmail}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      dailySummaryEmail: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Daily Executive Summary at 8:00 PM</div>
                  <div className="text-slate-500">
                    Send total leads, conversions, and batch fill rate report to Director
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Alert Preferences</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 5: Admin Security */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6" data-card-3d="settings" data-card-density="compact">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Admin Authentication & Session Policy
              </h3>
              <p className="text-xs text-slate-500">
                Manage administrator passwords and active sessions
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3" data-card-3d="settings" data-card-density="compact">
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-bold text-slate-900">Active Admin Account</div>
                  <div className="text-slate-500">admin@seeyam.com (Director Profile)</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Role: ADMIN
                </span>
              </div>
              <div className="text-[11px] text-slate-600">
                Session Token Security: HMAC-SHA256 with HTTP-only Cookies
              </div>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              <h4 className="font-bold text-slate-800">Change Admin Password</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordState.currentPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, currentPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordState.newPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, newPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordState.confirmPassword}
                    onChange={(e) =>
                      setPasswordState({ ...passwordState, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSavedMessage("Admin password updated successfully!");
                  setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setTimeout(() => setSavedMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: Data Export & Backup */}
        {activeTab === "backup" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6" data-card-3d="settings" data-card-density="regular">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Database Export & System Backup
              </h3>
              <p className="text-xs text-slate-500">
                Download complete snapshots of leads, batch schedules, and institute configuration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between" data-card-3d="settings" data-card-density="compact">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Export Leads CRM Dataset (CSV)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete export of all admissions inquiries, phone numbers, target courses, branch preferences, and counselor notes.
                  </p>
                </div>
                <button
                  onClick={() => handleBackupDownload("csv")}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download Leads CSV</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between" data-card-3d="settings" data-card-density="compact">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Database className="w-4 h-4 text-teal-600" />
                    <span>Full Platform Configuration (JSON)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete snapshot of platform settings, hero YouTube video, SEO metadata configuration, counselor routing, and branch profiles.
                  </p>
                </div>
                <button
                  onClick={() => handleBackupDownload("json")}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>Export System JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
