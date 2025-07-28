"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { faqItems } from "@@/data/FAQItemsData";

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        className="w-full flex justify-between items-center py-5 px-2 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <span className="text-[#1793D1]">
          {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-5 px-2" : "max-h-0"
        }`}
      >
        <p className="text-gray-300">{answer}</p>
      </div>
    </div>
  );
};

export default function FAQ() {
  return (
    <div id="faq" className="py-16 px-4 bg-[#1A1E23] scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently <span className="text-[#1793D1]">Asked Questions</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[#232930] rounded-2xl shadow-xl p-6 md:p-8"
        >
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
