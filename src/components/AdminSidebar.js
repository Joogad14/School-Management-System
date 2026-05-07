"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import NextImage from "next/image";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/admin/dashboard" },
    { name: "Profile", path: "/admin/profile" },
    { name: "Session & Term", path: "/admin/session-term" },
    { name: "Tuition Receipt", path: "/admin/tuition" },
    { name: "Results", path: "/admin/results" },
    { name: "View Results", path: "/admin/view-results" },
    { name: "Subjects", path: "/admin/subjects" },
    { name: "Promotion", path: "/admin/promotion" },
    { name: "Staff", path: "/admin/staff" },
    { name: "Students", path: "/admin/students" },
    { name: "Parents", path: "/admin/parents" },
    { name: "Admins", path: "/admin/admins" },
    { name: "Classes", path: "/admin/classes" },
  ];

  const SidebarContent = () => (
    <div className="w-72 h-screen bg-[#08142b] text-white flex flex-col shadow-2xl overflow-hidden">

      {/* LOGO SECTION */}
      <div className="bg-white p-5 flex flex-col items-center border-b shrink-0">
        <NextImage
          src="/logo.png"
          alt="School Logo"
          width={105}
          height={105}
          priority
          loading="eager"
          className="object-contain w-[95px] h-auto"
        />

        <h1 className="text-sm font-bold text-[#08142b] mt-2 text-center">
          Dynamic Pillars International School
        </h1>

        <p className="text-[11px] text-gray-600">
          Admin Panel
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col px-4 mt-4 space-y-2 flex-1 min-h-0 overflow-y-auto">

        {navItems.map((item, index) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={index}
              onClick={() => {
                router.push(item.path);
                setOpen(false);
              }}
              className={`
                text-left px-4 py-3 rounded-lg font-medium
                transition-all duration-200 cursor-pointer relative

                ${
                  isActive
                    ? "bg-yellow-500/20 text-yellow-300 border-l-4 border-red-500 pl-5 shadow-sm"
                    : "text-gray-300"
                }

                hover:bg-yellow-500/15
                hover:text-yellow-300
                hover:border-l-4
                hover:border-red-500
                hover:pl-5
              `}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between bg-[#08142b] text-white px-4 py-3 shadow-md">
        <h2 className="font-bold">Admin Panel</h2>

        <button
          onClick={() => setOpen(true)}
          className="text-2xl cursor-pointer"
        >
          ☰
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block fixed left-0 top-0 z-50">
        <SidebarContent />
      </div>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div className="fixed inset-0 z-50 flex">

          {/* BACKDROP */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          ></div>

          {/* SIDEBAR */}
          <div className="animate-slideIn z-50">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}