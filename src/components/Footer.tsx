"use client";
import { motion } from "motion/react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1E23] border-t border-[#1793D1]/30 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* About Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-[#1793D1]">MUJ Tasks</h3>
            <p className="text-gray-300 text-sm">
              Your one-stop solution for academic assistance at Manipal
              University Jaipur. We're expanding beyond assignments and lab
              manuals to offer more services soon.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/BIGBEASTISHANK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1793D1] transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://bigbeastishank.com/linkedin"
                target="_blank"
                className="text-gray-400 hover:text-[#1793D1] transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://instagram.com/qt_patuti03"
                target="_blank"
                className="text-gray-400 hover:text-[#1793D1] transition-colors"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-[#1793D1]">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a
                  href="#home"
                  className="hover:text-[#1793D1] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#form"
                  className="hover:text-[#1793D1] transition-colors"
                >
                  Form
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-[#1793D1] transition-colors"
                >
                  FAQ
                </a>
              </li>
              {/* <li>
                <a
                  href="#join"
                  className="hover:text-[#1793D1] transition-colors"
                >
                  Join Team
                </a>
              </li> */}
            </ul>
          </div>

          {/* Coming Soon */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-bold text-[#1793D1]">Coming Soon</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1793D1] rounded-full mr-2"></span>
                Project Assistance
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1793D1] rounded-full mr-2"></span>
                Exam Preparation
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1793D1] rounded-full mr-2"></span>
                Research Paper Writing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#1793D1] rounded-full mr-2"></span>
                Technical Workshops
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700"></div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"
        >
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} BIGBEASTISHANK. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <p className="text-center md:text-right">
              Crafted with <span className="text-red-500">♥</span> by{" "}
              <a
                href="https://github.com/BIGBEASTISHANK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1793D1] font-medium hover:underline"
              >
                BIGBEASTISHANK
              </a>
            </p>
            <p className="md:ml-2 text-center md:text-right mt-2 md:mt-0 text-xs">
              This is just the beginning - more services coming soon!
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
