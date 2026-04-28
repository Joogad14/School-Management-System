"use client";

import { useParams } from "next/navigation";
import ResultEditor from "@/components/results/ResultEditor";

export default function Page() {
  const params = useParams();

  const studentId = params.studentId;

  return <ResultEditor studentId={studentId} />;
}