import Student from "@/models/Student";

export async function rankStudentsByClass(currentClass, session, term) {
  const students = await Student.find({ currentClass });

  const ranked = students
    .map((student) => {
      const result = student.results.find(
        (r) => r.session === session && r.term === term
      );

      return {
        studentId: student.studentId,
        total: result?.totalScore || 0,
      };
    })
    .sort((a, b) => b.total - a.total);

  for (let i = 0; i < ranked.length; i++) {
    await Student.updateOne(
      {
        studentId: ranked[i].studentId,
        "results.session": session,
        "results.term": term,
      },
      {
        $set: {
          "results.$.position": i + 1,
        },
      }
    );
  }

  return ranked;
}