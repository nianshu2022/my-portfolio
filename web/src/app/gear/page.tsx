import { gearData, GearCategory } from "@/lib/gear-data";
import { Cpu, Package } from "lucide-react";
import Image from "next/image";
import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "我的数字装备",
  description: "展示我的硬件设备、开发环境与智能家居清单。",
};

const categories: GearCategory[] = ["Core Tech", "Wearables & Audio", "Smart Home", "Accessories", "Other"];

const categoryLabels: Record<GearCategory, string> = {
  "Core Tech": "核心设备",
  "Wearables & Audio": "穿戴与音频",
  "Smart Home": "智能家居",
  "Accessories": "配件",
  "Other": "其他",
};

export default function GearPage() {
  const groupedGear = categories.reduce((acc, category) => {
    acc[category] = gearData.filter((item) => item.category === category);
    return acc;
  }, {} as Record<GearCategory, typeof gearData>);

  return (
    <main className="garden-shell">
      <FloatingNav backUrl="/" />

      <header className="mb-10 border-b border-border pb-8">
        <p className="garden-kicker inline-flex items-center gap-2"><Cpu className="h-4 w-4" /> 数字装备</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="garden-title">我的数字装备</h1>
            <p className="garden-subtitle mt-3 max-w-2xl">日常使用的硬件设备、生产力工具和智能家居配置。</p>
          </div>
          <div className="garden-panel flex items-center gap-3 px-4 py-3">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">共 {gearData.length} 件</span>
          </div>
        </div>
      </header>

      <div className="space-y-10">
        {categories.map((category) => {
          const items = groupedGear[category];
          if (!items?.length) return null;

          return (
            <ScrollReveal key={category}>
              <section>
                <div className="mb-4 flex items-baseline justify-between border-b border-border pb-3">
                  <h2 className="text-2xl font-bold">{categoryLabels[category] || category}</h2>
                  <span className="text-sm text-muted-foreground">{items.length} 件</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, i) => (
                    <ScrollReveal key={item.id} delay={i * 0.06}>
                      <div className="garden-panel flex gap-4 p-4 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-border bg-background p-2">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-contain p-2 hover:scale-110 transition-transform duration-300" sizes="96px" />
                          ) : (
                            <item.icon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded border border-border bg-background px-1.5 py-0.5 text-xs text-muted-foreground">{item.brand}</span>
                            {item.model && <span className="text-xs text-muted-foreground">{item.model}</span>}
                          </div>
                          <h3 className="line-clamp-2 font-semibold">{item.name}</h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          );
        })}
      </div>
    </main>
  );
}
