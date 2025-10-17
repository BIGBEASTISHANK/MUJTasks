"use client";
import { isDisabled } from "@@/data/GlobalVar";
import { motion } from "motion/react";
import Marquee from "react-fast-marquee";

export default function Hero() {
    return (
        <div
            id="home"
            className="min-h-screen flex flex-col items-center justify-center pt-20 px-4"
        >
            {/* Website is disables text*/}
            <div
                className={`w-full mb-20 overflow-hidden ${
                    isDisabled ? "" : "hidden"
                }`}
            >
                <Marquee
                    gradient={true}
                    speed={50}
                    gradientColor="#0F1419"
                    gradientWidth={100}
                    className="bg-gradient-to-r from-[#1793D1]/20 via-[#232930] to-[#1793D1]/20 py-4 border-y border-[#1793D1]/30 items-center"
                >
                    <span className="text-[#1793D1] font-bold text-lg md:text-xl mx-8 flex items-center">
                        ⚠️ Website is disabled due to year breaks - We'll be
                        back soon!
                    </span>
                    <span className="text-gray-300 font-medium text-lg md:text-xl mx-8">
                        •
                    </span>
                    <span className="text-[#1793D1] font-bold text-lg md:text-xl mx-8 flex items-center">
                        🛠️ Website is currently under maintenance - Thank you
                        for your patience!
                    </span>
                    <span className="text-gray-300 font-medium text-lg md:text-xl mx-8">
                        •
                    </span>
                    <span className="text-[#1793D1] font-bold text-lg md:text-xl mx-8 flex items-center">
                        ⚠️ Website is disabled due to year breaks - We'll be
                        back soon!
                    </span>
                </Marquee>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="mb-6">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                            <span className="text-[#1793D1]">MUJ Tasks</span> -
                            Your Academic Solution
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            Don't let assignments, lab manuals & projects
                            overwhelm your college experience
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="bg-[#232930] p-8 rounded-2xl shadow-xl mb-10 max-w-4xl mx-auto"
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#1793D1]">
                            Why Choose MUJ Tasks?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div className="bg-[#1A1E23] p-5 rounded-xl shadow-md hover:shadow-[#1793D1]/20 hover:scale-105 transition-all duration-300">
                                <h3 className="text-xl font-bold mb-2 text-[#1793D1]">
                                    Quality Work
                                </h3>
                                <p className="text-gray-300">
                                    Get expertly crafted assignments/projects
                                    from our skilled writers/coders who
                                    understand MUJ requirements.
                                </p>
                            </div>
                            <div className="bg-[#1A1E23] p-5 rounded-xl shadow-md hover:shadow-[#1793D1]/20 hover:scale-105 transition-all duration-300">
                                <h3 className="text-xl font-bold mb-2 text-[#1793D1]">
                                    On-Time Delivery
                                </h3>
                                <p className="text-gray-300">
                                    Never miss a deadline again. We prioritize
                                    timely submissions for all your academic
                                    needs.
                                </p>
                            </div>
                            <div className="bg-[#1A1E23] p-5 rounded-xl shadow-md hover:shadow-[#1793D1]/20 hover:scale-105 transition-all duration-300">
                                <h3 className="text-xl font-bold mb-2 text-[#1793D1]">
                                    Stress-Free
                                </h3>
                                <p className="text-gray-300">
                                    Focus on what matters to you while we handle
                                    your academic workload.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#assignment"
                            className="bg-[#1793D1] hover:scale-[1.1] text-white border-2 border-[#1793D1] font-bold py-3 px-8 rounded-full transition-all duration-300"
                        >
                            Assignment Form
                        </a>
                        <a
                            href="#cse-project"
                            className="bg-transparent hover:bg-white/10 hover:scale-[1.1] text-white border-2 border-[#1793D1] font-bold py-3 px-8 rounded-full transition-all duration-300"
                        >
                            Project Assistance
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
