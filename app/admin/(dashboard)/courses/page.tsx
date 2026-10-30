"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Layers,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Sparkles,
  TrendingUp,
  Tag,
  DollarSign,
  Laptop,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getCourses, getAllCategories, createCourse, updateCourse, deleteCourse } from "@/actions/courses";
import { CourseData, CategoryData, MOCK_CATEGORIES } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [modeFilter, setModeFilter] = useState("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    slug: "",
    categoryId: MOCK_CATEGORIES[0]?.id || "cat-fsd",
    summary: "",
    duration: "12 Weeks",
    mode: "HYBRID" as CourseData["mode"],
    price: 35000,
    expectedSalary: "₹6.5 - ₹14 LPA",
    isFeatured: false,
  });

  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const [crList, catList] = await Promise.all([
        getCourses(),
        getAllCategories(),
      ]);
      setCourses(crList);
      if (catList && catList.length > 0) setCategories(catList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCourses = courses.filter((c) => {
    if (categoryFilter !== "ALL" && c.categoryId !== categoryFilter) return false;
    if (modeFilter !== "ALL" && c.mode !== modeFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const res = await createCourse({
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId: form.categoryId,
      summary: form.summary,
      duration: form.duration,
      mode: form.mode,
      price: Number(form.price),
      expectedSalary: form.expectedSalary,
      isFeatured: form.isFeatured,
      highlights: [
        "100% Placement Assistance with 450+ Hiring Partners",
        "Live Hands-on Real-time Capstone Projects",
        "1-on-1 Mentor Code Reviews and Mock Interviews",
      ],
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMessage("Course created successfully!");
      setForm({
        title: "",
        slug: "",
        categoryId: MOCK_CATEGORIES[0]?.id || "cat-fsd",
        summary: "",
        duration: "12 Weeks",
        mode: "HYBRID",
        price: 35000,
        expectedSalary: "₹6.5 - ₹14 LPA",
        isFeatured: false,
      });
      loadData();
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
    if (!editingCourse) return;
    setSubmitting(true);
    setStatusMessage(null);

    const res = await updateCourse(editingCourse.id, editingCourse);
    setSubmitting(false);

    if (res.success) {
      setStatusMessage("Course updated successfully!");
      loadData();
      setTimeout(() => {
        setEditingCourse(null);
        setStatusMessage(null);
      }, 1000);
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleToggleFeatured = (courseId: string, currentFeatured: boolean) => {
    startTransition(async () => {
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, isFeatured: !currentFeatured } : c))
      );
      await updateCourse(courseId, { isFeatured: !currentFeatured });
      loadData();
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course program?")) {
      startTransition(async () => {
        await deleteCourse(id);
        loadData();
      });
    }
  };

  const totalEnrolled = courses.reduce((acc, c) => acc + c.enrolledCount, 0);
  const featuredCount = courses.filter((c) => c.isFeatured).length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-slate-800" />
              <span>Course Curriculum Catalog</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage IT training programs, syllabus modules, tuition fees, and featured listings.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Programs</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{courses.length}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                Across {categories.length} Tech Categories
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Featured Programs</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{featuredCount}</div>
              <div className="text-[11px] text-amber-600 font-bold mt-0.5">
                Promoted on Homepage
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Enrolled Alumni</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalEnrolled}+</div>
              <div className="text-[11px] text-teal-600 font-bold mt-0.5">
                Verified Students Placed
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="settings" data-card-density="regular">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course title or summary..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Training Modes</option>
              <option value="CLASSROOM">CLASSROOM</option>
              <option value="ONLINE">ONLINE</option>
              <option value="HYBRID">HYBRID</option>
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading course catalog...</span>
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-200" data-card-3d="settings" data-card-density="compact">
              No courses found matching the selected filters.
            </div>
          ) : (
            filteredCourses.map((course) => {
              const cat = categories.find((c) => c.id === course.categoryId);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden" data-card-3d="settings" data-card-density="regular"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {cat?.name || "IT Course"}
                      </span>
                      <button
                        onClick={() => handleToggleFeatured(course.id, course.isFeatured)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          course.isFeatured
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title="Click to toggle featured"
                      >
                        {course.isFeatured ? "★ Featured" : "+ Feature"}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.summary}</p>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="capitalize">{course.mode.toLowerCase()}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{formatCurrency(course.price)}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Target: {course.expectedSalary}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400 text-[10px]">({course.enrolledCount} enrolled)</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Edit course"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 z-10 animate-scale-in max-h-[90vh] overflow-y-auto" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New IT Course</h3>
                <p className="text-xs text-slate-500">Publish new curriculum to catalog</p>
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Master Full Stack Next.js & Python AI"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Training Mode *</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value as CourseData["mode"] })}
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="HYBRID">HYBRID</option>
                    <option value="CLASSROOM">CLASSROOM</option>
                    <option value="ONLINE">ONLINE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Brief 2-sentence description for cards and search snippets..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="12 Weeks"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Salary</label>
                  <input
                    type="text"
                    value={form.expectedSalary}
                    onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                    placeholder="₹6.5 - ₹14 LPA"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">Feature this program on the landing page</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Publishing Course..." : "Publish Course Program"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setEditingCourse(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 z-10 animate-scale-in max-h-[90vh] overflow-y-auto" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Course Program</h3>
                <p className="text-xs text-slate-500">Update curriculum details & pricing</p>
              </div>
              <button onClick={() => setEditingCourse(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingCourse.summary}
                  onChange={(e) => setEditingCourse({ ...editingCourse, summary: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Salary</label>
                  <input
                    type="text"
                    value={editingCourse.expectedSalary}
                    onChange={(e) => setEditingCourse({ ...editingCourse, expectedSalary: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingCourse.isFeatured}
                  onChange={(e) => setEditingCourse({ ...editingCourse, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <span className="font-semibold text-slate-700">Feature this program on the landing page</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Updating Course..." : "Save Course Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
