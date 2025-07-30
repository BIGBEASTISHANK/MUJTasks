"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MdLock,
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdLogin,
  MdError,
} from "react-icons/md";
import VerifyingDB from "@/Utility/VerifyingDB";

export default function EmployeeLogin() {
  // Variables
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  const router = useRouter();

  // Check authentication status on component mount
  useEffect(() => {
    async function checkAuth() {
      try {
        // Getting verification response
        const response = await fetch("/api/auth/employee/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          // Already authenticated, redirect to dashboard
          router.push("/employee/dashboard");
          return;
        }

        // Show login form if verification fails
        setIsVerifying(false);
      } catch (error) {
        console.error("Verification failed Internal Error!");
      }
    }

    // Calling check auth
    checkAuth();
  }, [router]);

  // Change handler for login form
  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (loginError) {
      setLoginError("");
    }
  };

  // Submit handler for login form
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if form is empty
    if (!formData.email.trim() || !formData.password.trim()) {
      setLoginError("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setLoginError("Please enter a valid email address");
      return;
    }

    // Setting status variables
    setIsSubmitting(true);
    setLoginError("");

    try {
      // Sending login request
      const response = await fetch("/api/auth/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // Check if login was successful
      if (!response.ok) {
        setLoginError(data.error);
        setIsSubmitting(false);
        return;
      }

      // Refresh the page
      router.push("/employee/dashboard");
    } catch (error) {
      setLoginError("Internal Server Error");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading screen while verifying authentication
  if (isVerifying) {
    return <VerifyingDB />;
  }

  // Show login form if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#1A1E23] to-[#232930]">
      <div className="max-w-md w-full mt-10">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="bg-[#1793D1] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdLock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Employee <span className="text-[#1793D1]">Login</span>
          </h2>
          <p className="text-gray-400">
            Access the employee dashboard to manage projects and requests
          </p>
        </motion.div>

        {/* Form section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#232930] rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-center select-none"
              >
                <MdError className="w-5 h-5 mr-2 flex-shrink-0" />
                {loginError}
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-200 mb-2 font-medium select-none"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleLoginInputChange}
                  required
                  className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                />
                <MdEmail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-200 mb-2 font-medium select-none"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleLoginInputChange}
                  required
                  className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <MdLock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors hover:cursor-pointer"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="w-5 h-5" />
                  ) : (
                    <MdVisibility className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#1793D1] hover:bg-[#1793D1]/80 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#1793D1]/30 transition-all duration-300 flex items-center justify-center select-none ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="select-none">Signing In...</span>
                </>
              ) : (
                <>
                  <MdLogin className="w-5 h-5 mr-2" />
                  <span className="select-none">Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm select-none">
              Secure employee access to manage project requests and system settings
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
