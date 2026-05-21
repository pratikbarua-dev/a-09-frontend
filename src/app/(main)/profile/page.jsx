// components/ProfileOverview.jsx

"use client";

import Image from "next/image";
import { Phone, MapPin, CalendarDays, Activity, Pencil } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function ProfileOverview() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  const profileName = session?.user?.name || "Eleanor Vance";
  const profileEmail = session?.user?.email || "eleanor.vance@example.com";
  const profileImage = session?.user?.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop";

  return (
    <section className="min-h-screen bg-[#f5f7fb] px-4 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl bg-blue-100 flex items-center justify-center">
            {session?.user?.image ? (
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="bg-blue-600 text-white flex items-center justify-center font-bold text-5xl h-full w-full select-none">
                {profileName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="mt-6 text-5xl font-extrabold text-blue-700">
            {profileName}
          </h1>

          {/* Email */}
          <p className="mt-3 text-base text-gray-500">
            {profileEmail}
          </p>

          {/* Button */}
          <button className="mt-8 flex items-center gap-2 rounded-full bg-green-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-800">
            <Pencil size={16} />
            Update Profile
          </button>
        </div>

        {/* Bottom Cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {/* Personal Info */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-700">Personal Info</h2>


            <div className="mt-8 space-y-5">
              {/* Phone */}
              <div className="flex items-center gap-4 text-gray-600">
                <Phone size={18} className="text-gray-400" />

                <span className="text-sm">+1 (555) 123-4567</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 text-gray-600">
                <MapPin size={18} className="text-gray-400" />

                <span className="text-sm">San Francisco, CA</span>
              </div>

              {/* DOB */}
              <div className="flex items-center gap-4 text-gray-600">
                <CalendarDays size={18} className="text-gray-400" />

                <span className="text-sm">Born Oct 12, 1985</span>
              </div>
            </div>
          </div>

          {/* Health Overview */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Activity size={30} />
              </div>

              {/* Title */}
              <h2 className="mt-6 text-4xl font-bold text-blue-700">
                Your Health Overview is up to date.
              </h2>

              {/* Description */}
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
