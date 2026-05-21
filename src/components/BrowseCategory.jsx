// components/BrowseCategory.jsx

import {
  Heart,
  Brain,
  Smile,
  Accessibility,
  ShieldCheck,
  Eye,
} from "lucide-react";

const specialties = [
  {
    name: "Cardiology",
    icon: Heart,
  },
  {
    name: "Neurology",
    icon: Brain,
  },
  {
    name: "Pediatrics",
    icon: Smile,
  },
  {
    name: "Orthopedics",
    icon: Accessibility,
  },
  {
    name: "Dermatology",
    icon: ShieldCheck,
  },
  {
    name: "Ophthalmology",
    icon: Eye,
  },
];

export default function BrowseCategory() {
  return (
    <section className="bg-[#f5f7fb] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Browse by Specialty
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon;

            return (
              <div
                key={index}
                className="group rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-blue-600">
                    <Icon size={28} strokeWidth={2} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-700">
                    {specialty.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
