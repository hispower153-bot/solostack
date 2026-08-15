import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "SoloStack - 1인기업 올인원 허브",
  description: "1인기업가를 위한 콘텐츠·마케팅·CRM 통합 작업 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased min-h-screen">
        <Sidebar />
        <div className="pl-60">
          <TopBar />
          <main className="min-h-[calc(100vh-3.5rem)] p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
