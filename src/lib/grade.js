export function calculateGrade(score) {
  if (score >= 75) return { grade: "A1", remark: "Excellent" };
  if (score >= 70) return { grade: "B2", remark: "Very Good" };
  if (score >= 65) return { grade: "B3", remark: "Good" };
  if (score >= 60) return { grade: "C4", remark: "Credit" };
  if (score >= 55) return { grade: "C5", remark: "Credit" };
  if (score >= 50) return { grade: "C6", remark: "Credit" };
  if (score >= 45) return { grade: "D7", remark: "Pass" };
  if (score >= 40) return { grade: "E8", remark: "Weak Pass" };
  return { grade: "F9", remark: "Fail" };
}