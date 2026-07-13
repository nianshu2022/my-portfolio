import ShareClient from "./ShareClient";

// 供 Next.js 静态 HTML 导出时忽略编译期动态路由检查，在客户端运行时动态解析 ID
export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function SecureShareViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShareClient id={id} />;
}
