import type { Metadata } from "next";
import { Cormorant_Garamond, Crimson_Pro, Satisfy } from "next/font/google";
import LayoutShell from "@/components/layout/LayoutShell";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const crimson = Crimson_Pro({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const satisfy = Satisfy({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tasteofmoselle.fr"),
  title: {
    default: "Taste of Moselle — Le guide gourmand de la Moselle",
    template: "%s | Taste of Moselle",
  },
  description:
    "Le guide Michelin de la bienveillance en Moselle. Découvrez les meilleures adresses, restaurants, producteurs et caves de la Moselle.",
  keywords: [
    "restaurant Moselle",
    "guide gastronomique Metz",
    "bonnes adresses Thionville",
    "producteur local Moselle",
    "où manger Metz",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Taste of Moselle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${crimson.variable} ${satisfy.variable} antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
