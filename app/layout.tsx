import type { Metadata } from "next";
import { Manrope, Cairo } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/context";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mizan BTP — L'équilibre de vos chantiers",
  description:
    "Mizan BTP, l'application de gestion de chantier pour promoteurs immobiliers : suivez vos budgets, dépenses et marges en toute simplicité.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${manrope.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-surface font-sans text-ink">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
