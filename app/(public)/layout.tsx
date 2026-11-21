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
  return (
    <PlatformDataProvider initial={await getCatalog()}>
      <DynamicThemeProvider>
        <LeadModalProvider>
          <PublicShell>{children}</PublicShell>
        </LeadModalProvider>
      </DynamicThemeProvider>
    </PlatformDataProvider>
  );
}
