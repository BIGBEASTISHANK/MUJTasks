"use client";
import { NavbarData } from "@@/data/NavbarData";
import { motion } from "motion/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed flex w-full p-4 z-10">
      <motion.div
        initial={{ y: -150 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="w-full bg-[#1793D1] shadow-2xl shadow-[#1793D1]/50 rounded-3xl py-2 px-5 flex items-center"
      >
        {/* Heading */}
        <Link href="/#home" className="text-3xl font-bold hidden sm:flex">
          MUJ Tasks
        </Link>

        {/* Navbar Items */}
        <ul className="flex gap-4 sm:ml-auto sm:mr-0 mx-auto">
          {NavbarData.map((item, index) => (
            <li
              key={index}
              className="text-white hover:text-gray-200 hover:scale-[1.1] transition-all duration-300 ease-in-out text-lg"
            >
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
