"use client";

import { createContext, useContext, type ReactNode } from "react";

interface Options {
  courses: { id: string; title: string }[];
  branches: { id: string; name: string; city: string }[];
}

const Context = createContext<Options>({ courses: [], branches: [] });
export function CatalogOptions({
  value,
  children,
}: {
  value: Options;
  children: ReactNode;
}) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCatalogOptions() {
  return useContext(Context);
}
