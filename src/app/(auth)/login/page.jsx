import Login from "@/components/Login";
import React from "react";

export const metadata = {
  title: "Login",
  description:
    "Log in to your DocAppoint account to manage appointments, view doctor profiles, and access your health records.",
};

export default function loginPage() {
  return <Login></Login>;
}
