import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-secondary p-4">
        <div className="absolute top-4 left-4">
            <Logo />
        </div>
        {children}
    </div>
  );
}
