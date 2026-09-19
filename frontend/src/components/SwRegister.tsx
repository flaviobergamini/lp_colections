"use client";

import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // instalação como PWA é um extra; se falhar, o app segue funcionando normalmente.
      });
    }
  }, []);

  return null;
}
