"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function BusuanziCounter() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Function to reload Busuanzi script
    const loadScript = () => {
      // Remove existing script if any to force reload
      let existingScript = document.getElementById("busuanzi-script");
      if (existingScript) {
        existingScript.remove();
      }

      // Check if the global variable exists and maybe reset it if needed (not easily doable without window access hack)
      // Busuanzi normally binds to window.bsZ, but reloading script usually re-triggers the fetch.

      const script = document.createElement("script");
      script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
      script.id = "busuanzi-script";
      script.async = true;
      document.body.appendChild(script);
    };

    if (mounted) {
      loadScript();
    }
  }, [mounted, pathname]); // Re-run on pathname change

  if (!mounted) return <span className="opacity-0">...</span>;

  // We intentionally use style={{ display: 'inline' }} to override Busuanzi's default hidden behavior until it loads
  // But actually Busuanzi manages the 'display' of the container. 
  // We set initial to inline-flex to reserve space or handle layout.
  return (
    <span id="busuanzi_container_page_pv" className="inline-flex items-center gap-1" style={{ display: 'inline-flex' }}>
      <span id="busuanzi_value_page_pv" className="font-mono">...</span>
      <span>次阅读</span>
    </span>
  );
}
