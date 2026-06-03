import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "김건 | CS 포트폴리오 (Gun Kim | CS Portfolio)",
  description: "김건의 컴퓨터 공학 전공자 포트폴리오 웹사이트입니다. 분산 트래픽 엔진, 머신러닝 실시간 객체 탐지 솔루션, 개인 자산 관리 모바일 앱, 클라우드 모니터링 툴 등 다양한 개발 프로젝트를 소개합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
