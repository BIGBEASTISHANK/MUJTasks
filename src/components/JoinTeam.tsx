"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "motion/react";
import { FiCheckCircle, FiDollarSign, FiClock, FiStar } from "react-icons/fi";

export default function JoinTeam() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    semester: "",
  });
  
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, "");
      
      // Validate phone number length
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setPhoneError("Mobile number must be exactly 10 digits");
      } else {
        setPhoneError("");
      }
      
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate phone number
    if (formData.phone.length !== 10) {
      setPhoneError("Mobile number must be exactly 10 digits");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // Here you would normally send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          branch: "",
          semester: "",
        });
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="join" className="py-16 px-4 bg-[#1A1E23] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our <span className="text-[#1793D1]">Writer Team</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Are you skilled at academic writing? Join our team of expert writers and earn money by helping fellow students with their assignments and lab manuals.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-[#1793D1] mt-1">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Competitive Payment</h3>
                  <p className="text-gray-300">
                    Earn up to 70% of the assignment fee. Payments are processed promptly after client approval.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-[#1793D1] mt-1">
                  <FiClock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Flexible Schedule</h3>
                  <p className="text-gray-300">
                    Work on your own time. Accept only the assignments that fit your schedule and expertise.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-[#1793D1] mt-1">
                  <FiStar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Build Your Portfolio</h3>
                  <p className="text-gray-300">
                    Gain experience across various subjects and build your academic writing portfolio.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="text-[#1793D1] mt-1">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Simple Process</h3>
                  <p className="text-gray-300">
                    Browse available assignments, submit your bids, complete the work, and get paid.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#232930] rounded-2xl shadow-xl p-6 md:p-8"
          >
            {submitSuccess ? (
              <div className="text-center py-10">
                <div className="text-[#1793D1] text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-300">We'll review your application and contact you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6 text-center">Apply to Join</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="join-name" className="block text-gray-200 mb-2 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="join-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="join-email" className="block text-gray-200 mb-2 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="join-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                      placeholder="Your email"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="join-phone" className="block text-gray-200 mb-2 font-medium">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      id="join-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className={`w-full bg-[#1A1E23] border ${
                        phoneError ? "border-red-500" : "border-gray-700"
                      } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all`}
                      placeholder="10-digit mobile number"
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  </div>

                  {/* Two columns for Branch and Semester */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="join-branch" className="block text-gray-200 mb-2 font-medium">
                        Branch/Major
                      </label>
                      <input
                        type="text"
                        id="join-branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                        placeholder="e.g., CSE"
                      />
                    </div>
                    <div>
                      <label htmlFor="join-semester" className="block text-gray-200 mb-2 font-medium">
                        Semester
                      </label>
                      <select
                        id="join-semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#1A1E23] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#1793D1] transition-all"
                      >
                        <option value="" disabled>Select</option>
                        <option value="1">1st Semester</option>
                        <option value="2">2nd Semester</option>
                        <option value="3">3rd Semester</option>
                        <option value="4">4th Semester</option>
                        <option value="5">5th Semester</option>
                        <option value="6">6th Semester</option>
                        <option value="7">7th Semester</option>
                        <option value="8">8th Semester</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-[#1793D1] hover:bg-[#1793D1]/80 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-[#1793D1]/30 transition-all duration-300 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
