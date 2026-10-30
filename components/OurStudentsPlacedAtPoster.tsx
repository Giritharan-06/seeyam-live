"use client";

import React from "react";
import Image from "next/image";

export default function OurStudentsPlacedAtPoster() {
  return <section className="w-full bg-white py-14 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Explore the wider industry</p>
      <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Where skills can take you.</h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-slate-600">Discover the companies shaping technology, analytics and business.</p>
      <div className="mx-auto mt-8 max-w-4xl sm:mt-10">
        <Image src="/images/company-placement-collage-v2.png" alt="Company logo collage featuring Cognizant, TCS, Apple, IBM, Amazon, Microsoft, Capgemini, Tech Mahindra, HCL, L&T Infotech, Facebook, Infosys, Wipro, Zoho, Redington and Adrenalin" width={1763} height={892} sizes="(max-width: 1280px) 100vw, 1152px" className="block h-auto w-full object-contain" />
      </div>
    </div>
  </section>;
}
