import React from "react";

interface CompanyLogoProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function CompanyLogo({
  name,
  className = "",
  size = "md",
  showText = false,
}: CompanyLogoProps) {
  const norm = name.toLowerCase().trim();

  const sizeClasses = {
    sm: "h-5 w-auto max-w-[80px]",
    md: "h-7 w-auto max-w-[110px]",
    lg: "h-9 w-auto max-w-[140px]",
  };

  // Dedicated crisp SVG logos
  if (norm.includes("amazon") || norm.includes("aws")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <svg className={`${sizeClasses[size]} shrink-0`} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Amazon text & smile arrow */}
          <text x="0" y="20" fill="#131921" fontSize="18" fontWeight="800" fontFamily="sans-serif">amazon</text>
          <path d="M12 24C28 30 52 28 65 20" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 17L66 20L63 24" fill="#FF9900" />
        </svg>
        {showText && <span className="text-xs font-bold text-slate-800">AWS</span>}
      </div>
    );
  }

  if (norm.includes("microsoft")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="8" height="8" fill="#F25022" />
          <rect x="11" y="1" width="8" height="8" fill="#7FBA00" />
          <rect x="1" y="11" width="8" height="8" fill="#00A4EF" />
          <rect x="11" y="11" width="8" height="8" fill="#FFB900" />
        </svg>
        <span className="text-xs font-extrabold text-slate-800">Microsoft</span>
      </div>
    );
  }

  if (norm.includes("google")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <span className="text-xs font-extrabold text-slate-800">Google</span>
      </div>
    );
  }

  if (norm.includes("zoho")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-black tracking-wider">
          ZOHO
        </div>
        {showText && <span className="text-xs font-bold text-slate-800">Corp</span>}
      </div>
    );
  }

  if (norm.includes("tcs") || norm.includes("tata")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#004B87] text-white text-[10px] font-black tracking-wider">
          TCS
        </div>
        <span className="text-xs font-bold text-slate-800">Tata Consultancy</span>
      </div>
    );
  }

  if (norm.includes("infosys")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#007CC3] text-white text-[10px] font-black tracking-wider">
          Infosys
        </div>
      </div>
    );
  }

  if (norm.includes("jpmorgan") || norm.includes("chase") || norm.includes("jp morgan")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#11243E] text-white text-[10px] font-black tracking-wider border border-slate-300">
          J.P. Morgan
        </div>
      </div>
    );
  }

  if (norm.includes("deloitte")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="flex items-center gap-0.5 text-xs font-black text-slate-900">
          <span>Deloitte</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#86BC25]" />
        </div>
      </div>
    );
  }

  if (norm.includes("accenture")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="flex items-center gap-1 text-xs font-extrabold text-[#A100FF]">
          <span>accenture</span>
          <span className="text-sm font-black">&gt;</span>
        </div>
      </div>
    );
  }

  if (norm.includes("cognizant")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#0033A0] text-white text-[10px] font-black tracking-wider">
          Cognizant
        </div>
      </div>
    );
  }

  if (norm.includes("zomato") || norm.includes("blinkit")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded-md bg-[#CB202D] text-white text-[10px] font-black tracking-wide">
          zomato
        </div>
      </div>
    );
  }

  if (norm.includes("capgemini")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#0070AD] text-white text-[10px] font-black tracking-wider">
          Capgemini
        </div>
      </div>
    );
  }

  if (norm.includes("wipro")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600" />
          <span className="text-xs font-extrabold text-slate-800">Wipro</span>
        </div>
      </div>
    );
  }

  if (norm.includes("ibm")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#052FAD] text-white text-[10px] font-black tracking-widest">
          IBM
        </div>
      </div>
    );
  }

  if (norm.includes("oracle")) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-bold ${className}`}>
        <div className="px-2 py-0.5 rounded bg-[#C74634] text-white text-[10px] font-black tracking-wider">
          ORACLE
        </div>
      </div>
    );
  }

  // Generic fallback with clean pill badge
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
      <span>{name}</span>
    </div>
  );
}
