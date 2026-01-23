'use client';

import { useEffect, useState } from 'react';

export default function BusuanziCounter() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if script is already loaded
    if (document.getElementById('busuanzi_script')) {
      const handle = requestAnimationFrame(() => setLoading(false));
      return () => cancelAnimationFrame(handle);
    }

    // ... rest of logic
  }, []);

  // SSR 时返回一个占位或空，避免与客户端初始加载冲突
  if (!mounted) return <span className="text-zinc-400 opacity-0">...</span>;

  return (
    <span className="flex items-center gap-1" id="busuanzi_container_page_pv" style={{ display: 'inline-flex' }} suppressHydrationWarning>
      <span id="busuanzi_value_page_pv" className="font-mono min-w-[1ch] text-center">
        {loading ? '...' : ''}
      </span>
      <span>次阅读</span>
    </span>
  );
}

