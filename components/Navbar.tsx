"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Phone,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Sparkles,
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
import { BranchData } from "@/lib/mock-data";
import { usePlatformData } from "@/components/PlatformDataContext";
import Logo from "@/components/Logo";

interface NavbarProps {
  onOpenLeadModal: (courseId?: string, branchId?: string) => void;
}

export default function Navbar({ onOpenLeadModal }: NavbarProps) {
  const platformData = usePlatformData();
  const branches = platformData?.branches || [];
  const courses = platformData?.courses || [];
  const categories = platformData?.categories || [];
  const siteSettings = platformData?.siteSettings || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | undefined>(branches[0]);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const branchMenuRef = useRef<HTMLDivElement>(null);
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
    if (branches && branches.length > 0) {
      setSelectedBranch((prev) => branches.find((b) => b.id === prev?.id) || branches[0]);
    }
  }, [branches]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
      if (branchMenuRef.current && !branchMenuRef.current.contains(event.target as Node)) {
        setBranchMenuOpen(false);
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

  const activeBranch = selectedBranch || branches[0];

  return (
    <>
      {/* Top Utility Bar (Deep Navy Theme) */}
      <div className="bg-[#071938] text-slate-300 text-xs py-2 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Trust Badges (Dynamic from WordPress Settings) */}
          <div className="hidden lg:flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Practical learning</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Classroom & online</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Career preparation</span>
            </span>
          </div>

          {/* Right: Helpline & Campus Selector */}
          <div className="flex items-center justify-between sm:justify-end w-full lg:w-auto gap-2 sm:gap-4">
            {/* Campus Selector Dropdown */}
            <div className="relative shrink-0" ref={branchMenuRef}>
              <button
                onClick={() => setBranchMenuOpen(!branchMenuOpen)}
                className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white transition-colors bg-[#0e2a5c] px-2.5 py-1 rounded-md border border-[#1d4282] max-w-[220px] truncate"
              >
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{activeBranch?.city || "Campuses"}:</span>
                <span className="font-semibold text-white truncate">
                  {activeBranch?.phone || siteSettings?.navbar_helpline_phone || "+91 89399 15577"}
                </span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>

              {branchMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#071938] text-slate-200 rounded-xl shadow-2xl border border-[#1d4282] py-2 z-50 animate-scale-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#0f2956]">
                    Direct Branch Helplines
                  </div>
                  {branches.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBranch(b);
                        setBranchMenuOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-[#0e2a5c] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-medium text-white">{b.name}</div>
                        <div className="text-[11px] text-slate-400">{b.city}</div>
                      </div>
                      <a
                        href={`tel:${b.phone.replace(/[^0-9+]/g, "")}`}
                        className="text-amber-400 text-xs hover:underline flex items-center gap-1 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="tel:18001235577"
              className="text-slate-300 hover:text-amber-400 transition-colors pl-2 hidden sm:flex items-center gap-1 font-semibold whitespace-nowrap shrink-0"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Toll Free: 1800-123-5577</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "glass shadow-md border-b border-slate-200/80 py-3"
            : "bg-white border-b border-slate-100 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group inline-flex shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-0.5">
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
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
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
              Campuses
            </Link>

            <Link
              href="/contact"
              className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors whitespace-nowrap"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right CTA Buttons */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {activeBranch && (
              <a
                href={`https://wa.me/${activeBranch.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Seeyam%20Technologies,%20I%20am%20interested%20in%20career%20counseling%20and%20course%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all hover:scale-105 whitespace-nowrap shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="sr-only">WhatsApp Chat</span>
              </a>
            )}

            {/* Elegant Gold "Book Free Demo" Button with Guaranteed Full Width */}
            <button
              onClick={() => onOpenLeadModal()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Laptop className="w-4 h-4 shrink-0" />
              <span>Book a demo</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="xl:hidden flex items-center gap-1 shrink-0">
            <button
              onClick={() => onOpenLeadModal()}
              className="hidden min-[375px]:block px-3 py-2 text-[10px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Book Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
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
        <div className="fixed inset-0 z-50 xl:hidden">
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
              >
                Book Free Demo Session
              </button>
              <a
                href="tel:+918939915577"
                className="w-full py-2.5 bg-slate-100 text-slate-800 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Helpline: 1800-123-5577</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
