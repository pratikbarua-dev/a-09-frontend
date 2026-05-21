// components/AppointmentsSection.jsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAppointments, deleteAppointment, updateAppointment } from "@/lib/api";
import {
  Search,
  ChevronDown,
  MapPin,
  CalendarDays,
  BadgeCheck,
  CalendarClock,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function AppointmentsSection() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleStatus, setRescheduleStatus] = useState("idle"); // idle | submitting | success | error
  const [rescheduleError, setRescheduleError] = useState("");

  const [cancelAppointment, setCancelAppointment] = useState(null);
  const [cancelStatus, setCancelStatus] = useState("idle"); // idle | submitting | success | error

  // Fetch appointments on mount
  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  // Reschedule Form Submission
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) {
      setRescheduleError("Please select both date and time.");
      return;
    }

    try {
      setRescheduleStatus("submitting");
      setRescheduleError("");

      // Format date and time
      const dateObj = new Date(rescheduleDate);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const [hourStr, minStr] = rescheduleTime.split(":");
      const hours = parseInt(hourStr, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedTime = `${formattedHours}:${minStr} ${ampm}`;

      const newDateString = `${formattedDate} - ${formattedTime}`;

      await updateAppointment(rescheduleAppointment._id || rescheduleAppointment.id, {
        date: newDateString,
        appointmentDate: rescheduleDate, // YYYY-MM-DD
        appointmentTime: formattedTime, // e.g. "10:30 AM"
      });

      setRescheduleStatus("success");

      // Reload list and close modal
      setTimeout(() => {
        setRescheduleAppointment(null);
        setRescheduleStatus("idle");
        setRescheduleDate("");
        setRescheduleTime("");
        loadAppointments();
      }, 2000);
    } catch (err) {
      console.error(err);
      setRescheduleStatus("error");
      setRescheduleError("Failed to reschedule. Please try again.");
    }
  };

  // Cancel Appointment Submission
  const handleCancelSubmit = async () => {
    try {
      setCancelStatus("submitting");
      await deleteAppointment(cancelAppointment._id || cancelAppointment.id);
      setCancelStatus("success");

      setTimeout(() => {
        setCancelAppointment(null);
        setCancelStatus("idle");
        loadAppointments();
      }, 2000);
    } catch (err) {
      console.error(err);
      setCancelStatus("error");
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchQuery) return true;
    const name = appointment.doctorName || appointment.name || "";
    const specialty = appointment.specialty || "";
    const query = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(query) ||
      specialty.toLowerCase().includes(query)
    );
  });

  return (
    <section className="min-h-screen bg-[#f5f7fb] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              All Appointments
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and view your upcoming medical visits.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by Doctor Name or Specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 sm:w-[320px]"
              />
            </div>

            {/* Sort */}
            <button className="flex h-12 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 sm:w-[170px]">
              <span>Sort by...</span>

              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && appointments.length === 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="skeleton h-16 w-16 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-5 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                </div>
                <div className="skeleton h-4 w-full mt-2"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="flex gap-3 mt-4">
                  <div className="skeleton h-10 flex-1 rounded-xl"></div>
                  <div className="skeleton h-10 flex-1 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-red-100 shadow-sm text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Connection Failed</h3>
            <p className="text-sm text-gray-500 max-w-md mt-2 mb-6">{error}</p>
            <button
              onClick={loadAppointments}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-gray-200 shadow-sm text-center">
            <CalendarClock size={64} className="text-gray-300 mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-900">No Appointments Booked</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-2 mb-8">
              {searchQuery
                ? "No appointments match your search query."
                : "You don't have any upcoming medical appointments scheduled."}
            </p>
            {!searchQuery && (
              <Link
                href="/doctors"
                className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-95 block"
              >
                Find and Book a Doctor
              </Link>
            )}
          </div>
        )}

        {/* Appointment Cards Grid */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment, index) => (
              <div
                key={appointment._id || appointment.id || index}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between"
              >
                {/* Card Info */}
                <div className="flex gap-4">
                  {/* Doctor Image */}
                  <div className="relative h-16 w-16 overflow-hidden rounded-full shrink-0">
                    <Image
                      src={appointment.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"}
                      alt={appointment.doctorName || appointment.name || "Doctor"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                          {appointment.doctorName || appointment.name || "Doctor"}
                        </h3>

                        <p className="text-sm font-medium text-blue-600">
                          {appointment.specialty}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700 shrink-0">
                        <BadgeCheck size={12} />
                        Verified
                      </div>
                    </div>

                    {/* Hospital */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{appointment.hospital || "City Wellness Center"}</span>
                    </div>

                    {/* Date */}
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays size={14} className="text-gray-400 shrink-0" />
                      <span className="line-clamp-1 font-medium">
                        {appointment.appointmentDate && appointment.appointmentTime
                          ? `${appointment.appointmentDate} - ${appointment.appointmentTime}`
                          : (appointment.date || "Date Not Specified")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setRescheduleAppointment(appointment)}
                    className="flex-1 rounded-xl border border-blue-600 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 cursor-pointer active:scale-95"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => setCancelAppointment(appointment)}
                    className="flex-1 rounded-xl border border-red-300 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== RESCHEDULE MODAL ==================== */}
      {rescheduleAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            {rescheduleStatus !== "success" && (
              <button
                onClick={() => {
                  setRescheduleAppointment(null);
                  setRescheduleStatus("idle");
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            )}

            {/* Idle Reschedule State */}
            {rescheduleStatus !== "success" && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Reschedule Visit</h3>
                <p className="text-sm text-gray-500 mb-5">Select a new date and time for your appointment.</p>

                {/* Doctor Brief */}
                <div className="flex gap-3 rounded-2xl bg-blue-50 p-4 mb-5">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full shrink-0 border border-white">
                    <Image
                      src={rescheduleAppointment.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop"}
                      alt={rescheduleAppointment.doctorName || rescheduleAppointment.name || "Doctor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {rescheduleAppointment.doctorName || rescheduleAppointment.name || "Doctor"}
                    </h4>
                    <p className="text-xs text-blue-600 font-semibold">{rescheduleAppointment.specialty}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Current: {rescheduleAppointment.appointmentDate && rescheduleAppointment.appointmentTime
                        ? `${rescheduleAppointment.appointmentDate} - ${rescheduleAppointment.appointmentTime}`
                        : (rescheduleAppointment.date || "Date Not Specified")}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">New Date</label>
                    <input
                      type="date"
                      required
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">New Time</label>
                    <input
                      type="time"
                      required
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {rescheduleError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-800">
                      <AlertCircle size={14} className="text-red-500 shrink-0" />
                      <span>{rescheduleError}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={rescheduleStatus === "submitting"}
                      onClick={() => setRescheduleAppointment(null)}
                      className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={rescheduleStatus === "submitting"}
                      className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {rescheduleStatus === "submitting" ? (
                        <>
                          <span className="loading loading-spinner loading-xs text-white"></span>
                          Saving...
                        </>
                      ) : (
                        "Confirm Change"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Success Reschedule State */}
            {rescheduleStatus === "success" && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4 animate-bounce">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Rescheduled Successfully!</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  Your appointment date and time have been successfully updated.
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-800">
                  <span className="loading loading-spinner loading-xs text-green-700"></span>
                  Refreshing list...
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== CANCELLATION CONFIRMATION MODAL ==================== */}
      {cancelAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            {cancelStatus !== "success" && (
              <button
                onClick={() => {
                  setCancelAppointment(null);
                  setCancelStatus("idle");
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            )}

            {/* Idle state */}
            {cancelStatus !== "success" && (
              <div className="text-center pt-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 mx-auto mb-4">
                  <AlertTriangle size={36} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Appointment?</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                  Are you sure you want to cancel your appointment with <span className="font-semibold text-gray-800">{cancelAppointment.doctorName || cancelAppointment.name || "Doctor"}</span> on <span className="font-semibold text-gray-800">{cancelAppointment.appointmentDate && cancelAppointment.appointmentTime ? `${cancelAppointment.appointmentDate} - ${cancelAppointment.appointmentTime}` : (cancelAppointment.date || "Date Not Specified")}</span>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    disabled={cancelStatus === "submitting"}
                    onClick={() => setCancelAppointment(null)}
                    className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    Keep Appointment
                  </button>
                  <button
                    disabled={cancelStatus === "submitting"}
                    onClick={handleCancelSubmit}
                    className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {cancelStatus === "submitting" ? (
                      <>
                        <span className="loading loading-spinner loading-xs text-white"></span>
                        Canceling...
                      </>
                    ) : (
                      "Yes, Cancel"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Success state */}
            {cancelStatus === "success" && (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 animate-pulse">
                  <X size={44} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-sans">Appointment Canceled</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  Your appointment has been deleted from our system.
                </p>
                <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-800 animate-pulse">
                  <span className="loading loading-spinner loading-xs text-red-700"></span>
                  Updating list...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
