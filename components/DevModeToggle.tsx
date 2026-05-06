"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DevModeToggle() {
  const [isDevMode, setIsDevMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const match = document.cookie.match(/(?:^|;\s*)devmode=([01])/);
    // Default to dev mode on if cookie is absent
    setIsDevMode(!match || match[1] !== "0");
  }, []);

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) return null;

  const toggle = (toDev: boolean) => {
    if (toDev === isDevMode) return;
    setIsDevMode(toDev);
    document.cookie = `devmode=${toDev ? "1" : "0"}; path=/; max-age=86400`;
    router.refresh();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#2F2C2C]/75 backdrop-blur-md rounded-full pl-3 pr-1.5 py-1.5 shadow-xl border border-white/10 select-none">
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFFBF7]/40 whitespace-nowrap">
        Preview
      </span>
      <div className="flex rounded-full overflow-hidden border border-white/10">
        <button
          onClick={() => toggle(true)}
          className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 transition-colors cursor-pointer ${
            isDevMode
              ? "bg-[#EC7A5B] text-[#FFFBF7]"
              : "text-[#FFFBF7]/40 hover:text-[#FFFBF7]/70"
          }`}
        >
          Dev
        </button>
        <button
          onClick={() => toggle(false)}
          className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 transition-colors cursor-pointer ${
            !isDevMode
              ? "bg-[#FFFBF7]/20 text-[#FFFBF7]"
              : "text-[#FFFBF7]/40 hover:text-[#FFFBF7]/70"
          }`}
        >
          Prod
        </button>
      </div>
    </div>
  );
}
