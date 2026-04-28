export default function CommentBox({ comments, setComments }) {
  return (
    <div className="bg-white mt-6 rounded-2xl shadow-lg border border-slate-100 overflow-hidden">

      {/* HEADER */}
      <div className="px-5 py-4 border-b bg-slate-50">
        <h3 className="text-base font-semibold text-gray-700">
          Remarks & Comments
        </h3>
      </div>

      <div className="p-5 grid gap-5">

        {/* TEACHER COMMENT */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">
              Class Teacher's Comment
            </label>

            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              Teacher
            </span>
          </div>

          <textarea
            value={comments.teacherComment}
            placeholder="Enter teacher's remark..."
            rows={3}
            onChange={(e) =>
              setComments((c) => ({
                ...c,
                teacherComment: e.target.value,
              }))
            }
            className="w-full mt-2 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none bg-white"
          />
        </div>

        {/* DIRECTOR COMMENT */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">
              Director's Comment
            </label>

            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
              Director
            </span>
          </div>

          <textarea
            value={comments.directorComment}
            placeholder="Enter director's remark..."
            rows={3}
            onChange={(e) =>
              setComments((c) => ({
                ...c,
                directorComment: e.target.value,
              }))
            }
            className="w-full mt-2 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none resize-none bg-white"
          />
        </div>

      </div>
    </div>
  );
}