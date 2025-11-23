import MarketingNavbar from "@/components/marketing/navbar/marketing-navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNavbar />
      <main className="flex-1">
        {children}
      </main>
    </>
  );
}