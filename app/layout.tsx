import type { Metadata, Viewport } from "next";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import { APP_NAME } from "@/lib/config";
import { THEME_BOOT } from "@/lib/theme";
import { AppProvider } from "@/components/AppProvider";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Les maths, 20 minutes par jour, avec Pi.",
  icons: { icon: "/icons/blob.webp" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <AppProvider>
          <TopBar />
          <main className="pad">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
