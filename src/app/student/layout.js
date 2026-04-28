import StudentSidebar from "@/components/student/StudentSidebar";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen">

      {/* SIDEBAR LAYER (fixed already inside component) */}
      <StudentSidebar />

      {/* MAIN CONTENT OFFSET */}
      <main className="md:ml-72 p-5 bg-[#f5f6fa] min-h-screen">
        {children}
      </main>

    </div>
  );
}
