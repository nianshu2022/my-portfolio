'use client';

import { useEffect, useState } from 'react';

export default function BusuanziCounter() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('busuanzi_script')) {
        setLoading(false);
        return;
    }

    const script = document.createElement('script');
    script.id = 'busuanzi_script';
    // 使用HTTPS协议，防止中间人攻击
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    // 添加integrity属性用于子资源完整性检查（如果第三方支持）
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
        setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
        // Optional: Cleanup if needed, but usually we want the script to persist
    };
  }, []);

  // Use a key to force re-render or re-fetch if needed on route change
  // But Busuanzi usually handles route changes by itself if configured, 
  // or we might need to manually trigger it. 
  // For Next.js SPA navigation, Busuanzi might not auto-trigger.
  // However, 'busuanzi.pure.mini.js' is quite old and might rely on page reloads.
  // Let's just display the span.

  return (
    <span className="flex items-center gap-1" id="busuanzi_container_page_pv" style={{ display: 'inline-flex' }}>
       <span id="busuanzi_value_page_pv" className="font-mono min-w-[1ch] text-center">
         {loading ? '...' : ''}
       </span>
       <span>次阅读</span>
    </span>
  );
}

