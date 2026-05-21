// components/Navbar.jsx

"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileMenu(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-blue-600">
          DocAppoint
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`pb-1 text-sm transition-all duration-200 border-b-2 ${
              isActive("/")
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-600 font-medium"
            }`}
          >
            Home
          </Link>

          <Link
            href="/doctors"
            className={`pb-1 text-sm transition-all duration-200 border-b-2 ${
              isActive("/doctors")
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-600 font-medium"
            }`}
          >
            Find Doctors
          </Link>



          <Link
            href="/appointments"
            className={`pb-1 text-sm transition-all duration-200 border-b-2 ${
              isActive("/appointments")
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-600 font-medium"
            }`}
          >
            Appointments
          </Link>
        </div>

        {/* Desktop User Section */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100"></div>
          ) : session ? (
            <div className="dropdown dropdown-end relative">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-blue-500 p-0 overflow-hidden flex items-center justify-center">
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  {session.user.image ? (
                    <img alt="User Avatar" src={session.user.image} className="object-cover h-full w-full" />
                  ) : (
                    <div className="bg-blue-600 text-white flex items-center justify-center font-bold text-base h-full w-full">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content absolute right-0 mt-3 z-50 p-3 shadow-xl bg-white border border-gray-100 rounded-2xl w-52 space-y-1">
                <li className="px-2 py-1.5 border-b border-gray-100">
                  <p className="font-bold text-gray-900 truncate p-0 block text-sm">{session.user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate p-0 block mt-0.5">{session.user.email}</p>
                </li>
                <li>
                  <Link href="/profile" className="rounded-xl px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition mt-1">
                    View Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleSignOut} className="rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 transition text-left w-full block">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                Login
              </Link>

              <Link href="/register" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="flex items-center md:hidden"
        >
          {mobileMenu ? (
            <X size={28} className="text-gray-700" />
          ) : (
            <Menu size={28} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col gap-5 px-6 py-6">
            
            <Link
              onClick={() => setMobileMenu(false)}
              href="/"
              className={`text-sm transition-colors duration-200 ${
                isActive("/")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600 font-medium"
              }`}
            >
              Home
            </Link>

            <Link
              onClick={() => setMobileMenu(false)}
              href="/doctors"
              className={`text-sm transition-colors duration-200 ${
                isActive("/doctors")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600 font-medium"
              }`}
            >
              Find Doctors
            </Link>



            <Link
              onClick={() => setMobileMenu(false)}
              href="/appointments"
              className={`text-sm transition-colors duration-200 ${
                isActive("/appointments")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600 font-medium"
              }`}
            >
              Appointments
            </Link>

            <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
              {isPending ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100"></div>
              ) : session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1 py-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative border border-blue-500">
                      {session.user.image ? (
                        <img alt="User Avatar" src={session.user.image} className="object-cover h-full w-full" />
                      ) : (
                        <div className="bg-blue-600 text-white flex items-center justify-center font-bold text-base h-full w-full">
                          {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">{session.user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-[180px]">{session.user.email}</p>
                    </div>
                  </div>
                  <Link
                    onClick={() => setMobileMenu(false)}
                    href="/profile"
                    className="block w-full text-center rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    onClick={() => setMobileMenu(false)}
                    href="/login"
                    className="w-full text-center rounded-lg border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600"
                  >
                    Login
                  </Link>

                  <Link
                    onClick={() => setMobileMenu(false)}
                    href="/register"
                    className="w-full text-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}