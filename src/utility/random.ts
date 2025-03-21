import crypto from "crypto";

export async function generateRandom(bytes: number) {
  const n = await crypto.randomBytes(bytes).toString("hex");
  return n;
}
