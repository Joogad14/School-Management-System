import TeacherSidebar from "@/components/teacher/TeacherSidebar";

export default function TeacherLayout({ children }) {
  return (
    <div className="min-h-screen">

      {/* SIDEBAR LAYER (fixed already inside component) */}
      <TeacherSidebar />

      {/* MAIN CONTENT OFFSET */}
      <main className="md:ml-72 p-5 bg-[#f5f6fa] min-h-screen">
        {children}
      </main>

    </div>
  );
}
