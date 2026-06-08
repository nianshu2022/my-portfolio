import { gearData, GearCategory } from "@/lib/gear-data";
import { ArrowRight, Cpu } from "lucide-react";
import Image from "next/image";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "装备案卷",
  description: "念舒档案局的硬件设备、开发环境与智能家居清单。",
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

export default function GearPage() {
  const groupedGear = categories.reduce((acc, category) => {
    acc[category] = gearData.filter((item) => item.category === category);
    return acc;
  }, {} as Record<GearCategory, typeof gearData>);
  const primaryGear = gearData.filter((item) => item.category === "Core Tech").slice(0, 3);

  return (
    <main className="archive-shell">
      <FloatingNav backUrl="/" />

      <header className="border-y border-foreground/80 py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 border border-primary px-2 py-1 font-mono text-sm font-bold text-primary">
              <Cpu className="h-4 w-4" />
              GEAR FILES
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,5.8rem)] font-black leading-none tracking-normal text-foreground">
              装备案卷
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              这些不是炫物清单，而是一个 00 后技术折腾者的实际工作台：主力设备、输入工具、智能家居和随身配件。
            </p>
          </div>
          <dl className="grid min-w-64 border border-foreground/50 bg-card/80 font-mono text-xs">
            <div className="grid grid-cols-[5rem_1fr] border-b border-border px-4 py-2">
              <dt className="text-muted-foreground">编号</dt>
              <dd className="font-bold text-foreground">GEAR-{new Date().getFullYear()}</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] border-b border-border px-4 py-2">
              <dt className="text-muted-foreground">数量</dt>
              <dd className="font-bold text-foreground">{gearData.length} 件</dd>
            </div>
            <div className="grid grid-cols-[5rem_1fr] px-4 py-2">
              <dt className="text-muted-foreground">状态</dt>
              <dd className="text-primary">持续更新</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="border-b border-foreground/75 py-10">
        <div className="archive-section-heading">
          <span>01</span>
          <div>
            <h2>主力工作台</h2>
            <p>先看真正决定效率的核心设备：写代码、查资料、部署服务和移动处理都靠它们撑起来。</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {primaryGear.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.08}>
              <article className="grid h-full border border-foreground/50 bg-card/80">
                <div className="relative aspect-[4/3] border-b border-border bg-background p-5">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-6" sizes="(min-width: 1024px) 33vw, 100vw" />
                  ) : (
                    <item.icon className="m-auto h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                    <span>{String(index + 1).padStart(3, "0")}</span>
                    <span>{item.brand}</span>
                  </div>
                  <h3 className="text-2xl font-black">{item.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="archive-section-heading">
          <span>02</span>
          <div>
            <h2>全部装备案卷</h2>
            <p>按使用场景归档，方便知道每件东西在系统里承担什么角色。</p>
          </div>
        </div>

        <div className="mt-8 space-y-10">
        {categories.map((category) => {
          const items = groupedGear[category];
          if (!items?.length) return null;

          return (
            <ScrollReveal key={category}>
              <section>
                <div className="mb-4 flex flex-col gap-3 border-b border-foreground/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-3xl font-black">{categoryLabels[category] || category}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{categoryNotes[category]}</p>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">{items.length} 件</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item, i) => (
                    <ScrollReveal key={item.id} delay={i * 0.06}>
                      <article className="group flex h-full gap-4 border border-foreground/40 bg-card/80 p-4 transition-colors hover:bg-secondary/70">
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center border border-border bg-background p-2">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" sizes="96px" />
                          ) : (
                            <item.icon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2 font-mono">
                            <span className="border border-border bg-background px-1.5 py-0.5 text-xs text-primary">{String(i + 1).padStart(3, "0")}</span>
                            <span className="border border-border bg-background px-1.5 py-0.5 text-xs text-muted-foreground">{item.brand}</span>
                            {item.model && <span className="text-xs text-muted-foreground">{item.model}</span>}
                          </div>
                          <h3 className="line-clamp-2 font-black transition-colors group-hover:text-primary">{item.name}</h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                              查看来源
                              <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </article>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          );
        })}
        </div>
      </section>
    </main>
  );
}
