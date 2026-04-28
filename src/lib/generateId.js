import { getNextSequence } from "./getNextId";

export function getYearPrefix() {
  return new Date().getFullYear().toString();
}

export async function generateStudentId() {
  const year = getYearPrefix();
  const next = await getNextSequence("student");

  return `DYNAMIC/STU/${year}/${next}`;
}

export async function generateStaffId() {
  const year = getYearPrefix();
  const next = await getNextSequence("staff");

  return `DYNAMIC/STAFF/${year}/${next}`;
}

export async function generateAdminId() {
  const year = getYearPrefix();
  const next = await getNextSequence("admin");

  return `DYNAMIC/ADMIN/${year}/${next}`;
}

export async function generateParentId() {
  const year = getYearPrefix();
  const next = await getNextSequence("parent");

  return `DYNAMIC/PRT/${year}/${next}`;
}