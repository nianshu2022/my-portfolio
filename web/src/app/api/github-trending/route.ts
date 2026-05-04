import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour

interface TrendingRepo {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: string;
}

function parseTrendingPage(html: string): TrendingRepo[] {
  const repos: TrendingRepo[] = [];
  const articleRegex = /<article class="Box-row">([\s\S]*?)<\/article>/g;
  let match: RegExpExecArray | null;

  while ((match = articleRegex.exec(html)) !== null) {
    const block = match[1];

    const repoMatch = block.match(/<h2[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    const repoPath = repoMatch?.[1]?.trim() ?? "";
    const repoName = repoMatch?.[2]?.replace(/<[^>]*>/g, "").trim().replace(/\s+/g, "") ?? "";

    const descMatch = block.match(/<p class="col-9[^>]*>([\s\S]*?)<\/p>/);
    const description = descMatch?.[1]?.replace(/<[^>]*>/g, "").trim() ?? "";

    const langMatch = block.match(/<span itemprop="programmingLanguage">([\s\S]*?)<\/span>/);
    const language = langMatch?.[1]?.trim() ?? "";

    const starsMatch = block.match(/<a[^>]*href="[^"]*\/stargazers"[^>]*>([\s\S]*?)<\/a>/);
    const stars = starsMatch?.[1]?.replace(/<[^>]*>/g, "").trim() ?? "";

    if (repoName) {
      repos.push({
        name: repoName,
        url: `https://github.com${repoPath}`,
        description,
        language,
        stars,
      });
    }
  }

  return repos;
}

export async function GET() {
  try {
    const res = await fetch("https://github.com/trending", {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub Trending 获取失败 (${res.status})` }, { status: 502 });
    }

    const html = await res.text();
    const repos = parseTrendingPage(html).slice(0, 10);

    return NextResponse.json(repos, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ error: "GitHub Trending 获取失败" }, { status: 500 });
  }
}
