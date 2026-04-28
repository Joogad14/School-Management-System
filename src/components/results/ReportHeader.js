export default function ReportHeader({
  school,
  student,
  className,
  session,
  term,
}) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100">

      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">

        {/* LOGO + SCHOOL */}
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            <img
              src={school?.logo || "/logo.png"}
              alt="School Logo"
              className="w-14 h-14 object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold uppercase text-[#0a1f44] tracking-wide">
              {school?.name || "Dynamic Pillars International School"}
            </h1>

            <p className="text-xs md:text-sm text-gray-500">
              {school?.address ||
                "KM 6 Ibadan-Abeokuta Express Way, Apata, Ibadan, Oyo State"}
            </p>
          </div>
        </div>

        {/* REPORT TITLE */}
        <div className="text-right">
          <h2 className="text-lg md:text-xl font-bold text-blue-600">
            Report Card
          </h2>

          <div className="flex gap-2 justify-end mt-1">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs">
              {session}
            </span>
            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs">
              {term}
            </span>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-5 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* STUDENT DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <span className="text-gray-500 text-xs">Student Name</span>
          <p className="font-semibold text-gray-800">
            {student
              ? `${student.firstName} ${student.lastName}`
              : "Loading..."}
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <span className="text-gray-500 text-xs">Student ID</span>
          <p className="font-semibold text-gray-800">
            {student?.studentId || "Loading..."}
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <span className="text-gray-500 text-xs">Class</span>
          <p className="font-semibold text-gray-800">
            {student?.currentClass?.className || "Loading..."}
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <span className="text-gray-500 text-xs">Session</span>
          <p className="font-semibold text-gray-800">
            {session || "Not selected"}
          </p>
        </div>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <span className="text-gray-500 text-xs">Term</span>
          <p className="font-semibold text-gray-800">
            {term || "Not selected"}
          </p>
        </div>

      </div>
    </div>
  );
}