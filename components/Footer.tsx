"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import Logo from "@/components/Logo";
import { decodeHtml } from "@/lib/utils";

interface FooterProps {
  onOpenLeadModal: (courseId?: string, branchId?: string) => void;
}

export default function Footer({ onOpenLeadModal }: FooterProps) {
  const platformData = usePlatformData();
  const courses = platformData?.courses || [];
  const branches = platformData?.branches || [];
  const siteSettings = platformData?.siteSettings || {};

  const socialLinks = [
    {
      name: "Facebook",
      url: siteSettings?.social_facebook,
      hoverClass: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: siteSettings?.social_instagram,
      hoverClass: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: siteSettings?.social_linkedin,
      hoverClass: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: siteSettings?.social_youtube,
      hoverClass: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      url: siteSettings?.social_twitter,
      hoverClass: "hover:bg-black hover:text-white hover:border-slate-700",
      icon: (
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ].filter((s) => s.url);

  return (
    <footer className="bg-[#06142E] text-slate-300 border-t border-[#0f2956] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#0f2956]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="group inline-flex">
              <Logo lightText />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {siteSettings?.footer_about_text ||
                "Empowering analysts, marketers, and growth leaders with industry-grade Data Analytics, Business Intelligence, Digital Marketing masterclasses, and dedicated career placement support across Chennai, Bangalore, and Hyderabad."}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1 bg-[#0b2046] border border-[#16356c] px-2.5 py-1 rounded-md text-blue-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Hands-on projects
              </span>
              <span className="inline-flex items-center gap-1 bg-[#0b2046] border border-[#16356c] px-2.5 py-1 rounded-md text-amber-300 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Career guidance
              </span>
            </div>

            {/* Social Media Links with Real Brand Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5 pt-2">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Follow Us:</span>
                <div className="flex items-center gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 rounded-xl bg-[#0b2046] text-slate-300 border border-[#16356c] flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xs ${s.hoverClass}`}
                      title={s.name}
                      aria-label={`Follow Seeyam on ${s.name}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Popular Programs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {courses.slice(0, 5).map((course) => (
                <li key={course.id}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="hover:text-blue-400 transition-colors text-left truncate max-w-[200px] block"
                  >
                    {decodeHtml(course.title)}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/courses"
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>All {courses.length}+ Programs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Training Campuses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Campus Locations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {branches.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/branches/${b.slug}`}
                    className="hover:text-blue-400 transition-colors text-left flex items-start gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{b.name} ({b.city})</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/branches"
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>Explore All {branches.length} Campuses</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Quick Connect
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <a
                  href={`tel:${(siteSettings?.footer_phone || "+918939915577").replace(/[^0-9+]/g, "")}`}
                  className="hover:text-white font-semibold"
                >
                  {siteSettings?.footer_phone || "+91 89399 15577"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a
                  href={`mailto:${siteSettings?.footer_email || "info@seeyamtechnologies.com"}`}
                  className="hover:text-white"
                >
                  {siteSettings?.footer_email || "info@seeyamtechnologies.com"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{siteSettings?.footer_hours || "Mon - Sun: 7:00 AM - 9:00 PM"}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenLeadModal()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-4 py-2.5 rounded-xl shadow-md shadow-amber-500/20 transition-all w-full justify-center"
              >
                <span>Book 1-on-1 Counseling</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Multi-Page Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {siteSettings?.footer_copyright || "Seeyam Technologies Pvt. Ltd. All rights reserved."}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/courses" className="hover:text-blue-400 transition-colors">Courses</Link>
            <span>•</span>
            <Link href="/placements" className="hover:text-blue-400 transition-colors">Placements</Link>
            <span>•</span>
            <Link href="/resources" className="hover:text-blue-400 transition-colors">Free Resources</Link>
            <span>•</span>
            <Link href="/resources/sql-compiler" className="hover:text-blue-400 transition-colors">SQL Compiler</Link>
            <span>•</span>
            <Link href="/blog" className="hover:text-blue-400 transition-colors">Career Blog</Link>
            <span>•</span>
            <Link href="/reviews" className="hover:text-blue-400 transition-colors">Reviews</Link>
            <span>•</span>
            <Link href="/branches" className="hover:text-blue-400 transition-colors">Campuses</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" className="hover:text-blue-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
