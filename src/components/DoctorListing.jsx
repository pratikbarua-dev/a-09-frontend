// components/DoctorListing.jsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getDoctors, createAppointment } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import {
  Star,
  MapPin,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
} from "lucide-react";

export default function DoctorListing({ externalSearchQuery = "" }) {
  const { data: session } = useSession();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting State
  const [sortBy, setSortBy] = useState("relevance");

  // Filters State
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingStatus, setBookingStatus] = useState("idle"); // idle | submitting | success | error
  const [bookingError, setBookingError] = useState("");

  // Doctor Profile Modal State
  const [profileDoctor, setProfileDoctor] = useState(null);

  // Fetch Doctors on mount
  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        const data = await getDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  // Specialty Checkbox Handler
  const handleSpecialtyChange = (specialty) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  // Experience Radio Handler
  const handleExperienceChange = (expRange) => {
    setSelectedExperience(expRange);
  };

  // Booking Form Submit Handler
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) {
      setBookingError("Please select both a date and time for your appointment.");
      return;
    }

    try {
      setBookingStatus("submitting");
      setBookingError("");

      // Format date and time to match the UI style: e.g. "Oct 24, 2026 - 10:00 AM"
      const dateObj = new Date(bookingDate);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      // Format time
      const [hourStr, minStr] = bookingTime.split(":");
      const hours = parseInt(hourStr, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedTime = `${formattedHours}:${minStr} ${ampm}`;

      const appointmentData = {
        name: bookingDoctor.name,
        doctorName: bookingDoctor.name, // Compatibility with DB schema
        specialty: bookingDoctor.specialty,
        hospital: bookingDoctor.hospital || "City Wellness Center",
        date: `${formattedDate} - ${formattedTime}`,
        appointmentDate: bookingDate, // Compatibility with DB schema (YYYY-MM-DD)
        appointmentTime: formattedTime, // Compatibility with DB schema (e.g. "10:00 AM")
        patientName: session?.user?.name || "Eleanor Vance", // Default patient profile
        gender: "Female",
        image: bookingDoctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop",
        notes: bookingNotes,
        status: "Verified",
      };

      await createAppointment(appointmentData);
      setBookingStatus("success");

      // Auto close after 2 seconds
      setTimeout(() => {
        setBookingDoctor(null);
        setBookingStatus("idle");
        setBookingDate("");
        setBookingTime("");
        setBookingNotes("");
      }, 2000);
    } catch (err) {
      console.error(err);
      setBookingStatus("error");
      setBookingError("Failed to book appointment. Please try again.");
    }
  };

  // Parse experience string to number (e.g. "10 years" -> 10)
  const parseExperience = (expStr) => {
    if (!expStr) return 0;
    const match = expStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Filter Doctors
  const filteredDoctors = doctors.filter((doctor) => {
    // 1. Specialty Filter
    if (selectedSpecialties.length > 0) {
      const match = selectedSpecialties.some(
        (spec) => doctor.specialty.toLowerCase() === spec.toLowerCase()
      );
      if (!match) return false;
    }

    // 2. Experience Filter
    if (selectedExperience) {
      const years = parseExperience(doctor.experience);
      if (selectedExperience === "1 - 5 Years" && (years < 1 || years > 5)) return false;
      if (selectedExperience === "5 - 10 Years" && (years < 5 || years > 10)) return false;
      if (selectedExperience === "10+ Years" && years < 10) return false;
    }

    // 3. Search Query Filter
    const activeSearch = externalSearchQuery || searchQuery;
    if (activeSearch) {
      const query = activeSearch.toLowerCase();
      const nameMatch = doctor.name.toLowerCase().includes(query);
      const specMatch = doctor.specialty.toLowerCase().includes(query);
      const hospMatch = (doctor.hospital || "").toLowerCase().includes(query);
      if (!nameMatch && !specMatch && !hospMatch) return false;
    }

    return true;
  });

  // Sort Doctors
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === "fee-low-high") {
      const feeA = parseInt(a.fee, 10) || 0;
      const feeB = parseInt(b.fee, 10) || 0;
      return feeA - feeB;
    }
    if (sortBy === "fee-high-low") {
      const feeA = parseInt(a.fee, 10) || 0;
      const feeB = parseInt(b.fee, 10) || 0;
      return feeB - feeA;
    }
    if (sortBy === "experience") {
      const expA = parseExperience(a.experience);
      const expB = parseExperience(b.experience);
      return expB - expA;
    }
    // relevance / default
    return 0;
  });

  return (
    <section className="bg-[#f5f7fb] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Content */}
        <div>
          {/* Top Bar */}
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              {loading ? (
                <span className="inline-block skeleton h-4 w-28"></span>
              ) : (
                <>
                  <span className="font-bold text-gray-900">{sortedDoctors.length} doctors</span> available
                </>
              )}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Sort by:</span>
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="font-semibold text-blue-600 flex items-center gap-1 cursor-pointer outline-none hover:text-blue-700 transition"
                >
                  {sortBy === "relevance" && "Relevance"}
                  {sortBy === "fee-low-high" && "Price: Low to High"}
                  {sortBy === "fee-high-low" && "Price: High to Low"}
                  {sortBy === "experience" && "Years of Experience"}
                  <ChevronDown size={14} className="shrink-0" />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-white rounded-2xl z-20 w-52 p-2 shadow-lg border border-gray-100 mt-2 text-gray-700 font-medium"
                >
                  <li>
                    <button
                      onClick={() => setSortBy("relevance")}
                      className={`rounded-xl px-4 py-2 hover:bg-blue-50 text-left ${
                        sortBy === "relevance" ? "bg-blue-50 text-blue-600 font-bold" : ""
                      }`}
                    >
                      Relevance
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortBy("fee-low-high")}
                      className={`rounded-xl px-4 py-2 hover:bg-blue-50 text-left ${
                        sortBy === "fee-low-high" ? "bg-blue-50 text-blue-600 font-bold" : ""
                      }`}
                    >
                      Price: Low to High
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortBy("fee-high-low")}
                      className={`rounded-xl px-4 py-2 hover:bg-blue-50 text-left ${
                        sortBy === "fee-high-low" ? "bg-blue-50 text-blue-600 font-bold" : ""
                      }`}
                    >
                      Price: High to Low
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSortBy("experience")}
                      className={`rounded-xl px-4 py-2 hover:bg-blue-50 text-left ${
                        sortBy === "experience" ? "bg-blue-50 text-blue-600 font-bold" : ""
                      }`}
                    >
                      Years of Experience
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="skeleton h-20 w-20 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-5 w-3/4"></div>
                      <div className="skeleton h-4 w-1/2"></div>
                      <div className="skeleton h-3 w-1/3"></div>
                    </div>
                  </div>
                  <div className="skeleton h-4 w-full mt-2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                  <div className="flex gap-3 mt-4">
                    <div className="skeleton h-10 flex-1 rounded-lg"></div>
                    <div className="skeleton h-10 w-24 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Feedback */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-red-100 shadow-sm text-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Database Connection Offline</h3>
              <p className="text-sm text-gray-500 max-w-md mt-2 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && sortedDoctors.length === 0 && (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
                alt="No doctors found"
                width={80}
                height={80}
                className="opacity-30 mb-4 rounded-full"
              />
              <h3 className="text-lg font-bold text-gray-900">No Doctors Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1">
                We couldn&apos;t find any doctors matching your selected filters. Try broadening your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedSpecialties([]);
                  setSelectedExperience("");
                  setSearchQuery("");
                }}
                className="mt-6 text-sm font-semibold text-blue-600 hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Doctor Cards */}
          {!loading && !error && sortedDoctors.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sortedDoctors.map((doctor, index) => {
                const rating = "4.8";
                const reviewsCount = "120 reviews";
                const nextAvail = doctor.availability && doctor.availability.length > 0
                  ? doctor.availability[0]
                  : "Tomorrow, 10:30 AM";

                return (
                  <div
                    key={doctor._id || doctor.id || index}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top section */}
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative h-20 w-20 overflow-hidden rounded-full shrink-0">
                          <Image
                            src={doctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {doctor.name}
                          </h3>
                          <p className="text-sm font-medium text-blue-600">
                            {doctor.specialty}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">{doctor.experience || "5+ Years Exp"}</span>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star size={13} fill="currentColor" strokeWidth={0} />
                              <span className="text-gray-700 font-semibold">{rating}</span>
                            </div>
                            <span>({reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Hospital & Location */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={15} className="text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{doctor.hospital || "City Clinic"}{doctor.location ? `, ${doctor.location}` : ""}</span>
                      </div>

                      {/* Consultation Fee */}
                      {doctor.fee && (
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">Fee:</span>
                          <span className="text-green-700 font-bold">${doctor.fee}</span>
                        </div>
                      )}

                      {/* Availability */}
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                        <CalendarClock size={15} className="shrink-0" />
                        <span className="line-clamp-1">Available: {nextAvail}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => setBookingDoctor(doctor)}
                        className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer active:scale-95"
                      >
                        Book Now
                      </button>

                      <button
                        onClick={() => setProfileDoctor(doctor)}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 cursor-pointer active:scale-95"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && sortedDoctors.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==================== BOOKING MODAL ==================== */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            {bookingStatus !== "success" && (
              <button
                onClick={() => {
                  setBookingDoctor(null);
                  setBookingStatus("idle");
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            )}

            {/* Content: Idle state */}
            {bookingStatus !== "success" && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h3>
                <p className="text-sm text-gray-500 mb-5">Fill in details to secure your visit with the specialist.</p>

                {/* Doctor Brief Card */}
                <div className="flex gap-4 rounded-2xl bg-blue-50 p-4 mb-6">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full shrink-0 border-2 border-white shadow-sm">
                    <Image
                      src={bookingDoctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"}
                      alt={bookingDoctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{bookingDoctor.name}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{bookingDoctor.specialty}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{bookingDoctor.hospital}</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  {/* Patient Name (Pre-filled, uneditable for now per specifications) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Patient Name</label>
                    <input
                      type="text"
                      disabled
                      value={session?.user?.name || "Eleanor Vance"}
                      className="h-11 w-full rounded-xl bg-gray-100 border border-gray-200 px-4 text-sm text-gray-500 outline-none cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Appointment Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Appointment Time</label>
                      <input
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Symptoms / Notes (Optional)</label>
                    <textarea
                      placeholder="e.g. routine checkup, heart palpitation, skin allergy..."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 h-24 resize-none"
                    />
                  </div>

                  {/* Booking Error */}
                  {bookingError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-800">
                      <AlertCircle size={14} className="text-red-500 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={bookingStatus === "submitting"}
                      onClick={() => setBookingDoctor(null)}
                      className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingStatus === "submitting"}
                      className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {bookingStatus === "submitting" ? (
                        <>
                          <span className="loading loading-spinner loading-xs text-white"></span>
                          Booking...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Content: Success state */}
            {bookingStatus === "success" && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 animate-bounce">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Your appointment with <span className="font-semibold text-blue-600">{bookingDoctor.name}</span> has been successfully booked.
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-800">
                  <span className="loading loading-spinner loading-xs text-green-700"></span>
                  Redirecting in a moment...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== DOCTOR PROFILE MODAL ==================== */}
      {profileDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setProfileDoctor(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            {/* Profile Content */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6 pt-4">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full shrink-0 border-4 border-blue-50 shadow-md mx-auto sm:mx-0">
                <Image
                  src={profileDoctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"}
                  alt={profileDoctor.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 mb-1.5">
                  {profileDoctor.specialty}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{profileDoctor.name}</h3>
                <p className="text-sm font-semibold text-gray-500 mt-1">{profileDoctor.hospital || "City Wellness Center"}</p>

                <div className="mt-3 flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={15} fill="currentColor" strokeWidth={0} />
                    <span className="text-gray-800 font-bold">4.8</span>
                  </div>
                  <span>•</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-700">{profileDoctor.experience || "5+ Years Exp"}</span>
                  <span>•</span>
                  <span className="text-green-700 font-bold">${profileDoctor.fee || "800"}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5"></div>

            {/* Bio/Description */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">About the Doctor</h4>
              <p className="text-sm text-gray-600 leading-6">
                {profileDoctor.description || `${profileDoctor.name} is a highly recommended specialist in ${profileDoctor.specialty} at ${profileDoctor.hospital || "City Wellness Center"} with over ${profileDoctor.experience || "5 years"} of professional clinical experience in patient care.`}
              </p>
            </div>

            {/* Hospital details */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl mb-6">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Hospital</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{profileDoctor.hospital || "City General Hospital"}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Location</span>
                <span className="text-sm font-semibold text-gray-800 mt-1 block">{profileDoctor.location || "New York, USA"}</span>
              </div>
            </div>

            {/* Availability info */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Working Hours</h4>
              <div className="flex flex-col gap-2">
                {profileDoctor.availability && profileDoctor.availability.length > 0 ? (
                  profileDoctor.availability.map((timeSlot, idx) => (
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
                onClick={() => setProfileDoctor(null)}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-95"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  setBookingDoctor(profileDoctor);
                  setProfileDoctor(null);
                }}
                className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer active:scale-95"
              >
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
