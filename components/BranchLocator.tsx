"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Navigation,
  ExternalLink,
  ChevronDown,
  Building,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { MOCK_BRANCHES, BranchData } from "@/lib/mock-data";

interface BranchLocatorProps {
  onOpenLeadModal: (courseId?: string, branchId?: string) => void;
}

export default function BranchLocator({ onOpenLeadModal }: BranchLocatorProps) {
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [expandedMapBranchId, setExpandedMapBranchId] = useState<string | null>(null);

  const cities = ["ALL", ...Array.from(new Set(MOCK_BRANCHES.map((b) => b.city)))];

  const filteredBranches =
    selectedCity === "ALL"
      ? MOCK_BRANCHES
      : MOCK_BRANCHES.filter((b) => b.city === selectedCity);

  return (
    <section id="branches" className="py-20 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 uppercase tracking-wider border border-blue-200">
            <Building className="w-3.5 h-3.5 text-amber-500" />
            <span>State-of-the-Art Training Facilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#071938] tracking-tight">
            Find a Seeyam Technologies Campus Near You
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Visit any of our high-tech campuses equipped with dedicated lab workstations, high-speed fiber, and 1-on-1 mentor cabins.
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                selectedCity === city
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {city === "ALL" ? "All Locations (6)" : `${city} (${MOCK_BRANCHES.filter(b => b.city === city).length})`}
            </button>
          ))}
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches.map((branch) => {
            const isMapExpanded = expandedMapBranchId === branch.id;

            return (
              <div
                key={branch.id}
                className="bg-[#F8FAFD] rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all p-6 sm:p-7 flex flex-col justify-between group" data-card-3d="campus" data-card-density="compact"
              >
                <div>
                  {/* Top Badge & City */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
                      {branch.city} Campus
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Open 7 Days
                    </span>
                  </div>

                  <Link href={`/branches/${branch.slug}`}>
                    <h3 className="text-xl font-extrabold text-[#071938] group-hover:text-blue-600 transition-colors">
                      {branch.name}
                    </h3>
                  </Link>

                  {/* Address */}
                  <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{branch.address}</span>
                    </div>

                    {branch.landmark && (
                      <div className="text-[11px] text-slate-500 pl-6">
                        <span className="font-semibold text-slate-700">Landmark: </span>
                        {branch.landmark}
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 text-slate-500 pl-6">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{branch.timing}</span>
                    </div>
                  </div>

                  {/* Embedded Map Section */}
                  {branch.mapEmbedUrl && (
                    <div className="mt-4">
                      <button
                        onClick={() =>
                          setExpandedMapBranchId(isMapExpanded ? null : branch.id)
                        }
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isMapExpanded ? "Hide Google Map" : "View Map & Directions"}</span>
                      </button>

                      {isMapExpanded && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100 animate-scale-in">
                          <iframe
                            title={`Map for ${branch.name}`}
                            src={branch.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action CTAs in Blue & Gold */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <a
                      href={`tel:${branch.phone.replace(/[^0-9+]/g, "")}`}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Call Branch</span>
                    </a>

                    <a
                      href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Seeyam%20Technologies,%20I%20want%20to%20know%20more%20about%20the%20${encodeURIComponent(branch.name)}%20branch.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => onOpenLeadModal(undefined, branch.id)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
                  >
                    Schedule Free Campus Visit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
