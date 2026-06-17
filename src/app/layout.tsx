import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito, Andika } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import SoundButton from "@/components/SoundButton";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

// Andika : police pensée pour les jeunes lecteurs (lettres non ambiguës).
const andika = Andika({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-reading",
  display: "swap",
});

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Mon Piano des mots — apprendre à lire au CP",
  description:
    "Apprendre à lire au CP avec la méthode syllabique : on chante les sons, puis on colle les lettres comme on joue du piano.",
  manifest: `${BP}/manifest.webmanifest`,
  applicationName: "Mon Piano des mots",
  icons: {
    icon: `${BP}/icon.svg`,
    apple: `${BP}/icon.svg`,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Piano des mots",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FFF6E9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fredoka.variable} ${nunito.variable} ${andika.variable}`}
    >
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <ServiceWorkerRegister />
        <SoundButton />
        {children}
      </body>
    </html>
  );
}
