// app/not-found.jsx

import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist. Navigate back to DocAppoint.",
};

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6">
      <div className="text-center">
        {/* Illustration */}
        <div className="relative mx-auto h-64 w-64 ">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4NFqNrUGdTKS70Zjx91zypfHuncZh3ND1vcb8ZAv6Dhmb7uVAVzqWZciF3eFQ_3IMrrDQuZMlI2cri51wzzU8NryBu86v0XvaCIe8ZbMrNjEf8GsQewFu4UK3fPA-bnYgEgxhJYEZVM8sdcAOrPCgpeBlyWPAobpsrle3zgoVrc5sTmDNDTVMdq6xkncUlS-tua6HzY48m3Apx0sY6amGtiwWspLngEJ6vnYIADJspihxk2ZEyNHkTNwUrljWCHd4YSAD5dOyUQ_k"
            alt="404 Illustration"
            fill
            className="object-contain rounded-full"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-blue-700">
          404 - Oops!
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-md text-base leading-8 text-gray-500">
          The page you are looking for doesn&apos;t exist. It might have been
          moved, or the link might be broken.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full bg-green-700 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-800"
        >
          <Home size={16} />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
