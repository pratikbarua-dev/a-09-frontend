// app/register/page.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || undefined,
      });

      if (authError) {
        setError(authError.message || "Registration failed. Please try again.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-hidden bg-[#f5f7fb]"
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 shadow-2xl">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <p className="text-sm font-semibold text-gray-700">Creating your account...</p>
          </div>
        </div>
      )}

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center bg-white px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
                Create Account
              </h1>

              <p className="mt-4 text-base leading-7 text-gray-500">
                Register to manage appointments and connect with specialists.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-shake">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current text-red-500" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="mt-10 space-y-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Photo URL
                </label>

                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-2xl border border-gray-200 px-5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login */}
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

        {/* RIGHT */}
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
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
