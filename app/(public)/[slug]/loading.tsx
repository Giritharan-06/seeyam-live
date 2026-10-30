import React from "react";

export default function WordPressPageLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFD] py-12 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-4 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
        </div>

        {/* Header Skeleton */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm mb-8" data-card-3d="analytics" data-card-density="regular">
          <div className="h-6 w-32 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-10 sm:h-12 w-3/4 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-5" data-card-3d="analytics" data-card-density="compact">
          <div className="h-4 w-full bg-slate-200 rounded-md"></div>
          <div className="h-4 w-11/12 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-4/5 bg-slate-200 rounded-md"></div>
          <div className="h-32 w-full bg-slate-100 rounded-2xl my-6"></div>
          <div className="h-4 w-full bg-slate-200 rounded-md"></div>
          <div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-2/3 bg-slate-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
