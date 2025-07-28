"use client";
import { motion } from "motion/react";

export default function Separator() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full flex justify-center my-10 md:my-16"
    >
      <div className="w-4/5 max-w-4xl flex items-center">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#1793D1] to-transparent"></div>
        <div className="mx-4">
          <div className="w-3 h-3 rounded-full bg-[#1793D1] shadow-lg shadow-[#1793D1]/50"></div>
        </div>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#1793D1] to-transparent"></div>
      </div>
    </motion.div>
  );
}
