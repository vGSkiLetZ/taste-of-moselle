export const metadata = {
  title: "Admin — Taste of Moselle",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-moselle-cream/50">
      {children}
    </div>
  );
}
