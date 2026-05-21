// app/profile/page.jsx or components/ProfilePage.jsx

"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Mail, User, CalendarDays, Activity, Pencil, Save, X, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!session) return null;
  const user = session.user;

  // Format the account creation date
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const updateHandler = async (data) => {
    try {
      console.log("Updated Data:", data);
      await authClient.updateUser({
        name: data.name,
        image: data.image,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user context profile:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <section className="min-h-screen bg-[#f5f7fb] px-4 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Profile Header Block */}
        <div className="flex flex-col items-center text-center">
          
          {/* Profile Image Window */}
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                width={144}
                height={144}
                className="object-cover h-full w-full"
                priority
              />
            ) : (
              <div className="bg-blue-600 text-white flex items-center justify-center font-bold text-5xl h-full w-full select-none">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          {/* User Meta Data Presentation */}
          <h1 className="mt-6 text-5xl font-extrabold text-blue-700">
            {user.name}
          </h1>
          <p className="mt-3 text-base text-gray-500">
            {user.email}
          </p>

          {/* Toggle Edit Controls View State */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-8 flex items-center gap-2 rounded-full bg-green-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-800 cursor-pointer"
            >
              <Pencil size={16} />
              Update Profile
            </button>
          ) : (
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-full bg-gray-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-gray-600 cursor-pointer"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Informational Cards & Inline Forms Grid Layout */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Left Column: Personal Information Profile Content / Edit Inputs */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Personal Info</h2>

            {!isEditing ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-gray-600">
                  <User size={18} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Full Name</p>
                    <span className="text-sm truncate block">{user.name || "Not provided"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <Mail size={18} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email Address</p>
                    <span className="text-sm truncate block">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <CalendarDays size={18} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Member Since</p>
                    <span className="text-sm">{memberSince}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600">
                  <Shield size={18} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email Verified</p>
                    <span className="text-sm">{user.emailVerified ? "Verified" : "Not verified"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(updateHandler)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    defaultValue={user.name}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Profile Image URL
                  </label>
                  <input
                    {...register("image")}
                    type="text"
                    defaultValue={user.image || ""}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-600 transition"
                  />
                  {errors.image && <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 cursor-pointer"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Columns: Strategic Health Component Module */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Activity size={30} />
              </div>

              <h2 className="mt-6 text-4xl font-bold text-blue-700">
                Your Health Overview is up to date.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-500">
                No critical alerts. Maintain your current wellness routine and
                check back for your upcoming physical.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}