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
  title: "Multiple Questions Next App",
  description: "multiple questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900`} // 背景色を少しグレーに
      >
        {/*
          sm (640px) 未満: 左右に padding (p-4) のみ適用
          sm (640px) 以上: container クラスを適用 (最大幅設定 + 中央寄せ)
                         padding は container が持つもの or p-4 を維持
        */}
        <div className="min-h-screen p-4 sm:container sm:mx-auto sm:p-6 md:p-8">
          {/* 画面サイズに応じてパディング調整 */}
          {children}
        </div>
      </body>
    </html>
  );
}
