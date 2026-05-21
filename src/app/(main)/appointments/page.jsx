import AppointmentsSection from "@/components/AppointmentsSection";
import React from "react";

export const metadata = {
  title: "My Appointments",
  description:
    "View, reschedule, or cancel your upcoming medical appointments. Stay on top of your healthcare schedule with DocAppoint.",
};

export default function appointmentPage() {
  return (
    <>
      <AppointmentsSection></AppointmentsSection>
    </>
  );
}
