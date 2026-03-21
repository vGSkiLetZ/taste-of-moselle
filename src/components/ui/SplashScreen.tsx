"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on first visit per session
    const shown = sessionStorage.getItem("splash-shown");
    if (!shown) {
      setShow(true);
      sessionStorage.setItem("splash-shown", "1");
      setTimeout(() => setShow(false), 2200);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-moselle-cream flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/images/LOGO.jpg"
              alt="Taste of Moselle"
              width={120}
              height={120}
              className="rounded-3xl shadow-2xl"
              priority
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-moselle-text mt-6 tracking-tight"
          >
            <span className="italic">Taste of</span>{" "}
            <span className="text-moselle-green">Moselle</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="font-[family-name:var(--font-accent)] text-lg text-moselle-text-light mt-2"
          >
            Le guide gourmand
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1, ease: "easeInOut" }}
            className="w-32 h-0.5 bg-moselle-green/40 mt-6 origin-left rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
