"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Mail, Link as LinkIcon, User } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Takedown Request Page
 * 
 * Legal "Safe Harbor" protection under DMCA and e-commerce intermediary laws.
 * Allows users to request removal of listings for copyright, trademark, or legal violations.
 */
export default function TakedownPage() {
    const [formData, setFormData] = useState({
        listingUrl: "",
        reporterName: "",
        reporterEmail: "",
        reason: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");
        setErrorMessage("");

        try {
            const response = await fetch("/api/takedown", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit takedown request");
            }

            setSubmitStatus("success");
            setFormData({
                listingUrl: "",
                reporterName: "",
                reporterEmail: "",
                reason: "",
            });
        } catch (error) {
            console.error("Takedown submission error:", error);
            setSubmitStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-text-main mb-3">
                        Notice and Takedown
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        If you believe a listing on Findly infringes your copyright, trademark, or violates
                        legal requirements, please submit a takedown request below.
                    </p>
                </motion.div>

                {/* Info Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8"
                >
                    <h2 className="font-semibold text-blue-900 mb-2">📋 Important Information</h2>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                            • Findly is an independent search engine that aggregates listings from third-party
                            platforms
                        </li>
                        <li>• We do not host or own the listings displayed on our platform</li>
                        <li>
                            • Valid takedown requests will be processed within 48-72 hours and removed from our
                            index
                        </li>
                        <li>
                            • For immediate removal, contact the original platform (Wallapop, Vinted, eBay,
                            etc.)
                        </li>
                    </ul>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Listing URL */}
                        <div>
                            <label
                                htmlFor="listingUrl"
                                className="flex items-center gap-2 text-sm font-semibold text-text-main mb-2"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Listing URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                id="listingUrl"
                                name="listingUrl"
                                value={formData.listingUrl}
                                onChange={handleChange}
                                required
                                placeholder="https://findly.com/listing/..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                The full URL of the listing you want removed
                            </p>
                        </div>

                        {/* Reporter Name */}
                        <div>
                            <label
                                htmlFor="reporterName"
                                className="flex items-center gap-2 text-sm font-semibold text-text-main mb-2"
                            >
                                <User className="w-4 h-4" />
                                Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="reporterName"
                                name="reporterName"
                                value={formData.reporterName}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>

                        {/* Reporter Email */}
                        <div>
                            <label
                                htmlFor="reporterEmail"
                                className="flex items-center gap-2 text-sm font-semibold text-text-main mb-2"
                            >
                                <Mail className="w-4 h-4" />
                                Your Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="reporterEmail"
                                name="reporterEmail"
                                value={formData.reporterEmail}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                We'll use this to follow up on your request
                            </p>
                        </div>

                        {/* Reason */}
                        <div>
                            <label
                                htmlFor="reason"
                                className="flex items-center gap-2 text-sm font-semibold text-text-main mb-2"
                            >
                                Reason for Takedown <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                rows={6}
                                placeholder="Please provide detailed information about why this listing should be removed (e.g., copyright infringement, trademark violation, illegal content, etc.)"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">Minimum 50 characters</p>
                        </div>

                        {/* Success Message */}
                        {submitStatus === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
                            >
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-green-900 mb-1">
                                        Request Submitted Successfully
                                    </h3>
                                    <p className="text-sm text-green-800">
                                        Your takedown request has been received. We'll review it within 48-72
                                        hours and send you an update via email.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {submitStatus === "error" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                            >
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900 mb-1">Submission Failed</h3>
                                    <p className="text-sm text-red-800">{errorMessage}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting || formData.reason.length < 50}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Takedown Request"}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Legal Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-xs text-slate-500"
                >
                    <p>
                        By submitting this form, you agree that the information provided is accurate and
                        complete. False claims may result in legal liability.
                    </p>
                    <p className="mt-2">
                        For questions, contact:{" "}
                        <a href="mailto:legal@findly.com" className="text-primary hover:underline">
                            legal@findly.com
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
