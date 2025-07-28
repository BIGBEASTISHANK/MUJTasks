"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdVerifiedUser } from "react-icons/md";
import VerifyingDB from "@/Utility/VerifyingDB";

export default function AdminDashboardComponent() {
  // Variables
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch data from the server
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/auth/verifyEmployee", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok)
          router.push("/admin");

        // Authentication successful
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Verification failed:", error);
        // Sending to /admin page
        router.push("/admin");
      } finally {
        setIsVerifying(false);
      }
    }

    fetchData();
  }, [router]);

  // Show loading screen while verifying
  if (isVerifying || !isAuthenticated) {
    return <VerifyingDB />;
  }

  // Show dashboard content after verification
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1E23] to-[#232930] p-6">
        {/* Success indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg flex items-center">
            <MdVerifiedUser className="w-5 h-5 mr-2" />
            Access Verified - Welcome to Admin Dashboard
          </div>
        </motion.div>

        {/* Your dashboard content goes here */}
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Dashboard content will go here...</p>
        </div>
      </div>
    </motion.div>
  );
}
