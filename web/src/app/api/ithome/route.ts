import { NextResponse } from "next/server";

export const revalidate = 600; // 10 minutes

interface ITHomeItem {
  title: string;
  url: string;
  pubDate: string;
}

function parseRSSItems(xml: string): ITHomeItem[] {
  const items: ITHomeItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";

    if (title) {
      items.push({ title, url: link, pubDate });
    }
  }

  return items;
}

export async function GET() {
  try {
    const res = await fetch("https://www.ithome.com/rss/", {
      next: { revalidate: 600 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `IT之家 RSS 获取失败 (${res.status})` }, { status: 502 });
    }

    const xml = await res.text();
    const items = parseRSSItems(xml).slice(0, 10);

    return NextResponse.json(items, {
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "IT之家 RSS 获取失败" }, { status: 500 });
  }
}
