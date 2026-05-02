export default function ResultTable({
  subjects,
  handleChange,
  type,
  term,
}) {
  const isCA = type === "CA";

  const safe = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  return (
  <div className="bg-white mt-6 rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

    {/* HEADER BAR */}
    <div className="px-5 py-4 border-b bg-slate-50">
      <h2 className="font-semibold text-gray-700">
        Result Statement Decision
      </h2>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">

        {/* HEADER */}
        <thead>
          <tr className="bg-slate-100 text-gray-600 text-xs uppercase tracking-wide">
            <th className="p-3 text-left">Code</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-center">CA1</th>
            <th className="p-3 text-center">CA2</th>

            {/* NORMAL EXAM */}
            {type === "EXAM" && term !== "3rd Term" && (
              <>
                <th className="p-3 text-center">Exam</th>
                <th className="p-3 text-center">Total</th>
              </>
            )}

            {/* 3RD TERM */}
            {type === "EXAM" && term === "3rd Term" && (
              <>
                <th className="p-3 text-center">Exam</th>
                <th className="p-3 text-center">1st Term</th>
                <th className="p-3 text-center">2nd Term</th>
                <th className="p-3 text-center">Average</th>
              </>
            )}

            {/* CA */}
            {type === "CA" && (
              <th className="p-3 text-center">Total</th>
            )}

            <th className="p-3 text-center">Grade</th>
            <th className="p-3 text-center">Position</th>
            <th className="p-3 text-center">Remark</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {subjects.map((s, i) => (
            <tr
              key={i}
              className="border-t hover:bg-slate-50 transition"
            >

              {/* CODE */}
              <td className="p-3">
                <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                  {s.subjectCode}
                </span>
              </td>

              {/* SUBJECT */}
              <td className="p-3 font-medium text-gray-800">
                {s.subjectName}
              </td>

              {/* CA1 */}
              <td className="p-2 text-center">
                <input
                  value={safe(s.ca1)}
                  onChange={(e) =>
                    handleChange(i, "ca1", e.target.value)
                  }
                  className="w-16 text-center border border-gray-300 rounded-md px-2 py-1  bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500   hover:border-blue-400 outline-none transition"
                />
              </td>

              {/* CA2 */}
              <td className="p-2 text-center">
                <input
                  value={safe(s.ca2)}
                  onChange={(e) =>
                    handleChange(i, "ca2", e.target.value)
                  }
                  className="w-16 text-center border border-gray-300 rounded-md px-2 py-1  bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500   hover:border-blue-400 outline-none transition"
                />
              </td>

              {/* NORMAL EXAM */}
              {type === "EXAM" && term !== "3rd Term" && (
                <>
                  <td className="p-2 text-center">
                    <input
                      value={safe(s.exam)}
                      onChange={(e) =>
                        handleChange(i, "exam", e.target.value)
                      }
                      className="w-16 text-center border border-gray-300 rounded-md px-2 py-1  bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500   hover:border-blue-400 outline-none transition"
                    />
                  </td>

                  <td className="p-3 text-center font-semibold text-blue-600">
                    {safe(s.total)}
                  </td>
                </>
              )}

              {/* 3RD TERM */}
              {type === "EXAM" && term === "3rd Term" && (
                <>
                  <td className="p-2 text-center">
                    <input
                      value={safe(s.exam)}
                      onChange={(e) =>
                        handleChange(i, "exam", e.target.value)
                      }
                      className="w-16 text-center border border-gray-300 rounded-md px-2 py-1  bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500   hover:border-blue-400 outline-none transition"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      value={safe(s.firstTermTotal)}
                      onChange={(e) =>
                        handleChange(i, "firstTermTotal", e.target.value)
                      }
                      className="w-16 text-center border border-gray-300 rounded-md px-2 py-1  bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500   hover:border-blue-400 outline-none transition"
                    />
                  </td>

                  <td className="p-2 text-center">
                    <input
                      value={safe(s.secondTermTotal)}
                      onChange={(e) =>
                        handleChange(i, "secondTermTotal", e.target.value)
                      }
                      className="w-16 text-center border border-gray-300 rounded-md px-2 py-1  bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500   hover:border-blue-400 outline-none transition"
                    />
                  </td>

                  <td className="p-3 text-center font-semibold text-blue-600">
                    {safe(s.average)}
                  </td>
                </>
              )}

              {/* CA TOTAL */}
              {type === "CA" && (
                <td className="p-3 text-center font-semibold text-blue-600">
                  {safe(s.total)}
                </td>
              )}

              
               {/* GRADE */}
              <td className="p-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    s.grade === "A"
                      ? "bg-green-100 text-green-700"
                      : s.grade === "B"
                      ? "bg-blue-100 text-blue-700"
                      : s.grade === "C"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {s.grade || "-"}
                </span>
              </td>

              {/* POSITION */}
              <td className="p-3 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  {s.position || "-"}
                </span>
              </td>

              {/* REMARK */}
              <td className="p-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    s.remark === "Excellent"
                      ? "bg-green-100 text-green-700"
                      : s.remark === "Good"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {s.remark || "-"}
                </span>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}