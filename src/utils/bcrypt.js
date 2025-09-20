import bcrypt from "bcryptjs";


export async function hashPassword(password) {
  const saltRounds = 10; // Higher is more secure but slower
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
