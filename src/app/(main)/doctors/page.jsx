"use client";

import SearchBar from "@/components/DocSearchbar";
import DoctorListing from "@/components/DoctorListing";
import React, { useState } from "react";

export default function doctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <SearchBar onSearch={setSearchQuery}></SearchBar>
      <DoctorListing externalSearchQuery={searchQuery}></DoctorListing>
    </>
  );
}
