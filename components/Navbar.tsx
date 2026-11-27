"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Phone,
  ChevronDown,
  Menu,
  X,
  CircleDot,
  MapPin,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Search,
  Laptop,
  FileText,
} from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import Logo from "@/components/Logo";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { contactDetails, phoneHref, whatsappHref } from "@/lib/contact";

interface NavbarProps {
  onOpenLeadModal: (courseId?: string, branchId?: string) => void;
}

export default function Navbar({ onOpenLeadModal }: NavbarProps) {
  const platformData = usePlatformData();
  const courses = platformData?.courses || [];
  const categories = platformData?.categories || [];
  const siteSettings = platformData?.siteSettings || {};
  const { phone: contactPhone, whatsapp, maps, displayAddress } = contactDetails(siteSettings);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileDrawerRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close navigation"]')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
      if (event.key !== "Tab") return;
      const controls = mobileDrawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      opener?.focus();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCategoryIcon = (iconName: string) => {
    return <BookOpen className="w-4 h-4 text-blue-600" />;
  };


  return (
    <>
      {/* Top Utility Bar (Deep Navy Theme) */}
      <div className="premiere-nav-strip text-slate-300 text-xs py-2 border-b border-[#0f2956]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Trust Badges (Dynamic from WordPress Settings) */}
          <div className="hidden shrink-0 items-center gap-4 xl:flex">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Practical learning</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Classroom & online</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <CircleDot className="w-3.5 h-3.5 text-amber-400" />
              <span>Career preparation</span>
            </span>
          </div>

          {/* Right: Helpline & Campus Selector */}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:justify-end sm:gap-4">
            <a href={maps} className="flex min-w-0 items-start gap-1.5 font-bold leading-snug hover:underline">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" /> <span>{displayAddress}</span>
            </a>

            <a
              href={phoneHref(contactPhone)}
              className="text-slate-300 hover:text-amber-400 transition-colors pl-2 flex items-center gap-1 font-semibold whitespace-nowrap shrink-0"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{contactPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`premiere-nav sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass shadow-md border-b border-slate-200/80 py-3"
            : "bg-white border-b border-slate-100 py-3.5"
        }`}
      >
        <div className="flex w-full items-center justify-between gap-2 px-2.5 sm:px-5 lg:px-6">
          {/* Brand Logo */}
          <Link href="/" className="group inline-flex min-w-0">
            <Logo size="md" className="premiere-nav-brand" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-0.5">
            <Link href="/" className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700">Home</Link>
            {/* Mega Menu Dropdown for Courses */}
            <div className="relative" ref={megaMenuRef}>
              <div className="flex items-center">
                <Link
                  href="/courses"
                  className="flex items-center gap-1 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Courses</span>
                </Link>
                <button
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                  aria-label="Toggle courses menu"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
              </div>

              {megaMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-[720px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 z-50 animate-scale-in">
                  <div className="grid grid-cols-2 gap-6">
                    {categories.map((cat) => {
                      const coursesInCat = courses.filter((c) => c.categoryId === cat.id);
                      return (
                        <div key={cat.id} className="space-y-2">
                          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                            {getCategoryIcon(cat.icon)}
                            <span className="font-bold text-sm text-slate-900">
                              {cat.name}
                            </span>
                          </div>
                          <ul className="space-y-1 pl-1">
                            {coursesInCat.map((course) => (
                              <li key={course.id}>
                                <Link
                                  href={`/courses/${course.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="w-full text-left text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 p-1.5 rounded transition-colors flex items-center justify-between group/c"
                                >
                                  <span className="font-medium truncate pr-2">
                                    {course.title}
                                  </span>
                                  <span className="text-[10px] text-blue-600 font-semibold opacity-0 group-hover/c:opacity-100 transition-opacity flex items-center gap-0.5">
                                    View <ArrowRight className="w-3 h-3" />
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between">
                    <Link
                      href="/courses"
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View All {courses.length}+ Certification Programs <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => {
                        setMegaMenuOpen(false);
                        onOpenLeadModal();
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600"
                    >
                      Request Syllabus & Fee
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors whitespace-nowrap"
            >
              About
            </Link>

            <Link
              href="/placements"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <CircleDot className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Placements</span>
            </Link>

            <Link
              href="/resources"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Resources</span>
            </Link>

            <Link
              href="/reviews"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors whitespace-nowrap"
            >
              Reviews
            </Link>

            <Link
              href="/branches"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors whitespace-nowrap"
            >
              Campus
            </Link>

            <Link
              href="/contact"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors whitespace-nowrap"
            >
              Contact
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <a
                href={whatsappHref(whatsapp, "Hi SEEYAM, I’m interested in your courses.")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Chat"
                className="inline-flex h-10 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white transition-colors hover:bg-[#fff3ea] sm:w-11"
              >
                <WhatsAppIcon className="seeyam-whatsapp-icon h-5 w-5" />
                <span className="sr-only">WhatsApp Chat</span>
              </a>

            <button
              onClick={() => onOpenLeadModal()}
              className="premiere-nav-demo inline-flex min-h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-2 text-[10px] font-extrabold transition-colors sm:px-4 sm:text-xs"
            >
              <Laptop className="hidden h-4 w-4 shrink-0 sm:block" />
              <span className="sm:hidden">Book Demo</span>
              <span className="hidden sm:inline">Book a demo</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-9 items-center justify-center rounded-xl text-slate-700 transition-colors xl:hidden"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer Menu */}
      {mobileMenuOpen && (
        <div data-enquiry-blocking-overlay className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#071938]/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div ref={mobileDrawerRef} role="dialog" aria-modal="true" aria-label="Site navigation" id="mobile-navigation" className="fixed top-0 right-0 bottom-0 w-5/6 max-w-sm bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="mt-6 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Navigation
                </div>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                >
                  About Us
                </Link>
                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                >
                  All IT Courses
                </Link>
                <Link
                  href="/placements"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                >
                  Placement Records & Stories
                </Link>
                <Link
                  href="/resources"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Free Resources & SQL Compiler</span>
                </Link>
                <Link
                  href="/reviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                >
                  Student Reviews & Testimonials
                </Link>
                <Link
                  href="/branches"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                >
                  Training Center Locations
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-semibold text-amber-600 hover:text-amber-700 font-bold"
                >
                  Contact & 1-on-1 Counseling
                </Link>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Popular Programs
                  </div>
                  <div className="space-y-1.5">
                    {courses.slice(0, 4).map((c) => (
                      <Link
                        key={c.id}
                        href={`/courses/${c.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left text-xs text-slate-600 hover:text-blue-600 py-1 flex items-center justify-between"
                      >
                        <span className="truncate">{c.title}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                          {c.mode}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLeadModal();
                }}
                className="w-full py-3 premiere-nav-demo rounded-xl font-bold text-xs"
              >
                Book Free Demo Session
              </button>
              <a
                href={phoneHref(contactPhone)}
                className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Contact {contactPhone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
