"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isQuizPage = pathname?.startsWith("/quiz/") && 
    (pathname.includes("/take") || pathname.includes("/instructions") || 
     pathname.includes("/results") || pathname.includes("/analytics") ||
     pathname.includes("/submit"));

  return (
    <>
      {!isQuizPage && <Navigation />}
      <main className="flex-grow">
        {children}
      </main>
      {!isQuizPage && <Footer />}
    </>
  );
}