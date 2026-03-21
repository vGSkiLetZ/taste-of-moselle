import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance — Taste of Moselle",
  robots: "noindex",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-moselle-cream flex flex-col items-center justify-center px-4 text-center">
      <Image
        src="/images/LOGO.jpg"
        alt="Taste of Moselle"
        width={80}
        height={80}
        className="rounded-2xl shadow-lg mb-6"
      />
      <h1 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold text-moselle-text mb-4 tracking-tight">
        On mijote quelque chose...
      </h1>
      <p className="font-[family-name:var(--font-body)] text-lg text-moselle-text-light max-w-md italic mb-2">
        Le site est temporairement en maintenance pour vous offrir une meilleure expérience.
      </p>
      <p className="text-moselle-text-light text-sm">
        Revenez dans quelques instants !
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="https://instagram.com/tasteofmoselle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-moselle-green hover:underline"
        >
          Instagram
        </a>
        <a
          href="https://facebook.com/tasteofmoselle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-moselle-green hover:underline"
        >
          Facebook
        </a>
      </div>
    </div>
  );
}
