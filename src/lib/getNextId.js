import Counter from "@/models/Counter";

export async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return counter.value.toString().padStart(6, "0");
}