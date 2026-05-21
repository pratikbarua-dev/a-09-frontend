import Register from "@/components/Registration";
import React from "react";

export const metadata = {
  title: "Create Account",
  description:
    "Register for a DocAppoint account to book appointments with verified doctors and manage your healthcare journey.",
};

export default function RegistrationPage() {
  return (
    <>
      <Register></Register>
    </>
  );
}
