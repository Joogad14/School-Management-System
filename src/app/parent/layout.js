import ParentSidebar from "@/components/parent/ParentSidebar";

export default function ParentLayout({ children }) {
  return (
    <div className="min-h-screen">

      {/* SIDEBAR LAYER (fixed already inside component) */}
      <ParentSidebar />

      {/* MAIN CONTENT OFFSET */}
      <main className="md:ml-72 p-5 bg-[#f5f6fa] min-h-screen">
        {children}
      </main>

    </div>
  );
}
