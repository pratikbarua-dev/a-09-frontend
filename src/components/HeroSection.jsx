"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const doctors = [
  {
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-[#f5f7fb] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-xl lg:grid-cols-2">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14 xl:p-16">
          
          {/* Badge */}
          <div className="mb-6 flex">
            <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              Trusted Care
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-[1.15] text-gray-900 sm:text-5xl lg:text-5xl xl:text-6xl">
            Your Health,
            <br />
            Our Priority.
            <br />
            <span className="mt-2 block text-blue-700">
              Book Top Doctors Instantly.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
            Experience seamless healthcare access. Connect with certified
            specialists, manage appointments, and prioritize your well-being
            with DocAppoint.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/doctors"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-green-800 sm:w-auto active:scale-[0.98]"
            >
              Find a Doctor
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/doctors"
              className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto active:scale-[0.98]"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6 sm:gap-x-12">
            <div className="flex flex-col">
              <h3 className="text-3xl font-extrabold text-gray-900">500+</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Doctors</p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-3xl font-extrabold text-gray-900">20k+</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Patients</p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-3xl font-extrabold text-gray-900">24/7</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">Support</p>
            </div>
          </div>
        </div>

        {/* Right Swiper / SSR Fallback */}
        <div className="relative h-[300px] w-full sm:h-[450px] lg:h-full lg:min-h-[650px]">
          {mounted ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              loop
              className="h-full w-full"
            >
              {doctors.map((doctor, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-full w-full">
                    <Image
                      src={doctor.image}
                      alt={`Professional Doctor Slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Overlay for better mobile pagination visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={doctors[0].image}
                alt="Professional Doctor Slide 1"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay for better mobile pagination visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}