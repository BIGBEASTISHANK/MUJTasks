"use client";
import { motion } from "framer-motion";
import { MdSecurity } from "react-icons/md";

export default function VerifyingDB() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1E23] to-[#232930] px-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Loading Icon */}
        <div className="bg-[#1793D1] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <MdSecurity className="w-10 h-10 text-white" />

          {/* Spinning Border */}
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-3"
        >
          Verifying Access
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-6"
        >
          Please wait while we authenticate your session...
        </motion.p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-[#1793D1] rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
