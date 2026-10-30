"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Sparkles,
  Navigation,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllBranches, createBranch, updateBranch, deleteBranch } from "@/actions/branches";
import { BranchData } from "@/lib/mock-data";

export default function CampusBranchesPage() {
  const [branches, setBranches] = useState<BranchData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    address: "",
    city: "Chennai",
    phone: "+91 89399 15577",
    whatsapp: "+91 89399 15577",
    email: "admissions@seeyamtechnologies.com",
    timing: "Mon - Sun: 7:00 AM - 9:00 PM",
    landmark: "",
    mapEmbedUrl: "",
  });

  const [isPending, startTransition] = useTransition();

  const loadBranches = async () => {
    setLoading(true);
    try {
      const list = await getAllBranches();
      setBranches(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const cities = ["ALL", ...Array.from(new Set(branches.map((b) => b.city)))];

  const filteredBranches = branches.filter((b) => {
    if (cityFilter !== "ALL" && b.city !== cityFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.landmark.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const res = await createBranch({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      address: form.address,
      city: form.city,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      timing: form.timing,
      landmark: form.landmark,
      mapEmbedUrl: form.mapEmbedUrl || "https://maps.google.com",
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMessage("Campus branch created successfully!");
      setForm({
        name: "",
        slug: "",
        address: "",
        city: "Chennai",
        phone: "+91 89399 15577",
        whatsapp: "+91 89399 15577",
        email: "admissions@seeyamtechnologies.com",
        timing: "Mon - Sun: 7:00 AM - 9:00 PM",
        landmark: "",
        mapEmbedUrl: "",
      });
      loadBranches();
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setStatusMessage(null);
      }, 1000);
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    setSubmitting(true);
    setStatusMessage(null);

    const res = await updateBranch(editingBranch.id, editingBranch);
    setSubmitting(false);

    if (res.success) {
      setStatusMessage("Campus branch updated successfully!");
      loadBranches();
      setTimeout(() => {
        setEditingBranch(null);
        setStatusMessage(null);
      }, 1000);
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this campus branch?")) {
      startTransition(async () => {
        await deleteBranch(id);
        loadBranches();
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-slate-800" />
              <span>Campus Branches & Facilities</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage training centers, classroom facilities, counselor phone numbers, and Google map embeds.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Campus Branch</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="campus" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Campuses</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{branches.length}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                Chennai, Bangalore & Hyderabad
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="campus" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Operating Cities</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{cities.length - 1}</div>
              <div className="text-[11px] text-blue-600 font-bold mt-0.5">
                Prime Tech IT Corridors
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="campus" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Facility Hours</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">7 AM - 9 PM</div>
              <div className="text-[11px] text-teal-600 font-bold mt-0.5">
                7 Days a Week Support
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="campus" data-card-density="regular">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus name, landmark, or address..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Cities ({cities.length - 1})</option>
              {cities.filter((c) => c !== "ALL").map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campus Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading campus branches...</span>
              </div>
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-200" data-card-3d="campus" data-card-density="compact">
              No campus branches found matching the search criteria.
            </div>
          ) : (
            filteredBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden" data-card-3d="campus" data-card-density="regular"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {branch.city} Campus
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {branch.slug}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{branch.name}</h3>

                  <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>

                  {branch.landmark && (
                    <div className="text-[11px] text-slate-500 italic">
                      Landmark: {branch.landmark}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <a href={`tel:${branch.phone}`} className="hover:underline font-semibold">
                        {branch.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      <a
                        href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-teal-700 font-semibold"
                      >
                        WhatsApp: {branch.whatsapp}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{branch.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{branch.timing}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <a
                    href={branch.mapEmbedUrl || "https://maps.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingBranch(branch)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Edit branch"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete branch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Branch Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 z-10 animate-scale-in max-h-[90vh] overflow-y-auto" data-card-3d="campus" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Campus Branch</h3>
                <p className="text-xs text-slate-500">Register new training facility</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Tambaram Campus"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Chennai"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Physical Address *</label>
                <textarea
                  rows={2}
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Plot No, Street, Tech Hub, Pin Code..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    placeholder="Opposite Metro Station"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Helpline Phone *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Helpline *</label>
                  <input
                    type="text"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Working Timings</label>
                <input
                  type="text"
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  placeholder="Mon - Sun: 7:00 AM - 9:00 PM"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Adding Campus..." : "Add Campus Branch"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setEditingBranch(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 z-10 animate-scale-in max-h-[90vh] overflow-y-auto" data-card-3d="campus" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Campus Branch</h3>
                <p className="text-xs text-slate-500">Update address & contact helpline</p>
              </div>
              <button onClick={() => setEditingBranch(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Name *</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.name}
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.city}
                    onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Physical Address *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={editingBranch.landmark}
                    onChange={(e) => setEditingBranch({ ...editingBranch, landmark: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Helpline Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Helpline *</label>
                  <input
                    type="text"
                    required
                    value={editingBranch.whatsapp}
                    onChange={(e) => setEditingBranch({ ...editingBranch, whatsapp: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingBranch.email}
                    onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Saving Changes..." : "Save Branch Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
