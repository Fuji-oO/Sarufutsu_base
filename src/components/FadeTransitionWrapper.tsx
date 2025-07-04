"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const FadeTransitionWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{ minHeight: '100vh', background: '#f5eedc' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default FadeTransitionWrapper; 