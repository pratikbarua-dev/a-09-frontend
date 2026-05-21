import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  return (
    <section className="bg-[#f5f7fb] px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
      {/* Injecting pure CSS for the crossfade animation. 
        This requires zero client-side JavaScript.
      */}
      <style>{`
        .css-fader { opacity: 0; animation: fade 12s infinite; }
        .css-fader:nth-child(1) { animation-delay: 0s; }
        .css-fader:nth-child(2) { animation-delay: 4s; }
        .css-fader:nth-child(3) { animation-delay: 8s; }
        @keyframes fade {
          0%, 25% { opacity: 1; visibility: visible; }
          33%, 92% { opacity: 0; visibility: hidden; }
          100% { opacity: 1; visibility: visible; }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-[2rem] lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-14 xl:p-16">
          {/* Badge */}
          <div className="mb-4 flex sm:mb-6">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 sm:px-4 sm:py-1.5">
              Trusted Care
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold leading-[1.2] text-gray-900 sm:text-5xl lg:text-5xl xl:text-6xl">
            Your Health,
            <br />
            Our Priority.
            <br />
            <span className="mt-1 block text-blue-700 sm:mt-2">
              Book Top Doctors Instantly.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500 sm:mt-6 sm:text-lg">
            Experience seamless healthcare access. Connect with certified
            specialists, manage appointments, and prioritize your well-being
            with DocAppoint.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href="/doctors"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-green-800 sm:w-auto sm:px-8 sm:py-4 active:scale-[0.98]"
            >
              Find a Doctor
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/doctors"
              className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 px-6 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:px-8 sm:py-4 active:scale-[0.98]"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-gray-100 pt-6 sm:mt-12 sm:gap-x-12 sm:gap-y-6 sm:pt-0 sm:border-0">
            <div className="flex flex-col">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">500+</h3>
              <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">Doctors</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">20k+</h3>
              <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">Patients</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">24/7</h3>
              <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">Support</p>
            </div>
          </div>
        </div>

        {/* Right Content - Pure CSS Fading Images */}
        <div className="relative h-[320px] w-full bg-gray-100 sm:h-[450px] lg:h-auto lg:min-h-[650px]">
          {doctors.map((doctor, index) => (
            <div key={index} className="css-fader absolute inset-0 h-full w-full">
              <Image
                src={doctor.image}
                alt={`Professional Doctor ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}