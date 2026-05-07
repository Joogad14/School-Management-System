export default function StudentActivity({ activity, setActivity }) {
  const fields = [
    { key: "punctuality", label: "Punctuality" },
    { key: "obedience", label: "Obedience" },
    { key: "discipline", label: "Discipline" },
    { key: "neatness", label: "Neatness" },
    { key: "relationship", label: "Relationship" },
  ];

  // ✅ Convert array → object for easy UI usage
  const activityMap = Object.fromEntries(
    (activity || []).map((a) => [a.name.toLowerCase(), a.score])
  );

  const getColor = (value) => {
    if (value <= 2) return "bg-red-400";
    if (value === 3) return "bg-blue-400";
    return "bg-green-500";
  };

  const handleChange = (key, label, value) => {
    const updated = [...(activity || [])];

    const index = updated.findIndex(
      (a) => a.name.toLowerCase() === key
    );

    if (index >= 0) {
      updated[index].score = value;
    } else {
      updated.push({ name: label, score: value });
    }

    setActivity(updated);
  };

  return (
    <div className="bg-white mt-6 p-6 rounded-2xl shadow-md border border-slate-100">
      <h3 className="font-semibold mb-4 text-gray-800">
        Student Activity
      </h3>

      <div className="space-y-5">
        {fields.map((f) => {
          const value = activityMap[f.key] || 0;

          return (
            <div key={f.key}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-800">{f.label}</span>
                <span className="font-semibold text-gray-800">
                  {value}
                </span>
              </div>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    onClick={() =>
                      handleChange(f.key, f.label, n)
                    }
                    className={`h-3 flex-1 rounded cursor-pointer transition-all duration-200 ${
                      n <= value
                        ? getColor(value)
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}