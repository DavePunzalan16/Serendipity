export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-dark-gray/30 bg-background/80 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
        {children}
      </div>
    </main>
  );
}
