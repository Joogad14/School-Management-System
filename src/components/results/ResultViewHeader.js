export default function ResultViewHeader({
  school,
  student,
  className,
  session,
  term,
  type,
}) {

    const resultTypeLabel =
  type === "CA"
    ? "Continuous Assessment"
    : "Terminal Examination";

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
             {resultTypeLabel}
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
<table className="w-full border border-gray-300 text-xs">
  <tbody>
    <tr>
      <td className="border p-1">
        <b>Name:</b> {student
              ? `${student.firstName} ${student.lastName}`
              : "Loading..."}
      </td>
      <td className="border p-1">
        <b>Student ID:</b> {student?.studentId || "Loading..."}
      </td>
      <td className="border p-1">
        <b>Class:</b> {student?.currentClass?.className || "Loading..."}
      </td>
    </tr>

    <tr>
      <td className="border p-1">
        <b>Session:</b> {session || "Not selected"}
      </td>
      <td className="border p-1">
        <b>Term:</b> {term || "Not selected"}
      </td>

      <td className="border text-green-700 p-1 rounded-lg text-xs">
        <b>{type === "CA" ? "CA Result" : "Exam Result"}</b>
      </td>
    </tr>
  </tbody>
</table>

    </div>
  );
}