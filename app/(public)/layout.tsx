import { getPublishedPlatform } from "@/lib/published-platform";
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
    <PlatformDataProvider initial={await getPublishedPlatform()}>
      <DynamicThemeProvider>
        <LeadModalProvider>
          <PublicShell>{children}</PublicShell>
        </LeadModalProvider>
      </DynamicThemeProvider>
    </PlatformDataProvider>
  );
}
