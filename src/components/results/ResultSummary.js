export default function ResultSummary({
  totalScore,
  average,
  attendance,
  setAttendance,
  position,
}) {
  return (
    <div className="bg-white mt-6 p-6 rounded-2xl shadow-md border border-gray-100">
      
      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Total Score</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {totalScore}
          </h2>
        </div>

        {/* AVERAGE */}
        <div className="bg-green-50 p-4 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Average</p>
          <h2 className="text-2xl font-bold text-green-600">
            {average}%
          </h2>
        </div>

        {/* POSITION */}
        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <p className="text-xs text-gray-500 uppercase">Position</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {position || "--"}
          </h2>
        </div>
      </div>

      {/* ATTENDANCE */}
<div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

  <div className="flex items-center justify-between mb-4">
    <p className="font-semibold text-gray-700">
      Attendance
    </p>

    {/* OPTIONAL BADGE */}
    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
      {attendance.daysPresent || 0} / {attendance.daysOpen || 0}
    </span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* DAYS OPEN */}
    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
      <label className="text-xs text-gray-700 uppercase">
        Days Open
      </label>

      <input
        type="number"
        value={attendance.daysOpen}
        onChange={(e) =>
          setAttendance({
            ...attendance,
            daysOpen: Number(e.target.value),
          })
        }
        className="mt-2 w-full text-lg font-semibold 
        border border-blue-200 
        rounded-lg px-3 py-2 
        bg-blue-50 text-blue-800
        focus:bg-blue-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-300
        outline-none transition"
      />
    </div>

    {/* DAYS PRESENT */}
    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
      <label className="text-xs text-gray-700 uppercase">
        Days Present
      </label>

      <input
        type="number"
        value={attendance.daysPresent}
        onChange={(e) =>
          setAttendance({
            ...attendance,
            daysPresent: Number(e.target.value),
          })
        }
        className="mt-2 w-full text-lg font-semibold 
        border border-green-200 
        rounded-lg px-3 py-2 
        bg-green-50 text-green-800
        focus:bg-green-50 focus:border-green-400 focus:ring-2 focus:ring-green-300
        outline-none transition"
      />
    </div>

  </div>
</div>
</div>
  );
}