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
import ConditionalLayout from "@/components/ConditionalLayout";

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
    { media: "(prefers-color-scheme: light)", color: "#b4232a" },
    { media: "(prefers-color-scheme: dark)", color: "#ff5a4f" },
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
    default: "念舒档案局 | 00 后技术折腾者的成长样本库",
    template: "%s | 念舒",
  },
  description: "念舒档案局，一个 00 后技术折腾者的成长样本库，归档技术踩坑、部署实践、成长经历和个人项目。",
  keywords: ["念舒", "念舒档案局", "技术折腾", "个人品牌", "Next.js", "00后", "技术博客"],
  authors: [{ name: "念舒", url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn' }],
  creator: "念舒",

  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.nianshu2022.cn',
    title: "念舒档案局",
    description: "一个 00 后技术折腾者的成长样本库。",
    siteName: "念舒档案局",
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
    title: "念舒档案局",
    description: "一个 00 后技术折腾者的成长样本库。",
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
          color="#b4232a"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #b4232a,0 0 5px #b4232a"
        />
        <GridBackground />
        <MouseGlow />
        
        <ConditionalLayout>
          <header className="fixed left-0 right-0 top-0 z-40 border-b border-foreground/15 bg-background/88 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-5">
                <Link href="/" className="group inline-flex items-center gap-3 text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center border border-foreground bg-foreground text-sm font-black text-background">档</span>
                  <span className="hidden font-black tracking-normal sm:inline">念舒档案局</span>
                </Link>
                <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground lg:flex">
                  <span>公共档案 001 号</span>
                  <span className="border border-primary px-1 text-primary">验</span>
                </div>
              </div>
              <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
                {[
                  ["技术案卷", "/blog"],
                  ["成长样本", "/essays"],
                  ["搜索", "/search"],
                  ["时间索引", "/archive"],
                  ["装备", "/gear"],
                  ["在线服务", "/portal"],
                  ["关于", "/about"],
                ].map(([label, href]) => (
                  <Link key={href} href={href} className="px-3 py-2 font-semibold transition-colors hover:bg-secondary hover:text-foreground">
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="hidden items-center gap-3 border-l border-border pl-4 xl:flex">
                <span className="border border-foreground px-2 py-1 font-mono text-xs font-bold">系统状态</span>
                <div className="grid gap-0.5 font-mono text-xs leading-none text-muted-foreground">
                  <span>系统状态</span>
                  <span className="text-foreground">正常运行</span>
                </div>
                <div className="flex gap-2" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-muted" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
              <MobileNav />
            </div>
          </header>

          <div className="fixed top-3.5 right-4 z-50 flex items-center gap-2">
            <SearchHint />
          </div>
        </ConditionalLayout>

        <div className="fixed top-3.5 right-4 z-50 flex items-center gap-2 pointer-events-none">
           <div className="pointer-events-auto">
             <ThemeToggle />
           </div>
        </div>

        <PageTransition>{children}</PageTransition>

        <ConditionalLayout>
          <BottomNav />
          <ScrollToTop />
          <KeyboardHint />
        </ConditionalLayout>




        <CommandMenu posts={posts} essays={essays} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
