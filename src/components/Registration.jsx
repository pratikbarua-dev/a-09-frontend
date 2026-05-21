// app/register/page.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { authClient, useSession } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Redirect authenticated sessions immediately
  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);

  // Google OAuth Login Action Handler
  const googleLoginHandler = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home",
    });

    if (error) {
      toast.error(error.message || "Google login failed");
    }
  };

  // Traditional Email Registration Action Handler
  const regisHandler = async (data) => {
    const { name, email, password, image } = data;

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: image || undefined,
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }

    // Explicitly sign out right after account generation to clear automatic session binds
    await authClient.signOut();

    toast.success("Account created! Please login.");
    router.push("/login");
  };

  // Absolute fallback initial router protection pending layer
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-hidden bg-[#f5f7fb]"
    >
      {/* Loading Form Process Screen Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-2xl">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <p className="text-sm font-semibold text-gray-700">Creating your account...</p>
          </div>
        </div>
      )}

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT VIEWPORT COMPONENT PANELS */}
        <div className="flex items-center justify-center bg-white px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-md">
            
            {/* Typography Header Group */}
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
                Create Account
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-500">
                Register to manage appointments and connect with specialists.
              </p>
            </div>

            {/* Google OAuth Provider Button Control */}
            <div className="mt-8">
              <button
                onClick={googleLoginHandler}
                type="button"
                className="w-full h-14 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer"
              >
                <FaGoogle className="text-lg text-gray-600" />
                <span className="font-bold text-xs text-gray-700 tracking-wider">
                  CONTINUE WITH GOOGLE
                </span>
              </button>
            </div>

            {/* Textual Form Divider Elements */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-200" />
              <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">or register with email</p>
              <div className="flex-1 h-[1px] bg-gray-200" />
            </div>

            {/* Core Registration Inputs Element Wrapper */}
            <form onSubmit={handleSubmit(regisHandler, (formErrors) => {
              const firstError = Object.values(formErrors)[0];
              if (firstError?.message) {
                toast.error(firstError.message);
              }
            })} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  {...register("name", { required: "Full name is required" })}
                  type="text"
                  placeholder="Eleanor Vance"
                  className={`h-14 w-full rounded-2xl border px-5 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="scholar@example.com"
                  className={`h-14 w-full rounded-2xl border px-5 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
              </div>

              {/* Profile Image URL String Input */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Photo URL
                </label>
                <input
                  {...register("image")}
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Secure Password Field */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: {
                      hasUppercase: (v) =>
                        /[A-Z]/.test(v) || "Must contain at least 1 uppercase letter",
                      hasLowercase: (v) =>
                        /[a-z]/.test(v) || "Must contain at least 1 lowercase letter",
                    },
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={`h-14 w-full rounded-2xl border px-5 text-sm outline-none transition focus:ring-4 focus:ring-blue-100 ${
                    errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.password && <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
              </div>

              {/* Action Submit Control Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full rounded-2xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Inverted Router Navigation Entry Links */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 transition hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT VIEWPORT GRAPHICAL PANELS */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 lg:flex lg:items-center lg:justify-center">
          <div className="relative z-10 max-w-xl px-10 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-2xl">
              <ShieldCheck size={40} className="text-blue-700" />
            </div>

            <h2 className="mt-10 text-7xl font-extrabold tracking-tight">
              DocAppoint
            </h2>

            <p className="mt-6 text-lg leading-9 text-blue-100">
              Join thousands of patients and connect with trusted healthcare
              professionals.
            </p>

            <div className="relative mt-12 overflow-hidden rounded-[32px] bg-white/10 p-5 backdrop-blur-md">
              <div className="relative h-[420px] overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1200&auto=format&fit=crop"
                  alt="Doctor"
                  fill
                  sizes="(max-width: 1024px) 0vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}