import bcryptjs from "bcryptjs";

export default async function hash(password: string) {
  const hashPassword = bcryptjs.hashSync(password);
  return hashPassword;
}

export async function compareHash(hashPassword: string, password: string) {
  const comparePassword = bcryptjs.compare(password, hashPassword);
  return comparePassword;
}
