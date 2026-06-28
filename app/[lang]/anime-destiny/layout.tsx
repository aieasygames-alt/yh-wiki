import { ADHeader } from "../../../components/ADHeader";
import { ADFooter } from "../../../components/ADFooter";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export default function AnimeDestinyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ADHeader />
      <main className="flex-1 min-h-screen bg-gray-950 text-gray-100">
        {children}
      </main>
      <ADFooter />
    </>
  );
}
