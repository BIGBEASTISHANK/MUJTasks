"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { isDisabled } from "@@/data/GlobalVar";

export default function CSEProjectAssistance() {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    mobile: "",
    projectTitle: "",
    projectType: "",
    deadline: "",
    fileLink: "",
  });

  const [mobileError, setMobileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setMobileError("Mobile number must be exactly 10 digits");
      } else {
        setMobileError("");
      }
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.mobile.length !== 10) {
      setMobileError("Mobile number must be exactly 10 digits");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("branch", formData.branch);
      submitData.append("mobile", formData.mobile);
      submitData.append("projectTitle", formData.projectTitle);
      submitData.append("projectType", formData.projectType);
      submitData.append("deadline", formData.deadline);
      submitData.append("fileLink", formData.fileLink);

      const response = await fetch("/api/ProjectAssistanceFormSubmission", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.details || "Failed to submit form",
        );
      }

      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData({
          name: "",
          branch: "",
          mobile: "",
          projectTitle: "",
          projectType: "",
          deadline: "",
          fileLink: "",
        });
        setSubmitSuccess(false);
      }, 10000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit form",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="cse-project" className="py-16 px-4 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#1793D1]">CSE Project</span> Assistance
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Need help with your CSE project? Submit your project details and
            requirements below, and our team will help you build your class
            project from scratch or assist wherever you need!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[#232930] rounded-2xl shadow-xl p-6 md:p-8"
        >
          {submitSuccess ? (
            <div className="text-center py-10">
              <div className="text-[#1793D1] text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Request Submitted!
              </h3>
              <p className="text-gray-300">
                We'll contact you shortly to discuss your project.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                  {submitError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="cse-name"
                    className="block text-gray-200 mb-2 font-medium"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="cse-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Branch Field */}
                <div>
                  <label
                    htmlFor="cse-branch"
                    className="block text-gray-200 mb-2 font-medium"
                  >
                    Branch
                  </label>
                  <input
                    type="text"
                    id="cse-branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                    placeholder="e.g., CSE, IT"
                  />
                </div>

                {/* Mobile Number Field */}
                <div>
                  <label
                    htmlFor="cse-mobile"
                    className="block text-gray-200 mb-2 font-medium"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="cse-mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className={`w-full bg-[#1A1E23] border ${
                      mobileError ? "border-red-500" : "border-gray-700"
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all`}
                    placeholder="10-digit mobile number"
                  />
                  {mobileError && (
                    <p className="text-red-500 text-sm mt-1">{mobileError}</p>
                  )}
                </div>

                {/* Project Title Field */}
                <div>
                  <label
                    htmlFor="cse-projectTitle"
                    className="block text-gray-200 mb-2 font-medium"
                  >
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="cse-projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                    placeholder="e.g., Library Management System"
                  />
                </div>

                {/* Project Type Field */}
                <div>
                  <label
                    htmlFor="cse-projectType"
                    className="block text-gray-200 mb-2 font-medium"
                  >
                    Project Type
                  </label>
                  <select
                    id="cse-projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="minor">Minor Project</option>
                    <option value="major">Major Project</option>
                    <option value="mini">Mini Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Deadline Field */}
                <div>
                  <label
                    htmlFor="cse-deadline"
                    className="block text-gray-200 mb-2 font-medium"
                  >
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="cse-deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                  />
                </div>
              </div>

              {/* File Upload Field */}
              <div>
                <label
                  htmlFor="cse-file"
                  className="block text-gray-200 mb-2 font-medium"
                >
                  Upload Project/Problem Statement PDF link
                </label>
                <input
                  type="text"
                  id="fileLink"
                  name="fileLink"
                  value={formData.fileLink}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                  placeholder="Upload file link of google drive or any other place."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <button
                  type={isDisabled ? "button" : "submit"}
                  disabled={isSubmitting || isDisabled}
                  className={`bg-[#1793D1] hover:bg-[#1793D1]/80 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-[#1793D1]/30 transition-all duration-300 ${
                    isSubmitting || isDisabled
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
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
                      Processing...
                    </div>
                  ) : (
                    "Send Project Request"
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
