"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Phone,
  MessageSquare,
  Clock,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Users,
} from "lucide-react";
import { MOCK_BATCHES, BatchData, BranchData } from "@/lib/mock-data";
import { getUpcomingBatches } from "@/actions/batches";
import { usePlatformData } from "@/components/PlatformDataContext";
import CounterNumber from "@/components/CounterNumber";

export default function BranchesPage() {
  const { branches } = usePlatformData();
  const [batches, setBatches] = useState<BatchData[]>(MOCK_BATCHES);
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [activeMapBranch, setActiveMapBranch] = useState<BranchData>(branches[0]);

  useEffect(() => {
    if (branches.length > 0) {
      setActiveMapBranch((prev) => branches.find((b) => b.id === prev?.id) || branches[0]);
    }
  }, [branches]);

  useEffect(() => {
    getUpcomingBatches().then((data) => {
      if (data && data.length > 0) setBatches(data);
    });
  }, []);

  const cities = ["ALL", ...Array.from(new Set(branches.map((b) => b.city)))];

  const filteredBranches = branches.filter((b) => {
    if (selectedCity !== "ALL" && b.city !== selectedCity) {
      return false;
    }
    return true;
  });

  const currentMapBranch = activeMapBranch || branches[0];

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Header Banner (Eduma Deep Navy) */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>State-of-the-Art IT Training Hubs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Our <CounterNumber value={branches.length || 5} duration={1200} /> Training Campuses Across South India
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Visit our tech-enabled campuses in Chennai, Bangalore, and Hyderabad. Experience air-conditioned classrooms, 24x7 lab access, and direct placement interview rooms.
            </p>
          </div>
        </div>
      </section>

      {/* City Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">
        <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar" data-card-3d="campus" data-card-density="compact">
          {cities.map((city) => {
            const count =
              city === "ALL"
                ? branches.length
                : branches.filter((b) => b.city === city).length;
            const isActive = selectedCity === city;

            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{city === "ALL" ? "All Campuses" : city}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Branch Cards & Map Preview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Branch Cards Column */}
          <div className="lg:col-span-7 space-y-5">
            {filteredBranches.map((branch) => {
              const activeBatchesCount = batches.filter(
                (b) => b.branchId === branch.id
              ).length;
              const isSelectedForMap = currentMapBranch?.id === branch.id;

              return (
                <div
                  key={branch.id}
                  className={`bg-white rounded-3xl p-6 border transition-all shadow-sm ${
                    isSelectedForMap
                      ? "border-blue-600 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`} data-card-3d="campus" data-card-density="regular"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-extrabold border border-blue-200">
                          {branch.city}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          <CounterNumber value={activeBatchesCount} duration={800} /> Active Batches
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#071938] mt-1">
                        {branch.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => setActiveMapBranch(branch)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 p-2 rounded-xl bg-blue-50"
                      title="Show on Map"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View on Map</span>
                    </button>
                  </div>

                  {/* Address & Landmark */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    {branch.landmark && (
                      <div className="flex items-center gap-2 text-slate-500 pl-6">
                        <span className="font-semibold text-slate-700">Landmark:</span>
                        <span>{branch.landmark}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-500 pl-6">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{branch.timing}</span>
                    </div>
                  </div>

                  {/* Contact Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${branch.phone.replace(/[^0-9+]/g, "")}`}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{branch.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Seeyam%20Technologies,%20I%20want%20to%20visit%20the%20${encodeURIComponent(branch.name)}%20branch.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 border border-blue-200 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    <Link
                      href={`/branches/${branch.slug}`}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>Campus Details & Batches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Google Map Embed + Campus Amenities */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-24 space-y-4" data-card-3d="campus" data-card-density="compact">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#071938]">
                    Live Campus Map Preview
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {currentMapBranch?.name} ({currentMapBranch?.city})
                  </p>
                </div>
                {currentMapBranch && (
                  <Link
                    href={`/branches/${currentMapBranch.slug}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Full Page →
                  </Link>
                )}
              </div>

              {/* Embedded Map iframe */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 bg-slate-100 relative">
                {currentMapBranch?.mapEmbedUrl ? (
                  <iframe
                    title={currentMapBranch.name}
                    src={currentMapBranch.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    Map preview loading...
                  </div>
                )}
              </div>

              {/* Amenities Grid */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Campus Facilities
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-slate-200 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>24x7 High-Compute Lab</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Mock Interview Cell</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Live SAP/AWS Servers</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFD] border border-slate-200 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>AC Classroom Audio/Video</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
