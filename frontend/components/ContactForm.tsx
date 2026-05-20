"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
  setIsSubmitting(true);
  try {
    const response = await fetch('http://localhost:8000/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        message: data.message,
      }),
    });

    if (response.ok) {
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    }
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full relative">
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="absolute -top-20 left-0 right-0 bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-center justify-center gap-2 mb-6 shadow-sm z-10"
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">Message sent successfully! We'll be in touch.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-8 shadow-sm flex flex-col gap-5"
      >
        
        {/* Row 1: First Name & Last Name */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col w-full sm:w-1/2">
            <label htmlFor="firstName" className="font-inter text-sm font-medium text-[#334155] mb-1">
              First Name
            </label>
            <input
              {...register("firstName")}
              id="firstName"
              type="text"
              placeholder="Enter your first name..."
              className={cn(
                "w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 transition-all duration-200 placeholder:text-[#94A3B8]",
                errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#E2E8F0] focus:border-[#6366F1] focus:ring-[#6366F1]"
              )}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>

          <div className="flex flex-col w-full sm:w-1/2">
            <label htmlFor="lastName" className="font-inter text-sm font-medium text-[#334155] mb-1">
              Last Name
            </label>
            <input
              {...register("lastName")}
              id="lastName"
              type="text"
              placeholder="Enter your last name..."
              className={cn(
                "w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 transition-all duration-200 placeholder:text-[#94A3B8]",
                errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#E2E8F0] focus:border-[#6366F1] focus:ring-[#6366F1]"
              )}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="font-inter text-sm font-medium text-[#334155] mb-1">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Enter your email address..."
            className={cn(
              "w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 transition-all duration-200 placeholder:text-[#94A3B8]",
              errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#E2E8F0] focus:border-[#6366F1] focus:ring-[#6366F1]"
            )}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Row 3: Message */}
        <div className="flex flex-col w-full">
          <label htmlFor="message" className="font-inter text-sm font-medium text-[#334155] mb-1">
            How can we help you?
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={6}
            placeholder="Enter your message..."
            className={cn(
              "w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 transition-all duration-200 resize-none placeholder:text-[#94A3B8]",
              errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#E2E8F0] focus:border-[#6366F1] focus:ring-[#6366F1]"
            )}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end w-full mt-2">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 1.04 }}
            transition={{ duration: 0.15 }}
            className="bg-[#6366F1] text-white rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-[#4F46E5] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Send Message →"
            )}
          </motion.button>
        </div>
        
      </form>
    </div>
  );
}
