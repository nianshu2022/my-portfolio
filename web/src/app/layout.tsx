import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ThemeToggle from "@/components/ThemeToggle";
import MouseGlow from "@/components/MouseGlow";
import GridBackground from "@/components/GridBackground";
import PageTransition from "@/components/PageTransition";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});
const isProduction = process.env.NODE_ENV === "production";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#818cf8" },
  ],
  width: "device-width",
  initialScale: 1,
};

import CommandMenu from "@/components/CommandMenu";
import SearchHint from "@/components/SearchHint";
import MobileNav from "@/components/MobileNav";
import BottomNav from "@/components/BottomNav";
import DesktopNav from "@/components/DesktopNav";
import { getAllPostSummaries, getAllEssaySummaries } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn'),
  title: {
    default: "念舒 | 技术 · 成长 · 创造",
    template: "%s | 念舒",
  },
  description: "念舒的个人博客——一个 00 后技术折腾者，在这里分享前端开发、AI 应用、独立开发与成长经历。",
  keywords: ["念舒", "技术博客", "前端开发", "独立开发", "Next.js", "00后", "AI"],
  authors: [{ name: "念舒", url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn' }],
  creator: "念舒",

  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn',
    title: "念舒 | 技术 · 成长 · 创造",
    description: "一个 00 后技术折腾者的个人博客，分享代码与生活。",
    siteName: "念舒",
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
    title: "念舒 | 技术 · 成长 · 创造",
    description: "一个 00 后技术折腾者的个人博客，分享代码与生活。",
    images: ["/img/avatar.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "48x48", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
    <html lang="zh-CN" suppressHydrationWarning className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect: image proxy & comments */}
        <link rel="preconnect" href="https://wsrv.nl" />
        <link rel="dns-prefetch" href="https://wsrv.nl" />
        <link rel="preconnect" href="https://giscus.app" />
        <meta name="google-adsense-account" content="ca-pub-6153369929341681" />
        {/* P1: 防主题闪烁 - 在 JS 加载前同步设置 dark class，消除 FOUC */}
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`
        }} />
        {isProduction ? (
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6153369929341681" crossOrigin="anonymous"></script>
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased min-h-screen relative overflow-x-hidden bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NextTopLoader
          color="#6366f1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #6366f1,0 0 5px #8b5cf6"
        />
        <GridBackground />
        <MouseGlow />
        
        <ConditionalLayout>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-foreground focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground"
          >
            跳到正文
          </a>
          <header className="fixed left-0 right-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Logo */}
              <Link href="/" className="group inline-flex items-center gap-2.5 text-foreground">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  aria-hidden="true"
                >
                  念
                </span>
                <span className="hidden font-black tracking-tight sm:inline">
                  念舒
                  <span className="ml-1 text-muted-foreground font-normal text-sm hidden lg:inline">
                    技术 · 成长 · 创造
                  </span>
                </span>
              </Link>

              <DesktopNav />

              {/* Right controls */}
              <div className="hidden items-center gap-2 md:flex">
                <SearchHint />
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <MobileNav />
              </div>
            </div>
          </header>
        </ConditionalLayout>

        <div id="main-content" tabIndex={-1} className="outline-none">
          <PageTransition>{children}</PageTransition>
        </div>

        <ConditionalLayout>
          <BottomNav />
          <ScrollToTop />
        </ConditionalLayout>




        <CommandMenu posts={posts} essays={essays} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
