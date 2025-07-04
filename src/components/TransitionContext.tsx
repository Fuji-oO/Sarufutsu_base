"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const TransitionContext = createContext({
  isTransitioning: false,
  startTransition: () => {},
  endTransition: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);

  // パスが変わったら必ずendTransition
  useEffect(() => {
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}; 