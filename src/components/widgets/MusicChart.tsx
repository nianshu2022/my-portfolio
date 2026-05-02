"use client";

import { useState } from "react";
import { Music, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api/fetch-wrapper";
import { useApi } from "@/lib/hooks/useApi";
import type { NetEaseTrack } from "@/lib/api/types";

interface NetEasePlaylistResult {
  code: number;
  result: {
    name: string;
    tracks: NetEaseTrack[];
  };
}

export default function MusicChart() {
  const { data, loading, error, retry } = useApi<NetEaseTrack[]>(
    () =>
      fetchApi<NetEaseTrack[]>(
        "https://api.codetabs.com/v1/proxy/?quest=https://music.163.com/api/playlist/detail?id=3778678",
        {
          cacheKey: "netease-hot-songs",
          cacheTTL: 60 * 60 * 1000,
          transform: (raw) => (raw as NetEasePlaylistResult).result.tracks.slice(0, 6),
        },
      ),
    [],
  );

  if (loading) {
    return (
      <div className="garden-panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="garden-panel flex items-center gap-2 p-5 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span>热歌榜加载失败</span>
        <button onClick={retry} className="ml-auto text-xs text-primary hover:underline">
          重试
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="garden-panel p-5">
      <div className="mb-4 flex items-center gap-2">
        <Music className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">国内热榜音乐</h3>
      </div>
      <div className="divide-y divide-border">
        {data.map((track, i) => (
          <TrackRow key={track.id} track={track} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function TrackRow({ track, rank }: { track: NetEaseTrack; rank: number }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <a
      href={`https://music.163.com/#/song?id=${track.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 py-3"
    >
      <span className="w-5 shrink-0 text-center text-xs font-semibold text-muted-foreground">
        {rank}
      </span>
      {track.album?.picUrl && !imgFailed ? (
        <img
          src={track.album.picUrl}
          alt=""
          className="h-8 w-8 rounded object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
          <Music className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
          {track.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {track.artists.map((a) => a.name).join(" / ")}
        </p>
      </div>
    </a>
  );
}
