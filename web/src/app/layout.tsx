import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import KeyboardHint from "@/components/KeyboardHint";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ThemeToggle from "@/components/ThemeToggle";
import MouseGlow from "@/components/MouseGlow";
import GridBackground from "@/components/GridBackground";
import PageTransition from "@/components/PageTransition";

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

import CommandMenu from "@/components/CommandMenu";
import SearchHint from "@/components/SearchHint";
import MobileNav from "@/components/MobileNav";
import BottomNav from "@/components/BottomNav";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn'),
  title: {
    default: "念舒的数字花园 | 产品运营 & 技术折腾",
    template: "%s | 念舒",
  },
  description: "00后产品运营的个人网站，分享运营心得、增长策略与技术折腾笔记。致力于构建连接用户价值与技术实现的桥梁。",
  keywords: ["产品运营", "念舒", "个人博客", "Next.js", "技术折腾", "增长黑客", "00后"],
  authors: [{ name: "念舒", url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn' }],
  creator: "念舒",

  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn',
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
  manifest: "/manifest.json",
};

import NextTopLoader from 'nextjs-toploader';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPostSummaries();
  const essays = getAllEssaySummaries();

  return (
    <html lang="zh-CN" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6153369929341681" />
        {/* P1: 防主题闪烁 - 在 JS 加载前同步设置 dark class，消除 FOUC */}
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`
        }} />
        {/* AdSense 验证：使用原生 async script，避免 Next.js Script 组件的 data-nscript 属性导致 AdSense 报警 */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6153369929341681" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NextTopLoader
          color="#818cf8"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #818cf8,0 0 5px #818cf8"
        />
        <GridBackground />
        <MouseGlow />
        <header className="fixed left-0 right-0 top-0 z-40 border-b border-border/30 bg-background/60 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group inline-flex items-center gap-3 text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">念</span>
              <span className="hidden font-semibold tracking-normal sm:inline">念舒的数字花园</span>
            </Link>
            <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
              {[
                ["博客", "/blog"],
                ["随笔", "/essays"],
                ["搜索", "/search"],
                ["归档", "/archive"],
                ["装备", "/gear"],
                ["传送门", "/portal"],
                ["关于", "/about"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-md px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground">
                  {label}
                </Link>
              ))}
            </nav>
            <MobileNav />
          </div>
        </header>
        <div className="fixed top-3.5 right-4 z-50 flex items-center gap-2">
          <SearchHint />
          <ThemeToggle />
        </div>

        <PageTransition>{children}</PageTransition>

        <BottomNav />
        <ScrollToTop />
        <KeyboardHint />




        <CommandMenu posts={posts} essays={essays} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
