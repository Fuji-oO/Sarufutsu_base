"use client";
import React, { useEffect, useState } from "react";
import { useTransition } from "./TransitionContext";

export default function TransitionOverlay() {
  const { isTransitioning } = useTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setVisible(true);
    } else {
      // フェードインで消す
      setTimeout(() => setVisible(false), 800);
    }
  }, [isTransitioning]);

  return (
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-600 bg-[#f5eedc] ${
        isTransitioning ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)" }}
    />
  );
} 