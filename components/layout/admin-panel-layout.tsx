"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "../header/navbar";
import { Sidebar } from "../sidebar/sidebar";

export function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />

      <main className="min-h-[calc(100vh_-_56px)] bg-background lg:pl-24 xxxl:pl-0">
        <Navbar />
        {children}
      </main>
      <Footer />
    </>
  );
}
