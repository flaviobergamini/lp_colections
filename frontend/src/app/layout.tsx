import type { Metadata, Viewport } from "next";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import ThemeRegistry from "@/components/ThemeRegistry";
import SwRegister from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "Berga Records",
  description: "Controle sua coleção de discos de vinil por foto ou texto.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111113",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <ThemeRegistry>
          <SwRegister />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
