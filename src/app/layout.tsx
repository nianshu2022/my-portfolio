import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zj.nianshu2022.cn'),
  title: {
    default: "念舒的数字花园 | 产品运营 & 技术折腾",
    template: "%s | 念舒",
  },
  description: "00后产品运营的个人网站，分享运营心得、增长策略与技术折腾笔记。致力于构建连接用户价值与技术实现的桥梁。",
  keywords: ["产品运营", "念舒", "个人博客", "Next.js", "技术折腾", "增长黑客", "00后"],
  authors: [{ name: "念舒", url: "https://zj.nianshu2022.cn" }],
  creator: "念舒",
  icons: {
    icon: "/img/avatar.png",
    shortcut: "/img/avatar.png",
    apple: "/img/avatar.png",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://zj.nianshu2022.cn",
    title: "念舒的数字花园",
    description: "00后产品运营的个人网站，分享运营心得与技术折腾笔记。",
    siteName: "念舒的数字花园",
    images: [
      {
        url: "/img/avatar.png",
        width: 800,
        height: 800,
        alt: "念舒",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "念舒的数字花园",
    description: "00后产品运营的个人网站，分享运营心得与技术折腾笔记。",
    images: ["/img/avatar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}
      >
         {/* Global Background Decoration */}
         <div className="fixed inset-0 z-[-1] pointer-events-none">
            {/* Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen dark:bg-purple-900/30 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen dark:bg-blue-900/30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-400/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen dark:bg-pink-900/30 animate-blob animation-delay-4000"></div>
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
          </div>

        {children}
      </body>
    </html>
  );
}
