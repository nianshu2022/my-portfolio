import { gearData, GearCategory } from "@/lib/gear-data";
import { Laptop, Smartphone, Home, Zap, Server, Shield, Database, Cpu, Package } from "lucide-react";
import React from "react";
import Image from "next/image";
import FloatingNav from "@/components/FloatingNav";

export const metadata = {
    title: "我的数字装备 | 念舒",
    description: "展示我的硬件设备、开发环境与智能家居清单。",
};

export default function GearPage() {
    // Group data by category
    const categories: GearCategory[] = ["Core Tech", "Wearables & Audio", "Smart Home", "Accessories", "Other"];

    // Calculate total count
    const totalCount = gearData.length;

    const groupedGear = categories.reduce((acc, category) => {
        acc[category] = gearData.filter((item) => item.category === category);
        return acc;
    }, {} as Record<GearCategory, typeof gearData>);

    return (
        <main className="min-h-screen pt-24 pb-20 px-6 sm:px-12 max-w-7xl mx-auto font-sans">
            {/* Background Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-[100px] opacity-70"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-[100px] opacity-70"></div>
            </div>

            <FloatingNav />

            {/* Header */}
            <header className="mb-16 text-center max-w-3xl mx-auto space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm font-medium mb-4 border border-zinc-200 dark:border-zinc-700">
                    <Cpu className="w-4 h-4" />
                    <span>Digital Garden / Uses</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif">
                    我的数字装备
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    工欲善其事，必先利其器。这里展示了我日常使用的硬件设备、生产力工具以及
                    <span className="text-teal-600 dark:text-teal-400 font-bold mx-1">智能家居</span>
                    配置。
                </p>
            </header>

            {/* Highlight Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm flex flex-col justify-center items-center text-center group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:rotate-12 transition-transform">
                        <Package className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">{totalCount}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">数字装备收藏</p>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm flex flex-col justify-center items-center text-center group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:rotate-12 transition-transform">
                        <Laptop className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">Windows PC</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">主力生产力</p>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm flex flex-col justify-center items-center text-center group hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:rotate-12 transition-transform">
                        <Server className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">Homelab</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">家庭数据中心</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="space-y-16">
                {categories.map((category, idx) => {
                    const items = groupedGear[category];
                    if (!items || items.length === 0) return null;

                    return (
                        <section key={category} className="animate-fade-in-up" style={{ animationDelay: `${200 + idx * 100}ms` }}>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-zinc-800 dark:bg-zinc-200 rounded-full"></span>
                                    {category}
                                </h2>
                                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative flex flex-col h-full bg-white/60 dark:bg-zinc-800/60 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-zinc-700/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                                    >
                                        {/* Brand Tag - Absolute Top Right */}
                                        {item.brand && (
                                            <span className="absolute top-4 right-4 z-20 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                                {item.brand}
                                            </span>
                                        )}

                                        <div className="p-6 flex items-start gap-5 relative z-10 w-full pt-8 sm:pt-6">
                                            {/* Left: Image/Icon */}
                                            <div className={`relative shrink-0 transition-all duration-300 group-hover:scale-105 ${item.image ? 'w-24 h-24' : 'rounded-2xl overflow-hidden p-3 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-300 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'}`}>
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain"
                                                        sizes="96px"
                                                    />
                                                ) : (
                                                    <item.icon className="w-8 h-8" />
                                                )}
                                            </div>

                                            {/* Right: Text Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1">
                                                <div className="mb-1 pr-6">
                                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                        {item.name} <span className="text-zinc-400 font-normal ml-1 text-sm">{item.model}</span>
                                                    </h3>
                                                </div>

                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Subtle shine effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 bg-[length:200%_200%] animate-shine pointer-events-none z-20" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
