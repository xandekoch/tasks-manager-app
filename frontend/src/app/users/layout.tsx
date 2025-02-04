import { NavHeader } from "@/components/NavHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <main className="min-h-screen bg-background">
      <NavHeader />
      <div className="py-6 px-4 md:px-20">{children}</div>
    </main>
  );
}

export default AppLayout;