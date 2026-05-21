// components/SpecialistSection.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDoctors } from "@/lib/api";
import { Star, ArrowRight, X, CalendarClock, MapPin } from "lucide-react";

export default function SpecialistSection() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    async function loadTopDoctors() {
      try {
        setLoading(true);
        const data = await getDoctors();
        // Take first 3 doctors from DB
        if (data && data.length > 0) {
          setDoctorsList(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load top doctors, falling back to mock data", err);
      } finally {
        setLoading(false);
      }
    }
    loadTopDoctors();
  }, []);

  // Fallback mock data in case the database is empty or connection fails
  const mockDoctors = [
    {
      name: "Dr. Ayesha Rahman",
      specialty: "Cardiologist",
      experience: "10 years",
      hospital: "Labaid Cardiac Hospital",
      location: "Dhanmondi, Dhaka",
      fee: 800,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      description: "Highly experienced cardiologist specializing in heart diseases, preventive care, and patient-centered treatment.",
      availability: ["09:00 AM - 12:00 PM", "04:00 PM - 07:00 PM"],
    },
    {
      name: "Dr. Fahim Hasan",
      specialty: "Neurologist",
      experience: "12 years",
      hospital: "Square Hospital",
      location: "Panthapath, Dhaka",
      fee: 1000,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      description: "Expert neurologist focusing on stroke management, epilepsy, and nervous system disorders.",
      availability: ["10:00 AM - 01:00 PM", "06:00 PM - 09:00 PM"],
    },
    {
      name: "Dr. Nusrat Jahan",
      specialty: "Dermatologist",
      experience: "8 years",
      hospital: "Popular Diagnostic Center",
      location: "Shyamoli, Dhaka",
      fee: 700,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      description: "Specialist in skin care, acne treatment, cosmetic dermatology, and laser procedures.",
      availability: ["11:00 AM - 02:00 PM", "05:00 PM - 08:00 PM"],
    },
  ];

  const displayedDoctors = doctorsList.length > 0 ? doctorsList : mockDoctors;

  return (
    <section className="bg-[#f5f7fb] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Meet Our Top Rated Specialists
            </h2>

            <p className="mt-2 text-gray-500">
              Highly recommended professionals ready to assist you.
            </p>
          </div>

          <Link
            href="/doctors"
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All Doctors
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && doctorsList.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-8 shadow-md flex flex-col items-center">
                <div className="skeleton h-24 w-24 rounded-full"></div>
                <div className="skeleton h-6 w-32 mt-6"></div>
                <div className="skeleton h-5 w-24 mt-2"></div>
                <div className="skeleton h-4 w-40 mt-4"></div>
                <div className="skeleton h-10 w-full mt-6 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {displayedDoctors.map((doctor, index) => {
              const reviewsCount = 120 + (index * 15);
              return (
                <div key={doctor._id || doctor.id || index} className="rounded-2xl bg-white p-8 shadow-md flex flex-col justify-between h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex justify-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-blue-50 shadow-sm">
                        <Image
                          src={doctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop"}
                          alt={doctor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-6 text-center w-full">
                      <h3 className="text-2xl font-bold text-gray-800 line-clamp-1">
                        {doctor.name}
                      </h3>

                      <span className="mt-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
                        {doctor.specialty}
                      </span>

                      <div className="mt-4 flex items-center justify-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        ))}

                        <span className="ml-2 text-sm font-medium text-gray-500">
                          ({reviewsCount} Reviews)
                        </span>
                      </div>

                      {doctor.hospital && (
                        <p className="mt-3 text-xs text-gray-500 line-clamp-1">
                          {doctor.hospital}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="w-full rounded-xl border border-blue-500 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer active:scale-95 text-center block"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================== DOCTOR PROFILE MODAL ==================== */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            {/* Profile Content */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6 pt-4">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full shrink-0 border-4 border-blue-50 shadow-md mx-auto sm:mx-0">
                <Image
                  src={selectedDoctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"}
                  alt={selectedDoctor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 mb-1.5">
                  {selectedDoctor.specialty}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                <p className="text-sm font-semibold text-gray-500 mt-1">{selectedDoctor.hospital || "City Wellness Center"}</p>

                <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={15} fill="currentColor" strokeWidth={0} />
                    <span className="text-gray-800 font-bold">4.8</span>
                  </div>
                  <span>•</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-700">{selectedDoctor.experience || "5+ Years Exp"}</span>
                  {selectedDoctor.fee && (
                    <>
                      <span>•</span>
                      <span className="text-green-700 font-bold">${selectedDoctor.fee}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5"></div>

            {/* Bio/Description */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">About the Doctor</h4>
              <p className="text-sm text-gray-600 leading-6">
                {selectedDoctor.description || `${selectedDoctor.name} is a highly recommended specialist in ${selectedDoctor.specialty} at ${selectedDoctor.hospital || "City Wellness Center"} with over ${selectedDoctor.experience || "5 years"} of professional clinical experience in patient care.`}
              </p>
            </div>

            {/* Hospital details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl mb-6">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Hospital</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{selectedDoctor.hospital || "City General Hospital"}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Location</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{selectedDoctor.location || "New York, USA"}</span>
              </div>
            </div>

            {/* Availability info */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Working Hours</h4>
              <div className="flex flex-col gap-2">
                {selectedDoctor.availability && selectedDoctor.availability.length > 0 ? (
                  selectedDoctor.availability.map((timeSlot, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span>{timeSlot}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Monday - Friday: 09:00 AM - 05:00 PM</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-95"
              >
                Close Profile
              </button>
              <Link
                href="/doctors"
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer active:scale-95 text-center flex items-center justify-center"
              >
                Book with Doctor
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
