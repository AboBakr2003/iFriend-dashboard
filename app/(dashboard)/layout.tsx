import ProtectedRoute from "@/components/protected-route";

export default function DashboardLayout({
  children,
  sidebar,
  navbar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div>
        {sidebar}
        {navbar}
        <main className="main-content">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
