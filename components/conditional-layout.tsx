"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/navbar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Hide navbar on auth pages
  const isAuthPage = pathname?.startsWith("/auth");
  
  return (
    <>
      {!isAuthPage && <Navigation />}
      <main className={isAuthPage ? "min-h-screen" : ""}>{children}</main>
    </>
  );
}
