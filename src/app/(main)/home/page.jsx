import BookingSteps from "@/components/BookSteps";
import SpecialtySection from "@/components/BrowseCategory";
import HeroSection from "@/components/HeroSection";
import SpecialistsSection from "@/components/SpecialistSection";
import React from "react";

export const metadata = {
  title: "Home",
  description:
    "Explore top-rated specialists, browse medical categories, and book your next appointment with DocAppoint.",
};

export default function mainPage() {
  return (
    <>
      <HeroSection></HeroSection>
      <SpecialistsSection></SpecialistsSection>
      <SpecialtySection></SpecialtySection>
      <BookingSteps></BookingSteps>
    </>
  );
}
