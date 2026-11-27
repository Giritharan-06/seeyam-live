import "./public-palette.css";
import {GlobalStructuredData} from "@/components/StructuredData";
import { getCatalog } from "@/lib/public-catalog";
import PublicShell from "@/components/PublicShell";
import DynamicThemeProvider from "@/components/DynamicThemeProvider";
import { LeadModalProvider } from "@/components/LeadModalContext";
import { PlatformDataProvider } from "@/components/PlatformDataContext";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const catalog=await getCatalog();
  return (
    <PlatformDataProvider initial={catalog}>
      <GlobalStructuredData catalog={catalog}/>
      <DynamicThemeProvider>
        <LeadModalProvider>
          <PublicShell>{children}</PublicShell>
        </LeadModalProvider>
      </DynamicThemeProvider>
    </PlatformDataProvider>
  );
}
