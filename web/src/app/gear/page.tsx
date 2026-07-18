import { gearData, GearCategory } from "@/lib/gear-data";
import { ArrowRight, Laptop, Headphones, Home, Plug, Package, type LucideIcon } from "lucide-react";
import Image from "next/image";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "装备",
  description: "念舒的硬件设备、开发环境与智能家居清单。",
};

const categories: GearCategory[] = ["Core Tech", "Wearables & Audio", "Smart Home", "Accessories", "Other"];

const categoryLabels: Record<GearCategory, string> = {
  "Core Tech": "核心设备",
  "Wearables & Audio": "穿戴与音频",
  "Smart Home": "智能家居",
  "Accessories": "配件",
  "Other": "其他",
};

const categoryNotes: Record<GearCategory, string> = {
  "Core Tech": "真正负责生产力和移动工作的主力工具。",
  "Wearables & Audio": "用于通知、健康、音乐和碎片化场景。",
  "Smart Home": "让生活环境更稳定、省心的小系统。",
  "Accessories": "提升连接、输入、续航和拍摄效率的补位件。",
  "Other": "有纪念意义或低频但值得保留的物件。",
};


const categoryIcons: Record<GearCategory, LucideIcon> = {
  "Core Tech": Laptop,
  "Wearables & Audio": Headphones,
  "Smart Home": Home,
  "Accessories": Plug,
  "Other": Package,
};

export default function GearPage() {
  const groupedGear = categories.reduce((acc, category) => {
    acc[category] = gearData.filter((item) => item.category === category);
    return acc;
  }, {} as Record<GearCategory, typeof gearData>);
  const primaryGear = gearData.filter((item) => item.category === "Core Tech").slice(0, 3);

  return (
    <main className="ns-shell">
      <FloatingNav backUrl="/" />

      {/* ── Page Header ── */}
      <header className="mb-10 border-b border-border pb-10">
        <p className="mb-3 text-sm font-semibold text-primary">我的工作台</p>
        <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground sm:text-6xl">
          <span className="gradient-text">装备</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          这些不是炫物清单，而是一个 00 后技术折腾者的实际工作台：
          主力设备、输入工具、智能家居和随身配件。
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          共 {gearData.length} 件 · 持续更新
        </div>
      </header>

      {/* ── Hero Gear (Core Tech top 3) ── */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-black text-foreground">
          主力工作台
          <span className="ml-3 text-base font-normal text-muted-foreground">
            决定效率的核心设备
          </span>
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {primaryGear.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.08}>
              <article className="overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                <div className="relative aspect-[4/3] bg-secondary/50">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-8"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <item.icon className="h-14 w-14 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{item.brand}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      主力
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-foreground">{item.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── All Gear by Category ── */}
      <section className="border-t border-border pt-10">
        <h2 className="mb-8 text-2xl font-black text-foreground">全部装备</h2>
        <div className="space-y-10">
          {categories.map((category) => {
            const items = groupedGear[category];
            if (!items?.length) return null;

            return (
              <ScrollReveal key={category}>
                <div>
                  <div className="mb-4 flex items-end justify-between border-b border-border pb-4">
                    <div>
                      <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                        {(() => { const Icon = categoryIcons[category]; return Icon ? <Icon className="h-5 w-5 text-primary" aria-hidden="true" /> : null; })()}
                        {categoryLabels[category] || category}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{categoryNotes[category]}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{items.length} 件</span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item, i) => (
                      <ScrollReveal key={item.id} delay={i * 0.05}>
                        <article className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm">
                          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary/50">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-2"
                                sizes="80px"
                              />
                            ) : (
                              <item.icon className="h-8 w-8 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {item.brand}
                              </span>
                              {item.model && (
                                <span className="text-xs text-muted-foreground">{item.model}</span>
                              )}
                            </div>
                            <h4 className="line-clamp-2 font-bold text-foreground">{item.name}</h4>
                            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                              {item.description}
                            </p>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent-foreground"
                              >
                                查看来源
                                <ArrowRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </article>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </main>
  );
}
