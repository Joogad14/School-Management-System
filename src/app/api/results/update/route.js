const student = await Student.findOne({
  studentId,
  "results._id": resultId,
});

const result = student.results.id(resultId);

if (result.isLocked) {
  return Response.json(
    { message: "Result is locked" },
    { status: 403 }
  );
}